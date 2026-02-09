// Package main provides the Athena Worker service
// This worker handles async task processing for the Athena Agent platform
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/google/uuid"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// Task represents a task to be processed
type Task struct {
	ID        string                 `json:"id"`
	AgentID   string                 `json:"agent_id"`
	Type      string                 `json:"type"`
	Input     string                 `json:"input"`
	Config    map[string]interface{} `json:"config"`
	Priority  int                    `json:"priority"`
	CreatedAt time.Time              `json:"created_at"`
}

// TaskResult represents the result of a processed task
type TaskResult struct {
	TaskID      string    `json:"task_id"`
	Status      string    `json:"status"`
	Output      string    `json:"output"`
	Error       string    `json:"error,omitempty"`
	ProcessedAt time.Time `json:"processed_at"`
	Duration    int64     `json:"duration_ms"`
}

// Worker handles task processing
type Worker struct {
	ID       string
	logger   zerolog.Logger
	shutdown chan struct{}
}

// NewWorker creates a new worker instance
func NewWorker() *Worker {
	return &Worker{
		ID:       uuid.New().String()[:8],
		logger:   log.With().Str("worker_id", uuid.New().String()[:8]).Logger(),
		shutdown: make(chan struct{}),
	}
}

// Start begins the worker's main loop
func (w *Worker) Start(ctx context.Context) error {
	w.logger.Info().Msg("Starting Athena Worker")

	// Simulate processing loop
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			w.logger.Info().Msg("Context cancelled, shutting down")
			return ctx.Err()
		case <-w.shutdown:
			w.logger.Info().Msg("Shutdown signal received")
			return nil
		case <-ticker.C:
			w.logger.Debug().Msg("Worker heartbeat")
		}
	}
}

// ProcessTask handles a single task
func (w *Worker) ProcessTask(task *Task) (*TaskResult, error) {
	start := time.Now()
	w.logger.Info().
		Str("task_id", task.ID).
		Str("agent_id", task.AgentID).
		Str("type", task.Type).
		Msg("Processing task")

	// Simulate task processing
	time.Sleep(100 * time.Millisecond)

	result := &TaskResult{
		TaskID:      task.ID,
		Status:      "completed",
		Output:      fmt.Sprintf("Task %s processed successfully by agent %s", task.ID, task.AgentID),
		ProcessedAt: time.Now(),
		Duration:    time.Since(start).Milliseconds(),
	}

	w.logger.Info().
		Str("task_id", task.ID).
		Int64("duration_ms", result.Duration).
		Msg("Task completed")

	return result, nil
}

// Shutdown gracefully stops the worker
func (w *Worker) Shutdown() {
	w.logger.Info().Msg("Initiating graceful shutdown")
	close(w.shutdown)
}

func main() {
	// Setup logging
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})

	// Print banner
	fmt.Println("\n" + `
    ╔═══════════════════════════════════════════╗
    ║                                           ║
    ║   🏛️  ATHENA WORKER                       ║
    ║   Task Processing Service (Go)            ║
    ║                                           ║
    ╚═══════════════════════════════════════════╝
	`)

	// Create worker
	worker := NewWorker()

	// Setup context with cancellation
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Handle shutdown signals
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		sig := <-sigChan
		log.Info().Str("signal", sig.String()).Msg("Received shutdown signal")
		worker.Shutdown()
		cancel()
	}()

	// Start worker
	log.Info().Msg("Athena Worker v2.0.0 starting...")
	if err := worker.Start(ctx); err != nil && err != context.Canceled {
		log.Fatal().Err(err).Msg("Worker failed")
	}

	log.Info().Msg("Worker shutdown complete")
}

// SerializeTask converts a task to JSON
func SerializeTask(task *Task) ([]byte, error) {
	return json.Marshal(task)
}

// DeserializeTask converts JSON to a task
func DeserializeTask(data []byte) (*Task, error) {
	var task Task
	err := json.Unmarshal(data, &task)
	return &task, err
}
