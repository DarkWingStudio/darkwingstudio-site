# DarkWing Studio

Static creative studio platform for DarkWing Studio, combining a portfolio, open-source software projects, and digital 3D artwork. Built with plain HTML5, CSS custom properties, and vanilla JavaScript, with no runtime framework dependencies.

**Live:** [darkwingstudio.netlify.app](https://darkwingstudio.netlify.app/)

## Site Map

| Route | Purpose |
|---|---|
| `/` | Main hub — studio intro, featured destinations, and official channel directory |
| `/about/` | Studio background, creator profile, and philosophy |
| `/projects/` | Open-source software, web builds, and developer utilities |
| `/art/` | Digital art portfolio and 3D visual showcases |
| `/art/assets/` | Downloadable wallpapers and profile avatars |
| `/changelog/` | Public chronological release log of studio updates and technical milestones |
| `/privacy/` | Privacy policy and tracker-free static data disclosure |
| `/terms/` | Terms of use, download license, and copyright notices |
| `/404.html` | Custom error recovery portal with live destination filtering |

## Tech Stack

- **HTML5** — semantic markup, Schema.org JSON-LD structured data (`@graph` Organization, WebSite, CollectionPage), Open Graph, and Twitter Card metadata
- **CSS3** — modular source files under `styles/`, compiled into `styles.css`; CSS custom properties, responsive panel layout, and a light paper palette with dark accent panels
- **JavaScript** — vanilla `script.js` for the dynamic copyright year, gallery filtering, and scroll reveals; `404.js` for destination filtering and typo suggestions

## Build

The repository ships a pre-built `styles.css` and `sitemap.xml`, but both are generated artifacts. Run the build after changing anything in `styles/` or page metadata:

```bash
npm install
npm run build
```

`npm run build` concatenates `styles/tokens.css`, `layout.css`, `components.css`, and `pages.css` into `styles.css`, regenerates `sitemap.xml`, and generates optional dataset pages when `data/mobs.json` exists. Missing optional datasets are skipped rather than failing the build.

## Project Structure

```
├── index.html              # Home / link hub
├── 404.html                # Custom error recovery portal
├── 404.js                  # Search and typo suggestions for 404 portal
├── script.js               # Shared runtime (dynamic year, filters, reveals)
├── styles.css              # Generated stylesheet (do not edit directly)
├── styles/
│   ├── tokens.css          # Design tokens, reset, and base typography
│   ├── layout.css          # Page shell, topbar, footer, responsive layout
│   ├── components.css      # Shared UI components
│   └── pages.css           # Page-specific components
├── about/index.html        # Studio about & creator profile
├── projects/index.html     # Software & developer builds
├── art/
│   ├── index.html          # Art portfolio
│   └── assets/index.html   # Downloadable wallpapers & PFPs
├── changelog/index.html    # Studio release history & changelog
├── privacy/index.html      # Privacy policy
├── terms/index.html        # Terms of use
├── assets/
│   ├── ProfilePIC.webp     # Studio avatar
│   ├── art/                # Responsive WebP gallery derivatives
│   ├── icons/              # Favicon, Apple touch, and PWA icons
│   └── og-image.jpg        # 1200x630 social sharing card (< 100 KB)
├── scripts/
│   ├── generate.js         # CSS bundle, sitemap, optional dataset generator
│   ├── routes.js           # Shared git-aware route discovery (tracked and non-ignored)
│   ├── build-icons.js      # Regenerates the icon set from ProfilePIC.webp
│   ├── build-profile.js    # Generates responsive profile image variants
│   ├── check-html.js       # Tag balance, duplicate ids, image alt text
│   ├── check-links.js      # Verifies every local href/src target exists
│   ├── check-sitemap.js    # Ensures sitemap.xml matches deployable routes
│   └── serve.js            # Zero-dependency local static server
├── .github/workflows/ci.yml # Build and validation on push and pull request
├── .well-known/security.txt # Security contact policy
├── netlify.toml            # Build, headers, CSP, caching, and redirects
├── robots.txt              # Crawler access policy (AI bots included)
├── sitemap.xml             # Generated XML sitemap
├── llms.txt                # LLM/AI agent discoverability manifest
├── site.webmanifest        # Web application manifest
└── LICENSE                 # MIT
```

## SEO and Discoverability

- Open Graph and Twitter Card tags across every published route
- Optimized `og-image.jpg` (< 100 KB) for high-performance social preview generation
- Schema.org JSON-LD structured data with breadcrumb hierarchies
- Zero advertising, analytics, or third-party tracking scripts loaded site-wide
- `robots.txt` with explicit directives for modern web and AI agent crawlers
- `llms.txt` manifest providing machine-readable studio context
- Canonical URLs and an XML sitemap generated from deployable (git-tracked, non-ignored) routes
- `security.txt` vulnerability disclosure contact

## Netlify Configuration

Defined in `netlify.toml`:

- **Build** — `npm run build`, publishing from the repository root (`publish = "."`)
- **Security headers** — strict Content Security Policy (`style-src 'self'`, `script-src 'self'`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security` preload
- **Asset caching** — HTML, CSS, and JavaScript revalidate on every request (`max-age=0, must-revalidate`); images and icons are cached for one year as immutable
- **Source protection** — repository files such as `package.json`, `scripts/*`, `styles/*`, `README.md`, and `AUDIT_REPORT.md` return 404 instead of being served
- **Redirects** — `/index.html` permanently redirects to `/`; the catch-all `/*` serves `/404.html` with a 404 status code

## Local Development

```bash
# Serve locally with the bundled zero-dependency Node server:
npm run serve
# Then open http://127.0.0.1:5500/
```

Opening `index.html` directly through `file://` works for most pages, but root-absolute `/` links and the 404 route require an HTTP server.

## Quality Checks

```bash
npm run check   # HTML structure and JSON-LD, broken local links, sitemap parity
npm test        # Build, then run every check
```

The same commands run in GitHub Actions (`.github/workflows/ci.yml`) on every push and pull request.

Asset generators (require the `sharp` devDependency):

```bash
npm run icons     # Regenerate favicon, Apple touch, and PWA icons
npm run profile   # Regenerate responsive profile image variants
```

## Roadmap

- **Minecraft reference pages** — Optional dataset pipeline exists, but no Minecraft routes are currently published in this repository
- **Arcade mini-game** — Canvas-based zero-dependency game, not currently published
- **Offline / PWA support** — Web app manifest and installable icons ship today; offline caching is not yet implemented

## License

MIT — see [LICENSE](LICENSE) for details.
