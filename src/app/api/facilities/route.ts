import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Facility, CategoryFilter } from '@/types/facility';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get('category') || 'ALL') as CategoryFilter;
    const query = (searchParams.get('query') || '').trim();
    const sido = searchParams.get('sido') || '';
    const grade = searchParams.get('grade') || '';
    const pageNo = Math.max(1, parseInt(searchParams.get('pageNo') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '30', 10)));
    const from = (pageNo - 1) * pageSize;
    const to = from + pageSize - 1;

    let dbQuery = supabase
      .from('hosapi_hospital')
      .select('*', { count: 'exact' });

    // 1. 카테고리 필터
    if (category !== 'ALL') {
      if (category === 'hospice') {
        dbQuery = dbQuery.eq('is_hospice', true);
      } else {
        dbQuery = dbQuery.eq('category_code', category);
      }
    }

    // 2. 시도 필터
    if (sido && sido !== 'ALL') {
      dbQuery = dbQuery.ilike('sido_name', `%${sido}%`);
    }

    // 3. 다중 키워드 AND 검색 (공백 및 슬래시 구분: "한방병원 용인", "요양병원 수원", "유방암 1등급")
    if (query) {
      const tokens = query.split(/[\s/]+/).filter((t: string) => t.length > 0);
      tokens.forEach((token: string) => {
        dbQuery = dbQuery.or(
          `name.ilike.%${token}%,address.ilike.%${token}%,category_name.ilike.%${token}%,search_keywords.ilike.%${token}%`
        );
      });
    }

    // 정렬: 의사수 많은 순
    dbQuery = dbQuery.order('doctor_total_cnt', { ascending: false }).range(from, to);


    const { data: hospitals, count, error } = await dbQuery;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    const facilities: Facility[] = (hospitals || []).map((h) => ({
      id: h.ykiho || h.id,
      ykiho: h.ykiho,
      name: h.name,
      category_code: (h.category_code || '21') as any,
      category_name: h.category_name || '병원',
      is_hospice: h.is_hospice,
      address: h.address || '',
      sido_name: h.sido_name || undefined,
      sggu_name: h.sggu_name || undefined,
      emdong_name: h.emdong_name || undefined,
      tel: h.tel || null,
      url: h.url || null,
      latitude: h.latitude || 37.5665,
      longitude: h.longitude || 126.978,
      doctor_count: h.doctor_total_cnt || 0,
      specialist_count: h.specialist_cnt || 0,
    }));

    return NextResponse.json({
      success: true,
      total: count || facilities.length,
      data: facilities,
      source: 'supabase_db',
    });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

