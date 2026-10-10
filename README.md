# WordForge

> A Microsoft Word-class desktop word processor engineered natively for macOS.

[![CI](https://github.com/tonmoy-y/WordForge/actions/workflows/ci.yml/badge.svg)](https://github.com/tonmoy-y/WordForge/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/tonmoy-y/WordForge?color=blue&label=release)](https://github.com/tonmoy-y/WordForge/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![macOS](https://img.shields.io/badge/platform-macOS%20(Apple%20Silicon%20%7C%20Intel)-lightgrey.svg)]()

WordForge is a desktop word processor that reproduces the Microsoft Word for Mac editing experience and feature set with high fidelity. It provides an authentic Word for Mac unified window layout, complete 10-tab ribbon interface, contextual table design and layout tools, interactive 10×8 table grid picker, Microsoft Office theme colors matrix, continuous multi-page pagination with synchronous rulers, digital drawing ink layer, track changes, mail merge, native DOCX/PDF export, and automated in-app updates directly from GitHub Releases.

---

## Downloads

Download the latest version directly from the [GitHub Releases](https://github.com/tonmoy-y/WordForge/releases) page:

- **macOS DMG Installer (Apple Silicon):** [`WordForge-1.2.0-arm64.dmg`](https://github.com/tonmoy-y/WordForge/releases/download/v1.2.0/WordForge-1.2.0-arm64.dmg)
- **macOS Portable Archive (Apple Silicon):** [`WordForge-1.2.0-arm64-mac.zip`](https://github.com/tonmoy-y/WordForge/releases/download/v1.2.0/WordForge-1.2.0-arm64-mac.zip)

> [!NOTE]
> **First-Time Launch on macOS (Gatekeeper)**
> Because WordForge is an open-source application without paid Apple Developer ID notarization, macOS Gatekeeper may show a warning when launching an app downloaded via web browsers.
> 
> To launch WordForge:
> - **Option 1 (Recommended Terminal command):**
>   ```bash
>   xattr -cr /Applications/WordForge.app
>   ```
> - **Option 2 (System Settings):** Open **System Settings > Privacy & Security**, scroll to **Security**, and click **Open Anyway**.
> - **Option 3 (Finder):** Right-click (or Control-click) `WordForge.app`, select **Open**, and click **Open** in the prompt.

---

## Features

### 1. Document Canvas & Pagination
- **Multi-page continuous layout:** Real-time flowing text across pages with configurable margins, page gaps, and drop shadows.
- **Paper sizes & orientations:** Letter, A4, Legal, Executive, A3, and A5 in Portrait and Landscape orientations.
- **Rulers:** Interactive horizontal and vertical rulers with margin markers and indent sliders.
- **Headers & footers:** Configurable header text, footer text, and page numbering formats (*Page X of Y*, *1, 2, 3*, roman numerals).
- **Watermarks & borders:** Page background colors, custom watermarks (*DRAFT*, *CONFIDENTIAL*), and decorative page borders.

### 2. Comprehensive Ribbon Interface
- **Home:** Clipboard commands, font formatting (family, size, bold, italic, underline, strikethrough, subscript, superscript, text highlight, font color), paragraph alignments, line spacing (1.0 to 3.0), indentation, bullets, numbering, and styles gallery (*Normal*, *Heading 1–3*, *Quote*).
- **Insert:** Cover pages, page breaks, custom tables, pictures, shapes (rectangles, circles, arrows), bookmarks, hyperlinks, date/time, mathematical equations, and special symbols palette.
- **Draw:** Inking layer with Pen, Neon Highlighter, and Eraser tools, custom stroke widths, and color picker.
- **Design:** Theme presets (*Office*, *Modern*, *Elegant*, *Editorial*, *Classic*, *Emerald*, *Vibrant*), font sets, and color palettes.
- **Layout:** Margins presets (*Normal*, *Narrow*, *Moderate*, *Wide*, *Mirrored*, *Custom*), orientation, size, columns, and breaks.
- **References:** Automatic Table of Contents generation, footnotes, endnotes, citations, and bibliography management.
- **Mailings:** Mail Merge with CSV data sources, merge fields (`<<FirstName>>`, `<<LastName>>`), record stepper preview, and batch export.
- **Review:** Offline spelling and grammar checking, word count statistics, comments with reply threads, and Track Changes with revision acceptance/rejection.
- **View:** Print Layout, Web Layout, Read Mode, Focus Mode, and Zoom controls (10% to 500%).
- **Help:** Keyboard shortcuts reference, documentation, and in-app update checks.

### 3. In-App Direct Updater
- **Automated Update Checks:** Checks GitHub Releases via the GitHub API directly from the desktop UI.
- **One-Click Update Dialog:** Accessible from the top Title Bar ("Check for Updates"), the application menu (`Help > Check for Updates…`), or the Help ribbon tab.
- **Direct Installer Download:** Automatically downloads the latest DMG installer directly to your Downloads folder and reveals it for installation.

### 4. File Interoperability & Privacy
- **Office Open XML (DOCX):** Standards-compliant `.docx` import and export preserving headings, formatting, tables, lists, and metadata.
- **PDF & Printing:** Native macOS print and PDF export with print-ready page margins.
- **Offline & Private:** Completely offline-first with zero tracking, telemetry, or external service dependencies.
- **AutoSave & Recovery:** Background draft auto-saving with crash recovery prompt on startup.

---

## Getting Started

### Prerequisites

- macOS 12.0 or later (Apple Silicon or Intel)
- Node.js 22 or later
- npm 10 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/tonmoy-y/WordForge.git
cd WordForge

# Install dependencies
npm install
```

### Running in Development

```bash
npm run dev
```

### Running Tests

```bash
npm test
```

### Production Build

```bash
npm run build
```

### Packaging macOS Distribution

```bash
npm run electron:build
```

Packaged distribution outputs will be located in the `release/` directory:
- `release/WordForge-1.2.0-arm64.dmg` (Disk Image installer)
- `release/WordForge-1.2.0-arm64-mac.zip` (Portable ZIP archive)
- `release/mac-arm64/WordForge.app` (Application bundle)

### Automated Release to GitHub

To automatically build, codesign, and publish the release directly to GitHub Releases:

```bash
npm run build:release
```

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘S` | Save Document |
| `⇧⌘S` | Save As |
| `⌘O` | Open Document |
| `⌘N` | New Document |
| `⌘P` | Print / Save to PDF |
| `⌘Z` | Undo |
| `⌘Y` | Redo |
| `⌘B` | Bold |
| `⌘I` | Italic |
| `⌘U` | Underline |
| `⌘F` | Find |
| `⌥⌘F` | Replace |
| `⌘↵` | Page Break |
| `F7` | Spelling & Grammar |
| `⇧⌘E` | Toggle Track Changes |

---

## CI/CD Workflow

WordForge includes automated GitHub Actions workflows:
- **Continuous Integration (`CI`):** Runs tests and builds on macOS runners automatically whenever code is pushed or a pull request is created.
- **Releases (`Release`):** Builds and packages the macOS `.app`, `.dmg`, and `.zip` archives and uploads them to GitHub Releases upon tag creation (`v*`) or manual workflow dispatch.

---

## Contributing

Contributions are welcome! Please check out [CONTRIBUTING.md](CONTRIBUTING.md) for details on our development workflow.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
