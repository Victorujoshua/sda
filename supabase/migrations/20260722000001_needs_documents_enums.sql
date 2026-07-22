-- ============================================================
-- Pass 1 of 2 — enum additions ONLY.
-- Apply this block first and commit it before running Pass 2.
-- ALTER TYPE ADD VALUE cannot be used in the same transaction
-- that references the new value (Postgres restriction).
-- ============================================================

ALTER TYPE application_status ADD VALUE 'needs_documents';
ALTER TYPE document_type ADD VALUE 'supporting';
