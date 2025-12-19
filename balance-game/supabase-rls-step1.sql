-- Step 1: 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Authenticated users can update rounds" ON balance_game_rounds;
DROP POLICY IF EXISTS "Authenticated users can update comments" ON balance_game_comments;
DROP POLICY IF EXISTS "Anyone can update rounds" ON balance_game_rounds;
DROP POLICY IF EXISTS "Anyone can insert rounds" ON balance_game_rounds;
DROP POLICY IF EXISTS "Anyone can delete rounds" ON balance_game_rounds;
DROP POLICY IF EXISTS "Anyone can update comments" ON balance_game_comments;
DROP POLICY IF EXISTS "Anyone can delete comments" ON balance_game_comments;
