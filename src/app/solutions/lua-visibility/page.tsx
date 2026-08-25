"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  ExternalLink,
  ArrowLeft,
  Search,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  Cpu,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Target,
  Sparkles,
  Layers,
  FileText,
  Lock,
  Compass,
  ArrowRight,
  Eye,
  Award,
  Maximize2
} from "lucide-react";
import Footer from "@/components/common/Footer";

export default function LuaVisibilityPage() {
  const DOMAIN_URL = "https://rualab.co.kr/dashboard";
  const [selectedSlide, setSelectedSlide] = useState<string | null>(null);

  // 15개 슬라이드 데이터 정의
  const slides = [
    {
      id: "slide-01",
      page: 1,
      tag: "Hero & Title",
      badge: "Brand Vision",
      title: "생성형 AI 시대, 우리 병원은 환자에게 '추천'받고 있습니까?",
      subtitle: "데이터 기반 AI 가시성 진단 및 시장 점유율(SOV) 확보 솔루션",
      desc: "ChatGPT, Gemini, Perplexity 등 대화형 AI가 의료 상담의 첫 관문이 된 시대, 환자가 질환을 검색할 때 우리 병원이 가장 먼저 추천되는지 과학적으로 측정하고 엔티티(Entity) 브랜딩을 실현합니다.",
      image: "/images/solutions/luvis/page_01.png",
      keyPoints: [
        "병원 경영진(CEO/CMO)을 위한 AEO/GEO 최적화 통합 관제",
        "AI 추천 시장 점유율(SOV) 정량 측정",
        "생성형 AI 시대의 새로운 환자 유입 파이프라인 개척"
      ]
    },
    {
      id: "slide-02",
      page: 2,
      tag: "Paradigm Shift",
      badge: "SEO vs AEO/GEO",
      title: "과거 검색 엔진(SEO)에서 현재 생성형 엔진(AEO/GEO)으로",
      subtitle: "검색 점유율 1위가 AI 추천 1위를 보장하지 않습니다",
      desc: "과거의 검색은 키워드 매칭과 긴 비교 여정이었지만, 생성형 AI는 문맥을 파악한 후 단 하나의 최적 정답을 즉시 제시합니다. 단축된 환자 여정 속에서 'AI의 선택'을 받아야 합니다.",
      image: "/images/solutions/luvis/page_02.png",
      keyPoints: [
        "과거 (SEO): 키워드 나열, 긴 탐색 여정, 노출 순위 & 클릭률(CTR)",
        "현재 (AEO/GEO): 문맥 기반 단 하나의 정답 제시, 즉각적 수용",
        "핵심 지표: AI 언급률(Mention) & 추천 점유율(SOV)"
      ]
    },
    {
      id: "slide-03",
      page: 3,
      tag: "Core Pillars",
      badge: "Brand Entity",
      title: "압도적 AI 추천 1위를 만드는 3대 핵심 기둥",
      subtitle: "GEO(인프라) + AEO(콘텐츠) + Trust Signal(신뢰 자산)",
      desc: "기술적 크롤러 접근성(GEO), 환자 맞춤형 전문 지식(AEO), 그리고 의료 E-E-A-T 기반 신뢰 자산(Trust Signal)이 완벽히 결합될 때, AI는 우리 병원을 단순 텍스트가 아닌 '신뢰할 수 있는 실체(Entity)'로 인식합니다.",
      image: "/images/solutions/luvis/page_03.png",
      keyPoints: [
        "GEO (인프라): AI 크롤러 정보 수집 허용, Schema.org 구조화 데이터",
        "AEO (콘텐츠): 의료진 전문성 약력, 질환별 FAQ, 맞춤형 정답 세트",
        "Trust Signal (신뢰 자산): 의료 E-E-A-T 권위 증명, 일관된 NAP, 실제 환자 평점"
      ]
    },
    {
      id: "slide-04",
      page: 4,
      tag: "Engine Architecture",
      badge: "AI Web Engine v1.0",
      title: "국내 최초 병원 특화 AI 가시성 측정·분석 웹 엔진",
      subtitle: "다중 AI 통합 진단, 환각 방지 알고리즘, 실시간 콘솔 로그",
      desc: "OpenAI ChatGPT, Google Gemini, Perplexity, Anthropic Claude, Naver 등 주요 5대 AI 엔진을 동시 타겟팅하며, Temperature 0.2 저온도 설정과 정밀 프롬프팅으로 데이터 수집 과정을 투명하게 시각화합니다.",
      image: "/images/solutions/luvis/page_04.png",
      keyPoints: [
        "5대 핵심 AI 모델 동시 크롤링 및 다중 타겟팅",
        "Temperature 0.2 저온도 설정으로 AI 환각 현상 원천 억제",
        "블랙박스 같던 AI의 데이터 수집 과정을 실시간 콘솔로 투명 공개"
      ]
    },
    {
      id: "slide-05",
      page: 5,
      tag: "Query Generator",
      badge: "5대 Intent 분석",
      title: "환자의 5대 검색 의도(Intent) 정밀 분석 로직",
      subtitle: "LUVIS Query Generator가 자동 생성하는 30개 고정 질문 패널",
      desc: "환자가 병원을 찾을 때 거치는 5단계 심리 여정(탐색 ➔ 전문성 ➔ 환자 시나리오 ➔ 접근성 ➔ 비교/추천)을 표준 질의로 구조화하여 AI의 추천 지표를 정밀 측정합니다.",
      image: "/images/solutions/luvis/page_05.png",
      keyPoints: [
        "1. 탐색 (Discovery): 지역 기반 매칭 (예: 용인 처인구 혈액투석 병원)",
        "2. 전문성 (Expertise): 의료진 약력 및 권위 증명 (예: 신장내과 전문의)",
        "3. 환자 시나리오 (Scenario): 맞춤 FAQ 인용 (예: 부모님 첫 투석 믿을 곳)",
        "4. 접근성 (Accessibility): 주말 진료, 주차 편의 팩트체크",
        "5. 비교/추천 (Recommendation): 종합 SOV 및 평점 1순위 판별"
      ]
    },
    {
      id: "slide-06",
      page: 6,
      tag: "Audit System",
      badge: "GEO Trust 100점",
      title: "GEO Trust 100점 만점 평가 체계",
      subtitle: "AI 봇의 눈에 가장 잘 읽히는 홈페이지가 시장을 장악합니다",
      desc: "화려한 겉모습보다 기계어(JSON-LD)와 AI 크롤러 가독성이 중요합니다. 4개 영역(접근성 25점, 구조화 데이터 30점, 신뢰 콘텐츠 25점, 기술적 가독성 20점)으로 병원 웹사이트의 AI 친화도를 정량 채점합니다.",
      image: "/images/solutions/luvis/page_06.png",
      keyPoints: [
        "A. AI 크롤러 접근성 (25점): GPT, Claude 등 6대 핵심 AI 봇 robots.txt 허용",
        "B. 구조화 데이터 (30점): MedicalClinic 및 FAQPage 기계어 탑재",
        "C. 신뢰 콘텐츠 자산 (25점): 의료진 상세 텍스트, 건강칼럼, YouTube 증빙",
        "D. 기술적 가독성 (20점): HTTPS 보안 및 순수 본문 텍스트 600자 이상"
      ]
    },
    {
      id: "slide-07",
      page: 7,
      tag: "Core Technology",
      badge: "Double-Fetch",
      title: "철통 보안을 뚫는 'Double-Fetch' 크롤링 기술",
      subtitle: "호스팅사 안티봇 차단을 극복하는 2단계 정밀 수집 프로세스",
      desc: "Cafe24 등 국내 호스팅사의 봇 차단 정책으로 인해 기존 진단기가 실패하던 문제를, 1차 세션 쿠키 발급 및 우회 로직과 2차 로컬 백엔드 프록시 직접 호출을 통해 오차 0% 완벽한 웹 가독성 실측을 달성했습니다.",
      image: "/images/solutions/luvis/page_07.png",
      keyPoints: [
        "일반 AI 봇의 한계: 안티봇 방화벽에 막혀 JSON-LD 및 본문 수집 실패",
        "LUVIS Double-Fetch: 세션 쿠키 발급 우회 + 로컬 프록시 직접 호출",
        "오차 0%의 완벽한 웹 가독성 및 원본 데이터 실측 완료"
      ]
    },
    {
      id: "slide-08",
      page: 8,
      tag: "Timeseries Analytics",
      badge: "성과 시계열 증명",
      title: "마케팅 성과 시계열 증명: 다중 회차 가시성 추이 분석",
      subtitle: "특정 마케팅 액션 전/후의 점수 상승폭을 과학적으로 보고",
      desc: "스키마 탑재, 콘텐츠 발행 등 병원이 집행한 마케팅 액션(Run ID) 전/후의 추천 점수 변화와 순위 상승을 꺾은선 차트로 실증하여 경영진에게 객관적 ROI를 보고합니다.",
      image: "/images/solutions/luvis/page_08.png",
      keyPoints: [
        "4대 핵심 지표 동시 모니터링: LUVIS Score, 상위 노출률, 추천 포함률, 평균 AI 언급률",
        "마케팅 액션 성과 실증: 회차별(Run ID) 점수 상승폭 시계열 꺾은선 차트",
        "경쟁 우위 확보 증명: 실제 AI 추천 순위(역산 그래프) 상승 수치화"
      ]
    },
    {
      id: "slide-09",
      page: 9,
      tag: "Multi-Model Radar",
      badge: "5대 AI 오각 밸런스",
      title: "5대 주요 AI 모델 오각 밸런스 측정",
      subtitle: "특정 플랫폼에 종속되지 않는 완전한 엔티티(Entity) 장악",
      desc: "ChatGPT, Perplexity, Gemini, Naver API, Claude 등 5대 채널별 강점과 개선점을 오각 레이더 차트로 식별하고 핀포인트 최적화 전략을 수립합니다.",
      image: "/images/solutions/luvis/page_09.png",
      keyPoints: [
        "ChatGPT: 압도적 추천 점유율 유지 모니터링",
        "Perplexity: 답변형 검색 엔진 특화 구조 데이터 보강",
        "Gemini: 멀티모달(YouTube 연동) 자산 가점 확인",
        "Naver API: 로컬 허브 최적화 (점유율 13%p 상승 사례)",
        "Claude: 의료진 약력 텍스트 가독성 최적화"
      ]
    },
    {
      id: "slide-10",
      page: 10,
      tag: "Opportunity Map",
      badge: "4사분면 기회지도",
      title: "경쟁사 대비 추천 점유율(SOV) 및 기회 지도",
      subtitle: "경쟁사가 장악한 '탈환(Reclaim)' 영역을 찾아내어 정확하게 저격",
      desc: "질문별 회차 간 노출 상태 매트릭스를 기반으로 4사분면 기회 지도(Blue Ocean, Defend, Contested, Reclaim)를 구성하여 예산과 마케팅 리소스를 집중 투입할 영역을 정의합니다.",
      image: "/images/solutions/luvis/page_10.png",
      keyPoints: [
        "1. Blue Ocean (선점/우위): 자사 높음/경쟁사 낮음 ➔ 시장 지배력 방어",
        "2. Defend (방어): 자사 높음/경쟁사 높음 ➔ 신뢰 자산(Trust Signal) 지속 업데이트",
        "3. Contested (경합): 자사 낮음/경쟁사 낮음 ➔ 신규 타겟 콘텐츠 선제 발행",
        "4. Reclaim (탈환/집중공략): 자사 낮음/경쟁사 높음 ➔ 1순위 마케팅 리소스 집중 저격"
      ]
    },
    {
      id: "slide-11",
      page: 11,
      tag: "Consistency Index",
      badge: "환각 억제 & 교차검증",
      title: "AI 환각(Hallucination) 억제 및 1:1 교차 검증",
      subtitle: "API 진단과 실제 웹 UI 크롤링의 일치도(Consistency Gap 2% 이내)",
      desc: "백엔드 API 자연어 질의 분석(Step 1)과 내장 브라우저 실시간 Web UI 교차 크롤링(Step 2)을 결합하여, 환각 현상을 98% 이상 걸러내고 실제 환자가 브라우저에서 보는 '진짜 데이터'만 보고합니다.",
      image: "/images/solutions/luvis/page_11.png",
      keyPoints: [
        "Step 1: 백엔드 API를 통한 대량의 자연어 질의 정밀 분석",
        "Step 2: 내장 브라우저를 통한 실시간 Web UI 교차 크롤링",
        "Result: 환각 98% 이상 차단, 정합성 갭(Consistency Gap) 2% 이내 밀착"
      ]
    },
    {
      id: "slide-12",
      page: 12,
      tag: "Supabase Storage",
      badge: "데이터 자산화",
      title: "데이터 자산화: Supabase 기반 자동 리포트 렌더링",
      subtitle: "1초 만에 PDF/MD/HTML 원페이지 종합 진단 리포트 자동 생성",
      desc: "진단 완료 즉시 원본 Audit JSON을 Supabase 클라우드에 영구 보관하고, 경영진 보고용 원페이지 종합 리포트와 5대 핵심 개선 과제(Action Plan)를 1초 만에 렌더링합니다.",
      image: "/images/solutions/luvis/page_12.png",
      keyPoints: [
        "1초 만에 렌더링: 진단 즉시 영업/보고용 원페이지 리포트(PDF/MD/HTML) 생성",
        "개선 과제 도출: 4대 영역별 점수 산정 근거 및 5대 Action Plan 자동 제시",
        "위변조 원천 차단: 클라우드에 진단 원본 데이터를 영구 보관하여 신뢰성 보장"
      ]
    },
    {
      id: "slide-13",
      page: 13,
      tag: "Roadmap",
      badge: "3단계 마케팅 전략",
      title: "시장 1위 탈환을 위한 3단계 마케팅 로드맵",
      subtitle: "STEP 1. 진단 ➔ STEP 2. 최적화 ➔ STEP 3. 증명",
      desc: "객관적 수치화(Diagnose)로 시작하여, 로봇 차단 해제와 스키마 탑재(Improve)로 최적화하고, 월간 정기 실측 추이(Prove)로 경쟁사 점유율 역전 과정을 경영진에게 정량 보고합니다.",
      image: "/images/solutions/luvis/page_13.png",
      keyPoints: [
        "STEP 1. 진단 (Diagnose): LUVIS 30개 고정 패널과 5대 Intent로 AI 가시성(SOV) 수치화",
        "STEP 2. 최적화 (Improve): robots.txt 해제, JSON-LD 스키마 탑재, E-E-A-T 신뢰 자산 주입",
        "STEP 3. 증명 (Prove): 월간 정기 실측 추이 분석으로 경쟁사 점유율 역전 시계열 보고"
      ]
    },
    {
      id: "slide-14",
      page: 14,
      tag: "Business Impact",
      badge: "비즈니스 가치",
      title: "LUVIS 도입의 궁극적인 비즈니스 임팩트",
      subtitle: "환자 획득 비용(CAC) 절감, 압도적 시장 지배력, 데이터 기반 타겟팅",
      desc: "무의미한 입찰 키워드 광고 출혈 경쟁에서 벗어나, AI가 직접 설득하는 고관여 환자의 자동 유입을 유도하고 기회 지도를 바탕으로 가장 효율적인 영역에 마케팅 예산을 집중합니다.",
      image: "/images/solutions/luvis/page_14.png",
      keyPoints: [
        "01. 환자 획득 비용(CAC) 절감: 무의미한 상단 입찰 탈피, AI 직접 설득 고관여 환자 유입",
        "02. 압도적 시장 지배력 (Entity Branding): 전문의 이력, 최신 시설, 평점 인용으로 신뢰 형성",
        "03. 데이터 기반 타겟팅 예산 집행: 맹목적 블로그 탈피, 수치화된 기회 지도 중심 리소스 집중"
      ]
    },
    {
      id: "slide-15",
      page: 15,
      tag: "Call to Action",
      badge: "Get Started",
      title: "생성형 AI는 지금 이 순간에도 수많은 환자들에게 누군가를 '추천'하고 있습니다",
      subtitle: "우리 병원의 AI 가독성과 추천 지분을 지금 점검하십시오",
      desc: "측정할 수 없다면, 시장을 선점할 수 없습니다. 지금 귀 병원의 URL을 입력하고, LUVIS 종합 진단 리포트를 받아보세요.",
      image: "/images/solutions/luvis/page_15.png",
      keyPoints: [
        "지금 귀 병원의 웹사이트 URL을 입력하고 실시간 진단을 시작하세요",
        "LUVIS AI Web Engine v1.0 즉시 실행 가능",
        "Cloudflare Pages 글로벌 엣지 기반 초저지연 관제 대시보드"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-cyan-500/20">
      {/* 백그라운드 앰비언트 글로우 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#e0f2fe,_#f8fafc_70%)] -z-10" />
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent z-50 opacity-80" />

      {/* 헤더 네비게이션 */}
      <header className="sticky top-0 z-40 bg-slate-900/95 text-white backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-200 hover:text-cyan-400 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-cyan-400" />
            <span className="text-sm font-semibold">Calamus 포털 메인으로</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/hospitals"
              className="text-xs text-emerald-300 font-bold hidden md:inline-block bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-500/40 hover:bg-emerald-900 transition-colors"
            >
              전국 병원 검색
            </Link>
            <span className="text-xs text-cyan-300 font-bold hidden sm:inline-block bg-cyan-950/80 px-3 py-1.5 rounded-lg border border-cyan-500/40">
              AEO/GEO 병원 AI 가시성 진단 엔진
            </span>
            <a
              href={DOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-sm transition-all hover:scale-105"
            >
              <span>LUVIS 대시보드 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* 상단 히어로 인트로 */}
      <section className="pt-14 pb-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold tracking-wide uppercase mb-6 shadow-xs">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-600" />
            LUVIS AI Web Engine v1.0 · AEO/GEO 최적화 통합 관제 가이드
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            생성형 AI 시대, 우리 병원은 <br />
            환자에게 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600">‘추천’</span>받고 있습니까?
          </h1>

          <p className="mt-6 text-slate-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            데이터 기반 AI 가시성 진단 및 시장 점유율(SOV) 확보 솔루션 <strong>LUVIS AI Web Engine v1.0</strong> 소개 가이드입니다.
            공식 소개 슬라이드 15개 페이지의 전문 분석과 정밀 측정 프레임워크를 한눈에 확인하세요.
          </p>

          {/* 퀵 바로가기 칩 */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={DOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm shadow-md shadow-cyan-200 transition-all hover:scale-105"
            >
              <span>실시간 LUVIS 엔진 열기</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="#slide-02"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm transition-all shadow-xs"
            >
              15개 슬라이드 전체 보기
            </a>
          </div>

          {/* 슬라이드 퀵 네비게이션 바 */}
          <div className="mt-10 p-3 bg-white border border-slate-200 rounded-2xl shadow-xs max-w-4xl mx-auto overflow-x-auto">
            <div className="flex items-center justify-between min-w-[700px] text-xs">
              <span className="font-bold text-slate-500 px-2 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-cyan-600" />
                Slide Map:
              </span>
              {slides.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-cyan-50 hover:text-cyan-700 text-slate-600 font-semibold transition-colors text-[11px]"
                >
                  P.{s.page}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 15개 슬라이드 상세 쇼케이스 섹션 */}
      <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-16">
        {slides.map((slide) => (
          <article
            key={slide.id}
            id={slide.id}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden scroll-mt-24"
          >
            {/* 상단 뱃지 & 페이지 번호 */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  {slide.page < 10 ? `0${slide.page}` : slide.page}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                  {slide.badge}
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase hidden sm:inline-block">
                  {slide.tag}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSlide(slide.image)}
                  className="text-xs text-slate-500 hover:text-cyan-700 flex items-center gap-1 font-semibold bg-slate-50 hover:bg-cyan-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>슬라이드 확대</span>
                </button>
              </div>
            </div>

            {/* 메인 콘텐츠 그리드 (2컬럼: 이미지 쇼케이스 + 정밀 설명) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-8">
              {/* 좌측/상단: 고화질 슬라이드 원본 이미지 쇼케이스 */}
              <div className="lg:col-span-7">
                <div
                  onClick={() => setSelectedSlide(slide.image)}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-sm cursor-zoom-in transition-all duration-300 hover:border-cyan-400 hover:shadow-lg"
                >
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-contain group-hover:scale-[1.02] transition-transform duration-500"
                      priority={slide.page <= 2}
                    />
                  </div>
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/95 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-cyan-600" />
                      원본 슬라이드 크게 보기
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>LUVIS AI Visibility 소개서 · Slide #{slide.page}</span>
                  <span className="font-mono text-cyan-600">2752 x 1536 High Resolution</span>
                </div>
              </div>

              {/* 우측/하단: 텍스트 설명 & 핵심 포인트 */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-xs font-extrabold text-cyan-700 uppercase tracking-wide">
                    Slide 0{slide.page} Focus
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 leading-snug">
                    {slide.title}
                  </h2>
                  <p className="text-sm font-semibold text-cyan-800 mt-2 bg-cyan-50/60 p-2.5 rounded-xl border border-cyan-100">
                    {slide.subtitle}
                  </p>
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {slide.desc}
                  </p>
                </div>

                {/* 핵심 분석 포인트 리스트 */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-2.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    핵심 전략 및 측정 포인트
                  </span>
                  <ul className="space-y-2">
                    {slide.keyPoints.map((point, pIdx) => (
                      <li key={pIdx} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* 하단 통합 CTA */}
      <section className="py-20 px-4 sm:px-6 text-center border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            LUVIS AI Web Engine v1.0 배포 완료
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            생성형 AI 시대, 우리 병원의 가시성을 지금 확인하세요
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-8 max-w-2xl mx-auto leading-relaxed">
            측정할 수 없다면 시장을 선점할 수 없습니다. 
            지금 바로 LUVIS 실시간 대시보드에서 귀 병원의 AI 추천 지표와 4사분면 기회 지도를 확인하세요.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={DOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm shadow-md shadow-cyan-200 transition-all hover:scale-105"
            >
              <span>LUVIS 대시보드 바로가기</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href="/hospitals"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all hover:scale-105"
            >
              <span>전국 병원 검색관 이동</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 솔루션 간 네비게이션 */}
          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <Link href="/solutions/onanbu" className="hover:text-rose-700 flex items-center gap-1 font-medium">
              ← 이전 솔루션: 온안부 (OnAnBu)
            </Link>
            <Link href="/solutions/my-re-design" className="hover:text-purple-700 flex items-center gap-1 font-medium">
              다음 솔루션: My Re Design →
            </Link>
            <Link href="/" className="hover:text-emerald-700 flex items-center gap-1 font-medium">
              Calamus 포털 메인으로 →
            </Link>
          </div>
        </div>
      </section>

      {/* 이미지 라이트박스 모달 */}
      {selectedSlide && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedSlide(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-700 p-2 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700">슬라이드 고해상도 뷰</span>
              <button
                onClick={() => setSelectedSlide(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                닫기 (ESC)
              </button>
            </div>
            <div className="relative w-full aspect-[16/9] mt-2 rounded-2xl overflow-hidden bg-slate-950">
              <Image
                src={selectedSlide}
                alt="확대 슬라이드"
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
