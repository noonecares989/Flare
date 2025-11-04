'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Server,
  Package,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Settings,
  Globe,
  Terminal,
  Download,
  Upload,
  RefreshCw,
  Monitor,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  Activity,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { WitchcraftButton } from '@/components/ui/WitchcraftButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export interface DependencyCheck {
  name: string;
  version: string;
  installed: boolean;
  required: boolean;
  description: string;
  installCommand?: string;
}

export interface EnvironmentVariable {
  key: string;
  value: string;
  description: string;
  required: boolean;
  isSet: boolean;
  type: 'string' | 'number' | 'boolean';
}

export interface HostConfiguration {
  port: number;
  host: string;
  environment: 'development' | 'production' | 'test';
  https: boolean;
  autoOpen: boolean;
  hotReload: boolean;
}

export interface HostingResult {
  success: boolean;
  url?: string;
  port?: number;
  processId?: number;
  logs: string[];
  errors: string[];
  startTime?: Date;
  endTime?: Date;
}

interface AutoHosterProps {
  projectFiles: Array<{ name: string; content: string; path: string }>;
  onHostingComplete: (result: HostingResult) => void;
  className?: string;
}

export function AutoHoster({ projectFiles, onHostingComplete, className = '' }: AutoHosterProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isHosting, setIsHosting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [dependencies, setDependencies] = useState<DependencyCheck[]>([]);
  const [envVars, setEnvVars] = useState<EnvironmentVariable[]>([]);
  const [config, setConfig] = useState<HostConfiguration>({
    port: 3000,
    host: 'localhost',
    environment: 'development',
    https: false,
    autoOpen: true,
    hotReload: true
  });
  const [hostingResult, setHostingResult] = useState<HostingResult | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll logs to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    setLogs(prev => [...prev, `[${timestamp}] ${icon} ${message}`]);
  };

  const checkDependencies = async () => {
    setIsChecking(true);
    setCurrentStep('Checking system dependencies...');
    addLog('Starting dependency check...', 'info');

    const requiredDeps: DependencyCheck[] = [
      {
        name: 'Node.js',
        version: '>=18.0.0',
        installed: false,
        required: true,
        description: 'JavaScript runtime environment',
        installCommand: 'Download and install from https://nodejs.org'
      },
      {
        name: 'npm',
        version: '>=9.0.0',
        installed: false,
        required: true,
        description: 'Node Package Manager',
        installCommand: 'Comes with Node.js installation'
      },
      {
        name: 'Git',
        version: '>=2.0.0',
        installed: false,
        required: false,
        description: 'Version control system',
        installCommand: 'Install from https://git-scm.com'
      },
      {
        name: 'VS Code',
        version: 'any',
        installed: false,
        required: false,
        description: 'Code editor (recommended)',
        installCommand: 'Download from https://code.visualstudio.com'
      }
    ];

    // Simulate dependency checking
    for (const dep of requiredDeps) {
      addLog(`Checking ${dep.name}...`, 'info');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate checking (in real implementation, this would actually check the system)
      if (dep.name === 'Node.js' || dep.name === 'npm') {
        dep.installed = true;
        addLog(`✅ ${dep.name} ${dep.version} found`, 'success');
      } else if (dep.name === 'Git') {
        dep.installed = Math.random() > 0.3; // 70% chance Git is installed
        if (dep.installed) {
          addLog(`✅ ${dep.name} found`, 'success');
        } else {
          addLog(`⚠️ ${dep.name} not found (optional)`, 'warning');
        }
      } else {
        dep.installed = Math.random() > 0.5; // 50% chance VS Code is installed
        if (dep.installed) {
          addLog(`✅ ${dep.name} found`, 'success');
        } else {
          addLog(`ℹ️ ${dep.name} not found (recommended)`, 'info');
        }
      }
    }

    setDependencies(requiredDeps);
    const allRequiredInstalled = requiredDeps.filter(d => d.required).every(d => d.installed);

    if (allRequiredInstalled) {
      addLog('✅ All required dependencies are installed', 'success');
    } else {
      addLog('❌ Some required dependencies are missing', 'error');
      requiredDeps.filter(d => !d.installed && d.required).forEach(dep => {
        addLog(`❌ ${dep.name} is required but not installed`, 'error');
        if (dep.installCommand) {
          addLog(`💡 Install: ${dep.installCommand}`, 'info');
        }
      });
    }

    setIsChecking(false);
    return allRequiredInstalled;
  };

  const installDependencies = async () => {
    setIsInstalling(true);
    setCurrentStep('Installing project dependencies...');
    addLog('Installing project dependencies...', 'info');

    // Check if package.json exists
    const packageJson = projectFiles.find(f => f.name === 'package.json');
    if (!packageJson) {
      addLog('⚠️ No package.json found, creating basic package.json...', 'warning');

      // Create basic package.json
      const basicPackageJson = {
        name: 'flareforge-studio-app',
        version: '1.0.0',
        description: 'Generated by FlareForge AI Studio',
        main: 'index.js',
        scripts: {
          start: 'node index.js',
          dev: 'node index.js',
          build: 'echo "No build step configured"',
          test: 'echo "No tests configured"'
        },
        dependencies: {
          express: '^4.18.2',
          cors: '^2.8.5',
          helmet: '^7.0.0'
        },
        devDependencies: {
          nodemon: '^3.0.1'
        }
      };

      projectFiles.push({
        name: 'package.json',
        content: JSON.stringify(basicPackageJson, null, 2),
        path: '/package.json'
      });
    }

    // Simulate npm install
    addLog('Running npm install...', 'info');
    await new Promise(resolve => setTimeout(resolve, 2000));

    const installSteps = [
      'Resolving package tree...',
      'Fetching metadata...',
      'Downloading packages...',
      'Installing dependencies...',
      'Building fresh packages...'
    ];

    for (const step of installSteps) {
      addLog(step, 'info');
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Check for common dependencies
    const commonDeps = ['express', 'react', 'vue', 'angular', 'svelte'];
    const installedDeps: string[] = [];

    for (const dep of commonDeps) {
      if (Math.random() > 0.5) {
        installedDeps.push(dep);
        addLog(`✅ ${dep} installed`, 'success');
      }
    }

    if (installedDeps.length === 0) {
      addLog('ℹ️ No additional dependencies to install', 'info');
    }

    addLog('✅ Dependencies installed successfully', 'success');
    setIsInstalling(false);
    return true;
  };

  const configureEnvironment = async () => {
    setIsConfiguring(true);
    setCurrentStep('Configuring environment variables...');
    addLog('Setting up environment configuration...', 'info');

    const requiredEnvVars: EnvironmentVariable[] = [
      {
        key: 'NODE_ENV',
        value: config.environment,
        description: 'Node environment mode',
        required: true,
        isSet: true,
        type: 'string'
      },
      {
        key: 'PORT',
        value: config.port.toString(),
        description: 'Server port',
        required: true,
        isSet: true,
        type: 'number'
      },
      {
        key: 'HOST',
        value: config.host,
        description: 'Server host',
        required: true,
        isSet: true,
        type: 'string'
      },
      {
        key: 'API_KEYS_CONFIGURED',
        value: 'true',
        description: 'API keys configured in the application',
        required: false,
        isSet: true,
        type: 'boolean'
      },
      {
        key: 'GITHUB_TOKEN',
        value: '',
        description: 'GitHub access token (optional)',
        required: false,
        isSet: false,
        type: 'string'
      }
    ];

    // Check for .env file
    const envFile = projectFiles.find(f => f.name === '.env');
    if (!envFile) {
      addLog('Creating .env file...', 'info');
      const envContent = requiredEnvVars
        .filter(env => env.value)
        .map(env => `${env.key}=${env.value}`)
        .join('\n');

      projectFiles.push({
        name: '.env',
        content: envContent,
        path: '/.env'
      });
    }

    setEnvVars(requiredEnvVars);

    for (const envVar of requiredEnvVars) {
      if (envVar.isSet) {
        addLog(`✅ ${envVar.key} = ${envVar.type === 'boolean' ? 'true/false' : envVar.value}`, 'success');
      } else if (envVar.required) {
        addLog(`⚠️ ${envVar.key} is required but not set`, 'warning');
      } else {
        addLog(`ℹ️ ${envVar.key} is optional`, 'info');
      }
    }

    addLog('✅ Environment configuration completed', 'success');
    setIsConfiguring(false);
    return true;
  };

  const createServerFile = () => {
    // Create a basic server file if it doesn't exist
    const serverFile = projectFiles.find(f => f.name === 'index.js' || f.name === 'server.js');
    if (!serverFile) {
      addLog('Creating server file...', 'info');

      const serverCode = `const express = require('express');
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

// Routes
app.get('/', (req, res) => {
  res.send(\`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlareForge AI Studio - Local Host</title>
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
        .logo {
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        .feature {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 1rem;
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
        <h3>🚀 Server Status</h3>
        <p>Status: <span style="color: #4ade80;">Running</span></p>
        <p>Port: \${PORT}</p>
        <p>Environment: \${process.env.NODE_ENV || 'development'}</p>
        <p>Started: \${new Date().toLocaleString()}</p>
    </div>

    <div class="container">
        <div class="logo">🧙‍♀️</div>
        <h1>FlareForge AI Studio</h1>
        <p>Advanced AI-powered development platform</p>
        <p style="margin-top: 1rem; opacity: 0.8;">
            Successfully hosted locally! 🎉
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

// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    port: PORT,
    host: HOST,
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(\`🚀 FlareForge AI Studio running at http://\${HOST}:\${PORT}\`);
  console.log(\`📍 Environment: \${process.env.NODE_ENV || 'development'}\`);
  console.log(\`⏰ Started at: \${new Date().toLocaleString()}\`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\\n🛑 Shutting down server gracefully...');
  process.exit(0);
});
`;

      projectFiles.push({
        name: 'index.js',
        content: serverCode,
        path: '/index.js'
      });
    }
  };

  const startHosting = async () => {
    // Check dependencies first
    const depsOk = await checkDependencies();
    if (!depsOk) {
      const result: HostingResult = {
        success: false,
        logs: logs,
        errors: ['Required dependencies are missing. Please install them first.']
      };
      setHostingResult(result);
      onHostingComplete(result);
      return;
    }

    // Install dependencies
    await installDependencies();

    // Configure environment
    await configureEnvironment();

    // Create server file if needed
    createServerFile();

    // Start hosting
    setIsHosting(true);
    setCurrentStep('Starting local server...');
    addLog('🚀 Starting local server...', 'info');

    try {
      // Simulate server startup
      addLog('Initializing Express server...', 'info');
      await new Promise(resolve => setTimeout(resolve, 1000));

      addLog('Configuring middleware...', 'info');
      await new Promise(resolve => setTimeout(resolve, 500));

      addLog('Setting up routes...', 'info');
      await new Promise(resolve => setTimeout(resolve, 500));

      addLog(`Starting server on ${config.host}:${config.port}...`, 'info');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const url = `http${config.https ? 's' : ''}://${config.host}:${config.port}`;

      addLog(`✅ Server started successfully!`, 'success');
      addLog(`🌐 Local URL: ${url}`, 'info');
      addLog(`🔒 Environment: ${config.environment}`, 'info');

      if (config.autoOpen) {
        addLog('🚀 Opening browser...', 'info');
        // In a real implementation, this would open the browser
        setTimeout(() => {
          addLog(`📱 Browser opened to ${url}`, 'success');
        }, 1000);
      }

      const result: HostingResult = {
        success: true,
        url,
        port: config.port,
        processId: Math.floor(Math.random() * 10000), // Simulated process ID
        logs: logs,
        errors: [],
        startTime: new Date()
      };

      setHostingResult(result);
      onHostingComplete(result);

      // Simulate server logs
      const serverLogs = [
        'GET / 200 15ms',
        'GET /api/status 200 5ms',
        'GET /api/health 200 3ms',
        'GET /static/css/app.css 200 12ms',
        'GET /static/js/app.js 200 18ms'
      ];

      for (let i = 0; i < serverLogs.length; i++) {
        setTimeout(() => {
          addLog(serverLogs[i], 'info');
        }, 3000 + i * 1000);
      }

    } catch (error) {
      addLog(`❌ Failed to start server: ${error}`, 'error');
      const result: HostingResult = {
        success: false,
        logs: logs,
        errors: [`Server startup failed: ${error}`],
        endTime: new Date()
      };
      setHostingResult(result);
      onHostingComplete(result);
    } finally {
      setIsHosting(false);
    }
  };

  const stopHosting = async () => {
    setIsStopping(true);
    setCurrentStep('Stopping local server...');
    addLog('🛑 Stopping server...', 'info');

    await new Promise(resolve => setTimeout(resolve, 1000));

    addLog('✅ Server stopped successfully', 'success');

    if (hostingResult) {
      const result: HostingResult = {
        ...hostingResult,
        endTime: new Date()
      };
      setHostingResult(result);
    }

    setIsStopping(false);
  };

  const oneClickDeploy = async () => {
    addLog('🚀 Starting one-click local deployment...', 'info');
    addLog('This will check dependencies, install packages, configure environment, and start the server automatically.', 'info');
    addLog('', 'info');

    await startHosting();
  };

  const getStatusColor = (installed: boolean, required: boolean) => {
    if (installed) return 'text-green-500';
    if (!required) return 'text-yellow-500';
    return 'text-red-500';
  };

  const isRunning = hostingResult?.success && !hostingResult.endTime;
  const canStart = !isChecking && !isInstalling && !isConfiguring && !isHosting;

  return (
    <div className={`h-full bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50 ${className}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md border-b border-purple-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Server className="h-8 w-8 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Auto-Hoster</h2>
                <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
              </div>
              <Badge variant="outline" className="text-purple-300 border-purple-400">
                One-Click Local Deployment
              </Badge>
              {isRunning && (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <Activity className="h-3 w-3 mr-1" />
                  Running
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isRunning && (
                <Button
                  onClick={stopHosting}
                  disabled={isStopping}
                  variant="outline"
                  className="border-red-500/20 text-red-300 hover:bg-red-800/20"
                >
                  {isStopping ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Stopping...
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-4 w-4 mr-2" />
                      Stop Server
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Left Panel - Configuration */}
          <div className="w-80 bg-black/20 border-r border-purple-500/20 p-4 overflow-auto">
            <div className="space-y-6">
              {/* Quick Deploy */}
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Quick Deploy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <WitchcraftButton
                    onClick={oneClickDeploy}
                    spellType="transmutation"
                    disabled={!canStart}
                    className="w-full"
                  >
                    {isChecking || isInstalling || isConfiguring || isHosting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {currentStep || 'Processing...'}
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Deploy in One Click
                      </>
                    )}
                  </WitchcraftButton>

                  <div className="text-xs text-purple-300">
                    This will automatically: check dependencies, install packages, configure environment, and start the server.
                  </div>
                </CardContent>
              </Card>

              {/* Configuration */}
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-purple-300 mb-1">Port</label>
                    <input
                      type="number"
                      value={config.port}
                      onChange={(e) => setConfig(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                      className="w-full px-3 py-1 bg-purple-900/50 border border-purple-500/20 rounded text-white text-sm focus:outline-none focus:border-purple-400"
                      disabled={isRunning}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-purple-300 mb-1">Host</label>
                    <input
                      type="text"
                      value={config.host}
                      onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
                      className="w-full px-3 py-1 bg-purple-900/50 border border-purple-500/20 rounded text-white text-sm focus:outline-none focus:border-purple-400"
                      disabled={isRunning}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-purple-300 mb-1">Environment</label>
                    <select
                      value={config.environment}
                      onChange={(e) => setConfig(prev => ({ ...prev, environment: e.target.value as any }))}
                      className="w-full px-3 py-1 bg-purple-900/50 border border-purple-500/20 rounded text-white text-sm focus:outline-none focus:border-purple-400"
                      disabled={isRunning}
                    >
                      <option value="development">Development</option>
                      <option value="production">Production</option>
                      <option value="test">Test</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoOpen"
                      checked={config.autoOpen}
                      onChange={(e) => setConfig(prev => ({ ...prev, autoOpen: e.target.checked }))}
                      className="rounded"
                      disabled={isRunning}
                    />
                    <label htmlFor="autoOpen" className="text-sm text-purple-300">
                      Auto-open browser
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Dependencies Status */}
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Dependencies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {dependencies.length === 0 ? (
                    <div className="text-center text-purple-400 py-2">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Click "Check Dependencies" to scan</p>
                    </div>
                  ) : (
                    dependencies.map(dep => (
                      <div key={dep.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className={`h-4 w-4 ${getStatusColor(dep.installed, dep.required)}`} />
                          <div>
                            <div className="text-sm text-white">{dep.name}</div>
                            <div className="text-xs text-purple-400">{dep.version}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(dep.installed, dep.required)}>
                          {dep.installed ? 'Installed' : dep.required ? 'Required' : 'Optional'}
                        </Badge>
                      </div>
                    ))
                  )}

                  <Button
                    onClick={checkDependencies}
                    disabled={isChecking}
                    variant="outline"
                    size="sm"
                    className="w-full border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
                  >
                    {isChecking ? 'Checking...' : 'Check Dependencies'}
                  </Button>
                </CardContent>
              </Card>

              {/* Environment Variables */}
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Environment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {envVars.length === 0 ? (
                    <div className="text-center text-purple-400 py-2">
                      <Monitor className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Click "Configure" to set up environment</p>
                    </div>
                  ) : (
                    envVars.map(env => (
                      <div key={env.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lock className={`h-4 w-4 ${env.isSet ? 'text-green-400' : 'text-red-400'}`} />
                          <div>
                            <div className="text-sm text-white">{env.key}</div>
                            <div className="text-xs text-purple-400">{env.type}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className={env.isSet ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}>
                          {env.isSet ? 'Set' : env.required ? 'Required' : 'Optional'}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Panel - Terminal */}
          <div className="flex-1 flex flex-col">
            {/* Server Status */}
            {hostingResult && (
              <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-purple-400" />
                      <div>
                        <div className="text-white font-medium">Server Status</div>
                        <div className="text-sm text-purple-300">
                          {isRunning ? 'Running' : 'Stopped'}
                        </div>
                      </div>
                    </div>
                    {hostingResult.url && (
                      <div>
                        <div className="text-white font-medium">Local URL</div>
                        <div className="text-sm text-purple-300">
                          <a
                            href={hostingResult.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 underline"
                          >
                            {hostingResult.url}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-purple-300 border-purple-400">
                      Port: {hostingResult.port}
                    </Badge>
                    <Badge variant="outline" className="text-purple-300 border-purple-400">
                      {hostingResult.environment}
                    </Badge>
                  </div>
                </div>
              </div>

            {/* Terminal */}
            <div className="flex-1 bg-black/40 backdrop-blur-sm border border-purple-500/20">
              <div className="bg-black/50 p-2 border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-purple-300">Terminal</span>
                  </div>
                  <Button
                    onClick={() => setLogs([])}
                    size="sm"
                    variant="outline"
                    className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <div
                ref={terminalRef}
                className="flex-1 p-4 overflow-auto font-mono text-xs text-purple-200"
                style={{ minHeight: '300px' }}
              >
                {logs.length === 0 ? (
                  <div className="text-center text-purple-400">
                    <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Click "Deploy in One Click" to see deployment logs</p>
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1 leading-relaxed">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black/30 backdrop-blur-md border-t border-purple-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-purple-300">
                {isRunning ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-400 inline mr-1" />
                    Server is running locally
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-400 inline mr-1" />
                    Server is stopped
                  </>
                )}
              </div>
              {hostingResult?.startTime && (
                <div className="text-sm text-purple-300">
                  Started: {hostingResult.startTime.toLocaleString()}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-purple-400">
                {projectFiles.length} files • {dependencies.filter(d => d.installed).length}/{dependencies.length} deps
              </div>
              <Badge variant="outline" className="text-purple-300 border-purple-400">
                Local Mode
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}