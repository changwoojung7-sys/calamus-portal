# OnAnbu 데이터베이스 구성 명세

> 기준: `supabase/schema.sql` 및 `supabase/migrations` (현행화 2026-10-17)
>
> 소스 저장소에 정의된 Supabase/PostgreSQL 구조를 기능 중심으로 정리한 문서입니다. 실제 운영 반영 여부는 Supabase migration 적용 이력으로 최종 확인합니다.

## 1. 전체 구조

### 2026-10-19 장기요양기관 전화번호 (기존 컬럼만 사용)

- 전화번호는 사용자 요청에 따라 `ltc_institutions.verified_phone`에 공단 API 값을 직접 보완한다. 신규 테이블·컬럼·인덱스는 만들지 않는다. `verified_website`와 향후 평가 항목은 이번 작업에서 변경하지 않는다.
- `verified_phone`에는 공단 제공 번호가 포함되므로 관리자 통화 확인·현재 운영 확인을 의미하지 않는다. 기존에 채워진 번호는 보존하고 빈 값만 채운다. 기관 전체 `verified_at`도 갱신하지 않는다.
- 일반현황 상세조회는 기관기호+유형코드로 호출한다. 대표 서비스 유형 1개에서 기관명·지역까지 대조한다. 다른 유형의 별도 번호까지 모두 확인하는 작업은 아니다. 요청 유형·조회일·결과·호출 수는 `scratch/ltc-phone` 로컬 체크포인트에만 보관한다. API 원문·키·반복 이력은 DB에 적재하지 않는다.
- 2026-10-19 작업 전 실측: 마스터 30,595곳, 전화번호·홈페이지 입력 0곳, 마스터 약 25MiB(인덱스 포함), 전체 DB 약 320MiB. 이는 PostgreSQL 집계이며 Supabase 요금제 사용량 산정과 반드시 일치하는 것은 아니다. 소량 배치·용량 모니터링으로 진행한다.

### 2026-10-17 담당자 반경 검색 (운영 적용)

- `202610170007_coordinator_radius_search.sql`: `search_coordinator_candidates_near` 읽기 전용 RPC를 추가했다. 의뢰 소속기관 승인 권한을 확인한 뒤 지정 위경도와 반경(기본 10km)에서 실제 직선거리를 계산한다. 경계 박스로 먼저 좁히며 행정구역 필터는 적용하지 않는다.
- 기관 종별 OR·진료분야 OR·필수 조건 AND로 검색하고 폐업/출발병원/좌표 누락을 제외한다. 결과는 거리순 40곳과 전체 건수다. 익명 실행은 차단한다. 기존 지역 검색 RPC와 테이블·행 데이터는 변경하지 않는다.
- 화면의 지역 기준점·반경은 후보 탐색 설정이며 의뢰의 `coordinator_region` 또는 레거시 `radius_km` 값을 덮어쓰지 않는다. 운영 절차는 `전원담당자_업무공간_구현및운영.md` 참고.

### 2026-10-17 전원담당자·연락처 공개 선택 (운영 적용)

- `transfer_coordinator_memberships`를 추가했다. 인증 사용자별 소속 신청은 하나지만 기관별 담당자 수는 제한하지 않는다. 수신기관 소유권 표 `hospital_memberships`와 분리하고 소속·승인 상태로 업무 접근을 판단한다.
- 기존 `transfer_consult_requests`를 재사용한다. `coordinator_ykiho`, 관리번호, 검색지역, 필수/선호 조건, 현재 담당자, 단계·이력 및 개발 표시를 추가했다. 대상기관·답변·비용·대화 표를 복제하지 않는다.
- `transfer_consult_targets.contact_shared`는 기존 의뢰에 true를 보존한 뒤 신규 기본값을 false로 전환했다. 기관별 공개 변경은 `contact_visibility_history`에 기록한다. 이름·전화 원문은 의뢰에 보관하고 기관 조회·대화 응답에서 공개 상태에 따라 마스킹한다. 재전송으로 공개 상태가 바뀌지 않는다.
- 보호자 작성/기관 조회는 `create_admission_consult_request_private`·`get_transfer_inbox_private`를 사용한다. 이전 `get_my_transfer_consult_requests`에도 서버 마스킹을 적용하여 구형 API 우회를 막는다. 원본 표는 작성자 RLS를 유지하고 담당자 의뢰에는 승인 상태 제한을 추가했다.
- 담당자 문의는 `send_coordinator_case_private`에서 현재 담당자 권한을 확인하고 이전 전송 함수는 내부 재사용만 허용한다. 대화 조회는 본인/소속기관/해당 수신기관, 답변은 보호자 본인 또는 현재 담당자로 제한한다. 정지 계정 및 구형 보호자 조회·취소·테마 수정 우회를 차단한다.
- 알림 트리거는 보호자 `/my-consults`와 담당자 `/coordinator`로 분기한다. 추가 질문·회신은 현재 담당자에게, 인계 자체도 새 담당자에게 알린다. 기존 알림 허용 종류를 사용하며 본문에 민감 내용을 넣지 않는다. 개발 의뢰는 실제 전송을 차단한다.
- 적용 SQL: `202610160008` 및 `202610170001`~`202610170006`. 마지막 SQL은 새 동의 v2를 지원하면서 v1 이력·구버전 호환을 보존한다. 상세 RPC·운영 절차·검증은 `전원담당자_업무공간_구현및운영.md` 참고.

OnAnbu(온안부)는 Supabase를 네 영역으로 사용합니다.

1. **Supabase Auth**: 로그인 계정, 세션, OAuth, 이메일 인증
2. **HIRA 원천 데이터**: 심평원 요양기관 기호(`ykiho`) 기반 병원 사실 데이터
3. **온안부 서비스 데이터**: 회원, 기관회원, 상담, 리뷰, 비용 계산
4. **AI/LUVIS 데이터**: 자연어 검색, AI 답변·근거, 검증 캐시, 기관 가시성 진단

모든 AI 추천 병원은 HIRA 마스터의 유효한 `ykiho`와 대조한 뒤 노출합니다.

### 2026-10-16 장기요양기관 원천 구성·검증대기 적재 (운영 적용)

