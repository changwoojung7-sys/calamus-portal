import { Facility, FacilityCategoryCode, FacilityDetailInfo } from '@/types/facility';

const HIRA_BASIS_URL = 'http://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList';
const MADM_DTL_URL = 'http://apis.data.go.kr/B551182/MadmDtlInfoService2.8';

export interface HiraBasisItem {
  ykiho: string;
  yadmNm: string;
  clCd: string;
  clCdNm?: string;
  sidoCdNm?: string;
  sgguCdNm?: string;
  emdongNm?: string;
  postNo?: string;
  addr: string;
  telno?: string;
  hospUrl?: string;
  estbDtm?: string;
  XPos?: string;
  YPos?: string;
  drTotCnt?: string | number;
  mdeptSdrCnt?: string | number;
  cmdcSdrCnt?: string | number;
}

export function mapHiraClCdToCategory(clCd: string, yadmNm: string): { code: FacilityCategoryCode; name: string } {
  if (yadmNm.includes('호스피스') || yadmNm.includes('완화의료')) {
    return { code: 'hospice', name: '호스피스전문' };
  }
  switch (clCd) {
    case '01':
      return { code: '01', name: '상급종합병원' };
    case '11':
      return { code: '11', name: '종합병원' };
    case '21':
      return { code: '21', name: '병원' };
    case '28':
      return { code: '28', name: '요양병원' };
    case '92':
      return { code: '92', name: '한방병원' };
    case '93':
      return { code: '93', name: '한의원' };
    default:
      return { code: '21', name: '병원' };
  }
}

/**
 * 1. 심평원 병원기본목록 검색 (API 1: hospInfoServicev2/getHospBasisList)
 */
