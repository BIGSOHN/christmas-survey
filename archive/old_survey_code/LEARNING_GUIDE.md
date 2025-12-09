# Christmas Survey 프로젝트 학습 가이드

이 문서는 프로젝트의 코드를 학습하기 위한 가이드입니다.

## 📚 목차

1. [학습 순서 추천](#학습-순서-추천)
2. [파일별 상세 설명](#파일별-상세-설명)
3. [핵심 개념별 학습](#핵심-개념별-학습)
4. [난이도별 분류](#난이도별-분류)

---

## 🎯 학습 순서 추천

### 1️⃣ 초급 - React 처음이라면

**학습 순서**: `index.html` → `main.jsx` → `App.jsx` → `Home.jsx`

#### 학습할 내용
- HTML 엔트리 포인트 구조
- React 앱 초기화 방법
- JSX 기본 문법
- 컴포넌트 구조
- React Router 기본

**예상 학습 시간**: 1-2시간

---

### 2️⃣ 중급 - React 기본은 아는 경우

**학습 순서**: `Survey.jsx` → `Stats.jsx` → `supabase.js`

#### 학습할 내용
- `useState`, `useEffect` 훅 사용법
- 폼 상태 관리
- 조건부 렌더링
- API 호출 및 데이터 처리
- 데이터 시각화 (차트)

**예상 학습 시간**: 3-5시간

---

### 3️⃣ 고급 - 풀스택 개발

**학습 순서**: `supabase-schema.sql` → `supabase.js` → `Survey.jsx` (데이터 제출) → `Stats.jsx` (데이터 조회)

#### 학습할 내용
- SQL 데이터베이스 설계
- Supabase 연동
- Row Level Security (RLS)
- 실시간 데이터 처리
- 보안 정책

**예상 학습 시간**: 4-6시간

---

## 📁 파일별 상세 설명

### 1. `index.html` ⭐ (난이도: 하)

**위치**: `/index.html`

**역할**: HTML 엔트리 포인트

**핵심 내용**:
```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

**학습 포인트**:
- React 앱이 마운트되는 `root` div
- Vite의 모듈 시스템 (`type="module"`)

---

### 2. `main.jsx` ⭐ (난이도: 하)

**위치**: `/src/main.jsx`

**역할**: React 앱 시작점

**핵심 코드**:
```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**학습 포인트**:
- `createRoot`: React 18의 새로운 렌더링 API
- `StrictMode`: 개발 모드에서 잠재적 문제 감지
- CSS 임포트 방법

---

### 3. `App.jsx` ⭐⭐ (난이도: 하)

**위치**: `/src/App.jsx`

**역할**: 라우팅 설정

**핵심 코드**:
```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Survey from './pages/Survey'
import Stats from './pages/Stats'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
  )
}
```

**학습 포인트**:
- React Router v6 사용법
- `BrowserRouter`, `Routes`, `Route` 컴포넌트
- 경로와 컴포넌트 매핑

---

### 4. `Home.jsx` ⭐ (난이도: 하)

**위치**: `/src/pages/Home.jsx`

**역할**: 홈페이지 (랜딩 페이지)

**핵심 코드**:
```javascript
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-green-900">
      <h1>🎄 42 경산 크리스마스 설문 🎅</h1>
      <Link to="/survey">🎁 설문 참여하기</Link>
      <Link to="/stats">📊 통계 보기</Link>
    </div>
  )
}
```

**학습 포인트**:
- `Link` 컴포넌트로 페이지 이동 (a 태그 대신)
- Tailwind CSS 클래스 사용법
  - `min-h-screen`: 최소 높이 화면 전체
  - `bg-gradient-to-b`: 세로 그라데이션
  - `from-red-900 to-green-900`: 색상 정의

---

### 5. `Survey.jsx` ⭐⭐⭐⭐ (난이도: 상)

**위치**: `/src/pages/Survey.jsx`

**역할**: 설문 조사 페이지 (가장 복잡하고 학습 가치가 높음)

#### 📌 주요 학습 포인트

##### A. 상태 관리 (182-184줄)
```javascript
const [currentStep, setCurrentStep] = useState(0)
const [answers, setAnswers] = useState({})
const [isSubmitting, setIsSubmitting] = useState(false)
```

**설명**:
- `currentStep`: 현재 질문 번호 (0부터 시작)
- `answers`: 모든 답변을 객체로 저장 `{ intra_id: "value", circle: "1서클", ... }`
- `isSubmitting`: 제출 중 상태 (중복 제출 방지)

---

##### B. 조건부 질문 필터링 (187-190줄)
```javascript
const filteredQuestions = QUESTIONS.filter(q => {
  if (!q.showIf) return true  // showIf가 없으면 항상 표시
  return q.showIf(answers)    // showIf 조건 확인
})
```

**예시 - 조건부 질문**:
```javascript
{
  id: 'study_location_reason',
  question: '왜 이곳에서 주로 학습을 하나요?',
  showIf: (answers) => {
    const location = answers.study_location
    return location && location !== '클러스터 개방존' && location !== '사일런트존'
  }
}
```

**설명**:
- 8번 질문에서 "오아시스", "오픈라운지" 등을 선택하면 8-1번 질문이 나타남
- "클러스터 개방존" 또는 "사일런트존"을 선택하면 8-1번 질문 건너뜀

---

##### C. 답변 처리 (195-197줄)
```javascript
const handleAnswer = (value) => {
  setAnswers({ ...answers, [currentQuestion.id]: value })
}
```

**설명**:
- 스프레드 연산자 `...answers`로 기존 답변 유지
- `[currentQuestion.id]`: 동적 키 사용
- 예: `{ ...answers, mbti: "INTJ" }`

---

##### D. 다양한 입력 타입 처리

**1) 텍스트 입력 (261-267줄)**
```javascript
{currentQuestion.type === 'text' && (
  <input
    type="text"
    value={answers[currentQuestion.id] || ''}
    onChange={(e) => handleAnswer(e.target.value)}
  />
)}
```

**2) 단일 선택 (269-283줄)**
```javascript
{currentQuestion.type === 'select' && (
  <div>
    {currentQuestion.options.map((option) => (
      <button
        key={option}
        onClick={() => handleAnswer(option)}
        className={answers[currentQuestion.id] === option
          ? 'bg-red-600 text-white'  // 선택됨
          : 'bg-gray-100'             // 선택 안됨
        }
      >
        {option}
      </button>
    ))}
  </div>
)}
```

**3) 복수 선택 (285-312줄)**
```javascript
{currentQuestion.type === 'multi-select' && (
  <div>
    {currentQuestion.options.map((option) => {
      const selectedOptions = answers[currentQuestion.id] || []
      const isSelected = selectedOptions.includes(option)

      return (
        <button
          onClick={() => {
            if (isSelected) {
              // 이미 선택됨 → 제거
              handleAnswer(selectedOptions.filter(item => item !== option))
            } else {
              // 선택 안됨 → 추가
              handleAnswer([...selectedOptions, option])
            }
          }}
        >
          {option}
        </button>
      )
    })}
  </div>
)}
```

**4) 척도 (1-5점) (314-340줄)**
```javascript
{currentQuestion.type === 'scale' && (
  <div>
    {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
      <button
        key={num}
        onClick={() => handleAnswer(num)}
        className={answers[currentQuestion.id] === num
          ? 'bg-red-600 scale-110'  // 선택됨 (크기 확대)
          : 'bg-gray-200'
        }
      >
        {num}
      </button>
    ))}
    <div>{currentQuestion.labels[answers[currentQuestion.id] - 1]}</div>
  </div>
)}
```

