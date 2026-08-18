"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Smartphone,
  BrainCircuit,
  TrendingUp,
  Activity,
  Layers,
  Zap,
  Calendar,
  Award,
  ChevronRight
} from "lucide-react";
import Footer from "@/components/common/Footer";

export default function MyReDesignPage() {
  const DOMAIN_URL = "https://myredesign.ai.kr";

  return (
    <div className="min-h-screen bg-[#050913] text-slate-100 font-sans selection:bg-purple-500/30">
      {/* 백그라운드 앰비언트 글로우 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1033,_#050913)] -z-10" />
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent z-50 opacity-80" />

      {/* 헤더 네비게이션 */}
      <header className="sticky top-0 z-40 bg-[#070e1c]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Calamus AI 포털 메인으로</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-purple-400 font-semibold hidden sm:inline-block">
              AI 라이프스타일 솔루션
            </span>
            <a
              href={DOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950/50 transition-all"
            >
              <span>서비스 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold tracking-wide uppercase mb-6 shadow-lg shadow-purple-950/60">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            AI-Powered Lifestyle & Routine Coaching
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            나만의 일상을 스마트하게 재설계하다 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
              My Re Design (마이 리디자인)
            </span>
          </h1>

          <p className="mt-6 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            사용자의 일상 루틴과 목표 데이터를 AI가 정밀 분석하여, 매일 실천 가능한 맞춤형 피드백과 
            직관적인 달성률 대시보드를 제공하는 개인화 라이프 코칭 PWA 웹 앱입니다.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={DOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-sm shadow-xl shadow-purple-950/60 transition-all hover:scale-105"
            >
              <span>My Re Design 시작하기</span>
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
            <code className="text-purple-300 font-mono font-semibold">{DOMAIN_URL}</code>
          </div>
        </div>
      </section>

      {/* 프리뷰 그래픽 목업 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 mb-20">
        <div className="bg-[#0c1222] border border-purple-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-purple-950/40 relative overflow-hidden">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">myredesign.ai.kr / dashboard</span>
            </div>
            <span className="text-xs font-bold text-purple-400 px-3 py-1 bg-purple-950/80 border border-purple-800/60 rounded-full">
              PWA Ready
            </span>
          </div>

          {/* 대시보드 인터페이스 시뮬레이션 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-purple-300 uppercase">Daily Routine Tracker</span>
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-purple-950/40 border border-purple-800/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold text-slate-200">아침 미라클 모닝 30분</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">완료</span>
                </div>
                <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold text-slate-200">AI 독서 요약 작성</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">완료</span>
                </div>
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between opacity-70">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-slate-600" />
                    <span className="text-xs text-slate-400">저녁 스트레칭 & 명상</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">진행예정</span>
                </div>
              </div>
            </div>

            <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-fuchsia-300 uppercase">AI Coaching Feed</span>
                <BrainCircuit className="w-4 h-4 text-fuchsia-400" />
              </div>
              <div className="p-4 bg-gradient-to-br from-fuchsia-950/60 to-purple-950/40 border border-fuchsia-800/50 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-fuchsia-300 mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> AI 코치 오늘의 인사이트
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "최근 7일간 모닝 루틴 실천율이 92%로 상승했습니다! 집중력이 가장 높은 오전 시간대에 핵심 프로젝트 업무를 배치해보세요."
                </p>
              </div>
            </div>

            <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-pink-300 uppercase">Goal Achievement</span>
                <TrendingUp className="w-4 h-4 text-pink-400" />
              </div>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="text-4xl font-black text-white mb-1">88.5<span className="text-xl text-pink-400">%</span></div>
                <p className="text-xs text-slate-400 font-medium">이번 달 목표 달성 지수</p>
                <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full w-[88.5%]" />
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
            My Re Design 핵심 솔루션 기능
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            데이터 기반의 습관 형성 알고리즘과 생성형 AI가 결합되어 일상의 성취를 가속합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0b1322] border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">개인화 루틴 트래킹 대시보드</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              마이페이지 중심의 간결하고 직관적인 UX를 통해 매일의 습관과 미션을 손쉽게 기록하고 성과를 확인합니다.
            </p>
          </div>

          <div className="bg-[#0b1322] border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-fuchsia-950 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 mb-6">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">AI 스마트 피드백 & 코칭</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              OpenAI LLM을 기반으로 축적된 루틴 데이터를 심층 분석하여 개인에게 최적화된 동기부여와 행동 가이드를 실시간 생성합니다.
            </p>
          </div>

          <div className="bg-[#0b1322] border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-pink-950 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">설치형 PWA 웹 앱</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              별도의 앱스토어 설치 없이 스마트폰 홈 화면에 추가하여 네이티브 앱처럼 빠르고 편리하게 사용할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 기술 스택 섹션 */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="bg-[#0c1424] border border-slate-800 rounded-3xl p-8 sm:p-12">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            프로젝트 기술 아키텍처
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-purple-400 font-bold uppercase block mb-1">Frontend</span>
              <p className="text-sm font-semibold text-white">React, PWA</p>
              <p className="text-xs text-slate-400 mt-1">Chart.js, Lucide Icons, Responsive UI</p>
            </div>
            <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-fuchsia-400 font-bold uppercase block mb-1">Backend & DB</span>
              <p className="text-sm font-semibold text-white">Supabase</p>
              <p className="text-xs text-slate-400 mt-1">Auth, PostgreSQL, Row Level Security</p>
            </div>
            <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-pink-400 font-bold uppercase block mb-1">AI & Cloud</span>
              <p className="text-sm font-semibold text-white">OpenAI API & Cloudflare</p>
              <p className="text-xs text-slate-400 mt-1">LLM Personal Coaching, Cloudflare Pages</p>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 CTA & 다른 솔루션 링크 */}
      <section className="py-20 px-4 sm:px-6 text-center border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            지금 My Re Design에서 새로운 루틴을 시작해보세요
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            가입 즉시 나만의 AI 루틴 코치가 매일의 성장을 함께합니다.
          </p>
          <a
            href={DOMAIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-950/60 transition-all"
          >
            <span>공식 사이트 바로가기</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* 솔루션 간 네비게이션 */}
          <div className="mt-16 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <Link href="/" className="hover:text-white flex items-center gap-1">
              ← 포털 메인으로 돌아가기
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/solutions/onanbu" className="hover:text-rose-400 flex items-center gap-1">
                다음 솔루션: 온안부 (OnAnBu) →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
