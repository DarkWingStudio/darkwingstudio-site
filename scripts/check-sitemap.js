// Verifies that sitemap.xml matches the deployable routes that exist on disk.
import fs from 'node:fs';
import path from 'node:path';
import { discoverIndexFiles, routeFromIndexFile } from './routes.js';

const root = process.cwd();
const baseUrl = 'https://darkwingstudio.netlify.app';

const sitemapFile = path.join(root, 'sitemap.xml');
if (!fs.existsSync(sitemapFile)) {
  console.error('sitemap.xml is missing. Run npm run build.');
  process.exit(1);
}

const xml = fs.readFileSync(sitemapFile, 'utf8');
const problems = [];

const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (!locs.length) problems.push('sitemap.xml contains no <loc> entries.');

const sitemapRoutes = new Set();
for (const loc of locs) {
  if (!loc.startsWith(baseUrl)) {
    problems.push(`Unexpected host in <loc>: ${loc}`);
    continue;
  }
  const route = loc.slice(baseUrl.length) || '/';
  sitemapRoutes.add(route);
  const target = route === '/'
    ? path.join(root, 'index.html')
    : path.join(root, route.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(target)) problems.push(`Sitemap route has no file on disk: ${route}`);
}

const diskRoutes = discoverIndexFiles(root).map(routeFromIndexFile).sort();
for (const route of diskRoutes) {
  if (!sitemapRoutes.has(route)) problems.push(`Route missing from sitemap: ${route}`);
}
for (const route of sitemapRoutes) {
  if (!diskRoutes.includes(route)) problems.push(`Sitemap lists unknown route: ${route}`);
}

for (const m of xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m[1])) problems.push(`Invalid lastmod value: ${m[1]}`);
}

if (problems.length) {
  console.error(`Sitemap check failed with ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(`Sitemap check passed (${locs.length} routes).`);
