import React from 'react';
import {
  Heart,
  Sparkles,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import { SearchResultItem } from '../types';

interface ScreenshotCardProps {
  item: SearchResultItem;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const ScreenshotCard: React.FC<ScreenshotCardProps> = ({
  item,
  onSelect,
  onToggleFavorite,
}) => {
  const { screenshot, score, matchedSnippet } = item;

  // Score match badge style
  const getScoreColor = (val: number) => {
    if (val >= 90) return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50';
    if (val >= 75) return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50';
    return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
  };

  const formattedDate = new Date(screenshot.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      onClick={onSelect}
      className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Image Preview Container */}
      <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-950 overflow-hidden border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
        <img
          src={screenshot.imageUrl}
          alt={screenshot.filename}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />

        {/* App Source Badge Top Left */}
        <div className="absolute top-2 left-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 shadow-sm">
          {screenshot.appSource}
        </div>

        {/* Favorite Button Top Right */}
        <button
          type="button"
          onClick={onToggleFavorite}
          className={`absolute top-2 right-2 p-2 rounded-lg backdrop-blur-md transition-transform active:scale-95 shadow-sm cursor-pointer ${
            screenshot.isFavorite
              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-500'
              : 'bg-white/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
          title={screenshot.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-3.5 h-3.5 ${screenshot.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
          />
        </button>

        {/* Score Badge Bottom Right */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border backdrop-blur-md flex items-center gap-1 shadow-sm ${getScoreColor(
              score
            )}`}
          >
            <Sparkles className="w-3 h-3" />
            {score}% CLIP Match
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Filename */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {screenshot.filename}
            </h3>
          </div>

          {/* OCR Matched Text Snippet */}
          <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300 font-mono leading-relaxed line-clamp-2">
            <span className="text-blue-600 dark:text-cyan-400 font-bold mr-1">OCR:</span>
            {matchedSnippet}
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-zinc-400" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Inspect</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

