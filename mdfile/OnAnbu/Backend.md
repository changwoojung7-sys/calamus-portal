# OnAnbu 백엔드·서비스 레이어 현행 명세

> 최종 현행화: 2026-10-01

## 2026-10-01 핵심 변경

- `ai-care-search`(운영 version 38): `OBGYN` 종별과 `OBGYN`·`MENTAL_ADULT`·`MENTAL_CHILD`·`TRAFFIC_ACCIDENT` 활성 필터를 후보 서버 검증에 포함. 암·교통사고 조건은 그 칩 하나만 골랐을 때 근거 보유 기관을 먼저 후보로 잡는다(의사 수 상위 120곳만 보면 누락). 근거 기관은 100곳씩 나눠 검색 지역 안에서 고른다(전국 앞 150곳 자르기 제거). 화면 특화 필터 칩은 OR: 고른 칩 중 하나라도 맞으면 후보(`chipMatches`, 2026-10-03). 기관 입력 태그 + 관리자 승인 크롤링 태그(`verified_crawl_tags`)를 근거로 사용.
- 공용 근거 규칙 `supabase/functions/_shared/clinicalFilters.ts`: `CANCER_EVIDENCE_PATTERN`, `TRAFFIC_ACCIDENT_EVIDENCE_PATTERN`, 척추·관절은 종별 자동 인정 없이 진료과목·특수진료 근거 필요(`(?<!가)정형` — '가정형 호스피스' 오매칭 방지), 한방은 92·93.
- 입원상담 접수 `create_admission_consult_request`는 테마별 허용목록(`transfer_theme_catalog`)으로 처치·연령·상태·상담 목적을 검증하고 테마·목적을 같은 트랜잭션에서 저장한다.
- 크롤러는 운영 DB만 기준으로 저장(로컬 사본 폐기), 수집 태그는 검토 대기열로 적재, 다른 PC는 최고관리자 로그인 권한으로 저장한다(11장).
- `ai-care-search`는 `../_shared`를 import하므로 `npx supabase functions deploy ai-care-search --project-ref <ref> --use-api`로 배포한다(`deploy_edge_function.cjs`는 이런 함수를 거부).

## 1. 프런트 서비스 모듈

| 모듈 | 책임 |
| --- | --- |
| `api.ts` | Supabase Auth, 프로필·기관·후기·전원·비용 RPC 파사드, **127개 호스피스 완화의료 시드 합성** 및 가입 동의 저장 |
| `hiraSearchService.ts` | 기본 HIRA 검색, 지역/거리/기관유형/특수필터, 기준병원 주변 조회. 정렬 고정(의사 수 + 요양기호), 근거 필터 검색은 1,000곳씩 최대 2,000곳 전체 확인·초과 시 검색 중심 반경 확장, 암·교통사고·산부인과·소아 근거 후보 사전조회(그 칩 하나만 골랐을 때만 `narrowBy`, 많으면 `narrowEvidenceToRegion`으로 검색 시군구 안에서 고름), 상세정보 4묶음 동시 조회, 시간 초과 1회 재시도, 검색어 '교통사고' → 근거 검색 전환 |
| `themeSearchRules.ts` | 테마 프리셋(필수·선호 근거), 특화 필터 판정 `matchesSpecialFilter`/`evaluateThemeMatch`, 입원병상 판정 `hasInpatientBeds`, 완화 검색 `THEME_RELAXED_SEARCH`, 카드 근거 설명 `explainSpecialFilters`, 후보 상한 `EVIDENCE_FILTER_CANDIDATE_LIMIT`(2,000) |
| `regionService.ts` / `sgguMatch.ts` | 심평원 DB 기준 시·군·구 목록(`get_hira_sggu_list`, 실패 시 고정 목록) 훅·묶음, 지역 조회 규칙(화면 이름·DB 이름·시 전체 → 신설 구 포함) |
| `crawlClaimService.ts` | 크롤링 주장 대기열 조회·일괄 승인/거절·승인 취소, 병원별 묶음 훅 |
| `src/data/transferThemes.ts` | 7대 테마 카탈로그 접근(`getTransferTheme`, `resolveConsultTheme`, `getConsultThemeMeta`) |
| `aiCareSearchClient.ts` | AI Edge Function 호출, 응답 타입, 상세 추천 리포트와 관리자 원문 RPC 호출 |
| `aiGroundingService.ts` | 프런트 결과의 HIRA 재대조 보조 |
| `b2bDashboardService.ts` | 승인 기관 범위의 B2B 지표 호출 |
| `luvisDiagnosticService.ts` | LUVIS 감사·점수 조회 모델 |
| `routerService.ts` | URL 상태·딥링크·뒤로가기 처리 |

