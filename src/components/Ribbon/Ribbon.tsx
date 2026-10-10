import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { HomeTab } from './Tabs/HomeTab';
import { InsertTab } from './Tabs/InsertTab';
import { DrawTab } from './Tabs/DrawTab';
import { DesignTab } from './Tabs/DesignTab';
import { LayoutTab } from './Tabs/LayoutTab';
import { ReferencesTab } from './Tabs/ReferencesTab';
import { MailingsTab } from './Tabs/MailingsTab';
import { ReviewTab } from './Tabs/ReviewTab';
import { ViewTab } from './Tabs/ViewTab';
import { HelpTab } from './Tabs/HelpTab';
import { TableDesignTab } from './Tabs/TableDesignTab';
import { TableLayoutTab } from './Tabs/TableLayoutTab';
import { DocumentState } from '../../types/document';

interface RibbonProps {
  editor: Editor | null;
  docState: DocumentState;
  onUpdateDocState: (updates: Partial<DocumentState>) => void;
  // Drawing states
  drawingMode: 'select' | 'pen' | 'highlighter' | 'eraser';
  setDrawingMode: (mode: 'select' | 'pen' | 'highlighter' | 'eraser') => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  onClearDrawings: () => void;
  // Dialog Openers
  onOpenFind: () => void;
  onOpenReplace: () => void;
  onOpenFontDialog: () => void;
  onOpenParagraphDialog: () => void;
  onOpenTableDialog: () => void;
  onOpenSymbolDialog: () => void;
  onOpenEquationDialog: () => void;
  onOpenPageSetupDialog: () => void;
  onOpenSpellCheck: () => void;
  onOpenWordCount: () => void;
  onOpenShortcuts: () => void;
  onOpenAbout: () => void;
  onCheckUpdates?: () => void;
  onOpenMailMergeDialog: () => void;
  onNewComment: () => void;
}

export type RibbonTabType =
  | 'Home'
  | 'Insert'
  | 'Draw'
  | 'Design'
  | 'Layout'
  | 'References'
  | 'Mailings'
  | 'Review'
  | 'View'
  | 'Help'
  | 'Table Design'
  | 'Table Layout';

