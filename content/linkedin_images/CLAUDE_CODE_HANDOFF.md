# Handoff → Claude Code: set LinkedIn post images in Notion

**Goal:** For each of the 15 Draft rows in the Notion DB **"Potatopedia — LinkedIn Posts"**
(`data_source 8b0aaa2c-943d-4ba1-8c58-d389e9837d84`), set the **Image** file property to the
matching PNG and overwrite **Alt text** with the corrected alt string. **Do NOT change Status** —
the Draft → Approved human gate stays intact. Skip the "IMAGE TEST — delete after publishing" row.

## Inputs (both downloaded from chat, place them together in one folder)
- The 15 PNGs: `01_asia-half.png` … `15_andean-origins.png` (1200×1200).
- `linkedin_image_mapping.json` — page IDs, filenames, and alt text for all 15.

Suggested location: `~/projects/potatopedia-next/content/linkedin_images/`
(add that folder to the Mac cleanup-tool ignore list too).

## Task
For each object in `linkedin_image_mapping.json → posts`:
1. Open the Notion page at `notion_page_id`.
2. Upload `image_file` and set it as the page's **Image** property (file/attachment upload flow —
   the Image property is `type: file`, a JSON array of file IDs).
3. Set **Alt text** = `alt_text`.
4. Leave **Status = Draft**, and leave Post text / Source links / Scheduled for untouched.

Verify after: each of the 15 rows shows one image and updated alt text; the IMAGE TEST row is unchanged.

## Provenance notes (source discipline)
- All photos are pulled from Supabase bucket `images` (project `gnscilozpfrmdtfkibie`) and were
  **OCR-screened (English + Chinese, full image + corners) for zero baked-in text/watermarks.**
- **Rejected and NOT used:** any `indianpotato.com`-watermarked shots (Nakuru-Tubers, Gurez-Valley,
  Lahaul-Spiti), the `china.org.cn`-watermarked `China-Potatoes-1/2/3` set, the OHH-Potato booth
  photo (`1777132065669`), and the "Bulk Frozen Fries" ad graphic.
- **Data element per image adapts to the row's verified figures** — chart only where ≥3 ranked
  points exist (Belarus per-capita). No invented numbers: the global-market and processing posts are
  figure-free key-fact cards (the `$80B` processing figure was omitted per its "confirm before
  emphasizing" note).
- One flag: the **Harvester** photo (posts 3 & 9) passed on a visual check but threw a single
  low-confidence phantom OCR token in a corner — treat as clean unless a human says otherwise.
