// app/terms/page.jsx
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
  title: "Terms & Conditions | Potatopedia",
  description:
    "The terms and conditions governing your use of Potatopedia, operated by Indpotato Private Limited, including subscriptions, payments and acceptable use.",
  alternates: { canonical: "https://www.potatopedia.com/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      intro={`These Terms & Conditions ("Terms") govern your access to and use of the ${COMPANY.brand} platform at ${COMPANY.domain}, operated by ${COMPANY.legalName} (CIN: ${COMPANY.cin}). By accessing or using the platform, or by making a payment, you agree to be bound by these Terms and by our Privacy Policy. If you do not agree, please do not use the platform.`}
    >
      <H2>1. About the service</H2>
      <P>
        {COMPANY.brand} is an AI-powered potato knowledge and intelligence
        platform that provides informational content, data summaries and
        answers to user questions about the potato sector. The platform is
        provided for general informational and research purposes only.
      </P>

      <H2>2. Eligibility</H2>
      <P>
        You must be at least 18 years old and capable of forming a legally
        binding contract under the Indian Contract Act, 1872 to use the platform
        or make a purchase. By using the platform you represent that you meet
        these requirements.
      </P>

      <H2>3. Accounts</H2>
      <P>
        Where account creation is offered, you are responsible for maintaining
        the confidentiality of your login credentials and for all activity under
        your account. You agree to provide accurate, current and complete
        information and to keep it updated.
      </P>

      <H2>4. Subscriptions, pricing and payments</H2>
      <UL>
        <LI>
          Paid plans, where offered, are described on the platform along with
          their features and price. All prices are listed in Indian Rupees (INR)
          unless stated otherwise, and the total amount payable, including
          applicable taxes, is shown at checkout before you confirm the payment.
        </LI>
        <LI>
          Payments are processed securely through our payment partner, Razorpay.
          By making a payment you also agree to Razorpay's applicable terms.
        </LI>
        <LI>
          If a plan is offered on a recurring/subscription basis, the billing
          cycle and renewal terms will be disclosed at the time of purchase.
          Where auto-renewal applies, you may cancel before the next renewal
          date to avoid further charges.
        </LI>
        <LI>
          You authorise us and our payment partner to charge the amount due to
          your selected payment method. We are not responsible for any fees your
          bank or payment provider may apply.
        </LI>
      </UL>
      <Callout>
        Refunds and cancellations are governed by our{" "}
        <A href="/refund-policy">Refund &amp; Cancellation Policy</A>. Delivery
        of access is governed by our{" "}
        <A href="/shipping-policy">Shipping &amp; Delivery Policy</A>.
      </Callout>

      <H2>5. AI-generated content and accuracy</H2>
      <P>
        Answers and content on {COMPANY.brand} are generated using artificial
        intelligence in combination with curated data sources. While we strive
        for accuracy and draw on reputable references, AI-generated output may
        be incomplete, outdated or incorrect. Content is provided "as is" for
        informational purposes and does not constitute professional, agronomic,
        financial, investment, legal or other advice. You should independently
        verify important information against primary sources before relying on
        it. See our <A href="/disclaimer">Disclaimer</A> for more.
      </P>

      <H2>6. Acceptable use</H2>
      <P>You agree not to:</P>
      <UL>
        <LI>use the platform for any unlawful, fraudulent or harmful purpose;</LI>
        <LI>attempt to gain unauthorised access to, interfere with, or disrupt the platform, its servers or networks;</LI>
        <LI>scrape, harvest, copy or systematically extract content except as expressly permitted;</LI>
        <LI>reverse engineer, resell or commercially exploit the service without our written consent;</LI>
        <LI>upload or transmit malicious code, or submit content that infringes the rights of others; or</LI>
        <LI>misuse the AI features, including attempts to generate unlawful, abusive or misleading content.</LI>
      </UL>

      <H2>7. Intellectual property</H2>
      <P>
        The {COMPANY.brand} name, logo, platform, design, compiled data,
        original written content and software are owned by or licensed to{" "}
        {COMPANY.legalName} and are protected by applicable intellectual
        property laws. Underlying statistics and facts are sourced from
        third-party authorities and remain the property of their respective
        owners. You are granted a limited, non-exclusive, non-transferable
        licence to access and use the platform for your personal or internal
        business purposes, subject to these Terms.
      </P>

      <H2>8. Third-party links and services</H2>
      <P>
        The platform may reference or link to third-party websites, data sources
        and services. We do not control and are not responsible for their
        content, policies or practices. Accessing them is at your own risk.
      </P>

      <H2>9. Disclaimer of warranties</H2>
      <P>
        The platform and all content are provided on an "as is" and "as
        available" basis without warranties of any kind, whether express or
        implied, including warranties of merchantability, fitness for a
        particular purpose, accuracy or non-infringement. We do not warrant that
        the platform will be uninterrupted, error-free or secure.
      </P>

      <H2>10. Limitation of liability</H2>
      <P>
        To the maximum extent permitted by law, {COMPANY.legalName} and its
        directors, employees and affiliates shall not be liable for any
        indirect, incidental, special, consequential or punitive damages, or any
        loss of profits, data, goodwill or business, arising out of or in
        connection with your use of (or inability to use) the platform. To the
        extent any liability cannot be excluded, our total aggregate liability
        shall not exceed the amount you paid to us for the service in the three
        (3) months preceding the event giving rise to the claim.
      </P>

      <H2>11. Indemnification</H2>
      <P>
        You agree to indemnify and hold harmless {COMPANY.legalName} from and
        against any claims, liabilities, damages and expenses (including
        reasonable legal fees) arising out of your breach of these Terms or your
        misuse of the platform.
      </P>

      <H2>12. Termination</H2>
      <P>
        We may suspend or terminate your access to the platform at any time,
        with or without notice, if you breach these Terms or if we reasonably
        believe such action is necessary to protect the platform or other users.
        Provisions that by their nature should survive termination will survive.
      </P>

      <H2>13. Governing law and jurisdiction</H2>
      <P>
        These Terms are governed by the laws of India. Subject to applicable
        law, the courts at Pune, Maharashtra, India shall have exclusive
        jurisdiction over any disputes arising out of or in connection with
        these Terms or the platform.
      </P>

      <H2>14. Changes to these Terms</H2>
      <P>
        We may modify these Terms from time to time. The updated version will be
        posted on this page with a revised "Last updated" date. Your continued
        use of the platform after changes take effect constitutes acceptance of
        the revised Terms.
      </P>

      <H2>15. Contact us</H2>
      <P>For any questions about these Terms, please contact:</P>
      <CompanyDetails withGrievance />
    </LegalPage>
  );
}
