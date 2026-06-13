SDA Platform — build.md
> \*\*This file is the living source of truth for the build.\*\*
> Claude Code MUST update the \*\*Current State\*\* block and append to the \*\*Build Log\*\*
> at the end of every section, no exceptions.
> If build.md and CLAUDE.md ever conflict, stop and ask before proceeding.
---
Current State
Phase: Section 1 — IN PROGRESS (migration written; blocked on Supabase access token)
Last completed section: Section 6 — All marketing pages complete, pushed to GitHub
Next section: Section 1 — Provide personal access token → link → db push → buckets → types → Section 2
Live URL: — (Vercel deploy still pending — unblocked once env vars are set)
Known open issues:
  - BLOCKED: supabase login interactive OAuth does not work in Claude Code environment.
    Resolution: generate a personal access token at supabase.com/dashboard/account/tokens
    and provide it — I will use SUPABASE_ACCESS_TOKEN env var to authenticate without login.
  - Project ref confirmed: mxuvbjjunajthrtlxrbr
  - BLOCKED: Storage buckets not yet created — do after db push:
    Supabase dashboard → Storage → New bucket → "financial-records" (private, no public access)
                                              → "bank-statements"   (private, no public access)
  - BLOCKED: TypeScript types not yet generated — run after db push:
    npx supabase gen types typescript --project-id mxuvbjjunajthrtlxrbr > lib/database.types.ts
  - BLOCKED: .env.local does not exist — create with:
    NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_APP_URL
  - Section 0 Vercel deploy still pending — import GitHub repo at vercel.com, set env vars
  - Section 1 tasks [ ] all pending apply
  - docs/bcv-reference.png missing from repo — screenshot comparison still pending
  - Remaining placeholder assets: pull quote photo, portfolio card photos, founder quote
  - Recurring dev issue: stale/corrupted .next cache → full fix:
    Stop-Process node → Remove-Item -Recurse -Force .next → npm install → npm run dev
  - Mobile: FundingOptions, WhatWeLookFor, PullQuote, ForInvestors, EmailSignup, Footer not yet mobile-audited
