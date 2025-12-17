# 보안 가이드

## 🚨 긴급 보안 조치 완료

이 프로젝트는 이전에 Supabase 인증 키가 GitHub에 노출되었던 이력이 있습니다. 다음 조치가 완료되었습니다:

- ✅ Git 히스토리에서 `.env` 파일 완전 제거
- ✅ `.gitignore`에 `.env` 추가
- ✅ `.env.example` 템플릿 제공

## ✅ anon key 노출에 대한 보안 평가

### Supabase anon key는 노출되어도 안전합니다

이 프로젝트는 **Row Level Security (RLS)가 올바르게 설정**되어 있어, `anon` key가 GitHub에 노출되었더라도 보안상 문제가 없습니다.

#### 왜 안전한가?

1. **anon key는 의도적으로 공개되는 키입니다**
   - 브라우저(클라이언트)에서 사용하도록 설계됨
   - Supabase 공식 문서에서도 "safe to use in a browser"라고 명시

2. **RLS로 완전히 보호됩니다**
   - 모든 테이블에 RLS 활성화됨
   - anon 역할은 읽기와 제한된 쓰기만 가능
   - 수정/삭제는 인증된 사용자만 가능

3. **실제 적용된 보안 정책** (supabase-schema.sql 참조)

   ```sql
   ALTER TABLE balance_game_rounds ENABLE ROW LEVEL SECURITY;
   ALTER TABLE balance_game_comments ENABLE ROW LEVEL SECURITY;

   -- 읽기: 모두 가능
   CREATE POLICY "Anyone can read rounds" ON balance_game_rounds FOR SELECT USING (true);
   CREATE POLICY "Anyone can read comments" ON balance_game_comments FOR SELECT USING (true);

   -- 쓰기: 댓글 작성만 가능
   CREATE POLICY "Anyone can insert comments" ON balance_game_comments FOR INSERT WITH CHECK (true);

   -- 업데이트/삭제: 인증된 사용자만 가능 (관리자)
   CREATE POLICY "Authenticated users can update rounds" ON balance_game_rounds FOR UPDATE USING (auth.role() = 'authenticated');
   ```

### ⚠️ 주의사항

**service_role (secret) key는 절대 노출되면 안 됩니다!**

- service_role key는 RLS를 우회할 수 있음
- 서버 사이드에서만 사용해야 함
- 이 프로젝트는 service_role key를 사용하지 않음

### Row Level Security (RLS) 정책 확인

데이터베이스 보안을 강화하려면:

1. Supabase Dashboard → **Authentication** → **Policies**
2. 각 테이블에 대한 RLS 정책이 활성화되어 있는지 확인
3. 공개 접근이 필요한 테이블만 `anon` 역할에 권한 부여

```sql
-- 예시: participants 테이블에 RLS 활성화
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- 읽기 전용 정책 (모든 사용자가 볼 수 있음)
CREATE POLICY "Enable read access for all users"
ON participants FOR SELECT
USING (true);

-- 쓰기 정책 (인증된 사용자만 삽입 가능)
CREATE POLICY "Enable insert for authenticated users only"
ON participants FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

### 3. GitHub에서 변경사항 반영

로컬에서 Git 히스토리를 정리했으므로, 원격 저장소에도 반영해야 합니다:

```bash
# 원격 저장소에 강제 푸시 (주의: 협업자가 있다면 사전에 알려야 함)
git push origin --force --all
git push origin --force --tags

# 기존 refs 정리
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### 4. GitHub Secrets 사용 (선택사항)

CI/CD 파이프라인을 사용한다면 GitHub Secrets에 키를 저장하세요:

1. Repository → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. 이름: `VITE_SUPABASE_URL`, 값: 실제 URL 입력
4. 이름: `VITE_SUPABASE_ANON_KEY`, 값: 새로 발급받은 키 입력

## 📋 체크리스트

- [x] Git 히스토리에서 `.env` 파일 완전 제거 완료
- [x] `.gitignore`에 `.env` 추가 완료
- [x] RLS 정책 확인 완료 - 안전하게 설정되어 있음
- [ ] `git push --force --all` 로 GitHub에 정리된 히스토리 반영
- [ ] 팀원들에게 force push 알림 (협업 시)

## 🔐 향후 보안 best practices

1. **절대로** `.env` 파일을 커밋하지 마세요
2. 민감한 정보는 환경 변수로만 관리하세요
3. 정기적으로 키를 로테이션하세요
4. Supabase 대시보드에서 API 사용량을 모니터링하세요
5. 의심스러운 활동이 보이면 즉시 키를 재발급하세요

## 📞 문제 발생 시

- Supabase 공식 문서: https://supabase.com/docs/guides/api
- RLS 가이드: https://supabase.com/docs/guides/auth/row-level-security
