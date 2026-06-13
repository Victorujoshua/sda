# CLAUDE.md — SDA Platform

> Read this file at the start of every session before touching any code.
> If anything here conflicts with build.md, stop and ask. build.md wins.
> This file does not change during the build. build.md tracks progress.

---

## What this project is

**SDA** — micro angel investment platform for early-stage Nigerian businesses.
Repositioning sda.ng from personal finance coaching into a serious capital platform.

One codebase. One database. Three roles.

| Role | Core job |
|---|---|
| Applicant | Applies for funding, uploads documents, tracks status |
| Investor | Browses deal summaries publicly; full details after login; expresses interest |
| Admin | Reviews applications, approves/rejects, blacklists, promotes to deals, manages all content |

---

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 App Router + TypeScript | RSC by default; client components only when needed |
| Database + Auth | Supabase (Postgres + Auth) | RLS enforced; service role for admin mutations only |
| File Storage | Supabase Storage | Private buckets only — no public URLs ever |
| Email | ZeptoMail | Transactional only — verify syntax before coding |
| Styling | Tailwind CSS + shadcn/ui | Custom tokens override defaults — resolve v4 shadcn issue before Section 3 |
| UI Components | 21st.dev Magic MCP | `/ui [description]` in Claude Code — always override with SDA tokens after generation |
| Design intelligence | UI-UX-Pro max skill | Loaded as Claude Code skill — reference for all layout and spacing decisions |
| Forms | React Hook Form + Zod | Validation server-side AND client-side |
| Hosting | Vercel | Auto-deploy from GitHub |

**Do not add libraries outside this list without flagging it first.**

---

## Route Map

```
app/
├── (marketing)/          ← public pages, SSG/ISR, no auth required
│   ├── page.tsx          /
│   ├── about/            /about
│   ├── portfolio/        /portfolio
│   ├── investors/        /investors
│   ├── apply/            /apply  (landing — not the form)
│   ├── faq/              /faq
│   ├── privacy/          /privacy
│   ├── terms/            /terms
│   └── risk-disclosure/  /risk-disclosure
│
├── (app)/                ← authenticated users (applicant + investor)
│   ├── dashboard/        /dashboard
│   ├── dashboard/apply/  /dashboard/apply  (multi-step form)
│   └── opportunities/    /opportunities + /opportunities/[id]
│
├── (admin)/              ← admin only, role=admin gate in middleware
│   ├── admin/            /admin  (metrics dashboard)
│   ├── admin/applications/
│   ├── admin/deals/
│   ├── admin/portfolio/
│   └── admin/users/
│
├── login/                /login
├── signup/               /signup
├── forgot-password/      /forgot-password
└── reset-password/       /reset-password
```

---

## Brand Tokens

These are defined in `globals.css` and `tailwind.config.ts`. Do not hardcode hex values — reference the tokens.

```css
--ink:     #0A0A0A    /* page text, buttons */
--paper:   #FAFAF8    /* page background (light pages) */
--accent:  #1A3D2F    /* deep forest green — CTAs, links, trust signals */
--muted:   #6B6B6B    /* secondary text */
--border:  #E5E4DF    /* dividers */
--surface: #F2F1EC    /* cards, section fills */
--success: #2D6A4F
--warning: #B45309
--danger:  #991B1B

/* Font stacks */
--sr: 'Sora', system-ui, sans-serif;
--in: 'Inter', system-ui, sans-serif;

/* Marketing pages use dark bg */
/* Page bg on homepage and marketing: #0A0A0A */
/* Pull quote section: #0d120e */
/* Ticker strip: #0d0d0b */
```

If the client provides a logo or brand color, swap `--accent` only. Do not change any other token without flagging it.

---

## Typography Rules

