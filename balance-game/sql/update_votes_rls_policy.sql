-- 투표 초기화를 위한 RLS 정책 업데이트
-- 기존 DELETE 정책 제거
DROP POLICY IF EXISTS "Only admins can delete votes" ON balance_game_votes;

-- 인증된 사용자만 투표 삭제 가능 (관리자용)
CREATE POLICY "Authenticated users can delete votes"
  ON balance_game_votes
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- 참고: Supabase Dashboard에서 관리자 계정 생성 필요
-- 1. Supabase Dashboard → Authentication → Users
-- 2. "Add user" 클릭
-- 3. 이메일/비밀번호 입력하여 관리자 계정 생성
-- 4. AdminPage에서 해당 계정으로 로그인하면 투표 초기화 가능