## 2. Edge Functions

| 함수 | 역할 | 실행 권한 |
| --- | --- | --- |
| `ai-care-search` | PII 마스킹, Intent, 다중 AI 발견, HIRA 이름 매칭, 기관정보 결합, 원문·순위·근거 저장 | Origin·사용량·JWT/세션 검사, 비밀키 서버 보관 |
| `ai-benchmark-step` | 관리자가 만든 벤치마크 실행의 질문 1건 처리. `ACTIVE_ENGINES` 모드는 `discoverySearch`(실제 AI 검색과 동일, 켜진 엔진 동시 호출)를 `BENCHMARK`로 저장 | 관리자 배치 흐름 (`node scripts/run_ai_benchmark.cjs --split-by-district`로 스크립트 실행 가능) |
| `ai-consensus-batch` | 권역/질환 템플릿 사전 합의 캐시 | 관리자 또는 배치 시크릿 |
| `official-website-trust-batch` | 공식 홈페이지 검증·Trust 감사·작업 이력 | 관리자 JWT 또는 배치 시크릿 |
| `naver-auth` | 네이버 OAuth code 교환과 Supabase token hash 발급 | 유효 anon/user JWT + 서버 Naver secret |
| `notify-dispatch` | `notification_events` 미발송 알림을 웹 푸시(VAPID, 무료)로 보내고, 푸시를 못 받은 사람에게만 이메일(Resend, 키 설정 시) 발송. `luvis_marketing_leads`를 `LUVIS_LEAD_WEBHOOK_URL`로 전달(설정 시) | `--no-verify-jwt` 배포, DB 트리거(pg_net)·5분 재시도(pg_cron)가 `x-dispatch-secret` 헤더로 호출. 비밀값은 `node scripts/setup_notification_secrets.cjs`로 설정 |

## 3. `ai-care-search` 내부 모듈

| 파일 | 책임 |
| --- | --- |
| `index.ts` | CORS/Origin, 요청 유효성, 세션·키·기능 플래그, 응답 조립 |
| `piiMasker.ts` | 전화·이메일 등 질문 내 식별정보 제거 |
| `llmGateway.ts` | 검색 Intent 구조화와 기존 규칙 추천 경로 |
| `discoveryGateway.ts` | 관리자 설정을 적용한 ChatGPT/Gemini/Perplexity 호출과 원문 수집 |
| `discoverySearch.ts` | 발견형 검색 전체 오케스트레이션, 캐시, DB 매칭, evidence, 통합 순위 |
| `discoveryRules.ts` | 질문 카테고리 해석, JSON 파싱, 병원명 후보 선택 |
| `candidateRepository.ts` | HIRA 상세와 승인 기관 프로필·특화항목·장비·식사 결합 |
| `cacheRepository.ts` | 검증 캐시 조회·저장 |
| `groundedRanker.ts` | 이전 후보 기반 규칙 점수/재정렬 경로 |
| `types.ts` | Edge 요청·Intent·CandidateFact·RankedResult 계약 |

## 4. 현행 AI 호출 계약

```text
마스킹된 사용자 질문 문구 그대로
 + 관리자 공급자별 프롬프트
 + 고정 JSON 출력 계약
 + 지역 참고정보
 → 활성 AI 제품별 최대 5개 병원과 2~3문장 이유
```

- 질문을 Intent JSON으로 치환하지 않는다. Intent는 서버 검색·저장용 보조 데이터다.
- 사전 HIRA 후보 20곳은 AI에 전달하지 않는다. ChatGPT, Gemini, Perplexity가 각자 병원을 발견한다.
- 출력 계약은 `answer`, `recommendations[].name/address/telephone/rank/reason`이다.
- 관리자는 공급자별 프롬프트를 바꿀 수 있지만 JSON 구조, 최대 5곳, 금지사항 같은 서버 출력 계약은 별도로 덧붙인다.
- 현재 출력 상한은 공급자별 5,000토큰, 호출 제한시간은 55초다.
- Gemini는 설정 모델 실패 시 현행 모델 `gemini-3.8-flash`로 한 번 더 시도한다(2.0·1.5 계열은 Google에서 종료).
- 공급자 오류·잘린 JSON·파싱 실패도 원본 응답과 오류 상태를 저장하며 정상 추천으로 간주하지 않는다.

## 5. AI 엔진 설정 처리

