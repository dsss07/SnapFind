import React, { useState } from 'react';
import { search } from "../services/searchService";
import {
  Search,
  Sparkles,
  Filter,
  SlidersHorizontal,
  X,
  FileCode,
  Receipt,
  MessageSquare,
  Plane,
  Layout,
  Terminal,
  Grid,
  List,
  Layers,
  HelpCircle,
  FolderOpen,
} from 'lucide-react';
import { Screenshot, SearchFilter, SearchResultItem, SearchMode } from '../types';
import { ScreenshotCard } from './ScreenshotCard';

interface HomePageProps {
  screenshots: Screenshot[];
  onSelectScreenshot: (screenshot: Screenshot) => void;
  onToggleFavorite: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  screenshots,
  onSelectScreenshot,
  onToggleFavorite,
}) => {
  const [filter, setFilter] = useState<SearchFilter>({
    query: '',
    category: 'all',
    searchMode: 'hybrid',
    dateRange: 'all',
    minScore: 20,
    sortBy: 'relevance',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  const sampleQueries = [
    { label: '☕ Receipt for Blue Bottle coffee', query: 'blue bottle coffee receipt' },
    { label: '🚨 Error code 500 in python API', query: 'error code 500' },
    { label: '✈️ Delta flight boarding pass SFO', query: 'delta flight boarding pass' },
    { label: '💬 Slack discussion from Sarah', query: 'slack sarah chen' },
    { label: '🎨 Figma AI dashboard wireframe', query: 'figma ai dashboard' },
  ];

  const handleSearch = async () => {
  setLoading(true);

  try {
    const response = await search(filter.query);
    console.log(response.results);
    const mappedResults: SearchResultItem[] = response.results.map((result: any) => ({
      screenshot: result.screenshot,

      score: Math.round(result.rrf_score * 100),

      matchedSnippet: result.screenshot.ocrText.substring(0, 120),

      matchType: "Hybrid",
    }));

    setSearchResults(mappedResults);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const categories = [
    { id: 'all', label: 'All Categories', icon: Layers },
    { id: 'Code', label: 'Code & Dev', icon: FileCode },
    { id: 'Receipts & Invoices', label: 'Receipts & Expenses', icon: Receipt },
    { id: 'Chat', label: 'Chat & Messages', icon: MessageSquare },
    { id: 'Documents', label: 'Flight & Documents', icon: Plane },
    { id: 'Web & Design', label: 'UI & Design', icon: Layout },
  ];

  // Execute Search engine
  const hasSearched = filter.query.trim().length > 0;

  const resultsToDisplay: SearchResultItem[] = hasSearched
  ? searchResults
  : screenshots.map((shot) => ({
      screenshot: shot,
      score: 100,
      matchedSnippet: shot.ocrText.substring(0, 120),
      matchType: "Hybrid",
    }));

  const handleClearSearch = () => {
    setFilter((prev) => ({ ...prev, query: '' }));
  };

  return (
    <div className="min-h-full p-6 max-w-7xl mx-auto space-y-6">
      {/* Search Header Container (Animates/Compacts Upwards after searching) */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          hasSearched
            ? 'py-2'
            : 'py-12 flex flex-col items-center justify-center text-center space-y-6'
        }`}
      >
        {/* Title and subtitle (shown large before searching, smaller when active search) */}
        {!hasSearched ? (
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by OpenCLIP Neural Embeddings & Local OCR</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Search Screenshots in Natural Language
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              Type anything you remember—code snippets, order totals, flight numbers, or visual descriptions like "coffee receipt from yesterday".
            </p>
          </div>
        ) : null}

        {/* Search Bar Input Container */}
        <div className={`w-full max-w-3xl space-y-3`}>
          <div className="relative flex items-center shadow-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
            <div className="pl-5 pr-3 text-zinc-400 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>

            <input
              type="text"
              value={filter.query}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  query: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder='Search screenshots e.g. "error 500", "blue bottle coffee receipt", "boarding pass"...'
              className="w-full py-4 pr-12 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm md:text-base focus:outline-none font-medium"
              autoFocus
            />

            {filter.query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="pr-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`mr-3 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-colors cursor-pointer ${
                showFilters || filter.category !== 'all' || filter.searchMode !== 'hybrid'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Sample Search Prompt Chips */}
          {!hasSearched && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-zinc-500 font-medium mr-1">Try searching:</span>
              {sampleQueries.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFilter((prev) => ({ ...prev, query: item.query }))}
                  className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white text-xs font-medium border border-zinc-200 dark:border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Filters Drawer / Panel */}
      {showFilters && (
        <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-zinc-200 dark:border-zinc-800 text-xs">
            {/* Search Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Search Mode:</span>
              <div className="p-1 bg-zinc-100 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-1">
                {(['hybrid', 'clip', 'ocr'] as SearchMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFilter((prev) => ({ ...prev, searchMode: mode }))}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all capitalize cursor-pointer ${
                      filter.searchMode === mode
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    {mode === 'hybrid'
                      ? 'Hybrid (CLIP + OCR)'
                      : mode === 'clip'
                      ? 'Semantic OpenCLIP'
                      : 'Exact OCR Text'}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Time Range:</span>
              <select
                value={filter.dateRange}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    dateRange: e.target.value as SearchFilter['dateRange'],
                  }))
                }
                className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Sort By:</span>
              <select
                value={filter.sortBy}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    sortBy: e.target.value as SearchFilter['sortBy'],
                  }))
                }
                className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="relevance">Highest Match Relevance</option>
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="size-desc">Largest File Size</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium shrink-0">Category:</span>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isCatActive = filter.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilter((prev) => ({ ...prev, category: cat.id }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                    isCatActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Pills Bar under search bar when search is active */}
      {hasSearched && (
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isCatActive = filter.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilter((prev) => ({ ...prev, category: cat.id }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                    isCatActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            Found <span className="text-blue-600 dark:text-cyan-400 font-bold">{resultsToDisplay.length}</span> screenshots
          </div>
        </div>
      )}

      {/* Results Cards Grid Section */}
      {resultsToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resultsToDisplay.map((item) => (
            <ScreenshotCard
              key={item.screenshot.id}
              item={item}
              onSelect={() => onSelectScreenshot(item.screenshot)}
              onToggleFavorite={(e) => {
                e.stopPropagation();
                onToggleFavorite(item.screenshot.id);
              }}
            />
          ))}
        </div>
      ) : (
        /* Empty / No Results State */
        <div className="py-16 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mx-auto text-zinc-400 dark:text-zinc-500">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-200">No matching screenshots found</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Try adjusting your query, lowering the match threshold in filters, or selecting "All Categories".
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFilter({ query: '', category: 'all', searchMode: 'hybrid', dateRange: 'all', minScore: 20, sortBy: 'relevance' })}
            className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer"
          >
            Reset Search Filters
          </button>
        </div>
      )}
    </div>
  );
};
