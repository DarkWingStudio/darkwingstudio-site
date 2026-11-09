import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to escape HTML text
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 1. Build styles.css from styles/*.css
function buildStyles() {
  console.log('[CSS] Concatenating style modules...');
  const parts = ['tokens.css', 'layout.css', 'components.css', 'pages.css'];
  const contents = parts.map(file => {
    const filePath = path.join(rootDir, 'styles', file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing stylesheet module: ${filePath}`);
    }
    return `/* --- Module: styles/${file} --- */\n` + fs.readFileSync(filePath, 'utf8');
  });

  const bundledCss = contents.join('\n\n');

  // Verify brace balance
  let open = 0;
  for (let i = 0; i < bundledCss.length; i++) {
    if (bundledCss[i] === '{') open++;
    else if (bundledCss[i] === '}') open--;
    if (open < 0) {
      throw new Error(`CSS syntax error: extra closing brace encountered at index ${i}`);
    }
  }
  if (open !== 0) {
    throw new Error(`CSS syntax error: ${open} unclosed brace(s) detected in styles!`);
  }

  const outPath = path.join(rootDir, 'styles.css');
  fs.writeFileSync(outPath, bundledCss, 'utf8');
  console.log(`[CSS] Generated styles.css (${(bundledCss.length / 1024).toFixed(1)} KB) - 0 syntax errors.`);
}

// Shared Footer HTML with resilient explicit width/height
function getSharedFooter() {
  return `    <footer class="site-footer">
      <div class="footer-topline">
        <span>DarkWing Studio · Independent creative work</span>
        <span>Code · 3D · Digital Art</span>
      </div>

      <div class="footer-main">
        <section class="footer-brand" aria-label="About DarkWing Studio">
          <a class="brand-lockup" href="/" aria-label="DarkWing Studio home">
            <img src="/assets/ProfilePIC.webp" width="40" height="40" alt="" loading="lazy" decoding="async">
            <span><strong>DarkWing Studio</strong><small>Artwork · 3D · Web builds</small></span>
          </a>
          <p class="footer-description">Open-source web experiments, software projects, and 3D digital art. Built by Rohit Kumar and shared freely from one studio.</p>
        </section>

        <nav class="footer-column" aria-label="Explore the studio">
          <h3 class="footer-heading">Explore</h3>
          <ul class="footer-links">
            <li><a href="/about/"><svg class="footer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path stroke-linecap="round" d="M5.7 20c.5-3.3 2.8-5.2 6.3-5.2s5.8 1.9 6.3 5.2"/></svg><span>About the studio</span></a></li>
            <li><a href="/projects/"><svg class="footer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linejoin="round" d="M3.5 6.5h6l2 2h9v10.8H3.5z"/><path stroke-linecap="round" d="M3.5 9h17"/></svg><span>Projects</span></a></li>
            <li><a href="/art/"><svg class="footer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linejoin="round" d="M12 3.5a8.5 8.5 0 1 0 0 17h1.2a2.1 2.1 0 0 0 1.4-3.7c-.8-.7-.3-2 1-2h1.1a4.8 4.8 0 0 0 4.8-4.8c0-3.6-4.2-6.5-9.5-6.5Z"/><circle cx="7.8" cy="11" r=".9" fill="currentColor"/><circle cx="10.5" cy="7.7" r=".9" fill="currentColor"/><circle cx="15" cy="8" r=".9" fill="currentColor"/></svg><span>Digital art</span></a></li>
            <li><a href="/arcade/"><svg class="footer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2"/><path stroke-linecap="round" d="M8 12h4m-2-2v4M16 11h.01M18 13h.01"/></svg><span>Arcade</span></a></li>
            <li><a href="/minecraft/mobs/"><svg class="footer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/></svg><span>Minecraft Database</span></a></li>
          </ul>
        </nav>

        <nav class="footer-column" aria-label="Follow DarkWing Studio">
          <h3 class="footer-heading">Follow along</h3>
          <ul class="footer-links">
            <li><a href="https://github.com/DarkWingStudio" target="_blank" rel="noopener noreferrer me"><svg class="footer-icon footer-icon--brand" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.1 11.1 0 0 0 12 .9Z"/></svg><span>GitHub</span></a></li>
            <li><a href="https://www.youtube.com/@DarkWing-in" target="_blank" rel="noopener noreferrer me"><svg class="footer-icon footer-icon--brand" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.5 15.6V8.4l6.3 3.6-6.3 3.6Z"/></svg><span>YouTube</span></a></li>
            <li><a href="https://www.instagram.com/darkwingstudio.in/" target="_blank" rel="noopener noreferrer me"><svg class="footer-icon footer-icon--brand" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg><span>Instagram</span></a></li>
            <li><a href="https://www.pinterest.com/Darkwingstudio" target="_blank" rel="noopener noreferrer me"><svg class="footer-icon footer-icon--brand" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-4.1 21.6c0-.9 0-2.1.2-3.1l1.5-6.3s-.4-.8-.4-1.9c0-1.8 1-3.1 2.3-3.1 1.1 0 1.6.8 1.6 1.8 0 1.1-.7 2.8-1 4.3-.3 1.3.7 2.3 2 2.3 2.4 0 4.2-2.5 4.2-6.1 0-3.2-2.3-5.4-5.6-5.4-3.8 0-6 2.8-6 5.8 0 1.1.4 2.4.9 3 .1.1.1.3.1.4l-.4 1.5c-.1.2-.2.3-.5.2-1.7-.8-2.8-3.2-2.8-5.2 0-4.2 3-8.1 8.8-8.1 4.6 0 8.2 3.3 8.2 7.7 0 4.6-2.9 8.3-6.9 8.3-1.3 0-2.6-.7-3-1.5l-.8 3.2c-.3 1.2-1.1 2.6-1.6 3.5A11.2 11.2 0 1 0 12 .8Z"/></svg><span>Pinterest</span></a></li>
            <li><a href="https://x.com/DarkWingStudio" target="_blank" rel="noopener noreferrer me"><svg class="footer-icon footer-icon--brand" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 1.2h3.7l-8 9.2L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9Zm-1.3 19.5h2L6.5 3.2H4.3Z"/></svg><span>X</span></a></li>
            <li><a href="https://www.reddit.com/user/darkwingstudio" target="_blank" rel="noopener noreferrer me"><svg class="footer-icon footer-icon--brand" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg><span>Reddit</span></a></li>
            <li><a href="https://www.deviantart.com/darkwingstudio" target="_blank" rel="noopener noreferrer me"><svg class="footer-icon footer-icon--brand" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m19.2 4.8-3.3 5.6h3.3v5h-3.3l-3.3 5.6H6.6v-3.7l3.3-5.6H6.6V6.6h3.3l3.3-5.6h6z"/></svg><span>DeviantArt</span></a></li>
          </ul>
        </nav>
      </div>

      <div class="footer-bottom">
        <p class="copyright">&copy; <span id="year">2026</span> DarkWing Studio</p>
        <nav aria-label="Policies and updates">
          <ul class="footer-legal">
            <li><a href="/changelog/"><svg class="footer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linejoin="round" d="M5 4h14v16H5z"/><path stroke-linecap="round" d="M8 8h8M8 12h8M8 16h5"/></svg><span>Changelog</span></a></li>
            <li><a href="/privacy/"><svg class="footer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linejoin="round" d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z"/><path stroke-linecap="round" d="m9 12 2 2 4-4"/></svg><span>Privacy</span></a></li>
            <li><a href="/terms/"><svg class="footer-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linejoin="round" d="M6 3.5h8l4 4V20H6z"/><path stroke-linejoin="round" d="M14 3.5v4h4M9 12h6M9 15.5h6"/></svg><span>Terms</span></a></li>
          </ul>
        </nav>
      </div>
    </footer>`;
}

// Hostility badge helper
function getHostilityBadge(hostility) {
  const h = (hostility || 'neutral').toLowerCase();
  if (h === 'hostile') {
    return `<span class="mob-badge mob-badge--hostile"><img src="/assets/gui/hostile-skull.svg" class="mob-badge-icon" alt="" width="12" height="12"> Hostile</span>`;
  } else if (h === 'passive') {
    return `<span class="mob-badge mob-badge--passive"><img src="/assets/gui/passive-sprout.svg" class="mob-badge-icon" alt="" width="12" height="12"> Passive</span>`;
  } else {
    return `<span class="mob-badge mob-badge--neutral"><img src="/assets/gui/neutral-eye.svg" class="mob-badge-icon" alt="" width="12" height="12"> Neutral</span>`;
  }
}

// 2. Generate Minecraft Hub & Mob Pages
function generateMinecraft() {
  console.log('[Minecraft] Reading data/mobs.json...');
  const mobsFile = path.join(rootDir, 'data', 'mobs.json');
  if (!fs.existsSync(mobsFile)) {
    throw new Error('data/mobs.json does not exist');
  }

  const mobs = JSON.parse(fs.readFileSync(mobsFile, 'utf8'));
  console.log(`[Minecraft] Loaded ${mobs.length} entities.`);

  // Generate individual mob pages
  mobs.forEach(mob => {
    const mobDir = path.join(rootDir, 'minecraft', 'mobs', mob.slug);
    fs.mkdirSync(mobDir, { recursive: true });

    const hostilityBadge = getHostilityBadge(mob.hostility);
    const healthHearts = mob.stats.health ? (mob.stats.health / 2) : 0;

    // Build variants HTML using .mob-variants-grid & .mob-variant-card
    let variantsHtml = '';
    if (mob.variants && mob.variants.length > 0) {
      const cards = mob.variants.map(v => {
        const vTitle = v.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const variantSprite = `/assets/mobs/variants/${v}.webp`;
        return `            <div class="mob-variant-card">
              <div class="mob-variant-image">
                <img src="${variantSprite}" alt="${escapeHtml(vTitle)}" width="96" height="96" loading="lazy">
              </div>
              <div class="mob-variant-copy">
                <h3>${escapeHtml(vTitle)}</h3>
                <span class="mob-badge">${escapeHtml(mob.name)} Variant</span>
                <p>Natural variation of the ${escapeHtml(mob.name)} with unique spawn rules, biome conditions, or combat traits.</p>
              </div>
            </div>`;
      }).join('\n');

      variantsHtml = `
          <h2>Known Variants</h2>
          <div class="mob-variants-grid">
