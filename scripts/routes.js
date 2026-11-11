// Discovers deployable index.html routes.
// Git-aware: ignores files excluded by .gitignore so unpublished local drafts
// (for example arcade/ or minecraft/) never leak into sitemap.xml.
// Falls back to a filesystem walk outside a git checkout.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const skipDirs = new Set(['node_modules', '.git', '.github', 'assets', 'scripts', 'styles', 'data']);

function walkIndexFiles(root) {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (dir === root && skipDirs.has(entry.name)) continue;
        walk(full);
      } else if (entry.name === 'index.html') {
        out.push(path.relative(root, full).split(path.sep).join('/'));
      }
    }
  };
  walk(root);
  return out;
}

export function discoverIndexFiles(root) {
  try {
    const output = execFileSync(
      'git',
      ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
      { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    );
    return output
      .split('\0')
      .filter(Boolean)
      .filter((file) => file === 'index.html' || file.endsWith('/index.html'))
      .sort();
  } catch {
    return walkIndexFiles(root).sort();
  }
}

export function routeFromIndexFile(file) {
  const dir = path.posix.dirname(file);
  return dir === '.' ? '/' : `/${dir}/`;
}
