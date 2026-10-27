"use client";

import React, { useState } from "react";
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
  Sparkle,
  Activity,
  Layers,
  CalendarCheck,
  BookOpen,
  FileText,
  Mail,
  Copy,
  Check,
  Building2,
  Maximize2,
  HelpCircle,
  ArrowRight,
  Smartphone,
  Video,
  MicOff
} from "lucide-react";
import NetworkDiagnosticsModal from "./NetworkDiagnosticsModal";

const DEMO_URL = "https://try.worknexus.calamus.ai.kr/";
const PRODUCT_SITE_URL = "https://worknexus.calamus.ai.kr/";
const IMG_BASE = "/images/solutions/worknexus";

// 1. 히어로 우측 스마트폰 프레임 쇼츠 3편 (EP.4 동시접속, EP.5 도면 워룸, 45초 핵심 요약)
const heroShortsList = [
  {
    id: "a2y-gfH1Ygc",
    chip: "동시접속 요금",
    caption: "EP.4 휴가 간 직원 요금도 내요? (56초)",
    title: "WorkNexus 쇼츠 EP.4 — 등록 사원 무제한·동시접속 라이선스",
    isNew: true
  },
  {
    id: "py10HL1EkWQ",
    chip: "도면 보안 워룸",
    caption: "EP.5 대외비 도면, 카톡으로 보내요? (57초)",
    title: "WorkNexus 쇼츠 EP.5 — 사내 직통 화면공유 & 2D 업무 모드",
    isNew: true
  },
  {
    id: "20ZhVVM-nbQ",
    chip: "45초 핵심 요약",
    caption: "45초 만에 보는 WorkNexus 핵심",
    title: "WorkNexus 45초 소개 쇼츠",
    isNew: false
  }
];

// 2. 처음 보시는 분께 — 4대 일상 업무 변화 시나리오 (EverydayOfficeGuide)
const everydaySituations = [
  {
    badge: "이럴 때 01 · 실시간 재실 & 8종 근태",
    title: "동료의 출퇴근과 현재 위치를 바로 알고 싶을 때",
    text: "사무실에 입장하면 같은 층에서 일하는 동료들의 실시간 근무 상태(출근·회의 중·집중 근무·자리 비움·외근·출장·휴가·퇴근)와 좌석을 한눈에 볼 수 있습니다. 출퇴근 기록도 자동으로 연동됩니다.",
    result: "메신저나 전화로 “지금 자리 계신가요?”라고 묻는 불필요한 확인 과정이 사라집니다."
  },
  {
    badge: "이럴 때 02 · 거리 기반 공간 음성",
    title: "복도나 자리에서 예약 없이 가볍게 의논하고 싶을 때",
    text: "회의실을 예약하지 않아도 아바타를 동료 옆으로 이동시키면 2.5m 안에서 선명하게 들리고 4m 밖에서 자동 차단되는 근거리 대화(Spatial Voice)가 시작됩니다. 스피킹 링으로 발화자도 즉시 확인됩니다.",
    result: "티타임이나 짧은 질문을 위해 미팅 일정을 잡지 않고도 실제 사무실처럼 즉석 소통합니다."
  },
  {
    badge: "이럴 때 03 · 사내 직통 SFU & 화이트보드",
    title: "회의실에서 대외비 자료·도면을 함께 보고 결정할 때",
    text: "회의실에 들어가면 방별로 완벽히 격리된 사내 서버 SFU 고화질 화면 공유, 시스템 사운드, 카메라·마이크, 실시간 화이트보드를 사용합니다. 포스트잇 메모도 공간에 그대로 보존됩니다.",
    result: "외부 메신저 파일 전송이나 P2P IP 노출 없이 회의 자료에만 몰입해 신속하게 결론을 도출합니다."
  },
  {
    badge: "이럴 때 04 · 100명 대강당 & 200석 타운홀",
    title: "전사 타운홀 미팅이나 외부 고객 세미나를 진행할 때",
    text: "부서 발표는 건물 안 100명 대강당(기본 제공)에서, 전사 행사·고객 초청 웨비나는 210석 가상 강당(최대 200명, 별도 옵션)에서 진행합니다. 발표자 대형 화면·사운드 송출과 손들기 발언 승인을 지원합니다.",
    result: "수백 명이 모여도 오디오 혼선과 에코 없이 질서 정연한 전사 행사 및 설명회를 운영합니다."
  }
];

// 3. LIVE DEMO GLIMPSE (#preview) — 입장 전 확인하는 6대 공간 미리보기 & 직통 데모 링크
const liveDemoPreviews = [
  {
    floor: "1F DEMO SCREEN",
    title: "팀 회의와 스마트보드",
    description: "회의 테이블, 실시간 화이트보드, 독립 SFU 화면 공유가 연결된 1층 집중 협업 회의실입니다.",
    href: `${DEMO_URL}?floor=1`,
    image: `${IMG_BASE}/meeting-room-1f.png`
  },
  {
    floor: "2F DEMO SCREEN",
    title: "회의실 실시간 화이트보드",
    description: "회의 중 작성한 보드 메모와 포스트잇을 같은 공간에서 실시간 공유·협업하고 지식 자산으로 축적합니다.",
    href: `${DEMO_URL}?floor=2`,
    image: `${IMG_BASE}/whiteboard-2f.png`
  },
  {
    floor: "SPATIAL VOICE",
    title: "마주치면 들리는 근거리 대화",
    description: "복도나 자리에서 동료 캐릭터에게 다가가면 목소리가 들리는 거리 기반(2.5m~4m) 실시간 공간 음성입니다.",
    href: DEMO_URL,
    image: `${IMG_BASE}/proximity-voice.png`
  },
  {
    floor: "1:1 COLLAB",
    title: "1:1 통화 · 고화질 화면 공유",
    description: "P2P IP 노출 없이 사내 SFU 전용 채널로 안전하게 연결되는 1:1 비공개 음성/화상 통화와 화면 공유입니다.",
    href: DEMO_URL,
    image: `${IMG_BASE}/employee-screen-share.png`
  },
  {
    floor: "MEETING ROOM · 4F",
    title: "회의실 화상 · 마이크 · 화면공유",
    description: "방마다 분리된 격리 채널로 혼선 없이 고화질 발표 화면(플로팅 뷰어)과 참석자 웹캠·마이크를 동시 확인합니다.",
    href: `${DEMO_URL}?floor=4`,
    image: `${IMG_BASE}/meeting-media-4f.png`
  },
  {
    floor: "AUDITORIUM · 5F",
    title: "100명 대강당 & 200석 타운홀",
    description: "건물 안에 기본으로 갖춘 100명 규모 대강당입니다. 대형 스크린 화면·사운드 공유로 부서 발표와 교육을 진행합니다.",
    href: `${DEMO_URL}?floor=5`,
    image: `${IMG_BASE}/auditorium-5f.png`
  }
];

// 4. 제품 둘러보기 공식 시연 영상 (챕터 점프 지원 4편 + 기능 시연 2편)
type TourVideoItem = {
  id: string;
  youtubeId: string;
  tabLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  desc: string;
  isNew?: boolean;
  isShorts?: boolean;
  chapters: Array<{ seconds: number; time: string; title: string }>;
};

