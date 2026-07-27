export interface OCRBlock {
  id: string;
  text: string;
  bbox: {
    x: number;      // percentage (0 - 100)
    y: number;      // percentage (0 - 100)
    width: number;  // percentage
    height: number; // percentage
  };
  confidence: number; // 0 - 1
}

export type AppSource = 
  | 'VS Code' 
  | 'Slack' 
  | 'Safari' 
  | 'Figma' 
  | 'Terminal' 
  | 'Notes' 
  | 'Mail' 
  | 'Twitter / X' 
  | 'Receipt' 
  | 'System';

export type Category = 
  | 'Code' 
  | 'Chat' 
  | 'Receipts & Invoices' 
  | 'Web & Design' 
  | 'Documents' 
  | 'System & Terminal';

export interface Screenshot {
  id: string;
  filename: string;
  filePath: string;
  imageUrl: string;
  appSource: AppSource;
  category: Category;
  createdAt: string; // ISO date format
  dimensions: {
    width: number;
    height: number;
  };
  fileSizeMB: number;
  ocrText: string;
  ocrBlocks: OCRBlock[];
  tags: string[];
  isFavorite: boolean;
}

export type SearchMode = 'hybrid' | 'clip' | 'ocr';

export interface SearchFilter {
  query: string;
  category: string; // 'all' or specific Category
  searchMode: SearchMode;
  dateRange: 'all' | '7d' | '30d' | '1y';
  minScore: number; // 0 - 100
  sortBy: 'relevance' | 'date-desc' | 'date-asc' | 'size-desc';
}

export interface SearchResultItem {
  screenshot: Screenshot;
  score: number; // 0 to 100%
  matchedSnippet: string;
  matchType: 'OpenCLIP Semantic' | 'OCR Text' | 'Hybrid';
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  folderPath: string;
  recursiveScan: boolean;
  allowedExtensions: string[];
  watchdogEnabled: boolean;
  watchdogIntervalSeconds: number;
  autoOCR: boolean;
  clipModel: string;
  ocrEngine: string;
  hardwareAccel: string;
  maxMemoryMB: number;
}

export interface IndexingStats {
  totalFiles: number;
  indexedFiles: number;
  ocrWordsExtracted: number;
  vectorEmbeddingsCount: number;
  dbSizeBytes: number;
  lastScanTime: string;
  watchdogStatus: 'active' | 'paused' | 'error';
}

export type ActivePage = 'home' | 'recents' | 'favorites' | 'settings';
