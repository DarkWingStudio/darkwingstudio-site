// Structural HTML checks: tag balance, duplicate ids, image alt text, JSON-LD validity, and safe external links.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skipDirs = new Set(['node_modules', '.git', '.github', 'assets', 'scripts', 'styles', 'data']);
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

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

function checkTags(html, rel) {
  const errors = [];
  const stripped = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '<script></script>')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '<style></style>');
  const stack = [];
  const re = /<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g;
  let m;
  while ((m = re.exec(stripped))) {
    const closing = m[1] === '/';
    const tag = m[2].toLowerCase();
    const selfClose = m[4] === '/';
    if (voidTags.has(tag) || selfClose) continue;
    if (!closing) {
      stack.push({ tag, index: m.index });
    } else {
      const top = stack[stack.length - 1];
      if (!top) {
        errors.push(`unexpected </${tag}>`);
      } else if (top.tag === tag) {
        stack.pop();
      } else {
        errors.push(`</${tag}> closes <${top.tag}>`);
        const idx = stack.map((x) => x.tag).lastIndexOf(tag);
        if (idx >= 0) stack.length = idx;
      }
    }
  }
  for (const left of stack) errors.push(`unclosed <${left.tag}>`);
  return errors.map((e) => `${rel}: ${e}`);
}

function checkIds(html, rel) {
  const errors = [];
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) errors.push(`${rel}: duplicate id="${id}"`);
    seen.add(id);
  }
  return errors;
}

function checkAlts(html, rel) {
  const errors = [];
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=/.test(m[0])) errors.push(`${rel}: <img> missing alt attribute`);
  }
  return errors;
}

function checkJsonLd(html, rel) {
  const errors = [];
  for (const m of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(m[1]);
    } catch (error) {
      errors.push(`${rel}: invalid JSON-LD (${error.message})`);
    }
  }
  return errors;
}

function checkExternalLinks(html, rel) {
  const errors = [];
  for (const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
    if (!/rel="[^"]*noopener/i.test(m[0]) || !/rel="[^"]*noreferrer/i.test(m[0])) {
      errors.push(`${rel}: target="_blank" link missing noopener noreferrer`);
    }
  }
  return errors;
}

const files = findHtml();
const problems = [];
for (const file of files) {
  const rel = path.relative(root, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf8');
  problems.push(
    ...checkTags(html, rel),
    ...checkIds(html, rel),
    ...checkAlts(html, rel),
    ...checkJsonLd(html, rel),
    ...checkExternalLinks(html, rel)
  );
}

if (problems.length) {
  console.error(`HTML check failed with ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(`HTML check passed (${files.length} files).`);
