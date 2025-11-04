'use client';

import { useState, useEffect } from 'react';
import { WitchcraftButton } from '@/components/ui/WitchcraftButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Code2,
  Terminal,
  Shield,
  Github,
  Activity,
  Zap,
  Settings,
  Eye,
  Bug,
  Play,
  Monitor,
  Moon,
  Sun,
  Sparkles,
  Wand2,
  CrystalBall
} from 'lucide-react';

// Import all our advanced components
import { ApiKeyManager, ApiKey } from '@/components/api/ApiKeyManager';
import { TerminalEmulator, TerminalCommand } from '@/components/execution/TerminalEmulator';
import { CodeExecutor, CodeFile, ExecutionResult } from '@/components/execution/CodeExecutor';
import { BugDetector, CodeIssue } from '@/components/security/BugDetector';
import { GitHubIntegration, GitHubCommit } from '@/components/github/GitHubIntegration';
import { ApiCreditMonitor, CreditAlert } from '@/components/monitoring/ApiCreditMonitor';
import { AdvancedCodeEditor } from '@/components/editor/AdvancedCodeEditor';

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<'editor' | 'terminal' | 'security' | 'github' | 'api' | 'monitor'>('editor');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userId] = useState('demo-user-' + Date.now());
  const [projectId] = useState('project-' + Date.now());

  // State for different components
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null);
  const [terminalCommands, setTerminalCommands] = useState<TerminalCommand[]>([]);
  const [executionResults, setExecutionResults] = useState<ExecutionResult[]>([]);
  const [codeIssues, setCodeIssues] = useState<CodeIssue[]>([]);
  const [githubCommits, setGithubCommits] = useState<GitHubCommit[]>([]);
  const [creditAlerts, setCreditAlerts] = useState<CreditAlert[]>([]);

  // Initialize demo data
  useEffect(() => {
    initializeDemoData();
  }, []);

  const initializeDemoData = () => {
    // Demo files
    const demoFiles: CodeFile[] = [
      {
        id: '1',
        name: 'App.js',
        content: `const express = require('express');
const app = express();
const port = 3000;

// AI-powered endpoint
app.get('/api/generate', async (req, res) => {
  const { prompt, model } = req.body;

  try {
    // This would connect to your AI API
    const result = await generateCode(prompt, model);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(\`🚀 AI Studio running at http://localhost:\${port}\`);
});

// AI code generation function
async function generateCode(prompt, model) {
  // Implementation would use your API keys
  return { code: 'Generated code', language: 'javascript' };
}`,
        language: 'javascript',
        path: '/src/App.js',
        size: 589,
        lastModified: new Date()
      },
      {
        id: '2',
        name: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlareForge AI Studio - Advanced Platform</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 40px;
        }
        .feature-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 24px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🧙‍♀️ FlareForge AI Studio</h1>
            <p>Advanced AI-powered development platform with magical features</p>
        </header>

        <main>
            <div class="feature-grid">
                <div class="feature-card">
                    <h2>🔮 Multi-AI Provider Support</h2>
                    <p>Connect OpenAI, Anthropic, Google, and more with your own API keys</p>
                </div>
                <div class="feature-card">
                    <h2>🛡️ Advanced Security Scanning</h2>
                    <p>Automatic bug detection, vulnerability scanning, and auto-fix capabilities</p>
                </div>
                <div class="feature-card">
                    <h2>🚀 Code Execution & Preview</h2>
                    <p>Run your code in real-time with live preview and terminal access</p>
                </div>
                <div class="feature-card">
                    <h2>📊 Real-time API Monitoring</h2>
                    <p>Track your API usage, costs, and remaining credits in real-time</p>
                </div>
                <div class="feature-card">
                    <h2>🔗 GitHub Integration</h2>
                    <p>Seamlessly push your code to GitHub with version control</p>
                </div>
                <div class="feature-card">
                    <h2>✨ Advanced Code Editor</h2>
                    <p>Syntax highlighting, auto-completion, and intelligent code completion</p>
                </div>
            </div>
        </main>
    </div>
</body>
</html>`,
        language: 'html',
        path: '/public/index.html',
        size: 3423,
        lastModified: new Date()
      },
      {
        id: '3',
        name: 'package.json',
        content: `{
  "name": "flareforge-advanced-studio",
  "version": "2.0.0",
  "description": "Advanced AI-powered development platform",
  "main": "src/App.js",
  "scripts": {
    "start": "node src/App.js",
    "dev": "nodemon src/App.js",
    "test": "jest",
    "build": "webpack --mode production",
    "security-scan": "npm audit",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.5.0",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0",
    "webpack": "^5.88.0"
  },
  "keywords": [
    "ai",
    "development",
    "code-generation",
    "security",
    "automation"
  ],
  "author": "FlareForge AI Studio",
  "license": "MIT"
}`,
        language: 'json',
        path: '/package.json',
        size: 1123,
        lastModified: new Date()
      }
    ];

    setFiles(demoFiles);
    setSelectedFile(demoFiles[0]);
  };

  const handleCommandExecuted = (command: TerminalCommand) => {
    setTerminalCommands(prev => [command, ...prev]);
  };

  const handleExecutionComplete = (result: ExecutionResult) => {
    setExecutionResults(prev => [result, ...prev]);
  };

  const handleIssuesDetected = (issues: CodeIssue[]) => {
    setCodeIssues(prev => [...issues, ...prev]);
  };

  const handleCommitComplete = (commit: GitHubCommit) => {
    setGithubCommits(prev => [commit, ...prev]);
  };

  const handleAlertTriggered = (alert: CreditAlert) => {
    setCreditAlerts(prev => [alert, ...prev]);
  };

  const handleFileSaved = (file: CodeFile) => {
    setFiles(prev => prev.map(f => f.id === file.id ? file : f));
    if (selectedFile?.id === file.id) {
      setSelectedFile(file);
    }
  };

  const handleContentChange = (content: string) => {
    if (selectedFile) {
      const updatedFile = { ...selectedFile, content };
      setSelectedFile(updatedFile);
    }
  };

  const handleRunCode = (file: CodeFile) => {
    console.log('Running code:', file.name);
    // This would trigger the code executor
  };

  const handleBugDetected = (line: number, issue: string) => {
    console.log(`Bug detected at line ${line}: ${issue}`);
  };

  const tabs = [
    { id: 'editor', name: 'Code Editor', icon: Code2 },
    { id: 'terminal', name: 'Terminal', icon: Terminal },
    { id: 'security', name: 'Security Scanner', icon: Shield },
    { id: 'github', name: 'GitHub', icon: Github },
    { id: 'api', name: 'API Keys', icon: Zap },
    { id: 'monitor', name: 'Usage Monitor', icon: Activity }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Magical Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Wand2 className="h-8 w-8 text-purple-500" />
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                FlareForge AI Studio
              </h1>
              <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
            </div>
            <Badge variant="outline" className="text-purple-500 border-purple-500">
              🧙‍♀️ Advanced Platform
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            {/* Status Indicators */}
            <div className="flex items-center gap-2">
              {apiKeys.length > 0 && (
                <Badge variant="outline" className="text-green-500 border-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {apiKeys.length} API Keys
                </Badge>
              )}
              {codeIssues.length > 0 && (
                <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                  <Bug className="h-3 w-3 mr-1" />
                  {codeIssues.length} Issues
                </Badge>
              )}
              {creditAlerts.some(a => !a.acknowledged) && (
                <Badge variant="outline" className="text-red-500 border-red-500">
                  <Shield className="h-3 w-3 mr-1" />
                  Alerts
                </Badge>
              )}
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-600'}`}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="flex gap-1 p-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {activeTab === 'editor' && selectedFile && (
          <div className="h-full">
            <AdvancedCodeEditor
              file={selectedFile}
              onContentChange={handleContentChange}
              onFileSaved={handleFileSaved}
              onRunCode={handleRunCode}
              onBugDetected={handleBugDetected}
            />
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="h-full">
            <TerminalEmulator
              projectId={projectId}
              onCommandExecuted={handleCommandExecuted}
            />
          </div>
        )}

        {activeTab === 'security' && (
          <div className="h-full">
            <BugDetector
              files={files}
              onIssuesDetected={handleIssuesDetected}
              onIssueFixed={(result) => console.log('Issue fixed:', result)}
            />
          </div>
        )}

        {activeTab === 'github' && (
          <div className="h-full">
            <GitHubIntegration
              projectId={projectId}
              files={files.map(f => ({ id: f.id, name: f.name, content: f.content, path: f.path }))}
              onCommitComplete={handleCommitComplete}
            />
          </div>
        )}

        {activeTab === 'api' && (
          <div className="h-full">
            <ApiKeyManager
              userId={userId}
              onKeysUpdate={setApiKeys}
            />
          </div>
        )}

        {activeTab === 'monitor' && (
          <div className="h-full">
            <ApiCreditMonitor
              userId={userId}
              apiKeys={apiKeys}
              onAlertTriggered={handleAlertTriggered}
            />
          </div>
        )}
      </div>

      {/* Quick Actions Bar */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedFile && (
              <>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Current: {selectedFile.name}
                </span>
                <Badge variant="outline" className="text-purple-500 border-purple-500">
                  {selectedFile.language}
                </Badge>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <WitchcraftButton
              onClick={() => setActiveTab('security')}
              spellType="protection"
              size="sm"
            >
              <Bug className="h-4 w-4 mr-2" />
              Scan for Issues
            </WitchcraftButton>
            <WitchcraftButton
              onClick={() => setActiveTab('github')}
              spellType="enchantment"
              size="sm"
            >
              <Github className="h-4 w-4 mr-2" />
              Push to GitHub
            </WitchcraftButton>
            <WitchcraftButton
              onClick={() => selectedFile && handleRunCode(selectedFile)}
              spellType="transmutation"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Run Code
            </WitchcraftButton>
          </div>
        </div>
      </div>
    </div>
  );
}