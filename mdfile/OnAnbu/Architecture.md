# OnAnbu 시스템 아키텍처

> 최종 현행화: 2026-10-01
>
> 이 문서는 온안부 B2C 병원찾기, AI 정밀검색, 기관회원 B2B, 시스템 관리자 기능의 현재 실행 경계를 설명한다.

## 1. 전체 구성

```text
Cloudflare Pages · React/Vite
  ├─ 기본 병원검색/지도/상세카드
  ├─ AI 정밀검색/마지막 결과/모두의 AI 질문
  ├─ 기관회원 B2B 대시보드
  └─ 시스템 관리자 화면
       │
       ├─ Supabase Auth
       ├─ PostgREST + SECURITY DEFINER RPC + RLS
       └─ Supabase Edge Functions
            └─ ai-care-search
                 ├─ PII 마스킹·Intent 해석·사용량 제한
                 ├─ 관리자 AI 엔진 설정 조회
                 ├─ ChatGPT / Gemini / Perplexity 병렬 발견
                 ├─ 온안부 HIRA 마스터 병원명 매칭
                 ├─ 기관회원 입력 정보 사후 결합
                 └─ 원문·통합 순위·병원별 근거 저장
                      │
                      ├─ OpenAI Responses API
                      ├─ Gemini GenerateContent + Google Search
                      └─ Perplexity Sonar
```

### 병원 홈페이지 수집 경로 (2026-10-16 현행)

```text
① 웹 크롤러 화면 → 127.0.0.1:8008 crawler_server   ② 야간 배치(서울·경기 병원급/의원급, 지역 ZIP, 최근 1일 건너뜀)
        └──────────────── hospital_crawler.py (병원당 180초 제한) ────────────────┘
   발굴 홈페이지: 접속 + 기관명 + 대표전화 확인 → save_hospital_crawl_result
        ├─ 자동 확정(AUTO_VERIFIED) → official_website_registry · hosapi_hospital.url · 프로필 · 변경 이력
        ├─ hospital_crawl_claims(PENDING) → AI 검토 기록 → 관리자 승인 → verified_crawl_tags(180일)
        │      └─ 트리거 → hosapi_hospital.specialty_fields(진료분야) 재계산 (+ 매일 03:40 전체)
        └─ 건너뜀·실패 → hospital_crawl_misses (홈페이지 없음 반복 기관은 --skip-no-homepage 로 제외 가능)
```

(참고) 2026-10-01 구조:

```text
① 웹 크롤러 화면(관리자 브라우저)
   └─ localhost:8008 crawler_server(EXE/파이썬) → 홈페이지 수집 → 결과를 웹이 관리자 세션으로 저장
② 야간 배치(run_crawl.bat → AnOnDoc_Crawler_Server.exe --cli)
   └─ 개발 PC: .env 서비스 키 / 다른 PC: 최고관리자 로그인(공개 접속 정보만 내장, DPAPI 로그인 유지)
        → save_hospital_crawl_result RPC
             ├─ hospital_provider_profiles (홈페이지·예약번호·crawled_tags·근거)
             └─ hospital_crawl_claims (태그별 검토 대기열 PENDING)
③ 관리자 검토(병원별 일괄 승인·거절·승인 취소) → verified_crawl_tags (180일 만료)
   └─ 일반검색(themeSearchRules)·AI 검색(clinicalFilters)의 근거로만 사용 (미검증 crawled_tags는 사용 안 함)
```

## 2. 시스템 경계

### B2C 온안부

- 기본검색은 HIRA `hosapi_hospital`과 상세 테이블을 직접 검색하며 기존 지역·종별·특수필터·거리·페이지네이션을 유지한다.
- AI 정밀검색은 기본검색 쿼리를 변경하지 않는 별도 경로다. 사용자의 자연어 질문을 AI 제품에 전달해 병원을 발견하고, 온안부 DB에 존재하는 병원만 결과에 남긴다.
- 검색 결과에는 HIRA 기본정보와 승인 기관회원이 입력한 소개·특화진료·장비·식사 등 콘텐츠를 결합한다. 출처가 다른 정보는 동일한 HIRA 사실처럼 표시하지 않는다.

