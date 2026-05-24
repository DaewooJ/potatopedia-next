This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## IndexNow auto-submission

Potatopedia pings the [IndexNow](https://www.indexnow.org/) API on every production deploy so Bing and other participating search engines pick up new and updated pages within minutes instead of waiting for the next crawl.

- `npm run deploy:prod` — runs `next build`, deploys to Vercel, then submits every URL in `sitemap.xml` to IndexNow. Use this for any change you want indexed.
- `vercel --prod` — still works for silent deploys that should not trigger an IndexNow ping (e.g. testing unfinished content you don't want crawled yet).

**Ownership verification.** The submitter points IndexNow at `public/ddfadf3f59ea492aa8e581295b2c747a.txt`, which is the Bing-issued key file served at `https://www.potatopedia.com/ddfadf3f59ea492aa8e581295b2c747a.txt`. Do not rename or delete that file.

**Verify in Bing.** Bing Webmaster Tools → *Reports & Data* → *IndexNow* shows the last submission batches, URL counts, and any rejected URLs. New submissions usually appear within ~5 minutes.

