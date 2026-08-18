"use client";

import React, { useState } from "react";
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
  Briefcase
} from "lucide-react";
import { FacilityMapSearch } from "@/components/care/FacilityMapSearch";
import { QuickCategoryCards } from "@/components/care/QuickCategoryCards";
import { CareMagazineSection } from "@/components/care/CareMagazineSection";
import { HealingLoungeBanner } from "@/components/care/HealingLoungeBanner";
import GoogleAd from "@/components/ads/GoogleAd";
import Footer from "@/components/common/Footer";
import CompanyIntro from "@/components/portfolio/CompanyIntro";
import SolutionCard, { SolutionItem } from "@/components/portfolio/SolutionCard";

// --- 포트폴리오 솔루션 데이터 정의 ---
const PORTFOLIO_SOLUTIONS: SolutionItem[] = [
  {
    id: "calamus-care",
    title: "Calamus Care & Portal",
    badge: "공식 브랜드 & 허브",
    badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-500/50",
    tagline: "전국 7만여 의료·요양 공공데이터(2026.06월) 허브",
    description: "건강보험심사평가원(HIRA) 2026.06월 최신 공공데이터를 기반으로 전국 상급종합·일반병원/의원·한방·요양병원 및 호스피스 완화의료 시설을 스마트하게 검색·비교하는 메디컬 포털입니다.",
    domainUrl: "https://calamus.ai.kr",
    domainDisplay: "calamus.ai.kr",
    detailPath: "#search-section",
    isInternalAnchor: true,
    features: [
      "건강보험심사평가원(HIRA) 2026.06월 공공데이터 기반",
      "상급종합/일반병원·의원/요양/한방/호스피스 전문 필터",
      "인터랙티브 지도 기반 위치 탐색 및 상세 정보"
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
      "마이페이지 중심의 개인화 루틴/습관 트래킹",
      "OpenAI 기반 맞춤형 코칭 피드백 및 목표 시각화",
      "앱스토어 설치 없이 사용하는 PWA 모바일 앱 지원"
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
      "정기적인 안부 체크인 & 자동 알림 발송 시스템",
      "감정 및 건강 상태 기록 분석 · 보호자 대시보드",
      "시니어를 위한 직관적인 고대비 실버 친화적 UI"
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
    title: "Lua Visibility",
    badge: "엔터프라이즈 SaaS / BI",
    badgeColor: "bg-cyan-950/80 text-cyan-300 border-cyan-500/50",
    tagline: "초고속 엣지 기반 실시간 비즈니스 인텔리전스 대시보드",
    description: "복잡한 비즈니스 지표와 대규모 시스템 운영 현황을 실시간으로 추적·시각화하는 고성능 분석 대시보드로, 지연 없는 초고속 모니터링을 지원합니다.",
    domainUrl: "https://lua-visibility.pages.dev/dashboard",
    domainDisplay: "lua-visibility.pages.dev",
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
  const [selectedHeroCategory, setSelectedHeroCategory] = useState<string>("ALL");

  const scrollToSearch = (categoryCode?: string) => {
    if (categoryCode) {
      setSelectedHeroCategory(categoryCode);
    }
    document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#050913] text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* 백그라운드 앰비언트 글로우 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#0c2236,_#050913)] -z-10" />
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent z-50 opacity-80" />

      {/* 1. GNB 헤더 */}
      <header className="sticky top-0 z-40 bg-[#070e1c]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform border border-emerald-400/30">
              C
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                Calamus <span className="text-emerald-400 font-semibold">AI Portal</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wider font-medium">
                EUGENE AI 공식 허브 & 포트폴리오
              </p>
            </div>
          </Link>

          {/* GNB 메인 메뉴 */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <a href="#about" className="hover:text-emerald-400 transition-colors">
              회사소개
            </a>
            <a href="#portfolio" className="hover:text-emerald-400 transition-colors">
              솔루션 포트폴리오
            </a>
            <button
              onClick={() => scrollToSearch("ALL")}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              전국 병원·시설 검색
            </button>
            <a href="#magazine" className="hover:text-emerald-400 transition-colors">
              케어 가이드
            </a>
            <a
              href="#lounge"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 font-bold hover:bg-indigo-900/60 transition-all shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              힐링 라운지
            </a>
          </nav>

          {/* 모바일 퀵버튼 */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href="#portfolio"
              className="px-3 py-1.5 text-xs rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-semibold"
            >
              포트폴리오
            </a>
            <a
              href="#lounge"
              className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-indigo-900/60 text-indigo-200 border border-indigo-700/60 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              힐링
            </a>
          </div>
        </div>
      </header>

      {/* 2. 상단 스폰서 배너 광고 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="w-full bg-[#0b1322] border border-slate-800/80 rounded-xl p-3 flex justify-center items-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-60"></div>
          <div className="text-center w-full">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">
              Sponsored Content
            </span>
            <div className="min-h-[70px] w-full flex justify-center">
              <GoogleAd slot={AD_SLOT_ID} format="auto" responsive={true} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Hero 섹션 */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          {/* 브랜드 공식 허브 뱃지 */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-4 py-1.5 text-xs font-semibold text-emerald-300 mb-6 shadow-lg shadow-emerald-950/60">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            EUGENE AI & Calamus AI 공식 비즈니스 허브
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-md">
            AI 혁신과 데이터로 연결하는 <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              라이프 · 케어 · 비즈니스 솔루션
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            유진AI(EUGENE AI)의 4대 핵심 서비스 라인업을 경험해보세요.
            개인 맞춤형 일상 코칭부터 시니어 안부 케어, 엔터프라이즈 BI 대시보드, 
            전국 7만여 의료기관 실시간 공공데이터 포털까지 통합 제공합니다.
          </p>

          {/* 주요 솔루션 퀵 네비게이션 칩 */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/solutions/my-re-design"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13112a] border border-purple-500/40 hover:border-purple-400 text-purple-300 font-bold text-xs sm:text-sm hover:scale-105 transition-all shadow-lg shadow-purple-950/40"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              My Re Design (습관·루틴 AI)
            </Link>
            <Link
              href="/solutions/onanbu"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#22101b] border border-rose-500/40 hover:border-rose-400 text-rose-300 font-bold text-xs sm:text-sm hover:scale-105 transition-all shadow-lg shadow-rose-950/40"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              온안부 (시니어 케어)
            </Link>
            <Link
              href="/solutions/lua-visibility"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#091a29] border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-bold text-xs sm:text-sm hover:scale-105 transition-all shadow-lg shadow-cyan-950/40"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Lua Visibility (BI 대시보드)
            </Link>
            <button
              onClick={() => scrollToSearch("ALL")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#07241f] border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 font-bold text-xs sm:text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-950/40"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              전국 병원·요양 검색
            </button>
          </div>
        </div>
      </section>

      {/* 4. 회사 소개 섹션 (CompanyIntro) */}
      <CompanyIntro />

      {/* 5. 솔루션 포트폴리오 쇼케이스 섹션 */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wide uppercase mb-4">
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            Solutions Portfolio
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            유진AI 주요 프로젝트 & 솔루션 라인업
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
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
        <div className="mt-16 bg-[#0b1322]/90 border border-slate-800 rounded-2xl p-6 sm:p-8 overflow-x-auto">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            솔루션 비교 요약표
          </h3>
          <table className="w-full text-left text-sm text-slate-300 border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-700/80 text-xs text-slate-400 uppercase">
                <th className="py-3 px-4">프로젝트명</th>
                <th className="py-3 px-4">타깃 및 분류</th>
                <th className="py-3 px-4">핵심 기술 포인트</th>
                <th className="py-3 px-4">서비스 가치</th>
                <th className="py-3 px-4 text-right">바로가기</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-bold text-emerald-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> Calamus AI
                </td>
                <td className="py-3.5 px-4 text-slate-300">B2C/B2B 브랜드 허브</td>
                <td className="py-3.5 px-4 text-slate-400">통합 아키텍처, 심평원 API 연계</td>
                <td className="py-3.5 px-4 text-slate-300">신뢰도 높은 메디컬·AI 엔트리포인트</td>
                <td className="py-3.5 px-4 text-right">
                  <button onClick={() => scrollToSearch("ALL")} className="text-emerald-400 hover:underline font-semibold">
                    탐색하기
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-bold text-purple-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> My Re Design
                </td>
                <td className="py-3.5 px-4 text-slate-300">B2C 라이프스타일/습관</td>
                <td className="py-3.5 px-4 text-slate-400">PWA, 대시보드 UX, LLM 코칭</td>
                <td className="py-3.5 px-4 text-slate-300">일상 습관 형성 및 지속성 강화</td>
                <td className="py-3.5 px-4 text-right">
                  <Link href="/solutions/my-re-design" className="text-purple-400 hover:underline font-semibold">
                    상세보기
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-bold text-rose-400 flex items-center gap-1.5">
                  <Heart className="w-4 h-4" /> 온안부 (OnAnBu)
                </td>
                <td className="py-3.5 px-4 text-slate-300">B2C/Social 케어테크</td>
                <td className="py-3.5 px-4 text-slate-400">실버 친화 UI, 알림/트래킹 시스템</td>
                <td className="py-3.5 px-4 text-slate-300">가족 간 안부 확인 및 돌봄 사각지대 해소</td>
                <td className="py-3.5 px-4 text-right">
                  <Link href="/solutions/onanbu" className="text-rose-400 hover:underline font-semibold">
                    상세보기
                  </Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-bold text-cyan-400 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4" /> Lua Visibility
                </td>
                <td className="py-3.5 px-4 text-slate-300">B2B SaaS/데이터 시각화</td>
                <td className="py-3.5 px-4 text-slate-400">Cloudflare Edge, 인터랙티브 차트</td>
                <td className="py-3.5 px-4 text-slate-300">비즈니스 데이터의 즉각적인 가시화</td>
                <td className="py-3.5 px-4 text-right">
                  <Link href="/solutions/lua-visibility" className="text-cyan-400 hover:underline font-semibold">
                    상세보기
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. 메인 기능: 전국 시설 지도 및 상세 검색 섹션 */}
      <section id="search-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-4 py-1.5 text-xs font-semibold text-emerald-300 mb-3">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            건강보험심사평가원(HIRA) 공공데이터 (2026.06월 기준)
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            전국 의료기관 & 요양시설 실시간 탐색
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            상급종합, 종합, 일반병원/의원, 요양, 한방, 호스피스별로 검증된 맞춤 시설을 찾아보세요.
          </p>

          {/* 퀵 카테고리 카드 바로가기 */}
          <div className="mt-8">
            <QuickCategoryCards onSelectCategory={(cat) => scrollToSearch(cat)} />
          </div>
        </div>

        <FacilityMapSearch initialCategory={selectedHeroCategory as any} />
      </section>

      {/* 7. 케어 매거진 & 가이드 섹션 */}
      <CareMagazineSection />

      {/* 8. 힐링 라운지 (사주/타로/꿈해몽/게임 통합 배너) */}
      <HealingLoungeBanner />

      {/* 9. 푸터 */}
      <Footer />
    </div>
  );
}
