// app/privacy/page.jsx
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
  title: "Privacy Policy | Potatopedia",
  description:
    "How Indpotato Private Limited (Potatopedia) collects, uses, stores and protects your personal data, in line with India's DPDP Act, 2023.",
  alternates: { canonical: "https://www.potatopedia.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro={`This Privacy Policy explains how ${COMPANY.legalName} ("we", "us", "our"), which operates the ${COMPANY.brand} platform at ${COMPANY.domain}, collects, uses, discloses and protects your information when you use our website and services. We are committed to handling your personal data responsibly and in accordance with applicable Indian law, including the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000 and rules thereunder.`}
    >
      <H2>1. Who we are</H2>
      <P>
        The website {COMPANY.domain} and the {COMPANY.brand} service are owned
        and operated by {COMPANY.legalName}, a company incorporated in India
        (CIN: {COMPANY.cin}). For the purposes of the DPDP Act, we act as the
        Data Fiduciary in respect of personal data processed through the
        platform.
      </P>

      <H2>2. Information we collect</H2>
      <P>We collect the following categories of information:</P>
      <UL>
        <LI>
          <strong>Information you provide.</strong> When you contact us, submit
          feedback, subscribe to a paid plan, or create an account (where
          applicable), we may collect your name, email address, phone number and
          related details.
        </LI>
        <LI>
          <strong>Questions and queries.</strong> The questions you submit to
          our AI-powered answer service and the content of your interactions
          with the platform.
        </LI>
        <LI>
          <strong>Payment information.</strong> If you make a payment, the
          transaction is processed by our payment partner (Razorpay). We do{" "}
          <strong>not</strong> collect or store your full card number, CVV, UPI
          PIN, net-banking credentials or bank account details on our servers.
          See Section 5.
        </LI>
        <LI>
          <strong>Usage and device data.</strong> Aggregated, largely anonymous
          analytics such as pages visited, approximate region, browser type and
          referral source, collected via Google Analytics and Plausible
          Analytics.
        </LI>
        <LI>
          <strong>Cookies and similar technologies.</strong> See Section 6.
        </LI>
      </UL>

      <H2>3. How we use your information</H2>
      <P>We use the information we collect to:</P>
      <UL>
        <LI>provide, operate, maintain and improve the {COMPANY.brand} platform and generate answers to your queries;</LI>
        <LI>process subscriptions, payments, invoices and refunds;</LI>
        <LI>respond to your enquiries, feedback and support requests;</LI>
        <LI>understand usage patterns and improve content, features and accuracy;</LI>
        <LI>detect, prevent and address fraud, abuse, security issues and technical problems; and</LI>
        <LI>comply with applicable legal and regulatory obligations.</LI>
      </UL>

      <H2>4. AI processing and service providers</H2>
      <P>
        {COMPANY.brand} is an AI-powered knowledge platform. To generate
        answers, the questions you submit may be processed by third-party
        large-language-model and embedding providers acting as our processors.
        We share only what is necessary to provide the service and instruct such
        providers to use the data solely for that purpose. We do not sell your
        personal data to anyone.
      </P>
      <Callout>
        Please avoid entering sensitive personal information (such as
        identification numbers, financial details or health information) into
        the question box. Questions are processed to generate answers and may be
        retained to improve service quality.
      </Callout>

      <H2>5. Payments and Razorpay</H2>
      <P>
        Online payments on {COMPANY.brand} are handled by Razorpay Software
        Private Limited, a payment aggregator authorised by the Reserve Bank of
        India. When you pay, your payment-instrument details are collected and
        processed directly by Razorpay on its PCI-DSS compliant infrastructure
        and are governed by Razorpay's own privacy policy and terms. We receive
        only limited transaction information (such as a payment reference,
        status and amount) needed to confirm and reconcile your order. You can
        review Razorpay's policies at{" "}
        <A href="https://razorpay.com/privacy/">razorpay.com/privacy</A>.
      </P>

      <H2>6. Cookies and analytics</H2>
      <P>
        We use cookies and similar technologies to keep the site working, to
        remember your preferences and to understand how the platform is used. We
        use Google Analytics and Plausible Analytics to measure traffic in
        aggregate (Plausible is cookie-free; Google Analytics may set cookies).
        You can control cookies through your browser settings; disabling some
        cookies may affect site functionality.
      </P>

      <H2>7. How we share information</H2>
      <P>We may share your information only:</P>
      <UL>
        <LI>with service providers and processors (e.g. hosting, payment, analytics, AI providers) who support our operations under appropriate confidentiality obligations;</LI>
        <LI>where required to comply with law, legal process, or a lawful request by a public authority;</LI>
        <LI>to protect the rights, property or safety of {COMPANY.legalName}, our users or others, including fraud prevention; and</LI>
        <LI>in connection with a merger, acquisition or sale of assets, subject to this Policy.</LI>
      </UL>

      <H2>8. Data retention</H2>
      <P>
        We retain personal data only for as long as necessary for the purposes
        described in this Policy, to comply with our legal, accounting or
        reporting obligations, or to resolve disputes. When data is no longer
        required, we delete or anonymise it.
      </P>

      <H2>9. Data security</H2>
      <P>
        We implement reasonable technical and organisational security practices
        designed to protect personal data against unauthorised access,
        alteration, disclosure or destruction. However, no method of
        transmission or storage is completely secure, and we cannot guarantee
        absolute security.
      </P>

      <H2>10. Your rights</H2>
      <P>
        Subject to applicable law, including the DPDP Act, you have the right to
        access, correct, update and erase your personal data, to withdraw
        consent, and to nominate another individual to exercise your rights in
        the event of death or incapacity. To exercise any of these rights, or to
        raise a grievance, contact our Grievance Officer using the details in
        Section 14.
      </P>

      <H2>11. Children</H2>
      <P>
        Our services are not directed to children under the age of 18, and we do
        not knowingly collect personal data from children without verifiable
        parental or guardian consent. If you believe a child has provided us
        personal data, please contact us so we can take appropriate action.
      </P>

      <H2>12. International users</H2>
      <P>
        {COMPANY.brand} is operated from India. If you access the platform from
        outside India, you understand that your information may be processed in
        India, where data-protection laws may differ from those in your
        jurisdiction.
      </P>

      <H2>13. Changes to this Policy</H2>
      <P>
        We may update this Privacy Policy from time to time. We will post the
        updated version on this page and revise the "Last updated" date above.
        Your continued use of the platform after changes take effect constitutes
        acceptance of the revised Policy.
      </P>

      <H2>14. Grievance Officer and contact</H2>
      <P>
        For any questions, requests or complaints regarding this Policy or your
        personal data, please contact our Grievance Officer:
      </P>
      <CompanyDetails withGrievance />
      <P>
        We aim to acknowledge grievances within a reasonable time and to resolve
        them in accordance with applicable law.
      </P>
    </LegalPage>
  );
}
