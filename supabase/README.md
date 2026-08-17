# Calamus Portal Supabase DB Schema & Data Guide

본 문서는 Calamus Portal(Calamus Care)에서 사용하는 Supabase PostgreSQL 데이터베이스의 테이블 구조, 인덱스, 확장 기능 및 데이터 마이그레이션 방법을 설명합니다.

---

## 📌 Supabase 연동 정보
- **Project URL**: `https://klgeuewpslppoxgvkiqj.supabase.co`
- **Schema File**: [`supabase/schema.sql`](./schema.sql)

---

## 🛠️ Extensions (확장 기능)
1. **`postgis`**: 위도/경도 기반 지리 좌표(`geom`) 저장 및 반경 거리 검색 지원
2. **`pg_trgm`**: Trigram 기반 GIN 인덱스를 통한 고속 부분 문자열 & 복합 AND 전문 검색 지원

---

## 🗄️ Core Tables (3개 핵심 테이블)

### 1. `hosapi_hospital` (전국 병의원 기본 정보, 약 7.9만 건)
- **`ykiho` (VARCHAR)**: 암호화 요양기호 (고유 식별자, Unique Key)
- **`name` (VARCHAR)**: 요양기관명
- **`category_code` (VARCHAR)**: 종별 코드 (`01`: 상급종합, `11`: 종합, `21`: 병원, `28`: 요양, `92`: 한방병원, `93`: 한의원, `31`: 의원 등)
- **`category_name` (VARCHAR)**: 종별 명칭
- **`is_hospice` (BOOLEAN)**: 호스피스 완화의료 여부
- **`address` (TEXT)**: 도로명/지번 주소
- **`sido_name` / `sggu_name` / `emdong_name`**: 시도/시군구/읍면동 지역 정보
- **`tel` / `url` / `established_date`**: 연락처, 웹사이트, 개설일자
- **`doctor_total_cnt` / `specialist_cnt` / `general_cnt` / `intern_cnt` / `resident_cnt`**: 의료진 인원 현황
- **`latitude` / `longitude` / `geom`**: 위경도 및 PostGIS 공간 포인트
- **`search_keywords` (TEXT)**: 복합 AND 검색용 통합 키워드 컬럼 (Trigram GIN 인덱스 적용)

### 2. `hosapi_pharmacy` (전국 약국 기본 정보, 약 2.5만 건)
- **`ykiho`**: 암호화 요양기호
- **`name`**: 약국명
- **`address` / `sido_name` / `sggu_name`**: 주소 및 지역 정보
- **`latitude` / `longitude` / `geom`**: 약국 위치 좌표

### 3. `hosapi_hospital_detail` (병의원 종합 상세 정보, 약 10.5만 건)
- **`ykiho`**: 암호화 요양기호 (외래 식별자)
- **`total_beds` / `general_beds` / `general_vip_beds`**: 총 병상수 및 일반입원실
- **`icu_adult_beds` / `icu_child_beds` / `er_beds` / `isolated_beds`**: 중환자실, 응급실, 격리병실
- **`nursing_grade` / `grade_evaluation`**: 간호등급 및 심평원 적정성 종합평가등급
- **`special_hospital_field` (VARCHAR)**: 보건복지부 지정 전문병원 분야 (척추, 관절, 뇌혈관 등)
- **`detailed_info` (JSONB)**: 진료시간(평일/토/일), 점심시간, 응급실 주/야간 운영 및 직통전화, 주차대수/유무료 정보
- **`meal_info` (JSONB)**: 입원식/식대가산 (영양사/조리사 가산) 정보
- **`other_staff` (JSONB)**: 기타 전문인력 (약사, 물리치료사, 방사선사 등 인원)
- **`treatments` (JSONB)**: 개설 진료과목 배열
- **`special_treatments` (JSONB)**: 특수진료 및 특화 클리닉 배열
- **`equipments` (JSONB)**: 보유 의료장비 (MRI, CT 등 대수) 배열
- **`transports` (JSONB)**: 오시는 길 및 대중교통 노선 정보

---

## ⚡ 주요 트리거
- **`trg_update_hospital_geom` / `trg_update_pharmacy_geom`**:
  - `latitude` / `longitude` 입력 또는 변경 시 PostGIS `geom` 포인트를 `ST_SetSRID(ST_MakePoint(lon, lat), 4326)`으로 자동 갱신.
