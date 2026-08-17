포털(`calamus.ai.kr`)의 정체성을 명확한 실사용자 타깃(환자·보호자·시니어 케어) 중심의 "전문화된 메디컬·케어 인포메이션 포털"로 전면 전환하고, 기존 엔터테인먼트 기능(사주·타로·게임)을 서브 콘텐츠(라이프 밸런스/힐링 라운지)로 분리하는 구조 개편안입니다.



\---



\# 1. 포털 개편 핵심 방향성



1\. \*\*타깃 \& 브랜딩 전환\*\*: 일반 잡학/엔터테인먼트 포털 ➔ \*\*한방의료 \& 요양·호스피스 전문 헬스케어 포털 (Calamus Care)\*\*

2\. \*\*공공데이터 기반 신뢰성 확보\*\*: \*\*건강보험심사평가원(HIRA) 공공데이터 Open API\*\* 연동을 통해 전국 의료기관/요양기관의 최신 인력, 병상, 시설, 평가등급, 위치 정보 실시간 동기화.

3\. \*\*기존 콘텐츠 재배치\*\*: 사주·타로·미니게임은 상단 GNB의 \*\*'힐링 라운지 / 마음쉼터'\*\* 카테고리로 묶어 체류 시간(Dwell Time)을 늘리는 서브 콘텐츠로 활용.



\---



\# 2. 전체 GNB(메뉴) 구조도



```text

\[ Calamus Care (로고) ]

├── 1. 한방 의료 (Oriental Medicine)

│   ├── 한방병원 찾기 (전국 병상/전문의/입원실 필터)

│   ├── 한의원 찾기 (지역별 / 진료과목별 / 야간·공휴일 진료)

│   └── 전문 한방클리닉 (척추·관절, 여성·산후, 중풍·재활, 다이어트 등)

│

├── 2. 요양 \& 실버케어 (Senior \& Care)

│   ├── 요양병원 안내 (심평원 적정성 평가 1등급, 간호등급, 병상수)

│   ├── 요양원 / 주야간보호센터 (노인장기요양 등급별 시설 안내)

│   └── 입원/입소 가이드 (비용 계산기, 장기요양보험 혜택 안내)

│

├── 3. 완화의료 \& 호스피스 (Hospice Care)

│   ├── 호스피스 완화의료기관 찾기 (입원형 / 가정형 / 자문형 호스피스)

│   └── 호스피스 이용 안내 및 상담 신청

│

├── 4. 메디컬 매거진 \& 가이드 (Care Guide)

│   ├── 요양병원 vs 요양원 차이점 완벽 비교

│   ├── 계절별 한방 건강관리 \& 약선/체질 이야기

│   └── 보호자를 위한 돌봄 가이드 \& 간병인 매칭 팁

│

└── 5. 힐링 라운지 (Mind \& Fortune)  <-- 기존 콘텐츠 통합

&#x20;   ├── Calamus 사주 (현대적 라이프 성향 \& 오행 분석)

&#x20;   ├── Calamus 타로룸 (3D 인터랙티브 AI 챗 타로)

&#x20;   └── 미니게임 \& 힐링 존



```



\---



\# 3. 심평원 API 연계 및 데이터 파이프라인 설계



\### 연계 대상 심평원(HIRA) 주요 API



\* \*\*`건강보험심사평가원\_병원정보서비스`\*\*: 병원 기본 목록(요양기호, 명칭, 종별코드, 주소, 좌표, 전화번호)

\* 종별코드 필터링: 한방병원(`28`), 한의원(`93`), 요양병원(`21`)





\* \*\*`건강보험심사평가원\_의료기관별상세정보서비스`\*\*:

\* 시설정보(병상수, 입원실 현황), 간호등급정보, 전문과목별 전문의 수, 식대가산 정보





\* \*\*`건강보험심사평가원\_병원평가정보서비스`\*\*:

\* 요양병원 적정성 평가 등급(1\~5등급) 매핑







\### 시스템 데이터 아키텍처



```text

\[공공데이터포털 / 심평원 Open API]

&#x20;        │ (배치 동기화: 주 1회 or 월 1회 신규/변경건 Sync)

&#x20;        ▼

\[Cloudflare Workers Cron / Backend Server]

&#x20;        │ (종별 분류 및 좌표/주소 지오코딩 정제)

&#x20;        ▼

\[PostgreSQL / Supabase DB]

&#x20; - hospitals (기본 정보, 위경도 PostGIS 지원)

&#x20; - hospital\_details (병상, 간호등급, 시설, 평가등급)

&#x20; - bookmarks / reviews (사용자 리뷰 및 즐겨찾기)

&#x20;        │ (REST API / Next.js Server Components)

&#x20;        ▼

\[Calamus 프론트엔드 Web (지도 기반 검색 \& 필터링 UI)]



```



\---



\# 4. 메인 화면(Home) 레이아웃 와이어프레임



