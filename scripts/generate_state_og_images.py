#!/usr/bin/env python3
"""Generate per-state Open Graph images for India state profile pages.

Concept B (brand-bold): two-panel 1200x630 layout.
- Left panel (420px wide): solid red #C62828 with Potatopedia wordmark + tagline
- Right panel (white): eyebrow + state name + hero stat (red) + caption + source

Outputs: public/og/india-{slug}.png x 14

Requires Pillow. Install: pip install Pillow --break-system-packages
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("ERROR: Pillow not installed. Run: pip install Pillow --break-system-packages",
          file=sys.stderr)
    sys.exit(1)

# Canvas
W, H = 1200, 630
LEFT_W = 420
PADDING_L = 48
PADDING_R = 56

# Brand colors (matches scripts/generate_og_image.py + site CSS)
RED = (198, 40, 40)            # #C62828
RED_LIGHT = (243, 201, 201)    # #F3C9C9 — tagline on red panel
WHITE = (255, 255, 255)
DARK = (26, 26, 26)            # #1A1A1A — state name
GRAY_CAPTION = (136, 136, 136) # #888 — caption
GRAY_SOURCE = (153, 153, 153)  # #999 — source line

# Font search (same chain as scripts/generate_og_image.py)
FONT_DIRS = [
    "/System/Library/Fonts",
    "/System/Library/Fonts/Supplemental",
    "/Library/Fonts",
    os.path.expanduser("~/Library/Fonts"),
]
BOLD_CANDIDATES = [
    "Poppins-Bold.ttf",
    "Poppins-ExtraBold.ttf",
    "Arial Bold.ttf",
    "Helvetica.ttc",
]
REGULAR_CANDIDATES = [
    "Poppins-Regular.ttf",
    "Poppins-Medium.ttf",
    "Arial.ttf",
    "Helvetica.ttc",
]


def find_font(candidates, size):
    for name in candidates:
        if os.path.isabs(name) and os.path.isfile(name):
            try:
                return ImageFont.truetype(name, size)
            except OSError:
                continue
        for d in FONT_DIRS:
            path = os.path.join(d, name)
            if os.path.isfile(path):
                try:
                    return ImageFont.truetype(path, size)
                except OSError:
                    continue
    return ImageFont.load_default()


def tw(draw, text, font):
    b = draw.textbbox((0, 0), text, font=font)
    return b[2] - b[0]


def th(draw, text, font):
    b = draw.textbbox((0, 0), text, font=font)
    return b[3] - b[1]


def fit_font(draw, text, candidates, target_size, max_width, min_size=32):
    """Largest font size from candidates where text fits within max_width."""
    size = target_size
    while size >= min_size:
        f = find_font(candidates, size)
        if tw(draw, text, f) <= max_width:
            return f
        size -= 4
    return find_font(candidates, min_size)


def wrap_caption(draw, text, font, max_width):
    """Return list of lines (1 or 2) that fit within max_width."""
    if tw(draw, text, font) <= max_width:
        return [text]
    words = text.split(" ")
    line1 = ""
    line2 = ""
    in_line2 = False
    for w in words:
        if not in_line2:
            test = (line1 + " " + w).strip()
            if tw(draw, test, font) <= max_width:
                line1 = test
            else:
                in_line2 = True
                line2 = w
        else:
            line2 = (line2 + " " + w).strip()
    return [line1, line2]


# 14 states — hero stat + caption pairs APPROVED in Step 1
# Source: INDIA_STATES (lib/data.js) + each state's deep-dive page values
# - AP hero is "-79% area" (self-explanatory glance, per Step 1 adjustment)
# - Manipur / Arunachal / Nagaland: honest production volume, no methodology-jump trend
# - UP/WB/Bihar/Gujarat: numbers match each state page's own headline
STATES = [
    {"slug": "uttar-pradesh", "name": "Uttar Pradesh", "hero": "20.13M tonnes",
     "caption": "India's #1 potato state · 33.46% of national output"},
    {"slug": "west-bengal", "name": "West Bengal", "hero": "12M+ tonnes",
     "caption": "India's #2 producer · Hooghly delivers ~40% of state output"},
    {"slug": "bihar", "name": "Bihar", "hero": "9.075M tonnes",
     "caption": "India's #3 producer · Nalanda triangle anchors output"},
    {"slug": "gujarat", "name": "Gujarat", "hero": "4.86M tonnes",
     "caption": "#1 in processing · Sabarkantha 34.13 t/ha (India's top yield)"},
    {"slug": "madhya-pradesh", "name": "Madhya Pradesh", "hero": "3.949M tonnes",
     "caption": "#5 producer · Indore leads at 1.186M t (30% of state)"},
    {"slug": "maharashtra", "name": "Maharashtra", "hero": "26.77 t/ha",
     "caption": "Yield up 35% amid −37% area consolidation"},
    {"slug": "andhra-pradesh", "name": "Andhra Pradesh", "hero": "−79% area",
     "caption": "Potato area down 79% over 4 years · DA&FW HSAG 2024"},
    {"slug": "assam", "name": "Assam", "hero": "911K tonnes",
     "caption": "Northeast's largest producer · ~70% of NE region share"},
    {"slug": "jharkhand", "name": "Jharkhand", "hero": "767K tonnes",
     "caption": "Chotanagpur plateau · Ranchi leads, 10 districts on DA&FW table"},
    {"slug": "tripura", "name": "Tripura", "hero": "146K tonnes",
     "caption": "3rd-largest Northeast producer · 19.16 t/ha (highest NE yield)"},
    {"slug": "meghalaya", "name": "Meghalaya", "hero": "196K tonnes",
     "caption": "2nd-largest Northeast producer · Hosts ICAR-RCNEH HQ at Umiam"},
    {"slug": "nagaland", "name": "Nagaland", "hero": "55K tonnes",
     "caption": "Stable smallholder Northeast cultivation"},
    {"slug": "manipur", "name": "Manipur", "hero": "15K tonnes",
     "caption": "Small Imphal valley producer"},
    {"slug": "arunachal-pradesh", "name": "Arunachal Pradesh", "hero": "6K tonnes",
     "caption": "Eastern Himalayan smallholder cultivation"},
]


def render(state, out_dir):
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    # Left red panel
    draw.rectangle([0, 0, LEFT_W, H], fill=RED)

    # Wordmark — large bold white, centered in left panel
    word_font = find_font(BOLD_CANDIDATES, 56)
    word_text = "Potatopedia"
    ww = tw(draw, word_text, word_font)
    wh = th(draw, word_text, word_font)

    # Tagline — small bold uppercase, light red on red
    tag_font = find_font(BOLD_CANDIDATES, 14)
    tag_text = "POTATO INTELLIGENCE"
    tw_w = tw(draw, tag_text, tag_font)

    # Vertically center the group
    group_h = wh + 22 + th(draw, tag_text, tag_font)
    group_y = (H - group_h) // 2
    draw.text(((LEFT_W - ww) // 2, group_y), word_text, font=word_font, fill=WHITE)
    draw.text(((LEFT_W - tw_w) // 2, group_y + wh + 22), tag_text, font=tag_font, fill=RED_LIGHT)

    # Right panel layout
    right_x = LEFT_W + PADDING_L
    right_max_w = W - LEFT_W - PADDING_L - PADDING_R

    # Eyebrow — small red bold uppercase
    eyebrow_font = find_font(BOLD_CANDIDATES, 18)
    eyebrow_text = "INDIA STATE PROFILE"
    eyebrow_y = 90
    draw.text((right_x, eyebrow_y), eyebrow_text, font=eyebrow_font, fill=RED)

    # State name — bold dark, auto-fit
    state_font = fit_font(draw, state["name"], BOLD_CANDIDATES, 60, right_max_w, min_size=44)
    state_y = eyebrow_y + 48
    draw.text((right_x, state_y), state["name"], font=state_font, fill=DARK)
    state_h = th(draw, state["name"], state_font)

    # Hero stat — bold red, auto-fit
    hero_font = fit_font(draw, state["hero"], BOLD_CANDIDATES, 88, right_max_w, min_size=52)
    hero_y = state_y + state_h + 56
    draw.text((right_x, hero_y), state["hero"], font=hero_font, fill=RED)
    hero_h = th(draw, state["hero"], hero_font)

    # Caption — gray regular, wrap to max 2 lines
    cap_font = find_font(REGULAR_CANDIDATES, 22)
    cap_lines = wrap_caption(draw, state["caption"], cap_font, right_max_w)
    cap_y = hero_y + hero_h + 32
    for i, line in enumerate(cap_lines):
        draw.text((right_x, cap_y + i * 32), line, font=cap_font, fill=GRAY_CAPTION)

    # Source line at bottom-right area
    src_font = find_font(REGULAR_CANDIDATES, 15)
    src_text = "Source: DA&FW Horticultural Statistics at a Glance 2024 · ICAR-CPRI"
    src_y = H - 48
    draw.text((right_x, src_y), src_text, font=src_font, fill=GRAY_SOURCE)

    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"india-{state['slug']}.png"
    img.save(out_path, "PNG", optimize=True)
    return out_path


def main():
    root = Path(__file__).resolve().parent.parent
    out_dir = root / "public" / "og"
    print(f"Rendering {len(STATES)} state OG images to {out_dir} ...")
    results = []
    for state in STATES:
        path = render(state, out_dir)
        size_kb = path.stat().st_size / 1024
        print(f"  ✓ {path.name:42s}  {size_kb:6.1f} KB  ({state['name']} · {state['hero']})")
        results.append(path)
    print(f"\nDone — {len(results)} files generated at {out_dir}")


if __name__ == "__main__":
    main()
