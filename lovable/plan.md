# Alex Rivera Portfolio — Build Plan

A single-page, dark cyber-minimalist portfolio with all sections you specified. Built as a new web app using the default TanStack Start template.

## Design tokens

- Background: `#0A0A0A` with subtle grid/scanline texture
- Accents: cyan `#00F5FF`, magenta `#FF00AA`, purple `#C026D3`
- Typography: Space Grotesk (headings), Inter (body)
- Glassmorphism surfaces, neon glows, soft purple shadows
- All colors wired through `index.css` HSL tokens + Tailwind theme (no hardcoded hex in components)

## Sections (single page, smooth-scroll anchors)

1. **Fixed Nav** — "AR" logo with glow, center links (Home/About/Projects/Skills/Journey/Writings/Contact), right "View Resume" neon button + theme toggle. Becomes blurred glass on scroll.
2. **Hero** — Full viewport. Animated particle canvas (binary rain + neural-net lines in cyan/magenta), typed "Alex Rivera" headline, subtitle, tagline, glowing "Explore My Work" CTA with ripple, floating holographic orb, scroll arrow.
3. **About** — Split: AI-generated portrait left, bio + 4 glowing stat cards right (8+ yrs, 50+ projects, 15 OSS, 2 patents).
4. **Skills** — Hexagonal/orb grid grouped by Languages, Frameworks, AI/ML, Tools. Proficiency rings fill on scroll-in. Hover reveals description.
5. **Featured Projects** — Masonry grid with 4 cards (NexusAI, QuantumVault, EchoFlow, NeuraTrade). Each: generated thumbnail, title, description, tech pills, "Live Demo" + "View Case Study" buttons. Click opens detailed modal with metrics and screenshots.
6. **Journey Timeline** — Vertical timeline, glowing nodes, expandable entries (company, role, dates, achievements).
7. **Writings** — Grid of 3–4 article cards with cover images and reading time.
8. **Testimonials** — Auto-rotating carousel with quote, name, role, avatar.
9. **Contact** — "Let's Build Something Legendary" headline, glassmorphic form (name/email/message), pulsing social icons (GitHub, X, LinkedIn, Discord), Singapore/Remote location. Form is presentational (no backend).
10. **Footer** — Minimal, copyright + "Made with passion and 10,000+ lines of clean code".

## Animation & interaction

- Scroll-triggered reveals via Intersection Observer + Tailwind transitions
- Hover micro-interactions (glow, lift, ripple) on every interactive element
- Typed-text effect in hero (lightweight custom hook, no heavy dep)
- Particle canvas in hero (vanilla `<canvas>`, capped at 60fps, paused off-screen)
- Subtle parallax on hero orb

## Assets

Generated via image tool, saved to `src/assets/`:
- 1 portrait (Alex Rivera)
- 4 project thumbnails (NexusAI dashboard, QuantumVault vault UI, EchoFlow IDE, NeuraTrade charts)
- 3 article covers
- 4 testimonial avatars (or use initials in styled circles to save generation cost)

## Tech notes

- Stack: TanStack Start template (scaffolded via `add_artifact web_app:portfolio`)
- All components in `src/components/portfolio/`, composed in the index route
- Fully responsive: hamburger nav under `md`, stacked sections, touch-friendly tap targets
- SEO: proper `<title>`, meta description, single H1 ("Alex Rivera"), semantic landmarks, alt text on every image
- Dark/light toggle wired to a `dark` class on `<html>`; light mode is a tasteful inverted variant (not the focus)

## Out of scope

- Real backend, real resume PDF, real blog content, working contact submissions — all placeholder/presentational
- Three.js / WebGL 3D laptop (using CSS/canvas holographic orb instead for performance)

Ready to build on approval.