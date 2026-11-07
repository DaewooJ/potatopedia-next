"use client";

import { useEffect, useState } from "react";

// Floating light/dark switch for the homepage. Sets data-theme on .hp and remembers the choice (localStorage,
// wrapped in try/catch). Default style = "sun to moon" (option 1); swap the inner markup for the chosen option.
export default function ThemeFab() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    let saved = null;
    try {
      saved = new URLSearchParams(window.location.search).get("theme") || localStorage.getItem("pp-theme");
    } catch {}
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.querySelector(".hp");
    if (root) root.setAttribute("data-theme", theme);
  }, [theme]);

  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("pp-theme", next);
    } catch {}
  };

  const dark = theme === "dark";
  return (
    <button type="button" className={`tf${dark ? "" : " is-light"}`} onClick={flip} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} title={dark ? "Light theme" : "Dark theme"}>
      <span className="tf-sun" />
      <span className="tf-bite" />
    </button>
  );
}
