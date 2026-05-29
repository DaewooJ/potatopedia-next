// app/contact/page.jsx
import LegalPage, {
  COMPANY,
  H2,
  P,
  A,
  CompanyDetails,
} from "@/components/LegalPage";

export const metadata = {
  title: "Contact Us | Potatopedia",
  description:
    "Get in touch with Indpotato Private Limited, the company behind Potatopedia. Email, phone and support hours.",
  alternates: { canonical: "https://www.potatopedia.com/contact" },
};

export default function ContactPage() {
  return (
    <LegalPage
      eyebrow="Support"
      title="Contact Us"
      intro={`We'd love to hear from you. For support, billing questions, feedback or any other queries about ${COMPANY.brand}, please use the details below.`}
    >
      <H2>Company details</H2>
      <CompanyDetails withGrievance />

      <H2>How to reach us</H2>
      <P>
        <strong>Email:</strong>{" "}
        <A href={`mailto:${COMPANY.email}`}>{COMPANY.email}</A>
        <br />
        <strong>Phone:</strong> {COMPANY.phone}
        <br />
        <strong>Support hours:</strong> {COMPANY.hours}
      </P>

      <H2>Response time</H2>
      <P>
        We aim to respond to all queries within 1–2 business days. For
        payment-related issues, please include your payment reference / order ID
        so we can assist you faster.
      </P>

      <H2>Related policies</H2>
      <P>
        <A href="/terms">Terms &amp; Conditions</A> ·{" "}
        <A href="/privacy">Privacy Policy</A> ·{" "}
        <A href="/refund-policy">Refund &amp; Cancellation Policy</A> ·{" "}
        <A href="/shipping-policy">Shipping &amp; Delivery Policy</A> ·{" "}
        <A href="/disclaimer">Disclaimer</A>
      </P>
    </LegalPage>
  );
}
