<p align="center">
  <img src="assets/app-icon/wordforge-1024.png" alt="WordForge" width="128" height="128">
</p>

<h1 align="center">WordForge</h1>

<p align="center">
  <b>Writing and document design: a high-fidelity Microsoft Word for Mac word processor, built in pure Rust.</b>
</p>

<p align="center">
  A fast, open-source desktop word processor with the Microsoft Word workflow you already know: authentic ribbon architecture, rich typography, live styles gallery, tables, margin review comments, track changes, references, and mail merge. Reads and writes .docx natively, running with full GPU acceleration on macOS, Windows, Linux, and the web.
</p>

<p align="center">
  <img alt="Written in Rust" src="https://img.shields.io/badge/written%20in-Rust-2b47b5?style=flat-square&logo=rust&logoColor=white">
  <img alt="Runs on macOS, Windows, Linux, BSD and the web" src="https://img.shields.io/badge/runs%20on-macOS%20%C2%B7%20Windows%20%C2%B7%20Linux%20%C2%B7%20BSD%20%C2%B7%20Web-3b5bdb?style=flat-square">
  <img alt="License: MIT OR Apache-2.0" src="https://img.shields.io/badge/license-MIT%20%2F%20Apache--2.0-2b47b5?style=flat-square">
  <img alt="Universal macOS Binary" src="https://img.shields.io/badge/macOS-Apple%20Silicon%20%2B%20Intel-007AFF?style=flat-square">
</p>

<p align="center">
  <a href="https://github.com/tonmoy-y/WordForge"><b>WordForge Repository</b></a> ·
  <a href="https://github.com/tonmoy-y/WordForge/releases">Releases & Downloads</a>
</p>

<br>

<p align="center">
  <img src="docs/images/hero.png" alt="WordForge with the Home tab of the ribbon open over a two-page document titled The Open Studio Handbook. The Styles gallery shows live previews of Normal, No Spacing, Heading 1, Title and Subtitle." width="100%">
  <br><sub><b>The Open Studio Handbook</b>, WordForge's built-in sample document: ribbon groups, live Styles gallery, rulers, and status bar.</sub>
</p>

<p align="center">
  <a href="#a-tour">A tour</a> ·
  <a href="#why-wordforge">Why WordForge</a> ·
  <a href="#what-works-today">What works today</a> ·
  <a href="#quick-start">Quick start</a> ·
  <a href="#cli-and-automation">CLI and automation</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#roadmap">Roadmap</a> ·
  <a href="#downloads">Downloads</a> ·
  <a href="#license-and-credits">License and credits</a>
</p>

## A tour

Every screenshot below is WordForge itself, running natively on macOS with genuine GPU rendering.

<table>
<tr>
<td width="50%" valign="top"><img src="docs/images/insert.png" alt="The Insert tab: tables, pictures, shapes, links, comments, headers, footers, page numbers, text boxes, equations and symbols" width="100%"><p align="center"><sub><b>Insert.</b> Tables, illustrations, links, header & footer, text boxes, and symbols.</sub></p></td>
<td width="50%" valign="top"><img src="docs/images/layout.png" alt="The Layout tab with page setup, margins, orientation, size, columns and breaks" width="100%"><p align="center"><sub><b>Layout.</b> Margins, orientation, paper sizes, columns, section breaks, and indentation.</sub></p></td>
</tr>
<tr>
<td width="50%" valign="top"><img src="docs/images/design.png" alt="The Design tab showing document formatting themes and style sets" width="100%"><p align="center"><sub><b>Design.</b> Document formatting, themes, style sets, colors, fonts, and paragraph spacing.</sub></p></td>
<td width="50%" valign="top"><img src="docs/images/references.png" alt="The References tab with table of contents, footnotes, citations and bibliography" width="100%"><p align="center"><sub><b>References.</b> Table of contents, footnotes & endnotes, citations, bibliography, and captions.</sub></p></td>
</tr>
<tr>
<td width="50%" valign="top"><img src="docs/images/review.png" alt="The Review tab: proofing, spelling & grammar, word count, comments, and track changes" width="100%"><p align="center"><sub><b>Review.</b> Spelling and grammar proofing, word count, comments, and track changes.</sub></p></td>
<td width="50%" valign="top"><img src="docs/images/dark.png" alt="WordForge dark mode" width="100%"><p align="center"><sub><b>Dark mode.</b> Native high-contrast dark theme with full document canvas styling.</sub></p></td>
</tr>
<tr>
<td colspan="2"><img src="docs/images/backstage.png" alt="The File backstage view: templates, recent documents, info, options, and export" width="100%"><p align="center"><sub><b>File.</b> Start from templates, manage recent documents, export to PDF, and configure options.</sub></p></td>
</tr>
</table>

## Why WordForge

- **Familiar.** Word's ribbon tabs, groups, shortcuts and behaviour: Enter continues a list,
  Tab demotes it, Ctrl/⌘+B bolds the word under the caret, the Styles gallery previews styles live,
  F4 repeats, F7 checks spelling, F8 extends the selection.