${cards}
          </div>`;
    } else {
      variantsHtml = `
          <h2>Known Variants</h2>
          <p class="source-note">No standard variants in vanilla Minecraft; this entity spawns in uniform state across compatible biomes.</p>`;
    }

    // Drops HTML
    const dropsHtml = (mob.drops && mob.drops.length > 0)
      ? mob.drops.map(d => `<span class="tag-chip">${escapeHtml(d.replace(/-/g, ' '))}</span>`).join(' ')
      : '<span class="source-note">No dropped items upon defeat.</span>';

    const pageHtml = `<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="theme-color" content="#f2f0e9">
  <meta name="description" content="Minecraft ${escapeHtml(mob.name)} guide: stats, attack patterns, drops, variants, and behavior details.">
  <meta name="keywords" content="${escapeHtml(mob.name.toLowerCase())} minecraft, ${escapeHtml(mob.slug)} stats, minecraft mob guide, darkwing studio minecraft">
  <meta name="author" content="DarkWing Studio">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://darkwingstudio.netlify.app/minecraft/mobs/${mob.slug}/">

  <meta property="og:type" content="article">
  <meta property="og:site_name" content="DarkWing Studio">
  <meta property="og:title" content="${escapeHtml(mob.name)} — Minecraft Mob Database | DarkWing Studio">
  <meta property="og:description" content="${escapeHtml(mob.description)}">
  <meta property="og:url" content="https://darkwingstudio.netlify.app/minecraft/mobs/${mob.slug}/">
  <meta property="og:image" content="https://darkwingstudio.netlify.app/assets/og-image.jpg">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(mob.name)} — Minecraft Mob Database">
  <meta name="twitter:description" content="${escapeHtml(mob.description)}">
  <meta name="twitter:image" content="https://darkwingstudio.netlify.app/assets/og-image.jpg">

  <link rel="icon" type="image/webp" href="/assets/ProfilePIC.webp">
  <link rel="apple-touch-icon" href="/assets/ProfilePIC.webp">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/styles.css?v=3">
  <script src="/script.js" defer></script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "name": "${escapeHtml(mob.name)} — Minecraft Mob Guide",
    "description": "${escapeHtml(mob.description)}",
    "url": "https://darkwingstudio.netlify.app/minecraft/mobs/${mob.slug}/",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://darkwingstudio.netlify.app/"},
        {"@type": "ListItem", "position": 2, "name": "Minecraft", "item": "https://darkwingstudio.netlify.app/minecraft/"},
        {"@type": "ListItem", "position": 3, "name": "Mobs", "item": "https://darkwingstudio.netlify.app/minecraft/mobs/"},
        {"@type": "ListItem", "position": 4, "name": "${escapeHtml(mob.name)}", "item": "https://darkwingstudio.netlify.app/minecraft/mobs/${mob.slug}/"}
      ]
    }
  }
  </script>

  <title>${escapeHtml(mob.name)} — Minecraft Mob Guide | DarkWing Studio</title>