const tourVideosList: TourVideoItem[] = [
  {
    id: "intro-5m",
    youtubeId: "KvGI7q73D7A",
    tabLabel: "신입사원의 하루 · 5분 투어",
    badge: "5:00 Full Tour",
    title: "신입사원의 첫 출근부터 200석 고객 세미나까지 (5분 기능 소개)",
    subtitle: "무설치 웹 로그인 · 아바타 사진 등록 · 근거리 대화 · 회의실 화면공유 · 대강당/타운홀",
    desc: "설치 없이 브라우저로 출근해 자리 배치, 공간 음향 스몰토크, 1:1 통화, 독립 회의실 화면공유, 전사 타운홀까지 하루 일과 흐름으로 확인합니다.",
    chapters: [
      { seconds: 0, time: "0:00", title: "인트로 — 사내 완결형 프라이빗 가상 오피스" },
      { seconds: 10, time: "0:10", title: "첫 출근 — 무설치 웹 로그인 및 초기 비밀번호 변경" },
      { seconds: 40, time: "0:40", title: "나만의 3D 캐릭터 & 실제 얼굴 사진 등록" },
      { seconds: 74, time: "1:14", title: "하단 툴바 기능 둘러보기 & 내 자리 저장" },
      { seconds: 107, time: "1:47", title: "마주치면 들리는 근거리 대화 · 1:1 통화·화면 공유" },
      { seconds: 149, time: "2:29", title: "층별 사옥 투어와 3F 루프탑 휴게 공간" },
      { seconds: 184, time: "3:04", title: "독립 회의실 격리 화상회의와 고화질 화면 공유" },
      { seconds: 219, time: "3:39", title: "사내 전체 회의 — 100명 대강당 발표" },
      { seconds: 245, time: "4:05", title: "외부 고객 초청 세미나 — 타운홀 & 손들기 발언 승인" },
      { seconds: 285, time: "4:45", title: "도입 안내 및 엔딩" }
    ]
  },
  {
    id: "partner-4m30",
    youtubeId: "crUa5_15nOs",
    tabLabel: "협력업체 주간회의 · 4:30",
    badge: "4:30 Partner & 2D",
    title: "협력업체와 함께하는 주간회의 (외부 참석 링크 · 팀 일정 · 2D 업무 화면)",
    subtitle: "회의 전후 30분 시한부 게스트 링크 · 구글 캘린더(.ics) · 벽면 일정 보드 · 2D 모드 전환",
    desc: "사내 계정이 없는 외부 협력업체 담당자가 시한부 링크 하나로 해당 회의실에만 안전하게 입장해 시안을 공유하고, 사내 직원은 2D 경량 모드로 회의를 이어가는 실전 시연입니다.",
    isNew: true,
    chapters: [
      { seconds: 0, time: "0:00", title: "인트로 — 외부 협력업체와의 보안 주간회의" },
      { seconds: 14, time: "0:14", title: "회의 예약과 외부 참석 전용 시한부 링크 발급" },
      { seconds: 75, time: "1:15", title: "팀·전사 일정 달력 통합 조회 및 구글 캘린더(.ics) 연동" },
      { seconds: 131, time: "2:11", title: "팀 방 벽면 일정 보드 — 다가가서 E키로 팀 달력 열기" },
      { seconds: 144, time: "2:24", title: "대시보드 '이번 주 일정'에서 원클릭 회의실 바로 참여" },
      { seconds: 159, time: "2:39", title: "협력업체 담당자 시점 — 무설치 링크 입장 및 '외부' 배지 표시" },
      { seconds: 202, time: "3:22", title: "💻 2D 업무 화면으로 전환해도 음성·화면공유 회의 완벽 유지" },
      { seconds: 228, time: "3:48", title: "회의 종료 및 주최자 외부 링크 즉시 차단(비활성화)" },
      { seconds: 258, time: "4:18", title: "엔딩 요약" }
    ]
  },
  {
    id: "shorts-ep4",
    youtubeId: "a2y-gfH1Ygc",
    tabLabel: "쇼츠 EP.4 · 동시접속 요금",
    badge: "0:56 Shorts EP.4",
    title: "휴가 간 직원 요금도 내요? (EP.4 동시접속 라이선스)",
    subtitle: "등록 사원 수 무제한 · 실제 접속한 동시접속 인원 기준 합리적 과금 · 10초 웹 출근",
    desc: "인당 과금(Per-Seat) SaaS 청구서에 놀란 대표님과 경영지원팀! 휴가·외근·퇴근자는 좌석을 차지하지 않는 WorkNexus의 등록 사원 무제한·동시접속 라이선스를 소개합니다.",
    isNew: true,
    isShorts: true,
    chapters: [
      { seconds: 0, time: "0:00", title: "2F 임원실 — 매달 불어나는 인당 과금 SaaS 청구서" },
      { seconds: 6, time: "0:06", title: "1F 개발실 — 출근·외근·휴가 실시간 머리 위 표시" },
      { seconds: 13, time: "0:13", title: "조직 대시보드 — 등록 사원 무제한 · 동시접속 기준 운영" },
      { seconds: 18, time: "0:18", title: "신입·인턴 10명 일괄 등록 (추가 좌석 구독료 0원)" },
      { seconds: 22, time: "0:22", title: "사원 PC 무설치 — 크롬 주소창 입력만으로 10초 출근" },
      { seconds: 31, time: "0:31", title: "1F 협업 라운지 & 2F 올핸즈 대강당 투어" },
      { seconds: 41, time: "0:41", title: "2F 임원실 반전 — '신입 100명 뽑아도 서버비는 그대로! 그분들 월급은요?'" },
      { seconds: 50, time: "0:50", title: "3F 루프탑 전 사원 엔딩" }
    ]
  },
  {
    id: "shorts-ep5",
    youtubeId: "py10HL1EkWQ",
    tabLabel: "쇼츠 EP.5 · 도면 보안 워룸",
    badge: "0:57 Shorts EP.5",
    title: "대외비 도면, 카톡으로 보내요? (EP.5 본사×현장 기술 워룸)",
    subtitle: "파일 외부 전송 ZERO · 사내 직통 4K CAD 도면 화면공유 · 현장 태블릿 2D 업무 모드",
    desc: "평택 2공장 배관 압력 이상 긴급 상황! 대외비 CAD 도면을 메신저로 보내지 않고 2F 기술 워룸 직통 화면공유와 현장 태블릿 2D 모드로 5분 만에 해결합니다.",
    isNew: true,
    isShorts: true,
    chapters: [
      { seconds: 0, time: "0:00", title: "1F 개발실 — 평택 2공장 현장 배관 압력 긴급 호출" },
      { seconds: 6, time: "0:06", title: "1F 협업 라운지 — 외부 메신저 파일 전송 차단 & 워룸 소집" },
      { seconds: 12, time: "0:12", title: "2F 기술 워룸 — 파일 반출 없는 사내 서버 4K CAD 도면 공유" },
      { seconds: 22, time: "0:22", title: "더블클릭 플로팅 뷰어 — 복잡한 배관·수치 정밀 줌인" },
      { seconds: 31, time: "0:31", title: "현장 태블릿 💻 2D 경량 업무 모드 & 밸브 동기화 완료" },
      { seconds: 41, time: "0:41", title: "원격 보정 완료 & '3공장 배관도 마저 봐야죠^^' 칼퇴 반려 엔딩" },
      { seconds: 51, time: "0:51", title: "3F 루프탑 엔딩" }
    ]
  },
  {
    id: "demo-screenshare",
    youtubeId: "Yi4NM_l7l78",
    tabLabel: "화면공유 & 화상회의 시연",
    badge: "SFU Meeting Demo",
    title: "독립 회의실 격리 화상회의 & 초저지연 화면·사운드 공유 시연",
    subtitle: "방별 완전 격리 채널 · 네온 글로우 발표 화면 · 문서 PiP 분리 뷰어",
    desc: "회의실마다 완벽히 분리된 사내 SFU 미디어 채널을 통해 다른 방과 혼선 없이 고화질 발표 자료와 시스템 오디오를 동시에 공유하는 실제 작동 영상입니다.",
    chapters: [
      { seconds: 0, time: "0:00", title: "회의실 입장 및 방 단위 독립 미디어 채널 연결" },
      { seconds: 15, time: "0:15", title: "고화질 화면 공유 및 시스템 사운드 동시 송출" },
      { seconds: 45, time: "0:45", title: "플로팅 집중 뷰어 확대 및 참석자 웹캠 동시 확인" }
    ]
  },
  {
    id: "demo-smalltalk",
    youtubeId: "MQeGH2KLmsk",
    tabLabel: "스몰토크 · 1:1 통화 · 일정",
    badge: "Spatial & Calendar",
    title: "근거리 공간음향 스몰토크 · 1:1 비밀 통화 & 벽면 일정 보드 시연",
    subtitle: "2.5m~4m 거리 감쇠 음성 · 1:1 다이렉트 통화 · 팀 벽면 캘린더 동기화",
    desc: "아바타가 다가가면 자연스럽게 들리는 근거리 공간 대화와 비공개 1:1 통화, 사옥 벽면 일정 보드 연동 시연 영상입니다.",
    chapters: [
      { seconds: 0, time: "0:00", title: "3D 오피스 이동 및 거리 기반 근거리 공간 대화" },
      { seconds: 25, time: "0:25", title: "비공개 1:1 다이렉트 통화 및 개인 화면 공유" },
      { seconds: 55, time: "0:55", title: "사옥 벽면 일정 보드 및 회의실 예약 연동" }
    ]
  }
];

