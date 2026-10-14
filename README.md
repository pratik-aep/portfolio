# forgeD portfolio

[![CI/CD](https://github.com/pratik-aep/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/pratik-aep/portfolio/actions/workflows/ci.yml)

A light-themed portfolio for a software development team, centred on a scroll-driven 3D laptop. Built from the brief and design review in [`docs/`](docs/).

**Live site:** https://pratik-aep.github.io/portfolio/

## Run locally

Requires Node.js 20.9 or newer (`.nvmrc` pins 22).

```sh
npm ci
npm run dev -- --port 3107
```

Open `http://localhost:3107`.

| Script                 | What it does                                              |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Development server with hot reload.                       |
| `npm run build`        | Static export to `out/`.                                  |
| `npm run lint`         | ESLint (Next.js core-web-vitals + TypeScript rules).      |
| `npm run format`       | Format everything with Prettier.                          |
| `npm run format:check` | Fail if anything is unformatted.                          |
| `npm run typecheck`    | `tsc --noEmit`.                                           |
| `npm run check`        | Everything CI runs: lint, format check, typecheck, build. |
| `npm run assets`       | Regenerate the preview SVGs in `public/previews/`.        |

The build is a static export. Serve `out/` through an HTTP server (e.g. `npx serve out`); opening the HTML from disk breaks client routing.

## Architecture

```
app/                      Routes only (App Router)
  layout.tsx              Fonts, global CSS, smooth scroll, nav, footer
  page.tsx                Home: composes the sections below
  projects/               /projects/ and statically generated detail pages
  globals.css             Design tokens, layout, responsive rules
components/
  layout/                 Navbar, Footer, Wordmark
  home/                   HeroSection, FeaturedProjects, AboutSection
  laptop/                 The 3D scroll showcase (see below)
  projects/               ProjectCard
  contact/                ContactSection (brief download / email draft)
  motion/                 Reveal (scroll reveals), SmoothScroll (Lenis)
data/                     site.ts (brand, contact), projects.ts (content)
hooks/                    usePrefersReducedMotion
lib/                      asset() base-path helper, monotone spline, Lenis handle
public/previews/          Generated SVG interfaces (cards + laptop screens)
scripts/                  Preview artwork generator
docs/                     Original brief, design review, visual reference
```

### The laptop showcase (`components/laptop/`)

| File                       | Responsibility                                                                            |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| `LaptopShowcaseLoader.tsx` | Client-only lazy import, so three.js is not in the initial bundle.                        |
| `LaptopShowcase.tsx`       | The section: ScrollTrigger progress, pointer, breakpoints, overlays, fallbacks.           |
| `LaptopScene.tsx`          | Lighting, contact shadow, and the per-frame loop (damping, banking, float, pointer lean). |
| `LaptopModel.tsx`          | Geometry and materials only; animated through refs.                                       |
| `LaptopScreen.tsx`         | Screen shader: project crossfades, power-on, glass sheen.                                 |
| `choreography.ts`          | Keyframes per channel and responsive motion profiles.                                     |
| `Keyboard.tsx`             | Keys merged into a single geometry.                                                       |
| `StaticLaptop.tsx`         | CSS fallback for reduced motion and devices without WebGL2.                               |
| `SceneBoundary.tsx`        | Error boundary that switches to the fallback.                                             |

Scroll writes into a ref, the render loop reads it, and DOM overlays update from an `onFrame` callback. Scrolling never triggers a React render. To retime the animation, edit the keyframes in `choreography.ts`. Each channel (position, rotation, scale, lid, screen) has its own keys and is interpolated with a monotone cubic spline, so motion stays continuous without overshooting.

## CI/CD

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every pull request and every push to `main`:

1. **verify**: lint, format check, typecheck.
2. **build**: static export with the GitHub Pages base path (`/portfolio`).
3. **deploy** (`main` only): publishes `out/` to GitHub Pages.

PR runs are cancelled when superseded; deployments are queued, never cancelled. Dependabot opens grouped weekly npm updates and monthly Actions updates.

### One-time setup

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.** The deploy job fails until this is set.
2. Optional: **Settings → Secrets and variables → Actions → Variables**, add `NEXT_PUBLIC_CONTACT_EMAIL` to turn the contact form into an email draft.
3. Recommended: protect `main` and require the **Lint, format, typecheck** and **Build static site** checks.

### Base path

GitHub Pages serves this repository from `/portfolio`. `next.config.ts` reads `PAGES_BASE_PATH` (set by CI, empty locally). Next prefixes links automatically, but not `<Image>` sources, metadata icons, or WebGL texture URLs, so reference anything in `public/` through `asset("/path")` from `lib/asset.ts`.

## Content to confirm before public launch

`data/projects.ts` holds draft project descriptions, categories, and image paths. No project repositories, technology stacks, screenshots, deployment URLs, or contact email were supplied.

The four preview SVGs are original **illustrative interfaces**, visibly labelled as concept previews, and detail pages explain their status. Their sample readings are artwork, not real measurements. Replace them with authentic screenshots when available. Tags describe categories, not unverified technologies.

Without `NEXT_PUBLIC_CONTACT_EMAIL`, the contact form downloads a text brief on the visitor's device and never claims to have sent anything.

Do not publish invented testimonials, client logos, statistics, repository links, or project outcomes.

The site makes no external requests at runtime: fonts, lighting, and imagery are all bundled.
