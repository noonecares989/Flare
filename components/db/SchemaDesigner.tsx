'use client';

import { useState, useCallback } from 'react';
import { Plus, Trash2, Edit3, Key, Hash, Type, Eye, EyeOff } from 'lucide-react';

interface Table {
  id: string;
  name: string;
  position: { x: number; y: number };
  columns: Column[];
  color: string;
}

interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
  defaultValue?: string;
}

interface Relationship {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

const COLUMN_TYPES = [
  'String', 'Text', 'Integer', 'Float', 'Boolean', 'Date', 'DateTime', 'Json', 'Uuid',
];

const TABLE_COLORS = [
  '#8b5cf6', '#22c55e', '#f59e0b', '#06b6d4', '#ef4444', '#ec4899', '#f97316', '#a855f7'
];

interface SchemaDesignerProps {
  projectId: string;
  initialSchema?: { tables: Table[]; relationships: Relationship[] };
  onSchemaChange?: (schema: { tables: Table[]; relationships: Relationship[] }) => void;
  className?: string;
}

export function SchemaDesigner({
  projectId,
  initialSchema,
  onSchemaChange,
  className = ''
}: SchemaDesignerProps) {
  const [tables, setTables] = useState<Table[]>(initialSchema?.tables || []);
  const [relationships, setRelationships] = useState<Relationship[]>(
    initialSchema?.relationships || []
  );
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<{ tableId: string; columnId: string } | null>(null);
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [editingColumn, setEditingColumn] = useState<{ tableId: string; columnId: string } | null>(null);
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [connectingColumn, setConnectingColumn] = useState<{ tableId: string; columnId: string } | null>(null);

  const addTable = useCallback(() => {
    const newTable: Table = {
      id: `table_${Date.now()}`,
      name: `table_${tables.length + 1}`,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
      columns: [
        {
          id: `col_${Date.now()}_id`,
          name: 'id',
          type: 'Integer',
          nullable: false,
          primaryKey: true,
        },
      ],
      color: TABLE_COLORS[tables.length % TABLE_COLORS.length],
    };

    setTables(prev => [...prev, newTable]);
    onSchemaChange?.({ tables: [...tables, newTable], relationships });
  }, [tables, relationships, onSchemaChange]);

  const deleteTable = useCallback((tableId: string) => {
    setTables(prev => prev.filter(t => t.id !== tableId));
    setRelationships(prev => prev.filter(r => r.fromTable !== tableId && r.toTable !== tableId));
    onSchemaChange?.({
      tables: tables.filter(t => t.id !== tableId),
      relationships: relationships.filter(r => r.fromTable !== tableId && r.toTable !== tableId)
    });
  }, [tables, relationships, onSchemaChange]);

  const updateTable = useCallback((tableId: string, updates: Partial<Table>) => {
    setTables(prev => prev.map(table =>
      table.id === tableId ? { ...table, ...updates } : table
    ));
    onSchemaChange?.({
      tables: tables.map(table => table.id === tableId ? { ...table, ...updates } : table),
      relationships
    });
  }, [tables, relationships, onSchemaChange]);

  const addColumn = useCallback((tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const newColumn: Column = {
      id: `col_${Date.now()}`,
      name: `column_${table.columns.length + 1}`,
      type: 'String',
      nullable: true,
      primaryKey: false,
    };

    updateTable(tableId, {
      columns: [...table.columns, newColumn]
    });
  }, [tables, updateTable]);

  const updateColumn = useCallback((tableId: string, columnId: string, updates: Partial<Column>) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    updateTable(tableId, {
      columns: table.columns.map(column =>
        column.id === columnId ? { ...column, ...updates } : column
      )
    });
  }, [tables, updateTable]);

  const deleteColumn = useCallback((tableId: string, columnId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    updateTable(tableId, {
      columns: table.columns.filter(column => column.id !== columnId)
    });
  }, [tables, updateTable]);

  const handleTableMouseDown = (e: React.MouseEvent, tableId: string) => {
    if (e.button === 0) { // Left click
      setDraggedTable(tableId);
      setSelectedTable(tableId);
    }
  };

  const handleColumnClick = (tableId: string, columnId: string) => {
    if (connectingColumn) {
      // Create relationship
      if (connectingColumn.tableId !== tableId) {
        const newRelationship: Relationship = {
          id: `rel_${Date.now()}`,
          fromTable: connectingColumn.tableId,
          fromColumn: connectingColumn.columnId,
          toTable: tableId,
          toColumn: columnId,
          type: 'one-to-many',
        };

        setRelationships(prev => [...prev, newRelationship]);
        onSchemaChange?.({ tables, relationships: [...relationships, newRelationship] });
      }
      setConnectingColumn(null);
    } else {
      setSelectedColumn({ tableId, columnId });
    }
  };

