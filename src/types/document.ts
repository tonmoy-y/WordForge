export type PageSize = 'letter' | 'a4' | 'legal' | 'executive' | 'a3' | 'a5' | 'custom';
export type PageOrientation = 'portrait' | 'landscape';

export interface PageDimensions {
  widthPt: number;
  heightPt: number;
  widthMm: number;
  heightMm: number;
  name: string;
}

export const PAGE_SIZES: Record<PageSize, PageDimensions> = {
  letter: { widthPt: 612, heightPt: 792, widthMm: 215.9, heightMm: 279.4, name: 'Letter (8.5" x 11")' },
  a4: { widthPt: 595.28, heightPt: 841.89, widthMm: 210, heightMm: 297, name: 'A4 (210 x 297 mm)' },
  legal: { widthPt: 612, heightPt: 1008, widthMm: 215.9, heightMm: 355.6, name: 'Legal (8.5" x 14")' },
  executive: { widthPt: 522, heightPt: 756, widthMm: 184.1, heightMm: 266.7, name: 'Executive (7.25" x 10.5")' },
  a3: { widthPt: 841.89, heightPt: 1190.55, widthMm: 297, heightMm: 420, name: 'A3 (297 x 420 mm)' },
  a5: { widthPt: 419.53, heightPt: 595.28, widthMm: 148, heightMm: 210, name: 'A5 (148 x 210 mm)' },
  custom: { widthPt: 612, heightPt: 792, widthMm: 215.9, heightMm: 279.4, name: 'Custom' },
};

export interface Margins {
  top: number; // in inches
  bottom: number;
  left: number;
  right: number;
  gutter?: number;
}

export const MARGIN_PRESETS: Record<string, { name: string; margins: Margins; description: string }> = {
  normal: { name: 'Normal', margins: { top: 1, bottom: 1, left: 1, right: 1 }, description: 'Top: 1", Bottom: 1", Left: 1", Right: 1"' },
  narrow: { name: 'Narrow', margins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 }, description: 'Top: 0.5", Bottom: 0.5", Left: 0.5", Right: 0.5"' },
  moderate: { name: 'Moderate', margins: { top: 1, bottom: 1, left: 0.75, right: 0.75 }, description: 'Top: 1", Bottom: 1", Left: 0.75", Right: 0.75"' },
  wide: { name: 'Wide', margins: { top: 1, bottom: 1, left: 2, right: 2 }, description: 'Top: 1", Bottom: 1", Left: 2", Right: 2"' },
  mirrored: { name: 'Mirrored', margins: { top: 1, bottom: 1, left: 1.25, right: 1 }, description: 'Inside: 1.25", Outside: 1"' },
};

export interface PageSetup {
  paperSize: PageSize;
  orientation: PageOrientation;
  margins: Margins;
  columns: 1 | 2 | 3;
  headerDistance: number; // inches
  footerDistance: number;
  differentFirstPage: boolean;
  differentOddEven: boolean;
  watermarkText?: string;
  pageColor?: string;
  showPageBorders?: boolean;
}

export interface DocumentMetadata {
  title: string;
  subject: string;
  author: string;
  company: string;
  keywords: string;
  comments: string;
  created: string;
  modified: string;
  wordCount: number;
  charCount: number;
  pageCount: number;
}

export interface HeaderFooterContent {
  headerText: string;
  footerText: string;
  firstPageHeaderText?: string;
  firstPageFooterText?: string;
  showPageNumbers: boolean;
  pageNumberPosition: 'header-left' | 'header-center' | 'header-right' | 'footer-left' | 'footer-center' | 'footer-right';
  pageNumberFormat: '1, 2, 3' | 'a, b, c' | 'i, ii, iii' | 'Page X of Y';
}

export interface TrackChangeItem {
  id: string;
  type: 'insert' | 'delete' | 'format';
  author: string;
  avatarColor: string;
  timestamp: string;
  text: string;
  status: 'pending' | 'accepted' | 'rejected';
  nodeFrom?: number;
  nodeTo?: number;
}

export interface CommentReply {
  id: string;
  author: string;
  timestamp: string;
  text: string;
}

export interface CommentThread {
  id: string;
  author: string;
  avatarColor: string;
  timestamp: string;
  selectedText: string;
  text: string;
  resolved: boolean;
  replies: CommentReply[];
}

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface DrawingStroke {
  id: string;
  pageIndex: number;
  tool: 'pen' | 'highlighter' | 'eraser';
  color: string;
  width: number;
  points: DrawingPoint[];
}

export interface CitationItem {
  id: string;
  key: string;
  type: 'book' | 'article' | 'website' | 'report';
  title: string;
  authors: string;
  year: string;
  journalOrPublisher: string;
  url?: string;
}

export interface MailMergeRecord {
  [field: string]: string;
}

export interface MailMergeState {
  enabled: boolean;
  fields: string[];
  records: MailMergeRecord[];
  currentRecordIndex: number;
  templateDocxBuffer?: ArrayBuffer;
}

export interface DocumentTheme {
  id: string;
  name: string;
  fontHeadings: string;
  fontBody: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  heading1Color: string;
  heading2Color: string;
  lineHeight: number;
  paragraphSpacingPt: number;
}

export interface DocumentState {
  id: string;
  title: string;
  filePath: string | null;
  isDirty: boolean;
  lastSavedAt: string | null;
  htmlContent: string;
  metadata: DocumentMetadata;
  pageSetup: PageSetup;
  headerFooter: HeaderFooterContent;
  trackChanges: TrackChangeItem[];
  trackChangesEnabled: boolean;
  markupDisplayMode: 'all' | 'simple' | 'none' | 'original';
  comments: CommentThread[];
  drawings: DrawingStroke[];
  citations: CitationItem[];
  mailMerge: MailMergeState;
  activeThemeId: string;
  zoomLevel: number; // percentage (10 to 500)
  viewMode: 'print' | 'web' | 'read' | 'focus';
  showRuler: boolean;
  showNavigationPane: boolean;
  showCommentsPane: boolean;
  showTrackChangesPane: boolean;
}
