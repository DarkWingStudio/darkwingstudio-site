// Verifies that every local href/src target resolves to a file that exists.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skipDirs = new Set(['node_modules', '.git', '.github', 'assets', 'scripts', 'styles', 'data']);

function findHtml(dir = root) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (dir === root && skipDirs.has(entry.name)) continue;
      out.push(...findHtml(full));
    } else if (entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function resolveTarget(fromFile, raw) {
  if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return null;
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith('data:')) return null;
  const clean = raw.split('#')[0].split('?')[0];
  if (!clean) return null;

  if (clean.startsWith('/')) {
    return path.join(root, clean);
  }
  return path.resolve(path.dirname(fromFile), clean);
}

function exists(target) {
  if (fs.existsSync(target)) {
    return fs.statSync(target).isDirectory()
      ? fs.existsSync(path.join(target, 'index.html'))
      : true;
  }
  return false;
}

const files = findHtml();
const broken = [];
for (const file of files) {
  const rel = path.relative(root, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');

  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/gi)) {
    const target = resolveTarget(file, m[1]);
    if (target && !exists(target)) broken.push(`${rel}: ${m[1]}`);
  }

  for (const m of html.matchAll(/\ssrcset="([^"]+)"/gi)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      const target = resolveTarget(file, url);
      if (target && !exists(target)) broken.push(`${rel} (srcset): ${url}`);
    }
  }
}

if (broken.length) {
  console.error(`Broken local links (${broken.length}):`);
  for (const b of broken) console.error(`  - ${b}`);
  process.exit(1);
}

console.log(`Link check passed (${files.length} files).`);
