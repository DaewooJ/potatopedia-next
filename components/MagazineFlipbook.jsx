"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Page-turn viewer for an issue's magazine edition (made in DigiMagz; this only displays its page images).
// Desktop: two-page spreads, the cover opening on the right like a printed magazine. Phone (<768px): one page at a time.
// Each leaf is a two-sided card that rotates around the spine. Turn with the buttons, a tap on either side, a swipe,
// the arrow keys, or the page strip. Plain JS + inline styles (studied from DigiMagz's Flipbook.tsx).
const RED = "#C62828";
const PAPER = "#f8f3ea";

export default function MagazineFlipbook({ pages, title }) {
  const ratio = pages[0]?.w && pages[0]?.h ? pages[0].w / pages[0].h : 1132 / 1600;
  const [single, setSingle] = useState(null);
  const [turned, setTurned] = useState(0);
  const [still, setStill] = useState(false); // prefers-reduced-motion
  const book = useRef(null);
  const swipe = useRef(null);
  const opened = useRef(false);

  useEffect(() => {
    const mq = matchMedia("(max-width: 767px)");
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => { setSingle(mq.matches); setTurned(0); };
    set();
    setStill(rm.matches);
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Desktop: leaf k carries pages 2k (front) and 2k+1 (back). Phone: one page per leaf.
  const leaves = useMemo(() => {
    if (single) return pages.map((_, i) => ({ front: i, back: null }));
    const out = [];
    for (let i = 0; i < pages.length; i += 2) out.push({ front: i, back: i + 1 < pages.length ? i + 1 : null });
    return out;
  }, [pages, single]);

  const max = single ? leaves.length - 1 : leaves.length;
  const go = useCallback((to) => {
    const t = Math.max(0, Math.min(max, to));
    if (t > 0 && !opened.current) {
      opened.current = true;
      try { window.gtag?.("event", "magazine_flip", { magazine: title }); } catch {}
    }
    setTurned(t);
  }, [max, title]);

  function onKey(e) {
    if (e.key === "ArrowRight") { e.preventDefault(); go(turned + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(turned - 1); }
    if (e.key === "Home") { e.preventDefault(); go(0); }
    if (e.key === "End") { e.preventDefault(); go(max); }
  }
  function onDown(e) { swipe.current = { x: e.clientX, y: e.clientY }; }
  function onUp(e) {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y)) { go(dx < 0 ? turned + 1 : turned - 1); return; }
    if (Math.abs(dx) > 8) return;
    const r = book.current.getBoundingClientRect();
    const mid = single ? r.left + r.width * 0.35 : r.left + r.width / 2;
    go(e.clientX > mid ? turned + 1 : turned - 1);
  }

  const visible = [];
  if (single) { if (turned < leaves.length) visible.push(leaves[turned].front); }
  else {
    if (turned > 0 && leaves[turned - 1].back !== null) visible.push(leaves[turned - 1].back);
    if (turned < leaves.length) visible.push(leaves[turned].front);
  }
  const counter = single
    ? `Page ${Math.min(turned + 1, pages.length)} of ${pages.length}`
    : visible.length === 2 ? `Pages ${visible[0] + 1}–${visible[1] + 1} of ${pages.length}` : `Page ${(visible[0] ?? 0) + 1} of ${pages.length}`;
  // Closed on the cover: the right half is centred; finished: the left half.
  const shift = single ? 0 : turned === 0 ? -25 : turned === leaves.length ? 25 : 0;

  const btn = (on) => ({
    padding: "10px 18px", fontSize: 14, fontWeight: 600, fontFamily: "inherit", borderRadius: 10, cursor: on ? "pointer" : "default",
    border: "1px solid var(--line2)", background: "var(--card)", color: "var(--ink)", opacity: on ? 1 : 0.4,
  });

  if (single === null) {
    return (
      <div style={{ display: "grid", justifyItems: "center", padding: "8px 0" }}>
        <img src={pages[0].src} alt={`${title}, cover`} width={pages[0].w} height={pages[0].h} style={{ width: "min(88vw, 420px)", height: "auto", display: "block", boxShadow: "0 18px 40px -18px rgba(0,0,0,.5)" }} />
      </div>
    );
  }

  return (
    <div style={{ display: "grid", justifyItems: "center", gap: 14, minWidth: 0 }}>
      <span aria-live="polite" style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".04em", color: "var(--mute)", fontVariantNumeric: "tabular-nums" }}>{counter}</span>
      <div style={{ width: "100%", overflow: "hidden", display: "grid", justifyItems: "center", padding: "6px 0 14px" }}>
        <div
          ref={book}
          tabIndex={0}
          role="region"
          aria-roledescription="flipbook"
          aria-label={`${title}: ${pages.length} pages. Use the left and right arrow keys to turn.`}
          onKeyDown={onKey}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={() => { swipe.current = null; }}
          style={{
            position: "relative",
            perspective: 2600,
            touchAction: "pan-y",
            userSelect: "none",
            cursor: "pointer",
            outlineOffset: 4,
            // Fit the screen both ways: a spread never runs taller than the window (minus counter and buttons).
            width: single ? `min(88vw, 460px, calc((100svh - 170px) * ${ratio.toFixed(4)}))` : `min(92vw, 1000px, calc((100svh - 190px) * ${(ratio * 2).toFixed(4)}))`,
            minWidth: single ? 240 : 420,
            aspectRatio: single ? `${ratio}` : `${ratio * 2}`,
            transform: `translateX(${shift}%)`,
            transition: still ? "none" : "transform .7s cubic-bezier(.22,.8,.25,1)",
          }}
        >
          {leaves.map((leaf, i) => {
            const isTurned = i < turned;
            const near = Math.abs(i - turned) <= 2;
            return (
              <div
                key={`${single ? "s" : "d"}-${i}`}
                style={{
                  position: "absolute", top: 0, height: "100%",
                  left: single ? 0 : "50%", width: single ? "100%" : "50%",
                  transformStyle: "preserve-3d", transformOrigin: "left center",
                  transform: `rotateY(${isTurned ? -180 : 0}deg)`,
                  zIndex: isTurned ? i + 1 : leaves.length - i,
                  transition: still ? "none" : "transform .9s cubic-bezier(.32,.72,.2,1)",
                  // On a phone a turned page simply leaves; it never shows its back.
                  ...(single && isTurned ? { opacity: 0, transitionProperty: "transform, opacity" } : {}),
                }}
              >
                <Face page={pages[leaf.front]} n={leaf.front} title={title} eager={near} single={single} />
                {leaf.back !== null
                  ? <Face page={pages[leaf.back]} n={leaf.back} title={title} back eager={near} single={single} />
                  : <div aria-hidden="true" style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", background: `linear-gradient(90deg, #efe7d8, ${PAPER} 30%)` }} />}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        <button type="button" onClick={() => go(turned - 1)} disabled={turned === 0} style={btn(turned > 0)}>← Back</button>
        <button type="button" onClick={() => go(turned + 1)} disabled={turned >= max} style={{ ...btn(turned < max), background: turned < max ? RED : "var(--card)", color: turned < max ? "#fff" : "var(--ink)", border: "none" }}>
          {turned === 0 ? "Open the magazine →" : "Turn →"}
        </button>
      </div>

      <ol aria-label="Jump to a page" style={{ display: "flex", gap: 8, listStyle: "none", padding: "4px 2px 8px", margin: 0, maxWidth: "100%", overflowX: "auto" }}>
        {pages.map((p, i) => {
          const leafOf = single ? i : Math.floor((i + 1) / 2);
          const on = visible.includes(i);
          return (
            <li key={p.src} style={{ flex: "0 0 auto" }}>
              <button type="button" aria-current={on ? "page" : undefined} aria-label={`Page ${i + 1}`} onClick={() => go(leafOf)} style={{ display: "grid", gap: 4, justifyItems: "center", padding: 0, border: 0, background: "none", cursor: "pointer", color: on ? RED : "var(--mute)", fontSize: 11, fontFamily: "inherit" }}>
                <img src={p.src} alt="" loading="lazy" width={48} height={Math.round(48 / ratio)} style={{ width: 48, height: "auto", display: "block", outline: `2px solid ${on ? RED : "transparent"}`, outlineOffset: 2, opacity: on ? 1 : 0.7 }} />
                <span>{i + 1}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Face({ page, n, title, back = false, eager, single }) {
  // The gutter: a right-hand page darkens towards the spine on its left, a left-hand page on its right.
  const gloss = single
    ? "linear-gradient(90deg, rgba(0,0,0,.14), transparent 6%, transparent 95%, rgba(0,0,0,.05))"
    : back
      ? "linear-gradient(270deg, rgba(0,0,0,.24), rgba(0,0,0,.05) 5%, transparent 12%)"
      : "linear-gradient(90deg, rgba(0,0,0,.24), rgba(0,0,0,.05) 5%, transparent 12%)";
  return (
    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: PAPER, boxShadow: "0 10px 30px -14px rgba(0,0,0,.45)", ...(back ? { transform: "rotateY(180deg)" } : {}) }}>
      <img src={page.src} alt={`${title}, page ${n + 1}`} loading={eager ? "eager" : "lazy"} draggable={false} width={page.w} height={page.h} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
      <span aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", background: gloss }} />
    </div>
  );
}
