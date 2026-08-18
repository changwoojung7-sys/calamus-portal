"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart3,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  LineChart,
  Layers,
  Zap,
  Globe,
  Sliders,
  Filter,
  Activity,
  ShieldAlert,
  Server
} from "lucide-react";
import Footer from "@/components/common/Footer";

export default function LuaVisibilityPage() {
  const DOMAIN_URL = "https://lua-visibility.pages.dev/dashboard";

  return (
    <div className="min-h-screen bg-[#050913] text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* 백그라운드 앰비언트 글로우 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#082032,_#050913)] -z-10" />
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent z-50 opacity-80" />

      {/* 헤더 네비게이션 */}
      <header className="sticky top-0 z-40 bg-[#070e1c]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Calamus AI 포털 메인으로</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-cyan-400 font-semibold hidden sm:inline-block">
              엔터프라이즈 SaaS & BI 대시보드
            </span>
            <a
              href={DOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-950/50 transition-all"
            >
              <span>대시보드 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wide uppercase mb-6 shadow-lg shadow-cyan-950/60">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            High-Performance Enterprise Visibility & Business Intelligence
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            데이터를 한눈에 통찰하다 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">
              Lua Visibility Dashboard
            </span>
          </h1>

          <p className="mt-6 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            복잡한 대규모 비즈니스 지표와 시스템 운영 현황을 실시간으로 추적·시각화하는 
            Cloudflare Edge 기반의 초고속 비즈니스 인텔리전스(BI) 대시보드입니다.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={DOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-600 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-xl shadow-cyan-950/60 transition-all hover:scale-105"
            >
              <span>실시간 대시보드 열기</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all"
            >
              대시보드 스펙 보기
            </a>
          </div>

          {/* 도메인 정보 칩 */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
            <span className="text-slate-500 font-medium">배포 URL:</span>
            <code className="text-cyan-300 font-mono font-semibold">{DOMAIN_URL}</code>
          </div>
        </div>
      </section>

      {/* 프리뷰 그래픽 목업 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4 mb-20">
        <div className="bg-[#0c1222] border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-cyan-950/40 relative overflow-hidden">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-xs font-mono text-slate-400">lua-visibility.pages.dev / live-analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400 font-semibold">Edge Live (0.01s latency)</span>
            </div>
          </div>

          {/* 대시보드 시뮬레이션 */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Realtime Active Users</span>
              <div className="text-2xl font-black text-white mt-1">14,290</div>
              <span className="text-[10px] text-emerald-400 font-semibold">▲ +12.4% vs last hour</span>
            </div>
            <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase">API Throughput</span>
              <div className="text-2xl font-black text-cyan-400 mt-1">98.9%</div>
              <span className="text-[10px] text-cyan-300 font-semibold">Success rate (200 OK)</span>
            </div>
            <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Edge Response Time</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">18ms</div>
              <span className="text-[10px] text-slate-400 font-semibold">Global Average</span>
            </div>
            <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Cloudflare Edge</span>
              <div className="text-2xl font-black text-indigo-400 mt-1">320+ PoPs</div>
              <span className="text-[10px] text-indigo-300 font-semibold">Distributed Nodes</span>
            </div>
          </div>

          {/* 인터랙티브 차트 모의 뷰 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 bg-[#12192c] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-cyan-300 uppercase">Hourly Traffic Trends</span>
                <LineChart className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="h-44 flex items-end gap-2 pt-6">
                {[45, 60, 35, 70, 85, 65, 90, 75, 95, 80, 100, 92].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-600 to-teal-400 rounded-t transition-all hover:opacity-80"
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-[9px] text-slate-500">{idx * 2}h</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-teal-300 uppercase">System Status</span>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Edge Compute</span>
                    <span className="text-emerald-400 font-bold">Operational</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Data Pipeline</span>
                    <span className="text-emerald-400 font-bold">Operational</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Live Analytics</span>
                    <span className="text-emerald-400 font-bold">Operational</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-800/40 text-[11px] text-cyan-300">
                ⚡ All 320+ Edge Nodes Healthy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 기능 상세 */}
      <section id="features" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Lua Visibility 주요 역량
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            대용량 데이터를 지체 없이 분석하고 직관적으로 파악할 수 있는 엔터프라이즈 기능
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0b1322] border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">실시간 KPI & 시계열 차트</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              사용자 유입, 트랜잭션, 전환율 등 비즈니스 핵심 지표를 초 단위 실시간 인터랙티브 차트로 시각화합니다.
            </p>
          </div>

          <div className="bg-[#0b1322] border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-teal-950 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-6">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">다차원 드릴다운 & 필터링</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              다양한 조건별 다중 필터와 정렬, 계층별 상세 데이터 탐색(Drill-Down)을 통해 문제 원인을 즉각 식별합니다.
            </p>
          </div>

          <div className="bg-[#0b1322] border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">초고속 엣지 렌더링 배포</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cloudflare Pages 전 세계 글로벌 엣지 네트워크를 통해 지연 시간 없이 번개 같은 응답 속도를 자랑합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 기술 스택 섹션 */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="bg-[#0c1424] border border-slate-800 rounded-3xl p-8 sm:p-12">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            프로젝트 기술 아키텍처
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-cyan-400 font-bold uppercase block mb-1">Frontend Core</span>
              <p className="text-sm font-semibold text-white">React & TypeScript</p>
              <p className="text-xs text-slate-400 mt-1">High-Performance SPA, Tailwind CSS</p>
            </div>
            <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-teal-400 font-bold uppercase block mb-1">Visualization</span>
              <p className="text-sm font-semibold text-white">Interactive Chart Engine</p>
              <p className="text-xs text-slate-400 mt-1">Timeseries, Heatmaps, Breakdown</p>
            </div>
            <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-xs text-blue-400 font-bold uppercase block mb-1">Infra & Edge</span>
              <p className="text-sm font-semibold text-white">Cloudflare Pages Edge</p>
              <p className="text-xs text-slate-400 mt-1">Global Low-Latency CDN Distribution</p>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 CTA & 다른 솔루션 링크 */}
      <section className="py-20 px-4 sm:px-6 text-center border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            엔터프라이즈급 가시성을 경험해보세요
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            지금 바로 Lua Visibility Dashboard에서 강력한 데이터 분석을 확인하실 수 있습니다.
          </p>
          <a
            href={DOMAIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-xl shadow-cyan-950/60 transition-all"
          >
            <span>대시보드 바로가기</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* 솔루션 간 네비게이션 */}
          <div className="mt-16 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <Link href="/solutions/onanbu" className="hover:text-rose-400 flex items-center gap-1">
              ← 이전 솔루션: 온안부 (OnAnBu)
            </Link>
            <Link href="/" className="hover:text-emerald-400 flex items-center gap-1">
              Calamus AI 포털 메인으로 →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