- `202610160004_ltc_source_snapshots.sql`: HIRA와 별도로 공단 기관 식별자·배치별 기본정보/유형/서비스/인력/인력 키워드를 보관한다. 관리자 확인 연락처·홈페이지·운영상태는 스냅샷과 분리하고, 파일 갱신은 기존 행을 수정/삭제하지 않는 새 배치 적재로 처리한다.
- 모든 신규 원천 표는 RLS 활성화 및 anon/authenticated 권한 회수 상태로 설계했다. STAGED 적재와 공개 승인을 분리하며, 현재 검색·기관회원·상담의 `ykiho` 체계에는 연결하지 않는다.
- 사용자 승인 후 스키마 적용·전체 적재·각 행 내용 대조를 완료했다. 배치는 `STAGED`, 적재 검증은 `VERIFIED`, `published_at`은 NULL이다. **검색 공개는 하지 않았다.** 기관 30,595, 서비스 49,324, 인력 49,162, 인력 키워드 근거 135,434행이다.
- `ltc_quality_reviews`: 원본을 수정하지 않고 기관별 문제·보완 제안값·검토 근거를 보관한다. 공식 법정동 자료와 원본을 대조해 383기관의 387항목을 기록했다(교차확인 374, 제안 1, 미해결 12항목/9기관). 신규 원천 8개 표 모두 RLS·공개 접근 차단을 확인했다.
- 구성/갱신 절차는 `장기요양기관_데이터구성_및_갱신.md`, 남은 검토 대상은 `장기요양기관_1차검증결과.md` 참조. `VERIFIED`는 적재 내용 검증이며 기관 현재 운영 확인을 의미하지 않는다.

### 장기요양 저장 구조 통합 (`202610160005`, 2026-10-16 운영 적용)

- 서비스·정원·13직종 인력을 `ltc_service_snapshots`에 통합한다. 인력 원문은 `staff_raw_source`, 원본 행 번호는 `staff_source_row`에 보관하며 원천 부재와 0명을 구분한다.
- `ltc_staff_snapshots`·`ltc_staff_keywords`는 별도 저장하지 않는 `security_invoker` 뷰다. 인력 양수 조건으로 키워드를 생성하며 기존 조회 컬럼·근거 수치를 유지한다. 일반 사용자 조회와 뷰 쓰기는 차단한다.
- 물리 테이블은 6개이며 관리자 확인값·기본정보 이력·서비스 유형·갱신 이력·검증 이력은 분리를 유지한다. 원문 JSON은 외부 원본 보관을 확보하기 전까지 유지한다.
- 전체 이관/대조/권한 전환은 한 트랜잭션으로 수행하고 검증 실패 시 전부 ROLLBACK한다. 현재 상태와 용량 실측은 구성 문서의 저장 구조 통합 결과 참조.
- 운영 적용 및 사후 검증 완료: 물리 표 8→6개, 테이블/인덱스 144.8→85.3MiB(41.07% 감소). 인력 조회 49,162행·키워드 근거 조회 135,434행·검토 387행 보존, STAGED/VERIFIED 유지.

### 2026-10-13~15 AI 검토 판정·검색 품질 관리

- `202610130001_ai_review_verdicts.sql`
  - `hospital_crawl_claims`·`hospital_website_candidates`에 AI 검토 에이전트의 판정 칸을 추가했다(`ai_verdict`·`ai_confidence`·`ai_reason`·근거 인용/페이지 정보·판정자·시각).
  - 기록용이며 `status`는 바꾸지 않는다.
- `202610150001_search_quality_review.sql`
  - `search_quality_reviews`: 관리자 재검증 판정 이력. 추가만 하며, 판정은 `OK`/`FALSE_APPROVE`/`FALSE_REJECT`/`RECHECK`, 오류 유형 8종이다.
  - `search_quality_tasks`: 오류·재수집 작업함(`OPEN`/`DONE`/`DISMISSED`). 같은 종류·기관·태그의 열린 작업은 하나다.
  - 두 테이블은 직접 접근을 막고 관리자 RPC로만 다룬다: `admin_search_quality_claims`, `admin_search_quality_crawl_gaps`, `admin_record_quality_review`, `admin_list_quality_reviews`, `admin_list_quality_tasks`, `admin_create_quality_tasks`, `admin_update_quality_task`.
- 시도 표기: `hosapi_hospital.sido_name`은 짧은 이름('서울'·'경기'), `keyword_search_logs.sido`는 긴 이름('서울특별시'·'경기도')이다.

### 2026-10-01 7대 테마 정합성 마이그레이션

- `transfer_consult_requests.transfer_theme`와 `transfer_plans.transfer_theme`는 `transfer_theme_catalog`에 등록된 테마만 허용합니다(202610010002 이후 트리거 검증, 현재 7대: `SENIOR`, `CANCER`, `ORTHO`, `PEDIATRIC`, `MENTAL`, `OBGYN`, `HOSPICE`).
- `set_transfer_consult_theme`는 요청 소유권을 확인한 뒤 전용 컬럼, `patient_requirements`, `admission_preference`를 함께 갱신합니다.
- `hospital_provider_profiles`에 `has_pediatric_psychiatry`, `has_delivery_room`, `has_postpartum_care`, `has_infertility_center`를 추가하고 승인 기관회원 전용 저장 RPC를 제공합니다.
- 입원상담 답변 트리거는 `UNAVAILABLE`일 때 거절 사유를 필수화하고 병상·입원일·대기일의 모순을 방지합니다.

### 2026-10-01 테마 카탈로그·상담 목적 (`202610010002_theme_catalog_and_purpose.sql`)

- `transfer_theme_catalog(theme, kind, value)`: 테마별 허용 `PURPOSE`·`AGE`·`CARE`·`CONDITION` 목록. **직접 수정 금지** — `src/data/transfer_theme_catalog.json`을 고친 뒤 `node scripts/build_theme_catalog_sql.cjs`로 마이그레이션 블록을 재생성하고, `npm run test:theme-catalog`로 일치 여부를 검사합니다.
- `transfer_consult_requests.consultation_purpose`: 테마 안의 상담 목적(예: `OBGYN` → `DELIVERY`/`POSTPARTUM`). 트리거가 테마와 목적의 짝을 검증합니다.
- `create_admission_consult_request`는 테마별 허용목록으로 처치·연령·상태·목적을 검증하고, 테마·목적을 전용 컬럼과 JSON(`transferTheme`, `themeCondition`, `consultationPurpose`)에 **같은 트랜잭션에서** 저장합니다. (이전 버전은 시니어 처치 8종만 허용해 다른 테마 접수가 실패했습니다.)
- `patient_requirements.cognition`은 시니어의 치매·인지 상태 전용이며, 테마별 상태는 `themeCondition`에 저장합니다.

