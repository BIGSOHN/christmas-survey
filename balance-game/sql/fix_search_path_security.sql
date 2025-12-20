-- Fix search_path security vulnerability in update_updated_at_column function
-- This prevents potential security issues from mutable search_path

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate triggers that depend on this function
CREATE TRIGGER update_votes_updated_at
  BEFORE UPDATE ON balance_game_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- If you have this trigger on other tables, recreate them here as well
-- Example:
-- CREATE TRIGGER update_rounds_updated_at
--   BEFORE UPDATE ON balance_game_rounds
--   FOR EACH ROW
--   EXECUTE FUNCTION update_updated_at_column();
