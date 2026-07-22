-- ============================================================
-- Pass 2 of 2 — schema changes.
-- Apply AFTER Pass 1 has been committed.
-- Requires 'needs_documents' and 'supporting' enum values to exist.
-- ============================================================


-- 1. Add column for admin's document-request note
ALTER TABLE applications
  ADD COLUMN documents_requested_note text;


-- 2. Widen the one-active-per-user partial index to include needs_documents.
--    A user cannot start a new application while one is in any active state.
DROP INDEX applications_one_active_per_user;
CREATE UNIQUE INDEX applications_one_active_per_user
  ON applications (user_id)
  WHERE status IN ('pending', 'under_review', 'needs_documents');


-- 3. Tighten applications UPDATE RLS.
--    USING  — current row status must be draft or needs_documents (editable states).
--    WITH CHECK — new row must belong to same user AND status must be one of the four
--                 values that server actions legitimately write:
--                   draft          (saveDraft keeps status unchanged on update)
--                   needs_documents (saveDraft keeps status unchanged on update)
--                   pending        (submitApplication first submit: draft → pending)
--                   under_review   (submitApplication resubmit: needs_documents → under_review)
--                 'approved' and 'rejected' are excluded — only admin actions (service role,
--                 bypasses RLS) may write those values.
DROP POLICY "applications_own_update" ON applications;
CREATE POLICY "applications_own_update"
  ON applications
  FOR UPDATE
  TO authenticated
  USING  (user_id = auth.uid() AND status IN ('draft', 'needs_documents'))
  WITH CHECK (user_id = auth.uid() AND status IN ('draft', 'needs_documents', 'pending', 'under_review'));


-- 4. Tighten application_documents INSERT RLS.
--    Documents may only be uploaded to applications in an editable state.
DROP POLICY "app_docs_own_insert" ON application_documents;
CREATE POLICY "app_docs_own_insert"
  ON application_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_documents.application_id
        AND a.user_id = auth.uid()
        AND a.status IN ('draft', 'needs_documents')
    )
  );


-- 5. Create the supporting-documents storage bucket (private).
--    file_size_limit = 10 MB in bytes (enforced server-side by Supabase Storage).
--    DO UPDATE so the limit is applied even if the bucket was created without it.
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('supporting-documents', 'supporting-documents', false, 10485760)
ON CONFLICT (id) DO UPDATE SET
  public          = false,
  file_size_limit = 10485760;


-- 6. Storage RLS: INSERT — upload to own path.
--    Path convention: {user_id}/{application_id}/supporting/{timestamp}.{ext}
--    First folder segment is the user's UUID — checked against auth.uid().
--    Admin reads bypass RLS via service role (signed URLs, 600s TTL).
DROP POLICY IF EXISTS "supporting_docs_own_upload" ON storage.objects;
CREATE POLICY "supporting_docs_own_upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'supporting-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );


-- 7. Storage RLS: SELECT — applicant can list/view their own uploads.
--    No status filter: read access is useful even after submission (e.g. review step).
DROP POLICY IF EXISTS "supporting_docs_own_select" ON storage.objects;
CREATE POLICY "supporting_docs_own_select"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'supporting-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );


-- 8. Storage RLS: DELETE — applicant can remove a wrongly-uploaded file,
--    but only while the application is still editable (draft or needs_documents).
--    Second folder segment is the application UUID — used to join applications table.
DROP POLICY IF EXISTS "supporting_docs_own_delete" ON storage.objects;
CREATE POLICY "supporting_docs_own_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'supporting-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id  = (storage.foldername(name))[2]::uuid
        AND a.user_id = auth.uid()
        AND a.status IN ('draft', 'needs_documents')
    )
  );
