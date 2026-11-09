# DarkWing Studio

Static creative studio platform for DarkWing Studio, combining a portfolio, digital assets, and versioned Minecraft reference guides.
Built with plain HTML, CSS, vanilla JavaScript, and small Node-based generation and validation scripts.

**Live:** [darkwingstudio.netlify.app](https://darkwingstudio.netlify.app/)

## Site Map

| Route | Purpose |
|---|---|
| `/` | Main hub - social links, project highlights, and channel directory |
| `/about/` | Studio background and creator profile |
| `/projects/` | Open-source software, web builds, and developer utilities |
| `/art/` | Digital art portfolio |
| `/art/assets/` | Filterable gallery of 4K wallpapers and profile avatars |
| `/changelog/` | Public chronological release log of studio updates and technical milestones |
| `/privacy/` | Privacy policy and cookie-free data disclosure |
| `/terms/` | Terms of use, download license, and trademark disclaimers |
| `/404.html` | Custom error recovery portal with live search, mob lookup, and destination routing |

## Tech Stack

- **HTML5** - semantic markup, Schema.org JSON-LD (@graph Organization, WebSite, CollectionPage, FAQPage, Article), Open Graph + Twitter Card meta
- **CSS** - single `Styles.css` with CSS custom properties, radial gradient backgrounds, cubic-bezier hover animations, responsive dual-panel layout, and guide data tables
- **JavaScript** - `script.js` handles browser interactions (active navigation, copy year, dynamic filters, recovery routing)

## Project Structure

```
├── index.html              # Home / link hub
├── Styles.css              # Global stylesheet
├── script.js               # Shared runtime (dynamic year, email, filters)
├── 404.html                # Custom error recovery portal
├── about/index.html        # Studio about & creator profile
├── projects/index.html     # Software & developer builds
├── art/
│   ├── index.html          # Art portfolio
│   └── assets/index.html   # Downloadable wallpapers & PFPs
├── changelog/index.html    # Studio release history & changelog
├── privacy/index.html      # Privacy policy
├── terms/index.html        # Terms of use
├── assets/
│   ├── ProfilePIC.webp     # Site icon and avatar
│   ├── og-image.jpg        # 1200x630 social sharing card
│   ├── og-image.png        # 1672x941 high-res social card
│   ├── food/               # Food sprites
│   ├── armor/              # Armor sprites
│   ├── ores/               # Ore sprites
│   ├── tools/              # Tool sprites
│   └── mobs/               # Mob and variant sprites
├── netlify.toml            # Headers, caching, redirects
├── robots.txt              # Crawler access policy (2026 AI bots included)
├── sitemap.xml             # XML sitemap for search engines
├── llms.txt                # LLM/AI agent discoverability manifest
├── site.webmanifest        # PWA manifest
└── LICENSE                 # MIT
```

## SEO and Discoverability

- Open Graph and Twitter Card tags across every page
- Custom `og-image.jpg` (< 100 KB) optimized for social sharing
- Schema.org JSON-LD structured data on all pages
- No advertising, analytics, or tracking scripts are loaded site-wide
- Comprehensive `meta name="keywords"` implementation across all published HTML pages
- `robots.txt` with explicit directives for Google, Bing, OpenAI, Anthropic, Perplexity, Apple, and Amazon crawlers
- `llms.txt` manifest for AI agent discoverability
- XML sitemap covering all indexable pages

## Netlify Configuration

Defined in `netlify.toml`:

- **Security headers** - `X-Frame-Options: DENY`, `X-XSS-Protection`, `X-Content-Type-Options: nosniff`, strict referrer policy
- **Asset caching** - immutable 1-year `Cache-Control` for CSS, JS, WebP, PNG, SVG, and JPG
- **Deployment** - Pure static zero-build deployment served directly from root (`publish = "."`)
- **Redirects** - Catch-all `/*` serves `404.html` with a proper 404 status; static mob detail routes remain directly addressable

## Local Development

```bash
# Serve locally with any static HTTP server (e.g. VS Code Live Server or python):
python -m http.server 5500
# Or open index.html directly in a browser
```

## License

MIT - see [LICENSE](LICENSE) for details.
