import React, { useState } from 'react';
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
import { DocumentState, PageSetup, MailMergeState, TrackChangeItem } from '../../types/document';

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
  onOpenMailMergeDialog: () => void;
  onNewComment: () => void;
}

export const Ribbon: React.FC<RibbonProps> = (props) => {
  const [activeTab, setActiveTab] = useState<
    'Home' | 'Insert' | 'Draw' | 'Design' | 'Layout' | 'References' | 'Mailings' | 'Review' | 'View' | 'Help'
  >('Home');

  const tabs: Array<
    'Home' | 'Insert' | 'Draw' | 'Design' | 'Layout' | 'References' | 'Mailings' | 'Review' | 'View' | 'Help'
  > = [
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
    <div className="word-ribbon-container">
      {/* Ribbon Tab Bar */}
      <div className="word-ribbon-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              // If entering Draw tab, switch to pen automatically if currently select
              if (tab === 'Draw' && props.drawingMode === 'select') {
                props.setDrawingMode('pen');
              } else if (tab !== 'Draw' && props.drawingMode !== 'select') {
                props.setDrawingMode('select');
              }
            }}
            className={`word-tab-button ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ribbon Active Tab Panel */}
      <div className="relative">
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
            onSelectTheme={(themeId) => props.onUpdateDocState({ activeThemeId: themeId })}
            pageSetup={props.docState.pageSetup}
            onUpdatePageSetup={(updates) =>
              props.onUpdateDocState({
                pageSetup: { ...props.docState.pageSetup, ...updates },
                isDirty: true,
              })
            }
          />
        )}
        {activeTab === 'Layout' && (
          <LayoutTab
            pageSetup={props.docState.pageSetup}
            onUpdatePageSetup={(updates) =>
              props.onUpdateDocState({
                pageSetup: { ...props.docState.pageSetup, ...updates },
                isDirty: true,
              })
            }
            onOpenPageSetupDialog={props.onOpenPageSetupDialog}
            onInsertBreak={(type) => {
              props.editor?.chain().focus().insertContent('<div class="page-break" data-page-break="true"><hr></div>').run();
            }}
          />
        )}
        {activeTab === 'References' && (
          <ReferencesTab
            editor={props.editor}
            citations={props.docState.citations}
            onInsertToc={() => {
              // Generate automatic table of contents
              const headings = Array.from(document.querySelectorAll('.ProseMirror h1, .ProseMirror h2, .ProseMirror h3'));
              let tocHtml = '<div class="toc-container" style="background:#F8FAFC; border:1px solid #CBD5E1; padding:12px; margin:16px 0; border-radius:4px;"><h3 style="margin-top:0; color:#1F4E79;">Table of Contents</h3><ul style="list-style:none; padding-left:0;">';
              headings.forEach((h, idx) => {
                const tag = h.tagName.toLowerCase();
                const text = h.textContent || '';
                const indent = tag === 'h1' ? '0' : tag === 'h2' ? '16px' : '32px';
                tocHtml += `<li style="padding-left: ${indent}; margin: 4px 0;"><a href="#" style="text-decoration:none; color:#185ABD; display:flex; justify-content:space-between;"><span>${text}</span><span style="color:#888;">${idx + 1}</span></a></li>`;
              });
              tocHtml += '</ul></div>';
              props.editor?.chain().focus().insertContent(tocHtml).run();
            }}
            onUpdateToc={() => {
              alert('Table of Contents updated with current document headings.');
            }}
            onManageCitations={() => {
              alert('Citations Manager: ' + props.docState.citations.map((c) => c.title).join(', '));
            }}
          />
        )}
        {activeTab === 'Mailings' && (
          <MailingsTab
            editor={props.editor}
            mailMerge={props.docState.mailMerge}
            onUpdateMailMerge={(updates) =>
              props.onUpdateDocState({
                mailMerge: { ...props.docState.mailMerge, ...updates },
              })
            }
            onOpenMailMergeDialog={props.onOpenMailMergeDialog}
            onFinishAndMerge={() => {
              props.onOpenMailMergeDialog();
            }}
          />
        )}
        {activeTab === 'Review' && (
          <ReviewTab
            editor={props.editor}
            trackChangesEnabled={props.docState.trackChangesEnabled}
            onToggleTrackChanges={() =>
              props.onUpdateDocState({
                trackChangesEnabled: !props.docState.trackChangesEnabled,
              })
            }
            markupMode={props.docState.markupDisplayMode}
            onSetMarkupMode={(mode) => props.onUpdateDocState({ markupDisplayMode: mode })}
            trackChanges={props.docState.trackChanges}
            onUpdateTrackChanges={(changes) => props.onUpdateDocState({ trackChanges: changes })}
            onOpenSpellCheck={props.onOpenSpellCheck}
            onOpenWordCount={props.onOpenWordCount}
            onNewComment={props.onNewComment}
            onToggleCommentsPane={() =>
              props.onUpdateDocState({ showCommentsPane: !props.docState.showCommentsPane })
            }
            onToggleTrackPane={() =>
              props.onUpdateDocState({ showTrackChangesPane: !props.docState.showTrackChangesPane })
            }
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
          <HelpTab onOpenShortcuts={props.onOpenShortcuts} onOpenAbout={props.onOpenAbout} />
        )}
      </div>
    </div>
  );
};
