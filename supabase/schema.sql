-- ==============================================================================
-- Calamus Portal (Calamus Care) Supabase Database Schema
-- Target Supabase Project: klgeuewpslppoxgvkiqj (on-anbu)
-- Includes: Extensions, 3 Core Tables, Triggers, Trigram & GIN Full-Text Indexes
-- ==============================================================================

-- 1. 확장 기능 활성화 (PostGIS 공간 검색 + Trigram 유사도/전문 검색)
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ------------------------------------------------------------------------------
-- 1) hosapi_hospital : 전국 병의원 기본 정보 (약 7.9만 건)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hosapi_hospital (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ykiho VARCHAR(120) UNIQUE NOT NULL,       -- 암호화요양기호 (고유키)
    name VARCHAR(255) NOT NULL,               -- 요양기관명
    category_code VARCHAR(10) NOT NULL,       -- 종별코드 (01:상급종합, 11:종합, 21:병원, 28:요양, 92:한방병원, 93:한의원, 31:의원 등)
    category_name VARCHAR(50) NOT NULL,       -- 종별코드명
    is_hospice BOOLEAN DEFAULT FALSE,         -- 호스피스 완화의료 여부
    
    -- 주소 및 지역 정보
    post_no VARCHAR(10),                      -- 우편번호
    address TEXT NOT NULL,                    -- 주소
    sido_code VARCHAR(10),                    -- 시도코드
    sido_name VARCHAR(50),                    -- 시도명
    sggu_code VARCHAR(10),                    -- 시군구코드
    sggu_name VARCHAR(50),                    -- 시군구명
    emdong_name VARCHAR(50),                  -- 읍면동
    
    -- 연락처 및 개설일자
    tel VARCHAR(40),                          -- 전화번호
    url TEXT,                                 -- 병원 홈페이지 URL
    established_date VARCHAR(20),             -- 개설일자
    
    -- 의료진 인력수
    doctor_total_cnt INT DEFAULT 0,           -- 총 의사수
    specialist_cnt INT DEFAULT 0,             -- 의과/한방 전문의 수
    general_cnt INT DEFAULT 0,                -- 일반의 수
    intern_cnt INT DEFAULT 0,                 -- 인턴 수
    resident_cnt INT DEFAULT 0,               -- 레지던트 수
    
    -- 좌표 및 PostGIS 포인트
    latitude DOUBLE PRECISION,                -- 좌표(Y) 위도
    longitude DOUBLE PRECISION,               -- 좌표(X) 경도
    geom GEOMETRY(Point, 4326),               -- 공간 인덱싱용 좌표

    -- 다중 조건/진료과/장비/특수진료 통합 키워드 검색용 컬럼
    search_keywords TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 병원 인덱스 정의
CREATE INDEX IF NOT EXISTS idx_hosapi_hospital_geom ON hosapi_hospital USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_hosapi_hospital_cat ON hosapi_hospital (category_code);
CREATE INDEX IF NOT EXISTS idx_hosapi_hospital_sido_sggu ON hosapi_hospital (sido_name, sggu_name);
CREATE INDEX IF NOT EXISTS idx_hosapi_hospital_doctor ON hosapi_hospital (doctor_total_cnt DESC);

-- Trigram GIN 고속 전문 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_hosapi_hospital_name_trgm ON hosapi_hospital USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_hosapi_hospital_address_trgm ON hosapi_hospital USING gin (address gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_hosapi_hospital_cat_trgm ON hosapi_hospital USING gin (category_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_hosapi_hospital_keywords_trgm ON hosapi_hospital USING gin (search_keywords gin_trgm_ops);


-- ------------------------------------------------------------------------------
-- 2) hosapi_pharmacy : 전국 약국 기본 정보 (약 2.5만 건)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hosapi_pharmacy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ykiho VARCHAR(120) UNIQUE NOT NULL,       -- 암호화요양기호
    name VARCHAR(255) NOT NULL,               -- 약국명
    category_code VARCHAR(10) DEFAULT '81',   -- 종별코드 (81: 약국)
    category_name VARCHAR(50) DEFAULT '약국',
    
    -- 주소 및 지역 정보
    post_no VARCHAR(10),
    address TEXT NOT NULL,
    sido_code VARCHAR(10),
    sido_name VARCHAR(50),
    sggu_code VARCHAR(10),
    sggu_name VARCHAR(50),
    emdong_name VARCHAR(50),
    
    tel VARCHAR(40),
    established_date VARCHAR(20),
    
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom GEOMETRY(Point, 4326),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 약국 인덱스 정의
CREATE INDEX IF NOT EXISTS idx_hosapi_pharmacy_geom ON hosapi_pharmacy USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_hosapi_pharmacy_sido ON hosapi_pharmacy (sido_name, sggu_name);
CREATE INDEX IF NOT EXISTS idx_hosapi_pharmacy_name_trgm ON hosapi_pharmacy USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_hosapi_pharmacy_address_trgm ON hosapi_pharmacy USING gin (address gin_trgm_ops);


-- ------------------------------------------------------------------------------
-- 3) hosapi_hospital_detail : 병의원 종합 상세 정보 (약 10.5만 건)
--    (시설, 병상, 세부정보, 장비, 진료과, 식대가산, 전문병원, 기타인력, 교통)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hosapi_hospital_detail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ykiho VARCHAR(120) UNIQUE NOT NULL,       -- 암호화요양기호 (외래키 역할)
    
    -- 병상 및 시설 정보 (3.시설정보)
    total_beds INT DEFAULT 0,                 -- 총 병상수
    general_beds INT DEFAULT 0,               -- 일반입원실 일반병상수
    general_vip_beds INT DEFAULT 0,           -- 일반입원실 상급병상수
    icu_adult_beds INT DEFAULT 0,             -- 성인 중환자실
    icu_child_beds INT DEFAULT 0,             -- 소아/신생아 중환자실
    er_beds INT DEFAULT 0,                    -- 응급실 병상수
    pt_beds INT DEFAULT 0,                    -- 물리치료실 병상수
    isolated_beds INT DEFAULT 0,              -- 격리병실
    
    -- 등급 정보 (9.간호등급 & 심평원 평가)
    nursing_grade VARCHAR(20),                -- 간호인력 등급
    grade_evaluation VARCHAR(20),             -- 적정성 종합평가 등급
    
    -- 전문병원 및 세부 운영정보
    special_hospital_field VARCHAR(100),      -- 11.보건복지부 지정 전문병원 분야 (척추, 관절, 뇌혈관 등)
    detailed_info JSONB DEFAULT '{}'::jsonb,  -- 4.세부정보 (진료시간, 점심시간, 응급실 주야간 운영 및 직통전화, 주차대수/유무료)
    meal_info JSONB DEFAULT '[]'::jsonb,      -- 8.식대가산 정보 (영양사/조리사 가산)
    other_staff JSONB DEFAULT '[]'::jsonb,    -- 12.기타 전문인력 (약사, 물리치료사, 방사선사 등 인원)
    
    -- JSONB 배열 컬럼 (다대일 데이터 집계)
    treatments JSONB DEFAULT '[]'::jsonb,     -- 5.진료과목 목록 (예: ["내과", "정형외과"])
    special_treatments JSONB DEFAULT '[]'::jsonb, -- 10.특수진료 목록 (예: ["HPV 국가예방접종", "혈액투석"])
    equipments JSONB DEFAULT '[]'::jsonb,     -- 7.의료장비 목록 (예: ["초음파영상진단기 (1대)", "MRI 3.0T (2대)"])
    transports JSONB DEFAULT '[]'::jsonb,     -- 6.교통 및 오시는길 목록
    
    -- 통합 키워드 컬럼
    search_keywords TEXT,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 상세정보 인덱스 정의
CREATE INDEX IF NOT EXISTS idx_hosapi_dtl_ykiho ON hosapi_hospital_detail (ykiho);
CREATE INDEX IF NOT EXISTS idx_hosapi_dtl_keywords_trgm ON hosapi_hospital_detail USING gin (search_keywords gin_trgm_ops);


-- ------------------------------------------------------------------------------
-- 4) 트리거 함수: 위/경도 좌표 입력 시 PostGIS Point 자동 생성 및 갱신
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_geom_point()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.longitude IS NOT NULL AND NEW.latitude IS NOT NULL THEN
        NEW.geom = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_hospital_geom
BEFORE INSERT OR UPDATE ON hosapi_hospital
FOR EACH ROW EXECUTE FUNCTION update_geom_point();

CREATE OR REPLACE TRIGGER trg_update_pharmacy_geom
BEFORE INSERT OR UPDATE ON hosapi_pharmacy
FOR EACH ROW EXECUTE FUNCTION update_geom_point();
