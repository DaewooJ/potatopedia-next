import { neon } from "@neondatabase/serverless";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { adminOk } from "@/lib/admin-auth";

// Source scout review page: the Netcup server proposes sources (Mon + Thu); Devendra approves or rejects them here
// or by WhatsApp ("PP YES 1 3"). Approved sources are ingested by the server within the hour.
export const dynamic = "force-dynamic";
export const metadata = { title: "Source review", robots: { index: false, follow: false } };

const RED = "#C62828";
const STATUS_COLOR = { pending: "#8A6D00", approved: "#1F4E99", rejected: "#777", ingested: "#111", failed: RED };

async function decide(formData) {
  "use server";
  if (!adminOk((await headers()).get("authorization"))) throw new Error("Not allowed");
  const id = Number(formData.get("id"));
  const status = formData.get("status");
  if (!id || !["approved", "rejected", "pending"].includes(status)) return;
  const sql = neon(process.env.DATABASE_URL);
  await sql`update source_candidates set status = ${status}, decided_at = now(), decided_via = 'page'
    where id = ${id} and status in ('pending', 'approved', 'rejected', 'failed')`;
  revalidatePath("/admin/sources");
}

export default async function SourcesPage() {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`select * from source_candidates order by batch desc, n asc limit 200`;
  const batches = [...new Set(rows.map((r) => r.batch))];
  const pending = rows.filter((r) => r.status === "pending").length;

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "32px 16px 80px", fontFamily: "inherit", color: "#1a1a1a" }}>
      <h1 style={{ fontSize: 28, margin: "0 0 6px" }}>Source review</h1>
      <p style={{ margin: "0 0 24px", color: "#555", fontSize: 15, lineHeight: 1.5 }}>
        {pending} waiting. Approve only what should go into the knowledge base; the server ingests approved sources
        within the hour. By WhatsApp: <b>PP YES 1 3</b>, <b>PP NO 2</b>, <b>PP ALL</b>, <b>PP LIST</b> to +91 94996 68831.
      </p>

      {batches.length === 0 && <p style={{ color: "#555" }}>No sources yet. The scout runs Monday and Thursday at 07:30 IST.</p>}

      {batches.map((b) => (
        <section key={b} style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, margin: "0 0 12px", borderBottom: "1px solid #EEE", paddingBottom: 8 }}>Batch {b}</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {rows
              .filter((r) => r.batch === b)
              .map((r) => (
                <article key={r.id} style={{ border: "1px solid #E6E6E6", borderRadius: 12, padding: 16, background: r.status === "pending" ? "#fff" : "#FAFAFA" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline", justifyContent: "space-between" }}>
                    <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.35 }}>
                      {r.n}. {r.title}
                    </h3>
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: STATUS_COLOR[r.status] }}>
                      {r.status}
                    </span>
                  </div>
                  <p style={{ margin: "6px 0", fontSize: 13, color: "#555" }}>
                    {r.publisher} · {r.published} ·{" "}
                    <span style={{ color: r.approved_source.startsWith("official") ? "#8A6D00" : "#555", fontWeight: r.approved_source.startsWith("official") ? 700 : 400 }}>
                      {r.approved_source}
                    </span>
                  </p>
                  <p style={{ margin: "8px 0", fontSize: 14, lineHeight: 1.5 }}>{r.whats_new}</p>
                  <p style={{ margin: "4px 0 10px", fontSize: 13, color: "#555" }}>Fills: {r.fills_gap}</p>
                  <p style={{ margin: "0 0 12px", fontSize: 13, wordBreak: "break-all" }}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: RED }}>{r.url}</a>
                  </p>
                  {r.ingest_log && <p style={{ margin: "0 0 12px", fontSize: 12, color: "#555" }}>{r.ingest_file ? `${r.ingest_file} · ` : ""}{r.ingest_log}</p>}
                  {["pending", "approved", "rejected", "failed"].includes(r.status) && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {r.status !== "approved" && (
                        <form action={decide}>
                          <input type="hidden" name="id" value={r.id} />
                          <input type="hidden" name="status" value="approved" />
                          <button style={btn(RED, "#fff")}>Approve</button>
                        </form>
                      )}
                      {r.status !== "rejected" && (
                        <form action={decide}>
                          <input type="hidden" name="id" value={r.id} />
                          <input type="hidden" name="status" value="rejected" />
                          <button style={btn("#fff", "#333", "#CCC")}>Reject</button>
                        </form>
                      )}
                      {r.status !== "pending" && r.status !== "failed" && (
                        <form action={decide}>
                          <input type="hidden" name="id" value={r.id} />
                          <input type="hidden" name="status" value="pending" />
                          <button style={btn("#fff", "#555", "#E0E0E0")}>Undo</button>
                        </form>
                      )}
                    </div>
                  )}
                </article>
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}

function btn(bg, fg, border) {
  return { padding: "10px 18px", fontSize: 14, fontWeight: 600, fontFamily: "inherit", background: bg, color: fg, border: `1px solid ${border || bg}`, borderRadius: 9, cursor: "pointer", minHeight: 44 };
}
