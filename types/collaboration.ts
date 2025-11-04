export interface UserPresence {
  userId: string;
  name: string;
  avatar?: string;
  cursor: {
    position: { x: number; y: number; z: number };
    component?: string; // 3D component ID
  };
  selection?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
    filePath: string;
  };
  viewport: {
    camera: { position: [number, number, number]; target: [number, number, number] };
    visibleNodes: string[];
  };
  status: 'active' | 'idle' | 'away';
  lastSeen: Date;
}

export interface CollaborativeDocument {
  id: string;
  projectId: string;
  sessionId: string;
  filePath: string;
  content: any; // Y.Doc or similar
  version: number;
  lastModified: Date;
  modifiedBy: string;
  isActive: boolean;
}

export interface RealtimeUpdate {
  type: 'cursor' | 'selection' | 'content' | 'presence' | 'viewport' | 'connection' | 'error';
  userId: string;
  data: any;
  timestamp: Date;
}

export interface CollaborationSession {
  id: string;
  projectId: string;
  participants: UserPresence[];
  documents: Map<string, CollaborativeDocument>;
  chat: ChatMessage[];
  createdAt: Date;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system' | 'file_share';
}

export interface CodeState {
  id: string;
  projectId: string;
  filePath: string;
  content: string;
  language: string;
  checksum: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  authorId?: string;
  changeLog?: string;
}

export interface CursorPosition {
  line: number;
  column: number;
}

export interface SelectionRange {
  start: CursorPosition;
  end: CursorPosition;
}

export interface RemoteCursor {
  userId: string;
  userName: string;
  position: CursorPosition;
  selection?: SelectionRange;
  color: string;
  timestamp: Date;
}

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  isOpen?: boolean;
  content?: string;
  language?: string;
}