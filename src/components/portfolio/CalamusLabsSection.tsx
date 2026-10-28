"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FlaskConical,
  Sparkles,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Zap,
  BookOpen,
  Play,
  AlertTriangle,
  HelpCircle,
  Layers,
  Award,
  Check
} from "lucide-react";
import CheerGuestbookSection from "@/components/common/CheerGuestbookSection";

const ceptPipelineSummary = [
  { step: "0단계", icon: "📄", title: "공개문제 보기", desc: "한국산업인력공단 공개문제 18과제 전체 문제지(1~11P) 넘김 뷰어 및 공식 도면 확대 대조", key: false },
  { step: "1단계", icon: "📐", title: "기구 배치 (400×420)", desc: "미송 제어판 치수선 제도 ➜ 단자대·MCCB·퓨즈·12P/8P 소켓 부착 ➜ 마스킹 테이프 이름표 & 단자 마킹", key: false },
  { step: "2단계", icon: "🟫", title: "주회로 결선", desc: "KEC 규정 색상(PE 녹황 최우선, L1 갈, L2 흑, L3 회) 상별 필터 및 단계별 결선 시연", key: false },
  { step: "3단계", icon: "🔢", title: "핀번호 · 그루핑", desc: "시퀀스 도면 모든 a·b·한시접점에 내부결선도 핀번호 기입 후 동일 전위를 ①~⑮ 색상 그룹으로 묶기", key: true },
  { step: "4단계", icon: "🟨", title: "보조회로 배선 · 벨테스터", desc: "그루핑 순서대로 황색선을 3가로·2세로 통로 규칙으로 결선, 방향 화살표·순번 뱃지 및 도통 시험", key: true },
  { step: "5단계", icon: "🚰", title: "배관 제도 · 새들 (1800×1600)", desc: "배전반 고정 ➜ 먹줄 제도 ➜ 새들 마킹(커버 대기법) ➜ 커넥터 접속 ➜ 파이프 밀착 재단 & PE·CD관 설치", key: false },
  { step: "6단계", icon: "🧵", title: "기구 장착 · 입선 · 결선", desc: "먼 쪽 기구부터 전선 입선 ➜ J박스 정션 경유 ➜ 박스 내 공통선 먼저·단독선 나중 결선 ➜ 뚜껑 결합", key: false },
  { step: "7단계", icon: "💡", title: "전원 투입 · 동작 테스트", desc: "MCCB ON 후 버튼(PB)·리밋스위치(LS)·FLS 직접 조작, 시퀀스 전류 흐름 및 램프·전동기 동작 판정", key: false }
];

const ceptProblems18 = [
  { no: "01", type: "급배수 제어", summary: "자동 FLS·X ➜ MC1 / 수동 T ➜ MC2, 트립 시 FR 경보 교대 점멸" },
  { no: "02", type: "급배수 교대", summary: "FLS·X·T 동작 후 플리커 릴레이(FR)로 MC1 ⇄ MC2 교대 운전" },
  { no: "03", type: "급수 교대", summary: "FLS 또는 T 조건 만족 시 X ➜ FR 작동 ➜ MC1 ⇄ MC2 교대 운전" },
  { no: "04", type: "급수 교대", summary: "FLS·PB1 입력 시 FR 교대(MC1 ⇄ MC2), 타이머(T)로 MC2 소자" },
  { no: "05", type: "교대 ➜ 동시", summary: "초기 FR 교대 운전 후 t초 경과 시 MC1·MC2 동시 운전 전환" },
  { no: "06", type: "동시 ➜ 교대", summary: "자동 모드 MC1·MC2 동시 운전 / 수동 모드 t초 후 FR 교대 운전" },
  { no: "07", type: "순차 반복", summary: "타이머 연동 순차 제어: ① M1 ➜ ② M2 ➜ ③ 정지 사이클 반복" },
  { no: "08", type: "동시 운전", summary: "자동 MC1·MC2 동시 기동·YL 점멸 / 수동 모드 t초 후 자동 정지" },
  { no: "09", type: "급수 지연", summary: "자동 FLS 시 MC1 기동 / 수동 PB1 시 MC1 기동 후 t초 뒤 MC2 기동" },
  { no: "10", type: "순차/인터록", summary: "듀얼 타이머(T1, T2) 및 듀얼 릴레이(X1, X2) 순차·인터록 제어" },
  { no: "11", type: "인터록 제어", summary: "PB1·T1 / PB2·T2 기동 조건 및 리밋스위치(LS1·LS2) 상호 인터록" },
  { no: "12", type: "순차 제어", summary: "X1·T1·MC1 선행 기동 ➜ X2·MC2 후행 기동, LS2·T2 조건 정지" },
  { no: "13", type: "순차 제어", summary: "PB1·LS1 ➜ X1·T1, LS2 ➜ MC1 / T1 한시 동작 후 X2·MC2·T2" },
  { no: "14", type: "조건 운전", summary: "LS1·LS2 조건 만족 후 PB1 ➜ MC1 / PB2 ➜ MC2 기동 및 한시 정지" },
  { no: "15", type: "조건 운전", summary: "LS 하나 동작 시 PB1 ➜ MC1 / LS 모두 동작 시 PB2 ➜ MC2 기동" },
  { no: "16", type: "타이머 제어", summary: "LS1·T1 조건 MC1 기동 / LS2·T2 조건 MC2 기동 및 백색등(WL) 점등" },
  { no: "17", type: "배타 운전", summary: "LS 하나만 ON 시 PB1 ➜ MC1 / T1 후 PB2 ➜ MC2 기동 및 WL 점등" },
  { no: "18", type: "선택 운전", summary: "LS1만 ON 시 PB1 ➜ MC1 / LS2만 ON 시 PB2 ➜ MC2, t초 후 WL" }
];

