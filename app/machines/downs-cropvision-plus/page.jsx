import Link from "next/link";
import LeadForm from "../../../components/LeadForm";

// /machines/downs-cropvision-plus — one machine, in full: the DOWNS CropVision Plus optical sorter for unwashed potatoes.
// Facts only from DOWNS's own pages (downs-fr.com, downs.fr, read 17 Nov 2026) and the Nov 2024 trade press.
// Never PotatoPro. Write like a magazine, not an audit (Devendra 17 Nov 2026): leave out what is not published. No price, no offers in schema.
// The enquiry form stores a machine_quote lead tagged downs-cropvision-plus; it is never passed to DOWNS.
// No quote promise in the wording ("Get 3 quotes" is parked until Devendra makes it live, 7 Nov 2026).

const SITE = "https://www.potatopedia.com";
const URL = `${SITE}/machines/downs-cropvision-plus`;
const UPDATED = "2026-11-17";

const TITLE = "DOWNS CropVision Plus: optical sorter for unwashed potatoes";
const DESC =
  "DOWNS CropVision Plus explained for growers and stores: how its 360° AI cameras sort unwashed potatoes into keep, second grade and waste at up to 100 t/h, versions, specs and rivals.";

export const metadata = {
  title: { absolute: "DOWNS CropVision Plus: Unwashed Potato Sorter Explained | Potatopedia" },
  description: DESC,
  alternates: { canonical: URL },
  openGraph: { type: "article", url: URL, title: TITLE, description: DESC, images: [`${SITE}/machines/downs-cropvision-plus-line.jpg`] },
};

const SPECS = [
  ["Maker", "DOWNS, Sainte-Marie-Cappel, France; part of the DUBRULLE Group since 2006"],
  ["What it does", "Sorts unwashed potatoes by quality before they go into store"],
  ["Vision", "Industrial cameras and a patented AI algorithm; the whole surface of each potato (360°)"],
  ["Throughput", "Up to 100 t/h"],
  ["Outlets", "3 (product to keep, waste, second grade), set by ejector fingers"],
  ["Classes", "9: clods, stones, other waste, good, green, cut, spoiled, misshapen, cracked"],
  ["Line width", "Built into DOWNS receiving hoppers and graders with moving floors up to 2,800 mm"],
  ["Handling", "Short drop between the two conveyors to limit knocks"],
  ["Reports", "Size and quality of the potatoes in each lot"],
  ["Operation", "Touchscreen"],
  ["Plus range: computing", "Processors 8 times more powerful than the first CropVision"],
  ["Plus range: lighting and set-up", "New lighting; AI help when setting up the sorter"],
  ["Plus range: software", "Own operating system for Plus machines; MyCropVision app"],
  ["Crops", "Potatoes and onions; the I-CropVision+ also red beet (onions with or without tops)"],
];

const CLASSES = [
  ["Clods", "soil lumps that ride in with the crop"],
  ["Stones", "they bruise the crop on every later move"],
  ["Other waste", "haulm and trash"],
  ["Good potatoes", "go to the keep outlet and into store"],
  ["Green", "light-exposed tubers"],
  ["Cut", "damaged by the harvester"],
  ["Spoiled", "rotten tubers that would spread rot in store"],
  ["Misshapen", "often a second-grade market"],
  ["Cracked", "growth cracks and splits"],
];

const PLUS = [
  ["360° camera scan with AI", "Yes", "Yes"],
  ["Up to 100 t/h, 3 outlets", "Yes", "Yes"],
  ["Processing power", "First generation", "8 times more"],
  ["Lighting", "First generation", "New system"],
  ["Setting the sorter up", "By the operator", "AI helps with set-up"],
  ["Operating system", "CropVision software", "New, Plus range only"],
  ["Data off the machine", "Lot reports at the machine", "MyCropVision app: one place for the data, live view, custom alerts on any device"],
  ["Crops", "Potatoes", "Potatoes and onions (red beet on I-CropVision+)"],
];

