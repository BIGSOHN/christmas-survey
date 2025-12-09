# 밸런스 게임 현장 이벤트 기획안

## 📋 개요

42 경산 크리스마스 이벤트의 하이라이트로, 실시간 밸런스 게임 배틀을 진행합니다.
참가자들이 현장에서 직접 의견을 남기면 화면에 실시간으로 표시되는 인터랙티브 이벤트입니다.

## 📅 전체 일정

### 사전 설문조사
- **기간**: 12/10 (화) - 12/20 (금)
- **내용**: SurveyQuestions.md 문항 (1-25번)
  - 1-19번: 기본 정보, 학습 스타일, 목표 등
  - 20-25번: 밸런스 게임 (선택지만 A or B, 의견 없음)
- **참여 방법**: 온라인 설문 폼
- **독려**: 슬랙 공지, 추첨 이벤트

### 크리스마스 당일 이벤트 (12/24)
```
Part 1: 설문 결과 발표 (15분)
12:00-12:15
- 42 경산 카뎃 통계 공개
- 희망 분야, 활동 시간대, MBTI 등
- 가장 힘들었던 과제 TOP 3
- 밸런스 게임 사전 결과 미리보기

Part 2: 밸런스 게임 배틀 (42분)
12:15-12:57
- 사전 설문 비율 표시: "팥붕어빵 52% vs 슈크림 48%"
- 현장에서 진영 선택 + 의견 입력
- 실시간 의견 대결
```

## 🎮 이벤트 방식: 시간대별 순차 진행 (배틀 로얄)

### 운영 방식
- **총 6라운드** (라운드당 7분)
- 각 라운드마다 하나의 밸런스 게임 문제 진행
- 참가자는 모바일로 접속하여 진영 선택 + 의견 입력
- 대형 화면에 실시간 의견 대결 표시

### 타임라인 (밸런스 게임 배틀)
```
12:15-12:22  Round 1: 팥붕어빵 vs 슈크림붕어빵
12:22-12:29  Round 2: 버그를 찾았다!
12:29-12:36  Round 3: 평생 선택해야 한다면?
12:36-12:43  Round 4: 협업 스타일 선택!
12:43-12:50  Round 5: 개발 환경 선택!
12:50-12:57  Round 6: 코드 리뷰 받는다면?
```

## 🖥️ 화면 구성 (TV 1대 또는 절반)

### 옵션 A: TV 전체 사용 가능한 경우
```
┌──────────────────────────────────────────────────────────┐
│  🎮 ROUND 2/6  ⏱️ 5:23      [QR] survey.42gs.com        │
│                                                          │
│         21. 평생 선택해야 한다면?                        │
├────────────────────────────┬─────────────────────────────┤
│    세미콜론파 😤           │       괄호파 💪             │
│                            │                             │
│     ████████               │     ████████████            │
│       42명 (35%)           │       78명 (65%)            │
│                            │                             │
│  💬 "IDE가 알아서         │  💬 "괄호 안 닫으면        │
│     잡아주잖아"            │     찾기 힘들어"            │
│                            │                             │
│  💬 "C 할 땐              │  💬 "Python도              │
│     세미콜론이 생명"       │     괄호 중요함"            │
│                            │                             │
│  💬 "습관이 안돼"         │  💬 "LSP 만세"             │
└────────────────────────────┴─────────────────────────────┘
```

### 옵션 B: TV 절반만 사용하는 경우 (다른 이벤트와 공유)
```
┌─────────────────────────────┐
│ 🎮 R2/6 ⏱️ 5:23  [QR코드]  │
│                             │
│  평생 선택해야 한다면?      │
├─────────────────────────────┤
│  세미콜론파 😤              │
│  ████████ 42명 (35%)        │
│                             │
│  💬 "IDE가 알아서          │
│     잡아주잖아"             │
│  💬 "C 할 땐               │
│     세미콜론이 생명"        │
├─────────────────────────────┤
│  괄호파 💪                  │
│  ████████████ 78명 (65%)    │
│                             │
│  💬 "괄호 안 닫으면        │
│     찾기 힘들어"            │
│  💬 "Python도              │
│     괄호 중요함"            │
└─────────────────────────────┘
```

