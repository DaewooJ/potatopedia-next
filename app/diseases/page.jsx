import RefPage, { Cards, Section, refJsonLd, refMetadata } from "../../components/RefPage";
import { DISEASES, SHORT_DISEASES, DISEASES_UPDATED } from "../../lib/reference/diseases";

const TITLE = "Potato Diseases: Late Blight, Blackleg, Wilt, PCN, Virus";
const DESC = "Reference guide to six major potato diseases and three short entries: cause, symptoms, spread, risk regions, management, EU regulation and seed certification.";
const PATH = "/diseases";
export const metadata = refMetadata({ title: "Potato Diseases: Causes, Spread and Control", description: DESC, path: PATH });

const crumbs = [{ name: "Home", href: "/" }, { name: "Diseases", href: PATH }];

export default function Page() {
  const jsonLd = refJsonLd({
    path: PATH,
    headline: "Potato diseases: causes, spread and control",
    description: DESC,
    datePublished: "2026-11-07",
    dateModified: DISEASES_UPDATED.iso,
    crumbs,
  });
  const sections = [
    {
      id: "scope",
      h2: "How these pages work",
      p: [
        "Each disease page covers the cause, symptoms, how it spreads, where the risk is highest, management (cultural, resistant varieties and chemical, with regulatory notes), the seed certification angle and key sources. Regulatory notes name the instrument, but approvals change by country and year, so check the current national register before using a product.",
        "Seed health runs through all of it. Most potato diseases of consequence travel in the seed tuber, which is why certification classes set maximum tolerances for disease and zero for regulated bacteria.",
      ],
    },
  ];
  return (
    <RefPage
      path={PATH}
      kicker="Reference"
      h1="Potato diseases"
      lede="Six major diseases in depth, and short entries on zebra chip, ring rot and wart. The pages are written for growers, seed buyers and analysts who need the cause, the risk and the control in one place."
      updatedLabel={DISEASES_UPDATED.label}
      updatedISO={DISEASES_UPDATED.iso}
      crumbs={crumbs}
      sections={sections}
      jsonLd={jsonLd}
      sources={[
        { label: "EPPO Global Database", url: "https://gd.eppo.int/" },
        { label: "CIP, International Potato Center", url: "https://cipotato.org/" },
        { label: "EuroBlight", url: "https://euroblight.net/" },
        { label: "USDA APHIS Plant Protection and Quarantine", url: "https://www.aphis.usda.gov/" },
      ]}
      related={[
        { href: "/knowledge/potato-diseases-pests", title: "Potato diseases and pests", desc: "Overview." },
        { href: "/knowledge/seed-potato-systems", title: "Seed potato systems", desc: "Certification classes." },
        { href: "/answers/seed-potato-certification", title: "Seed potato certification", desc: "Short answer." },
      ]}
    >
      <Cards title="Disease guides" items={DISEASES.map((d) => ({ href: `/diseases/${d.slug}`, title: d.name, sub: d.latin, desc: d.lede.split(". ")[0] + "." }))} />
      {SHORT_DISEASES.map((s) => <Section key={s.id} s={{ id: s.id, h2: s.h2, p: [s.p] }} />)}
    </RefPage>
  );
}
