#!/bin/bash

# PCR Project Tracker Docker Manager
# This script helps you manage the Docker environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  PCR Project Tracker Manager${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop first."
        exit 1
    fi
    print_status "Docker is running"
}

# Function to start development environment
start_dev() {
    print_status "Starting development environment..."
    docker-compose -f docker-compose.dev.yml up -d
    print_status "Development environment started!"
    print_status "Access the application at: http://localhost:3000"
    print_status "Mail UI at: http://localhost:8025"
    print_status "Database at: localhost:5432"
}

# Function to start production environment
start_prod() {
    print_status "Starting production environment..."
    docker-compose up -d
    print_status "Production environment started!"
    print_status "Access the application at: http://localhost:3000"
}

# Function to stop all containers
stop_all() {
    print_status "Stopping all containers..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose down
    print_status "All containers stopped!"
}

# Function to view logs
view_logs() {
    print_status "Showing logs (Press Ctrl+C to exit)..."
    docker-compose -f docker-compose.dev.yml logs -f
}

# Function to rebuild containers
rebuild() {
    print_status "Rebuilding containers..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up -d --build
    print_status "Containers rebuilt and started!"
}

# Function to clean up
cleanup() {
    print_warning "This will remove all containers, networks, and volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up..."
        docker-compose -f docker-compose.dev.yml down -v
        docker-compose down -v
        docker system prune -f
        print_status "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show status
show_status() {
    print_status "Container status:"
    docker-compose -f docker-compose.dev.yml ps
    echo
    print_status "Access URLs:"
    echo "  Application: http://localhost:3000"
    echo "  Mail UI: http://localhost:8025"
    echo "  Database: localhost:5432"
}

# Function to show help
show_help() {
    print_header
    echo "Usage: $0 [COMMAND]"
    echo
    echo "Commands:"
    echo "  start-dev    Start development environment"
    echo "  start-prod   Start production environment"
    echo "  stop         Stop all containers"
    echo "  logs         View container logs"
    echo "  rebuild      Rebuild and restart containers"
    echo "  status       Show container status"
    echo "  cleanup      Remove all containers and data"
    echo "  help         Show this help message"
    echo
    echo "Examples:"
    echo "  $0 start-dev    # Start development environment"
    echo "  $0 logs         # View logs"
    echo "  $0 stop         # Stop all containers"
}

# Main script logic
main() {
    check_docker
    
    case "${1:-help}" in
        "start-dev")
            start_dev
            ;;
        "start-prod")
            start_prod
            ;;
        "stop")
            stop_all
            ;;
        "logs")
            view_logs
            ;;
        "rebuild")
            rebuild
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
