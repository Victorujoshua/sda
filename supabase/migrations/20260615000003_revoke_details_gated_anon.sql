-- ============================================================
-- Imani Ventures Platform — Security fix: block anon access to details_gated
-- Migration: 20260615000003_revoke_details_gated_anon
-- ============================================================
--
-- The deals_anon_read_active RLS policy allows the anon role to
-- read all columns of active deals, including details_gated.
-- Anyone with the public anon key can query the Supabase REST API
-- directly and read gated investor content without being logged in.
--
-- This revokes column-level SELECT on details_gated for the anon
-- role. The anon role retains SELECT on all other columns via the
-- existing deals_anon_read_active policy. Authenticated users
-- (investors) are unaffected — they use the 'authenticated' role.
-- ============================================================

REVOKE SELECT (details_gated) ON public.deals FROM anon;
