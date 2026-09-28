"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Server,
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  Users,
  Volume2,
  Monitor,
  Building,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Lock,
  Headphones
} from "lucide-react";

export default function WorkNexusSection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const previewImages = [
    {
      label: "워크넥서스 솔루션 특징",
      src: "/images/solutions/worknexus/solution-overview.png",
      desc: "독립형 3D 가상 오피스 솔루션 구성 및 엔터프라이즈 올인원 협업 특징"
    },
    {
      label: "오피스 업무 뷰",
      src: "/images/solutions/worknexus/office-view.png",
      desc: "로그인 후 실시간 부서별 자리배치와 상태 동기화"
    },
    {
      label: "100석 대회의실 / 타운홀",
      src: "/images/solutions/worknexus/meeting-room.png",
      desc: "전사 세미나 및 100인 수용 발표 무대 (발표자/청중 분리)"
    },
    {
      label: "근거리 공간 음향 (Spatial Audio)",
      src: "/images/solutions/worknexus/spatial-audio.png",
      desc: "동료 아바타에게 다가가면 자연스럽게 목소리가 들리는 거리 기반 음성"
    },
    {
      label: "화면 공유 & 화상회의",
      src: "/images/solutions/worknexus/screen-share.png",
      desc: "방 단위로 완전 격리된 LiveKit SFU 고화질 화면 공유"
    }
  ];

  const threeNoPrinciples = [
    {
      title: "인당 월 구독료 0원",
      en: "Zero SaaS Subscriptions",
      desc: "임직원 수가 10명이든 1,000명이든 추가 과금 없이 사내 서버에서 무제한 운영합니다.",
      icon: DollarSign,
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/40"
    },
    {
      title: "클라우드 비용 0원",
      en: "Zero Cloud Overhead",
      desc: "외부 AWS/Azure 등 매월 누적되는 고정 인프라 비용 없이 자체 서버 1대로 완결됩니다.",
      icon: Server,
      color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/40"
    },
    {
      title: "데이터 외부 유출 0%",
      en: "100% Data Sovereignty",
      desc: "화상 미디어, 대화 기록, 근태 정보 등 모든 지적 자산이 사내망 내부에 안전하게 격리됩니다.",
      icon: Lock,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/40"
    }
  ];

  const coreFeatures = [
    {
      icon: ShieldCheck,
      title: "100% 사내 LiveKit SFU 미디어 단일화",
      desc: "사용자 IP 노출 및 기업 방화벽 차단 문제가 있던 P2P를 완전 제거. 모든 음성/화상이 사내 LiveKit SFU 서버로만 암호화 중계됩니다."
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
      title: "Windows 네이티브 무설치 웹 접속",
      desc: "Docker나 복잡한 가상화 없이 Windows 환경에서 단일 실행 파일로 즉시 가동. 임직원은 크롬/엣지 브라우저로 클릭 즉시 접속합니다."
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
              외부 SaaS 플랫폼을 임대하는 시대는 끝났습니다. 사내망 서버 1대로 인당 구독료 0원, 
              데이터 유출 걱정 없는 완벽한 하이브리드 워크스페이스를 영구 구축하세요.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://virtual-office.calamus.ai.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-purple-950/50 transition-all hover:scale-105"
            >
              <span>WorkNexus 솔루션 체험하기</span>
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

        {/* 인터랙티브 쇼케이스 뷰어 (탭 + 이미지 프리뷰) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-16 shadow-2xl backdrop-blur-md">
          <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800/80 pb-4">
            {previewImages.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === idx
                    ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                    : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 고화질 스크린샷 영역 */}
            <div className="lg:col-span-8 relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group">
              <Image
                src={previewImages[activeTab].src}
                alt={previewImages[activeTab].label}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/60">
                <span className="font-bold text-purple-400">💡 {previewImages[activeTab].label}:</span> {previewImages[activeTab].desc}
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
                  href="https://virtual-office.calamus.ai.kr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>가상 오피스 접속하기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
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
