"use client";

import React from "react";
import { Sparkles, Cpu, Target, Rocket, Globe2, ArrowRight } from "lucide-react";

export default function CompanyIntro() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            About EUGENE AI & Calamus
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            기술로 일상을 바꾸고, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              AI로 미래의 가치를 연결합니다
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            유진AI(EUGENE AI)는 최첨단 생성형 AI와 데이터 엔지니어링 기술을 바탕으로 라이프스타일, 시니어 케어, 
            비즈니스 인텔리전스까지 삶과 비즈니스의 전 영역에 실질적인 혁신 솔루션을 제공합니다.
          </p>
        </div>

        {/* 3대 핵심 가치 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#0b1322]/90 border border-slate-800/80 rounded-2xl p-7 relative overflow-hidden group hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">실용적 AI 솔루션</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              단순한 기술 탐색을 넘어 실제 사용자의 루틴 개선, 가족 케어, 기업 의사결정에 직결되는 상용화 AI 서비스를 설계합니다.
            </p>
          </div>

          <div className="bg-[#0b1322]/90 border border-slate-800/80 rounded-2xl p-7 relative overflow-hidden group hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">데이터 신뢰성과 안정성</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              심평원 공공데이터 연계부터 실시간 클라우드 엣지 파이프라인까지, 엄격한 데이터 검증과 고성능 인프라를 지향합니다.
            </p>
          </div>

          <div className="bg-[#0b1322]/90 border border-slate-800/80 rounded-2xl p-7 relative overflow-hidden group hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">스피드 & 사용자 중심 UX</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              모바일 PWA, 실버 친화적 UI, 초고속 엣지 렌더링을 적용하여 모든 디바이스에서 가장 빠르고 직관적인 경험을 전달합니다.
            </p>
          </div>
        </div>

        {/* 회사 연혁 & 비전 배너 */}
        <div className="bg-gradient-to-r from-[#0b172a] via-[#0d2238] to-[#0b172a] border border-slate-700/60 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Globe2 className="w-4 h-4" /> Comprehensive AI Ecosystem
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                유진AI가 구축하는 <br />
                <span className="text-emerald-400">4대 핵심 서비스 생태계</span>
              </h3>
              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                Calamus 공식 허브를 중심으로 라이프스타일(My Re Design), 케어 테크(온안부), 
                엔터프라이즈 BI(Lua Visibility)가 유기적으로 연결되어 완성도 높은 솔루션을 제공합니다.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/50 transition-all"
              >
                솔루션 포트폴리오 보기
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#search-section"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-semibold text-sm transition-all"
              >
                전국 메디컬 시설 검색
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
