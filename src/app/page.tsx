"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  HeartHandshake,
  BookOpen,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronRight,
  Phone,
  Layers,
  Building,
  Activity,
} from "lucide-react";
import { FacilityMapSearch } from "@/components/care/FacilityMapSearch";
import { QuickCategoryCards } from "@/components/care/QuickCategoryCards";
import { CareMagazineSection } from "@/components/care/CareMagazineSection";
import { HealingLoungeBanner } from "@/components/care/HealingLoungeBanner";
import GoogleAd from "@/components/ads/GoogleAd";
import Footer from "@/components/common/Footer";

export default function Home() {
  const AD_SLOT_ID = "3529245457";
  const [selectedHeroCategory, setSelectedHeroCategory] = useState<string>("ALL");

  const scrollToSearch = (categoryCode?: string) => {
    if (categoryCode) {
      setSelectedHeroCategory(categoryCode);
    }
    document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#050913] text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* 백그라운드 앰비언트 글로우 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#0c2236,_#050913)] -z-10" />
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent z-50 opacity-80" />

      {/* 1. GNB 헤더 */}
      <header className="sticky top-0 z-40 bg-[#070e1c]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform border border-emerald-400/30">
              C
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                Calamus <span className="text-emerald-400 font-semibold">Care</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wider font-medium">
                전국 종합 메디컬 & 요양·호스피스 포털
              </p>
            </div>
          </Link>

          {/* GNB 메인 메뉴 */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <button
              onClick={() => scrollToSearch("general")}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              상급·종합병원
            </button>
            <button
              onClick={() => scrollToSearch("oriental")}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              한방병원/한의원
            </button>
            <button
              onClick={() => scrollToSearch("28")}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              요양병원/요양원
            </button>
            <button
              onClick={() => scrollToSearch("hospice")}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              호스피스 완화의료
            </button>
            <a
              href="#magazine"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              케어 가이드
            </a>
            <a
              href="#lounge"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 font-bold hover:bg-indigo-900/60 transition-all shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              힐링 라운지
            </a>
          </nav>


          {/* 모바일 힐링 라운지 퀵버튼 */}
          <div className="lg:hidden flex items-center">
            <a
              href="#lounge"
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-indigo-900/60 text-indigo-200 border border-indigo-700/60 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              마음쉼터
            </a>
          </div>
        </div>
      </header>

      {/* 2. 상단 스폰서 배너 광고 (기존 AdSense 유지) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="w-full bg-[#0b1322] border border-slate-800/80 rounded-xl p-3 flex justify-center items-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-60"></div>
          <div className="text-center w-full">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">
              Sponsored Content
            </span>
            <div className="min-h-[70px] w-full flex justify-center">
              <GoogleAd slot={AD_SLOT_ID} format="auto" responsive={true} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Hero 섹션 */}
      <section className="relative py-16 px-4 sm:px-6 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          {/* 심평원 공공데이터 공식 연계 뱃지 */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-4 py-1.5 text-xs font-semibold text-emerald-300 mb-6 shadow-lg shadow-emerald-950/60">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            건강보험심사평가원(HIRA) 공공데이터 Open API 실시간 연계
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
            상급종합병원 · 종합병원부터 <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              한방 · 요양병원/요양원 · 호스피스
            </span>{" "}
            전문 검색
          </h1>


          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            전국 7만여 개 의료기관의 공공데이터를 실시간으로 비교하세요.
            전문의 인력, 허가 병상수, 적정성 평가등급까지 검증된 의료 정보를 제공합니다.
          </p>

          {/* 퀵 카테고리 카드 바로가기 */}
          <div className="mt-10">
            <QuickCategoryCards onSelectCategory={(cat) => scrollToSearch(cat)} />
          </div>
        </div>
      </section>

      {/* 4. 시설 지도 및 상세 검색 섹션 */}
      <section id="search-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 text-left gap-2">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs tracking-wider uppercase mb-1">
              <Layers className="h-4 w-4" /> Interactive Medical Facility Explorer
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex flex-wrap items-center gap-3">
              전국 의료기관 & 요양시설 실시간 탐색
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold tracking-normal shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                심평원 제공 2026.06월 최신 데이터
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            상급종합, 종합, 일반병원, 요양, 한방, 호스피스별로 맞춤 시설을 찾아보세요.
          </p>

        </div>

        <FacilityMapSearch initialCategory={selectedHeroCategory as any} />
      </section>


      {/* 5. 케어 매거진 & 가이드 섹션 */}
      <CareMagazineSection />

      {/* 6. 힐링 라운지 (사주/타로/꿈해몽/게임 통합 배너) */}
      <HealingLoungeBanner />

      {/* 7. 푸터 */}
      <Footer />
    </div>
  );
}
