/* Generate favicon + PWA icon set from the brand logo.
   Run from repo root:  node scripts/generate-icons.js
   Writes square icons into assets/. Non-square logo is centered with padding. */

const sharp = require('sharp');
const fs = require('fs');

const BLACK = { r: 6, g: 9, b: 8, alpha: 1 };          // brand --black #060908
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

async function pickSource() {
  const candidates = ['assets/logo-original-backup.png', 'assets/logo.png'];
  let best = null, bestW = -1;
  for (const f of candidates) {
    if (fs.existsSync(f)) {
      const m = await sharp(f).metadata();
      if ((m.width || 0) > bestW) { bestW = m.width; best = f; }
    }
  }
  return best;
}

(async () => {
  const src = await pickSource();
  if (!src) { console.error('No source logo found'); process.exit(1); }
  console.log('source:', src);

  // [outfile, size, background, paddingFraction(each side)]
  const jobs = [
    ['assets/favicon-16.png',       16,  CLEAR, 0.00],
    ['assets/favicon-32.png',       32,  CLEAR, 0.00],
    ['assets/apple-touch-icon.png', 180, BLACK, 0.12], // iOS renders opaque
    ['assets/icon-192.png',         192, BLACK, 0.16], // maskable safe zone
    ['assets/icon-512.png',         512, BLACK, 0.16],
  ];

  for (const [out, size, bg, pad] of jobs) {
    const inner = Math.max(1, Math.round(size * (1 - pad * 2)));
    const logo = await sharp(src)
      .resize(inner, inner, { fit: 'contain', background: CLEAR })
      .toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
      .composite([{ input: logo, gravity: 'center' }])
      .png()
      .toFile(out);
    console.log('wrote', out, `${size}x${size}`);
  }
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
