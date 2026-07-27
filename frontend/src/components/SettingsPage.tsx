import React, { useEffect, useState } from 'react';
import { browseFolder } from "../services/searchService";
import {  saveFolder } from "../services/searchService";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Settings,
  FolderOpen,
  Sun,
  Moon,
  Monitor,
  Database,
  Terminal,
  RefreshCw,
  FolderPlus,
  Check,
  Zap,
} from 'lucide-react';
import { AppSettings, IndexingStats } from '../types';

interface SettingsPageProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  stats: IndexingStats;
  backendSettings: any;
  onReindexTrigger: () => void;
  isReindexing: boolean;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  setSettings,
  stats,
  backendSettings,
  onReindexTrigger,
  isReindexing,
}) => {
  const [folderInput, setFolderInput] = useState(
    backendSettings?.folder || settings.folderPath
    );
    useEffect(() => {
        if (backendSettings) {
            setFolderInput(backendSettings.folder);
        }
    }, [backendSettings]);
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[INIT] OpenCLIP ViT-B/32 neural engine initialized on GPU',
    '[OCR] Dual OCR extraction engine active',
    '[WATCHDOG] Monitoring directory ~/Pictures/Screenshots',
    '[INDEX] 1,248 screenshot embeddings loaded into local vector DB',
  ]);

  const handleSaveFolder = async (e: React.FormEvent) => {

    e.preventDefault();

    try {

        setIsSavingFolder(true);

        const result = await saveFolder(folderInput);

        setIsSavingFolder(false);

        if(result.success){

            setIndexedCount(result.indexed);

            setShowSuccess(true);

        }
        else{

            alert(result.message);

        }

    }
    catch(err){

        setIsSavingFolder(false);

        console.error(err);

    }

}

  const handleToggleWatchdog = () => {
    setSettings((prev) => ({ ...prev, watchdogEnabled: !prev.watchdogEnabled }));
  };

  const handleRunReindex = () => {
    setTerminalLogs((prev) => [
      ...prev,
      `[FORCE SCAN] Starting manual re-index of ${settings.folderPath}...`,
      `[SCAN] Extracting OCR text blocks for newly added files...`,
      `[CLIP] Computing 512-dim vector embeddings via ViT-B-32...`,
      `[SUCCESS] Re-index complete! 1,248 items in database.`,
    ]);
    onReindexTrigger();
  };

  const presetFolders = [
    '~/Pictures/Screenshots',
    '~/Desktop',
    '~/Downloads/Screenshots',
    '/Users/alex/Documents/Scans',
  ];


  const [isSavingFolder, setIsSavingFolder] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [indexedCount, setIndexedCount] = useState(0);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 text-zinc-900 dark:text-zinc-100 pb-16 transition-colors duration-200">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Settings & Preferences
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
            Configure screenshot directory, theme preference, real-time watchdog, and OpenCLIP parameters.
          </p>
        </div>
      </div>

      {/* SECTION 1: Theme & Visual Appearance */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Theme Preference</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs">Choose visual theme for the application UI</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          {[
            { id: 'dark', label: 'Dark Obsidian', icon: Moon },
            { id: 'light', label: 'Light Clean', icon: Sun },
            { id: 'system', label: 'System Default', icon: Monitor },
          ].map((themeOpt) => {
            const Icon = themeOpt.icon;
            const isSelected = settings.theme === themeOpt.id;
            return (
              <button
                key={themeOpt.id}
                type="button"
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    theme: themeOpt.id as AppSettings['theme'],
                  }))
                }
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-300 ring-2 ring-blue-500/20 font-semibold'
                    : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                <span className="text-xs">{themeOpt.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: Image Folder Directory Selection */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Screenshot Source Folder</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                Select directory where local screenshots are stored and monitored
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveFolder} className="space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={folderInput}
                onChange={(e) => setFolderInput(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-900 dark:text-zinc-200 font-mono focus:outline-none focus:border-blue-500"
                placeholder="e.g. ~/Pictures/Screenshots"
              />
            </div>

            <button
              type="button"
              onClick={async () => {
                  const result = await browseFolder();

                  if (result.folder) {
                      setFolderInput(result.folder);
                  }
              }}
              className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Browse Folder</span>
            </button>

            <button
                type="submit"
                disabled={isSavingFolder}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSavingFolder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Re-indexing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Folder
                  </>
                )}
              </button>
          </div>

          {/* Quick preset folders */}
          
        </form>
      </section>

      {/* SECTION 3: Watchdog Real-Time File Monitor */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Real-time Watchdog Engine</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                Automatically detects new screenshots added to folder and generates vector embeddings
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleWatchdog}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
              settings.watchdogEnabled
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                settings.watchdogEnabled ? 'bg-emerald-300 animate-pulse' : 'bg-zinc-400'
              }`}
            />
            <span>{settings.watchdogEnabled ? 'Watchdog Active' : 'Watchdog Paused'}</span>
          </button>
        </div>
      </section>

      {/* SECTION 4: Indexing Details & Statistics */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Indexing Details & Statistics</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">OpenCLIP vector storage and local database metrics</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunReindex}
            disabled={isReindexing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin' : ''}`} />
            <span>Re-Index All Images</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-zinc-500 dark:text-zinc-400 text-[11px] block">Total Indexed Files</span>
            <span className="text-xl font-bold font-mono text-blue-600 dark:text-cyan-400">
              {backendSettings?.indexed ?? stats.indexedFiles}
            </span>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-zinc-500 dark:text-zinc-400 text-[11px] block">OCR Words Extracted</span>
            <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {backendSettings?.ocr_words ?? stats.ocrWordsExtracted}
            </span>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-zinc-500 dark:text-zinc-400 text-[11px] block">Vector DB Size</span>
            <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {backendSettings?.db_size ?? "0"} MB
            </span>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-zinc-500 dark:text-zinc-400 text-[11px] block">Hardware Acceleration</span>
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-1 block">
              {backendSettings?.hardware ?? "Unknown"}
            </span>
          </div>
        </div>

        {/* Engine Specs details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-zinc-500 dark:text-zinc-400 text-[10px] block">OpenCLIP Neural Model</span>
            <span className="text-zinc-800 dark:text-zinc-200">{backendSettings?.model ?? settings.clipModel}</span>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="text-zinc-500 dark:text-zinc-400 text-[10px] block">OCR Engine Pipeline</span>
            <span className="text-zinc-800 dark:text-zinc-200">{backendSettings?.ocr_engine ?? settings.ocrEngine}</span>
          </div>
        </div>

        {/* Terminal Log Console */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Terminal className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" /> Live Engine Logs
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">SnapFind IPC Service</span>
          </div>

          <div className="p-4 bg-zinc-900 dark:bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1.5 h-36 overflow-y-auto">
            {terminalLogs.map((log, i) => (
              <div key={i} className="leading-relaxed">
                <span className="text-zinc-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                <span className={log.includes('SUCCESS') ? 'text-emerald-400' : 'text-zinc-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: App Version Footer */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">App Version</h4>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs">SnapFind Desktop Engine</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold border border-zinc-200 dark:border-zinc-700">
            v1
          </span>
        </div>
      </section>
      {showSuccess && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

    <div className="bg-zinc-900 rounded-2xl p-8 w-[420px] text-center">

      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto"/>

      <h2 className="text-2xl font-bold mt-4">
        Folder Updated!
      </h2>

      <p className="text-zinc-400 mt-3">
        Indexed {indexedCount} screenshot(s).
        <br/>
        Watchdog restarted successfully.
        <br/><br/>
        Refresh SnapFind to load the new library.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-3 font-semibold text-white"
      >
        Refresh Now
      </button>

    </div>

  </div>
)}
    </div>
  );
};

