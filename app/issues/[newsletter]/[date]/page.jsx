import { notFound } from "next/navigation";
import { SITE, bySlug, issueHref, issueLabel, masthead } from "@/lib/newsletters";
import { issueByDate } from "@/lib/news-db";
import IssueView from "@/components/IssueView";

// /issues/<newsletter>/<yyyy-mm-dd> — the web version of a published issue (canonical = itself).
// Only published, non-dry-run issues resolve (issueByDate). ISR, revalidated on publish; builds with an empty table.
export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

async function load(params) {
  const { newsletter, date } = await params;
  if (!bySlug(newsletter) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return issueByDate(newsletter, date);
}

export async function generateMetadata({ params }) {
  const issue = await load(params);
  if (!issue) return { title: "Issue not found", robots: { index: false } };
  const n = bySlug(issue.newsletter);
  const url = SITE + issueHref(issue);
  const title = `${issue.subject} · ${n.name} ${issueLabel(issue.issue_no)}`;
  const description = String(issue.preheader || issue.intro || `${masthead(n)}, ${issueLabel(issue.issue_no)}.`).slice(0, 158);
  const og = issue.cover?.og || "/og-image.png";
  const img = { url: og.startsWith("http") ? og : SITE + og, ...(issue.cover?.og ? { width: 1200, height: 630, alt: `${masthead(n)}, ${issueLabel(issue.issue_no)} cover` } : {}) };
  return {
    title: title.length > 64 ? title.slice(0, 61).trimEnd() + "…" : title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title, description, images: [img] },
    twitter: { card: "summary_large_image", title, description, images: [img.url] },
  };
}

export default async function IssuePage({ params }) {
  const issue = await load(params);
  if (!issue) notFound();
  return <IssueView issue={issue} />;
}
