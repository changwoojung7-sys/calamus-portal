# Calamus Portal 프로젝트 아키텍처 및 소스 구조 (Context.md)

> **최종 갱신일**: 2026-08-18  
> **프로젝트명**: Calamus Portal (Calamus Care & AI Solutions Hub)  
> **운영 조직**: 유진AI (EUGENE AI)  
> **기본 스택**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Material UI (MUI), Supabase (PostgreSQL), Cloudflare Pages / Edge Runtime  

---

## 1. 프로젝트 개요

Calamus Portal은 **유진AI의 4대 AI & 케어 솔루션을 통합 소개하는 공식 비즈니스 허브**이자, **건강보험심사평가원(HIRA) 2026.06월 공공데이터 기반 전국 7만여 개 병의원·요양시설 탐색 플랫폼**입니다. 또한 사주, 타로, 꿈해몽, 게임 등의 라이프 힐링 라운지를 함께 제공합니다.

### 4대 솔루션 라인업
1. **Calamus Care & Portal** (`calamus.ai.kr`): 전국 병의원·요양시설 공공데이터(2026.06월 기준) 탐색 허브
2. **My Re Design** (`myredesign.ai.kr`): AI 기반 라이프스타일 / 개인화 루틴·목표 코칭 PWA
3. **온안부 (OnAnBu)** (`onanbu.calamus.ai.kr`): 케어 테크 / 시니어·가족 안부 확인 & 웰빙 플랫폼
4. **Lua Visibility Dashboard** (`lua-visibility.pages.dev`): 초고속 엣지 기반 엔터프라이즈 실시간 BI 대시보드

---

## 2. 전체 디렉터리 및 소스 트리 구조

```
CalamusPortal/
├── .agents/                                # 에이전트 설정 및 커스텀 스킬
│   ├── AGENTS.md                           # 프로젝트 코딩 스타일 및 Git 푸시 자동화 규칙
│   └── skills/
│       └── git-auto-sync/
│           └── SKILL.md                    # Git 자동 동기화 워크플로우 스킬
│
├── mdfile/                                 # 프로젝트 기획 및 문서 아카이브
│   ├── CHANGELOG.md                        # 일자별 변경 내역 및 작업 로그
│   ├── Context.md                          # [본 문서] 프로젝트 소스 구조 및 컨텍스트
│   ├── calamus 포털 리뉴얼_회사소개 및 포트폴리오.md # 포털 리뉴얼 기획안
│   ├── 사주 리뉴얼.md
│   └── 타로카드 리뉴얼.md
│
├── public/                                 # 정적 자산 및 아이콘
│   └── hospital_info_file/                 # 심평원 분기별 병원정보 엑셀 데이터 파일
│
├── src/
│   ├── app/                                # Next.js 15 App Router 라우트 정의
│   │   ├── layout.tsx                      # 글로벌 루트 레이아웃 (SEO, 메타데이터, 폰트)
│   │   ├── page.tsx                        # 메인 포털 화면 (회사소개, 4대 솔루션 쇼케이스, 병원검색기 연동)
│   │   ├── globals.css                     # 전역 스타일 및 유틸리티 CSS
│   │   │
│   │   ├── solutions/                      # [신규] 3대 개별 솔루션 상세 소개 페이지
│   │   │   ├── my-re-design/
│   │   │   │   └── page.tsx                # My Re Design 상세 스펙 및 공식 사이트 바로가기
│   │   │   ├── onanbu/
│   │   │   │   └── page.tsx                # 온안부(OnAnBu) 상세 스펙 및 공식 사이트 바로가기
│   │   │   └── lua-visibility/
│   │   │       └── page.tsx                # Lua Visibility 대시보드 상세 스펙 및 바로가기
│   │   │
│   │   ├── api/                            # Edge Runtime 기반 백엔드 API 라우트
│   │   │   ├── facilities/
│   │   │   │   ├── route.ts                # 전국 병의원 목록 검색 API (다중 LIKE, 의원 포함, 페이지네이션)
│   │   │   │   └── detail/
│   │   │   │       └── route.ts            # 개별 의료기관 심평원 12종 상세정보 조회 API
│   │   │   ├── saju/route.ts               # 사주/운세 계산 API
│   │   │   ├── tarot/route.ts              # 타로 리딩 AI API
│   │   │   ├── dream/route.ts              # AI 꿈해몽 분석 API
│   │   │   ├── name/route.ts               # 성명학 분석 API
│   │   │   └── balance/analyze/route.ts    # 밸런스 게임 AI 분석 API
│   │   │
│   │   ├── saju/                           # 사주 분석 페이지
│   │   ├── tarot-room/                     # 타로 리딩 룸 페이지
│   │   ├── dream/                          # AI 꿈해몽 페이지
│   │   ├── name/                           # 이름 풀이 페이지
│   │   ├── balance/                        # 밸런스 게임 페이지
│   │   ├── brake/                          # 브레이크 게임 페이지
│   │   ├── roulette/                       # 룰렛 페이지
│   │   └── sadari/                         # 사다리 타기 페이지
│   │
│   ├── components/                         # 모듈형 React 컴포넌트
│   │   ├── care/                           # 메디컬 & 케어 핵심 컴포넌트
│   │   │   ├── FacilityMapSearch.tsx       # 전국 병원/요양시설 지도 및 실시간 무한스크롤 탐색기
│   │   │   ├── QuickCategoryCards.tsx      # 상단 퀵 카테고리 바로가기 카드
│   │   │   ├── CareMagazineSection.tsx     # 케어 가이드 및 매거진 섹션
│   │   │   └── HealingLoungeBanner.tsx     # 힐링 라운지 통합 배너
│   │   │
│   │   ├── portfolio/                      # [신규] 포털 및 회사 소개 컴포넌트
│   │   │   ├── CompanyIntro.tsx            # 유진AI 3대 가치 및 비전 소개 섹션
│   │   │   └── SolutionCard.tsx            # 4대 솔루션 포트폴리오 인터랙티브 카드
│   │   │
│   │   ├── ads/
│   │   │   └── GoogleAd.tsx                # Google AdSense 반응형 광고 배너
│   │   └── common/
│   │       └── Footer.tsx                  # 공통 하단 푸터 (사업자 정보, 저작권, 링크)
│   │
│   ├── types/                              # TypeScript 전역 타입 정의
│   │   └── facility.ts                     # 병의원, 시설, 장비, 교통, 필터 관련 인터페이스
│   │
│   ├── lib/                                # 공통 라이브러리 및 DB 인스턴스
│   │   ├── supabase.ts                     # Supabase Client 설정
│   │   └── db/
│   │       └── schema.sql                  # PostgreSQL 테이블, 인덱스, 트리거 정의
│   │
│   └── scripts/                            # 데이터 마이그레이션 스크립트
│       └── migrateHospitalData.ts          # 심평원 엑셀 ➔ Supabase 배치 업로드 스크립트
│
├── supabase/
│   └── schema.sql                          # Supabase 마이그레이션 DDL 아카이브
├── package.json                            # 의존성 패키지 및 빌드 스크립트
├── tsconfig.json                           # TypeScript 컴파일러 설정
└── next.config.ts                          # Next.js 설정 파일
```

