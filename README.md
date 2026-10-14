# forgeD portfolio

A complete light-themed software development portfolio built from the supplied prompt and reference. The original prompt and design review are in the parent folder.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm ci
npm run dev -- --port 3107
```

Open `http://localhost:3107`. The port avoids another application already running on 3000 in the original workspace.

```sh
npm run typecheck
npm run build
```

The production build statically exports to `out/`. Serve that folder through an HTTP server; opening the HTML directly from disk does not support client routing or asset loading correctly.

## What is implemented

- Next.js App Router, TypeScript, React, Tailwind CSS, locally bundled Inter, GSAP/ScrollTrigger, Three.js, React Three Fiber, Drei, and Lucide.
- A centered hero, sticky desktop/mobile navigation, and restrained entrance reveals.
- One modeled laptop with screen, base, bezel, camera, hinge, keyboard, trackpad, speakers, and ports.
- A five-phase native-scroll timeline animating position, depth, scale, pitch, yaw, roll, lighting, and project-screen crossfades. Reverse scrolling reverses the sequence.
- A 340vh desktop scene and adapted 250vh mobile scene. The canvas renders on demand, caps DPR at 1.6, and loads as the scene approaches.
- System reduced-motion support, a visitor motion control, and a non-WebGL fallback.
- Four featured cards with the portfolio button beneath them; `/projects/` and four statically generated detail routes.
- About and Contact sections, keyboard focus treatment, a skip link, mobile navigation with Escape dismissal, and local form validation.
- A functional local project-brief download. With a verified contact email configured, it opens a prepared email draft instead.

## Content to confirm before public launch

`data/projects.ts` contains the brand, draft project descriptions, project categories, and image paths. No actual project repositories, technology stacks, screenshots, deployment URLs, or contact email were supplied.

The four preview SVGs are original **illustrative interfaces**, visibly labeled as concept previews. Detail pages also explain their status. Their sample readings are artwork, not verified project measurements. Replace these with authentic project screenshots when available. Project tags describe categories rather than claiming unverified implementation technologies.

Set `NEXT_PUBLIC_CONTACT_EMAIL` in `.env.local` or your build environment and rebuild when a verified address is available. The form never claims to send a message; without an address, it only downloads a text brief on the visitor's device.

Do not publish invented testimonials, client logos, statistics, repository links, or project outcomes.

## Asset and component locations

| Location | Purpose |
| --- | --- |
| `components/LaptopExperience.tsx` | Model geometry, screen shader, scroll choreography, reduced-motion and WebGL fallbacks. |
| `components/Home.tsx` | Hero and homepage section composition. |
| `components/Projects.tsx` | Reusable project cards and featured section. |
| `components/Contact.tsx` | Brief builder and optional email-draft action. |
| `components/Layout.tsx` | Wordmark, navigation, mobile menu, footer. |
| `components/Motion.tsx` | Scroll reveals with motion preference handling and cleanup. |
| `app/globals.css` | Visual tokens, layout, interaction styling, and responsive rules. |
| `data/projects.ts` | Shared project and site metadata. |
| `scripts/create-previews.mjs` | Reproducible original preview artwork (`npm run assets`). |
| `public/previews/` | Four generated SVG interfaces; also used as laptop textures. |
| `.openai/hosting.json` | Sites identity and static export directory. |

## Deployment

The site uses a static export because the requested portfolio does not require a server, database, or message delivery service. The hosting manifest declares `out/`; every project detail page is generated at build time. Source and assets are packaged with the Sites workflow, with access private by default.

The site needs no external font requests, HDR downloads, model downloads, stock imagery, or external API calls at runtime.
