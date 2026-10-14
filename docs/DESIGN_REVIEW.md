# Portfolio design review

Reviewed on 14 October 2026.

## Sources and scope

- Visual reference: `design-reference.png` (1024 × 1536 px).
- Requirements: `IMPLEMENTATION_PROMPT.md`, preserved unchanged from the supplied text attachment.
- At review time, the folder contained only the reference image. There was no application source, package manifest, 3D model, or separate project screenshot asset.

This is a review of the supplied design against the prompt. Animation, responsiveness, accessibility, performance, and working links cannot be verified from a static image. The prompt's implementation instructions are retained for future development; this review does not constitute a website implementation.

## Overall assessment

The reference provides a strong visual direction: restrained white surfaces, large centered black typography, generous spacing, compact navigation, and consistent project cards. Preserve that foundation. The prompt deliberately changes parts of the reference, especially the laptop choreography, team voice, and project-button placement. Where they differ, follow the prompt.

## What to preserve

- The centered, two-line hero with a clear headline-to-description hierarchy.
- The white/light palette, subtle borders, neutral badges, and restrained black buttons.
- The compact navigation and prominent “Let's Talk” action.
- The silver laptop's physical proportions, keyboard, bezel, and modest final perspective.
- The four distinct project subjects and image-led card layout.
- The consistent alignment and generous separation between major sections.

## Required changes from the reference

| Priority | Reference observation                                                                                       | Required implementation decision                                                                                                                                                                                   |
| -------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Critical | “View Projects” sits between the featured heading and project cards.                                        | Place “View All Projects →” below all four cards and link it to `/projects`.                                                                                                                                       |
| Critical | Four laptop poses are drawn along a largely diagonal progression.                                           | Treat these as storyboard frames. Render one persistent 3D laptop and drive a curved, varied trajectory through position, depth, scale, and all three rotation axes. Never reproduce the four simultaneous copies. |
| High     | The scroll explanation describes movement from left to right; the illustrated final pose sits on the right. | Include direction variation during the middle of the sequence and settle the laptop near the center, as specified in the prompt.                                                                                   |
| High     | The hero says “I build”; supporting text refers to “my work.”                                               | Use the team voice throughout, including “We build digital products / that solve real problems.”                                                                                                                   |
| High     | The eyebrow says “SOFTWARE DEVELOPER & PROBLEM SOLVER.”                                                     | Use “SOFTWARE DEVELOPMENT · DIGITAL EXPERIENCES.”                                                                                                                                                                  |
| High     | The featured heading says “Explore a selection of my work.”                                                 | Use “Selected projects. Real solutions.” and the supplied team-oriented description.                                                                                                                               |
| High     | Numbered labels, dashed arrows, and “Final state” notes explain the motion.                                 | Treat these as design annotations. Omit them from the visitor experience. The explanatory scroll-section copy is optional, not a requirement, and must not obstruct the laptop.                                    |
| High     | Project technology badges differ from the prompt's suggested tags.                                          | Neither source verifies the actual technology stacks. Keep project metadata provisional until source code or owner-provided details confirm it.                                                                    |
| High     | Project previews and screen interfaces are embedded in one composite image.                                 | Obtain separate screenshots or create clearly documented temporary UI assets. The composite is a visual reference, not a production screenshot library or a laptop model.                                          |

## Recommended homepage structure

1. **Sticky navigation:** brand placeholder, Home, Projects, About, Contact, and “Let's Talk.”
2. **Opening hero:** centered eyebrow, supplied team headline and subtitle, then “SCROLL TO EXPLORE.” Keep the laptop outside the initial viewport.
3. **Laptop scroll scene:** approximately 250–350vh on desktop with a pinned or sticky viewport and one realistic 3D laptop.
4. **Continuous transition:** settle the laptop into its final presentation, then ease it away as featured work enters.
5. **Featured work:** centered eyebrow, supplied heading and description, followed by four cards.
6. **Portfolio action:** centered “View All Projects →” beneath the complete card grid.
7. **Valid About and Contact destinations:** add sections or routes so navigation and the contact action work.

Keep the scene length adjustable after testing. The original image does not establish viewport heights or scroll distances.

## Laptop choreography and implementation notes

Use one model with proper base, display, keyboard, bezel, and silver materials. A Three.js model built from primitives is acceptable if no suitable asset is provided; a flat screenshot plane alone does not meet the brief.

| Scroll progress | Intended motion                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------- |
| 0–20%           | Enter from below the bottom-left edge, initially small, tilted away, with increasing scale.         |
| 20–40%          | Move toward the middle-right while changing yaw, pitch, roll, height, and depth.                    |
| 40–65%          | Follow a curved path with a brief horizontal direction change and simultaneous three-axis rotation. |
| 65–85%          | Move toward the center, reduce rotations, and make the screen increasingly readable.                |
| 85–100%         | Settle into a large, nearly front-facing presentation with a small remaining perspective angle.     |