### B2B LUVIS·기관회원

- 승인된 기관회원은 자기 병원 프로필, 공식 홈페이지, LUVIS 진단과 AI 언급 통계를 이용한다.
- 지역 통계는 소속 기관 주소를 기본값으로 사용하지만 다른 시·도/시·군·구도 조회할 수 있다.
- `우리 기관 언급 통계`와 `지역 전체 통계`는 같은 검색 원장을 사용하되 집계 범위를 분리한다.
- B2C 환자 개인 조건과 B2B 진단 데이터는 결합하지 않는다. 두 영역의 시설 연결키는 HIRA `ykiho`다.

### 시스템 관리자

- 전체 지역 통계, 벤치마크 배치, AI 엔진 설정을 관리한다.
- ChatGPT·Gemini·Perplexity의 활성 여부, 호출 모델, 공급자별 시스템 프롬프트를 설정한다.
- AI 답변 원문과 토큰 사용량은 관리자 전용 RPC로만 조회한다.

## 3. 기본검색과 AI 정밀검색 분리

| 구분 | 기본 병원검색 | AI 정밀검색 |
| --- | --- | --- |
| 시작점 | 화면의 지역·기관·특수필터 | 자연어 질문 원문 |
| 후보 생성 | HIRA SQL/RPC | 각 AI 제품의 최대 Top 5 |
| DB 검증 | 조회 단계에서 HIRA 사용 | AI 응답 후 병원명으로 HIRA 마스터 대조 |
| 순위 | 기존 광고/거리/기본검색 기준 | AI별 원순위 평균 → 추천 제품 수 → `ykiho` |
| 기관 콘텐츠 | 상세카드에 결합 | DB 매칭 후 추천 근거·상세카드에 결합 |
| 저장 | 검색 상태·선택 병원 | 질문, 공급자 원문, 매칭 결과, 통합 순위, 병원별 근거 |

AI 결과는 기본검색 필터로 다시 제거하거나 광고 순서로 재정렬하지 않는다. 광고와 기관가입은 검색 결과에 부가정보를 풍부하게 하는 요소이지 AI 원순위를 직접 올리는 점수가 아니다.

## 4. AI 제어면과 실행면

### 제어면

- `system_config.ai_search_engines`가 공급자별 `enabled`, `model`, `prompt`를 저장한다.
- 관리자 UI는 `get_admin_ai_engine_settings`, `save_admin_ai_engine_settings`만 사용한다.
- API 키는 같은 설정 JSON에 포함하지 않는다. 키는 Edge Secret 또는 서버 전용 키 RPC로 분리한다.
- 세 엔진을 모두 끄는 설정은 DB에서 거부한다.

### 실행면

- `ai-care-search`의 서비스 역할만 `get_ai_engine_settings`를 실행할 수 있다.
- 활성 엔진만 키를 조회하고 호출한다.
- 모델·프롬프트·활성 엔진 목록은 캐시 fingerprint에 포함하므로 설정 변경 뒤 이전 응답을 잘못 재사용하지 않는다.
- 현재 기본값은 ChatGPT `gpt-5.6-luna`, Gemini `gemini-3.8-flash`, Perplexity `sonar`다.

## 5. AI 데이터 흐름

```text
질문 원문
 → 요청/Origin/사용량 검사
 → PII 마스킹
 → 지역·필수조건 Intent 해석
 → search_logs 생성
 → 활성 AI 엔진 병렬 호출
 → 공급자별 전체 원문 선저장
 → JSON 응답 파싱
 → 병원명 정규화 및 hosapi_hospital 대조
 → HIRA 기본정보 + 승인 기관 프로필 결합
 → 공급자별 검증 결과와 evidence 저장
 → 평균 원순위 기반 통합 Top 5 생성
 → 화면 요약·상세 리포트·지역 통계 제공
```

현재 DB 매칭은 병원명 정규화 유사 일치를 우선한다. 주소·전화·지역은 동명이원 정밀 검증을 위한 후속 고도화 지점으로 코드와 주석을 보존한다. 어떤 경우에도 HIRA 마스터에 없는 병원은 최종 화면에 표시하지 않는다.

