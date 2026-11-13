import Link from "next/link";
import { SITE, TRUST_LINE } from "@/lib/newsletters";
import { POTATOPEDIA_PUBLISHER } from "@/lib/authors";
import LeadForm from "@/components/LeadForm";
import { WRAP, H1, H2, P, KICK, CARD, LINK, Crumbs, crumbsLd, JsonLd } from "@/components/NewsUI";

// /contribute — the expert programme (prompt §3 and §5C, 13 Nov 2026). Pitch form → leads type 'contribute' →
// Devendra approves the pitch → draft → our fact and source edit → the writer approves → published with byline.
const PATH = "/contribute";
const DESC = "Write for Potatopedia: breeders, scientists, extension specialists and consultants publish bylined, sourced articles of 800 to 1,500 words for the global potato industry.";

export const metadata = {
  title: "Write for Potatopedia: Expert Contributions",
  description: DESC,
  alternates: { canonical: SITE + PATH },
  openGraph: { title: "Write for Potatopedia — expert contributions", description: DESC, type: "website", url: SITE + PATH, images: ["/og-image.png"] },
};

const crumbs = [{ name: "Home", href: "/" }, { name: "Contribute", href: PATH }];

const WHO = [
  "Potato breeders and seed-company scientists",
  "Researchers at CIP, national research institutes and universities",
  "Extension specialists and agronomists",
  "Plant-health, certification and storage specialists",
  "Independent consultants and market analysts",
  "Heads of growers' associations and national potato boards",
];

const TOPICS = [
  "What a new variety or registration means for growers and processors",
  "Seed certification, seed health and seed trade rules in your country",
  "Disease and pest pressure: PVY, late blight, wireworm, zebra chip, nematodes",
  "Storage, sprout control and keeping quality for processing",
  "Processing technology: sorting, peeling, frying, acrylamide, energy",
  "Markets and trade: how prices are set, contracts, export flows",
  "Research results explained for people who run farms, stores and plants",
];

const STEPS = [
  ["Pitch", "Send the form below: the topic, two or three sentences on your angle, and your role."],
  ["Approval", "We reply within one working day and approve the pitch, or suggest a different angle."],
  ["Draft", "You write 800 to 1,500 words in plain English, with a source for every figure."],
  ["Edit", "We edit for facts, sources and plain English. Nothing changes your meaning without your say."],
  ["Your approval", "You approve the edited version before anything is published."],
  ["Publish", "The article goes live with your byline, photo, short bio and one link to your institution, and you get an author page."],
];

const RULES = [
  "800 to 1,500 words.",
  "No selling: no product pitches, prices or calls to buy. Name your company once, in your bio.",
  "Every figure has a source we can link: an official statistic, a peer-reviewed paper, a trial report or a public company document.",
  "Your own work, not published elsewhere first. You keep the right to share it after publication with a link back.",
  "A real photo of you (your own); we never use AI images.",
  "One link, to your institution or company page, in your bio.",
];

export default function ContributePage() {
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": SITE + PATH + "#page", url: SITE + PATH, name: "Write for Potatopedia", description: DESC, publisher: { "@id": SITE + "/#publisher" }, isPartOf: { "@id": SITE + "/#website" } },
      crumbsLd(crumbs),
      POTATOPEDIA_PUBLISHER,
    ],
  };
  return (
    <article style={{ paddingBottom: 72 }}>
      <JsonLd data={ld} />
      <header style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", padding: "36px 0 28px" }}>
        <div style={WRAP}>
          <Crumbs items={crumbs} />
          <p style={KICK}>Expert programme</p>
          <h1 style={H1}>Write for Potatopedia</h1>
          <p data-summary="true" style={{ ...P, fontSize: 18 }}>
            Potatopedia publishes bylined articles by people who know the crop: breeders, scientists, extension specialists and consultants. Articles run on the site and in our newsletters, read by growers, processors, seed houses and traders worldwide. You write 800 to 1,500 words; we check the facts and sources; you approve the edit.
          </p>
          <p style={{ margin: 0 }}><a href="#pitch" style={{ display: "inline-block", background: "#C62828", color: "#fff", textDecoration: "none", fontWeight: 600, padding: "12px 20px", borderRadius: 10, fontSize: 15 }}>Pitch an article</a></p>
        </div>
      </header>
      <div style={WRAP}>
        <section aria-labelledby="who-h">
          <h2 id="who-h" style={H2}>Who can write</h2>
          <ul style={{ margin: "0 0 14px", paddingLeft: 22 }}>{WHO.map((w) => <li key={w} style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink2)" }}>{w}</li>)}</ul>
          <p style={P}>Writers from Africa, Asia and Latin America are especially welcome: those markets get too little expert coverage.</p>
        </section>
        <section aria-labelledby="top-h">
          <h2 id="top-h" style={H2}>Topics we want</h2>
          <ul style={{ margin: "0 0 14px", paddingLeft: 22 }}>{TOPICS.map((w) => <li key={w} style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink2)" }}>{w}</li>)}</ul>
        </section>
        <section aria-labelledby="rules-h">
          <h2 id="rules-h" style={H2}>The rules</h2>
          <ul style={{ margin: "0 0 14px", paddingLeft: 22 }}>{RULES.map((w) => <li key={w} style={{ fontSize: 16, lineHeight: 1.7, color: "var(--ink2)" }}>{w}</li>)}</ul>
          <p style={{ ...P, fontSize: 15 }}>Expert contributions are editorial: they are chosen on merit, never sold. Paid company content is a separate product, always labelled &ldquo;Published with us&rdquo;. {TRUST_LINE} See the <Link href="/editorial-standards" style={LINK}>editorial standards</Link>.</p>
        </section>
        <section aria-labelledby="steps-h">
          <h2 id="steps-h" style={H2}>How it works</h2>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
            {STEPS.map(([t, d], i) => (
              <li key={t} style={{ ...CARD, display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px" }}>
                <span style={{ fontFamily: "var(--hp-serif), Georgia, serif", fontSize: 26, lineHeight: 1, color: "var(--gold)", minWidth: 26 }}>{i + 1}</span>
                <span><strong style={{ display: "block", color: "var(--ink)", fontSize: 15.5 }}>{t}</strong><span style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--mute)" }}>{d}</span></span>
              </li>
            ))}
          </ol>
        </section>
        <section id="pitch" aria-labelledby="pitch-h" style={{ ...CARD, marginTop: 36, scrollMarginTop: 96 }}>
          <h2 id="pitch-h" style={{ ...H2, margin: "0 0 12px" }}>Pitch an article</h2>
          <LeadForm
            type="contribute"
            submitLabel="Send my pitch"
            messageLabel="Your pitch: the angle, in two or three sentences"
            extra={[
              { name: "topic", label: "Topic", placeholder: "e.g. PVY control in seed crops" },
              { name: "institution", label: "Institution or company", placeholder: "e.g. a university or research institute" },
              { name: "role", label: "Your role", placeholder: "e.g. potato breeder" },
              { name: "profile_url", label: "Public profile link (optional)", placeholder: "https://" },
            ]}
          />
          <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--mute2)" }}>We use your details only to reply about this pitch. <Link href="/privacy" style={{ color: "var(--gold)" }}>Privacy policy</Link>.</p>
        </section>
      </div>
    </article>
  );
}
