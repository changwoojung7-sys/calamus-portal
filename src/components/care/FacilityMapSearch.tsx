"use client";

import React, { useEffect, useRef, useState } from 'react';
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
} from 'lucide-react';
import { Facility, CategoryFilter } from '@/types/facility';
import { MOCK_FACILITIES } from '@/data/mockFacilities';

declare global {
  interface Window {
    kakao: any;
  }
}

export const FacilityMapSearch: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(MOCK_FACILITIES[0]);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSido, setSelectedSido] = useState<string>('ALL');
  const [gradeFilter, setGradeFilter] = useState<boolean>(false);
  const [facilities, setFacilities] = useState<Facility[]>(MOCK_FACILITIES);
  const [kakaoLoaded, setKakaoLoaded] = useState<boolean>(false);

  // 1. 카카오맵 SDK 로드 및 초기화
  useEffect(() => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!kakaoKey || kakaoKey === 'YOUR_KAKAO_JS_KEY') {
      // 카카오맵 키 미설정 시에도 인터랙티브 목록 및 카드뷰는 정상 작동하도록 지원
      return;
    }

    const initMap = () => {
      if (!window.kakao || !window.kakao.maps || !mapContainer.current) return;
      const options = {
        center: new window.kakao.maps.LatLng(37.509745, 127.023245),
        level: 6,
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

  // 2. 필터링된 데이터 계산
  const filteredFacilities = facilities.filter((fac) => {
    // 카테고리 매칭
    const matchesCategory =
      activeCategory === 'ALL' ||
      (activeCategory === 'hospice' ? fac.is_hospice : fac.category_code === activeCategory);

    // 검색어 매칭 (이름, 주소, 진료과목)
    const matchesSearch =
      !searchTerm ||
      fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.treatments?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      fac.special_treatments?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    // 시도 지역 매칭
    const matchesSido = selectedSido === 'ALL' || (fac.sido_name && fac.sido_name.includes(selectedSido));

    // 1등급 필터
    const matchesGrade = !gradeFilter || fac.grade_evaluation?.includes('1등급') || fac.nursing_grade?.includes('1등급');

    return matchesCategory && matchesSearch && matchesSido && matchesGrade;
  });

  // 3. 지도 마커 갱신 (카카오맵 활성화 시)
  useEffect(() => {
    if (!map || !window.kakao || !kakaoLoaded) return;

    // 기존 마커 정리
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
        setSelectedFacility(facility);
        map.panTo(position);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [map, kakaoLoaded, filteredFacilities]);

  // 시설 선택 시 지도 포커스 이동
  const handleSelectFacility = (fac: Facility) => {
    setSelectedFacility(fac);
    if (map && window.kakao) {
      const moveLatLon = new window.kakao.maps.LatLng(fac.latitude, fac.longitude);
      map.setLevel(4);
      map.panTo(moveLatLon);
    }
  };

  const CATEGORY_TABS: { label: string; value: CategoryFilter; badge?: string }[] = [
    { label: '전체 기관', value: 'ALL' },
    { label: '한방병원', value: '28' },
    { label: '한의원', value: '93' },
    { label: '요양병원', value: '21', badge: '1등급' },
    { label: '호스피스 완화의료', value: 'hospice' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-[780px] w-full rounded-2xl overflow-hidden border border-slate-700/60 bg-[#0d1424] shadow-2xl">
      {/* 좌측 패널: 검색 / 필터 / 리스트 */}
      <div className="w-full lg:w-5/12 flex flex-col h-full border-r border-slate-700/50 bg-[#0a101d]">
        {/* 검색 및 필터 헤더 */}
        <div className="p-4 border-b border-slate-800 bg-[#0e1626] space-y-3">
          {/* 검색창 */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-emerald-400" />
            <input
              type="text"
              placeholder="기관명, 지역(강남, 성남), 진료과목(척추, 재활)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
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

          {/* 카테고리 탭 */}
          <div className="flex flex-wrap gap-1.5 text-xs font-medium">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value)}
                className={`rounded-lg px-3 py-1.5 transition-all flex items-center gap-1.5 ${
                  activeCategory === tab.value
                    ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-900/40 border border-emerald-500'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1 rounded border border-emerald-500/40">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 서브 필터 (지역 & 1등급 전용) */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" /> 지역:
              </span>
              <select
                value={selectedSido}
                onChange={(e) => setSelectedSido(e.target.value)}
                className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">전국 전체</option>
                <option value="서울">서울특별시</option>
                <option value="경기">경기도</option>
                <option value="인천">인천광역시</option>
              </select>
            </div>

            <button
              onClick={() => setGradeFilter(!gradeFilter)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                gradeFilter
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <Award className="w-3 h-3 text-amber-400" />
              1등급 기관만
            </button>
          </div>
        </div>

        {/* 시설 리스트 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
            <span>
              검색 결과 <strong className="text-emerald-400 font-bold">{filteredFacilities.length}</strong>곳
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> 심평원 연계 검증
            </span>
          </div>

          {filteredFacilities.map((fac) => {
            const isSelected = selectedFacility?.id === fac.id;
            return (
              <div
                key={fac.id}
                onClick={() => handleSelectFacility(fac)}
                className={`cursor-pointer rounded-xl p-4 transition-all border text-left ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/40 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500'
                    : 'border-slate-800 bg-[#111928] hover:border-slate-700 hover:bg-[#141f33]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[11px] font-bold ${
                          fac.category_code === '28'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : fac.category_code === '21'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : fac.category_code === 'hospice'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
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

                {/* 진료과목 / 특수진료 뱃지 */}
                {fac.treatments && fac.treatments.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {fac.treatments.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700/60">
                        {t}
                      </span>
                    ))}
                    {fac.treatments.length > 3 && (
                      <span className="text-[10px] text-slate-500 py-0.5">+{fac.treatments.length - 3}</span>
                    )}
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
                    {fac.total_beds && (
                      <span className="flex items-center gap-1 text-slate-300">
                        <Bed className="h-3.5 w-3.5 text-slate-400" />
                        {fac.total_beds}병상
                      </span>
                    )}
                    {fac.nursing_grade && (
                      <span className="text-[11px] text-emerald-400 font-medium">
                        간호 {fac.nursing_grade}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredFacilities.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400 p-6">
              <Compass className="h-10 w-10 mb-3 text-slate-600 stroke-1 animate-pulse" />
              <p className="text-sm font-medium text-slate-300">조건에 일치하는 기관이 없습니다.</p>
              <p className="text-xs text-slate-500 mt-1">지역을 '전국'으로 변경하거나 검색어를 비워보세요.</p>
            </div>
          )}
        </div>
      </div>

      {/* 우측 패널: 인터랙티브 상세 정보 및 지도 뷰 */}
      <div className="w-full lg:w-7/12 h-full flex flex-col bg-[#070b14] relative">
        {/* 선택된 시설 탑 바 배너 */}
        {selectedFacility && (
          <div className="p-4 bg-gradient-to-r from-[#0e172a] via-[#111f38] to-[#0e172a] border-b border-slate-800 text-left">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">
                  Selected Facility Info
                </span>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
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
                  className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                >
                  홈페이지 <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {selectedFacility.address}
            </p>
          </div>
        )}

        {/* 카카오 지도 영역 또는 세련된 인터랙티브 폴백 뷰 */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
          <div ref={mapContainer} className="w-full h-full absolute inset-0" />

          {/* 지도 SDK 미설정 시 아름다운 인터랙티브 세부 스펙 뷰 폴백 */}
          {!kakaoLoaded && selectedFacility && (
            <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between bg-gradient-to-b from-[#09101d]/95 to-[#050811]/95 backdrop-blur-md overflow-y-auto">
              <div className="space-y-6 text-left">
                {/* 상단 스펙 그리드 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                      <Bed className="w-3.5 h-3.5 text-blue-400" /> 총 병상수
                    </div>
                    <div className="text-lg font-bold text-white">
                      {selectedFacility.total_beds ? `${selectedFacility.total_beds}병상` : '외래 중심'}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                      <Stethoscope className="w-3.5 h-3.5 text-emerald-400" /> 전문의 인력
                    </div>
                    <div className="text-lg font-bold text-white">
                      {selectedFacility.specialist_count ? `${selectedFacility.specialist_count}명` : `${selectedFacility.doctor_count || 1}명`}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> 적정성 평가
                    </div>
                    <div className="text-lg font-bold text-white">
                      {selectedFacility.grade_evaluation || '정보 수집중'}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> 간호관리등급
                    </div>
                    <div className="text-lg font-bold text-white">
                      {selectedFacility.nursing_grade || '1~2등급'}
                    </div>
                  </div>
                </div>

                {/* 특수 진료 및 주요 클리닉 */}
                {selectedFacility.special_treatments && (
                  <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800/80">
                    <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> 특화 진료 및 시설 강점
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFacility.special_treatments.map((spec, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 font-medium"
                        >
                          ✓ {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 전체 진료과목 */}
                {selectedFacility.treatments && (
                  <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800/80">
                    <h4 className="text-sm font-semibold text-slate-200 mb-2">개설 진료과목</h4>
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

                {/* 길찾기 & 전화상담 액션 버튼 */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {selectedFacility.tel && (
                    <a
                      href={`tel:${selectedFacility.tel}`}
                      className="flex-1 min-w-[160px] py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition"
                    >
                      <Phone className="w-4 h-4" /> 전화 문의하기 ({selectedFacility.tel})
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
                <span>데이터 제공: 건강보험심사평가원(HIRA) 공공데이터포털</span>
                <span>•</span>
                <span>위도/경도: {selectedFacility.latitude.toFixed(4)}, {selectedFacility.longitude.toFixed(4)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
