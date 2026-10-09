import React, { useState } from 'react';
import {
  Search,
  ListTree,
  FileSpreadsheet,
  X,
  ChevronRight,
} from 'lucide-react';

interface NavigationPaneProps {
  htmlContent: string;
  onClose: () => void;
  onSearchSelect?: (text: string) => void;
}

export const NavigationPane: React.FC<NavigationPaneProps> = ({
  htmlContent,
  onClose,
  onSearchSelect,
}) => {
  const [tab, setTab] = useState<'headings' | 'pages' | 'results'>('headings');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract headings from htmlContent
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const headingEls = Array.from(doc.querySelectorAll('h1, h2, h3'));
  const headings = headingEls.map((el, idx) => ({
    id: idx,
    level: parseInt(el.tagName.replace('H', ''), 10),
    text: el.textContent || 'Untitled Heading',
  }));

  // Search matches
  const textContent = doc.body.textContent || '';
  const searchResults: { snippet: string; index: number }[] = [];
  if (searchQuery.trim().length > 1) {
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    let m;
    while ((m = regex.exec(textContent)) !== null && searchResults.length < 50) {
      const start = Math.max(0, m.index - 20);
      const end = Math.min(textContent.length, m.index + searchQuery.length + 20);
      searchResults.push({
        snippet: '…' + textContent.substring(start, end) + '…',
        index: m.index,
      });
    }
  }

  return (
    <div className="word-sidepane">
      <div className="sidepane-header">
        <span>Navigation</span>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded">
          <X size={14} />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-gray-200 bg-gray-50">
        <div className="relative flex items-center">
          <Search size={13} className="absolute left-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search document…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim().length > 1) {
                setTab('results');
              }
            }}
            className="w-full pl-8 pr-2 py-1 text-xs border border-gray-300 rounded bg-white outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tabs: Headings, Pages, Results */}
      <div className="flex border-b border-gray-200 text-xs font-medium">
        <button
          onClick={() => setTab('headings')}
          className={`flex-1 py-1.5 text-center ${
            tab === 'headings' ? 'border-b-2 border-blue-600 text-blue-700 font-semibold' : 'text-gray-500'
          }`}
        >
          Headings
        </button>
        <button
          onClick={() => setTab('pages')}
          className={`flex-1 py-1.5 text-center ${
            tab === 'pages' ? 'border-b-2 border-blue-600 text-blue-700 font-semibold' : 'text-gray-500'
          }`}
        >
          Pages
        </button>
        <button
          onClick={() => setTab('results')}
          className={`flex-1 py-1.5 text-center ${
            tab === 'results' ? 'border-b-2 border-blue-600 text-blue-700 font-semibold' : 'text-gray-500'
          }`}
        >
          Results ({searchResults.length})
        </button>
      </div>

      {/* Tab Body */}
      <div className="sidepane-body">
        {tab === 'headings' && (
          <div className="flex flex-col gap-1">
            {headings.length === 0 ? (
              <div className="text-xs text-gray-400 italic py-4 text-center">
                No headings in document. Format paragraphs as Heading 1, 2, or 3 to populate outline.
              </div>
            ) : (
              headings.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center gap-1.5 py-1 px-1.5 hover:bg-blue-50 rounded cursor-pointer text-xs transition"
                  style={{ paddingLeft: `${(h.level - 1) * 12 + 6}px` }}
                  onClick={() => {
                    // Focus heading
                    const elements = Array.from(document.querySelectorAll('.ProseMirror h1, .ProseMirror h2, .ProseMirror h3'));
                    elements[h.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                >
                  <ChevronRight size={11} className="text-gray-400 shrink-0" />
                  <span className={`${h.level === 1 ? 'font-semibold text-[#1F4E79]' : 'text-gray-700'}`}>
                    {h.text}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'pages' && (
          <div className="grid grid-cols-2 gap-3 p-1">
            <div className="border border-gray-300 rounded p-2 bg-gray-50 hover:border-blue-500 cursor-pointer shadow-xs text-center">
              <div className="w-full h-24 bg-white border border-gray-200 mb-1 rounded shadow-xs flex items-center justify-center text-[10px] text-gray-400">
                Page 1
              </div>
              <span className="text-xs text-gray-600 font-medium">Page 1</span>
            </div>
          </div>
        )}

        {tab === 'results' && (
          <div className="flex flex-col gap-1">
            {searchResults.length === 0 ? (
              <div className="text-xs text-gray-400 italic py-4 text-center">
                {searchQuery ? 'No matching text found' : 'Type in the search box to find text'}
              </div>
            ) : (
              searchResults.map((res, i) => (
                <div
                  key={i}
                  className="p-1.5 border border-transparent hover:border-gray-200 hover:bg-blue-50 rounded cursor-pointer text-xs text-gray-700 transition"
                  onClick={() => {
                    // Jump to match
                    onSearchSelect?.(searchQuery);
                  }}
                >
                  {res.snippet}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
