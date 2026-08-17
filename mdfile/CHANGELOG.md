# 변경 내역 (CHANGELOG)

## [2026-08-17] 심평원 대용량 엑셀 데이터 Supabase 마이그레이션 아키텍처 및 스키마 구축

### 1. Supabase (`klgeuewpslppoxgvkiqj`) 전용 테이블 스키마 설계 (`src/lib/db/schema.sql`)
- **`hosapi_hospital`**: 전국 7.9만여 개 병의원 기본 정보 (종별, 전문의수, 의사수, 위경도, PostGIS geom)
- **`hosapi_pharmacy`**: 전국 2.4만여 개 약국 정보 (향후 약국 찾기 서비스 확장 대비)
- **`hosapi_hospital_detail`**: 시설(병상수/입원실/중환자실/응급실), 진료과목, 의료장비(MRI/CT 등), 교통/주차, 간호등급 종합 JSONB 매핑

### 2. 분기별 엑셀 파일 자동 마이그레이션 파이프라인 (`src/scripts/migrateHospitalData.ts`)
- `public/hospital_info_file/` 폴더에 분기별 신규 엑셀 파일이 투입되면 파일명 패턴으로 자동 인식
- 12종 엑셀의 다대일(1:N) 관계 데이터를 `ykiho` 기준으로 자동 결합하여 배치(Batch Upsert 500건 단위) 적재
- `npm run migrate:hosp` 명령어를 통한 원클릭 자동 동기화 지원