```

┌────────────────────────────────────────────────────────┐

│ \[Calamus Care]  \[한방의료] \[요양/실버] \[호스피스] \[가이드] \[힐링라운지] │

├────────────────────────────────────────────────────────┤

│ 🔍 우리 부모님, 나에게 맞는 병의원·요양시설 빠른 검색    │

│ \[ 지역 선택 ▾ ] \[ 시설 구분 ▾ ] \[ 조건(간호등급/특수진료) ] \[검색] │

├────────────────────────────────────────────────────────┤

│ 🏥 빠른 카테고리 바로가기                                │

│ \[ 한방병원/의원 ]  \[ 1등급 요양병원 ]  \[ 호스피스 병동 ]  \[ 요양원 ] │

├────────────────────────────────────────────────────────┤

│ 📍 내 주변 추천 시설 (카카오맵/네이버맵 연동 지도 뷰)      │

│ ┌──────────────────────┐ ┌──────────────────────────┐ │

│ │                      │ │ ■ OO 한방병원 (전문의 5명)  │ │

│ │   \[ 인터랙티브 지도 ]   │ │ ■ OO 요양병원 (평가 1등급)  │ │

│ │                      │ │ ■ OO 완화의료센터         │ │

│ └──────────────────────┘ └──────────────────────────┘ │

├────────────────────────────────────────────────────────┤

│ 📚 보호자 필독 가이드: "요양병원과 요양원, 무엇이 다를까요?" │

├────────────────────────────────────────────────────────┤

│ 🌿 마음쉼터 (힐링 라운지)                               │

│ \[ 오늘의 사주 \& 오행 밸런스 ]   \[ AI 타로 마음 상담 ]    │

└────────────────────────────────────────────────────────┘



```



\---



\# 5. 구현 단계별 로드맵



1\. \*\*Step 1: 심평원 API 키 발급 및 데이터베이스 모델링\*\*

\* 공공데이터포털(data.go.kr)에서 병원정보서비스 및 요양병원 상세정보 API 신청.

\* 요양기관종별(`한방병원`, `한의원`, `요양병원`, `호스피스`) 테이블 스키마 설계 및 초기 배치 스크립트 작성.





2\. \*\*Step 2: 지도 기반 검색 \& 필터링 UI 구축\*\*

\* 지도 SDK(카카오맵/네이버 지도) 기반 반경 검색, 지역별(시/도, 시/군/구) 필터, 등급/시설 필터 구현.





3\. \*\*Step 3: 상세 페이지 및 비교 기능 개발\*\*

\* 병상수, 간호인력 1등급 여부, 진료과목, 비급여/비용 정보, 로드뷰 및 전화 연결 기능.





4\. \*\*Step 4: 기존 엔터테인먼트 기능 마이그레이션\*\*

\* `/healing` 또는 `/lounge` 경로 아래로 사주(`saju`), 타로(`tarot-room`), 게임을 서브 메뉴로 깔끔하게 이전.





✅ \*\*한방병원, 한의원, 요양병원, 호스피스(완화의료)\*\* 전문 데이터 적재를 위한 \*\*PostgreSQL (Supabase/PostGIS 호환) DB 스키마\*\*와 공공데이터포털(심평원) Open API 연동 수집 스크립트(TypeScript/Node.js)입니다.



\---



\### 1. PostgreSQL DB 스키마 (`schema.sql`)



위치 기반 반경 검색(PostGIS)과 요양기관별 상세 속성(병상 수, 간호등급, 평가등급 등)을 체계적으로 관리할 수 있도록 설계했습니다.