</head>

<body>
  <a class="skip-link" href="#mob-content">Skip to content</a>

  <div class="site-frame">
    <header class="topbar">
      <a class="wordmark" href="/" aria-label="DarkWing Studio home">
        <img src="/assets/ProfilePIC.webp" alt="DarkWing Studio Logo" class="wordmark-icon" width="34" height="34">
        <span>DarkWing Studio</span>
      </a>
      <nav class="topbar-nav" aria-label="Site sections">
        <a href="/about/" class="topbar-nav-link">About</a>
        <a href="/projects/" class="topbar-nav-link">Projects</a>
        <a href="/art/" class="topbar-nav-link">Art</a>
        <a href="/arcade/" class="topbar-nav-link">Arcade</a>
        <a href="/minecraft/mobs/" class="topbar-nav-link is-active" aria-current="page">Minecraft</a>
      </nav>
    </header>

    <main class="site-card site-card--content" id="mob-content">
      <div class="content-page-inner">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/minecraft/">Minecraft</a></li>
            <li><a href="/minecraft/mobs/">Mobs</a></li>
            <li aria-current="page">${escapeHtml(mob.name)}</li>
          </ol>
        </nav>

        <p class="eyebrow">MINECRAFT COMPENDIUM · MOB DATA</p>
        <h1>${escapeHtml(mob.name)}</h1>
        <div class="mob-badge-container">
          ${hostilityBadge}
          <span class="mob-badge mob-badge--version">Minecraft Java &amp; Bedrock</span>
        </div>

        <div class="content-body">
          <div class="mob-overview-layout">
            <div class="mob-portrait-frame">
              <img src="${mob.sprite}" alt="${escapeHtml(mob.name)}" width="160" height="160" loading="eager" class="mob-portrait-img">
            </div>

            <div class="mob-vitals-wrap">
              <div class="mob-stats-row">
                <div class="mob-stat-chip">
                  <span class="mob-stat-chip-label">Health</span>
                  <span class="mob-stat-chip-val">
                    <img src="/assets/gui/heart.svg" alt="" width="14" height="14" class="mob-badge-icon">
                    ${mob.stats.health} HP (${healthHearts} &hearts;)
                  </span>
                </div>
                <div class="mob-stat-chip">
                  <span class="mob-stat-chip-label">Damage</span>
                  <span class="mob-stat-chip-val">${escapeHtml(String(mob.stats.damage || '0'))} HP</span>
                </div>
                <div class="mob-stat-chip">
                  <span class="mob-stat-chip-label">Armor</span>
                  <span class="mob-stat-chip-val">${mob.stats.armor || 0}</span>
                </div>
              </div>

              <p class="intro-copy">${escapeHtml(mob.description)}</p>
            </div>
          </div>

          <h2>Drops &amp; Loot</h2>
          <div class="mob-drops-summary">
            ${dropsHtml}
          </div>

