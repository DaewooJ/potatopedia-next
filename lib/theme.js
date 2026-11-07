// Premium design system for every page except the homepage and /ask (Devendra, 7 Nov 2026).
// Ivory ground, ink, bronze-gold accent; Instrument Serif headings + Inter body (CSS variables from lib/fonts.js).
// Reading pages default to LIGHT; the ripple ThemeFab sets html[data-theme="dark"]. Tokens live on :root so inline
// styles anywhere can use var(--ink) etc. No green anywhere; brand red #C62828 only for the theme button and
// primary submit buttons.

export const THEME_INIT = `try{var q=new URLSearchParams(location.search).get("theme");var t=q||localStorage.getItem("pp-read-theme");if(t==="dark"&&location.pathname!=="/"&&location.pathname.indexOf("/ask")!==0)document.documentElement.setAttribute("data-theme","dark")}catch(e){}`;

export const PP_CSS = `
:root { --bg:#FBF8F2; --paper:#F2EADC; --card:#FFFFFF; --ink:#16140F; --ink2:#2E2A23; --mute:#5E584D; --mute2:#7A7366; --mute3:#8C8476;
  --line:#E6DCCB; --line2:#DCD0BB; --dash:#CDBFA6; --gold:#9A7238; --gold-h:#6E5226; --gold-soft:rgba(154,114,56,.07); --gold-line:rgba(154,114,56,.24);
  --root:#C8A97A; --panel:#16140F; --panel-ink:#F6F1E8; --panel-mute:#B7B2AA; --panel-gold:#E2C08D; --panel-line:rgba(255,255,255,.16);
  --accent-bg:#16140F; --on-accent:#F6F1E8; --nav-bg:rgba(251,248,242,.92); --shadow:0 24px 60px rgba(60,40,10,.08); --red:#C62828; }
:root[data-theme="dark"] { --bg:#0A0A0D; --paper:#121116; --card:#17161B; --ink:#F4F1EC; --ink2:#DCD7CF; --mute:#B7B2AA; --mute2:#9A958D; --mute3:#7F7B74;
  --line:rgba(255,255,255,.10); --line2:rgba(255,255,255,.16); --dash:rgba(255,255,255,.24); --gold:#E2C08D; --gold-h:#F0D5AA; --gold-soft:rgba(226,192,141,.07); --gold-line:rgba(226,192,141,.24);
  --root:rgba(226,192,141,.55); --panel:#1D1B18; --panel-line:rgba(255,255,255,.14); --accent-bg:#7E5C2B; --on-accent:#FFFFFF; --nav-bg:rgba(10,10,13,.86); --shadow:0 30px 80px rgba(0,0,0,.45); color-scheme: dark; }
html { scroll-padding-top: 96px; }
body { background: var(--bg); color: var(--ink); }
.pp { font-family: var(--hp-sans), system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--ink); min-height: 100vh; overflow-x: clip; transition: background .5s ease, color .5s ease; }
.pp ::selection { background: rgba(154,114,56,.28); }
.pp h1, .pp h2 { font-family: var(--hp-serif), Georgia, serif !important; font-weight: 400 !important; letter-spacing: -.01em !important; }
.pp em.g, .pp .g-em { font-style: italic; color: var(--gold); }
.pp a.gl, .pp .gl { color: var(--gold); text-decoration: none; font-weight: 500; }
.pp a.gl:hover { color: var(--gold-h); }
.pp-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.pp .arr { display: inline-block; transition: transform .2s ease; }
.pp a:hover .arr { transform: translateX(4px); }
@keyframes ppRise { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
@keyframes ppRoot { from { stroke-dashoffset: 400 } to { stroke-dashoffset: 0 } }
@keyframes ppDraw { from { stroke-dashoffset: 1400 } to { stroke-dashoffset: 0 } }
@keyframes ppFade { from { opacity: 0 } to { opacity: 1 } }
.rise { animation: ppRise .9s ease-out both; }

/* ── Navigation ── */
.pn { position: sticky; top: 0; z-index: 100; background: var(--nav-bg); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); border-bottom: 1px solid var(--line); }
.pn-in { max-width: 1200px; margin: 0 auto; padding: 14px 32px; display: flex; align-items: center; gap: 28px; }
.pn-logo { font-family: var(--hp-serif), Georgia, serif; font-size: 26px; line-height: 1; color: var(--ink) !important; text-decoration: none; letter-spacing: -.01em; }
.pn-links { display: flex; gap: 24px; font-size: 14px; }
.pn-links a { color: var(--mute); text-decoration: none; transition: color .2s; }
.pn-links a:hover, .pn-links a.is-on { color: var(--ink); }
.pn-links a.is-on { font-weight: 500; }
.pn-right { margin-left: auto; display: flex; gap: 10px; align-items: center; }
.pn-ask { border: 1px solid var(--line2); border-radius: 999px; padding: 9px 16px; font-size: 13px; color: var(--mute) !important; text-decoration: none; min-width: 170px; transition: border-color .2s; }
.pn-ask:hover { border-color: var(--gold); }
.pn-adv { background: var(--ink); color: var(--bg) !important; text-decoration: none; font-weight: 500; font-size: 14px; padding: 10px 18px; border-radius: 999px; white-space: nowrap; }
.pn-burger { display: none; width: 44px; height: 44px; border-radius: 999px; border: 1px solid var(--line2); background: transparent; color: var(--ink); align-items: center; justify-content: center; cursor: pointer; }
.pn-panel { border-top: 1px solid var(--line); background: var(--bg); padding: 10px 16px 20px; display: grid; gap: 2px; box-shadow: var(--shadow); max-height: calc(100vh - 72px); overflow-y: auto; }
.pn-panel a { display: block; padding: 14px 12px; border-radius: 12px; text-decoration: none; color: var(--ink); font-size: 17px; }
.pn-panel a.is-on { background: var(--gold-soft); }
.pn-panel .pn-panel-ask { margin: 6px 0; border: 1px solid var(--line2); color: var(--mute); font-size: 15px; border-radius: 999px; padding: 13px 18px; }
.pn-panel .pn-panel-adv { margin-top: 8px; text-align: center; background: var(--ink); color: var(--bg); border-radius: 999px; font-weight: 500; font-size: 15px; }
.ed-prog { position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 120; pointer-events: none; background: transparent; }
.ed-prog span { display: block; height: 2px; background: var(--gold); transform-origin: left; }

/* ── Footer ── */
.pf { background: #0A0A0D; color: #A9A49C; padding: 56px 32px 40px; font-size: 13.5px; }
.pf-in { max-width: 1200px; margin: 0 auto; }
.pf-top { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 32px; }
.pf-logo { font-family: var(--hp-serif), Georgia, serif; font-size: 26px; color: #F4F1EC; text-decoration: none; }
.pf-about { margin: 10px 0 0; max-width: 300px; line-height: 1.6; }
.pf-k { margin: 0 0 12px; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: #E2C08D; }
.pf-col { display: grid; gap: 9px; align-content: start; }
.pf a { color: #A9A49C; text-decoration: none; transition: color .2s; }
.pf a:hover { color: #F4F1EC; }
.pf-bot { margin-top: 44px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,.08); display: flex; flex-wrap: wrap; gap: 10px 28px; align-items: center; font-size: 12.5px; color: #8E8A83; }
.pf-bot span:last-child { margin-left: auto; }

/* ── Theme switch (same as the homepage) ── */
.tf { position: fixed; right: 24px; bottom: 24px; z-index: 70; width: 60px; height: 60px; border-radius: 50%; border: 0; padding: 0; cursor: pointer; background: #C62828; color: #fff; box-shadow: 0 14px 36px rgba(198,40,40,.4); display: flex; align-items: center; justify-content: center; transition: transform .25s ease, box-shadow .25s ease; }
.tf:hover { transform: scale(1.06); box-shadow: 0 18px 44px rgba(198,40,40,.5); }
.tf:active { transform: scale(.96); }
.tf-label { position: relative; font: 500 11px var(--hp-sans), sans-serif; letter-spacing: .12em; text-transform: uppercase; }
.tf-ring { position: absolute; inset: -6px; border-radius: 50%; border: 1px solid rgba(198,40,40,.45); animation: tfPulse 2.8s ease-out infinite; }
@keyframes tfPulse { 0% { transform: scale(.9); opacity: .9 } 100% { transform: scale(1.35); opacity: 0 } }
.tf:focus-visible { outline: 3px solid #E2C08D; outline-offset: 4px; }
::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }

/* ── Shared pieces ── */
.k { margin: 0 0 12px; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); font-weight: 400; }
.k-mute { color: var(--mute3); }
.eyebrow { margin: 0 0 16px; font-size: 12.5px; letter-spacing: .22em; text-transform: uppercase; color: var(--gold); }
.eyebrow a { color: var(--gold); text-decoration: none; }
.crumb { margin: 0 0 14px; font-size: 13px; color: var(--mute2); }
.crumb a { color: var(--gold); text-decoration: none; }
.crumb span[aria-hidden] { margin: 0 8px; color: var(--mute3); }
.panel { border-radius: 20px; background: var(--panel); color: var(--panel-ink); padding: 26px; border: 1px solid var(--panel-line); }
.panel .k { color: var(--panel-gold); }
.panel-t { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-size: 28px; line-height: 1.1; }
.panel-s { margin: 10px 0 16px; font-size: 14px; line-height: 1.6; color: var(--panel-mute); }
.slot { display: block; border-radius: 20px; border: 1px dashed var(--dash); padding: 22px; text-decoration: none; color: var(--ink) !important; transition: border-color .2s; }
.slot:hover { border-color: var(--gold); }
.slot-t { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-size: 24px; line-height: 1.15; }
.slot-s { margin: 6px 0 0; font-size: 13.5px; line-height: 1.55; color: var(--mute); }
.card { display: block; background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 20px; text-decoration: none; color: var(--ink) !important; transition: border-color .2s, transform .2s; }
a.card:hover { border-color: var(--gold-line); transform: translateY(-2px); }
.card-k { font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--gold); }
.card-t { display: block; margin-top: 8px; font-family: var(--hp-serif), Georgia, serif; font-size: 22px; line-height: 1.15; }
.card-s { display: block; margin-top: 8px; font-size: 13.5px; line-height: 1.55; color: var(--mute); }
.band { background: var(--paper); padding: 56px 32px; transition: background .5s ease; }
.band-in { max-width: 1040px; margin: 0 auto; }
.band-h { margin: 0 0 18px; font-family: var(--hp-serif), Georgia, serif; font-size: 34px; font-weight: 400; }
.grid-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
.figs { margin: 36px 0 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid var(--line2); border-bottom: 1px solid var(--line2); }
.figs li { padding: 22px 16px 22px 0; }
.fig-n { display: block; font-family: var(--hp-serif), Georgia, serif; font-size: 42px; line-height: 1.05; color: var(--ink); }
.fig-l { display: block; margin-top: 4px; font-size: 11.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--mute2); line-height: 1.5; }
.btn-red { border: 0; border-radius: 12px; background: #C62828; color: #fff; font: inherit; font-weight: 500; font-size: 15px; padding: 0 22px; min-height: 48px; cursor: pointer; }
.btn-red:hover { background: #A61F1F; }
.btn-line { display: inline-block; border: 1px solid var(--line2); border-radius: 999px; padding: 10px 18px; font-size: 14px; color: var(--ink) !important; text-decoration: none; transition: border-color .2s; }
.btn-line:hover { border-color: var(--gold); }

/* Ask a follow-up */
.ask { margin-top: 40px; border-radius: 18px; background: var(--panel); color: var(--panel-ink); padding: 24px 26px; display: flex; gap: 16px 20px; align-items: center; flex-wrap: wrap; border: 1px solid var(--panel-line); }
.ask-t { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-size: 24px; }
.ask-s { margin: 4px 0 0; font-size: 14px; color: var(--panel-mute); line-height: 1.5; }
.ask-f { flex: 1.2; min-width: 240px; display: flex; gap: 8px; }
.ask-f input { flex: 1; min-width: 0; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.16); border-radius: 12px; padding: 13px 14px; font: inherit; font-size: 15px; color: #F6F1E8; outline: 0; }
.ask-f input::placeholder { color: #9A958D; }
.ask-f input:focus { border-color: #E2C08D; }

/* Sources with roots */
.src { margin-top: 48px; }
.src-roots { display: block; width: 100%; height: 60px; overflow: visible; }
.src-root { fill: none; stroke: var(--root); stroke-width: 1.5; stroke-dasharray: 400; animation: ppRoot 2s ease-out .4s both; }
.src-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.src-card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 14px; }
.src-n { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-size: 20px; line-height: 1.15; }
.src-m { margin: 4px 0 0; font-size: 12.5px; line-height: 1.45; color: var(--mute2); }
.src-list { margin: 18px 0 0; padding: 0 0 0 18px; font-size: 13px; line-height: 1.6; color: var(--mute2); }
.src-list li { padding: 3px 0; }
.src details summary { cursor: pointer; font-size: 13px; color: var(--gold); margin-top: 14px; }

/* ── Editorial template (blog post, knowledge, answers) ── */
.ed { max-width: 1200px; margin: 0 auto; padding: 64px 32px 40px; }
.ed-head { max-width: 780px; margin: 0 auto; text-align: center; }
.ed-h1 { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(40px, 5.4vw, 64px); line-height: 1.03; letter-spacing: -.015em !important; color: var(--ink); }
.ed-h1 em { font-style: italic; color: var(--gold); }
.ed-dek { margin: 22px auto 0; max-width: 640px; font-size: 19px; line-height: 1.6; color: var(--mute); font-weight: 300; }
.ed-by { margin: 26px 0 0; font-size: 13.5px; color: var(--mute2); }
.ed-by .dot { margin: 0 8px; }
.ed-fig { margin: 48px auto 0; max-width: 1040px; }
.ed-fig img { display: block; width: 100%; height: auto; max-height: 640px; object-fit: cover; border-radius: 20px; border: 1px solid var(--line); }
.ed-fig figcaption { margin-top: 10px; font-size: 12.5px; color: var(--mute3); text-align: center; }
.ed-cols { margin: 56px auto 0; max-width: 1040px; display: flex; gap: 64px; align-items: flex-start; }
.ed-cols.solo { max-width: 680px; }
.ed-toc { width: 220px; flex: none; position: sticky; top: 100px; }
.ed-toc-k { margin: 0 0 14px; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--mute3); }
.ed-toc nav a, .ed-tocm nav a { display: block; padding: 8px 0 8px 14px; border-left: 2px solid var(--line); color: var(--mute2); text-decoration: none; font-size: 14px; line-height: 1.4; transition: color .2s, border-color .2s; }
.ed-toc nav a:hover, .ed-tocm nav a:hover { color: var(--ink); }
.ed-toc nav a.is-on, .ed-tocm nav a.is-on { border-left-color: var(--gold); color: var(--ink); }
.ed-tocm { display: none; margin: 0 0 32px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 14px 0; }
.ed-tocm summary { cursor: pointer; list-style: none; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--mute2); display: flex; justify-content: space-between; }
.ed-tocm summary::-webkit-details-marker { display: none; }
.ed-tocm nav { margin-top: 12px; }
.ed-share { margin-top: 24px; display: flex; gap: 8px; flex-wrap: wrap; }
.ed-chip { display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--line2); border-radius: 999px; padding: 7px 12px; font: inherit; font-size: 12.5px; color: var(--ink) !important; background: transparent; cursor: pointer; text-decoration: none; transition: border-color .2s; }
.ed-chip:hover { border-color: var(--gold); }
.ed-main { flex: 1; min-width: 0; max-width: 680px; }
.ed-take { border-top: 2px solid var(--gold); border-bottom: 1px solid var(--line); padding: 22px 0; margin: 0 0 36px; }
.ed-take ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 10px; }
.ed-take li { font-size: 16px; line-height: 1.6; color: var(--ink2); padding-left: 18px; position: relative; }
.ed-take li::before { content: ""; position: absolute; left: 0; top: .72em; width: 6px; height: 1px; background: var(--gold); }
.ed-p { margin: 0 0 22px; font-size: 19px; line-height: 1.75; color: var(--ink2); }
.ed-drop::first-letter { float: left; font-family: var(--hp-serif), Georgia, serif; font-size: 76px; line-height: .8; padding: 6px 10px 0 0; color: var(--gold); }
.ed-h2 { margin: 44px 0 14px; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: 36px; line-height: 1.1; color: var(--ink); }
.ed-links { margin: 32px 0; border-top: 1px solid var(--gold-line); border-bottom: 1px solid var(--gold-line); padding: 18px 0; }
.ed-links a { display: block; padding: 6px 0; color: var(--gold); text-decoration: none; font-size: 15.5px; line-height: 1.5; }
.ed-links a:hover { color: var(--gold-h); }
.ed-author { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--line); display: flex; gap: 14px; align-items: flex-start; }
.ed-mono { flex: none; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--gold-line); color: var(--gold); display: flex; align-items: center; justify-content: center; font-family: var(--hp-serif), Georgia, serif; font-size: 22px; }
.ed-author-n { margin: 0 0 2px; font-size: 14px; font-weight: 500; color: var(--ink); }
.ed-author-s { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--mute); }

/* ── Dossier template (variety, country) ── */
.dz-top { max-width: 1200px; margin: 0 auto; padding: 48px 32px 0; }
.dz-hero { display: flex; gap: 48px; align-items: flex-end; }
.dz-h1 { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(56px, 8.4vw, 104px); line-height: .95; letter-spacing: -.02em !important; color: var(--ink); overflow-wrap: anywhere; }
.dz-h1 em { font-style: italic; color: var(--gold); }
.dz-lede { margin: 20px 0 0; max-width: 680px; font-size: 19px; line-height: 1.6; color: var(--mute); font-weight: 300; }
.dz-body { max-width: 1200px; margin: 0 auto; padding: 48px 32px; }
.dz-cols { display: flex; gap: 56px; align-items: flex-start; }
.dz-main { flex: 1.5; min-width: 0; }
.dz-aside { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 16px; position: sticky; top: 96px; }
.dz-h2 { margin: 0 0 16px; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: 36px; line-height: 1.1; color: var(--ink); }
.dz-h2-row { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; }
.dz-h2-note { font-size: 13px; color: var(--mute2); }
.dz-sec { margin-top: 44px; }
.dz-table { width: 100%; border-collapse: collapse; font-size: 15.5px; }
.dz-table th[scope="row"] { text-align: left; font-weight: 400; color: var(--mute2); padding: 14px 16px 14px 0; border-top: 1px solid var(--line); width: 38%; vertical-align: top; }
.dz-table td { padding: 14px 0; border-top: 1px solid var(--line); color: var(--ink); vertical-align: top; }
.dz-table tr:last-child th, .dz-table tr:last-child td { border-bottom: 1px solid var(--line); }
.dz-table thead th { font-size: 11.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--mute2); font-weight: 500; text-align: left; padding: 10px 0; }
.dz-na { color: var(--mute2) !important; }
.dz-rivals { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
.dz-rival-n { font-family: var(--hp-serif), Georgia, serif; font-size: 24px; line-height: 1.1; }
.dz-rival-m { display: block; margin-top: 4px; font-size: 13px; color: var(--mute2); }
.dz-prose p { margin: 0 0 16px; font-size: 17px; line-height: 1.75; color: var(--ink2); }
.dz-prose a { color: var(--gold) !important; }
.dz-faq details { border-top: 1px solid var(--line); padding: 16px 0; }
.dz-faq details:last-child { border-bottom: 1px solid var(--line); }
.dz-faq summary { cursor: pointer; list-style: none; display: flex; justify-content: space-between; gap: 16px; font-family: var(--hp-serif), Georgia, serif; font-size: 22px; line-height: 1.25; color: var(--ink); }
.dz-faq summary::-webkit-details-marker { display: none; }
.dz-faq summary span:last-child { font-family: var(--hp-sans), sans-serif; color: var(--gold); font-size: 18px; }
.dz-faq p { margin: 10px 0 0; font-size: 15.5px; line-height: 1.7; color: var(--mute); }
.dz-srcband { background: var(--paper); padding: 40px 32px; transition: background .5s ease; }
.dz-srcband-in { max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 10px 28px; font-size: 13.5px; line-height: 1.6; color: var(--mute); }
.dz-srcband-in .k { width: 100%; margin: 0; }
.dz-chart { display: block; width: 100%; height: auto; margin-top: 18px; overflow: visible; }
.dz-grid line { stroke: var(--line); stroke-width: 1; }
.dz-axis { font-family: var(--hp-sans), sans-serif; font-size: 11px; fill: var(--mute3); }
.dz-yr { font-family: var(--hp-sans), sans-serif; font-size: 11.5px; fill: var(--mute); }
.dz-line { fill: none; stroke: var(--gold); stroke-width: 2.5; stroke-linejoin: round; stroke-linecap: round; stroke-dasharray: 1400; animation: ppDraw 2.2s ease-out .3s both; }
.dz-area { fill: var(--gold); fill-opacity: .12; animation: ppFade 1.2s ease-out 1.6s both; }
.dz-dot { fill: var(--bg); stroke: var(--gold); stroke-width: 2; }
.dz-dot.peak { fill: var(--gold); }
.dz-peak { font-family: var(--hp-sans), sans-serif; font-size: 12px; fill: var(--ink); }
.dz-list { margin: 0; padding: 0; list-style: none; }
.dz-list a { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--line); font-size: 14.5px; text-decoration: none; color: var(--ink) !important; }
.dz-list a:hover { color: var(--gold) !important; }
.dz-legacy { border-top: 1px solid var(--line); }
/* The dossier header now carries the name, rank and figures: hide the old per-country banners' duplicate
   flag/name/tagline and breadcrumb, keep the PDF button and the old descriptive title. */
.dz-legacy .pp-india-banner-row > div:first-child { display: none; }
.dz-legacy .pp-india-banner-row { justify-content: flex-end !important; padding-bottom: 14px !important; }
.dz-legacy .pp-india-banner { border-bottom: 0 !important; }
.dz-legacy .pp-cp-hero > div > div:first-child { display: none; }

/* ── Magazine (blog index) ── */
.mg-mast { max-width: 1200px; margin: 0 auto; padding: 56px 32px 24px; border-bottom: 3px double var(--ink); }
.mg-mast-row { display: flex; gap: 40px; align-items: flex-end; justify-content: space-between; }
.mg-h1 { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(56px, 8vw, 96px); line-height: .92; letter-spacing: -.02em !important; color: var(--ink); }
.mg-h1 em { font-style: italic; color: var(--gold); }
.mg-dek { margin: 0; max-width: 360px; font-size: 16px; line-height: 1.6; color: var(--mute); font-weight: 300; }
.mg-cats { margin-top: 28px; display: flex; gap: 8px 22px; flex-wrap: wrap; font-size: 13.5px; }
.mg-cats a { color: var(--mute); text-decoration: none; }
.mg-cats a:hover, .mg-cats a.is-on { color: var(--ink); }
.mg-cats a.is-on { font-weight: 500; }
.mg-sec { max-width: 1200px; margin: 0 auto; padding: 40px 32px; }
.mg-lead-row { display: flex; gap: 48px; }
.mg-lead { flex: 1.4; text-decoration: none; color: var(--ink) !important; border-top: 2px solid var(--gold); padding-top: 22px; }
.mg-lead-img { display: block; width: 100%; aspect-ratio: 3 / 2; object-fit: cover; border-radius: 14px; margin: 0 0 20px; background: var(--line); }
.mg-story-img { display: block; width: 100%; aspect-ratio: 3 / 2; object-fit: cover; border-radius: 12px; margin: 0 0 14px; background: var(--line); }
.mg-lead-k { margin: 0 0 10px; font-size: 11.5px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); }
.mg-lead-t { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(34px, 4vw, 52px); line-height: 1.04; }
.mg-lead-s { margin: 16px 0 0; font-size: 17px; line-height: 1.6; color: var(--mute); font-weight: 300; }
.mg-lead-take { margin: 22px 0 0; padding: 0; list-style: none; border-top: 1px solid var(--line); }
.mg-lead-take li { padding: 12px 0; border-bottom: 1px solid var(--line); font-size: 14.5px; line-height: 1.55; color: var(--ink2); }
.mg-latest { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.mg-row { text-decoration: none; color: var(--ink) !important; padding: 18px 0; border-bottom: 1px solid var(--line); display: block; }
.mg-row:last-child { border-bottom: 0; }
.mg-row-k { font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--gold); }
.mg-row-t { display: block; margin-top: 6px; font-family: var(--hp-serif), Georgia, serif; font-size: 24px; line-height: 1.15; }
.mg-row:hover .mg-row-t, .mg-lead:hover .mg-lead-t, .mg-story:hover .mg-story-t { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }
.mg-news { background: var(--panel); color: var(--panel-ink); }
.mg-news-in { max-width: 1200px; margin: 0 auto; padding: 36px 32px; display: flex; gap: 24px 40px; align-items: center; }
.mg-news-t { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-size: 30px; }
.mg-news-s { margin: 4px 0 0; font-size: 14px; color: var(--panel-mute); }
.mg-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 36px 28px; }
.mg-story { text-decoration: none; color: var(--ink) !important; border-top: 1px solid var(--line2); padding-top: 16px; display: block; }
.mg-story-k { margin: 0 0 6px; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--gold); }
.mg-story-t { font-family: var(--hp-serif), Georgia, serif; font-size: 25px; line-height: 1.15; }
.mg-story-s { margin: 8px 0 0; font-size: 14px; line-height: 1.55; color: var(--mute); }
.mg-story-m { margin: 10px 0 0; font-size: 12px; color: var(--mute3); }
.mg-slot { border: 1px dashed var(--dash); border-radius: 16px; padding: 18px; text-decoration: none; color: var(--ink) !important; display: block; }
.mg-sec-h { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin: 0 0 18px; }
.mg-sec-h h2 { margin: 0; font-size: 34px; color: var(--ink); }

/* ── Index pages (varieties, countries, knowledge, answers) ── */
.ix-hero { max-width: 1200px; margin: 0 auto; padding: 56px 32px 44px; }
.ix-row { display: flex; gap: 40px; align-items: flex-end; justify-content: space-between; }
.ix-h1 { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(48px, 7vw, 88px); line-height: .95; letter-spacing: -.02em !important; color: var(--ink); }
.ix-h1 em { font-style: italic; color: var(--gold); }
.ix-dek { margin: 0; max-width: 420px; font-size: 16.5px; line-height: 1.65; color: var(--mute); font-weight: 300; }
.ix-dek a { color: var(--gold); text-decoration: none; }
.ix-sec { max-width: 1200px; margin: 0 auto; padding: 40px 32px; }
.ix-sec-h { margin: 0 0 18px; font-size: 34px; color: var(--ink); }

/* ── Legacy content restyle (hand-built knowledge and country pages) ── */
.pp-legacy h1 { font-size: clamp(36px, 5vw, 52px) !important; line-height: 1.05 !important; }
.pp-legacy h2 { line-height: 1.15 !important; }
.pp-legacy h3 { color: var(--ink); }
.pp-legacy table { border-color: var(--line); }
.pp-legacy td, .pp-legacy th { border-color: var(--line) !important; }
.pp-legacy summary { color: var(--ink); }

@media (prefers-reduced-motion: reduce) { .rise, .src-root, .dz-line, .dz-area, .tf-ring { animation: none !important; } .pp * { transition: none !important; } }
@media (max-width: 900px) {
  .pn-links, .pn-ask { display: none; }
  .pn-burger { display: inline-flex; }
  .pf-top { grid-template-columns: 1fr 1fr; }
  .ed-cols, .dz-cols, .dz-hero, .mg-lead-row, .mg-mast-row, .mg-news-in, .ix-row { flex-direction: column; align-items: stretch; }
  .ed-toc { display: none; }
  .ed-tocm { display: block; }
  .dz-aside { position: static; }
  .figs { grid-template-columns: 1fr 1fr; }
  .mg-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .pn-in { padding: 12px 16px; gap: 12px; }
  .pn-adv { padding: 9px 14px; font-size: 13px; }
  .pf { padding: 44px 20px 110px; }
  .pf-top { grid-template-columns: 1fr 1fr; gap: 28px 20px; }
  .pf-top > div:first-child { grid-column: 1 / -1; }
  .pf-bot span:last-child { margin-left: 0; }
  .ed { padding: 40px 20px 32px; }
  .ed-h1 { font-size: 40px; }
  .ed-dek { font-size: 17px; }
  .ed-cols { margin-top: 36px; }
  .ed-p { font-size: 17.5px; line-height: 1.72; }
  .ed-drop::first-letter { font-size: 64px; }
  .ed-h2 { font-size: 30px; }
  .src-grid { grid-template-columns: 1fr; }
  .band { padding: 44px 20px; }
  .band-h { font-size: 30px; }
  .ask { padding: 20px; }
  .ask-f { min-width: 0; flex-basis: 100%; }
  .dz-top { padding: 32px 20px 0; }
  .dz-body { padding: 36px 20px; }
  .dz-h2 { font-size: 30px; }
  .dz-srcband { padding: 32px 20px; }
  .fig-n { font-size: 32px; }
  .figs li { padding: 18px 10px 18px 0; }
  .mg-mast { padding: 36px 20px 20px; }
  .mg-sec { padding: 32px 20px; }
  .mg-news-in { padding: 32px 20px; }
  .mg-grid { grid-template-columns: 1fr; }
  .mg-row-t { font-size: 22px; }
  .ix-hero { padding: 36px 20px 28px; }
  .ix-sec { padding: 32px 20px; }
  .tf { bottom: 18px; right: 16px; width: 54px; height: 54px; }
}
`;
