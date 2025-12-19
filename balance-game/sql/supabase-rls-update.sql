-- RLS 정책 업데이트: 현재 클라이언트 사이드 앱에서 작동하도록 수정
-- 주의: 이는 임시 방편이며, 42 OAuth 구현 후 다시 제한해야 함

-- 0. RLS 활성화 (현재 비활성화 상태이므로 다시 켜기)
ALTER TABLE balance_game_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_game_comments ENABLE ROW LEVEL SECURITY;

-- 1. 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Authenticated users can update rounds" ON balance_game_rounds;
DROP POLICY IF EXISTS "Authenticated users can update comments" ON balance_game_comments;
DROP POLICY IF EXISTS "Anyone can update rounds" ON balance_game_rounds;
DROP POLICY IF EXISTS "Anyone can insert rounds" ON balance_game_rounds;
DROP POLICY IF EXISTS "Anyone can delete rounds" ON balance_game_rounds;
DROP POLICY IF EXISTS "Anyone can update comments" ON balance_game_comments;
DROP POLICY IF EXISTS "Anyone can delete comments" ON balance_game_comments;

-- 2. 라운드 관리를 위한 새 정책 (anon 포함)
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

-- 3. 코멘트 관리를 위한 새 정책 (anon 포함)
CREATE POLICY "Anyone can update comments"
ON balance_game_comments
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete comments"
ON balance_game_comments
FOR DELETE
USING (true);

-- 주의사항:
-- - 이 설정은 임시적이며 보안이 약합니다
-- - 누구나 anon key만 있으면 모든 데이터를 수정/삭제할 수 있습니다
-- - 42 OAuth 구현 후 다음 정책으로 교체 필요:
--   * SELECT: 모두 가능
--   * INSERT comments: 모두 가능
--   * UPDATE/DELETE: authenticated + is_admin = true 조건 추가
