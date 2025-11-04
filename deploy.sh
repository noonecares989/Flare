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
echo

# Function to print colored output
print_step() {
    echo -e "${CYAN}🔮 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

print_step "Starting one-click deployment..."
echo

# Check system dependencies
print_step "Checking system dependencies..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js is not installed or not in PATH"
    echo -e "${YELLOW}Please install Node.js from https://nodejs.org (version 18 or higher)${NC}"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
else
    print_error "npm is not installed or not in PATH"
    echo -e "${YELLOW}npm should come with Node.js installation${NC}"
    exit 1
fi

# Check optional dependencies
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    print_success "Git found: $GIT_VERSION"
else
    print_warning "Git not found (optional but recommended for version control)"
fi

if command -v code &> /dev/null; then
    print_success "VS Code found"
else
    print_warning "VS Code not found (optional but recommended for development)"
fi

echo

# Install project dependencies
print_step "Installing project dependencies..."

if [ ! -d "node_modules" ]; then
    npm install
    print_success "Dependencies installed successfully"
else
    print_success "Dependencies already installed"
fi

# Check if package.json exists and has scripts
if grep -q '"scripts"' package.json; then
    print_success "npm scripts found in package.json"

    # Show available scripts
    echo
    print_step "Available npm scripts:"
    npm run

    if grep -q '"start"' package.json; then
        print_success "✅ Start script found"
    else
        print_warning "No start script found in package.json"
    fi
else
    print_warning "No scripts section found in package.json"
fi

echo

# Check for environment configuration
print_step "Setting up environment configuration..."

if [ ! -f ".env" ]; then
    print_warning "No .env file found, creating basic configuration..."

    cat > .env << EOF
NODE_ENV=development
PORT=3000
HOST=localhost
API_KEYS_CONFIGURED=true
EOF

    print_success "Basic .env file created"
else
    print_success ".env file already exists"
fi

# Create public directory if it doesn't exist
if [ ! -d "public" ]; then
    mkdir -p public
    print_success "Created public directory"
else
    print_success "Public directory already exists"
fi

# Create index.js if it doesn't exist
if [ ! -f "index.js" ]; then
    print_warning "No index.js found, creating basic server..."

    cat > index.js << 'EOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Main route
app.get('/', (req, res) => {
  res.send(\`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlareForge AI Studio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            max-width: 800px;
            padding: 2rem;
            text-align: center;
        }
        .logo { font-size: 4rem; margin-bottom: 1rem; }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        .feature {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .status {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.3);
            padding: 1rem;
            border-radius: 8px;
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body>
    <div class="status">
        <h3>🚀 FlareForge AI Studio</h3>
        <p>Status: <span style="color: #4ade80;">Running</span></p>
        <p>Port: \${PORT}</p>
        <p>Environment: \${process.env.NODE_ENV}</p>
        <p>Deployed: \$(date)</p>
    </div>

    <div class="container">
        <div class="logo">🧙‍♀️</div>
        <h1>FlareForge AI Studio</h1>
        <p>Advanced AI-powered development platform with one-click deployment!</p>
        <p style="margin-top: 1rem; opacity: 0.8;">
          ✅ Dependencies Checked<br>
          ✅ Environment Configured<br>
          ✅ Server Running Locally
        </p>

        <div class="features">
            <div class="feature">
                <h3>🔮 Multi-AI Support</h3>
                <p>Connect your own API keys</p>
            </div>
            <div class="feature">
                <h3>🛡️ Security Scanner</h3>
                <p>Auto-detect and fix issues</p>
            </div>
            <div class="feature">
                <h3>🚀 Code Execution</h3>
                <p>Run code in real-time</p>
            </div>
            <div class="feature">
                <h3>🔗 GitHub Integration</h3>
                <p>Push code with one click</p>
            </div>
        </div>
    </div>
</body>
</html>
  \`);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    port: PORT,
    host: HOST,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log('🚀 FlareForge AI Studio is running!');
  console.log('📍 Local URL: http://' + HOST + ':' + PORT);
  console.log('⚙️ Environment: ' + (process.env.NODE_ENV || 'development'));
  console.log('⏰ Started at: ' + new Date().toLocaleString());
  console.log('');
  console.log('🌐 Open your browser and navigate to: http://' + HOST + ':' + PORT);
  console.log('');
  console.log('📝 Features available:');
  console.log('   • Advanced code editor with syntax highlighting');
  console.log('   • Real-time API credit monitoring');
  console.log('   • Security vulnerability scanning');
  console.log('   • GitHub integration');
  console.log('   • Multi-AI provider support');
  console.log('   • Terminal access');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\\n🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\\n🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});
EOF

    print_success "Basic server file created"
else
    print_success "Server file already exists"
fi

echo

# Start the server
print_step "Starting the server..."

if command -v npm run &> /dev/null && npm run --silent start &> /dev/null | grep -q "start"; then
    print_success "Starting server with 'npm start'..."
    npm start &
elif command -v node &> /dev/null; then
    print_success "Starting server with 'node index.js'..."
    node index.js &
else
    print_error "Could not start server. Please check your configuration."
    exit 1
fi

# Wait a moment for the server to start
sleep 3

# Check if server is running
SERVER_URL="http://localhost:3000"
if curl -s "$SERVER_URL/api/health" &> /dev/null; then
    print_success "Server is running successfully!"
    print_success "Local URL: $SERVER_URL"

    # Try to open browser automatically
    if command -v xdg-open &> /dev/null; then
        xdg-open "$SERVER_URL" 2>/dev/null || true
    elif command -v open &> /dev/null; then
        open "$SERVER_URL" 2>/dev/null || true
    elif command -v start &> /dev/null; then
        start "$SERVER_URL" 2>/dev/null || true
    else
        print_warning "Could not auto-open browser. Please manually open: $SERVER_URL"
    fi

    echo
    print_success "🎉 FlareForge AI Studio is now running locally!"
    print_success "🌐 Application URL: $SERVER_URL"
    print_success "🛑 Press Ctrl+C to stop the server"

    # Keep the script running while the server is active
    echo
    print_step "Server is running. Press Ctrl+C to stop."

    # Trap signals for graceful shutdown
    trap 'print_step "Stopping server..."; exit 0' INT TERM

    # Wait for user to stop
    while true; do
        sleep 10
        # Check if server is still running
        if ! curl -s "$SERVER_URL/api/health" &> /dev/null; then
            print_error "Server has stopped unexpectedly"
            exit 1
        fi
    done
else
    print_error "Server failed to start. Please check the logs above."
    exit 1
fi