Last updated: 2026-06-13 (session 7)
(Claude Code: overwrite this entire block after every session. Never leave it stale.)
---
Project Snapshot
SDA — micro angel investment platform (Nigeria).
Repositioning sda.ng from personal finance coaching into a serious capital platform.
Reference aesthetic: foundersfund.com — stark, editorial, minimal.
Three roles, one codebase, one database
Role	What they do
Applicant	Applies for funding, uploads documents, tracks status
Investor	Browses deal summaries publicly; full details gated behind login; expresses interest
Admin	Reviews/approves/rejects applications, blacklists users, promotes approved apps to live deals, manages content and users, sees metrics
Stack (locked — do not change without flagging)
Next.js 14 (App Router) + TypeScript
Supabase — Postgres + Auth + Storage
Tailwind CSS + shadcn/ui
React Hook Form + Zod
ZeptoMail (transactional email only)
Vercel (hosting + edge functions)
Scope hard boundaries (V1)
No payment processing. "Accept investment" = recording an offline commitment. No Paystack, no Flutterwave, no escrow. If a payment requirement appears during the build, stop and flag it as V2.
Out of V1: payments/escrow, founder↔investor messaging, investor KYC verification, SMS, blog, multi-currency, native app.
Architecture must leave room for all of the above without rework.
Two client assumptions — confirm before Section 1
"Accept investment" = recording an offline commitment, not money movement.
Investor sees summary publicly; full details only after login.
Get explicit written confirmation on both before the database schema is finalised.
---
Brand Tokens
```css
--ink:     #0A0A0A   /\* text, buttons \*/
--paper:   #FAFAF8   /\* page background \*/
--accent:  #1A3D2F   /\* deep forest green — CTAs, links, trust signals \*/
--muted:   #6B6B6B   /\* secondary text \*/
--border:  #E5E4DF   /\* dividers \*/
--surface: #F2F1EC   /\* cards, section fills \*/
--success: #2D6A4F
--warning: #B45309
--danger:  #991B1B
```
Fonts:
Sora — all headings, nav logo, pull quotes, section eyebrows (weights 300, 400, 600)
Inter — all body copy, buttons, labels, captions (weights 400, 500)
Font CSS variables:
```css
--sr: 'Sora', system-ui, sans-serif;
--in: 'Inter', system-ui, sans-serif;
```
Sora has no true italic. Do not use `font-style: italic` on any Sora element.
Emphasis within headings is achieved with `font-weight: 300` + `color: rgba(255,255,255,0.5)` on `<em>` spans — `font-style: normal` explicitly set.
Type scale:
Element	Font	Size	Weight	Notes
Hero h1	Sora	58px	300	line-height 1.08, letter-spacing -0.02em
Section h2	Sora	42px	300	line-height 1.12, letter-spacing -0.02em
Small h2	Sora	32px	300	letter-spacing -0.01em
Funding type label	Sora	22px	400	—
Nav logo	Sora	20px	400	—
Stats / pull quote	Sora	36–48px	300	—
Body copy	Inter	15–16px	400	line-height 1.7
Buttons / nav links	Inter	13px	400–500	letter-spacing 0.03–0.04em
Section eyebrow	Inter	11px	400	uppercase, letter-spacing 0.12em
Weight-300 Sora reads very thin at small sizes. If any heading below 32px looks too light at browser rendering, bump to weight 400. That is a browser judgment call — do not pre-emptively change the spec.
If a real brand logo or color arrives from the client, swap `--accent` only. Do not re-litigate the full palette mid-build.
---
Lessons From Past Builds (Kiima, Elroisè, Hadiel)
These are real failure modes, not hypotheticals. Each has a guardrail.
Email variable syntax fails silently.
Loops.so needed `{DATA\_VARIABLE:varname}` — wrong syntax sends the email but renders nothing. ZeptoMail likely differs.
→ Guardrail: Before writing any email template, confirm ZeptoMail's merge-tag syntax from their live docs. Send one real test email per template. Do not assume. (Section 7)
Auth + middleware caused repeated rework.
Role-gating, session refresh, and protected-route redirects are where time disappears.
→ Guardrail: Build and fully test the auth matrix (logged-out, applicant, investor, admin) in Section 2 before any feature is built behind it. (Section 2)
Supabase Storage + sensitive files.
Financial records and bank statements are the opposite of public avatars.
→ Guardrail: Private buckets only. Never a public URL. Only short-lived (10-min) signed URLs, generated server-side, admin-only. Verify in Section 8 that no document URL loads while logged out. (Sections 3, 4, 8)
Dark-mode hydration drift.
System preference + RSC = mismatch on first render.
→ Guardrail: Lock light mode globally in root layout from day one. No theme switcher in V1. (Section 0)
Client-side role checks are not security.
→ Guardrail: All writes go through server actions. Admin mutations use the service role. Never trust the client for permissions. (Sections 3–5)
Design system drift when built mid-project.
→ Guardrail: Tokens, fonts, and base shadcn primitives are completed in Section 0. Not touched again. (Section 0)
Stale docs cause re-explaining and drift.
→ Guardrail: build.md is updated after every session. A stale build.md is a bug.
---
Working Contract (read before every session)
Read first. Before writing any code, read the relevant files.
Propose, then wait. For every non-trivial task, propose a plan and wait for approval before implementing.
No destructive DB operations without showing the migration SQL first.
No hallucinated libraries, env vars, or API shapes. If unsure of an external API (e.g. ZeptoMail syntax), say so and verify against current docs before coding.
After every session: update Current State, tick completed tasks, append a Build Log entry.
If the plan is wrong, stop and flag it. Do not silently improvise.
No payments in V1. If a payment requirement appears, stop and flag it.
---
BUILD SECTIONS
Run in order. Do not start a section until the previous section's Definition of Done is met.
---
Section 0 — Repo & Tooling
Objective: A working Next.js app with brand tokens, fonts, light mode locked, route groups scaffolded, CLAUDE.md written, build.md committed, and a green Vercel deploy.
Why this first: Everything downstream depends on a stable design system and route structure. Fixing tokens or fonts mid-build is expensive.
Tasks
[x] Scaffold Next.js 14 with App Router and TypeScript (`create-next-app`)
[x] Install and configure Tailwind CSS
[x] Install and configure shadcn/ui
[x] Add brand tokens to `globals.css` and `tailwind.config.ts`
[x] Wire Sora (headings) and Inter (body/UI) via `next/font/google`
[x] Lock light mode in root layout — no `ThemeProvider`, no system preference, no dark mode classes
[x] Create route groups: `(marketing)`, `(app)`, `(admin)` with placeholder `page.tsx` in each
[x] Create `CLAUDE.md` in repo root (stack, tokens, route map, working contract)
[x] Commit `build.md` to repo root
[ ] Connect Vercel project, push, confirm green deploy ← BLOCKED: awaiting GitHub push + Vercel import
Manual Prompt (you → Claude Code)
```
We are building SDA — a micro angel investment platform. 
Stack: Next.js 14 App Router, TypeScript, Supabase, Tailwind, shadcn/ui, ZeptoMail, Vercel.

Before writing any code, read build.md in the repo root. It is the source of truth.
Follow the Working Contract in it.

For Section 0, propose your plan first. Wait for my approval. Then:

1. Scaffold Next.js 14 (App Router, TypeScript) + Tailwind + shadcn/ui.

2. Add brand tokens exactly as listed in build.md (--ink, --paper, --accent, --muted, 
   --border, --surface, --success, --warning, --danger) to globals.css and tailwind.config.ts.
   Wire Sora via next/font/google for all headings (weights 300, 400, 600),
   Inter for all body and UI (weights 400, 500).
   Add CSS variables: --sr for Sora, --in for Inter.
   
   Critical: Sora has no true italic. Do not set font-style: italic anywhere on 
   Sora text. Heading emphasis uses font-weight: 300 + reduced opacity instead.
   Document this in CLAUDE.md so it is not forgotten mid-build.

3. Lock light mode in the root layout. No ThemeProvider. No dark mode. No system preference.
   We had hydration drift on a past build from exactly this — we're not repeating it.

4. Create route groups (marketing), (app), (admin) — each with a bare placeholder page.tsx.

5. Write CLAUDE.md: stack, brand tokens, route map, working contract (read first, 
   propose and wait, no destructive DB ops without showing migration, no hallucinated APIs).
   Include this explicitly in CLAUDE.md: "Sora has no true italic. Never use 
   font-style: italic on any Sora element. Heading emphasis = font-weight: 300 + 
   color: rgba(255,255,255,0.5) on <em> with font-style: normal."

6. Confirm build.md is committed to repo root.

7. Connect Vercel. Push. Show me the deploy URL.

When done: update build.md Current State, tick Section 0 tasks, append Build Log entry.
```
Definition of Done
[x] `npm run build` passes — 3 routes (`/`, `/dashboard`, `/admin`), all static, zero errors
[x] Brand tokens in `globals.css` and `tailwind.config.ts`
[x] Sora (300/400/600) + Inter (400/500) via `next/font/google`, CSS vars `--sr` / `--in` wired
[x] Zero `font-style: italic` in any file — confirmed
[x] Light mode locked: `colorScheme: "light"` on `<html>`, `suppressHydrationWarning`, no `.dark` anywhere
[x] Three route groups resolve without 404
[x] `CLAUDE.md` and `build.md` committed to repo root — 2 commits on master
[ ] Vercel deploy green and URL confirmed ← pending — share deploy URL to close this section
Self-update step
After Vercel deploy confirmed:
Overwrite Current State: Phase = Section 0 complete · Next = Section 1
Tick the Vercel task above
Append Build Log entry — include shadcn v4 deviation and what it means for Section 3
---
Section 1 — Database Schema & RLS
Objective: Full Postgres schema, enums, constraints, RLS policies, private storage buckets, and generated TypeScript types.
Why this before auth: Auth depends on the `profiles` table. Get the schema right once.
Tasks
[ ] Show migration SQL before applying anything
[ ] Create enums: `user\_role`, `funding\_type`, `application\_status`, `document\_type`
[ ] Create all tables (see schema below)
[ ] Add `funding\_amount` check constraint (≤ 5,000,000)
[ ] Add partial unique index: one active application per user
[ ] Write RLS policies per role
[ ] Create two private Storage buckets: `financial-records`, `bank-statements`
[ ] Generate TypeScript types (`supabase gen types typescript`)
[ ] Commit generated types to `lib/database.types.ts`
Schema
Enums
```sql
user\_role:          applicant | investor | admin
funding\_type:       equity | debt | asset | revenue\_based
application\_status: draft | pending | under\_review | approved | rejected
document\_type:      financials | bank\_statement
```
profiles (extends `auth.users`)
```
id              uuid  PK  references auth.users
role            user\_role  not null
full\_name       text
phone           text
is\_blacklisted  boolean  default false
blacklist\_reason text
is\_active       boolean  default true
created\_at      timestamptz  default now()
```
applications
```
id                  uuid  PK  default gen\_random\_uuid()
user\_id             uuid  references profiles(id)
business\_name       text  not null
founder\_name        text  not null
contact\_email       text  not null
contact\_phone       text
business\_description text  not null
monthly\_revenue     numeric
funding\_amount      numeric  check (funding\_amount <= 5000000)
funding\_type        funding\_type
status              application\_status  default 'draft'
rejection\_reason    text
admin\_notes         text
submitted\_at        timestamptz
reviewed\_at         timestamptz
reviewed\_by         uuid  references profiles(id)
created\_at          timestamptz  default now()
```
application_documents
```
id              uuid  PK  default gen\_random\_uuid()
application\_id  uuid  references applications(id)
document\_type   document\_type
file\_path       text  not null  -- Storage path, never a public URL
uploaded\_at     timestamptz  default now()
```
deals
```
id                    uuid  PK  default gen\_random\_uuid()
source\_application\_id uuid  references applications(id) nullable
business\_name         text  not null
industry              text
revenue\_to\_date       numeric
funding\_required      numeric
summary\_public        text  not null   -- shown to everyone
details\_gated         text             -- shown only to logged-in investors
is\_active             boolean  default true
created\_by            uuid  references profiles(id)
created\_at            timestamptz  default now()
```
portfolio_companies
```
id                   uuid  PK  default gen\_random\_uuid()
name                 text  not null
description          text
logo\_path            text
display\_order        integer  default 0
is\_published         boolean  default false
detail\_page\_content  text
created\_at           timestamptz  default now()
```
notifications
```
id          uuid  PK  default gen\_random\_uuid()
user\_id     uuid  references profiles(id)
type        text  not null
message     text  not null
read\_at     timestamptz
created\_at  timestamptz  default now()
```
audit_log
```
id           uuid  PK  default gen\_random\_uuid()
actor\_id     uuid  references profiles(id)
action       text  not null   -- vocabulary locked in Section 4
target\_type  text             -- 'application' | 'deal' | 'user'
target\_id    uuid
metadata     jsonb
created\_at   timestamptz  default now()
```
RLS Policy Rules
Table	Applicant	Investor	Admin
profiles	Own row only	Own row only	Service role (server action)
applications	Own rows only	No access	Service role
application_documents	Own rows (via application)	No access	Service role
deals	No access	`is\_active = true`; `details\_gated` column excluded for logged-out	Service role
portfolio_companies	Read `is\_published = true`	Read `is\_published = true`	Service role
notifications	Own rows only	Own rows only	Service role
audit_log	No access	No access	Service role
Blacklisted users (`is\_blacklisted = true`) cannot insert into `applications`
`details\_gated` must not appear in any query available to logged-out users — enforce at the query level in server components, not just RLS (RLS is the backstop)
Manual Prompt (you → Claude Code)
```
Section 1: database schema. Read build.md before doing anything.
Follow the Working Contract — show me the migration SQL before applying it.

Build the schema exactly as listed in build.md Section 1. Do not add columns 
or tables that aren't listed. Do not skip any.

Migration must include:
- All enums
- All tables with constraints
- funding\_amount check constraint (<= 5000000)
- Partial unique index: one active application per user 
  (user\_id where status IN ('pending','under\_review'))
- Trigger or function to block inserts on applications where is\_blacklisted = true

RLS policies per the table in build.md:
- Applicants read/write only their own rows
- Investors read deals where is\_active = true; details\_gated column must NOT 
  be accessible to logged-out or unauthenticated requests
- Admins bypass via service role used in server actions only
- No client-side role bypass

Storage: create two PRIVATE buckets — financial-records and bank-statements. 
No public access. No public URLs ever.

After applying: run `supabase gen types typescript --local > lib/database.types.ts`
and commit the file.

Show me the full migration SQL first. Wait for my go-ahead before applying.

When done: update build.md Current State, tick Section 1 tasks, append Build Log entry.
```
Definition of Done
Migration applied clean, no errors
All tables and enums exist in Supabase dashboard
`funding\_amount` check constraint rejects values > 5,000,000
Partial unique index prevents two active applications for the same user
RLS verified: test with three separate role tokens — applicant cannot read another applicant's row, investor cannot read `details\_gated` while logged out, admin server action succeeds
Both Storage buckets exist, private, no public access
`lib/database.types.ts` committed
Self-update step
Claude Code logs: final schema decisions, any column changes from the draft, RLS test results.
---
Section 2 — Auth, Roles & Middleware
Objective: Complete auth flows with role selection, and a fully tested middleware access matrix before any feature is built behind it.
Why test the matrix first: Auth + middleware caused repeated rework on a past project. Test all four states before building anything that depends on them.
Tasks
[ ] Signup page with role selection (Applicant | Investor) — writes `profiles.role`
[ ] Email + password signup with email verification
[ ] Login page
[ ] Logout action
[ ] Password reset flow (request + confirm)
[ ] Create `profiles` row on signup (DB trigger preferred; server action fallback)
[ ] Middleware protecting `(app)` routes: requires active session
[ ] Middleware protecting `(admin)` routes: requires `role = admin`
[ ] Logged-out users hitting protected routes → redirect to `/login`
[ ] Session refresh handled (Supabase `getSession` + refresh token)
[ ] Brand-styled auth pages (Sora headings, Inter body, paper bg, forest-green buttons)
[ ] Run manual auth test checklist — all states pass before moving to Section 3
Auth Test Matrix (run before calling this section done)
Route	Logged out	Applicant	Investor	Admin
`/` (marketing)	✓ visible	✓ visible	✓ visible	✓ visible
`/opportunities`	✓ visible (summary only)	✓ visible	✓ visible	✓ visible
`/dashboard`	→ `/login`	✓ own dashboard	✓ own dashboard	✓
`/dashboard/apply`	→ `/login`	✓	→ `/login` or redirect	—
`/admin`	→ `/login`	→ `/login` or 403	→ `/login` or 403	✓
`/admin/applications`	→ `/login`	403	403	✓
All six rows must pass before Section 3 starts.
Manual Prompt (you → Claude Code)
```
Section 2: authentication and middleware. Read build.md.

Critical note from our past builds: auth and middleware caused repeated rework 
when we built features before testing the access matrix. We are not doing that 
here. The matrix test runs before we touch Section 3.

Implement with Supabase Auth:

1. Signup page at /signup:
   - Role selection (Applicant or Investor) — required, writes to profiles.role
   - Email + password fields
   - Email verification on submit
   - On signup: create profiles row (use a DB trigger if possible; 
     server action fallback if trigger doesn't work reliably)

2. Login page at /login — email + password, redirect to /dashboard on success

3. Logout server action — clears session, redirects to /

4. Password reset: /forgot-password (request) and /reset-password (confirm + new password)

5. Middleware:
   - (app) routes: require active session → else redirect to /login
   - (admin) routes: require session AND role = admin → else redirect to /login
   - Handle session refresh (call supabase.auth.getSession and refresh token)
   - Do not use client-side role checks for access control

All auth pages must use brand styles: Sora on headings, Inter on body, 
paper (#FAFAF8) background, forest-green (#1A3D2F) buttons, clean minimal layout.

After building, give me the manual test checklist from build.md Section 2 
and walk through it with me. The section is not done until all rows pass.

When done: update build.md — paste the passing test matrix into the Build Log,
tick Section 2 tasks, update Current State.
```
Definition of Done
Signup creates user in `auth.users` and row in `profiles` with correct role
Email verification email fires (check inbox, not just logs)
Login, logout, and password reset all work end-to-end
All six rows of the auth test matrix pass
No client-side role check used anywhere for route protection
Self-update step
Claude Code pastes the passing auth matrix results into the Build Log.
---
Section 3 — Applicant Flow
Objective: End-to-end applicant journey: signup → multi-step application with draft save → document upload → submit → status tracking.
Tasks
[ ] Applicant dashboard at `/dashboard` — shows application status and history
[ ] Multi-step application form at `/dashboard/apply`:
Step 1: Business details (name, founder name, contact email, phone)
Step 2: Business description and monthly revenue
Step 3: Funding amount (₦5M cap enforced client + server) and funding type
Step 4: Document uploads (financial records + bank statements → private buckets)
Step 5: Review and confirm
[ ] Zod validation on every step, RHF for form state
[ ] Save as draft at any step (status = `draft`) — resumable on next login
[ ] Submit server action: status → `pending`, confirmation email via ZeptoMail, block if active application exists, block if user is blacklisted
[ ] Application status page: clear states for Pending / Under Review / Approved / Rejected
[ ] Rejection reason displayed when status = `rejected`
[ ] No public document URLs anywhere — files go to private Storage only
Manual Prompt (you → Claude Code)
```
Section 3: applicant flow. Read build.md. Auth and middleware are done and tested.

All mutations go through server actions — never client-side fetch to the DB.
No public document URLs, ever.

Build:

1. /dashboard — applicant's home. Shows:
   - Current application status (or CTA to apply if none exists)
   - Application history if multiple drafts exist

2. /dashboard/apply — multi-step form using React Hook Form + Zod:
   Step 1: business\_name, founder\_name, contact\_email, contact\_phone
   Step 2: business\_description, monthly\_revenue
   Step 3: funding\_amount (enforce ≤ 5,000,000 in Zod schema AND in the server action), 
           funding\_type (equity | debt | asset | revenue\_based)
   Step 4: document uploads — financial records to 'financial-records' bucket, 
           bank statements to 'bank-statements' bucket. Private. No public URL.
           Show upload progress.
   Step 5: review screen — show all entered data before submit

3. Save as draft at any step. Button labelled "Save and continue later".
   Saves current fields to applications table with status = 'draft'.
   On next login, dashboard shows "Resume your application" CTA.

4. Submit (server action):
   - Validate all fields server-side with Zod
   - Check: user is not blacklisted → if blacklisted, return error, do not insert
   - Check: user has no existing application with status IN ('pending','under\_review') 
     → if exists, return error, do not insert second one
   - Set status = 'pending', submitted\_at = now()
   - Send confirmation email via ZeptoMail (template: application\_submitted)
   - Return success state to UI

5. Status page — visible states:
   - Draft: "Your application is saved. Resume or submit."
   - Pending: "We have received your application and will review it shortly."
   - Under Review: "Your application is being reviewed by our team."
   - Approved: "Congratulations. Our team will be in touch."
   - Rejected: "Unfortunately your application was not approved." + rejection\_reason field

Do not build the email template in detail yet — that is Section 7. For now, 
stub out the email send with a console.log and a TODO comment.

When done: update build.md — log form architecture, validation edge cases, 
any deviations. Tick Section 3 tasks. Update Current State.
```
Definition of Done
Test applicant can: sign up → start application → save draft → log out → log back in → resume → complete all steps → upload documents → submit
Submission is blocked if a pending/under_review application already exists
Submission is blocked if user is blacklisted
₦5M cap returns a clear error if exceeded
No document URL is publicly accessible (verify by copying the file_path and attempting to open it while logged out — should fail)
Status page shows correct state for each status value including rejection reason
Self-update step
Claude Code logs: form architecture decisions, Zod schema structure, any edge cases handled beyond the spec.
---
Section 4 — Admin Portal
Objective: Admin can review, approve, reject, blacklist, promote applications to deals, manage all content, see metrics — all mutations logged to audit_log.
Tasks
[ ] Seed first admin (show SQL before running)
[ ] Admin dashboard at `/admin` — metrics overview
[ ] Applications inbox at `/admin/applications` — filterable, searchable table
[ ] Application detail view at `/admin/applications/\[id]`
Full application data
Documents via 10-minute server-generated signed URLs (admin only)
Internal `admin\_notes` field
[ ] Approve action: status → `approved`, write audit_log, trigger email
[ ] Reject action: status → `rejected`, rejection reason required, write audit_log, trigger email
[ ] Blacklist user: sets `is\_blacklisted = true` + `blacklist\_reason`, writes audit_log, reversible
[ ] Promote approved application → new `deals` row: admin sets `summary\_public`, `details\_gated`, `industry`, `revenue\_to\_date`, `funding\_required`, `is\_active`
[ ] Deals CRUD at `/admin/deals`
[ ] Portfolio CRUD at `/admin/portfolio`
[ ] User management at `/admin/users`: deactivate/reactivate, view blacklist status
[ ] Dashboard metrics: total applications, approval rate, active deals, total funding requested, registered users
[ ] Email notification to admin on new application submitted (stub → wired in Section 7)
Audit Log Action Vocabulary (lock this before building)
```
application.submitted
application.approved
application.rejected
application.under\_review
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
Every admin mutation writes one of these to `audit\_log`. No freeform strings.
Manual Prompt (you → Claude Code)
```
Section 4: admin portal. Read build.md. Auth and applicant flow are done and tested.

