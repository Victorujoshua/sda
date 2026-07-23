-- ============================================================
-- Phase 2: Soft-delete for applications — super-admin only.
-- Depends on: 20260722000003 (needs_documents trigger — must be applied first).
-- Apply manually in the Supabase SQL editor. Do not apply via CLI.
-- ============================================================

-- 1. Add soft-delete columns
ALTER TABLE applications
  ADD COLUMN deleted_at  timestamptz,
  ADD COLUMN deleted_by  uuid REFERENCES profiles(id) ON DELETE SET NULL;

-- 2. Partial index for efficient live-row queries
CREATE INDEX applications_live
  ON applications (created_at DESC)
  WHERE deleted_at IS NULL;

-- 3. Rebuild the unique active-application index to exclude soft-deleted rows.
--    Without this, a soft-deleted pending/under_review/needs_documents row
--    would block a new submission from the same user.
DROP INDEX applications_one_active_per_user;
CREATE UNIQUE INDEX applications_one_active_per_user
  ON applications (user_id)
  WHERE status IN ('pending', 'under_review', 'needs_documents')
    AND deleted_at IS NULL;

-- 4. Update applicant-facing RLS policies to exclude soft-deleted rows.
DROP POLICY "applications_own_select" ON applications;
CREATE POLICY "applications_own_select"
  ON applications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

DROP POLICY "applications_own_update" ON applications;
CREATE POLICY "applications_own_update"
  ON applications
  FOR UPDATE
  TO authenticated
  USING  (user_id = auth.uid() AND status IN ('draft', 'needs_documents') AND deleted_at IS NULL)
  WITH CHECK (user_id = auth.uid() AND status IN ('draft', 'needs_documents', 'pending', 'under_review'));

-- 5. Update the needs_documents field-lock trigger to use a JSONB diff approach
--    with an explicit exempt-column list.  deleted_at and deleted_by are included
--    on both sides of the diff so that super-admin soft-delete writes pass through
--    without raising the field-lock exception.
CREATE OR REPLACE FUNCTION prevent_field_edits_in_needs_documents()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  _exempt text[] := ARRAY[
    'id', 'user_id', 'created_at',
    'status', 'submitted_at', 'documents_requested_note', 'rejection_reason',
    'reviewed_by', 'reviewed_at', 'admin_notes',
    'deleted_at', 'deleted_by'
  ];
BEGIN
  IF OLD.status = 'needs_documents' THEN
    IF (to_jsonb(NEW) - _exempt) IS DISTINCT FROM (to_jsonb(OLD) - _exempt) THEN
      RAISE EXCEPTION
        'Application fields cannot be modified while additional documents are requested. Upload the requested documents and resubmit.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
-- Trigger binding unchanged — CREATE OR REPLACE FUNCTION handles the update.