```sql

\-- PostGIS 확장 활성화 (위치 기반 반경 검색용)

CREATE EXTENSION IF NOT EXISTS postgis;



\-- 1. 병의원/요양시설 기본 정보 테이블

CREATE TABLE IF NOT EXISTS healthcare\_facilities (

&#x20;   id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&#x20;   ykiho VARCHAR(100) UNIQUE NOT NULL,       -- 심평원 암호화 요양기호 (고유키)

&#x20;   name VARCHAR(255) NOT NULL,               -- 요양기관명

&#x20;   category\_code VARCHAR(10) NOT NULL,       -- 종별코드 (21: 요양병원, 28: 한방병원, 93: 한의원 등)

&#x20;   category\_name VARCHAR(50) NOT NULL,       -- 종별구분 (한방병원, 한의원, 요양병원, 호스피스전문기관 등)

&#x20;   is\_hospice BOOLEAN DEFAULT FALSE,         -- 호스피스 완화의료 지정 여부

&#x20;   

&#x20;   -- 주소 및 위치 정보

&#x20;   post\_no VARCHAR(10),                      -- 우편번호

&#x20;   address TEXT NOT NULL,                    -- 기본 주소

&#x20;   sido\_code VARCHAR(10),                    -- 시도코드

&#x20;   sido\_name VARCHAR(50),                    -- 시도명 (서울특별시, 경기도 등)

&#x20;   sggu\_code VARCHAR(10),                    -- 시군구코드

&#x20;   sggu\_name VARCHAR(50),                    -- 시군구명 (강남구, 분당구 등)

&#x20;   emdong\_name VARCHAR(50),                  -- 읍면동명

&#x20;   

&#x20;   tel VARCHAR(30),                          -- 전화번호

&#x20;   url TEXT,                                 -- 병원 홈페이지 URL

&#x20;   established\_date DATE,                    -- 개설일자

&#x20;   

&#x20;   -- 지리 정보 (PostGIS Point)

&#x20;   latitude DOUBLE PRECISION,                -- 위도 (Y)

&#x20;   longitude DOUBLE PRECISION,               -- 경도 (X)

&#x20;   geom GEOMETRY(Point, 4326),               -- 공간 인덱싱용 좌표

&#x20;   

&#x20;   created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

&#x20;   updated\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);



\-- 공간 인덱스 및 검색 최적화 인덱스 생성

CREATE INDEX IF NOT EXISTS idx\_facilities\_geom ON healthcare\_facilities USING GIST (geom);

CREATE INDEX IF NOT EXISTS idx\_facilities\_category ON healthcare\_facilities (category\_code);

CREATE INDEX IF NOT EXISTS idx\_facilities\_sido\_sggu ON healthcare\_facilities (sido\_name, sggu\_name);

CREATE INDEX IF NOT EXISTS idx\_facilities\_is\_hospice ON healthcare\_facilities (is\_hospice);



\-- 2. 시설 상세 정보 (병상수, 인력, 간호등급, 적정성평가)

CREATE TABLE IF NOT EXISTS facility\_details (

&#x20;   id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),

&#x20;   facility\_id UUID REFERENCES healthcare\_facilities(id) ON DELETE CASCADE,

&#x20;   ykiho VARCHAR(100) UNIQUE NOT NULL,

&#x20;   

&#x20;   total\_beds INT DEFAULT 0,                 -- 총 병상수

&#x20;   general\_beds INT DEFAULT 0,               -- 일반 입원실 병상수

&#x20;   icu\_beds INT DEFAULT 0,                   -- 중환자실 병상수

&#x20;   

&#x20;   doctor\_count INT DEFAULT 0,               -- 의사/한의사 총 인력수

&#x20;   specialist\_count INT DEFAULT 0,           -- 전문의 수

&#x20;   

&#x20;   grade\_evaluation VARCHAR(10),             -- 심평원 적정성 평가등급 (1\~5등급)

&#x20;   nursing\_grade VARCHAR(10),                -- 간호인력 확보수준 등급 (1\~7등급)

&#x20;   

&#x20;   treatments JSONB DEFAULT '\[]'::jsonb,     -- 진료과목 목록 (예: \["한방내과", "침구과", "재활의학과"])

&#x20;   special\_treatments JSONB DEFAULT '\[]'::jsonb, -- 특수진료/클리닉 정보 (예: \["도수치료", "혈액투석"])

&#x20;   

&#x20;   updated\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);



\-- 트리거: 위경도 입력 시 PostGIS geometry 자동 생성/갱신

CREATE OR REPLACE FUNCTION update\_facility\_geom()

RETURNS TRIGGER AS $$

BEGIN

&#x20;   IF NEW.longitude IS NOT NULL AND NEW.latitude IS NOT NULL THEN

&#x20;       NEW.geom = ST\_SetSRID(ST\_MakePoint(NEW.longitude, NEW.latitude), 4326);

&#x20;   END IF;

&#x20;   NEW.updated\_at = NOW();

&#x20;   RETURN NEW;

END;

$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER trg\_update\_facility\_geom

BEFORE INSERT OR UPDATE ON healthcare\_facilities

FOR EACH ROW EXECUTE FUNCTION update\_facility\_geom();



```



\---



\### 2. 심평원 API 연동 및 데이터 수집 스크립트 (`syncHiraData.ts`)



공공데이터포털의 \*\*`건강보험심사평가원\_병원정보서비스`\*\* (BdrgHospInfoService) 엔드포인트를 호출하여 대상 종별코드를 일괄 적재 및 갱신(Upsert)하는 로직입니다.



