"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Zap,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Cpu,
  Wrench,
  Play,
  AlertTriangle,
  Sparkles,
  Layers,
  Search,
  Award,
  Check,
  XCircle,
  HelpCircle,
  Monitor,
  Compass,
  FileText,
  ArrowRight
} from "lucide-react";
import Footer from "@/components/common/Footer";

// 0단계 ~ 7단계 실기 작업 파이프라인 데이터
const pipelineStages = [
  {
    step: 0,
    badge: "Step 0",
    icon: "📄",
    title: "공개문제 보기 (공식 도면 1~11P)",
    highlight: false,
    summary: "문제지 전체 페이지를 넘겨 보며 과제 요구사항·배관도·시퀀스도 확인",
    details: [
      "한국산업인력공단 공개문제 18과제 전체 문제지 도면 페이지 넘김 뷰어 제공",
      "제어판 내부 기구 배치도, 시퀀스 회로도, 배관 및 기구 배치도 원본 고화질 확대 보기",
      "좌우 분할선(Splitter) 드래그로 공식 도면과 우측 작업 시뮬레이터 화면 비율 자유 조절"
    ]
  },
  {
    step: 1,
    badge: "Step 1",
    icon: "📐",
    title: "기구 배치 (400×420mm 제어판)",
    highlight: false,
    summary: "400×420mm 미송 제어판에 단자대·차단기·퓨즈·소켓을 배치도 치수대로 부착",
    details: [
      "1. 치수선 긋기: 도면 치수에 맞춘 가로·세로 중심선 및 기구 배치 기준선 제도",
      "2. 기구 부착: 상·하단 단자대(TB5, TB6), 차단기(MCCB), 퓨즈 홀더, 12P 소켓(EOCR, MC1, MC2), 8P 소켓(X, FR, T, FLS) 홈 방향 확인 후 고정",
      "3. 기구 이름표 & 4. 단자대 핀 마킹: 마스킹 종이테이프에 기구 명칭 및 배관도 연동 외부 인출 단자번호 주기"
    ]
  },
  {
    step: 2,
    badge: "Step 2",
    icon: "🟫",
    title: "주회로 결선 (KEC 규정 전선 색상)",
    highlight: false,
    summary: "녹황(PE)·갈(L1)·흑(L2)·회(L3) 전선색 규정 준수, 보호도체(PE) 최우선 결선",
    details: [
      "1순위 PE(녹황색) 접지선 결선 후 TB1 ➜ MCCB 1차 ➜ EOCR ➜ 퓨즈 1차 분기 ➜ MC1·MC2 ➜ TB2·TB3 모터 단자 순차 결선",
      "상별 필터 기능 탑재: 전체 / PE(녹황) / L1(갈색) / L2(흑색) / L3(회색) 상별로 배선 경로를 분리해 명확히 관찰",
      "주회로 결선 누락 및 상 바뀜(오결선) 실수를 시각적 컬러 코딩으로 사전 예방"
    ]
  },
  {
    step: 3,
    badge: "Step 3 · 핵심",
    icon: "🔢",
    title: "핀번호 & 그루핑 (Numbering & Grouping)",
    highlight: true,
    summary: "시퀀스 도면 모든 접점에 핀번호를 적고, 같은 전위를 ①②③… 색상 그룹으로 묶기",
    details: [
      "시퀀스 회로도의 모든 전원부, a접점, b접점, 한시접점을 기구 내부결선도(EOCR, MC, X, FR, T, FLS)와 1:1 대조하여 핀번호 기입",
      "같은 전위(동일 연결 구간)끼리 같은 색상과 원형 번호(①~⑮ 등)로 묶는 그루핑(Grouping) 시연",
      "도면에 두 번 이상 등장하는 동일 단자(예: EOCR 10번 공통) 및 컨트롤박스 내부 공통선 처리 구간 명확 표시"
    ]
  },
  {
    step: 4,
    badge: "Step 4 · 핵심",
    icon: "🟨",
    title: "보조회로 배선 & 벨 테스터 도통 시험",
    highlight: true,
    summary: "그루핑 순서대로 황색선을 통로 규칙에 맞춰 결선하고 벨 테스터로 도통 확인",
    details: [
      "FLS(7·8·1번) 및 전위 루프 ①번부터 ⑮번까지 칩을 클릭하며 그룹별 배선 경로를 단계별로 추적",
      "실격 방지 통로 규칙 준수: 가로는 위·가운데·아래 3개 통로, 세로는 양쪽 끝 통로만 사용(기구 사이 수직 관통 배선 금지)",
      "위 ➜ 아래 한 방향 지그재그 결선(한 단자 3가닥 체결 금지), 진행 방향 화살표·순번 뱃지 및 🔔 벨 테스터 도통 시험 지원"
    ]
  },
  {
    step: 5,
    badge: "Step 5",
    icon: "🚰",
    title: "배관 제도 & 새들 (1800×1600mm 벽면)",
    highlight: false,
    summary: "먹줄 제도 ➜ 새들 마킹(커버 대기법) ➜ 커넥터 접속 ➜ 밀착 재단 ➜ PE·CD관 설치",
    details: [
      "1800×1600mm 실기 시험장 벽면 합판 위에서 제어판(배전반) 고정 및 수평선·배관선 먹줄 긋기",
      "외부단자 & 새들 위치 마킹(커버 대기법), 외부기구(단자대 4개·정션박스 1개·컨트롤박스 4개 등) 고정 및 새들 1차 고정",
      "PE관·CD관 커넥터 접속(TB 단자대 쪽 커넥터 제외 규칙 반영), 파이프 커터 밀착 재단 및 케이블 장착 자동 시연"
    ]
  },
  {
    step: 6,
    badge: "Step 6",
    icon: "🧵",
    title: "기구 장착 & 입선 · 결선",
    highlight: false,
    summary: "외부단자 가조립 ➜ 먼 쪽부터 전선 입선 ➜ J박스 정션 ➜ 공통선 먼저 결선 ➜ 뚜껑 결합",
    details: [
      "제어판에서 먼 쪽 기구부터 전선을 입선하고 중앙 정션박스(J-Box)를 경유하는 실전 입선 순서 재현",
      "전선 탈피 후 푸시버튼(PB)·램프(RL/GL/YL/WL)·셀렉터 스위치(SS) 박스 내 공통선 먼저 결선 후 단독선 결선",
      "🎥 따라가며 보기(Auto-Follow Zoom) 모드로 현재 입선·결선 중인 기구 부위를 자동 확대 추적"
    ]
  },
  {
    step: 7,
    badge: "Step 7",
    icon: "💡",
    title: "전원 투입 & 시퀀스 동작 테스트",
    highlight: false,
    summary: "MCCB ON ➜ 버튼·리밋스위치·센서 조작 ➜ 램프 점등·전동기 회전을 문제지와 비교 판정",
    details: [
      "문제지 '제어회로의 동작 사항'을 단계별로 자동 테스트하거나 사용자가 직접 버튼(PB1/PB2)·리밋스위치(LS1/LS2)·FLS·EOCR을 클릭 조작",
      "시퀀스 회로도 위에서 실시간으로 흐르는 전류 경로 애니메이션과 릴레이·타이머 카운트다운 동작 확인",
      "적색등(RL)·녹색등(GL)·황색등(YL)·백색등(WL)·부저(BZ) 및 전동기(M1/M2) 운전 상태를 시각적으로 즉시 검증"
    ]
  }
];

