// app/shipping-policy/page.jsx
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
  title: "Shipping & Delivery Policy | Potatopedia",
  description:
    "Delivery policy for Potatopedia digital services. Potatopedia provides digital access only; no physical goods are shipped.",
  alternates: { canonical: "https://www.potatopedia.com/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Shipping & Delivery Policy"
      intro={`${COMPANY.brand} (${COMPANY.domain}), operated by ${COMPANY.legalName}, provides digital services only. This policy explains how access to our paid digital services is delivered.`}
    >
      <H2>1. Digital services — no physical shipping</H2>
      <P>
        {COMPANY.brand} offers online, subscription-based access to its knowledge
        platform, data and AI-powered features. We do not sell or ship any
        physical products. Accordingly, no shipping charges apply and no
        physical delivery is involved.
      </P>

      <H2>2. Delivery of digital access</H2>
      <Callout>
        Upon successful payment confirmation from our payment partner
        (Razorpay), access to the purchased digital service is activated
        electronically — typically immediately and in any case within 24 hours.
        A confirmation is sent to the email address provided at the time of
        purchase.
      </Callout>

      <H2>3. If you don't receive access</H2>
      <P>
        If your payment is successful but you do not receive access or a
        confirmation within 24 hours, please first check your spam/junk folder,
        then contact us at{" "}
        <A href={`mailto:${COMPANY.email}`}>{COMPANY.email}</A> with your payment
        reference / order ID. We will resolve the issue promptly or, where
        applicable, process a refund in line with our{" "}
        <A href="/refund-policy">Refund &amp; Cancellation Policy</A>.
      </P>

      <H2>4. Contact</H2>
      <P>For any questions about delivery of our services, contact:</P>
      <CompanyDetails />
    </LegalPage>
  );
}