1. Edge Function 서비스 역할이 `get_ai_engine_settings()`를 호출한다.
2. 저장 설정을 코드 기본값과 병합한다.
3. `enabled=false`인 공급자는 키 조회·API 호출·통합 순위에서 제외한다.
4. 모델과 프롬프트를 공급자 요청에 적용한다.
5. 활성 공급자·모델·프롬프트·질문·지역·필수조건을 캐시 키에 포함한다.
6. 세 엔진이 모두 비활성화된 경우 요청을 실패시키며 관리자 설정 확인을 안내한다.

기본 설정은 다음과 같다.

| 제품 | 공급자 코드 | 모델 | 검색 방식 |
| --- | --- | --- | --- |
| ChatGPT | `OPENAI` | `gpt-5.6-luna` | Responses API + web search tool |
| Gemini | `GEMINI` | `gemini-3.8-flash` | GenerateContent + Google Search grounding |
| Perplexity | `PERPLEXITY` | `sonar` | Sonar 웹 검색 |

## 6. 병원 매칭과 결과 결합

1. AI 응답의 병원명을 공백·문장부호 없이 정규화한다.
2. `match_ai_discovered_hospital`에서 HIRA 병원명 완전/부분 유사 일치를 조회한다.
3. 정확명이 우선이며 지역 일치와 이름 길이 차이, 의사 수를 보조 정렬에 사용한다.
4. **팩트 그라운딩 문지기 필터 (환각·유령 병원 배제)**:
   - 검색 질문에서 도출된 지역(시·도, 시·군·구)과의 일치 여부를 철저히 검증한다.
   - 대표 유선전화번호(`telephone`)가 존재하지 않는 병원은 허위·폐업·가상 데이터로 간주하여 추천 후보에서 배제한다.
5. `fetchGroundedCandidates(..., matchedYkihos)`가 HIRA 기본정보와 승인 기관 프로필을 결합한다. 발견형 경로에서는 투석·재활 등 상세 데이터 미충족을 이유로 이름 매칭 병원을 다시 제거하지 않는다.
6. HIRA 마스터에 없는 병원은 `unmatched_hospitals`에 제외 사유를 남기고 화면에 노출하지 않는다.

## 7. 순위와 저장 계약

- 공급자별 `aiRank`는 AI 원순위를 보존한다.
- 통합 순위는 평균 원순위 오름차순, 추천 제품 수 내림차순, `ykiho` 순으로 결정한다.
- 같은 병원이 여러 AI에 추천돼도 화면 통합 순위는 한 번만 표시하며 카드 안에 AI별 순위와 이유를 넣는다.
- 광고비·회원가입 자체·후기·LUVIS 점수는 AI 통합 순위를 올리지 않는다.
- `ai_response_logs`에는 공급자 원문과 파싱/매칭 결과, `ai_recommendation_evidences`에는 병원별 AI 원순위와 이유를 저장한다.
- `final_ranked_results`와 `final_summary_text`는 검색 1건의 통합 Top 5와 화면 요약이다.

## 8. 조회·통계 RPC 계약

| RPC | 계약 |
| --- | --- |
| `get_public_ai_search_explorer` | PII 마스킹된 전체/내 질문, 병원 통합 순위, AI별 세부 이유 반환 |
| `get_my_ai_consensus_report` | 개인은 본인 질문, 승인 기관회원과 관리자는 전체 공개 질문의 상세 근거 반환 |
| `get_admin_ai_response_originals` | 관리자에게만 공급자별 원문·모델·토큰 반환 |
| `get_regional_ai_dashboard` | 최근 30일 USER/BENCHMARK, FACILITY/REGION 범위 집계 |
| `get_admin_ai_engine_settings` | 관리자용 엔진 설정 조회 |
| `save_admin_ai_engine_settings` | 관리자 설정 검증·저장, 최소 한 엔진 활성화 강제 |
| `get_ai_engine_settings` | Edge 서비스 역할 전용 실행 설정 조회 |

## 9. 전원 상담 계약

> 2026-10-15 기관 구분/진료분야 분리는 **검색 화면에만** 적용된다. 입원·전원 상담 접수(`transferTheme`, `transfer_theme_catalog`, 상담 RPC)와 상급병원 퇴원연계 화면의 병원 유형(재활병원·산부인과 포함)은 바뀌지 않았다.

- `create_transfer_consult_request`는 선택 병원 2~3곳, 보호자 연락처, 상담 양식과 전달 동의를 서버에서 검증한다.
- 승인 기관회원은 자기 기관 대상 요청만 조회하고 상태·답변을 변경할 수 있다.
- 개인회원은 본인 의뢰의 병원별 상태·답변만 조회한다.
- 상담 연락처·건강 요약은 외부 LLM 입력으로 사용하지 않는다.

