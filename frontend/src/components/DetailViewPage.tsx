import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  EyeOff,
  FileText,
  Info,
  Calendar,
  Tag,
  ExternalLink,
  Search,
  Download,
  Folder,
  Layers,
  Sparkles,
  Plus,
  X,
} from 'lucide-react';
import { Screenshot, OCRBlock } from '../types';

interface DetailViewPageProps {
  screenshot: Screenshot;
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
  onUpdateTags: (id: string, tags: string[]) => void;
}

export const DetailViewPage: React.FC<DetailViewPageProps> = ({
  screenshot,
  onBack,
  onToggleFavorite,
  onUpdateTags,
}) => {
  const [showOcrBoxes, setShowOcrBoxes] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTab, setActiveTab] = useState<'ocr' | 'meta'>('ocr');
  const [copiedText, setCopiedText] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);
  const [ocrFilter, setOcrFilter] = useState('');
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [selectedBlockText, setSelectedBlockText] = useState<string | null>(null);

  // New Tag Input
  const [newTagInput, setNewTagInput] = useState('');

  const handleCopyOcrText = () => {
    navigator.clipboard.writeText(screenshot.ocrText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(screenshot.filePath);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    const updated = Array.from(new Set([...screenshot.tags, newTagInput.trim().toLowerCase()]));
    onUpdateTags(screenshot.id, updated);
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = screenshot.tags.filter((t) => t !== tagToRemove);
    onUpdateTags(screenshot.id, updated);
  };

  const handleExportTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([screenshot.ocrText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${screenshot.filename}_OCR.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formattedDate = new Date(screenshot.createdAt).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  // Filter OCR lines for search inside text
  const ocrLines = screenshot.ocrText.split('\n').filter(Boolean);
  const filteredOcrLines = ocrLines.filter((line) =>
    line.toLowerCase().includes(ocrFilter.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden transition-colors duration-200">
      {/* Top Action Header Bar */}
      <div className="h-14 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search</span>
          </button>
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-md font-mono">
            {screenshot.filename}
          </h2>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-3">
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.2))}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-2 text-zinc-700 dark:text-zinc-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* OCR Overlays Toggle */}
          <button
            type="button"
            onClick={() => setShowOcrBoxes(!showOcrBoxes)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              showOcrBoxes
                ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/40'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {showOcrBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">OCR Bounding Boxes</span>
          </button>

          {/* Copy OCR Button */}
          <button
            type="button"
            onClick={handleCopyOcrText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />}
            <span>{copiedText ? 'Copied OCR!' : 'Copy OCR Text'}</span>
          </button>

          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={() => onToggleFavorite(screenshot.id)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              screenshot.isFavorite
                ? 'bg-rose-500/20 text-rose-500 border-rose-500/40'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:text-zinc-900 dark:hover:text-white'
            }`}
            title="Toggle Favorite"
          >
            <Heart className={`w-4 h-4 ${screenshot.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Screenshot View + Right Metadata/OCR Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Canvas Main Screenshot Area */}
        <div className="flex-1 bg-zinc-200/50 dark:bg-zinc-950 p-6 overflow-auto flex items-center justify-center relative select-none">
          <div
            className="relative transition-transform duration-200 shadow-xl rounded-xl overflow-hidden border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* The Main High-Res Screenshot Image */}
            <img
              src={screenshot.imageUrl}
              alt={screenshot.filename}
              className="max-w-none w-auto max-h-[75vh] object-contain rounded-xl"
            />

            {/* Interactive OCR Bounding Box Overlay Layer */}
            {showOcrBoxes && (
              <div className="absolute inset-0 pointer-events-auto">
                {screenshot.ocrBlocks.map((block) => {
                  const isHovered = hoveredBlockId === block.id;
                  return (
                    <div
                      key={block.id}
                      onMouseEnter={() => setHoveredBlockId(block.id)}
                      onMouseLeave={() => setHoveredBlockId(null)}
                      onClick={() => {
                        setSelectedBlockText(block.text);
                        navigator.clipboard.writeText(block.text);
                      }}
                      className={`absolute rounded transition-all cursor-pointer border-2 ${
                        isHovered
                          ? 'bg-blue-500/30 border-blue-600 dark:border-cyan-400 shadow-lg z-20'
                          : 'bg-blue-500/10 border-blue-500/40 hover:bg-blue-500/20'
                      }`}
                      style={{
                        left: `${block.bbox.x}%`,
                        top: `${block.bbox.y}%`,
                        width: `${block.bbox.width}%`,
                        height: `${block.bbox.height}%`,
                      }}
                      title={`Click to copy line: "${block.text}"`}
                    >
                      {/* Bounding box tooltip tag */}
                      {isHovered && (
                        <div className="absolute -top-7 left-0 bg-white dark:bg-zinc-900 border border-blue-500 dark:border-cyan-400 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-blue-700 dark:text-cyan-300 shadow-md whitespace-nowrap z-30">
                          {block.text} ({Math.round(block.confidence * 100)}% confidence)
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notification when clicking OCR box */}
          {selectedBlockText && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-emerald-900 text-emerald-100 border border-emerald-500/40 px-4 py-2 rounded-xl text-xs font-mono font-medium shadow-xl flex items-center gap-2 z-30 animate-in fade-in slide-in-from-bottom-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copied text block: "{selectedBlockText}"</span>
              <button
                type="button"
                onClick={() => setSelectedBlockText(null)}
                className="ml-2 text-emerald-300 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Bar with Metadata & Extracted OCR Text */}
        <div className="w-96 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col shrink-0">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 p-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('ocr')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'ocr'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Extracted OCR Text</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('meta')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'meta'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>Metadata & Details</span>
            </button>
          </div>

          {/* TAB 1: Extracted OCR Text */}
          {activeTab === 'ocr' ? (
            <div className="flex-1 p-4 flex flex-col space-y-4 overflow-hidden">
              {/* Search Inside OCR Text */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
                <input
                  type="text"
                  value={ocrFilter}
                  onChange={(e) => setOcrFilter(e.target.value)}
                  placeholder="Find inside extracted text..."
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* Text Area line-by-line */}
              <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 overflow-y-auto space-y-2 text-xs font-mono">
                {filteredOcrLines.length > 0 ? (
                  filteredOcrLines.map((line, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/50 p-1 rounded transition-colors group cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(line);
                        setSelectedBlockText(line);
                      }}
                      title="Click line to copy"
                    >
                      <span className="text-zinc-400 dark:text-zinc-600 select-none text-[10px] w-6 text-right">
                        {idx + 1}
                      </span>
                      <p className="text-zinc-700 dark:text-zinc-300 break-words flex-1 group-hover:text-blue-600 dark:group-hover:text-cyan-300">
                        {line}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-400 dark:text-zinc-500 text-center py-6">No matching text found</p>
                )}
              </div>

              {/* OCR Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={handleCopyOcrText}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All Extracted Text</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportTxt}
                  className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
                  title="Export TXT File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* TAB 2: Metadata & Details */
            <div className="flex-1 p-5 space-y-6 overflow-y-auto text-xs">
              {/* File Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[10px]">
                  File Specification
                </h4>

                <div className="space-y-2.5 bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div>
                    <span className="text-zinc-500 text-[11px] block">Full Path</span>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="font-mono text-zinc-700 dark:text-zinc-300 truncate text-[11px]" title={screenshot.filePath}>
                        {screenshot.filePath}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyPath}
                        className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white shrink-0 cursor-pointer"
                        title="Copy file path"
                      >
                        {copiedPath ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
                    <div>
                      <span className="text-zinc-500 text-[11px] block">Dimensions</span>
                      <span className="font-mono text-zinc-800 dark:text-zinc-200">
                        {screenshot.dimensions.width} x {screenshot.dimensions.height} px
                      </span>
                    </div>

                    <div>
                      <span className="text-zinc-500 text-[11px] block">File Size</span>
                      <span className="font-mono text-zinc-800 dark:text-zinc-200">{screenshot.fileSizeMB} MB</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
                    <span className="text-zinc-500 text-[11px] block">Captured Date</span>
                    <span className="text-zinc-800 dark:text-zinc-200 font-medium">{formattedDate}</span>
                  </div>
                </div>
              </div>

              {/* Source App & Category */}
              <div className="space-y-3">
                <h4 className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[10px]">
                  Detection & AI Engine
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <span className="text-zinc-500 text-[11px] block">Source App</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm mt-0.5 block">
                      {screenshot.appSource}
                    </span>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <span className="text-zinc-500 text-[11px] block">Category</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm mt-0.5 block">
                      {screenshot.category}
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
                  <span className="text-zinc-500 text-[11px] block">OpenCLIP Neural Embedding</span>
                  <p className="text-indigo-600 dark:text-indigo-300 font-mono text-[11px]">
                    512-dimensional vector generated via ViT-B/32
                  </p>
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[10px]">
                  Tags & Keywords
                </h4>

                <div className="flex flex-wrap gap-1.5">
                  {screenshot.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-zinc-400 hover:text-rose-500 ml-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add New Tag Form */}
                <form onSubmit={handleAddTag} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder="Add new tag..."
                    className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
