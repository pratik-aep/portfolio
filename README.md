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
  contact/                /contact/: the project brief form
  globals.css             Imports the stylesheets in styles/
components/
  layout/                 Navbar, Footer, Wordmark
  home/                   HeroSection, FeaturedProjects, Horizon, AboutSection, ContactCTA
  laptop/                 The 3D scroll showcase (see below)
  projects/               ProjectCard
  contact/                ContactSection (brief download / email draft)
  motion/                 Reveal (scroll reveals), SmoothScroll (Lenis)
data/                     site.ts (brand, contact), projects.ts (content)
hooks/                    usePrefersReducedMotion
lib/                      asset() base-path helper, monotone spline, Lenis handle
styles/                   tokens.css (design tokens) and one file per area, each
                          with its own responsive rules
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

One ScrollTrigger is the single source of progress. Scroll writes into a ref, the render loop reads and smooths it, and DOM overlays (phase markers, callouts, motion trail, project captions, exit fade) update from an `onFrame` callback. Scrolling never triggers a React render.

The story runs in five phases defined in `choreography.ts` (`PHASES`): arrival, reveal, orbit, presentation, final. To retime the animation, edit the keyframes there. Each channel (position, rotation, scale, lid, screen) has its own keys and is interpolated with a monotone cubic spline, so motion stays continuous without overshooting. Rotations stay within ±45°, so per-axis Euler interpolation has no wrap-around discontinuities. `profileFor()` scales travel, size and rotation for tablet, phone and short viewports.

The camera and lighting are choreographed the same way, as tracks in `choreography.ts`: a slow dolly-in with a slight orbit arc (`camera`), a focus pull that blurs the DOM background at the peak of the orbit (`camera.focus`), a moving sweep light, a screen glint and a rim-light flash at the reveal (`light`). The section is pulled up beneath the hero (`--hero-h`, see `styles/showcase.css`), so the pinned frame is in place from the first pixel of scroll: the headline lifts away while the laptop sweeps in. At the very top of the page the canvas renders on demand only (the laptop is out of frame), and shaders and screen textures are compiled and uploaded in idle time before the arrival starts. Under reduced motion there is no overlap and the static laptop sits in its own section.

## CI/CD

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every pull request and every push to `main`:

1. **verify**: lint, format check, typecheck.
2. **build**: static export with the GitHub Pages base path (`/portfolio`).
3. **deploy** (`main` only): publishes `out/` to GitHub Pages.

PR runs are cancelled when superseded; deployments are queued, never cancelled. Dependabot opens grouped weekly npm updates and monthly Actions updates.

### One-time setup

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.** The deploy job fails until this is set.
2. Optional: **Settings → Secrets and variables → Actions → Variables**, add any of the site variables below. The workflow passes them to the build.
3. Recommended: protect `main` and require the **Lint, format, typecheck** and **Build static site** checks.

## Configuration

All optional, read at build time. Set them in `.env.local` locally or as repository variables for CI. Anything unset is hidden; see `.env.example` for details.

| Variable                                            | Effect                                                                                                                             |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_FORM_ENDPOINT`                         | Contact form POSTs JSON here (Formspree, or Web3Forms with `NEXT_PUBLIC_FORM_ACCESS_KEY`), with sending, success and error states. |
| `NEXT_PUBLIC_CONTACT_EMAIL`                         | Email link; the form opens a mail draft when no endpoint is set, and offers email as the error fallback.                           |
| `NEXT_PUBLIC_BOOKING_URL`                           | "Book a call" on the contact page and footer.                                                                                      |
| `NEXT_PUBLIC_RESUME_URL`                            | "Download résumé" (a URL, or `/resume.pdf` from `public/`).                                                                        |
| `NEXT_PUBLIC_GITHUB_URL`, `_LINKEDIN_URL`, `_X_URL` | Social icons.                                                                                                                      |
| `NEXT_PUBLIC_SITE_URL`                              | Canonical URL for metadata, sitemap and JSON-LD (default: the GitHub Pages URL).                                                   |

Contact-page content (availability badge, city and time zone for the local-time line, budget ranges, timelines, FAQ) lives as plain fields in `data/site.ts`; each is empty by default and its UI stays hidden until filled.

With no endpoint and no email, the form saves the brief as a file on the visitor's device and says plainly that nothing was sent.

Share images are generated at build time into `out/og/*.png` (one generic, one per project) by `app/og/[image]/route.tsx`; `sitemap.xml` and `robots.txt` come from `app/sitemap.ts` and `app/robots.ts`.

### Base path

GitHub Pages serves this repository from `/portfolio`. `next.config.ts` reads `PAGES_BASE_PATH` (set by CI, empty locally). Next prefixes links automatically, but not `<Image>` sources, metadata icons, or WebGL texture URLs, so reference anything in `public/` through `asset("/path")` from `lib/asset.ts`.

## Content to confirm before public launch

`data/projects.ts` holds draft project descriptions, categories, and image paths. No project repositories, technology stacks, screenshots, deployment URLs, or contact email were supplied.

The four preview SVGs are original **illustrative interfaces**, visibly labelled as concept previews, and detail pages explain their status. Their sample readings are artwork, not real measurements. Replace them with authentic screenshots when available. Tags describe categories, not unverified technologies.

See [`docs/CONTENT_TODO.md`](docs/CONTENT_TODO.md) for the full list of owner-supplied content.

Do not publish invented testimonials, client logos, statistics, repository links, or project outcomes.

The site makes no external requests at runtime: fonts, lighting, and imagery are all bundled.
