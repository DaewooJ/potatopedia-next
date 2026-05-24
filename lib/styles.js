export const ppCSS = `
  .pp-hero-input:focus { border-color: #C62828 !important; box-shadow: 0 0 0 4px rgba(198,40,40,0.08) !important; }
  .pp-country-card { transition: all 0.3s ease; cursor: pointer; }
  .pp-country-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); border-color: rgba(198,40,40,0.3) !important; }
  .pp-trending-btn { transition: all 0.25s ease; }
  .pp-trending-btn:hover { background: #C62828 !important; color: white !important; border-color: #C62828 !important; transform: translateX(4px); }
  .pp-trending-btn:hover .pp-arr { color: white !important; }
  .pp-cat-card { transition: all 0.3s ease; cursor: pointer; }
  .pp-cat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,0.06); border-color: rgba(198,40,40,0.25) !important; }
  .pp-pill { transition: all 0.2s ease; }
  .pp-pill:hover { background: #C62828 !important; color: white !important; border-color: #C62828 !important; }
  .pp-nav-link { transition: all 0.2s ease; }
  .pp-nav-link:hover { color: #C62828 !important; }
  .pp-fab { transition: all 0.3s ease; }
  .pp-fab:hover { transform: scale(1.08); box-shadow: 0 8px 32px rgba(198,40,40,0.4) !important; }
  .pp-stat:hover { transform: translateY(-2px); }
  .pp-search-wrap:focus-within { border-color: rgba(198,40,40,0.3) !important; box-shadow: 0 8px 40px rgba(0,0,0,0.06) !important; }
  .pp-faq-toggle { transition: all 0.2s ease; cursor: pointer; }
  .pp-faq-toggle:hover { background: rgba(198,40,40,0.04) !important; }
  @media (max-width: 768px) {
    .pp-hero-title { font-size: 32px !important; letter-spacing: -1px !important; }
    .pp-hero-sub { font-size: 15px !important; }
    .pp-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .pp-countries-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .pp-categories-grid { grid-template-columns: 1fr !important; }
    .pp-section { padding-left: 20px !important; padding-right: 20px !important; }
    .pp-nav-inner { padding: 0 16px !important; }
    .pp-search-bar { flex-direction: column !important; }
    .pp-search-btn { width: 100% !important; border-radius: 12px !important; }
    .pp-trending-grid { grid-template-columns: 1fr !important; }
    .pp-footer-top { flex-direction: column !important; }
    .pp-section-title { font-size: 26px !important; }
    .pp-faq-grid { grid-template-columns: 1fr !important; }
  }
`;
