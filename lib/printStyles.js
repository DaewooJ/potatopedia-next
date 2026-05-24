/**
 * Shared @media print stylesheet for Potatopedia country dossier pages.
 *
 * Used by every country page that renders the dossier template
 * (India, China, Belgium, and future Tier-1 country pages).
 *
 * The stylesheet:
 *   - Hides nav, footer, AI widgets, mobile CTAs in print
 *   - Renders an A4-formatted printable layout with brand-coloured headings
 *   - Repeats potatopedia.com · hello@potatopedia.com plus page numbers in
 *     @bottom-center on every printed page (Chrome/Edge)
 *   - Repeats potatopedia.com · hello@potatopedia.com · LinkedIn in a
 *     position:fixed footer DIV on every printed page (cross-browser fallback)
 *   - Forces major narrative sections (S4 Production, S6 Varieties, S8 Processing, etc.)
 *     to start on a new page via page-break-before: always
 *   - Protects tables, stat cards, quick-fact cards, and trajectory callouts
 *     from splitting across pages with break-inside: avoid
 *   - Repaints dark sections (vital stats dashboard, AI explorer) to light
 *     for ink-friendly print output
 *
 * Mobile-print compatibility: iOS Safari and Android Chrome both honour
 * the @page rules and break controls below.
 */

