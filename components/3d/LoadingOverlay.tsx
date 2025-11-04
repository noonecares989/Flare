'use client';

import { useState, useEffect } from 'react';

export function LoadingOverlay() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-white mb-2">Initializing 3D Workspace</h3>
        <p className="text-gray-400 text-sm">Preparing your AI-powered development environment...</p>
      </div>
    </div>
  );
}