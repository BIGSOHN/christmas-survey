# 보안 가이드

## 🚨 긴급 보안 조치 완료

이 프로젝트는 이전에 Supabase 인증 키가 GitHub에 노출되었던 이력이 있습니다. 다음 조치가 완료되었습니다:

- ✅ Git 히스토리에서 `.env` 파일 완전 제거
- ✅ `.gitignore`에 `.env` 추가
- ✅ `.env.example` 템플릿 제공

## ⚠️ 필수 조치 사항

### 1. Supabase 키 즉시 재발급 (가장 중요!)

노출된 키는 더 이상 사용하면 안 됩니다. 다음 단계를 따라 새 키를 발급받으세요:

1. [Supabase Dashboard](https://app.supabase.com) 로그인
2. 프로젝트 선택
3. **Settings** → **API** 이동
4. **Reset** 버튼을 클릭하여 `anon` key 재발급
5. 새 키를 로컬 `.env` 파일에 저장

### 2. Row Level Security (RLS) 정책 확인

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

- [ ] Supabase `anon` key 재발급 완료
- [ ] 로컬 `.env` 파일에 새 키 저장
- [ ] RLS 정책 확인 및 활성화
- [ ] `git push --force` 로 GitHub에 정리된 히스토리 반영
- [ ] 기존 노출된 키가 더 이상 작동하지 않는지 확인
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
