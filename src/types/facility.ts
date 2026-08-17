export type FacilityCategoryCode = '28' | '93' | '21' | 'hospice';

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
  grade_evaluation?: string; // 심평원 적정성 평가등급 (1~5등급)
  nursing_grade?: string; // 간호등급 (1~7등급)
  total_beds?: number; // 총 병상수
  doctor_count?: number; // 의료진 수
  specialist_count?: number; // 전문의 수
  treatments?: string[]; // 진료과목
  special_treatments?: string[]; // 특수진료/클리닉
  is_hospice?: boolean;
  distance_meters?: number;
}

export interface FacilitySearchParams {
  category?: CategoryFilter;
  query?: string;
  sido?: string;
  sggu?: string;
  grade?: string; // 1등급 등
  isHospiceOnly?: boolean;
  userLat?: number;
  userLng?: number;
  radiusMeters?: number;
}
