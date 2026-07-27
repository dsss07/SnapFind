import React from 'react';
import { Heart, Search, Sparkles } from 'lucide-react';
import { Screenshot } from '../types';
import { ScreenshotCard } from './ScreenshotCard';

interface FavoritesPageProps {
  screenshots: Screenshot[];
  onSelectScreenshot: (screenshot: Screenshot) => void;
  onToggleFavorite: (id: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  screenshots,
  onSelectScreenshot,
  onToggleFavorite,
}) => {
  const favorites = screenshots.filter((s) => s.isFavorite);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-rose-500/20" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Saved Favorites</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Quick access to bookmarked receipts, code snippets, and important screenshots
            </p>
          </div>
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          <span className="text-rose-500 font-bold">{favorites.length}</span> favorited
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((shot) => (
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
      ) : (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-200">No favorite screenshots saved</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Click the heart icon on any screenshot card to save it here for quick access.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
