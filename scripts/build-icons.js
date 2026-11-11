import fs from 'node:fs/promises';
import sharp from 'sharp';

const source = 'assets/ProfilePIC.webp';
const outDir = 'assets/icons';
const background = '#f2f0e9';

await fs.mkdir(outDir, { recursive: true });

const jobs = [
  ['favicon-16.png', 16],
  ['favicon-32.png', 32],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon-180.png', 180]
];

for (const [name, size] of jobs) {
  await sharp(source).resize(size, size, { fit: 'cover' }).png().toFile(`${outDir}/${name}`);
  console.log(`wrote ${outDir}/${name}`);
}

// Maskable icon: keep the artwork inside the 80% safe zone.
const inner = 410;
const pad = Math.round((512 - inner) / 2);
await sharp(source)
  .resize(inner, inner, { fit: 'cover' })
  .extend({ top: pad, bottom: 512 - inner - pad, left: pad, right: 512 - inner - pad, background })
  .png()
  .toFile(`${outDir}/icon-maskable-512.png`);
console.log(`wrote ${outDir}/icon-maskable-512.png`);
