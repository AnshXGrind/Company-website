# 🚀 LAUNCIFY — FUTURE DEVELOPMENT ROADMAP

> Save this file in your repo root. Paste it at the start of any AI chat to give full context.
> GitHub: <https://github.com/AnshXGrind/Company-website>
> Live: <https://launcify.vercel.app>

---

## 🏢 WHAT IS LAUNCIFY?

Launcify is a multi-service agency offering:

- **AI Tools & Integration** — building and deploying AI-powered solutions for businesses
- **Web Development** — custom websites and web apps
- **Automation** — workflow automation, no-code/low-code, process optimization

**Two core goals of the website:**

1. **Convert visitors → booked discovery calls** (primary CTA everywhere)
2. **Build trust** — showcase work, team, process, and results so clients feel confident

---

## ✅ PHASE 0 — Bug Fixes & Foundation (CURRENT)
>
> See `LAUNCIFY_MASTER_PROMPT.md` for full details

- [ ] Fix Vercel 404 deployment issue
- [ ] Fix all broken internal links
- [ ] Fix all JavaScript errors across every page
- [ ] Consolidate design system (CSS variables, button styles)
- [ ] Fix mobile responsiveness
- [ ] Clean up duplicate/orphaned pages
- [ ] Fix folder structure (pages/, css/, js/)

---

## 📋 PHASE 1 — Trust & Conversion (Build next)

### 1A. Pricing Page (`/pages/pricing.html`)

**Purpose:** Remove hesitation, qualify leads before the call

**Must include:**

- 3 tiers: Starter / Growth / Enterprise (or equivalent)
- Each tier shows: price or "Starting from", list of deliverables, CTA button → booking page
- A "Not sure which plan?" section → links to free discovery call
- FAQ accordion below pricing cards (common objections)
- "All plans include" section (e.g. dedicated support, NDA, etc.)

**Design notes:**

- Highlight the middle/recommended tier with a glowing border or badge
- Use the same dark/futuristic aesthetic as the rest of the site
- Animate cards in on scroll with IntersectionObserver

---

### 1B. Case Studies / Portfolio Detail Pages (`/pages/case-studies/`)

**Purpose:** The #1 trust builder — real proof of work

**Structure:**

- `/pages/case-studies/index.html` — grid of all case studies (filterable: AI / Web Dev / Automation)
- `/pages/case-studies/[project-name].html` — individual case study page

**Each case study page must include:**

- Client industry + project type (tag)
- The Problem (what the client was struggling with)
- The Solution (what Launcify built)
- The Results (metrics: "reduced time by 60%", "increased revenue by 2x", etc.)
- Tech/tools used (logos/badges)
- Testimonial quote from client (if available)
- CTA at bottom: "Want results like this? Book a call →"
- Before/after screenshots or demo video embed

**Design notes:**

- Cards on index page: image, title, industry tag, one-line result stat
- Individual pages: full-width hero image, then scrollable sections
- Add a "Related case studies" section at the bottom

---

### 1C. Revamp Homepage (`index.html`) for Conversion

**Purpose:** Every section should push toward booking a call

**Hero section:**

- Headline: Clear value prop (e.g. "We Build AI, Automation & Web Solutions That Grow Your Business")
- Sub-headline: one sentence on who you serve
- Primary CTA: "Book a Free Discovery Call" → schedule page
- Secondary CTA: "See Our Work" → case studies
- Animated background (hyperspeed/starfield — already exists, just fix it)
- Flip-words animation on a key phrase

**Social proof bar (below hero):**

- Logos of clients/industries served OR metrics ("10+ clients", "5 countries", etc.)

**Services section:**

- 3 cards: AI Tools / Web Dev / Automation
- Each with icon, 2-line description, "Learn more →" link

**How it works section (3 steps):**

1. Book a free call
2. We build your solution
3. You grow

**Case studies preview:**

- Show 2-3 featured case studies
- "See all work →" button

**Testimonials section:**

- 3 client quotes with name, company, photo (or avatar)

**Final CTA section:**

- Big bold CTA: "Ready to build something great?" + Book Call button

---

## 📋 PHASE 2 — Content & SEO

### 2A. Blog / Articles Section (`/pages/blog/`)

**Purpose:** Drive organic traffic, establish authority, build trust

**Structure:**

- `/pages/blog/index.html` — grid of articles (filterable: AI / Automation / Web Dev / Business)
- `/pages/blog/[article-slug].html` — individual article page

