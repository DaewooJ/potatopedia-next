You turn one Potatopedia company data file into a short, neutral directory profile.

The data file is below, between <file> and </file>. It was compiled from the company's own official website. Use ONLY facts written in that file. Never add knowledge of your own, never guess, never round or convert numbers.

Company row: name "{{NAME}}", type "{{KIND}}", country "{{COUNTRY}}", official domain "{{DOMAIN}}".

Return ONE JSON object and nothing else (no prose, no code fence), with these keys. Leave a key out (or use an empty array) when the file does not give it.

- "common_name": the short name people use for the company, as written on its website, without legal forms (B.V., U.A., GmbH, Ltd, Coöperatie, Royal) and without "(formerly …)". Examples: "Agrico", "HZPC", "Farm Frites", "Ellips", "Lamb Weston / Meijer".
- "summary": 2 or 3 plain, neutral sentences (the first sentence starts with the common name, e.g. "Agrico is a …"), at most 60 words in all: what the company is and does with potatoes, where it is based, and when it was founded or who owns it, plus at most one figure exactly as the file states it. No praise or marketing words at all (never "leading", "world-class", "market leader", "best", "innovative", "premier", "unique", "renowned", "state-of-the-art", "high-quality", "top"). Do not repeat the company's own claims about itself. Write it in your own plain words, in British English.
- "hq": {"city": town only, "country": country}.
- "founded": short string, e.g. "1971" or "1973 (forerunners PZVB, DTV and Zuiderzeepolders)".
- "ownership": one short phrase, e.g. "Family-owned" or "Cooperative owned by more than 1,200 growers".
- "products": up to 8 short items (max 90 characters each). Processors: product ranges. Seed companies: what they supply (seed potatoes, minitubers, varieties, services). Machinery makers: leave out (use "machines").
- "machines": machinery makers only: up to 10 items, each "Machine name: what it does in a few words" (max 110 characters), potato machines only.
- "varieties": seed companies only: up to 30 potato variety names exactly as written (names only, no breeding numbers, no traits, no brackets).
- "brands": brand names the file states (not range descriptions), up to 8.
- "plants": up to 10 sites, factories, research stations or offices that the file names: [{"town": "...", "country": "...", "capacity_as_stated": "... only if the file states a capacity, copied as stated"}].
- "markets": up to 6 short items on where they sell, as stated.
- "certifications": names only, e.g. "BRCGS", "IFS Food", "GlobalG.A.P.", "ISO 9001".
- "facts": up to 5 short facts with figures exactly as stated (employees, turnover, volumes, years), max 120 characters each. No claims of being first, biggest or best.
- "contact": the head office only, each value copied CHARACTER FOR CHARACTER from the file's CONTACT section: {"website": the company's own website URL, "public_email": one general email, "phone": one phone number, "address": one postal address on one line}. Do not reformat phone numbers or addresses.
- "limitations": 1 to 3 short sentences saying what the website does not publish (e.g. "Capacity, volumes and employee numbers are not published on the pages read.").

Do not mention any third-party website or publication. Plain ASCII punctuation is fine; keep accents in names.

<file>
{{TEXT}}
</file>
