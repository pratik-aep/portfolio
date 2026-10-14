# Build a Premium Interactive Portfolio Website — Full Implementation Instructions

## 1. Project Objective

Build a highly polished, professional, modern portfolio website for a software development team that develops websites, mobile applications, AI-powered solutions, and custom digital products for clients.

The website should showcase **our own projects and technical capabilities**, helping potential clients understand the quality of our work and encouraging them to contact us.

This is **NOT** a typical digital marketing agency website.

We want a premium, minimal, visually impressive developer portfolio with extraordinary scroll-driven animations, realistic 3D interactions, and excellent user experience.

**Important:** Build a functional, production-quality frontend. Do not create a static design, screenshot recreation, or mock animation.

Use the supplied visual reference as inspiration for typography, spacing, layout, hierarchy, and color palette. The implementation must incorporate the animation requirements below, which take priority over the static reference.

---

## 2. Technology Stack

Preferred technologies:

- Next.js with App Router
- React
- TypeScript
- Tailwind CSS
- GSAP with ScrollTrigger for scroll-based animation
- Three.js with React Three Fiber and Drei for the interactive laptop, if appropriate
- Lucide React for icons

You may use additional libraries when they materially improve the experience.

**Before implementing:** Inspect the existing repository. Reuse its current framework, dependencies, folder structure, and conventions wherever practical. Do not unnecessarily rebuild or replace an existing setup.

Use performant, maintainable and reusable React components.

## 3. Global Visual Design

### Color System

The entire website should have a clean, white-background design.

Primary palette:

- Main background: `#FFFFFF`
- Alternate subtle background: `#F8F9FA`
- Main text: `#111111`
- Secondary text: `#666666`
- Subtle borders: `#E9E9E9`
- Primary buttons: `#111111`
- Primary button text: `#FFFFFF`

No dark-themed sections on the homepage.

Dark colors may appear inside actual project screenshots and on the laptop screen.

Avoid neon gradients, excessive colored backgrounds, glassmorphism everywhere, or unnecessary visual effects.

### Typography

Use modern, premium typography, such as Geist, Inter, or another similarly refined sans-serif.

Typography requirements:

- Huge, bold hero headline
- Dark black text
- Excellent kerning and line height
- Minimal uppercase eyebrow labels with increased letter spacing
- Gray secondary descriptions
- Consistent typography hierarchy
- Generous white space

The visual impression should be similar to a premium technology product launch, with Apple-inspired restraint, careful spacing, sophisticated motion, and strong editorial hierarchy.

Do not copy Apple's branding.

### General Layout

- Maximum content width approximately 1280–1440px
- Responsive container margins
- Large section spacing
- Refined rounded corners
- Subtle borders rather than heavy shadows
- Highly consistent alignment
- Smooth visual transitions between sections

The website must look intentionally designed, not like a generic template.

---

# 4. Navigation Bar

Create a minimal navigation bar at the top.

Left: Our brand/logo placeholder.

Center or right: Home, Projects, About, Contact.

Far right: A black rounded rectangular button labeled "Let's Talk" with an arrow.

Behavior:

- Initially transparent or white
- Sticky navigation as the user scrolls
- Subtle background blur or white surface on scroll
- Thin bottom border when appropriate
- Smooth interactions on hover
- Fully responsive mobile navigation

Keep it compact and elegant.

---

# 5. Hero Section — First Screen

The hero is the first thing users see when opening the website.

**The initial screen should prominently feature centered text and large amounts of white space.**

Do not display the laptop prominently when the website first loads.

### Hero Layout

Center-align all hero content horizontally.

Small uppercase label:

"SOFTWARE DEVELOPMENT · DIGITAL EXPERIENCES"

Large headline:

**We build digital products  
that solve real problems.**

The headline should be extremely prominent.

Suggested desktop typography: approximately 64–88px depending on viewport width.

Text should be bold, modern, and black.

Make sure line breaks look intentional.

Subtitle:

