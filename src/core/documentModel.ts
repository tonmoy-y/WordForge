import { DocumentState, DocumentMetadata, PageSetup, HeaderFooterContent } from '../types/document';
import { DOCUMENT_THEMES } from './themes/documentThemes';

export const DEFAULT_PAGE_SETUP: PageSetup = {
  paperSize: 'letter',
  orientation: 'portrait',
  margins: {
    top: 1,
    bottom: 1,
    left: 1,
    right: 1,
    gutter: 0,
  },
  columns: 1,
  headerDistance: 0.5,
  footerDistance: 0.5,
  differentFirstPage: false,
  differentOddEven: false,
  showPageBorders: false,
};

export const DEFAULT_HEADER_FOOTER: HeaderFooterContent = {
  headerText: 'WordForge Document',
  footerText: '',
  showPageNumbers: true,
  pageNumberPosition: 'footer-right',
  pageNumberFormat: 'Page X of Y',
};

export const DEFAULT_METADATA: DocumentMetadata = {
  title: 'Untitled Document',
  subject: 'General Document',
  author: 'WordForge User',
  company: 'Organization',
  keywords: 'document, report, word',
  comments: 'Created with WordForge Pro for macOS',
  created: new Date().toISOString(),
  modified: new Date().toISOString(),
  wordCount: 0,
  charCount: 0,
  pageCount: 1,
};

export const INITIAL_DOCUMENT_HTML = `
<h1>Seattle Coffee Culture</h1>
<p>Seattle has long been celebrated as the coffee capital of the Pacific Northwest, blending rich artisan roasting traditions with vibrant community coffeehouses.</p>

<h2>The Art of the Roast</h2>
<p>From single-origin pour-overs to masterfully pulled espresso, local roasteries focus on sourcing sustainable beans from ethical agricultural cooperatives worldwide. Each batch is roasted to highlight subtle tasting notes ranging from citrus brilliance to velvet cocoa.</p>

<h2>Roast Profile Overview</h2>
<table>
  <thead>
    <tr>
      <th>Origin</th>
      <th>Roast Profile</th>
      <th>Flavor Notes</th>
      <th>Elevation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ethiopia Yirgacheffe</td>
      <td>Light Roast</td>
      <td>Bergamot, Jasmine, Lemon peel</td>
      <td>1,950m</td>
    </tr>
    <tr>
      <td>Colombia Huila</td>
      <td>Medium Roast</td>
      <td>Caramel, Red Apple, Milk Chocolate</td>
      <td>1,700m</td>
    </tr>
    <tr>
      <td>Sumatra Mandheling</td>
      <td>Dark Roast</td>
      <td>Cedar, Dark Cocoa, Sweet Tobacco</td>
      <td>1,400m</td>
    </tr>
  </tbody>
</table>

<p>Every cup represents a balance between culinary craft and community connection, shaping urban daily life across the Pacific Northwest.</p>
`;

