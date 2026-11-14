import Link from "next/link";

// Premium footer (7 Nov 2026): dark in both themes, serif wordmark, sources line, every legal link.
export default function Footer() {
  return (
    <footer className="pf">
      <div className="pf-in">
        <div className="pf-top">
          <div>
            <Link href="/" className="pf-logo">Potatopedia</Link>
            <p className="pf-about">The neutral reference on potatoes. Free, sourced, no paywall.</p>
            <p className="pf-about">Sources: FAOSTAT · USDA · CIP · UN Comtrade · CPRI · Europatat · peer-reviewed journals</p>
          </div>
          <nav className="pf-col" aria-label="Platform">
            <p className="pf-k">Platform</p>
            <Link href="/ask">Ask Potatopedia</Link>
            <Link href="/varieties">Varieties</Link>
            <Link href="/countries">Countries</Link>
            <Link href="/knowledge">Knowledge</Link>
            <Link href="/answers">Answers</Link>
            <Link href="/market">Market</Link>
            <Link href="/machines">Machines</Link>
            <Link href="/companies">Companies</Link>
            <Link href="/reports">Market reports</Link>
            <Link href="/prices">Prices</Link>
            <Link href="/diseases">Diseases</Link>
            <Link href="/events">Events</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/news">Potato news</Link>
            <Link href="/newsletters">Newsletters</Link>
            <Link href="/magazines">Magazines</Link>
            <Link href="/seed-field">Seed potatoes</Link>
          </nav>
          <nav className="pf-col" aria-label="Company">
            <p className="pf-k">Company</p>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/for-companies">For companies</Link>
            <Link href="/for-companies#correct">Submit or correct data</Link>
            <Link href="/advertise">Advertise</Link>
            <Link href="/contribute">Write for us</Link>
            <Link href="/editorial-standards">Editorial standards</Link>
            <a href="https://www.linkedin.com/company/potatopedia" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:hello@potatopedia.com">hello@potatopedia.com</a>
          </nav>
          <nav className="pf-col" aria-label="Legal">
            <p className="pf-k">Legal</p>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms &amp; conditions</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/refund-policy">Refund policy</Link>
            <Link href="/shipping-policy">Shipping policy</Link>
          </nav>
        </div>
        <div className="pf-bot">
          <span>&copy; 2024&ndash;2026 Potatopedia</span>
          <span>Placements are always labelled. Paid content never changes a fact.</span>
        </div>
      </div>
    </footer>
  );
}