"We turn ambitious ideas into beautifully designed websites, applications, and powerful digital solutions."

Keep the subtitle centered and limited to a comfortable text width.

Underneath, show:

"SCROLL TO EXPLORE"

And a minimal downward-pointing arrow with a subtle repeating motion.

### Initial Entry Animations

When the page loads:

1. Navigation fades into view.
2. Small eyebrow label appears.
3. Main headline reveals smoothly, preferably line by line.
4. Subtitle fades upward.
5. Scroll indicator appears last.

Animations should be sophisticated, subtle, and not excessively slow.

The laptop animation begins only when the user scrolls past the opening hero.

---

# 6. Main Feature — Advanced 3D Laptop Scroll Animation

**THIS IS THE MOST IMPORTANT PART OF THE WEBSITE.**

Create a large, realistic 3D laptop that moves and rotates dynamically based on scrolling.

The laptop must feel like a physical object floating in three-dimensional space.

It should rotate around multiple axes, change perspective, move through depth, and follow a varied cinematic trajectory.

### Important Motion Requirement

Do NOT make the laptop move along one constant diagonal line.

Do NOT use one simple left-to-right translation with a fixed rotation.

Do NOT display four ghosted laptop copies to fake an animation.

There must be **one continuously animated laptop**.

The laptop must rotate and move simultaneously based on scroll progress.

### 3D Transformations Required

Animate all relevant transforms:

- X position
- Y position
- Z position/depth
- Rotation around X axis
- Rotation around Y axis
- Rotation around Z axis
- Scale
- Perspective and subtle lighting changes where practical

The result must feel organic and cinematic.

The motion can look irregular and surprising, but it must be deterministic, smooth, carefully choreographed, and reversible.

It should never randomly jitter.

### Laptop Animation Timeline

The following is a conceptual motion sequence. Refine these values to achieve the best visual result.

**Phase 1 — Laptop Appears (0–20% progress)**

- Laptop begins outside the viewport near the bottom-left.
- It enters diagonally upward.
- It is relatively small initially.
- Strong perspective makes it appear tilted away from the viewer.
- Start with an X-axis rotation around 20–30 degrees.
- Start with a Y-axis rotation around -45 to -60 degrees.
- Add a modest Z-axis rotation.
- Smoothly increase its scale as it enters.

**Phase 2 — First Orbit (20–40%)**

- Laptop moves from the left toward the middle-right.
- Rotate its Y-axis toward the opposite direction.
- Tilt slightly backward using rotationX.
- Change rotationZ to create a floating, turning motion.
- Introduce a subtle rise in vertical position.
- Change apparent depth.

The laptop should not remain parallel to the camera.

**Phase 3 — Dynamic Three-Axis Movement (40–65%)**

This section should feel especially impressive.

- Laptop travels through a non-linear curved path.
- Its horizontal direction may briefly reverse.
- Rotate around X, Y, and Z simultaneously.
- Allow the viewer to see changing side and front perspectives.
- Vary the depth of the object.
- Use smooth acceleration and deceleration.
- Maintain realistic proportions.

Avoid repetitive symmetrical oscillation.

The laptop should feel like it is being professionally animated in 3D software rather than translated with a basic CSS animation.

**Phase 4 — Controlled Stabilization (65–85%)**

- Laptop moves toward the center of the viewport.
- Rotations gradually decrease.
- The screen becomes easier to see.
- Perspective becomes more front-facing.
- The laptop grows into a large, premium product showcase.

**Phase 5 — Final Presentation (85–100%)**

- Laptop arrives at its final large, nearly front-facing position.
- Keep a small perspective angle so it retains a realistic 3D appearance.
- Motion gradually stops.
- Laptop screen is clearly visible.
- It should feel like the conclusion of a product launch animation.

Once the user continues scrolling, the website transitions into the featured projects section.

### Scroll Control

The animation must be directly linked to scroll progress.

Use GSAP ScrollTrigger or a similarly robust solution.

