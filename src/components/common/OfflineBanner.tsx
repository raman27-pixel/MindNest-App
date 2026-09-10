import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';

/**
 * Persistent banner that automatically appears when the browser goes offline.
 * Disappears when connection is restored. Uses navigator.onLine + event listeners.
 */
export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
      setJustReconnected(false);
    };
    const handleOnline = () => {
      setIsOffline(false);
      setDismissed(false);
      setJustReconnected(true);
      // Auto-hide the reconnected banner after 3s
      setTimeout(() => setJustReconnected(false), 3000);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (dismissed) return null;

  // Reconnected flash banner
  if (justReconnected) {
    return (
      <div className="w-full bg-emerald-500 text-white text-xs font-black px-4 py-2 flex items-center justify-center gap-2 animate-fade-in z-50">
        <Wifi className="w-4 h-4 shrink-0" />
        <span>Back online! MindNest is fully synced.</span>
      </div>
    );
  }

  // Offline warning banner
  if (isOffline) {
    return (
      <div className="w-full bg-amber-500 text-white text-xs font-black px-4 py-2 flex items-center justify-between gap-2 z-50">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
          <span>
            You're offline — all cached memories & activities are still available.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss offline banner"
          className="shrink-0 w-5 h-5 rounded-full bg-amber-600/40 hover:bg-amber-700/60 flex items-center justify-center transition-all"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return null;
};
