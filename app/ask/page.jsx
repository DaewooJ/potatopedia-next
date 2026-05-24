// Server wrapper for /ask. Conditionally noindexes parameterized URLs (/ask?q=...)
// while keeping the canonical /ask landing page indexable.
//
// Why: each user-generated query creates a unique parameterized URL with low individual
// page authority. Indexing them dilutes citation signal for the canonical /ask page.

import AskClient from "./AskClient";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const hasQuery = !!params?.q;
  if (hasQuery) {
    return {
      robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
    };
  }
  return {};
}

export default function AskPage() {
  return <AskClient />;
}
