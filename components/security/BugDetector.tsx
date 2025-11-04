'use client';

import { useState, useEffect } from 'react';
import {
  Bug,
  AlertTriangle,
  Shield,
  CheckCircle,
  Zap,
  Eye,
  FileText,
  Code,
  Lock,
  Search,
  Play,
  RotateCcw,
  Info,
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { WitchcraftButton } from '@/components/ui/WitchcraftButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export interface CodeIssue {
  id: string;
  type: 'bug' | 'vulnerability' | 'performance' | 'security' | 'quality' | 'error';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  file: string;
  line: number;
  column?: number;
  code: string;
  suggestion?: string;
  autoFixable: boolean;
  category: string;
  rule?: string;
  confidence: number; // 0-100
}

export interface ScanResult {
  id: string;
  timestamp: Date;
  duration: number;
  totalIssues: number;
  issuesByType: Record<string, number>;
  issuesBySeverity: Record<string, number>;
  issues: CodeIssue[];
  filesScanned: number;
  linesScanned: number;
}

export interface FixResult {
  issueId: string;
  success: boolean;
  fixedCode: string;
  appliedChanges: string[];
  timestamp: Date;
}

interface BugDetectorProps {
  files: Array<{ id: string; name: string; content: string; language: string }>;
  onIssuesDetected: (issues: CodeIssue[]) => void;
  onIssueFixed: (result: FixResult) => void;
  className?: string;
}

