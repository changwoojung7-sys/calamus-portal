"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  ChevronRight,
  Flame,
  Swords,
  Share2,
  Camera,
  Video,
  Mic,
  FileText,
  Clock,
  ThumbsUp,
  Play,
  RotateCcw,
  Check,
  Smile,
  Meh,
  Frown,
  Laugh,
  RefreshCw,
  BellRing,
  Instagram,
  Heart,
  Target,
  ShieldCheck,
  Compass,
  Trophy,
  Sliders,
  ChevronDown,
  Maximize2,
  ArrowRight
} from "lucide-react";
import Footer from "@/components/common/Footer";

export default function MyReDesignPage() {
  const DOMAIN_URL = "https://myredesign.ai.kr";

  // 인터랙티브 상태 관리
  const [selectedMood, setSelectedMood] = useState<number>(3); // 1~5
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("body");
  const [missionCount, setMissionCount] = useState<number>(3);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [nudgeSent, setNudgeSent] = useState<boolean>(false);
  const [nudgeCooldown, setNudgeCooldown] = useState<number>(0);
  const [activeMediaTab, setActiveMediaTab] = useState<string>("photo");
  const [selectedSlide, setSelectedSlide] = useState<string | null>(null);

  // 10개 슬라이드 메타 정보
  const slideList = [
    { page: 1, title: "나를 다시 디자인하다, My Re Design", tag: "Hero & Intro", img: "/images/solutions/my-re-design/page_01.png" },
    { page: 2, title: "Zero UI 혁신: 계획 세우기의 종말", tag: "Zero UI", img: "/images/solutions/my-re-design/page_02.png" },
    { page: 3, title: "4각 밸런스 케어: 신체·마음·성장·재미", tag: "4-Axis Balance", img: "/images/solutions/my-re-design/page_03.png" },
    { page: 4, title: "눈치 빠른 AI 코치: 5단계 컨디션 맞춤 미션", tag: "AI Coach", img: "/images/solutions/my-re-design/page_04.png" },
    { page: 5, title: "확실한 도파민: 4종 미디어 인증 & 컨페티", tag: "Media Auth", img: "/images/solutions/my-re-design/page_05.png" },
    { page: 6, title: "따뜻한 AI 회고: 일일 한 줄 & 피드백 타임라인", tag: "AI Retrospect", img: "/images/solutions/my-re-design/page_06.png" },
    { page: 7, title: "게이미피케이션: 스트릭·레벨XP·트로피 룸", tag: "Gamification", img: "/images/solutions/my-re-design/page_07.png" },
    { page: 8, title: "1:1 버디 대결: 실시간 진도율 & 15초 응원 넛지", tag: "1:1 Buddy", img: "/images/solutions/my-re-design/page_08.png" },
    { page: 9, title: "숏폼 브이로그 & 인스타 스토리 ShareCard", tag: "Shortform & SNS", img: "/images/solutions/my-re-design/page_09.png" },
    { page: 10, title: "7일 무료체험 & 올인원 라이프스타일 가이드", tag: "Free Trial & CTA", img: "/images/solutions/my-re-design/page_10.png" }
  ];

  // 응원 넛지 쿨다운 타이머
  const handleSendNudge = () => {
    if (nudgeCooldown > 0) return;
    setNudgeSent(true);
    setNudgeCooldown(15);
    const interval = setInterval(() => {
      setNudgeCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setNudgeSent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-900 font-sans selection:bg-purple-500/20 overflow-x-hidden">
      {/* 백그라운드 앰비언트 글로우 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#f3e8ff,_#fcfdfe_70%)] -z-10" />
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent z-50 opacity-80" />

      {/* GNB 헤더 네비게이션 */}
      <header className="sticky top-0 z-40 bg-slate-900/95 text-white backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-200 hover:text-purple-300 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-purple-400" />
            <span className="text-sm font-semibold">Calamus 포털 메인으로</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/hospitals"
              className="text-xs text-emerald-300 font-bold hidden md:inline-block bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-500/40 hover:bg-emerald-900 transition-colors"
            >
              전국 병원 검색
            </Link>
            <span className="text-xs text-purple-300 font-bold hidden sm:inline-block bg-purple-950/80 px-3 py-1.5 rounded-lg border border-purple-500/40">
              AI 라이프스타일 코칭 PWA
            </span>
            <a
              href={DOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm transition-all hover:scale-105"
            >
              <span>서비스 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* 슬라이드 퀵 네비게이션 칩 바 */}
      <section className="bg-white/80 border-b border-slate-200/80 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between overflow-x-auto text-xs gap-2">
          <span className="font-bold text-purple-900 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            10개 슬라이드 가이드:
          </span>
          <div className="flex items-center gap-1.5 min-w-max">
            {slideList.map((s) => (
              <a
                key={s.page}
                href={`#page-${s.page}`}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-purple-50 hover:text-purple-700 text-slate-600 font-semibold transition-colors text-[11px] border border-slate-200/80"
              >
                P.{s.page} {s.tag}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PAGE 1 : Hero & Intro (계획 세우다 지친 당신을 위해. 나를 다시 디자인하다) */}
      {/* ========================================================================= */}
      <section id="page-1" className="relative pt-16 pb-20 px-4 sm:px-6 overflow-hidden scroll-mt-20">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* 상단 슬라이드 원본 이미지 쇼케이스 */}
          <div className="bg-white border border-purple-200 rounded-3xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-purple-700 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-[11px]">01</span>
                Page 1 · 공식 서비스 가이드 슬라이드
              </span>
              <button
                onClick={() => setSelectedSlide("/images/solutions/my-re-design/page_01.png")}
                className="text-slate-500 hover:text-purple-700 flex items-center gap-1 font-semibold text-xs"
              >
                <Maximize2 className="w-3.5 h-3.5" /> 크게 보기
              </button>
            </div>
            <div
              onClick={() => setSelectedSlide("/images/solutions/my-re-design/page_01.png")}
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 cursor-zoom-in group shadow-xs"
            >
              <Image
                src="/images/solutions/my-re-design/page_01.png"
                alt="My Re Design Page 1 Slide"
                fill
                sizes="(max-width: 1200px) 100vw, 1100px"
                className="object-contain group-hover:scale-[1.01] transition-transform duration-300"
                priority
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* 좌측: 타이틀 & 카피 */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold tracking-wide uppercase mb-6 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                AI-Powered Routine & Habit Coach
              </div>

              <p className="text-purple-700 text-lg sm:text-xl font-bold mb-2 tracking-tight">
                계획 세우다 지친 당신을 위해.
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                나를 다시 디자인하다, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500">
                  My Re Design
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                할 일 입력은 그만. 눈치 빠른 AI 코치가 매일 아침 배달하는 15분 맞춤형 '갓생' 루틴.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a
                  href={DOMAIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-sm shadow-md shadow-purple-200 transition-all hover:scale-105"
                >
                  <span>지금 100% 무료 체험하기</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="#page-2"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm transition-all shadow-xs"
                >
                  10대 핵심 기능 둘러보기
                </a>
              </div>
            </div>

            {/* 우측: 스마트폰 목업 프레임 */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-[280px] sm:w-[320px] bg-slate-900 border-4 border-slate-800 rounded-[40px] p-3.5 shadow-2xl relative">
                <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-slate-800 rounded-full mr-2" />
                  <div className="w-1.5 h-1.5 bg-indigo-500/80 rounded-full" />
                </div>
                <div className="bg-[#111827] rounded-[30px] p-4 text-xs text-slate-200 border border-slate-800/60">
                  <div className="flex justify-between items-center mb-3 text-[10px] text-slate-400">
                    <span className="font-bold text-purple-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Mission
                    </span>
                    <span>4월 22일 (토)</span>
                  </div>
                  <div className="p-3 bg-purple-950/60 border border-purple-800/60 rounded-2xl mb-3">
                    <div className="text-[10px] text-purple-300 font-semibold mb-1 flex items-center justify-between">
                      <span>[FunPlay] 매일 아침 향초 켜기</span>
                      <span className="text-emerald-400 font-bold">진행중 Day 3</span>
                    </div>
                    <p className="text-[11px] text-white font-medium">
                      아침에 일어나서 좋아하는 향초를 켜고, 그 향기를 깊게 느껴보세요.
                    </p>
                  </div>
                  <div className="bg-slate-900/90 rounded-2xl p-2.5 border border-slate-800 mb-3">
                    <span className="text-[10px] text-slate-400 block mb-1.5 font-medium">
                      오늘의 컨디션 (기분)
                    </span>
                    <div className="flex justify-between items-center text-lg">
                      <button className="hover:scale-125 transition-transform">😫</button>
                      <button className="hover:scale-125 transition-transform">😕</button>
                      <button className="hover:scale-125 transition-transform bg-amber-500/20 p-1 rounded-full border border-amber-500/60">😐</button>
                      <button className="hover:scale-125 transition-transform">🙂</button>
                      <button className="hover:scale-125 transition-transform">😄</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PAGE 2 : Zero UI 혁신 (아직도 '할 일'을 직접 타이핑하시나요?) */}
      {/* ========================================================================= */}
      <section id="page-2" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-200 scroll-mt-20">
        <div className="bg-white border border-purple-200 rounded-3xl p-4 sm:p-6 shadow-sm mb-12">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-purple-700 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-[11px]">02</span>
              Page 2 · Zero UI 혁신 슬라이드
            </span>
            <button
              onClick={() => setSelectedSlide("/images/solutions/my-re-design/page_02.png")}
              className="text-slate-500 hover:text-purple-700 flex items-center gap-1 font-semibold text-xs"
            >
              <Maximize2 className="w-3.5 h-3.5" /> 크게 보기
            </button>
          </div>
          <div
            onClick={() => setSelectedSlide("/images/solutions/my-re-design/page_02.png")}
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 cursor-zoom-in group"
          >
            <Image
              src="/images/solutions/my-re-design/page_02.png"
              alt="My Re Design Page 2 Slide"
              fill
              sizes="(max-width: 1200px) 100vw, 1100px"
              className="object-contain group-hover:scale-[1.01] transition-transform duration-300"
            />
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            아직도 '할 일'을 직접 타이핑하시나요?
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            귀찮고 막막한 계획 세우기는 끝났습니다. 당신의 나이, 성별, 그리고 오늘의 기분만 알려주세요.
            고민은 <strong className="text-purple-700">AI 해빗 코치(Habit Coach)</strong>에게 맡기고, 당신은 그저 추천받은 미션을 즐기면 됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 font-bold">
                ✕
              </div>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">기존 습관 형성 앱</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 mb-4">끝없는 입력의 늪 (Planning Fatigue)</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>매일 아침 목표를 직접 손으로 입력하고 타이핑해야 함</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>계획을 세우는 데만 에너지를 다 써버려 정작 실천을 못함</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>컨디션 난조로 하루만 밀려도 죄책감에 앱을 삭제하게 됨</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 font-medium">
              결과: 3일 만에 포기 (작심삼일 반복)
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-white border-2 border-purple-300 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-purple-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              Zero UI Innovation
            </div>
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-sm">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">My Re Design</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1 mb-4">AI가 알아서 설계하는 'Zero UI'</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span><strong>타이핑 Zero:</strong> 가입 시 기본 정보로 맞춤 루틴 3종 즉시 추천</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span><strong>기분 맞춤 변형:</strong> 피곤한 날엔 가벼운 스트레칭으로 자동 난이도 조절</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span><strong>실패 없는 15분:</strong> 작은 성취감으로 시작하여 뇌의 도파민 회로 활성화</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-purple-200 text-xs text-purple-800 font-bold flex items-center justify-between">
              <span>결과: 30일 연속 달성률 87.4%</span>
              <span className="text-purple-600">★ 4.9점</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PAGE 3 ~ 10 : 연속 슬라이드 쇼케이스 & 인터랙티브 기능 */}
      {/* ========================================================================= */}
      {slideList.slice(2).map((slide) => (
        <section key={slide.page} id={`page-${slide.page}`} className="py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-200 scroll-mt-20">
          <div className="bg-white border border-purple-200 rounded-3xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-purple-700 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-[11px]">
                  {slide.page < 10 ? `0${slide.page}` : slide.page}
                </span>
                Page {slide.page} · {slide.title}
              </span>
              <button
                onClick={() => setSelectedSlide(slide.img)}
                className="text-slate-500 hover:text-purple-700 flex items-center gap-1 font-semibold text-xs"
              >
                <Maximize2 className="w-3.5 h-3.5" /> 슬라이드 크게 보기
              </button>
            </div>
            <div
              onClick={() => setSelectedSlide(slide.img)}
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 cursor-zoom-in group shadow-xs"
            >
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                sizes="(max-width: 1200px) 100vw, 1100px"
                className="object-contain group-hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
          </div>
        </section>
      ))}

      {/* 하단 CTA */}
      <section className="py-20 px-4 sm:px-6 text-center border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            7일 무료체험 진행 중
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            나를 다시 디자인할 준비가 되셨나요?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-8 max-w-2xl mx-auto leading-relaxed">
            더 이상 작심삼일로 자책하지 마세요. 눈치 빠른 AI 코치와 함께 매일 15분, 
            인생의 가장 빛나는 변화를 만들어보세요.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={DOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-200 transition-all hover:scale-105"
            >
              <span>지금 100% 무료 체험 시작하기</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <Link href="/solutions/lua-visibility" className="hover:text-cyan-700 flex items-center gap-1 font-medium">
              ← 이전 솔루션: LUVIS AI Visibility
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
              <span className="text-xs font-bold text-slate-700">My Re Design 가이드 슬라이드 뷰</span>
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
