---
name: git-auto-sync
description: Calamus Portal 소스 코드의 Git 상태 점검, 스테이징, 자동 커밋 및 GitHub 원격 저장소(changwoojung7-sys/calamus-portal) main 브랜치 자동 푸시 스킬.
---

# Git Auto Sync Skill (GitHub 자동 푸시 스킬)

이 스킬은 사용자가 **"깃 푸시해줘"**, **"소스 올려줘"**, **"깃허브 업로드해줘"**, **"커밋하고 푸시해줘"**라고 요청할 때, Calamus Portal 프로젝트의 모든 변경사항을 검증된 GitHub 원격 저장소로 원터치 자동 커밋 및 푸시하는 공식 워크플로우를 정의합니다.

## 🎯 원격 저장소 대상 정보
- **Repository URL**: `https://github.com/changwoojung7-sys/calamus-portal.git`
- **Target Branch**: `main`
- **Target Account**: `changwoojung7-sys`

---

## ⚡ 자동 실행 방법 (Recommended)

스킬 내 제공되는 전용 자동화 파워쉘 스크립트를 실행하여 1단계부터 4단계(상태 확인 → 스테이징 → 커밋 → 푸시)를 즉시 완수합니다:

```powershell
powershell -ExecutionPolicy Bypass -File .agents/skills/git-auto-sync/scripts/sync.ps1 -Message "Feat: <작업 내용 요약>"
```

---

## 🛠️ 단계별 수동 워크플로우

1. **상태 확인 (Git Status)**
   ```powershell
   git status
   ```

2. **전체 변경사항 스테이징 (Git Add)**
   ```powershell
   git add .
   ```

3. **작업 내역 커밋 (Git Commit)**
   ```powershell
   git commit -m "Feat: <작업 내용 요약>"
   ```

4. **GitHub 원격 저장소 푸시 (Git Push)**
   ```powershell
   git push origin main
   ```

---

## ✅ 완료 응답 규칙
- 작업 완료 후 반드시 **한국어(Korean)**와 함께 초록색 체크마크(**✅**)를 표시하여 푸시 성공을 명확하게 보고합니다.
