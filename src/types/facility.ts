export type FacilityCategoryCode = '01' | '11' | '21' | '28' | '92' | '93' | 'general' | 'oriental' | 'hospice';

export type CategoryFilter = 'ALL' | FacilityCategoryCode;


export interface FacilityEquipment {
  eqpName: string; // 장비명 (MRI, CT, PET-CT, 체외충격파 등)
  count?: number; // 보유대수
}

export interface FacilityTransport {
  traffic?: string; // 오시는 길 / 지하철 / 버스
  parking?: string; // 주차 가능 여부 / 주차 대수
}

export interface FacilityDetailInfo {
  ykiho: string;
  name: string;
  totalBeds?: number; // 총 병상수
  generalBeds?: number; // 일반입원실
  icuBeds?: number; // 중환자실
  specialistCount?: number; // 전문의 수
  doctorCount?: number; // 의사 총수
  nursingGrade?: string; // 간호등급
  equipments?: string[]; // 보유 의료장비 목록
  treatments?: string[]; // 개설 진료과목
  specialTreatments?: string[]; // 특수진료 및 특화 클리닉
  transport?: FacilityTransport; // 교통 및 주차
  mealAddPrice?: boolean; // 식대가산
  emergencyRoom?: string; // 응급실 운영 여부
}

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
  equipments?: string[]; // 의료장비 (CT, MRI 등)
  transport?: FacilityTransport; // 교통 및 오시는 길
  special_hospital_field?: string | null; // 전문병원 지정분야
  detailed_info?: {
    parking_count?: number;
    parking_cost?: string;
    parking_memo?: string;
    sun_closed?: string;
    holiday_closed?: string;
    er_day_yn?: string;
    er_day_tel?: string;
    er_night_yn?: string;
    er_night_tel?: string;
    lunch_weekday?: string;
    lunch_sat?: string;
    rcpt_weekday?: string;
    rcpt_sat?: string;
    mon_time?: string;
    sat_time?: string;
  };
  meal_info?: string[];
  other_staff?: string[];
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
