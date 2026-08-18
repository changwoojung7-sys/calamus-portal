"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Bell,
  Smile,
  ShieldCheck,
  Users,
  Smartphone,
  Sparkles,
  Zap,
  Activity,
  PhoneCall
} from "lucide-react";
import Footer from "@/components/common/Footer";

export default function OnAnBuPage() {
  const DOMAIN_URL = "https://onanbu.calamus.ai.kr";

  return (
    <div className="min-h-screen bg-[#050913] text-slate-100 font-sans selection:bg-rose-500/30">
      {/* 백그라운드 앰비언트 글로우 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#240f1a,_#050913)] -z-10" />
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent z-50 opacity-80" />

      {/* 헤더 네비게이션 */}
      <header className="sticky top-0 z-40 bg-[#070e1c]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Calamus AI 포털 메인으로</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-rose-400 font-semibold hidden sm:inline-block">
              케어 테크 & 가족 안부 플랫폼
            </span>
            <a
              href={DOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/50 transition-all"
            >
              <span>온안부 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-bold tracking-wide uppercase mb-6 shadow-lg shadow-rose-950/60">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            AI Senior Care & Family Well-being Platform
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            떨어져 있어도 마음은 늘 곁에, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300">
              온안부 (OnAnBu)
            </span>
          </h1>

          <p className="mt-6 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            부모님이나 돌봄이 필요한 소중한 가족의 건강과 안부를 AI가 정기적으로 확인하고 
            상태 변화를 분석하여 가족 모두에게 따뜻한 안심을 전하는 케어 테크 솔루션입니다.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={DOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-black text-sm shadow-xl shadow-rose-950/60 transition-all hover:scale-105"
            >
              <span>온안부 서비스 시작하기</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all"
            >
              핵심 기능 둘러보기
            </a>
          </div>

          {/* 도메인 정보 칩 */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
            <span className="text-slate-500 font-medium">공식 서비스 도메인:</span>
            <code className="text-rose-300 font-mono font-semibold">{DOMAIN_URL}</code>
          </div>
        </div>
      </section>

      {/* 프리뷰 그래픽 목업 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 mb-20">
        <div className="bg-[#0c1222] border border-rose-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-rose-950/40 relative overflow-hidden">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-xs font-mono text-slate-400">onanbu.calamus.ai.kr / care-status</span>
            </div>
            <span className="text-xs font-bold text-rose-400 px-3 py-1 bg-rose-950/80 border border-rose-800/60 rounded-full">
              Live Monitoring
            </span>
          </div>

          {/* 대시보드 시뮬레이션 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-rose-300 uppercase">오늘의 부모님 안부</span>
                <Smile className="w-4 h-4 text-rose-400" />
              </div>
              <div className="p-4 bg-rose-950/40 border border-rose-800/50 rounded-xl text-center">
                <div className="text-2xl font-black text-white mb-1">"건강하고 편안해요"</div>
                <p className="text-xs text-rose-300 font-medium">오늘 오전 09:30 안부 체크인 완료</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/50">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 식사 및 복약 확인됨
                </div>
              </div>
            </div>

            <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-pink-300 uppercase">정기 알림 & AI 메시징</span>
                <Bell className="w-4 h-4 text-pink-400" />
              </div>
              <div className="space-y-2.5">
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>안부 알림 발송</span>
                    <span>오전 09:00</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium">
                    "어머니, 좋은 아침입니다! 오늘 아침 식사는 맛있게 드셨나요?"
                  </p>
                </div>
                <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-800/40">
                  <div className="flex items-center justify-between text-[11px] text-rose-400 mb-1">
                    <span>보호자 알림 전달</span>
                    <span>오전 09:31</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium">
                    "어머님이 밝은 목소리로 응답하셨습니다."
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-amber-300 uppercase">웰빙 & 감정 트렌드</span>
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex flex-col items-center justify-center py-2">
                <div className="text-3xl font-black text-white mb-1">안정적 상태</div>
                <p className="text-xs text-slate-400">최근 30일 안부 응답률 98%</p>
                <div className="w-full grid grid-cols-7 gap-1 mt-4">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="h-8 bg-rose-500/30 rounded flex items-center justify-center text-[10px] text-rose-200 border border-rose-500/40 font-bold">
                      {i}일
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 기능 상세 */}
      <section id="features" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            온안부가 전하는 안심 케어 서비스
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            시니어의 접근성을 극대화한 실버 친화적 UI와 가족 연결 테크놀로지
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0b1322] border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-950 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">정기 안부 체크인 & 자동 알림</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              지정된 시간에 어르신께 친근한 안부 질문을 발송하고 응답 여부를 모니터링하여 위험 사각지대를 방지합니다.
            </p>
          </div>

          <div className="bg-[#0b1322] border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-pink-950 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">상태 분석 및 보호자 대시보드</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              텍스트 및 음성 반응을 정밀 분석하여 건강 상태와 감정 트렌드를 보호자 앱에 실시간 시각화합니다.
            </p>
          </div>

          <div className="bg-[#0b1322] border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">실버 친화적 간결한 UI/UX</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              큰 글씨와 단순한 터치 구조로 디지털 기기에 익숙하지 않은 시니어도 원터치로 손쉽게 소통할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 기술 스택 섹션 */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="bg-[#0c1424] border border-slate-800 rounded-3xl p-8 sm:p-12">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-rose-400" />
            프로젝트 기술 아키텍처
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-rose-400 font-bold uppercase block mb-1">Frontend</span>
              <p className="text-sm font-semibold text-white">React, Responsive Web</p>
              <p className="text-xs text-slate-400 mt-1">Silver-Friendly High-Contrast UI</p>
            </div>
            <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-pink-400 font-bold uppercase block mb-1">Backend & Serverless</span>
              <p className="text-sm font-semibold text-white">Cloudflare Workers & Supabase</p>
              <p className="text-xs text-slate-400 mt-1">Real-time DB, Scheduled Triggers</p>
            </div>
            <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-amber-400 font-bold uppercase block mb-1">AI & Messaging</span>
              <p className="text-sm font-semibold text-white">Messaging API & Text Analytics</p>
              <p className="text-xs text-slate-400 mt-1">Sentiment / Anomaly Detection</p>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 CTA & 다른 솔루션 링크 */}
      <section className="py-20 px-4 sm:px-6 text-center border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            가족을 위한 가장 따뜻한 선택, 온안부
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            지금 바로 온안부 플랫폼에서 가족의 일상을 든든하게 챙겨보세요.
          </p>
          <a
            href={DOMAIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-950/60 transition-all"
          >
            <span>공식 사이트 바로가기</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* 솔루션 간 네비게이션 */}
          <div className="mt-16 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <Link href="/solutions/my-re-design" className="hover:text-purple-400 flex items-center gap-1">
              ← 이전 솔루션: My Re Design
            </Link>
            <Link href="/solutions/lua-visibility" className="hover:text-cyan-400 flex items-center gap-1">
              다음 솔루션: Lua Visibility Dashboard →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
