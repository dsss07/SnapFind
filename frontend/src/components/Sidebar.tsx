import React from 'react';
import {
  Home,
  Settings,
  Clock,
  Heart,
  Sparkles,
  FolderOpen,
  Cpu,
  Layers,
} from 'lucide-react';
import { ActivePage, IndexingStats } from '../types';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  stats: IndexingStats;
  favoriteCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  stats,
  favoriteCount,
}) => {
  const navItems = [
    {
      id: 'home' as ActivePage,
      label: 'Explorer',
      icon: Home,
      badge: null,
    },
    {
      id: 'recents' as ActivePage,
      label: 'Recents',
      icon: Clock,
      badge: null,
    },
    {
      id: 'favorites' as ActivePage,
      label: 'Favorites',
      icon: Heart,
      badge: favoriteCount > 0 ? favoriteCount : null,
    },
    {
      id: 'settings' as ActivePage,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0 select-none text-zinc-300">
      <div>
        {/* App Logo & Title */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-md">
              S
            </div>
            <div>
              <h1 className="font-semibold text-white text-sm tracking-tight flex items-center gap-1.5">
                SnapFind
              </h1>
              <p className="text-[11px] text-zinc-400 font-medium">
                OpenCLIP + Local OCR
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Indexing Status Panel & App Version at Bottom */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 space-y-3">
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1">
              <FolderOpen className="w-3.5 h-3.5 text-zinc-500" /> Folder
            </span>
            <span className="font-mono text-zinc-300 truncate max-w-[110px]">
              ~/Pictures/Screenshots
            </span>
          </div>

          <div className="flex justify-between text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-zinc-500" /> Indexed
            </span>
            <span className="font-mono text-blue-400 font-semibold">
              {stats.indexedFiles.toLocaleString()} files
            </span>
          </div>

          <div className="flex justify-between text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-zinc-500" /> Neural Model
            </span>
            <span className="font-mono text-zinc-300">OpenCLIP ViT</span>
          </div>
        </div>

        {/* App Version */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
          <span className="text-zinc-500 font-medium">SnapFind Engine</span>
          <span className="font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-bold border border-zinc-700/80">
            v1
          </span>
        </div>
      </div>
    </aside>
  );
};

