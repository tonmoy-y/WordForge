const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const version = packageJson.version;
const tagName = `v${version}`;
const releaseDir = path.join(__dirname, '../release');

console.log(`\n============================================================`);
console.log(`  WordForge Release Automation Pipeline - ${tagName}`);
console.log(`============================================================\n`);

const dmgPath = path.join(releaseDir, `WordForge-${version}-arm64.dmg`);
const zipPath = path.join(releaseDir, `WordForge-${version}-arm64-mac.zip`);

const forceBuild = process.argv.includes('--force') || process.argv.includes('-f') || !fs.existsSync(dmgPath) || !fs.existsSync(zipPath);

if (forceBuild) {
  console.log(`[1/3] Building release binaries for ${tagName}...`);
  execSync('npm run electron:build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
} else {
  console.log(`[1/3] Found existing binaries for ${tagName}:`);
  console.log(`  - ${dmgPath} (${(fs.statSync(dmgPath).size / 1024 / 1024).toFixed(1)} MB)`);
  console.log(`  - ${zipPath} (${(fs.statSync(zipPath).size / 1024 / 1024).toFixed(1)} MB)`);
}

const releaseNotes = `## WordForge ${tagName} - Microsoft Word for Mac High-Fidelity Architecture

WordForge ${tagName} delivers an uncompromising, ultra-high-fidelity desktop word processor architecture reverse-engineered to mirror Microsoft Word for Mac in appearance, typography, layout engine, and editing functionality.

### Key Highlights & Features
- **Authentic macOS Window Chrome**: Unified macOS header (#F5F6F8) seamlessly blending native traffic light clearance, AutoSave toggle, Quick Access Toolbar, document title dropdown rename, Search capsule, and Word Blue Share button.
- **Genuine Word for Mac Ribbon Tabs**: Home, Insert, Draw, Design, Layout, References, Mailings, Review, View, Help with authentic Word Blue underline indicators and clean 1px vertical group dividers.
- **Office Typography & Custom Pickers**: Custom dropdowns for Aptos, Aptos Display, Calibri, and exact point sizes, with case change, superscript/subscript, and text effects.
- **Authentic Styles Gallery**: Real-time styled tiles for Normal, No Spacing, Heading 1, Heading 2, Title, Subtitle, and Quote with steppers and Styles pane integration.
- **Contextual Table Tools**: Automatic table detection revealing Table Design (styles, shading, borders) and Table Layout (rows, columns, cell alignment).
- **Document Pagination & Layout**: Centered 8.5" × 11" Letter page sheets with realistic drop shadows, margin boundaries, and synchronous rulers.
- **OpenXML Interoperability**: 100% offline DOCX import/export, PDF rendering, Track Changes, Comments sidebar, Mail Merge, and offline spellcheck.
- **In-App Updater & Automation**: 1-click update checks, version comparisons, release note previews, and automated GitHub Release publishing.

### Download Binaries (Apple Silicon / macOS)
- **macOS DMG Installer**: [WordForge-${version}-arm64.dmg](https://github.com/tonmoy-y/WordForge/releases/download/${tagName}/WordForge-${version}-arm64.dmg)
- **macOS ZIP Archive**: [WordForge-${version}-arm64-mac.zip](https://github.com/tonmoy-y/WordForge/releases/download/${tagName}/WordForge-${version}-arm64-mac.zip)
`;

const notesFile = path.join(releaseDir, 'RELEASE_NOTES.tmp.md');
fs.writeFileSync(notesFile, releaseNotes, 'utf8');

console.log(`\n[2/3] Checking GitHub Release status for ${tagName}...`);
let releaseExists = false;
try {
  execSync(`gh release view ${tagName}`, { stdio: 'pipe' });
  releaseExists = true;
} catch (e) {
  releaseExists = false;
}

if (releaseExists) {
  console.log(`[3/3] Release ${tagName} exists. Uploading updated binaries and release notes...`);
  execSync(`gh release upload ${tagName} "${dmgPath}" "${zipPath}" --clobber`, { stdio: 'inherit' });
  execSync(`gh release edit ${tagName} --title "WordForge ${tagName} - Microsoft Word for Mac Release" --notes-file "${notesFile}"`, { stdio: 'inherit' });
} else {
  console.log(`[3/3] Creating new GitHub Release ${tagName}...`);
  execSync(`gh release create ${tagName} "${dmgPath}" "${zipPath}" --title "WordForge ${tagName} - Microsoft Word for Mac Release" --notes-file "${notesFile}"`, { stdio: 'inherit' });
}

if (fs.existsSync(notesFile)) {
  fs.unlinkSync(notesFile);
}

console.log(`\n✓ Successfully released WordForge ${tagName} to GitHub Releases!`);
console.log(`URL: https://github.com/tonmoy-y/WordForge/releases/tag/${tagName}\n`);
