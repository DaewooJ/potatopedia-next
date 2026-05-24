import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "Potatopedia privacy policy. How we collect, use, and protect your data.",
};

const sH2 = { fontSize: 22, fontWeight: 700, color: "#C62828", marginTop: 48, marginBottom: 16 };
const sP = { fontSize: 15, color: "#444", lineHeight: 1.8, marginBottom: 14 };
const sLi = { fontSize: 15, color: "#444", lineHeight: 1.8, marginBottom: 8, marginLeft: 20 };

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px 80px" }}>
        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: "#C62828", textTransform: "uppercase", letterSpacing: 2.5, background: "rgba(198,40,40,0.06)", padding: "6px 16px", borderRadius: 20, marginBottom: 20 }}>Legal</span>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1A1A1A", letterSpacing: -1.2, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 14, color: "#999", marginBottom: 32 }}>Last updated: April 7, 2026</p>

        {/* Introduction */}
        <h2 style={sH2}>Introduction</h2>
        <p style={sP}>Potatopedia (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website potatopedia.com (the &ldquo;Service&rdquo;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. We are committed to protecting your privacy and handling your data transparently.</p>
        <p style={sP}>By using Potatopedia, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use the Service.</p>

        {/* Information We Collect */}
        <h2 style={sH2}>Information We Collect</h2>
        <p style={sP}>We collect limited information to improve the Service and understand how it is used:</p>
        <p style={{ ...sP, fontWeight: 600, color: "#1A1A1A", marginBottom: 6 }}>Analytics Data (Google Analytics)</p>
        <ul>
          <li style={sLi}>Pages visited and time spent on each page</li>
          <li style={sLi}>Referring website or search query that brought you to Potatopedia</li>
          <li style={sLi}>Approximate geographic location (country/city level, not precise)</li>
          <li style={sLi}>Device type, browser, and operating system</li>
          <li style={sLi}>Anonymized IP address (IP anonymization is enabled)</li>
        </ul>
        <p style={{ ...sP, fontWeight: 600, color: "#1A1A1A", marginBottom: 6, marginTop: 16 }}>AI Questions</p>
        <ul>
          <li style={sLi}>Questions you type into the Potatopedia AI search bar are sent to our backend API for processing</li>
          <li style={sLi}>Questions are used to generate answers and may be logged for quality improvement</li>
          <li style={sLi}>We do not associate questions with your personal identity</li>
        </ul>
        <p style={{ ...sP, fontWeight: 600, color: "#1A1A1A", marginBottom: 6, marginTop: 16 }}>Feedback &amp; Contact Forms</p>
        <ul>
          <li style={sLi}>If you contact us via email or feedback forms, we collect the information you voluntarily provide (name, email address, message content)</li>
          <li style={sLi}>This information is used solely to respond to your inquiry</li>
        </ul>
        <p style={{ ...sP, fontWeight: 600, color: "#1A1A1A", marginBottom: 6, marginTop: 16 }}>Information We Do NOT Collect</p>
        <ul>
          <li style={sLi}>We do not require account registration or login</li>
          <li style={sLi}>We do not collect payment information</li>
          <li style={sLi}>We do not collect precise geolocation data</li>
          <li style={sLi}>We do not sell, rent, or trade any user data</li>
        </ul>

        {/* How We Use It */}
        <h2 style={sH2}>How We Use Your Information</h2>
        <p style={sP}>We use the information we collect for the following purposes:</p>
        <ul>
          <li style={sLi}><strong>Improve the Service:</strong> Analytics data helps us understand which content is most useful and where to focus our data coverage</li>
          <li style={sLi}><strong>Generate AI Answers:</strong> Your questions are processed by our AI system to provide accurate, sourced answers about the global potato industry</li>
          <li style={sLi}><strong>Monitor Performance:</strong> We track page load times, error rates, and availability to ensure reliable service</li>
          <li style={sLi}><strong>Respond to Inquiries:</strong> Contact information is used only to reply to your messages</li>
          <li style={sLi}><strong>Detect Abuse:</strong> We monitor for automated scraping, denial-of-service attempts, and other misuse</li>
        </ul>

        {/* Third-Party Services */}
        <h2 style={sH2}>Third-Party Services</h2>
        <p style={sP}>Potatopedia uses the following third-party services that may process your data:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          {[
            { name: "Google Analytics", purpose: "Website analytics and traffic measurement", privacy: "https://policies.google.com/privacy", note: "IP anonymization is enabled. We use Google Analytics 4 (GA4) with measurement ID G-0CXVFJDBF7." },
            { name: "Anthropic (Claude)", purpose: "AI language model powering our question-answering system", privacy: "https://www.anthropic.com/privacy", note: "Questions are sent to Anthropic's API for answer generation. Anthropic's data retention policies apply to API usage." },
            { name: "OpenAI", purpose: "Embedding model for semantic search of our knowledge base", privacy: "https://openai.com/policies/privacy-policy", note: "Text from our knowledge base and user questions are processed by OpenAI's embedding API for semantic similarity matching." },
            { name: "Vercel", purpose: "Website hosting and content delivery", privacy: "https://vercel.com/legal/privacy-policy", note: "Vercel hosts our frontend application and serves pages globally via its CDN." },
            { name: "Render", purpose: "Backend API hosting", privacy: "https://render.com/privacy", note: "Render hosts our backend API that processes questions and manages the knowledge base." },
          ].map((s, i) => (
            <div key={i} style={{ padding: "16px 20px", borderRadius: 12, border: "1px solid #f0f0f0", background: "#FAFAFA" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}><strong>Purpose:</strong> {s.purpose}</div>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>{s.note}</div>
              <a href={s.privacy} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#C62828", textDecoration: "none", fontWeight: 600 }}>Privacy Policy &rarr;</a>
            </div>
          ))}
        </div>

        {/* Cookies */}
        <h2 style={sH2}>Cookies</h2>
        <p style={sP}>Potatopedia uses a limited number of cookies:</p>
        <ul>
          <li style={sLi}><strong>Google Analytics cookies</strong> (_ga, _ga_*): Used to distinguish unique visitors and track sessions. These are first-party cookies set by Google Analytics. They expire after 2 years (_ga) or upon session end (_ga_*).</li>
          <li style={sLi}><strong>localStorage:</strong> We use browser localStorage (not cookies) to cache AI answers locally on your device for faster loading on repeat visits. This data never leaves your browser and can be cleared through your browser settings.</li>
        </ul>
        <p style={sP}>We do not use advertising cookies, tracking pixels, or fingerprinting technologies. You can block cookies through your browser settings without affecting the core functionality of Potatopedia.</p>

        {/* Data Retention */}
        <h2 style={sH2}>Data Retention</h2>
        <ul>
          <li style={sLi}><strong>Analytics data:</strong> Retained by Google Analytics for 14 months, then automatically deleted</li>
          <li style={sLi}><strong>AI question logs:</strong> Backend API logs may retain questions for up to 30 days for quality monitoring, then are automatically purged</li>
          <li style={sLi}><strong>Contact form data:</strong> Retained as long as necessary to respond to your inquiry, then deleted</li>
          <li style={sLi}><strong>localStorage cache:</strong> Stored on your device until you clear your browser data. Cache entries expire after 24 hours and are automatically refreshed</li>
        </ul>

        {/* Your Rights */}
        <h2 style={sH2}>Your Rights</h2>
        <p style={sP}>Depending on your jurisdiction, you may have the following rights regarding your data:</p>
        <ul>
          <li style={sLi}><strong>Right to Access:</strong> You can request information about what data we hold about you</li>
          <li style={sLi}><strong>Right to Deletion:</strong> You can request that we delete any personal data we hold about you</li>
          <li style={sLi}><strong>Right to Opt Out:</strong> You can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "#C62828" }}>Google Analytics Opt-out Browser Add-on</a></li>
          <li style={sLi}><strong>Right to Rectification:</strong> You can request correction of inaccurate personal data</li>
          <li style={sLi}><strong>Right to Data Portability:</strong> You can request a copy of your data in a machine-readable format</li>
        </ul>
        <p style={sP}>To exercise any of these rights, please contact us at <a href="mailto:privacy@potatopedia.com" style={{ color: "#C62828", fontWeight: 600 }}>privacy@potatopedia.com</a>.</p>

        {/* Children's Privacy */}
        <h2 style={sH2}>Children&apos;s Privacy</h2>
        <p style={sP}>Potatopedia is an educational resource about the global potato industry and is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected information from a child under 13, please contact us at <a href="mailto:privacy@potatopedia.com" style={{ color: "#C62828" }}>privacy@potatopedia.com</a> and we will promptly delete the information.</p>

        {/* Changes */}
        <h2 style={sH2}>Changes to This Policy</h2>
        <p style={sP}>We may update this Privacy Policy from time to time. When we do, we will revise the &ldquo;Last updated&rdquo; date at the top of this page. We encourage you to review this page periodically for any changes. Continued use of the Service after changes are posted constitutes your acceptance of the revised policy.</p>

        {/* Contact */}
        <h2 style={sH2}>Contact Us</h2>
        <p style={sP}>If you have any questions about this Privacy Policy, your data, or your rights, please contact us:</p>
        <div style={{ padding: "20px 24px", borderRadius: 14, border: "1px solid #f0f0f0", background: "#FAFAFA", marginBottom: 16 }}>
          <p style={{ fontSize: 15, color: "#1A1A1A", fontWeight: 600, marginBottom: 8 }}>Potatopedia Privacy Team</p>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>Email: <a href="mailto:privacy@potatopedia.com" style={{ color: "#C62828", fontWeight: 600 }}>privacy@potatopedia.com</a></p>
          <p style={{ fontSize: 14, color: "#666" }}>Website: <a href="https://www.potatopedia.com" style={{ color: "#C62828" }}>potatopedia.com</a></p>
        </div>

        {/* Back link */}
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #f0f0f0" }}>
          <Link href="/" style={{ fontSize: 14, color: "#C62828", fontWeight: 600, textDecoration: "none" }}>&larr; Back to Potatopedia</Link>
        </div>
      </article>
    </div>
  );
}
