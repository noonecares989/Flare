'use client';

import { useState, useCallback } from 'react';
import { Download, Package, Github, Box, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Export {
  id: string;
  format: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  url?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
  project: {
    name: string;
  };
}

interface ExportManagerProps {
  projectId: string;
  projectName: string;
  className?: string;
}

const EXPORT_FORMATS = [
  {
    id: 'zip',
    name: 'ZIP Archive',
    description: 'Download complete project as ZIP file',
    icon: Package,
    color: 'bg-blue-500',
  },
  {
    id: 'github-repo',
    name: 'GitHub Repository',
    description: 'Setup as GitHub repository with instructions',
    icon: Github,
    color: 'bg-gray-600',
  },
  {
    id: 'docker-image',
    name: 'Docker Container',
    description: 'Export as Docker image with compose file',
    icon: Box,
    color: 'bg-cyan-500',
  },
];

export function ExportManager({ projectId, projectName, className = '' }: ExportManagerProps) {
  const [exports, setExports] = useState<Export[]>([]);
  const [isCreating, setIsCreating] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchExports = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/export?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setExports(data);
      }
    } catch (error) {
      console.error('Failed to fetch exports:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [projectId]);

  const createExport = useCallback(async (format: string, config?: any) => {
    setIsCreating(format);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          format,
          config: config || {},
        }),
      });

      if (response.ok) {
        await fetchExports(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to create export:', error);
    } finally {
      setIsCreating(null);
    }
  }, [projectId, fetchExports]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Ready';
      case 'failed':
        return 'Failed';
      case 'processing':
        return 'Processing...';
      default:
        return 'Pending';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-purple-500" />
            Export Project
          </CardTitle>
          <CardDescription>
            Choose how you want to export your "{projectName}" project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EXPORT_FORMATS.map((format) => (
              <div
                key={format.id}
                className="border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${format.color} text-white`}>
                    <format.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{format.name}</h3>
                    <p className="text-sm text-gray-400">{format.description}</p>
                  </div>
                </div>
                <Button
                  onClick={() => createExport(format.id)}
                  disabled={isCreating === format.id}
                  className="w-full"
                >
                  {isCreating === format.id ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    `Export as ${format.name}`
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              Export History
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchExports}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <CardDescription>
            Previous exports and their download links
          </CardDescription>
        </CardHeader>
        <CardContent>
          {exports.length > 0 ? (
            <div className="space-y-3">
              {exports.map((export) => (
                <div
                  key={export.id}
                  className="flex items-center justify-between p-3 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1 rounded ${getStatusColor(export.status)}`}>
                      {getStatusIcon(export.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {export.format === 'zip' ? 'ZIP Archive' :
                           export.format === 'github-repo' ? 'GitHub Repository' :
                           'Docker Container'}
                        </span>
                        <Badge
                          variant="outline"
                          className={getStatusColor(export.status)}
                        >
                          {getStatusText(export.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        {new Date(export.createdAt).toLocaleString()}
                      </p>
                      {export.error && (
                        <p className="text-xs text-red-400 mt-1">
                          {export.error}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {export.status === 'completed' && export.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={export.url}
                          download
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    )}
                    {export.status === 'processing' && (
                      <div className="text-sm text-blue-400">
                        Processing...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No exports yet</p>
              <p className="text-xs mt-2">
                Create your first export to download your project
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Export Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <div>
                <p className="font-medium text-white">ZIP Archive</p>
                <p className="text-xs">Complete project with source code, database schema, and AI history</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400">✓</span>
              <div>
                <p className="font-medium text-white">GitHub Repository</p>
                <p className="text-xs">Setup instructions and ready-to-push code structure</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-400">✓</span>
              <div>
                <p className="font-medium text-white">Docker Container</p>
                <p className="text-xs">Production-ready container with compose configuration</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}