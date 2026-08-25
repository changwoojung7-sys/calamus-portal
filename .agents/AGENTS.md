# Project Rules for Calamus Portal

1. **Language:** ALWAYS answer in **Korean (한국어)**.
2. **Formatting:** 작업 완료 시 ✅ 체크마크를 반드시 표시할 것.
3. **Context First:** 프로젝트 시작 시 반드시 `mdfile 폴더 내 .md`를 먼저 읽고 프로젝트 맥락을 파악할 것.
4. **Reference Docs:** 상세 구현 현황은 `mdfile/Context.md`, DB 정보는 supabase 폴더내 파일 참조.
5. 프로그램 변경사항은 항상 mdfile/CHANGELOG.md 에 기록할 것.

## GitHub Upload Automation Rule

When the user asks to "소스 올려줘", "깃허브 업로드 해줘", "깃 푸시해줘", or similar requests to push source code to GitHub:

1. Git remote repository target: `https://github.com/changwoojung7-sys/calamus-portal.git` (Branch: `main`, Account: `changwoojung7-sys`).
2. Use the `git-auto-sync` skill (`.agents/skills/git-auto-sync/scripts/sync.ps1`) or standard git workflow:
   - `powershell -ExecutionPolicy Bypass -File .agents/skills/git-auto-sync/scripts/sync.ps1 -Message "Feat: <작업 내용 요약>"`
   - 또는 `git status` -> `git add .` -> `git commit -m "..."` -> `git push origin main`
3. Always provide clear, green checkmark (✅) confirmation upon completion.

## Coding Style Rules

- Use Next.js with TypeScript
- Use Tailwind CSS for styling
- Use Material UI (MUI) for components

## File Naming Rules

- Component files: PascalCase (e.g., `Index.tsx`)
- Utility files: camelCase (e.g., `utils.ts`)
- Hook files: camelCase with `use` prefix (e.g., `useAuth.ts`)