${variantsHtml}

          <div class="project-actions">
            <a href="/minecraft/mobs/" class="btn-secondary">
              &larr; Back to Mob Database
            </a>
          </div>

          <p class="source-note">Sourced from official Minecraft vanilla behavior tables. All assets and sprites &copy; Mojang Studios / Microsoft. Compiled for DarkWing Studio Compendium.</p>
        </div>
      </div>

      <aside class="sidebar-panel" aria-label="Sidebar">
        <div class="sidebar-heading">
          <h3>Mob Database</h3>
        </div>
        <nav class="link-list" aria-label="Minecraft mob list">
${mobs.map(m => `          <a class="link-row${m.slug === mob.slug ? ' is-active' : ''}" href="/minecraft/mobs/${m.slug}/">
            <span class="link-copy"><span class="link-title">${escapeHtml(m.name)}</span></span>
            <span class="mob-badge mob-badge--${m.hostility}">${m.hostility}</span>
          </a>`).join('\n')}
        </nav>

        <div class="sidebar-heading sidebar-heading--spaced">
          <h3>Studio Sections</h3>
        </div>
        <nav class="link-list" aria-label="Studio links">
          <a class="link-row" href="/projects/"><span class="link-copy"><span class="link-title">Projects &amp; Software</span></span></a>
          <a class="link-row" href="/art/"><span class="link-copy"><span class="link-title">Digital Art &amp; 3D</span></span></a>
          <a class="link-row" href="/about/"><span class="link-copy"><span class="link-title">About the Studio</span></span></a>
        </nav>
      </aside>
    </main>