---

##### E. 데이터 제출 (213-227줄)
```javascript
const handleSubmit = async () => {
  setIsSubmitting(true)
  try {
    const { data, error } = await supabase
      .from('surveys')
      .insert([{
        ...answers,
        created_at: new Date().toISOString()
      }])

    if (error) throw error

    alert('설문에 참여해주셔서 감사합니다!')
    navigate('/stats')
  } catch (error) {
    console.error('Error submitting survey:', error)
    alert('설문 제출 중 오류가 발생했습니다.')
  } finally {
    setIsSubmitting(false)
  }
}
```

**설명**:
- `async/await`: 비동기 처리
- Supabase `insert`: 데이터 삽입
- `try/catch/finally`: 에러 처리 및 상태 정리
- `navigate`: 페이지 이동

---

### 6. `Stats.jsx` ⭐⭐⭐ (난이도: 중)

**위치**: `/src/pages/Stats.jsx`

**역할**: 통계 대시보드 페이지

#### 📌 주요 학습 포인트

##### A. useEffect로 데이터 가져오기 (10-12줄)
```javascript
useEffect(() => {
  fetchSurveys()
}, [])  // 빈 배열 = 컴포넌트 마운트 시 1회만 실행
```

---

##### B. Supabase 데이터 조회 (15-25줄)
```javascript
const fetchSurveys = async () => {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    setSurveys(data || [])
  } catch (error) {
    console.error('Error fetching surveys:', error)
  } finally {
    setLoading(false)
  }
}
```

