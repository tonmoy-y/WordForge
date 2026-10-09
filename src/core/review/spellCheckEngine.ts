/**
 * High-performance offline spelling checker
 */

const BASE_WORDS = new Set([
  // Core English vocabulary
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
  'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
  'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up',
  'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time',
  'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
  'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think',
  'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
  'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'word', 'office', 'document',
  'processor', 'page', 'layout', 'format', 'paragraph', 'style', 'table', 'image', 'review',
  'spelling', 'grammar', 'track', 'changes', 'comment', 'header', 'footer', 'margins', 'font',
  'bold', 'italic', 'underline', 'bullets', 'numbering', 'section', 'break', 'reference',
  'citation', 'bibliography', 'mail', 'merge', 'recipient', 'record', 'template', 'export',
  'import', 'save', 'print', 'zoom', 'view', 'ruler', 'desktop', 'software', 'application',
  'system', 'mac', 'macos', 'electron', 'react', 'typescript', 'architecture', 'fidelity',
  'compatibility', 'standards', 'enterprise', 'product', 'project', 'proposal', 'report',
  'executive', 'summary', 'business', 'letter', 'agenda', 'minutes', 'meeting', 'notes',
  'author', 'title', 'subject', 'company', 'keywords', 'data', 'file', 'folder', 'window',
  'welcome', 'recent', 'open', 'close', 'edit', 'undo', 'redo', 'copy', 'paste', 'cut',
  'select', 'find', 'replace', 'dialog', 'button', 'menu', 'ribbon', 'tab', 'toolbar', 'status',
  'navigation', 'pane', 'canvas', 'sheet', 'color', 'theme', 'palette', 'border', 'shading',
  'align', 'center', 'justify', 'left', 'right', 'spacing', 'indent', 'size', 'height', 'width',
  'paper', 'letter', 'legal', 'orientation', 'portrait', 'landscape', 'watermark', 'columns',
  'footnote', 'endnote', 'caption', 'bookmark', 'hyperlink', 'symbol', 'equation', 'date',
  'time', 'pen', 'highlighter', 'eraser', 'stroke', 'drawing', 'ink', 'layer', 'custom',
  'dictionary', 'language', 'english', 'french', 'german', 'spanish', 'statistics', 'words',
  'characters', 'paragraphs', 'lines', 'complete', 'ready', 'active', 'pending', 'accepted',
  'rejected', 'thread', 'reply', 'resolved', 'version', 'number', 'auto', 'offline', 'storage',
  'package', 'distribution', 'bundle', 'installer', 'apple', 'silicon', 'intel', 'universal',
  'perform', 'testing', 'quality', 'assurance', 'audit', 'compliance', 'security', 'isolation',
  'preload', 'ipc', 'channel', 'process', 'renderer', 'main', 'context', 'bridge',
]);

export interface SpellCheckMatch {
  word: string;
  startIndex: number;
  endIndex: number;
  suggestions: string[];
}

export class SpellCheckEngine {
  private dictionary: Set<string>;
  private customDictionary: Set<string>;

  constructor() {
    this.dictionary = new Set(BASE_WORDS);
    this.customDictionary = new Set();
  }

  public addCustomWord(word: string): void {
    const clean = word.trim().toLowerCase();
    if (clean) {
      this.customDictionary.add(clean);
    }
  }

  public isCorrect(word: string): boolean {
    const clean = word.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
    if (!clean || clean.length <= 1 || /^\d+$/.test(clean)) return true;

    return this.dictionary.has(clean) || this.customDictionary.has(clean);
  }

  public getSuggestions(word: string, maxSuggestions = 5): string[] {
    const clean = word.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
    if (!clean) return [];

    const candidates: { word: string; distance: number }[] = [];

    // Search dictionary words with Levenshtein distance <= 2
    for (const dictWord of this.dictionary) {
      if (Math.abs(dictWord.length - clean.length) > 2) continue;
      const distance = this.levenshtein(clean, dictWord);
      if (distance <= 2) {
        candidates.push({ word: dictWord, distance });
      }
    }

    candidates.sort((a, b) => a.distance - b.distance);
    return candidates.slice(0, maxSuggestions).map((c) => c.word);
  }

  public checkText(text: string): SpellCheckMatch[] {
    const matches: SpellCheckMatch[] = [];
    // Match words
    const regex = /\b[A-Za-z']+\b/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const word = match[0];
      if (!this.isCorrect(word)) {
        matches.push({
          word,
          startIndex: match.index,
          endIndex: match.index + word.length,
          suggestions: this.getSuggestions(word),
        });
      }
    }

    return matches;
  }

  private levenshtein(a: string, b: string): number {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = [];

    for (let i = 0; i <= m; i++) {
      dp[i] = [i];
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // deletion
          dp[i][j - 1] + 1,      // insertion
          dp[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return dp[m][n];
  }
}

export const spellCheckEngine = new SpellCheckEngine();
