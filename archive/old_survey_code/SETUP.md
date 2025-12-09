# 42 경산 크리스마스 설문 조사 - 설치 가이드

## 1. Supabase 프로젝트 설정

### 1.1 Supabase 계정 생성 및 프로젝트 생성
1. [https://supabase.com](https://supabase.com) 접속
2. 계정 생성 또는 로그인
3. "New Project" 버튼 클릭
4. 프로젝트 이름, 데이터베이스 비밀번호 설정
5. 리전 선택 (가까운 곳 선택 - 예: Northeast Asia (Seoul))

### 1.2 데이터베이스 스키마 생성
1. Supabase 대시보드에서 "SQL Editor" 메뉴 선택
2. `supabase-schema.sql` 파일의 내용을 복사
3. SQL Editor에 붙여넣기
4. "Run" 버튼 클릭하여 실행

### 1.3 API 키 확인
1. Supabase 대시보드에서 "Settings" > "API" 메뉴 선택
2. "Project URL" 복사
3. "anon public" 키 복사

## 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```bash
cp .env.example .env
```

`.env` 파일을 열고 Supabase 정보 입력:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. 패키지 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 4. 빌드 및 배포

### 로컬 빌드
```bash
npm run build
npm run preview
```

### Vercel 배포
1. [Vercel](https://vercel.com) 계정 생성/로그인
2. GitHub 리포지토리 연결
3. 환경 변수 설정 (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
4. 배포

### Netlify 배포
1. [Netlify](https://netlify.com) 계정 생성/로그인
2. "New site from Git" 선택
3. GitHub 리포지토리 연결
4. Build command: `npm run build`
5. Publish directory: `dist`
6. 환경 변수 설정 (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
7. 배포

## 5. 기능 확인

- `/` - 홈 페이지
- `/survey` - 설문 조사 페이지
- `/stats` - 통계 대시보드

## 트러블슈팅

### Supabase 연결 오류
- `.env` 파일이 올바르게 설정되었는지 확인
- Supabase URL과 키가 정확한지 확인
- 개발 서버를 재시작 (`Ctrl+C` 후 `npm run dev`)

### Tailwind CSS 스타일 적용 안됨
- `tailwind.config.js`와 `postcss.config.js` 파일 확인
- `src/index.css`에 Tailwind 디렉티브가 있는지 확인

### 차트가 표시되지 않음
- Recharts 패키지가 설치되었는지 확인: `npm list recharts`
- 데이터가 있는지 Supabase 대시보드에서 확인
