-- ==============================================================================
-- Calamus Portal 심평원 공공데이터 스키마 정의 (3개 테이블)
-- 대상 Supabase 프로젝트: klgeuewpslppoxgvkiqj (on-anbu)
-- ==============================================================================

-- 1. PostGIS 확장 활성화 (위치 기반 반경 거리 검색용)
CREATE EXTENSION IF NOT EXISTS postgis;

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
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 공간 인덱스 및 검색 최적화 인덱스
CREATE INDEX IF NOT EXISTS idx_hosapi_hospital_geom ON hosapi_hospital USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_hosapi_hospital_cat ON hosapi_hospital (category_code);
CREATE INDEX IF NOT EXISTS idx_hosapi_hospital_name ON hosapi_hospital (name);
CREATE INDEX IF NOT EXISTS idx_hosapi_hospital_sido_sggu ON hosapi_hospital (sido_name, sggu_name);


-- ------------------------------------------------------------------------------
-- 2) hosapi_pharmacy : 전국 약국 기본 정보 (약 2.4만 건)
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

CREATE INDEX IF NOT EXISTS idx_hosapi_pharmacy_geom ON hosapi_pharmacy USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_hosapi_pharmacy_name ON hosapi_pharmacy (name);
CREATE INDEX IF NOT EXISTS idx_hosapi_pharmacy_sido ON hosapi_pharmacy (sido_name, sggu_name);


-- ------------------------------------------------------------------------------
-- 3) hosapi_hospital_detail : 병의원 상세 정보 (시설, 병상, 장비, 진료과, 교통, 간호등급)
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
    
    -- JSONB 배열 컬럼 (다대일 데이터 압축 보관)
    treatments JSONB DEFAULT '[]'::jsonb,     -- 5.진료과목 목록 (예: ["내과", "정형외과"])
    special_treatments JSONB DEFAULT '[]'::jsonb, -- 10.특수진료 목록 (예: ["HPV 국가예방접종", "혈액투석"])
    equipments JSONB DEFAULT '[]'::jsonb,     -- 7.의료장비 목록 (예: ["초음파영상진단기 (1대)", "MRI 3.0T (2대)"])
    transports JSONB DEFAULT '[]'::jsonb,     -- 6.교통 및 오시는길 목록
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hosapi_dtl_ykiho ON hosapi_hospital_detail (ykiho);


-- ------------------------------------------------------------------------------
-- 4) 트리거: 위/경도 좌표 입력 시 PostGIS Point 자동 갱신
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
