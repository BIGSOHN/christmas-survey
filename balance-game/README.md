# Balance Game (밸런스 게임)

크리스마스 이벤트용 실시간 밸런스 게임 애플리케이션입니다.

## 주요 기능

- **실시간 투표 시스템**: 참가자들이 실시간으로 A/B 선택지에 투표
- **채팅 기능**: 각 진영별로 의견을 나눌 수 있는 실시간 채팅
- **욕설 필터링**: 부적절한 언어 자동 차단
- **관리자 페이지**: 라운드 관리 및 실시간 모니터링
- **디스플레이 페이지**: 투표 결과와 채팅을 보여주는 대형 화면용 페이지

## 기술 스택

- **Frontend**: React + Vite
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion

## 욕설 필터링

욕설 필터는 약 3,600개의 한국어 및 다국어 욕설 단어를 포함합니다.

- **출처**: [롤 필터에 걸리는 모든 욕설 모음](https://talk.op.gg/s/lol/free/2649743/%EB%A1%A4%20%ED%95%84%ED%84%B0%EC%97%90%20%EA%B1%B8%EB%A6%AC%EB%8A%94%20%EB%AA%A8%EB%93%A0%20%EC%9A%95%EC%84%A4%20%EB%AA%A8%EC%9D%8C)
- **위치**: `src/data/profanity.json`
- **업데이트 날짜**: 2025-12-20 (원본 데이터는 circa 2020)
- **참고**: 오래된 데이터이므로 최신 신조어나 변형어가 포함되지 않을 수 있습니다. 필요시 주기적 업데이트가 필요합니다.

## 투표 시스템

- **익명 투표**: localStorage 기반 세션 ID로 사용자 식별
- **재투표 가능**: 마지막 선택한 진영으로 투표 반영 (upsert 방식)
- **실시간 집계**: Supabase Realtime으로 투표 수 즉시 반영

---

## React + Vite Template

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