### 옵션 C: 아주 작은 공간만 가능한 경우 (최소 버전)
```
┌────────────────────┐
│ R2/6 ⏱️5:23  [QR] │
│                    │
│ 세미콜론 vs 괄호   │
│ 42명(35%) 78명(65%)│
│                    │
│ 💬 최신 의견만     │
│ "IDE가 잡아줌"     │
│ "괄호 안닫으면.."  │
└────────────────────┘
```

**추천 방식:**
- **옵션 A**: TV 전체를 사용할 수 있다면 (가장 이상적)
- **옵션 B**: TV 절반을 사용한다면 (세로 분할 추천)
- **옵션 C**: 공간이 매우 제한적이라면

## 📱 참가자 모바일 화면

### 1. 라운드 대기 화면
```
┌─────────────────┐
│ Round 2 진행중  │
│                 │
│ 평생 선택해야   │
│ 한다면?         │
│                 │
│ [세미콜론 ⚔️]   │
│ [괄호 ⚔️]       │
└─────────────────┘
```

### 2. 진영 선택 후 의견 입력
```
┌─────────────────┐
│ 세미콜론파 선택 │
│                 │
│ 한마디 남기기:  │
│ ┌─────────────┐ │
│ │ IDE가       │ │
│ │ 알아서      │ │
│ │ 잡아주잖아  │ │
│ └─────────────┘ │
│                 │
│   [전송하기]    │
└─────────────────┘
```

## 🗄️ 데이터베이스 구조

### surveys 테이블 (사전 설문용)
```sql
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  intra_id TEXT NOT NULL UNIQUE, -- 42 인트라 ID
  circle TEXT NOT NULL, -- 서클
  dev_field TEXT, -- 희망 개발 분야
  preferred_language TEXT, -- 선호 언어
  editor TEXT, -- 에디터
  active_time TEXT, -- 활동 시간대
  cluster_hours TEXT, -- 클러스터 시간
  study_location TEXT, -- 학습 위치
  non_cluster_activities TEXT[], -- 다른 공간 활동 (복수)
  work_style TEXT, -- 과제 방식
  planning_style TEXT, -- 계획형 vs 즉흥형
  learning_method TEXT, -- 학습 방법
  mbti TEXT, -- MBTI
  mbti_reliability INT, -- MBTI 신뢰도
  coding_environment TEXT, -- 코딩 환경
  favorite_snacks TEXT[], -- 선호 간식 (복수)
  debugging_method TEXT, -- 디버깅 방법
  hardest_project TEXT, -- 힘들었던 과제
  dev_goal_2026 TEXT, -- 2026 목표

  -- 밸런스 게임 (선택지만)
  balance_game_1 TEXT, -- A or B (붕어빵)
  balance_game_2 TEXT, -- A or B (버그)
  balance_game_3 TEXT, -- A or B (세미콜론 vs 괄호)
  balance_game_4 TEXT, -- A or B (협업)
  balance_game_5 TEXT, -- A or B (개발 환경)
  balance_game_6 TEXT  -- A or B (코드 리뷰)
);
```

