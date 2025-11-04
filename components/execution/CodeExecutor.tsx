'use client';

import { useState, useEffect } from 'react';
import {
  Play,
  Square,
  RefreshCw,
  Terminal,
  Globe,
  Smartphone,
  Monitor,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  Code,
  Bug
} from 'lucide-react';
import { WitchcraftButton } from '@/components/ui/WitchcraftButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: string;
  path: string;
  size: number;
}

export interface ExecutionResult {
  id: string;
  fileId: string;
  status: 'running' | 'success' | 'error' | 'pending';
  output: string[];
  error?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  previewUrl?: string;
  port?: number;
}

export interface PreviewEnvironment {
  id: string;
  type: 'browser' | 'mobile' | 'tablet' | 'desktop';
  url: string;
  title: string;
  isActive: boolean;
}

interface CodeExecutorProps {
  files: CodeFile[];
  onExecutionComplete: (result: ExecutionResult) => void;
  className?: string;
}

export function CodeExecutor({ files, onExecutionComplete, className = '' }: CodeExecutorProps) {
  const [executions, setExecutions] = useState<ExecutionResult[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('browser');
  const [previewEnvironments, setPreviewEnvironments] = useState<PreviewEnvironment[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    // Initialize preview environments
    const environments: PreviewEnvironment[] = [
      {
        id: 'browser',
        type: 'browser',
        url: 'http://localhost:3000',
        title: 'Browser Preview',
        isActive: true
      },
      {
        id: 'mobile',
        type: 'mobile',
        url: 'http://localhost:3000',
        title: 'Mobile Preview',
        isActive: false
      },
      {
        id: 'tablet',
        type: 'tablet',
        url: 'http://localhost:3000',
        title: 'Tablet Preview',
        isActive: false
      }
    ];

    setPreviewEnvironments(environments);
  }, []);

  const executeFile = async (file: CodeFile) => {
    if (isExecuting) return;

    const executionId = Date.now().toString();
    const newExecution: ExecutionResult = {
      id: executionId,
      fileId: file.id,
      status: 'running',
      output: [],
      startTime: new Date()
    };

    setExecutions(prev => [...prev, newExecution]);
    setIsExecuting(true);

    try {
      const result = await simulateCodeExecution(file);
      const completedExecution: ExecutionResult = {
        ...newExecution,
        ...result,
        endTime: new Date(),
        duration: new Date().getTime() - newExecution.startTime.getTime()
      };

      setExecutions(prev => prev.map(exec =>
        exec.id === executionId ? completedExecution : exec
      ));

      onExecutionComplete(completedExecution);

      // Update preview environments if successful
      if (result.status === 'success' && result.previewUrl) {
        setPreviewEnvironments(prev => prev.map(env => ({
          ...env,
          url: result.previewUrl || env.url
        })));
      }
    } catch (error) {
      const errorExecution: ExecutionResult = {
        ...newExecution,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        endTime: new Date(),
        duration: new Date().getTime() - newExecution.startTime.getTime(),
        output: ['Execution failed']
      };

      setExecutions(prev => prev.map(exec =>
        exec.id === executionId ? errorExecution : exec
      ));
    } finally {
      setIsExecuting(false);
    }
  };

  const simulateCodeExecution = async (file: CodeFile): Promise<Partial<ExecutionResult>> => {
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const output: string[] = [];
    let previewUrl = '';
    let port = 3000;
    let status: 'success' | 'error' = 'success';

    // Simulate different execution types based on file type
    switch (file.language) {
      case 'javascript':
      case 'jsx':
        if (file.name.includes('server') || file.name.includes('app')) {
          output.push('Starting Node.js server...');
          output.push(`Server running on port ${port}`);
          output.push('🚀 Application ready!');
          previewUrl = `http://localhost:${port}`;
        } else if (file.name.includes('client') || file.name.includes('app')) {
          output.push('Starting React development server...');
          output.push('Compiled successfully!');
          output.push(`Local: http://localhost:${port}`);
          output.push('✨ webpack compiled successfully');
          previewUrl = `http://localhost:${port}`;
        } else {
          output.push('Executing JavaScript...');
          output.push('✅ Script completed successfully');
        }
        break;

      case 'python':
        output.push('Executing Python script...');
        output.push('Python 3.11.0');
        output.push('✅ Python script completed');
        break;

      case 'html':
        output.push('Serving HTML file...');
        output.push(`Server running on port ${port}`);
        previewUrl = `http://localhost:${port}`;
        break;

      case 'css':
        output.push('Processing CSS...');
        output.push('✅ CSS compiled successfully');
        break;

      case 'typescript':
        output.push('Compiling TypeScript...');
        output.push('tsc: version 5.2.2');
        output.push('✅ Compilation completed');
        break;

      default:
        output.push(`Executing ${file.language} file...`);
        output.push('✅ Execution completed');
    }

    // Random chance of error for demonstration
    if (Math.random() < 0.1) {
      status = 'error';
      output.push('❌ Execution failed');
      return {
        status,
        output,
        error: 'Simulated execution error'
      };
    }

    return {
      status,
      output,
      previewUrl,
      port
    };
  };

  const stopExecution = (executionId: string) => {
    setExecutions(prev => prev.map(exec =>
      exec.id === executionId
        ? { ...exec, status: 'error', endTime: new Date(), error: 'Execution stopped by user' }
        : exec
    ));
  };

  const clearExecutions = () => {
    setExecutions([]);
  };

  const refreshPreview = () => {
    // Trigger preview refresh
    setPreviewEnvironments(prev => prev.map(env => ({
      ...env,
      url: env.url + '?refresh=' + Date.now()
    })));
  };

  const getEnvironmentIcon = (type: string) => {
    switch (type) {
      case 'browser': return <Globe className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-yellow-400 bg-yellow-400/10';
      case 'success': return 'text-green-400 bg-green-400/10';
      case 'error': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className={`h-full bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50 ${className}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md border-b border-purple-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Code Executor</h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-purple-300 border-purple-400">
                  {files.length} files
                </Badge>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {executions.filter(e => e.status === 'success').length} successful
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={refreshPreview}
                className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Preview
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearExecutions}
                className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
              >
                Clear History
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Files Panel */}
          <div className="w-80 bg-black/20 border-r border-purple-500/20 p-4 overflow-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Files</h3>
            <div className="space-y-2">
              {files.map(file => (
                <Card
                  key={file.id}
                  className="bg-black/40 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/50"
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium text-white">{file.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs text-purple-300 border-purple-400">
                        {file.language}
                      </Badge>
                    </div>
                    <div className="text-xs text-purple-300 mb-2">
                      {file.path} • {(file.size / 1024).toFixed(1)}KB
                    </div>
                    <div className="flex gap-2">
                      <WitchcraftButton
                        onClick={() => executeFile(file)}
                        spellType="enchantment"
                        size="sm"
                        disabled={isExecuting}
                        className="flex-1"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Run
                      </WitchcraftButton>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Execution Results */}
          <div className="flex-1 flex flex-col">
            {/* Preview Environments */}
            <div className="bg-black/20 border-b border-purple-500/20 p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">Preview Environments</h3>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs text-purple-300">
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      className="rounded"
                    />
                    Auto-refresh
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                {previewEnvironments.map(env => (
                  <Button
                    key={env.id}
                    size="sm"
                    variant={selectedEnvironment === env.id ? "default" : "outline"}
                    onClick={() => setSelectedEnvironment(env.id)}
                    className={`
                      ${selectedEnvironment === env.id
                        ? 'bg-purple-600 text-white'
                        : 'border-purple-500/20 text-purple-300 hover:bg-purple-800/20'
                      }
                    `}
                  >
                    {getEnvironmentIcon(env.type)}
                    {env.title}
                  </Button>
                ))}
              </div>
            </div>

            {/* Preview Frame */}
            <div className="flex-1 p-4">
              <div className="h-full bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg">
                {executions.some(e => e.status === 'success' && e.previewUrl) ? (
                  <iframe
                    src={executions.find(e => e.status === 'success')?.previewUrl}
                    className="w-full h-full rounded-lg"
                    title="Code Preview"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Globe className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                      <p className="text-purple-300 mb-2">No active preview</p>
                      <p className="text-sm text-purple-400">
                        Run a file to see the preview here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Execution Log */}
            <div className="h-64 bg-black/20 border-t border-purple-500/20 p-4 overflow-auto">
              <h3 className="text-sm font-semibold text-white mb-3">Execution Log</h3>
              <div className="space-y-2">
                {executions.map(execution => {
                  const file = files.find(f => f.id === execution.fileId);
                  return (
                    <div
                      key={execution.id}
                      className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{file?.name}</span>
                          <Badge variant="outline" className={getStatusColor(execution.status)}>
                            {execution.status}
                          </Badge>
                          {execution.duration && (
                            <span className="text-xs text-purple-400">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {formatDuration(execution.duration)}
                            </span>
                          )}
                        </div>
                        {execution.status === 'running' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => stopExecution(execution.id)}
                            className="border-red-500/20 text-red-300 hover:bg-red-800/20"
                          >
                            <Square className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      {execution.output.length > 0 && (
                        <div className="text-xs text-purple-200 font-mono mb-2">
                          {execution.output.map((line, index) => (
                            <div key={index}>{line}</div>
                          ))}
                        </div>
                      )}
                      {execution.error && (
                        <div className="text-xs text-red-400 font-mono mb-2">
                          <Bug className="h-3 w-3 inline mr-1" />
                          {execution.error}
                        </div>
                      )}
                      {execution.previewUrl && (
                        <div className="flex items-center gap-2">
                          <a
                            href={execution.previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Open in new tab
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
                {executions.length === 0 && (
                  <div className="text-center text-purple-400">
                    <Terminal className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No executions yet</p>
                    <p className="text-xs">Run a file to see execution results</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}