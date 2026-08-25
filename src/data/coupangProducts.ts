export interface CoupangProduct {
  id: string;
  category: "health" | "vitality" | "safety" | "smart";
  categoryLabel: string;
  title: string;
  subtitle: string;
  price: string;
  originalPrice: string;
  discount: string;
  badge: string;
  rating: string;
  reviewCount: number;
  imageUrl: string;
  coupangUrl: string;
}

export const COUPANG_PARTNERS_DISCLOSURE =
  "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";

export const COUPANG_PRODUCTS: CoupangProduct[] = [
  // 1. 부모님 건강
  {
    id: "hs_1",
    category: "health",
    categoryLabel: "부모님 건강",
    title: "진세노사이드 57.2mg 고려홍삼면역 57 홍삼스틱 (50개입)",
    subtitle: "진세노사이드 57.2mg 고함량 & 면역력 집중 케어 (10ml x 50개)",
    price: "60,170원",
    originalPrice: "100,000원",
    discount: "39%",
    badge: "39% 특가",
    rating: "4.9",
    reviewCount: 3096,
    imageUrl: "https://img1c.coupangcdn.com/image/affiliate/banner/acf27d7c85f20aee06efc0b33b55e45d@2x.jpg",
    coupangUrl: "https://link.coupang.com/a/gsgxURTpoy"
  },
  {
    id: "hs_2",
    category: "health",
    categoryLabel: "부모님 건강",
    title: "순수식품 홍삼정진액 에브리데이 365 스틱 (200포)",
    subtitle: "부모님 1년 내내 든든한 가성비 1등 대용량 홍삼 스틱 (10g x 200개)",
    price: "44,930원",
    originalPrice: "90,000원",
    discount: "50%",
    badge: "50% 와우특가",
    rating: "4.9",
    reviewCount: 7482,
    imageUrl: "https://img4a.coupangcdn.com/image/affiliate/banner/3d9a763d2da031abdbea67d3111d90f1@2x.jpg",
    coupangUrl: "https://link.coupang.com/a/gsgBezogNw"
  },
  {
    id: "hs_3",
    category: "health",
    categoryLabel: "부모님 건강",
    title: "농협 한삼인 6년근 진한홍삼스틱 (1kg) + 쇼핑백",
    subtitle: "농협이 보증하는 믿을 수 있는 6년근 고려홍삼 100포 선물세트",
    price: "79,700원",
    originalPrice: "120,000원",
    discount: "33%",
    badge: "선물용 인기",
    rating: "4.9",
    reviewCount: 2919,
    imageUrl: "https://image12.coupangcdn.com/image/affiliate/banner/5280ec6b0c752b5568743da36d682577@2x.jpg",
    coupangUrl: "https://link.coupang.com/a/gsgCHcfWAC"
  },
  {
    id: "hs_4",
    category: "health",
    categoryLabel: "부모님 건강",
    title: "JW중외제약 일품 황제 침향환 60환 + 쇼핑백",
    subtitle: "귀한 인도네시아산 침향 & 녹용 홍삼 18종 전통 원료 배합",
    price: "37,050원",
    originalPrice: "57,000원",
    discount: "35%",
    badge: "35% 와우특가",
    rating: "4.8",
    reviewCount: 602,
    imageUrl: "https://image2.coupangcdn.com/image/affiliate/banner/b16683e0385b5d70d3b9867cec8fe954@2x.jpg",
    coupangUrl: "https://link.coupang.com/a/gsjD51d2US"
  },

  // 2. 일상활력
  {
    id: "vital_1",
    category: "vitality",
    categoryLabel: "일상활력",
    title: "고려은단 관절 올케어 콘드로이친 MSM NAG (30포)",
    subtitle: "유재석이 추천하는 3중 복합 관절 & 연골 집중 케어 (1개월분)",
    price: "44,880원",
    originalPrice: "60,000원",
    discount: "25%",
    badge: "와우특가",
    rating: "4.8",
    reviewCount: 823,
    imageUrl: "https://image11.coupangcdn.com/image/affiliate/banner/7f0dd47e4118d6f443159cccd96f6a97@2x.jpg",
    coupangUrl: "https://link.coupang.com/a/gsgEPrWhyK"
  },
  {
    id: "vital_2",
    category: "vitality",
    categoryLabel: "일상활력",
    title: "관절엔 콘드로이친 1200 (60정 x 3박스, 3개월분)",
    subtitle: "소 연골 유래 순수 콘드로이친 1200mg 3개월 대용량 세트",
    price: "166,000원",
    originalPrice: "297,000원",
    discount: "44%",
    badge: "3개월 대용량",
    rating: "5.0",
    reviewCount: 46586,
    imageUrl: "https://image1.coupangcdn.com/image/affiliate/banner/5145ee8dca2b1889c9788847e04548c4@2x.jpg",
    coupangUrl: "https://link.coupang.com/a/gsgL9cAu4W"
  },
  {
    id: "vital_3",
    category: "vitality",
    categoryLabel: "일상활력",
    title: "웰빙헬스팜 관절애 온열 쿨링 마사지크림 (100g x 3개)",
    subtitle: "쑤시고 뻐근한 부모님 무릎, 어깨, 허리 바르는 온열 크림",
    price: "13,190원",
    originalPrice: "24,000원",
    discount: "45%",
    badge: "바르는 관절애",
    rating: "4.8",
    reviewCount: 9722,
    imageUrl: "https://image14.coupangcdn.com/image/affiliate/banner/30c9e0537f7e5494b9bf836f4a6441f9@2x.jpg",
    coupangUrl: "https://link.coupang.com/a/gsgNKpVWkC"
  },
  {
    id: "vital_4",
    category: "vitality",
    categoryLabel: "일상활력",
    title: "뉴케어 구수한맛 미니 완전균형영양식 (150ml x 24팩)",
    subtitle: "입맛 없으실 때 식사대용 & 비타민 미네랄 22종 균형 영양식",
    price: "32,900원",
    originalPrice: "48,000원",
    discount: "31%",
    badge: "영양식 1위",
    rating: "4.9",
    reviewCount: 114642,
    imageUrl: "https://img2c.coupangcdn.com/image/affiliate/banner/51aa73cd7aa3e8348aaa1d7435ee0adf@2x.jpg",
    coupangUrl: "https://link.coupang.com/a/gsjkTGaMeq"
  },

  // 3. 안심 / 낙상예방
  {
    id: "cane_1",
    category: "safety",
    categoryLabel: "안심/낙상",
    title: "코끼리지팡이 초경량 4발 자립형 어르신 효도 지팡이 (브라운)",
    subtitle: "가볍고 안전한 네발 접이식 & 길이조절형 지팡이",
    price: "21,500원",
    originalPrice: "30,000원",
    discount: "28%",
    badge: "자립형 4발",
    rating: "4.9",
    reviewCount: 5091,
    imageUrl: "https://image5.coupangcdn.com/image/affiliate/banner/9081a47ea2be2191905e10c61324c72d@2x.jpg",
    coupangUrl: "https://link.coupang.com/a/gsgSDMGHdc"
  },
  {
    id: "cane_2",
    category: "safety",
    categoryLabel: "안심/낙상",
    title: "효도템 1위 라쿠니 초경량 미끄럼방지 안심 지팡이 (블랙)",
    subtitle: "손목 충격 완화 인체공학 손잡이 & 특수 미끄럼방지 고무발",
    price: "20,900원",
    originalPrice: "45,000원",
    discount: "53%",
    badge: "53% 특가",
    rating: "4.9",
    reviewCount: 939,
    imageUrl: "https://img4c.coupangcdn.com/image/affiliate/banner/87cab768e3f729099c18494816eb0791@2x.jpg",
    coupangUrl: "https://link.coupang.com/a/gsgUDYnpzE"
  },
  {
    id: "walk_1",
    category: "safety",
    categoryLabel: "안심/낙상",
    title: "키브 특허받은 성인용 프리미엄 롤레이터 보행기 KV-R2",
    subtitle: "특허받은 안전 주행 브레이크 & 경량 알루미늄 프레임 (레드)",
    price: "378,000원",
    originalPrice: "498,000원",
    discount: "24%",
    badge: "특허 프리미엄",
    rating: "4.9",
    reviewCount: 83,
    imageUrl: "https://img4a.coupangcdn.com/image/affiliate/banner/d7c8528ce5e1543a2ddf3bed3fb6ad42@2x.jpg",
    coupangUrl: "https://link.coupang.com/a/gshQ0l0kCq"
  },
  {
    id: "walk_2",
    category: "safety",
    categoryLabel: "안심/낙상",
    title: "살루테 보행보조기 노인 보행기 할머니 어르신 실버카",
    subtitle: "푹신한 간이 의자와 원터치 주차 파킹 브레이크 장착",
    price: "160,170원",
    originalPrice: "248,000원",
    discount: "35%",
    badge: "편안한 좌석",
    rating: "4.9",
    reviewCount: 95,
    imageUrl: "https://img3a.coupangcdn.com/image/affiliate/banner/00a2a97007494c08cfac168f1adc5817@2x.jpg",
    coupangUrl: "https://link.coupang.com/a/gshjLDBGfY"
  },
  {
    id: "mat_1",
    category: "safety",
    categoryLabel: "안심/낙상",
    title: "라앤모 욕실 미끄럼방지 논슬립 코일매트",
    subtitle: "물기 많은 욕실 낙상 방지 & 푹신한 프리미엄 코일매트",
    price: "24,300원",
    originalPrice: "38,580원",
    discount: "37%",
    badge: "37% 특가",
    rating: "4.8",
    reviewCount: 316,
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=85",
    coupangUrl: "https://link.coupang.com/a/gsfBAtJvs4"
  },

  // 4. 스마트케어
  {
    id: "smart_1",
    category: "smart",
    categoryLabel: "스마트케어",
    title: "아이뮤즈 뮤패드 K11 LTE 태블릿PC (8GB+128GB)",
    subtitle: "27.9cm 대화면 & LTE 지원 부모님 영상통화/유튜브 효도패드",
    price: "256,000원",
    originalPrice: "259,000원",
    discount: "1%",
    badge: "대화면 효도패드",
    rating: "4.9",
    reviewCount: 2463,
    imageUrl: "https://image6.coupangcdn.com/image/affiliate/banner/4af9cc17b246503ab3421a818f98686e@2x.jpg",
    coupangUrl: "https://link.coupang.com/a/gsi9DUIYXY"
  },
  {
    id: "smart_2",
    category: "smart",
    categoryLabel: "스마트케어",
    title: "한경희 휴대용 미니 효도 라디오 스피커 (HPR-10)",
    subtitle: "71g 초경량 포켓 사이즈 & 선명한 디지털 LCD 주파수 라디오",
    price: "34,900원",
    originalPrice: "39,900원",
    discount: "12%",
    badge: "71g 초경량",
    rating: "4.9",
    reviewCount: 82,
    imageUrl: "https://image15.coupangcdn.com/image/affiliate/banner/d185abb83fe1e28b97a4e907213234ce@2x.jpg",
    coupangUrl: "https://link.coupang.com/a/gsjcqaSKdw"
  }
];