export function createNewDocument(title: string = 'Document 1', templateHtml: string = INITIAL_DOCUMENT_HTML): DocumentState {
  return {
    id: 'doc_' + Math.random().toString(36).substring(2, 9),
    title,
    filePath: null,
    isDirty: false,
    lastSavedAt: null,
    htmlContent: templateHtml,
    metadata: {
      ...DEFAULT_METADATA,
      title,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    },
    pageSetup: { ...DEFAULT_PAGE_SETUP },
    headerFooter: { ...DEFAULT_HEADER_FOOTER },
    trackChanges: [],
    trackChangesEnabled: false,
    markupDisplayMode: 'all',
    comments: [],
    drawings: [],
    citations: [
      {
        id: 'cit_1',
        key: 'Knuth1984',
        type: 'book',
        title: 'The TeXbook',
        authors: 'Donald E. Knuth',
        year: '1984',
        journalOrPublisher: 'Addison-Wesley',
      },
      {
        id: 'cit_2',
        key: 'Lamport1994',
        type: 'book',
        title: 'LaTeX: A Document Preparation System',
        authors: 'Leslie Lamport',
        year: '1994',
        journalOrPublisher: 'Addison-Wesley',
      },
    ],
    mailMerge: {
      enabled: false,
      fields: ['FirstName', 'LastName', 'Company', 'Address', 'Email', 'Position'],
      records: [
        { FirstName: 'Sarah', LastName: 'Connor', Company: 'Cyberdyne Systems', Address: '742 Evergreen Terrace', Email: 'sarah@example.com', Position: 'Chief Security Officer' },
        { FirstName: 'John', LastName: 'Doe', Company: 'Acme Corporation', Address: '123 Market Street', Email: 'john.doe@example.com', Position: 'Senior Architect' },
        { FirstName: 'Alice', LastName: 'Smith', Company: 'Initech Labs', Address: '456 Innovation Way', Email: 'alice@initech.com', Position: 'Principal Engineer' },
      ],
      currentRecordIndex: 0,
    },
    activeThemeId: 'office',
    zoomLevel: 100,
    viewMode: 'print',
    showRuler: false,
    showNavigationPane: false,
    showCommentsPane: false,
    showTrackChangesPane: false,
  };
}

