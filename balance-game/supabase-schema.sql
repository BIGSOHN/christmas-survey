-- 밸런스 게임 라운드 테이블
CREATE TABLE balance_game_rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_number INT NOT NULL UNIQUE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 밸런스 게임 의견 테이블
CREATE TABLE balance_game_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_id UUID REFERENCES balance_game_rounds(id),
  nickname TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('A', 'B')),
  comment TEXT NOT NULL CHECK (length(comment) <= 50),
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스 추가
CREATE INDEX idx_comments_round_visible ON balance_game_comments(round_id, is_hidden);
CREATE INDEX idx_comments_created ON balance_game_comments(created_at DESC);
CREATE INDEX idx_rounds_active ON balance_game_rounds(is_active);

-- 초기 라운드 데이터 삽입
INSERT INTO balance_game_rounds (round_number, question_text, option_a, option_b) VALUES
(1, '붕어빵 대결!', '팥붕어빵', '슈크림붕어빵'),
(2, '버그를 찾았다! 당신의 선택은?', '1시간에 찾고 10시간에 해결', '10시간에 찾고 1시간에 해결'),
(3, '평생 선택해야 한다면?', '세미콜론 빼먹는 실수', '괄호 짝 안 맞는 실수'),
(4, '협업 스타일 선택!', '완벽한 코드 but 소통0', '부족한 코드 but 소통 완벽'),
(5, '개발 환경 선택!', '고성능 데스크탑 + 출석필수', '저성능 노트북 + 재택가능'),
(6, '코드 리뷰 받는다면?', 'LGTM만 달아주는 리뷰어', '한 줄 한 줄 지적하는 리뷰어');

-- Row Level Security (RLS) 설정
ALTER TABLE balance_game_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_game_comments ENABLE ROW LEVEL SECURITY;

-- 모두 읽기 가능
CREATE POLICY "Anyone can read rounds" ON balance_game_rounds FOR SELECT USING (true);
CREATE POLICY "Anyone can read comments" ON balance_game_comments FOR SELECT USING (true);

-- 모두 의견 작성 가능
CREATE POLICY "Anyone can insert comments" ON balance_game_comments FOR INSERT WITH CHECK (true);

-- 라운드 업데이트는 인증된 사용자만 (어드민용)
CREATE POLICY "Authenticated users can update rounds" ON balance_game_rounds FOR UPDATE USING (auth.role() = 'authenticated');

-- 의견 숨김은 인증된 사용자만 (어드민용)
CREATE POLICY "Authenticated users can update comments" ON balance_game_comments FOR UPDATE USING (auth.role() = 'authenticated');
