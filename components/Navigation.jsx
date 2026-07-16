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
    <nav ref={menuRef} style={{
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
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.8 }}>
            <span style={{ color: "#1A1A1A" }}>Potato</span><span style={{ color: "#C62828" }}>pedia</span>
          </span>
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

        {/* Ask AI CTA */}
        <Link href="/ask" className="pp-desktop-links" style={{
          background: "linear-gradient(135deg,#C62828,#E53935)", color: "#fff",
          fontWeight: 700, fontSize: 13, padding: "9px 18px", borderRadius: 9,
          textDecoration: "none", whiteSpace: "nowrap",
        }}>Ask AI →</Link>

        {/* Hamburger */}
        <div className="pp-hamburger" style={{ display: "none", position: "relative" }}>
          <div
            onClick={() => setMobileMenu(!mobileMenu)}
            style={{
              width: 40, height: 40, borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.08)", background: "white",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 20,
            }}
          >{mobileMenu ? "\u2715" : "\u2630"}</div>
        </div>
      </div>

      {/* Mobile menu panel \u2014 full-width, below the header */}
      {mobileMenu && (
        <div className="pp-mobile-panel" style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "white", borderTop: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.12)", zIndex: 200,
          maxHeight: "calc(100vh - 68px)", overflowY: "auto",
        }}>
          <div style={{ padding: "12px 20px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
            <Link href="/ask" style={{ padding: "16px 18px", borderRadius: 12, background: "linear-gradient(135deg,#C62828,#E53935)", color: "#fff", textDecoration: "none", fontSize: 16, fontWeight: 700, display: "block", margin: "8px 0 12px" }}>Ask AI &rarr;</Link>
            <Link href="/" style={{ padding: "16px 18px", borderRadius: 10, color: isActive("/") ? "#C62828" : "#333", background: isActive("/") ? "rgba(198,40,40,0.06)" : "transparent", textDecoration: "none", fontSize: 16, fontWeight: 600, display: "block" }}>Home</Link>
            <Link href="/knowledge" style={{ padding: "16px 18px", borderRadius: 10, color: isActive("/knowledge") ? "#C62828" : "#333", background: isActive("/knowledge") ? "rgba(198,40,40,0.06)" : "transparent", textDecoration: "none", fontSize: 16, fontWeight: 600, display: "block" }}>Knowledge</Link>
            <Link href="/countries" style={{ padding: "16px 18px", borderRadius: 10, color: isActive("/countries") ? "#C62828" : "#333", background: isActive("/countries") ? "rgba(198,40,40,0.06)" : "transparent", textDecoration: "none", fontSize: 16, fontWeight: 600, display: "block" }}>Countries</Link>
            <Link href="/varieties" style={{ padding: "16px 18px", borderRadius: 10, color: isActive("/varieties") ? "#C62828" : "#333", background: isActive("/varieties") ? "rgba(198,40,40,0.06)" : "transparent", textDecoration: "none", fontSize: 16, fontWeight: 600, display: "block" }}>Varieties</Link>
            <Link href="/blog" style={{ padding: "16px 18px", borderRadius: 10, color: isActive("/blog") ? "#C62828" : "#333", background: isActive("/blog") ? "rgba(198,40,40,0.06)" : "transparent", textDecoration: "none", fontSize: 16, fontWeight: 600, display: "block" }}>Blog</Link>
            <Link href="/answers" style={{ padding: "16px 18px", borderRadius: 10, color: isActive("/answers") ? "#C62828" : "#333", background: isActive("/answers") ? "rgba(198,40,40,0.06)" : "transparent", textDecoration: "none", fontSize: 16, fontWeight: 600, display: "block" }}>Answers</Link>
            <Link href="/about" style={{ padding: "16px 18px", borderRadius: 10, color: isActive("/about") ? "#C62828" : "#333", background: isActive("/about") ? "rgba(198,40,40,0.06)" : "transparent", textDecoration: "none", fontSize: 16, fontWeight: 600, display: "block" }}>About</Link>
            <Link href="/support" style={{ padding: "16px 18px", borderRadius: 10, marginTop: 8, border: "1px solid #C62828", color: "#C62828", textDecoration: "none", fontSize: 16, fontWeight: 700, display: "block", textAlign: "center" }}>&hearts; Support Us</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
