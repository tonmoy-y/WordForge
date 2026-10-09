import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  Packer,
  WidthType,
  convertInchesToTwip,
  UnderlineType,
  ShadingType,
} from 'docx';
import { DocumentState } from '../../types/document';

/**
 * High-fidelity HTML to docx exporter
 */
export async function exportToDocx(state: DocumentState): Promise<Blob> {
  const { pageSetup, headerFooter, metadata, htmlContent } = state;

  // Convert margins from inches to twips (1 inch = 1440 twips)
  const topMarginTwip = convertInchesToTwip(pageSetup.margins.top);
  const bottomMarginTwip = convertInchesToTwip(pageSetup.margins.bottom);
  const leftMarginTwip = convertInchesToTwip(pageSetup.margins.left);
  const rightMarginTwip = convertInchesToTwip(pageSetup.margins.right);

  // Parse HTML DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const body = doc.body;

  const docChildren: (Paragraph | Table)[] = [];

  // Helper to extract text runs from inline elements
  function parseInlineNodes(node: Node, inheritedStyles: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    color?: string;
    highlight?: string;
    font?: string;
    size?: number;
  } = {}): TextRun[] {
    const runs: TextRun[] = [];

    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || '';
        if (text) {
          runs.push(
            new TextRun({
              text,
              bold: inheritedStyles.bold,
              italics: inheritedStyles.italic,
              underline: inheritedStyles.underline ? { type: UnderlineType.SINGLE } : undefined,
              strike: inheritedStyles.strike,
              color: inheritedStyles.color?.replace('#', ''),
              font: inheritedStyles.font || 'Aptos',
              size: inheritedStyles.size ? inheritedStyles.size * 2 : 24, // half-points
            })
          );
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        const tag = el.tagName.toLowerCase();
        
        const childStyles = { ...inheritedStyles };

        if (tag === 'strong' || tag === 'b') childStyles.bold = true;
        if (tag === 'em' || tag === 'i') childStyles.italic = true;
        if (tag === 'u') childStyles.underline = true;
        if (tag === 's' || tag === 'strike' || tag === 'del') childStyles.strike = true;
        if (tag === 'code') {
          childStyles.font = 'Consolas';
          childStyles.color = '9B111E';
        }

        // Inline CSS
        const color = el.style.color;
        if (color) {
          if (color.startsWith('#')) {
            childStyles.color = color;
          } else if (color.startsWith('rgb')) {
            const rgb = color.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
              const hex = ((1 << 24) + (+rgb[0] << 16) + (+rgb[1] << 8) + +rgb[2]).toString(16).slice(1);
              childStyles.color = hex;
            }
          }
        }

        runs.push(...parseInlineNodes(child, childStyles));
      }
    });

    return runs;
  }

  // Iterate over block elements
  Array.from(body.childNodes).forEach((childNode) => {
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      const el = childNode as HTMLElement;
      const tag = el.tagName.toLowerCase();

      // Heading levels
      if (tag === 'h1') {
        const runs = parseInlineNodes(el, { bold: true, color: '1F4E79', size: 18 });
        docChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
            children: runs.length ? runs : [new TextRun({ text: el.textContent || '', bold: true })],
          })
        );
      } else if (tag === 'h2') {
        const runs = parseInlineNodes(el, { bold: true, color: '2E75B6', size: 15 });
        docChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
            children: runs.length ? runs : [new TextRun({ text: el.textContent || '', bold: true })],
          })
        );
      } else if (tag === 'h3') {
        const runs = parseInlineNodes(el, { bold: true, color: '1F4E79', size: 13 });
        docChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 160, after: 80 },
            children: runs.length ? runs : [new TextRun({ text: el.textContent || '', bold: true })],
          })
        );
      } else if (tag === 'p') {
        // Alignment
        let alignment: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT;
        if (el.style.textAlign === 'center') alignment = AlignmentType.CENTER;
        else if (el.style.textAlign === 'right') alignment = AlignmentType.RIGHT;
        else if (el.style.textAlign === 'justify') alignment = AlignmentType.JUSTIFIED;

        const runs = parseInlineNodes(el);
        docChildren.push(
          new Paragraph({
            alignment,
            spacing: { after: 160, line: 276 }, // 1.15 line spacing
            children: runs.length ? runs : [new TextRun('')],
          })
        );
      } else if (tag === 'ul' || tag === 'ol') {
        const isOrdered = tag === 'ol';
        Array.from(el.children).forEach((li) => {
          const runs = parseInlineNodes(li);
          docChildren.push(
            new Paragraph({
              bullet: isOrdered ? undefined : { level: 0 },
              numbering: isOrdered ? { reference: 'numbered-list', level: 0 } : undefined,
              spacing: { after: 80 },
              children: runs.length ? runs : [new TextRun(li.textContent || '')],
            })
          );
        });
      } else if (tag === 'blockquote') {
        const runs = parseInlineNodes(el, { italic: true, color: '595959' });
        docChildren.push(
          new Paragraph({
            indent: { left: convertInchesToTwip(0.5) },
            spacing: { before: 120, after: 120 },
            children: runs,
          })
        );
      } else if (tag === 'hr') {
        docChildren.push(
          new Paragraph({
            spacing: { before: 120, after: 120 },
            border: { bottom: { color: 'B0B0B0', space: 1, style: BorderStyle.SINGLE, size: 6 } },
            children: [],
          })
        );
      } else if (tag === 'table') {
        const tableRows: TableRow[] = [];
        const rows = el.querySelectorAll('tr');

        rows.forEach((tr, rowIndex) => {
          const cells: TableCell[] = [];
          const cellEls = tr.querySelectorAll('th, td');

          cellEls.forEach((cellEl) => {
            const isHeader = cellEl.tagName.toLowerCase() === 'th';
            const runs = parseInlineNodes(cellEl, isHeader ? { bold: true, color: '1F4E79' } : {});

            cells.push(
              new TableCell({
                shading: isHeader
                  ? { type: ShadingType.CLEAR, fill: 'F2F2F2' }
                  : undefined,
                margins: {
                  top: convertInchesToTwip(0.08),
                  bottom: convertInchesToTwip(0.08),
                  left: convertInchesToTwip(0.12),
                  right: convertInchesToTwip(0.12),
                },
                children: [
                  new Paragraph({
                    children: runs.length ? runs : [new TextRun(cellEl.textContent || '')],
                  }),
                ],
              })
            );
          });

          if (cells.length > 0) {
            tableRows.push(
              new TableRow({
                tableHeader: rowIndex === 0,
                children: cells,
              })
            );
          }
        });

        if (tableRows.length > 0) {
          docChildren.push(
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: tableRows,
            })
          );
          // Add spacing after table
          docChildren.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
        }
      }
    }
  });

  // Ensure there's at least one paragraph
  if (docChildren.length === 0) {
    docChildren.push(new Paragraph({ children: [new TextRun('')] }));
  }

  // Create Header & Footer
  const header = new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: headerFooter.headerText,
            color: '7F7F7F',
            size: 18,
          }),
        ],
      }),
    ],
  });

  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: headerFooter.pageNumberPosition.includes('center')
          ? AlignmentType.CENTER
          : headerFooter.pageNumberPosition.includes('left')
          ? AlignmentType.LEFT
          : AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: headerFooter.footerText ? `${headerFooter.footerText}  ` : '',
            color: '7F7F7F',
            size: 18,
          }),
          ...(headerFooter.showPageNumbers
            ? [
                new TextRun({ text: 'Page ', color: '7F7F7F', size: 18 }),
                new TextRun({ children: [PageNumber.CURRENT], color: '7F7F7F', size: 18 }),
                new TextRun({ text: ' of ', color: '7F7F7F', size: 18 }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], color: '7F7F7F', size: 18 }),
              ]
            : []),
        ],
      }),
    ],
  });

  const docxDocument = new Document({
    creator: metadata.author || 'WordForge Pro',
    title: metadata.title || 'WordForge Document',
    description: metadata.comments,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: topMarginTwip,
              bottom: bottomMarginTwip,
              left: leftMarginTwip,
              right: rightMarginTwip,
            },
          },
        },
        headers: {
          default: header,
        },
        footers: {
          default: footer,
        },
        children: docChildren,
      },
    ],
  });

  return await Packer.toBlob(docxDocument);
}
