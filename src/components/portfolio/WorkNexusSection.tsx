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
  Sparkle,
  Activity,
  Layers,
  CalendarCheck,
  BookOpen,
  FileText,
  Download,
  Mail,
  Copy,
  Check
} from "lucide-react";
import NetworkDiagnosticsModal from "./NetworkDiagnosticsModal";

// 5분 안내 영상 10대 인터랙티브 챕터
const videoChapters = [
  { time: "0:00", seconds: 0, title: "인트로 — 사내 완결형 보안 협업 워룸 개요" },
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
  const [isDiagOpen, setIsDiagOpen] = useState<boolean>(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [selectedManualTitle, setSelectedManualTitle] = useState<string>("");
  const [manualFormData, setManualFormData] = useState({ company: "", name: "", email: "", phone: "", memo: "" });
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [formValidationMsg, setFormValidationMsg] = useState<string>("");

  const handleRequestManual = (manualTitle: string) => {
    setSelectedManualTitle(manualTitle);
    setFormValidationMsg("");
    setIsManualModalOpen(true);
  };

  // 백엔드 게시판(DB/파일)에 자동 저장
  const saveToBoard = async () => {
    try {
      await fetch("/api/request-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: manualFormData.company,
          name: manualFormData.name,
          phone: manualFormData.phone,
          email: manualFormData.email,
          manualTitle: selectedManualTitle,
          memo: manualFormData.memo
        })
      });
    } catch (err) {
      console.warn("게시판 자동 저장 비동기 오류:", err);
    }
  };

  const buildMailContent = () => {
    const subject = `[WorkNexus 도입문의/기술백서 신청] ${manualFormData.company} - ${manualFormData.name}`;
    const body = `[WorkNexus 기술 백서 및 도입 문의]

■ 회사 / 기관명: ${manualFormData.company}
■ 담당자: ${manualFormData.name}
■ 연락처: ${manualFormData.phone || "미입력"}
■ 회신 이메일: ${manualFormData.email}
■ 신청 백서: ${selectedManualTitle || "엔터프라이즈 종합 백서"}
${manualFormData.memo ? `\n■ 문의 내용:\n${manualFormData.memo}\n` : ""}
확인 후 담당자 회신 및 기술 백서 열람 권한 전달 부탁드립니다.`;

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

  // 1. Gmail로 작성
  const handleOpenGmail = () => {
    if (!validateForm()) return;
    saveToBoard();
    const { subject, body } = buildMailContent();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=yujinit2005@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  };

  // 2. 다른 메일 앱으로 보내기 (mailto)
  const handleOpenMailto = () => {
    if (!validateForm()) return;
    saveToBoard();
    const { subject, body } = buildMailContent();
    const mailtoUrl = `mailto:yujinit2005@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  // 3. 담당자 이메일 주소 복사
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("yujinit2005@gmail.com");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

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
      desc: "추가 구독료 없는 단일 서버 사내망 구축형 프라이빗 협업 플랫폼의 핵심 특징을 숏폼 영상으로 빠르게 전달합니다."
    }
  ];

  // 12종 공식 기술 백서 & 엔터프라이즈 가이드 데이터셋
  const manualsList = [
    {
      id: "user-guide",
      category: "사용자 가이드",
      title: "01. 일반 사용자 매뉴얼",
      desc: "무설치 웹 브라우저 출근, 3D 아바타 세팅, 근접 공간 음향, 1:1 통화 및 회의실 이용 방법",
      size: "4.9 MB",
      badge: "User"
    },
    {
      id: "admin-guide",
      category: "관리자 가이드",
      title: "02. 고객 관리자 매뉴얼",
      desc: "부서 및 조직도 구성, 관리자 권한 설정, 3D 사옥 좌석 배치 및 근태 기록 엑셀(CSV) 추출",
      size: "1.8 MB",
      badge: "Admin"
    },
    {
      id: "server-ops",
      category: "서버 운영",
      title: "03. 서버 운영자 매뉴얼",
      desc: "초경량 독립 실행형 프로세스 구동, 백그라운드 서비스 관리 및 사내 고속 암호화 DB 무결성 점검",
      size: "492 KB",
      badge: "Ops"
    },
    {
      id: "https-tunnel",
      category: "네트워크 보안",
      title: "04. 제로트러스트 보안 터널 구축 가이드",
      desc: "제로트러스트 사내 암호화 터널링 연동 및 기업 방화벽 무포트 개방 원격 접속 가이드",
      size: "1.0 MB",
      badge: "Security"
    },
    {
      id: "windows-install",
      category: "서버 설치",
      title: "05. Windows 서버 설치 매뉴얼",
      desc: "Windows 10/11 및 Windows Server 환경에서 별도 외부 종속성 없이 즉시 구동하는 절차",
      size: "854 KB",
      badge: "Windows"
    },
    {
      id: "linux-install",
      category: "서버 설치",
      title: "06. Linux VM 설치 매뉴얼",
      desc: "Ubuntu / Rocky Linux 사내 서버 환경 배포 및 백그라운드 시스템 서비스 데몬 등록 절차",
      size: "373 KB",
      badge: "Linux"
    },
    {
      id: "meeting-screenshare",
      category: "화상회의",
      title: "07. 화상회의 & 화면공유 가이드",
      desc: "사내 완결형 SFU 미디어 채널 격리, 초저지연 화면 및 시스템 사운드 동시 송출, 문서 PiP 분리",
      size: "1.9 MB",
      badge: "Meeting"
    },
    {
      id: "townhall-guide",
      category: "세미나",
      title: "08. 100석 타운홀 세미나 가이드",
      desc: "전사 설명회 무대 발표자/청중 권한 분리, 손들기 발언권 승인 및 Web Audio 에코 방지",
      size: "636 KB",
      badge: "Townhall"
    },
    {
      id: "security-network",
      category: "보안 규격",
      title: "09. 보안 네트워크 구축 가이드",
      desc: "100% 망분리 에어갭(Air-Gapped) 사내 사설 보안 인증 체계 및 미디어 암호화 통신 규격",
      size: "909 KB",
      badge: "Network"
    },
    {
      id: "backup-recovery",
      category: "장애 대비",
      title: "10. 백업 및 장애복구 매뉴얼",
      desc: "사내 임베디드 데이터베이스 무중단 실시간 백업, 데이터 아카이빙 및 긴급 시스템 복원 매뉴얼",
      size: "321 KB",
      badge: "Backup"
    },
    {
      id: "troubleshooting-faq",
      category: "문제 해결",
      title: "11. 장애대응 FAQ",
      desc: "카메라/마이크 브라우저 권한, 방화벽 통신 장애 시 대체 경로, 사내망 자주 묻는 질문",
      size: "399 KB",
      badge: "FAQ"
    },
    {
      id: "checklist",
      category: "검수 기준",
      title: "12. 설치완료 검수 체크리스트",
      desc: "고객사 서버 납품 및 사내망 구축 완료 시 고객 IT보안팀과 함께 점검하는 20대 항목표",
      size: "593 KB",
      badge: "Checklist"
    }
  ];

  // 쇼케이스 탭 (유튜브 시연 3종 + 엔터프라이즈 기술 백서 센터 1종으로 정돈)
  const showcaseTabs = [
    {
      id: "youtube-tour",
      type: "youtube",
      label: "🎬 공식 시연 영상 (5분 투어 · 쇼츠)",
      desc: "실제 구동 유튜브 영상으로 체험하는 WorkNexus 프라이빗 보안 워룸 핵심 기능 및 튜토리얼"
    },
    {
      id: "screenshare-meeting",
      type: "youtube",
      youtubeId: "Yi4NM_l7l78",
      watchUrl: "https://youtu.be/Yi4NM_l7l78",
      label: "🎬 화면 공유 & 화상회의 (시연 영상)",
      desc: "사내 완결형 고성능 SFU 기반 완전 격리 회의실, 초저지연 화면 및 시스템 사운드 동시 송출 실제 시연"
    },
    {
      id: "smalltalk-call-calendar",
      type: "youtube",
      youtubeId: "MQeGH2KLmsk",
      watchUrl: "https://youtu.be/MQeGH2KLmsk",
      label: "🎬 회의실 스몰토크 · 1:1 통화 & 일정관리",
      desc: "3D 공간음향 기반 자연스러운 스몰토크, 비공개 1:1 통화 및 사옥 벽면 인터랙티브 캘린더 연동 시연"
    },
    {
      id: "manuals",
      type: "manuals",
      label: "📚 엔터프라이즈 기술 백서 및 가이드 (12종)",
      desc: "고객사 IT팀, 경영진, 관리자를 위한 12종 공식 시스템 구축, 보안 네트워크, 운영 및 사용자 기술 백서"
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
      title: "사용자별 추가 구독료 제로",
      en: "Zero SaaS Subscriptions",
      desc: "사용자 수가 늘 때마다 매월 수백만 원의 좌석 비용이 눈덩이처럼 불어나는 외부 SaaS가 아닙니다.",
      icon: DollarSign,
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/40"
    },
    {
      title: "외부 클라우드 의존 0%",
      en: "100% On-Premise Infrastructure",
      desc: "AWS나 외부 미디어 클라우드 종량제 비용 없이 고객사 Windows/Linux 단일 서버에서 독립 구동됩니다.",
      icon: Server,
      color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/40"
    },
    {
      title: "완벽한 사내 데이터 주권",
      en: "Air-Gapped Data Sovereignty",
      desc: "화상 미디어, 채팅, 근태, 회의 녹화 등 모든 핵심 기밀 데이터가 고객 사내 DB에만 안전하게 보존됩니다.",
      icon: Lock,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/40"
    }
  ];

  const coreFeatures = [
    {
      icon: ShieldCheck,
      title: "사내 구축형 독자 SFU 미디어 엔진",
      desc: "P2P 연결 없이 사내 서버 내장 독자 SFU 미디어 엔진으로 모든 음성·영상·화면공유를 완벽 중계하여 외부 트래픽 비용을 영구 제거합니다."
    },
    {
      icon: Layers,
      title: "2D 경량 업무 모드 & 문서 PiP (v1.0.8)",
      desc: "3D 사옥뿐만 아니라 저사양/모바일용 가벼운 2D 업무 뷰를 지원하며, 3D↔2D 전환 중에도 통화/회의가 끊김 없이 유지됩니다."
    },
    {
      icon: Users,
      title: "외부 협력업체 1회용 게스트 회의 링크",
      desc: "사내 계정이 없는 협력업체도 무작위 1회용 코드 링크로 지정된 회의실에만 한정 참석(화면공유·채팅)할 수 있습니다."
    },
    {
      icon: CalendarCheck,
      title: "팀·전사 일정 보드 & 폐쇄망 2-Track 완비",
      desc: "사내 벽면 일정 보드와 구글/ics 연동을 제공하며, 인터넷이 차단된 100% 폐쇄망 사설 CA 환경에서도 원클릭 완벽 동작합니다."
    }
  ];

  return (
    <section id="worknexus" className="py-24 px-4 sm:px-6 relative overflow-hidden bg-slate-950 text-white">
      {/* 백그라운드 네온 오로라 */}
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* 사내망 원클릭 진단 모달 */}
      <NetworkDiagnosticsModal isOpen={isDiagOpen} onClose={() => setIsDiagOpen(false)} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 섹션 상단 헤더: 보안 워룸 리브랜딩 적용 */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs font-bold tracking-wide uppercase mb-4 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Flagship Solution 01 · 온프레미스 프라이빗 보안 워룸 & 협업 플랫폼
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              외부 클라우드 의존 0% · 사내 완결형 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                프라이빗 보안 워룸, Calamus WorkNexus
              </span>
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              보안 규정 및 트래픽 비용으로 일반 클라우드 SaaS(Teams·Zoom)를 쓰지 못하는 연구소, 첨단 제조, 의료기관을 위한 사내망 완결형 솔루션입니다.
              3D 공간 몰입감과 실용적인 2D 경량 업무 모드, 사내 완결형 고성능 SFU 미디어 엔진으로 기밀 유출을 원천 차단합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsDiagOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-purple-300 hover:text-white font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>사내망 환경 원클릭 진단</span>
            </button>

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
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/50 scale-[1.02]"
                      : "bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {tab.id === "youtube-tour" && <Play className="w-3.5 h-3.5 fill-current text-purple-200" />}
                  {tab.id === "screenshare-meeting" && <Film className="w-3.5 h-3.5 text-cyan-300" />}
                  {tab.id === "smalltalk-call-calendar" && <Headphones className="w-3.5 h-3.5 text-pink-300" />}
                  {tab.id === "manuals" && <BookOpen className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{tab.label}</span>
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
                      <h5 className="text-xs font-bold text-purple-300 mb-1">01. 무설치 웹 접속 & 2D/3D 하이브리드</h5>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        별도 클라이언트 설치 없이 Chrome, Edge에서 즉시 접속하며, 3D 가상 공간과 경량 2D 업무 모드를 원클릭 전환합니다.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/30">
                      <h5 className="text-xs font-bold text-indigo-300 mb-1">02. 사내 고성능 SFU & 공간 음향</h5>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        화상회의실 격리 및 4m 거리 기반 3D 공간 음향, 문서 PiP 회의창 분리로 업무 효율과 현장감을 동시에 제공합니다.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/30">
                      <h5 className="text-xs font-bold text-cyan-300 mb-1">03. 100% 데이터 주권 & 폐쇄망 2-Track</h5>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        사용자 수가 늘어도 월 구독료가 없으며, 외부 통신을 100% 차단한 에어갭(Air-Gapped) 폐쇄망에서도 완전 구동됩니다.
                      </p>
                    </div>
                  </div>
                )}

                {/* 실시간 라이브 데모 바로가기 배너 */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/50 to-slate-900 border border-purple-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-purple-300">Live Demo & Diag</span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      상시 운영 중
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                    실제 WorkNexus 플랫폼을 둘러보거나 사내망 호환성을 즉시 검사하세요.
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setIsDiagOpen(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-purple-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Activity className="w-3.5 h-3.5 text-purple-400" />
                      <span>사내망 환경 원클릭 진단하기</span>
                    </button>
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
            </div>
          ) : activeTab === 3 ? (
            /* [탭 3: 12종 공식 기술 백서 & 엔터프라이즈 가이드 센터] */
            <div className="space-y-6">
              {/* 매뉴얼 센터 상단 헤더 */}
              <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Calamus WorkNexus Enterprise Technical Whitepapers</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-white">
                    엔터프라이즈 공식 기술 백서 및 운영 가이드 (전체 12종)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                    연구소, 첨단 제조, 의료기관 및 공공기관 IT/보안팀을 위한 공식 시스템 구축, 보안 규격 및 사용자 기술 백서입니다. 기업 보안 및 핵심 IP 보호를 위해 도입 심사 및 기업 인증 후 열람 권한이 부여됩니다.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleRequestManual("엔터프라이즈 종합 기술 백서 패키지")}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-950/60"
                  >
                    <FileText className="w-4 h-4 text-purple-200" />
                    <span>전체 백서 일괄 열람 신청</span>
                  </button>
                </div>
              </div>

              {/* 12종 매뉴얼 그리드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {manualsList.map((m) => (
                  <div
                    key={m.id}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-purple-500/50 transition-all flex flex-col justify-between group shadow-sm hover:shadow-purple-950/30"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                          {m.category}
                        </span>
                        <span className="text-[10px] text-amber-400/90 font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3" /> 기업 인증 전용
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors mb-1.5">
                        {m.title}
                      </h5>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {m.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80">
                      <button
                        onClick={() => handleRequestManual(m.title)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-purple-950/80 border border-purple-500/30 hover:border-purple-500/60 text-purple-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all group/btn shadow-sm"
                      >
                        <Lock className="w-3.5 h-3.5 text-purple-400 group-hover/btn:text-white transition-colors" />
                        <span>기업 기술 백서 열람 신청</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* [탭 1, 2: 유튜브 실제 시연 비디오 뷰어] */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* 비디오 플레이어 프레임 (YouTube 반응형 iframe) */}
              <div className="lg:col-span-8 flex flex-col gap-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-purple-500/30 shadow-2xl group">
                  {showcaseTabs[activeTab]?.youtubeId && (
                    <iframe
                      key={showcaseTabs[activeTab].youtubeId}
                      src={`https://www.youtube.com/embed/${showcaseTabs[activeTab].youtubeId}?rel=0`}
                      title={showcaseTabs[activeTab].label}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  )}

                  {/* 상단 비디오 정보 배지 오버레이 */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-bold text-purple-300 border border-purple-500/40 flex items-center gap-1 shadow-lg">
                      <Film className="w-3 h-3 text-cyan-400" />
                      실제 기능 시연 영상 (YouTube)
                    </span>
                  </div>
                </div>

                {/* 비디오 하단 설명 및 유튜브 바로가기 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">
                      {showcaseTabs[activeTab]?.label}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {showcaseTabs[activeTab]?.desc}
                    </p>
                  </div>
                  {showcaseTabs[activeTab]?.watchUrl && (
                    <a
                      href={showcaseTabs[activeTab]?.watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 hover:text-white text-xs font-semibold shrink-0 transition-all"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>YouTube에서 보기</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* 제품 스펙 및 탭별 특화 강점 리스트 */}
              <div className="lg:col-span-4 space-y-4">
                {/* 탭 1: 화면 공유 & 화상회의 특화 */}
                {activeTab === 1 ? (
                  <div className="bg-slate-950/80 p-5 rounded-2xl border border-purple-500/40 shadow-xl space-y-3">
                    <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                      SFU Media Architecture
                    </span>
                    <h4 className="text-base font-bold text-white">독자 SFU 기반 독립 격리 화상회의</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      방 단위로 완전 격리된 미디어 채널을 통해 다른 회의방과 소리·화면 간섭이 일체 발생하지 않습니다.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>사내 서버 독자 SFU 미디어 단일화 (P2P 완전 제거)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>발표자 화면 네온 글로우 및 시스템 사운드 동시 송출</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>문서 PiP 분리 뷰어로 회의 중 다른 창 작업 가능</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>3D ↔ 2D 업무 모드 전환 중에도 회의 및 공유 끊김 없음</span>
                      </li>
                    </ul>
                  </div>
                ) : activeTab === 2 ? (
                  /* 탭 2: 회의실 스몰토크 & 1:1 통화 · 일정관리 특화 */
                  <div className="bg-slate-950/80 p-5 rounded-2xl border border-pink-500/40 shadow-xl space-y-3">
                    <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider block">
                      Communication & Calendar Sync
                    </span>
                    <h4 className="text-base font-bold text-white">회의실 스몰토크 & 1:1 통화 · 일정관리</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      3D 가상 공간에서 마주치면 자연스럽게 연결되는 4m 공간 음향 스몰토크부터 비밀 보장 1:1 통화, 사옥 벽면 실시간 캘린더 연동으로 팀 협업을 가속화합니다.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>4m 근접 3D 공간 음향: 복도·라운지에서 마주치면 즉시 스몰토크 시작</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>1:1 프라이빗 통화 & 전화부스: 간섭 없는 비공개 음성 암호화 통화</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>벽면 인터랙티브 캘린더 & 일정보드: 팀 일정 및 회의실 현황 실시간 동기화</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>외부 협력업체 1회용 링크 지원: 무설치 코드로 지정 회의방만 격리 참석</span>
                      </li>
                    </ul>
                  </div>
                ) : null}

                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-800/40">
                  <h4 className="text-sm font-bold text-purple-300 mb-1">사내망 사전 호환성 진단</h4>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    귀사 방화벽(UDP/TCP) 및 브라우저 환경에서 WorkNexus 미디어 통신이 원활한지 지금 즉시 자동 진단해 보세요.
                  </p>
                  <button
                    onClick={() => setIsDiagOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>사내망 환경 원클릭 진단</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4대 핵심 기능 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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

        {/* ========================================================= */}
        {/* [AEO / GEO / Trust] 일반 클라우드 SaaS vs WorkNexus 비교표 */}
        {/* ========================================================= */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-16 shadow-2xl backdrop-blur-md">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded border border-purple-500/30 uppercase">
              TCO & Architecture Comparison
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
              일반 클라우드 SaaS vs Calamus WorkNexus
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              매월 인원수에 비례해 증가하는 매몰 비용(Sunk Cost)과 외부 유출 위험을 단 한 번의 사내 구축으로 종결합니다.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4 font-bold">비교 항목</th>
                  <th className="py-3 px-4 font-bold text-slate-400">기존 클라우드 SaaS (Teams/Zoom/Gather)</th>
                  <th className="py-3 px-4 font-bold text-purple-300 bg-purple-950/30 rounded-t-xl">
                    Calamus WorkNexus (온프레미스)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">월간 구독료</td>
                  <td className="py-3.5 px-4 text-slate-400">인당 월 1.5만~3만원 (100인 연 2,400만원+)</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 bg-purple-950/20">
                    인당 추가 구독료 0원 (단일 서버 영구 운영)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">데이터 주권</td>
                  <td className="py-3.5 px-4 text-slate-400">외부/해외 데이터센터 보관 (유출 우려)</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400 bg-purple-950/20">
                    100% 사내망 완결 (에어갭 폐쇄망 지원)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">미디어 엔진</td>
                  <td className="py-3.5 px-4 text-slate-400">외부 P2P 또는 클라우드 종량제 미디어 서버</td>
                  <td className="py-3.5 px-4 font-bold text-purple-300 bg-purple-950/20">
                    사내 내장 초저지연 SFU 미디어 서버 (P2P 차단 및 트래픽 0원)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">외부 접속 방식</td>
                  <td className="py-3.5 px-4 text-slate-400">공용 웹/포트 개방 필수</td>
                  <td className="py-3.5 px-4 font-bold text-purple-300 bg-purple-950/20">
                    인바운드 포트 개방 없는 제로트러스트 보안 터널링
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">공간 커스터마이징</td>
                  <td className="py-3.5 px-4 text-slate-400">정해진 템플릿만 제한적 사용</td>
                  <td className="py-3.5 px-4 font-bold text-cyan-300 bg-purple-950/20">
                    8대 산업군별 3D 공간 맞춤 커스텀 제작
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 8대 산업군 맞춤형 템플릿 & 시스템 사양 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* 8대 산업군 템플릿 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              Industry Tailored Solutions
            </span>
            <h4 className="text-xl font-bold text-white mb-3">8대 산업군별 전용 가상 사옥 설계</h4>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              조직 구조와 보안 가이드라인에 최적화된 독립 사옥을 커스텀 구축해 드립니다.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { name: "금융 · 핀테크", desc: "망분리 완결형" },
                { name: "첨단제조 · 반도체", desc: "연구 기밀 보호" },
                { name: "종합병원 · 의료원", desc: "환자정보 보호" },
                { name: "공공기관 · 공기업", desc: "사내망 완결" },
                { name: "대학교 · 연구원", desc: "타운홀 대강당" },
                { name: "IT · 소프트웨어", desc: "애자일 룸" },
                { name: "글로벌 무역 · 상사", desc: "시차 초월 협업" },
                { name: "전문 서비스 펌", desc: "VIP 게스트룸" }
              ].map((ind, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="font-bold text-white truncate">{ind.name}</div>
                  <div className="text-[10px] text-purple-400 mt-1">{ind.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 시스템 권장 사양 및 포트 안내 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              System Specifications
            </span>
            <h4 className="text-xl font-bold text-white mb-3">서버 권장 사양 & 기술 제원</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              별도의 복잡한 인프라 종속성 없이 Windows 10/11 및 Linux 환경에서 독립 실행형 포터블 엔진으로 즉시 구동됩니다.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">서버 운영체제</span>
                <span className="font-bold text-white">Windows 10/11 or Windows Server / Linux</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">하드웨어 권장</span>
                <span className="font-bold text-white">CPU 4코어 이상, RAM 8GB 이상, 유선 LAN</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">지원 웹 브라우저</span>
                <span className="font-bold text-emerald-400">Chrome, Edge, Whale, Safari (무설치)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">네트워크 보안 연동</span>
                <span className="font-semibold text-purple-300">사내 방화벽 정책 맞춤형 단일/보안 포트 커스텀 지원</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* [Gated Lead Modal] 엔터프라이즈 기술 백서 열람 신청 모달 */}
      {/* ========================================================= */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-purple-500/40 p-6 sm:p-8 shadow-2xl text-left">
            <button
              onClick={() => setIsManualModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    <span>보안 인증 심사</span>
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Enterprise Only</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                  도입 문의 및 기술 백서 신청
                </h3>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  아래 내용을 입력하고 <strong className="text-purple-300">Gmail로 문의 작성</strong>을 누르면 내용이 채워진 메일 작성 창이 열립니다. 확인 후 보내기만 누르면 담당자가 회신드립니다.
                </p>

                {selectedManualTitle && (
                  <div className="mb-4 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-xs">
                    <span className="text-slate-400">신청 백서:</span>
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
                        회사명 <span className="text-pink-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="예: (주)유진에이아이"
                        value={manualFormData.company}
                        onChange={(e) => setManualFormData({ ...manualFormData, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        담당자 <span className="text-pink-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="예: 홍길동 팀장"
                        value={manualFormData.name}
                        onChange={(e) => setManualFormData({ ...manualFormData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        연락처
                      </label>
                      <input
                        type="tel"
                        placeholder="010-0000-0000"
                        value={manualFormData.phone}
                        onChange={(e) => setManualFormData({ ...manualFormData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 outline-none transition-all"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      문의 내용
                    </label>
                    <textarea
                      rows={3}
                      placeholder="도입 목적, 현재 사용 중인 협업 도구, 궁금한 점 등을 자유롭게 적어 주세요."
                      value={manualFormData.memo}
                      onChange={(e) => setManualFormData({ ...manualFormData, memo: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* 워크넥서스 3대 메일 전송 액션 버튼 */}
                  <div className="pt-2">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <button
                        type="button"
                        onClick={handleOpenGmail}
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-950/60 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Gmail로 문의 작성 ↗</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenMailto}
                        className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>다른 메일 앱으로 보내기</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
                        title="이메일 주소 복사"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{isCopied ? "복사됨!" : "주소 복사"}</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 text-center mt-3">
                      입력한 내용은 안전하게 접수되며, 여러분의 메일 계정에서 <span className="text-purple-300 font-semibold">yujinit2005@gmail.com</span>(으)로 직접 보내집니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
    </section>
  );
}


