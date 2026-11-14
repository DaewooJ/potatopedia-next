// Magazine edition of a newsletter issue (14 Nov 2026). DigiMagz makes the magazine; this site only shows it:
// a flipbook of page images (/media/…jpg) and an email-gated PDF in the PRIVATE Vercel Blob store. Data lives on the
// issue row (issues.magazine, db/newsletters.sql §8), written by scripts/newsletters/magazine-upload.mjs, so a new
// issue needs no code. Gate ref = "issue/<newsletter>/<yyyy-mm-dd>" (lead type report_download, details.kind magazine).
import { sql } from "./news-db";
import { bySlug, issueLabel, dayStr } from "./newsletters";

export const MAG_REF_RE = /^issue\/[a-z0-9-]{3,60}\/\d{4}-\d{2}-\d{2}$/;
export const magRef = (issue) => `issue/${issue.newsletter}/${dayStr(issue.issue_date)}`;

// Only a valid magazine (pages + pdf) counts.
export function magazineOf(issue) {
  const m = issue?.magazine;
  if (!m || !Array.isArray(m.pages) || !m.pages.length) return null;
  return m;
}

export const magazineTitle = (issue) => `${bySlug(issue.newsletter)?.name || "Potatopedia"} · ${issueLabel(issue.issue_no)}`;

// ref → {title, href, pdf:{file,pages,bytes,name}, newsletter, date} for a published, non-dry-run issue, else null.
export async function magazineFor(ref) {
  if (!MAG_REF_RE.test(String(ref || ""))) return null;
  const [, newsletter, date] = ref.split("/");
  if (!bySlug(newsletter)) return null;
  const s = sql();
  if (!s) return null;
  try {
    const [issue] = await s.query(
      `select newsletter, issue_no, issue_date, magazine from issues
        where newsletter=$1 and issue_date=$2 and not dry_run and published_at is not null`, [newsletter, date]);
    const m = magazineOf(issue);
    if (!m?.pdf?.file) return null;
    return { title: magazineTitle(issue), href: `/issues/${newsletter}/${date}`, pdf: m.pdf, newsletter, date, issueNo: issue.issue_no };
  } catch (e) {
    console.error("magazine_lookup_failed", ref, e?.message);
    return null;
  }
}
