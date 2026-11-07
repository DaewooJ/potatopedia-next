"use client";

import { useEffect, useState } from "react";

// Table of contents for the editorial template: sticky list in the left column on desktop
// (variant "aside"), collapsible list above the text on phones (variant "inline").
export default function BlogTOC({ items, variant = "aside", title = "In this story", children }) {
  const [activeId, setActiveId] = useState(items?.[0]?.id || null);

  useEffect(() => {
    if (typeof window === "undefined" || !items || items.length === 0) return;
    const headings = items.map((it) => document.getElementById(it.id)).filter(Boolean);
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length < 2) return variant === "aside" && children ? <aside className="ed-toc">{children}</aside> : null;

  const links = (
    <nav aria-label={title}>
      {items.map((it) => (
        <a key={it.id} href={`#${it.id}`} className={activeId === it.id ? "is-on" : undefined}>
          {it.label}
        </a>
      ))}
    </nav>
  );

  if (variant === "inline") {
    return (
      <details className="ed-tocm">
        <summary>
          <span>{title} · {items.length}</span>
          <span aria-hidden="true">▾</span>
        </summary>
        {links}
      </details>
    );
  }

  return (
    <aside className="ed-toc">
      <p className="ed-toc-k">{title}</p>
      {links}
      {children}
    </aside>
  );
}
