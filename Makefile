# Clean Architecture API - Makefile
# Comandos úteis para desenvolvimento

.PHONY: help install dev build test lint format clean docker-up docker-down commit release

# Default target
help: ## Show this help message
	@echo "Clean Architecture API - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development
install: ## Install dependencies
	npm install

dev: ## Start development server
	npm run start:dev

build: ## Build the application
	npm run build

# Testing
test: ## Run all tests
	npm test

test-watch: ## Run tests in watch mode
	npm run test:watch

test-ui: ## Open test UI
	npm run test:ui

test-cov: ## Run tests with coverage
	npm run test:cov

# Code Quality
lint: ## Run linter
	npm run lint

lint-check: ## Check linting without fixing
	npm run lint:check

format: ## Format code with Prettier
	npm run format

validate: ## Run full validation (lint + test + build)
	npm run validate

# Git & Commits
commit: ## Interactive commit with Commitizen
	npm run commit

pre-commit: ## Run pre-commit checks manually
	npm run pre-commit

# Releases
release: ## Create a new release
	npm run release

release-minor: ## Create a minor release
	npm run release:minor

release-major: ## Create a major release
	npm run release:major

release-patch: ## Create a patch release
	npm run release:patch

# Docker
docker-build: ## Build Docker image
	npm run docker:build

docker-up: ## Start Docker containers
	npm run docker:up

docker-up-dev: ## Start Docker containers for development
	npm run docker:up:dev

docker-down: ## Stop Docker containers
	npm run docker:down

docker-logs: ## Show Docker logs
	npm run docker:logs

docker-clean: ## Clean Docker system
	npm run docker:clean

docker-rebuild: ## Rebuild Docker containers
	npm run docker:rebuild

# Utilities
clean: ## Clean build artifacts and node_modules
	rm -rf dist/
	rm -rf node_modules/
	rm -rf coverage/
	rm -rf logs/
	npm cache clean --force

setup: ## Full project setup (install + build + test)
	make install
	make build
	make test

health: ## Check application health
	curl -s http://localhost:3000/monitoring/health | jq

info: ## Show application info
	curl -s http://localhost:3000/monitoring/info | jq

metrics: ## Show application metrics
	curl -s http://localhost:3000/monitoring/metrics

# Database
db-up: ## Start only database
	docker-compose up -d mongodb

db-down: ## Stop database
	docker-compose stop mongodb

db-logs: ## Show database logs
	docker-compose logs -f mongodb

# Monitoring
logs: ## Show application logs (if running in Docker)
	make docker-logs

logs-dev: ## Show development logs
	npm run docker:logs:dev

# Quick commands
quick-start: ## Quick start for development
	@echo "🚀 Starting Clean Architecture API..."
	make docker-up-dev
	@echo "✅ API started at http://localhost:3000"
	@echo "📚 Documentation: http://localhost:3000/docs"
	@echo "🏥 Health: http://localhost:3000/monitoring/health"

quick-test: ## Quick test run
	@echo "🧪 Running tests..."
	make test
	@echo "✅ All tests passed!"

quick-check: ## Quick quality check
	@echo "🔍 Running quality checks..."
	make validate
	@echo "✅ All checks passed!"