Suggested structure:

- Create a scroll scene approximately 250–350vh tall on desktop.
- Use a sticky or pinned viewport container.
- Animate the laptop while the user naturally scrolls.
- Map the scroll progress to a multi-keyframe animation timeline.
- Use interpolation and easing between animation states.
- Ensure movement reverses correctly when the user scrolls upward.

**Do not implement a time-based animation that merely starts once the user scrolls.**

The scroll position must control the object's progress.

Do not hijack wheel scrolling or force the user through an unnatural scrolling system.

### Laptop Model

The laptop should look realistic and premium.

Requirements:

- Modern, slim aluminum design
- Properly modeled screen and keyboard
- Realistic bezel
- Display panel and base with correct proportions
- Subtle reflections and shadows
- Appropriate environmental lighting
- Clean gray/silver material
- No brand logo required

If the project already contains an appropriate 3D model, use it.

Otherwise, create a suitable original model using Three.js primitives or another appropriate implementation.

Do not make a flat rectangle with a screenshot pretend to be a 3D laptop.

Use physically believable geometry.

### Laptop Screen

The laptop screen must show a beautiful application interface.

Do not display the same generic analytics graph throughout the experience.

Show visually compelling UI related to our own work.

Potential screen presentations:

1. Lake Monitoring System — water monitoring dashboard
2. Antarctic Route Planner — map and route visualization
3. NASA Exoplanet Classifier — planetary analysis interface
4. Final presentation — the strongest available project screenshot

The laptop may smoothly change the screen content at carefully chosen scroll milestones.

Use crossfades or material transitions when switching screens.

Do not replace the entire laptop or break animation continuity.

Prefer actual project screenshots if they exist in the repository or provided assets.

If unavailable, create clean temporary placeholder interfaces and clearly identify the assets that need replacing.

### Animation Quality

Target a polished, cinematic experience.

Avoid:

- Excessive bouncing
- Jerky movement
- Constant repetitive rotation
- Laptop suddenly jumping positions
- Abrupt perspective changes
- Low-resolution screenshots
- Oversized blurry shadows
- Unnecessarily flashy particle effects

The motion should feel premium and intentional.

---

# 7. Transition From Laptop to Featured Projects

When the laptop completes its final rotation:

1. The laptop reaches its presentation position.
2. The user scrolls further.
3. The laptop subtly scales down, rises, or fades out.
4. The next section begins appearing below.
5. A large heading reveals smoothly.
6. The four main project cards enter with staggered animations.

Keep the transition visually continuous.

Avoid a harsh cut between the animation and the project section.

---

# 8. Featured Projects Section

This section immediately follows the laptop animation.

Background should remain white or an extremely subtle off-white.

Small centered eyebrow:

"FEATURED WORK"

Large centered heading:

**Selected projects. Real solutions.**

Description:

"A selection of the applications and platforms we've built, combining modern technology with thoughtful design."

### Project Layout

Display four main projects.

On large desktop screens, show four beautifully designed cards in one row if they remain visually readable.

On smaller screens, use a responsive two-column grid or one-column layout.

Project cards should include:

- Large high-quality screenshot
- Project title
- Short description
- Technology tags
- Minimal arrow icon
- Subtle hover animation

### Four Projects

**01 — Lake Monitoring System**

Description:

"An IoT-powered water quality monitoring platform with real-time sensor data and interactive visualizations."

Potential tags: IoT, React, Data Visualization

**02 — Antarctic Route Planner**

Description:

"An intelligent routing platform designed to visualize environmental conditions and plan safer routes across Antarctic waters."

Potential tags: Python, Geospatial, FastAPI

**03 — NASA Exoplanet Classifier**

Description:

"A machine learning application built to analyze planetary data and classify exoplanet candidates."

Potential tags: Python, Machine Learning, FastAPI

**04 — 3D Medical Simulation**

Description:

"An interactive 3D visualization experience designed to make anatomical exploration more immersive."

