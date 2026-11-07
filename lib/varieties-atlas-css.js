// Styles for /varieties (Atlas + Finder). Uses the site tokens from lib/theme.js, so light and dark both work.
export const VA_CSS = `
.va { --va-serif: var(--hp-serif), Georgia, serif; color: var(--ink); }
.va a { color: var(--gold); }
.va-hero { max-width: 1280px; margin: 0 auto; padding: 40px 40px 28px; }
.va-crumb { font-size: 12.5px; color: var(--mute2); margin-bottom: 22px; }
.va-crumb a { color: var(--mute2); text-decoration: none; }
.va-crumb a:hover { color: var(--gold); }
.va-hero-row { display: flex; flex-wrap: wrap; gap: 40px; align-items: flex-end; justify-content: space-between; }
.va-hero-l { flex: 1 1 560px; min-width: 0; }
.va-eyebrow { margin: 0 0 14px; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--gold); }
.va-h1 { margin: 0; font-family: var(--va-serif); font-weight: 400; font-size: clamp(38px, 5.2vw, 64px); line-height: 1.03; letter-spacing: -.01em; color: var(--ink); }
.va-h1 em { color: var(--gold); }
.va-dek { margin: 18px 0 0; max-width: 620px; font-size: 16px; line-height: 1.6; color: var(--mute); }
.va-search { flex: 1 1 380px; display: flex; flex-direction: column; gap: 10px; }
.va-search label { font-size: 13px; color: var(--mute); }
.va-search-row { display: flex; gap: 8px; }
.va-search input, .va select, .va-alerts input { font: inherit; color: var(--ink); background: var(--card); border: 1px solid var(--line2); }
.va-search input { flex: 1; min-width: 0; height: 48px; padding: 0 16px; border-radius: 12px; font-size: 15px; }
.va-search input:focus, .va select:focus, .va-alerts input:focus { outline: 2px solid var(--gold-line); outline-offset: 1px; border-color: var(--gold); }
.va-search button { height: 48px; padding: 0 20px; border: 0; border-radius: 12px; background: var(--accent-bg); color: var(--on-accent); font: inherit; font-size: 14px; font-weight: 500; cursor: pointer; }
.va .va-findbtn { align-self: flex-start; font-size: 14px; font-weight: 500; text-decoration: none; padding: 10px 16px; border: 1px solid var(--gold-line); border-radius: 999px; color: var(--ink); }
.va .va-findbtn:hover { border-color: var(--gold); }

.va-chips { max-width: 1280px; margin: 0 auto; padding: 0 40px 28px; display: flex; flex-wrap: wrap; gap: 10px; }
.va-chips button { height: 44px; padding: 0 18px; border-radius: 999px; font: inherit; font-size: 14px; cursor: pointer; background: var(--card); color: var(--ink); border: 1px solid var(--line2); white-space: nowrap; flex: 0 0 auto; }
.va-chips button span { opacity: .6; margin-left: 6px; }
.va-chips button[aria-pressed="true"] { background: var(--accent-bg); color: var(--on-accent); border-color: var(--accent-bg); }

.va-body { max-width: 1280px; margin: 0 auto; padding: 0 40px 56px; display: flex; gap: 32px; align-items: flex-start; }
.va-rail { flex: 0 0 240px; display: flex; flex-direction: column; gap: 20px; font-size: 14px; position: sticky; top: 92px; max-height: calc(100vh - 110px); overflow-y: auto; padding-right: 4px; scrollbar-width: thin; }
.va-sheet-h { display: none; }
.va-fs { border: 0; margin: 0; padding: 0 0 16px; border-bottom: 1px solid var(--line); display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.va-fs legend { font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px; padding: 0; }
.va-fs label { display: flex; align-items: center; gap: 10px; color: var(--ink2); min-height: 30px; cursor: pointer; }
.va-fs input, .va-cmp input, .vf-risks input { width: 16px; height: 16px; accent-color: var(--gold); flex: 0 0 auto; margin: 0; }
.va-fs .va-n { margin-left: auto; font-size: 12px; color: var(--mute3); }
.va-fs-note { margin: 0 0 4px; font-size: 12px; line-height: 1.45; color: var(--mute2); }
.va-clear { align-self: flex-start; background: none; border: 0; padding: 0; font: inherit; font-size: 13.5px; color: var(--gold); cursor: pointer; text-decoration: underline; }

.va-alerts { position: relative; overflow: hidden; padding: 18px; border: 1px solid var(--line); border-radius: 14px; background: var(--paper); display: flex; flex-direction: column; }
.va-alerts-t { margin: 0 0 6px; font-family: var(--va-serif); font-size: 22px; color: var(--ink); }
.va-alerts-s { margin: 0 0 12px; font-size: 13px; line-height: 1.5; color: var(--mute); }
.va-alerts label { font-size: 12px; color: var(--mute); margin-top: 4px; }
.va-alerts input, .va-alerts select { width: 100%; box-sizing: border-box; height: 44px; margin: 6px 0 6px; padding: 0 12px; border-radius: 10px; font-size: 14px; }
.va-alerts button { width: 100%; height: 44px; margin-top: 6px; border: 0; border-radius: 10px; background: var(--gold); color: #fff; font: inherit; font-weight: 500; cursor: pointer; }
:root[data-theme="dark"] .va-alerts button { color: #16140F; }
.va-alerts-ok { margin: 0; font-size: 14px; color: var(--ink); }
.va-alerts-err { margin: 8px 0 0; font-size: 13px; color: var(--red); }
.va-alerts-m { display: none; }

.va-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 18px; }
.va-bar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; font-size: 13.5px; color: var(--mute); }
.va-bar-r { display: flex; align-items: center; gap: 10px; }
.va-fbtn { display: none; height: 40px; padding: 0 14px; border: 1px solid var(--line2); border-radius: 999px; background: var(--card); color: var(--ink); font: inherit; font-size: 13px; cursor: pointer; }
.va-sort { display: flex; align-items: center; gap: 8px; }
.va-sort select { height: 40px; padding: 0 10px; border-radius: 10px; font-size: 13.5px; }
.va-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }

.va-card { display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: 18px; overflow: hidden; background: var(--card); min-width: 0; }
.va-photo { position: relative; height: 180px; background: var(--paper); display: flex; align-items: center; justify-content: center; }
.va-ph { display: flex; align-items: center; justify-content: center; gap: 16px; }
.va-tuber { display: block; width: 104px; height: 74px; border-radius: 52% 48% 46% 54% / 58% 52% 48% 42%; box-shadow: inset -10px -8px 0 rgba(0,0,0,.09), inset 6px 5px 0 rgba(255,255,255,.12); border: 1px solid rgba(0,0,0,.08); transform: rotate(-8deg); }
.va-slice { display: block; width: 66px; height: 66px; border-radius: 50%; box-shadow: inset 0 0 0 5px rgba(0,0,0,.07), 0 0 0 1px rgba(0,0,0,.06); }
.va-ph-md .va-tuber { width: 84px; height: 60px; }
.va-ph-md .va-slice { width: 46px; height: 46px; }
.va-cap { position: absolute; left: 12px; bottom: 10px; font-size: 11px; color: var(--mute2); background: var(--card); opacity: .92; padding: 3px 8px; border-radius: 6px; }
.va-cb { padding: 18px 18px 14px; display: flex; flex-direction: column; gap: 9px; flex: 1; min-width: 0; }
.va-nr { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
.va-name { margin: 0; font-family: var(--va-serif); font-weight: 400; font-size: 27px; line-height: 1.05; min-width: 0; overflow-wrap: anywhere; }
.va .va-name a { color: var(--ink); text-decoration: none; }
.va .va-name a:hover { color: var(--gold); }
.va-year { font-size: 12px; color: var(--mute2); white-space: nowrap; }
.va-by { margin: 0; font-size: 13px; color: var(--mute); }
.va-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.va-tags span { font-size: 12px; padding: 4px 9px; border-radius: 999px; background: var(--paper); color: var(--ink2); }
.va-fact { margin: 0; font-size: 13.5px; line-height: 1.5; color: var(--ink2); }
.va-fact-none { color: var(--mute2); font-size: 13px; }
.va-foot { margin-top: auto; padding-top: 12px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 13px; }
.va-cmp { display: flex; align-items: center; gap: 8px; color: var(--mute); min-height: 32px; cursor: pointer; }
.va .va-more { font-weight: 500; text-decoration: none; white-space: nowrap; }

.va .va-feat { display: flex; flex-direction: column; justify-content: space-between; gap: 14px; min-height: 340px; padding: 22px; border: 1.5px dashed var(--dash); border-radius: 18px; background: var(--card); color: var(--ink); text-decoration: none; }
.va .va-feat:hover { border-color: var(--gold); }
.va-feat-k { align-self: flex-start; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; padding: 5px 10px; border-radius: 999px; background: var(--gold-soft); color: var(--gold); }
.va-feat-t { font-family: var(--va-serif); font-size: 29px; line-height: 1.1; }
.va-feat-s { font-size: 13.5px; line-height: 1.55; color: var(--mute); }
.va-feat-a { font-size: 14px; font-weight: 500; color: var(--gold); }
.va .va-feat-side { min-height: 0; gap: 10px; padding: 20px; }
.va-feat-side .va-feat-t { font-size: 23px; line-height: 1.15; }

.va-loadmore { display: flex; flex-direction: column; align-items: center; gap: 8px; padding-top: 8px; font-size: 12.5px; color: var(--mute2); }
.va-loadmore button { height: 48px; padding: 0 26px; border: 1px solid var(--line2); border-radius: 999px; background: var(--card); color: var(--ink); font: inherit; font-size: 14px; cursor: pointer; }
.va-loadmore button:hover { border-color: var(--gold); }
.va-empty { padding: 32px; border: 1px dashed var(--dash); border-radius: 18px; text-align: center; color: var(--mute); }
.va-seedline { margin: 4px 0 0; font-size: 14px; color: var(--mute); }
.va .va-seedline a { text-decoration: none; font-weight: 500; }

/* Finder */
.vf { background: var(--panel); color: var(--panel-ink); scroll-margin-top: 72px; }
.vf-in { max-width: 1280px; margin: 0 auto; padding: 56px 40px 48px; }
.vf-eyebrow { color: var(--panel-gold); }
.vf-h { margin: 0; font-family: var(--va-serif); font-weight: 400; font-size: clamp(36px, 4.6vw, 58px); line-height: 1.04; color: var(--panel-ink); }
.vf-dek { margin: 16px 0 30px; max-width: 640px; font-size: 16px; line-height: 1.6; color: var(--panel-mute); }
.vf-step { display: block; margin: 0 0 12px; font-size: 13px; color: var(--panel-mute); padding: 0; }
.vf-uses { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
.vf-uses button { text-align: left; min-height: 104px; padding: 16px; border-radius: 16px; cursor: pointer; font: inherit; background: rgba(255,255,255,.04); color: var(--panel-ink); border: 1px solid var(--panel-line); }
.vf-uses button[aria-pressed="true"] { background: var(--panel-gold); color: #16140F; border-color: var(--panel-gold); }
.vf-use-l { display: block; font-family: var(--va-serif); font-size: 24px; margin-bottom: 6px; }
.vf-use-n { font-family: var(--hp-sans), sans-serif; font-size: 12px; opacity: .65; margin-left: 4px; }
.vf-use-h { display: block; font-size: 12.5px; line-height: 1.45; opacity: .78; }
.vf-row { display: flex; flex-wrap: wrap; gap: 28px; margin-top: 28px; }
.vf-col { flex: 1 1 320px; display: flex; flex-direction: column; min-width: 0; }
.vf select { height: 48px; padding: 0 14px; border-radius: 12px; border: 1px solid var(--panel-line); background: rgba(255,255,255,.06); color: var(--panel-ink); font-size: 15px; }
.vf select option { color: #16140F; background: #fff; }
.vf-note { margin-top: 8px; font-size: 12px; color: var(--panel-mute); }
.vf-risks { border: 0; margin: 0; padding: 0; flex-basis: 420px; }
.vf-risks > div { display: flex; flex-wrap: wrap; gap: 10px; }
.vf-risks label { display: flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 14px; border-radius: 999px; border: 1px solid var(--panel-line); font-size: 14px; cursor: pointer; }
.vf-risks input { accent-color: var(--panel-gold); }
.vf-body { max-width: 1280px; margin: 0 auto; padding: 40px 40px 80px; display: flex; flex-wrap: wrap; gap: 32px; align-items: flex-start; }
.vf-main { flex: 999 1 640px; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.vf-rh { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; }
.vf-rh h3 { margin: 0; font-family: var(--va-serif); font-weight: 400; font-size: 34px; color: var(--ink); }
.vf-rh span { font-size: 13px; color: var(--mute2); }
.vf-res { display: flex; gap: 20px; padding: 18px; border: 1px solid var(--line); border-radius: 18px; background: var(--card); }
.vf-res-ph { width: 150px; height: 120px; flex: 0 0 150px; border-radius: 12px; background: var(--paper); display: flex; align-items: center; justify-content: center; }
.vf-res-ph .va-ph { gap: 8px; }
.vf-res-b { flex: 1 1 300px; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.vf-res-h { display: flex; justify-content: space-between; gap: 10px; align-items: baseline; }
.vf-res-h h4 { margin: 0; font-family: var(--va-serif); font-weight: 400; font-size: 28px; line-height: 1.05; }
.va .vf-res-h h4 a { color: var(--ink); text-decoration: none; }
.vf-fit { font-size: 12px; padding: 4px 10px; border-radius: 999px; white-space: nowrap; }
.vf-fit-ok { background: var(--gold-soft); color: var(--gold); border: 1px solid var(--gold-line); }
.vf-fit-warn { background: transparent; color: var(--ink2); border: 1px dashed var(--dash); }
.vf-fit-mute { background: var(--paper); color: var(--mute); }
.vf-res ul { margin: 4px 0 0; padding-left: 18px; font-size: 14px; line-height: 1.6; color: var(--ink2); }
.vf-links { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; margin-top: 6px; font-size: 13.5px; }
.va .vf-links a { text-decoration: none; }
.vf-links button { background: none; border: 0; padding: 0; font: inherit; color: var(--gold); cursor: pointer; min-height: 32px; }
.vf-disc { margin: 6px 0 0; font-size: 12.5px; line-height: 1.55; color: var(--mute2); }
.vf-side { flex: 1 1 280px; max-width: 340px; display: flex; flex-direction: column; gap: 16px; }
.vf-box { padding: 20px; border: 1px solid var(--line); border-radius: 18px; background: var(--card); }
.vf-box-k { margin: 0 0 10px; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--gold); }
.vf-box-s { margin: 0; font-size: 13px; color: var(--mute2); }
.va .vf-co { display: flex; justify-content: space-between; gap: 10px; padding: 12px 0; border-top: 1px solid var(--line); color: var(--ink); text-decoration: none; font-size: 14px; }
.vf-co span:last-child { color: var(--mute2); white-space: nowrap; }
.va .vf-co-all { display: block; padding-top: 12px; border-top: 1px solid var(--line); font-size: 13.5px; font-weight: 500; text-decoration: none; }
.vf-ask { padding: 20px; border-radius: 18px; background: var(--paper); }
.vf-ask-t { margin: 0 0 8px; font-family: var(--va-serif); font-size: 22px; }
.vf-ask-s { margin: 0 0 12px; font-size: 13.5px; line-height: 1.5; color: var(--mute); }
.va .vf-ask-b { display: inline-block; padding: 10px 16px; border-radius: 999px; background: var(--accent-bg); color: var(--on-accent); text-decoration: none; font-size: 14px; }

/* Compare tray */
.va-tray { position: sticky; bottom: 0; z-index: 40; background: var(--panel); color: var(--panel-ink); border-top: 1px solid var(--panel-line); }
.va-tray-in { max-width: 1280px; margin: 0 auto; padding: 12px 40px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; font-size: 14px; }
.va-tray-l { min-width: 0; }
.va-tray-l strong { font-weight: 600; }
.va-tray-n, .va-tray-msg { color: var(--panel-mute); }
.va-tray-r { display: flex; align-items: center; gap: 12px; }
.va-tray-r button { background: none; border: 0; color: var(--panel-mute); font: inherit; font-size: 13.5px; cursor: pointer; text-decoration: underline; min-height: 40px; }
.va .va-tray-go { padding: 10px 18px; border-radius: 999px; background: var(--panel-gold); color: #16140F; text-decoration: none; font-weight: 600; white-space: nowrap; }
.va-tray-wait { opacity: .55; }

.va-scrim { display: none; }

@media (max-width: 1100px) {
  .va-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 900px) {
  .va-hero, .va-chips, .va-body, .vf-in, .vf-body { padding-left: 20px; padding-right: 20px; }
  .va-tray-in { padding-left: 16px; padding-right: 16px; }
  .va-rail { display: none; }
  .va-rail.open { display: flex; position: fixed; left: 0; right: 0; bottom: 0; top: auto; z-index: 80; max-height: 82vh; overflow-y: auto; background: var(--bg); border-radius: 18px 18px 0 0; padding: 0 20px 24px; box-shadow: 0 -20px 60px rgba(0,0,0,.25); }
  .va-rail.open .va-sheet-h { display: flex; position: sticky; top: 0; z-index: 1; justify-content: space-between; align-items: center; padding: 16px 0 12px; background: var(--bg); border-bottom: 1px solid var(--line); font-weight: 600; }
  .va-sheet-h button { height: 40px; padding: 0 16px; border: 0; border-radius: 999px; background: var(--accent-bg); color: var(--on-accent); font: inherit; font-size: 14px; cursor: pointer; }
  .va-scrim { display: block; position: fixed; inset: 0; z-index: 79; background: rgba(0,0,0,.4); border: 0; }
  .va-alerts-d { display: none; }
  .va-alerts-m { display: block; padding: 0 20px 40px; }
  .va-fbtn { display: inline-block; }
  .vf-uses { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .vf-side { max-width: none; }
}
@media (max-width: 640px) {
  .va-hero { padding: 22px 16px 16px; }
  .va-crumb { margin-bottom: 14px; }
  .va-eyebrow { font-size: 11px; }
  .va-h1 { font-size: 38px; line-height: 1.05; }
  .va-dek { font-size: 15px; }
  .va-hero-row { gap: 18px; }
  .va-search { flex-basis: 100%; }
  .va-search button { display: none; }
  .va-chips { flex-wrap: nowrap; overflow-x: auto; padding: 0 16px 14px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
  .va-chips::-webkit-scrollbar { display: none; }
  .va-chips button { height: 40px; padding: 0 14px; font-size: 13.5px; }
  .va-body { padding: 0 16px 24px; }
  .va-bar { font-size: 13px; }
  .va-sort span { display: none; }
  .va-grid { grid-template-columns: 1fr; gap: 14px; }
  .va-card { flex-direction: row; gap: 14px; padding: 12px; border-radius: 16px; }
  .va-photo { width: 104px; height: 104px; flex: 0 0 104px; border-radius: 12px; }
  .va-photo .va-ph { position: relative; }
  .va-photo .va-tuber { width: 78px; height: 56px; }
  .va-photo .va-slice { position: absolute; right: -10px; bottom: -14px; width: 34px; height: 34px; }
  .va-cap { display: none; }
  .va-cb { padding: 0; gap: 4px; }
  .va-name { font-size: 23px; }
  .va-by { font-size: 12.5px; }
  .va-tags { display: none; }
  .va-fact { font-size: 13px; line-height: 1.45; margin-top: 2px; }
  .va-foot { border-top: 0; padding-top: 4px; }
  .va .va-feat { min-height: 0; padding: 18px; border-radius: 16px; }
  .va-feat-t { font-size: 24px; line-height: 1.15; }
  .va-alerts-m { padding: 0 16px 32px; }
  .vf-in { padding: 40px 16px 36px; }
  .vf-h { font-size: 36px; }
  .vf-uses { grid-template-columns: 1fr 1fr; gap: 10px; }
  .vf-uses button { min-height: 0; padding: 14px; }
  .vf-uses button:last-child { grid-column: 1 / -1; }
  .vf-use-l { font-size: 21px; }
  .vf-body { padding: 28px 16px 56px; }
  .vf-rh h3 { font-size: 28px; }
  .vf-res { flex-direction: column; gap: 12px; padding: 14px; }
  .vf-res-ph { width: 100%; flex-basis: auto; height: 96px; }
  .vf-res-b { flex: none; }
  .vf-res-h h4 { font-size: 24px; }
  .vf-risks label { font-size: 13.5px; padding: 0 12px; }
  .va-tray-in { font-size: 13.5px; gap: 8px; flex-wrap: nowrap; }
  .va-tray-names { display: none; }
  .va-tray-long { display: none; }
  .va-tray-in { padding-right: 84px; }
  .va-tray-r { gap: 8px; }
}
`;