${getSharedFooter()}
  </div>
</body>

</html>
`;
    fs.writeFileSync(path.join(mobDir, 'index.html'), pageHtml, 'utf8');
  });
  console.log(`[Minecraft] Generated ${mobs.length} individual mob detail pages.`);

  // Generate Catalog Index (/minecraft/mobs/index.html)
  const catalogDir = path.join(rootDir, 'minecraft', 'mobs');
  fs.mkdirSync(catalogDir, { recursive: true });

  const catalogCardsHtml = mobs.map(m => {
    const badge = getHostilityBadge(m.hostility);
    return `            <article class="asset-card asset-card--mob asset-card--item" data-category="${m.hostility}">
              <div class="asset-card-preview asset-card-preview--item">
                <img src="${m.sprite}" alt="${escapeHtml(m.name)}" width="120" height="120" loading="lazy">
              </div>
              <div class="asset-card-content">
                <div class="mob-badge-container">${badge}</div>
                <h2 class="asset-card-title">${escapeHtml(m.name)}</h2>
                <div class="mob-stats-row">
                  <div class="mob-stat-chip">
                    <span class="mob-stat-chip-label">Health</span>
                    <span class="mob-stat-chip-val">${m.stats.health} HP</span>
                  </div>
                  <div class="mob-stat-chip">
                    <span class="mob-stat-chip-label">Attack</span>
                    <span class="mob-stat-chip-val">${escapeHtml(String(m.stats.damage || '0'))}</span>
                  </div>
                </div>
                <p class="asset-card-meta">${escapeHtml(m.description)}</p>
                <a href="/minecraft/mobs/${m.slug}/" class="mob-card-cta">
                  <span>View Details</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"/></svg>
                </a>
              </div>
            </article>`;
  }).join('\n');

  const catalogHtml = `<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="theme-color" content="#f2f0e9">
  <meta name="description" content="Minecraft Mob Database: stats, hostile and passive behaviors, variant breakdowns, and loot drops.">
  <meta name="keywords" content="minecraft mob database, minecraft mobs list, hostile mobs, passive mobs, minecraft guides">
  <meta name="author" content="DarkWing Studio">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://darkwingstudio.netlify.app/minecraft/mobs/">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="DarkWing Studio">
  <meta property="og:title" content="Minecraft Mob Database | DarkWing Studio">
  <meta property="og:description" content="Curated Minecraft mob encyclopedia with vital stats, hostility tags, variants, and loot tables.">
  <meta property="og:url" content="https://darkwingstudio.netlify.app/minecraft/mobs/">
  <meta property="og:image" content="https://darkwingstudio.netlify.app/assets/og-image.jpg">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Minecraft Mob Database | DarkWing Studio">
  <meta name="twitter:description" content="Curated Minecraft mob encyclopedia with vital stats, hostility tags, variants, and loot tables.">
  <meta name="twitter:image" content="https://darkwingstudio.netlify.app/assets/og-image.jpg">

  <link rel="icon" type="image/webp" href="/assets/ProfilePIC.webp">
  <link rel="apple-touch-icon" href="/assets/ProfilePIC.webp">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/styles.css?v=3">
  <script src="/script.js" defer></script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Minecraft Mob Database",
    "description": "Curated encyclopedia of Minecraft mobs, vital statistics, and behavior models.",
    "url": "https://darkwingstudio.netlify.app/minecraft/mobs/",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://darkwingstudio.netlify.app/"},
        {"@type": "ListItem", "position": 2, "name": "Minecraft", "item": "https://darkwingstudio.netlify.app/minecraft/"},
        {"@type": "ListItem", "position": 3, "name": "Mobs", "item": "https://darkwingstudio.netlify.app/minecraft/mobs/"}
      ]
    }
  }
  </script>

  <title>Minecraft Mob Database | DarkWing Studio</title>
