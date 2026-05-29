import SupportButton from '../../components/SupportButton';

export const metadata = {
  title: 'Support Potatopedia',
  description: 'Potatopedia is an independent, free potato intelligence platform. Your support covers hosting, AI, and the data work behind every page.',
};

export default function SupportPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#C62828', textTransform: 'uppercase', letterSpacing: 1 }}>
        Support
      </div>
      <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, margin: '8px 0 16px', color: '#1A1A1A' }}>
        Help keep Potatopedia free
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.6, color: '#444', margin: '0 0 28px' }}>
        Potatopedia is an independent project — the world's most detailed open
        potato knowledge base, built one verified data point at a time. It's free
        to use, with no paywall and no ads getting between you and the data. If a
        page here saved you time or answered a question you couldn't find anywhere
        else, a small contribution helps keep it online and growing.
      </p>

      <div style={{
        background: 'rgba(198,40,40,0.03)',
        border: '1px solid rgba(198,40,40,0.12)',
        borderLeft: '4px solid #C62828',
        borderRadius: 12,
        padding: '28px 32px',
        margin: '0 0 36px',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>
          Back Potatopedia
        </h2>
        <p style={{ fontSize: 14, color: '#555', margin: '0 0 18px' }}>
          Choose an amount, or enter your own. Every contribution goes straight
          into keeping the platform running.
        </p>
        <SupportButton />
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 14px', color: '#1A1A1A' }}>
        Where your support goes
      </h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 0 14px' }}>
        Running a knowledge platform like this has real, ongoing costs. Support
        directly funds:
      </p>
      <ul style={{ fontSize: 15, lineHeight: 1.8, color: '#444', paddingLeft: 20, margin: '0 0 28px' }}>
        <li><strong>Hosting and infrastructure</strong> — the servers that keep the site and AI answer engine online around the clock.</li>
        <li><strong>AI and data processing</strong> — the language and embedding models that power the question-answering on every page.</li>
        <li><strong>Data sourcing and verification</strong> — the time-consuming work of pulling figures from FAOSTAT, government agencies, and peer-reviewed research, then checking them before they go live.</li>
      </ul>

      <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 14px', color: '#1A1A1A' }}>
        Other ways to help
      </h2>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444', margin: '0 0 28px' }}>
        Not everyone can contribute financially, and that's completely fine. Sharing
        a Potatopedia page with someone who'd find it useful, citing it in your own
        work, or sending corrections and feedback all help just as much.
      </p>

      <div style={{ borderTop: '1px solid #eee', paddingTop: 20, fontSize: 13, color: '#888', lineHeight: 1.7 }}>
        Potatopedia is operated by INDPOTATO PRIVATE LIMITED, India. Contributions
        are voluntary support for an independent platform and are not tax-deductible
        donations. Payments are processed securely by Razorpay; international cards
        are charged in USD and settled in INR. Questions? Reach us via our{' '}
        <a href="/contact" style={{ color: '#C62828', textDecoration: 'none' }}>contact page</a>.
      </div>
    </main>
  );
}
