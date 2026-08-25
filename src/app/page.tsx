"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  HeartHandshake,
  BookOpen,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronRight,
  Phone,
  Layers,
  Building,
  Activity,
  Cpu,
  Heart,
  BarChart3,
  Smartphone,
  ExternalLink,
  ArrowRight,
  Globe2,
  Database,
  Briefcase,
  MapPin,
  Stethoscope
} from "lucide-react";
import GoogleAd from "@/components/ads/GoogleAd";
import CoupangPartnersBanner from "@/components/ads/CoupangPartnersBanner";
import Footer from "@/components/common/Footer";
import CompanyIntro from "@/components/portfolio/CompanyIntro";
import SolutionCard, { SolutionItem } from "@/components/portfolio/SolutionCard";
import { HealingLoungeBanner } from "@/components/care/HealingLoungeBanner";

// --- 포트폴리오 솔루션 데이터 정의 ---
const PORTFOLIO_SOLUTIONS: SolutionItem[] = [
  {
    id: "calamus-care",
    title: "Calamus Care & Portal",
    badge: "공식 브랜드 & 메디컬 허브",
    badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-500/50",
    tagline: "전국 7만여 의료·요양 공공데이터(2026.06월) 실시간 탐색",
    description: "건강보험심사평가원(HIRA) 2026.06월 최신 공공데이터를 기반으로 전국 상급종합·일반병원/의원·한방·요양병원 및 호스피스 완화의료 시설을 스마트하게 검색·비교하는 메디컬 전용 포털입니다.",
    domainUrl: "/hospitals",
    domainDisplay: "calamus.ai.kr/hospitals",
    detailPath: "/hospitals",
    isInternalAnchor: false,
    features: [
      "건강보험심사평가원(HIRA) 2026.06월 공공데이터 기반",
      "상급종합/일반병원·의원(3.7만)/요양/한방/호스피스 전문 필터",
      "인터랙티브 지도 기반 위치 탐색 및 12종 상세 정보"
    ],
    techStack: {
      frontend: "React / Next.js",
      backend: "Supabase DB",
      aiOrInfra: "HIRA Public Data (2026.06)"
    },
    accentGradient: "from-emerald-950/80 via-teal-900/60 to-slate-900",
    borderHover: "hover:border-emerald-500/60 hover:shadow-emerald-950/40",
    iconBg: "bg-emerald-600/80",
    icon: <Building2 className="w-5 h-5" />,
    mockupType: "calamus"
  },
  {
    id: "my-re-design",
    title: "My Re Design",
    badge: "AI 라이프스타일 PWA",
    badgeColor: "bg-purple-950/80 text-purple-300 border-purple-500/50",
    tagline: "개인화 습관 형성 & AI 일상 루틴 코칭 솔루션",
    description: "사용자의 일상 루틴과 목표 데이터를 인공지능이 분석하여 매일 실천 가능한 맞춤형 피드백과 직관적인 달성률 대시보드를 제공하는 설치형 PWA 웹 앱입니다.",
    domainUrl: "https://myredesign.ai.kr",
    domainDisplay: "myredesign.ai.kr",
    detailPath: "/solutions/my-re-design",
    isInternalAnchor: false,
    features: [
      "Zero UI: 100% 타이핑 없는 원클릭 AI 미션 배달",
      "신체/마음/성장/재미 완벽한 4각 밸런스 케어",
      "사진·영상 인증, 1:1 버디 대결 및 숏폼 브이로그"
    ],
    techStack: {
      frontend: "React, PWA, Chart.js",
      backend: "Supabase Auth/DB",
      aiOrInfra: "OpenAI LLM API"
    },
    accentGradient: "from-purple-950/80 via-fuchsia-900/60 to-slate-900",
    borderHover: "hover:border-purple-500/60 hover:shadow-purple-950/40",
    iconBg: "bg-purple-600/80",
    icon: <Sparkles className="w-5 h-5" />,
    mockupType: "myredesign"
  },
  {
    id: "onanbu",
    title: "온안부 (OnAnBu)",
    badge: "케어 테크 & 패밀리",
    badgeColor: "bg-rose-950/80 text-rose-300 border-rose-500/50",
    tagline: "AI 기반 시니어 케어 & 가족 안부 확인 플랫폼",
    description: "부모님이나 돌봄이 필요한 가족의 안부를 주기적으로 챙기고 건강/감정 상태 변화를 감지하여 보호자에게 실시간 안심을 전하는 케어 테크 솔루션입니다.",
    domainUrl: "https://onanbu.calamus.ai.kr",
    domainDisplay: "onanbu.calamus.ai.kr",
    detailPath: "/solutions/onanbu",
    isInternalAnchor: false,
    features: [
      "원터치 기상 & 골든타임 안심 넛지 (부모님 광고 100% 없음)",
      "15초 미디어 편지 & 주/보조케어자 3각 가족 네트워크",
      "AI 주간 가족 브리핑 & 숏폼 영화 Play Movie 2.0"
    ],
    techStack: {
      frontend: "React, Responsive Web",
      backend: "Cloudflare Workers",
      aiOrInfra: "AI Text Analytics"
    },
    accentGradient: "from-rose-950/80 via-pink-900/60 to-slate-900",
    borderHover: "hover:border-rose-500/60 hover:shadow-rose-950/40",
    iconBg: "bg-rose-600/80",
    icon: <Heart className="w-5 h-5" />,
    mockupType: "onanbu"
  },
  {
    id: "lua-visibility",
    title: "LUVIS AI Visibility",
    badge: "AEO/GEO AI 가시성 진단",
    badgeColor: "bg-cyan-950/80 text-cyan-300 border-cyan-500/50",
    tagline: "병원 경영진을 위한 AEO/GEO 최적화 통합 관제 및 SOV 분석 엔진",
    description: "생성형 AI(ChatGPT, Gemini, Perplexity 등) 시대, 환자의 질환 검색 시 우리 병원의 추천 지분과 가시성을 과학적으로 측정하고 시장 1위를 선점하는 전문 웹 엔진입니다.",
    domainUrl: "https://rualab.co.kr/dashboard",
    domainDisplay: "rualab.co.kr",
    detailPath: "/solutions/lua-visibility",
    isInternalAnchor: false,
    features: [
      "초 단위 실시간 KPI 지표 & 시계열 트렌드 차트",
      "다차원 데이터 필터링 · 계층별 드릴다운(Drill-down)",
      "Cloudflare Pages 글로벌 엣지 기반 번개 렌더링"
    ],
    techStack: {
      frontend: "React / TypeScript",
      backend: "Cloudflare Pages",
      aiOrInfra: "Interactive Charts"
    },
    accentGradient: "from-cyan-950/80 via-teal-900/60 to-slate-900",
    borderHover: "hover:border-cyan-500/60 hover:shadow-cyan-950/40",
    iconBg: "bg-cyan-600/80",
    icon: <BarChart3 className="w-5 h-5" />,
    mockupType: "lua"
  }
];