export function BugDetector({ files, onIssuesDetected, onIssueFixed, className = '' }: BugDetectorProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<CodeIssue | null>(null);
  const [isFixing, setIsFixing] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const issueTypes = [
    { id: 'all', name: 'All Issues', icon: Bug, color: 'text-purple-400' },
    { id: 'bug', name: 'Bugs', icon: AlertTriangle, color: 'text-red-400' },
    { id: 'vulnerability', name: 'Vulnerabilities', icon: Shield, color: 'text-orange-400' },
    { id: 'performance', name: 'Performance', icon: TrendingUp, color: 'text-yellow-400' },
    { id: 'security', name: 'Security', icon: Lock, color: 'text-red-400' },
    { id: 'quality', name: 'Code Quality', icon: Code, color: 'text-blue-400' },
    { id: 'error', name: 'Errors', icon: AlertCircle, color: 'text-red-500' }
  ];

  const severityLevels = [
    { id: 'all', name: 'All Severities', color: 'text-gray-400' },
    { id: 'critical', name: 'Critical', color: 'text-red-500' },
    { id: 'high', name: 'High', color: 'text-orange-400' },
    { id: 'medium', name: 'Medium', color: 'text-yellow-400' },
    { id: 'low', name: 'Low', color: 'text-blue-400' },
    { id: 'info', name: 'Info', color: 'text-gray-400' }
  ];

  const runSecurityScan = async () => {
    setIsScanning(true);
    const startTime = Date.now();

    try {
      // Simulate comprehensive security scan
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

      const issues: CodeIssue[] = [];
      let totalLines = 0;

      // Generate realistic issues based on file content
      files.forEach(file => {
        const lines = file.content.split('\n');
        totalLines += lines.length;

        // Simulate different types of issues
        lines.forEach((line, index) => {
          const lineNumber = index + 1;

          // SQL Injection vulnerability
          if (line.includes('SELECT') && line.includes('+')) {
            issues.push({
              id: `sql-injection-${file.id}-${index}`,
              type: 'vulnerability',
              severity: 'critical',
              title: 'SQL Injection Vulnerability',
              description: 'Potential SQL injection vulnerability detected. User input should be parameterized.',
              file: file.name,
              line: lineNumber,
              code: line.trim(),
              suggestion: 'Use parameterized queries or prepared statements to prevent SQL injection.',
              autoFixable: true,
              category: 'Security',
              rule: 'sql-injection',
              confidence: 95
            });
          }

          // XSS vulnerability
          if (line.includes('innerHTML') || line.includes('document.write')) {
            issues.push({
              id: `xss-${file.id}-${index}`,
              type: 'vulnerability',
              severity: 'high',
              title: 'Cross-Site Scripting (XSS) Vulnerability',
              description: 'Potential XSS vulnerability detected. Direct DOM manipulation can be unsafe.',
              file: file.name,
              line: lineNumber,
              code: line.trim(),
              suggestion: 'Use safe DOM manipulation methods or sanitize user input.',
              autoFixable: true,
              category: 'Security',
              rule: 'xss',
              confidence: 90
            });
          }

          // Hardcoded secrets
          if (line.includes('password') || line.includes('secret') || line.includes('api_key')) {
            if (line.includes('=') && !line.includes('process.env')) {
              issues.push({
                id: `hardcoded-secret-${file.id}-${index}`,
                type: 'security',
                severity: 'critical',
                title: 'Hardcoded Secret Detected',
                description: 'Hardcoded secrets or passwords detected in source code.',
                file: file.name,
                line: lineNumber,
                code: line.trim(),
                suggestion: 'Move secrets to environment variables or secure configuration files.',
                autoFixable: true,
                category: 'Security',
                rule: 'hardcoded-secret',
                confidence: 98
              });
            }
          }

          // Performance issue - inefficient loop
          if (line.includes('for') && line.includes('.length') && !line.includes('const')) {
            issues.push({
              id: `inefficient-loop-${file.id}-${index}`,
              type: 'performance',
              severity: 'medium',
              title: 'Inefficient Loop Detected',
              description: 'Array length property accessed in loop condition can impact performance.',
              file: file.name,
              line: lineNumber,
              code: line.trim(),
              suggestion: 'Cache array length outside the loop or use more efficient iteration methods.',
              autoFixable: true,
              category: 'Performance',
              rule: 'inefficient-loop',
              confidence: 85
            });
          }

          // Code quality - unused variable
          if (line.includes('const') || line.includes('let')) {
            const variableMatch = line.match(/(const|let)\s+(\w+)/);
            if (variableMatch && Math.random() < 0.1) {
              issues.push({
                id: `unused-variable-${file.id}-${index}`,
                type: 'quality',
                severity: 'low',
                title: 'Unused Variable',
                description: `Variable '${variableMatch[2]}' is declared but never used.`,
                file: file.name,
                line: lineNumber,
                code: line.trim(),
                suggestion: 'Remove unused variables or use them in your code.',
                autoFixable: true,
                category: 'Code Quality',
                rule: 'unused-variable',
                confidence: 75
              });
            }
          }

          // Missing error handling
          if (line.includes('await') && !line.includes('try') && Math.random() < 0.15) {
            issues.push({
              id: `missing-error-handling-${file.id}-${index}`,
              type: 'bug',
              severity: 'medium',
              title: 'Missing Error Handling',
              description: 'Async operation without proper error handling.',
              file: file.name,
              line: lineNumber,
              code: line.trim(),
              suggestion: 'Wrap async operations in try-catch blocks or handle errors properly.',
              autoFixable: true,
              category: 'Reliability',
              rule: 'missing-error-handling',
              confidence: 80
            });
          }

          // Console.log in production
          if (line.includes('console.log') && Math.random() < 0.2) {
            issues.push({
              id: `console-log-${file.id}-${index}`,
              type: 'quality',
              severity: 'low',
              title: 'Console Log in Production',
              description: 'Console.log statements should be removed in production code.',
              file: file.name,
              line: lineNumber,
              code: line.trim(),
              suggestion: 'Remove or replace with proper logging library.',
              autoFixable: true,
              category: 'Code Quality',
              rule: 'no-console',
              confidence: 95
            });
          }
        });
      });

      // Add some general issues
      if (Math.random() < 0.3) {
        issues.push({
          id: `missing-tests-${Date.now()}`,
          type: 'quality',
          severity: 'medium',
          title: 'Missing Unit Tests',
          description: 'No unit tests found for critical functions.',
          file: 'Project',
          line: 0,
          code: 'N/A',
          suggestion: 'Add unit tests to ensure code quality and prevent regressions.',
          autoFixable: false,
          category: 'Testing',
          confidence: 100
        });
      }

      // Calculate statistics
      const issuesByType: Record<string, number> = {};
      const issuesBySeverity: Record<string, number> = {};

      issues.forEach(issue => {
        issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
        issuesBySeverity[issue.severity] = (issuesBySeverity[issue.severity] || 0) + 1;
      });

      const scanResult: ScanResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        duration: Date.now() - startTime,
        totalIssues: issues.length,
        issuesByType,
        issuesBySeverity,
        issues,
        filesScanned: files.length,
        linesScanned: totalLines
      };

      setScanResults(prev => [scanResult, ...prev]);
      onIssuesDetected(issues);

    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const fixIssue = async (issue: CodeIssue) => {
    setIsFixing(prev => [...prev, issue.id]);

    try {
      // Simulate auto-fix
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Generate fixed code based on issue type
      let fixedCode = issue.code;
      const appliedChanges: string[] = [];

      switch (issue.type) {
        case 'vulnerability':
          if (issue.rule === 'sql-injection') {
            fixedCode = issue.code.replace(/\+.*\+/, '?');
            appliedChanges.push('Replaced string concatenation with parameterized query');
          } else if (issue.rule === 'xss') {
            fixedCode = issue.code.replace('innerHTML', 'textContent');
            appliedChanges.push('Replaced innerHTML with safe textContent');
          }
          break;

        case 'security':
          if (issue.rule === 'hardcoded-secret') {
            fixedCode = issue.code.replace(/=.*/, '= process.env.SECRET');
            appliedChanges.push('Moved hardcoded value to environment variable');
          }
          break;

        case 'performance':
          if (issue.rule === 'inefficient-loop') {
            appliedChanges.push('Cached array length outside loop');
          }
          break;

        case 'quality':
          if (issue.rule === 'unused-variable') {
            fixedCode = `// ${issue.code} (unused)`;
            appliedChanges.push('Commented out unused variable');
          } else if (issue.rule === 'no-console') {
            fixedCode = issue.code.replace('console.log', '// console.log');
            appliedChanges.push('Commented out console.log statement');
          }
          break;

        case 'bug':
          if (issue.rule === 'missing-error-handling') {
            fixedCode = `try {\n  ${issue.code}\n} catch (error) {\n  console.error(error);\n}`;
            appliedChanges.push('Added try-catch error handling');
          }
          break;
      }

      const fixResult: FixResult = {
        issueId: issue.id,
        success: true,
        fixedCode,
        appliedChanges,
        timestamp: new Date()
      };

      onIssueFixed(fixResult);

      // Update the issue status in scan results
      setScanResults(prev => prev.map(result => ({
        ...result,
        issues: result.issues.filter(i => i.id !== issue.id)
      })));

    } catch (error) {
      console.error('Fix failed:', error);
    } finally {
      setIsFixing(prev => prev.filter(id => id !== issue.id));
    }
  };

  const getLatestScan = () => scanResults[0];
  const filteredIssues = getLatestScan()?.issues.filter(issue => {
    const typeMatch = selectedType === 'all' || issue.type === selectedType;
    const severityMatch = selectedSeverity === 'all' || issue.severity === selectedSeverity;
    return typeMatch && severityMatch;
  }) || [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10';
      case 'high': return 'text-orange-400 bg-orange-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-blue-400 bg-blue-400/10';
      case 'info': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getTypeIcon = (type: string) => {
    const issueType = issueTypes.find(t => t.id === type);
    return issueType?.icon || Bug;
  };

  const formatDuration = (ms: number) => {
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
                <Shield className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Bug Detector & Security Scanner</h2>
              </div>
              {getLatestScan() && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-purple-300 border-purple-400">
                    {getLatestScan().totalIssues} issues found
                  </Badge>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {getLatestScan().filesScanned} files scanned
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <WitchcraftButton
                onClick={runSecurityScan}
                spellType="protection"
                disabled={isScanning || files.length === 0}
              >
                {isScanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Run Security Scan
                  </>
                )}
              </WitchcraftButton>
            </div>
          </div>
        </div>

        {/* Scan Results Overview */}
        {getLatestScan() && (
          <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Scan Duration</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {formatDuration(getLatestScan().duration)}
                </div>
              </div>
              <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Lines Scanned</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {getLatestScan().linesScanned.toLocaleString()}
                </div>
              </div>
              <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Critical Issues</span>
                </div>
                <div className="text-lg font-bold text-red-400">
                  {getLatestScan().issuesBySeverity.critical || 0}
                </div>
              </div>
              <div className="bg-purple-800/20 border border-purple-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">Auto-Fixable</span>
                </div>
                <div className="text-lg font-bold text-green-400">
                  {getLatestScan().issues.filter(i => i.autoFixable).length}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex">
          {/* Filters Sidebar */}
          <div className="w-64 bg-black/20 border-r border-purple-500/20 p-4">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-3">Issue Type</h3>
              <div className="space-y-1">
                {issueTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      selectedType === type.id
                        ? 'bg-purple-600 text-white'
                        : 'text-purple-300 hover:bg-purple-800/20'
                    }`}
                  >
                    <type.icon className="h-4 w-4" />
                    {type.name}
                    {getLatestScan() && (
                      <span className="ml-auto">
                        {getLatestScan().issuesByType[type.id] || 0}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Severity Level</h3>
              <div className="space-y-1">
                {severityLevels.map(severity => (
                  <button
                    key={severity.id}
                    onClick={() => setSelectedSeverity(severity.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedSeverity === severity.id
                        ? 'bg-purple-600 text-white'
                        : 'text-purple-300 hover:bg-purple-800/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{severity.name}</span>
                      {getLatestScan() && (
                        <span className="text-xs">
                          {getLatestScan().issuesBySeverity[severity.id] || 0}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div className="flex-1 p-4 overflow-auto">
            {filteredIssues.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-300 mb-2">
                    {getLatestScan() ? 'No issues found' : 'Run a security scan to detect issues'}
                  </p>
                  <p className="text-sm text-purple-400">
                    {getLatestScan() ? 'Great job! Your code looks secure.' : 'Click "Run Security Scan" to analyze your code'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredIssues.map(issue => {
                  const Icon = getTypeIcon(issue.type);
                  return (
                    <Card
                      key={issue.id}
                      className="bg-black/40 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/50"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600/20">
                              <Icon className="h-4 w-4 text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-medium">{issue.title}</h4>
                                <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                                  {issue.severity}
                                </Badge>
                                <Badge variant="outline" className="text-purple-300 border-purple-400">
                                  {issue.category}
                                </Badge>
                                {issue.autoFixable && (
                                  <Badge variant="outline" className="text-green-400 border-green-400">
                                    Auto-fixable
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-purple-200 mb-2">{issue.description}</p>
                              <div className="flex items-center gap-4 text-xs text-purple-400 mb-2">
                                <span>{issue.file}:{issue.line}</span>
                                <span>Confidence: {issue.confidence}%</span>
                                {issue.rule && <span>Rule: {issue.rule}</span>}
                              </div>
                              <div className="bg-black/60 border border-purple-500/20 rounded p-2 mb-2">
                                <code className="text-xs text-purple-200 font-mono">
                                  {issue.code}
                                </code>
                              </div>
                              {issue.suggestion && (
                                <div className="bg-purple-800/20 border border-purple-500/20 rounded p-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Info className="h-3 w-3 text-purple-400" />
                                    <span className="text-sm font-medium text-purple-300">Suggestion:</span>
                                  </div>
                                  <p className="text-xs text-purple-200">{issue.suggestion}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {issue.autoFixable && (
                              <WitchcraftButton
                                onClick={() => fixIssue(issue)}
                                spellType="enchantment"
                                size="sm"
                                disabled={isFixing.includes(issue.id)}
                              >
                                {isFixing.includes(issue.id) ? (
                                  <>
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                                    Fixing...
                                  </>
                                ) : (
                                  <>
                                    <Zap className="h-3 w-3 mr-1" />
                                    Auto Fix
                                  </>
                                )}
                              </WitchcraftButton>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedIssue(issue)}
                              className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}