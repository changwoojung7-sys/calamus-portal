"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Building2,
  Stethoscope,
  Search,
  Sparkles,
  MapPin,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  HeartPulse,
  Brain,
  Compass,
  ArrowRight
} from "lucide-react";

export default function OnAnBuHospitalSection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const galleryImages = [
    {
      label: "지능형 병원 검색 포털",
      src: "/images/solutions/onanbu-portal/onanbu-hero.png",
      desc: "공공데이터와 AI를 결합한 차세대 환자 중심 의료정보 포털 메인"
    },
    {
      label: "병원 찾기 검색관",
      src: "/images/solutions/onanbu-portal/onanbu-search.png",
      desc: "상급종합부터 동네 전문의원까지 조건별 정밀 필터링"
    },
    {
      label: "주변 상급종합병원 지도",
      src: "/images/solutions/onanbu-portal/onanbu-map.png",
      desc: "내 위치 기반 응급 및 상급의료기관 위치와 병상 정보 탐색"
    },
    {
      label: "AI 질환·증상 질문답변",
      src: "/images/solutions/onanbu-portal/onanbu-ai.png",
      desc: "증상에 맞는 진료과와 전문 병원을 큐레이션하는 AI 가이드"
    }
  ];

  const highlights = [
    {
      icon: Database,
      title: "HIRA 전국 7.9만 병의원 공공데이터",
      desc: "건강보험심사평가원 최신 공공데이터를 기반으로 상급종합, 전문의원(3.7만건), 한방, 요양병원, 호스피스까지 전국의 모든 의료기관 정보를 실시간 제공합니다."
    },
    {
      icon: Brain,
      title: "증상별 맞춤 AI 질문답변 큐레이션",
      desc: "어디가 아플 때 어느 진료과를 가야 할지 막막한 환자를 위해, 인공지능이 증상별 추천 진료과와 전문 의료기관을 명쾌하게 안내합니다."
    },
    {
      icon: MapPin,
      title: "위치 기반 인터랙티브 병원 지도",
      desc: "내 주변의 야간 진료 병원, 투석실, 소아과, CT/MRI 보유 의료기관을 지도 위에서 직관적으로 탐색하고 즉시 진료 정보를 확인합니다."
    },
    {
      icon: ShieldCheck,
      title: "투명하고 정직한 의료정보 생태계",
      desc: "광고성 조작 없는 정직한 공공데이터 인프라를 바탕으로 환자의 알 권리를 보장하고 신뢰할 수 있는 병원 선택을 돕습니다."
    }
  ];

  function Database(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
      </svg>
    );
  }

  return (
    <section id="onanbu" className="py-24 px-4 sm:px-6 relative overflow-hidden bg-slate-900 text-white">
      {/* 백그라운드 청록 글로우 */}
      <div className="absolute top-1/2 -right-48 w-96 h-96 bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-80 h-80 bg-teal-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 섹션 상단 헤더 */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-4 shadow-sm">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
              Flagship Solution 02 · 차세대 스마트 헬스케어 포털
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              환자와 병원을 가장 정직하게 잇는 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                온안부 (OnAnBu) 지능형 병원 검색 포털
              </span>
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              건강보험심사평가원의 방대한 전국 보건의료 공공데이터를 인공지능 기술과 융합하여, 
              나와 가족에게 꼭 필요한 전문 병의원과 맞춤 의료정보를 가장 빠르고 직관적으로 찾아드립니다.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://onanbu.calamus.ai.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-950/50 transition-all hover:scale-105"
            >
              <span>온안부 병원검색 베타 바로가기</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 인터랙티브 쇼케이스 뷰어 (탭 + 이미지 프리뷰) */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-16 shadow-2xl backdrop-blur-md">
          <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800/80 pb-4">
            {galleryImages.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === idx
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40"
                    : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 고화질 스크린샷 영역 */}
            <div className="lg:col-span-8 relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group">
              <Image
                src={galleryImages[activeTab].src}
                alt={galleryImages[activeTab].label}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/60">
                <span className="font-bold text-emerald-400">🏥 {galleryImages[activeTab].label}:</span> {galleryImages[activeTab].desc}
              </div>
            </div>

            {/* 핵심 스펙 박스 */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block mb-1">
                  Verified Public Big Data
                </span>
                <h4 className="text-base font-bold text-white mb-2">공공데이터 기반 실시간 탐색 스펙</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>전국 상급종합, 종합병원, 일반의원(3.7만) 완벽 수록</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>한방병원, 요양병원, 호스피스 완화의료 전문 시설 필터</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>인공신장실, MRI/CT 특수장비 및 특화진료 보유 여부 확인</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>베타 테스트 완료 수준의 독립 전용 웹사이트 즉시 가동</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-800/40">
                <h4 className="text-sm font-bold text-emerald-300 mb-1">베타 테스트 체험관</h4>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  지금 바로 온안부 병원검색 전용 포털 사이트에서 전국의 의료기관을 스마트하게 검색해 보세요.
                </p>
                <a
                  href="https://onanbu.calamus.ai.kr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>온안부 병원검색관 입장</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4대 주요 특징 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 hover:border-emerald-500/40 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* [AEO / GEO / Trust] 일반 지도 포털 vs 온안부 의료정보 비교표 */}
        {/* ========================================================= */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-16 shadow-2xl backdrop-blur-md">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/30 uppercase">
              Medical Verification & Intelligence
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
              일반 지도 앱 vs 온안부(OnAnBu) 지능형 포털
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              상업적 리뷰나 키워드 광고에 의존하는 일반 포털과 달리, 국가 공공데이터 기반 100% 팩트 매칭과 환자 중심의 의료 정보 체계를 제공합니다.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4 font-bold">비교 항목</th>
                  <th className="py-3 px-4 font-bold text-slate-400">일반 지도 포털 (네이버·카카오 지도)</th>
                  <th className="py-3 px-4 font-bold text-emerald-300 bg-emerald-950/30 rounded-t-xl">
                    온안부 (OnAnBu) 의료정보 포털
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">데이터 출처 및 신뢰성</td>
                  <td className="py-3.5 px-4 text-slate-400">사용자 등록 및 광고주 제휴 정보</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 bg-emerald-950/20">
                    심평원(HIRA) 7.9만 공공데이터 100% 팩트 그라운딩
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">의료 상세 스펙</td>
                  <td className="py-3.5 px-4 text-slate-400">위치, 영업시간, 주차 등 단순 정보</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 bg-emerald-950/20">
                    전문의 수, 인가 병상수, CT/MRI, 간호등급 등 12종 스펙
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">상급병원 퇴원 전원 연계</td>
                  <td className="py-3.5 px-4 text-slate-400">지원 안 됨 (단순 거리순 나열)</td>
                  <td className="py-3.5 px-4 font-bold text-teal-300 bg-emerald-950/20">
                    대학병원 기준 반경 5~15km 배후 전원 매칭 필터 지원
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">고난도 아급성기 케어</td>
                  <td className="py-3.5 px-4 text-slate-400">투석실, 격리실, 호스피스 구분 어려움</td>
                  <td className="py-3.5 px-4 font-bold text-cyan-300 bg-emerald-950/20">
                    투석+재활 동시 수용, 다제내성균 격리실 원클릭 큐레이션
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">증상별 AI 질의응답</td>
                  <td className="py-3.5 px-4 text-slate-400">키워드 매칭 광고 병원 우선 노출</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 bg-emerald-950/20">
                    증상별 맞춤 진료과 가이드 & 환각 없는 공공 병원 추천
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4대 고난도 아급성기 전원 매칭 스펙 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] font-bold text-emerald-400 block mb-1">Critical Care 01</span>
            <h4 className="text-base font-bold text-white mb-2">혈액투석 + 전문재활 동시 케어</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              신장 투석기와 재활치료실을 모두 갖춘 배후 의료기관을 원클릭 필터링하여 상급병원 퇴원 시 병상 정체를 해결합니다.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] font-bold text-teal-400 block mb-1">Critical Care 02</span>
            <h4 className="text-base font-bold text-white mb-2">다제내성균 격리병상 탐색</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              VRE, CRE 등 감염 격리가 필요한 환자를 위해 1인실 및 격리 병상을 보유한 요양·재활 전문 병원을 신속히 매칭합니다.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] font-bold text-cyan-400 block mb-1">Critical Care 03</span>
            <h4 className="text-base font-bold text-white mb-2">호스피스 완화의료 전문 기관</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              보건복지부 지정 전국 완화의료 전문기관 및 입원형 호스피스 시설의 병상과 전문 인력 현황을 투명하게 안내합니다.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] font-bold text-purple-400 block mb-1">Critical Care 04</span>
            <h4 className="text-base font-bold text-white mb-2">노인장기요양 2.8만 개소 연계</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              의료기관 치료 후 재가급여, 방문요양, 주야간보호, 요양시설로 이어지는 돌봄 전 주기를 하나의 포털로 융합합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
