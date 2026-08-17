import { Facility, FacilityCategoryCode } from '@/types/facility';

const HIRA_BASE_URL = 'http://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList';

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

  // URL 디코딩/인코딩 핸들링
  const decodedKey = decodeURIComponent(serviceKey);

  const queryParams = new URLSearchParams({
    serviceKey: decodedKey,
    pageNo: String(params.pageNo || 1),
    numOfRows: String(params.numOfRows || 20),
    _type: 'json',
  });

  if (params.clCd) queryParams.append('clCd', params.clCd);
  if (params.sidoCd) queryParams.append('sidoCd', params.sidoCd);
  if (params.sgguCd) queryParams.append('sgguCd', params.sgguCd);
  if (params.yadmNm) queryParams.append('yadmNm', params.yadmNm);

  try {
    const res = await fetch(`${HIRA_BASE_URL}?${queryParams.toString()}`, {
      next: { revalidate: 3600 }, // 1시간 캐싱
    });

    if (!res.ok) {
      console.warn(`HIRA API response status: ${res.status}`);
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
      let catCode: FacilityCategoryCode = '28';
      if (item.clCd === '21') catCode = '21';
      else if (item.clCd === '93') catCode = '93';
      else if (item.yadmNm.includes('호스피스') || item.yadmNm.includes('완화의료')) {
        catCode = 'hospice';
      }

      return {
        id: item.ykiho,
        ykiho: item.ykiho,
        name: item.yadmNm,
        category_code: catCode,
        category_name: item.clCdNm || (catCode === '21' ? '요양병원' : catCode === '93' ? '한의원' : catCode === 'hospice' ? '호스피스' : '한방병원'),
        address: item.addr,
        sido_name: item.sidoCdNm,
        sggu_name: item.sgguCdNm,
        emdong_name: item.emdongNm,
        tel: item.telno || null,
        url: item.hospUrl || null,
        latitude: item.YPos ? parseFloat(item.YPos) : 37.5665,
        longitude: item.XPos ? parseFloat(item.XPos) : 126.978,
        is_hospice: item.yadmNm.includes('호스피스') || item.yadmNm.includes('완화의료'),
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