  return (
    <div className={`relative bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-900 border-b border-gray-700 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={addTable}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Table
          </button>
          <div className="text-sm text-gray-400">
            {tables.length} tables • {relationships.length} relationships
          </div>
        </div>
        <div className="flex items-center gap-2">
          {connectingColumn && (
            <button
              onClick={() => setConnectingColumn(null)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Cancel Connection
            </button>
          )}
          <div className="text-xs text-gray-500">
            Click tables to select • Click columns to connect • Drag to move
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="relative h-96 bg-gray-850 overflow-hidden"
        onMouseUp={() => setDraggedTable(null)}
        onMouseMove={(e) => {
          if (draggedTable) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            updateTable(draggedTable, {
              position: { x, y }
            });
          }
        }}
      >
        {/* Relationships */}
        <svg className="absolute inset-0 pointer-events-none">
          {relationships.map(relationship => {
            const fromTable = tables.find(t => t.id === relationship.fromTable);
            const toTable = tables.find(t => t.id === relationship.toTable);

            if (!fromTable || !toTable) return null;

            const fromColumn = fromTable.columns.find(c => c.id === relationship.fromColumn);
            const toColumn = toTable.columns.find(c => c.id === relationship.toColumn);

            if (!fromColumn || !toColumn) return null;

            const fromX = fromTable.position.x + 150;
            const fromY = fromTable.position.y + 30 + fromTable.columns.indexOf(fromColumn) * 25;
            const toX = toTable.position.x;
            const toY = toTable.position.y + 30 + toTable.columns.indexOf(toColumn) * 25;

            return (
              <g key={relationship.id}>
                <line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="#666"
                  strokeWidth="2"
                />
                <circle cx={fromX} cy={fromY} r="4" fill="#8b5cf6" />
                <circle cx={toX} cy={toY} r="4" fill="#22c55e" />
              </g>
            );
          })}
        </svg>

        {/* Tables */}
        {tables.map(table => (
          <div
            key={table.id}
            className={`absolute bg-gray-900 border-2 rounded-lg shadow-lg cursor-move ${
              selectedTable === table.id ? 'border-purple-500' : 'border-gray-700'
            }`}
            style={{
              left: `${table.position.x}px`,
              top: `${table.position.y}px`,
              width: '300px',
            }}
            onMouseDown={(e) => handleTableMouseDown(e, table.id)}
          >
            {/* Table Header */}
            <div
              className="px-3 py-2 border-b border-gray-700 flex items-center justify-between"
              style={{ backgroundColor: `${table.color}20` }}
            >
              {editingTable === table.id ? (
                <input
                  type="text"
                  value={table.name}
                  onChange={(e) => updateTable(table.id, { name: e.target.value })}
                  onBlur={() => setEditingTable(null)}
                  onKeyPress={(e) => e.key === 'Enter' && setEditingTable(null)}
                  className="bg-transparent outline-none text-white font-medium flex-1"
                  autoFocus
                />
              ) : (
                <h3
                  className="text-white font-medium flex-1"
                  onDoubleClick={() => setEditingTable(table.id)}
                >
                  {table.name}
                </h3>
              )}
              <button
                onClick={() => deleteTable(table.id)}
                className="text-red-400 hover:text-red-300 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Columns */}
            <div className="p-2 space-y-1">
              {table.columns.map((column, index) => (
                <div
                  key={column.id}
                  className={`flex items-center gap-2 px-2 py-1 rounded text-sm ${
                    selectedColumn?.tableId === table.id && selectedColumn?.columnId === column.id
                      ? 'bg-gray-700'
                      : 'hover:bg-gray-800'
                  }`}
                  onClick={() => handleColumnClick(table.id, column.id)}
                >
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    {column.primaryKey && <Key className="h-3 w-3 text-yellow-400" />}
                    {column.foreignKey && <Hash className="h-3 w-3 text-blue-400" />}
                    <span className="text-gray-300 text-xs">
                      {column.type}
                    </span>
                    {editingColumn?.tableId === table.id && editingColumn?.columnId === column.id ? (
                      <input
                        type="text"
                        value={column.name}
                        onChange={(e) => updateColumn(table.id, column.id, { name: e.target.value })}
                        onBlur={() => setEditingColumn(null)}
                        onKeyPress={(e) => e.key === 'Enter' && setEditingColumn(null)}
                        className="bg-transparent outline-none text-white flex-1"
                        autoFocus
                      />
                    ) : (
                      <span
                        className="text-white truncate flex-1"
                        onDoubleClick={() => setEditingColumn({ tableId, columnId })}
                      >
                        {column.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {!column.nullable && (
                      <div className="w-2 h-2 bg-red-400 rounded-full" title="Not nullable" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteColumn(table.id, column.id);
                      }}
                      className="text-gray-500 hover:text-red-400 p-0.5"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addColumn(table.id)}
                className="w-full px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded text-sm flex items-center justify-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add Column
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Property Panel */}
      {selectedColumn && (
        <div className="absolute right-0 top-0 w-64 bg-gray-900 border-l border-gray-700 p-4">
          <h3 className="text-white font-medium mb-4">Column Properties</h3>
          {(() => {
            const table = tables.find(t => t.id === selectedColumn.tableId);
            const column = table?.columns.find(c => c.id === selectedColumn.columnId);
            if (!table || !column) return null;

            return (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-xs">Name</label>
                  <input
                    type="text"
                    value={column.name}
                    onChange={(e) => updateColumn(table.id, column.id, { name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs">Type</label>
                  <select
                    value={column.type}
                    onChange={(e) => updateColumn(table.id, column.id, { type: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                  >
                    {COLUMN_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="nullable"
                    checked={column.nullable}
                    onChange={(e) => updateColumn(table.id, column.id, { nullable: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="nullable" className="text-gray-300 text-sm">Nullable</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="primaryKey"
                    checked={column.primaryKey}
                    onChange={(e) => updateColumn(table.id, column.id, { primaryKey: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="primaryKey" className="text-gray-300 text-sm">Primary Key</label>
                </div>
                <div>
                  <label className="text-gray-400 text-xs">Default Value</label>
                  <input
                    type="text"
                    value={column.defaultValue || ''}
                    onChange={(e) => updateColumn(table.id, column.id, { defaultValue: e.target.value })}
                    placeholder="NULL"
                    className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                  />
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}