export async function fetchHiraFacilities(params: {
  serviceKey?: string;
  clCd?: string;
  sidoCd?: string;
  sgguCd?: string;
  yadmNm?: string;
  pageNo?: number;
  numOfRows?: number;
}): Promise<{ items: Facility[]; totalCount: number }> {
  const serviceKey = params.serviceKey || process.env.HIRA_API_KEY || '';
  if (!serviceKey) {
    return { items: [], totalCount: 0 };
  }

  const decodedKey = decodeURIComponent(serviceKey);

  const queryParams = new URLSearchParams({
    serviceKey: decodedKey,
    pageNo: String(params.pageNo || 1),
    numOfRows: String(params.numOfRows || 20),
    _type: 'json',
  });

  if (params.clCd && params.clCd !== 'ALL' && params.clCd !== 'hospice') {
    queryParams.append('clCd', params.clCd);
  }
  if (params.sidoCd) queryParams.append('sidoCd', params.sidoCd);
  if (params.sgguCd) queryParams.append('sgguCd', params.sgguCd);
  if (params.yadmNm) queryParams.append('yadmNm', params.yadmNm);

  try {
    const res = await fetch(`${HIRA_BASIS_URL}?${queryParams.toString()}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { items: [], totalCount: 0 };
    }

    const data = await res.json();
    const body = data?.response?.body;
    if (!body || !body.items || !body.items.item) {
      return { items: [], totalCount: 0 };
    }

    const rawItems: HiraBasisItem[] = Array.isArray(body.items.item)
      ? body.items.item
      : [body.items.item];

    const items: Facility[] = rawItems.map((item) => {
      const cat = mapHiraClCdToCategory(item.clCd, item.yadmNm);
      const doctorCount = item.drTotCnt ? Number(item.drTotCnt) : undefined;
      const specialistCount = item.mdeptSdrCnt
        ? Number(item.mdeptSdrCnt)
        : item.cmdcSdrCnt
        ? Number(item.cmdcSdrCnt)
        : undefined;

      return {
        id: item.ykiho,
        ykiho: item.ykiho,
        name: item.yadmNm,
        category_code: cat.code,
        category_name: item.clCdNm || cat.name,
        address: item.addr,
        sido_name: item.sidoCdNm,
        sggu_name: item.sgguCdNm,
        emdong_name: item.emdongNm,
        tel: item.telno || null,
        url: item.hospUrl || null,
        latitude: item.YPos ? parseFloat(item.YPos) : 37.5665,
        longitude: item.XPos ? parseFloat(item.XPos) : 126.978,
        doctor_count: doctorCount,
        specialist_count: specialistCount,
        is_hospice: cat.code === 'hospice' || item.yadmNm.includes('호스피스'),
      };
    });

    return {
      items,
      totalCount: body.totalCount || items.length,
    };
  } catch (error) {
    console.error('Error fetching HIRA facilities:', error);
    return { items: [], totalCount: 0 };
  }
}

/**
 * 2. 심평원 의료기관별 상세정보 조회 (API 2: MadmDtlInfoService2.8)
 * - 시설정보 (/getEqpInfo2.8)
 * - 세부정보 (/getDtlInfo2.8)
 * - 진료과목 (/getDgsbjtInfo2.8)
 * - 간호등급 (/getNursigGrdInfo2.8)
 * - 교통정보 (/getTrnsprtInfo2.8)
 */
export async function fetchHiraFacilityDetail(ykiho: string): Promise<Partial<FacilityDetailInfo> | null> {
  const serviceKey = process.env.HIRA_API_KEY || '';
  if (!serviceKey || !ykiho) return null;

  const decodedKey = decodeURIComponent(serviceKey);
  const baseParams = `serviceKey=${encodeURIComponent(decodedKey)}&ykiho=${encodeURIComponent(ykiho)}&_type=json`;

  try {
    const [eqpRes, dtlRes, dgsbjtRes, nursRes, trnRes] = await Promise.allSettled([
      fetch(`${MADM_DTL_URL}/getEqpInfo2.8?${baseParams}`),
      fetch(`${MADM_DTL_URL}/getDtlInfo2.8?${baseParams}`),
      fetch(`${MADM_DTL_URL}/getDgsbjtInfo2.8?${baseParams}`),
      fetch(`${MADM_DTL_URL}/getNursigGrdInfo2.8?${baseParams}`),
      fetch(`${MADM_DTL_URL}/getTrnsprtInfo2.8?${baseParams}`),
    ]);

    let equipments: string[] = [];
    let treatments: string[] = [];
    let nursingGrade: string | undefined;
    let transport: { traffic?: string; parking?: string } | undefined;
    let totalBeds: number | undefined;

    // 장비 파싱
    if (eqpRes.status === 'fulfilled' && eqpRes.value.ok) {
      const eqpData = await eqpRes.value.json();
      const eqpItems = eqpData?.response?.body?.items?.item;
      if (eqpItems) {
        const arr = Array.isArray(eqpItems) ? eqpItems : [eqpItems];
        equipments = arr.map((e: any) => `${e.oftNm || e.eqpNm || '장비'} (${e.oftCnt || e.eqpCnt || 1}대)`);
      }
    }

    // 진료과목 파싱
    if (dgsbjtRes.status === 'fulfilled' && dgsbjtRes.value.ok) {
      const dgsData = await dgsbjtRes.value.json();
      const dgsItems = dgsData?.response?.body?.items?.item;
      if (dgsItems) {
        const arr = Array.isArray(dgsItems) ? dgsItems : [dgsItems];
        treatments = arr.map((d: any) => d.dgsbjtCdNm || d.dgsbjtNm).filter(Boolean);
      }
    }

    // 간호등급 파싱
    if (nursRes.status === 'fulfilled' && nursRes.value.ok) {
      const nursData = await nursRes.value.json();
      const nursItems = nursData?.response?.body?.items?.item;
      if (nursItems) {
        const arr = Array.isArray(nursItems) ? nursItems : [nursItems];
        const gradeItem = arr.find((n: any) => n.nursigGrd);
        if (gradeItem) {
          nursingGrade = `${gradeItem.nursigGrd}등급`;
        }
      }
    }

    // 교통 파싱
    if (trnRes.status === 'fulfilled' && trnRes.value.ok) {
      const trnData = await trnRes.value.json();
      const trnItems = trnData?.response?.body?.items?.item;
      if (trnItems) {
        const item = Array.isArray(trnItems) ? trnItems[0] : trnItems;
        transport = {
          traffic: item.lineNm ? `${item.lineNm} ${item.arvNm || ''}` : item.trnsprtInfo,
          parking: item.parkEtc || item.parkQty ? `주차 ${item.parkQty || ''}대 가능 (${item.parkEtc || ''})` : undefined,
        };
      }
    }

    return {
      ykiho,
      equipments: equipments.length > 0 ? equipments : undefined,
      treatments: treatments.length > 0 ? treatments : undefined,
      nursingGrade,
      transport,
      totalBeds,
    };
  } catch (error) {
    console.error('Error fetching facility detail from HIRA:', error);
    return null;
  }
}