</head>

<body>
  <a class="skip-link" href="#catalog-content">Skip to content</a>

  <div class="site-frame">
    <header class="topbar">
      <a class="wordmark" href="/" aria-label="DarkWing Studio home">
        <img src="/assets/ProfilePIC.webp" alt="DarkWing Studio Logo" class="wordmark-icon" width="34" height="34">
        <span>DarkWing Studio</span>
      </a>
      <nav class="topbar-nav" aria-label="Site sections">
        <a href="/about/" class="topbar-nav-link">About</a>
        <a href="/projects/" class="topbar-nav-link">Projects</a>
        <a href="/art/" class="topbar-nav-link">Art</a>
        <a href="/arcade/" class="topbar-nav-link">Arcade</a>
        <a href="/minecraft/mobs/" class="topbar-nav-link is-active" aria-current="page">Minecraft</a>
      </nav>
    </header>

    <main class="site-card site-card--content" id="catalog-content">
      <div class="content-page-inner">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/minecraft/">Minecraft</a></li>
            <li aria-current="page">Mobs</li>
          </ol>
        </nav>

        <p class="eyebrow">MINECRAFT COMPENDIUM</p>
        <h1>Minecraft<br><span>Mob Database</span></h1>
        <p class="intro-copy">Vital statistics, combat mechanics, and loot drops for Minecraft entities.</p>

        <!-- Gallery / Filter Buttons -->
        <div class="gallery-filter-bar" role="toolbar" aria-label="Filter mobs by hostility">
          <button type="button" class="asset-filter active" data-filter="all" aria-pressed="true">All Mobs</button>
          <button type="button" class="asset-filter" data-filter="hostile" aria-pressed="false">Hostile</button>
          <button type="button" class="asset-filter" data-filter="neutral" aria-pressed="false">Neutral</button>
          <button type="button" class="asset-filter" data-filter="passive" aria-pressed="false">Passive</button>
        </div>

        <div class="content-body">
          <div class="gallery-grid" id="mobs-grid">
${catalogCardsHtml}
          </div>

          <p class="source-note">Minecraft is a trademark of Mojang Synergies AB / Microsoft. This compendium is an independent static reference build generated automatically from structured game data.</p>
        </div>
      </div>

      <aside class="sidebar-panel" aria-label="Sidebar">
        <div class="sidebar-heading">
          <h3>Compendium Categories</h3>
        </div>
        <nav class="link-list" aria-label="Compendium sections">
          <a class="link-row is-active" href="/minecraft/mobs/">
            <span class="link-copy"><span class="link-title">Mob Database</span></span>
            <span class="tag-chip">${mobs.length}</span>
          </a>
          <a class="link-row" href="/projects/">
            <span class="link-copy"><span class="link-title">Developer Projects</span></span>
          </a>
          <a class="link-row" href="/arcade/">
            <span class="link-copy"><span class="link-title">Arcade Game</span></span>
            <span class="tag-chip">New</span>
          </a>
        </nav>

        <div class="sidebar-heading sidebar-heading--spaced">
          <h3>Explore Studio</h3>
        </div>
        <nav class="link-list" aria-label="Studio links">
          <a class="link-row" href="/about/"><span class="link-copy"><span class="link-title">About the Studio</span></span></a>
          <a class="link-row" href="/art/"><span class="link-copy"><span class="link-title">Digital Art &amp; 3D</span></span></a>
        </nav>
      </aside>
    </main>

