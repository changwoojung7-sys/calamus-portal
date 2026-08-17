"use client";

import { useState, useRef } from "react";
import {
  Sparkles,
  User,
  Calendar,
  Clock,
  Compass,
  Zap,
  TrendingUp,
  Briefcase,
  Coins,
  HeartHandshake,
  Smile,
  CheckCircle,
  XCircle,
  Share2,
  RefreshCw,
  Award,
  Layers,
  ArrowRight,
  Flame,
  Droplets,
  Trees,
  Mountain,
  Shield,
  HelpCircle,
  Download,
  Check
} from "lucide-react";
import html2canvas from "html2canvas";
import { calculateSaju, SajuCalculationResult } from "@/lib/sajuCalculator";

export default function SajuClient() {
  const [step, setStep] = useState<"INPUT" | "LOADING" | "RESULT">("INPUT");

  // Form State
  const [name, setName] = useState("");
  const [gender, setGender] = useState("남자");
  const [dateType, setDateType] = useState<"양력" | "음력">("양력");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [isTimeUnknown, setIsTimeUnknown] = useState(false);
  const [followup, setFollowup] = useState("");

  // Result State
  const [sajuCalc, setSajuCalc] = useState<SajuCalculationResult | null>(null);
  const [aiReport, setAiReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"CAREER" | "WEALTH" | "RELATION" | "MENTAL">("CAREER");
  const [copySuccess, setCopySuccess] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // 퍼스널 카드 캡처용 Ref
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !birthDate) {
      alert("이름과 생년월일을 입력해주세요.");
      return;
    }

    setStep("LOADING");

    // 1. 만세력 정밀 연산
    const calcResult = calculateSaju(
      birthDate,
      isTimeUnknown ? "" : birthTime,
      dateType
    );
    setSajuCalc(calcResult);

    try {
      // 2. OpenAI GPT-4o 실시간 심층 AI 리포트 생성
      const [res] = await Promise.all([
        fetch("/api/saju", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            gender,
            date_type: dateType,
            birthdate: birthDate,
            birthtime: isTimeUnknown ? "미상" : birthTime,
            dayMasterKorean: calcResult.dayMasterKorean,
            elementsPercent: calcResult.elementsPercent,
            dominantElementName: calcResult.dominantElementName,
            followup,
          }),
        }),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);

      const data = await res.json();
      if (data.report) {
        setAiReport(data.report);
        setStep("RESULT");
      } else {
        alert("분석 결과를 불러오는 중 오류가 발생했습니다.");
        setStep("INPUT");
      }
    } catch (e) {
      console.error(e);
      alert("서버 연결에 실패했습니다. 다시 시도해주세요.");
      setStep("INPUT");
    }
  };

  // 인스타/스레드 공유용 퍼스널 카드 이미지 생성 및 다운로드
  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // 고해상도
        backgroundColor: "#0d1629",
        useCORS: true,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Calamus_Personal_Card_${name || "Insight"}.png`;
      link.click();
    } catch (err) {
      console.error("Card capture failed:", err);
      alert("카드 이미지 생성 중 문제가 발생했습니다.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${name}님의 Calamus AI 퍼스널 사주 인사이트`,
        text: `[${aiReport?.persona_summary?.headline || "나만의 퍼스널 인사이트"}] 나의 오행 에너지와 커리어 핏을 확인해보세요!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-slate-100">
      {/* 상단 브랜딩 헤더 */}
      <header className="text-center mb-8 sm:mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold mb-4 shadow-lg shadow-emerald-950/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Calamus AI Personal Insight Lab (GPT-4o 연동)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
          데이터 기반 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">퍼스널 사주 랩</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          난해한 한자 대신 <strong>5대 라이프 에너지 &amp; 커리어/자산 핏</strong>으로 재해석한 현대인을 위한 1:1 맞춤 라이프 전략 리포트
        </p>
      </header>

      {/* 1단계: 직관적인 입력 폼 */}
      {step === "INPUT" && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#0e1628]/90 border border-slate-700/60 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-7"
        >
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-slate-800 pb-2">
              <User className="w-4 h-4" /> 1. 기본 프로필
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">이름 (닉네임)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 홍길동"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">성별</label>
                <div className="grid grid-cols-2 gap-2">
                  {["남자", "여자"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2.5 text-xs font-bold rounded-xl border transition ${
                        gender === g
                          ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950"
                          : "bg-slate-900/60 text-slate-400 border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 생년월일시 입력 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Calendar className="w-4 h-4" /> 2. 생년월일 &amp; 시간
              </div>
              {/* 양력/음력 토글 */}
              <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                {(["양력", "음력"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDateType(t)}
                    className={`px-3 py-1 text-[11px] font-bold rounded-md transition ${
                      dateType === t
                        ? "bg-emerald-600 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">생년월일 (필수)</label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">태어난 시간 (선택)</label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isTimeUnknown}
                      onChange={(e) => {
                        setIsTimeUnknown(e.target.checked);
                        if (e.target.checked) setBirthTime("");
                      }}
                      className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                    />
                    시간 모름
                  </label>
                </div>
                <input
                  type="time"
                  disabled={isTimeUnknown}
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className={`w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition ${
                    isTimeUnknown ? "opacity-40 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* 추가 고민 사항 */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> 요즘 가장 집중하고 싶은 고민 (선택)
            </label>
            <input
              type="text"
              value={followup}
              onChange={(e) => setFollowup(e.target.value)}
              placeholder="예: 올해 이직/스타트업 창업 타이밍, 재물 투자 방향 등"
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* 분석 시작 버튼 */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            AI 퍼스널 인사이트 리포트 생성하기
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* 2단계: 로딩 인디케이터 */}
      {step === "LOADING" && (
        <div className="bg-[#0e1628]/90 border border-slate-700/60 rounded-3xl p-12 text-center shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center min-h-[420px] space-y-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
            <Sparkles className="w-8 h-8 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">GPT-4o 엔진 심층 분석 중...</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              만세력 정밀 좌표와 5대 오행 에너지를 바탕으로<br />
              {name}님 맞춤형 실전 커리어·자산·멘탈 전략을 도출하고 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* 3단계: 모던 퍼스널 리포트 결과 화면 */}
      {step === "RESULT" && sajuCalc && aiReport && (
        <div className="space-y-8 animate-fade-in">
          {/* A. 퍼스널 코어 & SNS 공유용 핵심 카드 (캡처 대상) */}
          <div
            ref={cardRef}
            className="relative rounded-3xl bg-gradient-to-br from-[#121c33] via-[#0d1629] to-[#0a1020] border border-slate-700/80 p-6 sm:p-8 shadow-2xl overflow-hidden"
          >
            {/* 배경 오로라 블러 */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* 카드 헤더 */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  {name}님의 퍼스널 DNA
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
                  {sajuCalc.modernPersonaBadge}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadCard}
                  disabled={isCapturing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-950"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isCapturing ? "카드 생성 중..." : "📸 퍼스널 카드 다운로드"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  {copySuccess ? "복사 완료!" : "공유"}
                </button>
              </div>
            </div>

            {/* 메인 헤드라인 & 해시태그 */}
            <div className="space-y-3 mb-6 relative z-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                &ldquo;{aiReport.persona_summary?.headline}&rdquo;
              </h2>
              <div className="flex flex-wrap gap-2">
                {aiReport.persona_summary?.hash_tags?.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
                {aiReport.persona_summary?.core_nature}
              </p>
            </div>

            {/* 오행 밸런스 에너지 바 */}
            <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 relative z-10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" /> 5대 라이프 에너지 밸런스
                </span>
                <span className="text-emerald-400 font-medium">
                  최대 우세: {sajuCalc.dominantElementName}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-1 text-center">
                {[
                  { key: "wood", label: "성장/추진 (목)", icon: Trees, color: "bg-emerald-500", text: "text-emerald-400" },
                  { key: "fire", label: "열정/표현 (화)", icon: Flame, color: "bg-rose-500", text: "text-rose-400" },
                  { key: "earth", label: "안정/중재 (토)", icon: Mountain, color: "bg-amber-500", text: "text-amber-400" },
                  { key: "metal", label: "원칙/결단 (금)", icon: Shield, color: "bg-slate-300", text: "text-slate-200" },
                  { key: "water", label: "지혜/유연 (수)", icon: Droplets, color: "bg-sky-500", text: "text-sky-400" },
                ].map((item) => {
                  const pct = (sajuCalc.elementsPercent as any)[item.key] || 0;
                  return (
                    <div key={item.key} className="space-y-1.5">
                      <div className="h-16 w-full bg-slate-800/80 rounded-lg relative overflow-hidden flex items-end justify-center pb-1">
                        <div
                          className={`w-full ${item.color} rounded-b-lg transition-all duration-700`}
                          style={{ height: `${pct}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white drop-shadow">
                          {pct}%
                        </span>
                      </div>
                      <div className={`text-[10px] font-bold ${item.text}`}>{item.label.split(" ")[0]}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 모던 명식표 (한자 + 컬러 태그) */}
            <div className="mt-5 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-400">사주 원국 구조:</span>
              <div className="flex items-center gap-3 font-mono">
                {[
                  { label: "시주", p: sajuCalc.timePillar },
                  { label: "일주(본캐)", p: sajuCalc.dayPillar, isCore: true },
                  { label: "월주", p: sajuCalc.monthPillar },
                  { label: "년주", p: sajuCalc.yearPillar },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`px-2.5 py-1 rounded-lg border text-center ${
                      item.isCore
                        ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-bold"
                        : "bg-slate-900/60 border-slate-800 text-slate-300"
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 block">{item.label}</span>
                    {item.p ? `${item.p.gan}${item.p.ji}` : "미상"}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* B. 테마별 현대적 심층 리포트 탭 (Career / Wealth / Relation / Mental) */}
          <div className="space-y-4">
            {/* 탭 헤더 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: "CAREER", label: "커리어 & 비즈니스", icon: Briefcase },
                { key: "WEALTH", label: "재물 & 현금흐름", icon: Coins },
                { key: "RELATION", label: "대인관계 & 소통", icon: HeartHandshake },
                { key: "MENTAL", label: "에너지 & 마인드셋", icon: Smile },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-3.5 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      activeTab === tab.key
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950"
                        : "bg-[#0e1628] text-slate-400 border-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* 탭 컨텐츠 (상세하고 깊이 있는 서술) */}
            <div className="bg-[#0e1628] border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-xl">
              {activeTab === "CAREER" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm pb-2 border-b border-slate-800">
                    <Briefcase className="w-4 h-4" /> 커리어 포지셔닝 &amp; 성공 전략
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> 핵심 강점 (Superpower)
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                        {aiReport.career_and_business?.superpower}
                      </p>
                    </div>
                    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" /> 주의할 점 (Blindspot)
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                        {aiReport.career_and_business?.blindspot}
                      </p>
                    </div>
                  </div>

                  {aiReport.career_and_business?.fit_roles && (
                    <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-2.5">
                      <span className="text-xs font-bold text-slate-300">최적 직무 및 롤 핏 (Fit Roles):</span>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {aiReport.career_and_business.fit_roles.map((r: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 text-cyan-300 text-xs font-semibold border border-cyan-500/30 shadow-sm"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                      <Award className="w-4 h-4" /> 실전 실행 가이드 (Action Guide)
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                      {aiReport.career_and_business?.action_guide}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "WEALTH" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm pb-2 border-b border-slate-800">
                    <Coins className="w-4 h-4" /> 재물 운 &amp; 파이프라인 구축 스타일
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" /> 현금흐름 &amp; 자산 관리 스타일
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                        {aiReport.wealth_flow?.money_style}
                      </p>
                    </div>
                    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Coins className="w-4 h-4" /> 자산 증식 &amp; 투자 가이드
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                        {aiReport.wealth_flow?.investment_tip}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "RELATION" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm pb-2 border-b border-slate-800">
                    <HeartHandshake className="w-4 h-4" /> 대인관계 &amp; 커뮤니케이션 핏
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                        <User className="w-4 h-4" /> 소통 성향 &amp; 관계 패턴
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                        {aiReport.relationship_and_love?.communication_style}
                      </p>
                    </div>
                    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> 시너지 창출을 위한 대인관계 조언
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                        {aiReport.relationship_and_love?.advice}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "MENTAL" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm pb-2 border-b border-slate-800">
                    <Smile className="w-4 h-4" /> 에너지 배터리 &amp; 멘탈 관리
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                        <Zap className="w-4 h-4" /> 에너지 배터리 충전/방전 특성
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                        {aiReport.mental_and_energy?.energy_battery}
                      </p>
                    </div>
                    <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Smile className="w-4 h-4" /> 번아웃 방지 리차징 가이드
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                        {aiReport.mental_and_energy?.recharge_tip}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* C. 오늘의 데일리 실행 전략 (Daily Action Guide) */}
          <div className="bg-[#0e1628] border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Compass className="w-4 h-4" /> 오늘의 실행 전략 (Daily Action Guide)
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {aiReport.today_action?.daily_vibe}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> 오늘 추천하는 행동 (DO)
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {aiReport.today_action?.do}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> 오늘 피하면 좋은 행동 (DON&apos;T)
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {aiReport.today_action?.dont}
                </p>
              </div>
            </div>
          </div>

          {/* 다시 분석하기 버튼 */}
          <div className="text-center pt-2">
            <button
              onClick={() => setStep("INPUT")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              다른 생년월일로 다시 분석하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