### balance_game_rounds 테이블
```sql
CREATE TABLE balance_game_rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_number INT NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### balance_game_comments 테이블 (당일 의견용)
```sql
CREATE TABLE balance_game_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_id UUID REFERENCES balance_game_rounds(id),
  side TEXT NOT NULL, -- 'A' or 'B'
  comment TEXT NOT NULL, -- 현장에서 입력한 의견
  created_at TIMESTAMP DEFAULT NOW()
);
```

**주요 차이점:**
- `surveys` 테이블: 사전 설문에서 선택지만 저장 (의견 없음)
- `balance_game_comments` 테이블: 당일 현장에서 입력한 의견만 저장
- 사전 설문 비율을 표시하면서, 현장 의견으로 대결하는 구조

## 🎯 밸런스 게임 문제 목록

### Round 1: 붕어빵 대결!
- A: 팥붕어빵
- B: 슈크림붕어빵

### Round 2: 버그를 찾았다! 당신의 선택은?
- A: 1시간 안에 찾을 수 있지만 해결에 10시간 걸리는 버그
- B: 10시간 걸려 찾지만 1시간 안에 해결되는 버그

### Round 3: 평생 선택해야 한다면?
- A: 세미콜론 빼먹는 실수를 평생 반복
- B: 괄호 짝 안 맞는 실수를 평생 반복

### Round 4: 협업 스타일 선택!
- A: 코드는 완벽한데 커뮤니케이션 0인 팀원
- B: 커뮤니케이션은 완벽한데 코드 실력이 부족한 팀원

### Round 5: 개발 환경 선택! (지원금 고려 X)
- A: 성능 좋은 데스크탑 + 클러스터 필수 출석
- B: 성능 부족한 노트북 + 완전 재택 가능

### Round 6: 코드 리뷰 받는다면?
- A: "LGTM(Looks Good To Me)" 만 달아주는 리뷰어
- B: 코드 한 줄 한 줄 지적하며 다시 짜라는 리뷰어

## 🛠️ 기술 구현

### Frontend
- **Framework**: React + JavaScript (Vite)
- **Realtime**: Supabase Realtime Subscriptions
- **Animation**: Framer Motion (의견 카드 애니메이션)
- **Styling**: Tailwind CSS

### 주요 기능

#### 1. 관리자 페이지
```typescript
// 라운드 시작/종료 제어
const startRound = (roundNumber: number) => {
  // 모든 라운드 비활성화
  // 해당 라운드만 활성화
  // 타이머 시작
}

