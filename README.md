# DarkWing Studio

Static creative studio platform for DarkWing Studio, combining a portfolio, open-source software projects, and digital 3D artwork.
Built with plain HTML5, CSS custom properties, and vanilla JavaScript (zero runtime framework dependencies).

**Live:** [darkwingstudio.netlify.app](https://darkwingstudio.netlify.app/)

## Site Map

| Route | Purpose |
|---|---|
| `/` | Main hub — social links, project highlights, and official channel directory |
| `/about/` | Studio background, creator profile, and philosophy |
| `/projects/` | Open-source software, web builds, and developer utilities |
| `/art/` | Digital art portfolio and 3D visual showcases |
| `/art/assets/` | Downloadable 4K wallpapers and profile avatars |
| `/changelog/` | Public chronological release log of studio updates and technical milestones |
| `/privacy/` | Privacy policy and tracker-free static data disclosure |
| `/terms/` | Terms of use, download license, and copyright notices |
| `/404.html` | Custom error recovery portal with live search and destination routing |

## Tech Stack

- **HTML5** — semantic markup, Schema.org JSON-LD structured data (`@graph` Organization, WebSite, CollectionPage), Open Graph, and Twitter Card metadata
- **CSS3** — `styles.css` with CSS custom properties, responsive dual-panel layout, cubic-bezier hover transitions, and dark/light paper palette
- **JavaScript** — vanilla `script.js` handling dynamic copyright year, email obfuscation, and active navigation states; `404.js` handling client-side destination filtering

## Project Structure

```
├── index.html              # Home / link hub
├── styles.css              # Global stylesheet
├── script.js               # Shared runtime (dynamic year, email, filters)
├── 404.html                # Custom error recovery portal
├── 404.js                  # Search and typo suggestions for 404 portal
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
│   └── og-image.jpg        # 1200x630 social sharing card (< 100 KB)
├── netlify.toml            # Headers, CSP, caching, and redirects
├── robots.txt              # Crawler access policy (AI bots included)
├── sitemap.xml             # XML sitemap for search engines
├── llms.txt                # LLM/AI agent discoverability manifest
├── site.webmanifest        # Web application manifest
└── LICENSE                 # MIT
```

## SEO and Discoverability

- Open Graph and Twitter Card tags across every published route
- Optimized `og-image.jpg` (< 100 KB) for high-performance social preview generation
- Schema.org JSON-LD structured data with breadcrumb hierarchies
- Zero advertising, analytics, or third-party tracking scripts loaded site-wide
- Comprehensive `meta name="keywords"` implementation across all HTML pages
- `robots.txt` with explicit directives for modern web and AI agent crawlers
- `llms.txt` manifest providing machine-readable studio context
- Canonical URLs and XML sitemap covering all active indexable routes

## Netlify Configuration

Defined in `netlify.toml`:

- **Security headers** — strict Content Security Policy (`style-src 'self'`, `script-src 'self'`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security` preload
- **Asset caching** — 1-year immutable `Cache-Control` paired with manual query versioning (`?v=N`) for versioned stylesheets and scripts; immutable caching on static image assets
- **Deployment** — Pure static zero-build deployment served directly from root (`publish = "."`)
- **Redirects** — Catch-all `/*` serves `/404.html` with a 404 status code

## Local Development

```bash
# Serve locally with any static HTTP server (e.g. Python):
python -m http.server 5500
# Or open index.html directly in a browser
```

## Planned / Roadmap

- **Minecraft Knowledge Hub** — Automated static compilation (`generate.js`) reading JSON entity/game datasets (`data/mobs.json`, etc.) to produce statically indexable reference pages under `/minecraft/`
- **Arcade Mini-Game** — Canvas-based zero-dependency mini-game matching studio design tokens, linked from `/projects/`
- **Offline / PWA Support** — Service worker scoped to arcade routes (`/arcade/sw.js`) supporting offline gameplay

## License

MIT — see [LICENSE](LICENSE) for details.
