"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Server,
  ShieldCheck,
  DollarSign,
  Users,
  Monitor,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Lock,
  Headphones,
  Play,
  Film,
  Clock,
  Sparkle
} from "lucide-react";

// 5분 안내 영상 10대 인터랙티브 챕터
const videoChapters = [
  { time: "0:00", seconds: 0, title: "인트로 — 브라우저 출근 3D 가상 오피스" },
  { time: "0:10", seconds: 10, title: "첫 출근 — 무설치 웹 로그인 및 보안 비번 설정" },
  { time: "0:40", seconds: 40, title: "나만의 캐릭터 & 실제 얼굴 사진 등록" },
  { time: "1:14", seconds: 74, title: "하단 툴바 기능 및 자리 저장 / 근태 관리" },
  { time: "1:47", seconds: 107, title: "마주치면 들리는 공간 음향 · 1:1 화상 통화" },
  { time: "2:29", seconds: 149, title: "3D 사옥 투어와 루프탑 휴게 공간" },
  { time: "3:04", seconds: 184, title: "화상회의실 격리 및 SFU 고화질 화면 공유" },
  { time: "3:39", seconds: 219, title: "전사 설명회 — 대강당 회의 및 발언권 승인" },
  { time: "4:05", seconds: 245, title: "외부 고객 세미나 — 100석 타운홀 미팅" },
  { time: "4:45", seconds: 285, title: "도입 안내 및 엔딩" }
];