const RIVALS = [
  ["DOWNS CropVision Plus", "France", "Cameras + AI, 360°", "Up to 100 t/h", "3 outlets; built in, standalone or mobile"],
  ["TOMRA 3A", "Norway", "Near-infrared multi-spectral + colour sensors", "Up to 100 t/h", "Finger ejectors; at the farm, at harvest and out of store"],
  ["Haith ProSort", "UK", "Built around a TOMRA 3A", "Up to 100 t/h", "Mobile unit with Grimme; removes foreign material and greens, not a size grader"],
  ["Raytec Ingenuity", "Italy", "Visible colour + near-infrared", "", "Mechanical fingers, 2- or 3-way, for washed and unwashed potatoes"],
];

const FAQ = [
  ["What is the DOWNS CropVision Plus?", "An optical sorter for unwashed potatoes made by DOWNS, a French maker of potato handling lines in the DUBRULLE Group. Cameras and an AI algorithm look at every potato from all sides and send it to keep, second grade or waste before the crop is stored."],
  ["How much can it sort per hour?", "DOWNS gives up to 100 tonnes an hour. Expect less on small tubers or very dirty loads."],
  ["Does it work on dirty potatoes straight from the field?", "Yes, it is built for unwashed potatoes and takes out clods and stones as well as bad tubers."],
  ["What does it sort out?", "Nine classes: clods, stones, other waste, good, green, cut, spoiled (rotten), misshapen and cracked potatoes. The operator decides which outlet each class goes to."],
  ["CropVision or CropVision Plus: what is the difference?", "The sorting idea is the same. The Plus range adds much faster processors, new lighting, AI help with set-up, its own operating system and the MyCropVision app for remote data and alerts."],
  ["Can I add it to a line from another maker?", "Yes, through the I-CropVision+, a standalone module that DOWNS says fits any existing line whatever its maker, age or layout. There is also a mobile CropVision+ unit."],
  ["Will it sort onions or beetroot?", "DOWNS lists the I-CropVision+ for potatoes, onions with or without tops, and red beet."],
  ["What does a CropVision Plus cost?", "The price depends on the version, the width and the line around it. You can ask DOWNS directly, or send us your details below and we reply with what we know. We never pass your details to DOWNS or any other maker."],
  ["Who makes it?", "DOWNS of Sainte-Marie-Cappel, France, founded in 1860 and part of the DUBRULLE Group since 2006. Its UK company is Downs Vision Ltd."],
  ["How does it compare with the TOMRA 3A?", "Both are rated up to 100 t/h for unwashed potatoes. CropVision uses cameras with AI and three outlets; the TOMRA 3A uses near-infrared and colour sensors with finger ejectors."],
];

const LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "@id": `${URL}#product`,
      name: "DOWNS CropVision Plus",
      description: "Optical sorter for unwashed potatoes: industrial cameras and a patented AI algorithm scan 360° of each potato, up to 100 t/h, three outlets (keep, waste, second grade) with ejector fingers.",
      category: "Optical sorter for unwashed potatoes",
      image: `${SITE}/machines/downs-cropvision-plus-line.jpg`,
      url: URL,
      brand: { "@type": "Brand", name: "DOWNS" },
      manufacturer: { "@type": "Organization", name: "DUBRULLE Group", url: `${SITE}/companies/downs-france` },
    },
    {
      "@type": "WebPage",
      "@id": `${URL}#page`,
      url: URL,
      name: TITLE,
      description: DESC,
      dateModified: UPDATED,
      about: { "@id": `${URL}#product` },
      publisher: { "@id": `${SITE}/#publisher` },
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Potatopedia", item: SITE },
        { "@type": "ListItem", position: 2, name: "Machines", item: `${SITE}/machines` },
        { "@type": "ListItem", position: 3, name: "Optical potato sorters", item: `${SITE}/machines/optical-potato-sorter` },
        { "@type": "ListItem", position: 4, name: "DOWNS CropVision Plus", item: URL },
      ],
    },
  ],
};

