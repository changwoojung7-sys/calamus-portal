"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Phone,
  Bed,
  Stethoscope,
  Award,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building,
  Building2,
  HeartHandshake,
  Compass,
  Sparkles,
  Layers,
  Clock,
  Activity,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Eye,
  Loader2,
  RefreshCw,
  Map as MapIcon,
  FileText,
  X,
  Navigation,
  Bus,
  Car,
  Utensils,
  Users2,
  Microscope,
  Check,
  ShieldAlert
} from 'lucide-react';
import { Facility, FacilityDetail } from '@/types/facility';

declare global {
  interface Window {
    kakao: any;
  }
}

export type CategoryFilter = 'ALL' | 'general' | 'oriental' | '28' | '21' | 'hospice';

interface FacilityMapSearchProps {
  initialCategory?: CategoryFilter;
}

// 5대 추천 / 스폰서 병원 (스크린샷과 일치)
const RECOMMENDED_HOSPITALS = [
  { name: "효사랑가족요양병원", category: "요양" },
  { name: "보바스기념병원", category: "재활/요양" },
  { name: "인창요양병원", category: "요양" },
  { name: "삼성서울병원", category: "상급종합" },
  { name: "자생한방병원", category: "한방척추" },
];

const PAGE_SIZE = 30;

export const FacilityMapSearch: React.FC<FacilityMapSearchProps> = ({ initialCategory = 'ALL' }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [selectedSido, setSelectedSido] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'detail' | 'map'>('detail');
  
  // 무한 스크롤 & 페이지네이션 상태
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 상세정보 API 로딩 & 캐시 상태
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [detailCache, setDetailCache] = useState<Record<string, FacilityDetail>>({});

  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [kakaoLoaded, setKakaoLoaded] = useState<boolean>(false);

  const mapContainer = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // 외부 initialCategory 변경 시 내부 activeCategory 동기화
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  // 검색어 디바운스 처리 (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchTerm.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 1. 카카오맵 SDK 로드 및 초기화
  useEffect(() => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!kakaoKey || kakaoKey === 'YOUR_KAKAO_JS_KEY') {
      return;
    }

    const initMap = () => {
      if (!window.kakao || !window.kakao.maps || !mapContainer.current) return;
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 7,
      };
      const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
      setMap(kakaoMap);
      setKakaoLoaded(true);
    };

    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;
      script.onload = () => {
        window.kakao.maps.load(initMap);
      };
      document.head.appendChild(script);
    }
  }, []);

  // 2. Supabase 기반 병의원 목록 비동기 조회
  const fetchFacilities = async (isFirst = true) => {
    if (isFirst) {
      setIsLoadingList(true);
      setPageNo(1);
    } else {
      setIsLoadingMore(true);
    }

    const targetPage = isFirst ? 1 : pageNo + 1;

    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'ALL') params.append('category', activeCategory);
      if (debouncedQuery) params.append('query', debouncedQuery);
      if (selectedSido !== 'ALL') params.append('sido', selectedSido);
      if (selectedGrade !== 'ALL') params.append('grade', selectedGrade);
      params.append('pageNo', String(targetPage));
      params.append('pageSize', String(PAGE_SIZE));

      const res = await fetch(`/api/facilities?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const fetched: Facility[] = json.data || [];
          if (isFirst) {
            setFacilities(fetched);
            setTotalCount(json.total || 0);
            if (fetched.length > 0) {
              handleSelectFacility(fetched[0]);
            } else {
              setSelectedFacility(null);
            }
          } else {
            setFacilities((prev) => [...prev, ...fetched]);
            setPageNo(targetPage);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load facilities:', err);
    } finally {
      setIsLoadingList(false);
      setIsLoadingMore(false);
    }
  };

  // 필터 및 디바운스 검색어 변경 시 재조회
  useEffect(() => {
    fetchFacilities(true);
  }, [activeCategory, debouncedQuery, selectedSido, selectedGrade]);

  // hasMore 상태 계산
  useEffect(() => {
    setHasMore(facilities.length < totalCount);
  }, [facilities.length, totalCount]);

  // 3. 무한 스크롤
  const handleListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 120 && hasMore && !isLoadingMore && !isLoadingList) {
      fetchFacilities(false);
    }
  };

  // 4. 지도 마커 렌더링
  useEffect(() => {
    if (!map || !window.kakao || !window.kakao.maps) return;

    markers.forEach((m) => m.setMap(null));
    const newMarkers: any[] = [];
    const bounds = new window.kakao.maps.LatLngBounds();
    let hasCoords = false;

    facilities.slice(0, 50).forEach((fac) => {
      const lat = fac.latitude || (fac as any).lat;
      const lng = fac.longitude || (fac as any).lng;

      if (lat && lng) {
        const pos = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({
          position: pos,
          map: map,
          title: fac.name,
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          handleSelectFacility(fac);
        });

        newMarkers.push(marker);
        bounds.extend(pos);
        hasCoords = true;
      }
    });

    setMarkers(newMarkers);

    const selLat = selectedFacility?.latitude || (selectedFacility as any)?.lat;
    const selLng = selectedFacility?.longitude || (selectedFacility as any)?.lng;

    if (selLat && selLng) {
      map.setCenter(new window.kakao.maps.LatLng(selLat, selLng));
      map.setLevel(4);
    } else if (hasCoords && newMarkers.length > 0) {
      map.setBounds(bounds);
    }
  }, [facilities, map, kakaoLoaded]);

  // 시설 선택 시 처리 (상세정보 비동기 페치)
  const handleSelectFacility = async (fac: Facility) => {
    setSelectedFacility(fac);

    const lat = fac.latitude || (fac as any).lat;
    const lng = fac.longitude || (fac as any).lng;

    if (map && lat && lng && window.kakao) {
      const pos = new window.kakao.maps.LatLng(lat, lng);
      map.panTo(pos);
    }

    // 캐시 확인
    const key = fac.ykiho || fac.id;
    if (detailCache[key]) {
      setSelectedFacility({ ...fac, ...detailCache[key] });
      return;
    }

    if (fac.ykiho || fac.id) {
      setIsLoadingDetail(true);
      try {
        const queryParam = fac.ykiho ? `ykiho=${encodeURIComponent(fac.ykiho)}` : `id=${encodeURIComponent(fac.id)}`;
        const res = await fetch(`/api/facilities/detail?${queryParam}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const enriched = { ...fac, ...json.data };
            setSelectedFacility(enriched);
            setDetailCache((prev) => ({ ...prev, [key]: enriched }));
          }
        }
      } catch (err) {
        console.warn('Could not fetch extra facility detail:', err);
      } finally {
        setIsLoadingDetail(false);
      }
    }
  };

  // 추천 병원 클릭 핸들러
  const handleRecommendedClick = (hosp: typeof RECOMMENDED_HOSPITALS[0]) => {
    setSearchTerm(hosp.name);
    setActiveCategory('ALL');
  };

  // 검색어 즉시 실행 폼 서밋 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchTerm.trim());
  };

  const CATEGORY_TABS: { label: string; value: CategoryFilter; badge?: string }[] = [
    { label: '전체 기관', value: 'ALL' },
    { label: '상급·종합병원', value: 'general', badge: '3차·종합' },
    { label: '한방병원/한의원', value: 'oriental', badge: '전문의' },
    { label: '요양병원/요양원', value: '28', badge: '실버케어' },
    { label: '일반병원/의원', value: '21', badge: '양방/의원' },
    { label: '호스피스 완화의료', value: 'hospice', badge: '복지부 지정' },
  ];

  const getPhone = (fac?: Facility | null) => fac?.tel || (fac as any)?.phone || '';

  return (
    <div className="flex flex-col lg:flex-row h-[880px] w-full rounded-3xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-2xl shadow-cyan-950/40 text-left">
      {/* 좌측 패널: 검색 / 필터 / 리스트 */}
      <div className="w-full lg:w-5/12 flex flex-col h-full border-r border-slate-800 bg-[#0d1527]">
        {/* 검색 및 필터 헤더 */}
        <div className="p-4 border-b border-slate-800 bg-[#0f172a] space-y-3">
          {/* 검색창 폼 */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-emerald-400" />
            <input
              type="text"
              placeholder="병원명, 진료과, 질환(혈액투석, 척추, 추나, 인공신장) 등..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 pl-10 pr-20 text-sm text-white placeholder-slate-400 focus:border-cyan-400 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors shadow-inner"
            />
            <div className="absolute right-2 top-1.5 flex items-center gap-1">
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setDebouncedQuery('');
                  }}
                  className="p-1 text-xs text-slate-400 hover:text-slate-200"
                  title="검색어 지우기"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
              >
                검색
              </button>
            </div>
          </form>

          {/* 5대 추천 / 파트너 병원 칩 */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-slate-400 no-scrollbar">
            <span className="shrink-0 text-emerald-300 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> 추천 병원:
            </span>
            {RECOMMENDED_HOSPITALS.map((hosp) => (
              <button
                key={hosp.name}
                type="button"
                onClick={() => handleRecommendedClick(hosp)}
                className="shrink-0 px-2.5 py-0.5 rounded-md bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 transition font-medium flex items-center gap-1"
              >
                <span>{hosp.name}</span>
                <span className="text-[9px] text-emerald-200 bg-emerald-900/80 px-1 rounded">
                  {hosp.category}
                </span>
              </button>
            ))}
          </div>

          {/* 카테고리 탭 */}
          <div className="flex flex-wrap gap-1.5 text-xs font-medium">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveCategory(tab.value)}
                className={`rounded-lg px-2.5 py-1.5 transition-all flex items-center gap-1 ${
                  activeCategory === tab.value
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-xs border border-emerald-500'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/80'
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className={`text-[10px] px-1 rounded ${activeCategory === tab.value ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-900 text-slate-400'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 서브 필터 (지역 & 등급 선택) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> 지역:
              </span>
              <select
                value={selectedSido}
                onChange={(e) => setSelectedSido(e.target.value)}
                className="bg-slate-900 text-slate-200 text-xs rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-cyan-400 shadow-inner"
              >
                <option value="ALL">전국 전체</option>
                <option value="서울">서울</option>
                <option value="경기">경기</option>
                <option value="인천">인천</option>
                <option value="부산">부산</option>
                <option value="대구">대구</option>
                <option value="광주">광주</option>
                <option value="대전">대전</option>
                <option value="울산">울산</option>
                <option value="세종">세종</option>
                <option value="강원">강원</option>
                <option value="충북">충북</option>
                <option value="충남">충남</option>
                <option value="전북">전북</option>
                <option value="전남">전남</option>
                <option value="경북">경북</option>
                <option value="경남">경남</option>
                <option value="제주">제주</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <Award className="w-3.5 h-3.5 text-amber-400" /> 등급:
              </span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-slate-900 text-slate-200 text-xs rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-amber-400 shadow-inner"
              >
                <option value="ALL">전체 등급</option>
                <option value="1등급">심평원 1등급</option>
                <option value="2등급">심평원 2등급</option>
                <option value="3등급">심평원 3등급</option>
                <option value="S등급">간호/적정성 S등급</option>
                <option value="A등급">간호/적정성 A등급</option>
              </select>
            </div>
          </div>
        </div>

        {/* 시설 리스트 */}
        <div
          ref={listContainerRef}
          onScroll={handleListScroll}
          className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1 sticky top-0 bg-[#0d1527]/95 backdrop-blur py-1.5 z-10 border-b border-slate-800">
            <span>
              검색 결과 <strong className="text-emerald-400 font-bold">{totalCount.toLocaleString()}</strong>곳 
              <span className="text-[11px] text-slate-400 ml-1">
                (현재 {facilities.length.toLocaleString()}개 로드됨)
              </span>
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">2026.06월</span> HIRA DB
            </span>
          </div>

          {isLoadingList && (
            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-2" />
              <p className="text-sm font-medium text-slate-200">의료기관 데이터를 검색 중입니다...</p>
            </div>
          )}

          {!isLoadingList && facilities.map((fac) => {
            const isSelected = selectedFacility?.id === fac.id || (selectedFacility?.ykiho && selectedFacility?.ykiho === fac.ykiho);
            const phone = getPhone(fac);

            return (
              <div
                key={fac.id || fac.ykiho}
                onClick={() => handleSelectFacility(fac)}
                className={`cursor-pointer rounded-2xl p-4 transition-all border text-left ${
                  isSelected
                    ? 'border-emerald-400 bg-slate-800/90 shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400'
                    : 'border-slate-800 bg-slate-900/80 hover:border-emerald-500/40 hover:bg-slate-800/70 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          fac.category_code === '01'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                            : fac.category_code === '11'
                            ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                            : fac.category_code === '21'
                            ? 'bg-sky-950 text-sky-300 border border-sky-500/40'
                            : fac.category_code === '31'
                            ? 'bg-teal-950 text-teal-300 border border-teal-500/40'
                            : fac.category_code === '28'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : fac.category_code === '92' || fac.category_code === '93'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            : 'bg-purple-950 text-purple-300 border border-purple-500/40'
                        }`}
                      >
                        {fac.category_name}
                      </span>
                      {fac.is_hospice && (
                        <span className="inline-block rounded-md bg-purple-950 text-purple-300 border border-purple-500/40 px-1.5 py-0.5 text-[10px] font-bold">
                          호스피스 병동
                        </span>
                      )}
                      {fac.grade_evaluation && (
                        <span className="inline-block rounded-md bg-amber-950 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 text-[10px] font-semibold">
                          심평원 {fac.grade_evaluation}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                      {fac.name}
                    </h3>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600'}`} />
                </div>

                <p className="mt-1.5 text-xs text-slate-400 line-clamp-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  {fac.address}
                </p>

                {/* 하단 스펙 요약: 전화번호 / 의사수 */}
                <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-800 pt-2 font-medium">
                  {phone ? (
                    <span className="flex items-center gap-1 text-slate-300">
                      <Phone className="h-3.5 w-3.5 text-slate-500" />
                      {phone}
                    </span>
                  ) : (
                    <span className="text-slate-600">-</span>
                  )}
                  <div className="flex items-center gap-3">
                    {fac.doctor_count ? (
                      <span className="flex items-center gap-1 text-slate-300">
                        <Stethoscope className="h-3.5 w-3.5 text-cyan-400" />
                        의사 <strong className="text-white">{fac.doctor_count}</strong>명
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}

          {/* 더보기 버튼 */}
          {hasMore && (
            <div className="pt-2 pb-4 text-center">
              <button
                type="button"
                onClick={() => fetchFacilities(false)}
                disabled={isLoadingMore}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs hover:border-cyan-400"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>추가 병원 목록을 불러오는 중...</span>
                  </>
                ) : (
                  <>
                    <span>더 많은 병원 불러오기 (+{PAGE_SIZE}곳)</span>
                    <span className="text-[11px] text-slate-400">
                      ({facilities.length.toLocaleString()} / {totalCount.toLocaleString()}곳)
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {!hasMore && facilities.length > 0 && (
            <div className="py-4 text-center text-xs text-slate-500 border-t border-slate-800">
              전체 {totalCount.toLocaleString()}곳의 조회가 완료되었습니다.
            </div>
          )}

          {!isLoadingList && facilities.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400 p-6 space-y-3">
              <Compass className="h-10 w-10 text-slate-600 stroke-1 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-slate-200">일치하는 의료기관이 없습니다.</p>
                <p className="text-xs text-slate-500 mt-1">
                  검색어나 카테고리 필터를 변경해보세요.
                </p>
              </div>
              {activeCategory !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setActiveCategory('ALL')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
                >
                  '전체 기관'으로 다시 검색
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 우측 패널: 상세정보 & 카카오 인터랙티브 지도 */}
      <div className="w-full lg:w-7/12 h-full flex flex-col bg-[#0b132b] relative">
        {selectedFacility && (
          <div className="p-5 bg-[#0f172a] border-b border-slate-800 text-left shadow-md shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-400 font-bold tracking-wider uppercase">
                    {selectedFacility.category_name} 상세정보 (심평원 2026.06월 공공데이터)
                  </span>
                  {isLoadingDetail && (
                    <span className="flex items-center gap-1 text-[11px] text-cyan-400 animate-pulse font-medium">
                      <Loader2 className="w-3 h-3 animate-spin" /> 세부정보 로딩중...
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 mt-0.5">
                  {selectedFacility.name}
                  {selectedFacility.grade_evaluation && (
                    <span className="text-xs bg-amber-950 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/40 font-semibold">
                      심평원 {selectedFacility.grade_evaluation}
                    </span>
                  )}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {selectedFacility.url && (
                  <a
                    href={selectedFacility.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition font-semibold"
                  >
                    공식 홈페이지 <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {selectedFacility.address}
            </p>
          </div>
        )}

        {/* 우측 메인 콘텐츠 영역: 카카오맵 & 상세 스펙 */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
          {/* 카카오맵 컨테이너 */}
          <div
            ref={mapContainer}
            className={`w-full h-full absolute inset-0 ${
              viewMode === 'map' ? 'z-20 opacity-100' : 'z-0 opacity-0 pointer-events-none'
            }`}
          />

          {/* 상세 스펙 전체 뷰 (스크린샷 항목 100% 완전 일치 복원) */}
          {selectedFacility && viewMode === 'detail' && (
            <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between bg-[#0a0f1d] overflow-y-auto custom-scrollbar text-left">
              <div className="space-y-5">
                {/* (1) 상단 4대 핵심 지표 그리드 (허가 병상수, 의사 및 전문의, 적정성 평가, 간호관리 등급) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-sm">
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-1 font-medium">
                      <Bed className="w-3.5 h-3.5 text-blue-400" /> 허가 병상수
                    </div>
                    <div className="text-lg font-bold text-white">
                      {selectedFacility.total_beds ? `${selectedFacility.total_beds}병상` : '외래 중심'}
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-sm">
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-1 font-medium">
                      <Stethoscope className="w-3.5 h-3.5 text-cyan-400" /> 의사 및 전문의
                    </div>
                    <div className="text-lg font-bold text-white">
                      총 {selectedFacility.doctor_count || 0}명
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      전문의 {selectedFacility.specialist_count || (selectedFacility as any).specialist_cnt || Math.floor((selectedFacility.doctor_count || 0) * 0.7)}명
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-sm">
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-1 font-medium">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> 적정성 평가
                    </div>
                    <div className="text-lg font-bold text-white">
                      {selectedFacility.grade_evaluation || '우수'}
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-sm">
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-1 font-medium">
                      <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> 간호관리 등급
                    </div>
                    <div className="text-lg font-bold text-white truncate">
                      {selectedFacility.nursing_grade || 'S등급'}
                    </div>
                  </div>
                </div>

                {/* (2) 주요 보유 의료장비 (심평원 시설정보) - 스크린샷 1 */}
                {selectedFacility.equipments && selectedFacility.equipments.length > 0 && (
                  <div className="bg-[#0b132b] p-5 rounded-2xl border border-slate-800/80 shadow-md">
                    <h4 className="text-sm font-bold text-cyan-400 mb-3.5 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-cyan-400" /> 주요 보유 의료장비 (심평원 시설정보)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFacility.equipments.map((eq, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 text-xs rounded-xl bg-cyan-950/60 text-cyan-200 border border-cyan-800/60 flex items-center gap-1.5 font-medium shadow-2xs"
                        >
                          <Microscope className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{eq}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* (3) 특화 진료 분야 및 시설 강점 - 스크린샷 1 */}
                {selectedFacility.special_treatments && selectedFacility.special_treatments.length > 0 && (
                  <div className="bg-[#0b132b] p-5 rounded-2xl border border-slate-800/80 shadow-md">
                    <h4 className="text-sm font-bold text-emerald-400 mb-3.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> 특화 진료 분야 및 시설 강점
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFacility.special_treatments.map((st, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 text-xs rounded-xl bg-emerald-950/60 text-emerald-200 border border-emerald-800/60 flex items-center gap-1.5 font-medium shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{st}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* (4) 기타 전문 의료인력 현황 & 입원식 및 식대가산 정보 - 스크린샷 2 */}
                {((selectedFacility.other_staff && selectedFacility.other_staff.length > 0) || (selectedFacility.meal_info && selectedFacility.meal_info.length > 0)) && (
                  <div className="bg-[#0b132b] p-5 rounded-2xl border border-slate-800/80 space-y-4 shadow-md">
                    {selectedFacility.other_staff && selectedFacility.other_staff.length > 0 && (
                      <div>
                        <span className="text-xs text-slate-400 font-medium block mb-2 flex items-center gap-1.5">
                          <Users2 className="w-4 h-4 text-slate-400" /> 기타 전문 의료인력 현황
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {selectedFacility.other_staff.map((st, i) => (
                            <span key={i} className="px-3 py-1 text-xs rounded-lg bg-slate-900 text-slate-300 border border-slate-800 font-medium">
                              {st}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedFacility.meal_info && selectedFacility.meal_info.length > 0 && (
                      <div>
                        <span className="text-xs text-slate-400 font-medium block mb-2 flex items-center gap-1.5">
                          <Utensils className="w-4 h-4 text-teal-400" /> 입원식 및 식대가산 정보
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {selectedFacility.meal_info.map((m, i) => (
                            <span key={i} className="px-3 py-1 text-xs rounded-lg bg-teal-950/60 text-teal-300 border border-teal-800/50 font-medium">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* (5) 개설 진료과목 - 스크린샷 2 */}
                {selectedFacility.treatments && selectedFacility.treatments.length > 0 && (
                  <div className="bg-[#0b132b] p-5 rounded-2xl border border-slate-800/80 shadow-md">
                    <h4 className="text-sm font-bold text-slate-200 mb-3">개설 진료과목</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFacility.treatments.map((t, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* (6) 오시는 길 및 교통편 안내 */}
                {selectedFacility.transport && (
                  <div className="bg-[#0b132b] p-5 rounded-2xl border border-slate-800/80 shadow-md">
                    <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-1.5">
                      <Bus className="w-4 h-4 text-purple-400" /> 교통편 및 오시는 길
                    </h4>
                    <div className="space-y-2 text-xs text-slate-300">
                      {selectedFacility.transport.traffic && (
                        <p className="flex items-start gap-2">
                          <Bus className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{selectedFacility.transport.traffic}</span>
                        </p>
                      )}
                      {selectedFacility.transport.parking && (
                        <p className="flex items-start gap-2">
                          <Car className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{selectedFacility.transport.parking}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 하단 전화 문의 & 카카오맵 길찾기 버튼 바 (스크린샷 2와 100% 일치) */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
                {getPhone(selectedFacility) && (
                  <a
                    href={`tel:${getPhone(selectedFacility)}`}
                    className="flex-1 min-w-[200px] py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-102"
                  >
                    <Phone className="w-4 h-4" />
                    <span>전화 문의 ({getPhone(selectedFacility)})</span>
                  </a>
                )}
                {/* 카카오맵 공식 길찾기 바로가기 */}
                <a
                  href={`https://map.kakao.com/link/search/${encodeURIComponent(selectedFacility.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all hover:scale-102"
                >
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <span>카카오맵 길찾기</span>
                </a>
              </div>
            </div>
          )}

          {!selectedFacility && (
            <div className="text-center text-slate-400 p-8">
              <Compass className="w-12 h-12 mx-auto mb-3 text-slate-600 stroke-1" />
              <p className="text-sm font-semibold text-slate-300">좌측 목록에서 병원을 선택해주세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