## 6. 조회 권한 흐름

| 데이터 | 비로그인 | 개인회원 | 승인 기관회원 | 관리자 |
| --- | ---: | ---: | ---: | ---: |
| 마스킹된 전체 질문 목록·통합 추천 | 가능 | 가능 | 가능 | 가능 |
| 내 질문 필터 | 불가 | 본인 질문 | 본인 질문 | 본인 질문 |
| AI 추천 이유 상세 리포트 | 불가 | 자기 질문 | 전체 공개 질문 | 전체 공개 질문 |
| 공급자별 AI 답변 원문·토큰 | 불가 | 불가 | 불가 | 가능 |
| 지역 AI 통계 | 불가 | 불가 | 승인 기관회원 범위 | 전체 |
| AI 엔진/프롬프트 설정 | 불가 | 불가 | 불가 | 가능 |

공개 질문·요약은 `mask_public_ai_query`를 거친다. 작성자 UUID·이메일·전화번호와 공급자 원문은 공개 질문 RPC에 포함하지 않는다.

## 7. 지역 통계 아키텍처

- 원장: `search_logs`, 추천 노출: `ai_recommendation_evidences`, 병원 선택: `search_logs.selected_ykiho`, 후기: `hospital_reviews`.
- 기본 기간은 최근 30일, 기본 소스는 `USER`다. 벤치마크는 `BENCHMARK`로 분리한다.
- 기관 범위는 선택 지역의 전체 검색 중 해당 기관이 유효 추천된 검색을 집계한다.
- 지역 범위는 선택 지역의 전체 검색과 추천 발생 검색을 집계한다.
- HIRA 축약 지역명과 검색 로그 표준명 차이를 SQL에서 정규화한다. 예: `경기 ↔ 경기도`, `용인기흥구 ↔ 용인시 기흥구`.

## 7-1. 검색·지역 공용 규칙 (2026-10-01)

- 테마: `src/data/transfer_theme_catalog.json`(단일 기준) → 화면·대시보드·DB 허용목록(`transfer_theme_catalog`, 생성 스크립트) 공유.
- 특화 근거: `supabase/functions/_shared/clinicalFilters.ts`를 일반검색(`themeSearchRules.ts`)과 AI 검색(`candidateRepository.ts`)이 함께 사용.
- 지역: `get_hira_sggu_list` RPC(심평원 DB 기준 목록) + `sgguMatch.ts`(조회 규칙)를 크롤러·메인·상급병원 검색이 공유.
- 결과 안정성: 정렬 고정(의사 수 + 요양기호), 근거 필터 검색은 최대 2,000곳 전체 확인 후 초과분은 검색 중심에서 가까운 곳 우선.

## 8. 배포 경계

- 프런트엔드: GitHub `main` push → Cloudflare Pages 자동 빌드.
- DB: `supabase/migrations`의 버전 마이그레이션을 운영 프로젝트에 적용한다.
- Edge Function: `ai-care-search`는 공용 `_shared` 모듈을 포함하도록 Supabase CLI(`--use-api`)로 배포한다. `scripts/deploy_edge_function.cjs`는 함수 폴더 밖 import가 있으면 배포를 거부한다.
- 비밀값: `.env`는 로컬 전용이며 Git에서 제외한다. 운영 공급자 키와 서비스 역할 키는 Supabase 서버 경계 안에 둔다.
- 이번 반영: migration `202609180001`·`202609290001`·`202610010001`~`007`·`202610020001`, `ai-care-search` 운영 version 38.
- 크롤러 배포물: `public/downloads/AnOnDoc_Crawler_Server.exe`(공개 접속 정보·키워드 카탈로그 내장, 서비스 키 없음), `AnOnDoc_Crawler_Setup.exe`, 실행기 `run_crawler_server.bat`·`run_crawl.bat`(ASCII·CRLF).
- 운영 상세 절차: `supabase/DEPLOYMENT_CHECKLIST.md`.
