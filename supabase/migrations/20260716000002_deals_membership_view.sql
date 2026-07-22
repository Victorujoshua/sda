-- ============================================================
-- Imani Ventures — Fast-follow: data-layer protection for details_gated
-- Migration: 20260716000002_deals_membership_view
-- ============================================================
--
-- CONTEXT
-- The deals_auth_read_active RLS policy allows any authenticated user
-- to SELECT all columns of active deals, including details_gated.
-- Postgres RLS is row-level only — it cannot restrict individual columns
-- for the authenticated role. An unpaid investor with a valid JWT can
-- call the Supabase REST API directly and read details_gated.
--
-- This migration creates:
--   1. auth_has_gated_deal_access() — SECURITY DEFINER function that
--      checks whether the calling user may see details_gated.
--   2. deals_gated view — returns details_gated only when the above
--      function returns true; NULL otherwise.
--
-- ENFORCEMENT LAYERS AFTER THIS MIGRATION
--   Anon:                  column REVOKE (20260615000003) + not granted on view
--   Authenticated, unpaid: view returns NULL for details_gated
--   Authenticated, paid investor: view returns full details_gated
--   Admin / super_admin:   view returns full details_gated
--
-- HOW TO ACTIVATE (fast-follow step — do not apply without switching queries)
-- After applying this migration, switch the ONE app query that reads
-- details_gated as authenticated (non-admin) from from("deals") to
-- from("deals_gated"):
--
--   File: app/(marketing)/opportunities/[id]/page.tsx  ~line 238  (Path B)
--   Before: .from("deals").select("..., details_gated, ...")
--   After:  .from("deals_gated").select("..., details_gated, ...")
--
-- Admin queries (app/actions/admin.ts, app/(admin)/admin/deals/page.tsx,
-- components/admin/DealsManager.tsx, components/admin/PromoteForm.tsx)
-- continue to query from("deals") using the service role — no change needed.
-- ============================================================


-- ── Function: auth_has_gated_deal_access() ───────────────────
-- Returns true for paid investors AND admins/super_admins.
-- SECURITY DEFINER so it can read profiles.has_paid_membership
-- regardless of the caller's RLS context.
-- auth.uid() reads the JWT claim set by PostgREST — works in any
-- security context, including SECURITY DEFINER functions.

CREATE OR REPLACE FUNCTION public.auth_has_gated_deal_access()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (
      SELECT
        CASE
          WHEN role IN ('admin', 'super_admin') THEN true
          WHEN role = 'investor' AND has_paid_membership = true THEN true
          ELSE false
        END
      FROM profiles
      WHERE id = auth.uid()
    ),
    false
  )
$$;


-- ── View: deals_gated ────────────────────────────────────────
-- NOT security definer — the caller's row-level RLS on deals
-- still applies (is_active = true for both anon and authenticated).
-- The CASE expression calls auth_has_gated_deal_access() (which IS
-- security definer) to gate the column value.
--
-- GRANT to authenticated only. Anon is protected by the column
-- REVOKE in 20260615000003 and is not granted access here.

CREATE OR REPLACE VIEW public.deals_gated AS
SELECT
  id,
  source_application_id,
  business_name,
  industry,
  revenue_to_date,
  funding_required,
  summary_public,
  CASE
    WHEN public.auth_has_gated_deal_access() THEN details_gated
    ELSE NULL
  END AS details_gated,
  is_active,
  created_by,
  created_at
FROM public.deals;

GRANT SELECT ON public.deals_gated TO authenticated;
