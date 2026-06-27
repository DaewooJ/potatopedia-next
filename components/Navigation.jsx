"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!mobileMenu) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMobileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenu]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  const isActive = (path) => pathname === path;

  const navLinkStyle = (path) => ({
    padding: "7px 18px",
    borderRadius: 8,
    border: isActive(path) ? "none" : "1px solid rgba(0,0,0,0.08)",
    background: isActive(path) ? "linear-gradient(135deg,#C62828,#E53935)" : "transparent",
    color: isActive(path) ? "#fff" : "#555",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 600,
    transition: "all 0.2s ease",
  });

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)", borderBottom: "1px solid rgba(0,0,0,0.04)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 68,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo.png" alt="Potatopedia Logo" width={36} height={36} style={{ borderRadius: 10 }} />
          <span style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", letterSpacing: -0.8 }}>Potatopedia</span>
        </Link>

        {/* Desktop Links */}
        <div className="pp-desktop-links" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/" style={{
            color: isActive("/") ? "#C62828" : "#666",
            textDecoration: "none", fontSize: 14, fontWeight: isActive("/") ? 600 : 500,
            padding: "6px 14px", transition: "all 0.2s ease",
          }}>Home</Link>
          <Link href="/knowledge" style={navLinkStyle("/knowledge")}>Knowledge</Link>
          <Link href="/countries" style={navLinkStyle("/countries")}>Countries</Link>
          <Link href="/varieties" style={navLinkStyle("/varieties")}>Varieties</Link>
          <Link href="/blog" style={navLinkStyle("/blog")}>Blog</Link>
          <Link href="/about" style={navLinkStyle("/about")}>About</Link>
        </div>

        {/* Hamburger */}
        <div ref={menuRef} className="pp-hamburger" style={{ display: "none", position: "relative" }}>
          <div
            onClick={() => setMobileMenu(!mobileMenu)}
            style={{
              width: 36, height: 36, borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.08)", background: "white",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 18,
            }}
          >{mobileMenu ? "\u2715" : "\u2630"}</div>
          {mobileMenu && (
            <div style={{
              position: "absolute", top: 44, right: 0, background: "white",
              borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              border: "1px solid rgba(0,0,0,0.06)", padding: 8, minWidth: 180,
              display: "flex", flexDirection: "column", gap: 4, zIndex: 200,
            }}>
              <Link href="/" style={{ padding: "10px 16px", borderRadius: 8, color: "#333", textDecoration: "none", fontSize: 14, fontWeight: 500, display: "block" }}>Home</Link>
              <Link href="/knowledge" style={{ padding: "10px 16px", borderRadius: 8, color: "#333", textDecoration: "none", fontSize: 14, fontWeight: 500, display: "block" }}>Knowledge</Link>
              <Link href="/countries" style={{ padding: "10px 16px", borderRadius: 8, color: "#333", textDecoration: "none", fontSize: 14, fontWeight: 500, display: "block" }}>Countries</Link>
              <Link href="/varieties" style={{ padding: "10px 16px", borderRadius: 8, color: "#333", textDecoration: "none", fontSize: 14, fontWeight: 500, display: "block" }}>Varieties</Link>
              <Link href="/blog" style={{ padding: "10px 16px", borderRadius: 8, color: "#333", textDecoration: "none", fontSize: 14, fontWeight: 500, display: "block" }}>Blog</Link>
              <Link href="/about" style={{ padding: "10px 16px", borderRadius: 8, color: "#333", textDecoration: "none", fontSize: 14, fontWeight: 500, display: "block" }}>About</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