export default function Home() {
  const AD_SLOT_ID = "3529245457";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-500/20">
      {/* 백그라운드 앰비언트 글로우 (소프트 파스텔) */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#e0f2fe,_#f8fafc_70%)] -z-10" />
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent z-50 opacity-80" />

      {/* 1. GNB 헤더 (진한 다크 네이비 바탕으로 메뉴 시인성 극대화) */}
      <header className="sticky top-0 z-40 bg-slate-900/95 text-white backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              C
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                Calamus <span className="text-emerald-400 font-semibold">Portal</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wider font-medium">
                유진AI(YujinAI) 공식 허브 & 솔루션 포트폴리오
              </p>
            </div>
          </Link>

          {/* GNB 메인 메뉴 */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-200">
            <a href="#about" className="hover:text-emerald-400 transition-colors">
              회사소개
            </a>
            <a href="#portfolio" className="hover:text-emerald-400 transition-colors">
              솔루션 포트폴리오
            </a>
            <Link
              href="/hospitals"
              className="hover:text-white transition-all flex items-center gap-1.5 text-emerald-300 font-bold bg-emerald-950/80 hover:bg-emerald-900/90 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 shadow-xs"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              전국 병원·시설 검색
            </Link>
            <Link href="/solutions/my-re-design" className="hover:text-purple-300 transition-colors">
              My Re Design
            </Link>
            <Link href="/solutions/onanbu" className="hover:text-rose-300 transition-colors">
              온안부
            </Link>
            <Link href="/solutions/lua-visibility" className="hover:text-cyan-300 transition-colors">
              LUVIS
            </Link>
            <a
              href="#lounge"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 font-bold hover:bg-indigo-900/90 hover:text-white transition-all shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              힐링 라운지
            </a>
          </nav>

          {/* 모바일 퀵버튼 */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/hospitals"
              className="px-3 py-1.5 text-xs rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold flex items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              병원검색
            </Link>
            <a
              href="#lounge"
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-300 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              힐링
            </a>
          </div>
        </div>
      </header>

      {/* 2. 상단 쿠팡 파트너스 효도상품 큐레이션 광고 배너 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <CoupangPartnersBanner />
      </div>

      {/* 3. Hero 섹션 */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          {/* 브랜드 공식 허브 뱃지 */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-xs font-bold text-emerald-700 mb-6 shadow-xs">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            유진AI(YujinAI) 공식 비즈니스 포털
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900 drop-shadow-xs">
            AI 혁신과 데이터로 연결하는 <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
              라이프 · 케어 · 비즈니스 솔루션
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            유진AI(YujinAI)의 4대 핵심 서비스 라인업을 경험해보세요.
            개인 맞춤형 일상 코칭부터 시니어 안부 케어, 엔터프라이즈 BI 대시보드, 
            전국 7만여 의료기관 실시간 공공데이터 포털까지 통합 제공합니다.
          </p>

          {/* 주요 솔루션 퀵 네비게이션 칩 */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/hospitals"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-emerald-300 hover:border-emerald-500 text-emerald-800 font-bold text-xs sm:text-sm hover:scale-105 transition-all shadow-sm"
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              전국 병원·요양 검색
            </Link>
            <Link
              href="/solutions/my-re-design"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-purple-200 hover:border-purple-400 text-purple-800 font-bold text-xs sm:text-sm hover:scale-105 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              My Re Design (습관·루틴 AI)
            </Link>
            <Link
              href="/solutions/onanbu"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-rose-200 hover:border-rose-400 text-rose-800 font-bold text-xs sm:text-sm hover:scale-105 transition-all shadow-sm"
            >
              <Heart className="w-4 h-4 text-rose-600" />
              온안부 (시니어 케어)
            </Link>
            <Link
              href="/solutions/lua-visibility"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-cyan-200 hover:border-cyan-400 text-cyan-800 font-bold text-xs sm:text-sm hover:scale-105 transition-all shadow-sm"
            >
              <BarChart3 className="w-4 h-4 text-cyan-600" />
              Lua Visibility (BI 대시보드)
            </Link>
          </div>
        </div>
      </section>

      {/* 4. 솔루션 포트폴리오 쇼케이스 섹션 (상단 배치) */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold tracking-wide uppercase mb-4">
            <Briefcase className="w-3.5 h-3.5 text-cyan-600" />
            Solutions Portfolio
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            유진AI(YujinAI) 주요 프로젝트 & 솔루션 라인업
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            비즈니스 허브부터 케어 테크, AI 코칭, 엔터프라이즈 대시보드까지 
            실질적인 가치를 창출하는 4가지 전문 솔루션입니다.
          </p>
        </div>

        {/* 4대 솔루션 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {PORTFOLIO_SOLUTIONS.map((solution) => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </div>

        {/* 포트폴리오 비교 요약표 */}
        <div className="mt-16 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 overflow-x-auto shadow-sm">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            솔루션 비교 요약표
          </h3>
          <table className="w-full text-left text-sm text-slate-700 border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-400 uppercase bg-slate-50/60">
                <th className="py-3 px-4">프로젝트명</th>
                <th className="py-3 px-4">타깃 및 분류</th>
                <th className="py-3 px-4">핵심 기술 포인트</th>
                <th className="py-3 px-4">서비스 가치</th>
                <th className="py-3 px-4 text-right">바로가기</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-emerald-700 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" /> Calamus Portal
                </td>
                <td className="py-3.5 px-4 text-slate-600">B2C/B2B 메디컬 허브</td>
                <td className="py-3.5 px-4 text-slate-500">통합 아키텍처, 심평원 API 연계</td>
                <td className="py-3.5 px-4 text-slate-600">전국 7.9만 개 병원·의원·요양 실시간 검색</td>
                <td className="py-3.5 px-4 text-right">
                  <Link href="/hospitals" className="text-emerald-600 hover:underline font-semibold">
                    탐색하기
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-purple-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" /> My Re Design
                </td>
                <td className="py-3.5 px-4 text-slate-600">B2C 라이프스타일/습관</td>
                <td className="py-3.5 px-4 text-slate-500">Zero UI, 4각 밸런스, PWA, LLM 코칭</td>
                <td className="py-3.5 px-4 text-slate-600">15분 맞춤 루틴, 숏폼 브이로그 자동 생성</td>
                <td className="py-3.5 px-4 text-right">
                  <Link href="/solutions/my-re-design" className="text-purple-600 hover:underline font-semibold">
                    상세보기
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-rose-700 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-600" /> 온안부 (OnAnBu)
                </td>
                <td className="py-3.5 px-4 text-slate-600">B2C/Social 케어테크</td>
                <td className="py-3.5 px-4 text-slate-500">실버 친화 UI, 알림/트래킹 시스템</td>
                <td className="py-3.5 px-4 text-slate-600">가족 간 안부 확인 및 돌봄 사각지대 해소</td>
                <td className="py-3.5 px-4 text-right">
                  <Link href="/solutions/onanbu" className="text-rose-600 hover:underline font-semibold">
                    상세보기
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-cyan-700 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-cyan-600" /> LUVIS AI Visibility
                </td>
                <td className="py-3.5 px-4 text-slate-600">B2B SaaS/AEO·GEO 관제</td>
                <td className="py-3.5 px-4 text-slate-500">AI 추천 점유율(SOV) 실측, Cloudflare Edge</td>
                <td className="py-3.5 px-4 text-slate-600">ChatGPT/Gemini AI 가시성 진단 및 1위 탈환</td>
                <td className="py-3.5 px-4 text-right">
                  <Link href="/solutions/lua-visibility" className="text-cyan-600 hover:underline font-semibold">
                    상세보기
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. 회사 소개 섹션 (CompanyIntro) */}
      <CompanyIntro />

      {/* 6. 전국 병원 & 요양시설 탐색 독립 페이지 안내 배너 섹션 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 p-8 sm:p-12 overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 mb-4">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                심평원 2026.06월 최신 공공데이터 전용 검색관
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                전국 7.9만여 병의원 · 요양시설 실시간 탐색
              </h2>
              <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                상급종합병원, 전문의원(3.7만), 요양병원, 한방, 호스피스 완화의료 시설까지
                위치 기반 인터랙티브 지도와 실시간 상세 스펙 검색을 전용 페이지에서 쾌적하게 이용하세요.
              </p>
              
              <div className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-xs">
                  🏥 상급종합병원
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-xs">
                  🩺 일반병원 · 의원 (3.7만건)
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-xs">
                  🌿 한방병원
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-xs">
                  🛏️ 요양병원
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-xs">
                  🕊️ 호스피스 완화의료
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <Link
                href="/hospitals"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-md shadow-emerald-200 transition-all hover:scale-105"
              >
                <span>전국 병원 검색관 입장</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 힐링 라운지 (사주/타로/꿈해몽/게임 통합 배너) */}
      <HealingLoungeBanner />

      {/* 8. 푸터 */}
      <Footer />
    </div>
  );
}

