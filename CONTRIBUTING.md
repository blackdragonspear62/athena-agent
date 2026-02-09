# Athena Agent - Contribution Guide

Thank you for your interest in contributing to Athena Agent! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Rust 1.70+
- Go 1.21+
- Docker & Docker Compose

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/athena-agent.git
cd athena-agent

# Install Node.js dependencies
npm install

# Setup Python environment
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Build Rust CLI
cd ../cli
cargo build

# Build Go worker
cd ../workers/go
go build
```

## 📁 Project Structure

```
athena-agent/
├── backend/          # Python FastAPI backend
├── frontend/         # React TypeScript frontend
├── cli/              # Rust CLI tool
├── workers/go/       # Go worker service
├── packages/         # Shared packages
├── skills/           # Skill templates
├── docker/           # Docker configurations
├── scripts/          # Build scripts
└── docs/             # Documentation
```

## 🔧 Development Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Test additions

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new skill search API
fix: resolve agent timeout issue
docs: update API documentation
refactor: improve skill registry performance
test: add unit tests for agent orchestrator
```

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit a PR

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest --cov=src
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### CLI Tests
```bash
cd cli
cargo test
```

### Go Worker Tests
```bash
cd workers/go
go test ./...
```

## 📝 Code Style

### Python
- Follow PEP 8
- Use Black for formatting
- Use Ruff for linting

### TypeScript/JavaScript
- Use ESLint and Prettier
- Follow React best practices

### Rust
- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting

### Go
- Use `gofmt` for formatting
- Follow Go best practices

## 🐛 Reporting Issues

When reporting issues, please include:

1. Clear description of the issue
2. Steps to reproduce
3. Expected vs actual behavior
4. Environment details
5. Relevant logs or screenshots

## 💡 Feature Requests

We welcome feature requests! Please:

1. Check existing issues first
2. Clearly describe the feature
3. Explain the use case
4. Consider implementation details

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions make Athena Agent better for everyone!