### 2026-10-01 크롤링 주장 검토 대기열 (`202610010003_crawl_claim_review_queue.sql`)

- `hospital_crawl_claims`: 병원×태그 단위 `PENDING → APPROVED/REJECTED → EXPIRED`. 출처(`evidence`) 없는 주장은 승인 불가, 거절은 사유 필수.
- `hospital_provider_profiles.verified_crawl_tags`: 승인되고 만료 전인 태그만 담기며 검색 근거로 사용됩니다. 미검증 `crawled_tags`는 검색에 쓰지 않습니다.
- 승인 만료: 마지막 확인일 + 180일. 승인 태그가 재수집되면 연장, 만료 태그가 재수집되면 다시 `PENDING`, 거절 태그는 거절 유지.
- RPC: `save_hospital_crawl_result`(대기열 적재 포함), `admin_list_crawl_claims`, `admin_review_crawl_claim`, `expire_hospital_crawl_claims`(service_role).
- 크롤링은 HIRA 마스터(`hosapi_*`), 기관 확인 플래그(`has_*`), 기관 수동 태그(`special_tags`)를 수정하지 않습니다.

### 2026-10-01 심평원 DB 기준 시·군·구 목록 (`202610010004_hira_sggu_list.sql`)

- `get_hira_sggu_list(p_sido_terms TEXT[])`: `hosapi_hospital`에 실제 존재하는 시·군·구와 기관 수(anon·authenticated 실행). 크롤러·메인·상급병원 검색의 지역 콤보가 사용한다.
- 도(道) 지역의 구는 '시 이름 2글자 + 구'로 저장된다(예: `용인기흥구`, `화성동탄구`). 화성시는 2026년 4개 구로 분리되어 `화성시` 단독 값은 2곳뿐이다.

### 2026-10-02 보안·거절 견적·홈페이지 후보 검토 (`202610010005`~`007`)

- `202610010005`: `save_hospital_provider_profile` 26·34개 인자 오버로드의 PostgreSQL 기본 `PUBLIC EXECUTE`를 회수하고 `authenticated`, `service_role`만 명시적으로 허용한다.
- `202610010006`: `transfer_consult_targets.admission_review_status='UNAVAILABLE'`인 대상에는 `transfer_consult_quotes`를 INSERT/UPDATE할 수 없도록 DB 트리거로 차단한다.
- `202610010007`: 자동 발굴 홈페이지는 공개 프로필이나 HIRA URL에 직접 쓰지 않고 `hospital_website_candidates`에 `PENDING`으로 격리한다. 최고관리자 승인 시 기존 공식 홈페이지 등록부와 공개 URL에 반영되고, 반려 URL은 동일 주소 재수집에도 되살아나지 않는다.
- `202610020001`: 과거 크롤링 이력이 있고 HIRA·관리자 확정 URL과 다른 프로필 홈페이지 15건을 후보 대기열로 백업한 뒤 공개 프로필에서 분리했다. 기관회원 저장으로 HIRA URL과 일치하는 주소와 관리자 확정 주소는 유지했다.

### 2026-10-02 기관회원 대시보드·알림·키워드 검색·AI 가시성 리포트 (`202610020002`~`005`)

- `202610020002`: `get_regional_ai_chart_series(p_sido, p_sggu, p_source, p_ykiho)` — 지역 AI 검색 차트용 읽기 전용 집계(일별 추이·추천 순위 분포·지역 추천 점유율·검색 조건별 노출률). 권한·지역 규칙은 `get_regional_ai_dashboard`와 같고 기관회원은 자기 기관 기준으로만 비교한다. 검색 의도는 현행 `required.*`와 과거 `required_infrastructures.needs_*` 형식을 모두 읽는다.
- `202610020003`: `notification_events`(받는 사람 본인만 SELECT, 실시간 발행), `web_push_subscriptions`(직접 접근 차단, RPC만). 상담 대상 생성→기관 담당자, 기관 답변·추가 질문→보호자, 보호자 답변·취소→기관 담당자 알림을 트리거로 만든다. 알림 문구에는 병원명과 처리 안내만 넣는다. 발송은 Vault(`notify_dispatch_url`, `notify_dispatch_secret`)에 값이 있을 때만 pg_net으로 `notify-dispatch`를 호출하고, 실패 건은 `notify-dispatch-retry`(pg_cron 5분)가 다시 시도한다. RPC: `save_web_push_subscription`, `delete_web_push_subscription`, `mark_my_notifications_read`, `claim_notification_events`(service_role 전용).
- `202610020004`: `hosapi_hospital.verified_search_terms`(trigram 색인)·`search_term_sources`. 심평원 ETL이 덮어쓰는 `search_keywords`와 분리된 검색 색인으로, 기관·관리자 등록 태그/인프라(PROVIDER), 관리자 승인 크롤링 태그(CRAWL), 심평원 호스피스 지정(HIRA)만 넣는다(검토 대기 태그 제외). `search_term_synonyms` 동의어 표(예: '도수' 태그→'도수치료')로 보호자 검색어를 보강하고, `hospital_provider_profiles` 변경 시 `refresh_hospital_search_terms`가 자동 갱신한다.
- `202610020005`: `get_b2b_latest_trust_report`(최신 홈페이지 진단 전체), `luvis_marketing_leads`(개인정보 제3자 제공 동의 시에만 병원명·담당자명·이메일·전화 보관, 직접 접근 차단). RPC: `create_luvis_marketing_lead`(담당자 정보는 승인된 `hospital_memberships`에서 서버가 채움, 24시간 중복 방지, 최고관리자 알림), `get_my_luvis_marketing_lead`, `list_luvis_marketing_leads_for_admin`, `update_luvis_marketing_lead_status`.

