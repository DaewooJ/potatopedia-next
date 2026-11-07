"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

// Floating light/dark switch for the homepage: "ripple reveal" (Devendra's pick, 7 Nov 2026, option 8).
// The new theme spreads in a circle from the button across the page (View Transitions API); browsers without it,
// and visitors who prefer reduced motion, switch instantly. Sets data-theme on .hp and remembers the choice.
export default function ThemeFab() {
  const [theme, setTheme] = useState("dark");
  const btn = useRef(null);

  useEffect(() => {
    let saved = null;
    try {
      saved = new URLSearchParams(window.location.search).get("theme") || localStorage.getItem("pp-theme");
    } catch {}
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  useEffect(() => {
    document.querySelector(".hp")?.setAttribute("data-theme", theme);
  }, [theme]);

  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    const apply = () => {
      document.querySelector(".hp")?.setAttribute("data-theme", next);
      flushSync(() => setTheme(next));
    };
    try {
      localStorage.setItem("pp-theme", next);
    } catch {}

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced || !btn.current) {
      apply();
      return;
    }
    const r = btn.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const t = document.startViewTransition(apply);
    t.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 750, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  };

  const dark = theme === "dark";
  return (
    <button ref={btn} type="button" className="tf" onClick={flip} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} title={dark ? "Light theme" : "Dark theme"}>
      <span className="tf-ring" aria-hidden="true" />
      <span className="tf-label">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
