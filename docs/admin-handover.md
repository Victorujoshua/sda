# Imani Ventures Admin Handover

## Logging in as admin

1. Go to `/login`
2. Sign in with your admin email and password
3. You will be redirected to `/dashboard` — click **Admin portal →** in the top-right, or go directly to `/admin`

> Your account must have `role = 'admin'` in the `profiles` table. To seed a first admin, run:
> ```sql
> UPDATE profiles SET role = 'admin' WHERE id = '<your-user-uuid>';
> ```

---

## Reviewing an application

1. Go to **Admin → Applications** (`/admin/applications`)
2. Use the filters (status, funding type) or the search box to find the application
3. Click the business name to open the detail view
4. Review all fields: business details, funding ask, documents (signed URLs, valid 10 minutes), admin notes

**Actions available on the detail page:**

| Button | What it does |
|---|---|
| Mark Under Review | Sets status to `under_review`, sends email to applicant |
| Approve | Sets status to `approved`, sends email to applicant |
| Reject | Opens a text field — rejection reason is required. Sets status to `rejected`, sends reason to applicant by email |
| Blacklist User | Opens a text field — reason required. Prevents this user from submitting future applications |

All actions are logged to the audit log automatically.

---

## Promoting an approved application to a live deal

1. Open the application detail page
2. Once status is **Approved**, a **Promote to deal →** button appears at the top right
3. Click it — you will see a prefilled form with the application's business name, description, and funding ask
4. Fill in or edit:
   - **Public summary** (required) — shown to all visitors
   - **Full details** (optional) — shown only to logged-in investors
   - **Industry**, **Revenue to date**, **Funding required**
   - **Active** checkbox — uncheck to keep the deal hidden until ready
5. Submit — the deal appears immediately on `/opportunities`

---

## Blacklisting and unblacklisting a user

**To blacklist:** On any application detail page, click **Blacklist User** in the right sidebar. A reason is required. The user cannot submit new applications while blacklisted. The action is logged.

**To unblacklist:** Go to **Admin → Users** (`/admin/users`). Find the user. Click **Remove blacklist**. The user can submit again immediately.

---

## Adding and editing portfolio companies

Go to **Admin → Portfolio** (`/admin/portfolio`).

**To add a company:**
1. Click **+ Add company**
2. Fill in: name, description, display order, published toggle
3. Submit — the company appears in the list

**To edit:** Click any company row to expand it. Edit the fields inline and save. Toggle **Published** to show or hide the company on the public `/portfolio` page.

---

## Adding and editing deals

Go to **Admin → Deals** (`/admin/deals`).

**To edit a deal:** Click any deal row to expand it. Edit summary, details, industry, funding figures. Save.

**To deactivate a deal:** Click **Deactivate** on the deal row. The deal disappears from `/opportunities` immediately. This is reversible — set `is_active = true` via the Supabase SQL editor if needed (the UI does not currently have a reactivate button).

---

## Finding the audit log

The audit log is in the `audit_log` table in Supabase. Every admin action creates one row.

To view it, go to your **Supabase dashboard → Table editor → audit_log**, or run:

```sql
SELECT
  al.created_at,
  p.full_name AS actor,
  al.action,
  al.target_type,
  al.target_id,
  al.metadata
FROM audit_log al
LEFT JOIN profiles p ON p.id = al.actor_id
ORDER BY al.created_at DESC
LIMIT 100;
```

### Audit action vocabulary

```
application.submitted        application.approved         application.rejected
application.under_review     user.blacklisted             user.unblacklisted
user.deactivated             user.reactivated             deal.created
deal.updated                 deal.deactivated             portfolio.created
portfolio.updated
```

---

## Environment variables (production)

These must be set in Vercel → Project Settings → Environment Variables:

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side only — never expose to client |
| `LOOPS_API_KEY` | From Loops dashboard → Settings → API keys — server-side only |
| `LOOPS_ADMIN_EMAIL` | Admin inbox for new application alerts |
| `NEXT_PUBLIC_APP_URL` | `https://imaniventures.org` in production |
