"use client";

import React from "react";
import Link from "next/link";
import {
  FlaskConical,
  Sparkles,
  ExternalLink,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function CalamusLabsSection() {
  const labProjects = [
    {
      id: "my-re-design",
      badge: "AI Lifestyle & Routine PWA",
      badgeColor: "bg-purple-950/80 text-purple-300 border-purple-500/40",
      title: "My Re Design & LUVIS",
      tagline: "초개인화 습관 형성 PWA & AI 가시성 진단",
      desc: "타이핑 없는 Zero UI 기반의 AI 일상 루틴 코칭 PWA 앱과, 생성형 AI(ChatGPT, Gemini) 시대의 의료/기업 추천 지분을 측정하는 AEO·GEO 가시성 분석 실험 모델입니다.",
      features: [
        "신체/마음/성장/재미 4각 밸런스 AI 데일리 미션",
        "설치 없이 모바일 홈 화면에 추가하는 반응형 PWA",
        "생성형 AI 추천 점유율(SOV) 정밀 관제 엔진"
      ],
      detailUrl: "/solutions/my-re-design",
      siteUrl: "https://myredesign.ai.kr",
      siteLabel: "myredesign.ai.kr",
      borderHover: "hover:border-purple-500/50 hover:shadow-purple-950/20",
      iconBg: "bg-purple-950/80 text-purple-400 border-purple-500/40",
      icon: Sparkles
    }
  ];

  return (
    <section id="labs" className="py-20 px-4 sm:px-6 relative bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* 섹션 상단 헤더 */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold tracking-wide uppercase mb-3">
            <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
            Calamus Labs · Experimental R&D
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            삶의 결을 다듬는 Calamus 기술 실험실
          </h2>
          <p className="mt-3 text-slate-400 text-xs sm:text-sm leading-relaxed">
            메인 솔루션과 더불어, 개인의 건강한 일상 습관 형성과 AI 가시성 진단을 위해
            지속적으로 연구 개발 중인 실험용 프로토타입 프로젝트입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
          {labProjects.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg ${item.borderHover}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${item.iconBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs font-medium text-slate-400 mb-3">{item.tagline}</p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-5">{item.desc}</p>

                  <div className="space-y-1.5 pt-3 border-t border-slate-800/80 mb-6">
                    {item.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                  <Link
                    href={item.detailUrl}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <span>가이드 보기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={item.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>바로가기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