export const Ribbon: React.FC<RibbonProps> = (props) => {
  const [activeTab, setActiveTab] = useState<RibbonTabType>('Home');

  const isTableActive = props.editor?.isActive('table') ?? false;

  // If table is newly activated and we are not in table tabs, we can optionally switch
  useEffect(() => {
    if (isTableActive && (activeTab === 'Table Design' || activeTab === 'Table Layout')) {
      // remain in table tab
    } else if (!isTableActive && (activeTab === 'Table Design' || activeTab === 'Table Layout')) {
      setActiveTab('Home');
    }
  }, [isTableActive]);

  const standardTabs: RibbonTabType[] = [
    'Home',
    'Insert',
    'Draw',
    'Design',
    'Layout',
    'References',
    'Mailings',
    'Review',
    'View',
    'Help',
  ];

  return (
    <div className="word-ribbon-container bg-white border-b border-[#CBD5E1] shadow-2xs select-none">
      {/* Ribbon Tab Bar */}
      <div className="word-ribbon-tabs h-9 flex items-center px-3 bg-[#F1F5F9] border-b border-[#CBD5E1] gap-1">
        {standardTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'Draw' && props.drawingMode === 'select') {
                props.setDrawingMode('pen');
              } else if (tab !== 'Draw' && props.drawingMode !== 'select') {
                props.setDrawingMode('select');
              }
            }}
            className={`word-tab-button px-3.5 py-1.5 text-xs font-medium rounded-t transition-all ${
              activeTab === tab
                ? 'bg-white text-[#185ABD] font-semibold border-t-2 border-t-[#185ABD] shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
          >
            {tab}
          </button>
        ))}

        {/* Contextual Table Tabs when a Table is active */}
        {isTableActive && (
          <div className="flex items-center gap-0.5 ml-2 pl-2 border-l border-gray-300">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#185ABD] mr-1">
              Table Tools:
            </span>
            <button
              onClick={() => setActiveTab('Table Design')}
              className={`word-tab-button px-3 py-1.5 text-xs font-semibold rounded-t transition-all ${
                activeTab === 'Table Design'
                  ? 'bg-white text-[#185ABD] border-t-2 border-t-[#185ABD] shadow-2xs'
                  : 'text-[#185ABD] bg-blue-50/60 hover:bg-blue-100/70'
              }`}
            >
              Table Design
            </button>
            <button
              onClick={() => setActiveTab('Table Layout')}
              className={`word-tab-button px-3 py-1.5 text-xs font-semibold rounded-t transition-all ${
                activeTab === 'Table Layout'
                  ? 'bg-white text-[#185ABD] border-t-2 border-t-[#185ABD] shadow-2xs'
                  : 'text-[#185ABD] bg-blue-50/60 hover:bg-blue-100/70'
              }`}
            >
              Layout
            </button>
          </div>
        )}
      </div>

      {/* Ribbon Active Tab Panel */}
      <div className="relative min-h-[94px] h-[94px] bg-white">
        {activeTab === 'Home' && (
          <HomeTab
            editor={props.editor}
            onOpenFind={props.onOpenFind}
            onOpenReplace={props.onOpenReplace}
            onOpenFontDialog={props.onOpenFontDialog}
            onOpenParagraphDialog={props.onOpenParagraphDialog}
          />
        )}
        {activeTab === 'Insert' && (
          <InsertTab
            editor={props.editor}
            onOpenTableDialog={props.onOpenTableDialog}
            onOpenSymbolDialog={props.onOpenSymbolDialog}
            onOpenEquationDialog={props.onOpenEquationDialog}
            onNewComment={props.onNewComment}
          />
        )}
        {activeTab === 'Draw' && (
          <DrawTab
            drawingMode={props.drawingMode}
            setDrawingMode={props.setDrawingMode}
            strokeColor={props.strokeColor}
            setStrokeColor={props.setStrokeColor}
            strokeWidth={props.strokeWidth}
            setStrokeWidth={props.setStrokeWidth}
            onClearDrawings={props.onClearDrawings}
          />
        )}
        {activeTab === 'Design' && (
          <DesignTab
            activeThemeId={props.docState.activeThemeId}
            onSelectTheme={(themeId) => {
              props.onUpdateDocState({ activeThemeId: themeId, isDirty: true });
            }}
            pageSetup={props.docState.pageSetup}
            onUpdatePageSetup={(updates) => {
              props.onUpdateDocState({
                pageSetup: { ...props.docState.pageSetup, ...updates },
                isDirty: true,
              });
            }}
          />
        )}
        {activeTab === 'Layout' && (
          <LayoutTab
            pageSetup={props.docState.pageSetup}
            onUpdatePageSetup={(updates) => {
              props.onUpdateDocState({
                pageSetup: { ...props.docState.pageSetup, ...updates },
                isDirty: true,
              });
            }}
            onOpenPageSetupDialog={props.onOpenPageSetupDialog}
            onInsertBreak={() => {
              props.editor
                ?.chain()
                .focus()
                .insertContent('<div class="page-break" data-page-break="true"><hr></div>')
                .run();
            }}
          />
        )}
        {activeTab === 'References' && (
          <ReferencesTab
            editor={props.editor}
            citations={props.docState.citations}
            onInsertToc={() => {
              // Generate TOC from headings
              const headings = Array.from(document.querySelectorAll('.ProseMirror h1, .ProseMirror h2, .ProseMirror h3'));
              let tocHtml = '<div class="table-of-contents" style="background:#F8FAFC; border:1px solid #CBD5E1; padding:16px; margin:16px 0; border-radius:4px;"><h3 style="margin-top:0; color:#1F4E79;">Table of Contents</h3><ul style="list-style:none; padding-left:0;">';
              headings.forEach((h, i) => {
                const text = h.textContent || `Section ${i + 1}`;
                const level = h.tagName.toLowerCase();
                const pad = level === 'h1' ? '0' : level === 'h2' ? '16px' : '32px';
                tocHtml += `<li style="padding-left:${pad}; margin:4px 0;"><a href="#" style="color:#185ABD; text-decoration:none;">${text} ........................................ Page 1</a></li>`;
              });
              tocHtml += '</ul></div><p></p>';
              props.editor?.chain().focus().insertContent(tocHtml).run();
            }}
            onUpdateToc={() => {}}
            onManageCitations={() => {}}
          />
        )}
        {activeTab === 'Mailings' && (
          <MailingsTab
            editor={props.editor}
            mailMerge={props.docState.mailMerge}
            onUpdateMailMerge={(updates) => {
              props.onUpdateDocState({
                mailMerge: { ...props.docState.mailMerge, ...updates },
                isDirty: true,
              });
            }}
            onOpenMailMergeDialog={props.onOpenMailMergeDialog}
            onFinishAndMerge={props.onOpenMailMergeDialog}
          />
        )}
        {activeTab === 'Review' && (
          <ReviewTab
            editor={props.editor}
            trackChangesEnabled={props.docState.trackChangesEnabled}
            onToggleTrackChanges={() => {
              props.onUpdateDocState({
                trackChangesEnabled: !props.docState.trackChangesEnabled,
                isDirty: true,
              });
            }}
            markupMode={props.docState.markupDisplayMode}
            onSetMarkupMode={(mode) => {
              props.onUpdateDocState({ markupDisplayMode: mode });
            }}
            trackChanges={props.docState.trackChanges}
            onUpdateTrackChanges={(changes) => {
              props.onUpdateDocState({ trackChanges: changes, isDirty: true });
            }}
            onOpenSpellCheck={props.onOpenSpellCheck}
            onOpenWordCount={props.onOpenWordCount}
            onNewComment={props.onNewComment}
            onToggleCommentsPane={() => {
              props.onUpdateDocState({
                showCommentsPane: !props.docState.showCommentsPane,
              });
            }}
            onToggleTrackPane={() => {
              props.onUpdateDocState({
                showTrackChangesPane: !props.docState.showTrackChangesPane,
              });
            }}
          />
        )}
        {activeTab === 'View' && (
          <ViewTab
            viewMode={props.docState.viewMode}
            onSetViewMode={(mode) => props.onUpdateDocState({ viewMode: mode })}
            showRuler={props.docState.showRuler}
            onToggleRuler={() => props.onUpdateDocState({ showRuler: !props.docState.showRuler })}
            showNavPane={props.docState.showNavigationPane}
            onToggleNavPane={() =>
              props.onUpdateDocState({ showNavigationPane: !props.docState.showNavigationPane })
            }
            zoomLevel={props.docState.zoomLevel}
            onSetZoom={(zoom) => props.onUpdateDocState({ zoomLevel: zoom })}
          />
        )}
        {activeTab === 'Help' && (
          <HelpTab
            onOpenShortcuts={props.onOpenShortcuts}
            onOpenAbout={props.onOpenAbout}
            onCheckUpdates={props.onCheckUpdates}
          />
        )}
        {activeTab === 'Table Design' && <TableDesignTab editor={props.editor} />}
        {activeTab === 'Table Layout' && <TableLayoutTab editor={props.editor} />}
      </div>
    </div>
  );
};