${getSharedFooter()}
  </div>
</body>

</html>
`;
  fs.writeFileSync(path.join(catalogDir, 'index.html'), catalogHtml, 'utf8');
  console.log('[Minecraft] Generated /minecraft/mobs/index.html catalog page.');

  // Generate Hub index (/minecraft/index.html)
  const mcHubDir = path.join(rootDir, 'minecraft');
  fs.mkdirSync(mcHubDir, { recursive: true });

  const hubHtml = `<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="theme-color" content="#f2f0e9">
  <meta name="description" content="DarkWing Studio Minecraft Compendium: high-speed static references, mob stats, and game data.">
  <meta name="keywords" content="minecraft reference, minecraft mob stats, darkwing studio minecraft, minecraft compendium">
  <meta name="author" content="DarkWing Studio">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://darkwingstudio.netlify.app/minecraft/">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="DarkWing Studio">
  <meta property="og:title" content="Minecraft Compendium | DarkWing Studio">
  <meta property="og:description" content="Structured vanilla Minecraft reference compendium with mob statistics and loot data.">
  <meta property="og:url" content="https://darkwingstudio.netlify.app/minecraft/">
  <meta property="og:image" content="https://darkwingstudio.netlify.app/assets/og-image.jpg">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Minecraft Compendium | DarkWing Studio">
  <meta name="twitter:description" content="Structured vanilla Minecraft reference compendium with mob statistics and loot data.">
  <meta name="twitter:image" content="https://darkwingstudio.netlify.app/assets/og-image.jpg">

  <link rel="icon" type="image/webp" href="/assets/ProfilePIC.webp">
  <link rel="apple-touch-icon" href="/assets/ProfilePIC.webp">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="stylesheet" href="/styles.css?v=3">
  <script src="/script.js" defer></script>

  <title>Minecraft Compendium | DarkWing Studio</title>
</head>

<body>
  <a class="skip-link" href="#minecraft-hub">Skip to content</a>

  <div class="site-frame">
    <header class="topbar">
      <a class="wordmark" href="/" aria-label="DarkWing Studio home">
        <img src="/assets/ProfilePIC.webp" alt="DarkWing Studio Logo" class="wordmark-icon" width="34" height="34">
        <span>DarkWing Studio</span>
      </a>
      <nav class="topbar-nav" aria-label="Site sections">
        <a href="/about/" class="topbar-nav-link">About</a>
        <a href="/projects/" class="topbar-nav-link">Projects</a>
        <a href="/art/" class="topbar-nav-link">Art</a>
        <a href="/arcade/" class="topbar-nav-link">Arcade</a>
        <a href="/minecraft/mobs/" class="topbar-nav-link is-active" aria-current="page">Minecraft</a>
      </nav>
    </header>

    <main class="site-card site-card--content" id="minecraft-hub">
      <div class="content-page-inner">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li aria-current="page">Minecraft</li>
          </ol>
        </nav>

        <p class="eyebrow">CREATIVE ARCHIVES &amp; GUIDES</p>
        <h1>Minecraft<br><span>Compendium</span></h1>
        <p class="intro-copy">High-speed, zero-bloat static references and behavioral databases for Minecraft.</p>

        <div class="content-body">
          <p>The DarkWing Minecraft Compendium is an automated static encyclopedia driven directly by structured JSON data models. No heavy JavaScript frameworks, no ad clutter, and zero tracking — just instant-loading vital stats, combat formulas, and drop tables.</p>

          <h2>Featured Sections</h2>
          <nav class="link-list" aria-label="Compendium sections">
            <a class="link-row" href="/minecraft/mobs/">
              <span class="link-copy">
                <span class="link-title">Mob Database (${mobs.length} entries)</span>
                <span class="link-description">Combat statistics, heart points, attack values, variants, and complete loot tables.</span>
              </span>
              <svg class="link-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" /></svg>
            </a>
          </nav>

          <h2>Future Categories</h2>
          <p>Additional modules for Foods, Ores, Tools, and Armor are architected in the pipeline and will be emitted automatically as data schemas are populated.</p>
        </div>
      </div>

      <aside class="sidebar-panel" aria-label="Sidebar">
        <div class="sidebar-heading">
          <h3>Compendium</h3>
        </div>
        <nav class="link-list" aria-label="Explore Minecraft">
          <a class="link-row" href="/minecraft/mobs/"><span class="link-copy"><span class="link-title">Mob Database</span></span></a>
          <a class="link-row" href="/projects/"><span class="link-copy"><span class="link-title">Projects</span></span></a>
          <a class="link-row" href="/arcade/"><span class="link-copy"><span class="link-title">Arcade Game</span></span></a>
        </nav>
      </aside>
    </main>

