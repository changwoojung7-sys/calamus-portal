"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { FacilityMapSearch } from "@/components/care/FacilityMapSearch";
import { QuickCategoryCards } from "@/components/care/QuickCategoryCards";
import { CareMagazineSection } from "@/components/care/CareMagazineSection";
import Footer from "@/components/common/Footer";

function HospitalsSearchContent() {
  const searchParams = useSearchParams();
  const initialCatParam = searchParams.get("category") || "ALL";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCatParam);

  const handleCategorySelect = (categoryCode: string) => {
    setSelectedCategory(categoryCode);
    const searchSection = document.getElementById("search-results-anchor");
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* 딥 사파이어 & 오션 블루 앰비언트 글로우 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1e3a8a_0%,_#0a0f1d_75%)] -z-10" />
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-50 opacity-90" />

      {/* 1. GNB 헤더 (진한 다크 네이비 바탕으로 메뉴 시인성 극대화) */}
      <header className="sticky top-0 z-40 bg-slate-900/95 text-white backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-slate-200 hover:text-emerald-400 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-emerald-400" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-extrabold text-base shadow-sm">
                C
              </div>
              <span className="text-sm font-bold text-white tracking-tight">
                Calamus <span className="text-emerald-400">포털 메인으로</span>
              </span>
            </div>
          </Link>

          {/* 서브 네비게이션 */}
          <nav className="hidden sm:flex items-center gap-5 text-xs sm:text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              솔루션 소개
            </Link>
            <Link href="/solutions/my-re-design" className="hover:text-purple-300 transition-colors">
              My Re Design
            </Link>
            <Link href="/solutions/lua-visibility" className="hover:text-cyan-300 transition-colors">
              LUVIS
            </Link>
            <Link
              href="/#lounge"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 font-bold hover:bg-indigo-900 transition-all text-xs shadow-xs"
            >
              <Sparkles className="h-3 w-3 text-indigo-400" />
              힐링 라운지
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. 히어로 섹션 (진한 푸른색 배경 & 고대비 텍스트) */}
      <section className="relative py-12 sm:py-16 px-4 sm:px-6 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-4 py-1.5 text-xs font-bold text-emerald-300 mb-5 shadow-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            건강보험심사평가원(HIRA) 2026.06월 최신 공공데이터 연동 (전국 79,000+ 개소)
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
            전국 병원 · 의원 · 요양시설 <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300">
              실시간 맞춤 스마트 탐색
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            상급종합병원, 종합병원, 전문의원(3.7만여 건), 요양병원, 한방병원 및 호스피스 완화의료 시설까지
            위치 기반 인터랙티브 지도와 세부 진료과목·장비 정보를 한눈에 검색하고 비교해보세요.
          </p>

          {/* 퀵 카테고리 바로가기 */}
          <div className="mt-8">
            <QuickCategoryCards onSelectCategory={handleCategorySelect} />
          </div>
        </div>
      </section>

      {/* 4. 전국 시설 검색 & 인터랙티브 지도 본체 */}
      <section id="search-results-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 scroll-mt-20">
        <FacilityMapSearch initialCategory={selectedCategory as any} />
      </section>

      {/* 5. 케어 매거진 & 가이드 섹션 */}
      <CareMagazineSection />

      {/* 6. 푸터 */}
      <Footer />
    </div>
  );
}

export default function HospitalsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center text-emerald-400">로딩 중...</div>}>
      <HospitalsSearchContent />
    </Suspense>
  );
}
