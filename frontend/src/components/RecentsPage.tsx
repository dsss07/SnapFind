import React from 'react';
import { Clock, Calendar, Search } from 'lucide-react';
import { Screenshot } from '../types';
import { ScreenshotCard } from './ScreenshotCard';

interface RecentsPageProps {
  screenshots: Screenshot[];
  onSelectScreenshot: (screenshot: Screenshot) => void;
  onToggleFavorite: (id: string) => void;
}

export const RecentsPage: React.FC<RecentsPageProps> = ({
  screenshots,
  onSelectScreenshot,
  onToggleFavorite,
}) => {
  // Sort screenshots by date descending
  const sorted = [...screenshots].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Recent Screenshots</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Timeline view of newly detected and indexed screenshots
            </p>
          </div>
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          <span className="text-blue-600 dark:text-cyan-400 font-bold">{sorted.length}</span> items total
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((shot) => (
          <ScreenshotCard
            key={shot.id}
            item={{
              screenshot: shot,
              score: 100,
              matchedSnippet: shot.ocrText.split('\n')[0] || shot.filename,
              matchType: 'Hybrid',
            }}
            onSelect={() => onSelectScreenshot(shot)}
            onToggleFavorite={(e) => {
              e.stopPropagation();
              onToggleFavorite(shot.id);
            }}
          />
        ))}
      </div>
    </div>
  );
};
