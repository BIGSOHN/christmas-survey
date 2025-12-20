# 밸런스 게임 배틀 - 설정 가이드

## 📋 빠른 시작

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속 후 로그인
2. "New Project" 클릭
3. 프로젝트 이름, 비밀번호 설정
4. 리전 선택 (Northeast Asia - Seoul 추천)
5. 프로젝트 생성 완료 대기 (1-2분)

### 2. 데이터베이스 설정

1. Supabase 대시보드에서 **SQL Editor** 클릭
2. **New Query** 클릭
3. `supabase-schema.sql` 파일의 내용을 복사해서 붙여넣기
4. **Run** 버튼 클릭 (또는 Ctrl/Cmd + Enter)
5. 성공 메시지 확인

### 3. 환경 변수 설정

1. Supabase 대시보드에서 **Settings** > **API** 클릭
2. 다음 정보를 복사:
   - `Project URL`
   - `anon public` 키

3. 프로젝트 루트에 `.env` 파일 생성:

```bash
cp .env.example .env
```

4. `.env` 파일 편집:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 프로젝트 실행

```bash
# 의존성 설치 (이미 했으면 스킵)
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 🎮 사용 방법

### 참가자 (모바일)

1. QR 코드 스캔 또는 링크 접속
2. 닉네임 입력 후 로그인
3. 라운드 시작되면 진영 선택
4. 의견 입력 및 전송
5. 실시간 채팅 확인

### 관리자

1. 브라우저에서 `/admin` 접속
2. 라운드 버튼 클릭해서 시작
3. 부적절한 메시지는 "숨김" 버튼으로 숨김
4. 라운드 종료 버튼으로 종료

### TV 디스플레이

1. 브라우저에서 `/display` 접속
2. 전체화면 모드 (F11)
3. 실시간 채팅방 UI로 의견 표시

## 📁 프로젝트 구조

```
balance-game/
├── src/
│   ├── lib/
│   │   └── supabase.js          # Supabase 클라이언트
│   ├── pages/
│   │   ├── LoginPage.jsx        # 로그인 (닉네임 입력)
│   │   ├── AdminPage.jsx        # 관리자 페이지
│   │   ├── DisplayPage.jsx      # TV 디스플레이
│   │   └── ParticipantPage.jsx  # 참가자 페이지
│   ├── App.jsx                  # 라우터 설정
│   └── index.css                # Tailwind CSS
├── supabase-schema.sql          # DB 스키마
├── .env                         # 환경 변수 (gitignore)
└── .env.example                 # 환경 변수 예시
```

## 🚀 배포 (Vercel)

1. [Vercel](https://vercel.com) 로그인
2. "Import Project" 클릭
3. GitHub 저장소 연결
4. Environment Variables 추가:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy 클릭!

배포 후 URL을 QR 코드로 변환해서 참가자들에게 공유하세요.

## 🔧 트러블슈팅

### RLS (Row Level Security) 에러가 나요

Supabase SQL Editor에서 다음 실행:

```sql
-- 임시로 모든 정책 비활성화 (테스트용)
ALTER TABLE balance_game_rounds DISABLE ROW LEVEL SECURITY;
ALTER TABLE balance_game_comments DISABLE ROW LEVEL SECURITY;
```

### 실시간 업데이트가 안돼요

Supabase 대시보드에서 **Database** > **Replication** 확인:
- `balance_game_rounds` 테이블 Realtime 활성화
- `balance_game_comments` 테이블 Realtime 활성화

## 📝 다음 단계

- [ ] 42 OAuth 연동 (Phase 2)
- [ ] Framer Motion 애니메이션 개선
- [ ] 크리스마스 테마 추가
- [ ] 투표 카운트 실시간 바 차트

---

문제가 있으면 BalanceGameEvent.md 문서를 참고하세요!
