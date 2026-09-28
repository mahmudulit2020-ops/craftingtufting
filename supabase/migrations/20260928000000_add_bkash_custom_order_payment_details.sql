ALTER TABLE custom_orders
  ADD COLUMN IF NOT EXISTS bkash_sender_number text,
  ADD COLUMN IF NOT EXISTS bkash_trx_id text;