function Table({ head, rows, cls = "" }) {
  return (
    <div className="cv-tw">
      <table className={`cv-t ${cls}`}>
        <thead>
          <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              {r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i} data-l={head[i]}>{c}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Photo({ src, alt, caption }) {
  return (
    <figure className="cv-fig">
      <img src={src} alt={alt} width={1400} height={787} loading="lazy" decoding="async" />
      <figcaption>{caption} Photo: DOWNS.</figcaption>
    </figure>
  );
}

export default function Page() {
  return (
    <div className="cv">
      <style>{CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />

      <section className="cv-wrap cv-top">
        <p className="cv-crumb">
          <Link href="/machines">Machines</Link> &nbsp;/&nbsp; <Link href="/machines/optical-potato-sorter">Optical potato sorters</Link> &nbsp;/&nbsp; DOWNS CropVision Plus
        </p>
        <p className="cv-k">Machine profile · storage intake</p>
        <h1 className="cv-h1">DOWNS CropVision Plus</h1>
        <p className="cv-sub">The optical sorter for unwashed potatoes, explained for growers, stores and packers</p>
        <div className="cv-answer">
          <p>
            The <strong>DOWNS CropVision Plus</strong> is an optical sorter that cleans up <strong>unwashed potatoes before storage</strong>. Industrial
            cameras and an AI algorithm check every potato <strong>all the way round</strong> and send it to one of <strong>three outlets</strong>: keep,
            second grade or waste. DOWNS (France, DUBRULLE Group) rates it at <strong>up to 100 t/h</strong>.
          </p>
        </div>
      </section>

      <section className="cv-wrap cv-body">
        <Photo
          src="/machines/downs-cropvision-plus-line.jpg"
          alt="DOWNS CropVision optical sorter on a line of unwashed potatoes, camera hood on the left and ejector fingers on the right"
          caption="A CropVision in a DOWNS line: the black hood holds the cameras; the fingers at right push each potato to its outlet."
        />

        <h2 className="cv-h2">Specifications, with where each figure comes from</h2>
        <Table head={["", "DOWNS CropVision Plus"]} rows={SPECS} cls="cv-specs" />

        <h2 className="cv-h2">What does the CropVision sort out?</h2>
        <p className="cv-p">DOWNS names nine classes. Each potato is put in one, and the operator chooses which outlet each class goes to.</p>
        <ol className="cv-ol">
          {CLASSES.map(([a, b]) => (
            <li key={a}><strong>{a}</strong>: {b}</li>
          ))}
        </ol>
        <p className="cv-p">
          The reason to do this before storage, not after: a rotten or cut tuber in a heap or box can start rot in the potatoes around it, and every clod
          and stone you store takes space, gets in the way of the air and bruises the crop again each time it is moved.
        </p>

        <h2 className="cv-h2">What changed from the first CropVision to the Plus?</h2>
        <Table head={["", "First CropVision", "CropVision Plus"]} rows={PLUS} />
        <p className="cv-note">Plus figures: launch reports from Interpom, November 2024 (Spudman, Future Farming, FreshPlaza, Lectura Press, Potato Business). DOWNS’s English product page still describes the first model.</p>

        <h2 className="cv-h2">Three ways to install it</h2>
        <div className="cv-cards">
          <div className="cv-card">
            <p className="cv-k">1 · Built in</p>
            <p className="cv-p">Inside a DOWNS receiving hopper or grader with a moving floor up to 2,800 mm wide. The usual choice when the whole intake line is new.</p>
          </div>
          <div className="cv-card">
            <p className="cv-k">2 · Standalone I-CropVision+</p>
            <p className="cv-p">A self-contained module. DOWNS says it fits any existing line, whatever the maker, year or layout, so a farm with another maker’s hopper can add it.</p>
          </div>
          <div className="cv-card">
            <p className="cv-k">3 · Mobile CropVision+</p>
            <p className="cv-p">The sorter on a mobile unit, for operators who move it between fields, stores or customers.</p>
          </div>
        </div>
        <Photo
          src="/machines/downs-i-cropvision-plus.jpg"
          alt="DOWNS I-CropVision+ standalone optical sorter module set up behind a receiving hopper in a potato store"
          caption="The standalone I-CropVision+ behind a receiving hopper."
        />

        <h2 className="cv-h2">At harvest or at dispatch?</h2>
        <div className="cv-cards">
          <div className="cv-card">
            <p className="cv-k">Into store</p>
            <p className="cv-p">After a destoner, combi or receiving hopper. Clods, stones and rotten or cut tubers come out before the crop is stored, and each lot is recorded as it goes in.</p>
          </div>
          <div className="cv-card">
            <p className="cv-k">Out of store</p>
            <p className="cv-p">In front of a receiving hopper or after a box tipper. A second quality sort to the buyer’s standard, after months in store.</p>
          </div>
        </div>

        <h2 className="cv-h2">The data: lot reports and MyCropVision</h2>
        <p className="cv-p">
          Since every potato is scanned, the sorter knows the size spread and the quality of each lot. On the Plus range the figures go to the MyCropVision
          app, which keeps them in one place, shows the machine working live and sends alerts you set yourself to a phone, tablet or PC. If you need export formats or links to farm software, ask before you buy.
        </p>

        <h2 className="cv-h2">Who is it for?</h2>
        <ul className="cv-ul">
          <li><strong>Growers and stores with big harvest intakes</strong>: at a rated 100 t/h, a 1,000-tonne intake is about 10 running hours at full rate, 20 at half.</li>
          <li><strong>Packers and traders</strong> who re-sort out of store to a buyer’s standard.</li>
          <li><strong>Farms short of pickers</strong>: DOWNS lists labour first among the problems it sets out to solve, with sorting quality, profit, food safety and the environment.</li>
          <li><strong>Lines from other makers</strong>, through the standalone I-CropVision+.</li>
        </ul>
        <p className="cv-p">
          Sorting washed potatoes for retail packs is a different job, usually done by lane or cup graders. Our <Link href="/machines/optical-potato-sorter">guide to choosing an optical potato sorter</Link> covers
          both, and DOWNS’s company profile is at <Link href="/companies/downs-france">DOWNS (DUBRULLE Group)</Link>.
        </p>

        <h2 className="cv-h2">Other sorters built for unwashed potatoes</h2>
        
        <Table head={["Machine", "Maker country", "How it sees", "Throughput", "Notes"]} rows={RIVALS} />
        <p className="cv-note">
          A spec-by-spec comparison is also on our sister site Potato Sorting: <a href="https://potatosorting.com/downs-cropvision-plus">DOWNS CropVision Plus specs and comparable sorters</a>.
        </p>

        <section className="cv-form" id="ask">
          <LeadForm
            type="machine_quote"
            title="Ask about the DOWNS CropVision Plus"
            intro="Tell us your crop, tonnes per hour and the line it would join. We reply with what we know about this machine and the sorters that compare. We never pass your details to DOWNS or any other maker."
            hidden={{ problem: "downs-cropvision-plus", product: "DOWNS CropVision Plus" }}
            extra={[
              { name: "crop", label: "Crop", options: ["Potatoes", "Onions", "Red beet"] },
              { name: "capacity_tph", label: "Tonnes per hour", placeholder: "e.g. 40" },
              { name: "use", label: "Use", options: ["Harvest (into store)", "Dispatch (out of store)", "Both"] },
              { name: "line_maker", label: "Maker of your current line", placeholder: "e.g. DOWNS, Tong, Grimme, none" },
              { name: "timeline", label: "When", options: ["This season", "Next season", "Just researching"] },
            ]}
            messageLabel="Anything else (store size, washed or unwashed, country)"
            submitLabel="Send"
          />
        </section>

        <h2 className="cv-h2">Questions growers ask</h2>
        <div className="cv-faq">
          {FAQ.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>

        <h2 className="cv-h2">Sources</h2>
        <ul className="cv-src">
          <li>DOWNS, “DOWNS CropVision” product page, downs-fr.com (read 17 Nov 2026)</li>
          <li>DOWNS, “I-CropVision+”, “Unité mobile CropVision+” and optical sorter pages, downs.fr (read 17 Nov 2026)</li>
          <li>Spudman, 27 Nov 2024; Future Farming; FreshPlaza; Lectura Press; Potato Business: reports from Interpom 2024</li>
          <li>TOMRA 3A brochure (tomra.com); Haith ProSort page (haith.co.uk); Raytec Ingenuity brochure (raytecvision.com)</li>
        </ul>
        <p className="cv-note">Updated {UPDATED}. Photos: DOWNS.</p>
      </section>
    </div>
  );
}

const CSS = `
.cv { color: var(--ink); }
.cv a { color: var(--gold); }
.cv-wrap { max-width: 980px; margin: 0 auto; padding-left: 32px; padding-right: 32px; box-sizing: border-box; }
.cv-top { padding-top: 48px; }
.cv-body { padding-top: 8px; padding-bottom: 72px; }
.cv-crumb { margin: 0 0 14px; font-size: 13px; color: var(--mute2); }
.cv-crumb a { text-decoration: none; }
.cv-k { margin: 0 0 10px; font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold); display: block; }
.cv-h1 { margin: 0; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(42px, 6.5vw, 80px); line-height: .98; letter-spacing: -.02em; }
.cv-sub { margin: 14px 0 0; font-size: 19px; color: var(--mute); font-weight: 300; }
.cv-answer { margin: 26px 0 0; background: var(--card); border: 1px solid var(--line); border-left: 4px solid #C62828; border-radius: 16px; padding: 22px 24px; }
.cv-answer p { margin: 0; font-size: 18px; line-height: 1.65; color: var(--ink2); }
.cv-h2 { margin: 52px 0 14px; font-family: var(--hp-serif), Georgia, serif; font-weight: 400; font-size: clamp(28px, 4vw, 36px); line-height: 1.1; }
.cv-p { margin: 0 0 12px; font-size: 16.5px; line-height: 1.7; color: var(--ink2); max-width: 74ch; }
.cv-note { margin: 10px 0 0; font-size: 13.5px; color: var(--mute2); line-height: 1.55; }
.cv-ol, .cv-ul { margin: 0 0 14px; padding-left: 22px; font-size: 16.5px; line-height: 1.7; color: var(--ink2); }
.cv-fig { margin: 34px 0 0; }
.cv-fig img { width: 100%; height: auto; display: block; border-radius: 16px; }
.cv-fig figcaption { margin-top: 8px; font-size: 13px; color: var(--mute2); }
.cv-tw { overflow-x: auto; border: 1px solid var(--line); border-radius: 16px; background: var(--card); }
.cv-t { width: 100%; border-collapse: collapse; font-size: 14.5px; }
.cv-t thead th { text-align: left; font-weight: 500; font-size: 11.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--mute2); padding: 12px 14px; border-bottom: 1px solid var(--line); }
.cv-t tbody th { text-align: left; font-weight: 600; color: var(--ink); padding: 12px 14px; border-bottom: 1px solid var(--line); vertical-align: top; }
.cv-t td { padding: 12px 14px; border-bottom: 1px solid var(--line); vertical-align: top; line-height: 1.5; color: var(--ink2); }
.cv-t tr:last-child th, .cv-t tr:last-child td { border-bottom: 0; }
.cv-specs td:last-child { color: var(--mute2); font-size: 13px; }
.cv-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 14px; }
.cv-card { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 20px; }
.cv-card .cv-p { margin: 0; font-size: 15.5px; }
.cv-form { margin: 52px 0 0; background: var(--card); border: 1px solid var(--line); border-radius: 20px; padding: 26px; }
.cv-faq details { border-top: 1px solid var(--line); padding: 14px 0; }
.cv-faq summary { cursor: pointer; font-family: var(--hp-serif), Georgia, serif; font-size: 20px; color: var(--ink); }
.cv-faq p { margin: 10px 0 0; font-size: 16px; line-height: 1.65; color: var(--ink2); }
.cv-src { margin: 0; padding-left: 20px; font-size: 14.5px; line-height: 1.7; color: var(--mute); }
@media (max-width: 700px) {
  .cv-wrap { padding-left: 20px; padding-right: 20px; }
  .cv-tw { overflow: visible; }
  .cv-t thead { display: none; }
  .cv-t tr { display: block; padding: 12px 16px; border-bottom: 1px solid var(--line); }
  .cv-t tr:last-child { border-bottom: 0; }
  .cv-t tbody th, .cv-t td { display: block; padding: 2px 0; border: 0; }
  .cv-t td[data-l]:not([data-l=""])::before { content: attr(data-l) " · "; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--mute2); }
  .cv-form { padding: 20px; }
}
`;
