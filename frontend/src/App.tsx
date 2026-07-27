import React, { useState, useEffect } from 'react';
import {
  ActivePage,
  Screenshot,
  AppSettings,
  IndexingStats,
} from './types';
import { getAllScreenshots } from "./services/searchService";
import { INITIAL_SCREENSHOTS, DEFAULT_SETTINGS } from './data/mockScreenshots';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { DetailViewPage } from './components/DetailViewPage';
import { SettingsPage } from './components/SettingsPage';
import { RecentsPage } from './components/RecentsPage';
import { FavoritesPage } from './components/FavoritesPage';
import { quickSync} from "./services/searchService";
import {
    getSettings
} from "./services/searchService";


export default function App() {
  // Navigation State
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);

  // Application Data State
 const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
 useEffect(() => {
  async function loadScreenshots() {
    try {
      const data = await getAllScreenshots();
      setScreenshots(data);
    } catch (err) {
      console.error("Failed to load screenshots:", err);
    }
  }

  loadScreenshots();
}, []);

  // Application Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('ai_screenshot_finder_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Re-indexing state
  const [isReindexing, setIsReindexing] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('ai_screenshot_finder_data', JSON.stringify(screenshots));
  }, [screenshots]);

  useEffect(() => {
    localStorage.setItem('ai_screenshot_finder_settings', JSON.stringify(settings));

    const applyTheme = () => {
      let isDark = settings.theme === 'dark';
      if (settings.theme === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings]);

  // Favorite toggle handler
  const handleToggleFavorite = (id: string) => {
    setScreenshots((prev) =>
      prev.map((shot) =>
        shot.id === id ? { ...shot, isFavorite: !shot.isFavorite } : shot
      )
    );
    if (selectedScreenshot && selectedScreenshot.id === id) {
      setSelectedScreenshot((prev) =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      );
    }
  };

  // Tags update handler
  const handleUpdateTags = (id: string, newTags: string[]) => {
    setScreenshots((prev) =>
      prev.map((shot) => (shot.id === id ? { ...shot, tags: newTags } : shot))
    );
    if (selectedScreenshot && selectedScreenshot.id === id) {
      setSelectedScreenshot((prev) => (prev ? { ...prev, tags: newTags } : null));
    }
  };

  // Trigger manual re-index scan
  const handleReindexTrigger = async () => {

  setIsReindexing(true);

  try {

    const result = await quickSync();

    console.log(result);

    const screenshots = await getAllScreenshots();

    setScreenshots(screenshots);

  } catch (err) {

    console.error(err);

  } finally {

    setIsReindexing(false);

  }

};

  // Compute live stats
  const stats: IndexingStats = {
    totalFiles: screenshots.length,
    indexedFiles: screenshots.length,
    ocrWordsExtracted: screenshots.reduce(
      (acc, s) => acc + s.ocrText.split(/\s+/).filter(Boolean).length,
      0
    ),
    vectorEmbeddingsCount: screenshots.length * 512,
    dbSizeBytes: screenshots.length * 28000 + 42000000,
    lastScanTime: new Date().toLocaleTimeString(),
    watchdogStatus: settings.watchdogEnabled ? 'active' : 'paused',
  };

  const favoriteCount = screenshots.filter((s) => s.isFavorite).length;

  const [backendSettings, setBackendSettings] = useState<any>(null);
  useEffect(() => {
    async function loadSettings() {
        const data = await getSettings();
        setBackendSettings(data);
    }

    loadSettings();

}, []);

  return (
    <div className="h-screen w-screen flex bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 overflow-hidden antialiased transition-colors duration-200">
      {/* Left Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          setSelectedScreenshot(null);
        }}
        stats={stats}
        favoriteCount={favoriteCount}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        {/* Top Header (Only shown when not in full detail view) */}
        {!selectedScreenshot && (
          <Header
            activePage={activePage}
            settings={settings}
            setSettings={setSettings}
            onReindexTrigger={handleReindexTrigger}
            isReindexing={isReindexing}
            totalIndexed={screenshots.length}
          />
        )}

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-y-auto relative">
          {selectedScreenshot ? (
            /* Detailed View Page */
            <DetailViewPage
              screenshot={selectedScreenshot}
              onBack={() => setSelectedScreenshot(null)}
              onToggleFavorite={handleToggleFavorite}
              onUpdateTags={handleUpdateTags}
            />
          ) : activePage === 'home' ? (
            /* Home Page */
            <HomePage
              screenshots={screenshots}
              onSelectScreenshot={(screenshot) => setSelectedScreenshot(screenshot)}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : activePage === 'recents' ? (
            /* Recents Page */
            <RecentsPage
              screenshots={screenshots}
              onSelectScreenshot={(screenshot) => setSelectedScreenshot(screenshot)}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : activePage === 'favorites' ? (
            /* Favorites Page */
            <FavoritesPage
              screenshots={screenshots}
              onSelectScreenshot={(screenshot) => setSelectedScreenshot(screenshot)}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
            /* Settings Page */
            <SettingsPage
              settings={settings}
              setSettings={setSettings}
              stats={stats}
              backendSettings={backendSettings}
              onReindexTrigger={handleReindexTrigger}
              isReindexing={isReindexing}
          />
          )}
        </main>
      </div>
    </div>
  );
}