// 전기기능사 실기 공개문제 18과제 전체 목록
const publicProblems18 = [
  { no: "01", category: "급배수 제어", title: "공개문제 01번", spec: "자동 FLS·X ➜ MC1 / 수동 T ➜ MC2, EOCR 트립 시 FR 경보 교대 점멸", devices: "EOCR, MC1, MC2, X, FR, T, FLS" },
  { no: "02", category: "급배수 교대", title: "공개문제 02번", spec: "FLS·X·T 동작 후 플리커 릴레이(FR)에 의해 MC1 ⇄ MC2 교대 운전", devices: "EOCR, MC1, MC2, X, FR, T, FLS" },
  { no: "03", category: "급수 교대", title: "공개문제 03번", spec: "FLS 또는 타이머(T) 조건 만족 시 X 여자 ➜ FR 작동 ➜ MC1 ⇄ MC2 교대 운전", devices: "EOCR, MC1, MC2, X, FR, T, FLS" },
  { no: "04", category: "급수 교대", title: "공개문제 04번", spec: "FLS·PB1 입력 시 FR 교대(MC1 ⇄ MC2), 설정 시간(T) 후 MC2 소자 제어", devices: "EOCR, MC1, MC2, X, FR, T, FLS" },
  { no: "05", category: "교대 ➜ 동시", title: "공개문제 05번", spec: "초기 FR에 의해 교대 운전 후 타이머(t초) 경과 시 MC1·MC2 동시 운전 전환", devices: "EOCR, MC1, MC2, X, FR, T, FLS" },
  { no: "06", category: "동시 ➜ 교대", title: "공개문제 06번", spec: "자동 모드 시 MC1·MC2 동시 운전 / 수동 모드 시 t초 후 FR 교대 운전", devices: "EOCR, MC1, MC2, X, FR, T, FLS" },
  { no: "07", category: "순차 반복", title: "공개문제 07번", spec: "타이머 연동 순차 제어: ① M1 기동 ➜ ② M2 기동 ➜ ③ 정지 사이클 반복", devices: "EOCR, MC1, MC2, X, T1, T2, FLS" },
  { no: "08", category: "동시 운전", title: "공개문제 08번", spec: "자동 모드 MC1·MC2 동시 기동 및 YL 점멸 / 수동 모드 t초 후 자동 정지", devices: "EOCR, MC1, MC2, X, FR, T, FLS" },
  { no: "09", category: "급수 지연", title: "공개문제 09번", spec: "자동 FLS 감지 시 MC1 단독 기동 / 수동 PB1 입력 시 MC1 기동 후 t초 뒤 MC2 추가 기동", devices: "EOCR, MC1, MC2, X, FR, T, FLS" },
  { no: "10", category: "순차/인터록", title: "공개문제 10번", spec: "듀얼 릴레이(X1, X2) 및 듀얼 타이머(T1, T2) 기반 정역·순차 인터록 회로", devices: "EOCR, MC1, MC2, X1, X2, T1, T2" },
  { no: "11", category: "인터록 제어", title: "공개문제 11번", spec: "PB1·T1 및 PB2·T2 기동 조건과 리밋스위치(LS1·LS2) 연동 상호 인터록 운전", devices: "EOCR, MC1, MC2, X1, X2, T1, T2, LS1, LS2" },
  { no: "12", category: "순차 제어", title: "공개문제 12번", spec: "X1·T1·MC1 선행 기동 ➜ X2·MC2 후행 기동, LS2·T2 조건 정지 제어", devices: "EOCR, MC1, MC2, X1, X2, T1, T2, LS1, LS2" },
  { no: "13", category: "순차 제어", title: "공개문제 13번", spec: "PB1·LS1 조건으로 X1·T1 여자 및 LS2로 MC1 기동 / T1 한시 동작 후 X2·MC2·T2 운전", devices: "EOCR, MC1, MC2, X1, X2, T1, T2, LS1, LS2" },
  { no: "14", category: "조건 운전", title: "공개문제 14번", spec: "LS1·LS2 조건 만족 후 PB1 입력 시 MC1, PB2 입력 시 MC2 기동 및 한시 정지", devices: "EOCR, MC1, MC2, X1, X2, T1, T2, LS1, LS2" },
  { no: "15", category: "조건 운전", title: "공개문제 15번", spec: "LS 중 하나 동작 시 PB1으로 MC1 기동 / LS 모두 동작 시 PB2로 MC2 기동", devices: "EOCR, MC1, MC2, X1, X2, T1, T2, LS1, LS2" },
  { no: "16", category: "타이머 제어", title: "공개문제 16번", spec: "LS1·T1 조건으로 MC1 제어 / LS2·T2 조건으로 MC2 및 백색등(WL) 점등 제어", devices: "EOCR, MC1, MC2, X1, X2, T1, T2, LS1, LS2" },
  { no: "17", category: "배타 운전", title: "공개문제 17번", spec: "LS 하나만 ON일 때 PB1 ➜ MC1 기동 / T1 경과 후 PB2 ➜ MC2 기동 및 WL 점등", devices: "EOCR, MC1, MC2, X1, X2, T1, T2, LS1, LS2" },
  { no: "18", category: "선택 운전", title: "공개문제 18번", spec: "LS1만 ON 시 PB1 ➜ MC1 / LS2만 ON 시 PB2 ➜ MC2 기동, t초 후 WL 점등", devices: "EOCR, MC1, MC2, X1, X2, T1, T2, LS1, LS2" }
];

