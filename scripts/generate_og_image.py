#!/usr/bin/env python3
"""Generate public/og-image.png — the 1200x630 OpenGraph social preview.

Requires Pillow. Install with:  pip install Pillow --break-system-packages
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("ERROR: Pillow not installed. Run: pip install Pillow --break-system-packages", file=sys.stderr)
    sys.exit(1)

W, H = 1200, 630
BG = (198, 40, 40)        # #C62828
WHITE = (255, 255, 255)
PADDING = 80
LOGO_SIZE = 140
LOGO_RADIUS = 28

OUT = Path(__file__).resolve().parent.parent / "public" / "og-image.png"

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
                return ImageFont.truetype(name, size), name
            except OSError:
                continue
        for d in FONT_DIRS:
            path = os.path.join(d, name)
            if os.path.isfile(path):
                try:
                    return ImageFont.truetype(path, size), path
                except OSError:
                    continue
    return ImageFont.load_default(), "(PIL default — bitmap, will look small)"


def text_bbox(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox, bbox[2] - bbox[0], bbox[3] - bbox[1]


def rounded_rect_mask(size, radius):
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255
    )
    return mask


def main():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    # --- upper-left logo: white rounded square with red "P" ---
    p_font, p_font_used = find_font(BOLD_CANDIDATES, 108)
    logo = Image.new("RGB", (LOGO_SIZE, LOGO_SIZE), WHITE)
    ldraw = ImageDraw.Draw(logo)
    bbox, pw, ph = text_bbox(ldraw, "P", p_font)
    ldraw.text(
        ((LOGO_SIZE - pw) // 2 - bbox[0], (LOGO_SIZE - ph) // 2 - bbox[1]),
        "P",
        font=p_font,
        fill=BG,
    )
    img.paste(logo, (PADDING, PADDING), rounded_rect_mask((LOGO_SIZE, LOGO_SIZE), LOGO_RADIUS))

    # --- wordmark: "Potatopedia", centered horizontally ---
    wm_font, wm_font_used = find_font(BOLD_CANDIDATES, 120)
    wm_text = "Potatopedia"
    bbox, wm_w, wm_h = text_bbox(draw, wm_text, wm_font)
    wm_x = (W - wm_w) // 2 - bbox[0]
    wm_y = (H // 2) - wm_h
    draw.text((wm_x, wm_y), wm_text, font=wm_font, fill=WHITE)

    # --- tagline below wordmark ---
    tl_font, tl_font_used = find_font(REGULAR_CANDIDATES, 36)
    tl_text = "The World's Potato Intelligence Platform"
    tl_bbox, tl_w, tl_h = text_bbox(draw, tl_text, tl_font)
    tl_x = (W - tl_w) // 2 - tl_bbox[0]
    tl_y = wm_y + wm_h + 40
    draw.text((tl_x, tl_y), tl_text, font=tl_font, fill=WHITE)

    # --- bottom-right URL at 50% opacity ---
    url_font, url_font_used = find_font(REGULAR_CANDIDATES, 24)
    url_text = "potatopedia.com"
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    u_bbox, u_w, u_h = text_bbox(odraw, url_text, url_font)
    u_x = W - PADDING - u_w - u_bbox[0]
    u_y = H - PADDING - u_h - u_bbox[1]
    odraw.text((u_x, u_y), url_text, font=url_font, fill=(255, 255, 255, 128))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, format="PNG", optimize=True)

    size_kb = OUT.stat().st_size / 1024
    print(f"Wrote {OUT}")
    print(f"  dimensions: {W}x{H}")
    print(f"  file size:  {size_kb:.1f} KB")
    print(f"  wordmark font:  {wm_font_used}")
    print(f"  tagline font:   {tl_font_used}")
    if size_kb > 200:
        print(f"WARN: exceeds 200 KB target ({size_kb:.1f} KB)", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
