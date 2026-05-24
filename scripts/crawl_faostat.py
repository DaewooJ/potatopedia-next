#!/usr/bin/env python3
"""
FAOSTAT data collection starter script.
Takes a screenshot of the QCL (Crops and livestock products) page.
Customize the actual data extraction logic as needed.
"""

import asyncio
import os
from playwright.async_api import async_playwright

FAOSTAT_URL = "https://www.fao.org/faostat/en/#data/QCL"
SCREENSHOT_DIR = "scripts/screenshots"
SCREENSHOT_PATH = os.path.join(SCREENSHOT_DIR, "faostat.png")


async def main():
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)

    print(f"Launching browser...")
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1440, "height": 900},
        )
        page = await context.new_page()

        print(f"Navigating to {FAOSTAT_URL}")
        try:
            await page.goto(FAOSTAT_URL, wait_until="domcontentloaded", timeout=30000)
        except Exception as e:
            print(f"Navigation warning: {e}")

        # Wait for page to render
        print("Waiting for page to render (10 seconds)...")
        await page.wait_for_timeout(10000)

        # Take screenshot
        await page.screenshot(path=SCREENSHOT_PATH, full_page=True)
        print(f"Screenshot saved to {SCREENSHOT_PATH}")

        # Print page title
        title = await page.title()
        print(f"Page title: {title}")

        # TODO: Add data extraction logic here
        # Example selectors to explore:
        #   - Country dropdown
        #   - Item dropdown (select "Potatoes")
        #   - Year range
        #   - Download button
        #
        # Steps for future implementation:
        # 1. Select "Potatoes" from the Items dropdown
        # 2. Select countries of interest
        # 3. Set year range (e.g., 2010-2023)
        # 4. Select elements: Area harvested, Yield, Production
        # 5. Click download / extract table data
        # 6. Parse and save to JSON

        await context.close()
        await browser.close()

    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
