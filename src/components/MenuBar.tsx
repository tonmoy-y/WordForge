import React, { useState, useRef, useEffect } from 'react';

interface MenuBarProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onExportPdf: () => void;
  onExportDocx: () => void;
  onPrint: () => void;
  onPageSetup: () => void;
  onDocProps: () => void;
  onPreferences: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onFind: () => void;
  onReplace: () => void;
  onSelectAll: () => void;
  onInsertTable: () => void;
  onInsertImage: () => void;
  onInsertPageBreak: () => void;
  onInsertSymbol: () => void;
  onInsertEquation: () => void;
  onFontDialog: () => void;
  onParagraphDialog: () => void;
  onWordCount: () => void;
  onSpellCheck: () => void;
  onToggleTrackChanges: () => void;
  onToggleRuler: () => void;
  onToggleNavPane: () => void;
  onAbout: () => void;
  onCheckUpdates?: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = (props) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleItemClick = (action: () => void) => {
    setActiveMenu(null);
    action();
  };

  return (
    <div ref={menuBarRef} className="word-menubar relative select-none">
      {/* File Menu */}
      <div className="relative">
        <span
          className={`word-menu-item ${activeMenu === 'File' ? 'active' : ''}`}
          onClick={() => handleMenuClick('File')}
        >
          File
        </span>
        {activeMenu === 'File' && (
          <div className="absolute top-6 left-0 w-56 bg-white border border-gray-300 rounded shadow-lg py-1 z-50 text-xs">
            <button onClick={() => handleItemClick(props.onNew)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between">
              <span>New Document</span> <span className="text-gray-400">⌘N</span>
            </button>
            <button onClick={() => handleItemClick(props.onOpen)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between">
              <span>Open…</span> <span className="text-gray-400">⌘O</span>
            </button>
            <div className="h-px bg-gray-200 my-1" />
            <button onClick={() => handleItemClick(props.onSave)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between">
              <span>Save</span> <span className="text-gray-400">⌘S</span>
            </button>
            <button onClick={() => handleItemClick(props.onSaveAs)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between">
              <span>Save As…</span> <span className="text-gray-400">⇧⌘S</span>
            </button>
            <div className="h-px bg-gray-200 my-1" />
            <button onClick={() => handleItemClick(props.onExportDocx)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white">
              Export to Word (.docx)…
            </button>
            <button onClick={() => handleItemClick(props.onExportPdf)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white">
              Export to PDF…
            </button>
            <button onClick={() => handleItemClick(props.onPrint)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between">
              <span>Print…</span> <span className="text-gray-400">⌘P</span>
            </button>
            <div className="h-px bg-gray-200 my-1" />
            <button onClick={() => handleItemClick(props.onPageSetup)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white">
              Page Setup…
            </button>
            <button onClick={() => handleItemClick(props.onDocProps)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white">
              Document Properties…
            </button>
            <button onClick={() => handleItemClick(props.onPreferences)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between">
              <span>Preferences…</span> <span className="text-gray-400">⌘,</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Menu */}
      <div className="relative">
        <span
          className={`word-menu-item ${activeMenu === 'Edit' ? 'active' : ''}`}
          onClick={() => handleMenuClick('Edit')}
        >
          Edit
        </span>
        {activeMenu === 'Edit' && (
          <div className="absolute top-6 left-0 w-52 bg-white border border-gray-300 rounded shadow-lg py-1 z-50 text-xs">
            <button onClick={() => handleItemClick(props.onUndo)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between">
              <span>Undo</span> <span className="text-gray-400">⌘Z</span>
            </button>
            <button onClick={() => handleItemClick(props.onRedo)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between">
              <span>Redo</span> <span className="text-gray-400">⌘Y</span>
            </button>
            <div className="h-px bg-gray-200 my-1" />
            <button onClick={() => handleItemClick(props.onSelectAll)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between">
              <span>Select All</span> <span className="text-gray-400">⌘A</span>
            </button>
            <div className="h-px bg-gray-200 my-1" />
            <button onClick={() => handleItemClick(props.onFind)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between">
              <span>Find…</span> <span className="text-gray-400">⌘F</span>
            </button>
            <button onClick={() => handleItemClick(props.onReplace)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between">
              <span>Replace…</span> <span className="text-gray-400">⌥⌘F</span>
            </button>
          </div>
        )}
      </div>

      {/* View Menu */}
      <div className="relative">
        <span
          className={`word-menu-item ${activeMenu === 'View' ? 'active' : ''}`}
          onClick={() => handleMenuClick('View')}
        >
          View
        </span>
        {activeMenu === 'View' && (
          <div className="absolute top-6 left-0 w-52 bg-white border border-gray-300 rounded shadow-lg py-1 z-50 text-xs">
            <button onClick={() => handleItemClick(props.onToggleRuler)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white">
              Toggle Ruler
            </button>
            <button onClick={() => handleItemClick(props.onToggleNavPane)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white">
              Navigation Pane
            </button>
          </div>
        )}
      </div>

      {/* Insert Menu */}
      <div className="relative">
        <span
          className={`word-menu-item ${activeMenu === 'Insert' ? 'active' : ''}`}
          onClick={() => handleMenuClick('Insert')}
        >
          Insert
        </span>
        {activeMenu === 'Insert' && (
          <div className="absolute top-6 left-0 w-52 bg-white border border-gray-300 rounded shadow-lg py-1 z-50 text-xs">
            <button onClick={() => handleItemClick(props.onInsertPageBreak)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between">
              <span>Page Break</span> <span className="text-gray-400">⌘↵</span>
            </button>
            <button onClick={() => handleItemClick(props.onInsertTable)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white">
              Table…
            </button>
            <button onClick={() => handleItemClick(props.onInsertImage)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white">
              Picture…
            </button>
            <div className="h-px bg-gray-200 my-1" />
            <button onClick={() => handleItemClick(props.onInsertSymbol)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white">
              Symbol…
            </button>
            <button onClick={() => handleItemClick(props.onInsertEquation)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white">
              Equation…
            </button>
          </div>
        )}
      </div>

      {/* Format Menu */}
      <div className="relative">
        <span
          className={`word-menu-item ${activeMenu === 'Format' ? 'active' : ''}`}
          onClick={() => handleMenuClick('Format')}
        >
          Format
        </span>
        {activeMenu === 'Format' && (
          <div className="absolute top-6 left-0 w-52 bg-white border border-gray-300 rounded shadow-lg py-1 z-50 text-xs">
            <button onClick={() => handleItemClick(props.onFontDialog)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between">
              <span>Font…</span> <span className="text-gray-400">⌘D</span>
            </button>
            <button onClick={() => handleItemClick(props.onParagraphDialog)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white">
              Paragraph…
            </button>
          </div>
        )}
      </div>

      {/* Tools Menu */}
      <div className="relative">
        <span
          className={`word-menu-item ${activeMenu === 'Tools' ? 'active' : ''}`}
          onClick={() => handleMenuClick('Tools')}
        >
          Tools
        </span>
        {activeMenu === 'Tools' && (
          <div className="absolute top-6 left-0 w-52 bg-white border border-gray-300 rounded shadow-lg py-1 z-50 text-xs">
            <button onClick={() => handleItemClick(props.onSpellCheck)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between">
              <span>Spelling & Grammar…</span> <span className="text-gray-400">F7</span>
            </button>
            <button onClick={() => handleItemClick(props.onWordCount)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white">
              Word Count…
            </button>
            <div className="h-px bg-gray-200 my-1" />
            <button onClick={() => handleItemClick(props.onToggleTrackChanges)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between">
              <span>Track Changes</span> <span className="text-gray-400">⇧⌘E</span>
            </button>
          </div>
        )}
      </div>

      {/* Help Menu */}
      <div className="relative">
        <span
          className={`word-menu-item ${activeMenu === 'Help' ? 'active' : ''}`}
          onClick={() => handleMenuClick('Help')}
        >
          Help
        </span>
        {activeMenu === 'Help' && (
          <div className="absolute top-6 left-0 w-52 bg-white border border-gray-300 rounded shadow-lg py-1 z-50 text-xs">
            <button onClick={() => handleItemClick(props.onAbout)} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white">
              About WordForge Pro
            </button>
            <div className="h-px bg-gray-200 my-1" />
            <button onClick={() => handleItemClick(props.onCheckUpdates || (() => {}))} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white">
              Check for Updates…
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