```typescript

import axios from 'axios';

import { createClient } from '@supabase/supabase-js';



// Supabase 클라이언트 설정 (또는 pg/pg-promise 사용)

const supabase = createClient(

&#x20; process.env.SUPABASE\_URL || '',

&#x20; process.env.SUPABASE\_SERVICE\_ROLE\_KEY || ''

);



const HIRA\_API\_KEY = process.env.HIRA\_SERVICE\_KEY || ''; // 공공데이터포털 디코딩 인증키

const BASE\_URL = 'http://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList';



/\*\*

&#x20;\* 수집 대상 종별코드 (심평원 clCd)

&#x20;\* - 21: 요양병원

&#x20;\* - 28: 한방병원

&#x20;\* - 93: 한의원

&#x20;\*/

const TARGET\_CATEGORIES = \[

&#x20; { code: '21', name: '요양병원' },

&#x20; { code: '28', name: '한방병원' },

&#x20; { code: '93', name: '한의원' },

];



interface HiraHospitalItem {

&#x20; ykiho: string;       // 암호화 요양기호

&#x20; yadmNm: string;      // 병원명

&#x20; clCd: string;        // 종별코드

&#x20; clCdNm: string;      // 종별코드명

&#x20; sidoCdNm: string;    // 시도명

&#x20; sgguCdNm: string;    // 시군구명

&#x20; emdongNm?: string;   // 읍면동명

&#x20; postNo?: string;     // 우편번호

&#x20; addr: string;        // 주소

&#x20; telno?: string;      // 전화번호

&#x20; hospUrl?: string;    // 홈페이지

&#x20; estbDtm?: string;    // 개설일자

&#x20; XPos?: string;       // 경도 (Longitude)

&#x20; YPos?: string;       // 위도 (Latitude)

}



/\*\*

&#x20;\* 1. 단일 종별코드에 대해 페이지네이션 순회 수집

&#x20;\*/

async function fetchAndSyncByCategory(categoryCode: string, categoryName: string) {

&#x20; let pageNo = 1;

&#x20; const numOfRows = 100; // 1회 요청당 가져올 행 수

&#x20; let totalCount = 0;



&#x20; console.log(`\\n🚀 \[${categoryName} (${categoryCode})] 데이터 동기화 시작...`);



&#x20; while (true) {

&#x20;   try {

&#x20;     const response = await axios.get(BASE\_URL, {

&#x20;       params: {

&#x20;         serviceKey: HIRA\_API\_KEY,

&#x20;         pageNo,

&#x20;         numOfRows,

&#x20;         clCd: categoryCode,

&#x20;         \_type: 'json',

&#x20;       },

&#x20;       timeout: 10000,

&#x20;     });



&#x20;     const body = response.data?.response?.body;

&#x20;     if (!body || !body.items || !body.items.item) {

&#x20;       console.log(`\[${categoryName}] 데이터가 없거나 수집 완료 (Page ${pageNo})`);

&#x20;       break;

&#x20;     }



&#x20;     totalCount = body.totalCount;

&#x20;     const rawItems = Array.isArray(body.items.item) ? body.items.item : \[body.items.item];

&#x20;     const items: HiraHospitalItem\[] = rawItems;



&#x20;     // Supabase / DB Upsert용 레코드 매핑

&#x20;     const records = items.map((item) => {

&#x20;       const isHospiceCandidate = item.yadmNm.includes('호스피스') || item.yadmNm.includes('완화의료');

&#x20;       const lat = item.YPos ? parseFloat(item.YPos) : null;

&#x20;       const lng = item.XPos ? parseFloat(item.XPos) : null;



&#x20;       // YYYYMMDD -> YYYY-MM-DD 포맷 변환

&#x20;       let estDate = null;

&#x20;       if (item.estbDtm \&\& item.estbDtm.length === 8) {

&#x20;         estDate = `${item.estbDtm.substring(0, 4)}-${item.estbDtm.substring(4, 6)}-${item.estbDtm.substring(6, 8)}`;

&#x20;       }



&#x20;       return {

&#x20;         ykiho: item.ykiho,

&#x20;         name: item.yadmNm,

&#x20;         category\_code: item.clCd,

&#x20;         category\_name: item.clCdNm || categoryName,

&#x20;         is\_hospice: isHospiceCandidate,

&#x20;         post\_no: item.postNo || null,

&#x20;         address: item.addr,

&#x20;         sido\_name: item.sidoCdNm || null,

&#x20;         sggu\_name: item.sgguCdNm || null,

&#x20;         emdong\_name: item.emdongNm || null,

&#x20;         tel: item.telno || null,

&#x20;         url: item.hospUrl || null,

&#x20;         established\_date: estDate,

&#x20;         latitude: lat,

&#x20;         longitude: lng,

&#x20;       };

&#x20;     });



&#x20;     // PostgreSQL DB Upsert 실행 (ykiho 충돌 시 정보 갱신)

&#x20;     const { error } = await supabase

&#x20;       .from('healthcare\_facilities')

&#x20;       .upsert(records, { onConflict: 'ykiho' });



&#x20;     if (error) {

&#x20;       console.error(`❌ DB 적재 에러 (Page ${pageNo}):`, error.message);

&#x20;     } else {

&#x20;       console.log(`✅ \[${categoryName}] Page ${pageNo}/${Math.ceil(totalCount / numOfRows)} 적재 완료 (${records.length}건)`);

&#x20;     }



&#x20;     if (pageNo \* numOfRows >= totalCount) {

&#x20;       break; // 마지막 페이지 도달

&#x20;     }



&#x20;     pageNo++;

&#x20;     // API Rate Limit 방지용 딜레이 (150ms)

&#x20;     await new Promise((resolve) => setTimeout(resolve, 150));

&#x20;   } catch (err: any) {

&#x20;     console.error(`🚨 API 요청 실패 (Page ${pageNo}):`, err.message);

&#x20;     break;

&#x20;   }

&#x20; }



&#x20; console.log(`✨ \[${categoryName}] 동기화 종료 (총 ${totalCount}건)`);

}



/\*\*

&#x20;\* 2. 전체 동기화 실행 함수

&#x20;\*/

export async function runFullSync() {

&#x20; console.log('=== Calamus Care 심평원 데이터 배치 수집 시작 ===');

&#x20; for (const cat of TARGET\_CATEGORIES) {

&#x20;   await fetchAndSyncByCategory(cat.code, cat.name);

&#x20; }

&#x20; console.log('\\n🎉 모든 데이터 동기화가 성공적으로 완료되었습니다.');

}



// 직접 실행 시

if (require.main === module) {

&#x20; runFullSync().catch(console.error);

}



```



\---



\### 3. 반경 n km 내 시설 검색 SQL 쿼리 예시 (지도 연동용)



