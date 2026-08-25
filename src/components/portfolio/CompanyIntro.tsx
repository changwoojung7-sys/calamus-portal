"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Cpu,
  Globe2,
  ArrowRight,
  Database,
  Smartphone,
  ShieldCheck,
  Zap,
  Target
} from "lucide-react";

export default function CompanyIntro() {
  const coreStrengths = [
    {
      icon: Cpu,
      title: "실용적 생성형 AI 엔지니어링",
      desc: "단순한 텍스트 생성을 넘어, 실제 사용자의 행동 변화와 가족 안심 케어, 기업 경영진의 의사결정에 직결되는 고부가가치 상용화 AI 엔진을 설계합니다.",
      tag: "Actionable AI",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      borderColor: "hover:border-emerald-400 hover:shadow-emerald-900/5",
    },
    {
      icon: Database,
      title: "데이터 무결성과 고성능 클라우드",
      desc: "심평원 공공데이터 정합성 검증부터 Supabase 기반 클라우드 저장소, 실시간 엣지 파이프라인을 구축하여 최고 수준의 신뢰성과 속도를 보장합니다.",
      tag: "Reliable Data",
      color: "text-cyan-600 bg-cyan-50 border-cyan-200",
      borderColor: "hover:border-cyan-400 hover:shadow-cyan-900/5",
    },
    {
      icon: Smartphone,
      title: "초개인화 모바일 & 실버 친화적 UX",
      desc: "설치 없이 즉시 실행되는 모바일 PWA 기술과 직관적인 고대비 UI를 적용하여 남녀노소 모든 세대가 가장 쉽고 편안하게 이용할 수 있습니다.",
      tag: "Universal UX",
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      borderColor: "hover:border-indigo-400 hover:shadow-indigo-900/5",
    },
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 relative overflow-hidden bg-slate-50/50">
      {/* 배경 장식 글로우 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-emerald-500/5 via-cyan-500/5 to-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* 1. 섹션 헤더 및 회사 정체성 소개 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-wide uppercase mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            About 유진AI(YujinAI) & Calamus Vision
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            기술로 일상을 바꾸고, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
              AI로 미래의 가치를 연결합니다
            </span>
          </h2>
          <p className="mt-5 text-slate-600 text-sm sm:text-base leading-relaxed">
            <strong>유진AI(YujinAI)</strong>는 최첨단 생성형 AI와 정밀 데이터 엔지니어링 기술을 결합하여, 
            개인의 건강한 일상 습관부터 초고령 사회의 가족 안심 돌봄, 공공 의료정보 인프라, 
            그리고 AI 검색 시대 기업의 시장 지배력 확보까지 <strong>삶과 비즈니스 전 영역에 실질적인 혁신 솔루션을 제공하는 AI 테크 기업</strong>입니다.
          </p>
        </div>

        {/* 2. 유진AI 기술 경쟁력 및 개발 철학 (3대 핵심 가치) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
          {coreStrengths.map((item, idx) => {
            const StrengthIcon = item.icon;
            return (
              <div
                key={idx}
                className={`bg-white border border-slate-200/90 rounded-2xl p-7 relative overflow-hidden group transition-all duration-300 ${item.borderColor} hover:-translate-y-1 hover:shadow-xl shadow-xs`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    <StrengthIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                    {item.tag}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* 3. 통합 에코시스템 비전 배너 & CTA */}
        <div className="bg-gradient-to-r from-slate-900 via-[#112233] to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Globe2 className="w-4 h-4" /> Comprehensive AI Ecosystem
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                유진AI(YujinAI)와 함께하는 <br />
                <span className="text-emerald-400">데이터와 AI 기반의 지속 가능한 미래</span>
              </h3>
              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                Calamus 공식 허브를 구심점으로 개인(B2C)과 시니어 돌봄(Care), 병원 및 기업(B2B)을 아우르는 
                초연결 AI 에코시스템을 지속적으로 확장해 나가고 있습니다.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-105"
              >
                솔루션 포트폴리오 보기
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/hospitals"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm transition-all hover:scale-105"
              >
                전국 메디컬 시설 검색
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
