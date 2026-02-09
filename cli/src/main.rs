//! Athena CLI - Command Line Interface for Athena Agent
//! 
//! Intelligent Multi-Agent Orchestration Platform CLI tool.
//! Manage skills, agents, and execute commands from the terminal.

mod commands;
mod config;
mod api;
mod ui;

use clap::{Parser, Subcommand};
use colored::*;
use anyhow::Result;

/// Athena Agent CLI - Supercharge your AI coding agents
#[derive(Parser)]
#[command(name = "athena")]
#[command(author = "Athena Team")]
#[command(version = "2.0.0")]
#[command(about = "Intelligent Multi-Agent Orchestration Platform", long_about = None)]
#[command(propagate_version = true)]
struct Cli {
    /// Enable verbose output
    #[arg(short, long, global = true)]
    verbose: bool,

    /// API endpoint URL
    #[arg(long, env = "ATHENA_API_URL", default_value = "http://localhost:8000/api")]
    api_url: String,

    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Search for skills in the registry
    Search {
        /// Search query
        query: String,
        /// Filter by category
        #[arg(short, long)]
        category: Option<String>,
        /// Maximum results
        #[arg(short, long, default_value = "10")]
        limit: u32,
    },

    /// Install a skill from the registry
    Install {
        /// Skill slug/ID to install
        skill: String,
        /// Force reinstall
        #[arg(short, long)]
        force: bool,
    },

    /// List installed skills or available agents
    List {
        /// What to list: skills, agents, commands
        #[arg(default_value = "skills")]
        target: String,
    },

    /// Run a skill with given input
    Run {
        /// Skill slug/ID to run
        skill: String,
        /// Input for the skill
        input: Option<String>,
    },

    /// Check system or agent status
    Status {
        /// Agent ID to check (optional)
        agent: Option<String>,
    },

    /// View or modify configuration
    Config {
        /// Configuration key
        key: Option<String>,
        /// Configuration value (for setting)
        value: Option<String>,
    },

    /// Get help for a command or skill
    Help {
        /// Command or skill name
        topic: Option<String>,
    },

    /// Initialize a new skill project
    Init {
        /// Skill name
        name: String,
        /// Template to use
        #[arg(short, long, default_value = "basic")]
        template: String,
    },

    /// Show platform information
    Info,
}

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logging
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::from_default_env()
                .add_directive("athena=info".parse()?)
        )
        .init();

    let cli = Cli::parse();

    // Print banner
    print_banner();

    // Execute command
    match &cli.command {
        Commands::Search { query, category, limit } => {
            commands::search::execute(&cli.api_url, query, category.as_deref(), *limit).await?;
        }
        Commands::Install { skill, force } => {
            commands::install::execute(&cli.api_url, skill, *force).await?;
        }
        Commands::List { target } => {
            commands::list::execute(&cli.api_url, target).await?;
        }
        Commands::Run { skill, input } => {
            commands::run::execute(&cli.api_url, skill, input.as_deref()).await?;
        }
        Commands::Status { agent } => {
            commands::status::execute(&cli.api_url, agent.as_deref()).await?;
        }
        Commands::Config { key, value } => {
            commands::config::execute(key.as_deref(), value.as_deref()).await?;
        }
        Commands::Help { topic } => {
            commands::help::execute(topic.as_deref()).await?;
        }
        Commands::Init { name, template } => {
            commands::init::execute(name, template).await?;
        }
        Commands::Info => {
            commands::info::execute(&cli.api_url).await?;
        }
    }

    Ok(())
}

fn print_banner() {
    println!();
    println!("{}", "╔═══════════════════════════════════════════╗".purple());
    println!("{}", "║                                           ║".purple());
    println!("{}  {}  {}", "║".purple(), "🏛️  ATHENA AGENT".bold().bright_white(), "║".purple());
    println!("{}  {}  {}", "║".purple(), "Intelligent Multi-Agent Orchestration".dimmed(), "║".purple());
    println!("{}", "║                                           ║".purple());
    println!("{}", "╚═══════════════════════════════════════════╝".purple());
    println!();
}