export default function WorkNexusSection() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeVideoId, setActiveVideoId] = useState<"intro" | "shorts">("intro");
  const [currentChapterIdx, setCurrentChapterIdx] = useState<number>(0);
  const [currentStartSeconds, setCurrentStartSeconds] = useState<number>(0);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(false);

  const videoOptions = [
    {
      id: "intro" as const,
      label: "5분 완벽 가이드",
      duration: "4분 57초",
      badge: "5:00 Full Tour",
      youtubeId: "KvGI7q73D7A",
      watchUrl: "https://youtu.be/KvGI7q73D7A",
      title: "브라우저 출근부터 100석 타운홀까지 사용법 가이드",
      desc: "설치 없이 웹 로그인 후 아바타 설정, 공간 음향 대화, 화면 공유, 100인 세미나까지 실사용 핵심 기능을 상세히 설명합니다."
    },
    {
      id: "shorts" as const,
      label: "핵심 요약 쇼츠",
      duration: "Shorts",
      badge: "YouTube Shorts",
      youtubeId: "20ZhVVM-nbQ",
      watchUrl: "https://youtube.com/shorts/20ZhVVM-nbQ",
      title: "한눈에 파악하는 WorkNexus 핵심 요약 쇼츠",
      desc: "추가 구독료 없는 단일 서버 사내망 구축형 3D 가상 오피스의 핵심 특징을 숏폼 영상으로 빠르게 전달합니다."
    }
  ];

  const showcaseTabs = [
    {
      type: "video",
      label: "🎬 공식 시연 영상 (5분 투어 · 쇼츠)",
      desc: "실제 구동 유튜브 영상으로 체험하는 WorkNexus 3D 오피스 핵심 기능 및 튜토리얼"
    },
    {
      type: "image",
      label: "아키텍처 솔루션 특징",
      src: "/images/solutions/worknexus/solution-overview.png",
      desc: "독립형 3D 가상 오피스 솔루션 구성 및 엔터프라이즈 올인원 협업 특징"
    },
    {
      type: "image",
      label: "오피스 업무 뷰",
      src: "/images/solutions/worknexus/office-view.png",
      desc: "로그인 후 실시간 부서별 자리배치와 상태 동기화"
    },
    {
      type: "image",
      label: "100석 대회의실 / 타운홀",
      src: "/images/solutions/worknexus/meeting-room.png",
      desc: "전사 세미나 및 100인 수용 발표 무대 (발표자/청중 분리)"
    },
    {
      type: "image",
      label: "근거리 공간 음향 (Spatial Audio)",
      src: "/images/solutions/worknexus/spatial-audio.png",
      desc: "동료 아바타에게 다가가면 자연스럽게 목소리가 들리는 거리 기반 음성"
    },
    {
      type: "image",
      label: "화면 공유 & 화상회의",
      src: "/images/solutions/worknexus/screen-share.png",
      desc: "방 단위로 완전 격리된 LiveKit SFU 고화질 화면 공유"
    },
    {
      type: "image",
      label: "화이트보드 협업",
      src: "/images/solutions/worknexus/whiteboard-collaboration.png",
      desc: "회의 참가자가 같은 화면에서 아이디어와 업무 내용을 함께 정리"
    },
    {
      type: "image",
      label: "모바일 게스트 참여",
      src: "/images/solutions/worknexus/mobile-guest-screen-share.png",
      desc: "외부 방문자와 모바일 참여자도 화면 공유와 회의에 간편하게 참여"
    },
    {
      type: "image",
      label: "공간 커스텀",
      src: "/images/solutions/worknexus/custom-meeting-room.png",
      desc: "조직과 업무 방식에 맞춰 오피스, 임원실, 회의실을 유연하게 구성"
    }
  ];

  // 특정 챕터로 바로 건너뛰기
  const jumpToChapter = (idx: number, seconds: number) => {
    setCurrentChapterIdx(idx);
    setCurrentStartSeconds(seconds);
    setIsAutoplay(true);
  };

  // 동영상 전환 핸들러
  const handleVideoSwitch = (videoId: "intro" | "shorts") => {
    setActiveVideoId(videoId);
    if (videoId === "intro") {
      setCurrentStartSeconds(0);
      setCurrentChapterIdx(0);
    }
    setIsAutoplay(true);
  };

  const currentVideo = videoOptions.find((v) => v.id === activeVideoId) || videoOptions[0];

  const embedSrc =
    activeVideoId === "intro"
      ? `https://www.youtube.com/embed/KvGI7q73D7A?start=${currentStartSeconds}&autoplay=${isAutoplay ? 1 : 0}&rel=0`
      : `https://www.youtube.com/embed/20ZhVVM-nbQ?autoplay=${isAutoplay ? 1 : 0}&rel=0`;

  const youtubeDirectLink =
    activeVideoId === "intro"
      ? `https://www.youtube.com/watch?v=KvGI7q73D7A&t=${videoChapters[currentChapterIdx].seconds}s`
      : "https://youtube.com/shorts/20ZhVVM-nbQ";

  const threeNoPrinciples = [
    {
      title: "사용자별 추가 구독료 없음",
      en: "Zero SaaS Subscriptions",
      desc: "외부 SaaS처럼 사용자 수가 늘 때마다 매월 좌석 비용이 더해지는 구조가 아닙니다.",
      icon: DollarSign,
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/40"
    },
    {
      title: "별도 퍼블릭 클라우드 불필요",
      en: "On-Premise Infrastructure",
      desc: "AWS·Azure 같은 별도 퍼블릭 클라우드 인프라 대신 고객사 Windows 서버에서 운영합니다.",
      icon: Server,
      color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/40"
    },
    {
      title: "업무 데이터 사내 보관",
      en: "100% Data Sovereignty",
      desc: "화상 미디어, 대화 기록, 근태 정보 등 핵심 업무 데이터를 고객사 인프라 안에서 관리합니다.",
      icon: Lock,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/40"
    }
  ];

  const coreFeatures = [
    {
      icon: ShieldCheck,
      title: "사내 구축형 LiveKit SFU 미디어 서버",
      desc: "사용자 간 P2P 연결 대신 고객사 인프라의 LiveKit SFU를 중심으로 음성·영상·화면 공유 트래픽을 중계합니다."
    },
    {
      icon: Headphones,
      title: "마주치면 들리는 근거리 공간 음향",
      desc: "회의실을 잡지 않아도 3D 공간에서 동료 아바타에게 다가가면 목소리가 들리는 거리 기반 3D Spatial Audio 엔진을 지원합니다."
    },
    {
      icon: Users,
      title: "100석 대강당 / 타운홀 미팅",
      desc: "대규모 전사 설명회와 세미나를 위한 대형 객석. 발표자 권한 분리, 청중 손들기 및 발언권 승인, 고음질 시스템 오디오 동시 송출을 지원합니다."
    },
    {
      icon: Monitor,
      title: "Windows 네이티브 서버 · 웹 접속",
      desc: "서버는 Windows 환경에서 단일 실행 파일로 운영하고, 임직원은 별도 앱 설치 없이 최신 웹 브라우저로 접속합니다."
    }
  ];

  return (
    <section id="worknexus" className="py-24 px-4 sm:px-6 relative overflow-hidden bg-slate-950 text-white">
      {/* 백그라운드 네온 오로라 */}
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 섹션 상단 헤더 */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs font-bold tracking-wide uppercase mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Flagship Solution 01 · 독립형 3D 가상 오피스
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              우리 회사 서버 한 대로 완성하는 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                독립 가상 사옥, Calamus WorkNexus
              </span>
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              외부 SaaS를 매월 임대하는 대신 고객사 Windows 서버에 직접 구축합니다.
              사용자별 추가 구독료 부담을 줄이고, 핵심 업무 데이터의 보관 위치를 직접 통제하세요.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://worknexus.calamus.ai.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-purple-950/50 transition-all hover:scale-105"
            >
              <span>WorkNexus 체험하기</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 3無 원칙 하이라이트 카드 (핵심 가치 제안) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {threeNoPrinciples.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl p-7 bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all duration-300 relative overflow-hidden group shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} border flex items-center justify-center`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                    3無 PRINCIPLE 0{idx + 1}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                <p className="text-xs font-mono text-purple-400 mb-3">{item.en}</p>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* 인터랙티브 쇼케이스 뷰어 (상단 탭 + 비디오 플레이어 & 이미지 프리뷰) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-16 shadow-2xl backdrop-blur-md">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkle className="w-3.5 h-3.5" /> Product Showcase & Interactive Tour
              </span>
              <h3 className="mt-1 text-xl sm:text-2xl font-black text-white">실제 시연 영상과 기능 화면으로 확인하세요</h3>
              <p className="mt-2 text-sm text-slate-400">
                5분 상세 사용법 가이드와 43초 요약 쇼츠 영상부터 각 기능별 상세 스크린샷까지 한곳에서 둘러보실 수 있습니다.
              </p>
            </div>

            {/* 탭 0(영상 탭)일 때 활성화되는 동영상 스위치 버튼 */}
            {activeTab === 0 && (
              <div className="flex items-center p-1 bg-slate-950/90 border border-purple-500/30 rounded-2xl shadow-inner shrink-0">
                {videoOptions.map((v) => {
                  const isSelected = activeVideoId === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleVideoSwitch(v.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>{v.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}>
                        {v.duration}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 전체 탭 버튼 리스트 */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800/80 pb-4">
            {showcaseTabs.map((tab, idx) => {
              const isSelected = activeTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                      : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {idx === 0 && <Play className="w-3.5 h-3.5 fill-current text-purple-200" />}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 메인 뷰어 영역 */}
          {activeTab === 0 ? (
            /* [탭 0: 비디오 플레이어 영역 (5분 영상 + 43초 쇼츠)] */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* 비디오 플레이어 프레임 */}
              <div className="lg:col-span-8 flex flex-col gap-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-purple-500/30 shadow-2xl group">
                  <iframe
                    key={`${activeVideoId}-${currentStartSeconds}`}
                    src={embedSrc}
                    title={currentVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                  {/* 상단 비디오 정보 뱃지 오버레이 */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-bold text-purple-300 border border-purple-500/40 flex items-center gap-1 shadow-lg">
                      <Clock className="w-3 h-3 text-purple-400" />
                      {currentVideo.badge}
                    </span>
                  </div>
                </div>

                {/* 영상 설명 요약 및 유튜브 열기 링크 */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span className="text-purple-400">▶</span> {currentVideo.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {currentVideo.desc}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <a
                      href={youtubeDirectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-xs font-semibold text-red-300 hover:text-red-200 transition-colors flex items-center gap-1.5"
                    >
                      <span>YouTube에서 보기</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => handleVideoSwitch(activeVideoId === "intro" ? "shorts" : "intro")}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <Film className="w-3 h-3 text-purple-400" />
                      {activeVideoId === "intro" ? "쇼츠로 변경" : "5분 가이드로 변경"}
                    </button>
                  </div>
                </div>
              </div>

              {/* 우측 패널: 5분 영상일 때는 챕터 타임라인, 쇼츠일 때는 핵심 요약 포인트 */}
              <div className="lg:col-span-4 space-y-4">
                {activeVideoId === "intro" ? (
                  /* 5분 영상: 10대 인터랙티브 챕터 탐색기 */
                  <div className="bg-slate-950/90 p-5 rounded-2xl border border-purple-500/20 shadow-xl flex flex-col h-full max-h-[500px]">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-white tracking-wide">타임스탬프 챕터 바로가기</span>
                      </div>
                      <span className="text-[10px] text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-500/30">
                        10개 구간
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">
                      궁금한 기능을 클릭하면 해당 시점으로 즉시 이동하여 재생됩니다.
                    </p>
                    
                    <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 custom-scrollbar text-xs">
                      {videoChapters.map((ch, idx) => {
                        const isCurrent = currentChapterIdx === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => jumpToChapter(idx, ch.seconds)}
                            className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between gap-2 border ${
                              isCurrent
                                ? "bg-purple-950/70 border-purple-500/70 text-white font-bold shadow-sm"
                                : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-850 hover:border-slate-700"
                            }`}
                          >
                            <span className="truncate flex-1">{ch.title}</span>
                            <span
                              className={`shrink-0 font-mono text-[10px] px-2 py-0.5 rounded ${
                                isCurrent
                                  ? "bg-purple-600 text-white font-bold"
                                  : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              {ch.time}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* 쇼츠: 3대 핵심 요약 하이라이트 */
                  <div className="bg-slate-950/90 p-5 rounded-2xl border border-purple-500/20 shadow-xl space-y-3.5">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold text-white">YouTube Shorts 핵심 요약</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/30">
                      <h5 className="text-xs font-bold text-purple-300 mb-1">01. 무설치 웹 접속</h5>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        별도 클라이언트 설치 없이 Chrome, Edge 등 웹 브라우저에서 주소만 입력해 즉시 사옥으로 출근합니다.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/30">
                      <h5 className="text-xs font-bold text-indigo-300 mb-1">02. 3D 공간 음향 & 자연스러운 소통</h5>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        화상회의실을 잡지 않아도 동료 아바타에게 다가가면 목소리가 들리는 근거리 대화로 현장감을 재현합니다.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/30">
                      <h5 className="text-xs font-bold text-cyan-300 mb-1">03. 구독료 0원 사내 서버 완결형</h5>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        사용자 수가 늘어도 월 좌석 요금이 발생하지 않으며, 전사 데이터가 사내 Windows 서버에 보관됩니다.
                      </p>
                    </div>
                  </div>
                )}

                {/* 실시간 라이브 데모 바로가기 배너 */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/50 to-slate-900 border border-purple-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-purple-300">Live Demo</span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      상시 운영 중
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    지금 브라우저에서 실제 WorkNexus 3D 오피스에 접속해보세요.
                  </p>
                  <a
                    href="https://worknexus.calamus.ai.kr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-950"
                  >
                    <span>워크넥서스 체험하기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* [탭 1~8: 기존 스크린샷 뷰어] */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* 고화질 스크린샷 영역 */}
              <div className="lg:col-span-8 relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group">
                {showcaseTabs[activeTab].src && (
                  <Image
                    src={showcaseTabs[activeTab].src!}
                    alt={showcaseTabs[activeTab].label}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 65vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/60">
                  <span className="font-bold text-purple-400">💡 {showcaseTabs[activeTab].label}:</span> {showcaseTabs[activeTab].desc}
                </div>
              </div>

              {/* 제품 스펙 및 핵심 강점 리스트 */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                    Architecture Specs
                  </span>
                  <h4 className="text-base font-bold text-white mb-2">사내 완결형 단일 골든 바이너리</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Windows 10/11 및 Windows Server 네이티브 지원</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Cloudflare Named Tunnel 통한 안전한 암호화 외부 접속</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Ed25519 암호화 라이선스 체계 및 SQLite 초고속 DB</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>출퇴근(Clock-in/out) 자동 기록 & 근태 엑셀(CSV) 다운로드</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-800/40">
                  <h4 className="text-sm font-bold text-purple-300 mb-1">실시간 라이브 데모</h4>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    지금 바로 웹 브라우저에서 실제 구동 중인 WorkNexus 3D 오피스를 둘러보세요.
                  </p>
                  <a
                    href="https://worknexus.calamus.ai.kr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>워크넥서스 체험하기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4대 핵심 기능 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">{feat.title}</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

