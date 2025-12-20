# 투표 초기화 기능 사용 가이드

## 🔒 보안 개선 사항

투표 초기화 기능은 이제 **Supabase 인증된 사용자만** 사용할 수 있습니다.

## 📋 설정 방법

### 1. Supabase에서 RLS 정책 업데이트

Supabase Dashboard → SQL Editor에서 다음 SQL 실행:

```sql
-- 기존 DELETE 정책 제거
DROP POLICY IF EXISTS "Only admins can delete votes" ON balance_game_votes;

-- 인증된 사용자만 투표 삭제 가능
CREATE POLICY "Authenticated users can delete votes"
  ON balance_game_votes
  FOR DELETE
  USING (auth.role() = 'authenticated');
```

또는 `sql/update_votes_rls_policy.sql` 파일의 내용을 복사하여 실행하세요.

### 2. Supabase에서 관리자 계정 생성

1. **Supabase Dashboard** → **Authentication** → **Users**
2. **Add user** 버튼 클릭
3. 관리자용 이메일과 비밀번호 입력
4. **Create user** 클릭

예시:
- Email: `admin@yourdomain.com`
- Password: `강력한_비밀번호_123!`

### 3. AdminPage에서 인증하기

1. 일반 비밀번호로 AdminPage에 로그인
2. 우측 상단의 **Supabase 인증** 박스에서 관리자 계정으로 로그인
3. ✅ **Supabase 인증됨** 표시 확인
4. 이제 **투표 초기화** 버튼 사용 가능!

## 🎯 사용 방법

### 개별 라운드 투표 초기화
1. Supabase 인증 완료 확인
2. 라운드 카드에서 **투표 초기화** 버튼 클릭
3. 확인 다이얼로그에서 **확인** 클릭
4. 해당 라운드의 투표만 삭제됨

### 전체 투표 초기화
1. Supabase 인증 완료 확인
2. 라운드 관리 섹션의 **전체 투표 초기화** 버튼 클릭
3. 확인 다이얼로그에서 **확인** 클릭
4. 모든 라운드의 투표가 삭제됨

## ⚠️ 주의사항

- **인증 없이는 투표 초기화 불가**: "Supabase 인증이 필요합니다" 알림 표시
- **RLS 정책 미설정 시**: DELETE 작업이 거부되고 에러 메시지 표시
- **투표 초기화는 되돌릴 수 없음**: 신중하게 사용하세요

## 🔐 보안 이점

### 이전 방식 (취약)
- 누구나 개발자 도구로 API 호출하여 투표 삭제 가능
- RLS에서 `USING (false)`로 모든 삭제 차단

### 현재 방식 (안전)
- Supabase 인증된 사용자만 삭제 가능
- 서버 측(Supabase)에서 권한 검증
- 개발자 도구로 우회 불가능

## 🐛 트러블슈팅

### "투표 초기화 실패: new row violates row-level security policy"
→ RLS 정책이 아직 업데이트되지 않음
→ 위의 **1. Supabase에서 RLS 정책 업데이트** 단계 수행

### "Supabase 로그인 실패: Invalid login credentials"
→ 이메일/비밀번호가 틀림
→ Supabase Dashboard에서 계정 확인 또는 비밀번호 재설정

### 투표 초기화 후 UI가 업데이트되지 않음
→ 페이지 새로고침 (F5)
→ 또는 다른 라운드를 활성화했다가 다시 돌아오기

## 📝 참고

- 일반 비밀번호 인증: AdminPage 접근용
- Supabase 인증: 투표 삭제 권한용 (추가 보안 레이어)
