-- Migration: add super_admin role + admin_invites table

-- 1. Add super_admin to the user_role enum
ALTER TYPE user_role ADD VALUE 'super_admin';

-- 2. admin_invites table
CREATE TABLE admin_invites (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text        NOT NULL,
  token       uuid        NOT NULL DEFAULT gen_random_uuid(),
  invited_by  uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  accepted_at timestamptz,
  expires_at  timestamptz NOT NULL DEFAULT now() + interval '48 hours',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- One pending invite per email at a time
CREATE UNIQUE INDEX admin_invites_email_pending
  ON admin_invites(email)
  WHERE accepted_at IS NULL;

-- 3. RLS on admin_invites — enable but no client policies → no client access
-- Service role bypasses RLS; all operations go through createAdminClient()
ALTER TABLE admin_invites ENABLE ROW LEVEL SECURITY;
