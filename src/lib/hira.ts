import { Facility, FacilityCategoryCode } from '@/types/facility';

const HIRA_BASIS_URL = 'http://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList';
const HIRA_ASM_URL = 'http://apis.data.go.kr/B551182/hospAsmInfoService1/getHospAsmInfo1';

export interface HiraApiItem {
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
  XPos?: string; // Longitude
  YPos?: string; // Latitude
  drTotCnt?: string | number; // 의사 총수
  mdeptSdrCnt?: string | number; // 의과 전문의
  cmdcSdrCnt?: string | number; // 한방 전문의
}

export interface HiraAsmItem {
  ykiho: string;
  yadmNm: string;
  asmGrd01?: string; // 급성기 뇌졸중
  asmGrd03?: string; // 혈액투석
  asmGrd10?: string; // 요양병원 적정성
  asmGrd18?: string; // 폐렴
  asmGrd24?: string; // 고혈압/당뇨
}

/**
 * 심평원 종별코드(clCd)를 포털 내부 카테고리 코드로 변환
 */
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
 * 심평원(HIRA) 병원목록 Open API 조회 유틸리티
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

    const rawItems: HiraApiItem[] = Array.isArray(body.items.item)
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