| Element | Font | Size | Weight | Notes |
|---|---|---|---|---|
| Hero h1 | Sora | 52–58px | 300 | line-height 1.06–1.08, letter-spacing -0.025em |
| Section h2 | Sora | 38–42px | 300 | line-height 1.12, letter-spacing -0.02em |
| Small h2 | Sora | 28–32px | 300 | letter-spacing -0.01em |
| Card / label heading | Sora | 15–22px | 300–400 | context-dependent |
| Nav logo | Sora | 18–20px | 600 | |
| Footer logotype | Sora | ~120px | 600 | fills footer width |
| Stats / pull quotes | Sora | 32–48px | 300 | no italic |
| Body copy | Inter | 13–16px | 400 | line-height 1.7 |
| Buttons / nav links | Inter | 12–13px | 400–500 | letter-spacing 0.03–0.04em |
| Section eyebrow | Inter | 10–11px | 400 | uppercase, letter-spacing 0.12–0.14em |
| Tags / labels | Inter | 9–11px | 400–500 | uppercase where used as badges |

### The one rule that must not be broken

**Sora has no true italic. Never use `font-style: italic` on any Sora element.**

Emphasis inside a Sora heading uses:
```css
font-style: normal;
font-weight: 300;
color: rgba(255, 255, 255, 0.45);
```

Apply this to `<em>` spans inside headings. Never let the browser synthesise an italic.

---

## Design Rules (locked for V1)

- **Zero border-radius** on buttons, inputs, or containers — except avatar circles (`border-radius: 50%`)
- **Zero box-shadow** anywhere
- **Zero gradients** on UI elements — only used as dark textured overlays on section backgrounds
- **Dividers are 1px lines** — `rgba(255,255,255,0.1)` on dark bg, `var(--border)` on light bg
- **No card lift / hover shadows** — hover states use background opacity shifts only
- **Light mode locked** in root layout. No `ThemeProvider`. No system preference. No dark mode classes
- **No Tailwind arbitrary values for rgba** — write explicit CSS or use CSS modules
- **Ticker strip is the only animation** — no other motion on the page

### Button system

```
Primary:  bg #FAFAF8 · color #0A0A0A · no border · no radius · padding 10–13px 22–28px
          Inter 12–13px · letter-spacing 0.04em · hover bg #e8e6e0

Ghost:    bg transparent · color #FAFAF8 · border 1px rgba(255,255,255,0.25)
          no radius · same padding · hover border rgba(255,255,255,0.55)

Nav CTA:  bg #1A3D2F · color #FAFAF8 · no radius · padding 8–9px 18–20px
          Inter 12–13px · hover bg #244d3c

Accent:   bg #1A3D2F (same as nav CTA) — used for tags, badges, markers
```

---

## Homepage Layout Reference

The homepage follows the **Bain Capital Ventures** layout template.
Screenshot saved at `docs/bcv-reference.png`.

**Section order (must match exactly):**

1. Nav
2. Hero — 2-col, headline + CTAs left, dark visual panel right
3. Ticker strip — scrolling portfolio + funding types
4. Spotlight — large featured story left + 3 stacked cards right
5. Approach — eyebrow + h2 + accordion rows left + globe illustration right
6. Pull quote — full-bleed `#0d120e` band, large quote + attribution
7. Portfolio grid — oversized bleed word + "Meet our portfolio." + 3 company cards
8. Portfolio feature — founder quote left + company list right
9. Email signup — minimal input + arrow
10. Footer — massive "SDA" logotype + nav column + legal row

After building the homepage, screenshot at 1280px and compare against `docs/bcv-reference.png`. Fix all structural gaps before marking done.

---

## Security Rules (non-negotiable)

### Document storage
- All financial documents go into **private** Supabase Storage buckets: `financial-records` and `bank-statements`
- **Never** generate or expose a public URL for any document
- Documents are served only via **server-generated signed URLs**, valid 10 minutes, created server-side, accessible to admins only
- If any document URL is reachable while logged out — that is a critical bug. Stop and fix before proceeding

### Auth and permissions
- **All writes go through server actions** — never client-side DB calls for mutations
- **Admin mutations use the Supabase service role** in server actions — never the anon key
- **Never trust client-side role checks** for access control — middleware and server actions are the authority
- `details_gated` column on `deals` table must never appear in any response to logged-out users — enforce at query level, not just RLS