- **Your files.** Opens and saves .docx (OOXML), and also .odt, .rtf, .html, .md, .txt; exports PDF
  with real, selectable text, links and bookmarks.
- **Fast.** Paragraph layout is cached, so typing in a 188-page document re-lays it out in about
  1.4 ms; pages render on demand.
- **Everywhere.** One Rust codebase for macOS, Windows, Linux, BSD and the web. No Electron, no
  Tauri: native egui on the GPU.
- **Scriptable.** Every action is a command with an id. The same 389 commands drive the
  ribbon, keyboard shortcuts, the command search, a command-line tool, a JSON control channel and
  an MCP server.
- **Private.** Spelling, grammar and everything else work completely offline.
- **Open.** MIT OR Apache-2.0. Clean-room: built from public specifications and observation, with
  every asset original or openly licensed.

## What works today

| Area | Highlights |
|---|---|
| **Writing** | Fast typing with IME, smart quotes, AutoCorrect, list autoformat (`* `, `1. `), dashes; word, sentence, paragraph selection; drag-select; clipboard with formatting; undo/redo; find and replace with regex |
| **Formatting** | Fonts, sizes, bold/italic/underline styles, strike, sub/superscript, caps, highlight, colours, character spacing, Format Painter, Change Case, Clear Formatting |
| **Paragraphs** | Alignment, indents (draggable on the ruler), spacing, line spacing, tabs with leaders, borders, shading, keep with next, widow/orphan control |
| **Styles** | Built-in style set, live gallery, Styles pane, create/modify/update styles, style sets, themes |
| **Lists** | Bullets, numbering, multilevel, restart, set value, custom formats |
| **Tables** | Insert by grid, merge/split, styles with banded rows, borders, shading, header rows repeated across pages, rows that split across pages, sort, formulas, text ↔ table |
| **Pages** | Margins, orientation, size, columns, page/column/section breaks, headers and footers (first page, odd/even), page numbers, watermark, page borders, line numbers, vertical alignment, drop caps, automatic hyphenation |
| **Objects** | Pictures (resize, crop, recolour, brightness/contrast, transparency, background removal, picture styles, rotate), shapes, text boxes, floating position with text wrapping (square, top and bottom, behind or in front of text) |
| **References** | Table of contents, footnotes and endnotes, citations and bibliography (APA, MLA, Chicago, IEEE), captions, table of figures, cross-references, index, table of authorities |
| **Review** | Spelling and grammar with suggestions, thesaurus, word count, comments in margin balloons or a pane, track changes, accept/reject, compare documents, restrict editing, accessibility checker, document inspector |
| **Mailings** | Mail merge from CSV, merge fields, address block, greeting line, rules, preview, finish to a document; envelopes and labels |
| **View** | Print layout, web layout, draft, read mode, focus, zoom, one/multiple pages, page width, Navigation pane, rulers, gridlines, dark mode; interface in English, 简体中文, 繁體中文 or 日本語 (follows the system language by default) |
| **Files** | .docx read/write (opens in Word), PDF export, .odt, .rtf, .html, .md, .txt import/export, page images |

The detailed roadmap and parity tracking is in [ROADMAP.md](ROADMAP.md) and [docs/parity.md](docs/parity.md).

## Quick start

```sh
git clone https://github.com/tonmoy-y/WordForge
cd WordForge
cargo run --release -p wordforge -- --sample        # the desktop app with the sample document
cargo run --release -p wordforge -- report.docx     # open a document
```

Command line:

```sh
wordforge-cli convert report.docx report.pdf        # docx, pdf, odt, rtf, html, md, txt, png
wordforge-cli text report.docx                      # plain text
wordforge-cli inspect report.docx                   # structure as JSON
wordforge-cli run --template sample \
  --cmd 'select.text={"text":"Membership"}' --cmd format.bold --save out.docx
```

Web: `cd apps/wordforge-web && trunk serve`, then open <http://127.0.0.1:8771/?sample>.

## CLI and automation

WordForge provides programmatic interfaces via CLI, JSON control channel, and MCP protocol.

```sh
wordforge-cli mcp                                              # headless documents
wordforge --control 7981 &                                     # or drive the running app…
wordforge-cli mcp --connect 127.0.0.1:7981
```

Tools include `list_commands`, `execute`, `batch`, `type_text`, `select_text`, `inspect_document`,
`render_page`, `save_document`, and, with a running app, `screenshot`, `click` and `key`. See [docs/mcp.md](docs/mcp.md)
and the [control protocol](docs/control-protocol.md).

## Logs