**설명**:
- `.select('*')`: 모든 컬럼 조회
- `.order()`: 정렬 (최신순)
- 에러 처리 및 로딩 상태 관리

---

##### C. 데이터 집계 함수 (27-41줄)
```javascript
const getFieldStats = (field) => {
  const counts = {}

  surveys.forEach(survey => {
    const value = survey[field]
    if (value) {
      if (Array.isArray(value)) {
        // 복수 선택인 경우 (예: favorite_snack)
        value.forEach(v => {
          counts[v] = (counts[v] || 0) + 1
        })
      } else {
        // 단일 선택인 경우
        counts[value] = (counts[value] || 0) + 1
      }
    }
  })

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)  // 내림차순 정렬
}
```

**설명**:
- 객체로 카운팅: `{ "프론트엔드 개발자": 5, "백엔드 개발자": 3 }`
- `Object.entries()`: `[["프론트엔드", 5], ["백엔드", 3]]`
- `.map()`: `[{name: "프론트엔드", value: 5}, ...]`

---

##### D. Recharts 사용법 (61-72줄)

**바 차트 예시**:
```javascript
<ResponsiveContainer width="100%" height={400}>
  <BarChart data={devFieldStats}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" fill="#dc2626" />
  </BarChart>
</ResponsiveContainer>
```

**파이 차트 예시** (78-94줄):
```javascript
<PieChart>
  <Pie
    data={mbtiStats}
    cx="50%"
    cy="50%"
    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
    outerRadius={120}
    dataKey="value"
  >
    {mbtiStats.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
</PieChart>
```

---

### 7. `supabase.js` ⭐⭐ (난이도: 하)

**위치**: `/src/lib/supabase.js`

**역할**: Supabase 클라이언트 설정

**핵심 코드**:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**학습 포인트**:
- `import.meta.env`: Vite의 환경 변수 접근 방법
- `VITE_` 접두사: 클라이언트에 노출되는 환경 변수
- Singleton 패턴: 하나의 클라이언트 인스턴스만 생성

---

### 8. `supabase-schema.sql` ⭐⭐⭐ (난이도: 중)

**위치**: `/supabase-schema.sql`

**역할**: 데이터베이스 스키마 정의

#### 📌 주요 학습 포인트

##### A. 테이블 생성 (2-40줄)
```sql
CREATE TABLE IF NOT EXISTS surveys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),

    -- Basic Information
    intra_id TEXT NOT NULL,
    circle TEXT,

    -- Development Career
    dev_field TEXT,
    programming_language TEXT,
    editor TEXT,

    -- 42 Life Pattern
    active_time TEXT,
    cluster_hours TEXT,
    study_location TEXT,
    study_location_reason TEXT,
    study_location_reason_other TEXT,

    -- Learning/Development Style
    work_style TEXT,
    planning_style TEXT,
    learning_method TEXT,

    -- Personality
    mbti TEXT,
    mbti_reliability INTEGER,

    -- Lifestyle
    coding_environment TEXT,
    favorite_snack JSONB,  -- 복수 선택은 JSONB로 저장
    debugging_method TEXT,

    -- Fun Elements
    hardest_project TEXT,
    goal_2026 TEXT,

    -- Constraints
    CONSTRAINT unique_intra_id UNIQUE(intra_id)
);
```

**학습 포인트**:
- `UUID`: 고유 식별자
- `TIMESTAMP WITH TIME ZONE`: 타임존 포함 시간
- `JSONB`: JSON 데이터 타입 (복수 선택 저장)
- `UNIQUE`: 중복 방지 (같은 ID로 여러 번 제출 불가)

---

##### B. 인덱스 생성 (42-44줄)
```sql
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_surveys_intra_id ON surveys(intra_id);
```

**설명**:
- 인덱스: 검색 속도 향상
- `created_at DESC`: 최신순 정렬에 최적화
- `intra_id`: ID로 검색 시 빠른 조회

---

##### C. Row Level Security (RLS) (46-54줄)
```sql
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
    ON surveys FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert access"
    ON surveys FOR INSERT
    WITH CHECK (true);
```

**설명**:
- RLS: 행 단위 보안 정책
- `FOR SELECT ... USING (true)`: 모두가 읽기 가능
- `FOR INSERT ... WITH CHECK (true)`: 모두가 삽입 가능
- UPDATE, DELETE는 허용 안 함 (정책 없음)