These are choreography targets, not tested animation values. Map native scroll progress to a scrubbed timeline so scrolling upward reverses the same motion. Do not launch a timed sequence on the first scroll event or hijack the wheel.

Change screen content at selected milestones using project-specific interfaces and crossfades while preserving model continuity. Lake Monitoring, Antarctic Route Planner, and NASA Exoplanet Classifier are the supplied candidates; choose the final screen once actual assets are available.

Animate object properties without triggering React rendering on every scroll event. Clean up GSAP contexts and ScrollTriggers, dispose of owned WebGL resources, cap device pixel ratio, and defer heavy scene loading while retaining stable layout dimensions.

## Responsive and accessibility review

The reference shows one composition, so mobile and tablet layouts still need to be designed and verified.

- Use four columns only when screenshot previews, descriptions, and badges remain readable. Use two columns on narrower desktop/tablet layouts and one on mobile.
- Let card heights accommodate wrapping technology badges and longer descriptions without crowding the arrow action.
- Reduce laptop travel and rotation on mobile rather than uniformly shrinking the desktop scene. Keep it inside the viewport with no horizontal overflow.
- Provide a static final laptop pose for reduced-motion preferences and an attractive fallback when WebGL is unavailable or unsuitable.
- Keep visible text in accessible HTML. Decorative canvas content should not replace project information or navigation.
- Verify contrast for the pale eyebrow labels and gray secondary copy; the image alone is insufficient to certify contrast ratios.
- Include keyboard focus styles, descriptive project links, meaningful image alternatives, and an accessible mobile menu.
- Check that the sticky navigation does not obscure anchor destinations or keyboard-focused content.

## Content and assets still needed

| Item                    | Current evidence                                                      | Action                                                                                      |
| ----------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Brand and team identity | A small symbol in the reference; no confirmed name or brand files.    | Keep identity explicitly configurable until supplied.                                       |
| Project screenshots     | Four previews within the composite image only.                        | Supply original high-resolution images or label temporary assets in code and documentation. |
| Project descriptions    | Draft copy supplied in the prompt.                                    | Use as draft content; confirm factual project capabilities before launch.                   |
| Technology stacks       | Conflicting proposed tags in the image and prompt; no project source. | Verify before presenting as established facts.                                              |
| Project destinations    | No detail routes, repository links, or live URLs supplied.            | Build local detail/preview routes; do not invent external links.                            |
| Contact destination     | No email address or contact endpoint supplied.                        | Provide a valid contact section or route; configure real contact details before launch.     |
| Laptop model            | Rendered depiction only.                                              | Build original geometry or integrate an appropriate supplied model.                         |

Do not extract the illustrated dashboard's statistics, generic screen branding, or claims into portfolio credibility statements. They are reference artwork, not evidence of project results.

## Suggested implementation sequence

The preferred stack in the prompt is Next.js App Router, React, TypeScript, Tailwind CSS, GSAP/ScrollTrigger, React Three Fiber/Drei, and Lucide. No existing framework was found in this folder. Inspect it again before development in case source files have since been added.

1. Establish typography, colors, spacing, navigation, and structured project metadata.
2. Build the centered hero and its restrained entry reveal.
3. Create the laptop model, lighting, and project screen assets.
4. Implement and tune the five-phase reversible scroll timeline.
5. Build the laptop-to-project transition, four cards, and CTA below the grid.
6. Add `/projects`, meaningful project destinations, and valid About/Contact navigation.
7. Adapt tablet/mobile behavior and add reduced-motion and WebGL fallbacks.
8. Run build, type-check, and lint checks available in the resulting project; verify interactions in a browser.

## Acceptance checks for the future build

- [ ] White/light homepage with the supplied centered team hero.
- [ ] Laptop absent from the opening viewport and entering from bottom-left on scroll.
- [ ] Exactly one laptop with believable geometry and varied multi-axis motion.
- [ ] Scroll position controls progress, including reverse scrolling.
- [ ] Project-specific screen content transitions without replacing the model.
- [ ] Final laptop presentation is centered and transitions smoothly into featured work.
- [ ] Four project cards followed by “View All Projects →”.
- [ ] `/projects`, project destinations, navigation, and contact actions work.
- [ ] No storyboard annotations, invented client claims, or unverified live URLs.
- [ ] Readable, overflow-free layouts at representative widths such as 375, 768, 1280, 1440, and 1920px.
- [ ] Keyboard navigation, reduced motion, and WebGL failure handled.
- [ ] Loading, scroll responsiveness, resource cleanup, and production checks verified on the implementation.

None of these implementation checks are marked complete because this folder currently contains a design reference rather than a runnable application.