- `202610020006`·`008`: `ai_benchmark_runs.model`에 `ACTIVE_ENGINES`(활성 AI 엔진) 허용, `create_ai_benchmark` 최대 300문항.
- `202610020007`: `classify_care_theme(query)`(질문 → 7대 테마), `get_ai_competitiveness_radar(p_sido, p_sggu, p_source, p_ykiho)` — 5각형 5축 점수, 지역 추천 상위 5곳 평균, 축별 근거 건수, 근거 충실도 체크리스트. 권한은 기관회원 본인 기관·관리자만.

- `202610020009`: `keyword_search_logs`(검색어·테마·지역·결과 수·상위 10 요양기호, USER/BENCHMARK), `keyword_search_clicks`(검색별 병원 1회, 서버 계산 순위). 직접 접근 차단. RPC: `record_keyword_search`·`record_keyword_search_click`(anon 허용, 세션 일치 검증), `admin_record_keyword_benchmark`(관리자 시뮬레이션), `get_keyword_search_stats`(관리자 통계), `clean_keyword_query`(숫자 7자리 이상 제거).

### 2026-10-03 조회 성능 개선 (`202610030001`~`004`)

- `normalize_hospital_text(text)`(IMMUTABLE, 한글·영문·숫자만 남김)와 `hosapi_hospital`의 정규화 병원명 계산식 색인(B-tree `idx_hosapi_hospital_normalized_name`, trigram `idx_hosapi_hospital_normalized_name_trgm`). `match_ai_discovered_hospital`은 같은 조건·정렬을 색인과 동적 실행으로 처리한다(평균 약 3ms).
- 수집 태그: `admin_list_crawl_claims_light`(근거 개수만, 커서 페이지), `admin_get_crawl_claim_evidence(ykiho)`, `admin_crawl_claim_summary()`, 색인 `hospital_crawl_claims_status_cursor_idx(status, last_seen_at DESC, id DESC)`. 기존 `admin_list_crawl_claims`(근거 포함)는 호환용으로 유지.
- 중복 색인 `idx_hosapi_hospital_sido_sggu` 정리, 주요 표 ANALYZE.

### 운영 반영 상태 (2026-10-01)

- `202609180001`, `202609290001`, `202610010001`~`007`, `202610020001`~`011` 운영 적용 완료. (`011`: 수집 태그 조회 페이지 나눔·대기 병원 전체 목록) (`010`: 관리자 병원 지정 시 차트 집계 지역을 그 병원 주소로) (`202610020003` 알림 발송은 `setup_notification_secrets.cjs` 실행 전까지 화면 내 알림만 동작)
- 크롤링 주장: 규칙 강화로 민감 태그 대기 24건 거절, 전체 재수집을 위해 대기 375건 삭제(백업 보관), 구 태그 `인공관절·골절재활` 승인 6건 삭제 후 검색 근거 갱신.

## 2. Auth·회원·권한

| 테이블/구성 | 역할 |
|---|---|
| `auth.users` | Supabase가 관리하는 실제 인증 계정과 사용자 UUID의 원천입니다. |
| `auth.sessions` 등 | 로그인 세션·토큰을 관리하며 애플리케이션이 직접 수정하지 않습니다. |
| `users` | 통합 회원 정보. 이메일, 회원 유형(`INDIVIDUAL`, `FACILITY_STAFF`, `ADMIN`), OAuth 공급자, 계정 상태를 관리합니다. |
| `user_profiles` | 개인회원의 이름, 전화번호, 관심지역, 환자 관계, 돌봄 메모를 보관합니다. |
| `social_auth_identities` | 네이버 등 외부 OAuth 계정과 Supabase 사용자 UUID를 연결합니다. |
| `auth_consent_records` | 회원가입·개인정보·AI·비용 계산 동의 버전과 시각을 감사 목적으로 보관합니다. |
| `facility_staff_members` | 기관 담당자와 시설의 연결, 사업자등록번호, 역할, 인증 여부를 관리합니다. |
| `hospital_memberships` | 기관회원의 HIRA `ykiho` 소유·담당 관계와 승인 상태를 관리합니다. |
| `hospital_handover_requests` | 기관 담당자 변경·소유권 이관 요청과 관리자 검토 상태를 관리합니다. |

## 3. HIRA 병원·시설 기준 데이터

| 테이블 | 역할 |
|---|---|
| `hosapi_hospital` | 심평원 병원 기본 마스터. 병원명, 종별, 주소·지역, 전화, 홈페이지, 좌표, 의사 수를 보관합니다. `ykiho`가 UNIQUE 기준키입니다. |
| `hosapi_hospital.specialty_fields` / `specialty_sources` | **진료분야**(2026-10-15). 기관구분(`category_code`, 심평원 법정 종별)과 별개로 온안부가 판정한 분야 코드 배열(REHAB·CANCER·SPINE_ORTHO·PEDIATRIC·MENTAL·OBGYN·ENT·DERM·PLASTIC·EYE·URO)과 분야별 근거 한 줄. 기관명·심평원 종별·기관 체크항목·기관 입력 태그·승인 크롤링 태그로 `refresh_hospital_specialty_fields(ykiho)`가 계산한다. 기관 프로필이 바뀌면 트리거로 그 기관만, 매일 03:40(pg_cron `onanbu-specialty-fields-nightly`)에 전체를 다시 계산한다. 검색은 `overlaps`(OR)로 거른다. 키워드 카탈로그 태그를 바꾸면 함수 안 태그 목록도 고친다. |
| `hospital_crawl_misses` | 크롤링 건너뜀·실패 기록(2026-10-16). 기관별 이유(NO_HOMEPAGE·FAILED·TIMEOUT), 연속 횟수, 처음·마지막 시각. 수집 성공 시 삭제. 크롤러 `--skip-no-homepage N`이 홈페이지 없음 N회 이상 기관을 대상에서 뺀다. 직접 접근 차단, 관리자 RPC만 사용. |
| `hosapi_hospital_detail` | 병상, ICU, 재활병상, 간호등급, 적정성 평가, 진료·특수진료, 장비·교통·식대 상세 데이터입니다. `ykiho`로 1:1 연결됩니다. |
| `facilities` | 온안부 통합 시설 마스터입니다. HIRA 병원뿐 아니라 요양원 등 비-HIRA 시설도 표현하며 유형·운영 상태·좌표를 관리합니다. |
| `anchor_hospital_relations` | 상급·종합병원과 주변 요양기관 사이의 거리, 예상 운전시간, 셔틀 여부를 캐시합니다. |

