'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Download, RefreshCw, Edit, Trash2, Eye, EyeOff, Plus, ChevronDown } from 'lucide-react';

interface Column {
  name: string;
  type: string;
  nullable: boolean;
}

interface TableData {
  table: string;
  columns: Column[];
  rows: any[][];
  totalCount: number;
  page: number;
  pageSize: number;
}

interface DataViewerProps {
  projectId: string;
  tables: string[];
  onFetchData?: (table: string, page: number, pageSize: number, filters?: any) => Promise<TableData>;
  onUpdateRow?: (table: string, id: string, data: any) => Promise<void>;
  onDeleteRow?: (table: string, id: string) => Promise<void>;
  className?: string;
}

export function DataViewer({
  projectId,
  tables,
  onFetchData,
  onUpdateRow,
  onDeleteRow,
  className = ''
}: DataViewerProps) {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [data, setData] = useState<TableData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>({});
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set());

  const pageSizes = [10, 25, 50, 100];
  const [pageSize, setPageSize] = useState(25);

  const fetchData = useCallback(async () => {
    if (!selectedTable || !onFetchData) return;

    setIsLoading(true);
    try {
      const result = await onFetchData(selectedTable, 1, pageSize, { ...filters, search: searchTerm });
      setData(result);

      // Initialize visible columns
      if (result.columns.length > 0) {
        setVisibleColumns(new Set(result.columns.map(col => col.name)));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTable, pageSize, filters, searchTerm, onFetchData]);

  useEffect(() => {
    if (selectedTable) {
      fetchData();
    }
  }, [selectedTable, fetchData]);

  const handlePageChange = useCallback((newPage: number) => {
    if (!selectedTable || !onFetchData) return;

    setIsLoading(true);
    onFetchData(selectedTable, newPage, pageSize, { ...filters, search: searchTerm })
      .then(result => {
        setData(result);
      })
      .catch(error => {
        console.error('Failed to fetch page:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedTable, pageSize, filters, searchTerm, onFetchData]);

  const handleEditRow = useCallback((rowIndex: number) => {
    if (!data) return;

    setEditingRow(rowIndex);
    setEditingData({ ...data.rows[rowIndex] });
  }, [data]);

  const handleSaveRow = useCallback(async () => {
    if (!data || !onUpdateRow || editingRow === null) return;

    try {
      const idColumn = data.columns.find(col => col.name.toLowerCase().includes('id'));
      const rowId = idColumn ? data.rows[editingRow][data.columns.indexOf(idColumn)] : editingRow;

      await onUpdateRow(selectedTable, rowId, editingData);

      // Update local data
      const newRows = [...data.rows];
      newRows[editingRow] = editingData;
      setData({ ...data, rows: newRows });

      setEditingRow(null);
      setEditingData({});
    } catch (error) {
      console.error('Failed to save row:', error);
    }
  }, [data, editingRow, editingData, selectedTable, onUpdateRow]);

  const handleDeleteRow = useCallback(async (rowIndex: number) => {
    if (!data || !onDeleteRow) return;

    if (!confirm('Are you sure you want to delete this row?')) return;

    try {
      const idColumn = data.columns.find(col => col.name.toLowerCase().includes('id'));
      const rowId = idColumn ? data.rows[rowIndex][data.columns.indexOf(idColumn)] : rowIndex;

      await onDeleteRow(selectedTable, rowId);

      // Update local data
      const newRows = data.rows.filter((_, index) => index !== rowIndex);
      setData({ ...data, rows: newRows, totalCount: data.totalCount - 1 });
    } catch (error) {
      console.error('Failed to delete row:', error);
    }
  }, [data, selectedTable, onDeleteRow]);

  const toggleColumnVisibility = useCallback((columnName: string) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnName)) {
        newSet.delete(columnName);
      } else {
        newSet.add(columnName);
      }
      return newSet;
    });
  }, []);

  const totalPages = data ? Math.ceil(data.totalCount / data.pageSize) : 0;

  return (
    <div className={`h-full flex flex-col bg-gray-900 text-white ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
            >
              <option value="">Select a table</option>
              {tables.map(table => (
                <option key={table} value={table}>{table}</option>
              ))}
            </select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm w-48"
              />
            </div>

            <button
              onClick={fetchData}
              disabled={isLoading || !selectedTable}
              className="p-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 rounded"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {data && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {data.totalCount} total rows
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                >
                  {pageSizes.map(size => (
                    <option key={size} value={size}>{size} per page</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Column Visibility Toggle */}
        {data && data.columns.length > 0 && (
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
              <Filter className="h-3 w-3" />
              Columns
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="flex gap-1 flex-wrap">
              {data.columns.map(column => (
                <button
                  key={column.name}
                  onClick={() => toggleColumnVisibility(column.name)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    visibleColumns.has(column.name)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {column.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto">
        {!selectedTable ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a table to view data</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin" />
              <p>Loading data...</p>
            </div>
          </div>
        ) : data && data.rows.length > 0 ? (
          <div className="h-full flex flex-col">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 sticky top-0">
                <tr>
                  {data.columns
                    .filter(col => visibleColumns.has(col.name))
                    .map((column, index) => (
                      <th
                        key={column.name}
                        className="px-4 py-2 text-left text-gray-300 font-medium border-b border-gray-700"
                      >
                        <div className="flex items-center gap-1">
                          {column.name}
                          {column.nullable && (
                            <span className="text-xs text-gray-500">(nullable)</span>
                          )}
                        </div>
                      </th>
                    ))}
                  <th className="px-4 py-2 text-center text-gray-300 font-medium border-b border-gray-700 w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`border-b border-gray-800 hover:bg-gray-800/50 ${
                      editingRow === rowIndex ? 'bg-purple-900/20' : ''
                    }`}
                  >
                    {data.columns
                      .filter(col => visibleColumns.has(col.name))
                      .map((column, colIndex) => {
                        const originalIndex = data.columns.indexOf(column);
                        const cellValue = row[originalIndex];

                        return (
                          <td
                            key={column.name}
                            className="px-4 py-2 text-gray-400 font-mono"
                          >
                            {editingRow === rowIndex ? (
                              <input
                                type="text"
                                value={editingData[originalIndex] || ''}
                                onChange={(e) =>
                                  setEditingData(prev => ({
                                    ...prev,
                                    [originalIndex]: e.target.value
                                  }))
                                }
                                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                              />
                            ) : (
                              <div className="flex items-center">
                                {cellValue === null ? (
                                  <span className="text-gray-600 italic">NULL</span>
                                ) : typeof cellValue === 'boolean' ? (
                                  <span className={cellValue ? 'text-green-400' : 'text-red-400'}>
                                    {cellValue ? 'true' : 'false'}
                                  </span>
                                ) : (
                                  <span className="max-w-xs truncate">
                                    {String(cellValue)}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {editingRow === rowIndex ? (
                          <>
                            <button
                              onClick={handleSaveRow}
                              className="p-1 text-green-400 hover:text-green-300"
                              title="Save"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingRow(null);
                                setEditingData({});
                              }}
                              className="p-1 text-gray-400 hover:text-gray-300"
                              title="Cancel"
                            >
                              <EyeOff className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditRow(rowIndex)}
                              className="p-1 text-blue-400 hover:text-blue-300"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRow(rowIndex)}
                              className="p-1 text-red-400 hover:text-red-300"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-800 border-t border-gray-700 p-3 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {((data.page - 1) * data.pageSize) + 1} to{' '}
                  {Math.min(data.page * data.pageSize, data.totalCount)} of {data.totalCount} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, data.page - 1))}
                    disabled={data.page <= 1}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded text-sm"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-400">
                    Page {data.page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, data.page + 1))}
                    disabled={data.page >= totalPages}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No data found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}