## 10. 호스피스 완화의료 데이터 파이프라인

- **시드 데이터 (`src/data/hospice_services.json`)**: 보건복지부 지정 127개 호스피스 전문기관의 3대 서비스(입원형, 가정형, 자문형), 인가병상수, 간병보조인력 운영 여부, 지정일자, 대상질환 데이터를 심평원 `ykiho` 기준 시드로 내장.
- **DB 우선 합성 파이프라인 (`src/services/api.ts`)**:
  - `fetchHospitalProfile` 및 `fetchMultipleHospitalProfiles` 호출 시 Supabase DB `hospital_provider_profiles`를 우선 조회.
  - 기관회원이 직접 수정·저장한 값이 있으면 DB 값을 우선 적용하고, DB에 커스텀 값이 없으면 127개 보건복지부 공식 시드 데이터를 폴백으로 즉시 매핑.
- **RPC 저장 계약**:
  - `save_hospital_provider_profile` RPC 함수에 8개 호스피스 필드(`p_hospice_has_inpatient`, `p_hospice_has_home_care`, `p_hospice_has_consulting`, `p_hospice_bed_count`, `p_hospice_has_aide`, `p_hospice_designation_date`, `p_hospice_target_diseases`, `p_hospice_has_pediatric`)를 확장하여 기관회원이 수정한 값이 안전하게 영구 저장됨.

## 11. 병원 홈페이지 크롤러

| 구성 | 책임 |
| --- | --- |
| `scripts/hospital_crawler.py` | 대상 조회(심평원, 1,000곳씩 최대 30,000곳·요양기호 순·여러 구·군 `in.`), 홈페이지·블로그 발굴, 키워드 수집, `save_hospital_crawl_result` 저장, 수집 기록 md. 발굴 홈페이지(검색·블로그 링크 모두)는 접속 + 병원명 + 심평원 대표전화 동시 일치만 후보로 쓰고 `homepage_candidate_verified=NAME_PHONE`을 붙여 DB가 자동 확정(병원 찾기 포털 제목·차단 도메인 제외). 병원당 시간 제한 180초, 건너뜀·실패를 `admin_record_crawl_miss`로 기록. CLI: `--sido --sggu --categories --limit --skip-recent-days --skip-no-homepage --no-discover --login --logout`, 한글 인자는 `hex:` |
| `scripts/hospital_keywords.py` + `src/data/hospital_keyword_catalog.json` | 태그 키워드 규칙. 민감 태그 필드: `strict`, `allowedCategoryCodes`/`excludeCategoryCodes`, `contextKeywords`+`contextPattern`, `requireSupportKeywords`, `excludeSentencePattern`, `preferContextPattern` |
| `scripts/crawler_auth.py` | 다른 PC 야간 배치용 최고관리자 로그인(비밀번호 입력 숨김), 토큰 자동 갱신, 로그인 유지(Windows DPAPI, `%LOCALAPPDATA%\AnOnDocCrawler\admin_session.bin`) |
| `scripts/crawler_server.py` | 웹 크롤러 화면 연동 로컬 서버(127.0.0.1:8008 + [::1]:8008, 관리자 JWT 검증, 독점 포트 바인딩, 사설망 접근 허용 헤더), `--cli` 야간 배치 모드(입력 불가 창에서 로그인 필요 시 안내 후 종료) |
| `scripts/build_crawler_server.py` | 독립 EXE 빌드(카탈로그·공개 접속 정보만 내장, 서비스 키 혼입 시 빌드 중단), 실행기 배치(ASCII·CRLF) 게시 |
| `scripts/recheck_sensitive_claims.py` | 수집 규칙 변경 후 대기 태그 재판정(미리보기 / `--apply`) |
| `scripts/build_regional_crawl_batches.py` | 지역별 배치·ZIP 생성(서울·경기 제외 병원급 + 시·도별 의원급, `--skip-recent-days 1`) |
| `scripts/review_agents/*` | AI 검토 에이전트 도구: 키워드·홈페이지 후보 내보내기, 홈페이지 신호 수집(`fetch_homepages.py`), 규칙 선판정, 판정 기록. 기준 `KEYWORD_RUBRIC.md`·`HOMEPAGE_RUBRIC.md`. 판정은 기록만 하고 승인·거절은 관리자가 반영 |

