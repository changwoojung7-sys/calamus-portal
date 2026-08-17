import { NextResponse } from 'next/server';
import { MOCK_FACILITIES } from '@/data/mockFacilities';
import { fetchHiraFacilities } from '@/lib/hira';
import { Facility, CategoryFilter } from '@/types/facility';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get('category') || 'ALL') as CategoryFilter;
  const query = (searchParams.get('query') || '').trim().toLowerCase();
  const grade = searchParams.get('grade') || '';
  const sido = searchParams.get('sido') || '';
  const pageNo = parseInt(searchParams.get('pageNo') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '30', 10);

  // 1. 심평원 실시간 API 호출 시도 (API 키가 등록되어 있고 유효할 경우)
  let liveItems: Facility[] = [];
  try {
    const hiraRes = await fetchHiraFacilities({
      clCd: category === 'ALL' || category === 'hospice' ? undefined : category,
      yadmNm: query || undefined,
      pageNo,
      numOfRows: pageSize,
    });
    liveItems = hiraRes.items;
  } catch {
    liveItems = [];
  }

  // 2. Mock 데이터와 병합 (실시간 데이터가 없을 시 Mock 데이터 우선 활용)
  let allFacilities = liveItems.length > 0 ? liveItems : MOCK_FACILITIES;

  // 3. 필터링 로직
  let filtered = allFacilities.filter((fac) => {
    // 카테고리 필터
    if (category !== 'ALL') {
      if (category === 'hospice') {
        if (!fac.is_hospice && fac.category_code !== 'hospice') return false;
      } else {
        if (fac.category_code !== category) return false;
      }
    }

    // 키워드 검색 (이름, 주소, 진료과목, 특수진료)
    if (query) {
      const matchName = fac.name.toLowerCase().includes(query);
      const matchAddr = fac.address.toLowerCase().includes(query);
      const matchTreatments = fac.treatments?.some((t) => t.toLowerCase().includes(query));
      const matchSpecial = fac.special_treatments?.some((s) => s.toLowerCase().includes(query));
      if (!matchName && !matchAddr && !matchTreatments && !matchSpecial) {
        return false;
      }
    }

    // 시도 필터
    if (sido && sido !== 'ALL' && fac.sido_name && !fac.sido_name.includes(sido)) {
      return false;
    }

    // 1등급 필터
    if (grade && fac.grade_evaluation && !fac.grade_evaluation.includes(grade)) {
      return false;
    }

    return true;
  });

  return NextResponse.json({
    success: true,
    total: filtered.length,
    data: filtered,
    source: liveItems.length > 0 ? 'hira_live' : 'verified_mock',
  });
}
