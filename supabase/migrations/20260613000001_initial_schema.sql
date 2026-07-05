-- ============================================================
-- Imani Ventures Platform — Section 1: Database Schema & RLS
-- Migration: 20260613000001_initial_schema
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('applicant', 'investor', 'admin');
CREATE TYPE funding_type AS ENUM ('equity', 'debt', 'asset', 'revenue_based');
CREATE TYPE application_status AS ENUM (
  'draft', 'pending', 'under_review', 'approved', 'rejected'
);
CREATE TYPE document_type AS ENUM ('financials', 'bank_statement');


-- ─────────────────────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────────────────────

-- profiles
-- One row per auth user. Row is created by a DB trigger on signup (Section 2).
-- Never insert from the client — service role only.
CREATE TABLE profiles (
  id               uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role             user_role   NOT NULL,
  full_name        text,
  phone            text,
  is_blacklisted   boolean     NOT NULL DEFAULT false,
  blacklist_reason text,
  is_active        boolean     NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- applications
CREATE TABLE applications (
  id                   uuid               PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid               NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name        text               NOT NULL,
  founder_name         text               NOT NULL,
  contact_email        text               NOT NULL,
  contact_phone        text,
  business_description text               NOT NULL,
  monthly_revenue      numeric,
  funding_amount       numeric            CHECK (funding_amount <= 5000000),
  funding_type         funding_type,
  status               application_status NOT NULL DEFAULT 'draft',
  rejection_reason     text,
  admin_notes          text,
  submitted_at         timestamptz,
  reviewed_at          timestamptz,
  reviewed_by          uuid               REFERENCES profiles(id) ON DELETE SET NULL,
  created_at           timestamptz        NOT NULL DEFAULT now()
);

-- At most one application in ('pending','under_review') per user.
-- Drafts and historical approved/rejected rows are not constrained.
CREATE UNIQUE INDEX applications_one_active_per_user
  ON applications (user_id)
  WHERE status IN ('pending', 'under_review');

-- application_documents
-- file_path is a Supabase Storage path only — never expose as a public URL.
-- Serve via server-generated signed URLs (10 min TTL), admin only.
CREATE TABLE application_documents (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id  uuid          NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_type   document_type NOT NULL,
  file_path       text          NOT NULL,
  uploaded_at     timestamptz   NOT NULL DEFAULT now()
);

-- deals
-- summary_public is visible to everyone.
-- details_gated must NEVER appear in any query for unauthenticated requests.
-- Primary enforcement: server component query excludes the column for anon.
-- RLS is the backstop (row-level only — column restriction is application-level).
CREATE TABLE deals (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  source_application_id uuid        REFERENCES applications(id) ON DELETE SET NULL,
  business_name         text        NOT NULL,
  industry              text,
  revenue_to_date       numeric,
  funding_required      numeric,
  summary_public        text        NOT NULL,
  details_gated         text,
  is_active             boolean     NOT NULL DEFAULT true,
  created_by            uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- portfolio_companies
CREATE TABLE portfolio_companies (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text        NOT NULL,
  description         text,
  logo_path           text,
  display_order       integer     NOT NULL DEFAULT 0,
  is_published        boolean     NOT NULL DEFAULT false,
  detail_page_content text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- notifications
CREATE TABLE notifications (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type       text        NOT NULL,
  message    text        NOT NULL,
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- audit_log (append-only — never UPDATE or DELETE rows)
-- action vocabulary is locked — see build.md Section 4. No freeform strings.
CREATE TABLE audit_log (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  action      text        NOT NULL,
  target_type text,
  target_id   uuid,
  metadata    jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);


-- ─────────────────────────────────────────────────────────────
-- BLACKLIST TRIGGER
-- Fires BEFORE INSERT on applications.
-- SECURITY DEFINER + fixed search_path so it can read profiles
-- regardless of the calling user's RLS context.
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION check_blacklist_before_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM profiles
    WHERE id = NEW.user_id
      AND is_blacklisted = true
  ) THEN
    RAISE EXCEPTION 'blocked: user is blacklisted and cannot submit applications';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_block_blacklisted_applicant
  BEFORE INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION check_blacklist_before_application();


-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- Service role (used in all admin server actions) has BYPASSRLS
-- in Supabase — no policies are needed for admin mutations.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications          ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_companies   ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log             ENABLE ROW LEVEL SECURITY;


-- ── profiles ─────────────────────────────────────────────────
-- Authenticated users: read and update their own row only.
-- INSERT is done via service role on signup (trigger in Section 2).

CREATE POLICY "profiles_own_select"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_own_update"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ── applications ─────────────────────────────────────────────
-- Authenticated users: own rows only.
-- Investors have no policy here → zero access to this table.
-- No DELETE policy → client cannot delete applications.

CREATE POLICY "applications_own_select"
  ON applications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "applications_own_insert"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "applications_own_update"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


-- ── application_documents ─────────────────────────────────────
-- Authenticated users: read/insert for docs on their own applications only.

CREATE POLICY "app_docs_own_select"
  ON application_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_documents.application_id
        AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "app_docs_own_insert"
  ON application_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_documents.application_id
        AND a.user_id = auth.uid()
    )
  );


-- ── deals ─────────────────────────────────────────────────────
-- anon (logged-out): active rows only.
--   Server component MUST NOT SELECT details_gated for anon requests.
-- authenticated: active rows only.
--   Server component gates details_gated to investors (Section 5).

CREATE POLICY "deals_anon_read_active"
  ON deals
  FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "deals_auth_read_active"
  ON deals
  FOR SELECT
  TO authenticated
  USING (is_active = true);


-- ── portfolio_companies ───────────────────────────────────────
-- Everyone (anon and authenticated): read published rows only.

CREATE POLICY "portfolio_anon_read_published"
  ON portfolio_companies
  FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "portfolio_auth_read_published"
  ON portfolio_companies
  FOR SELECT
  TO authenticated
  USING (is_published = true);


-- ── notifications ─────────────────────────────────────────────
-- Authenticated: full access to own rows only.

CREATE POLICY "notifications_own"
  ON notifications
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


-- ── audit_log ─────────────────────────────────────────────────
-- Zero client access. No policies = no access for anon or authenticated.
-- All reads and writes go through service role in server actions only.