저장 권한: 개발 PC는 `.env`의 서비스 키, 다른 PC는 최고관리자 로그인 JWT, 웹 크롤러 화면은 브라우저 관리자 세션으로 저장한다. 수집 결과는 운영 DB가 기준이며 로컬 사본은 쓰지 않는다.

운영 절차(배치 종류·건너뛰기·자동 확정·건너뜀 기록·수집 단계 거절 규칙)는 `병원홈페이지 크롤링계획_EXE Plan.md`의 '2026-10-16 현행 운영 구조'를 따른다.

### 11-1. 기관 구분 · 진료분야 검색 (2026-10-15)

- **기관 구분** = 심평원 종별(`category_code`). 검색 값: `CARE`(28) · `LARGE_HOSPITAL`(01·11) · `HOSPITAL`(21) · `MEDICAL_CLINIC`(31) · `ORIENTAL_HOSPITAL`(92) · `ORIENTAL_CLINIC`(93) · `HOSPICE`(복지부 지정) · `PSYCHIATRIC`(29) · `DENTAL_HOSPITAL`(41) · `DENTAL_CLINIC`(51) · `MIDWIFERY`(61) · `PUBLIC_HEALTH`. 예전 묶음 값(`CLINIC`·`ORIENTAL`·`DENTAL`)과 `REHAB`·`OBGYN`도 계속 받는다(`normalizeSearchSelection`이 종별 + 진료분야로 변환).
- **진료분야** = `hosapi_hospital.specialty_fields`(DB가 미리 계산). `hiraSearchService`가 `specialties` 인자로 `overlaps`(OR) 조회하고, 기관 구분과는 AND.
- `ai-care-search` Edge Function은 공용 `clinicalFilters.ts`(암 근거 패턴에 '암온열' 추가)를 함께 배포한다.

## 12. 배포·검증 명령

- 프런트 빌드: `npm run build`
- 비밀정보 검사: `npm run security:secrets`
- RLS 검사: `npm run security:rls`
- AI 회귀검사: `npm run test:ai-consensus`
- 호스피스 데이터 무결성·DB 영구저장 검사: `node scripts/test_hospice_services.cjs`
- 지역·유선전화 매칭 필터링 검사: `node scripts/test_discovery_filtering.cjs`
- 테마·검색·상담·크롤링 회귀검사: `npm run test:themes` (운영 함수 그대로: `npm run test:themes:live`)
- 민감 수집 키워드 검사: `npm run test:sensitive-keywords`
- Edge 단위 테스트: `npm run test:edge`
- Edge 배포: `ai-care-search`는 `npx supabase functions deploy ai-care-search --project-ref <ref> --use-api`(공용 `_shared` 포함 번들). 공용 import가 없는 함수만 `node scripts/deploy_edge_function.cjs <함수명>`
- DB 마이그레이션: `node scripts/apply_migration.cjs <파일...> [--dry-run]`
- 크롤러 EXE: `python scripts/build_crawler_server.py` → `public/downloads/AnOnDoc_Crawler_Server.exe`(배치 파일 3종과 지역 배치 ZIP도 이어서 재생성), 설치본 `python scripts/build_crawler_agent_installer.py` 후 `scripts/dist/AnOnDoc_Crawler_Setup.exe`를 `public/downloads`에 복사
  - 키워드 카탈로그를 고치면 반드시 재빌드한다(EXE에 카탈로그 내장). 내장 확인: `PyInstaller.archive.readers.CArchiveReader`로 `src\data\hospital_keyword_catalog.json`을 꺼내 태그 수 비교.
  - `main` 푸시 시 GitHub Actions(`release-crawler-agent.yml`)가 `crawler-agent-latest` 릴리스를 빌드한다(공개 접속 정보 없이 빌드, 한글 출력 때문에 `PYTHONUTF8=1` 필요).
- 필터 설정표: `npm run test:search-filters` → `searchFilterCatalog.ts`가 참조하는 수집 태그 존재·노출 규칙·AND 판정 검사
- 로컬에 Deno가 없으면 `npx -y deno check --config supabase/functions/deno.json supabase/functions/*/index.ts`로 CI `check:edge`를 그대로 돌릴 수 있다(실행 후 `deno.lock` 변경은 되돌린다).
- 크롤러 배포물: `npm run test:crawler-dist` → 공개/빌드 EXE·설치본 해시, 배치 ASCII·CRLF, CLI 한글 도움말 확인

`deploy_edge_function.cjs`는 함수 폴더 안의 모듈만 전송하므로, 함수 폴더 밖(`../_shared`)을 import하면 배포를 거부하고 CLI 명령을 안내한다.