## 4. 기관회원·병원 콘텐츠

| 테이블 | 역할 |
|---|---|
| `hospital_provider_profiles` | 승인 기관회원이 입력하거나 검증된 크롤링으로 보완하는 프로필입니다. 소개, 블로그·유튜브, 갤러리, 병실료, 특화태그, 소식, 재활·투석·ICU 보조 신호와 **호스피스 완화의료 8종 인프라 데이터**를 저장합니다. HIRA 원천값과 출처를 영구히 분리합니다. |
| `hospital_reviews` | 보호자·이용자 후기와 평점입니다. 이용 인증 여부와 관리자 검토 상태를 함께 관리합니다. |
| 후기 인증 이력 | 후기 인증 요청·관리자 판정·검토 메모를 보관하며 미인증 후기는 인증 후기처럼 표시하지 않습니다. |

### 호스피스 완화의료 데이터 영구 격리 설계
심평원 마스터 DB(`hosapi_hospital`, `hosapi_hospital_detail`)는 공공데이터 포털 정기 배치 업데이트 시 테이블 전체가 갱신(덮어쓰기)되므로, 보건복지부 지정 호스피스 완화의료 상세 정보 및 기관회원 입력값은 `hospital_provider_profiles` 테이블에 격리하여 영구 보존합니다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `hospice_has_inpatient` | `BOOLEAN` | 보건복지부 지정 입원형 호스피스 운영 여부 |
| `hospice_has_home_care` | `BOOLEAN` | 가정형 호스피스(방문 진료·간호) 운영 여부 |
| `hospice_has_consulting` | `BOOLEAN` | 자문형 호스피스(일반병동/외래 완화의료 자문) 운영 여부 |
| `hospice_bed_count` | `INTEGER` | 호스피스 인가 병상수 |
| `hospice_has_aide` | `BOOLEAN` | 호스피스 간병보조인력(전담 간병도우미 제도) 운영 여부 |
| `hospice_designation_date` | `TEXT` | 보건복지부 전문기관 최초 지정일자 (예: `2017-08-04`) |
| `hospice_target_diseases` | `TEXT[]` | 법정 호스피스 대상 말기질환 목록 (말기암, 만성간경화, 만성폐쇄성호흡기질환 등) |
| `hospice_has_pediatric` | `BOOLEAN` | 소아청소년 완화의료 시범사업 참여 여부 |

- **시드 데이터 적재**: 국립암센터 및 호스피스 포털(hospice.go.kr) 공식 데이터를 기반으로 127개 지정 기관 데이터를 심평원 `ykiho`와 100% 매칭하여 적재 완료.
- **수정 권한**: 승인된 기관회원이 [병원정보관리 / 🕊️ 3. 호스피스 완화의료] 탭에서 실시간 업데이트 가능.

## 5. AI 자연어 검색·답변 저장

| 테이블 | 역할 |
|---|---|
| `search_logs` | 검색 1건의 원장입니다. 세션/사용자, 검색어, 지역, 구조화 intent, 후보 수, 선택 병원, 임베딩, 캐시 적중 여부를 저장합니다. 현재 Edge Function은 `raw_query`에 PII 마스킹 결과를 기록합니다. |
| `ai_response_logs` | 공급자별 AI 실행·감사 원장입니다. 전체 답변 원문, 공급자 원본 JSON, 발견 병원, DB 매칭/미매칭 병원, 출처, 공급자별 순위, 통합 Top 5, 요약, 토큰과 지연시간을 저장합니다. |
| `ai_recommendation_evidences` | 병원별·AI 제품별 추천 근거입니다. AI 원순위, 추천 이유, 원항목·출처, HIRA 병원 식별 검증 여부와 상태를 저장하며 통합 리포트와 노출 통계의 기준이 됩니다. |
| `search_knowledge_base` | 서버 검증을 통과한 답변 캐시입니다. 대표 질문, 임베딩, intent fingerprint, 데이터 버전, 추천 병원과 검증 요약을 보관합니다. |
| `ai_consensus_report_consents` | 로그인 사용자의 AI 상세 근거 리포트 열람 동의를 기록합니다. |
| `user_ai_report_consents` | 개인회원이 최초 한 번 완료한 AI 추천 리포트 열람·계정 연결 동의를 기록해 질문마다 반복 동의를 받지 않게 합니다. |
| `ai_consensus_jobs` | 권역·질환 템플릿의 사전 AI 합의 배치 작업과 재시도 상태를 관리합니다. |
| `ai_consensus_caches` | 사전 생성된 다중 모델 합의 리포트와 프롬프트/데이터 버전을 캐시합니다. |
| `ai_care_rate_usage` | AI 검색 분당·일일·전체 호출량을 제한해 비용과 남용을 방어합니다. |

### AI 검색 흐름

`사용자 질문` → `PII 마스킹·Intent 추출` → `search_logs` → `활성 AI 제품 병원 발견` → `ai_response_logs` 원문 선저장 → `HIRA 병원명 매칭` → `ai_recommendation_evidences` → 공급자 통합 Top 5

사용자가 병원을 선택하면 검색 로그에 선택 병원이 반영되고, 캐시 적중·피드백 통계가 갱신됩니다.

### `search_logs` 주요 컬럼 의미

| 컬럼 | 의미 |
|---|---|
| `search_id` | 질문 1건의 전체 데이터 흐름을 연결하는 UUID입니다. |
| `user_id`, `session_id` | 로그인 질문 소유자 또는 익명 브라우저 세션입니다. 공개 조회에는 반환하지 않습니다. |
| `raw_query` | PII 마스킹을 거쳐 저장된 질문 문구입니다. |
| `detected_sido`, `detected_sggu` | Intent에서 해석한 검색 지역이며 지역 통계 필터에 사용합니다. |
| `structured_intent` | 지역·질환·명시 필수조건을 담은 서버용 JSON입니다. AI에 보내는 사용자 질문을 이 JSON으로 대체하지 않습니다. |
| `source_type` | `USER`와 `BENCHMARK`를 분리해 실제 사용자 통계가 시험 데이터와 섞이지 않게 합니다. |
| `selected_ykiho` | 사용자가 결과에서 실제 선택한 최초 병원으로 클릭 통계에 사용합니다. |
| `candidate_hospital_count`, `is_cache_hit` | 최종 매칭 기관 수와 원문 캐시 사용 여부입니다. |