export const printCSS = `
@media print {
  /* ── Page geometry ──────────────────────────────────────────── */
  /* Top margin increased to 2.5cm (was 2cm) so content never collides
     with margin boxes. @top-right watermark removed — the bulletproof
     position:fixed footer already brands every page across all browsers,
     so the @top-right was both redundant AND collision-prone on dense
     content pages. */
  @page {
    size: A4;
    margin: 3cm 2.5cm 3.5cm 2.5cm;
    @bottom-center {
      content: "potatopedia.com  ·  hello@potatopedia.com  ·  Page " counter(page) " of " counter(pages);
      font-family: "Poppins", -apple-system, sans-serif;
      font-size: 7.5pt;
      color: #666;
    }
  }

  /* Hide non-printable elements — comprehensively */
  nav, footer, .pp-no-print,
  .pp-ai-explorer-band, .pp-ai-explorer-light,
  .pp-ai-inline-cta, .pp-mobile-sticky-ai, .pp-mobile-pdf-cta,
  .pp-comparable-countries, .pp-bottom-cta,
  [data-no-print] {
    display: none !important;
  }

  /* Body sanitation — black-on-white, no shadows */
  body, html { background: #fff !important; color: #1A1A1A !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-size: 10.5pt; line-height: 1.5; }
  * { box-shadow: none !important; }

  /* Default paragraph orphan / widow controls */
  p, li { orphans: 2; widows: 2; color: #1A1A1A !important; margin: 0 0 5pt !important; }

  /* ── Print-only branded header (page 1 only) ─────────────────── */
  .pp-print-header {
    display: block !important;
    padding: 0 4pt 8pt 4pt !important;
    margin: 0 0 14pt 0 !important;
    border-bottom: 2pt solid #C62828 !important;
    page-break-after: avoid;
    break-inside: avoid;
  }
  .pp-print-header-row {
    display: flex !important;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12pt;
  }
  .pp-print-header-brand {
    font-size: 13pt !important;
    font-weight: 800 !important;
    color: #C62828 !important;
    letter-spacing: 1.2pt;
  }
  .pp-print-header-meta {
    font-size: 8pt !important;
    color: #555 !important;
    text-align: right;
    line-height: 1.5;
  }

  /* ── Country page container — strip screen-only flourishes ──── */
  /* Inner padding 12pt sides + 40pt bottom so content never collides with
     the @page margin or the position:fixed footer. Class-attribute selector
     covers any future country page that uses .pp-country-* class naming. */
  [class*="pp-country-"] {
    padding: 0 12pt 40pt 12pt !important;
    max-width: none !important;
    background: #fff !important;
  }
  .pp-country-india {
    padding: 0 12pt 40pt 12pt !important;
    max-width: none !important;
    background: #fff !important;
  }

  /* Section wrapper — neutralised in print to use @page geometry */
  .pp-section-wrap {
    max-width: none !important;
    padding: 0 !important;
  }

  /* ── Banner ──────────────────────────────────────────────────── */
  .pp-india-banner {
    padding: 0 0 12pt 0 !important;
    background: #fff !important;
    border-bottom: 2pt solid #C62828 !important;
    page-break-after: avoid;
    margin-bottom: 12pt !important;
  }
  .pp-india-banner-flag { font-size: 28pt !important; }
  .pp-india-banner h1 { font-size: 22pt !important; color: #1A1A1A !important; margin: 0 0 4pt !important; page-break-after: avoid; }
  .pp-india-tagline { font-size: 10.5pt !important; color: #444 !important; margin: 6pt 0 0 !important; }
  .pp-india-banner-pdf { display: none !important; }

  /* ── Vital stats dashboard — repaint dark→light for print ───── */
  .pp-vital-stats {
    background: #FAFAFA !important;
    padding: 10pt 8pt !important;
    border: 1pt solid #ddd !important;
    page-break-inside: avoid;
    break-inside: avoid;
    margin: 0 0 14pt !important;
    color: #1A1A1A !important;
  }
  .pp-vital-stats * { color: #1A1A1A !important; }
  .pp-vital-stats-summary {
    background: #fff !important;
    border: 1pt solid #ccc !important;
    border-left: 3pt solid #C62828 !important;
    padding: 10pt !important;
    margin: 0 0 12pt !important;
    color: #1A1A1A !important;
    break-inside: avoid;
  }
  .pp-vital-stats-summary strong { color: #C62828 !important; }
  .pp-vital-stats-grid {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 6pt !important;
  }
  .pp-vital-stat-cell {
    background: #fff !important;
    padding: 8pt !important;
    border: 1pt solid #e0e0e0 !important;
    break-inside: avoid;
  }
  .pp-vital-stat-value { color: #1A1A1A !important; font-size: 12pt !important; font-weight: 800 !important; }
  .pp-vital-stat-label { color: #666 !important; font-size: 7.5pt !important; }
  .pp-vital-stat-sub { color: #888 !important; font-size: 7.5pt !important; }
  .pp-delta-up { background: #E8F5E9 !important; color: #2E7D32 !important; }

  /* ── Quick facts ─────────────────────────────────────────────── */
  .pp-quickfacts {
    padding: 0 !important;
    background: #fff !important;
    page-break-inside: avoid;
    break-inside: avoid;
    margin: 12pt 0 !important;
  }
  .pp-quickfacts-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 8pt !important;
  }
  .pp-quickfact-card {
    background: #fff !important;
    border: 1pt solid #e0e0e0 !important;
    padding: 8pt !important;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .pp-quickfact-card * { color: #1A1A1A !important; }

  /* ── Tables: clean borders, page-break protection ────────────── */
  /* Default font-size dropped to 8pt for print so 6+ column tables
     (variety portfolios, processing players, state production) fit
     A4 width without column wrapping. */
  table {
    page-break-inside: avoid;
    break-inside: avoid;
    width: 100% !important;
    max-width: 100% !important;
    table-layout: auto !important;
    border-collapse: collapse !important;
    font-size: 8pt !important;
    line-height: 1.3 !important;
    margin: 6pt 0 10pt !important;
    word-wrap: break-word;
  }
  thead {
    display: table-header-group; /* repeat header on each page if a long table breaks */
  }
  thead th {
    background: #C62828 !important;
    color: #fff !important;
    padding: 3pt 4pt !important;
    text-align: left;
    font-size: 7.5pt !important;
    font-weight: 700;
    line-height: 1.25 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  tbody tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  tbody td {
    padding: 3pt 4pt !important;
    border-bottom: 0.5pt solid #ddd !important;
    color: #1A1A1A !important;
    word-break: break-word;
    line-height: 1.3 !important;
  }
  /* Wide-column tables (7+ columns) compress to 7.5pt */
  table.pp-print-wide-table,
  table[data-print-wide] {
    font-size: 7.5pt !important;
  }
  table.pp-print-wide-table thead th,
  table[data-print-wide] thead th {
    font-size: 7pt !important;
  }

  /* ── Section headings & spacing ──────────────────────────────── */
  section {
    padding: 6pt 0 !important;
    margin: 0 !important;
    background: #fff !important;
    border: none !important;
    border-bottom: 0.5pt solid #eee !important;
  }
  h2 {
    color: #C62828 !important;
    font-size: 13pt !important;
    padding-left: 8pt !important;
    border-left: 3pt solid #C62828 !important;
    margin: 8pt 0 6pt !important;
    page-break-after: avoid;
    break-after: avoid;
  }
  h3 { font-size: 11pt !important; margin: 8pt 0 4pt !important; color: #1A1A1A !important; page-break-after: avoid; }

  /* Major narrative sections start on a new page so PDF readers can navigate */
  .pp-print-page-break-before,
  section[data-pdf-break] {
    page-break-before: always !important;
    break-before: page !important;
  }

  /* ── Specialised callouts ────────────────────────────────────── */
  .pp-trajectory-callout {
    background: #FFF8F8 !important;
    border: 1pt solid #C62828 !important;
    padding: 8pt !important;
    break-inside: avoid;
  }
  .pp-trajectory-callout * { color: #1A1A1A !important; }

  /* ── Sources block ──────────────────────────────────────────── */
  .pp-sources-block {
    background: #FAFAFA !important;
    padding: 10pt !important;
    border: 1pt solid #e0e0e0 !important;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .pp-sources-block * { color: #1A1A1A !important; }

  /* Force-show details in print */
  details { display: block !important; }
  details > summary { display: block !important; font-weight: 700 !important; margin: 4pt 0 !important; cursor: default !important; }
  details > summary::-webkit-details-marker { display: none; }

  /* Links: dark text, no underline (URLs are decorative in print) */
  a { color: #1A1A1A !important; text-decoration: none !important; }

  /* Force chip / share-bar colours to print */
  .pp-share-bar-fill {
    background: #C62828 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .pp-share-bar-track { background: #F4D6D6 !important; }

  /* ── Bulletproof per-page footer fallback ────────────────────
     Browsers that ignore @page @bottom-center (Safari especially)
     will still render this position:fixed footer on every printed
     page. -webkit-print-color-adjust: exact ensures the border line
     prints. */
  .pp-print-footer-fixed {
    display: block !important;
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    text-align: center !important;
    font-size: 7.5pt !important;
    color: #666 !important;
    padding: 4pt 12pt !important;
    border-top: 0.5pt solid #ddd !important;
    background: #fff !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    z-index: 9999;
  }

  /* ── Inline document-end footer ──────────────────────────────
     Mobile Safari / Chrome Android print pipelines often drop both
     @page margin boxes AND position:fixed elements. This inline
     footer renders within the document flow as the very last block,
     guaranteeing the URL/email/LinkedIn appears at least once on
     the final printed page on every device. */
  .pp-print-footer-inline {
    display: block !important;
    text-align: center !important;
    font-size: 7.5pt !important;
    color: #666 !important;
    padding: 12pt 0 0 !important;
    border-top: 0.5pt solid #ddd !important;
    margin-top: 24pt !important;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* ── Hide standalone "Read more" CTAs in print ───────────────
     PDF readers can't follow internal links; "Read more →" lines
     waste space without providing value. The class is added to
     standalone CTA paragraphs in country dossier components. */
  .pp-read-more-link {
    display: none !important;
  }

  /* ── Force a page break after the Quick Facts strip ──────────
     Page 1 of the PDF (banner + vital stats + quick facts) is
     visually dense; pushing the data tables onto a fresh page
     gives the reader breathing room. Country dossier components
     opt-in by adding data-pdf-break-after to the <section>. */
  [data-pdf-break-after],
  .pp-pdf-break-after {
    page-break-after: always !important;
    break-after: page !important;
  }
}

@media screen {
  .pp-print-only, .pp-print-header,
  .pp-print-footer-fixed, .pp-print-footer-inline { display: none !important; }
}
`;
