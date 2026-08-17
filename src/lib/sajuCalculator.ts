import { Solar, Lunar } from 'lunar-javascript';

export interface SajuPillar {
  gan: string; // 천간 (甲, 乙...)
  ji: string;  // 지지 (子, 丑...)
  ganHangul: string; // 갑, 을...
  jiHangul: string;  // 자, 축...
  ganElement: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  jiElement: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  ganColor: string;
  jiColor: string;
}

export interface SajuCalculationResult {
  yearPillar: SajuPillar;
  monthPillar: SajuPillar;
  dayPillar: SajuPillar;
  timePillar: SajuPillar | null;
  dayMaster: string; // 일간 (본캐)
  dayMasterKorean: string;
  dayMasterElement: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  elementsCount: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  elementsPercent: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  dominantElement: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  dominantElementName: string;
  modernPersonaBadge: string;
}

const GAN_ELEMENTS: Record<string, { el: 'wood' | 'fire' | 'earth' | 'metal' | 'water'; name: string }> = {
  '甲': { el: 'wood', name: '갑목' },
  '乙': { el: 'wood', name: '을목' },
  '丙': { el: 'fire', name: '병화' },
  '丁': { el: 'fire', name: '정화' },
  '戊': { el: 'earth', name: '무토' },
  '己': { el: 'earth', name: '기토' },
  '庚': { el: 'metal', name: '경금' },
  '辛': { el: 'metal', name: '신금' },
  '壬': { el: 'water', name: '임수' },
  '癸': { el: 'water', name: '계수' },
};

const JI_ELEMENTS: Record<string, { el: 'wood' | 'fire' | 'earth' | 'metal' | 'water'; name: string }> = {
  '子': { el: 'water', name: '자수' },
  '丑': { el: 'earth', name: '축토' },
  '寅': { el: 'wood', name: '인목' },
  '卯': { el: 'wood', name: '묘목' },
  '辰': { el: 'earth', name: '진토' },
  '巳': { el: 'fire', name: '사화' },
  '午': { el: 'fire', name: '오화' },
  '未': { el: 'earth', name: '미토' },
  '申': { el: 'metal', name: '신금' },
  '酉': { el: 'metal', name: '유금' },
  '戌': { el: 'earth', name: '술토' },
  '亥': { el: 'water', name: '해수' },
};

const ELEMENT_COLORS: Record<string, string> = {
  wood: '#10b981',   // 초록 (성장/추진)
  fire: '#f43f5e',   // 빨강/로즈 (열정/표현)
  earth: '#f59e0b',  // 황색/앰버 (안정/중재)
  metal: '#94a3b8',  // 은색/슬레이트 (원칙/결단)
  water: '#38bdf8',  // 청색/스카이 (지혜/유연성)
};

export function calculateSaju(
  birthDateStr: string, // YYYY-MM-DD
  birthTimeStr?: string, // HH:mm or ''
  dateType: '양력' | '음력' = '양력'
): SajuCalculationResult {
  const [year, month, day] = birthDateStr.split('-').map(Number);
  
  let lunar: any;
  let solar: any;

  if (dateType === '음력') {
    lunar = Lunar.fromYmd(year, month, day);
    solar = lunar.getSolar();
  } else {
    solar = Solar.fromYmd(year, month, day);
    lunar = solar.getLunar();
  }

  const eightChar = lunar.getEightChar();
  
  const yGan = eightChar.getYearGan();
  const yJi = eightChar.getYearZhi();
  const mGan = eightChar.getMonthGan();
  const mJi = eightChar.getMonthZhi();
  const dGan = eightChar.getDayGan();
  const dJi = eightChar.getDayZhi();

  let tGan = '';
  let tJi = '';
  if (birthTimeStr && birthTimeStr.includes(':')) {
    const [h, m] = birthTimeStr.split(':').map(Number);
    const solarWithTime = Solar.fromYmdHms(solar.getYear(), solar.getMonth(), solar.getDay(), h, m, 0);
    const eightCharWithTime = solarWithTime.getLunar().getEightChar();
    tGan = eightCharWithTime.getTimeGan();
    tJi = eightCharWithTime.getTimeZhi();
  }

  const parsePillar = (gan: string, ji: string): SajuPillar => {
    const ganInfo = GAN_ELEMENTS[gan] || { el: 'earth', name: gan };
    const jiInfo = JI_ELEMENTS[ji] || { el: 'earth', name: ji };
    return {
      gan,
      ji,
      ganHangul: ganInfo.name,
      jiHangul: jiInfo.name,
      ganElement: ganInfo.el,
      jiElement: jiInfo.el,
      ganColor: ELEMENT_COLORS[ganInfo.el],
      jiColor: ELEMENT_COLORS[jiInfo.el],
    };
  };

  const yearPillar = parsePillar(yGan, yJi);
  const monthPillar = parsePillar(mGan, mJi);
  const dayPillar = parsePillar(dGan, dJi);
  const timePillar = tGan && tJi ? parsePillar(tGan, tJi) : null;

  // 오행 카운팅
  const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const countPillar = (p: SajuPillar) => {
    counts[p.ganElement] += 1;
    counts[p.jiElement] += 1;
  };

  countPillar(yearPillar);
  countPillar(monthPillar);
  countPillar(dayPillar);
  if (timePillar) countPillar(timePillar);

  const total = timePillar ? 8 : 6;
  const percent = {
    wood: Math.round((counts.wood / total) * 100),
    fire: Math.round((counts.fire / total) * 100),
    earth: Math.round((counts.earth / total) * 100),
    metal: Math.round((counts.metal / total) * 100),
    water: Math.round((counts.water / total) * 100),
  };

  // 가장 우세한 오행
  let dominant: 'wood' | 'fire' | 'earth' | 'metal' | 'water' = 'wood';
  let maxCount = -1;
  (Object.keys(counts) as ('wood' | 'fire' | 'earth' | 'metal' | 'water')[]).forEach((k) => {
    if (counts[k] > maxCount) {
      maxCount = counts[k];
      dominant = k;
    }
  });

  const dominantNames = {
    wood: '목(木) - 성장/추진 에너지',
    fire: '화(火) - 열정/표현 에너지',
    earth: '토(土) - 안정/중재 에너지',
    metal: '금(金) - 원칙/결단 에너지',
    water: '수(水) - 지혜/유연성 에너지',
  };

  const personaBadges: Record<string, string> = {
    '甲': '곧게 뻗는 리더 (퍼스트 무버)',
    '乙': '유연한 적응형 전략가 (네트워커)',
    '丙': '세상을 밝히는 비전형 디렉터 (인플루언서)',
    '丁': '디테일에 강한 전문 크리에이터 (집중형 장인)',
    '戊': '단단한 기반의 신뢰형 매니저 (플랫폼 빌더)',
    '己': '실용적 가치를 창출하는 해결사 (인에이블러)',
    '庚': '결단력 있는 혁신가 (체인저)',
    '辛': '예리한 통찰의 퀄리티 마스터 (스페셜리스트)',
    '壬': '거침없는 아이디어 뱅크 (스케일업 개척자)',
    '癸': '깊은 사고의 전략 컨설턴트 (솔루션 씽커)',
  };

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    timePillar,
    dayMaster: dGan,
    dayMasterKorean: GAN_ELEMENTS[dGan]?.name || dGan,
    dayMasterElement: GAN_ELEMENTS[dGan]?.el || 'wood',
    elementsCount: counts,
    elementsPercent: percent,
    dominantElement: dominant,
    dominantElementName: dominantNames[dominant],
    modernPersonaBadge: personaBadges[dGan] || '다재다능한 전략가',
  };
}
