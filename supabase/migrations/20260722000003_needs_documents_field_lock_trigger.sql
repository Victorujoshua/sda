-- ============================================================
-- Layer 3 of 3 — DB-level field lock for needs_documents status.
-- Apply manually in the Supabase SQL editor (do not run via Claude).
--
-- Purpose: prevent any UPDATE that changes business data columns
-- while an application is in the 'needs_documents' state.
-- RLS blocks row-level writes; this trigger blocks column-level edits
-- that would slip through (e.g. admin service-role client bypasses RLS,
-- but admin actions never touch these business columns anyway).
--
-- The trigger fires BEFORE UPDATE so it can raise an exception before
-- the row is modified. Admin actions that change only status/housekeeping
-- columns (status, submitted_at, documents_requested_note, rejection_reason)
-- are unaffected.
-- ============================================================


CREATE OR REPLACE FUNCTION prevent_field_edits_in_needs_documents()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status = 'needs_documents' THEN
    IF NEW.business_name        IS DISTINCT FROM OLD.business_name        OR
       NEW.founder_name         IS DISTINCT FROM OLD.founder_name         OR
       NEW.contact_email        IS DISTINCT FROM OLD.contact_email        OR
       NEW.contact_phone        IS DISTINCT FROM OLD.contact_phone        OR
       NEW.business_description IS DISTINCT FROM OLD.business_description OR
       NEW.monthly_revenue      IS DISTINCT FROM OLD.monthly_revenue      OR
       NEW.funding_amount       IS DISTINCT FROM OLD.funding_amount       OR
       NEW.funding_type         IS DISTINCT FROM OLD.funding_type         THEN
      RAISE EXCEPTION
        'Application fields cannot be modified while additional documents are requested. Upload the requested documents and resubmit.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


DROP TRIGGER IF EXISTS applications_lock_fields_in_needs_documents ON applications;

CREATE TRIGGER applications_lock_fields_in_needs_documents
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION prevent_field_edits_in_needs_documents();
