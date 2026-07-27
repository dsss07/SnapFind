import { Screenshot, SearchFilter, SearchResultItem } from '../types';

export function searchScreenshots(
  screenshots: Screenshot[],
  filter: SearchFilter
): SearchResultItem[] {
  const query = filter.query.trim().toLowerCase();
  
  if (!query) {
    // If no query, return all matching category & date range with 100% score
    return screenshots
      .filter((shot) => filterCategory(shot, filter.category))
      .filter((shot) => filterDateRange(shot, filter.dateRange))
      .map((shot) => ({
        screenshot: shot,
        score: 100,
        matchedSnippet: getFirstSnippet(shot.ocrText),
        matchType: 'Hybrid' as SearchResultItem['matchType'],
      }))
      .sort((a, b) => sortResults(a, b, filter.sortBy));
  }

  const queryTokens = query.split(/\s+/).filter(Boolean);

  const results: SearchResultItem[] = [];

  for (const shot of screenshots) {
    if (!filterCategory(shot, filter.category)) continue;
    if (!filterDateRange(shot, filter.dateRange)) continue;

    // 1. OCR Exact / Fuzzy Text Score (0 to 100)
    const ocrTextLower = shot.ocrText.toLowerCase();
    const filenameLower = shot.filename.toLowerCase();
    const tagsLower = shot.tags.map((t) => t.toLowerCase());

    let ocrHits = 0;
    let snippetMatched = '';

    for (const token of queryTokens) {
      if (ocrTextLower.includes(token)) ocrHits += 1.5;
      if (filenameLower.includes(token)) ocrHits += 2.0;
      if (tagsLower.some((t) => t.includes(token))) ocrHits += 2.0;
    }

    const ocrScore = Math.min(100, (ocrHits / queryTokens.length) * 60 + (ocrTextLower.includes(query) ? 40 : 0));

    // Find snippet with query terms
    const lines = shot.ocrText.split('\n');
    const matchedLine = lines.find((line) =>
      queryTokens.some((t) => line.toLowerCase().includes(t))
    );
    snippetMatched = matchedLine || lines[0] || shot.filename;

    // 2. OpenCLIP Semantic Keyword Vector Score simulation (0 to 100)
    let clipScore = calculateSemanticClipScore(query, shot);

    // 3. Combine depending on Search Mode
    let finalScore = 0;
    let matchType: SearchResultItem['matchType'] = 'Hybrid';

    if (filter.searchMode === 'ocr') {
      finalScore = Math.round(ocrScore);
      matchType = 'OCR Text';
    } else if (filter.searchMode === 'clip') {
      finalScore = Math.round(clipScore);
      matchType = 'OpenCLIP Semantic';
    } else {
      // Hybrid
      finalScore = Math.round(clipScore * 0.55 + ocrScore * 0.45);
      matchType = 'Hybrid';
    }

    if (finalScore >= filter.minScore && finalScore > 5) {
      results.push({
        screenshot: shot,
        score: Math.min(99, Math.max(25, finalScore)),
        matchedSnippet: snippetMatched,
        matchType,
      });
    }
  }

  return results.sort((a, b) => sortResults(a, b, filter.sortBy));
}

function filterCategory(shot: Screenshot, category: string): boolean {
  if (category === 'all' || !category) return true;
  return shot.category === category;
}

function filterDateRange(shot: Screenshot, dateRange: string): boolean {
  if (dateRange === 'all') return true;
  const shotDate = new Date(shot.createdAt).getTime();
  const now = new Date().getTime();
  const diffDays = (now - shotDate) / (1000 * 3600 * 24);

  if (dateRange === '7d') return diffDays <= 7;
  if (dateRange === '30d') return diffDays <= 30;
  if (dateRange === '1y') return diffDays <= 365;
  return true;
}

function calculateSemanticClipScore(query: string, shot: Screenshot): number {
  const q = query.toLowerCase();
  let baseScore = 20;

  // Semantic concept map
  const conceptMap: Record<string, string[]> = {
    receipt: ['coffee', 'espresso', 'subtotal', 'tax', 'total', 'dollar', 'croissant', 'order', 'blue bottle', 'apple pay', 'receipt'],
    code: ['python', 'import', 'async', 'def', 'function', 'try', 'except', 'error', 'logger', 'vs code', 'terminal', 'bash'],
    flight: ['airline', 'flight', 'boarding', 'pass', 'gate', 'seat', 'sfo', 'jfk', 'ticket', 'delta', 'first class'],
    chat: ['slack', 'message', 'alert', 'devops', 'sarah', 'team', 'channel', 'discussion'],
    design: ['figma', 'ui', 'dashboard', 'wireframe', 'vector', 'embeddings', 'mockup'],
    error: ['error 500', 'exception', 'critical', 'traceback', 'internal server error', 'failed', 'mismatch'],
  };

  for (const [concept, keywords] of Object.entries(conceptMap)) {
    if (keywords.some((k) => q.includes(k))) {
      // Check if screenshot fits concept
      const textMatches = keywords.filter((k) =>
        shot.ocrText.toLowerCase().includes(k) || shot.tags.some((t) => t.toLowerCase().includes(k))
      ).length;

      baseScore += textMatches * 15;
    }
  }

  // Token fuzzy overlap
  const tokens = q.split(/\s+/);
  tokens.forEach((token) => {
    if (shot.ocrText.toLowerCase().includes(token)) baseScore += 12;
    if (shot.filename.toLowerCase().includes(token)) baseScore += 18;
  });

  return Math.min(98, Math.max(15, baseScore));
}

function getFirstSnippet(text: string): string {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines.slice(0, 2).join(' • ') || 'No preview text extracted';
}

function sortResults(a: SearchResultItem, b: SearchResultItem, sortBy: SearchFilter['sortBy']): number {
  if (sortBy === 'relevance') {
    return b.score - a.score;
  }
  if (sortBy === 'date-desc') {
    return new Date(b.screenshot.createdAt).getTime() - new Date(a.screenshot.createdAt).getTime();
  }
  if (sortBy === 'date-asc') {
    return new Date(a.screenshot.createdAt).getTime() - new Date(b.screenshot.createdAt).getTime();
  }
  if (sortBy === 'size-desc') {
    return b.screenshot.fileSizeMB - a.screenshot.fileSizeMB;
  }
  return 0;
}
