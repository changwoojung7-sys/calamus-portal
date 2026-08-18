---
name: git-auto-sync
description: Git 변경사항 자동 커밋 및 GitHub 원격 저장소 푸시 스킬. 작업 완료 시 변경사항을 커밋하고 푸시할 때 사용합니다.
---

# Git Auto Sync Skill

이 스킬은 프로젝트 변경사항을 Git에 자동으로 스테이징, 커밋, 그리고 원격 저장소(`origin/main`)로 푸시하는 표준 워크플로우를 정의합니다.

## 워크플로우 절차

1. **상태 확인 (Git Status)**
   ```powershell
   git status
   ```
2. **변경사항 스테이징 (Git Add)**
   ```powershell
   git add .
   ```
3. **커밋 메시지 작성 및 커밋 (Git Commit)**
   - 명확하고 구체적인 한글/영어 커밋 메시지 작성
   ```powershell
   git commit -m "Feat: <작업 내용 요약>"
   ```
4. **원격 저장소 푸시 (Git Push)**
   ```powershell
   git push origin main
   ```

