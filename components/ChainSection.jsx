"use client";

import { useState } from "react";

// "Where in the chain are you?" Six stages; each has three tabs: ask (questions go to the hero answer engine),
// find suppliers (directory categories), how to choose (buying questions for that stage's machine, answered by the
// hero engine). "Get 3 quotes" is parked until supplier quotes go live (Devendra, 7 Nov 2026).
const STAGES = [
  { name: "Seed", questions: ["What is seed potato certification?", "How do I choose a seed potato variety for my region?", "What is true potato seed?"], suppliers: ["Seed breeders", "Certified seed houses", "Tissue-culture labs"], machine: "Seed cutter", machineName: "seed potato cutter" },
  { name: "Field", questions: ["How much fertilizer do potatoes need?", "How do I control late blight in potatoes?", "How much water does a potato crop need?"], suppliers: ["Planters", "Irrigation", "Crop protection"], machine: "Planter", machineName: "potato planter" },
  { name: "Harvest", questions: ["When should potato haulms be killed before harvest?", "How do I reduce bruising at potato harvest?", "Which potato harvester suits stony soil?"], suppliers: ["Harvesters", "Haulm toppers", "Field graders"], machine: "Harvester", machineName: "potato harvester" },
  { name: "Storage", questions: ["What temperature suits processing potatoes in storage?", "How long can potatoes stay in cold storage?", "How do I stop potatoes sprouting in store?"], suppliers: ["Cold storage", "Ventilation", "Sprout control"], machine: "Cold storage / ventilation", machineName: "potato cold store and ventilation system" },
  { name: "Processing", questions: ["Which potato variety is best for French fries?", "What dry matter do potato chips need?", "How do optical sorters find defects in potatoes?"], suppliers: ["Optical sorters", "Fry and chip lines", "Washers and peelers"], machine: "Optical / AI sorter", machineName: "optical potato sorter" },
  { name: "Market", questions: ["Which countries import the most potatoes?", "Who are the biggest buyers of frozen fries?", "Why did potato prices rise in 2024?"], suppliers: ["Traders and exporters", "Packing and weighing", "Logistics"], machine: "Packing / weighing", machineName: "potato packing and weighing line" },
];
const an = (w) => (/^[aeiou]/i.test(w) ? `an ${w}` : `a ${w}`);
const MACHINES = ["Optical / AI sorter", "Size grader", "Washer / peeler", "Fry, chip or flake line", "Seed cutter", "Planter", "Harvester", "Haulm topper", "Cold storage / ventilation", "Irrigation", "Packing / weighing", "Other"];

export default function ChainSection() {
  const [stage, setStage] = useState(3);
  const [tab, setTab] = useState(0);
  const s = STAGES[stage];
  const ask = (q) => window.dispatchEvent(new CustomEvent("pp-ask", { detail: q }));

  return (
    <div className="ch">
      <div className="ch-stages" role="tablist" aria-label="Stages of the potato chain">
        {STAGES.map((x, i) => (
          <button key={x.name} type="button" role="tab" aria-selected={i === stage} className={`ch-stage${i === stage ? " is-on" : ""}`} onClick={() => setStage(i)}>
            <span className="ch-num">0{i + 1}</span>
            {x.name}
          </button>
        ))}
      </div>

      <div className="ch-belt" aria-hidden="true">
        <span className="ch-line" />
        {[["#D2A660", 30, 0], ["#A9483F", 26, -4], ["#E4C483", 32, -8], ["#5E4680", 27, -12]].map(([c, w, d], i) => (
          <svg key={i} className="ch-tuber" style={{ animationDelay: `${d}s` }} width={w} height="22" viewBox="0 0 40 30"><path d="M4 16 C2 7 12 2 22 3 C33 4 39 10 37 18 C35 26 24 29 14 27 C7 26 5 22 4 16 Z" fill={c} /></svg>
        ))}
      </div>

      <div className="ch-panel">
        <div className="ch-tabs" role="tablist">
          {[`Ask about ${s.name.toLowerCase()}`, "Find suppliers", "How to choose"].map((label, i) => (
            <button key={label} type="button" role="tab" aria-selected={i === tab} className={`ch-tab${i === tab ? " is-on" : ""}`} onClick={() => setTab(i)}>{label}</button>
          ))}
        </div>
        <div className="ch-body">
          {tab === 0 && (
            <div className="ch-cols">
              <div style={{ flex: 1.5 }}>
                {s.questions.map((q) => (
                  <button key={q} type="button" className="ch-q hp-row" onClick={() => ask(q)}>
                    <span>{q}</span>
                    <span className="hp-arrow ch-arr">→</span>
                  </button>
                ))}
              </div>
              <a href="#companies" className="ch-feat">
                <span className="ch-k">FEATURED MAKER · AVAILABLE</span>
                <span className="ch-feat-t">Your company, at the {s.name.toLowerCase()} stage</span>
                <span className="ch-small">One labelled slot per stage, up to three makers. The neutral answer always comes first.</span>
              </a>
            </div>
          )}
          {tab === 1 && (
            <div>
              <div className="ch-grid">
                {s.suppliers.map((c) => (
                  <div key={c} className="ch-sup">
                    <span className="ch-sup-t">{c}</span>
                    <span className="ch-small">Directory opening soon</span>
                  </div>
                ))}
              </div>
              <a href="#companies" className="ch-link">List your company, free <span className="hp-arrow">→</span></a>
            </div>
          )}
          {tab === 2 && (
            <div className="ch-cols">
              <div style={{ flex: 1.5 }}>
                {[
                  `How do I choose ${an(s.machineName)}?`,
                  `Which specifications matter most in ${an(s.machineName)}?`,
                  `What maintenance does ${an(s.machineName)} need?`,
                ].map((q) => (
                  <button key={q} type="button" className="ch-q hp-row" onClick={() => ask(q)}>
                    <span>{q}</span>
                    <span className="hp-arrow ch-arr">→</span>
                  </button>
                ))}
              </div>
              <a href="/advertise" className="ch-feat">
                <span className="ch-k">FOR MAKERS</span>
                <span className="ch-feat-t">Make {s.machineName}s?</span>
                <span className="ch-small">Be the featured maker at the {s.name.toLowerCase()} stage, clearly labelled. Supplier quote requests open later.</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
