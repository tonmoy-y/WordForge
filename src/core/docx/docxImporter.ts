import mammoth from 'mammoth';
import JSZip from 'jszip';
import { DocumentMetadata } from '../../types/document';

export interface DocxImportResult {
  html: string;
  metadata: Partial<DocumentMetadata>;
  warnings: string[];
}

/**
 * High-fidelity DOCX importer
 */
export async function importDocxFile(arrayBuffer: ArrayBuffer): Promise<DocxImportResult> {
  const warnings: string[] = [];
  const metadata: Partial<DocumentMetadata> = {};

  try {
    // 1. Inspect OpenXML metadata via JSZip
    const zip = await JSZip.loadAsync(arrayBuffer);
    
    // Core properties (docProps/core.xml)
    const coreXmlFile = zip.file('docProps/core.xml');
    if (coreXmlFile) {
      const coreXml = await coreXmlFile.async('text');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(coreXml, 'application/xml');

      const titleEl = xmlDoc.getElementsByTagName('dc:title')[0];
      if (titleEl && titleEl.textContent) metadata.title = titleEl.textContent;

      const creatorEl = xmlDoc.getElementsByTagName('dc:creator')[0];
      if (creatorEl && creatorEl.textContent) metadata.author = creatorEl.textContent;

      const subjectEl = xmlDoc.getElementsByTagName('dc:subject')[0];
      if (subjectEl && subjectEl.textContent) metadata.subject = subjectEl.textContent;

      const modifiedEl = xmlDoc.getElementsByTagName('dcterms:modified')[0];
      if (modifiedEl && modifiedEl.textContent) metadata.modified = modifiedEl.textContent;
    }

    // 2. Convert document.xml to rich HTML via Mammoth with style mappings
    const options = {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "p[style-name='Title'] => h1.doc-title:fresh",
        "p[style-name='Subtitle'] => p.doc-subtitle:fresh",
        "p[style-name='Quote'] => blockquote:fresh",
        "r[style-name='Strong'] => strong",
        "r[style-name='Emphasis'] => em",
        "r[style-name='Subtle Emphasis'] => em.subtle",
      ],
      includeDefaultStyleMap: true,
      convertImage: mammoth.images.imgElement((image) => {
        return image.read('base64').then((imageBuffer) => {
          return {
            src: `data:${image.contentType};base64,${imageBuffer}`,
          };
        });
      }),
    };

    const inputOptions: any = typeof Buffer !== 'undefined'
      ? { buffer: Buffer.from(arrayBuffer), arrayBuffer }
      : { arrayBuffer };

    const result = await mammoth.convertToHtml(inputOptions, options);
    
    let html = result.value;
    if (result.messages && result.messages.length > 0) {
      result.messages.forEach((msg) => {
        warnings.push(`${msg.type}: ${msg.message}`);
      });
    }

    // Fallback if empty
    if (!html || html.trim() === '') {
      html = '<p></p>';
    }

    return {
      html,
      metadata,
      warnings,
    };
  } catch (err: any) {
    warnings.push(`Import error: ${err.message || String(err)}`);
    return {
      html: `<p>Error loading document: ${err.message || String(err)}</p>`,
      metadata,
      warnings,
    };
  }
}
