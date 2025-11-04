'use client';

import { useEffect } from 'react';
import { RemoteCursor } from '@/types/collaboration';

interface CursorDecorationsProps {
  cursors: Map<string, RemoteCursor>;
}

export function CursorDecorations({ cursors }: CursorDecorationsProps) {
  useEffect(() => {
    // Inject custom styles for remote cursors
    const styleId = 'remote-cursor-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Generate CSS for each user's cursor
    let css = '';

    cursors.forEach((cursor) => {
      const { userId, color } = cursor;

      // Cursor line decoration
      css += `
        .remote-cursor-line-${userId}::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background-color: ${color};
          opacity: 0.6;
          pointer-events: none;
        }
      `;

      // Cursor decoration
      css += `
        .remote-cursor-${userId} {
          border-left: 2px solid ${color};
          background-color: ${color}20;
          box-shadow: 0 0 4px ${color}40;
        }
      `;

      // Selection decoration
      css += `
        .remote-selection-${userId} {
          background-color: ${color}30;
          border: 1px solid ${color}60;
        }
      `;

      // 3D cursor highlight
      css += `
        .remote-cursor-3d-highlight {
          background-color: ${color}15 !important;
          border-left: 3px solid ${color} !important;
        }
      `;

      // 3D cursor glyph
      css += `
        .remote-cursor-3d-glyph::before {
          content: '👁️';
          position: absolute;
          left: -20px;
          top: -2px;
          font-size: 14px;
        }
      `;
    });

    styleElement.textContent = css;

    return () => {
      // Cleanup styles when component unmounts
      if (styleElement && cursors.size === 0) {
        styleElement.remove();
      }
    };
  }, [cursors]);

  return null; // This component only injects styles
}