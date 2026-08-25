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
      className={`bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/60 shadow-sm ${solution.borderHover}`}
    >
      {/* 카드 상단: 시각적 Mockup 프리뷰 영역 */}
      <div className={`h-48 p-6 relative overflow-hidden bg-gradient-to-br ${solution.accentGradient} flex flex-col justify-between`}>
        {/* 상단 뱃지 & 아이콘 */}
        <div className="flex items-center justify-between z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${solution.badgeColor} border backdrop-blur-md shadow-xs`}>
            {solution.badge}
          </span>
          <div className={`w-10 h-10 rounded-xl ${solution.iconBg} backdrop-blur-md flex items-center justify-center text-white shadow-md`}>
            {solution.icon}
          </div>
        </div>

        {/* 인터랙티브 Mockup 그래픽 표현 */}
        <div className="z-10 mt-auto">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
            {solution.title}
          </h3>
          <p className="text-xs text-white/90 font-medium mt-0.5 line-clamp-1">
            {solution.tagline}
          </p>
        </div>

        {/* 배경 그리드 및 글로우 */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />
        <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-white/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 카드 본문 */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-6 bg-white">
        <div>
          {/* 설명 */}
          <p className="text-sm text-slate-600 leading-relaxed min-h-[48px]">
            {solution.description}
          </p>

          {/* 핵심 기능 목록 */}
          <div className="mt-5 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Key Features
            </div>
            <ul className="space-y-1.5">
              {solution.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 기술 스택 요약 */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Tech Stack
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 font-medium">
                {solution.techStack.frontend}
              </span>
              <span className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 font-medium">
                {solution.techStack.backend}
              </span>
              <span className="px-2 py-0.5 text-[11px] rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                {solution.techStack.aiOrInfra}
              </span>
            </div>
          </div>
        </div>

        {/* 액션 버튼군 */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5">
          {solution.isInternalAnchor ? (
            <a
              href={solution.detailPath}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-200 transition-all text-center"
            >
              검색관 바로가기
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <Link
              href={solution.detailPath}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all text-center"
            >
              상세 소개 보기
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {solution.domainUrl && (
            <a
              href={solution.domainUrl}
              target={solution.domainUrl.startsWith("http") ? "_blank" : undefined}
              rel={solution.domainUrl.startsWith("http") ? "noopener noreferrer" : undefined}
              className="py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5 transition-all"
              title="서비스 바로가기"
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
