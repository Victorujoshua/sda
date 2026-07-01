-- Add membership flag to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS has_paid_membership boolean NOT NULL DEFAULT false;

-- Membership payments ledger
CREATE TABLE IF NOT EXISTS membership_payments (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  paystack_reference  text        NOT NULL UNIQUE,
  amount_kobo         integer     NOT NULL,
  status              text        NOT NULL
                        CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  paid_at             timestamptz,
  refunded_at         timestamptz,
  refund_reason       text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS membership_payments_user_id_idx
  ON membership_payments(user_id);

ALTER TABLE membership_payments ENABLE ROW LEVEL SECURITY;

-- Investors can read their own payment history
CREATE POLICY "Investors can view own membership payments"
  ON membership_payments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
