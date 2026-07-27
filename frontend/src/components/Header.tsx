import React from 'react';
import {
  Sun,
  Moon,
  RefreshCw,
  Database,
  Cpu,
} from 'lucide-react';
import { ActivePage, AppSettings } from '../types';

interface HeaderProps {
  activePage: ActivePage;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onReindexTrigger: () => void;
  isReindexing: boolean;
  totalIndexed: number;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  settings,
  setSettings,
  onReindexTrigger,
  isReindexing,
  totalIndexed,
}) => {
  const getPageTitle = () => {
    switch (activePage) {
      case 'home':
        return 'Explorer';
      case 'recents':
        return 'Recently Indexed';
      case 'favorites':
        return 'Saved Favorites';
      case 'settings':
        return 'Settings';
      default:
        return 'SnapFind';
    }
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    setSettings((prev) => ({ ...prev, theme: nextTheme }));
  };

  return (
    <header className="h-16 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 transition-colors duration-200">
      {/* Title & Page context */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {getPageTitle()}
        </h2>
        <div className="hidden md:flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 rounded-full px-3 py-1 text-xs text-zinc-600 dark:text-zinc-300">
          <Database className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
          <span>{totalIndexed} images indexed</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Re-index / Sync status button */}
        <button
          type="button"
          onClick={onReindexTrigger}
          disabled={isReindexing}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            isReindexing
              ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-500/40 text-blue-600 dark:text-blue-300 cursor-not-allowed'
              : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200'
          }`}
          title="Force quick scan for new screenshots"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin text-blue-500' : 'text-zinc-500 dark:text-zinc-400'}`}
          />
          <span>{isReindexing ? 'Indexing...' : 'Quick Sync'}</span>
        </button>

        {/* Model Engine Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs text-zinc-700 dark:text-zinc-300">
          <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-indigo-400" />
          <span className="font-mono text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            OpenCLIP ViT-B/32
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer"
          title={`Switch theme (Current: ${settings.theme})`}
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-700" />
          )}
        </button>
      </div>
    </header>
  );
};