Potential tags: React, Three.js, 3D

Use actual project-specific technology details when they can be verified from existing source files.

### Card Styling

- White card background
- Very light gray border
- Rounded corners, approximately 14–18px
- Large preview images
- Comfortable spacing
- Black headings
- Gray descriptions
- Small neutral technology badges
- Minimal buttons and icons

### Card Animation

Cards should reveal as they enter the viewport.

Use a subtle combination of:

- Opacity
- Vertical translation
- Light staggered timing
- Image reveal or clipping
- Soft scaling

On hover:

- Card rises by a few pixels.
- Screenshot scales slightly.
- Arrow moves diagonally.
- Border or shadow becomes slightly more prominent.

Keep the effects refined.

### View Projects CTA

**Place the View Projects button BELOW all four featured project cards.**

This order is essential:

1. Hero headline
2. Scroll-controlled animated laptop
3. Featured projects heading
4. Four highlighted project cards
5. Centered View Projects button

Button text:

"View All Projects →"

Style:

- Black background
- White text
- Medium-large size
- Comfortable horizontal padding
- Rounded corners
- Subtle interactive hover effect

Link this button to `/projects`.

If the Projects route doesn't exist, create a simple functional route using the same design system so the button works.

---

# 9. Additional Interaction Details

Implement the following refinements when appropriate.

### Text Reveals

Use smooth text reveals for major headings.

Possible animations:

- Masked vertical text reveal
- Light staggered line transitions
- Opacity transition
- Subtle letter spacing transition

Keep text readable at all times.

### Buttons

Buttons should have elegant interactions:

- Arrow movement on hover
- Subtle background transition
- Accessible focus state
- Correct cursor and click behavior

### Scroll Indicator

The scroll indicator should subtly animate downward and stop being prominent once the laptop scroll section begins.

### Cursor

Use the standard cursor unless a custom pointer materially improves the design. Avoid distracting mouse trails.

### Scrolling

Use natural document scrolling.

Smooth scrolling may be added if it doesn't interfere with navigation, accessibility, or ScrollTrigger synchronization.

---

# 10. Responsive Design

The design must work beautifully on:

- Large desktop monitors
- 1440px laptops
- 1280px laptops
- Tablets
- Mobile phones

### Desktop

Use the full 3D laptop scroll experience.

The laptop should remain large enough to see clearly without obstructing critical text.

### Tablet

Reduce animation travel distance and object scale as needed.

Preserve the multi-axis rotation experience while adapting the scene to the viewport.

### Mobile

Do not simply shrink the desktop animation.

Create an adapted experience:

- Responsive hero headline
- Reduced 3D movement distance
- Smaller laptop
- Fewer or less extreme rotations
- Natural transition to vertically stacked project cards
- No horizontal overflow

If advanced WebGL effects perform poorly on low-powered devices, provide a graceful, visually attractive simplified version.

Honor `prefers-reduced-motion` by displaying a static final laptop pose or using minimal transitions.

---

# 11. Performance Requirements

Performance is critical.

- Target smooth scrolling and animation on modern desktop hardware.
- Avoid unnecessary React re-renders during scrolling.
- Keep animation state outside normal React rendering when practical.
- Use GPU-accelerated transforms.
- Clean up ScrollTrigger instances and animation contexts.
- Properly dispose of WebGL resources.
- Lazy-load large 3D assets where appropriate.
- Optimize screenshot image sizes.
- Use efficient Three.js rendering settings.
- Avoid heavy blur filters on moving elements.
- Use an appropriate device pixel ratio cap.
- Account for layout shifts when loading fonts and images.

The laptop animation should remain responsive to scroll direction and progress without stuttering.

---

# 12. Suggested Component Architecture

Organize the implementation into reusable components.

Suggested structure:

`components/layout/`
- Navbar
- Container
- SectionHeading

`components/home/`
- HeroSection
- LaptopScrollExperience
- FeaturedProjects
- ProjectCard