// AEO / GEO 최적화 FAQ
const ceptFaqs = [
  {
    q: "전기기능사 실기 인터랙티브 교육관(CEPT)은 무료인가요? 어떻게 접속하나요?",
    a: "네, 100% 무료로 공개된 웹 기반 학습 참고자료입니다. 별도의 프로그램 설치나 회원가입 없이 PC·태블릿 웹 브라우저(크롬·엣지 권장)에서 https://cept.calamus.ai.kr/ 에 접속하면 즉시 전기기능사 실기 공개문제 18과제 전체를 실습하고 복습할 수 있습니다."
  },
  {
    q: "전기기능사 실기 독학·복습 시 가장 많이 틀리는 '핀번호 넘버링'과 '보조회로 그루핑'을 어떻게 연습할 수 있나요?",
    a: "CEPT의 3단계(핀번호 & 그루핑)와 4단계(보조회로 배선)에서 시퀀스 회로도의 모든 a접점·b접점을 기구 내부결선도와 대조해 핀번호를 기입하고, 같은 전위끼리 동일한 색상 그룹(①~⑮)으로 묶는 전 과정을 단계별 애니메이션으로 보여줍니다. 또한 그룹 번호 칩을 하나씩 클릭하며 황색 보조회로 전선이 어느 통로로 지나가는지, 진행 방향 화살표와 단자 체결 순번까지 한눈에 확인할 수 있습니다."
  },
  {
    q: "실기 시험장에서 실격되기 쉬운 보조회로 배선 및 배관 규칙도 확인할 수 있나요?",
    a: "네. 보조회로 배선 시 기구와 기구 사이 틈새로 수직 관통 배선하면 실격되는 규정(가로 3통로·세로 양끝 2통로 원칙), 한 단자에 3가닥 이상 접속 금지(위에서 아래로 한 방향 지그재그 결선), 배관 작업 시 새들 위치 마킹(커버 대기법), TB 단자대 측 커넥터 생략, 파이프 커터 밀착 재단, 먼 쪽 기구부터 입선 후 박스 내 공통선 먼저 결선하는 실전 노하우가 단계마다 반영되어 있습니다."
  },
  {
    q: "결선이 끝난 뒤 회로가 정상 동작하는지 직접 스위치를 눌러보며 테스트할 수 있나요?",
    a: "네. 4단계에서 '벨 테스터(도통 시험)'로 결선 상태를 점검할 수 있고, 7단계(전원 투입 & 동작 테스트)에서는 MCCB 차단기를 올린 뒤 푸시버튼(PB1, PB2), 리밋스위치(LS1, LS2), 플로트리스 스위치(FLS), EOCR 테스트 버튼을 마우스로 직접 조작하며 시퀀스 도면의 실시간 전류 흐름과 램프(RL, GL, YL, WL)·전동기(M1, M2) 동작을 공개문제 동작 사항과 1:1로 비교 검증할 수 있습니다."
  }
];

