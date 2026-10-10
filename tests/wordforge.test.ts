import { describe, it, expect, beforeEach } from 'vitest';
import {
  createNewDocument,
  calculateTextStatistics,
  DEFAULT_PAGE_SETUP,
} from '../src/core/documentModel';
import {
  calculatePages,
  getPageDimensionsPx,
} from '../src/core/pagination/paginationEngine';
import { exportToDocx } from '../src/core/docx/docxExporter';
import { importDocxFile } from '../src/core/docx/docxImporter';
import { spellCheckEngine } from '../src/core/review/spellCheckEngine';
import {
  parseCsvRecipients,
  substituteMergeFields,
  generateMergedBatch,
} from '../src/core/mailmerge/mailMergeEngine';
import { TrackChangesEngine } from '../src/core/review/trackChangesEngine';
import { StorageService } from '../src/core/persistence/storage';
import { DocumentState } from '../src/types/document';

if (typeof Blob !== 'undefined' && !Blob.prototype.arrayBuffer) {
  Blob.prototype.arrayBuffer = function () {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(this);
    });
  };
}

describe('WordForge Word Processor Engine Test Suite', () => {
  let doc: DocumentState;

  beforeEach(() => {
    doc = createNewDocument('Test Document');
  });

  describe('1. Document Model & Statistics', () => {
    it('initializes a default document with correct metadata and page setup', () => {
      expect(doc.title).toBe('Test Document');
      expect(doc.pageSetup.paperSize).toBe('letter');
      expect(doc.pageSetup.orientation).toBe('portrait');
      expect(doc.pageSetup.margins.top).toBe(1);
      expect(doc.pageSetup.margins.left).toBe(1);
      expect(doc.headerFooter.showPageNumbers).toBe(true);
      expect(doc.isDirty).toBe(false);
    });

    it('calculates word, character, and paragraph statistics accurately', () => {
      const sampleHtml = '<h1>Heading</h1><p>The quick brown fox jumps over the lazy dog.</p><p>Second paragraph.</p>';
      const stats = calculateTextStatistics(sampleHtml);
      expect(stats.words).toBe(12);
      expect(stats.paragraphs).toBe(3);
      expect(stats.chars).toBeGreaterThan(50);
      expect(stats.charsNoSpaces).toBeLessThan(stats.chars);
    });
  });

  describe('2. Multi-Page Pagination Engine', () => {
    it('calculates pixel dimensions correctly for Letter and A4 sizes at 96 DPI', () => {
      const letterPx = getPageDimensionsPx({ ...DEFAULT_PAGE_SETUP, paperSize: 'letter', orientation: 'portrait' });
      expect(letterPx.pageWidthPx).toBe(816);
      expect(letterPx.pageHeightPx).toBe(1056);
      expect(letterPx.marginTopPx).toBe(96);
      expect(letterPx.contentWidthPx).toBe(624);

      const a4Px = getPageDimensionsPx({ ...DEFAULT_PAGE_SETUP, paperSize: 'a4', orientation: 'portrait' });
      expect(a4Px.pageWidthPx).toBe(794);
      expect(a4Px.pageHeightPx).toBe(1123);
    });

    it('swaps width and height when orientation is landscape', () => {
      const landscape = getPageDimensionsPx({ ...DEFAULT_PAGE_SETUP, paperSize: 'letter', orientation: 'landscape' });
      expect(landscape.pageWidthPx).toBe(1056);
      expect(landscape.pageHeightPx).toBe(816);
    });

    it('splits content across multiple pages when explicit page breaks are inserted', () => {
      const htmlWithBreak = '<p>Page One Content</p><div class="page-break" data-page-break="true"></div><p>Page Two Content</p>';
      const pages = calculatePages(htmlWithBreak, DEFAULT_PAGE_SETUP);
      expect(pages.length).toBe(2);
      expect(pages[0].pageNumber).toBe(1);
      expect(pages[0].totalPageCount).toBe(2);
      expect(pages[0].htmlContent).toContain('Page One Content');
      expect(pages[1].pageNumber).toBe(2);
      expect(pages[1].htmlContent).toContain('Page Two Content');
    });

    it('flows heavy overflowing content automatically onto subsequent pages', () => {
      let heavyHtml = '';
      for (let i = 0; i < 50; i++) {
        heavyHtml += `<p>Paragraph ${i}: Extensive legal and architectural document text flowing across page boundaries with standard line spacing and typographic fidelity.</p>`;
      }
      const pages = calculatePages(heavyHtml, DEFAULT_PAGE_SETUP);
      expect(pages.length).toBeGreaterThan(1);
    });
  });

  describe('3. OpenXML DOCX Export and Import Interoperability', () => {
    it('exports document state to real DOCX binary blob with tables, headings, and headers', async () => {
      const blob = await exportToDocx(doc);
      expect(blob).toBeDefined();
      expect(blob.size).toBeGreaterThan(1000);

      const arrayBuffer = await blob.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      expect(uint8[0]).toBe(0x50);
      expect(uint8[1]).toBe(0x4b);
    });

    it('round-trips: exports to DOCX and reimports with preserved structure', async () => {
      const testContent = '<h1>Executive Summary</h1><p>High fidelity word processing on macOS.</p><table><tr><th>Header</th></tr><tr><td>Data Cell</td></tr></table>';
      const testDoc = {
        ...doc,
        htmlContent: testContent,
        metadata: {
          ...doc.metadata,
          title: 'Roundtrip Test',
          author: 'WordForge QA',
        },
      };

      const docxBlob = await exportToDocx(testDoc);
      const arrayBuffer = await docxBlob.arrayBuffer();

      const importResult = await importDocxFile(arrayBuffer);
      expect(importResult.html).toBeDefined();
      expect(importResult.html).toContain('Executive Summary');
      expect(importResult.html).toContain('High fidelity word processing on macOS.');
      expect(importResult.html).toContain('Header');
      expect(importResult.html).toContain('Data Cell');
      expect(importResult.metadata.title).toBe('Roundtrip Test');
      expect(importResult.metadata.author).toBe('WordForge QA');
    });
  });

  describe('4. Offline Spelling & Proofing Engine', () => {
    it('accurately identifies correct words and flags typos', () => {
      expect(spellCheckEngine.isCorrect('document')).toBe(true);
      expect(spellCheckEngine.isCorrect('processor')).toBe(true);
      expect(spellCheckEngine.isCorrect('documnt')).toBe(false);
      expect(spellCheckEngine.isCorrect('prcessr')).toBe(false);
    });

    it('generates close suggestions using Levenshtein distance', () => {
      const suggestions = spellCheckEngine.getSuggestions('documnt');
      expect(suggestions).toContain('document');
    });

    it('supports adding words to custom dictionary', () => {
      expect(spellCheckEngine.isCorrect('WordForge')).toBe(false);
      spellCheckEngine.addCustomWord('WordForge');
      expect(spellCheckEngine.isCorrect('WordForge')).toBe(true);
    });
  });

  describe('5. Mail Merge Engine', () => {
    it('parses CSV input into structured recipient records', () => {
      const csv = `FirstName,LastName,Company\nAlice,Smith,Acme\nBob,Jones,Initech`;
      const res = parseCsvRecipients(csv);
      expect(res.fields).toEqual(['FirstName', 'LastName', 'Company']);
      expect(res.records.length).toBe(2);
      expect(res.records[0].FirstName).toBe('Alice');
      expect(res.records[1].Company).toBe('Initech');
    });

    it('substitutes merge field placeholders in templates', () => {
      const template = '<p>Dear &laquo;FirstName&raquo; &laquo;LastName&raquo;, welcome to {{Company}}.</p>';
      const record = { FirstName: 'John', LastName: 'Doe', Company: 'OmniCorp' };
      const merged = substituteMergeFields(template, record);
      expect(merged).toBe('<p>Dear John Doe, welcome to OmniCorp.</p>');
    });

    it('generates batch merged documents with page breaks', () => {
      const template = '<p>Hello <<FirstName>></p>';
      const records = [{ FirstName: 'User1' }, { FirstName: 'User2' }];
      const batch = generateMergedBatch(template, records);
      expect(batch).toContain('Hello User1');
      expect(batch).toContain('Hello User2');
      expect(batch).toContain('page-break');
    });
  });

  describe('6. Track Changes & Revisions Engine', () => {
    it('creates and tracks revision items with author and status', () => {
      const rev = TrackChangesEngine.createChange('insert', 'Added sentence', 'Dr. Watson');
      expect(rev.type).toBe('insert');
      expect(rev.text).toBe('Added sentence');
      expect(rev.author).toBe('Dr. Watson');
      expect(rev.status).toBe('pending');
    });

    it('handles individual accept and reject operations', () => {
      const rev1 = TrackChangesEngine.createChange('insert', 'First');
      const rev2 = TrackChangesEngine.createChange('delete', 'Second');
      let list = [rev1, rev2];

      list = TrackChangesEngine.acceptChange(list, rev1.id);
      expect(list.find((c) => c.id === rev1.id)?.status).toBe('accepted');
      expect(list.find((c) => c.id === rev2.id)?.status).toBe('pending');

      list = TrackChangesEngine.rejectChange(list, rev2.id);
      expect(list.find((c) => c.id === rev2.id)?.status).toBe('rejected');
    });

    it('supports accept all and reject all batch operations', () => {
      const r1 = TrackChangesEngine.createChange('insert', 'A');
      const r2 = TrackChangesEngine.createChange('insert', 'B');
      const accepted = TrackChangesEngine.acceptAllChanges([r1, r2]);
      expect(accepted.every((c) => c.status === 'accepted')).toBe(true);

      const rejected = TrackChangesEngine.rejectAllChanges([r1, r2]);
      expect(rejected.every((c) => c.status === 'rejected')).toBe(true);
    });
  });

  describe('7. Automatic Update Engine', () => {
    it('accurately compares semantic version strings', async () => {
      const { UpdateService } = await import('../src/core/updater/updateService');

      expect(UpdateService.compareVersions('1.2.1', '1.2.0')).toBe(1);
      expect(UpdateService.compareVersions('2.0.0', '1.9.9')).toBe(1);
      expect(UpdateService.compareVersions('1.2.0', '1.2.1')).toBe(-1);
      expect(UpdateService.compareVersions('1.2.0', '1.2.0')).toBe(0);
      expect(UpdateService.compareVersions('v1.3.0', '1.2.0')).toBe(1);
      expect(UpdateService.compareVersions('1.2.0', 'v1.3.0')).toBe(-1);
    });

    it('returns a fallback payload safely when network is unavailable or throws', async () => {
      const { UpdateService, CURRENT_VERSION } = await import('../src/core/updater/updateService');
      const result = await UpdateService.checkForUpdates();
      expect(result).toBeDefined();
      expect(result.version).toBeDefined();
      expect(typeof result.isNewer).toBe('boolean');
    });
  });
});