// 5. 실제 사용자 하루 흐름 5대 여정 & 23종 실제 화면 캡처 갤러리 (WorkNexusProductShowcase)
const productJourneys = [
  {
    number: "01",
    eyebrow: "SECURE ACCESS & ATTENDANCE",
    title: "사원 선택부터 실시간 출퇴근 · 8종 근무 상태 연동까지",
    description:
      "관리자와 임직원의 권한을 나누고, 사원 검색·층별 조회·자동 출퇴근(Clock-in/out) 기록 및 8종 실시간 근무 상태(출근·회의 중·집중 근무·자리 비움·외근·출장·휴가·퇴근)를 동기화하여 브라우저에서 바로 가상 사옥으로 입장합니다.",
    accent: "from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/40",
    images: [
      { src: `${IMG_BASE}/login-directory.png`, title: "사원 디렉터리 로그인", caption: "접속 중인 동료와 소속 층을 확인하는 임직원 로그인" },
      { src: `${IMG_BASE}/attendance-status.png`, title: "실시간 근무·퇴근 상태", caption: "자동 출퇴근 연동 및 부서별 업무·회의·외근·자리비움 실시간 동기화" },
      { src: `${IMG_BASE}/office-entry.png`, title: "3D 가상 사옥 입장", caption: "좌석·동료 상태·스크린·화이트보드가 연결된 무설치 브라우저 오피스" }
    ]
  },
  {
    number: "02",
    eyebrow: "SPATIAL VOICE & SFU MEDIA",
    title: "가까이 다가가 대화하고, 회의실별로 완전 분리해 협업합니다",
    description:
      "3D 오피스에서는 2.5m 안에서 선명하게 들리고 4m 밖에서 들리지 않는 근거리 공간 대화를 지원합니다. 1:1 통화, 회의실 카메라·마이크와 화면공유는 P2P 대신 고객 서버의 내장 SFU를 사용하며 방 단위로 엄격히 격리됩니다.",
    accent: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40",
    images: [
      { src: `${IMG_BASE}/voice-meeting-showcase.jpg`, title: "공간 협업의 3대 핵심 구조", caption: "몰입형 3D 회의, 인터랙티브 플로팅 뷰어, 공간 음향 근거리 대화" },
      { src: `${IMG_BASE}/proximity-voice.png`, title: "거리 기반 근거리 대화", caption: "동료에게 다가가면 자연스럽게 목소리가 들리는 공간 음성 (스피킹 링 시각화)" },
      { src: `${IMG_BASE}/direct-chat-share.png`, title: "1:1 통화 및 개인 화면 공유", caption: "두 사람만을 위한 사내 SFU 전용 채널에서 비공개 통화와 화면공유 진행" },
      { src: `${IMG_BASE}/room-screen-share.png`, title: "회의실 독립 스크린 송출", caption: "방마다 분리된 대형 스크린으로 4K 발표 화면 및 시스템 사운드 전송" },
      { src: `${IMG_BASE}/meeting-camera-audio.png`, title: "회의실 통합 화상 협업", caption: "방별 격리 채널에서 공유 화면과 참석자 카메라·음성을 동시에 확인" },
      { src: `${IMG_BASE}/meeting-share-sample.png`, title: "네온 글로우 발표 집중 화면", caption: "3D 공간과 1:1 전체화면 플로팅 뷰어를 오가며 발표 자료에 온전히 몰입" }
    ]
  },
  {
    number: "03",
    eyebrow: "CUSTOM BUILDING & STUDIO",
    title: "업종과 조직 구조를 반영하는 고객사 전용 맞춤형 업무 공간",
    description:
      "일반 기업, 연구소·R&D, 첨단 제조, 학교, 공공기관 등 업종별 프리셋을 바탕으로 집중 개발실, 협업 라운지, 임원 집무실과 독립 회의실을 구성합니다.",
    accent: "from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/40",
    images: [
      { src: `${IMG_BASE}/custom-room.png`, title: "맞춤형 협업 라운지", caption: "대형 스크린과 화이트보드, 회의 테이블을 조합한 팀 전용 공간" },
      { src: `${IMG_BASE}/custom-executive-room.png`, title: "임원 집무실", caption: "독립 집무와 소규모 보안 미팅을 함께 고려한 맞춤 배치" },
      { src: `${IMG_BASE}/custom-meeting-room.png`, title: "독립형 회의실", caption: "부서 정원과 업무 방식에 맞춘 좌석·미디어 설비 구성" }
    ]
  },
  {
    number: "04",
    eyebrow: "TOWN HALL & KNOWLEDGE",
    title: "최대 200명이 참여하는 타운홀 웨비나와 사내 지식 화이트보드",
    description:
      "건물 내 100명 대강당(기본 제공)과 210석 가상 강당(계약 옵션 시 최대 200명)에서 전사 발표와 외부 고객 세미나를 개최합니다. 발표자·청중 권한 분리, 손들기 발언 승인, 행사 채팅 및 방별 화이트보드 포스트잇 기록을 지원합니다.",
    accent: "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40",
    images: [
      { src: `${IMG_BASE}/townhall-system.png`, title: "타운홀 미팅 & 세미나 시스템", caption: "발표자 무대 제어, 청중 손들기 발언권 요청/승인, 실시간 행사 채팅" },
      { src: `${IMG_BASE}/townhall-stage.png`, title: "타운홀 무대 및 대형 스크린", caption: "발표자의 화면과 시스템 오디오를 최대 200명 참가자에게 끊김 없이 전달" },
      { src: `${IMG_BASE}/auditorium-100.png`, title: "210석 가상 강당 & 100명 대강당", caption: "임직원 올핸즈 미팅과 외부 초청 게스트가 한자리에 모이는 대형 공간" },
      { src: `${IMG_BASE}/screen-whiteboard.png`, title: "회의실 협업 스크린 & 보드", caption: "독립 공유 스크린과 화이트보드를 방 단위로 격리 연결" },
      { src: `${IMG_BASE}/whiteboard-notes.png`, title: "실시간 화이트보드 지식 기록", caption: "방별 포스트잇 메모를 기록하고 자산화하는 사내 지식 보드" }
    ]
  },
  {
    number: "05",
    eyebrow: "EXTERNAL PARTNER & 2D WORK MODE",
    title: "협력업체는 시한부 링크로, 일정은 한 달력에서, 현장엔 2D 모드로",
    description:
      "사내 계정이 없는 협력업체도 링크 하나로 그 회의실 회의에만 참석해 카메라·마이크·화면 공유·채팅을 함께 씁니다. 링크는 회의 전후 30분만 열리고 주최자가 끄면 즉시 닫힙니다. 회의 중에도 가벼운 2D 업무 화면으로 전환할 수 있습니다.",
    accent: "from-sky-500/20 to-cyan-500/20 text-sky-300 border-sky-500/40",
    images: [
      { src: `${IMG_BASE}/partner-guest-meeting.jpg`, title: "협력업체 외부 참석 화면", caption: "로그인·설치 없이 링크로 입장해 시안을 공유하고 사내 참석자와 화상회의" },
      { src: `${IMG_BASE}/partner-guest-link.jpg`, title: "시한부 외부 참석 링크 관리", caption: "회의 시간 앞뒤로만 열리는 보안 링크, 재발급·즉시 끄기와 참석자 내보내기" },
      { src: `${IMG_BASE}/partner-external-label.jpg`, title: "사내 회의 창의 '외부' 표시", caption: "외부 참석자는 이름 옆에 '외부' 배지가 표시되며 지정 회의실에만 격리 입장" },
      { src: `${IMG_BASE}/schedule-calendar.jpg`, title: "팀·전사 일정 통합 달력", caption: "회의 예약·타운홀·팀 일정을 한 달력에서 보고 구글 캘린더·.ics로 내보내기" },
      { src: `${IMG_BASE}/schedule-wall-board.jpg`, title: "팀 방 벽면 일정 보드", caption: "이번 주 일정이 걸린 벽 보드 — 다가가서 E키로 우리 팀 달력 즉시 열기" },
      { src: `${IMG_BASE}/work-mode-2d.jpg`, title: "초경량 💻 2D 업무 화면", caption: "회의·화면 공유를 유지한 채 저사양 PC·현장 태블릿에서 가볍게 보는 2D 뷰" }
    ]
  }
];

