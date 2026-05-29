// app/disclaimer/page.jsx
import LegalPage, {
  COMPANY,
  H2,
  P,
  UL,
  LI,
  A,
  Callout,
  CompanyDetails,
} from "@/components/LegalPage";

export const metadata = {
  title: "Disclaimer | Potatopedia",
  description:
    "Important disclaimer for Potatopedia: content is informational only, may be AI-generated, and is not professional advice.",
  alternates: { canonical: "https://www.potatopedia.com/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Disclaimer"
      intro={`The information provided on ${COMPANY.brand} (${COMPANY.domain}), operated by ${COMPANY.legalName}, is for general informational and educational purposes only. By using this platform, you acknowledge and accept the terms of this Disclaimer.`}
    >
      <H2>1. Informational purposes only</H2>
      <P>
        All content on {COMPANY.brand}, including data, statistics, articles,
        country profiles and AI-generated answers, is provided for general
        information and research. It is not a substitute for professional advice
        and should not be relied upon as the sole basis for any decision.
      </P>

      <H2>2. No professional advice</H2>
      <P>
        Nothing on {COMPANY.brand} constitutes agronomic, agricultural,
        scientific, business, financial, investment, trading, legal, medical or
        nutritional advice. You should consult a suitably qualified professional
        before acting on any information found here.
      </P>

      <H2>3. AI-generated content</H2>
      <P>
        Parts of this platform use artificial intelligence to generate or
        summarise content. AI systems can produce information that is inaccurate,
        incomplete, outdated or misleading, including plausible-sounding but
        incorrect statements. Always verify critical information against the
        original primary sources before relying on it.
      </P>
      <Callout>
        AI-generated answers should be treated as a starting point for research,
        not as authoritative or final. {COMPANY.legalName} does not guarantee
        the accuracy, completeness or timeliness of any AI output.
      </Callout>

      <H2>4. Data and sources</H2>
      <P>
        We compile information from a range of third-party sources, including
        government agencies and recognised statistical and research bodies.
        While we aim to use reputable sources and represent them faithfully, we
        do not warrant the accuracy or completeness of third-party data, and
        figures may be revised by the original publishers over time. Where
        figures reflect methodological revisions or anomalies, we endeavour to
        flag them, but we cannot guarantee that all such cases are identified.
      </P>

      <H2>5. External links</H2>
      <P>
        This platform may contain links to external websites and data sources
        that are not operated by us. We have no control over, and accept no
        responsibility for, the content, accuracy or practices of any
        third-party site.
      </P>

      <H2>6. Limitation of liability</H2>
      <P>
        To the maximum extent permitted by law, {COMPANY.legalName} shall not be
        liable for any loss or damage, direct or indirect, arising from your use
        of, or reliance on, any information on this platform. Your use of the
        platform is entirely at your own risk. This Disclaimer should be read
        together with our <A href="/terms">Terms &amp; Conditions</A>.
      </P>

      <H2>7. Contact</H2>
      <P>If you have questions about this Disclaimer, please contact:</P>
      <CompanyDetails />
    </LegalPage>
  );
}
