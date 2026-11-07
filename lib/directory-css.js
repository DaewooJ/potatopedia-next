// Styles for /companies and /companies/[slug], on top of the premium tokens in lib/theme.js (light + dark).
export const CO_CSS = `
.co-hero-figs { margin-top: 32px; }
.co-feat { max-width: 1200px; margin: 0 auto; padding: 8px 32px 36px; }
.co-feat-h { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; margin: 0 0 16px; }
.co-feat-h h2 { margin: 0; font-size: 30px; color: var(--ink); }
.co-feat-h p { margin: 0; font-size: 13px; color: var(--mute2); }
.co-feat-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.co-feat-col { display: grid; gap: 12px; align-content: start; }
.co-feat-k { margin: 0; font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--mute3); }
.co-slot { display: block; border-radius: 16px; border: 1px dashed var(--dash); padding: 18px 18px 20px; text-decoration: none; color: var(--ink) !important; transition: border-color .2s, background .2s; }
.co-slot:hover { border-color: var(--gold); background: var(--gold-soft); }
.co-slot-k { display: block; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--gold); }
.co-slot-t { display: block; margin-top: 8px; font-family: var(--hp-serif), Georgia, serif; font-size: 22px; line-height: 1.15; }
.co-slot-s { display: block; margin-top: 6px; font-size: 13px; line-height: 1.5; color: var(--mute); }
.co-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; color: var(--gold); border: 1px solid var(--gold-line); border-radius: 999px; padding: 4px 10px; background: var(--gold-soft); }
.co-bar { display: flex; flex-wrap: wrap; gap: 14px 24px; align-items: center; justify-content: space-between; padding: 18px 0; border-top: 1px solid var(--line2); border-bottom: 1px solid var(--line); }
.co-tabs { display: flex; flex-wrap: wrap; gap: 8px; }
.co-tabs button { font: inherit; font-size: 14px; color: var(--mute); background: transparent; border: 1px solid var(--line2); border-radius: 999px; padding: 9px 15px; cursor: pointer; transition: border-color .2s, color .2s, background .2s; min-height: 40px; }
.co-tabs button span { color: var(--mute3); margin-left: 4px; font-size: 12.5px; }
.co-tabs button:hover { border-color: var(--gold); color: var(--ink); }
.co-tabs button[aria-pressed="true"] { background: var(--ink); border-color: var(--ink); color: var(--bg); }
.co-tabs button[aria-pressed="true"] span { color: var(--bg); opacity: .7; }
.co-tools { display: flex; flex-wrap: wrap; gap: 8px; }
.co-in { box-sizing: border-box; font: inherit; font-size: 14px; color: var(--ink); background: var(--card); border: 1px solid var(--line2); border-radius: 999px; padding: 9px 14px; min-height: 40px; outline: 0; }
.co-in:focus { border-color: var(--gold); }
.co-q { min-width: 320px; }
.dz-table td a { color: var(--gold); text-decoration: none; font-weight: 500; }
select.co-in { padding-right: 30px; appearance: none; -webkit-appearance: none; background-image: linear-gradient(45deg, transparent 50%, var(--mute2) 50%), linear-gradient(135deg, var(--mute2) 50%, transparent 50%); background-position: calc(100% - 17px) 52%, calc(100% - 12px) 52%; background-size: 5px 5px; background-repeat: no-repeat; }
.co-count { margin: 18px 0 16px; font-size: 13px; color: var(--mute2); }
.co-grid { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.co-grid > li { display: flex; }
.co-card { display: flex !important; flex-direction: column; width: 100%; padding: 22px !important; }
.co-where { display: block; margin-top: 6px; font-size: 13px; color: var(--mute2); }
.co-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; padding-top: 16px; }
.co-chip { font-size: 12px; color: var(--ink2); border: 1px solid var(--line2); border-radius: 999px; padding: 4px 10px; }
.co-empty { padding: 40px 0; text-align: center; color: var(--mute); }
.co-empty p { margin: 0 0 14px; }
.co-how { max-width: 1200px; margin: 0 auto; padding: 8px 32px 72px; }
.co-how-in { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; border-top: 1px solid var(--line2); padding-top: 28px; }
.co-how h3 { margin: 0 0 6px; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: 22px; color: var(--ink); }
.co-how p { margin: 0; font-size: 14.5px; line-height: 1.65; color: var(--mute); }
.co-how a { color: var(--gold); text-decoration: none; }

/* profile */
.cp-meta { margin: 22px 0 0; display: flex; flex-wrap: wrap; gap: 10px 22px; align-items: center; font-size: 14.5px; color: var(--mute); }
.cp-meta a { color: var(--gold); text-decoration: none; font-weight: 500; }
.cp-h1 { font-size: clamp(44px, 7vw, 88px) !important; line-height: .98 !important; }
.cp-list { margin: 0; padding: 0; list-style: none; }
.cp-list li { padding: 12px 0 12px 20px; border-top: 1px solid var(--line); font-size: 16px; line-height: 1.55; color: var(--ink2); position: relative; }
.cp-list li:last-child { border-bottom: 1px solid var(--line); }
.cp-list li::before { content: ""; position: absolute; left: 0; top: 1.3em; width: 8px; height: 1px; background: var(--gold); }
.cp-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.cp-chips span { font-size: 14px; color: var(--ink2); border: 1px solid var(--line2); border-radius: 999px; padding: 6px 13px; background: var(--card); }
.cp-gaps { margin-top: 44px; border-radius: 16px; background: var(--paper); padding: 20px 22px; }
.cp-gaps p { margin: 0; font-size: 14.5px; line-height: 1.65; color: var(--mute); }
.cp-src { margin: 0; padding: 0; list-style: none; counter-reset: s; }
.cp-src li { counter-increment: s; display: flex; gap: 14px; padding: 12px 0; border-top: 1px solid var(--line); font-size: 14.5px; line-height: 1.5; }
.cp-src li:last-child { border-bottom: 1px solid var(--line); }
.cp-src li::before { content: counter(s); flex: none; width: 24px; font-family: var(--hp-serif), Georgia, serif; font-size: 18px; color: var(--gold); }
.cp-src a { color: var(--ink) !important; text-decoration: none; overflow-wrap: anywhere; }
.cp-src a:hover { color: var(--gold) !important; }
.cp-src small { display: block; color: var(--mute2); font-size: 12.5px; margin-top: 2px; overflow-wrap: anywhere; }
.cp-contact { margin: 0; display: grid; gap: 12px; font-size: 14.5px; line-height: 1.5; }
.cp-contact dt { font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: var(--mute3); }
.cp-contact dd { margin: 2px 0 0; color: var(--ink); overflow-wrap: anywhere; }
.cp-contact a { color: var(--gold); text-decoration: none; }
.cp-note { font-size: 13.5px; line-height: 1.6; color: var(--mute); margin: 0 0 14px; }
.cp-feat { border-radius: 16px; border: 1px solid var(--gold-line); background: var(--gold-soft); padding: 18px 20px; }

@media (max-width: 900px) {
  .co-feat-grid { grid-template-columns: 1fr; }
  .co-how-in { grid-template-columns: 1fr; gap: 20px; }
}
@media (max-width: 640px) {
  .co-feat { padding: 4px 20px 28px; }
  .co-feat-grid { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: 20px; gap: 12px; margin: 0 -20px; padding: 0 20px 4px; scrollbar-width: none; }
  .co-feat-grid::-webkit-scrollbar { display: none; }
  .co-feat-col { flex: 0 0 82%; scroll-snap-align: start; }
  .cp-plants thead { display: none; }
  .cp-plants tr { display: grid; grid-template-columns: 1fr; border-top: 1px solid var(--line); padding: 12px 0; }
  .cp-plants tr:last-child { border-bottom: 1px solid var(--line); }
  .cp-plants td { border: 0 !important; padding: 0 !important; }
  .cp-plants td + td { font-size: 14px; margin-top: 2px; }
  .co-how { padding: 4px 20px 56px; }
  .co-bar { flex-direction: column; flex-wrap: nowrap; align-items: stretch; }
  .co-tabs { flex-wrap: nowrap; overflow-x: auto; margin: 0 -20px; padding: 0 20px 2px; scrollbar-width: none; }
  .co-tabs::-webkit-scrollbar { display: none; }
  .co-tabs button { white-space: nowrap; flex: none; }
  .co-tools { display: grid; grid-template-columns: minmax(0, 1fr); }
  .co-tools .co-in { width: 100%; min-width: 0; box-sizing: border-box; }
  .co-tools select.co-in { min-width: 0; width: 100%; }
  .co-grid { grid-template-columns: 1fr; }
  .cp-h1 { font-size: 44px !important; }
}
`;
