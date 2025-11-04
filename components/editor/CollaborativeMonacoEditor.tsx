'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Editor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useWebSocket } from '@/hooks/useWebSocket';
import { documentSyncManager } from '@/lib/collaboration/documentSync';
import { UserPresence, RemoteCursor } from '@/types/collaboration';
import { CursorDecorations } from './CursorDecorations';

interface CollaborativeMonacoEditorProps {
  sessionId: string;
  filePath: string;
  initialContent?: string;
  language?: string;
  onContentChange?: (content: string) => void;
  onCursorChange?: (position: { line: number; column: number }) => void;
  onSelectionChange?: (selection: { start: { line: number; column: number }; end: { line: number; column: number } }) => void;
  readOnly?: boolean;
  theme?: 'vs-dark' | 'light';
}

export function CollaborativeMonacoEditor({
  sessionId,
  filePath,
  initialContent = '',
  language = 'typescript',
  onContentChange,
  onCursorChange,
  onSelectionChange,
  readOnly = false,
  theme = 'vs-dark'
}: CollaborativeMonacoEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(new Map());
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);

  // WebSocket for real-time collaboration
  const { lastMessage, sendMessage } = useWebSocket(`/api/collab/${sessionId}`);

  const handleEditorDidMount = useCallback(
    async (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
      editorRef.current = editor;

      try {
        // Initialize collaborative document
        await documentSyncManager.initializeDocument(
          sessionId,
          filePath,
          initialContent,
          editor
        );

        setIsConnected(true);
        setConnectionStatus('connected');

        // Set up local cursor tracking
        setupCursorTracking(editor);

        // Set up content change tracking
        setupContentTracking(editor);

        // Set up selection tracking
        setupSelectionTracking(editor);

        // Set up document sync event listeners
        setupDocumentSyncListeners();

      } catch (error) {
        console.error('Failed to initialize collaborative editor:', error);
        setConnectionStatus('error');
      }
    },
    [sessionId, filePath, initialContent]
  );

  const setupCursorTracking = (editor: monaco.editor.IStandaloneCodeEditor) => {
    let debounceTimer: NodeJS.Timeout;

    editor.onDidChangeCursorPosition((e) => {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        const position = e.position;

        // Notify parent component
        onCursorChange?.({ line: position.lineNumber, column: position.column });

        // Send cursor position to other users
        sendMessage({
          type: 'cursor',
          data: {
            cursor: { line: position.lineNumber, column: position.column },
            filePath,
          },
        });
      }, 100); // Debounce cursor updates
    });
  };

  const setupContentTracking = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editor.onDidChangeModelContent((e) => {
      const content = editor.getValue();
      onContentChange?.(content);

      // Content changes are automatically synced by Y.js, but we can send notifications
      sendMessage({
        type: 'content_change',
        data: {
          filePath,
          changes: e.changes.map(change => ({
            range: {
              startLineNumber: change.range.startLineNumber,
              startColumn: change.range.startColumn,
              endLineNumber: change.range.endLineNumber,
              endColumn: change.range.endColumn,
            },
            text: change.text,
          })),
        },
      });
    });
  };

  const setupSelectionTracking = (editor: monaco.editor.IStandaloneCodeEditor) => {
    let debounceTimer: NodeJS.Timeout;

    editor.onDidChangeCursorSelection((e) => {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        const selection = e.selection;

        if (!selection.isEmpty()) {
          onSelectionChange?.({
            start: { line: selection.startLineNumber, column: selection.startColumn },
            end: { line: selection.endLineNumber, column: selection.endColumn },
          });

          // Send selection to other users
          sendMessage({
            type: 'selection',
            data: {
              selection: {
                start: { line: selection.startLineNumber, column: selection.startColumn },
                end: { line: selection.endLineNumber, column: selection.endColumn },
              },
              filePath,
            },
          });
        }
      }, 100);
    });
  };

  const setupDocumentSyncListeners = () => {
    const docId = `${sessionId}:${filePath}`;

    // Listen for remote presence updates
    documentSyncManager.onPresenceUpdate(docId, (update) => {
      handleRemotePresenceUpdate(update);
    });

    // Listen for connection status changes
    documentSyncManager.onConnectionStatus(docId, (status) => {
      setConnectionStatus(status === 'connected' ? 'connected' : 'disconnected');
      setIsConnected(status === 'connected');
    });
  };

  const handleRemotePresenceUpdate = (update: any) => {
    const editor = editorRef.current;
    if (!editor) return;

    if (update.type === 'cursor' && update.data.cursor) {
      const cursors = new Map(remoteCursors);

      cursors.set(update.userId, {
        userId: update.userId,
        userName: update.data.user?.name || `User ${update.userId.slice(-4)}`,
        position: update.data.cursor,
        color: getUserColor(update.userId),
        timestamp: new Date(),
      });

      setRemoteCursors(cursors);
      updateCursorDecorations(editor, cursors);
    }
  };

  const updateCursorDecorations = (
    editor: monaco.editor.IStandaloneCodeEditor,
    cursors: Map<string, RemoteCursor>
  ) => {
    const decorations: monaco.editor.IModelDeltaDecoration[] = [];

    cursors.forEach((cursor) => {
      if (cursor.position) {
        // Add cursor decoration
        decorations.push({
          range: new monaco.Range(
            cursor.position.line,
            cursor.position.column,
            cursor.position.line,
            cursor.position.column
          ),
          options: {
            className: `remote-cursor-${cursor.userId}`,
            hoverMessage: { value: `${cursor.userName}'s cursor` },
            stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            afterContentClassName: `remote-cursor-line-${cursor.userId}`,
          },
        });

        // Add selection decoration if present
        if (cursor.selection) {
          decorations.push({
            range: new monaco.Range(
              cursor.selection.start.line,
              cursor.selection.start.column,
              cursor.selection.end.line,
              cursor.selection.end.column
            ),
            options: {
              className: `remote-selection-${cursor.userId}`,
              hoverMessage: { value: `${cursor.userName}'s selection` },
            },
          });
        }
      }
    });

    editor.createDecorationsCollection(decorations);
  };

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage || !editorRef.current) return;

    const message = JSON.parse(lastMessage.data);

    switch (message.type) {
      case 'cursor':
        handleRemoteCursor(message.userId, message.data);
        break;
      case 'selection':
        handleRemoteSelection(message.userId, message.data);
        break;
      case 'presence':
        handlePresenceUpdate(message.userId, message.data);
        break;
      case '3d_cursor':
        handle3DCursorUpdate(message.userId, message.data);
        break;
      case 'user_joined':
        handleUserJoined(message.data);
        break;
      case 'user_left':
        handleUserLeft(message.userId);
        break;
    }
  }, [lastMessage]);

  const handleRemoteCursor = (userId: string, data: any) => {
    const editor = editorRef.current;
    if (!editor || !data.cursor) return;

    const cursors = new Map(remoteCursors);

    cursors.set(userId, {
      userId,
      userName: data.userName || `User ${userId.slice(-4)}`,
      position: data.cursor,
      color: getUserColor(userId),
      timestamp: new Date(),
    });

    setRemoteCursors(cursors);
    updateCursorDecorations(editor, cursors);
  };

  const handleRemoteSelection = (userId: string, data: any) => {
    const editor = editorRef.current;
    if (!editor) return;

    const cursors = new Map(remoteCursors);
    const existing = cursors.get(userId);

    if (existing) {
      cursors.set(userId, {
        ...existing,
        selection: data.selection,
        timestamp: new Date(),
      });
    }

    setRemoteCursors(cursors);
    updateCursorDecorations(editor, cursors);
  };

  const handlePresenceUpdate = (userId: string, data: any) => {
    const cursors = new Map(remoteCursors);
    const existing = cursors.get(userId);

    if (existing) {
      cursors.set(userId, {
        ...existing,
        status: data.status,
        timestamp: new Date(),
      });
    }

    setRemoteCursors(cursors);
  };

  const handle3DCursorUpdate = (userId: string, data: any) => {
    // Sync cursor position between 3D view and code editor
    const editor = editorRef.current;
    if (!editor || !data.line) return;

    const position = {
      lineNumber: data.line,
      column: data.column || 1,
    };

    // Highlight the line in the editor
    const decorations = editor.createDecorationsCollection([
      {
        range: new monaco.Range(
          position.lineNumber,
          1,
          position.lineNumber,
          1
        ),
        options: {
          isWholeLine: true,
          className: 'remote-cursor-3d-highlight',
          glyphMarginClassName: 'remote-cursor-3d-glyph',
        },
      },
    ]);

    // Remove highlight after 2 seconds
    setTimeout(() => {
      decorations.clear();
    }, 2000);
  };

  const handleUserJoined = (userData: any) => {
    setActiveUsers(prev => [...prev, userData]);
  };

  const handleUserLeft = (userId: string) => {
    setActiveUsers(prev => prev.filter(user => user.userId !== userId));

    // Remove user's cursor
    const cursors = new Map(remoteCursors);
    cursors.delete(userId);
    setRemoteCursors(cursors);

    if (editorRef.current) {
      updateCursorDecorations(editorRef.current, cursors);
    }
  };

  return (
    <div className="relative w-full h-full">
      <Editor
        height="100%"
        language={language}
        value={initialContent}
        onMount={handleEditorDidMount}
        theme={theme}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          renderLineHighlight: 'line',
          automaticLayout: true,
          wordWrap: 'on',
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          cursorBlinking: 'blink',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
        }}
      />

      {/* Connection Status */}
      <div className="absolute top-2 right-2 z-10">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm border ${
            connectionStatus === 'connected'
              ? 'bg-green-500/20 text-green-400 border-green-500/30'
              : connectionStatus === 'connecting'
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              : connectionStatus === 'error'
              ? 'bg-red-500/20 text-red-400 border-red-500/30'
              : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-400' :
              connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
              connectionStatus === 'error' ? 'bg-red-400' : 'bg-gray-400'
            }`}
          />
          {connectionStatus === 'connected' ? 'Connected' :
           connectionStatus === 'connecting' ? 'Connecting...' :
           connectionStatus === 'error' ? 'Connection Error' : 'Disconnected'}
        </div>
      </div>

      {/* Active Users */}
      <div className="absolute top-2 left-2 z-10">
        <div className="flex items-center gap-2 flex-wrap">
          {Array.from(remoteCursors.values()).map((cursor) => (
            <div
              key={cursor.userId}
              className="flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs text-white border"
              style={{ borderColor: cursor.color }}
              title={cursor.userName}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cursor.color }}
              />
              <span className="max-w-20 truncate">
                {cursor.userName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* File info */}
      <div className="absolute bottom-2 left-2 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-300">
          {filePath} • {language}
        </div>
      </div>

      <CursorDecorations cursors={remoteCursors} />
    </div>
  );
}

function getUserColor(userId: string): string {
  // Generate consistent color for each user
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24',
    '#f0932b', '#eb4d4b', '#6ab04c', '#130f40',
    '#e056fd', '#686de0', '#30336b', '#95afc0',
  ];

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}