export default function CeptSolutionPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", "급배수/급수(01~09번)", "순차/인터록/조건(10~18번)"];

  const filteredProblems = publicProblems18.filter((p) => {
    if (selectedCategory === "ALL") return true;
    const num = parseInt(p.no, 10);
    if (selectedCategory === "급배수/급수(01~09번)") return num >= 1 && num <= 9;
    return num >= 10 && num <= 18;
  });

  // AEO / GEO JSON-LD 구조화 데이터
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["WebApplication", "LearningResource"],
        "@id": "https://cept.calamus.ai.kr/#webapp",
        "name": "전기기능사 실기 인터랙티브 교육관 (CEPT)",
        "alternateName": ["Calamus Electrician Practical Training", "전기기능사 실기 따라하기 시뮬레이터", "전기기능사 실기 공개문제 18과제 연습"],
        "url": "https://cept.calamus.ai.kr/",
        "applicationCategory": "EducationalApplication",
        "educationalUse": ["Practice", "Self-Study", "Review", "Simulation"],
        "learningResourceType": "Interactive Simulation",
        "operatingSystem": "Web Browser (Chrome, Edge, Safari)",
        "isAccessibleForFree": true,
        "inLanguage": "ko-KR",
        "Creator": {
          "@type": "Organization",
          "name": "Calamus",
          "url": "https://calamus.ai.kr"
        },
        "description": "한국산업인력공단 국가기술자격 전기기능사 실기 공개문제 18과제(01번~18번) 전 과정을 기구 배치(400×420), 주회로 결선, 시퀀스 도면 핀번호·그루핑, 보조회로 배선(벨 테스터), 벽면 배관·새들(1800×1600), 입선·결선, 전원 투입 동작 테스트까지 7단계로 눈으로 보며 따라하는 무료 웹 인터랙티브 시뮬레이터.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "KRW",
          "description": "전체 수험생 무료 공개 (무설치 웹 브라우저 즉시 실행)"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://calamus.ai.kr/solutions/cept#faq",
        "mainEntity": ceptFaqs.map((item) => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 배경 그라데이션 */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1e293b,_#020617_70%)] -z-10" />
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 via-sky-400 to-transparent z-50 opacity-80" />

      {/* GNB 상단 헤더 */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/labs"
              className="flex items-center gap-2 text-slate-300 hover:text-amber-300 transition-colors text-sm font-semibold group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-amber-400" />
              <span>Calamus Labs로 돌아가기</span>
            </Link>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <Link
              href="/"
              className="hidden sm:inline text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Calamus 포털 홈
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              100% 무료 공개 교육 프로젝트
            </span>
            <a
              href="https://cept.calamus.ai.kr/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>소개 페이지</span>
            </a>
            <a
              href="https://cept.calamus.ai.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-sky-600 hover:from-amber-400 hover:to-sky-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/40 transition-all hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>실기 교육관 바로 실행</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-20">
        {/* 1. Hero 섹션 */}
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-extrabold mb-6">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Calamus Labs Open Education · 전기기능사 실기 공개문제 18과제 완벽 마스터
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            전기기능사 실기 시험 따라하기, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-sky-400">
              눈으로 보며 복습하는 인터랙티브 교육관 (CEPT)
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
            오프라인 실기 강의를 들을 때는 다 알 것 같지만 막상 혼자 연습하면 헷갈리는{" "}
            <strong className="text-amber-300">시퀀스 도면 핀번호·그루핑</strong>,{" "}
            <strong className="text-amber-300">보조회로 통로 규칙 결선</strong>,{" "}
            <strong className="text-sky-300">1800×1600mm 벽면 배관·입선 순서</strong>, 그리고{" "}
            <strong className="text-emerald-300">전원 투입 동작 테스트</strong>까지 — 한국산업인력공단 공개문제{" "}
            <strong className="text-white">18과제(01~18번) 전 과정</strong>을 브라우저에서 무료로 따라하며 완벽히 복습하세요.
          </p>

          {/* 주요 실행 버튼 */}
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <a
              href="https://cept.calamus.ai.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-sky-950/60 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current text-amber-300" />
              <span>전기기능사 실기 시뮬레이터 시작하기 (무료)</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href="https://cept.calamus.ai.kr/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>제작 배경 & 사용 가이드 (intro)</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* 핵심 요약 스펙 배지 */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium">수록 과제 수</div>
              <div className="text-lg sm:text-xl font-black text-amber-400 mt-0.5">공개문제 18과제 전체</div>
              <div className="text-[11px] text-slate-400 mt-1">01번 급배수 ~ 18번 선택 운전</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium">단계별 공정 시연</div>
              <div className="text-lg sm:text-xl font-black text-sky-400 mt-0.5">0단계 ~ 7단계 완비</div>
              <div className="text-[11px] text-slate-400 mt-1">기구배치·결선·배관·동작테스트</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium">핵심 특화 기능</div>
              <div className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">핀번호 · 그루핑 · 벨테스터</div>
              <div className="text-[11px] text-slate-400 mt-1">전위 루프별 배선 & 실시간 전류흐름</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="text-xs text-slate-400 font-medium">이용 비용 및 환경</div>
              <div className="text-lg sm:text-xl font-black text-purple-400 mt-0.5">100% 무료 · 무설치 웹</div>
              <div className="text-[11px] text-slate-400 mt-1">크롬·엣지 브라우저 즉시 실행</div>
            </div>
          </div>
        </section>

        {/* 2. 제작 목적 4대 핵심 포인트 ("혼자만 쓰기 아까워서 공개합니다") */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Why We Built CEPT (제작 이유 및 목적)
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                &ldquo;혼자만 쓰기 아까워서 모든 수험생분들께 무료로 공개합니다&rdquo;
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                전기기능사 실기는 학원 오프라인 강의를 들을 때는 이해가 잘 되지만, 혼자 도면을 펴놓고 다시 연습하려 하면{" "}
                <strong className="text-amber-300">&ldquo;이 접점이 몇 번 핀이었지?&rdquo;</strong>,{" "}
                <strong className="text-amber-300">&ldquo;이 황색선은 어느 통로를 타고 어디로 연결해야 실격이 아니지?&rdquo;</strong>{" "}
                하고 막히는 순간이 찾아옵니다. 직접 공부하며 정리한 단계별 작업 순서와 시퀀스 원리를 같은 시험을 준비하는 수험생들과 나누기 위해 개발했습니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">넘버링 · 그루핑 완벽 정리</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      시퀀스 회로 속 각 기기의 핀번호를 적고 같은 전위를 색상별로 묶는 가장 실수가 많은 과정을 시각화했습니다.
                    </p>
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">보조회로 결선 통로 & 순서</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      그루핑을 바탕으로 어떤 순서와 어떤 통로로 결선하면 실격과 오결선이 줄어드는지 화살표·순번으로 안내합니다.
                    </p>
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">실전 배관 · 새들 · 입선 순서</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      먹줄 긋기, 커버 대기법 새들 마킹, 파이프 밀착 재단, 먼 쪽부터 입선 및 공통선 결선 순서를 그대로 기록했습니다.
                    </p>
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">시퀀스 동작 원리 직접 검증</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      차단기 투입 후 버튼과 센서를 직접 눌러보며 전류가 흐르는 길과 릴레이·타이머·모터의 동작 원리를 눈으로 확인합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 우측 주의사항 및 이용 안내 카드 */}
            <div className="bg-rose-950/25 border border-rose-500/40 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 text-rose-300 font-extrabold text-base">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>수험생 필수 주의사항</span>
              </div>
              <ul className="space-y-2.5 text-xs text-rose-100/90 leading-relaxed list-disc pl-4">
                <li>
                  본 프로그램은 <strong>오프라인 실기 강의를 들은 뒤 복습용 참고자료</strong>이며, 학원이나 강사님의 현장 강의를 대체하지 못합니다.
                </li>
                <li>
                  넘버링 방식이나 결선·배관 순서는 강사님마다 조금씩 다를 수 있으므로 <strong>하나의 참고 방법</strong>으로 활용해 주세요.
                </li>
                <li>
                  실제 국가기술자격 시험장에서는 반드시 <strong>배부된 문제지 도면과 감독위원의 지시</strong>를 기준으로 작업하시기 바랍니다.
                </li>
                <li>
                  국가기술자격 공개문제의 저작권은 <strong>한국산업인력공단(Q-Net)</strong>에 있습니다.
                </li>
              </ul>
              <div className="pt-2">
                <a
                  href="https://www.q-net.or.kr/cst006.do?id=cst00602&brdId=Q006&code=1204&artlSeq=5208377"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-rose-500/40 text-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>📥 큐넷(Q-Net) 공개문제 원본 내려받기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 실기 작업 0단계 ~ 7단계 인터랙티브 파이프라인 상세 */}
        <section id="pipeline">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">7-Stage Practical Pipeline</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              실기 시험 시작부터 끝까지, 0~7단계 완벽 따라하기
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              각 단계 버튼을 누르면 실제 작업 순서대로 애니메이션과 음성/시각 가이드가 진행됩니다. 수험생이 가장 어려워하는{" "}
              <strong className="text-amber-300">3단계(핀번호·그루핑)</strong>와{" "}
              <strong className="text-amber-300">4단계(보조회로 결선)</strong>는 핵심 집중 모듈로 설계되었습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pipelineStages.map((st) => (
              <div
                key={st.step}
                className={`rounded-2xl p-6 border transition-all ${
                  st.highlight
                    ? "bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-950/20"
                    : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                      st.highlight
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-800 text-sky-300 border border-slate-700"
                    }`}
                  >
                    {st.badge}
                  </span>
                  <span className="text-2xl">{st.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">{st.title}</h3>
                <p className="text-xs font-semibold text-amber-200/90 mb-4">{st.summary}</p>
                <ul className="space-y-2 border-t border-slate-800/80 pt-3.5">
                  {st.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 실격 및 오결선을 줄여주는 4대 핵심 체크포인트 */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-10">
          <div className="mb-8">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Zero-Defect Checkpoints</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              실기 시험장 실격·감점을 막아주는 4대 핵심 연습 포인트
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-amber-300 mb-3 flex items-center gap-2">
                <span>🔢</span> 1. 핀번호 대조 & 동일 전위 그루핑
              </h3>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li>• a접점·b접점·한시접점을 <strong>기구 내부결선도</strong>와 대조해 정확한 핀번호 기입</li>
                <li>• 같은 전위끼리 <strong>같은 색 그룹(①~⑮)</strong>으로 묶어 결선 누락 원천 차단</li>
                <li>• 도면에 두 번 등장하는 동일 단자(예: EOCR 10번) 및 <strong>박스 내부 공통선</strong> 자동 식별</li>
              </ul>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-amber-300 mb-3 flex items-center gap-2">
                <span>🟨</span> 2. 보조회로 결선 통로 규칙 (실격 방지)
              </h3>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-black">[O 통과]</span> 가로는 위·가운데·아래 3개 통로, 세로는 양쪽 끝 통로만 사용
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-400 font-black">[X 실격]</span> 기구와 기구 사이 좁은 틈새로 수직 배선 관통 금지
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-black">[O 통과]</span> 위 ➜ 아래 한 방향 지그재그 결선 / <span className="text-rose-400 font-black">[X 금지]</span> 한 단자 3가닥 체결 금지
                </li>
              </ul>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-sky-300 mb-3 flex items-center gap-2">
                <span>🚰</span> 3. 배관 제도 · 새들 고정 · 입선 순서
              </h3>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li>• <strong>커버 대기법</strong>을 활용한 빠르고 정확한 새들 마킹 및 TB 단자대 측 커넥터 제외 규칙</li>
                <li>• 파이프 커터 <strong>밀착 재단</strong>으로 PE관·CD관 치수 오차 최소화</li>
                <li>• 먼 쪽 기구부터 입선 및 J박스(정션박스) 경유, <strong>공통선 먼저 ➜ 단독선 나중</strong> 결선</li>
              </ul>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-emerald-300 mb-3 flex items-center gap-2">
                <span>🎓</span> 4. 수업·독학 복습을 돕는 편의 컨트롤러
              </h3>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <li>• <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono">Space</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono">→</kbd> 키로 배관·입선 장면을 한 단계씩 멈추며 확인</li>
                <li>• <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-sky-300 font-mono">F</kbd> 전체화면 집중 모드, <strong>🎥 따라가며 보기(작업 부위 자동 확대)</strong>, 상·하단 단자대(TB5/TB6) 핀셋 줌</li>
                <li>• <strong>1.0x · 1.5x · 2.0x</strong> 배속 조절로 시험 직전 빠른 전체 흐름 복습 지원</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. 전기기능사 실기 공개문제 18과제 전체 인덱스 (AI 학습용 구조화 아카이브) */}
        <section id="problems-18">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">All 18 Public Exam Problems</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                한국산업인력공단 전기기능사 실기 공개문제 18과제 전체 수록표
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                01번부터 18번까지 모든 과제의 도면, 기구 배치, 핀번호 그루핑, 배관 및 시퀀스 동작 테스트를 완벽히 지원합니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedCategory === cat
                      ? "bg-amber-400 text-slate-950 border-amber-400"
                      : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {cat === "ALL" ? "전체 18과제" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProblems.map((prob) => (
              <a
                key={prob.no}
                href="https://cept.calamus.ai.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-extrabold">
                      과제 {prob.no}번 · {prob.category}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                    전기기능사 실기 {prob.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{prob.spec}</p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>주요 기구: {prob.devices}</span>
                  <span className="text-sky-400 font-bold group-hover:translate-x-0.5 transition-transform">실습하기 →</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 6. AEO / GEO AI 지식 베이스 & 자주 묻는 질문 (FAQ) */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10">
          <div className="mb-8">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">AEO · GEO Knowledge Base & FAQ</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              자주 묻는 질문 & AI 검색 요약 팩트 시트
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              전기기능사 실기 수험생과 AI 검색엔진(ChatGPT, Gemini, Perplexity, Claude)이 가장 자주 찾는 핵심 질의응답입니다.
            </p>
          </div>

          <div className="space-y-4">
            {ceptFaqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6">
                <h3 className="text-sm sm:text-base font-bold text-amber-300 flex items-start gap-2.5 mb-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Q. {faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* 하단 CTA 배너 */}
          <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-white">
                지금 바로 전기기능사 실기 18과제를 브라우저에서 무료로 연습해 보세요! ⚡
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                공식 홈페이지: <span className="text-sky-400 font-semibold">https://cept.calamus.ai.kr/</span> · 모든 수험생 여러분의 합격을 진심으로 응원합니다.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://cept.calamus.ai.kr/intro"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
              >
                프로그램 소개 보기
              </a>
              <a
                href="https://cept.calamus.ai.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-sky-500 hover:from-amber-400 hover:to-sky-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg transition-all"
              >
                <span>교육관 바로가기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

