# Project Rules for Calamus Portal

## GitHub Upload Automation Rule

When the user asks to "소스 올려줘", "깃허브 업로드 해줘", "깃 푸시해줘", or similar requests to push source code to GitHub:

1. Git remote repository target: `https://github.com/changwoojung7-sys/calamus-portal.git` (Branch: `main`, Account: `changwoojung7-sys`).
2. Run standard git status / add / commit / push commands:
   - `git status`
   - `git add .`
   - `git commit -m "Feat: <작업 내용 요약>"` (or default `"Feat: Update Calamus Portal source code"`)
   - `git push origin main`
3. Always provide clear, green checkmark (✅) confirmation upon completion.

## Coding Style Rules

- Use Next.js with TypeScript
- Use Tailwind CSS for styling
- Use Material UI (MUI) for components

## File Naming Rules

- Component files: PascalCase (e.g., `Index.tsx`)
- Utility files: camelCase (e.g., `utils.ts`)
- Hook files: camelCase with `use` prefix (e.g., `useAuth.ts`)
