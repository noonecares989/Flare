#!/bin/bash

# FlareForge AI Studio - One-Click Local Deployment Script
# This script automatically checks dependencies, installs packages, and hosts the application locally

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Header
echo -e "${PURPLE}🧙‍♀️ FlareForge AI Studio - One-Click Deployment${NC}"
echo -e "${BLUE}===============================================${NC}"
echo -e "${CYAN}Created by CyberSultan 👑${NC}"
echo
echo

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the FlareForge directory.${NC}"
    exit 1
fi

# Function to print colored status
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[❌]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ]${NC} $1"
}

# Check system requirements
echo -e "${CYAN}🔍 Checking system requirements...${NC}"

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        print_status "Node.js $NODE_VERSION (✓)"
    else
        print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 18 or higher."
        exit 1
    fi
else
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check npm version
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_status "npm $NPM_VERSION (✓)"
else
    print_error "npm is not installed. Please install npm."
    exit 1
fi

# Check available memory
AVAILABLE_MEMORY=$(free -m | awk 'NR==2{printf "%.0f", $7}')
if [ "$AVAILABLE_MEMORY" -lt 2048 ]; then
    print_warning "Low memory detected ($AVAILABLE_MEMORY MB). At least 2GB RAM is recommended."
fi

# Check disk space
AVAILABLE_SPACE=$(df . | tail -1 | awk '{print $4}')
AVAILABLE_SPACE_GB=$((AVAILABLE_SPACE / 1024 / 1024))
if [ "$AVAILABLE_SPACE_GB" -lt 2 ]; then
    print_warning "Low disk space detected ($AVAILABLE_SPACE_GB GB). At least 2GB is recommended."
fi

echo

# Install dependencies
echo -e "${CYAN}📦 Installing dependencies...${NC}"

if [ -d "node_modules" ]; then
    print_info "node_modules directory found, checking for updates..."
    npm update &> /dev/null || print_warning "npm update failed, continuing with existing modules..."
else
    print_info "Installing fresh dependencies..."
    npm install
fi

print_status "Dependencies installed"

echo

# Check environment variables
echo -e "${CYAN}🔧 Checking environment configuration...${NC}"

if [ -f ".env.local" ]; then
    print_status ".env.local file found"

    # Check for critical environment variables
    if grep -q "NEXTAUTH_SECRET=" .env.local && grep -q "your-secret-key" .env.local; then
        print_warning "Default NEXTAUTH_SECRET detected. Please update it with a secure secret."
    fi

    if grep -q "ENCRYPTION_KEY=" .env.local && grep -q "your-32-character" .env.local; then
        print_warning "Default ENCRYPTION_KEY detected. Please update it with a secure 32-character key."
    fi
else
    print_warning ".env.local file not found. Creating from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        print_status "Created .env.local from .env.example"
        print_warning "Please update .env.local with your actual API keys and configuration."
    else
        print_warning "No .env.example file found. Creating basic .env.local..."
        cat > .env.local << EOF
# Database (optional for basic usage)
DATABASE_URL="postgresql://user:password@localhost:5432/flareforge"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"

# AI Providers (Optional - add your API keys here)
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GROK_API_KEY=""
CLOSEROUTER_API_KEY=""

# Encryption for API keys
ENCRYPTION_KEY="your-32-character-encryption-key-here"

# App Configuration
NODE_ENV="development"
EOF
        print_status "Created basic .env.local"
        print_warning "Please update .env.local with your actual configuration."
    fi
fi

echo

# Database setup (optional)
echo -e "${CYAN}🗄️ Database setup (optional)...${NC}"

if command -v npx &> /dev/null && [ -f "prisma/schema.prisma" ]; then
    if [ -f ".env.local" ] && grep -q "DATABASE_URL=" .env.local; then
        DB_URL=$(grep "DATABASE_URL=" .env.local | cut -d'=' -f2)
        if [[ "$DB_URL" != *"localhost"* ]] && [[ "$DB_URL" != *"user:password"* ]]; then
            print_info "Database URL found, running Prisma setup..."
            npx prisma generate &> /dev/null || print_warning "Prisma generate failed, continuing..."
            print_status "Database setup completed"
        else
            print_info "Database URL not configured. Database features will be limited."
        fi
    else
        print_info "No database configuration found. Database features will be limited."
    fi
else
    print_info "Prisma not found. Database features will be limited."
fi

echo

# Run type checking
echo -e "${CYAN}🔍 Running type checks...${NC}"
if npm run typecheck &> /dev/null; then
    print_status "TypeScript compilation passed"
else
    print_warning "TypeScript compilation failed. Check the output above for details."
fi

echo

# Security check
echo -e "${CYAN}🛡️ Security check...${NC}"

# Check for sensitive files
SENSITIVE_FILES=(".env" "api_keys.txt" "secrets.json")
for file in "${SENSITIVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_error "Sensitive file $file found in repository. This should not be committed!"
        print_info "Please ensure this file is added to .gitignore"
    fi
done

# Check .gitignore
if [ -f ".gitignore" ]; then
    print_status ".gitignore file found"
    REQUIRED_GITIGNORE=("node_modules" ".env.local" ".env" "api_keys.txt" "secrets.json")
    for item in "${REQUIRED_GITIGNORE[@]}"; do
        if ! grep -q "^$item$" .gitignore; then
            print_warning "$item should be in .gitignore"
        fi
    done
else
    print_warning ".gitignore file not found. Creating basic .gitignore..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
.next/
out/
dist/
build/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database
*.sqlite
*.db

# API Keys and secrets
api_keys.txt
secrets.json
private.key
*.pem
EOF
    print_status "Created .gitignore file"
fi

echo

# Check available ports
echo -e "${CYAN}🔌 Port check...${NC}"
DEFAULT_PORT=3000

if lsof -Pi :$DEFAULT_PORT -sTCP:LISTEN -t >/dev/null ; then
    print_warning "Port $DEFAULT_PORT is already in use."
    echo -e "${YELLOW}Do you want to try port 3001 instead? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        DEFAULT_PORT=3001
        print_info "Using port $DEFAULT_PORT"
    else
        print_error "Port $DEFAULT_PORT is in use. Please stop the other service or choose a different port."
        exit 1
    fi
else
    print_status "Port $DEFAULT_PORT is available"
fi

echo

# Final preparations
echo -e "${CYAN}🚀 Final preparations...${NC}"

# Create logs directory if it doesn't exist
mkdir -p logs
print_status "Created logs directory"

# Check if this is the first run
if [ ! -f ".first-run-completed" ]; then
    print_info "First-time setup detected."
    print_info "You can configure your API keys in the UI after startup."
    touch .first-run-completed
fi

echo

# Start the development server
echo -e "${GREEN}🎉 Starting FlareForge AI Studio...${NC}"
echo -e "${BLUE}The application will be available at:${NC} ${YELLOW}http://localhost:$DEFAULT_PORT${NC}"
echo -e "${BLUE}Press Ctrl+C to stop the server${NC}"
echo

# Open browser after a short delay
(sleep 3 && echo -e "${CYAN}🌐 Opening browser...${NC}" &&
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:$DEFAULT_PORT"
    elif command -v open &> /dev/null; then
        open "http://localhost:$DEFAULT_PORT"
    elif command -v start &> /dev/null; then
        start "http://localhost:$DEFAULT_PORT"
    else
        print_info "Could not auto-open browser. Please manually open http://localhost:$DEFAULT_PORT"
    fi
) &

# Start the application
if command -v npm &> /dev/null; then
    npm run dev -- --port $DEFAULT_PORT
else
    print_error "npm command not found. Cannot start the application."
    exit 1
fi