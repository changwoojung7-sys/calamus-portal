"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Cpu,
  Globe2,
  ArrowRight,
  ShieldCheck,
  Feather,
  Radio,
  History,
  Lock,
  HeartHandshake,
  Compass,
  CheckCircle2
} from "lucide-react";

export default function CompanyIntro() {
  const [lang, setLang] = useState<"ko" | "en">("ko");

  const milestones = [
    {
      period: "1990s",
      title: "유니텔 PC통신 & 첫 이메일 'Calamus'",
      desc: "전화선 모뎀 소리와 푸른 터미널 화면 속, 텍스트로 세상과 처음 연결되던 시절 창업자가 만든 첫 이메일 아이디 'calamus'. 사람과 사람이 온라인에서 만나 일을 나누는 모든 여정이 여기서 시작되었습니다."
    },
    {
      period: "2000s - 2010s",
      title: "웹과 클라우드, 엔터프라이즈 아키텍처",
      desc: "인터넷과 모바일의 급격한 팽창기 속에서 대규모 데이터 파이프라인과 비즈니스 인프라를 설계하며, 기술의 본질은 언제나 '사람의 시간을 아끼고 가치를 이어주는 것'임을 체득했습니다."
    },
    {
      period: "Present & Future",
      title: "Calamus 2대 솔루션 & Labs 혁신",
      desc: "온프레미스 3D 가상오피스 'WorkNexus'로 공간의 장벽을 지우고, 지능형 헬스케어 포털 '온안부'로 의료 정보의 격차를 허뭅니다. 30년간 지켜온 갈대의 정신이 오늘날 가장 견고한 소프트웨어로 구현됩니다."
    }
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white">
      {/* 백그라운드 오로라 앰비언트 글로우 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-indigo-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* 언어 토글 스위처 & 배지 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide uppercase shadow-sm">
            <Feather className="w-3.5 h-3.5 text-emerald-400" />
            Brand Philosophy & Founder's Story
          </div>

          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setLang("ko")}
              className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all ${
                lang === "ko"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              한국어 (KR)
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all ${
                lang === "en"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              English (EN)
            </button>
          </div>
        </div>

        {/* 1. 국문 스토리 버전 */}
        {lang === "ko" && (
          <div className="space-y-16 animate-fadeIn">
            {/* 타이틀 헤더 */}
            <div className="max-w-3xl">
              <span className="text-emerald-400 font-semibold text-sm tracking-widest uppercase">
                About Calamus
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-2 text-white leading-tight">
                글과 목소리를 잇는 갈대, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Calamus가 걸어온 길
                </span>
              </h2>
            </div>

            {/* 창업자 스토리 메인 에세이 카드 */}
            <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-12 shadow-2xl backdrop-blur-md">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
                  <div className="border-l-2 border-emerald-500 pl-4 py-1">
                    <p className="text-emerald-300 font-semibold text-base sm:text-lg italic">
                      "Calamus는 라틴어로 갈대를 뜻합니다. 옛사람들은 갈대로 펜을 깎아 글을 쓰고, 피리를 만들어 소리를 전했습니다."
                    </p>
                  </div>

                  <p>
                    인류가 시공간의 벽을 넘어 서로의 생각과 감정을 연결하기 위해 처음 손에 쥐었던 도구, 그것이 바로 갈대였습니다.
                    이 이름은 1990년대, 전화선 모뎀 비프음이 방 안을 울리던 <strong className="text-white">PC통신 유니텔 시절 창업자가 처음 만든 이메일 주소</strong>이기도 합니다.
                  </p>

                  <p>
                    푸른 터미널 화면 속에서 밤을 지새우며 사람을 만나고, 협업하고, 기술을 나누었던 그 첫 설렘부터 지금까지
                    지난 30여 년간 온라인에서 이루어진 모든 만남과 비즈니스의 순간을 늘 이 이름과 함께했습니다.
                  </p>

                  <p className="text-white font-medium">
                    이제 그 오랜 경험과 사람 중심의 철학을 담아, <strong>떨어져 있어도 같은 공간에서 일하고 숨 쉬는 것처럼 자연스럽게 연결되는 솔루션</strong>을 만듭니다.
                  </p>
                </div>

                <div className="lg:col-span-4 bg-slate-950/60 rounded-2xl p-6 border border-slate-800/80 space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <History className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Heritage & Identity</span>
                  </div>
                  <h4 className="text-base font-bold text-white">30년간 이어온 소통의 이름</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    1990s 유니텔 모뎀의 첫 이메일에서 시작하여, 2026년 온프레미스 3D 가상오피스와 지능형 의료 AI까지 끊임없이 진화해 온 연결의 도구입니다.
                  </p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Since PC 통신 Unitel</span>
                    <span className="text-emerald-400 font-semibold">Calamus Portal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 30년 히스토리 타임라인 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-sm"
                >
                  <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/30">
                    {m.period}
                  </span>
                  <h4 className="text-base font-bold text-white mt-4 mb-2">{m.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>

            {/* 3대 핵심 철학 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">사람 중심의 연결 (Human-Centric)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  기술을 위한 기술이 아닌, 떨어져 있어도 서로의 온기와 소통을 그대로 느낄 수 있는 도구를 빚어냅니다.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400 mb-4">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">완벽한 데이터 주권 (Data Sovereignty)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  사내 완결형 온프레미스 인프라를 통해 기업의 가장 소중한 지적 자산과 대화 기록을 외부에 남기지 않습니다.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">투명하고 정직한 정보 (Open Transparency)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  공공 보건의료 데이터를 정제하여 정보의 비대칭을 없애고, 환자와 의료기관이 신뢰로 만날 수 있도록 돕습니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. 영문 스토리 버전 (Global Version) */}
        {lang === "en" && (
          <div className="space-y-16 animate-fadeIn">
            {/* 타이틀 헤더 */}
            <div className="max-w-3xl">
              <span className="text-emerald-400 font-semibold text-sm tracking-widest uppercase">
                About Calamus
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-2 text-white leading-tight">
                The Reed That Carried <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Words and Voices
                </span>
              </h2>
            </div>

            {/* 영문 스토리 에세이 카드 */}
            <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-12 shadow-2xl backdrop-blur-md">
              <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
                <div className="border-l-2 border-emerald-500 pl-4 py-1">
                  <p className="text-emerald-300 font-semibold text-base sm:text-lg italic">
                    "In Latin, calamus means reed. Long ago, people cut reeds into pens to write and into pipes to make sound. Like those first tools of human connection, we build ways for people to work together, wherever they are."
                  </p>
                </div>

                <p>
                  This name was also the very first email address created by our founder in the 1990s, during the era of dial-up PC networks like Unitel. From those flickering terminal screens to today's cloud computing, WebRTC media servers, and artificial intelligence, every step of meeting people, collaborating on projects, and building businesses has been guided by this name.
                </p>

                <p>
                  Now, bringing thirty years of software experience and a human-centric philosophy together, Calamus creates software that connects people across any physical divide—as if sharing the exact same room.
                </p>
              </div>
            </div>

            {/* 영문 핵심 2대 축 소개 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-7 space-y-3">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  FLAGSHIP 01
                </span>
                <h4 className="text-xl font-bold text-white">Calamus WorkNexus</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  An on-premise, 3D virtual office driven by a single in-house server. Zero per-seat recurring fees, zero cloud leak, and complete data sovereignty with LiveKit SFU media streaming and spatial audio.
                </p>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-7 space-y-3">
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/30">
                  FLAGSHIP 02
                </span>
                <h4 className="text-xl font-bold text-white">OnAnBu (Healthcare Portal)</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  An intelligent medical information and hospital discovery portal powered by HIRA official healthcare big data, delivering AI-assisted healthcare consultation and nearby specialized clinic navigation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