### Blacklisting
- Blacklisted users (`is_blacklisted = true`) cannot insert new applications
- This is enforced by a DB trigger AND checked in the server action — both layers

---

## Database Rules

- **Show migration SQL before applying** — never run a destructive migration without approval
- **Never expose raw Storage file paths to the client** — only signed URLs
- **Enums are locked** — do not add enum values without flagging
- **Audit log is append-only** — every admin mutation writes one entry using the locked action vocabulary

### Audit log action vocabulary (the complete list — no freeform strings)

```
application.submitted
application.approved
application.rejected
application.under_review
user.blacklisted
user.unblacklisted
user.deactivated
user.reactivated
deal.created
deal.updated
deal.deactivated
portfolio.created
portfolio.updated
```

---

## Email Rules

**ZeptoMail syntax must be confirmed from live docs before writing any template.**

Do not assume ZeptoMail uses the same merge-tag syntax as any other service.
Past failure: Loops.so required `{DATA_VARIABLE:varname}` — wrong syntax sends but renders nothing.

Steps before coding any email template:
1. Fetch ZeptoMail's current template documentation
2. Confirm the exact merge-tag syntax
3. Send one real test email per template before wiring it up
4. Confirm variables render in a real inbox — not just in logs

Email stubs in Sections 3 and 4 use `console.log + // TODO: wire in Section 7`. Do not wire emails until Section 7.

---

## V1 Scope Boundaries

**These are not in V1. If they appear, stop and flag as V2.**

- Payment processing (no Paystack, no Flutterwave, no escrow)
- Investor KYC verification
- Founder ↔ investor direct messaging
- SMS notifications
- Blog or content section
- Multi-currency support
- Native mobile app

"Accept investment" in V1 = recording an offline commitment. No money moves through the platform.

---

## Working Contract

Follow this in every session, without exception.

1. **Read first.** Before writing any code, read `build.md` and the relevant source files.
2. **Propose, then wait.** For every non-trivial task: state what you plan to do and wait for approval before implementing.
3. **No destructive DB operations without showing the SQL first.** Show the migration, get a go-ahead, then run it.
4. **No invented APIs, libraries, or env vars.** If you are unsure about an external API shape (e.g. ZeptoMail, Supabase edge function syntax), say so and verify from current docs before coding.
5. **If the plan is wrong, stop and flag it.** Do not silently improvise a different approach.
6. **After every session:** update `build.md` — overwrite the Current State block, tick completed tasks, append a Build Log entry. A stale `build.md` is a bug.
7. **No payments in V1.** If a payment requirement appears in any form, stop and flag it immediately.

---

## Environment Variables

Never commit values. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        ← server-side only

# ZeptoMail
ZEPTO_MAIL_API_KEY=               ← confirm key name matches ZeptoMail dashboard

# App
NEXT_PUBLIC_APP_URL=              ← https://sda.ng in production
```

---

## Missing Assets (awaiting client — do not block on these)

| Asset | Where used | Status |
|---|---|---|
| Hero right panel photo | Homepage hero | Placeholder: dark panel + SDA monogram |
| Spotlight featured image | Homepage spotlight section | Placeholder: dark bg box |
| Spotlight card thumbnails (×3) | Homepage spotlight cards | Placeholder: dark bg box |
| Pull quote photo | Homepage pull quote section | Placeholder: circle avatar |
| Portfolio company photos (×4+) | Portfolio grid + cards | Placeholder: initials circles |
| Portfolio company descriptions | All portfolio displays | Placeholder copy in use |
| Founder quote (real) | Portfolio feature section | Placeholder quote in use |
| OG image | All pages, SEO | Placeholder |

When any asset arrives from the client: drop it in, remove the placeholder, update the Build Log.

---

*Last updated: pre-build. Claude Code updates build.md after every session — not this file.*
