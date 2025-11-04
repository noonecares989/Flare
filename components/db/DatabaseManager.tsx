'use client';

import { useState, useCallback } from 'react';
import { SchemaDesigner } from './SchemaDesigner';
import { QueryEditor } from './QueryEditor';
import { DataViewer } from './DataViewer';
import { Database, Table, Code, Search, Settings } from 'lucide-react';

interface DatabaseManagerProps {
  projectId: string;
  className?: string;
}

export function DatabaseManager({ projectId, className = '' }: DatabaseManagerProps) {
  const [activeTab, setActiveTab] = useState<'schema' | 'query' | 'data' | 'migrations'>('schema');
  const [tables, setTables] = useState<string[]>(['users', 'projects', 'sessions', 'api_keys', 'agent_executions']);

  // Mock data for demonstration
  const mockFetchData = useCallback(async (table: string, page: number, pageSize: number, filters?: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock table data
    const mockData: Record<string, any> = {
      users: {
        columns: [
          { name: 'id', type: 'String', nullable: false },
          { name: 'email', type: 'String', nullable: false },
          { name: 'name', type: 'String', nullable: true },
          { name: 'created_at', type: 'DateTime', nullable: false },
          { name: 'updated_at', type: 'DateTime', nullable: false },
        ],
        rows: [
          ['user_1', 'john@example.com', 'John Doe', '2024-01-15T10:30:00Z', '2024-01-15T10:30:00Z'],
          ['user_2', 'jane@example.com', 'Jane Smith', '2024-01-16T14:20:00Z', '2024-01-16T14:20:00Z'],
          ['user_3', 'bob@example.com', null, '2024-01-17T09:15:00Z', '2024-01-17T09:15:00Z'],
        ],
        totalCount: 25,
      },
      projects: {
        columns: [
          { name: 'id', type: 'String', nullable: false },
          { name: 'name', type: 'String', nullable: false },
          { name: 'description', type: 'Text', nullable: true },
          { name: 'user_id', type: 'String', nullable: false },
          { name: 'status', type: 'String', nullable: false },
          { name: 'created_at', type: 'DateTime', nullable: false },
        ],
        rows: [
          ['proj_1', 'E-commerce Platform', 'A full-stack e-commerce platform with React and Node.js', 'user_1', 'active', '2024-01-15T11:00:00Z'],
          ['proj_2', 'Blog Engine', 'A headless CMS with Next.js', 'user_2', 'building', '2024-01-16T15:30:00Z'],
        ],
        totalCount: 12,
      },
    };

    const tableData = mockData[table];
    if (!tableData) {
      throw new Error(`Table '${table}' not found`);
    }

    // Apply filtering
    let filteredRows = [...tableData.rows];
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredRows = filteredRows.filter(row =>
        row.some(cell => String(cell).toLowerCase().includes(searchLower))
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedRows = filteredRows.slice(startIndex, startIndex + pageSize);

    return {
      columns: tableData.columns,
      rows: paginatedRows,
      totalCount: filteredRows.length,
      page,
      pageSize,
    };
  }, []);

  const mockExecuteQuery = useCallback(async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const queryLower = query.toLowerCase();

    if (queryLower.includes('select') && queryLower.includes('users')) {
      return {
        columns: ['id', 'email', 'name', 'created_at'],
        rows: [
          ['user_1', 'john@example.com', 'John Doe', '2024-01-15T10:30:00Z'],
          ['user_2', 'jane@example.com', 'Jane Smith', '2024-01-16T14:20:00Z'],
        ],
        executionTime: 45,
      };
    }

    if (queryLower.includes('count')) {
      return {
        columns: ['table_name', 'row_count'],
        rows: [
          ['users', 25],
          ['projects', 12],
          ['sessions', 48],
          ['api_keys', 8],
        ],
        executionTime: 12,
      };
    }

    if (queryLower.includes('error') || queryLower.includes('syntax')) {
      return {
        columns: [],
        rows: [],
        executionTime: 0,
        error: 'Syntax error: Unexpected token at line 1, column 15',
      };
    }

    return {
      columns: ['result'],
      rows: [['Query executed successfully']],
      executionTime: 23,
      affectedRows: 1,
    };
  }, []);

  return (
    <div className={`h-full flex flex-col bg-gray-900 text-white ${className}`}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-purple-400" />
            <h2 className="text-xl font-semibold">Database Manager</h2>
            <span className="text-sm text-gray-400">FlareForge Database Tools</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded" title="Settings">
              <Settings className="h-4 w-4" />
            </button>
            <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded" title="Refresh">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'schema'
                ? 'bg-gray-900 text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Table className="h-4 w-4" />
            Schema Designer
          </button>
          <button
            onClick={() => setActiveTab('query')}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'query'
                ? 'bg-gray-900 text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Code className="h-4 w-4" />
            Query Editor
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'data'
                ? 'bg-gray-900 text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Database className="h-4 w-4" />
            Data Viewer
          </button>
          <button
            onClick={() => setActiveTab('migrations')}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'migrations'
                ? 'bg-gray-900 text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Settings className="h-4 w-4" />
            Migrations
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'schema' && (
          <SchemaDesigner
            projectId={projectId}
            className="h-full"
          />
        )}

        {activeTab === 'query' && (
          <QueryEditor
            projectId={projectId}
            onExecute={mockExecuteQuery}
            className="h-full"
          />
        )}

        {activeTab === 'data' && (
          <DataViewer
            projectId={projectId}
            tables={tables}
            onFetchData={mockFetchData}
            className="h-full"
          />
        )}

        {activeTab === 'migrations' && (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center max-w-md">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Database Migrations</h3>
              <p className="text-sm mb-4">
                Manage database schema migrations and version control
              </p>
              <div className="space-y-2 text-left bg-gray-800 rounded p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">001_initial_schema</span>
                  <span className="text-xs text-green-400">Applied</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">002_add_api_keys</span>
                  <span className="text-xs text-green-400">Applied</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">003_add_agent_executions</span>
                  <span className="text-xs text-yellow-400">Pending</span>
                </div>
              </div>
              <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm">
                Create New Migration
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">
            Connected to PostgreSQL
          </span>
          <span className="text-green-400 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            Live
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Project: {projectId}</span>
          <span>{tables.length} tables</span>
        </div>
      </div>
    </div>
  );
}