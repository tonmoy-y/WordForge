# WordForge Known Issues & Technical Limitations

This document tracks known limitations, platform constraints, and planned enhancements for **WordForge**.

---

## 1. macOS Gatekeeper & Unnotarized Developer ID
- **Behavior:** Because WordForge is an independently built open-source application and is not signed with a paid Apple Developer ID certificate, macOS Gatekeeper may present a "developer cannot be verified" warning when opening the app after downloading it via web browsers.
- **Resolution:**
  - Run `xattr -cr /Applications/WordForge.app` in Terminal, OR
  - Navigate to **System Settings > Privacy & Security > Security** and click **Open Anyway**, OR
  - Right-click `WordForge.app` in Finder, hold `Control`, click **Open**, and confirm.

---

## 2. OpenXML DrawingML Interoperability
- **Behavior:** Freehand ink annotations created in the Draw ribbon tab are stored in the document model state and rendered in PDF export and native printing.
- **Limitation:** Freehand drawing strokes are not currently translated into native Microsoft Word `w:drawing` VML/DrawingML shapes during DOCX binary export.
- **Status:** Planned for v1.3.0 vector export upgrade.

---

## 3. Advanced Multi-Column Section Flow
- **Behavior:** The Layout ribbon allows switching column presets (One, Two, Three).
- **Limitation:** Multi-column text flow across continuous dynamic page breaks is currently rendered as a single continuous body column in the interactive editor canvas.
- **Status:** Planned for subsequent pagination engine extension.

---

## 4. Complex Nested Mail Merge Logic
- **Behavior:** Standard merge field substitution (`<<FirstName>>`, `<<LastName>>`, etc.) and batch merged document generation from CSV data sources work reliably.
- **Limitation:** Complex Word merge rules (such as `IF...THEN...ELSE` conditional merge fields) are not evaluated during batch generation.
