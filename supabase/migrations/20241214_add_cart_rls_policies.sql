-- Migration: Add RLS policies for project_carts table
-- Date: 2024-12-14
-- Description: Enable Row Level Security and add policies for cart operations

-- Enable RLS on project_carts table
ALTER TABLE project_carts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own cart items" ON project_carts;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON project_carts;
DROP POLICY IF EXISTS "Users can update their own cart items" ON project_carts;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON project_carts;

-- Policy: Allow all SELECT operations (user_id check happens in application)
-- Note: Since we use Telegram user_id which is passed from client,
-- we allow all operations and validate in API layer
CREATE POLICY "Users can view their own cart items"
  ON project_carts FOR SELECT
  USING (true);

-- Policy: Allow all INSERT operations
CREATE POLICY "Users can insert their own cart items"
  ON project_carts FOR INSERT
  WITH CHECK (true);

-- Policy: Allow all UPDATE operations
CREATE POLICY "Users can update their own cart items"
  ON project_carts FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Allow all DELETE operations
CREATE POLICY "Users can delete their own cart items"
  ON project_carts FOR DELETE
  USING (true);

-- Add index for better performance on user_id queries
CREATE INDEX IF NOT EXISTS idx_project_carts_user_id ON project_carts(user_id);

-- Add composite index for user + product lookups
CREATE INDEX IF NOT EXISTS idx_project_carts_user_product ON project_carts(user_id, product_id);

-- Add unique constraint to prevent duplicate cart entries
-- This is needed for upsert operations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_user_product_cart'
  ) THEN
    ALTER TABLE project_carts
      ADD CONSTRAINT unique_user_product_cart UNIQUE (user_id, product_id);
  END IF;
END $$;