---

## 3. 핵심 컴포넌트 및 페이지 상세

### 3.1 메인 포털 (`src/app/page.tsx`)
- **GNB 헤더**: 브랜드 로고, 회사소개/솔루션 포트폴리오/병원검색/케어가이드/힐링라운지 앵커 및 라우트 연결
- **Hero & 퀵 칩**: 유진AI 생태계 슬로건 및 4대 솔루션 원클릭 진입 칩
- **회사 소개 (`CompanyIntro.tsx`)**: 유진AI 비전, 실용적 AI, 데이터 신뢰성, 고성능 UX 3대 가치
- **솔루션 쇼케이스 (`SolutionCard.tsx`)**:
  - Calamus Care, My Re Design, 온안부, Lua Visibility 카드 뷰
  - 핵심 기능 3종, 기술 스택, 상세 소개 링크 및 외부 서비스 바로가기 링크
- **솔루션 비교 요약표**: 4개 솔루션의 타깃, 핵심 기술, 가치 비교
- **전국 의료기관 & 요양시설 실시간 탐색 (`FacilityMapSearch.tsx`)**: 메인 검색기 임베드

### 3.2 솔루션 상세 소개 페이지 (`src/app/solutions/`)
- `/solutions/my-re-design`: PWA 라이프스타일 루틴 트래킹, AI 피드백 스펙 소개 및 바로가기
- `/solutions/onanbu`: 시니어 케어, 정기 안부 알림, 실버 친화 UI 스펙 소개 및 바로가기
- `/solutions/lua-visibility`: 실시간 KPI, 엣지 렌더링, BI 대시보드 스펙 소개 및 바로가기

### 3.3 전국 병의원 탐색기 (`src/components/care/FacilityMapSearch.tsx`)
- **5대 추천 병원(광고 슬롯)**: 지역명 배제, 클릭 즉시 단일 병원 검색 지원
- **카테고리 탭**: 상급종합, 한방, 요양, 일반병원/의원(의원 3.7만건 포함), 호스피스
- **다중 LIKE 검색**: 병원명, 주소, 지역명, 진료과목, 의료장비(인공신장, 초음파, CT 등), 특화진료(추나, 혈액투석 등)
- **무한 스크롤 & 더보기**: 1,200여 곳 이상 결과 조회 시 40건 단위 누적 로드

---

## 4. 데이터베이스 및 백엔드 API 명세

### 4.1 Supabase 테이블
- **`hosapi_hospital`**: 전국 7.9만 개 병의원 기본 정보 (종별, 전문의수, 의사수, 위경도, PostGIS geom, search_keywords)
- **`hosapi_hospital_detail`**: 12종 상세 정보 (병상수, 진료과목 JSONB, 장비 JSONB, 특수진료 JSONB, 진료시간 JSONB, 간호등급)

### 4.2 주요 API 라우트
- `GET /api/facilities`: 병의원 목록 비동기 조회 (카테고리, 지역, 등급, 다중 토큰 LIKE 검색, pageNo, pageSize)
- `GET /api/facilities/detail?ykiho=...`: 병의원 12종 종합 상세 스펙 조회

---

## 5. 빌드 및 배포 환경
- **개발 환경 실행**: `npm run dev`
- **프로덕션 빌드**: `npm run build`
- **배포 타깃**: Cloudflare Pages (Edge Runtime 호환)
- **Git 원격 저장소**: `https://github.com/changwoojung7-sys/calamus-portal.git` (Branch: `main`)
