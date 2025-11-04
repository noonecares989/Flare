'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, X } from 'lucide-react';
import { FileNode } from '@/types/collaboration';

interface FileExplorerProps {
  files: FileNode[];
  selectedFile?: string;
  onFileSelect: (filePath: string) => void;
  onFileCreate?: (parentPath: string, name: string, type: 'file' | 'directory') => void;
  onFileDelete?: (filePath: string) => void;
  onFileRename?: (filePath: string, newName: string) => void;
  className?: string;
}

export function FileExplorer({
  files,
  selectedFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  className = ''
}: FileExplorerProps) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['/']));
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    filePath: string;
    type: 'file' | 'directory';
  } | null>(null);

  const toggleDirectory = (path: string) => {
    setExpandedDirs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const getFileIcon = (node: FileNode) => {
    if (node.type === 'directory') {
      return expandedDirs.has(node.path) ? (
        <FolderOpen className="h-4 w-4 text-blue-400" />
      ) : (
        <Folder className="h-4 w-4 text-blue-400" />
      );
    }

    // File type icons based on extension
    const ext = node.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
        return <File className="h-4 w-4 text-blue-500" />;
      case 'js':
      case 'jsx':
        return <File className="h-4 w-4 text-yellow-500" />;
      case 'css':
        return <File className="h-4 w-4 text-purple-500" />;
      case 'json':
        return <File className="h-4 w-4 text-green-500" />;
      case 'md':
        return <File className="h-4 w-4 text-gray-500" />;
      default:
        return <File className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      filePath: node.path,
      type: node.type,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleCreateFile = () => {
    if (contextMenu && onFileCreate) {
      const name = prompt('Enter file name:');
      if (name) {
        onFileCreate(contextMenu.filePath, name, 'file');
      }
    }
    closeContextMenu();
  };

  const handleCreateDirectory = () => {
    if (contextMenu && onFileCreate) {
      const name = prompt('Enter directory name:');
      if (name) {
        onFileCreate(contextMenu.filePath, name, 'directory');
      }
    }
    closeContextMenu();
  };

  const handleDelete = () => {
    if (contextMenu && onFileDelete) {
      if (confirm(`Delete ${contextMenu.type} "${contextMenu.filePath}"?`)) {
        onFileDelete(contextMenu.filePath);
      }
    }
    closeContextMenu();
  };

  const handleRename = () => {
    if (contextMenu && onFileRename) {
      const name = prompt('Enter new name:', contextMenu.filePath.split('/').pop());
      if (name && name !== contextMenu.filePath.split('/').pop()) {
        onFileRename(contextMenu.filePath, name);
      }
    }
    closeContextMenu();
  };

  const renderFileNode = (node: FileNode, level: number = 0) => {
    const isSelected = selectedFile === node.path;
    const isExpanded = expandedDirs.has(node.path);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.path}>
        <div
          className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-800 rounded transition-colors group ${
            isSelected ? 'bg-gray-700' : ''
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => {
            if (node.type === 'directory') {
              toggleDirectory(node.path);
            } else {
              onFileSelect(node.path);
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, node)}
        >
          {node.type === 'directory' && (
            <span className="transition-transform duration-200">
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-gray-500" />
              ) : (
                <ChevronRight className="h-3 w-3 text-gray-500" />
              )}
            </span>
          )}
          {getFileIcon(node)}
          <span className="text-sm text-gray-300 select-none flex-1 truncate">
            {node.name}
          </span>
          {isSelected && (
            <div className="w-1 h-4 bg-purple-500 rounded-full" />
          )}
        </div>
        {node.type === 'directory' && isExpanded && hasChildren && (
          <div>
            {node.children!.map(child => renderFileNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <h3 className="text-sm font-medium text-gray-300">Files</h3>
        {onFileCreate && (
          <button
            onClick={() => {
              const name = prompt('Enter file name:');
              if (name) {
                onFileCreate('/', name, 'file');
              }
            }}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="New File"
          >
            <Plus className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* File Tree */}
      <div className="overflow-auto max-h-96">
        {files.length > 0 ? (
          files.map(file => renderFileNode(file))
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No files yet</p>
            {onFileCreate && (
              <button
                onClick={() => {
                  const name = prompt('Enter file name:');
                  if (name) {
                    onFileCreate('/', name, 'file');
                  }
                }}
                className="mt-2 text-purple-400 hover:text-purple-300"
              >
                Create your first file
              </button>
            )}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={closeContextMenu}
          />
          <div
            className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-[150px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            {contextMenu.type === 'directory' && (
              <>
                <button
                  onClick={handleCreateFile}
                  className="w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                >
                  <File className="h-4 w-4" />
                  New File
                </button>
                <button
                  onClick={handleCreateDirectory}
                  className="w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                >
                  <Folder className="h-4 w-4" />
                  New Folder
                </button>
                <div className="border-t border-gray-700 my-1" />
              </>
            )}
            <button
              onClick={handleRename}
              className="w-full px-3 py-1.5 text-left text-sm text-gray-300 hover:bg-gray-700"
            >
              Rename
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-3 py-1.5 text-left text-sm text-red-400 hover:bg-gray-700"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}