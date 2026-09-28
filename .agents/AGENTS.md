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

## HIRA Public Data & Quarterly Update Rule

심평원 전국 병의원·약국 기본 및 12종 상세 정보 분기별 갱신 시 원천 데이터 다운로드 경로:

1. **원천 데이터 다운로드 직접 URL**:
   - `https://opendata.hira.or.kr/op/opc/selectOpenData.do?sno=11925` (건강보험심사평가원 보건의료빅데이터개방시스템 - 전국 병의원 및 약국 현황)
   - 연계 공공데이터포털: `https://www.data.go.kr/data/15051059/fileData.do` (기관자체 다운로드 연계)
2. **저장 경로**: `public/hospital_info_file/` (12종 엑셀 세트: `1.병원정보서비스` ~ `12.의료기관별상세정보서비스_10_기타인력정보`)
3. **DB 반영 커맨드**: `npx tsx src/scripts/migrateHospitalData.ts` (암호화요양기호 `ykiho` 기준 자동 Upsert)
