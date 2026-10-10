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

if (!fs.existsSync(dmgPath) || !fs.existsSync(zipPath)) {
  console.log(`[1/3] Release binaries not found for v${version}. Building now...`);
  execSync('npm run electron:build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
} else {
  console.log(`[1/3] Found existing binaries for v${version}:`);
  console.log(`  - ${dmgPath} (${(fs.statSync(dmgPath).size / 1024 / 1024).toFixed(1)} MB)`);
  console.log(`  - ${zipPath} (${(fs.statSync(zipPath).size / 1024 / 1024).toFixed(1)} MB)`);
}

const releaseNotes = `## WordForge ${tagName} - Microsoft Word for Mac High-Fidelity Architecture

WordForge ${tagName} delivers a ground-up rebuilt desktop word processor architecture meticulously reverse-engineered to mirror Microsoft Word for Mac in appearance, typography, layout engine, and editing functionality.

### Key Highlights & Features
- **Authentic macOS Title Bar**: Unified Word Blue (#185ABD) header with native traffic light clearance, Quick Access Toolbar (Save, Undo, Redo, Print), AutoSave toggle, document title rename dropdown, and Search capsule.
- **Complete 10-Tab Ribbon**: Home, Insert, Draw, Design, Layout, References, Mailings, Review, View, Help with authentic group organization, separators, and dialog launchers.
- **Contextual Table Tools**: Automatic table detection revealing \`Table Design\` (Table Styles, Shading, Borders) and \`Table Layout\` (Insert/Delete rows & columns, merge/split cells, 9-cell alignment).
- **Interactive Controls**: 10×8 hover Table Grid Picker and complete Microsoft Office Theme Color matrix (10 columns × 5 tint/shade gradations).
- **Document Pagination & Layout**: Centered 8.5" × 11" Letter page sheets with drop shadows, page break canvas boundaries, synchronous horizontal/vertical rulers with exact inch ticks and margin shading.
- **OpenXML Interoperability**: 100% offline DOCX import/export, PDF rendering, Track Changes, Comments sidebar, Mail Merge, and offline spellcheck.
- **Seamless macOS Execution**: Deep ad-hoc code-signed binary to eliminate macOS Gatekeeper damaged application warnings.

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
