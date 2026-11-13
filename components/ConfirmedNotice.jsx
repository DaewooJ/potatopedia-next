"use client";

import { useEffect, useState } from "react";

// /newsletters?confirmed=1 (the double opt-in link lands here): a thank-you line. Static page, so read on the client.
export default function ConfirmedNotice() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    try { setOn(new URLSearchParams(window.location.search).get("confirmed") === "1"); } catch {}
  }, []);
  if (!on) return null;
  return (
    <div role="status" style={{ margin: "0 0 18px", padding: "14px 16px", borderRadius: 12, border: "1px solid var(--gold-line)", background: "var(--gold-soft)", color: "var(--ink)", fontSize: 15.5, lineHeight: 1.5 }}>
      <strong>You&apos;re subscribed.</strong> Thank you. The next issue of each title you chose comes to your inbox on its send day.
    </div>
  );
}
