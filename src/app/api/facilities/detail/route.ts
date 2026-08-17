import { NextResponse } from 'next/server';
import { MOCK_FACILITIES } from '@/data/mockFacilities';
import { fetchHiraFacilityDetail } from '@/lib/hira';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ykiho = searchParams.get('ykiho');
  const id = searchParams.get('id');

  if (!ykiho && !id) {
    return NextResponse.json({ success: false, message: 'ykiho or id required' }, { status: 400 });
  }

  // 1. Mock 데이터에서 기본 정보 조회
  const mockFound = MOCK_FACILITIES.find((f) => (ykiho && f.ykiho === ykiho) || (id && f.id === id));

  // 2. 심평원 의료기관별상세정보서비스 (2.8) 실시간 호출 시도
  let liveDetail = null;
  if (ykiho) {
    try {
      liveDetail = await fetchHiraFacilityDetail(ykiho);
    } catch {
      liveDetail = null;
    }
  }

  if (!mockFound && !liveDetail) {
    return NextResponse.json({ success: false, message: 'Facility not found' }, { status: 404 });
  }

  // 병합 반환 (실시간 상세정보 + 기본 정보)
  const mergedFacility = {
    ...(mockFound || {}),
    ...(liveDetail || {}),
    equipments: liveDetail?.equipments || mockFound?.equipments || [],
    treatments: liveDetail?.treatments || mockFound?.treatments || [],
    transport: liveDetail?.transport || mockFound?.transport,
    nursing_grade: liveDetail?.nursingGrade || mockFound?.nursing_grade,
  };

  return NextResponse.json({
    success: true,
    data: mergedFacility,
    source: liveDetail ? 'hira_live_detail' : 'verified_mock',
  });
}
