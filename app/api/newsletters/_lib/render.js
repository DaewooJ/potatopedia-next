// Builds the per-recipient email for an issue (shared by /send and /email/<id>).
import { itemsByIds } from "@/lib/news-db";
import { bySlug, issueHref, SITE } from "@/lib/newsletters";
import { renderIssueEmail } from "@/lib/newsletter-email";
import { unsubUrl, manageUrl } from "@/lib/news-write";

export async function issueRenderer(issue) {
  const ids = [issue.lead_item_id, ...(issue.item_ids || [])].filter(Boolean);
  const items = await itemsByIds(ids);
  const n = bySlug(issue.newsletter);
  const webUrl = issue.published_at && !issue.dry_run ? SITE + issueHref(issue) : `${SITE}/issues/preview/${issue.id}?t=${issue.preview_token || ""}`;
  return (iss, sub) => {
    const u = sub ? unsubUrl(sub.unsub_token, iss.id) : `${SITE}/newsletters`;
    const m = renderIssueEmail(iss, items, n, { unsubUrl: u, manageUrl: sub ? manageUrl(sub.unsub_token) : `${SITE}/newsletters`, webUrl });
    return { ...m, unsubUrl: sub ? u : null };
  };
}
