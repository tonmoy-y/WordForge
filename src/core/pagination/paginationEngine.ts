import { PageSetup, PAGE_SIZES } from '../../types/document';

export interface PaginatedPage {
  pageNumber: number;
  totalPageCount: number;
  htmlContent: string;
  isFirstPage: boolean;
  isOddPage: boolean;
}

/**
 * DPI conversion constant
 * Standard desktop CSS pixel resolution is 96 DPI.
 */
export const DPI = 96;

export function getPageDimensionsPx(pageSetup: PageSetup): {
  pageWidthPx: number;
  pageHeightPx: number;
  marginTopPx: number;
  marginBottomPx: number;
  marginLeftPx: number;
  marginRightPx: number;
  contentWidthPx: number;
  contentHeightPx: number;
} {
  const sizeInfo = PAGE_SIZES[pageSetup.paperSize] || PAGE_SIZES.letter;
  const isLandscape = pageSetup.orientation === 'landscape';

  const baseWidthInches = (sizeInfo.widthPt / 72);
  const baseHeightInches = (sizeInfo.heightPt / 72);

  const widthInches = isLandscape ? Math.max(baseWidthInches, baseHeightInches) : Math.min(baseWidthInches, baseHeightInches);
  const heightInches = isLandscape ? Math.min(baseWidthInches, baseHeightInches) : Math.max(baseWidthInches, baseHeightInches);

  const pageWidthPx = Math.round(widthInches * DPI);
  const pageHeightPx = Math.round(heightInches * DPI);

  const marginTopPx = Math.round(pageSetup.margins.top * DPI);
  const marginBottomPx = Math.round(pageSetup.margins.bottom * DPI);
  const marginLeftPx = Math.round(pageSetup.margins.left * DPI);
  const marginRightPx = Math.round(pageSetup.margins.right * DPI);

  const contentWidthPx = pageWidthPx - marginLeftPx - marginRightPx;
  const contentHeightPx = pageHeightPx - marginTopPx - marginBottomPx;

  return {
    pageWidthPx,
    pageHeightPx,
    marginTopPx,
    marginBottomPx,
    marginLeftPx,
    marginRightPx,
    contentWidthPx,
    contentHeightPx,
  };
}

/**
 * Calculates page distribution of HTML content based on block elements,
 * explicit page breaks, and estimated rendered heights.
 */
export function calculatePages(htmlContent: string, pageSetup: PageSetup): PaginatedPage[] {
  if (!htmlContent || htmlContent.trim() === '') {
    return [
      {
        pageNumber: 1,
        totalPageCount: 1,
        htmlContent: '<p></p>',
        isFirstPage: true,
        isOddPage: true,
      },
    ];
  }

  const { contentHeightPx, contentWidthPx } = getPageDimensionsPx(pageSetup);

  // Parse HTML DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${htmlContent}</div>`, 'text/html');
  const root = doc.body.firstElementChild || doc.body;

  const pagesHtml: string[] = [];
  let currentPageBlocks: string[] = [];
  let currentAccumulatedHeight = 0;

  // Approximate height estimation per block type in pixels
  function estimateBlockHeight(node: Element): number {
    const tag = node.tagName.toLowerCase();
    const textLength = (node.textContent || '').length;

    // Check for explicit page break token
    if (
      node.classList.contains('page-break') ||
      tag === 'hr' && node.getAttribute('data-type') === 'page-break' ||
      node.getAttribute('data-page-break') === 'true'
    ) {
      return 999999; // triggers page break immediately
    }

    // Rough character width: ~8.5px per character in 11pt Aptos/Calibri
    const charsPerLine = Math.max(20, Math.floor(contentWidthPx / 8.5));
    const estimatedLines = Math.max(1, Math.ceil(textLength / charsPerLine));

    if (tag === 'h1') return estimatedLines * 36 + 28;
    if (tag === 'h2') return estimatedLines * 28 + 24;
    if (tag === 'h3') return estimatedLines * 22 + 20;
    if (tag === 'p') return estimatedLines * 20 + 10;
    if (tag === 'ul' || tag === 'ol') {
      const itemsCount = node.children.length;
      return itemsCount * 24 + 12;
    }
    if (tag === 'table') {
      const rowCount = node.querySelectorAll('tr').length;
      return Math.max(60, rowCount * 36);
    }
    if (tag === 'blockquote') return estimatedLines * 22 + 24;
    if (tag === 'img') {
      const heightAttr = node.getAttribute('height');
      if (heightAttr) return parseInt(heightAttr, 10) + 16;
      return 220; // default image block estimate
    }

    return estimatedLines * 20 + 8;
  }

  const childNodes = Array.from(root.children);

  if (childNodes.length === 0) {
    // If no block children, treat root itself
    return [
      {
        pageNumber: 1,
        totalPageCount: 1,
        htmlContent: htmlContent,
        isFirstPage: true,
        isOddPage: true,
      },
    ];
  }

  for (let i = 0; i < childNodes.length; i++) {
    const child = childNodes[i];
    const isExplicitBreak =
      child.classList.contains('page-break') ||
      child.getAttribute('data-page-break') === 'true';

    if (isExplicitBreak) {
      if (currentPageBlocks.length > 0) {
        pagesHtml.push(currentPageBlocks.join(''));
        currentPageBlocks = [];
        currentAccumulatedHeight = 0;
      }
      continue;
    }

    const estimatedHeight = estimateBlockHeight(child);

    // If adding this block exceeds page height and we already have content on this page, start a new page
    if (currentAccumulatedHeight + estimatedHeight > contentHeightPx && currentPageBlocks.length > 0) {
      pagesHtml.push(currentPageBlocks.join(''));
      currentPageBlocks = [child.outerHTML];
      currentAccumulatedHeight = estimatedHeight;
    } else {
      currentPageBlocks.push(child.outerHTML);
      currentAccumulatedHeight += estimatedHeight;
    }
  }

  if (currentPageBlocks.length > 0) {
    pagesHtml.push(currentPageBlocks.join(''));
  }

  if (pagesHtml.length === 0) {
    pagesHtml.push('<p></p>');
  }

  const totalPageCount = pagesHtml.length;

  return pagesHtml.map((html, index) => {
    const pageNum = index + 1;
    return {
      pageNumber: pageNum,
      totalPageCount,
      htmlContent: html,
      isFirstPage: pageNum === 1,
      isOddPage: pageNum % 2 !== 0,
    };
  });
}