${getSharedFooter()}
  </div>
</body>

</html>
`;
  fs.writeFileSync(path.join(mcHubDir, 'index.html'), hubHtml, 'utf8');
  console.log('[Minecraft] Generated /minecraft/index.html');
}

// 3. Update Sitemap
function updateSitemap() {
  console.log('[Sitemap] Updating sitemap.xml...');
  const mobsFile = path.join(rootDir, 'data', 'mobs.json');
  const mobs = fs.existsSync(mobsFile) ? JSON.parse(fs.readFileSync(mobsFile, 'utf8')) : [];

  const coreRoutes = [
    { loc: 'https://darkwingstudio.netlify.app/', priority: '1.0', changefreq: 'weekly', hasImage: true },
    { loc: 'https://darkwingstudio.netlify.app/about/', priority: '0.7', changefreq: 'monthly' },
    { loc: 'https://darkwingstudio.netlify.app/projects/', priority: '0.7', changefreq: 'monthly' },
    { loc: 'https://darkwingstudio.netlify.app/art/', priority: '0.7', changefreq: 'monthly' },
    { loc: 'https://darkwingstudio.netlify.app/art/assets/', priority: '0.7', changefreq: 'monthly' },
    { loc: 'https://darkwingstudio.netlify.app/arcade/', priority: '0.7', changefreq: 'monthly' },
    { loc: 'https://darkwingstudio.netlify.app/arcade/t-rex-runner/', priority: '0.7', changefreq: 'monthly' },
    { loc: 'https://darkwingstudio.netlify.app/minecraft/', priority: '0.7', changefreq: 'monthly' },
    { loc: 'https://darkwingstudio.netlify.app/minecraft/mobs/', priority: '0.8', changefreq: 'weekly' },
    { loc: 'https://darkwingstudio.netlify.app/changelog/', priority: '0.7', changefreq: 'monthly' },
    { loc: 'https://darkwingstudio.netlify.app/privacy/', priority: '0.7', changefreq: 'monthly' },
    { loc: 'https://darkwingstudio.netlify.app/terms/', priority: '0.7', changefreq: 'monthly' }
  ];

  const today = new Date().toISOString().split('T')[0];

  const urls = coreRoutes.map(route => {
    let xml = `  <url>\n    <loc>${route.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>`;
    if (route.hasImage) {
      xml += `\n    <image:image>\n      <image:loc>https://darkwingstudio.netlify.app/assets/ProfilePIC.webp</image:loc>\n      <image:title>DarkWing Studio Profile Artwork</image:title>\n    </image:image>`;
    }
    xml += '\n  </url>';
    return xml;
  });

  mobs.forEach(mob => {
    urls.push(`  <url>
    <loc>https://darkwingstudio.netlify.app/minecraft/mobs/${mob.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`;

  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapXml, 'utf8');
  console.log(`[Sitemap] Written sitemap.xml with ${urls.length} routes.`);
}

// Main execution
try {
  console.log('--- DarkWing Studio Static Build & Generator ---');
  buildStyles();
  generateMinecraft();
  updateSitemap();
  console.log('--- Build Finished Successfully ---');
} catch (err) {
  console.error('[Error]', err);
  process.exit(1);
}

