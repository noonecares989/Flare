'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Code2,
  Copy,
  Download,
  Upload,
  Search,
  Replace,
  Settings,
  Eye,
  Play,
  Bug,
  Zap,
  CheckCircle,
  AlertCircle,
  Braces,
  FileText,
  Moon,
  Sun,
  Type,
  Hash
} from 'lucide-react';
import { WitchcraftButton } from '@/components/ui/WitchcraftButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// This is a simplified mock implementation
// In a real application, you would integrate with Monaco Editor or CodeMirror

export interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: string;
  path: string;
  size: number;
  lastModified: Date;
}

export interface EditorTheme {
  name: string;
  type: 'dark' | 'light';
  background: string;
  foreground: string;
  selection: string;
  keyword: string;
  string: string;
  comment: string;
  number: string;
  function: string;
  variable: string;
  error: string;
}

export interface SyntaxHighlightRule {
  pattern: RegExp;
  className: string;
  type: 'keyword' | 'string' | 'comment' | 'number' | 'function' | 'variable' | 'operator' | 'error';
}

interface AdvancedCodeEditorProps {
  file: CodeFile;
  onContentChange: (content: string) => void;
  onFileSaved: (file: CodeFile) => void;
  onRunCode: (file: CodeFile) => void;
  onBugDetected: (line: number, issue: string) => void;
  className?: string;
}

