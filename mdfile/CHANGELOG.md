# 변경 내역 (CHANGELOG)

## [2026-08-18] Calamus AI 포털 리뉴얼 및 4대 솔루션 포트폴리오 구축 & 병원 검색 고도화

### 1. Calamus AI 포털 메인 리뉴얼 (`src/app/page.tsx`)
- **유진AI & Calamus AI 브랜드 아이덴티티 적용**: 비즈니스 허브 비전 및 4대 솔루션 원클릭 퀵 칩 제공
- **회사 소개 섹션 (`src/components/portfolio/CompanyIntro.tsx`)**: 3대 핵심 가치(실용적 AI, 데이터 신뢰성, 고성능 UX) 및 서비스 생태계 아키텍처 소개
- **솔루션 포트폴리오 쇼케이스 (`src/components/portfolio/SolutionCard.tsx`)**:
  - 🏥 **Calamus Care & Portal**: 심평원 공공데이터 연계 전국 병의원·요양시설 실시간 탐색기
  - 📱 **My Re Design**: AI 라이프스타일 습관·루틴 코칭 PWA
  - 💖 **온안부 (OnAnBu)**: AI 시니어 케어 & 가족 안부 확인 플랫폼
  - 📊 **Lua Visibility Dashboard**: 초고속 글로벌 엣지 기반 실시간 BI 대시보드
- **포트폴리오 비교 요약표**: 4개 솔루션의 타깃, 핵심 기술 스택, 서비스 가치 비교 테이블 제공

### 2. 솔루션별 전용 상세 소개 페이지 신설
- `src/app/solutions/my-re-design/page.tsx`: My Re Design 상세 스펙 및 공식 사이트(`https://myredesign.ai.kr`) 바로가기
- `src/app/solutions/onanbu/page.tsx`: 온안부(OnAnBu) 상세 스펙 및 공식 사이트(`https://onanbu.calamus.ai.kr`) 바로가기
- `src/app/solutions/lua-visibility/page.tsx`: Lua Visibility Dashboard 상세 스펙 및 공식 사이트(`https://lua-visibility.pages.dev/dashboard`) 바로가기

### 3. 전국 병의원 검색기 (`FacilityMapSearch.tsx` & `/api/facilities`) 고도화
- **5대 추천/파트너 병원 슬롯 개편**:
  - 기존 지역명 포함 추천 키워드를 제거하고, 공식 광고/추천 병원 5개(`효사랑가족요양병원`, `보바스기념병원`, `인창요양병원`, `청주필한방병원`, `신윤수내과의원`) 슬롯으로 개편
- **일반병원 필터 ➔ `일반병원/의원` 확장**:
  - 카테고리 필터 명칭 변경 및 일반병원(`21`) + 동네 의원/클리닉(`31`, 전국 3.7만여 곳) 통합 검색 지원
- **상세정보 전체 대상 다중 토큰 LIKE 검색 지원**:
  - 검색어 입력 시 병원명, 주소, 지역명뿐 아니라 오른쪽 상세 카드에 표시되는 진료과목, 보유 장비(인공신장기, 초음파 등), 특화 진료(추나, 투석, 가정간호 등) 전체 필드 LIKE 검색
- **대용량 데이터 무한 스크롤(Infinite Scroll) 및 더보기 버튼 탑재**:
  - 1,200여 곳 이상 결과 조회 시 첫 페이지 이후 목록이 끊기지 않도록 스크롤 감지 무한 로딩 및 하단 `더 많은 병원 불러오기 (+40곳)` 버튼 구현

### 4. Git 자동화 규칙 및 스킬 표준화
- `.agents/AGENTS.md` 및 `.agents/skills/git-auto-sync/SKILL.md` 브랜치(`main`) 및 워크플로우 명시

---

## [2026-08-17] 심평원 대용량 엑셀 데이터 Supabase 마이그레이션 아키텍처 및 스키마 구축

### 1. Supabase (`klgeuewpslppoxgvkiqj`) 전용 테이블 스키마 설계 (`src/lib/db/schema.sql`)
- **`hosapi_hospital`**: 전국 7.9만여 개 병의원 기본 정보 (종별, 전문의수, 의사수, 위경도, PostGIS geom)
- **`hosapi_pharmacy`**: 전국 2.4만여 개 약국 정보 (향후 약국 찾기 서비스 확장 대비)
- **`hosapi_hospital_detail`**: 시설(병상수/입원실/중환자실/응급실), 진료과목, 의료장비(MRI/CT 등), 교통/주차, 간호등급 종합 JSONB 매핑

### 2. 분기별 엑셀 파일 자동 마이그레이션 파이프라인 (`src/scripts/migrateHospitalData.ts`)
- `public/hospital_info_file/` 폴더에 분기별 신규 엑셀 파일이 투입되면 파일명 패턴으로 자동 인식
- 12종 엑셀의 다대일(1:N) 관계 데이터를 `ykiho` 기준으로 자동 결합하여 배치(Batch Upsert 500건 단위) 적재
- `npm run migrate:hosp` 명령어를 통한 원클릭 자동 동기화 지원
