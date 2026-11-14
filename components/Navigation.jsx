"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DIRECTORY_PUBLIC } from "../lib/directory-flag";

// Premium chrome (7 Nov 2026): serif wordmark (replaces the red potato icon), quiet text nav,
// "Ask Potatopedia…" pill to /ask and a "For companies" pill to /for-companies (hub; /advertise is reached from the hub and the footer).
const LINKS = [
  { href: "/varieties", label: "Varieties", match: ["/varieties"] },
  { href: "/countries", label: "Countries", match: ["/countries", "/country"] },
  { href: "/knowledge", label: "Knowledge", match: ["/knowledge"] },
  { href: "/answers", label: "Answers", match: ["/answers"] },
  { href: "/market", label: "Market", match: ["/market"] },
  { href: "/machines", label: "Machines", match: ["/machines"] },
  ...(DIRECTORY_PUBLIC ? [{ href: "/companies", label: "Companies", match: ["/companies"] }] : []),
  { href: "/blog", label: "Blog", match: ["/blog"] },
  { href: "/magazines", label: "Magazines", match: ["/magazines"] },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const pathname = usePathname() || "";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const on = (l) => l.match.some((m) => pathname === m || pathname.startsWith(m + "/"));

  return (
    <header ref={ref} className="pn">
      <div className="pn-in">
        <Link href="/" className="pn-logo" aria-label="Potatopedia home">Potatopedia</Link>
        <nav className="pn-links" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={on(l) ? "is-on" : undefined} aria-current={on(l) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="pn-right">
          <Link href="/ask" className="pn-ask">Ask Potatopedia…</Link>
          <Link href="/for-companies" className="pn-adv">For companies</Link>
          <button
            type="button"
            className="pn-burger"
            aria-expanded={open}
            aria-controls="pn-panel"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 6h12M3 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            )}
          </button>
        </div>
      </div>
      {open && (
        <nav id="pn-panel" className="pn-panel" aria-label="Menu">
          <Link href="/ask" className="pn-panel-ask">Ask Potatopedia…</Link>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={on(l) ? "is-on" : undefined}>{l.label}</Link>
          ))}
          <Link href="/about" className={pathname === "/about" ? "is-on" : undefined}>About</Link>
          <Link href="/for-companies" className="pn-panel-adv">For companies</Link>
        </nav>
      )}
    </header>
  );
}
