import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ykiho = searchParams.get('ykiho');
    const id = searchParams.get('id');

    if (!ykiho && !id) {
      return NextResponse.json({ success: false, message: 'ykiho or id required' }, { status: 400 });
    }

    const targetKey = ykiho || id;

    // 1. 기본 정보 조회 (hosapi_hospital)
    const { data: hospital } = await supabase
      .from('hosapi_hospital')
      .select('*')
      .eq('ykiho', targetKey)
      .maybeSingle();

    // 2. 상세 정보 조회 (hosapi_hospital_detail)
    const { data: detail } = await supabase
      .from('hosapi_hospital_detail')
      .select('*')
      .eq('ykiho', targetKey)
      .maybeSingle();

    if (!hospital && !detail) {
      return NextResponse.json({ success: false, message: 'Facility not found' }, { status: 404 });
    }

    // 교통 및 주차 데이터 포맷팅
    let transportObj: { traffic?: string; parking?: string } | undefined = undefined;
    if (detail?.transports && Array.isArray(detail.transports) && detail.transports.length > 0) {
      transportObj = {
        traffic: detail.transports.join(' / '),
      };
    }

    const mergedFacility = {
      ...(hospital || {}),
      id: hospital?.ykiho || detail?.ykiho || targetKey,
      ykiho: hospital?.ykiho || detail?.ykiho,
      name: hospital?.name,
      address: hospital?.address,
      tel: hospital?.tel,
      url: hospital?.url,
      latitude: hospital?.latitude,
      longitude: hospital?.longitude,
      doctor_count: hospital?.doctor_total_cnt,
      specialist_count: hospital?.specialist_cnt,
      
      // 상세 데이터 매핑
      total_beds: detail?.total_beds || 0,
      general_beds: detail?.general_beds || 0,
      general_vip_beds: detail?.general_vip_beds || 0,
      icu_adult_beds: detail?.icu_adult_beds || 0,
      icu_child_beds: detail?.icu_child_beds || 0,
      er_beds: detail?.er_beds || 0,
      pt_beds: detail?.pt_beds || 0,
      isolated_beds: detail?.isolated_beds || 0,
      nursing_grade: detail?.nursing_grade,
      grade_evaluation: detail?.grade_evaluation,
      special_hospital_field: detail?.special_hospital_field,
      treatments: detail?.treatments || [],
      special_treatments: detail?.special_treatments || [],
      equipments: detail?.equipments || [],
      detailed_info: detail?.detailed_info || {},
      meal_info: detail?.meal_info || [],
      other_staff: detail?.other_staff || [],
      transport: transportObj,
    };


    return NextResponse.json({
      success: true,
      data: mergedFacility,
      source: 'supabase_db_detail',
    });
  } catch (err: any) {
    console.error('Detail API Error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