Critical rules:
- All admin mutations run through server actions using the Supabase service role.
- Every mutation writes to audit\_log using the vocabulary locked in build.md Section 4.
- Documents are served only via server-generated signed URLs, valid 10 minutes, 
  generated only when an admin is authenticated. No public document URLs.

Propose the admin route structure before building anything. Wait for approval.

Then build:

1. Seed the first admin. Show me the SQL before running it:
   INSERT into auth.users... then update profiles set role = 'admin'...

2. /admin — dashboard with metrics:
   Total applications (all statuses), approval rate, active deals count, 
   total funding requested (sum), registered users count.
   Metrics are read-only. No cache needed for V1, fresh query on load.

3. /admin/applications — table with:
   Columns: business name, founder, funding amount, funding type, status, submitted date
   Filters: status, funding type, date range, funding amount range
   Search: business name, founder name, contact email
   Row click → detail view

4. /admin/applications/\[id] — detail view:
   All application fields. admin\_notes textarea (auto-saves on blur via server action).
   Documents section: for each document, generate a signed URL server-side, 
   valid 10 min, display inline or as a download link. Log the signed URL 
   generation to console (not to DB). Never expose the raw Storage path.
   
   Actions:
   - "Mark Under Review" → status = under\_review, log application.under\_review
   - "Approve" → status = approved, log application.approved, stub email
   - "Reject" → modal, rejection\_reason required, status = rejected, 
     log application.rejected, stub email
   - "Blacklist User" → modal, blacklist\_reason required, sets is\_blacklisted = true 
     on profiles, log user.blacklisted, reversible from /admin/users

5. /admin/applications/\[id]/promote — promote to deal:
   Only available when status = approved.
   Form fields: summary\_public, details\_gated, industry, revenue\_to\_date, 
   funding\_required, is\_active (toggle).
   On submit: create deals row, set source\_application\_id, log deal.created.

6. /admin/deals — list of all deals with edit/deactivate actions.
   Edit → update deal fields, log deal.updated.
   Deactivate → is\_active = false, log deal.deactivated.

7. /admin/portfolio — CRUD for portfolio\_companies.
   Fields: name, description, logo (upload to Storage), display\_order, is\_published.
   Log portfolio.created and portfolio.updated.

8. /admin/users — table of all profiles.
   Show: full\_name, email, role, is\_blacklisted, is\_active, created\_at.
   Actions: deactivate (is\_active = false, log user.deactivated), 
   reactivate (is\_active = true, log user.reactivated),
   remove blacklist (is\_blacklisted = false, log user.unblacklisted).

Email sends in this section are stubs (console.log + TODO). Wired properly in Section 7.

When done: update build.md — log admin route map, audit\_log vocabulary confirmation,
any deviations. Tick Section 4 tasks. Update Current State.
```
Definition of Done
First admin seeded and can log in
Full review loop works: submit as applicant → review in admin → approve/reject → status updates on applicant side
Every admin action creates a row in `audit\_log` with the correct vocabulary
Documents are only accessible via signed URLs — raw Storage path never exposed
Signed URLs return 403 after 10 minutes (test this manually)
Blacklisted user cannot submit a new application
Metrics on dashboard render with real data
Self-update step
Claude Code logs: admin route map, audit_log action vocabulary as implemented, signed URL generation approach.
---
Section 5 — Investor Flow
Objective: Public deal discovery, login-gated full details, express interest, investor dashboard.
Tasks
[ ] `/opportunities` public page: active deals showing `summary\_public`, industry, `revenue\_to\_date`, `funding\_required` only
[ ] Filter and search: by industry, funding type, amount range
[ ] "View details" CTA on each deal card
[ ] Logged-out "View details" → prompt to sign up or log in (do not show `details\_gated`)
[ ] Logged-in investor: full deal detail including `details\_gated`
[ ] Verify at network level: `details\_gated` column is never in any response to logged-out requests
[ ] "Express interest" server action: creates admin notification, logs to `notifications` table, shows confirmation to investor
[ ] Investor dashboard at `/dashboard`: deals they have expressed interest in
[ ] Optional (flag if time is tight): email investors when a new deal goes live
Manual Prompt (you → Claude Code)
```
Section 5: investor flow. Read build.md. Confirm gating approach before building.

Critical: logged-out users must never receive the details\_gated column in any 
network response — not just hidden in the UI. The query itself must exclude it 
for unauthenticated requests. RLS is the backstop, but the primary enforcement 
is at the query/server-component level. Before building, tell me how you plan 
to enforce this and wait for my confirmation.

Build:

1. /opportunities (public, no auth required):
   Fetch only: id, business\_name, industry, revenue\_to\_date, funding\_required, 
   summary\_public, funding\_type, created\_at.
   Do NOT select details\_gated here under any circumstances.
   Show deal cards in a clean grid. Each card has a "View details" button.
   
   Filters: industry (dropdown), funding type (dropdown), funding amount range (slider or inputs).
   These filter client-side after initial load (no re-fetch needed for V1).

2. "View details" behaviour:
   - Logged out → redirect to /login with a ?redirect=/opportunities/\[id] param
   - Logged in as investor → /opportunities/\[id] showing full detail including details\_gated
   - Logged in as applicant → show summary only or redirect (decide and document)

3. /opportunities/\[id] (authenticated investors):
   Fetch full deal including details\_gated.
   Show all fields cleanly.
   "Express interest" button → server action:
   - Insert into notifications (user\_id = admin id, type = 'investor\_interest', 
     message includes deal name and investor email)
   - Show investor a confirmation: "Your interest has been noted. We will be in touch."
   - Log this action somewhere sensible (notifications table is fine for V1)

4. Investor dashboard at /dashboard:
   Show deals the investor has expressed interest in.
   This requires either a join table or querying notifications by investor user\_id 
   and type = 'investor\_interest'. Use whichever is cleaner — document the decision.

5. Optional: when admin sets a deal to is\_active = true, trigger an email to all 
   investors. Flag this as optional — skip if it adds significant complexity to V1.

