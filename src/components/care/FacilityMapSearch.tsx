"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Phone,
  Bed,
  Award,
  Compass,
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  Filter,
  Navigation,
  Building,
  Activity,
  Bus,
  Car,
  CheckCircle2,
  Sparkles,
  Info,
  Loader2,
} from 'lucide-react';
import { Facility, CategoryFilter } from '@/types/facility';
import { MOCK_FACILITIES } from '@/data/mockFacilities';

declare global {
  interface Window {
    kakao: any;
  }
}

interface FacilityMapSearchProps {
  initialCategory?: CategoryFilter;
}

// 5대 추천 / 스폰서 병원 (지역 명칭 제외 및 공식 광고 슬롯)
const RECOMMENDED_HOSPITALS = [
  { name: '효사랑가족요양병원', category: '요양' },
  { name: '보바스기념병원', category: '재활/요양' },
  { name: '인창요양병원', category: '요양' },
  { name: '청주필한방병원', category: '한방' },
  { name: '신윤수내과의원', category: '내과/투석' },
];

export const FacilityMapSearch: React.FC<FacilityMapSearchProps> = ({ initialCategory = 'ALL' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(MOCK_FACILITIES[0]);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSido, setSelectedSido] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageNo, setPageNo] = useState<number>(1);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [kakaoLoaded, setKakaoLoaded] = useState<boolean>(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [detailCache, setDetailCache] = useState<{ [id: string]: Facility }>({});

  const PAGE_SIZE = 40;
  const hasMore = facilities.length < totalCount;

  // 외부 initialCategory 변경 시 내부 activeCategory 동기화
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

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

  // 2. Supabase 기반 병의원 목록 비동기 조회 (첫 페이지 로드 및 필터 변경 시)
  useEffect(() => {
    let isCancelled = false;
    const fetchFirstPage = async () => {
      setIsLoadingList(true);
      setPageNo(1);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== 'ALL') params.append('category', activeCategory);
        if (searchTerm.trim()) params.append('query', searchTerm.trim());
        if (selectedSido !== 'ALL') params.append('sido', selectedSido);
        if (selectedGrade !== 'ALL') params.append('grade', selectedGrade);
        params.append('pageNo', '1');
        params.append('pageSize', String(PAGE_SIZE));

        const res = await fetch(`/api/facilities?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (!isCancelled && json.success) {
            setFacilities(json.data || []);
            setTotalCount(json.total || 0);
            if (json.data && json.data.length > 0) {
              handleSelectFacility(json.data[0]);
            } else {
              setSelectedFacility(null);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load facilities:', err);
      } finally {
        if (!isCancelled) setIsLoadingList(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchFirstPage();
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [activeCategory, searchTerm, selectedSido, selectedGrade]);

  // 2-1. 다음 페이지(무한스크롤 / 더보기) 로드 함수
  const loadMoreFacilities = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = pageNo + 1;

    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'ALL') params.append('category', activeCategory);
      if (searchTerm.trim()) params.append('query', searchTerm.trim());
      if (selectedSido !== 'ALL') params.append('sido', selectedSido);
      if (selectedGrade !== 'ALL') params.append('grade', selectedGrade);
      params.append('pageNo', String(nextPage));
      params.append('pageSize', String(PAGE_SIZE));

      const res = await fetch(`/api/facilities?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setFacilities((prev) => {
            // 중복 방지 (id 기준)
            const existingIds = new Set(prev.map((f) => f.id));
            const newItems = json.data.filter((f: Facility) => !existingIds.has(f.id));
            return [...prev, ...newItems];
          });
          setPageNo(nextPage);
          setTotalCount(json.total || 0);
        }
      }
    } catch (err) {
      console.error('Failed to load more facilities:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 2-2. 리스트 스크롤 감지 핸들러 (무한스크롤)
  const handleListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
    if (scrollBottom < 160 && hasMore && !isLoadingList && !isLoadingMore) {
      loadMoreFacilities();
    }
  };

  const filteredFacilities = facilities;

  // 3. 지도 마커 갱신 (카카오맵 활성화 시)
  useEffect(() => {
    if (!map || !window.kakao || !kakaoLoaded) return;

    markers.forEach((m) => m.setMap(null));
    const newMarkers: any[] = [];

    filteredFacilities.forEach((facility) => {
      const position = new window.kakao.maps.LatLng(facility.latitude, facility.longitude);
      const marker = new window.kakao.maps.Marker({
        position,
        map,
        title: facility.name,
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        handleSelectFacility(facility);
        map.panTo(position);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [map, kakaoLoaded, filteredFacilities]);

  // 4. 병원 클릭 시 상세정보 API 결합 호출
  const handleSelectFacility = async (fac: Facility) => {
    setSelectedFacility(fac);

    if (map && window.kakao) {
      const moveLatLon = new window.kakao.maps.LatLng(fac.latitude, fac.longitude);
      map.setLevel(4);
      map.panTo(moveLatLon);
    }

    // 이미 캐시된 상세정보가 있으면 적용
    if (detailCache[fac.id]) {
      setSelectedFacility(detailCache[fac.id]);
      return;
    }

    // 상세정보 API 비동기 결합 호출
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
            setDetailCache((prev) => ({ ...prev, [fac.id]: enriched }));
          }
        }
      } catch (err) {
        console.warn('Could not fetch extra facility detail:', err);
      } finally {
        setIsLoadingDetail(false);
      }
    }
  };

  const CATEGORY_TABS: { label: string; value: CategoryFilter; badge?: string }[] = [
    { label: '전체 기관', value: 'ALL' },
    { label: '상급·종합병원', value: 'general', badge: '3차·종합' },
    { label: '한방병원/한의원', value: 'oriental', badge: '전문의' },
    { label: '요양병원/요양원', value: '28', badge: '실버케어' },
    { label: '일반병원/의원', value: '21', badge: '양방/의원' },
    { label: '호스피스 완화의료', value: 'hospice', badge: '복지부 지정' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-[840px] w-full rounded-3xl overflow-hidden border border-slate-700/60 bg-[#0d1424] shadow-2xl">
      {/* 좌측 패널: 검색 / 필터 / 리스트 */}
      <div className="w-full lg:w-5/12 flex flex-col h-full border-r border-slate-700/50 bg-[#0a101d]">
        {/* 검색 및 필터 헤더 */}
        <div className="p-4 border-b border-slate-800 bg-[#0e1626] space-y-3">
          {/* 검색창 */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-emerald-400" />
            <input
              type="text"
              placeholder="예: '추나', '척추', '인공신장', '혈액투석', '골밀도', '효사랑가족요양병원' 등..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 pl-10 pr-14 text-sm text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                지우기
              </button>
            )}
          </div>

          {/* 5대 추천 / 파트너 병원 (지역 명칭 제외 및 광고 슬롯) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-slate-400 no-scrollbar">
            <span className="shrink-0 text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 추천 병원:
            </span>
            {RECOMMENDED_HOSPITALS.map((hosp) => (
              <button
                key={hosp.name}
                onClick={() => setSearchTerm(hosp.name)}
                className="shrink-0 px-2.5 py-0.5 rounded-md bg-emerald-950/50 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 transition font-medium flex items-center gap-1"
              >
                <span>{hosp.name}</span>
                <span className="text-[9px] text-emerald-400/70 bg-emerald-900/60 px-1 rounded">
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
                onClick={() => setActiveCategory(tab.value)}
                className={`rounded-lg px-2.5 py-1.5 transition-all flex items-center gap-1 ${
                  activeCategory === tab.value
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/40 border border-emerald-500'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className="text-[10px] bg-black/40 text-emerald-300 px-1 rounded border border-emerald-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 서브 필터 (지역 & 등급 선택) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> 지역:
              </span>
              <select
                value={selectedSido}
                onChange={(e) => setSelectedSido(e.target.value)}
                className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-emerald-500"
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
              <span className="text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" /> 등급:
              </span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-amber-500"
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


        {/* 시설 리스트 (Supabase DB 연계 결과 및 무한 스크롤) */}
        <div
          ref={listContainerRef}
          onScroll={handleListScroll}
          className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1 sticky top-0 bg-[#0a101d]/90 backdrop-blur py-1 z-10">
            <span>
              검색 결과 <strong className="text-emerald-400 font-bold">{totalCount.toLocaleString()}</strong>곳 
              <span className="text-[11px] text-slate-500 ml-1">
                (현재 {facilities.length.toLocaleString()}개 로드됨)
              </span>
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">2026.06월</span> HIRA 공공DB
            </span>
          </div>

          {isLoadingList && facilities.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-2" />
              <p className="text-sm font-medium text-slate-300">의료기관 데이터를 불러오는 중입니다...</p>
            </div>
          )}

          {filteredFacilities.map((fac) => {
            const isSelected = selectedFacility?.id === fac.id;
            return (
              <div
                key={fac.id}
                onClick={() => handleSelectFacility(fac)}
                className={`cursor-pointer rounded-2xl p-4 transition-all border text-left ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/40 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500'
                    : 'border-slate-800 bg-[#111928] hover:border-slate-700 hover:bg-[#141f33]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[11px] font-bold ${
                          fac.category_code === '01'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : fac.category_code === '11'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : fac.category_code === '21'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : fac.category_code === '31'
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                            : fac.category_code === '28'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                            : fac.category_code === '92' || fac.category_code === '93'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        }`}
                      >
                        {fac.category_name}
                      </span>
                      {fac.is_hospice && fac.category_code !== 'hospice' && (
                        <span className="bg-purple-900/40 text-purple-300 text-[10px] px-1.5 py-0.5 rounded border border-purple-500/30">
                          호스피스 병동
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300">
                      {fac.name}
                    </h3>
                  </div>

                  {fac.grade_evaluation && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[11px] font-bold text-amber-300 shrink-0">
                      <Award className="h-3 w-3" />
                      {fac.grade_evaluation}
                    </span>
                  )}
                </div>

                <p className="mt-2 flex items-center text-xs text-slate-400">
                  <MapPin className="mr-1 h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
                  {fac.address}
                </p>

                {/* 특수진료 / 강점 뱃지 */}
                {fac.special_treatments && fac.special_treatments.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {fac.special_treatments.slice(0, 3).map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-800/90 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700/60"
                      >
                        ✓ {spec}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs text-slate-400">
                  {fac.tel ? (
                    <a
                      href={`tel:${fac.tel}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors"
                    >
                      <Phone className="h-3 w-3 text-emerald-500" />
                      {fac.tel}
                    </a>
                  ) : (
                    <span className="text-slate-600">-</span>
                  )}
                  <div className="flex items-center gap-3">
                    {fac.doctor_count && (
                      <span className="flex items-center gap-1 text-slate-300">
                        <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
                        의사 {fac.doctor_count}명
                      </span>
                    )}
                    {fac.total_beds && (
                      <span className="flex items-center gap-1 text-slate-300">
                        <Bed className="h-3.5 w-3.5 text-slate-400" />
                        {fac.total_beds}병상
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* 더보기 버튼 및 로딩 인디케이터 */}
          {hasMore && (
            <div className="pt-2 pb-4 text-center">
              <button
                onClick={loadMoreFacilities}
                disabled={isLoadingMore}
                className="w-full py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-2 shadow-md hover:border-emerald-500/50"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
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
            <div className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/60">
              전체 {totalCount.toLocaleString()}곳의 조회가 완료되었습니다.
            </div>
          )}

          {!isLoadingList && filteredFacilities.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400 p-6">
              <Compass className="h-10 w-10 mb-3 text-slate-600 stroke-1 animate-pulse" />
              <p className="text-sm font-medium text-slate-300">조건에 일치하는 의료기관이 없습니다.</p>
              <p className="text-xs text-slate-500 mt-1">지역이나 검색어를 조정해 보세요.</p>
            </div>
          )}
        </div>
      </div>

      {/* 우측 패널: 클릭 시 결합되는 상세정보 (API 2: 의료기관별상세정보서비스) */}
      <div className="w-full lg:w-7/12 h-full flex flex-col bg-[#070b14] relative">
        {selectedFacility && (
          <div className="p-5 bg-gradient-to-r from-[#0e172a] via-[#111f38] to-[#0e172a] border-b border-slate-800 text-left">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-400 font-bold tracking-wider uppercase">
                    {selectedFacility.category_name} 상세정보 (심평원 2026.06월 공공데이터)
                  </span>
                  {isLoadingDetail && (
                    <span className="flex items-center gap-1 text-[11px] text-cyan-400 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" /> 세부정보 로딩중...
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 mt-0.5">
                  {selectedFacility.name}
                  {selectedFacility.grade_evaluation && (
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                      심평원 {selectedFacility.grade_evaluation}
                    </span>
                  )}
                </h2>
              </div>
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
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {selectedFacility.address}
            </p>
          </div>
        )}

        {/* 상세 스펙 뷰 (시설정보, 장비정보, 진료과목, 교통정보) */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
          <div ref={mapContainer} className="w-full h-full absolute inset-0" />

          {selectedFacility && (
            <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between bg-gradient-to-b from-[#09101d]/95 to-[#050811]/95 backdrop-blur-md overflow-y-auto custom-scrollbar">
              <div className="space-y-5 text-left">
                {/* 상단 4대 핵심 지표 그리드 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                      <Bed className="w-3.5 h-3.5 text-blue-400" /> 허가 병상수
                    </div>
                    <div className="text-lg font-bold text-white">
                      {selectedFacility.total_beds ? `${selectedFacility.total_beds}병상` : '외래 중심'}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                      <Stethoscope className="w-3.5 h-3.5 text-emerald-400" /> 의사 및 전문의
                    </div>
                    <div className="text-lg font-bold text-white">
                      {selectedFacility.doctor_count ? `총 ${selectedFacility.doctor_count}명` : '1~3명'}
                    </div>
                    {selectedFacility.specialist_count && (
                      <div className="text-[11px] text-emerald-400 mt-0.5">
                        전문의 {selectedFacility.specialist_count}명
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> 적정성 평가
                    </div>
                    <div className="text-lg font-bold text-white">
                      {selectedFacility.grade_evaluation || '우수'}
                    </div>
                    {selectedFacility.stroke_grade && (
                      <div className="text-[11px] text-amber-300 mt-0.5">
                        뇌졸중 {selectedFacility.stroke_grade}
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> 간호관리 등급
                    </div>
                    <div className="text-lg font-bold text-white">
                      {selectedFacility.nursing_grade || '1등급'}
                    </div>
                  </div>
                </div>

                {/* 1. 보유 의료장비 정보 (API 2: /getEqpInfo2.8 연계) */}
                {selectedFacility.equipments && selectedFacility.equipments.length > 0 && (
                  <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80">
                    <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-cyan-400" /> 주요 보유 의료장비 (심평원 시설정보)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFacility.equipments.map((eqp, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 font-medium"
                        >
                          🔬 {eqp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. 특수 진료 / 강점 클리닉 (API 2: /getSpclDiagInfo2.8 연계) */}
                {selectedFacility.special_treatments && selectedFacility.special_treatments.length > 0 && (
                  <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80">
                    <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> 특화 진료 분야 및 시설 강점
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFacility.special_treatments.map((spec, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 font-medium"
                        >
                          ✓ {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. 진료시간 & 응급실 & 주차 세부정보 (4.세부정보) */}
                {selectedFacility.detailed_info && Object.keys(selectedFacility.detailed_info).length > 0 && (
                  <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80">
                    <h4 className="text-sm font-bold text-slate-200 mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> 진료시간 · 응급실 · 주차 세부정보
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                      {selectedFacility.detailed_info.mon_time && (
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block mb-0.5 font-medium">🕒 평일 진료시간</span>
                          <span className="font-semibold text-slate-100">{selectedFacility.detailed_info.mon_time}</span>
                          {selectedFacility.detailed_info.lunch_weekday && (
                            <span className="text-[11px] text-slate-400 block mt-0.5">(점심: {selectedFacility.detailed_info.lunch_weekday})</span>
                          )}
                        </div>
                      )}
                      {selectedFacility.detailed_info.sat_time && (
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block mb-0.5 font-medium">🕒 토요일 진료시간</span>
                          <span className="font-semibold text-slate-100">{selectedFacility.detailed_info.sat_time}</span>
                          {selectedFacility.detailed_info.sun_closed && (
                            <span className="text-[11px] text-rose-400 block mt-0.5">일요일: {selectedFacility.detailed_info.sun_closed}</span>
                          )}
                        </div>
                      )}
                      {(selectedFacility.detailed_info.er_day_yn === 'Y' || selectedFacility.detailed_info.er_night_yn === 'Y') && (
                        <div className="bg-rose-950/40 p-2.5 rounded-xl border border-rose-900/50">
                          <span className="text-rose-400 block mb-0.5 font-bold">🚨 응급실 운영</span>
                          <span className="text-rose-200">
                            주간 {selectedFacility.detailed_info.er_day_yn === 'Y' ? '운영' : '미운영'} / 야간 {selectedFacility.detailed_info.er_night_yn === 'Y' ? '운영' : '미운영'}
                          </span>
                          {selectedFacility.detailed_info.er_day_tel && (
                            <span className="text-[11px] text-rose-300 block mt-0.5">직통: {selectedFacility.detailed_info.er_day_tel}</span>
                          )}
                        </div>
                      )}
                      {selectedFacility.detailed_info.parking_count !== undefined && (
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-slate-400 block mb-0.5 font-medium">🚗 주차 안내</span>
                          <span className="font-semibold text-slate-100">
                            {selectedFacility.detailed_info.parking_count > 0 ? `총 ${selectedFacility.detailed_info.parking_count}대 가능` : '주차공간 협소'}
                            {selectedFacility.detailed_info.parking_cost === 'N' ? ' (무료)' : selectedFacility.detailed_info.parking_cost === 'Y' ? ' (유료)' : ''}
                          </span>
                          {selectedFacility.detailed_info.parking_memo && (
                            <span className="text-[11px] text-slate-400 block mt-0.5">{selectedFacility.detailed_info.parking_memo}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. 전문병원 지정 및 식대가산 / 기타인력 */}
                {(selectedFacility.special_hospital_field || (selectedFacility.other_staff && selectedFacility.other_staff.length > 0) || (selectedFacility.meal_info && selectedFacility.meal_info.length > 0)) && (
                  <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                    {selectedFacility.special_hospital_field && (
                      <div>
                        <span className="text-xs text-indigo-400 font-bold block mb-1">🏥 보건복지부 지정 전문병원 분야</span>
                        <span className="px-3 py-1 text-xs rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 font-bold">
                          ★ {selectedFacility.special_hospital_field} 전문병원
                        </span>
                      </div>
                    )}
                    {selectedFacility.other_staff && selectedFacility.other_staff.length > 0 && (
                      <div>
                        <span className="text-xs text-slate-400 font-medium block mb-1.5">👨‍⚕️ 기타 전문 의료인력 현황</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedFacility.other_staff.map((st, i) => (
                            <span key={i} className="px-2 py-0.5 text-[11px] rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                              {st}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedFacility.meal_info && selectedFacility.meal_info.length > 0 && (
                      <div>
                        <span className="text-xs text-slate-400 font-medium block mb-1.5">🍱 입원식 및 식대가산 정보</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedFacility.meal_info.map((m, i) => (
                            <span key={i} className="px-2 py-0.5 text-[11px] rounded-lg bg-teal-950/50 text-teal-300 border border-teal-800/50">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. 개설 진료과목 (API 2: /getDgsbjtInfo2.8 연계) */}
                {selectedFacility.treatments && selectedFacility.treatments.length > 0 && (
                  <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80">
                    <h4 className="text-sm font-bold text-slate-200 mb-2">개설 진료과목</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFacility.treatments.map((t, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. 교통 및 주차 안내 (API 2: /getTrnsprtInfo2.8 연계) */}
                {selectedFacility.transport && (
                  <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80">
                    <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                      <Bus className="w-4 h-4 text-purple-400" /> 오시는 길 및 교통편 안내
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-300">
                      {selectedFacility.transport.traffic && (
                        <p className="flex items-start gap-1.5">
                          <Bus className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{selectedFacility.transport.traffic}</span>
                        </p>
                      )}
                      {selectedFacility.transport.parking && (
                        <p className="flex items-start gap-1.5">
                          <Car className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{selectedFacility.transport.parking}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}


                {/* 액션 버튼 */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {selectedFacility.tel && (
                    <a
                      href={`tel:${selectedFacility.tel}`}
                      className="flex-1 min-w-[160px] py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition"
                    >
                      <Phone className="w-4 h-4" /> 전화 문의 ({selectedFacility.tel})
                    </a>
                  )}
                  <a
                    href={`https://map.kakao.com/link/search/${encodeURIComponent(selectedFacility.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
                  >
                    <Navigation className="w-4 h-4 text-cyan-400" /> 카카오맵 길찾기
                  </a>
                </div>
              </div>

              {/* 하단 공공데이터 출처 고지 */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center flex items-center justify-center gap-2">
                <span>데이터 출처: 건강보험심사평가원(HIRA) 심평원 공공데이터</span>
                <span>•</span>
                <span>Supabase PostgreSQL (2026.06월 HIRA 공공데이터 구축)</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
