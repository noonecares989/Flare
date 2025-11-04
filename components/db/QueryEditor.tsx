'use client';

import { useState, useCallback } from 'react';
import { Play, Save, Clock, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { Editor } from '@monaco-editor/react';

interface QueryResult {
  columns: string[];
  rows: any[][];
  executionTime: number;
  affectedRows?: number;
  error?: string;
}

interface QueryEditorProps {
  projectId: string;
  initialQuery?: string;
  onExecute?: (query: string) => Promise<QueryResult>;
  onSave?: (query: string, name: string) => void;
  className?: string;
}

export function QueryEditor({
  projectId,
  initialQuery = '',
  onExecute,
  onSave,
  className = ''
}: QueryEditorProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [savedQueries, setSavedQueries] = useState<Array<{ name: string; query: string; timestamp: Date }>>([]);
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);

  const handleExecute = useCallback(async () => {
    if (!query.trim() || !onExecute) return;

    setIsExecuting(true);
    try {
      const result = await onExecute(query);
      setResults(result);
    } catch (error) {
      setResults({
        columns: [],
        rows: [],
        executionTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsExecuting(false);
    }
  }, [query, onExecute]);

  const handleSave = useCallback(() => {
    const name = prompt('Enter query name:');
    if (name && onSave) {
      onSave(query, name);
      setSavedQueries(prev => [
        { name, query, timestamp: new Date() },
        ...prev,
      ]);
    }
  }, [query, onSave]);

  const loadQuery = useCallback((savedQuery: { name: string; query: string }) => {
    setQuery(savedQuery.query);
    setSelectedQuery(savedQuery.name);
  }, []);

  const SAMPLE_QUERIES = [
    {
      name: 'Select all users',
      query: 'SELECT * FROM users ORDER BY created_at DESC LIMIT 10;',
    },
    {
      name: 'Count records per table',
      query: `SELECT
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes
      FROM pg_stat_user_tables
      ORDER BY schemaname, tablename;`,
    },
    {
      name: 'Database size',
      query: `SELECT
        pg_database.datname AS database_name,
        pg_size_pretty(pg_database_size(pg_database.datname)) AS size
      FROM pg_database;`,
    },
  ];

  return (
    <div className={`h-full flex flex-col bg-gray-900 text-white ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleExecute}
            disabled={isExecuting || !query.trim()}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm flex items-center gap-1"
          >
            {isExecuting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isExecuting ? 'Executing...' : 'Run Query'}
          </button>
          <button
            onClick={handleSave}
            disabled={!query.trim()}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
        <div className="text-sm text-gray-400">
          SQL Query Editor
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Saved Queries */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-sm font-medium text-gray-300">Saved Queries</h3>
          </div>

          <div className="flex-1 overflow-auto">
            {/* Sample Queries */}
            <div className="p-3">
              <h4 className="text-xs font-medium text-gray-500 mb-2">Sample Queries</h4>
              <div className="space-y-1">
                {SAMPLE_QUERIES.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => loadQuery(sample)}
                    className="w-full text-left px-2 py-1 text-xs text-gray-300 hover:bg-gray-700 rounded flex items-center gap-1"
                  >
                    <Database className="h-3 w-3" />
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>

            {/* User Saved Queries */}
            {savedQueries.length > 0 && (
              <div className="p-3">
                <h4 className="text-xs font-medium text-gray-500 mb-2">Your Queries</h4>
                <div className="space-y-1">
                  {savedQueries.map((saved, index) => (
                    <div
                      key={index}
                      className={`px-2 py-1 text-xs rounded cursor-pointer flex items-center justify-between ${
                        selectedQuery === saved.name
                          ? 'bg-purple-600/20 text-purple-400'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                      onClick={() => loadQuery(saved)}
                    >
                      <span className="flex items-center gap-1 flex-1 truncate">
                        <Clock className="h-3 w-3" />
                        {saved.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editor and Results */}
        <div className="flex-1 flex flex-col">
          {/* Query Editor */}
          <div className="flex-1 border-b border-gray-700">
            <Editor
              height="100%"
              defaultLanguage="sql"
              value={query}
              onChange={(value) => setQuery(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                wordWrap: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
              }}
            />
          </div>

          {/* Results */}
          <div className="h-64 bg-gray-850 border-t border-gray-700">
            {results ? (
              <div className="h-full flex flex-col">
                {/* Results Header */}
                <div className="bg-gray-800 px-3 py-2 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {results.error ? (
                        <AlertCircle className="h-4 w-4 text-red-400" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      )}
                      <span className="text-sm text-gray-300">
                        {results.error ? 'Error' : 'Success'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {results.executionTime.toFixed(2)}ms
                    </span>
                    {results.affectedRows && (
                      <span className="text-xs text-gray-500">
                        {results.affectedRows} rows affected
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {results.rows.length} rows returned
                  </span>
                </div>

                {/* Results Content */}
                <div className="flex-1 overflow-auto">
                  {results.error ? (
                    <div className="p-4">
                      <div className="bg-red-900/20 border border-red-500/30 rounded p-3">
                        <p className="text-red-400 text-sm font-mono">{results.error}</p>
                      </div>
                    </div>
                  ) : results.rows.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-800 sticky top-0">
                        <tr>
                          {results.columns.map((column, index) => (
                            <th
                              key={index}
                              className="px-4 py-2 text-left text-gray-300 font-medium border-b border-gray-700"
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.rows.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className="border-b border-gray-800 hover:bg-gray-800/50"
                          >
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-4 py-2 text-gray-400 font-mono"
                              >
                                {cell === null ? (
                                  <span className="text-gray-600 italic">NULL</span>
                                ) : (
                                  String(cell)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No results to display</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Execute a query to see results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}