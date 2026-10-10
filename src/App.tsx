import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import FontFamily from '@tiptap/extension-font-family';
import CharacterCount from '@tiptap/extension-character-count';

import { DocumentState, CommentThread } from './types/document';
import { createNewDocument, calculateTextStatistics } from './core/documentModel';
import { StorageService, AppPreferences } from './core/persistence/storage';
import { exportToDocx } from './core/docx/docxExporter';
import { importDocxFile } from './core/docx/docxImporter';
import { exportToPdf } from './core/pdf/pdfExporter';
import { TrackChangesEngine } from './core/review/trackChangesEngine';

import { TitleBar } from './components/TitleBar';
import { Ribbon } from './components/Ribbon/Ribbon';
import { DocumentCanvas } from './components/Editor/DocumentCanvas';
import { StatusBar } from './components/StatusBar';
import { NavigationPane } from './components/Panes/NavigationPane';
import { CommentsPane } from './components/Panes/CommentsPane';
import { TrackChangesPane } from './components/Panes/TrackChangesPane';

// Dialogs
import { FindReplaceDialog } from './components/Dialogs/FindReplaceDialog';
import { PageSetupDialog } from './components/Dialogs/PageSetupDialog';
import { TableDialog } from './components/Dialogs/TableDialog';
import { FontDialog } from './components/Dialogs/FontDialog';
import { ParagraphDialog } from './components/Dialogs/ParagraphDialog';
import { SymbolDialog } from './components/Dialogs/SymbolDialog';
import { EquationDialog } from './components/Dialogs/EquationDialog';
import { WordCountDialog } from './components/Dialogs/WordCountDialog';
import { DocumentPropertiesDialog } from './components/Dialogs/DocumentPropertiesDialog';
import { PreferencesDialog } from './components/Dialogs/PreferencesDialog';
import { WelcomeDialog } from './components/Dialogs/WelcomeDialog';
import { MailMergeDialog } from './components/Dialogs/MailMergeDialog';
import { ShortcutsDialog } from './components/Dialogs/ShortcutsDialog';
import { AboutDialog } from './components/Dialogs/AboutDialog';
import { SpellCheckDialog } from './components/Dialogs/SpellCheckDialog';
import { UpdateDialog } from './components/Dialogs/UpdateDialog';