// 6. "넥서스 오피스 사람들" 실무 공감 에피소드 5편 (AI 크롤링 & 스토리텔링 아카이브)
const sitcomEpisodes = [
  {
    ep: "EP.1",
    title: "말 걸어도 돼요? (집중 근무 & 자동 근태)",
    hook: "“시안 마감 D-1… 근데 사무실이 너무 시끄럽다!”",
    story: "마감 전날 주변 수다 소리에 지친 디자이너 김하늘이 상태를 '🔴 집중 근무'로 바꾸자 마이크와 주변 소리가 즉시 차단됩니다. 머리 위 상태 표시를 본 동료와 팀장님도 방해하지 않고 물러나며, 퇴근 버튼 하나로 근태 기록까지 자동 완료됩니다.",
    features: ["8종 근무 상태 표시", "🔴 집중 근무 시 마이크·주변음 자동 차단", "퇴근 후 내 자리 아바타 유지 & 자동 근태 기록"],
    videoUrl: null
  },
  {
    ep: "EP.2",
    title: "보안팀장이 물었다 (사내 SFU & 원클릭 폐쇄망)",
    hook: "“그래서… 우리 회의 영상, 어느 나라 서버로 가요?”",
    story: "도입 검토 회의에서 깐깐한 보안팀장이 던진 3가지 질문! ① 음성·영상은 우리 회사 서버로만 중계되고 어디에도 저장되지 않으며, ② 협력업체 링크는 회의 앞뒤 30분만 해당 방에 열리고, ③ '⏹ 외부 터널 차단(폐쇄망 전환)' 버튼 하나로 인터넷 없이도 사내망 회의가 유지됩니다.",
    features: ["사내 서버 SFU 직통 중계(무저장)", "회의 전후 30분 시한부 외부 링크", "원클릭 ⏹ 폐쇄망 즉시 전환"],
    videoUrl: null
  },
  {
    ep: "EP.3",
    title: "커피 타러 간 사이 (자리 비움 기록 & 회의 예외)",
    hook: "“커피 한 잔 타러 갔을 뿐인데… 퇴근 처리된 건 아니죠?”",
    story: "탕비실 수다가 길어져 30분간 입력이 없자 1분 전 카운트다운 경고 후 자동 로그아웃되지만, 근태는 퇴근이 아닌 '자리 비움'으로 정확히 남습니다. 반면 2시간째 발표 화면을 보고만 있는 팀장님은 회의·통화 중 예외 규칙 덕분에 끊기지 않습니다.",
    features: ["관리자 정책형 미사용 자동 로그아웃(30분~8시간)", "만료 1분 전 경고 & '자리 비움' 근태 기록", "회의·통화·화면공유·타운홀 참석 중 자동 로그아웃 제외"],
    videoUrl: null
  },
  {
    ep: "EP.4",
    title: "휴가 간 직원 요금도 내요? (동시접속 라이선스)",
    hook: "“휴가·외근 간 직원 자리까지 매달 인당 구독료를 내고 있었다고?!”",
    story: "인턴·외근자가 늘 때마다 불어나는 인당 과금(Per-Seat) SaaS 청구서! WorkNexus는 전 사원 계정 등록 수 제한 없이 실제 접속한 '동시접속 인원' 기준으로만 합리적으로 운영합니다. 신입사원을 추가 등록해도 서버 추가 구독료는 0원입니다.",
    features: ["전 사원 계정 등록 무제한", "실제 접속한 동시접속 인원(50·100·200·300명) 기준 라이선스", "휴가·외근·퇴근자 좌석 차감 ZERO"],
    videoUrl: "https://youtube.com/shorts/a2y-gfH1Ygc"
  },
  {
    ep: "EP.5",
    title: "대외비 도면, 카톡으로 보내요? (현장 기술 워룸)",
    hook: "“현장 배관 압력이 튀는데… 대외비 CAD 도면, 메신저로 보내요?!”",
    story: "평택 2공장 설비 긴급 호출! 외부 메신저로 도면 파일을 전송하는 대신 2F 프라이빗 기술 워룸에서 사내 서버 직통 4K CAD 화면공유와 플로팅 뷰어 줌인으로 수치를 확인하고, 공장 현장 태블릿에서는 초경량 '💻 2D 업무 모드'로 5분 만에 보정을 완료합니다.",
    features: ["파일 외부 반출 없는 4K 도면 직통 화면공유", "더블클릭 플로팅 뷰어 정밀 줌인", "현장 태블릿·저사양 PC용 초경량 💻 2D 업무 모드"],
    videoUrl: "https://youtube.com/shorts/py10HL1EkWQ"
  }
];

// 7. 12종 공식 기술 백서 & 엔터프라이즈 가이드 데이터셋
const manualsList = [
  { id: "user-guide", category: "사용자 가이드", title: "01. 일반 사용자 매뉴얼", desc: "무설치 웹 브라우저 출근, 3D 아바타 세팅, 근접 공간 음향, 1:1 통화 및 회의실·2D 모드 이용 방법" },
  { id: "admin-guide", category: "관리자 가이드", title: "02. 고객 관리자 매뉴얼", desc: "부서·조직도 매핑, 사내 내장 HTTPS 설정, 미사용 자동 로그아웃 정책, 3D 좌석 배치 및 근태 CSV 추출" },
  { id: "server-ops", category: "서버 운영", title: "03. 서버 운영자 매뉴얼", desc: "독립 실행형 프로세스 구동, 백그라운드 서비스 관리 및 사내 임베디드 DB 무결성 점검" },
  { id: "https-tunnel", category: "사내망 HTTPS", title: "04. 사내망 내장 HTTPS & 보안 터널 가이드", desc: "별도 프록시 없는 내장 HTTPS 게이트웨이·자체 인증기관(CA) 구성 및 제로트러스트 보안 외부 연결 가이드" },
  { id: "windows-install", category: "서버 설치", title: "05. Windows 서버 설치 매뉴얼", desc: "Windows 10/11 및 Windows Server 통합 설치 프로그램 배포 및 트레이 운영 도구 가이드" },
  { id: "linux-install", category: "서버 설치", title: "06. Linux VM (Docker) 설치 매뉴얼", desc: "Ubuntu 등 Linux 사내 서버 오프라인 Docker 패키지 배포, 내장 HTTPS 적용 및 방화벽 설정 절차" },
  { id: "meeting-screenshare", category: "화상회의", title: "07. 화상회의 & 화면공유 가이드", desc: "사내 완결형 SFU 방별 미디어 격리, 초저지연 화면·시스템 사운드 동시 송출, 플로팅 뷰어 및 PiP 분리" },
  { id: "townhall-guide", category: "타운홀 세미나", title: "08. 210석 가상 대강당 타운홀 운영 매뉴얼", desc: "최대 200명 전사 발표·외부 초청 웨비나 무대 제어, 청중 손들기 발언권 승인 및 행사 채팅 운영 절차" },
  { id: "security-network", category: "보안 규격", title: "09. 기업 보안팀 사전검토 및 네트워크 가이드", desc: "데이터 저장 위치와 전송 경로, 사내 전용망·VPN·폐쇄망 배치 모델 및 계정·인증 통제 규격" },
  { id: "backup-recovery", category: "장애 대비", title: "10. 백업 및 새 장비 장애복구 매뉴얼", desc: "사내 DB·내장 HTTPS·도메인 설정 무중단 백업 및 새 서버 이전 시 설치→복원→재발급 표준 절차" },
  { id: "troubleshooting-faq", category: "문제 해결", title: "11. 장애대응 실무 FAQ", desc: "폐쇄망 카메라·마이크 권한, 사설 인증서 신뢰 등록, 방화벽 통신 점검 등 자주 묻는 실무 질문" },
  { id: "checklist", category: "검수 기준", title: "12. 설치완료 검수 체크리스트", desc: "고객사 서버 납품 및 사내망 구축 완료 시 고객 IT·보안팀과 함께 점검하는 공식 검수 항목표" }
];

// 8. 도입 전 자주 묻는 질문 8선 (WorkNexusProductShowcase FAQ + 최신 라이선스 반영)
const worknexusFaqs = [
  {
    q: "인당 과금(Per-Seat) 방식인가요, 동시접속 라이선스 방식인가요?",
    a: "WorkNexus는 전 사원 계정 등록 수에 제한이 없으며, 실제 동시에 접속해 업무·회의를 이용하는 '동시접속 인원(50명·100명·200명·300명 등)' 기준으로 합리적인 라이선스를 제공합니다. 따라서 휴가자, 외근자, 퇴근자는 동시접속 좌석을 차지하지 않으며 신입사원이나 인턴 계정을 추가 등록해도 추가 좌석 구독료가 발생하지 않습니다."
  },
  {
    q: "P2P 통신 방식을 사용하나요? 대외비 화면공유 영상이 외부에 저장되나요?",
    a: "참여자 간 직접 연결(P2P)을 전면 제거하고, 회의실 화상회의·1:1 통화·화면공유·근거리 대화·타운홀 미디어를 모두 고객사 서버의 내장 SFU 미디어 엔진으로만 암호화 중계합니다. 실시간 화면공유 및 음성 스트림은 외부 클라우드로 전송되거나 서버에 무단 저장되지 않아 대외비 CAD 도면이나 연구 자료 유출을 원천 차단합니다."
  },
  {
    q: "인터넷 연결이 없는 100% 사내 폐쇄망(Air-Gapped)에서도 카메라·마이크·화면공유가 되나요?",
    a: "네. v1.0.9부터 별도의 복잡한 리버스 프록시 구축 없이 '내장 사내 HTTPS 게이트웨이'와 'WorkNexus 자체 인증기관(ECDSA P-256)'을 기본 탑재했습니다. 사내 IP 주소만으로도 브라우저 보안 컨텍스트(HTTPS/WSS)가 즉시 활성화되어 인터넷이 완전히 차단된 폐쇄망에서도 카메라, 마이크, 고화질 화면공유가 완벽히 동작합니다."
  },
  {
    q: "사내 계정이 없는 외부 협력업체나 고객사도 회의에 참석할 수 있나요?",
    a: "네. 회의 예약 시 발급되는 '외부 참석 시한부 링크'를 전달하면 협력업체 담당자는 프로그램 설치나 회원가입 없이 웹 브라우저로 즉시 참석할 수 있습니다. 해당 링크는 회의 시작 30분 전부터 종료 30분 후까지만 열리며, 이름 옆에 '외부' 배지가 표시되고 지정된 회의실 하나에만 격리 입장하므로 사내 다른 공간이나 자료에는 접근할 수 없습니다."
  },
  {
    q: "타운홀 미팅과 대강당은 몇 명까지 참여 가능한가요?",
    a: "가상 사옥 건물 내부에는 부서 발표와 교육을 위한 '100명 규모 대강당'이 기본으로 제공됩니다. 전사 타운홀 미팅이나 외부 고객 초청 웨비나가 필요한 경우 별도 옵션인 '타운홀·웨비나(210석 가상 강당)'를 통해 최대 200명까지 동시 참여할 수 있으며, 발표자 무대 제어·손들기 발언권 승인·시스템 사운드 공유·행사 채팅을 지원합니다."
  },
  {
    q: "일반 사무용 저사양 노트북이나 공장 현장 태블릿에서도 잘 돌아가나요?",
    a: "네. WebGL 하드웨어 가속 및 회의 중 3D 절전 모드를 지원할 뿐 아니라, 그래픽 부담을 완전히 덜어낸 초경량 '💻 2D 업무 모드'를 기본 제공합니다. 3D에서 회의를 하다가 클릭 한 번으로 2D 업무 화면으로 전환해도 진행 중인 음성 통화와 화면공유가 끊김 없이 그대로 유지됩니다."
  },
  {
    q: "서버는 어떤 운영체제(OS)를 지원하며 어떻게 설치하나요?",
    a: "Windows(Windows 10/11, Windows Server)는 원클릭 통합 설치 프로그램과 시스템 트레이 운영 도구를 제공하며, Linux(Ubuntu 등)는 오프라인 설치·업데이트가 가능한 Docker 패키지 묶음을 제공합니다. 외부 통신이 필요 없는 Ed25519 오프라인 서명 라이선스로 즉시 개통됩니다."
  },
  {
    q: "재택근무자나 해외 출장자도 안전하게 접속할 수 있나요?",
    a: "고객사의 보안 정책에 따라 사내 VPN 경로로 접속하거나, 방화벽 인바운드 포트 개방이 필요 없는 고객 전용 고정 보안 도메인(터널링)을 선택해 구성할 수 있습니다. 또한 관리자 콘솔에서 언제든 버튼 하나로 외부 터널을 차단하고 순수 사내 폐쇄망 모드로 즉시 전환할 수 있습니다."
  }
];