**Each article page:**

- Title, date, author, category tag
- Estimated read time
- Table of contents (sticky sidebar on desktop)
- Article body with proper heading hierarchy
- Author bio card at bottom
- Related articles (3)
- CTA at bottom: "Want help implementing this? Talk to us →"

**Content ideas to write first:**

- "5 Ways AI Can Automate Your Business in 2025"
- "Why Every Business Needs a Custom Web App (Not Just a Website)"
- "How We Saved a Client 20 Hours/Week With Automation"
- "The Difference Between AI Tools and AI Integration"

**SEO requirements for every blog post:**

- Unique `<title>` and `<meta description>`
- Open Graph tags for social sharing
- Structured data (Article schema)
- Fast load time (no heavy JS on blog pages)

---

### 2B. Services Detail Pages

**Purpose:** Deep-dive on each service for SEO + trust

Create individual pages for each service:

- `/pages/services/ai-tools.html`
- `/pages/services/web-development.html`
- `/pages/services/automation.html`

Each page:

- What it is, who it's for, what you get
- Process/timeline
- Related case studies
- Pricing teaser (link to pricing page)
- FAQ specific to that service
- CTA: Book a call

---

## 📋 PHASE 3 — Client Portal (Biggest feature)

### 3A. Client Dashboard (`/portal/`)

**Purpose:** Connect Launcify with active clients — project updates, files, communication

**Features (MVP):**

- Login / Signup (auth via Supabase or Firebase — free tier)
- Dashboard home: active projects, recent updates
- Project status tracker (phases: Discovery → Design → Development → Review → Live)
- File sharing (client uploads briefs, Launcify uploads deliverables)
- Messaging / notes thread per project
- Invoice history (link to Stripe or just PDF uploads)

**Tech recommendation:**

- Frontend: Keep vanilla JS or upgrade to a lightweight framework (Alpine.js or Vue)
- Backend: Supabase (free, has auth + database + storage built in)
- Hosting: Keep Vercel

**Pages to build:**

- `/portal/login.html`
- `/portal/signup.html`
- `/portal/dashboard.html`
- `/portal/project.html` (individual project view)
- `/portal/files.html`
- `/portal/messages.html`

**Design notes:**

- Portal should feel like a SaaS product, not a marketing site
- Use a sidebar layout (different from main site nav)
- Keep dark theme consistent with main site

---

## 🎨 DESIGN SYSTEM RULES (Apply to all new pages)

```css
/* Always use these variables — never hardcode colors */
:root {
  --color-bg: #0a0a0a;
  --color-surface: #111111;
  --color-border: #222222;
  --color-primary: /* your brand color */;
  --color-accent: /* your accent color */;
  --color-text: #f0f0f0;
  --color-text-muted: #888888;
  --font-heading: /* your heading font */;
  --font-body: /* your body font */;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --transition: 0.3s ease;
  --shadow: 0 4px 24px rgba(0,0,0,0.4);
}
```

**Spacing system:** Use multiples of 8px (8, 16, 24, 32, 48, 64, 80, 96, 128)

**Typography scale:**

- Hero heading: `clamp(2.5rem, 6vw, 5rem)`
- Section heading: `clamp(1.8rem, 4vw, 3rem)`
- Body: `1rem` / `1.6` line-height
- Small/caption: `0.875rem`

**Button system:**

- `.btn-primary` — filled, brand color, used for main CTAs
- `.btn-secondary` — outlined, used for secondary actions
- `.btn-ghost` — text only, used for tertiary links
- All buttons: `border-radius: var(--radius-sm)`, `transition: var(--transition)`

**Animation rules:**

- All scroll animations: `IntersectionObserver`, `threshold: 0.15`
- Respect `prefers-reduced-motion`
- No layout shifts from animations (always animate `opacity` + `transform`, never `height`/`width`)

---

## 📅 SUGGESTED BUILD ORDER

| Phase | What to build | Why |
|-------|--------------|-----|
| 0 | Fix all bugs (see master prompt) | Nothing else matters if site is broken |
| 1A | Pricing page | Quick win, helps convert visitors |
| 1B | Case studies index + 2-3 detail pages | Biggest trust builder |
| 1C | Homepage revamp | Tie everything together |
| 2B | Services detail pages | SEO + depth |
| 2A | Blog (3-5 articles) | Long-term traffic |
| 3A | Client portal MVP | Retain and wow existing clients |

---
