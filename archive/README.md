# 📦 Archive (보관소)

이 폴더에는 42 경산 크리스마스 이벤트의 초기 개발 코드와 참고 문서가 보관되어 있습니다.

## 📂 폴더 구조

```text
archive/
├── README.md                    # 이 파일
├── VITE_README.md               # Vite 템플릿 원본
└── old_survey_code/             # 구 설문조사 코드
    ├── README.md                # 백업 코드 설명
    ├── src/                     # React 컴포넌트
    ├── public/                  # 정적 파일
    ├── package.json             # 의존성
    ├── index.html               # HTML 템플릿
    ├── vite.config.js           # Vite 설정
    ├── tailwind.config.js       # Tailwind 설정
    ├── postcss.config.js        # PostCSS 설정
    ├── eslint.config.js         # ESLint 설정
    ├── supabase-schema.sql      # 구 DB 스키마
    ├── SETUP.md                 # 구 개발 환경 가이드
    └── LEARNING_GUIDE.md        # 구 학습 가이드
```

**참고**: 기획 문서 ([SurveyQuestions.md](../SurveyQuestions.md), [BalanceGameEvent.md](../BalanceGameEvent.md))는 프로젝트 루트에 위치합니다.

---

## 📄 [VITE_README.md](VITE_README.md)

**Vite 템플릿 원본 README**

React + Vite 프로젝트 생성 시 자동으로 포함된 템플릿 README입니다.
개발 참고용으로 보관합니다.

---

## 💾 Old Survey Code

### [old_survey_code/](old_survey_code/)

Google Forms를 사용하기 전에 만들었던 커스텀 설문조사 앱 코드입니다.

**포함 내용:**
- React 컴포넌트 (Home, Survey, Stats 페이지)
- Supabase 연동 설정
- Tailwind CSS 스타일링
- 모든 설정 파일 (Vite, ESLint, PostCSS 등)

**사용하지 않는 이유:**
- Google Forms로 설문 진행 결정
- 개발 리소스를 실시간 밸런스 게임 이벤트에 집중

상세 내용은 [old_survey_code/README.md](old_survey_code/README.md)를 참고하세요.

---

## 🔄 기획 변경 이력

자세한 기획 변경 사항은 프로젝트 루트의 [BalanceGameEvent.md](../BalanceGameEvent.md)를 참고하세요.

### 주요 변경 사항

### 질문 8-1 → 질문 9 변경
- **배경**: 클러스터 학습 규정 변경 (클러스터 = 42 과제만)
- **변경 전**: "클러스터에서 42 과제 외에 주로 하는 활동은?"
- **변경 후**: "클러스터 외 다른 공간(오아시스, 오픈라운지)에서 주로 하는 활동은?"
- **효과**: 규정에 맞게 질문 조정 + 독립 문항으로 번호 부여

### 밸런스 게임 문항 조정
1. **추가**: 붕어빵 문항 (Round 1로 이동)
   - 가벼운 주제로 아이스브레이킹
2. **수정**: Stack Overflow → GPT/Claude
   - 최근 트렌드 반영
3. **수정**: 개발 환경 문항에 "지원금 고려 X" 조건 추가
   - 순수한 선호도 조사
4. **삭제**: "GPT/Claude도 모르는 문제" 문항
   - 논리적 모순 해결

### 설문 방식 결정
- **초기 계획**: 커스텀 웹 폼 개발
- **최종 결정**: Google Forms 사용
- **이유**:
  - 개발 시간 절약
  - 안정성 보장
  - 자동 집계 기능
  - 개발 리소스를 실시간 이벤트에 집중

---

## 📌 참고사항

### 이 문서들을 보는 방법
1. **이벤트 진행자**: BalanceGameEvent.md의 타임라인과 MC 대본 참고
2. **개발자**: 데이터베이스 스키마와 기술 구현 가이드 참고
3. **설문 작성자**: SurveyQuestions.md로 Google Forms 생성

### 개발 시 주의사항
- 밸런스 게임은 총 **6개** (Round 1~6)
- 사전 설문은 **선택지만**, 당일 이벤트는 **의견 수집**
- 클러스터 규정 변경 사항 반영 필수

---

**이 문서들은 기획 단계의 산출물로, 실제 구현은 프로젝트 루트의 코드를 참고하세요.**
