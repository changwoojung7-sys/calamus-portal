/**
 * 심평원 종별코드 정의 (clCd)
 * 01: 상급종합병원 (서울대, 아산, 삼성서울 등)
 * 11: 종합병원
 * 21: 병원 (일반 양방)
 * 28: 요양병원 (또는 한방병원)
 * 92: 한방병원
 * 93: 한의원
 * hospice: 호스피스 완화의료 지정기관
 */
export type FacilityCategoryCode = '01' | '11' | '21' | '28' | '92' | '93' | 'hospice';

export type CategoryFilter = 'ALL' | FacilityCategoryCode;

export interface Facility {
  id: string;
  ykiho?: string;
  name: string;
  category_code: FacilityCategoryCode;
  category_name: string;
  address: string;
  sido_name?: string;
  sggu_name?: string;
  emdong_name?: string;
  tel?: string | null;
  url?: string | null;
  latitude: number;
  longitude: number;
  grade_evaluation?: string; // 심평원 종합 평가등급 (1~5등급)
  stroke_grade?: string; // 급성기 뇌졸중 평가등급 (asmGrd01)
  dialysis_grade?: string; // 혈액투석 평가등급 (asmGrd03)
  pneumonia_grade?: string; // 폐렴 평가등급 (asmGrd18)
  nursing_grade?: string; // 간호인력 등급 (1~7등급)
  total_beds?: number; // 총 병상수
  doctor_count?: number; // 총 의사 인력수 (drTotCnt)
  specialist_count?: number; // 전문의 수 (mdeptSdrCnt / cmdcSdrCnt)
  treatments?: string[]; // 개설 진료과목
  special_treatments?: string[]; // 특수진료 및 강점
  is_hospice?: boolean;
  distance_meters?: number;
}

export interface FacilitySearchParams {
  category?: CategoryFilter;
  query?: string;
  sido?: string;
  sggu?: string;
  grade?: string;
  isHospiceOnly?: boolean;
  userLat?: number;
  userLng?: number;
  radiusMeters?: number;
  pageNo?: number;
  pageSize?: number;
}