### `ai_response_logs` 주요 컬럼 의미

| 컬럼 | 의미 |
|---|---|
| `llm_provider`, `model_name`, `prompt_version` | 공급자, 실제 사용 모델, 실행 계약 버전입니다. |
| `model_answer_text` | 파싱하거나 문장을 수정하기 전 AI completion 전체 원문입니다. |
| `model_response_raw` | 토큰·상태·도구 결과를 포함한 공급자 원본 응답 JSON입니다. |
| `grounding_sources` | 공급자가 실제 반환한 검색 출처·인용 메타데이터입니다. |
| `discovered_hospitals` | AI가 추천한 병원명·주소·전화·원순위·추천 이유입니다. |
| `matched_hospitals` | 병원명으로 HIRA 마스터에 연결된 추천입니다. |
| `unmatched_hospitals` | DB 미존재, 파싱 오류 등으로 화면에서 제외된 추천과 사유입니다. |
| `candidate_snapshot` | DB 매칭 후 조회한 HIRA 기본정보와 승인 기관회원 콘텐츠의 당시 스냅샷입니다. 현행 발견형 검색에서는 AI 입력 후보가 아닙니다. |
| `candidate_ykihos` | 현행 `AI_FIRST_DISCOVERY`에서는 빈 배열입니다. 이전 후보 20곳 방식의 호환 컬럼으로 유지합니다. |
| `ranked_results` | 해당 공급자 응답에서 DB 매칭된 결과입니다. AI 원순위와 추천 이유를 보존합니다. |
| `final_ranked_results` | 여러 공급자를 병원 단위로 그룹화한 검색 1건의 통합 Top 5입니다. |
| `ai_summary_text`, `final_summary_text` | 공급자별 화면 요약과 검색 1건의 최종 3줄 요약입니다. |
| `ranking_mode`, `candidate_selection_mode` | `AI_DISCOVERY_MAPPED`, `AI_FIRST_DISCOVERY` 등 실행 경로를 식별합니다. |
| `validation_summary` | 캐시 키, 원본 응답 연결 ID, 발견/통과/제외 수와 오류를 저장합니다. |
| `prompt_tokens`, `completion_tokens`, `total_latency_ms` | 공급자별 사용량과 응답시간입니다. 캐시 복제 응답의 신규 토큰은 0입니다. |

### `ai_recommendation_evidences` 주요 컬럼 의미

| 컬럼 | 의미 |
|---|---|
| `search_id`, `ykiho` | 질문과 HIRA 병원을 연결합니다. |
| `provider`, `model_name` | 추천한 AI 제품과 실제 모델입니다. |
| `ranking`, `model_score`, `final_score` | AI 원순위와 파생 점수입니다. 통합 순위는 이 행을 병원별로 다시 그룹화해 계산합니다. |
| `recommendation_reason` | AI가 해당 병원에 작성한 2~3문장 추천 이유입니다. |
| `response_raw` | AI 추천 원항목, 검색 출처, 병원 식별 검증 여부를 보존합니다. |
| `evidence_keys` | `DB_IDENTITY_MATCHED` 등 서버가 확인한 근거 코드입니다. |
| `is_hira_verified` | HIRA 마스터에서 병원 `ykiho`를 확인했다는 뜻이며 추천 문장 전체의 임상 사실 검증을 의미하지 않습니다. |
| `validation_status`, `is_recommended` | 최종 리포트와 노출 통계에 포함할 유효 추천인지 결정합니다. |

### AI 원문과 화면 데이터의 구분

- 관리자 원문 조회는 `ai_response_logs.model_answer_text`를 사용합니다.
- 일반 사용자·기관회원 리포트는 원문 전체가 아니라 `final_summary_text`, 그룹화된 evidence와 기관정보 스냅샷을 사용합니다.
- 같은 병원이 두 AI 이상에 추천되면 evidence는 AI별로 여러 행이지만 화면 병원 순위는 하나입니다.
- `ai_recommendation_evidences`가 비어 있으면 AI 응답이 없다는 뜻이 아니라, 응답 병원이 HIRA DB 매칭 또는 유효 상태를 통과하지 못했을 수 있습니다. 이 경우 `ai_response_logs.unmatched_hospitals`와 `validation_summary`를 확인합니다.

## 6. 돌봄·상담·비용

| 테이블 | 역할 |
|---|---|
| `care_profiles` | 돌봄 필요, 장기요양등급, 필요 서비스, 선호지역과 문답 결과를 저장합니다. 본인만 조회합니다. |
| `transfer_plans` | 상급병원 기준, 반경, 퇴원 시점, 간병 형태, 셔틀·의료 필터와 선택 기관을 저장합니다. |
| `transfer_consult_requests` | 보호자의 기관 상담 요청, 조건, 동의 버전, 진행 상태를 저장합니다. |
| `transfer_consult_targets` | 상담 요청을 전달받은 병원별 상태(`PENDING`, `VIEWED`, `CONTACTED`, `DECLINED`)입니다. |
| `transfer_consult_target_events` | 상담 대상 상태 변경·응답·열람 이력입니다. |
| `benefit_rate_versions` | 간병비·급여 등 비용 계산에 사용하는 공식 요율과 출처·검토일입니다. |
| `cost_estimate_sessions` | 비용 계산 입력값, 결과, 적용 요율·출처 스냅샷과 동의를 저장합니다. |

## 7. Trust·LUVIS(B2B)

| 테이블 | 역할 |
|---|---|
| `official_website_registry` | HIRA URL 또는 관리자 확인 URL을 공식 홈페이지로 등록하고 검증 상태를 관리합니다. |
| `website_trust_jobs` | 홈페이지 일괄 진단 작업의 실행 상태·성공/실패·재시도 통계입니다. |
| `website_trust_job_items` | 작업 안에서 병원별 URL 진단 상태와 재시도·LUVIS 동기화 상태입니다. |
| `trust_signal_audits` | HTTPS, 도메인·콘텐츠 일치, 연락처·사업자 신호 등 Trust Signal 진단 근거와 판정 이력입니다. |
| `luvis_evaluations` | 기관별 AI 노출·합의·신뢰·최신성 점수와 월별 종합 점수입니다. |
| `facility_subscriptions` | B2B 요금제, 구독 기간, 자동 갱신과 상태를 관리합니다. |

