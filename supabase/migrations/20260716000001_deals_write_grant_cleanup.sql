-- ============================================================
-- Imani Ventures — Hygiene: revoke inert write grants on deals
-- Migration: 20260716000001_deals_write_grant_cleanup
-- ============================================================
--
-- Deals are only written by admin server actions via the Supabase
-- service role (createAdminClient / BYPASSRLS). No code in the
-- app writes to deals using the anon or authenticated role.
--
-- No INSERT or UPDATE row-level security policies exist on deals
-- for anon or authenticated, so RLS already blocks these operations.
-- These REVOKEs remove the theoretical table-privilege attack surface
-- and make the intent explicit: deals are service-role-write-only.
--
-- Safe to apply: zero app code writes deals as anon/authenticated.
-- Admin mutations: promoteToDeals(), createDeal(), updateDeal() in
-- app/actions/admin.ts all use createAdminClient() (service role).
-- ============================================================

REVOKE INSERT, UPDATE ON public.deals FROM anon;
REVOKE INSERT, UPDATE ON public.deals FROM authenticated;

-- Note: DELETE is also inert (no DELETE policy exists on deals for
-- either role). Add REVOKE DELETE if you want full write lockdown:
--   REVOKE DELETE ON public.deals FROM anon;
--   REVOKE DELETE ON public.deals FROM authenticated;