사용자의 현재 위치(경도, 위도)를 기준으로 특정 종별(한방병원, 요양병원 등)을 가까운 순으로 가져오는 함수입니다.



```sql

\-- 특정 위/경도 기준 5km 반경 내 시설 검색 함수

CREATE OR REPLACE FUNCTION get\_nearby\_facilities(

&#x20;   user\_lat DOUBLE PRECISION,

&#x20;   user\_lng DOUBLE PRECISION,

&#x20;   radius\_meters DOUBLE PRECISION DEFAULT 5000,

&#x20;   target\_category VARCHAR DEFAULT NULL

)

RETURNS TABLE (

&#x20;   id UUID,

&#x20;   name VARCHAR,

&#x20;   category\_name VARCHAR,

&#x20;   address TEXT,

&#x20;   tel VARCHAR,

&#x20;   distance\_meters DOUBLE PRECISION,

&#x20;   latitude DOUBLE PRECISION,

&#x20;   longitude DOUBLE PRECISION

) AS $$

BEGIN

&#x20;   RETURN QUERY

&#x20;   SELECT 

&#x20;       f.id,

&#x20;       f.name,

&#x20;       f.category\_name,

&#x20;       f.address,

&#x20;       f.tel,

&#x20;       ST\_Distance(

&#x20;           f.geom::geography,

&#x20;           ST\_SetSRID(ST\_MakePoint(user\_lng, user\_lat), 4326)::geography

&#x20;       ) AS distance\_meters,

&#x20;       f.latitude,

&#x20;       f.longitude

&#x20;   FROM healthcare\_facilities f

&#x20;   WHERE 

&#x20;       f.geom IS NOT NULL

&#x20;       AND ST\_DWithin(

&#x20;           f.geom::geography,

&#x20;           ST\_SetSRID(ST\_MakePoint(user\_lng, user\_lat), 4326)::geography,

&#x20;           radius\_meters

&#x20;       )

&#x20;       AND (target\_category IS NULL OR f.category\_code = target\_category)

&#x20;   ORDER BY distance\_meters ASC

&#x20;   LIMIT 50;

END;

$$ LANGUAGE plpgsql;





✅ \*\*Calamus Care 메인 홈 화면 및 카카오맵 기반 병의원 필터·검색 React 컴포넌트\*\*입니다.



Tailwind CSS와 Lucide React 아이콘을 사용하며, 좌측 필터/목록 패널과 우측 카카오 인터랙티브 지도가 동기화되는 분할 뷰 구조입니다.



\---



\### 1. 타입 정의 (`types.ts`)



```typescript

export interface Facility {

&#x20; id: string;

&#x20; name: string;

&#x20; category\_code: '28' | '93' | '21' | 'hospice';

&#x20; category\_name: string;

&#x20; address: string;

&#x20; tel: string | null;

&#x20; latitude: number;

&#x20; longitude: number;

&#x20; grade\_evaluation?: string; // 1등급 등

&#x20; total\_beds?: number;

&#x20; is\_hospice?: boolean;

}



export type CategoryFilter = 'ALL' | '28' | '93' | '21' | 'hospice';



```



\---



\### 2. 카카오맵 연동 병원 검색 컴포넌트 (`FacilityMapSearch.tsx`)



지도 마커 렌더링, 인포윈도우 연동, 카테고리 필터(한방병원·한의원·요양병원·호스피스) 및 키워드 검색을 지원합니다.



```tsx

import React, { useEffect, useRef, useState } from 'react';

import { Search, MapPin, Phone, Bed, Award, Compass } from 'lucide-react';

import { Facility, CategoryFilter } from './types';



// Mock Data (실제 환경에서는 Supabase/API 연동)

const MOCK\_FACILITIES: Facility\[] = \[

&#x20; {

&#x20;   id: '1',

&#x20;   name: '경희본한방병원',

&#x20;   category\_code: '28',

&#x20;   category\_name: '한방병원',

&#x20;   address: '서울특별시 강남구 테헤란로 123',

&#x20;   tel: '02-1234-5678',

&#x20;   latitude: 37.498095,

&#x20;   longitude: 127.02761,

&#x20;   total\_beds: 65,

&#x20; },

&#x20; {

&#x20;   id: '2',

&#x20;   name: '늘푸른요양병원',

&#x20;   category\_code: '21',

&#x20;   category\_name: '요양병원',

&#x20;   address: '서울특별시 강남구 역삼로 456',

&#x20;   tel: '02-9876-5432',

&#x20;   latitude: 37.495095,

&#x20;   longitude: 127.03261,

&#x20;   grade\_evaluation: '1등급',

&#x20;   total\_beds: 180,

&#x20; },

&#x20; {

&#x20;   id: '3',

&#x20;   name: '세브란스 완화의료센터',

&#x20;   category\_code: 'hospice',

&#x20;   category\_name: '호스피스전문기관',

&#x20;   address: '서울특별시 서초구 반포대로 789',

&#x20;   tel: '02-5555-4444',

&#x20;   latitude: 37.502095,

&#x20;   longitude: 127.02261,

&#x20;   is\_hospice: true,

&#x20;   total\_beds: 24,

&#x20; },

&#x20; {

&#x20;   id: '4',

&#x20;   name: '맑은숲한의원',

&#x20;   category\_code: '93',

&#x20;   category\_name: '한의원',

&#x20;   address: '서울특별시 강남구 논현로 321',

&#x20;   tel: '02-3333-2222',

&#x20;   latitude: 37.505095,

&#x20;   longitude: 127.03061,

&#x20; },

];