---

### 9. `tailwind.config.js` ⭐ (난이도: 하)

**위치**: `/tailwind.config.js`

**역할**: Tailwind CSS 설정

**핵심 코드**:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // 모든 컴포넌트 파일
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**학습 포인트**:
- `content`: Tailwind가 스캔할 파일 경로
- `theme.extend`: 커스텀 색상, 폰트 등 추가 가능

---

### 10. `index.css` ⭐ (난이도: 하)

**위치**: `/src/index.css`

**역할**: 전역 CSS 및 Tailwind 디렉티브

**핵심 코드**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', ...;
}
```

**학습 포인트**:
- `@tailwind`: Tailwind CSS 삽입
- 전역 스타일 정의

---

## 🎓 핵심 개념별 학습

### 1. React Hooks

**위치**: `Survey.jsx`, `Stats.jsx`

**배울 수 있는 Hooks**:
- `useState`: 상태 관리
- `useEffect`: 사이드 이펙트 (데이터 fetch)
- `useNavigate`: 페이지 이동 (React Router)

**학습 순서**:
1. `useState`의 기본 (Survey.jsx 182-184줄)
2. `useEffect`의 dependency array (Stats.jsx 10-12줄)
3. 조건부 렌더링과 state (Survey.jsx 187-190줄)

---

### 2. 폼 처리 및 상태 관리

**위치**: `Survey.jsx`

**학습할 패턴**:
- Controlled Components (value + onChange)
- 객체 상태 업데이트 (spread operator)
- 배열 상태 관리 (복수 선택)
- 조건부 필드 표시

**핵심 코드**:
```javascript
// 단일 값
const handleAnswer = (value) => {
  setAnswers({ ...answers, [currentQuestion.id]: value })
}

// 배열 값 (복수 선택)
const selectedOptions = answers[currentQuestion.id] || []
if (isSelected) {
  handleAnswer(selectedOptions.filter(item => item !== option))
} else {
  handleAnswer([...selectedOptions, option])
}
```

---

### 3. API 호출 및 비동기 처리

**위치**: `Survey.jsx` (제출), `Stats.jsx` (조회)

**학습할 내용**:
- `async/await` 문법
- `try/catch/finally` 에러 처리
- 로딩 상태 관리
- Supabase CRUD 작업

**패턴**:
```javascript
const [loading, setLoading] = useState(true)

