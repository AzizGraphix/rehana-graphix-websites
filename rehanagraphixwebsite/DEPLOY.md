# Rehana Graphix — Deploy to Vercel

This is a plain static site (HTML/CSS/JS, no build step). To deploy:

1. Go to https://vercel.com/new
2. Choose **"Deploy without Git"** / drag-and-drop, and upload this whole folder
   (or push it to a GitHub repo first, then "Import Project" from there)
3. Framework preset: **Other** (Vercel auto-detects static HTML — no build command needed)
4. Click **Deploy**

Pages:
- `index.html` — Home
- `work.html` — Work / Portfolio
- `services.html` — Services
- `about.html` — About
- `book.html` — Book a Project

`vercel.json` enables clean URLs, so once live you can also link to `/work`,
`/services`, `/about`, `/book` instead of the `.html` versions.

## Things to double-check before sharing the live link

- **Book page → Submit button**: wired to Web3Forms with your access key
  (`js/book.js`). Do a real test submission once live to confirm the email
  reaches you.
- **Book page → WhatsApp button**: opens `wa.me/923442274536` with a
  pre-filled message — confirm that's the right number.
- **Work page → Behance cards**: link to `https://www.behance.net/rehanagul`
  — update in `work.html` if that's not the final URL.
- **Videos**: `assets/video/portfolio-reel.mp4` is currently used for all 3
  video slots on the Work page and the Home page teaser — swap in your final
  videos when ready (same filename, or update the `src=` paths in
  `work.html` / `index.html`).
