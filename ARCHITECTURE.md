# WordForge System Architecture & Engineering Design

This document details the software architecture, module breakdown, and data flow models for **WordForge**, the Microsoft Word-class desktop word processor for macOS.

---

## 1. High-Level Architecture Overview

WordForge is built on a high-performance desktop architecture decoupling document model state, rich text rendering, pagination computation, and native macOS desktop integration:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        macOS Host Environment                          │
│   (App Sandbox / Ad-hoc Codesigned Mach-O / Unified Window TitleBar)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                       Electron Desktop Shell                           │
│  - Main Process (electron/main.ts): Window lifecycle, native menus     │
│  - Preload Script (electron/preload.ts): Context-isolated secure IPC   │
│  - Protocol Handlers: Safe local disk read/write & PDF print pipeline  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                     React 18 Presentation Layer                        │
│  ├── TitleBar: AutoSave, QAT, Search Capsule, Share, Window Controls   │
│  ├── Ribbon System: 10 Tabs + Contextual Table Tools (Design/Layout)   │
│  ├── Document Canvas: Scaled US Letter Paper Sheets & Margin Guides    │
│  ├── Drawing Layer: HTML5 Canvas Digital Inking (Pen, Highlighter)     │
│  ├── Side Panes: Navigation Outline, Track Changes, Comments           │
│  └── StatusBar: Page counters, word statistics, proofing & zoom slider │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                      Document & Engine Core                            │
│  ├── DocumentModel: Immutable DocumentState & metadata management      │
│  ├── PaginationEngine: Geometry calculations & continuous page flow    │
│  ├── OpenXML Engine: Bidirectional DOCX import/export (docx, mammoth)  │
│  ├── SpellCheckEngine: Offline dictionary & Levenshtein suggestions    │
│  ├── MailMergeEngine: CSV schema parsing & dynamic template generation │
│  └── UpdateService: GitHub API release detection & 1-click downloads   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure & Component Inventory

```
src/
├── App.tsx                     # Application container & dialog state router
├── main.tsx                    # React root bootstrap
├── index.css                   # Word for Mac design tokens & typography rules
├── types/
│   ├── document.ts             # Core DocumentState, PageSetup, Margins types
│   └── electron.d.ts           # Type definitions for IPC bridge
├── core/
│   ├── documentModel.ts        # Default state factory, sample document, statistics
│   ├── pagination/
│   │   └── paginationEngine.ts # Page geometry, multi-page layout calculator
│   ├── persistence/
│   │   ├── docxExporter.ts     # OpenXML ISO/IEC 29500 DOCX serializer
│   │   ├── docxImporter.ts     # OpenXML parser and HTML converter
│   │   └── storage.ts          # Local draft caching & crash recovery
│   ├── spellcheck/
│   │   └── spellingEngine.ts   # Offline trie dictionary & suggestion generator
│   ├── mailmerge/
│   │   └── mailMergeEngine.ts  # CSV parser & template record merger
│   └── updater/
│       └── updateService.ts    # GitHub Releases API checker & updater
└── components/
    ├── TitleBar.tsx            # macOS light chrome titlebar & QAT
    ├── StatusBar.tsx           # Bottom status bar with zoom slider
    ├── Ribbon/
    │   ├── Ribbon.tsx          # Tab bar container & contextual detection
    │   ├── FontPicker.tsx      # Custom desktop font family dropdown
    │   ├── FontSizePicker.tsx  # Custom desktop font size stepper dropdown
    │   ├── ThemeColorPicker.tsx# Microsoft Office theme color palette matrix
    │   └── Tabs/               # Home, Insert, Draw, Design, Layout,
    │                           # References, Mailings, Review, View, Help,
    │                           # TableDesign, TableLayout
    ├── Editor/
    │   ├── DocumentCanvas.tsx  # Document viewport & sheet positioning
    │   ├── HorizontalRuler.tsx # Top inch ruler with margin indent markers
    │   ├── VerticalRuler.tsx   # Left vertical ruler
    │   ├── DrawLayer.tsx       # Canvas drawing layer for pen & highlighter
    │   └── RichTextEditor.tsx  # TipTap ProseMirror editor wrapper
    ├── SidePanes/
    │   ├── NavigationPane.tsx  # Headings outline & document search
    │   ├── CommentsPane.tsx    # Comment threads and reply interface
    │   └── TrackChangesPane.tsx# Reviewing pane for accepted/rejected edits
    └── Dialogs/                # Font, Paragraph, Table, Symbol, Equation,
                                # PageSetup, SpellCheck, WordCount, Update, About
```

---

## 3. Key Design Decisions

### Seamless macOS Light Chrome
Modern Microsoft Word on macOS does not use the solid blue window header found in Windows Office. Word for Mac employs an authentic macOS light window chrome (`#F5F6F8`) that seamlessly merges with macOS system traffic lights, native window drag regions, and the ribbon tab strip.

### Pure Mac Ribbon Navigation
In Office for Mac, bottom group headers (`FONT`, `PARAGRAPH`) with diagonal launcher arrows are omitted in favor of clean 1px vertical group dividers (`#E1DFDD`) and intuitive contextual toolbars. This maximizes vertical editor canvas real estate while maintaining instant accessibility.

### Continuous Geometry Pagination
Rather than simulating pages with purely decorative CSS rectangles behind an unpaginated scrolling body, `paginationEngine.ts` calculates exact page geometry (in pixels at 96 DPI) based on page setup (margins, paper size, orientation) and splits content into distinct page sheets. Synchronous horizontal and vertical rulers automatically align to the active printable canvas.

### Offline-First Architecture
All core document editing, spelling analysis, template generation, and OpenXML DOCX transformations run completely client-side in the local application runtime with 0ms network latency and complete user privacy.
