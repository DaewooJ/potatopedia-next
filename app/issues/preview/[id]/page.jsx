import { notFound } from "next/navigation";
import { issuePreview } from "@/lib/news-db";
import IssueView from "@/components/IssueView";

// /issues/preview/<id>?t=<preview_token> — Devendra's WhatsApp preview link. Any status, dry runs included; never
// indexed, never cached; wrong or missing token = 404 (does not reveal that the issue exists).
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Issue preview",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default async function IssuePreviewPage({ params, searchParams }) {
  const { id } = await params;
  const { t } = await searchParams;
  if (!/^\d{1,12}$/.test(String(id)) || typeof t !== "string" || t.length < 8) notFound();
  const issue = await issuePreview(id, t);
  if (!issue) notFound();
  return <IssueView issue={issue} preview />;
}