declare global {

&#x20; interface Window {

&#x20;   kakao: any;

&#x20; }

}



export const FacilityMapSearch: React.FC = () => {

&#x20; const mapContainer = useRef<HTMLDivElement>(null);

&#x20; const \[map, setMap] = useState<any>(null);

&#x20; const \[markers, setMarkers] = useState<any\[]>(\[]);

&#x20; const \[selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

&#x20; const \[activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');

&#x20; const \[searchTerm, setSearchTerm] = useState('');



&#x20; // 1. 카카오맵 초기화

&#x20; useEffect(() => {

&#x20;   const initMap = () => {

&#x20;     if (!window.kakao || !window.kakao.maps || !mapContainer.current) return;

&#x20;     const options = {

&#x20;       center: new window.kakao.maps.LatLng(37.498095, 127.02761),

&#x20;       level: 5,

&#x20;     };

&#x20;     const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);

&#x20;     setMap(kakaoMap);

&#x20;   };



&#x20;   if (window.kakao \&\& window.kakao.maps) {

&#x20;     initMap();

&#x20;   } else {

&#x20;     // index.html에 카카오 SDK가 없거나 동적 로딩이 필요한 경우

&#x20;     const script = document.createElement('script');

&#x20;     script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT\_PUBLIC\_KAKAO\_MAP\_KEY || 'YOUR\_KAKAO\_JS\_KEY'}\&autoload=false`;

&#x20;     script.onload = () => {

&#x20;       window.kakao.maps.load(initMap);

&#x20;     };

&#x20;     document.head.appendChild(script);

&#x20;   }

&#x20; }, \[]);



&#x20; // 2. 필터링된 데이터

&#x20; const filteredFacilities = MOCK\_FACILITIES.filter((fac) => {

&#x20;   const matchesCategory =

&#x20;     activeCategory === 'ALL' ||

&#x20;     (activeCategory === 'hospice' ? fac.is\_hospice : fac.category\_code === activeCategory);

&#x20;   const matchesSearch =

&#x20;     fac.name.includes(searchTerm) || fac.address.includes(searchTerm);

&#x20;   return matchesCategory \&\& matchesSearch;

&#x20; });



&#x20; // 3. 지도 마커 갱신

&#x20; useEffect(() => {

&#x20;   if (!map || !window.kakao) return;



&#x20;   // 기존 마커 제거

&#x20;   markers.forEach((m) => m.setMap(null));

&#x20;   const newMarkers: any\[] = \[];



&#x20;   filteredFacilities.forEach((facility) => {

&#x20;     const position = new window.kakao.maps.LatLng(facility.latitude, facility.longitude);

&#x20;     const marker = new window.kakao.maps.Marker({

&#x20;       position,

&#x20;       map,

&#x20;     });



&#x20;     window.kakao.maps.event.addListener(marker, 'click', () => {

&#x20;       setSelectedFacility(facility);

&#x20;       map.panTo(position);

&#x20;     });



&#x20;     newMarkers.push(marker);

&#x20;   });



&#x20;   setMarkers(newMarkers);

&#x20; }, \[map, activeCategory, searchTerm]);



&#x20; // 목록 클릭 시 해당 마커로 포커스

&#x20; const handleSelectFacility = (fac: Facility) => {

&#x20;   setSelectedFacility(fac);

&#x20;   if (map \&\& window.kakao) {

&#x20;     const moveLatLon = new window.kakao.maps.LatLng(fac.latitude, fac.longitude);

&#x20;     map.setLevel(4);

&#x20;     map.panTo(moveLatLon);

&#x20;   }

&#x20; };



&#x20; return (

&#x20;   <div className="flex flex-col lg:flex-row h-\[750px] w-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl">

&#x20;     {/\* 좌측 패널: 검색 \& 목록 \*/}

&#x20;     <div className="w-full lg:w-5/12 flex flex-col h-full border-r border-slate-200">

&#x20;       {/\* 검색 및 필터 헤더 \*/}

&#x20;       <div className="p-4 border-b border-slate-100 bg-slate-50">

&#x20;         <div className="relative mb-3">

&#x20;           <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

&#x20;           <input

&#x20;             type="text"

&#x20;             placeholder="기관명, 지역명으로 검색 (예: 강남구, 경희)"

&#x20;             value={searchTerm}

&#x20;             onChange={(e) => setSearchTerm(e.target.value)}

&#x20;             className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"

&#x20;           />

&#x20;         </div>



&#x20;         {/\* 카테고리 탭 \*/}

&#x20;         <div className="flex flex-wrap gap-1.5 text-xs font-medium">

&#x20;           {\[

&#x20;             { label: '전체', value: 'ALL' },

&#x20;             { label: '한방병원', value: '28' },

&#x20;             { label: '한의원', value: '93' },

&#x20;             { label: '요양병원', value: '21' },

&#x20;             { label: '호스피스', value: 'hospice' },

&#x20;           ].map((tab) => (

&#x20;             <button

&#x20;               key={tab.value}

&#x20;               onClick={() => setActiveCategory(tab.value as CategoryFilter)}

&#x20;               className={`rounded-lg px-3 py-1.5 transition-colors ${

&#x20;                 activeCategory === tab.value

&#x20;                   ? 'bg-emerald-700 text-white font-semibold shadow-sm'

&#x20;                   : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'

&#x20;               }`}

&#x20;             >

&#x20;               {tab.label}

&#x20;             </button>

&#x20;           ))}

&#x20;         </div>

&#x20;       </div>



&#x20;       {/\* 시설 리스트 \*/}

&#x20;       <div className="flex-1 overflow-y-auto p-4 space-y-3">

&#x20;         <div className="text-xs text-slate-500 font-medium mb-1">

&#x20;           검색 결과 <span className="text-emerald-700 font-bold">{filteredFacilities.length}</span>곳

&#x20;         </div>



&#x20;         {filteredFacilities.map((fac) => {

&#x20;           const isSelected = selectedFacility?.id === fac.id;

&#x20;           return (

&#x20;             <div

&#x20;               key={fac.id}

&#x20;               onClick={() => handleSelectFacility(fac)}

&#x20;               className={`cursor-pointer rounded-xl p-4 transition-all border ${

&#x20;                 isSelected

&#x20;                   ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-1 ring-emerald-600'

&#x20;                   : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'

&#x20;               }`}

&#x20;             >

&#x20;               <div className="flex items-start justify-between">

&#x20;                 <div>

&#x20;                   <span className="inline-block rounded bg-emerald-100 px-2 py-0.5 text-\[11px] font-semibold text-emerald-800 mb-1">

&#x20;                     {fac.category\_name}

&#x20;                   </span>

&#x20;                   <h3 className="text-base font-bold text-slate-900">{fac.name}</h3>

&#x20;                 </div>

&#x20;                 {fac.grade\_evaluation \&\& (

&#x20;                   <span className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-\[11px] font-bold text-amber-700">

&#x20;                     <Award className="h-3 w-3" />

&#x20;                     심평원 {fac.grade\_evaluation}

&#x20;                   </span>

&#x20;                 )}

&#x20;               </div>



&#x20;               <p className="mt-2 flex items-center text-xs text-slate-500">

&#x20;                 <MapPin className="mr-1 h-3.5 w-3.5 flex-shrink-0 text-slate-400" />

&#x20;                 {fac.address}

&#x20;               </p>



&#x20;               <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-600">

&#x20;                 {fac.tel \&\& (

&#x20;                   <span className="flex items-center gap-1">

&#x20;                     <Phone className="h-3 w-3 text-slate-400" />

&#x20;                     {fac.tel}

&#x20;                   </span>

&#x20;                 )}

&#x20;                 {fac.total\_beds \&\& (

&#x20;                   <span className="flex items-center gap-1 text-slate-500">

&#x20;                     <Bed className="h-3.5 w-3.5 text-slate-400" />

&#x20;                     병상 {fac.total\_beds}개

&#x20;                   </span>

&#x20;                 )}

&#x20;               </div>

&#x20;             </div>

&#x20;           );

&#x20;         })}



&#x20;         {filteredFacilities.length === 0 \&\& (

&#x20;           <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">

&#x20;             <Compass className="h-8 w-8 mb-2 stroke-1" />

&#x20;             <p className="text-sm">조건에 일치하는 기관이 없습니다.</p>

&#x20;           </div>

&#x20;         )}

&#x20;       </div>

&#x20;     </div>



&#x20;     {/\* 우측 패널: 카카오 지도 \*/}

&#x20;     <div className="w-full lg:w-7/12 h-full relative">

&#x20;       <div ref={mapContainer} className="w-full h-full" />

&#x20;     </div>

&#x20;   </div>

&#x20; );

};