export const TEMPLATES = [
  {
    id: 'blank',
    title: 'Blank Document',
    description: 'Start from a clean slate with standard margins and normal typography.',
    html: '<p></p>',
  },
  {
    id: 'business_letter',
    title: 'Business Letter',
    description: 'Professional formal letter layout with recipient address, date, and sign-off.',
    html: `
<p><strong>[Your Name]</strong><br>[Your Title]<br>[Company Name]<br>[123 Street Address]<br>[City, ST ZIP Code]<br>[Email Address] | [Phone Number]</p>
<p>${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
<p><strong>[Recipient Name]</strong><br>[Title]<br>[Company Name]<br>[456 Business Road]<br>[City, ST ZIP Code]</p>
<p>Dear [Recipient Name],</p>
<p>I am writing to formally propose our strategic collaboration for the upcoming fiscal quarter. Following our preliminary discussions, our team has prepared an outline designed to optimize workflow operations, enhance document fidelity, and deliver superior engineering productivity.</p>
<p>Key initiatives include:</p>
<ul>
  <li>Deployment of native desktop document authoring infrastructure.</li>
  <li>Direct integration of OpenXML DOCX compatibility pipelines.</li>
  <li>Multi-tiered review governance with rigorous track changes auditing.</li>
</ul>
<p>We welcome the opportunity to review these deliverables with your leadership committee next Tuesday. Thank you for your continued partnership.</p>
<p>Sincerely,</p>
<p><br><strong>[Your Name]</strong><br>[Your Title]</p>
`,
  },
  {
    id: 'modern_resume',
    title: 'Executive Resume',
    description: 'Modern, well-structured CV with clean headings, skills matrix, and career milestones.',
    html: `
<h1>ALEXANDER MORGAN</h1>
<p><strong>Senior Principal Software Architect</strong> | San Francisco, CA | alex.morgan@example.com | (555) 019-2834</p>
<hr>
<h2>PROFESSIONAL SUMMARY</h2>
<p>Innovative technology leader with 14+ years of experience engineering desktop software suites, high-performance rendering engines, and document processing systems. Proven track record leading distributed engineering teams to deliver mission-critical productivity applications.</p>

<h2>CORE COMPETENCIES</h2>
<ul>
  <li><strong>Architectures:</strong> Native Desktop Systems (macOS, Electron), Distributed Engines, Cross-Platform UI.</li>
  <li><strong>Standards:</strong> Office Open XML (ISO/IEC 29500), PDF/A, Typography & Font Metrics.</li>
  <li><strong>Methodologies:</strong> Agile Leadership, Rigorous Automated Testing, Zero-Defect Releases.</li>
</ul>

<h2>PROFESSIONAL EXPERIENCE</h2>
<p><strong>Principal Architect</strong> | OmniSoftware Inc. | <em>2021 – Present</em></p>
<ul>
  <li>Architected next-generation desktop word processor serving 500,000+ enterprise users.</li>
  <li>Engineered continuous multi-page pagination engine with sub-16ms layout recalculation.</li>
  <li>Implemented full ISO OpenXML (DOCX) import/export pipeline with 99.4% round-trip fidelity.</li>
</ul>

<p><strong>Staff Systems Engineer</strong> | NextGen Applications | <em>2016 – 2021</em></p>
<ul>
  <li>Led development of real-time collaborative document review systems with revision tracking.</li>
  <li>Pioneered memory-efficient text buffering strategies for multi-thousand page documents.</li>
</ul>

<h2>EDUCATION</h2>
<p><strong>Master of Science in Computer Science</strong> | Stanford University<br>
<strong>Bachelor of Science in Computer Engineering</strong> | UC Berkeley</p>
`,
  },
  {
    id: 'project_proposal',
    title: 'Project Proposal',
    description: 'Formal business proposal including executive summary, scope, timeline, and budget.',
    html: `
<h1>PROJECT PROPOSAL: ENTERPRISE DOCUMENT PLATFORM</h1>
<p><strong>Prepared for:</strong> Executive Steering Committee<br>
<strong>Prepared by:</strong> Desktop Systems Engineering Group<br>
<strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
<hr>

<h2>1. EXECUTIVE SUMMARY</h2>
<p>This proposal outlines the deployment of WordForge, an enterprise-grade desktop word processor engineered natively for macOS. The solution replaces cumbersome web-only editors with a secure, offline-first application offering complete Microsoft Word fidelity, OpenXML compatibility, and multi-page pagination.</p>

<h2>2. PROJECT OBJECTIVES</h2>
<ul>
  <li>Eliminate third-party cloud data transmission for sensitive legal and financial documents.</li>
  <li>Provide seamless round-trip compatibility with existing DOCX corporate templates.</li>
  <li>Deliver sub-second startup times and responsive pagination across documents exceeding 200 pages.</li>
</ul>

<h2>3. ESTIMATED BUDGET & RESOURCE ALLOCATION</h2>
<table>
  <thead>
    <tr>
      <th>Phase / Workstream</th>
      <th>Resource Allocation</th>
      <th>Target Completion</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Phase 1: Core Engine & Pagination</td>
      <td>4 Senior Engineers</td>
      <td>Month 1</td>
    </tr>
    <tr>
      <td>Phase 2: DOCX Interoperability</td>
      <td>3 Format Specialists</td>
      <td>Month 2</td>
    </tr>
    <tr>
      <td>Phase 3: Review, Mailings & QA</td>
      <td>4 Full-Stack Engineers</td>
      <td>Month 3</td>
    </tr>
  </tbody>
</table>

<h2>4. CONCLUSION & NEXT STEPS</h2>
<p>Upon executive approval, the core development group will initiate sprint zero and establish production builds for macOS Apple Silicon and Intel platforms.</p>
`,
  },
];

export function calculateTextStatistics(text: string): { words: number; chars: number; charsNoSpaces: number; paragraphs: number; lines: number } {
  const clean = text.replace(/<[^>]*>/g, ' ');
  const plainText = clean.replace(/&nbsp;/g, ' ').trim();
  
  const words = plainText.length === 0 ? 0 : plainText.split(/\s+/).filter(Boolean).length;
  const chars = plainText.length;
  const charsNoSpaces = plainText.replace(/\s/g, '').length;
  
  // Paragraphs
  const paragraphMatches = text.match(/<(p|h[1-6]|li)[^>]*>/gi);
  const paragraphs = paragraphMatches ? paragraphMatches.length : (plainText.length > 0 ? 1 : 0);
  
  // Estimated lines
  const lines = Math.max(1, Math.ceil(chars / 65));

  return { words, chars, charsNoSpaces, paragraphs, lines };
}
