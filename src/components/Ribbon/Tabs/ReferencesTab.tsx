import React from 'react';
import {
  BookOpen,
  RefreshCw,
  FilePlus,
  Quote,
  BookmarkCheck,
  Library,
  Tag,
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { CitationItem } from '../../../types/document';

interface ReferencesTabProps {
  editor: Editor | null;
  citations: CitationItem[];
  onInsertToc: () => void;
  onUpdateToc: () => void;
  onManageCitations: () => void;
}

export const ReferencesTab: React.FC<ReferencesTabProps> = ({
  editor,
  citations,
  onInsertToc,
  onUpdateToc,
  onManageCitations,
}) => {
  if (!editor) return null;

  const handleInsertFootnote = () => {
    const note = prompt('Enter footnote text:', 'Note details here...');
    if (note) {
      editor.chain().focus().insertContent(`<sup>[1]</sup>`).run();
      // Append footnote definition at end
      editor.commands.insertContent(`<p style="font-size: 9pt; color: #555; border-top: 1px solid #ddd; margin-top: 16px;"><sup>1</sup> ${note}</p>`);
    }
  };

  const handleInsertEndnote = () => {
    const note = prompt('Enter endnote text:', 'Endnote reference details...');
    if (note) {
      editor.chain().focus().insertContent(`<sup>(i)</sup>`).run();
    }
  };

  const handleInsertCitation = () => {
    if (citations.length === 0) {
      alert('No citations in document source library. Click Manage Sources to add references.');
      return;
    }
    const cit = citations[0];
    editor.chain().focus().insertContent(` (${cit.authors}, ${cit.year}) `).run();
  };

  const handleInsertBibliography = () => {
    if (citations.length === 0) {
      alert('No citations found.');
      return;
    }
    let biblioHtml = '<h2>References</h2><ul>';
    citations.forEach((c) => {
      biblioHtml += `<li><strong>${c.authors}</strong> (${c.year}). <em>${c.title}</em>. ${c.journalOrPublisher}.</li>`;
    });
    biblioHtml += '</ul>';
    editor.chain().focus().insertContent(biblioHtml).run();
  };

  return (
    <div className="word-ribbon-panel">
      {/* 1. Table of Contents */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button onClick={onInsertToc} className="ribbon-btn-large" title="Insert Automatic Table of Contents">
            <BookOpen size={22} className="text-[#185ABD]" />
            <span>Table of Contents</span>
          </button>
          <button onClick={onUpdateToc} className="ribbon-btn-large" title="Update Table of Contents headings">
            <RefreshCw size={22} className="text-[#107C41]" />
            <span>Update Table</span>
          </button>
        </div>
        <div className="word-group-label">Table of Contents</div>
      </div>

      <div className="word-group-separator" />

      {/* 2. Footnotes */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button onClick={handleInsertFootnote} className="ribbon-btn-large" title="Insert Footnote (⌥⌘F)">
            <FilePlus size={22} className="text-[#2B579A]" />
            <span>Insert Footnote</span>
          </button>
          <button onClick={handleInsertEndnote} className="ribbon-btn-large" title="Insert Endnote (⌥⌘E)">
            <BookmarkCheck size={22} className="text-[#2B579A]" />
            <span>Insert Endnote</span>
          </button>
        </div>
        <div className="word-group-label">Footnotes</div>
      </div>

      <div className="word-group-separator" />

      {/* 3. Citations & Bibliography */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button onClick={handleInsertCitation} className="ribbon-btn-large" title="Insert In-Text Citation">
            <Quote size={22} className="text-[#185ABD]" />
            <span>Insert Citation</span>
          </button>
          <button onClick={onManageCitations} className="ribbon-btn-large" title="Manage Source Bibliography">
            <Library size={22} className="text-[#107C41]" />
            <span>Manage Sources</span>
          </button>
          <button onClick={handleInsertBibliography} className="ribbon-btn-large" title="Insert Formatted Bibliography">
            <BookOpen size={22} className="text-[#2B579A]" />
            <span>Bibliography</span>
          </button>
        </div>
        <div className="word-group-label">Citations & Bibliography</div>
      </div>

      <div className="word-group-separator" />

      {/* 4. Captions */}
      <div className="word-ribbon-group">
        <div className="word-group-content">
          <button
            onClick={() => {
              const caption = prompt('Enter Figure / Table caption:', 'Figure 1: Architecture Diagram');
              if (caption) {
                editor.chain().focus().insertContent(`<p style="font-size: 10pt; color: #555; font-style: italic; text-align: center;">${caption}</p>`).run();
              }
            }}
            className="ribbon-btn-large"
            title="Insert Caption"
          >
            <Tag size={22} className="text-[#742774]" />
            <span>Insert Caption</span>
          </button>
        </div>
        <div className="word-group-label">Captions</div>
      </div>
    </div>
  );
};