`components/3d/`
- LaptopModel
- LaptopScene
- LaptopScreen
- LightingEnvironment

`components/ui/`
- Button
- AnimatedText
- ScrollIndicator

`data/`
- projects.ts

`styles/`
- Global styling and design tokens

These are suggestions, not mandatory folder names.

Follow the existing repository architecture if it already provides suitable conventions.

Keep project details in structured data rather than hardcoding them in multiple components.

---

# 13. Functional Requirements

Every visible interactive element must work.

- Home navigation returns to homepage.
- Projects navigation goes to `/projects`.
- About and Contact should navigate or scroll to valid destinations.
- Let's Talk opens a real contact route, section, or configured email link.
- Project cards open the appropriate project detail route or functional preview.
- View All Projects opens `/projects`.

Do not invent live deployment URLs, GitHub links, client testimonials, collaboration claims, or numerical statistics.

Do not use fake client logos.

When a destination or asset has not been supplied, maintain an explicit placeholder in code and avoid presenting a dead or misleading link as functional.

---

# 14. Design Quality Checklist

The final design must satisfy the following:

- [ ] Pure white/light professional background
- [ ] Large center-aligned hero headline
- [ ] Premium black typography
- [ ] Generous spacing and refined visual hierarchy
- [ ] Minimal sticky navigation
- [ ] Smooth initial hero text reveal
- [ ] One realistic three-dimensional laptop
- [ ] Laptop initially off-screen
- [ ] Laptop enters from bottom-left
- [ ] Laptop moves across the scene as the user scrolls
- [ ] Laptop changes X, Y, and Z rotations
- [ ] Non-linear cinematic motion path
- [ ] Depth and scale changes
- [ ] Screen UI shows project-related content, not a constant generic graph
- [ ] Fully scroll-scrubbed, reversible animation
- [ ] Laptop settles into a final presentation pose
- [ ] Smooth transition to featured projects
- [ ] Four polished project preview cards
- [ ] View All Projects button below all four cards
- [ ] Fully responsive desktop, tablet, and mobile layouts
- [ ] Reduced-motion support
- [ ] Working navigation and meaningful interactions
- [ ] Good loading performance
- [ ] No unnecessary clutter or invented client credibility claims

---

# 15. Development Workflow

Follow this implementation sequence:

**Step 1:** Inspect the project and identify existing reusable components, styles, and assets.

**Step 2:** Establish the global design system, typography, spacing, and navigation.

**Step 3:** Build the centered hero section and initial reveal animation.

**Step 4:** Build the realistic 3D laptop model or integrate an appropriate existing one.

**Step 5:** Implement the scroll-driven multi-axis laptop timeline.

**Step 6:** Integrate project interface screenshots onto the laptop screen.

**Step 7:** Implement the transition from the final laptop pose to the projects section.

**Step 8:** Build four featured project cards with interactive hover effects.

**Step 9:** Add the View All Projects button beneath the cards.

**Step 10:** Implement responsive adaptations, accessibility, loading states, and performance improvements.

**Step 11:** Run available build, lint, type-check, and relevant tests. Fix issues found and verify the scroll behavior at multiple viewport sizes.

Do not stop after building the initial hero. Complete the full homepage interaction.

---

# 16. Final Design Direction

The website should feel like a premium, minimal software development portfolio.

Visual personality:

**Clean. Modern. Precise. Cinematic. Professional. Interactive.**

The experience should follow this narrative:

"The visitor first discovers what we build, then sees an impressive 3D demonstration of our design and technical capability, then explores four real projects, and finally gets a clear invitation to view the complete portfolio."

The laptop animation should be the signature interaction that differentiates this website.

**Final requirement: Do not sacrifice usability, clarity, or performance for visual effects. The result should feel like a real premium digital product, not an animation experiment.**

Start implementation now. Make reasonable technical decisions independently, explain important tradeoffs in the final development summary, and provide a working production-ready implementation.
