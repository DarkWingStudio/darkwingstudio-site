import fs from 'node:fs/promises';
import sharp from 'sharp';

const source = 'assets/ProfilePIC.webp';
const outDir = 'assets/profile';

await fs.mkdir(outDir, { recursive: true });

for (const size of [128, 256, 512]) {
  await sharp(source).resize(size, size, { fit: 'cover' }).webp({ quality: 84 }).toFile(`${outDir}/profile-${size}.webp`);
  console.log(`wrote ${outDir}/profile-${size}.webp`);
}
