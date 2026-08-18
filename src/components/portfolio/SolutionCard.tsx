"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, ArrowRight, CheckCircle2, LucideIcon } from "lucide-react";

export interface SolutionItem {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  tagline: string;
  description: string;
  domainUrl?: string;
  domainDisplay?: string;
  detailPath: string;
  isInternalAnchor?: boolean;
  features: string[];
  techStack: {
    frontend: string;
    backend: string;
    aiOrInfra: string;
  };
  accentGradient: string;
  borderHover: string;
  iconBg: string;
  icon: React.ReactNode;
  mockupType: "calamus" | "myredesign" | "onanbu" | "lua";
}

interface SolutionCardProps {
  solution: SolutionItem;
}

export default function SolutionCard({ solution }: SolutionCardProps) {
  return (
    <div
      className={`bg-[#0b1322]/90 border border-slate-800/90 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${solution.borderHover}`}
    >
      {/* 카드 상단: 시각적 Mockup 프리뷰 영역 */}
      <div className={`h-48 p-6 relative overflow-hidden bg-gradient-to-br ${solution.accentGradient} flex flex-col justify-between`}>
        {/* 상단 뱃지 & 아이콘 */}
        <div className="flex items-center justify-between z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${solution.badgeColor} border backdrop-blur-md`}>
            {solution.badge}
          </span>
          <div className={`w-10 h-10 rounded-xl ${solution.iconBg} backdrop-blur-md flex items-center justify-center text-white shadow-md`}>
            {solution.icon}
          </div>
        </div>

        {/* 인터랙티브 Mockup 그래픽 표현 */}
        <div className="z-10 mt-auto">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
            {solution.title}
          </h3>
          <p className="text-xs text-slate-200/90 font-medium mt-0.5 line-clamp-1">
            {solution.tagline}
          </p>
        </div>

        {/* 배경 그리드 및 글로우 */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />
        <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 카드 본문 */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div>
          {/* 설명 */}
          <p className="text-sm text-slate-300 leading-relaxed min-h-[48px]">
            {solution.description}
          </p>

          {/* 핵심 기능 목록 */}
          <div className="mt-5 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Key Features
            </div>
            <ul className="space-y-1.5">
              {solution.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 기술 스택 요약 */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Tech Stack
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                {solution.techStack.frontend}
              </span>
              <span className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                {solution.techStack.backend}
              </span>
              <span className="px-2 py-0.5 text-[11px] rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 font-medium">
                {solution.techStack.aiOrInfra}
              </span>
            </div>
          </div>
        </div>

        {/* 액션 버튼군 */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2.5">
          {solution.isInternalAnchor ? (
            <a
              href={solution.detailPath}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all text-center"
            >
              검색기 바로 이용
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <Link
              href={solution.detailPath}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all text-center"
            >
              상세 소개 보기
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {solution.domainUrl && (
            <a
              href={solution.domainUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all"
              title="공식 서비스 바로가기"
            >
              <span>접속</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
