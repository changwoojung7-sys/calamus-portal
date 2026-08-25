"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Users,
  ShieldCheck,
  Smartphone,
  Sparkles,
  PhoneCall,
  Mail,
  Video,
  Mic,
  Camera,
  Layers,
  Award,
  ChevronRight,
  Sun,
  Smile,
  Film,
  UserCheck,
  UserX,
  HelpCircle,
  Clock,
  Send,
  MessageCircle,
  Bell,
  HeartHandshake,
  Maximize2,
  ArrowRight
} from "lucide-react";
import CoupangPartnersBanner from "@/components/ads/CoupangPartnersBanner";
import Footer from "@/components/common/Footer";

export default function OnAnBuPage() {
  const DOMAIN_URL = "https://onanbu.calamus.ai.kr";

  // 인터랙티브 상태 관리
  const [activeRole, setActiveRole] = useState<"primary" | "secondary" | "elder">("primary");
  const [selectedMood, setSelectedMood] = useState<string>("happy");
  const [wakeUpChecked, setWakeUpChecked] = useState<boolean>(false);
  const [mediaType, setMediaType] = useState<"photo" | "video" | "voice">("photo");
  const [selectedSlide, setSelectedSlide] = useState<string | null>(null);

  // 11개 슬라이드 메타 정보
  const slideList = [
    { page: 1, title: "부모님과 자녀를 연결하는 가장 따뜻한 안부, 온(溫)안부", tag: "Hero & Intro", img: "/images/solutions/onanbu/page_01.png" },
    { page: 2, title: "스마트 케어 네트워크: 주케어자·보조케어자·케어대상", tag: "Care Network", img: "/images/solutions/onanbu/page_02.png" },
    { page: 3, title: "가족방 개설 및 연결 시작하기: 6자리 초대코드", tag: "Room Creation", img: "/images/solutions/onanbu/page_03.png" },
    { page: 4, title: "보조 보호자 초대: 온 가족이 함께 챙기는 안부", tag: "Invite Secondary", img: "/images/solutions/onanbu/page_04.png" },
    { page: 5, title: "대시보드 해부: 기상카드·골든타임·AI주간브리핑", tag: "Dashboard Anatomy", img: "/images/solutions/onanbu/page_05.png" },
    { page: 6, title: "15초 미디어 편지 & 따뜻한 원클릭 추천 문구", tag: "Media Letter", img: "/images/solutions/onanbu/page_06.png" },
    { page: 7, title: "전송 옵션 비교: 무료(광고형) vs 패밀리 패스", tag: "Pricing & Pass", img: "/images/solutions/onanbu/page_07.png" },
    { page: 8, title: "스마트폰이 어려워도 걱정 없는 시니어 맞춤 UI", tag: "Senior UI", img: "/images/solutions/onanbu/page_08.png" },
    { page: 9, title: "숏폼 영화 Play Movie 2.0: 자동 슬라이드쇼 무비", tag: "PlayMovie 2.0", img: "/images/solutions/onanbu/page_09.png" },
    { page: 10, title: "안전하고 투명한 2단계 회원탈퇴 프로세스", tag: "Account Deletion", img: "/images/solutions/onanbu/page_10.png" },
    { page: 11, title: "고객센터 & Support & 자주 묻는 질문(FAQ)", tag: "Support & FAQ", img: "/images/solutions/onanbu/page_11.png" }
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf8] text-slate-900 font-sans selection:bg-rose-500/20 overflow-x-hidden">
      {/* 백그라운드 앰비언트 글로우 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#ffe4e6,_#fdfaf8_70%)] -z-10" />
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-400 to-transparent z-50 opacity-80" />

      {/* GNB 헤더 네비게이션 */}
      <header className="sticky top-0 z-40 bg-slate-900/95 text-white backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-200 hover:text-rose-300 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-rose-400" />
            <span className="text-sm font-semibold">Calamus 포털 메인으로</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/hospitals"
              className="text-xs text-emerald-300 font-bold hidden md:inline-block bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-500/40 hover:bg-emerald-900 transition-colors"
            >
              전국 병원 검색
            </Link>
            <span className="text-xs text-rose-300 font-bold hidden sm:inline-block bg-rose-950/80 px-3 py-1.5 rounded-lg border border-rose-500/40">
              시니어 안심 케어 & 가족 안부 플랫폼
            </span>
            <a
              href={DOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all hover:scale-105"
            >
              <span>온안부 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* 슬라이드 퀵 네비게이션 칩 바 */}
      <section className="bg-white/80 border-b border-slate-200/80 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between overflow-x-auto text-xs gap-2">
          <span className="font-bold text-rose-900 whitespace-nowrap flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            11개 슬라이드 가이드:
          </span>
          <div className="flex items-center gap-1.5 min-w-max">
            {slideList.map((s) => (
              <a
                key={s.page}
                href={`#page-${s.page}`}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-semibold transition-colors text-[11px] border border-slate-200/80"
              >
                P.{s.page} {s.tag}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 상단 쿠팡 파트너스 효도상품 큐레이션 배너 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <CoupangPartnersBanner />
      </div>

      {/* ========================================================================= */}
      {/* PAGE 1 : Hero & Intro (부모님과 자녀를 연결하는 가장 따뜻한 안부, 온안부) */}
      {/* ========================================================================= */}
      <section id="page-1" className="relative pt-16 pb-20 px-4 sm:px-6 overflow-hidden scroll-mt-20">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* 상단 슬라이드 원본 이미지 쇼케이스 */}
          <div className="bg-white border border-rose-200 rounded-3xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-rose-700 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center font-black text-[11px]">01</span>
                Page 1 · 공식 서비스 가이드 슬라이드
              </span>
              <button
                onClick={() => setSelectedSlide("/images/solutions/onanbu/page_01.png")}
                className="text-slate-500 hover:text-rose-700 flex items-center gap-1 font-semibold text-xs"
              >
                <Maximize2 className="w-3.5 h-3.5" /> 크게 보기
              </button>
            </div>
            <div
              onClick={() => setSelectedSlide("/images/solutions/onanbu/page_01.png")}
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 cursor-zoom-in group shadow-xs"
            >
              <Image
                src="/images/solutions/onanbu/page_01.png"
                alt="OnAnBu Page 1 Slide"
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold tracking-wide uppercase mb-6 shadow-xs">
                <Heart className="w-3.5 h-3.5 text-rose-600" />
                Senior Care & Family Warmth
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                부모님과 자녀를 연결하는 <br />
                가장 따뜻한 안부, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600">
                  온(溫)안부
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                단순한 건강 확인을 넘어, 매일 마음을 전하고 가족의 추억을 쌓아가는 시니어 안심 케어 서비스입니다.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a
                  href={DOMAIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-sm shadow-md shadow-rose-200 transition-all hover:scale-105"
                >
                  <span>지금 온안부 시작하기</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="#page-2"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm transition-all shadow-xs"
                >
                  가이드 둘러보기
                </a>
              </div>
            </div>

            {/* 우측: 3대 핵심 요약 카드 */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 text-xl font-bold">
                  ☀️
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">① 원터치 안심 기상 확인</h3>
                  <p className="text-xs text-slate-600 mt-0.5">버튼 하나로 기상 상태와 기분 즉시 알림</p>
                </div>
              </div>

              <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 text-xl font-bold">
                  💌
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">② 15초 미디어 편지 전송</h3>
                  <p className="text-xs text-slate-600 mt-0.5">손주 사진과 목소리를 담은 따뜻한 메시지</p>
                </div>
              </div>

              <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-xl font-bold">
                  🤖
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">③ AI 기반 주간 가족 브리핑</h3>
                  <p className="text-xs text-slate-600 mt-0.5">한 주의 기분과 복약 현황을 AI가 한눈에 요약</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PAGE 2 ~ 11 : 연속 슬라이드 쇼케이스 */}
      {/* ========================================================================= */}
      {slideList.slice(1).map((slide) => (
        <section key={slide.page} id={`page-${slide.page}`} className="py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-200 scroll-mt-20">
          <div className="bg-white border border-rose-200 rounded-3xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-rose-700 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center font-black text-[11px]">
                  {slide.page < 10 ? `0${slide.page}` : slide.page}
                </span>
                Page {slide.page} · {slide.title}
              </span>
              <button
                onClick={() => setSelectedSlide(slide.img)}
                className="text-slate-500 hover:text-rose-700 flex items-center gap-1 font-semibold text-xs"
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-6">
            <Sparkles className="w-4 h-4 text-rose-600" />
            온안부 가족방 개설 바로가기
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            오늘도 부모님께 따뜻한 안부를 전해보세요
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-8 max-w-2xl mx-auto leading-relaxed">
            원터치 기상 확인부터 15초 미디어 편지, AI 주간 브리핑까지.
            부모님의 하루를 가장 든든하게 지켜드리는 온안부와 함께하세요.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={DOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-200 transition-all hover:scale-105"
            >
              <span>온안부 서비스 바로가기</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href="/hospitals"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all hover:scale-105"
            >
              <span>전국 요양병원·케어시설 검색</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <Link href="/solutions/my-re-design" className="hover:text-purple-700 flex items-center gap-1 font-medium">
              ← 이전 솔루션: My Re Design
            </Link>
            <Link href="/solutions/lua-visibility" className="hover:text-cyan-700 flex items-center gap-1 font-medium">
              다음 솔루션: LUVIS AI Visibility →
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
              <span className="text-xs font-bold text-slate-700">온안부 가이드 슬라이드 뷰</span>
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