export default function CalamusLabsSection() {
  const [activeCeptTab, setActiveCeptTab] = useState<"pipeline" | "problems" | "checkpoints" | "ai-faq">("pipeline");

  const labProjects = [
    {
      id: "cept-electrician",
      badge: "100% 무료 공개 · 국가기술자격 실기 시뮬레이터",
      badgeColor: "bg-amber-950/90 text-amber-300 border-amber-500/50",
      title: "전기기능사 실기 인터랙티브 교육관 (CEPT)",
      tagline: "공개문제 18과제 7단계 따라하기 · 핀번호 그루핑 · 배관 · 동작 테스트",
      desc: "오프라인 실기 강의 수강 후 혼자 복습할 때 가장 헷갈리는 시퀀스 도면 핀번호 넘버링·그루핑, 보조회로 통로 결선, 1800×1600mm 벽면 배관·입선, 전원 투입 동작 테스트까지 눈으로 보며 단계별로 따라하는 무료 웹 학습 참고자료입니다.",
      features: [
        "한국산업인력공단 전기기능사 실기 공개문제 18과제(01~18번) 전 과정 수록",
        "기구 배치(400×420) ➜ 주회로 ➜ 핀번호·그루핑 ➜ 보조회로·벨테스터 ➜ 배관·입선 ➜ 동작 테스트 7단계 시연",
        "회원가입·설치 없이 크롬/엣지 브라우저에서 100% 무료 즉시 실행 (cept.calamus.ai.kr)"
      ],
      detailUrl: "/solutions/cept",
      detailLabel: "18과제 상세 가이드 보기",
      siteUrl: "https://cept.calamus.ai.kr/",
      introUrl: "https://cept.calamus.ai.kr/intro",
      siteLabel: "cept.calamus.ai.kr",
      borderHover: "hover:border-amber-500/60 hover:shadow-amber-950/30",
      iconBg: "bg-amber-950/80 text-amber-400 border-amber-500/40",
      icon: Zap,
      isFeatured: true
    },
    {
      id: "my-re-design",
      badge: "AI Lifestyle & Routine PWA",
      badgeColor: "bg-purple-950/80 text-purple-300 border-purple-500/40",
      title: "My Re Design & LUVIS",
      tagline: "초개인화 습관 형성 PWA & AI 가시성 진단",
      desc: "타이핑 없는 Zero UI 기반의 AI 일상 루틴 코칭 PWA 앱과, 생성형 AI(ChatGPT, Gemini) 시대의 의료/기업 추천 지분을 측정하는 AEO·GEO 가시성 분석 실험 모델입니다.",
      features: [
        "신체/마음/성장/재미 4각 밸런스 AI 데일리 미션",
        "설치 없이 모바일 홈 화면에 추가하는 반응형 PWA",
        "생성형 AI 추천 점유율(SOV) 정밀 관제 엔진"
      ],
      detailUrl: "/solutions/my-re-design",
      detailLabel: "가이드 보기",
      siteUrl: "https://myredesign.ai.kr",
      siteLabel: "myredesign.ai.kr",
      borderHover: "hover:border-purple-500/50 hover:shadow-purple-950/20",
      iconBg: "bg-purple-950/80 text-purple-400 border-purple-500/40",
      icon: Sparkles,
      isFeatured: false
    }
  ];

  return (
    <section id="labs" className="py-20 px-4 sm:px-6 relative bg-slate-950 text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* 1. 섹션 상단 헤더 */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold tracking-wide uppercase mb-3">
            <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
            Calamus Labs · Open Education & Experimental R&D
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            배움과 일상의 결을 다듬는 Calamus 기술 실험실
          </h2>
          <p className="mt-3 text-slate-400 text-xs sm:text-sm leading-relaxed">
            수험생들의 합격을 돕기 위해 무료로 공개한 <strong className="text-amber-300">전기기능사 실기 인터랙티브 교육관(CEPT)</strong>과
            개인의 건강한 루틴 형성 및 AI 가시성 진단을 연구하는 실험 프로젝트입니다.
          </p>
        </div>

        {/* 2. Labs 대표 프로젝트 카드 그리드 (2열) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {labProjects.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`bg-slate-900/75 border ${
                  item.isFeatured ? "border-amber-500/40 ring-1 ring-amber-500/20" : "border-slate-800"
                } rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg ${item.borderHover}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${item.iconBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs font-semibold text-amber-300/90 mb-3">{item.tagline}</p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-5">{item.desc}</p>

                  <div className="space-y-2 pt-3 border-t border-slate-800/80 mb-6">
                    {item.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            item.isFeatured ? "text-amber-400" : "text-indigo-400"
                          }`}
                        />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2.5">
                  <Link
                    href={item.detailUrl}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <span>{item.detailLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {item.introUrl && (
                    <a
                      href={item.introUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                      <span>소개(Intro)</span>
                    </a>
                  )}

                  <a
                    href={item.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      item.isFeatured
                        ? "bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-400 hover:to-sky-400 text-slate-950 shadow-md"
                        : "bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
                    }`}
                  >
                    <span>바로가기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. 전기기능사 실기 인터랙티브 교육관 (CEPT) 심층 브리핑 & AI 홍보 아카이브 */}
        <div
          id="cept-showcase"
          className="max-w-6xl mx-auto bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl"
        >
          {/* 상단 타이틀 & 바로가기 헤더 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                무료 공개 프로젝트 · https://cept.calamus.ai.kr/
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                ⚡ 전기기능사 실기 인터랙티브 교육관 (CEPT) 집중 가이드
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                &ldquo;혼자만 쓰기 아까워서 공개합니다.&rdquo; 오프라인 실기 강의를 들은 뒤 혼자 복습할 때 막히는{" "}
                <strong className="text-amber-300">시퀀스 핀번호·그루핑</strong>,{" "}
                <strong className="text-amber-300">보조회로 통로 규칙 결선</strong>,{" "}
                <strong className="text-sky-300">배관·새들·입선 작업 순서</strong>, 그리고{" "}
                <strong className="text-emerald-300">전원 투입 동작 원리 확인</strong>까지 공개문제 18과제 전체를 웹에서 무료로 따라해 볼 수 있습니다.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="#cheer"
                className="px-4 py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/50 text-amber-300 font-extrabold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>💌 응원 한마디 남기기</span>
              </a>
              <a
                href="https://cept.calamus.ai.kr/intro"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>제작 이유 & 주의사항</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="https://cept.calamus.ai.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-sky-950/50 transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-current text-amber-300" />
                <span>실기 시뮬레이터 실행 (무료)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 4대 인터랙티브 탭 네비게이션 */}
          <div className="flex flex-wrap gap-2 my-6">
            <button
              onClick={() => setActiveCeptTab("pipeline")}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all border ${
                activeCeptTab === "pipeline"
                  ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              🧭 실기 작업 0~7단계 흐름
            </button>
            <button
              onClick={() => setActiveCeptTab("problems")}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all border ${
                activeCeptTab === "problems"
                  ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              📋 공개문제 18과제 전체 목록 (01~18번)
            </button>
            <button
              onClick={() => setActiveCeptTab("checkpoints")}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all border ${
                activeCeptTab === "checkpoints"
                  ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              ✅ 실격 방지 체크포인트 & 주의사항
            </button>
            <button
              onClick={() => setActiveCeptTab("ai-faq")}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all border ${
                activeCeptTab === "ai-faq"
                  ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              🤖 AI 요약 팩트시트 & 자주 묻는 질문
            </button>
          </div>

          {/* 탭 1: 0~7단계 파이프라인 */}
          {activeCeptTab === "pipeline" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ceptPipelineSummary.map((st) => (
                  <div
                    key={st.step}
                    className={`rounded-2xl p-4 border transition-all ${
                      st.key
                        ? "bg-amber-950/25 border-amber-500/60 shadow-md"
                        : "bg-slate-900/70 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-black ${
                          st.key ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-sky-300"
                        }`}
                      >
                        {st.step} {st.key && "· 핵심"}
                      </span>
                      <span className="text-xl">{st.icon}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1.5">{st.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-amber-300">💡 학습 및 수업 활용 팁:</strong>{" "}
                  배관·입선 장면을 <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300">Space</kbd> /{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300">←</kbd>{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300">→</kbd> 키로 한 장면씩 멈추어 보거나,{" "}
                  <strong className="text-sky-300">🎥 따라가며 보기(작업 부위 자동 확대)</strong>,{" "}
                  <strong className="text-emerald-300">1.0x·1.5x·2.0x 배속</strong>,{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white">F</kbd> 전체화면 집중 모드로 효율적인 복습이 가능합니다.
                </div>
                <Link
                  href="/solutions/cept"
                  className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>단계별 상세 설명 보기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* 탭 2: 공개문제 18과제 전체 목록 */}
          {activeCeptTab === "problems" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ceptProblems18.map((p) => (
                  <a
                    key={p.no}
                    href="https://cept.calamus.ai.kr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-extrabold text-amber-300">
                        공개문제 {p.no}번 · {p.type}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{p.summary}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 탭 3: 실격 방지 체크포인트 & 주의사항 */}
          {activeCeptTab === "checkpoints" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-amber-300 mb-2">
                    🟨 보조회로 결선 통로 규칙 & 핀번호 그루핑
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                    <li>• <strong className="text-emerald-400">[O 통과]</strong> 가로는 위·가운데·아래 3개 통로, 세로는 양쪽 끝 통로만 사용하여 배선</li>
                    <li>• <strong className="text-rose-400">[X 실격]</strong> 기구와 기구 사이 틈새로 수직 관통 배선 시 실격 처리 주의</li>
                    <li>• <strong className="text-emerald-400">[O 통과]</strong> 위 ➜ 아래 한 방향 지그재그 결선 / <strong className="text-rose-400">[X 금지]</strong> 한 단자에 3가닥 체결 금지</li>
                    <li>• 도면에 두 번 나오는 동일 단자(예: EOCR 10번) 및 박스 안 공통선 처리 구간 사전 확인</li>
                  </ul>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-sky-300 mb-2">
                    🚰 배관 제도 · 새들 마킹 · 입선 순서
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                    <li>• 새들 위치 마킹 시 <strong>커버 대기법</strong> 활용 및 TB 단자대 쪽 커넥터 제외 규칙 숙지</li>
                    <li>• 파이프 커터 <strong>밀착 재단</strong>으로 PE관·CD관 치수 오차 방지</li>
                    <li>• 먼 쪽 기구부터 입선 및 J박스 정션 경유, <strong>박스 내 공통선 먼저 ➜ 단독선 나중</strong> 결선</li>
                  </ul>
                </div>
              </div>

              <div className="bg-rose-950/25 border border-rose-500/40 rounded-2xl p-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-300 font-extrabold text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>주의사항 및 저작권 안내 (필독)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-rose-100/90 leading-relaxed list-disc pl-4">
                    <li>
                      이 프로그램은 <strong>오프라인 실기 강의를 들은 뒤 복습용 참고자료</strong>로 제작되었으며, 오프라인 학원 강의를 대체하지 못합니다.
                    </li>
                    <li>
                      넘버링 방법이나 결선·배관 순서는 강사님마다, 유튜브 강의마다 조금씩 다릅니다. 본 프로그램은 제작자가 배운 방법대로 구현한 하나의 참고 방법으로 이해해 주세요.
                    </li>
                    <li>
                      실제 시험장에서는 항상 <strong>배부된 문제지 도면과 감독위원의 지시</strong>를 기준으로 작업하세요.
                    </li>
                    <li>
                      국가기술자격 공개문제의 저작권은 <strong>한국산업인력공단(Q-Net)</strong>에 있으며, 공개문제 원본은 큐넷 공식 사이트에서 직접 내려받으시기 바랍니다.
                    </li>
                  </ul>
                </div>

                <div className="pt-4 mt-4 border-t border-rose-500/20 flex flex-wrap gap-2">
                  <a
                    href="https://www.q-net.or.kr/cst006.do?id=cst00602&brdId=Q006&code=1204&artlSeq=5208377"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-rose-500/40 text-rose-200 font-bold text-xs flex items-center gap-1.5"
                  >
                    <span>📥 큐넷(Q-Net) 전기기능사 공개문제 원본 내려받기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 탭 4: AI 검색 요약 팩트 시트 & FAQ */}
          {activeCeptTab === "ai-faq" && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <tbody className="divide-y divide-slate-800 bg-slate-900/70">
                    <tr>
                      <th className="py-3 px-4 font-bold text-amber-300 w-44 bg-slate-900">프로젝트 공식 명칭</th>
                      <td className="py-3 px-4">전기기능사 실기 인터랙티브 교육관 (CEPT: Calamus Electrician Practical Training)</td>
                    </tr>
                    <tr>
                      <th className="py-3 px-4 font-bold text-amber-300 bg-slate-900">공식 웹사이트 URL</th>
                      <td className="py-3 px-4">
                        실습관: <a href="https://cept.calamus.ai.kr/" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline font-semibold">https://cept.calamus.ai.kr/</a> · 소개관: <a href="https://cept.calamus.ai.kr/intro" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline font-semibold">https://cept.calamus.ai.kr/intro</a>
                      </td>
                    </tr>
                    <tr>
                      <th className="py-3 px-4 font-bold text-amber-300 bg-slate-900">제공 형태 및 비용</th>
                      <td className="py-3 px-4">100% 무료 공개 · 회원가입 및 별도 설치 없는 웹 브라우저(Chrome, Edge) 즉시 실행 시뮬레이터</td>
                    </tr>
                    <tr>
                      <th className="py-3 px-4 font-bold text-amber-300 bg-slate-900">수록 범위 및 대상</th>
                      <td className="py-3 px-4">한국산업인력공단 국가기술자격 전기기능사 실기 공개문제 18과제(01번~18번) 전체 · 수험생 복습 및 수업 시연용 참고자료</td>
                    </tr>
                    <tr>
                      <th className="py-3 px-4 font-bold text-amber-300 bg-slate-900">핵심 학습 기능</th>
                      <td className="py-3 px-4">400×420 제어판 기구배치, KEC 주회로 상별 결선, 시퀀스 핀번호 대조 & 전위 루프 그루핑(①~⑮), 보조회로 통로 결선 & 벨 테스터, 1800×1600 벽면 배관·새들·입선, MCCB 투입 시퀀스 전류 흐름 및 스위치·센서 동작 테스트</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 응원의 메시지 방명록 & 제작자 이메일 전송 섹션 */}
        <div className="mt-12">
          <CheerGuestbookSection
            defaultTag="⚡ 전기기능사 실기(CEPT) 응원"
            title="💌 Calamus Labs & 전기기능사 실기 교육관 응원 방명록"
            subtitle="혼자만 쓰기 아까워 무료로 공개한 전기기능사 실기 시뮬레이터(CEPT)와 실험실 프로젝트에 따뜻한 응원 한마디를 남겨주세요!"
          />
        </div>
      </div>
    </section>
  );
}