export function AdvancedCodeEditor({
  file,
  onContentChange,
  onFileSaved,
  onRunCode,
  onBugDetected,
  className = ''
}: AdvancedCodeEditorProps) {
  const [content, setContent] = useState(file.content);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showMinimap, setShowMinimap] = useState(false);
  const [autoComplete, setAutoComplete] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [currentTheme, setCurrentTheme] = useState('vs-dark');
  const [syntaxErrors, setSyntaxErrors] = useState<Array<{ line: number; message: string }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const themes: EditorTheme[] = [
    {
      name: 'VS Code Dark',
      type: 'dark',
      background: '#1e1e1e',
      foreground: '#d4d4d4',
      selection: '#264f78',
      keyword: '#569cd6',
      string: '#ce9178',
      comment: '#6a9955',
      number: '#b5cea8',
      function: '#dcdcaa',
      variable: '#9cdcfe',
      error: '#f48771'
    },
    {
      name: 'Monokai',
      type: 'dark',
      background: '#272822',
      foreground: '#f8f8f2',
      selection: '#49483e',
      keyword: '#f92672',
      string: '#e6db74',
      comment: '#75715e',
      number: '#ae81ff',
      function: '#a6e22e',
      variable: '#fd971f',
      error: '#f92672'
    },
    {
      name: 'GitHub Light',
      type: 'light',
      background: '#ffffff',
      foreground: '#24292e',
      selection: '#0366d6',
      keyword: '#d73a49',
      string: '#032f62',
      comment: '#6a737d',
      number: '#005cc5',
      function: '#6f42c1',
      variable: '#e36209',
      error: '#cb2431'
    },
    {
      name: 'Dracula',
      type: 'dark',
      background: '#282a36',
      foreground: '#f8f8f2',
      selection: '#44475a',
      keyword: '#ff79c6',
      string: '#f1fa8c',
      comment: '#6272a4',
      number: '#bd93f9',
      function: '#50fa7b',
      variable: '#8be9fd',
      error: '#ff5555'
    }
  ];

  const syntaxHighlightRules: SyntaxHighlightRule[] = [
    // JavaScript/TypeScript keywords
    { pattern: /\b(function|const|let|var|if|else|for|while|return|class|extends|import|export|from|async|await|try|catch|throw|new|this|super)\b/g, className: 'text-blue-400', type: 'keyword' },
    // Strings
    { pattern: /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, className: 'text-green-400', type: 'string' },
    // Comments
    { pattern: /\/\/.*$/gm, className: 'text-gray-500 italic', type: 'comment' },
    { pattern: /\/\*[\s\S]*?\*\//g, className: 'text-gray-500 italic', type: 'comment' },
    // Numbers
    { pattern: /\b\d+\.?\d*\b/g, className: 'text-purple-400', type: 'number' },
    // Functions
    { pattern: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, className: 'text-yellow-400', type: 'function' },
    // Operators
    { pattern: /[+\-*\/=<>!&|]+/g, className: 'text-pink-400', type: 'operator' }
  ];

  useEffect(() => {
    setContent(file.content);
  }, [file]);

  useEffect(() => {
    // Simulate syntax checking
    checkSyntax();
  }, [content, file.language]);

  const checkSyntax = () => {
    const errors: Array<{ line: number; message: string }> = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Simple syntax checks
      if (file.language === 'javascript' || file.language === 'typescript') {
        // Check for unclosed brackets
        const openBrackets = (line.match(/\{/g) || []).length;
        const closeBrackets = (line.match(/\}/g) || []).length;
        const openParens = (line.match(/\(/g) || []).length;
        const closeParens = (line.match(/\)/g) || []).length;

        if (openBrackets > closeBrackets) {
          errors.push({
            line: index + 1,
            message: 'Unclosed bracket'
          });
        }
        if (openParens > closeParens) {
          errors.push({
            line: index + 1,
            message: 'Unclosed parenthesis'
          });
        }

        // Check for semicolon issues
        if (line.trim() && !line.trim().endsWith('{') && !line.trim().endsWith('}') &&
            !line.trim().endsWith(';') && !line.trim().endsWith(',') &&
            !line.includes('//') && !line.includes('if') && !line.includes('for') &&
            !line.includes('while') && !line.includes('function') && !line.includes('class')) {
          if (Math.random() < 0.1) { // Random check to avoid too many errors
            errors.push({
              line: index + 1,
              message: 'Missing semicolon'
            });
          }
        }
      }
    });

    setSyntaxErrors(errors);
    errors.forEach(error => onBugDetected(error.line, error.message));
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onContentChange(newContent);
  };

  const applySyntaxHighlight = (text: string): string => {
    let highlightedText = text;

    syntaxHighlightRules.forEach(rule => {
      highlightedText = highlightedText.replace(rule.pattern, (match) => {
        return `<span class="${rule.className}">${match}</span>`;
      });
    });

    return highlightedText;
  };

  const handleSearch = () => {
    if (!searchQuery) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const content = textarea.value;
    const index = content.indexOf(searchQuery, textarea.selectionStart);

    if (index !== -1) {
      textarea.focus();
      textarea.setSelectionRange(index, index + searchQuery.length);
    }
  };

  const handleReplace = () => {
    if (!searchQuery || !replaceQuery) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const content = textarea.value;
    const newContent = content.replace(new RegExp(searchQuery, 'g'), replaceQuery);

    handleContentChange(newContent);
  };

  const handleSave = () => {
    const updatedFile: CodeFile = {
      ...file,
      content,
      lastModified: new Date()
    };
    onFileSaved(updatedFile);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCode = () => {
    setIsProcessing(true);

    // Simulate code formatting
    setTimeout(() => {
      let formatted = content;

      // Simple formatting rules
      formatted = formatted.replace(/;/g, ';\n');
      formatted = formatted.replace(/{/g, ' {\n  ');
      formatted = formatted.replace(/}/g, '\n}');
      formatted = formatted.replace(/\n\s*\n/g, '\n');

      handleContentChange(formatted);
      setIsProcessing(false);
    }, 1000);
  };

  const getLanguageIcon = (language: string) => {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'jsx':
        return '🟨';
      case 'typescript':
      case 'tsx':
        return '🔷';
      case 'python':
        return '🐍';
      case 'html':
        return '🌐';
      case 'css':
        return '🎨';
      case 'json':
        return '📄';
      case 'markdown':
        return '📝';
      default:
        return '📄';
    }
  };

  const theme = themes.find(t => t.name === currentTheme) || themes[0];

  return (
    <div className={`h-full bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50 ${className}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md border-b border-purple-500/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getLanguageIcon(file.language)}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white">{file.name}</h3>
                  <p className="text-xs text-purple-300">{file.path}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-purple-300 border-purple-400">
                {file.language}
              </Badge>
              {syntaxErrors.length > 0 && (
                <Badge variant="outline" className="text-red-400 border-red-400">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {syntaxErrors.length} errors
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                size="sm"
                variant="outline"
                className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                onClick={formatCode}
                disabled={isProcessing}
                size="sm"
                variant="outline"
                className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Formatting...
                  </>
                ) : (
                  <>
                    <Braces className="h-4 w-4 mr-2" />
                    Format
                  </>
                )}
              </Button>
              <Button
                onClick={handleSave}
                size="sm"
                variant="outline"
                className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Save
              </Button>
              <WitchcraftButton
                onClick={() => onRunCode(file)}
                spellType="enchantment"
                size="sm"
              >
                <Play className="h-4 w-4 mr-2" />
                Run
              </WitchcraftButton>
            </div>
          </div>
        </div>

        {/* Search/Replace Bar */}
        {isSearchOpen && (
          <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 px-3 py-1 bg-purple-900/50 border border-purple-500/20 rounded text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                />
                <input
                  type="text"
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  placeholder="Replace..."
                  className="flex-1 px-3 py-1 bg-purple-900/50 border border-purple-500/20 rounded text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  size="sm"
                  variant="outline"
                  className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
                >
                  <Search className="h-4 w-4 mr-1" />
                  Find
                </Button>
                <Button
                  onClick={handleReplace}
                  size="sm"
                  variant="outline"
                  className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
                >
                  <Replace className="h-4 w-4 mr-1" />
                  Replace
                </Button>
                <Button
                  onClick={() => setIsSearchOpen(false)}
                  size="sm"
                  variant="outline"
                  className="border-red-500/20 text-red-300 hover:bg-red-800/20"
                >
                  ×
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Editor Toolbar */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                size="sm"
                variant={showLineNumbers ? "default" : "outline"}
                className={showLineNumbers ? "bg-purple-600" : "border-purple-500/20 text-purple-300 hover:bg-purple-800/20"}
              >
                <Hash className="h-3 w-3 mr-1" />
                Lines
              </Button>
              <Button
                onClick={() => setWordWrap(!wordWrap)}
                size="sm"
                variant={wordWrap ? "default" : "outline"}
                className={wordWrap ? "bg-purple-600" : "border-purple-500/20 text-purple-300 hover:bg-purple-800/20"}
              >
                <FileText className="h-3 w-3 mr-1" />
                Wrap
              </Button>
              <Button
                onClick={() => setAutoComplete(!autoComplete)}
                size="sm"
                variant={autoComplete ? "default" : "outline"}
                className={autoComplete ? "bg-purple-600" : "border-purple-500/20 text-purple-300 hover:bg-purple-800/20"}
              >
                <Zap className="h-3 w-3 mr-1" />
                Auto
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="px-2 py-1 bg-purple-900/50 border border-purple-500/20 rounded text-white text-sm focus:outline-none focus:border-purple-400"
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
                <option value={18}>18px</option>
                <option value={20}>20px</option>
              </select>
              <select
                value={currentTheme}
                onChange={(e) => setCurrentTheme(e.target.value)}
                className="px-2 py-1 bg-purple-900/50 border border-purple-500/20 rounded text-white text-sm focus:outline-none focus:border-purple-400"
              >
                {themes.map(theme => (
                  <option key={theme.name} value={theme.name}>
                    {theme.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleCopy}
                size="sm"
                variant="outline"
                className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                onClick={handleDownload}
                size="sm"
                variant="outline"
                className="border-purple-500/20 text-purple-300 hover:bg-purple-800/20"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex">
          {/* Line Numbers */}
          {showLineNumbers && (
            <div className="w-16 bg-black/40 border-r border-purple-500/20 p-3 overflow-auto">
              <div className="font-mono text-xs text-purple-400 select-none">
                {content.split('\n').map((_, index) => (
                  <div key={index} className="leading-6 text-right">
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Editor */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className={`w-full h-full p-4 bg-transparent text-white font-mono resize-none outline-none ${
                wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'
              }`}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: 1.5,
                tabSize: 2
              }}
              placeholder="Start typing your code here..."
              spellCheck={false}
            />

            {/* Syntax Error Indicators */}
            {syntaxErrors.map((error, index) => (
              <div
                key={index}
                className="absolute left-0 w-full h-6 bg-red-500/10 border-l-2 border-red-500 flex items-center px-2 pointer-events-none"
                style={{ top: `${(error.line - 1) * 1.5 * fontSize}px` }}
                title={error.message}
              >
                <Bug className="h-3 w-3 text-red-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-black/30 backdrop-blur-md border-t border-purple-500/30 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-purple-300">
            <div className="flex items-center gap-4">
              <span>Lines: {content.split('\n').length}</span>
              <span>Size: {(content.length / 1024).toFixed(1)}KB</span>
              <span>Language: {file.language}</span>
              <span>Theme: {currentTheme}</span>
            </div>
            <div className="flex items-center gap-4">
              {syntaxErrors.length > 0 && (
                <span className="text-red-400">
                  <Bug className="h-3 w-3 inline mr-1" />
                  {syntaxErrors.length} errors
                </span>
              )}
              <span>UTF-8</span>
              <span>{isDarkTheme ? 'Dark' : 'Light'} Mode</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}