export const App: React.FC = () => {
  const [docState, setDocState] = useState<DocumentState>(() => createNewDocument('Document 1'));
  const [preferences, setPreferences] = useState<AppPreferences>(() => StorageService.getPreferences());

  // Drawing inking mode
  const [drawingMode, setDrawingMode] = useState<'select' | 'pen' | 'highlighter' | 'eraser'>('select');
  const [strokeColor, setStrokeColor] = useState('#185ABD');
  const [strokeWidth, setStrokeWidth] = useState(2);

  // Active Dialog states
  const [activeDialog, setActiveDialog] = useState<
    | null
    | 'find'
    | 'replace'
    | 'pagesetup'
    | 'table'
    | 'font'
    | 'paragraph'
    | 'symbol'
    | 'equation'
    | 'wordcount'
    | 'docprops'
    | 'preferences'
    | 'welcome'
    | 'mailmerge'
    | 'shortcuts'
    | 'about'
    | 'spellcheck'
    | 'update'
  >(null);

  useEffect(() => {
    (window as any).__openUpdateDialog = () => setActiveDialog('update');
    (window as any).__setActiveDialog = (dlg: any) => setActiveDialog(dlg);
  }, []);

  // TipTap Editor instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      FontFamily,
      CharacterCount,
    ],
    content: docState.htmlContent,
    onUpdate: ({ editor }) => {
      const newHtml = editor.getHTML();
      const stats = calculateTextStatistics(newHtml);

      setDocState((prev) => {
        let updatedTrackChanges = prev.trackChanges;

        // If Track Changes is active, track this revision
        if (prev.trackChangesEnabled) {
          const rev = TrackChangesEngine.createChange('insert', 'Edited content');
          updatedTrackChanges = [...prev.trackChanges, rev];
        }

        return {
          ...prev,
          htmlContent: newHtml,
          isDirty: true,
          metadata: {
            ...prev.metadata,
            wordCount: stats.words,
            charCount: stats.chars,
            pageCount: Math.max(1, Math.ceil(stats.chars / 1800)),
          },
          trackChanges: updatedTrackChanges,
        };
      });
    },
  });

  const updateDocState = (updates: Partial<DocumentState>) => {
    setDocState((prev) => ({ ...prev, ...updates }));
  };

  // AutoSave Draft Timer
  useEffect(() => {
    if (!preferences.autoSaveEnabled) return;
    const interval = setInterval(() => {
      if (docState.isDirty) {
        StorageService.saveDraft(docState);
      }
    }, preferences.autoSaveIntervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [docState, preferences]);

  // Check for crash recovery draft on initial mount
  useEffect(() => {
    const draft = StorageService.getDraft();
    if (draft && draft.state.isDirty) {
      const proceed = confirm(
        `WordForge detected an unsaved draft from ${new Date(
          draft.savedAt
        ).toLocaleString()}.\n\nWould you like to recover it?`
      );
      if (proceed) {
        setDocState(draft.state);
        editor?.commands.setContent(draft.state.htmlContent);
      } else {
        StorageService.clearDraft();
      }
    }
  }, [editor]);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      if (cmdKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (e.shiftKey) handleSaveAs();
        else handleSave();
      } else if (cmdKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleOpen();
      } else if (cmdKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNew();
      } else if (cmdKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      } else if (cmdKey && e.key.toLowerCase() === 'f' && !e.altKey) {
        e.preventDefault();
        setActiveDialog('find');
      } else if (cmdKey && e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setActiveDialog('replace');
      } else if (e.key === 'F7') {
        e.preventDefault();
        setActiveDialog('spellcheck');
      } else if (cmdKey && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        updateDocState({ trackChangesEnabled: !docState.trackChangesEnabled });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [docState]);

  // Document Operations
  const handleNew = () => {
    if (docState.isDirty && !confirm('Discard unsaved changes and create new document?')) {
      return;
    }
    const newDoc = createNewDocument('Document 1');
    setDocState(newDoc);
    editor?.commands.setContent(newDoc.htmlContent);
    StorageService.saveRecentDocument({ id: newDoc.id, title: newDoc.title, filePath: null });
  };

  const handleOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.docx,.wordforge,.doccraft,.html,.htm,.txt';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const fileName = file.name;
      const ext = fileName.split('.').pop()?.toLowerCase();

      if (ext === 'docx') {
        const buffer = await file.arrayBuffer();
        const res = await importDocxFile(buffer);
        const newDoc: DocumentState = {
          ...createNewDocument(fileName.replace(/\.docx$/i, ''), res.html),
          metadata: {
            ...docState.metadata,
            ...res.metadata,
            title: res.metadata.title || fileName.replace(/\.docx$/i, ''),
          },
        };
        setDocState(newDoc);
        editor?.commands.setContent(res.html);
        StorageService.saveRecentDocument({ id: newDoc.id, title: newDoc.title, filePath: file.name });
      } else if (ext === 'wordforge' || ext === 'doccraft') {
        const text = await file.text();
        try {
          const loaded = JSON.parse(text);
          setDocState(loaded);
          editor?.commands.setContent(loaded.htmlContent);
          StorageService.saveRecentDocument({ id: loaded.id, title: loaded.title, filePath: file.name });
        } catch (err) {
          alert('Invalid .wordforge document file');
        }
      } else {
        const text = await file.text();
        const content = ext === 'txt' ? `<p>${text.replace(/\n/g, '<br>')}</p>` : text;
        const newDoc = createNewDocument(fileName, content);
        setDocState(newDoc);
        editor?.commands.setContent(content);
        StorageService.saveRecentDocument({ id: newDoc.id, title: newDoc.title, filePath: file.name });
      }
    };
    input.click();
  };

  const handleSave = async () => {
    // Export real .docx
    try {
      const blob = await exportToDocx(docState);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${docState.title.replace(/\s+/g, '_')}.docx`;
      a.click();
      URL.revokeObjectURL(url);

      updateDocState({ isDirty: false, lastSavedAt: new Date().toISOString() });
      StorageService.clearDraft();
      StorageService.saveRecentDocument({ id: docState.id, title: docState.title, filePath: docState.filePath });
    } catch (e: any) {
      alert(`Save error: ${e.message || String(e)}`);
    }
  };

  const handleSaveAs = () => {
    const newName = prompt('Enter document name:', docState.title);
    if (newName) {
      setDocState((prev) => ({ ...prev, title: newName }));
      setTimeout(handleSave, 50);
    }
  };

  const handleExportDocx = async () => {
    await handleSave();
  };

  const handleExportPdf = async () => {
    await exportToPdf(docState);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewComment = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    const commentText = prompt('Enter your comment:', '');
    if (!commentText) return;

    const newComment: CommentThread = {
      id: 'cmt_' + Math.random().toString(36).substring(2, 9),
      author: 'Current User',
      avatarColor: '#185ABD',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      selectedText: selectedText || 'Selected passage',
      text: commentText,
      resolved: false,
      replies: [],
    };

    updateDocState({
      comments: [...docState.comments, newComment],
      showCommentsPane: true,
      isDirty: true,
    });
  };

  // Native macOS Menu Action Listener via IPC
  useEffect(() => {
    const api = (window as any).electronAPI;
    if (api && api.onMenuAction) {
      api.onMenuAction((action: string) => {
        switch (action) {
          case 'menu:new': handleNew(); break;
          case 'menu:open': handleOpen(); break;
          case 'menu:save': handleSave(); break;
          case 'menu:saveAs': handleSaveAs(); break;
          case 'menu:print': handlePrint(); break;
          case 'menu:pageSetup': setActiveDialog('pagesetup'); break;
          case 'menu:find': setActiveDialog('find'); break;
          case 'menu:replace': setActiveDialog('replace'); break;
          case 'menu:viewPrint': updateDocState({ viewMode: 'print' }); break;
          case 'menu:viewWeb': updateDocState({ viewMode: 'web' }); break;
          case 'menu:viewRead': updateDocState({ viewMode: 'read' }); break;
          case 'menu:viewFocus': updateDocState({ viewMode: 'focus' }); break;
          case 'menu:toggleRuler': updateDocState({ showRuler: !docState.showRuler }); break;
          case 'menu:toggleNavPane': updateDocState({ showNavigationPane: !docState.showNavigationPane }); break;
          case 'menu:insertPageBreak': editor?.chain().focus().insertContent('<div class="page-break" data-page-break="true"><hr></div>').run(); break;
          case 'menu:insertTable': setActiveDialog('table'); break;
          case 'menu:insertSymbol': setActiveDialog('symbol'); break;
          case 'menu:insertEquation': setActiveDialog('equation'); break;
          case 'menu:fontDialog': setActiveDialog('font'); break;
          case 'menu:paragraphDialog': setActiveDialog('paragraph'); break;
          case 'menu:spellCheck': setActiveDialog('spellcheck'); break;
          case 'menu:wordCount': setActiveDialog('wordcount'); break;
          case 'menu:trackChanges': updateDocState({ trackChangesEnabled: !docState.trackChangesEnabled }); break;
          case 'menu:shortcuts': setActiveDialog('shortcuts'); break;
          case 'menu:checkUpdates': setActiveDialog('update'); break;
          case 'menu:about': setActiveDialog('about'); break;
          case 'menu:preferences': setActiveDialog('preferences'); break;
        }
      });
    }
  }, [docState, editor]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#EAECEE] select-none text-slate-800">
      {/* 1. Word for Mac Title Bar */}
      <TitleBar
        docState={docState}
        onSave={handleSave}
        onUndo={() => editor?.chain().focus().undo().run()}
        onRedo={() => editor?.chain().focus().redo().run()}
        onPrint={handlePrint}
        onOpen={handleOpen}
        onSearchOpen={() => setActiveDialog('find')}
        onToggleComments={() => updateDocState({ showCommentsPane: !docState.showCommentsPane })}
        onRenameDocument={(newTitle) => updateDocState({ title: newTitle, isDirty: true })}
        canUndo={editor?.can().undo() || false}
        canRedo={editor?.can().redo() || false}
      />

      {/* 2. Word Ribbon */}
      <Ribbon
        editor={editor}
        docState={docState}
        onUpdateDocState={updateDocState}
        drawingMode={drawingMode}
        setDrawingMode={setDrawingMode}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        onClearDrawings={() => updateDocState({ drawings: [] })}
        onOpenFind={() => setActiveDialog('find')}
        onOpenReplace={() => setActiveDialog('replace')}
        onOpenFontDialog={() => setActiveDialog('font')}
        onOpenParagraphDialog={() => setActiveDialog('paragraph')}
        onOpenTableDialog={() => setActiveDialog('table')}
        onOpenSymbolDialog={() => setActiveDialog('symbol')}
        onOpenEquationDialog={() => setActiveDialog('equation')}
        onOpenPageSetupDialog={() => setActiveDialog('pagesetup')}
        onOpenSpellCheck={() => setActiveDialog('spellcheck')}
        onOpenWordCount={() => setActiveDialog('wordcount')}
        onOpenShortcuts={() => setActiveDialog('shortcuts')}
        onOpenAbout={() => setActiveDialog('about')}
        onCheckUpdates={() => setActiveDialog('update')}
        onOpenMailMergeDialog={() => setActiveDialog('mailmerge')}
        onNewComment={handleNewComment}
      />

      {/* 4. Main Body: Sidepanes + Document Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Navigation Pane (Left) */}
        {docState.showNavigationPane && (
          <NavigationPane
            htmlContent={docState.htmlContent}
            onClose={() => updateDocState({ showNavigationPane: false })}
            onSearchSelect={(txt) => {
              setActiveDialog('find');
            }}
          />
        )}

        {/* Document Editing Canvas */}
        <DocumentCanvas
          editor={editor}
          docState={docState}
          onUpdateDocState={updateDocState}
          drawingMode={drawingMode}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* Comments Pane (Right) */}
        {docState.showCommentsPane && (
          <CommentsPane
            comments={docState.comments}
            onUpdateComments={(cmts) => updateDocState({ comments: cmts, isDirty: true })}
            onClose={() => updateDocState({ showCommentsPane: false })}
          />
        )}

        {/* Track Changes Pane (Right) */}
        {docState.showTrackChangesPane && (
          <TrackChangesPane
            trackChanges={docState.trackChanges}
            onUpdateTrackChanges={(tcs) => updateDocState({ trackChanges: tcs, isDirty: true })}
            onClose={() => updateDocState({ showTrackChangesPane: false })}
          />
        )}
      </div>

      {/* 5. Status Bar */}
      <StatusBar
        docState={docState}
        onSetViewMode={(mode) => updateDocState({ viewMode: mode })}
        onSetZoom={(zoom) => updateDocState({ zoomLevel: zoom })}
        onOpenWordCount={() => setActiveDialog('wordcount')}
        onOpenSpellCheck={() => setActiveDialog('spellcheck')}
      />

      {/* ================= Dialogs / Modals ================= */}
      {activeDialog === 'find' && (
        <FindReplaceDialog
          editor={editor}
          onClose={() => setActiveDialog(null)}
          initialMode="find"
        />
      )}
      {activeDialog === 'replace' && (
        <FindReplaceDialog
          editor={editor}
          onClose={() => setActiveDialog(null)}
          initialMode="replace"
        />
      )}
      {activeDialog === 'pagesetup' && (
        <PageSetupDialog
          pageSetup={docState.pageSetup}
          onSave={(updates) => updateDocState({ pageSetup: { ...docState.pageSetup, ...updates }, isDirty: true })}
          onClose={() => setActiveDialog(null)}
        />
      )}
      {activeDialog === 'table' && (
        <TableDialog editor={editor} onClose={() => setActiveDialog(null)} />
      )}
      {activeDialog === 'font' && (
        <FontDialog editor={editor} onClose={() => setActiveDialog(null)} />
      )}
      {activeDialog === 'paragraph' && (
        <ParagraphDialog editor={editor} onClose={() => setActiveDialog(null)} />
      )}
      {activeDialog === 'symbol' && (
        <SymbolDialog editor={editor} onClose={() => setActiveDialog(null)} />
      )}
      {activeDialog === 'equation' && (
        <EquationDialog editor={editor} onClose={() => setActiveDialog(null)} />
      )}
      {activeDialog === 'wordcount' && (
        <WordCountDialog docState={docState} onClose={() => setActiveDialog(null)} />
      )}
      {activeDialog === 'docprops' && (
        <DocumentPropertiesDialog
          metadata={docState.metadata}
          onSave={(updates) => updateDocState({ metadata: { ...docState.metadata, ...updates }, isDirty: true })}
          onClose={() => setActiveDialog(null)}
        />
      )}
      {activeDialog === 'preferences' && (
        <PreferencesDialog
          preferences={preferences}
          onSave={(newPrefs) => {
            setPreferences(newPrefs);
            StorageService.savePreferences(newPrefs);
          }}
          onClose={() => setActiveDialog(null)}
        />
      )}
      {activeDialog === 'welcome' && (
        <WelcomeDialog
          onNewFromTemplate={(title, html) => {
            const newDoc = createNewDocument(title, html);
            setDocState(newDoc);
            editor?.commands.setContent(html);
            setActiveDialog(null);
          }}
          onOpenExisting={() => {
            setActiveDialog(null);
            handleOpen();
          }}
          onClose={() => setActiveDialog(null)}
        />
      )}
      {activeDialog === 'mailmerge' && (
        <MailMergeDialog
          mailMerge={docState.mailMerge}
          docState={docState}
          onApplyMergedDocument={(mergedHtml) => {
            updateDocState({ htmlContent: mergedHtml, isDirty: true });
            editor?.commands.setContent(mergedHtml);
          }}
          onClose={() => setActiveDialog(null)}
        />
      )}
      {activeDialog === 'shortcuts' && (
        <ShortcutsDialog onClose={() => setActiveDialog(null)} />
      )}
      {activeDialog === 'about' && (
        <AboutDialog onClose={() => setActiveDialog(null)} />
      )}
      {activeDialog === 'spellcheck' && (
        <SpellCheckDialog editor={editor} onClose={() => setActiveDialog(null)} />
      )}
      {activeDialog === 'update' && (
        <UpdateDialog onClose={() => setActiveDialog(null)} />
      )}
    </div>
  );
};