## 8. 시스템 설정·비밀키

| 테이블 | 역할 |
|---|---|
| `system_config` | 운영 설정과 AI 공급자 키 참조를 보관합니다. `ai_search_engines`에는 AI별 활성 상태·모델·프롬프트만 저장하며 API 키는 별도 항목과 서버 전용 RPC로 분리합니다. |

운영 키·서비스 롤 키는 프론트엔드나 클라이언트 응답에 포함하지 않습니다. Edge Function은 Secret 또는 서버 RPC를 사용합니다.

## 9. 주요 Database Function/RPC

### 인증·기관 권한

- `is_anondoc_admin`: 관리자 여부 확인
- `submit_hospital_membership`, `check_hospital_membership_status`: 기관회원 신청·상태 조회
- `admin_list_hospital_memberships`, `admin_review_hospital_membership`: 관리자 승인/반려
- `save_hospital_provider_profile`: 소유권 검증 후 기관 프로필 저장 (기본 정보, 비급여, 특화진료 및 **호스피스 완화의료 8종 인프라 파라미터** 지원)
- `update_my_hospital_contact`, `update_my_hospital_email_and_contact`: 승인 기관 담당자 정보 변경
- `submit_handover_request`, `admin_review_handover_request`: 기관 소유권 이관

### AI 검색·캐시·피드백

- `create_search_log`, `create_ai_response_log`: 검색 원장과 AI 답변 감사 로그 생성
- `record_search_selection`, `record_ai_care_feedback`: 병원 선택·긍정 피드백 기록
- `match_ai_care_verified_cache`, `upsert_ai_care_verified_cache`, `touch_ai_care_verified_cache`: 검증 캐시 조회·저장·적중 갱신
- `promote_search_knowledge`: 검증된 검색 결과를 지식 캐시로 승격
- `consume_ai_care_quota`: 사용자/세션별 AI 호출량 제한
- `get_my_ai_consensus_report`: 개인은 동의한 본인 질문, 승인 기관회원·관리자는 공개 질문의 상세 근거 조회
- `get_public_ai_search_explorer`: 마스킹된 전체/내 질문, 병원 단일 통합 순위와 AI별 추천 이유 조회
- `get_admin_ai_response_originals`: 관리자만 공급자별 전체 답변 원문·모델·토큰 조회
- `get_admin_ai_engine_settings`, `save_admin_ai_engine_settings`: 관리자 AI별 활성 상태·모델·프롬프트 조회/저장
- `get_ai_engine_settings`: `service_role`만 실행하는 Edge 런타임 설정 조회
- `get_regional_ai_dashboard`: 실제 사용자/벤치마크와 기관 언급/지역 전체 범위를 분리한 최근 30일 통계
- `match_ai_discovered_hospital`: AI 추천 병원명을 정규화해 HIRA 마스터 후보와 연결

### 일반회원 관리 (2026-10-16)

- `admin_list_individual_members(p_search, p_provider, p_sort, p_limit, p_offset)`: 관리자 전용 일반회원 목록(이메일·휴대전화 가림, 연령대·상담·문의 건수 포함). `admin_reveal_member_contact(p_user_id)`: 연락처 원문 + 조회 기록. `admin_log_member_export(p_count)`: CSV 내려받기 기록. 기록 표 `admin_member_access_logs`(직접 접근 차단). 가림 함수 `mask_email`, `mask_phone`.

### 장기요양기관 위치 검색 (2026-10-16)

- `search_ltc_facilities(p_query, p_sido, p_sggu, p_service_groups, p_staff_fields, p_lat, p_lng, p_radius_km, p_limit, p_offset)`: 공개(anon) 조회. `ltc_institutions.search_enabled`(좌표 확인 기관)만 반환, 위치(GiST)·지역 인덱스 사용. 마이그레이션 `202610160006_ltc_geolocation_search.sql`, `202610160007_ltc_search_region_tokens.sql`.

### 크롤링·검토·진료분야 (2026-10-16)

- `save_hospital_crawl_result`: 크롤러 결과 저장(관리자·서비스 키만). 수집 태그 → `hospital_crawl_claims`(PENDING), 발굴 홈페이지 → `hospital_website_candidates`. **2026-10-16부터** 크롤러가 기관명·대표전화를 확인한 후보(`homepage_candidate_verified = NAME_PHONE`)는 공식 홈페이지로 자동 확정(`official_website_registry.source_type = AUTO_VERIFIED`, 심평원 주소·기관 프로필 반영, 변경 이력 '자동 확정'). 관리자가 반려한 같은 주소·공공·포털·블로그·SNS·단축주소는 제외.
- `admin_record_crawl_miss(ykiho, reason, detail)`, `admin_list_crawl_miss_ykihos(reason, min_count)`: 건너뜀·실패 기록과 '홈페이지 없음 N회 이상' 목록(`hospital_crawl_misses`).
- `refresh_verified_crawl_tags(ykiho)`: 승인·만료 반영해 `verified_crawl_tags` 갱신.
- `refresh_hospital_specialty_fields(ykiho | NULL)`, `compute_hospital_specialty_sources(...)`: 진료분야 계산(기관 프로필 변경 트리거 + 매일 03:40 pg_cron `onanbu-specialty-fields-nightly` 전체 재계산).
- 검색 품질: `admin_search_quality_claims`, `admin_search_quality_crawl_gaps`, `admin_record_quality_review`, `admin_list_quality_reviews`, `admin_list_quality_tasks`, `admin_create_quality_tasks`, `admin_update_quality_task`.
- 데이터 정리 마이그레이션: `202610150002_split_cancer_immuno_thermal.sql`(암면역온열치료 → 암면역치료·암온열치료), `202610150004_specialty_cancer_excludes_hospice.sql`(호스피스 완화의료 태그는 암 진료분야 근거 아님).

### 상담·비용·Trust/LUVIS