```



\---



\### 3. 포털 메인 홈 화면 (`CalamusHomePage.tsx`)



전문 케어 포털의 정체성을 보여주는 히어로 섹션, 퀵 바로가기, 메디컬 매거진 및 하단 '힐링 라운지(사주/타로)' 배너가 포함된 통합 레이아웃입니다.



```tsx

import React from 'react';

import { FacilityMapSearch } from './FacilityMapSearch';

import { 

&#x20; Building2, 

&#x20; HeartHandshake, 

&#x20; Sparkles, 

&#x20; ShieldCheck, 

&#x20; BookOpen, 

&#x20; ArrowRight,

&#x20; SunMedium

} from 'lucide-react';



export const CalamusHomePage: React.FC = () => {

&#x20; return (

&#x20;   <div className="min-h-screen bg-slate-50 text-slate-800">

&#x20;     {/\* 1. GNB 헤더 \*/}

&#x20;     <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">

&#x20;       <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

&#x20;         <div className="flex items-center gap-2">

&#x20;           <span className="h-8 w-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-black text-lg">C</span>

&#x20;           <span className="text-xl font-bold tracking-tight text-slate-900">

&#x20;             Calamus <span className="text-emerald-700 font-medium">Care</span>

&#x20;           </span>

&#x20;         </div>



&#x20;         <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">

&#x20;           <a href="#search" className="hover:text-emerald-700 transition-colors">한방의료</a>

&#x20;           <a href="#search" className="hover:text-emerald-700 transition-colors">요양·실버케어</a>

&#x20;           <a href="#search" className="hover:text-emerald-700 transition-colors">호스피스 완화의료</a>

&#x20;           <a href="#magazine" className="hover:text-emerald-700 transition-colors">케어 가이드</a>

&#x20;           <a href="#lounge" className="flex items-center gap-1 text-emerald-800 font-semibold hover:text-emerald-900">

&#x20;             <Sparkles className="h-4 w-4" /> 힐링 라운지

&#x20;           </a>

&#x20;         </nav>

&#x20;       </div>

&#x20;     </header>



&#x20;     {/\* 2. Hero 섹션 \*/}

&#x20;     <section className="bg-gradient-to-b from-emerald-900 to-slate-900 text-white py-16 px-4 sm:px-6">

&#x20;       <div className="max-w-5xl mx-auto text-center">

&#x20;         <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800/60 border border-emerald-500/30 px-3.5 py-1 text-xs font-medium text-emerald-200 mb-4">

&#x20;           <ShieldCheck className="h-3.5 w-3.5" /> 건강보험심사평가원 공공데이터 실시간 연계

&#x20;         </span>

&#x20;         <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">

&#x20;           우리 가족에게 꼭 맞는 <br className="hidden sm:inline" />

&#x20;           <span className="text-emerald-400">한방병원, 요양병원, 호스피스</span> 전문 검색

&#x20;         </h1>

&#x20;         <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">

&#x20;           심평원 적정성 평가 1등급 요양병원부터 전문 한방의료기관, 따뜻한 완화의료 시설까지 신뢰할 수 있는 정보를 제공합니다.

&#x20;         </p>



&#x20;         {/\* 퀵 바로가기 카드 \*/}

&#x20;         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 max-w-4xl mx-auto text-left">

&#x20;           {\[

&#x20;             { title: '한방병원/의원', desc: '전문의·입원실 정보', icon: Building2 },

&#x20;             { title: '1등급 요양병원', desc: '적정성 평가 우수기관', icon: ShieldCheck },

&#x20;             { title: '호스피스 완화의료', desc: '입원형·가정형 케어', icon: HeartHandshake },

&#x20;             { title: '케어 매거진', desc: '입원 가이드 \& 비용 비교', icon: BookOpen },

&#x20;           ].map((item, idx) => {

&#x20;             const Icon = item.icon;

&#x20;             return (

&#x20;               <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-xl hover:bg-white/15 transition cursor-pointer">

&#x20;                 <Icon className="h-5 w-5 text-emerald-400 mb-2" />

&#x20;                 <div className="font-semibold text-sm text-white">{item.title}</div>

&#x20;                 <div className="text-\[11px] text-slate-300 mt-0.5">{item.desc}</div>

&#x20;               </div>

&#x20;             );

&#x20;           })}

&#x20;         </div>

&#x20;       </div>

&#x20;     </section>



&#x20;     {/\* 3. 지도 및 검색 필터 섹션 \*/}

&#x20;     <section id="search" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

&#x20;       <div className="mb-6">

&#x20;         <h2 className="text-2xl font-bold text-slate-900">지역별 맞춤 시설 찾기</h2>

&#x20;         <p className="text-sm text-slate-500 mt-1">심평원에 등록된 공식 인력 및 병상 데이터를 실시간으로 조회합니다.</p>

&#x20;       </div>



&#x20;       <FacilityMapSearch />

&#x20;     </section>



&#x20;     {/\* 4. 힐링 라운지 (기존 사주·타로 마이그레이션 배너) \*/}

&#x20;     <section id="lounge" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 mb-12">

&#x20;       <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-lg">

&#x20;         <div className="relative z-10 max-w-2xl">

&#x20;           <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-2">

&#x20;             <SunMedium className="h-4 w-4" /> Calamus Mind \& Fortune

&#x20;           </div>

&#x20;           <h3 className="text-2xl font-bold">잠시 쉬어가는 마음 쉼터, 힐링 라운지</h3>

&#x20;           <p className="mt-2 text-sm text-slate-300">

&#x20;             현대적인 오행 데이터 기반 사주 분석과 AI 타로 챗으로 일상의 고민과 마음을 가볍게 점검해 보세요.

&#x20;           </p>

&#x20;           <div className="mt-6 flex flex-wrap gap-3">

&#x20;             <a

&#x20;               href="/saju"

&#x20;               className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-medium text-white transition"

&#x20;             >

&#x20;               사주 오행 리포트 바로가기 <ArrowRight className="h-4 w-4" />

&#x20;             </a>

&#x20;             <a

&#x20;               href="/tarot-room"

&#x20;               className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition"

&#x20;             >

&#x20;               AI 타로룸 입장하기 <Sparkles className="h-4 w-4" />

&#x20;             </a>

&#x20;           </div>

&#x20;         </div>

&#x20;       </div>

&#x20;     </section>

&#x20;   </div>

&#x20; );

};



```

\---