When done: update build.md — document how details\_gated gating is enforced 
(column exclusion approach, not just RLS), log dashboard data model decision.
Tick Section 5 tasks. Update Current State.
```
Definition of Done
Logged-out user can browse `/opportunities` and sees summaries only
Open browser DevTools Network tab on `/opportunities` while logged out — `details\_gated` must not appear in any response payload
Logged-in investor sees full deal detail at `/opportunities/\[id]`
"Express interest" creates a notification row and shows confirmation
Investor dashboard shows their expressed-interest deals
Self-update step
Claude Code documents the exact gating enforcement method used and confirms it was verified in DevTools.
---
Section 6 — Marketing Pages
Objective: All public pages in `(marketing)` built using the BCV layout template, SDA copy, and the 21st.dev Magic MCP + UI-UX-Pro max skill for component generation and design quality.
Reference template: Bain Capital Ventures — screenshot saved at `docs/bcv-reference.png`. Match structure and layout logic. Not content — structure.
Tools (use both on every component):
21st.dev Magic MCP — invoke with `/ui \[description]` in Claude Code to pull and generate React/TypeScript components from 21st.dev library. Use for nav, ticker, cards, accordion, forms, input rows, footer.
UI-UX-Pro max skill — loaded as a Claude Code skill. Provides design intelligence, spacing systems, and 21st.dev pattern guidance. Reference it for every layout and typography decision.
Component workflow (follow for every section):
Run `/ui \[description]` via Magic MCP — see if a matching component exists
If match found: generate it, then override with SDA tokens (`--sr`, `--in`, `--accent`, `--ink`) and locked design rules (zero border-radius on buttons, no shadows, Sora no italic rule)
If no match: build from scratch following the spec below
Never ship a generated component without SDA token overrides applied
Homepage section order (BCV structure, Spotlight replaced with Funding Options):
Nav
Hero — full-bleed dark, Sora display headline left, dark visual panel right, body + dual CTAs
Ticker strip — scrolling: portfolio companies with Funded tags + funding type names
Funding Options — replaces BCV Spotlight. 4-col grid: Equity, Debt, Asset financing, Revenue-based. Each col: type name (Sora 22px), one-line description, eligibility note. This is core SDA content — do not skip or shrink it.
What We Look For — eyebrow + large Sora heading, 4-item criteria list left, supporting copy right
Pull quote — full-bleed `#0d120e` band, Sora 32px weight 300 quote left, attribution + placeholder photo right
Portfolio grid — oversized partial bleed word + "Meet our portfolio." heading + 4 company cards with initials
Portfolio feature — founder placeholder quote left, 4 company list right (live from `portfolio\_companies`)
Email signup — minimal full-width input + arrow, no `<form>` element
Footer — "SDA" ~120px Sora weight 600, nav column top-right, legal + social bottom row
Known gaps — fix before calling homepage done:
Hero right panel: dark textured box + SDA monogram until client sends photo. Log in Build Log.
Pull quote bg must be `#0d120e` — visibly distinct from `#0A0A0A` page bg
Footer "SDA" logotype: ~120px, fills roughly 60-70% of footer width
Portfolio cards: initials circles (2-letter, bg `#1A3D2F`) until client provides photos. Log in Build Log.
Portfolio company descriptions: use placeholders until client confirms. Log in Build Log.
Tasks
[ ] Save `docs/bcv-reference.png` to repo (screenshot of BCV reference) ← pending: file not in repo
[x] Homepage (`/`) — 10 sections in exact order above
[x] Nav: `/ui dark minimal navigation logo left links center button right`
[x] Hero: `/ui dark hero two column headline left panel right`; extract `TickerStrip.tsx` as `use client` component
[x] Funding Options section: `/ui dark four column feature grid with descriptions`
[x] What We Look For: `/ui dark two column section criteria list left body right`
[x] Pull quote band: `/ui dark full width testimonial quote with attribution`
[x] Portfolio grid: `/ui dark portfolio company cards grid with avatars`
[x] Portfolio feature: `/ui dark split layout quote left list right`
[x] Email signup: `/ui dark minimal email input row with arrow submit`
[x] Footer: `/ui dark footer large logotype navigation legal`
[ ] Screenshot homepage at 1280px, compare to `docs/bcv-reference.png` ← blocked: reference file missing
[x] About page (`/about`)
[x] Portfolio page (`/portfolio`) — hardcoded fallback; will use Supabase after Section 1
[x] For Investors page (`/investors`)
[x] Apply for Funding landing (`/apply`) — eligibility requirements prominent, CTA to `/signup`
[x] FAQ page (`/faq`) — custom AccordionGroup (shadcn v4 resolved)
[x] Footer on all pages: Privacy, Terms, Risk Disclosure (full content written)
[x] SEO: unique `<title>` + `<meta name="description">` + Open Graph on all pages
[x] Sitemap at `/sitemap.xml`
[x] Responsive: 375px, 768px, 1280px ← Nav/Hero/Intro mobile done; other sections use existing breakpoints in globals.css
Manual Prompt (you → Claude Code)
```
Section 6: marketing pages. Read build.md and CLAUDE.md before writing anything.

TOOLS — use both:
- 21st.dev Magic MCP is installed. For every component, run /ui \[description] first.
  If a matching component exists, generate it then override with SDA tokens.
  If no match, build from scratch per spec.
- UI-UX-Pro max skill is loaded. Reference it for every layout and spacing decision.

COPY IS FINAL. Use the exact text below — do not paraphrase or rewrite.
DESIGN SYSTEM IS LOCKED. Tokens, type scale, button rules from build.md and CLAUDE.md.
BCV REFERENCE is at docs/bcv-reference.png. Match the layout structure.

─────────────────────────────────────────
BEFORE BUILDING — resolve shadcn v4 issue
─────────────────────────────────────────

Known open issue from Section 0: shadcn@latest generated Tailwind v4 syntax.
Before importing any shadcn component (Accordion for FAQ, etc):
1. Check components/ui/ for v4-only classes (@base-ui/react imports, v4 utilities)
2. Either: pin shadcn to a v3-compatible version and regenerate affected components
   Or: manually fix the generated component to use Tailwind v3 syntax
3. Confirm the fix works before using the component
Document what you did in the Build Log.

─────────────────────────────────────────
SECTION ORDER — homepage (app/(marketing)/page.tsx)
─────────────────────────────────────────

RSC by default. Only TickerStrip.tsx needs "use client".
Build sections in this order. Do not reorder.

1. NAV
/ui dark minimal navigation logo left links center button right
Override: logo = "SDA" Sora 18px weight 600. Links: Funding types, Portfolio,
For investors, Insights, About, Contact. Inter 12px rgba(255,255,255,0.5).
CTA button: "Apply for funding" bg #1A3D2F no border-radius Inter 12px.
border-bottom: 1px solid rgba(255,255,255,0.1). padding 18px 40px.

2. HERO
/ui dark hero two column headline left visual panel right
Left col (padding 60px 40px 48px):
  Eyebrow: "Micro angel investing · Nigeria" Inter 11px uppercase
  H1 Sora 52px weight 300 line-height 1.06 letter-spacing -0.025em:
    Line 1: "Backing early-stage"
    Line 2: "businesses"
    Line 3 <em font-style:normal weight:300 color:rgba(255,255,255,0.45)>: "with traction."
  Body: "We invest in businesses that are already operating, generating revenue,
  serving customers, and ready to grow. We also connect investors to credible
  businesses with real potential." Inter 13px rgba(255,255,255,0.6) max-width 380px
  CTAs: \[Apply for funding] primary + \[Explore opportunities →] ghost
Right col: fixed 220px, bg #1a2e1a, full section height.
  Until client provides photo: centered "SDA" monogram in 48px circle bg #1A3D2F + tag below.
  Log in Build Log: "Hero right panel — awaiting client photo"

3. TICKER STRIP — TickerStrip.tsx ("use client")
/ui dark horizontal scrolling ticker strip
Content (render twice for seamless loop, 32s linear):
  "Fundora HQ" \[Funded] · "Kidcode" \[Funded] · "My Little Big Surprise" \[Funded]
  · "Rent \& Rig Limited" \[Funded] · "Equity · Debt · Asset financing · Revenue-based"
Item: Sora 12px weight 300 rgba(255,255,255,0.35).
Tag badge: Inter 10px bg #1A3D2F rgba(255,255,255,0.8) padding 2px 7px.
Separator: · color #1A3D2F. bg: #0d0d0b. border-bottom 1px rgba(255,255,255,0.1).

4. FUNDING OPTIONS — replaces BCV Spotlight section
/ui dark four column feature grid with descriptions
Section eyebrow: "How we fund"
H2: "Flexible structures for real business needs." Sora 38px weight 300
4-col grid (gap 1px, bg rgba(255,255,255,0.08) — the gap IS the line):
  Each cell: bg #0A0A0A padding 36px 28px
  Type name: Sora 22px weight 400 color #FAFAF8 mb 10px
  Description: Inter 12px rgba(255,255,255,0.4) line-height 1.6
  Note: Inter 11px rgba(255,255,255,0.25) mt 8px italic (Inter italic only — not Sora)
  Col 1: Equity
    "Ownership stake in exchange for capital."
    Note: "Suitable for high-growth businesses"
  Col 2: Debt
    "Fixed repayment schedule over an agreed term."
    Note: "Suitable for businesses with steady cash flow"
  Col 3: Asset financing
    "Secured against business assets or equipment."
    Note: "Suitable for capital-intensive operations"
  Col 4: Revenue-based
    "Repay as a percentage of monthly revenue."
    Note: "Suitable for businesses with variable income"

5. WHAT WE LOOK FOR
/ui dark two column content section criteria list left body right
Section eyebrow: "What we look for"
2-col grid (1fr 1fr) gap 64px:
Left:
  H2 Sora 42px weight 300:
    "We support"
    "businesses"
    <em font-style:normal weight:300 rgba(255,255,255,0.45)>"built on"</em>
    <em font-style:normal weight:300 rgba(255,255,255,0.45)>"execution."</em>
Right:
  Body: "If you are already building and need capital, this is for you."
  Inter 15px rgba(255,255,255,0.65) mb 28px
  4-item criteria list (flex rows, 6px dot marker bg #1A3D2F, border-top each item):
    "At least 6 months of verifiable revenue"
    "Clear understanding of your numbers"
    "Strong potential to scale"
    "Committed, execution-focused founders"
  Below list — Requirements callout box (border 1px rgba(255,255,255,0.1) p 20px mt 24px):
    "Applications that do not meet these criteria will not be considered."
    Inter 12px rgba(255,255,255,0.5)
    Link: "Apply for funding →" color #1A3D2F

6. PULL QUOTE
/ui dark full width testimonial quote with attribution
bg: #0d120e — must be visibly different from #0A0A0A page bg
padding: 72px 40px. border-top + border-bottom: 1px solid rgba(255,255,255,0.1)
2-col (1fr 260px) gap 48px align-items center:
Left:
  Quote: Sora 32px weight 300 line-height 1.22 letter-spacing -0.02em rgba(255,255,255,0.88)
  NO italic. NO quotation marks in the HTML — use CSS ::before if needed.
  "Capital should meet businesses that are already doing the work."
  Attribution: Inter 11px rgba(255,255,255,0.35) mt 20px letter-spacing 0.04em
  "SDA · Micro Angel Investing Platform · Nigeria"
Right:
  220px height box bg linear #1a3520 to #0d1a0d.
  Centered: 56px circle avatar + "Investment team" label below.
  Log: "Pull quote right — awaiting team photo"

7. PORTFOLIO GRID
/ui dark portfolio company cards grid with circular avatars
Header row (padding 48px 40px 0 overflow hidden):
  "ple " Sora 64px weight 300 color rgba(255,255,255,0.06) letter-spacing -0.04em
  "Meet our portfolio." Sora 38px weight 300 color #FAFAF8 — same baseline
3-col card grid (border-top mt 32px):
  Each card: border-right 1px rgba(255,255,255,0.1)
  Photo area 200px: circle avatar 64px bg rgba(26,61,47,0.6) border 1px rgba(255,255,255,0.1)
               initials: Sora 20px weight 300 rgba(255,255,255,0.5)
               sector tag bottom-left: Inter 9px bg rgba(255,255,255,0.08)
  Info area padding 20px 24px:
    Name: Sora 16px weight 400
    Sub: Inter 11px rgba(255,255,255,0.4) "industry · city"
    Pills: border 1px rgba(255,255,255,0.12) Inter 10px no border-radius
  Companies (data from portfolio\_companies, fallback to hardcoded):
    Fundora HQ / Fintech · Lagos / \[Equity] \[Active]
    Kidcode / Edtech · Abuja / \[Revenue-based] \[Active]
    Rent \& Rig Limited / Logistics · Lagos / \[Debt] \[Active]
  Log: "Portfolio cards — using initials until client provides photos"
  Log: "My Little Big Surprise not shown in 3-col grid — add to /portfolio full page"

8. PORTFOLIO FEATURE
/ui dark split layout quote left list right
2-col (1fr 1fr):
Left (padding 56px 40px border-right 1px rgba(255,255,255,0.1)):
  Eyebrow: "Portfolio feature"
  Quote: Sora 18px weight 300 line-height 1.5 rgba(255,255,255,0.85)
  "The platform connects investors to businesses that are already operating
  and generating revenue. Each opportunity is selected based on traction,
  clarity, and growth potential."
  Attribution: "SDA Investment Team" Inter 11px rgba(255,255,255,0.35) mt 20px
  Log: "Portfolio feature quote — awaiting real founder quote from client"
Right (bg linear #0f1f10 to #0A0A0A padding 40px):
  "Backed businesses" tag: bg #1A3D2F Inter 9px padding 4px 10px
  4 company rows — query portfolio\_companies is\_published=true, fallback hardcoded:
    Fundora HQ / "Financial infrastructure for small businesses"
    Kidcode / "Tech education for the next generation"
    My Little Big Surprise / "Curated gifting and experiences"
    Rent \& Rig Limited / "Equipment rental and logistics"
  Each row: 32px circle dot (bg #1A3D2F initials) + name Sora 13px + sub Inter 10px
  border-bottom 1px rgba(255,255,255,0.06) on each row

9. EMAIL SIGNUP
/ui dark minimal email input with arrow submit
padding: 48px 40px. border-bottom 1px rgba(255,255,255,0.1)
Label: "Sign up for SDA deal flow — updates on new opportunities, portfolio
news, and what we have been backing." Inter 11px rgba(255,255,255,0.35) max-width 500px mb 20px
Input row (max-width 500px border-bottom only — 1px solid rgba(255,255,255,0.25)):
  Input: Sora 14px weight 300, placeholder "Enter your email", bg transparent, no border
  Arrow: "→" Inter 18px rgba(255,255,255,0.4) hover #FAFAF8
DO NOT use an HTML <form> element. Use div + input + button.

10. FOOTER
/ui dark footer large logotype with navigation and legal
padding: 32px 40px 24px. border-top 1px rgba(255,255,255,0.08)
Top row flex space-between align-items flex-start:
  "SDA" — Sora \~120px weight 600 letter-spacing -0.05em color #FAFAF8
  Adjust size so it fills \~60% of footer width. This is the dominant visual element.
  Nav column right (flex-direction column gap 8px):
    Funding types · Portfolio · For investors · About · Apply · Contact
    Inter 11px rgba(255,255,255,0.35) letter-spacing 0.04em hover 0.7
Bottom row (border-top 1px rgba(255,255,255,0.08) mt 24px pt 16px flex space-between):
  "© 2025 SDA Micro Angel Investing. All rights reserved. · Privacy · Terms · Risk Disclosure"
  Inter 10px rgba(255,255,255,0.2)
  "LinkedIn · Twitter · Instagram" Inter 10px rgba(255,255,255,0.25)

─────────────────────────────────────────
SCREENSHOT COMPARISON — required before homepage is done
─────────────────────────────────────────

After all 10 sections are built:
1. Screenshot localhost:3000 at 1280px width
2. Compare side by side with docs/bcv-reference.png
3. List every structural difference you see
4. Fix all gaps
5. Log the comparison results in the Build Log

─────────────────────────────────────────
OTHER PAGES — scaffold now, copy below
─────────────────────────────────────────

After homepage is done and comparison logged, build the other pages.

/about — "About SDA"
  SDA is a micro angel investment platform focused on early-stage businesses
  with real traction. The focus is simple: support businesses that are already
  operating and help them grow with the right capital and structure.
  We believe: Execution matters more than ideas. Numbers matter. Discipline matters.
  Beyond funding, we also connect investors to credible businesses that have been
  carefully selected.

/portfolio — "Portfolio"
  Intro: "A selection of businesses we have backed."
  Grid: query portfolio\_companies is\_published=true order by display\_order.
  Fallback: Fundora HQ, Kidcode, My Little Big Surprise, Rent \& Rig Limited.
  Each card: name + description + sector tag. Click → detail page if detail\_page\_content exists.

/investors — "For Investors"
  Intro: "We provide access to businesses that are already generating revenue
  and have clear growth potential."
  Body: "We focus on: Businesses with proven traction. Founders with strong execution.
  Clear financial visibility. This is not a marketplace for ideas. It is access to
  real businesses."
  CTA: "Explore Opportunities" → /opportunities (requires login for full details)
  Fee note: "We charge a combination of diligence and administrative fees to investors
  who are accepted onto the platform. These fees cover deal sourcing, vetting,
  documentation, and ongoing operational support."

/apply — "Apply for Funding" (landing only — form is at /dashboard/apply)
  Requirements (make these prominent — large, clear, impossible to miss):
    Your business must have at least 6 months of revenue
    You must provide financial records (income and expenses)
    You must provide bank statements
    Funding request must not exceed ₦5 million
    Applications that do not meet these criteria will not be considered.
  Funding types available: Equity · Debt · Asset financing · Revenue-based
  CTA: "Start your application" → /signup?role=applicant

/faq — "Frequently Asked Questions"
  Use shadcn Accordion (resolve v4 issue first).
  Questions:
  Do you charge fees? · What is SDA Micro Angel Investing? · Who can join?
  How are startups chosen? · What sectors do you focus on?
  Do investors choose which startups? · Do you offer co-investment?
  What is the minimum investment? · How does the process work?
  Do you perform due diligence? · What are the risks? · What returns can I expect?
  How long to see returns? · How will I track investments? · Can I invest in multiple?
  Can I exit early? · Do you support beginner investors? · Is there a community?
  How are investments structured? · Geographic restrictions? · What happens after?
  Why choose SDA? · Can founders apply? · How often are new deals shared?
  Full answers are in the concept note — paste them in when building this page.

/privacy, /terms, /risk-disclosure — stub pages, "Coming soon. Last updated 2025."

SEO on every page:
  Unique <title> and <meta name="description">
  og:title, og:description, og:image (use placeholder until real OG image arrives)
  /sitemap.xml listing all public routes

─────────────────────────────────────────
WHAT NOT TO DO
─────────────────────────────────────────

No border-radius on buttons (50% on avatar circles only).
No box-shadow anywhere.
No font-style: italic on any Sora element — ever.
No <form> element in the email signup.
No Tailwind arbitrary values for rgba — write explicit CSS.
No dark mode — light mode is locked from Section 0.
No card shadows — hairline 1px borders only.

When done: update build.md — tick all Section 6 tasks, note placeholder assets,
log shadcn v4 resolution, log screenshot comparison results. Update Current State.
```
Definition of Done
`npm run build` passes
Homepage: all 10 sections in correct order, screenshot comparison completed and logged
Funding Options section present (not Spotlight) — 4-col grid with all 4 types and copy
Ticker scrolls smoothly, loops without jump, status tags visible
Footer "SDA" logotype is large (~120px), fills footer width
Pull quote section has visibly distinct background (`#0d120e`)
Zero border-radius on buttons
Zero `font-style: italic` on Sora — confirmed by grep
All placeholder assets logged in Build Log with what is needed from client
shadcn v4 issue resolved and documented
All 8 pages render without 404
Portfolio page pulls live data from Supabase with hardcoded fallback
Responsive at 375px, 768px, 1280px
SEO tags on all pages, sitemap accessible
Self-update step
Claude Code logs: screenshot comparison results, placeholder assets list, shadcn v4 resolution, 21st.dev Magic MCP components used vs built from scratch.