export default function WorkNexusSection() {
  // 히어로 스마트폰 쇼츠 탭 상태
  const [heroShortIdx, setHeroShortIdx] = useState<number>(0);

  // 인터랙티브 영상 투어 상태 (0~5: 시연 영상 6종, 6: 12종 기술백서 탭)
  const [activeTourTab, setActiveTourTab] = useState<number>(0);
  const [chapterStartSec, setChapterStartSec] = useState<number | null>(null);

  // 5대 업무 여정(Journey 01~05) 선택 탭
  const [activeJourneyIdx, setActiveJourneyIdx] = useState<number>(0);

  // 이미지 원본 확대 라이트박스 모달 상태
  const [lightboxImg, setLightboxImg] = useState<{ src: string; title: string; caption?: string } | null>(null);

  // 사내망 원클릭 진단 모달
  const [isDiagOpen, setIsDiagOpen] = useState<boolean>(false);

  // 도입 문의 및 기술 백서 신청 모달 (확장된 선택 항목 포함)
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [selectedManualTitle, setSelectedManualTitle] = useState<string>("");
  const [manualFormData, setManualFormData] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    inquiryType: "도입 상담·견적",
    concurrency: "50명",
    serverOs: "Windows 서버",
    networkEnv: "사내망 + 외부·재택 접속",
    townhallOption: false,
    memo: ""
  });
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [formValidationMsg, setFormValidationMsg] = useState<string>("");

  const currentHeroShort = heroShortsList[heroShortIdx];
  const heroShortsPlaylist = [
    ...heroShortsList.slice(heroShortIdx).map((s) => s.id),
    ...heroShortsList.slice(0, heroShortIdx).map((s) => s.id)
  ].join(",");

  const currentTourVideo = tourVideosList[activeTourTab] || tourVideosList[0];

  const handleSelectTourTab = (idx: number) => {
    setActiveTourTab(idx);
    setChapterStartSec(null);
  };

  const handleRequestManual = (manualTitle: string) => {
    setSelectedManualTitle(manualTitle);
    setFormValidationMsg("");
    setIsManualModalOpen(true);
  };

  // 백엔드 게시판(/api/request-manual)에 자동 저장
  const saveToBoard = async () => {
    try {
      const conditionSummary = `[유형: ${manualFormData.inquiryType} | 동시접속: ${manualFormData.concurrency} | 서버: ${manualFormData.serverOs} | 망구성: ${manualFormData.networkEnv}${manualFormData.townhallOption ? " | 200석 타운홀 옵션 포함" : ""}]`;
      await fetch("/api/request-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: manualFormData.company,
          name: manualFormData.name,
          phone: manualFormData.phone,
          email: manualFormData.email,
          manualTitle: selectedManualTitle || manualFormData.inquiryType,
          memo: `${conditionSummary}\n${manualFormData.memo}`.trim()
        })
      });
    } catch (err) {
      console.warn("게시판 자동 저장 비동기 오류:", err);
    }
  };

  const buildMailContent = () => {
    const subject = `[WorkNexus 도입문의/기술백서] ${manualFormData.inquiryType} · ${manualFormData.company.trim()} - ${manualFormData.name.trim()}`;
    const body = [
      `회사명: ${manualFormData.company.trim()}`,
      `담당자: ${manualFormData.name.trim()}`,
      `연락처: ${manualFormData.phone.trim() || "-"}`,
      `회신 이메일: ${manualFormData.email.trim()}`,
      `신청 자료/유형: ${selectedManualTitle || manualFormData.inquiryType}`,
      "",
      "[도입 검토 조건]",
      `문의 유형: ${manualFormData.inquiryType}`,
      `동시접속 규모: ${manualFormData.concurrency} (전 사원 계정 등록 무제한)`,
      `서버 환경: ${manualFormData.serverOs}`,
      `접속 환경: ${manualFormData.networkEnv}`,
      `추가 옵션: ${manualFormData.townhallOption ? "타운홀·웨비나(200석) 포함" : "기본 제공(100명 대강당·화상회의·2D모드·외부링크)"}`,
      "",
      "[문의 내용]",
      manualFormData.memo.trim() || "확인 후 담당자 회신 및 기술 백서 안내 부탁드립니다."
    ].join("\n");

    return { subject, body };
  };

  const validateForm = () => {
    if (!manualFormData.company.trim() || !manualFormData.name.trim() || !manualFormData.email.trim()) {
      setFormValidationMsg("회사명, 담당자 성함, 회신 이메일을 모두 입력해 주세요.");
      return false;
    }
    setFormValidationMsg("");
    return true;
  };

  const handleOpenGmail = () => {
    if (!validateForm()) return;
    saveToBoard();
    const { subject, body } = buildMailContent();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=yujinit2005@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  };

  const handleOpenMailto = () => {
    if (!validateForm()) return;
    saveToBoard();
    const { subject, body } = buildMailContent();
    const mailtoUrl = `mailto:yujinit2005@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("yujinit2005@gmail.com");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const currentJourney = productJourneys[activeJourneyIdx];

  return (
    <section id="worknexus" className="py-24 px-4 sm:px-6 relative overflow-hidden bg-slate-950 text-white border-t border-slate-900">
      {/* 백그라운드 네온 오로라 */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-600/15 rounded-full blur-[130px] pointer-events-none" />

      {/* 사내망 원클릭 진단 모달 */}
      <NetworkDiagnosticsModal isOpen={isDiagOpen} onClose={() => setIsDiagOpen(false)} />

      {/* 이미지 확대 라이트박스 모달 */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white">{lightboxImg.title}</h4>
                {lightboxImg.caption && <p className="text-xs text-slate-400 mt-0.5">{lightboxImg.caption}</p>}
              </div>
              <button
                onClick={() => setLightboxImg(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
              >
                ✕ 닫기
              </button>
            </div>
            <div className="p-2 sm:p-4 bg-slate-950 flex items-center justify-center max-h-[80vh] overflow-auto">
              <img
                src={lightboxImg.src}
                alt={lightboxImg.title}
                className="max-h-[74vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10 space-y-24">
        {/* ===================================================================== */}
        {/* 1. HERO 섹션: 좌측 핵심 가치 & 액션 버튼 + 우측 스마트폰 프레임 쇼츠 3편 */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* 좌측 텍스트 및 CTA (7칸) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs font-bold tracking-wide uppercase shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              ON-PREMISE · BROWSER · 3D & 2D SPATIAL COLLABORATION (v1.0.9)
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-white tracking-tight leading-[1.12]">
              공간에서 만나고, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
                회의에서 결정하는 사내 가상 오피스
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              출근, 좌석, 근거리 대화, 방별 격리 회의실, 4K 도면 공유, 100명 대강당과 200석 타운홀 웨비나를 하나의 업무 경험으로 연결합니다.
              별도 프로그램 설치 없이 웹 브라우저에서 10초 만에 출근하고,{" "}
              <strong className="text-emerald-300">전 사원 등록 무제한 · 동시접속 라이선스</strong>와{" "}
              <strong className="text-purple-300">100% 고객사 서버(On-Premise)</strong> 운영으로 구독료 부담과 기밀 유출을 동시에 해결하세요.
            </p>

            {/* 핵심 액션 버튼 그룹 */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-950/60 transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-current text-amber-300" />
                <span>3D 오피스 라이브 데모 체험하기 ↗</span>
              </a>

              <a
                href={PRODUCT_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm transition-all"
              >
                <span>공식 제품 포털 (worknexus.calamus.ai.kr)</span>
                <ExternalLink className="w-4 h-4 text-purple-400" />
              </a>

              <button
                onClick={() => setIsDiagOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-purple-500/40 text-purple-300 hover:text-white font-bold text-xs sm:text-sm transition-all"
              >
                <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>사내망 원클릭 진단</span>
              </button>

              <button
                onClick={() => handleRequestManual("WorkNexus 도입 상담 및 견적 문의")}
                className="inline-flex items-center gap-2 px-4 py-4 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 font-bold text-xs sm:text-sm transition-all"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>도입 상담 · 백서 신청</span>
              </button>
            </div>

            {/* 4대 핵심 요약 띠 (MarketingApp 동일 구조 + 강화) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/25">
                <strong className="block text-sm font-extrabold text-white">3D & 2D 업무 공간</strong>
                <span className="text-xs text-slate-400 mt-0.5 block">8종 근태 · 2.5m 근거리 대화</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/25">
                <strong className="block text-sm font-extrabold text-emerald-300">동시접속 라이선스</strong>
                <span className="text-xs text-slate-400 mt-0.5 block">등록 사원 무제한 · 휴가 차감 0</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/25">
                <strong className="block text-sm font-extrabold text-purple-300">회의실별 격리 공유</strong>
                <span className="text-xs text-slate-400 mt-0.5 block">사내 SFU · P2P 완전 제거</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/25">
                <strong className="block text-sm font-extrabold text-amber-300">대강당 · 타운홀</strong>
                <span className="text-xs text-slate-400 mt-0.5 block">100명 기본 · 200명(옵션)</span>
              </div>
            </div>
          </div>

          {/* 우측 스마트폰 프레임 쇼츠 플레이어 (5칸) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* 쇼츠 선택 칩 탭 */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-3">
              {heroShortsList.map((item, idx) => {
                const isActive = idx === heroShortIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHeroShortIdx(idx)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all border ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-transparent shadow-lg shadow-blue-950/60"
                        : "bg-slate-900/80 text-slate-300 border-indigo-500/30 hover:text-white hover:border-indigo-400"
                    }`}
                  >
                    <span>{item.chip}</span>
                    {item.isNew && (
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black">
                        NEW
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 스마트폰 베젤 프레임 (9:16) */}
            <div className="w-full max-w-[300px] aspect-[9/16] rounded-[32px] overflow-hidden border-[6px] border-slate-800 bg-slate-950 shadow-[0_25px_70px_rgba(37,99,235,0.28)] ring-1 ring-indigo-500/40 relative">
              <iframe
                key={currentHeroShort.id}
                src={`https://www.youtube-nocookie.com/embed/${currentHeroShort.id}?autoplay=1&mute=1&loop=1&playlist=${heroShortsPlaylist}&playsinline=1&rel=0&modestbranding=1`}
                title={currentHeroShort.title}
                loading="lazy"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="mt-3 text-center text-xs text-slate-400">
              <span>{currentHeroShort.caption}</span> ·{" "}
              <a
                href={`https://youtube.com/shorts/${currentHeroShort.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-300 hover:text-indigo-200 font-bold underline"
              >
                유튜브에서 보기 ↗
              </a>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. 처음 보시는 분께 — 회사에서 함께 일하는 방법을 한 화면에 모았습니다 */}
        {/* ===================================================================== */}
        <div className="rounded-3xl p-6 sm:p-10 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-950 shadow-xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider">
              처음 보시는 분께 · Everyday Office Guide
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white mt-2 leading-tight">
              복잡한 회의 도구가 아니라, <br className="hidden sm:inline" />
              회사에서 함께 일하는 방법을 한 화면에 모았습니다
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              WorkNexus는 사무실에 직접 가지 못하는 날에도 동료를 만나고, 근거리에서 대화하고, 회의실 화면을 공유하며,
              100명 대강당과 타운홀·웨비나 행사(최대 200명, 별도 옵션)까지 진행하는 공간입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {everydaySituations.map((sit, idx) => (
              <article
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-extrabold text-indigo-400">{sit.badge}</span>
                  <h4 className="text-base font-bold text-white mt-1.5 mb-2 leading-snug">{sit.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{sit.text}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-indigo-200 font-semibold leading-relaxed">
                  ✨ 달라지는 점: {sit.result}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. LIVE DEMO GLIMPSE (#preview): 입장 전에, 어떤 오피스인지 먼저 보세요 */}
        {/* ===================================================================== */}
        <div id="worknexus-preview" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
                LIVE DEMO GLIMPSE · 6대 핵심 공간 프리뷰
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white mt-1">
                입장 전에, 어떤 오피스인지 먼저 보세요
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                실제 배포된 데모 공간의 작동 화면입니다. 이미지를 클릭하면 원본 크기로 확대되며, 하단 링크를 누르면 해당 층 데모로 즉시 입장합니다.
              </p>
            </div>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg"
            >
              <span>전체 3D 데모 사옥 입장하기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveDemoPreviews.map((item) => (
              <article
                key={item.floor}
                className="rounded-2xl overflow-hidden bg-slate-900/85 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div
                    className="relative h-52 bg-slate-950 overflow-hidden cursor-zoom-in"
                    onClick={() => setLightboxImg({ src: item.image, title: item.title, caption: item.description })}
                  >
                    <img
                      src={item.image}
                      alt={`${item.title} 시연 화면`}
                      loading="lazy"
                      className="w-full h-full object-contain bg-[#080d18] group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute left-3 top-3 px-2.5 py-1 rounded-full bg-slate-900/90 border border-indigo-400/40 text-[11px] font-extrabold text-indigo-200 shadow">
                      {item.floor}
                    </span>
                    <span className="absolute right-3 bottom-3 px-2.5 py-1 rounded-lg bg-black/80 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" /> 크게 보기
                    </span>
                  </div>

                  <div className="p-5">
                    <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-800/70 flex items-center justify-between">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-extrabold text-indigo-300 hover:text-indigo-200 flex items-center gap-1.5"
                  >
                    <span>이 공간에서 데모 시작하기 ↗</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setLightboxImg({ src: item.image, title: item.title, caption: item.description })}
                    className="text-[11px] text-slate-400 hover:text-white font-semibold"
                  >
                    화면 확대
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 4. PRODUCT WALKTHROUGH: 공식 시연 영상 6종(챕터 이동) & 12종 기술백서 */}
        {/* ===================================================================== */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" /> PRODUCT WALKTHROUGH · VIDEO & WHITEPAPERS
              </span>
              <h3 className="mt-1 text-2xl sm:text-3xl font-black text-white">
                시연 영상과 타임스탬프 챕터로 기능 하나하나를 검증하세요
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
                5분 전체 투어, 4분 30초 협력업체 주간회의, 신규 B2B 쇼츠(EP.4 동시접속·EP.5 도면 워룸) 및 12종 공식 기술 백서를 한곳에 모았습니다.
              </p>
            </div>
          </div>

          {/* 영상 6종 + 기술백서 1종 탭 바 */}
          <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-800">
            {tourVideosList.map((vid, idx) => {
              const isSelected = activeTourTab === idx;
              return (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => handleSelectTourTab(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-lg"
                      : "bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <Play className="w-3 h-3 fill-current text-purple-200" />
                  <span>{vid.tabLabel}</span>
                  {vid.isNew && (
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black">
                      NEW
                    </span>
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handleSelectTourTab(99)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 border ${
                activeTourTab === 99
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-transparent shadow-lg"
                  : "bg-slate-950/80 text-amber-300 border-amber-500/30 hover:border-amber-400"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📚 엔터프라이즈 기술 백서 (12종)</span>
            </button>
          </div>

          {activeTourTab === 99 ? (
            /* 12종 엔터프라이즈 기술 백서 센터 */
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 border border-purple-500/30 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-purple-300">Enterprise Documentation Center</span>
                  <h4 className="text-lg sm:text-xl font-black text-white mt-0.5">
                    고객사 IT·보안팀 검토 및 서버 운영을 위한 공식 기술 백서 (12종)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    기업 보안 통제 및 지식재산권(IP) 보호를 위해 도입 문의 및 기업 인증 확인 후 열람 권한을 제공해 드립니다.
                  </p>
                </div>
                <button
                  onClick={() => handleRequestManual("엔터프라이즈 12종 기술 백서 전체 패키지")}
                  className="shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
                >
                  <FileText className="w-4 h-4" />
                  <span>전체 백서 일괄 열람 신청</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {manualsList.map((m) => (
                  <div
                    key={m.id}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                          {m.category}
                        </span>
                        <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3" /> 기업 인증 전용
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-1.5">{m.title}</h5>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{m.desc}</p>
                    </div>
                    <button
                      onClick={() => handleRequestManual(m.title)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-purple-950/80 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>기술 백서 열람 신청</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 영상 플레이어 + 우측 챕터 바로가기 */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-indigo-500/30 shadow-2xl">
                  <iframe
                    key={`${currentTourVideo.youtubeId}-${chapterStartSec ?? "init"}`}
                    src={`https://www.youtube-nocookie.com/embed/${currentTourVideo.youtubeId}?rel=0&modestbranding=1&playsinline=1${
                      chapterStartSec !== null ? `&start=${chapterStartSec}&autoplay=1` : ""
                    }`}
                    title={currentTourVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                        {currentTourVideo.badge}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white">{currentTourVideo.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{currentTourVideo.desc}</p>
                  </div>
                  <a
                    href={
                      currentTourVideo.isShorts
                        ? `https://youtube.com/shorts/${currentTourVideo.youtubeId}`
                        : `https://youtu.be/${currentTourVideo.youtubeId}${chapterStartSec ? `?t=${chapterStartSec}` : ""}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>YouTube에서 크게 보기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* 우측 타임스탬프 챕터 리스트 */}
              <div className="lg:col-span-4 bg-slate-950/90 p-5 rounded-2xl border border-slate-800 flex flex-col max-h-[460px]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-extrabold text-white">영상 챕터 바로가기</span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    {currentTourVideo.chapters.length}개 장면
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">{currentTourVideo.subtitle}</p>

                <div className="space-y-1.5 overflow-y-auto pr-1 flex-1">
                  {currentTourVideo.chapters.map((ch) => {
                    const isCurrent = chapterStartSec === ch.seconds;
                    return (
                      <button
                        key={ch.seconds}
                        type="button"
                        onClick={() => setChapterStartSec(ch.seconds)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-2.5 border ${
                          isCurrent
                            ? "bg-indigo-950/80 border-indigo-500/70 text-white font-bold"
                            : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-700"
                        }`}
                      >
                        <span className="font-mono text-[11px] font-extrabold text-indigo-400 shrink-0 w-9">
                          {ch.time}
                        </span>
                        <span className="truncate">{ch.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* 5. 5대 핵심 업무 여정 (01~05 Journeys) & 23종 실제 기능 화면 갤러리 */}
        {/* ===================================================================== */}
        <div>
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">
              5 CORE USER JOURNEYS · 23 REAL PRODUCT SCREENS
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white mt-1">
              로그인부터 외부 협력 · 200명 대규모 행사까지
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              정적인 설명이 아니라 실제 임직원과 협력업체가 하루 동안 경험하는 5단계 업무 흐름과 23장의 실제 작동 화면입니다.
            </p>
          </div>

          {/* 5대 여정 선택 탭 버튼 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mb-6">
            {productJourneys.map((j, idx) => {
              const isSelected = activeJourneyIdx === idx;
              return (
                <button
                  key={j.number}
                  type="button"
                  onClick={() => setActiveJourneyIdx(idx)}
                  className={`p-4 rounded-2xl text-left transition-all border ${
                    isSelected
                      ? "bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/40"
                      : "bg-slate-900/50 border-slate-800/90 hover:bg-slate-900/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-indigo-400">JOURNEY {j.number}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{j.images.length}장</span>
                  </div>
                  <div className="text-xs font-bold text-white line-clamp-2 leading-snug">{j.title}</div>
                </button>
              );
            })}
          </div>

          {/* 선택된 여정 상세 카드 & 스크린샷 그리드 */}
          <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentJourney.accent} border flex items-center justify-center font-black text-lg shrink-0`}>
                  {currentJourney.number}
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-indigo-400 tracking-wider uppercase">
                    {currentJourney.eyebrow}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white mt-0.5">{currentJourney.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed max-w-4xl">
                    {currentJourney.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentJourney.images.map((img) => (
                <figure
                  key={img.src}
                  className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all group cursor-zoom-in"
                  onClick={() => setLightboxImg(img)}
                >
                  <div className="relative h-48 bg-[#060a13] overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.title}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute right-2.5 bottom-2.5 px-2.5 py-1 rounded-lg bg-black/80 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      원본 크게 보기 ↗
                    </span>
                  </div>
                  <figcaption className="p-4">
                    <strong className="block text-sm font-bold text-white">{img.title}</strong>
                    <span className="block text-xs text-slate-400 mt-1 leading-relaxed">{img.caption}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 6. "넥서스 오피스 사람들" 실무 에피소드 5편 (EP.1~EP.5 스토리북) */}
        {/* ===================================================================== */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-10">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
              REAL-WORLD EPISODES · 넥서스 오피스 사람들 시리즈 (EP.1 ~ EP.5)
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
              직장인이 매일 겪는 5가지 난감한 순간, WorkNexus는 이렇게 해결합니다
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              실제 기업 현장에서 가장 많이 묻는 소음 차단, 보안팀 검증, 자리 비움 근태, 인당 구독료 절감, 대외비 도면 공유 시나리오입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sitcomEpisodes.map((ep) => (
              <article
                key={ep.ep}
                className="rounded-2xl p-5 bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-black">
                      {ep.ep}
                    </span>
                    {ep.videoUrl && (
                      <a
                        href={ep.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-red-300 hover:text-red-200 flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" /> 쇼츠 영상 보기 ↗
                      </a>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">{ep.title}</h4>
                  <p className="text-xs font-bold text-amber-200/90 mb-2.5">{ep.hook}</p>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{ep.story}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                  {ep.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}

            {/* 6번째 카드: 아키텍처 마인드맵 요약 카드 */}
            <article className="rounded-2xl p-5 bg-gradient-to-br from-emerald-950/30 to-slate-950 border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-black">
                  ARCHITECTURE · v1.0.9
                </span>
                <h4 className="text-base font-bold text-white mt-3 mb-2">
                  사내 내장 SFU & 자체 인증기관(HTTPS) 아키텍처
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  참여자 간 P2P 연결을 제거하고 고객 서버의 SFU로 모든 미디어를 통합합니다. v1.0.9 내장 HTTPS 게이트웨이와 자체 CA로 리버스 프록시 없이도 폐쇄망 카메라·마이크·화면공유를 즉시 개통합니다.
                </p>
                <div
                  className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 cursor-zoom-in mb-3"
                  onClick={() =>
                    setLightboxImg({
                      src: `${IMG_BASE}/architecture-mindmap.png`,
                      title: "WorkNexus 사내 SFU 미디어 통신 구조 마인드맵",
                      caption: "1:1 통화, 회의실 화상회의, 근거리 공간 대화, 200명 타운홀을 고객 서버 SFU로 단일화"
                    })
                  }
                >
                  <img
                    src={`${IMG_BASE}/architecture-mindmap.png`}
                    alt="WorkNexus 통신구조 마인드맵"
                    className="w-full h-28 object-cover hover:scale-105 transition-transform"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setLightboxImg({
                    src: `${IMG_BASE}/architecture-mindmap.png`,
                    title: "WorkNexus 사내 SFU 미디어 통신 구조 마인드맵",
                    caption: "1:1 통화, 회의실 화상회의, 근거리 공간 대화, 200명 타운홀을 고객 서버 SFU로 단일화"
                  })
                }
                className="text-xs font-bold text-emerald-300 hover:text-emerald-200 flex items-center gap-1"
              >
                <Maximize2 className="w-3.5 h-3.5" /> 아키텍처 다이어그램 크게 보기 ↗
              </button>
            </article>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 7. 일반 클라우드 SaaS vs WorkNexus 비교표 & 4단계 도입 프로세스 */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 좌측: TCO & 보안 아키텍처 비교표 (7칸) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase">
              TCO & Architecture Comparison
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1 mb-4">
              인당 과금 클라우드 SaaS vs Calamus WorkNexus
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-3 font-bold">비교 항목</th>
                    <th className="py-3 px-3 font-bold">일반 클라우드 SaaS (인당 과금)</th>
                    <th className="py-3 px-3 font-bold text-purple-300 bg-purple-950/30 rounded-t-lg">
                      Calamus WorkNexus (구축형)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-white">과금 및 계정 등록</td>
                    <td className="py-3 px-3 text-slate-400">등록 사원 인당 매월 과금 (휴가·외근자도 부과)</td>
                    <td className="py-3 px-3 font-bold text-emerald-400 bg-purple-950/20">
                      전 사원 등록 무제한 · 동시접속 인원 기준 라이선스
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-white">데이터 및 도면 보안</td>
                    <td className="py-3 px-3 text-slate-400">외부 클라우드 서버 저장 및 파일 전송</td>
                    <td className="py-3 px-3 font-bold text-emerald-400 bg-purple-950/20">
                      100% 고객사 서버 보관 · 파일 반출 없는 4K 화면공유
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-white">미디어 전송 구조</td>
                    <td className="py-3 px-3 text-slate-400">P2P(IP 노출) 또는 외부 종량제 클라우드</td>
                    <td className="py-3 px-3 font-bold text-purple-300 bg-purple-950/20">
                      사내 내장 SFU 미디어 단일화 (P2P 완전 제거)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-white">폐쇄망(Air-Gap) 지원</td>
                    <td className="py-3 px-3 text-slate-400">인터넷 차단 시 사용 불가</td>
                    <td className="py-3 px-3 font-bold text-purple-300 bg-purple-950/20">
                      내장 사내 HTTPS(자체 CA) & 원클릭 폐쇄망 전환
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-white">대규모 행사 / 저사양</td>
                    <td className="py-3 px-3 text-slate-400">웨비나 애드온 고액 과금 / 3D 저사양 끊김</td>
                    <td className="py-3 px-3 font-bold text-cyan-300 bg-purple-950/20">
                      100명 대강당 기본(200석 타운홀 옵션) + 💻 2D 경량 모드
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 우측: 우리 조직에 맞춰 시작하는 4단계 도입 프로세스 (5칸) */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
                INTRODUCTION PROCESS
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                우리 조직에 맞춰 시작하는 4단계 도입 절차
              </h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  step: "01",
                  title: "데모 체험 & 네트워크 적합성 검토",
                  desc: "웹 브라우저 라이브 데모 및 원클릭 사내망 진단 도구로 3D/2D 공간 이동, 음성·화면공유, 대강당을 즉시 검증합니다."
                },
                {
                  step: "02",
                  title: "인프라 & 망분리 정책 설계",
                  desc: "동시접속 규모(50~300명+)에 맞춰 Windows 또는 Linux(Docker) 환경을 선정하고 순수 폐쇄망 또는 보안 외부 연결 정책을 확정합니다."
                },
                {
                  step: "03",
                  title: "원클릭 설치 & 내장 HTTPS 구성",
                  desc: "단일 설치 패키지를 배포하고 내장 HTTPS 게이트웨이(자체 CA 또는 사내 인증서) 및 부서·좌석·권한을 즉시 세팅합니다."
                },
                {
                  step: "04",
                  title: "오프라인 서명 라이선스 & 운영 지원",
                  desc: "외부 통신이 불필요한 Ed25519 서명 라이선스를 등록하고 관리자 콘솔에서 백업·외부 터널·근태 리포트를 자율 운영합니다."
                }
              ].map((p) => (
                <div key={p.step} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex gap-3.5">
                  <span className="text-sm font-black text-indigo-400 font-mono shrink-0 mt-0.5">{p.step}</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{p.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 8. AEO / GEO 최적화: 도입 전에 많이 묻는 질문 8선 (FAQ) */}
        {/* ===================================================================== */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
                FREQUENTLY ASKED QUESTIONS · AEO / GEO FACT SHEET
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                도입 전에 많이 묻는 질문 8선
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                경영진, 인사·총무팀, IT·보안팀이 도입 검토 시 가장 자주 확인하는 핵심 기술 및 라이선스 Q&A입니다.
              </p>
            </div>
            <button
              onClick={() => handleRequestManual("WorkNexus 맞춤형 도입 상담 및 견적 요청")}
              className="shrink-0 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              <Mail className="w-4 h-4" />
              <span>도입 상담 · 견적 문의하기</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {worknexusFaqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-950/85 border border-slate-800">
                <h4 className="text-sm font-bold text-indigo-300 flex items-start gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Q. {faq.q}</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* [Gated Lead Modal] 도입 문의 및 기술 백서 신청 모달 (도입 조건 선택 통합) */}
      {/* ===================================================================== */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-purple-500/40 p-6 sm:p-8 shadow-2xl text-left my-8">
            <button
              onClick={() => setIsManualModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>WorkNexus Enterprise Inquiry</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">On-Premise Collaboration</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5">
              WorkNexus 도입 문의 및 기술 백서 신청
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              아래 내용을 입력하고 <strong className="text-purple-300">Gmail로 문의 작성</strong>을 누르면 내용이 채워진 메일 작성 창이 열립니다. 확인 후 보내기만 누르면 담당자가 신속히 회신드립니다.
            </p>

            {selectedManualTitle && (
              <div className="mb-4 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-400">신청 항목:</span>
                <span className="font-bold text-purple-300">{selectedManualTitle}</span>
              </div>
            )}

            {formValidationMsg && (
              <div className="mb-3 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs">
                {formValidationMsg}
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    회사 / 기관명 <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: (주)유진에이아이"
                    value={manualFormData.company}
                    onChange={(e) => setManualFormData({ ...manualFormData, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    담당자 성함/직책 <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: 홍길동 팀장"
                    value={manualFormData.name}
                    onChange={(e) => setManualFormData({ ...manualFormData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">연락처</label>
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    value={manualFormData.phone}
                    onChange={(e) => setManualFormData({ ...manualFormData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    회신 이메일 <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={manualFormData.email}
                    onChange={(e) => setManualFormData({ ...manualFormData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* 도입 검토 조건 선택 (worknexus.calamus.ai.kr 동일 항목) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">문의 유형</label>
                  <select
                    value={manualFormData.inquiryType}
                    onChange={(e) => setManualFormData({ ...manualFormData, inquiryType: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none"
                  >
                    <option value="도입 상담·견적">도입 상담·견적</option>
                    <option value="기술 백서 열람">기술 백서 열람</option>
                    <option value="데모·시연 요청">데모·시연 요청</option>
                    <option value="기술 문의(설치·보안)">기술 문의(설치·보안)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">동시접속 규모</label>
                  <select
                    value={manualFormData.concurrency}
                    onChange={(e) => setManualFormData({ ...manualFormData, concurrency: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none"
                  >
                    <option value="50명">50명</option>
                    <option value="100명">100명</option>
                    <option value="200명">200명</option>
                    <option value="300명">300명</option>
                    <option value="300명 초과(맞춤)">300명 초과(맞춤)</option>
                    <option value="아직 모름">아직 모름</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">서버 환경</label>
                  <select
                    value={manualFormData.serverOs}
                    onChange={(e) => setManualFormData({ ...manualFormData, serverOs: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none"
                  >
                    <option value="Windows 서버">Windows 서버</option>
                    <option value="Linux 서버(도커)">Linux 서버(도커)</option>
                    <option value="아직 미정">아직 미정</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">접속 환경</label>
                  <select
                    value={manualFormData.networkEnv}
                    onChange={(e) => setManualFormData({ ...manualFormData, networkEnv: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none"
                  >
                    <option value="사내망 + 외부·재택 접속">사내망 + 외부·재택</option>
                    <option value="사내망만(폐쇄망)">사내망만(폐쇄망)</option>
                    <option value="모름">모름</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">
                  추가 옵션: <strong className="text-amber-300">타운홀·웨비나 (210석 가상 강당, 최대 200명)</strong>{" "}
                  <span className="text-[11px] text-slate-400 block sm:inline">(100명 대강당·화상회의·2D모드·외부링크는 기본 제공)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setManualFormData({ ...manualFormData, townhallOption: !manualFormData.townhallOption })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shrink-0 ${
                    manualFormData.townhallOption
                      ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                      : "bg-slate-900 border-slate-700 text-slate-400"
                  }`}
                >
                  {manualFormData.townhallOption ? "✓ 옵션 포함" : "+ 옵션 선택"}
                </button>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">문의 내용</label>
                <textarea
                  rows={3}
                  placeholder="도입 목적, 현재 사용 중인 협업 도구, 필요한 기술 백서나 궁금한 점을 자유롭게 적어 주세요."
                  value={manualFormData.memo}
                  onChange={(e) => setManualFormData({ ...manualFormData, memo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenGmail}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Gmail로 문의 작성 ↗</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenMailto}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
                  >
                    <span>다른 메일 앱으로 보내기</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{isCopied ? "복사됨!" : "주소 복사"}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 text-center mt-3">
                  입력한 내용은 안전하게 접수되며, 여러분의 메일 계정에서{" "}
                  <span className="text-purple-300 font-semibold">yujinit2005@gmail.com</span>(으)로 직접 보내집니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