The desktop app writes its log records to standard error and to `logs/wordforge.log` next to its
preferences: on Linux `$XDG_CONFIG_HOME/wordforge/logs/` (by default `~/.config/wordforge/logs/`),
on macOS `~/Library/Application Support/WordForge/logs/`, on Windows `%APPDATA%\WordForge\logs\`.

Each launch moves the previous log to `wordforge.1.log` (and that one to `wordforge.2.log`), so the log of a run survives the next start; a log stops growing at 16 MiB. Document text is never logged.

By default WordForge logs at `info` and dependencies at `warn`. `RUST_LOG` replaces
that with env_logger-style directives, for example `RUST_LOG=debug`.

## Architecture

| Layer | Crate | Job |
|---|---|---|
| L0 | `wordforge-geom` | units and measurements |
| L1 | `wordforge-doc`, `wordforge-fonts`, `wordforge-proof` | document model and editing; fonts and shaping; spelling, grammar, hyphenation |
| L2 | `wordforge-layout`, `wordforge-docx`, `wordforge-formats` | line breaking, pagination, tables, notes, hit testing; OOXML; ODT/RTF/HTML/Markdown/TXT |
| L3 | `wordforge-render`, `wordforge-pdf` | rasteriser (vello_cpu); PDF (krilla) |
| L4 | `wordforge-engine` | session, undo, 389 commands, Word feature catalog |
| L5 | `wordforge-mcp` | MCP server |
| L6 | `wordforge-ui-egui` | Word for Mac front end |
| apps | `wordforge`, `wordforge-cli`, `wordforge-web` | desktop, command line, browser |

`cargo xtask ci` runs formatting, clippy, ~250 tests, the asset-attribution check, the layering check and the wasm build.

## Roadmap

WordForge covers 87% of Word's ribbon features with commands today; counting depth and
fidelity, we estimate about 62% of real feature parity. An alpha for everyday writing is close:
the remaining work is mostly testing against real-world .docx files, native printing and the
first signed builds. Charts, SmartArt, the equation editor and the Draw tab come after.
Details and estimates: [ROADMAP.md](ROADMAP.md).

## Downloads

**Download WordForge** from GitHub: the [latest release](https://github.com/tonmoy-y/WordForge/releases/latest) has every build listed below, and [all releases](https://github.com/tonmoy-y/WordForge/releases) has earlier versions and their notes. Checksums are published in `SHA256SUMS.txt`.

### macOS

| Build | File | Notes |
|---|---|---|
| App, universal (Apple silicon + Intel) | `WordForge-<ver>-macos-universal.dmg` | Native drag-to-Applications bundle |
| App archive, universal | `WordForge-<ver>-macos-universal.zip` | Standalone universal application |

### Windows

| Build | Installer | Portable |
|---|---|---|
| x64 (64-bit Intel/AMD) | `wordforge-<ver>-windows-x64.msi` | `wordforge-<ver>-windows-x64-portable.zip` |
| arm64 (Snapdragon and ARM PCs) | `wordforge-<ver>-windows-arm64.msi` | `wordforge-<ver>-windows-arm64-portable.zip` |
| x86 (32-bit) | `wordforge-<ver>-windows-x86.msi` | `wordforge-<ver>-windows-x86-portable.zip` |

### Linux

| Format | x86_64 | aarch64 (ARM64) | Notes |
|---|---|---|---|
| AppImage | `wordforge-<ver>-linux-x86_64.AppImage` | `wordforge-<ver>-linux-aarch64.AppImage` | Runs anywhere |
| Flatpak | `wordforge-<ver>-linux-x86_64.flatpak` | `wordforge-<ver>-linux-aarch64.flatpak` | Sandboxed package |
| Debian/Ubuntu | `wordforge-<ver>-linux-x86_64.deb` | `wordforge-<ver>-linux-aarch64.deb` | |
| Fedora/RHEL/openSUSE | `wordforge-<ver>-linux-x86_64.rpm` | `wordforge-<ver>-linux-aarch64.rpm` | |
| Tarball | `wordforge-<ver>-linux-x86_64.tar.gz` | `wordforge-<ver>-linux-aarch64.tar.gz` | Unpack anywhere |

### FreeBSD

| Build | File |
|---|---|
| x86_64 | `wordforge-<ver>-freebsd-x86_64.tar.gz` |

### Web (WebAssembly)

| Build | File | Notes |
|---|---|---|
| Static site | `wordforge-web-<ver>.zip` | Runs in any modern browser |

## License and credits

WordForge is dual-licensed under [MIT](LICENSE-MIT) or [Apache-2.0](LICENSE-APACHE), at your option.
Copyright (c) 2026 WordForge contributors. Required notices are in [NOTICE](NOTICE).

Bundled fonts, icons, images and other assets keep their own open licenses; each one is listed
with its author, source and license in [ATTRIBUTION.md](ATTRIBUTION.md).

The spelling dictionary and hyphenation come from Grady Ward's public-domain Moby Hyphenator II
word list. The sample documents and templates are original text written for WordForge.

<sub>Microsoft and Microsoft Word are trademarks of the Microsoft group of companies. Adobe, Photoshop, Illustrator, Premiere Pro, Lightroom, Acrobat, After Effects and InDesign are trademarks or registered trademarks of Adobe Inc. in the United States and/or other countries. WordForge is an independent, open-source project and is not affiliated with, sponsored by or endorsed by Microsoft Corporation or Adobe Inc.; these names are used only to describe the workflows it is compatible with.</sub>
