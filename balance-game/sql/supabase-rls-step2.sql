-- Step 2: RLS 활성화 및 새 정책 추가

-- RLS 활성화
ALTER TABLE balance_game_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_game_comments ENABLE ROW LEVEL SECURITY;

-- 라운드 관리를 위한 새 정책 (anon 포함)
CREATE POLICY "Anyone can update rounds"
ON balance_game_rounds
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can insert rounds"
ON balance_game_rounds
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can delete rounds"
ON balance_game_rounds
FOR DELETE
USING (true);

-- 코멘트 관리를 위한 새 정책 (anon 포함)
CREATE POLICY "Anyone can update comments"
ON balance_game_comments
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete comments"
ON balance_game_comments
FOR DELETE
USING (true);