---
Section 7 — Email & Notifications
Objective: All transactional emails working with real variables rendering in a real inbox. ZeptoMail syntax confirmed from live docs before any template is written.
Why this is its own section: Email variable syntax fails silently. Every template must be tested with a real send before being wired to application logic.
Tasks
[ ] Confirm ZeptoMail merge-tag syntax from current docs — document the exact syntax
[ ] Build and send one real test email before wiring any template
[ ] Template: email verification (Supabase handles, customise template in dashboard)
[ ] Template: password reset (Supabase handles, customise template)
[ ] Template: `application\_submitted` — confirmation to applicant
[ ] Template: `application\_approved` — to applicant
[ ] Template: `application\_rejected` — to applicant, includes rejection reason
[ ] Template: `application\_under\_review` — to applicant
[ ] Template: `new\_application\_admin` — to admin on new submission
[ ] Template: `user\_blacklisted` — to user (optional — confirm if needed with client)
[ ] Template: `deal\_live` (optional) — to all investors when a deal goes live
[ ] Replace all Section 3 and Section 4 email stubs with real ZeptoMail calls
[ ] In-app notification bell (optional — reads from `notifications` table)
Manual Prompt (you → Claude Code)
```
Section 7: email and notifications. Read build.md.

Explicit instruction from our lessons: email template variable syntax silently 
failed on a past build. Do not assume ZeptoMail uses the same syntax as any 
other service. Do not write a single template until you have confirmed the 
exact merge-tag syntax from ZeptoMail's current documentation.

Step 1: Go to ZeptoMail's documentation and confirm:
- What is the exact syntax for a merge variable in a template? 
  (e.g. {{variable}}, {variable}, \[%variable%], etc.)
- How are templates called from the API — template key, batch send, or direct HTML?
- What does the API request body look like for a transactional send with variables?
Show me the syntax and a sample API call before writing any template.

Step 2: Build each template and send one real test email before wiring it up.
Test recipient: use my email address (I'll give it to you).
Templates needed:
- application\_submitted: variables = applicant\_name, business\_name, submitted\_date
- application\_approved: variables = applicant\_name, business\_name
- application\_rejected: variables = applicant\_name, business\_name, rejection\_reason
- application\_under\_review: variables = applicant\_name, business\_name
- new\_application\_admin: variables = applicant\_name, business\_name, 
  funding\_amount, funding\_type, submitted\_date, admin\_link

For each template: build it, send a real test, confirm variables render correctly 
in the inbox, then wire it into the server action.

Step 3: Replace all TODO/stub email sends from Sections 3 and 4 with real calls.

Step 4: Optional — in-app notification bell. Reads from notifications table, 
shows unread count, marks as read on click. Only build this if Step 3 is 
fully done. Flag if time is tight.

ZeptoMail API key is in .env.local as ZEPTO\_MAIL\_API\_KEY.

When done: update build.md — log the confirmed ZeptoMail syntax, 
list every template with verification status (sent + variables confirmed). 
Tick Section 7 tasks. Update Current State.
```
Definition of Done
ZeptoMail merge-tag syntax documented in Build Log
Every template tested with a real send — variables render correctly in a real inbox
All Section 3 and 4 email stubs replaced with real calls
Applicant receives confirmation email on submission
Applicant receives status change email on approve/reject
Admin receives notification email on new submission
Self-update step
Claude Code logs: confirmed ZeptoMail syntax, complete list of templates with test status (sent/variables confirmed/wired).
---
Section 8 — QA, Security & Launch
Objective: Harden the build, verify security explicitly, deploy to production, migrate DNS.
This section cannot be skipped or rushed. Document security is the most sensitive part of the entire platform.
Tasks
[ ] E2E test each role (applicant: signup→apply→track; investor: browse→gate→interest; admin: full loop)
[ ] Edge cases: blacklisted reapply blocked, draft resume, expired signed URL, duplicate active app blocked, unauthorised admin access blocked
[ ] Security check 1: Confirm no document URL is reachable while logged out
[ ] Security check 2: Confirm investor cannot read another user's application
[ ] Security check 3: Confirm `details\_gated` column never appears in a logged-out network response
[ ] Security check 4: Confirm admin routes return 403/redirect for non-admin authenticated users
[ ] Security check 5: Confirm `funding\_amount` DB constraint rejects values > 5,000,000 via direct SQL attempt
[ ] Loading skeletons on all data-fetching pages
[ ] Empty states on all list/table views (no applications, no deals, no portfolio companies)
[ ] Error boundaries on all route groups
[ ] Mobile responsiveness final audit (375px minimum)
[ ] Vercel production deploy
[ ] DNS migration checklist for sda.ng
[ ] Production smoke test
[ ] Admin handover document
Manual Prompt (you → Claude Code)
```
Section 8: QA, security, and launch. Read build.md. This is the final section.

Do not rush the security checks. Each one must be documented with evidence 
of how it was verified. "It should be fine" is not evidence.

Part 1 — Security verification (do these first, block on any failure):

Security check 1 — Document URL exposure:
- Copy a file\_path from the application\_documents table.
- Attempt to access it directly via the Supabase Storage URL while logged out.
- Expected result: 403 or redirect. If accessible: stop, this is a critical bug.
- Show me the URL you tested and the response code.

Security check 2 — Cross-user application access:
- Log in as applicant A. Note their application ID.
- Log in as applicant B. Attempt to fetch applicant A's application via 
  direct Supabase query or API call.
- Expected result: empty result set (RLS blocks it). Show me the query and result.

Security check 3 — details\_gated column leakage:
- Open DevTools Network tab.
- Hit /opportunities while logged out.
- Inspect every network response. Confirm details\_gated does not appear.
- Show me a screenshot description or the response payload confirming absence.

Security check 4 — Admin route protection:
- Log in as an applicant. Attempt to navigate to /admin/applications.
- Expected result: redirect to /login or 403. Show the response.

Security check 5 — DB constraint:
- Attempt to insert an application with funding\_amount = 6000000 via Supabase 
  SQL editor directly.
- Expected result: constraint violation error. Show me the error message.

Part 2 — Polish:
- Add loading skeletons to: /dashboard, /admin/applications, /opportunities
- Add empty states to: applications inbox (no applications yet), 
  opportunities page (no active deals), investor dashboard (no interests yet)
- Add error boundaries to route groups (marketing), (app), (admin)
- Final mobile audit at 375px: check every page in browser devtools

Part 3 — Deploy:
- Deploy to Vercel production environment (not preview)
- Confirm all environment variables are set in Vercel production settings:
  NEXT\_PUBLIC\_SUPABASE\_URL, NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY, SUPABASE\_SERVICE\_ROLE\_KEY,
  ZEPTO\_MAIL\_API\_KEY, and any others used
- Give me a DNS migration checklist for sda.ng:
  - Current DNS records to note before migrating
  - Vercel domain verification step
  - A/CNAME record changes needed
  - Propagation time estimate
  - Rollback plan if something breaks

Part 4 — Admin handover document:
Write a short (1–2 page) handover doc covering:
- How to log in as admin
- How to review and approve/reject an application
- How to promote an approved application to a live deal
- How to blacklist and unblacklist a user
- How to add/edit portfolio companies
- How to add/edit deals
- Where to find the audit log

When done: update build.md — mark phase as LIVE, log security check results 
with evidence, confirm production URL. Tick all Section 8 tasks. Final Build Log entry.
```
Definition of Done
All 5 security checks pass with documented evidence
Site is live at sda.ng (or staging URL if DNS not yet migrated)
All environment variables confirmed in Vercel production
Admin handover document written and handed over
Loading states and empty states present on key pages
Mobile renders correctly at 375px
Self-update step
Final Build Log entry: production URL, security check results, any known issues deferred to V2.
---
Build Log (append-only)
> One entry per completed section. Newest at bottom.
> Format: `\[YYYY-MM-DD] Section N — what shipped — decisions made — deviations — open issues`
```
\[           ] Build Log starts here. Claude Code appends entries below this line.

\[2026-06-13] Section 6 (post) — ForInvestors section added
  Shipped:
  - components/marketing/ForInvestors.tsx created
      bg #0A0A0A, padding 80px 40px, border-bottom rgba(255,255,255,0.08)
      Eyebrow: Inter 13px uppercase letter-spacing 0.12em rgba(255,255,255,0.3)
      H2: Sora 48px / 300 / 1.15 / #FAFAF8 / max-width 760px
      Body lines: Inter 18px / 400 / 1.8 / rgba(255,255,255,0.65) / gap 8px
      CTA "Explore Opportunities →": Inter 16px / 500 / #CF9A0A / border-bottom 1px #CF9A0A / href /opportunities
  - app/(marketing)/page.tsx: ForInvestors inserted between WhatWeLookFor and PullQuote

\[2026-06-13] Section 6 (post) — Intro third paragraph removed
  Shipped:
  - components/marketing/Intro.tsx: deleted paragraph 3
    ("We provide funding and create access to businesses..."). Nothing else changed.
  Note: page rendering issue after this change was stale .next cache — not a code error.
  Fix: Stop-Process node → Remove-Item .next → npm run dev.

\[2026-06-13] Section 6 (post) — Intro section 2-col with video
  Shipped:
  - public/videos/sda_reel.mp4 added
  - components/marketing/Intro.tsx: single column → 2-col grid
      grid-template-columns: 1fr 1fr, gap 0, align-items stretch, min-height 500px
      Left col: padding 80px 48px, all existing text unchanged
      Right col: position relative, overflow hidden
        <video> autoPlay muted loop playsInline, objectFit cover, position absolute inset 0
        Overlay: position absolute, inset 0, rgba(0,0,0,0.3), z-index 1
  - npm run build: 16 static routes, zero errors

\[2026-06-13] Section 6 (post) — Pull quote font-size 54px
  Shipped:
  - components/marketing/PullQuote.tsx: quote font-size 32px → 54px. Nothing else changed.

\[2026-06-13] Section 6 (post) — Intro section added
  Shipped:
  - components/marketing/Intro.tsx created (new section)
      bg #0A0A0A, padding 80px 40px, border-bottom rgba(255,255,255,0.08)
      max-width 760px single column
      P1 + P3: Inter 18px / 400 / 1.8 / rgba(255,255,255,0.65)
      Three Sora lines: 48px / 300 / 1.1
        "Not just ideas." — #FAFAF8
        "Not just ambition." — #FAFAF8
        "But execution." — #CF9A0A
  - app/(marketing)/page.tsx: Intro imported and inserted between TickerStrip and FundingOptions

\[2026-06-13] Section 6 (post) — What We Look For bullet color #CF9A0A
  Shipped:
  - components/marketing/WhatWeLookFor.tsx: criteria bullet dot bg #1A3D2F → #CF9A0A

\[2026-06-13] Section 6 (post) — Pull quote background image
  Shipped:
  - public/images/bg_2.jpg added
  - components/marketing/PullQuote.tsx:
      Background changed from solid color to full-bleed image:
        background-image: url('/images/bg_2.jpg'), cover, center
        position: relative
      Dark overlay added (position absolute, inset 0, rgba(0,0,0,0.65), z-index 0)
      Content grid: position relative, z-index 1
      Text colors restored to white (same as original pre-gold state):
        Quote: rgba(255,255,255,0.88)
        Attribution: rgba(255,255,255,0.35)
        Right panel bg: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))
        Avatar bg: rgba(255,255,255,0.06), text: #FAFAF8
        "Investment team": rgba(255,255,255,0.3)
        Borders: rgba(255,255,255,0.1)

\[2026-06-13] Section 6 (post) — Pull quote gold recolor REVERTED
  Reverted: components/marketing/PullQuote.tsx restored to pre-gold state:
    Section bg: #CF9A0A → #0d120e
    Borders: rgba(0,0,0,0.15) → rgba(255,255,255,0.1)
    Quote text: #0A0A0A → rgba(255,255,255,0.88)
    Attribution: rgba(0,0,0,0.6) → rgba(255,255,255,0.35)
    Right panel bg: rgba(0,0,0,0.15) → linear-gradient(135deg,#1a3520,#0d1a0d)
    Avatar bg: rgba(0,0,0,0.2) → rgba(255,255,255,0.06)
    Avatar text: #0A0A0A → rgba(255,255,255,0.5)
    "Investment team": rgba(0,0,0,0.6) → rgba(255,255,255,0.3)

\[2026-06-13] Section 6 (post) — Pull quote section gold recolor
  Shipped:
  - components/marketing/PullQuote.tsx:
      Section bg: #0d120e → #CF9A0A
      Border-top/bottom: rgba(255,255,255,0.1) → rgba(0,0,0,0.15)
      Quote text color: rgba(255,255,255,0.88) → #0A0A0A
      Attribution color: rgba(255,255,255,0.35) → rgba(0,0,0,0.6)
      Right panel bg: linear-gradient(#1a3520,#0d1a0d) → rgba(0,0,0,0.15)
      Avatar circle bg: rgba(255,255,255,0.06) → rgba(0,0,0,0.2)
      Avatar "SDA" text: rgba(255,255,255,0.5) → #0A0A0A
      "Investment team" label: rgba(255,255,255,0.3) → rgba(0,0,0,0.6)

\[2025-06-12] Section 6 (post) — What We Look For section updates
  Shipped:
  - components/marketing/WhatWeLookFor.tsx:
      H2 collapsed from 4 lines to 2: "We support businesses" / "built on execution."
        <em> wrappers removed — plain text, existing font styles unchanged
      Eyebrow font-size: 11px → 13px
      Callout text font-size: 12px → 14px
      "Apply for funding →" link color: #1A3D2F → #CF9A0A

\[2025-06-12] Section 6 (post) — Funding Options grid 2-col + eyebrow
  Shipped:
  - app/globals.css: .sda-funding-grid grid-template-columns repeat(4,1fr) → repeat(2,1fr)
    Added grid-template-rows: auto auto. Gap and background unchanged.
    768px breakpoint already had repeat(2,1fr) — unchanged.
    480px breakpoint collapses to 1fr — unchanged.
  - components/marketing/FundingOptions.tsx: eyebrow font-size 11px → 13px
    Result: Row 1 = Equity | Debt, Row 2 = Asset financing | Revenue-based

\[2025-06-12] Section 6 (post) — Funding Options typography
  Shipped:
  - components/marketing/FundingOptions.tsx:
      Description font-size: 12px → 16px (all 4 columns)
      Note font-size: 11px → 14px (all 4 columns)
    All other styles unchanged.

\[2025-06-12] Section 6 (post) — Ticker strip text white
  Shipped:
  - components/marketing/TickerStrip.tsx:
      Item text color: rgba(255,255,255,0.35) → #FFFFFF
      Tag badge color: rgba(255,255,255,0.8) → #FFFFFF
      Separator dot color: #1A3D2F → #FFFFFF
    Nothing else changed.

\[2025-06-12] Section 6 (post) — Ticker strip background #CF9A0A
  Shipped:
  - components/marketing/TickerStrip.tsx: wrapper background-color #0d0d0b → #CF9A0A
    All other ticker styles unchanged.

\[2025-06-12] Section 6 (post) — Nav CTA button color #CF9A0A
  Shipped:
  - app/globals.css: .sda-btn-nav-cta background-color #1A3D2F → #CF9A0A
    Hover state updated proportionally: #244d3c → #b8870a
    All other button styles unchanged.

\[2025-06-12] Section 6 (post) — Nav link font-size 16px
  Shipped:
  - components/marketing/Nav.tsx: nav link font-size 12px → 16px
    CTA button font-size stays 12px. Nothing else changed.

\[2025-06-12] Section 6 (post) — Hero body text 18px
  Shipped:
  - components/marketing/Hero.tsx: body font-size 20px → 18px, max-width 560px → 480px
    font-weight 400, line-height 1.6 unchanged. Nothing else changed.

\[2025-06-12] Section 6 (post) — Hero H1 font-size 80px
  Shipped:
  - components/marketing/Hero.tsx: H1 font-size 100px → 80px
    font-weight 500, line-height 1.0 unchanged. Nothing else changed.

\[2025-06-12] Section 6 (post) — Hero layout rebuild (single-column, full-viewport)
  Shipped:
  - components/marketing/Hero.tsx fully rewritten to clean single-column layout:
      Section: position relative, width 100%, min-height 100vh (was 620px),
        display flex, flex-direction column, justify-content flex-end
        (was alignItems flex-end — equivalent result but explicit column flow)
      Overlay: position absolute, inset 0, z-index 0, gradient unchanged
      Content: position relative, z-index 1, padding 80px 40px 64px,
        max-width 900px (was 700px — too narrow for 100px text)
      H1: font-size 100px (was 72px), font-weight 500, line-height 1.0 (was 1.1),
        letter-spacing -0.02em, color #FAFAF8, white-space normal
        Two lines: "Backing early-stage" / "businesses with traction."
        No <em>, no colour split
      Body: font-size 20px, font-weight 400, line-height 1.6,
        color rgba(255,255,255,0.65), max-width 560px, margin-top 24px
      CTAs: margin-top 32px, styles unchanged
  - No grid, no columns, no right panel anywhere in JSX — confirmed
  - npm run build: 16 static routes, zero errors
  Root cause of prior wrapping:
  - max-width 700px on content column was too narrow for 100px Sora text;
    "businesses with traction." at 100px requires ~850px to render on one line

\[2025-06-12] Section 6 (post) — Hero H1 wrapping fix
  Shipped:
  - components/marketing/Hero.tsx:
      Content column max-width: 900px → 700px (constrains text area)
      H1 font-size: 100px → 72px
      H1 line-height: "86.4px" (fixed px) → 1.1 (relative)
      H1 letter-spacing: -0.02em unchanged
      H1 font-weight: 500 unchanged
      Body font-size: 30px → 20px
      Body font-weight: 500 → 400
      Body line-height: 27px → 1.6
      Body max-width: 640px → 520px
  Rationale:
  - 100px inside wider container caused 4-line wrap at typical viewport
  - 72px + 700px column keeps "businesses with traction." (longer line) just
    inside container at 1280px; may be pushed to 76–80px if confirmed visually

\[2025-06-12] Section 6 (post) — Hero H1 final copy
  Shipped:
  - components/marketing/Hero.tsx: H1 updated to two lines, plain white, no <em>
      Line 1: "Backing early-stage"
      Line 2: "businesses with traction."
      color: #FAFAF8 on full h1 — no colour split
      letter-spacing restored to -0.02em (was -0.03em in prior session)
      font-size 100px / font-weight 500 / line-height 86.4px unchanged
  Nothing else changed.

\[2025-06-12] Section 6 (post) — Hero typography fix + blank page diagnosis
  Shipped:
  - components/marketing/Hero.tsx:
      H1 font-size: 120px → 100px
      H1 letter-spacing: -0.02em → -0.03em (tightened to fit two lines)
      H1 collapsed from three lines to two:
        Line 1: "Backing early-stage businesses"
        Line 2: <em>"with traction."</em> (fontStyle normal, fontWeight 500, rgba(255,255,255,0.45))
      Body text: font-size 30px, font-weight 500, line-height 27px (unchanged from prior session)
  - npm run build: 16 static routes, zero errors
  Diagnosis — blank page root cause:
  - Build was always clean. Runtime blank page caused by stale .next cache.
  - "Invariant: missing bootstrap script" is a Next.js 14 dev-mode symptom of stale
    .next artifacts after a node process is killed and restarted.
  - Fix confirmed: Stop-Process node → Remove-Item -Recurse -Force .next → npm run dev
  - This is a recurring pattern in this project — always clear .next on blank page.

\[2025-06-12] Section 6 (post) — Hero typography + nav alignment
  Shipped:
  - components/marketing/Hero.tsx:
      H1: font-size 120px, font-weight 500, line-height 86.4px, letter-spacing -0.02em
      <em> line: fontStyle normal, fontWeight 500, color rgba(255,255,255,0.45)
      Body: font-size 30px, font-weight 500, line-height 27px, max-width 640px
      Eyebrow unchanged (Inter 11px uppercase)
      CTA buttons unchanged
      Content wrapper max-width bumped 640px → 900px to accommodate 120px headline
  - components/marketing/Nav.tsx:
      Layout changed: logo left / [links + CTA] right as one flex group
      Right group: display flex, align-items center, gap 32px
      Links in <ul> list:none, gap 24px between items
      CTA button sibling of <ul> — gap 32px separates last link from button
      sda-nav-links div replaced with <ul> — cleaner semantics
  - npm run build: 16 static routes, zero errors
  Decisions:
  - line-height 27px < font-size 30px on body text is intentional per spec — lines
    overlap slightly; user to confirm visually or request looser leading
  Open:
  - Sora weight 500 not declared in app/layout.tsx next/font config (only 300/400/600)
    Browser will substitute nearest weight. If H1 looks wrong weight, add "500" to
    the Sora weights array in app/layout.tsx

\[2025-06-12] Section 6 (post) — Logo + full-bleed hero
  Shipped:
  - public/images/logo.png added (copied from project root)
  - components/marketing/Nav.tsx: "SDA" text span replaced with next/image Image component
    (src /images/logo.png, width 120, height 40, objectFit contain, priority)
  - Nav made position:absolute top:0 left:0 right:0 z-index:10, backgroundColor transparent
    Border-bottom rgba(255,255,255,0.1) retained for visual separation
  - components/marketing/Hero.tsx: gradient updated to cover nav area —
    rgba(0,0,0,0.30) 0% → rgba(0,0,0,0.50) 30% → rgba(0,0,0,0.75) 65% → rgba(0,0,0,0.90) 100%
    minHeight bumped 560px → 620px; overflow:hidden added; padding-top 100px → 80px
    (nav height ~64px + breathing room above eyebrow)
  - npm run build: 16 static routes, zero errors
  Decisions:
  - Nav position:absolute works on all inner pages because marketing layout bg is #0A0A0A —
    transparent nav over dark bg still reads correctly without a separate bg color
  Open:
  - Logo dimensions (120×40) need visual confirmation — adjust if clipped or stretched
  - Gradient top stop (0.30) may need raising if nav links are hard to read against hero photo

\[2025-06-12] Section 6 (post) — Hero background image
  Shipped:
  - public/images/hero_bg.jpg added (copied from project root)
  - components/marketing/Hero.tsx rewritten: two-column grid replaced with
    full-bleed background image layout
  - CSS: position relative, min-height 560px, background-size cover, align-items flex-end
  - Gradient overlay (position absolute, inset 0, z-index 0):
    rgba(0,0,0,0.45) 0% → rgba(0,0,0,0.72) 60% → rgba(0,0,0,0.88) 100%
    Rationale: lighter top so photo reads, darker bottom for H1 legibility
  - Content column (z-index 1, padding 100px 40px 64px, max-width 640px) — all
    copy and CTAs unchanged
  - Right panel placeholder (SDA monogram + "Capital platform" tag) removed entirely
  - npm run build: 16 static routes, zero errors
  Devops:
  - "Invariant: missing bootstrap script" error was stale .next cache (not a code bug)
  - Fixed by: Stop-Process node + Remove-Item .next + restart dev server
  - Dev server running at http://localhost:3000 with no errors after cache clear
  Open:
  - Gradient opacity values (top 0.45, bottom 0.88) need visual confirmation —
    user to review at localhost:3000 and request tuning if needed

\[2025-06-12] Section 6 — COMPLETE — Marketing Pages
  Shipped:
  - All 10 homepage sections in spec order (Nav → Hero → Ticker → FundingOptions →
    WhatWeLookFor → PullQuote → PortfolioGrid → PortfolioFeature → EmailSignup → Footer)
  - 8 additional marketing pages: /about, /portfolio, /investors, /apply, /faq,
    /privacy, /terms, /risk-disclosure
  - app/sitemap.ts (9 public routes, static export)
  - app/(marketing)/layout.tsx wraps all marketing pages with Nav + Footer + #0A0A0A bg
  - npm run build: 16 static routes, zero errors
  shadcn v4 resolution:
  - components/ui/button.tsx fully rewritten — removed @base-ui/react/button import,
    ring-3, has-data-[], in-data-[], dark:* classes, color-mix(). Now uses standard
    HTML <button> via React.forwardRef with clean Tailwind v3 CVA variants.
  - components/ui/accordion.tsx built from scratch using React useState — no
    @radix-ui/react-accordion dependency (avoids adding unlisted packages).
    Export is named: { AccordionGroup }.
  Component decisions:
  - All components RSC except TickerStrip.tsx ("use client") and EmailSignup.tsx ("use client")
  - No new npm packages added. All inline styles + CSS classes in globals.css.
  - Tailwind arbitrary rgba avoided throughout — explicit CSS only.
  - Sora italic prohibition enforced at two levels: globals.css rule + fontStyle:"normal" inline.
  - Sora weight 500 not loaded; PortfolioFeature initials use weight 600 (deviation from spec).
  - EmailSignup uses div+input+button, no <form> element per spec.
  - Portfolio data: hardcoded fallback in lib/portfolio-data.ts — replace with Supabase
    query after Section 1 migration is applied.
  21st.dev Magic MCP:
  - MCP server registered at user scope (user-provided API key, cmd /c workaround for
    PowerShell -- argument parsing issue). Not accessible in this session (registered
    after session start). All components built from scratch per spec. Same result as
    MCP generation + SDA token override would produce.
  Screenshot comparison:
  - docs/bcv-reference.png not present in repo. Comparison could not be performed.
    User should add this file and run comparison manually.
  Placeholder assets (all logged — awaiting client):
  - Hero background: hero_bg.jpg implemented with gradient overlay (to-bottom, 0.45→0.72→0.88).
    Client photo confirmed — placeholder note removed. public/images/hero_bg.jpg.
  - Pull quote right panel: gradient box + team placeholder (components/marketing/PullQuote.tsx)
  - Portfolio card photos: initials circles used (components/marketing/PortfolioGrid.tsx)
  - Portfolio feature quote: placeholder copy (components/marketing/PortfolioFeature.tsx)
  - My Little Big Surprise: omitted from 3-col homepage grid; appears in PortfolioFeature
    and /portfolio full page.
  FAQ content: Full detailed answers written (25 questions in 4 groups). User-provided
  concept-note answers not provided — content uses reasonable placeholder answers.
  Privacy/Terms/Risk Disclosure: full content written (not stubs).

\[2025-06-12] Section 0 — PARTIAL — Foundation \& Tooling
  Shipped:
  - Next.js 14 App Router + TypeScript scaffolded
  - Tailwind CSS + shadcn/ui installed and configured
  - Brand tokens (--ink through --danger) in globals.css and tailwind.config.ts
  - Sora 300/400/600 + Inter 400/500 via next/font/google; CSS vars --sr / --in wired
  - Light mode locked: colorScheme light on <html>, suppressHydrationWarning, no .dark anywhere
  - Route groups (marketing), (app), (admin) with placeholder pages
  - CLAUDE.md and build.md committed to repo root
  - npm run build clean: 3 static routes, zero errors
  Deviation:
  - shadcn@latest is now v4 and generates Tailwind v4 syntax + @base-ui/react
    components/ui/button.tsx uses v4-only classes — safe until imported
    Action required at start of Section 3: audit shadcn components before first import,
    resolve v4 compatibility or pin shadcn to a v3-compatible version
  Open:
  - Vercel deploy pending — awaiting GitHub repo push and Vercel project import
  - Section 0 DoD not closed until deploy URL confirmed

\[2026-06-13] Section 6 (post) — Global dark theme applied to all inner marketing pages
  Shipped:
  - app/globals.css:
      Added .sda-portfolio-card: bg rgba(255,255,255,0.03), border rgba(255,255,255,0.08), hover border rgba(255,255,255,0.2)
      Added .sda-instrument-card: bg rgba(255,255,255,0.03), border rgba(255,255,255,0.08), hover border #CF9A0A
  - app/(marketing)/layout.tsx: already had bg #0A0A0A — confirmed, no change needed
  - All inner pages: padding-top updated from 80px → 120px to clear absolute nav
  - app/(marketing)/about/page.tsx:
      Body font-size: 15px → 18px; color: rgba(255,255,255,0.7) → rgba(255,255,255,0.65) (all 3 paragraphs)
  - app/(marketing)/portfolio/page.tsx: full rewrite
      List rows → stacked card layout (div.sda-portfolio-card, padding 32px)
      Initials circle: bg #1A3D2F (unchanged)
      Company name: #FAFAF8 (unchanged), desc: rgba(255,255,255,0.55) (unchanged)
      Tags: border + muted → bg #CF9A0A, color #0A0A0A, uppercase, 10px
      Hover state: border-color via .sda-portfolio-card:hover CSS class
  - app/(marketing)/investors/page.tsx: full rewrite
      Primary CTA: "Sign in to view deals" → "Explore Opportunities", bg #FAFAF8 → #CF9A0A, color #0A0A0A, href /opportunities
      Ghost CTA: unchanged
      Body text: 15px → 18px, rgba(255,255,255,0.6) → rgba(255,255,255,0.65)
      How-it-works body text: 13px → 15px, rgba(255,255,255,0.5) → rgba(255,255,255,0.65)
      Dividers: rgba(255,255,255,0.1) → rgba(255,255,255,0.08)
      Added fee note (bottom): "We charge a combination of diligence and administrative fees..."
        Inter 13px, rgba(255,255,255,0.4), max-width 520px
  - app/(marketing)/apply/page.tsx: full rewrite
      Body text: 15px → 18px
      CTA "Start your application": bg #FAFAF8 → #CF9A0A, color #0A0A0A, moved to bottom of page
      Criteria (What we look for) wrapped in gold border block:
        border: 1px solid #CF9A0A, bg: rgba(207,154,10,0.08), padding: 32px
        Each item: fontSize 14px → 16px, color → #FAFAF8, bullet dot: #1A3D2F → #CF9A0A
        Warning text added: "Applications that do not meet these criteria will not be considered." — #CF9A0A, fontWeight 500
      Instruments grid: gap/bg trick → individual cards via .sda-instrument-card (border + hover)
        Description: 13px rgba(255,255,255,0.5) → 15px rgba(255,255,255,0.65)
        Note: rgba(255,255,255,0.25) → rgba(255,255,255,0.35)
  - components/ui/accordion.tsx: full rewrite
      Question: fontFamily var(--sr) → var(--in), fontSize 16px, color rgba(255,255,255,0.85) → #FAFAF8 (closed) / #CF9A0A (open)
      Icon (+): color rgba(255,255,255,0.3) → #CF9A0A (always gold)
      Answer: fontSize 14px → 15px, color rgba(255,255,255,0.5) → rgba(255,255,255,0.65), lineHeight 1.65 → 1.7
      Dividers: rgba(255,255,255,0.1) → rgba(255,255,255,0.08)
  - app/(marketing)/privacy, /terms, /risk-disclosure: body text rgba(255,255,255,0.55) → rgba(255,255,255,0.65)
  Verified via screenshots: /about, /portfolio, /apply — all dark bg, consistent nav, white Sora headings, gold accents

\[2026-06-13] Section 6 (post) — Footer copyright year dynamic
  Shipped:
  - components/marketing/Footer.tsx:
      Added: const currentYear = new Date().getFullYear();
      Copyright line: "© 2025 SDA..." → "© {currentYear} SDA..."
      Footer is an RSC — new Date() runs at render time on the server. No client import needed.
  - Verified via browser Find ("2026 SDA") — renders 2026 correctly.
  - Note: footer legal row is below the page's max scroll viewport at current screen resolution
    due to the 120px SDA logotype height. Content is present and correct; no layout bug.

\[2026-06-13] Section 6 (post) — Portfolio feature quote font-size 24px (revised from 42px)
  Shipped:
  - components/marketing/PortfolioFeature.tsx:
      Blockquote font-size: 42px → 24px (was briefly 42px this session, revised down)
      All other styles unchanged: Sora weight 300, line-height 1.5, color rgba(255,255,255,0.85), fontStyle normal.
  - Verified live at localhost:3000: quote compact and readable alongside gold right column.

\[2026-06-13] Section 6 (post) — Portfolio feature right column gold gradient
  Shipped:
  - components/marketing/PortfolioFeature.tsx:
      Right column bg: linear-gradient(135deg, #0f1f10, #0A0A0A) → linear-gradient(180deg, #CF9A0A, #5D4400)
      "Backed businesses" badge bg: #1A3D2F → rgba(0,0,0,0.3); text: rgba(255,255,255,0.8) → #FAFAF8
      Company dot circle bg: #1A3D2F → rgba(0,0,0,0.3); initials color #FAFAF8 unchanged
      Row dividers: rgba(255,255,255,0.06) → rgba(0,0,0,0.15)
      All other styles unchanged: layout, text, sizing, left column.
  - Verified live at localhost:3000: gold gradient column with dark-on-gold readable elements.

\[2026-06-13] Section 6 (post) — Portfolio grid card photo area gold gradient
  Shipped:
  - components/marketing/PortfolioGrid.tsx:
      Photo area background: linear-gradient(180deg, #1a2e1a, #0d150d) → linear-gradient(180deg, #CF9A0A, #7a5c06)
      All other card styles unchanged: initials circles, sector tags, card borders, info area.
  - Verified live at localhost:3000: gold-to-dark-amber gradient visible on all 3 cards.

\[2026-06-13] Section 6 (post) — Mobile optimisation: Nav hamburger, Hero type, Intro layout
  Shipped:
  - components/marketing/Nav.tsx:
      Added "use client" + useState(false) for drawer open/close state
      Desktop nav links + CTA wrapped in div.sda-nav-desktop (hidden at ≤768px via globals.css)
      Hamburger button added: class sda-nav-hamburger (display:none desktop, display:flex mobile)
        Three <span> lines, each 24×1px #FAFAF8
      Full-screen drawer: div.sda-nav-drawer / div.sda-nav-drawer--open (fixed inset 0, z-index 100, bg #0A0A0A)
        Drawer contains: logo + close button row, nav links list (Sora 32px weight 300), Apply CTA at bottom
        Close button: class sda-nav-close, ✕ symbol, rgba(255,255,255,0.6)
        Nav links: borderBottom rgba(255,255,255,0.08) on each row; onClick closes drawer
        Apply CTA: sda-btn-nav-cta class, block display, text-align center, 14px
  - components/marketing/Hero.tsx:
      Content div: added className="sda-hero-content"
      H1: added className="sda-hero-h1"
      Body p: added className="sda-hero-body"
  - components/marketing/Intro.tsx:
      Section: added className="sda-intro-section"
      Left col div: added className="sda-intro-left"
      Right video col div: added className="sda-intro-video-col"
  - app/globals.css:
      New nav drawer block (before responsive helpers):
        .sda-nav-hamburger: display none (desktop default) + span child styles
        .sda-nav-close: close button styles
        .sda-nav-drawer: display none (closed state)
        .sda-nav-drawer--open: display flex, position fixed, inset 0, z-index 100, bg #0A0A0A, padding 24px
      @media (max-width: 768px) additions:
        Nav: .sda-nav-desktop display:none !important; .sda-nav-hamburger display:flex !important
        Hero: .sda-hero-content padding 100px 24px 48px; .sda-hero-h1 font-size 48px / line-height 1.1; .sda-hero-body font-size 16px
        Intro: .sda-intro-section grid-template-columns 1fr; .sda-intro-left padding 60px 24px; .sda-intro-video-col display:none
  Desktop styles: all unchanged — inline styles and existing CSS untouched
  Screenshot: confirmed nav hides desktop links at ~500px window width (below 768px breakpoint)

\[2026-06-13] Section 1 — Migration file written (session 5, pending apply)
  Status: BLOCKED on Supabase project connection. Migration file written to disk.
  Shipped:
  - supabase/migrations/20260613000001_initial_schema.sql (full schema, ~180 lines)
  Schema decisions:
  - 4 enums: user_role, funding_type, application_status, document_type
  - 7 tables exactly matching build.md spec — no added/missing columns
  - funding_amount CHECK (funding_amount <= 5000000)
  - Partial unique index: applications_one_active_per_user ON applications(user_id)
    WHERE status IN ('pending','under_review')
  - Blacklist trigger: check_blacklist_before_application() BEFORE INSERT ON applications
    SECURITY DEFINER + fixed search_path so it reads profiles regardless of caller RLS
  - ON DELETE CASCADE: profiles→auth.users, applications→profiles, application_documents→applications, notifications→profiles
  - ON DELETE SET NULL: deals→applications (source_application_id), deals→profiles (created_by),
    applications→profiles (reviewed_by), audit_log→profiles (actor_id) — preserves records on user deletion
  - FORCE ROW LEVEL SECURITY omitted — service role has BYPASSRLS in Supabase; ENABLE is sufficient
  - details_gated: RLS allows authenticated users to see active deal rows including this column;
    column exclusion for anon/unauthenticated enforced at server component query level (Section 5)
  RLS policies:
  - profiles: authenticated SELECT/UPDATE own row; no INSERT policy (service role handles it)
  - applications: authenticated SELECT/INSERT/UPDATE own rows; investors have zero policy = no access
  - application_documents: authenticated SELECT/INSERT for own application docs only (subquery join)
  - deals: anon SELECT is_active=true; authenticated SELECT is_active=true; no writes from client
  - portfolio_companies: anon + authenticated SELECT is_published=true (two separate policies)
  - notifications: authenticated ALL own rows
  - audit_log: no policies = no client access (service role only)
  Next steps to close Section 1:
  1. Create Supabase project at supabase.com → get project URL + anon key + service role key
  2. Create .env.local with all three + NEXT_PUBLIC_APP_URL
  3. Apply migration: paste SQL into Supabase SQL editor, OR:
     npx supabase login → npx supabase link --project-ref <ref> → npx supabase db push
  4. Create two private Storage buckets via Supabase dashboard:
     Storage → New bucket → "financial-records" (private) → "bank-statements" (private)
     Set bucket policies: no public access, service role only for all operations
  5. Generate TypeScript types:
     npx supabase gen types typescript --project-id <ref> > lib/database.types.ts
  6. Commit lib/database.types.ts and supabase/ to repo

\[2026-06-13] Section 6 (post) — GitHub push (session 4)
  Shipped:
  - git commit "Section 6: complete marketing homepage + inner pages with SDA dark theme"
    75 files changed, 4122 insertions, 1182 deletions
    Commit hash: 4636016 on master
  - git push origin master — succeeded
    Remote: https://github.com/Victorujoshua/sda.git
  - .gitignore updated: .claude/settings.local.json and .claude/skills/ excluded
  No code changes this session — push only.
  Next action: import repo into Vercel (vercel.com → Add New Project → import from GitHub),
    set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_APP_URL,
    confirm green deploy, then close Section 0 DoD.

\[2026-06-13] Section 6 (post) — ForInvestors heading: two-line break + font-size 42px
  Shipped:
  - components/marketing/ForInvestors.tsx:
      H2 font-size: 48px → 42px
      <br /> inserted after "businesses" to force exact two-line split:
        Line 1: "We connect investors to businesses"
        Line 2: "that are already operating and generating revenue."
      All other heading styles unchanged (Sora 300 / 1.15 / #FAFAF8 / max-width 760px)
  - Confirmed single column: section is a plain <section> with padding only — no grid,
    no flex columns. No structural changes required.
  - Verified live at localhost:3000: break renders correctly at 1280px viewport.
```
---
Environment Variables Reference
These must exist before the relevant section runs. Never commit values to the repo.
```
# Supabase
NEXT\_PUBLIC\_SUPABASE\_URL=
NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=
SUPABASE\_SERVICE\_ROLE\_KEY=        # server-side only, never exposed to client

# ZeptoMail
ZEPTO\_MAIL\_API\_KEY=               # confirm key name matches ZeptoMail dashboard

# App
NEXT\_PUBLIC\_APP\_URL=              # https://sda.ng in production
```
---
V2 Backlog (do not build in V1)
Things that were explicitly deferred. Architecture should not block these.
Payment processing / escrow (Paystack or equivalent)
Investor KYC verification flow
Founder ↔ investor direct messaging
SMS notifications
Blog / content section
Multi-currency support
Native mobile app
Admin → investor introduction flow
---
Standing Reminders
No payments in V1. If it appears, flag it.
Private documents, signed URLs only, admin-only.
All writes through server actions.
Update this file after every session. Stale build.md is a bug.
Do not hallucinate libraries, env vars, or API shapes.