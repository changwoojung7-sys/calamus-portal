"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  HeartPulse,
  Monitor,
  Feather
} from "lucide-react";
import Footer from "@/components/common/Footer";
import CompanyIntro from "@/components/portfolio/CompanyIntro";
import WorkNexusSection from "@/components/portfolio/WorkNexusSection";
import OnAnBuHospitalSection from "@/components/portfolio/OnAnBuHospitalSection";
import { HealingLoungeBanner } from "@/components/care/HealingLoungeBanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/20 scroll-smooth">
      {/* 백그라운드 앰비언트 글로우 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#0f172a,_#020617_70%)] -z-10" />
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 via-purple-500 to-transparent z-50 opacity-70" />

      {/* 1. GNB 헤더 (회사소개를 맨 앞으로 배치) */}
      <header className="sticky top-0 z-40 bg-slate-950/90 text-white backdrop-blur-md border-b border-slate-800/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* 브랜드 로고 */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 via-teal-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              C
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                Calamus <span className="text-emerald-400 font-semibold text-sm">Portal</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wider font-medium">
                글과 목소리를 잇는 연결의 플랫폼
              </p>
            </div>
          </Link>

          {/* GNB 메인 메뉴 (회사소개 맨 앞) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <a
              href="#about"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-300 font-bold"
            >
              <Feather className="w-4 h-4 text-emerald-400" />
              회사소개 (About)
            </a>
            <a
              href="#worknexus"
              className="hover:text-purple-400 transition-colors flex items-center gap-1 text-slate-200 hover:text-purple-300"
            >
              <Monitor className="w-4 h-4 text-purple-400" />
              WorkNexus (가상오피스)
            </a>
            <a
              href="#onanbu"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-200 hover:text-emerald-300"
            >
              <HeartPulse className="w-4 h-4 text-teal-400" />
              온안부 (병원검색)
            </a>
            <Link href="/labs" className="hover:text-white transition-colors">
              Calamus Labs
            </Link>
            <a
              href="#lounge"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs"
            >
              <Sparkles className="h-3 w-3 text-indigo-400" />
              힐링 라운지
            </a>
          </nav>

          {/* 모바일 퀵 버튼 (소개 맨 앞) */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href="#about"
              className="px-2.5 py-1 text-xs rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-semibold"
            >
              회사소개
            </a>
            <a
              href="#worknexus"
              className="px-2 py-1 text-xs rounded-lg bg-slate-800 text-purple-300 font-medium"
            >
              가상오피스
            </a>
            <a
              href="#onanbu"
              className="px-2 py-1 text-xs rounded-lg bg-slate-800 text-teal-300 font-medium"
            >
              병원검색
            </a>
            <Link
              href="/labs"
              className="px-2 py-1 text-xs rounded-lg bg-slate-800 text-indigo-300 font-medium"
            >
              Labs
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero 섹션 */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          {/* 브랜드 태그 */}
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-800 px-4 py-1.5 text-xs font-bold text-slate-300 mb-6 shadow-sm backdrop-blur-md">
            <Feather className="h-3.5 w-3.5 text-emerald-400" />
            글과 목소리를 잇는 갈대, Calamus Official Portal
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
            떨어져 있어도 마주 보듯, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 via-purple-300 to-indigo-300">
              세상을 잇는 공간과 데이터의 기술
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
            PC통신 유니텔 시절 처음 싹틔운 소통의 철학이 오늘날의 소프트웨어로 태어났습니다. <br className="hidden sm:inline" />
            우리 회사 서버 한 대로 완성하는 독립 3D 가상 오피스 <strong className="text-purple-300">Calamus WorkNexus</strong>와,
            전국 병원 공공데이터를 가장 정직하게 잇는 <strong className="text-emerald-300">온안부 (OnAnBu)</strong>를 만나보세요.
          </p>

          {/* 주요 솔루션 퀵 진입 듀얼 버튼 */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#about"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/60 hover:scale-105 transition-all"
            >
              <Feather className="w-4 h-4 text-emerald-200" />
              <span>Calamus 회사소개 자세히 보기</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
            </a>

            <a
              href="#worknexus"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-950/60 hover:scale-105 transition-all"
            >
              <Monitor className="w-4 h-4 text-purple-200" />
              <span>Calamus WorkNexus 자세히 보기</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-200" />
            </a>

            <a
              href="#onanbu"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm shadow-lg hover:scale-105 transition-all"
            >
              <HeartPulse className="w-4 h-4 text-teal-300" />
              <span>온안부 병원검색 자세히 보기</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-300" />
            </a>
          </div>

          {/* 퀵 앵커 네비게이션 (소개 맨 앞) */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs text-slate-400">
            <a href="#about" className="hover:text-emerald-400 transition-colors font-semibold text-emerald-300">
              # 회사소개 & 창업자 스토리
            </a>
            <span className="text-slate-600">•</span>
            <a href="#worknexus" className="hover:text-purple-400 transition-colors">
              # WorkNexus 가상오피스
            </a>
            <span className="text-slate-600">•</span>
            <a href="#onanbu" className="hover:text-teal-400 transition-colors">
              # 온안부 병원검색
            </a>
            <span className="text-slate-600">•</span>
            <Link href="/labs" className="hover:text-slate-200 transition-colors">
              # Calamus Labs
            </Link>
          </div>
        </div>
      </section>

      {/* 3. [맨 앞 배치] 회사소개 & 창업자 스토리: About Calamus */}
      <CompanyIntro />

      {/* 4. 플래그십 솔루션 1: Calamus WorkNexus */}
      <WorkNexusSection />

      {/* 5. 플래그십 솔루션 2: 온안부 (OnAnBu) 지능형 병원 검색 포털 */}
      <OnAnBuHospitalSection />

      {/* 6. 라이프 엔터테인먼트: 힐링 라운지 3종 직접 노출 */}
      <HealingLoungeBanner />

      {/* 7. 푸터 */}
      <Footer />
    </div>
  );
}