const fetchData = async () => {
  try {
    const { data, error } = await supabase.from('table').select()
    if (error) throw error
    setData(data)
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}
```

---

### 4. 데이터 변환 및 집계

**위치**: `Stats.jsx`

**학습할 JavaScript 메서드**:
- `forEach`: 반복
- `filter`: 필터링
- `map`: 변환
- `sort`: 정렬
- `Object.entries()`: 객체 → 배열
- `reduce`: 집계 (응용 가능)

**예시**:
```javascript
// 객체로 카운팅
const counts = {}
surveys.forEach(s => {
  counts[s.field] = (counts[s.field] || 0) + 1
})

// 배열로 변환 및 정렬
const stats = Object.entries(counts)
  .map(([name, value]) => ({ name, value }))
  .sort((a, b) => b.value - a.value)
```

---

### 5. 조건부 렌더링

**위치**: `Survey.jsx`, `Stats.jsx`

**패턴**:
```javascript
// 1. && 연산자
{loading && <div>로딩 중...</div>}

// 2. 삼항 연산자
{isSubmitting ? '제출 중...' : '제출하기'}

// 3. 조건부 클래스
className={isSelected
  ? 'bg-red-600 text-white'
  : 'bg-gray-100'
}

// 4. 조건부 요소 표시
{currentQuestion.type === 'text' && (
  <input ... />
)}
```

---

### 6. React Router

**위치**: `App.jsx`, `Home.jsx`, `Survey.jsx`

**학습할 내용**:
- `BrowserRouter`: 라우터 제공자
- `Routes`, `Route`: 경로 정의
- `Link`: 선언적 네비게이션
- `useNavigate`: 프로그래밍 방식 네비게이션

---

### 7. Tailwind CSS

**위치**: 모든 페이지 컴포넌트

**자주 사용되는 클래스**:
- 레이아웃: `flex`, `grid`, `min-h-screen`
- 간격: `p-4`, `m-8`, `gap-4`
- 색상: `bg-red-600`, `text-white`
- 크기: `w-full`, `h-screen`
- 반응형: `md:text-xl`, `lg:grid-cols-2`
- 호버: `hover:bg-gray-200`
- 그라데이션: `bg-gradient-to-b from-red-900 to-green-900`

---

## 📊 난이도별 분류

| 파일 | 난이도 | 코드 라인 수 | 학습 가치 | 예상 시간 |
|------|--------|--------------|-----------|-----------|
| index.html | ⭐ | ~15 | 낮음 | 5분 |
| main.jsx | ⭐ | ~11 | 낮음 | 10분 |
| App.jsx | ⭐ | ~18 | 중간 | 15분 |
| Home.jsx | ⭐ | ~24 | 중간 | 30분 |
| supabase.js | ⭐⭐ | ~6 | 중간 | 15분 |
| tailwind.config.js | ⭐ | ~9 | 낮음 | 10분 |
| index.css | ⭐ | ~12 | 낮음 | 10분 |
| supabase-schema.sql | ⭐⭐⭐ | ~65 | 높음 | 1시간 |
| Stats.jsx | ⭐⭐⭐ | ~180 | 높음 | 2시간 |
| Survey.jsx | ⭐⭐⭐⭐ | ~380 | 매우 높음 | 3-4시간 |

---

## 🚀 실습 과제

### 초급
1. Home.jsx의 색상을 파란색-보라색 그라데이션으로 변경
2. 새로운 페이지 `/about` 추가하기

### 중급
1. Survey.jsx에 새로운 질문 타입 추가 (예: 날짜 선택)
2. Stats.jsx에 새로운 차트 추가 (예: 라인 차트)
3. 답변 유효성 검사 추가 (이메일 형식 등)

### 고급
1. 답변 수정 기능 구현
2. 관리자 대시보드 페이지 추가
3. 응답 데이터 CSV 다운로드 기능
4. 실시간 통계 업데이트 (Supabase Realtime)

---

## 💡 학습 팁

### 1. 코드 읽는 순서
1. **파일 상단**: import 문 확인 (어떤 라이브러리 사용하는지)
2. **컴포넌트 시그니처**: 함수명, props 확인
3. **상태 선언**: useState, useEffect 찾기
4. **이벤트 핸들러**: 사용자 상호작용 처리
5. **렌더링 부분**: JSX return 문
6. **스타일**: className 확인

### 2. 디버깅 방법
```javascript
// 콘솔로 상태 확인
console.log('현재 상태:', answers)

// React DevTools 사용 (브라우저 확장)
// 컴포넌트 트리와 state 실시간 확인

// 에러 바운더리 추가
try {
  // 코드
} catch (error) {
  console.error('에러:', error)
}
```

### 3. 점진적 학습
- 한 번에 모든 파일을 이해하려 하지 말 것
- 한 개념씩 마스터하고 다음으로 이동
- 실제로 코드를 수정하며 실험
- 에러를 두려워하지 말 것 (에러 메시지가 최고의 선생님)

### 4. 추가 리소스
- [React 공식 문서](https://react.dev)
- [Supabase 공식 문서](https://supabase.com/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Recharts 문서](https://recharts.org)

---

## 🎯 학습 체크리스트

### React 기초
- [ ] JSX 문법 이해
- [ ] 컴포넌트 개념 이해
- [ ] Props vs State 차이 이해
- [ ] 이벤트 핸들링

### React Hooks
- [ ] useState 사용법
- [ ] useEffect 사용법
- [ ] useNavigate 사용법
- [ ] Custom Hook 이해 (선택)

### 폼 처리
- [ ] Controlled Components
- [ ] 다양한 입력 타입 처리
- [ ] 유효성 검사
- [ ] 제출 처리

### 데이터 처리
- [ ] API 호출 (async/await)
- [ ] 에러 처리
- [ ] 로딩 상태 관리
- [ ] 데이터 집계 및 변환

### 스타일링
- [ ] Tailwind CSS 기본
- [ ] 반응형 디자인
- [ ] 조건부 클래스
- [ ] 커스텀 스타일

### 데이터베이스
- [ ] SQL 기본 (CREATE, INSERT, SELECT)
- [ ] Supabase 사용법
- [ ] Row Level Security 이해
- [ ] JSONB 데이터 타입

---

## 📞 질문이 있다면?

- 코드의 특정 부분이 이해가 안 간다면 주석을 추가해서 설명을 요청하세요
- 새로운 기능을 추가하고 싶다면 기존 패턴을 참고하세요
- 에러가 발생하면 에러 메시지를 자세히 읽어보세요

---

**마지막 업데이트**: 2025-12-07
**프로젝트 버전**: 1.0.0
