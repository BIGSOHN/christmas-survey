-- 투표 기록 테이블 생성
-- 선택지별 누적 투표 수를 추적하고, 재투표 시 마지막 선택만 반영

CREATE TABLE balance_game_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES balance_game_rounds(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('A', 'B')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 같은 세션에서 같은 라운드에 중복 투표 방지 (재투표 시 업데이트)
CREATE UNIQUE INDEX unique_vote_per_session
ON balance_game_votes(round_id, session_id);

-- 빠른 집계를 위한 인덱스
CREATE INDEX idx_votes_round_side
ON balance_game_votes(round_id, side);

-- Row Level Security (RLS) 활성화
ALTER TABLE balance_game_votes ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 투표를 삽입/수정/조회 가능
CREATE POLICY "Anyone can insert votes"
  ON balance_game_votes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update own votes"
  ON balance_game_votes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view votes"
  ON balance_game_votes
  FOR SELECT
  USING (true);

-- 관리자만 투표 삭제 가능 (필요시)
CREATE POLICY "Only admins can delete votes"
  ON balance_game_votes
  FOR DELETE
  USING (false);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_votes_updated_at
  BEFORE UPDATE ON balance_game_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 실시간 구독 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE balance_game_votes;
