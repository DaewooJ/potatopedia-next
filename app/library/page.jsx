"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LibraryPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    try {
      setBookmarks(JSON.parse(localStorage.getItem("pp_bookmarks") || "[]"));
    } catch {
      setBookmarks([]);
    }
  }, []);

  const deleteBookmark = (id) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem("pp_bookmarks", JSON.stringify(updated));
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--card)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 24px 60px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>Saved Answers</h1>
        <p style={{ fontSize: 14, color: "var(--mute2)", marginBottom: 32 }}>{bookmarks.length} saved answer{bookmarks.length !== 1 ? "s" : ""}</p>

        {bookmarks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>{"\uD83D\uDCDA"}</p>
            <p style={{ fontSize: 16, color: "var(--mute2)", marginBottom: 8 }}>No saved answers yet</p>
            <p style={{ fontSize: 13, color: "var(--mute3)", marginBottom: 24 }}>Click the {"\uD83D\uDD16"} Save button on any AI answer to add it here</p>
            <Link href="/ask" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 12, background: "var(--accent-bg)", color: "white", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Ask Potatopedia &rarr;</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {bookmarks.map((bm) => (
              <div key={bm.id} style={{ padding: "20px 24px", borderRadius: 16, border: "1px solid var(--line)", background: "var(--paper)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", lineHeight: 1.4 }}>{bm.question}</p>
                  <button
                    onClick={() => deleteBookmark(bm.id)}
                    style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, border: "1px solid var(--line)", background: "var(--card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "var(--mute3)", fontFamily: "inherit" }}
                    title="Delete"
                  >{"\u2715"}</button>
                </div>
                <div style={{ fontSize: 14, color: "var(--mute)", lineHeight: 1.7, maxHeight: 200, overflow: "hidden", WebkitMaskImage: "linear-gradient(180deg, black 70%, transparent)" }}>
                  {bm.answer.split("\n").slice(0, 6).map((line, j) => (
                    <p key={j} style={{ margin: j > 0 ? "8px 0 0" : 0 }}>{line}</p>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                  <span style={{ fontSize: 11, color: "var(--mute3)" }}>
                    {new Date(bm.savedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(bm.answer)}
                    style={{ fontSize: 11, color: "var(--mute2)", background: "none", border: "1px solid var(--line)", borderRadius: 8, padding: "3px 10px", cursor: "pointer", fontFamily: "inherit" }}
                  >{"\uD83D\uDCCB"} Copy</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