- `save_transfer_plan`, `create_transfer_consult_request`, `get_my_transfer_consult_progress`: 돌봄 계획·상담 요청
- `cancel_my_admission_consult_target`: 보호자 본인의 접수된 입원/전원 상담 요청을 개별 병원 단위로 즉시 취소하는 안전 RPC (소유권 검증 및 상태 갱신)
- `respond_transfer_consult_target_package`: 기관회원의 원클릭 표준 견적 패키지(프리셋 3종: 기본케어/집중간병/전문치료) 답변 저장
- `update_my_transfer_consult_status`, `revert_my_transfer_consult_status`, `mark_my_transfer_consults_seen`: 상담 상태·열람 관리
- `get_public_hospital_cost_source`, `save_cost_estimate_session`, `delete_my_cost_estimate`: 비용 계산·출처·개인 기록
- `admin_confirm_official_website`, `admin_list_official_website_registry`: 공식 홈페이지 확인
- `admin_override_suspicious_website`: 공공·플랫폼 의심 주소(정부 도메인 공립병원·보건소 등) 수동 확정, 확정 이력 기록(2026-10-15 이름 충돌 버그 수정)
- `admin_reject_website_candidate`, `admin_set_hospital_homepage`: 후보 반려, 홈페이지 주소 변경·삭제(변경 이력 `hospital_homepage_change_audits`)
- `admin_get_website_trust_operations`, `upsert_luvis_trust_score`, `get_b2b_latest_luvis_audit`: Trust 작업·LUVIS 점수 동기화

## 10. Edge Function

| Function | 역할 |
|---|---|
| `ai-care-search` | 자연어 질문 PII 마스킹, Intent 추출, 활성 다중 AI 병원 발견, HIRA 병원명 매칭, 기관정보·승인 크롤링 태그 결합, 답변 원문·근거·통합 순위 저장 (운영 version 38) |
| `ai-consensus-batch` | 권역/질환 템플릿을 여러 AI 모델로 사전 분석하고 합의·근거 결과 저장 |
| `official-website-trust-batch` | 공식 홈페이지를 서버에서 진단하고 Trust/LUVIS 결과 저장·동기화 |
| `naver-auth` | 네이버 OAuth 인증과 사용자 매핑 |
| `notify-dispatch` | 알림 웹 푸시·선택 이메일 발송, LUVIS 상담 신청 웹훅 전달 |

## 11. RLS·보안 원칙

- 민감 테이블은 RLS를 활성화하고 `anon`/`authenticated`의 직접 쓰기 권한을 기본 회수합니다.
- 공개 검색에 필요한 HIRA 기본·상세 데이터와 승인된 기관 프로필만 제한적으로 SELECT를 허용합니다.
- 개인정보·AI 원문·모델 근거·기관 소유권 정보는 직접 테이블 조회 대신 검증된 RPC 또는 서버 Edge Function을 통해 접근합니다.
- `SECURITY DEFINER` 함수는 `auth.uid()`, 세션, 기관 소유권을 확인하고 `search_path`를 고정합니다.
- 운영 키와 서비스 롤 키는 클라이언트에 전달하지 않습니다.
- AI 엔진 설정은 `authenticated` 역할에 함수 실행권한이 있어도 함수 내부 `is_anondoc_admin()`을 통과해야 조회·변경됩니다.
- 실행용 `get_ai_engine_settings()`는 `anon`, `authenticated`, `PUBLIC` 권한을 회수하고 `service_role`에만 허용합니다.
- 공개 AI 질문 RPC는 `mask_public_ai_query`를 적용하고 사용자 UUID·이메일·전화번호·공급자 원문을 반환하지 않습니다.
- 기관회원 상세 리포트 권한은 승인된 `hospital_memberships`를 서버에서 확인합니다. 개인회원은 본인 질문만 열람합니다.

## 12. 운영 확인

AI Top 5 확장(`202609080001`) 이후 현행 발견형 검색(`202609080008`~`012`)은 `model_answer_text`에 파싱 전 completion 전체, `model_response_raw`에 공급자 응답 전체를 둡니다. `candidate_snapshot`은 AI 입력 후보가 아니라 DB 매칭 후 사후 보강 스냅샷입니다. `ai_recommendation_evidences.ranking`은 AI 원순위이며 통합 화면 순위는 병원별 평균 원순위로 별도 생성합니다.

### 2026-09-28 적용 migration

| 버전 | 내용 |
|---|---|
| `202609280001_hospice_provider_profile_schema.sql` | `hospital_provider_profiles`에 호스피스 완화의료 8종 컬럼(`hospice_has_inpatient`, `hospice_has_home_care`, `hospice_has_consulting`, `hospice_bed_count`, `hospice_has_aide`, `hospice_designation_date`, `hospice_target_diseases`, `hospice_has_pediatric`) 추가 및 `save_hospital_provider_profile` RPC 파라미터 확장. |
| `202609280002_rename_onandoc_hospital_test.sql` | 실존 병원과의 혼선 방지를 위해 테스트 가상병원(`JDQ4MTYyMiM1MSMkMSMkMCMkODkkMzgxMzUxIzExIyQxIyQzIyQ3OSMxMDI2NDgjMTFjYmE_ONANDOC`) 명칭을 `온안부요양병원`에서 `온안부요양병원(개발테스트)`로 변경. |

### 2026-09-08 적용 migration

| 버전 | 내용 |
|---|---|
| `202609080010_ai_name_only_matching.sql` | 병원명 정규화 유사 매칭을 우선하고 HIRA 마스터 미존재 병원을 제외합니다. |
| `202609080011_ai_report_roles_and_grouping.sql` | 병원 중복 없는 통합 순위, AI별 근거, 개인/기관/관리자 상세 리포트 권한, 관리자 원문 조회를 추가합니다. |
| `202609080012_ai_engine_settings_and_regional_scope.sql` | 관리자 AI 엔진 설정과 기관/지역 통계 범위, 실제 검색 기본값, 지역명 정규화를 추가합니다. |

`202609080012`는 관리자 설정이 포함된 긴 실행 버전명(`ai-discovery-v2-admin-engines`)을 보존할 수 있도록 `ai_response_logs.prompt_version`을 `VARCHAR(80)`으로 확장합니다.

1. migration이 Supabase 프로젝트에 적용됐는지 확인합니다.
2. `information_schema.tables`, `information_schema.routines`로 테이블/RPC 존재 여부를 확인합니다.
3. `npm run security:rls`로 RLS·GRANT·RPC 권한 잠금 검사를 실행합니다.
4. AI 검색은 `search_logs → ai_response_logs → ai_recommendation_evidences` 연결과 HIRA `ykiho` 검증을 함께 확인합니다.
