// app/refund-policy/page.jsx
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
  title: "Refund & Cancellation Policy | Potatopedia",
  description:
    "Refund and cancellation terms for Potatopedia subscriptions and digital services, operated by Indpotato Private Limited.",
  alternates: { canonical: "https://www.potatopedia.com/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund & Cancellation Policy"
      intro={`This policy explains how cancellations and refunds work for paid subscriptions and digital services offered on ${COMPANY.brand} (${COMPANY.domain}), operated by ${COMPANY.legalName}. Please read it carefully before making a purchase.`}
    >
      <H2>1. Nature of our services</H2>
      <P>
        {COMPANY.brand} provides digital subscription-based access to its
        knowledge platform, data and AI-powered features. There are no physical
        goods. Because access is delivered electronically and immediately, the
        terms below apply.
      </P>

      <H2>2. Cancellation</H2>
      <UL>
        <LI>
          You may cancel a subscription at any time by emailing us at{" "}
          <A href={`mailto:${COMPANY.email}`}>{COMPANY.email}</A> or through your
          account settings (where available).
        </LI>
        <LI>
          Cancellation stops future renewals. Your access generally continues
          until the end of the current paid billing period, after which it will
          not renew.
        </LI>
      </UL>

      <H2>3. Refund eligibility</H2>
      <UL>
        <LI>
          <strong>Failed or duplicate transactions.</strong> If your account or
          card was charged but access was not granted, or you were charged more
          than once for the same order, you are entitled to a full refund of the
          extra/erroneous amount.
        </LI>
        <LI>
          <strong>Recently purchased subscriptions.</strong> If you are
          dissatisfied, you may request a refund within seven (7) days of the
          initial purchase, provided the service has not been substantially used
          or abused. Approved refunds for this category may be prorated at our
          reasonable discretion.
        </LI>
        <LI>
          <strong>Service unavailability.</strong> If a paid feature is
          materially unavailable for an extended period due to a fault on our
          side and we are unable to remedy it, you may request a pro-rata refund
          for the affected period.
        </LI>
      </UL>

      <H2>4. Non-refundable items</H2>
      <UL>
        <LI>Subscription periods that have already been substantially used or have expired.</LI>
        <LI>Renewals where cancellation was not requested before the renewal date.</LI>
        <LI>Custom reports, one-time data services or other clearly-marked non-refundable items, once delivered.</LI>
        <LI>Requests made after the applicable eligibility window.</LI>
      </UL>

      <H2>5. How to request a refund</H2>
      <P>
        To request a refund, email{" "}
        <A href={`mailto:${COMPANY.email}`}>{COMPANY.email}</A> from the address
        associated with your purchase, including your name, the payment
        reference / order ID, the date of payment and the reason for the
        request. We may ask for additional information to verify the transaction.
      </P>

      <H2>6. Refund processing and timelines</H2>
      <Callout>
        Approved refunds are processed to the original payment method via our
        payment partner, Razorpay. Once approved, the refund is typically
        initiated within 3–5 business days, and the amount usually reflects in
        your account within 5–7 business days thereafter, depending on your bank
        or card issuer.
      </Callout>
      <P>
        If money was debited for a failed transaction but no payment confirmation
        was received, it is usually auto-reversed by your bank within 5–7
        business days. If you do not see the reversal, please contact us or your
        bank.
      </P>

      <H2>7. Contact</H2>
      <P>For any refund or cancellation queries, contact:</P>
      <CompanyDetails />
      <P>
        This policy should be read together with our{" "}
        <A href="/terms">Terms &amp; Conditions</A>.
      </P>
    </LegalPage>
  );
}