const endRound = () => {
  // 현재 라운드 비활성화
  // 결과 집계
}
```

#### 2. 메인 디스플레이 (대형 화면)
```typescript
// Supabase Realtime으로 새 의견 구독
useEffect(() => {
  const subscription = supabase
    .channel('balance_comments')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'balance_game_comments' },
      (payload) => {
        // 새 의견이 들어오면 애니메이션과 함께 표시
        animateNewComment(payload.new);
      }
    )
    .subscribe();
}, []);
```

#### 3. 참가자 모바일 페이지
```typescript
const submitComment = async (side: 'A' | 'B', comment: string) => {
  await supabase
    .from('balance_game_comments')
    .insert({
      round_id: currentRound.id,
      side: side,
      comment: comment
    });

  // 투표도 함께 기록
  await supabase
    .from('balance_game_votes')
    .insert({ round_id: currentRound.id, side: side });
};
```

## 🎨 UI/UX 특징

### 1. 실시간 애니메이션
- 새 의견이 들어오면 **해당 진영 쪽에서 슬라이드 인**
- 오래된 의견은 서서히 fade out
- 투표 수가 증가하면 바 차트 애니메이션

### 2. 진영 색상 구분
```css
/* A진영: 빨강 계열 */
.side-a {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* B진영: 파랑 계열 */
.side-b {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

### 3. 크리스마스 테마
- 눈 내리는 효과 (배경)
- 크리스마스 컬러 (빨강/초록/금색)
- 산타모자 아이콘, 선물 이모지 활용

## 📊 이벤트 후 결과 활용

### 1. 통계 대시보드
- 각 라운드별 투표 결과
- 가장 치열했던 라운드 (득표율 차이 5% 이내)
- 가장 재미있었던 의견 BEST 3 (추천 기능 추가 시)

### 2. SNS 공유용 카드
```
┌─────────────────────────┐
│  42 경산 밸런스 게임    │
│                         │
│  나는 [세미콜론파]      │
│  전체 35%가 선택!       │
│                         │
│  #42경산 #밸런스게임    │
└─────────────────────────┘
```

## ✅ 체크리스트

### 이벤트 전
- [ ] Supabase 프로젝트 생성 및 테이블 구축
- [ ] 6개 라운드 데이터 DB에 사전 입력
- [ ] 관리자 페이지 테스트
- [ ] 메인 디스플레이 화면 테스트
- [ ] 모바일 반응형 확인
- [ ] 실시간 동기화 테스트
- [ ] QR 코드 생성 및 출력
- [ ] TV 화면 연결 및 레이아웃 확인

### 이벤트 당일
- [ ] WiFi 연결 확인
- [ ] 관리자 로그인
- [ ] 메인 디스플레이 전체화면 설정
- [ ] QR 코드 부착
- [ ] 타이머 동작 확인
- [ ] MC 진행 대본 준비

### 이벤트 후
- [ ] 결과 데이터 백업
- [ ] 통계 대시보드 생성
- [ ] SNS 공유용 이미지 생성
- [ ] 참여자 피드백 수집

## 🚀 구현 우선순위

### Phase 1: MVP (필수)
1. 기본 DB 스키마 및 Supabase 설정
2. 관리자 페이지 (라운드 시작/종료)
3. 메인 디스플레이 (실시간 의견 표시)
4. 모바일 참여 페이지 (진영 선택 + 의견 입력)

### Phase 2: 개선 (추천)
1. 투표 수 실시간 카운트 및 바 차트
2. 의견 슬라이드 인 애니메이션
3. 타이머 기능
4. 크리스마스 테마 스타일링

### Phase 3: 추가 (선택)
1. 의견 추천 기능
2. 욕설/부적절한 내용 필터링
3. 관리자 의견 숨김 기능
4. 결과 통계 대시보드

## 💡 운영 팁

1. **첫 라운드는 가벼운 주제로**: 참가자들이 익숙해지도록
2. **MC의 역할이 중요**: 의견을 읽어주며 분위기 띄우기
3. **시간 조절 유연하게**: 의견이 적으면 짧게, 많으면 길게
4. **베스트 의견 시상**: 가장 재미있는 의견에 작은 상품
5. **사전 테스트 필수**: 현장에서 문제 생기면 수습 어려움

## 📝 참고사항

- 동시 접속자 예상: 50-100명
- Supabase 무료 티어로도 충분히 가능
- 모바일 데이터로 접속 시 네트워크 부하 고려
- 이벤트 시간: 약 42분 (6라운드 기준)

---

## 🎤 회의 발표용 요약

### 이벤트 개요
- **목적**: 42 경산 크리스마스 이벤트 - 설문 결과 발표 + 실시간 밸런스 게임 배틀
- **방식**:
  - Part 1: 사전 설문 결과 발표 (15분)
  - Part 2: 밸런스 게임 배틀 - 모바일로 의견 입력 → TV 화면 실시간 표시 (42분)
- **소요 시간**: 총 57분

### 핵심 포인트
1. **간단한 참여 방법**: QR 코드 스캔 → 진영 선택 → 의견 한 줄 입력
2. **실시간 인터랙션**: 입력한 의견이 즉시 대형 화면에 표시 (애니메이션 효과)
3. **진영 대결 구도**: 양쪽 진영의 의견이 좌우(또는 상하)로 나뉘어 대결하는 느낌
4. **라운드 진행**: 관리자가 라운드를 순차적으로 시작/종료하며 진행

### 기술 스택
- **Frontend**: React + JavaScript (초보자도 구현 가능)
- **Backend/DB**: Supabase (실시간 기능 내장, 무료)
- **Deploy**: Vercel (자동 배포)

### 필요한 것
- TV 1대 (또는 TV 절반 공간)
- WiFi 연결
- QR 코드 출력물
- 관리자용 노트북 1대

### 밸런스 게임 문항 (6개)
1. 팥붕어빵 vs 슈크림붕어빵 (아이스브레이커)
2. 버그 찾기 vs 해결하기
3. 세미콜론 vs 괄호
4. 완벽한 코드 but 소통X vs 부족한 코드 but 소통 완벽
5. 고성능 데스크탑+출석 필수 vs 저성능 노트북+재택 (지원금 고려X)
6. LGTM만 달아주는 리뷰어 vs 한 줄 한 줄 지적하는 리뷰어

### 구현 난이도
⭐⭐☆☆☆ (중하) - React 초보도 충분히 가능
- Supabase 실시간 기능 사용 (복붙 수준)
- 기본 폼 입력 + 리스트 표시
- CSS 애니메이션 (라이브러리 활용)
