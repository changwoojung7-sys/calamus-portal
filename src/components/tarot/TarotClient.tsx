"use client";

import { useState, useRef } from "react";
import {
  Sparkles,
  RefreshCw,
  Layers,
  Compass,
  ArrowRight,
  Download,
  Share2,
  HeartHandshake,
  Briefcase,
  Coins,
  Smile,
  ShieldCheck,
  CheckCircle,
  XCircle,
  HelpCircle,
  Flame,
  Eye,
  Sliders,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import rawCards from "@/data/tarot_cards.json";

export interface TarotCardData {
  image: string;
  name_kr: string;
  name_en: string;
  is_reversed: boolean;
  position_label?: string;
  upright?: any;
  reversed?: any;
}

const allCards = ((rawCards || []) as any[]).map((c) => {
  const fileName = c.image && typeof c.image === "string" ? c.image.split("/").pop() : "card-back.png";
  return {
    ...c,
    image: `/tarot/cards/${fileName}`,
  };
}) as TarotCardData[];

const SPREADS = {
  1: {
    id: 1,
    name: "원카드 데일리",
    desc: "오늘의 직관적 메시지 & 즉답",
    count: 1,
    positions: ["오늘의 운과 핵심 메시지"],
    icon: Sparkles,
  },
  3: {
    id: 3,
    name: "쓰리카드 흐름",
    desc: "과거 · 현재 · 미래의 타임라인",
    count: 3,
    positions: ["과거/배경", "현재/도전", "미래/결과"],
    icon: Compass,
  },
  2: {
    id: 2,
    name: "선택의 기로 (2안)",
    desc: "A안 vs B안의 결과 비교",
    count: 2,
    positions: ["A선택의 결과", "B선택의 결과"],
    icon: Sliders,
  },
  4: {
    id: 4,
    name: "관계 & 속마음",
    desc: "나와 상대방의 에너지 & 발전 가능성",
    count: 4,
    positions: ["나의 상태", "상대방 속마음", "관계의 장애물", "최종 방향성"],
    icon: HeartHandshake,
  },
};

export default function TarotClient() {
  const [step, setStep] = useState<"SETUP" | "SHUFFLE" | "PICK" | "LOADING" | "RESULT">("SETUP");
  const [selectedSpreadKey, setSelectedSpreadKey] = useState<1 | 3 | 2 | 4>(3);
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState<"종합" | "연애" | "커리어" | "금전/투자">("종합");
  const [birthInfo, setBirthInfo] = useState("");

  // 셔플 및 뽑힌 카드 상태
  const [deckCards, setDeckCards] = useState<TarotCardData[]>([]);
  const [drawnCards, setDrawnCards] = useState<TarotCardData[]>([]);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);

  // AI 분석 결과 상태
  const [aiReport, setAiReport] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isCardCapturing, setIsCardCapturing] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  // 캡처용 Ref
  const talismanCardRef = useRef<HTMLDivElement>(null);
  const fullReportRef = useRef<HTMLDivElement>(null);

  const currentSpread = SPREADS[selectedSpreadKey];

  // 1. 카드 셔플 시작
  const startShuffle = () => {
    if (!question.trim()) {
      alert("궁금한 고민이나 질문을 입력해주세요.");
      return;
    }
    setStep("SHUFFLE");
    setDrawnCards([]);
    setRevealedCards([]);
    setAiReport(null);

    // 덱 랜덤 셔플
    setTimeout(() => {
      const shuffled = [...allCards].sort(() => Math.random() - 0.5);
      setDeckCards(shuffled);
      setStep("PICK");
    }, 1600);
  };

  // 2. 카드 직접 드로우 인터랙션
  const handlePickCard = (card: TarotCardData, index: number) => {
    if (drawnCards.length >= currentSpread.count) return;

    const isReversed = Math.random() < 0.25; // 25% 확률 역방향
    const posLabel = currentSpread.positions[drawnCards.length] || `${drawnCards.length + 1}번째`;

    const newCard: TarotCardData = {
      ...card,
      is_reversed: isReversed,
      position_label: posLabel,
    };

    const nextDrawn = [...drawnCards, newCard];
    setDrawnCards(nextDrawn);

    // 모든 카드를 다 뽑았으면 AI 분석 호출
    if (nextDrawn.length === currentSpread.count) {
      triggerAiReading(nextDrawn);
    }
  };

  // 3. AI 리딩 생성
  const triggerAiReading = async (cardsToAnalyze: TarotCardData[]) => {
    setStep("LOADING");

    try {
      const [res] = await Promise.all([
        fetch("/api/tarot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            cards: cardsToAnalyze,
            spread: currentSpread.count,
            questionType: category,
            birthInfo,
          }),
        }),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);

      const data = await res.json();
      if (data.report) {
        setAiReport(data.report);
        // 기본적으로 모든 카드 공개
        setRevealedCards(cardsToAnalyze.map((_, i) => i));
        setStep("RESULT");
      } else {
        alert("타로 리딩 중 오류가 발생했습니다.");
        setStep("PICK");
      }
    } catch (e) {
      console.error(e);
      alert("서버 연결에 실패했습니다.");
      setStep("SETUP");
    }
  };

  // 4. 부적 카드 (PNG) 다운로드
  const handleDownloadTalisman = async () => {
    if (!talismanCardRef.current) return;
    setIsCardCapturing(true);
    try {
      const dataUrl = await toPng(talismanCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0d1424",
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Calamus_Tarot_Archetype_Card.png`;
      link.click();
    } catch (err) {
      console.error("Card capture failed:", err);
      alert("카드 이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsCardCapturing(false);
    }
  };

  // 5. 전체 타로 리포트 PDF 저장
  const handleDownloadPDF = async () => {
    if (!fullReportRef.current) return;
    setIsPdfGenerating(true);
    try {
      const dataUrl = await toPng(fullReportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#070a15",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let position = 0;
      let heightLeft = pdfHeight;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Calamus_AI_Tarot_Report.pdf`);
    } catch (err) {
      console.error("PDF creation failed:", err);
      alert("PDF 생성 중 문제가 발생했습니다.");
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // 6. 결과 요약 텍스트 공유
  const handleShare = async () => {
    const summary = `[Calamus AI 타로 리딩 결과]\n\n` +
      `🔮 질문: "${question}"\n` +
      `✨ 아키타입: "${aiReport?.archetype_card?.headline || ""}"\n` +
      `🏷️ 키워드: ${(aiReport?.archetype_card?.hash_tags || []).join(" ")}\n\n` +
      `📜 스토리라인:\n${aiReport?.storyline || ""}\n\n` +
      `💡 추천 액션:\n- ${(aiReport?.action_plans || []).join("\n- ")}\n\n` +
      `👉 나만의 타로 리딩: https://calamus.ai.kr/tarot-room`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Calamus AI 타로 리딩 리포트",
          text: summary,
          url: "https://calamus.ai.kr/tarot-room",
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(summary);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch {
      alert("공유 텍스트 복사에 실패했습니다.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 text-slate-100 font-sans">
      {/* 상단 헤더 */}
      <header className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-4 shadow-lg shadow-purple-950/60">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Interactive Mystic Tarot Lab (GPT-4o Deep Reading)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
          인터랙티브 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">AI 타로 랩</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          3D 카드 드로우 인터랙션과 심리학적 코칭을 결합한 <strong>양방향 딥 리딩 &amp; 아키타입 부적 카드</strong>
        </p>
      </header>

      {/* 1단계: 질문 및 스프레드 설정 */}
      {step === "SETUP" && (
        <div className="bg-[#0e1628]/90 border border-slate-700/60 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
          {/* A. 카테고리 선택 */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" /> 1. 리딩 분야 선택
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "종합 운세", key: "종합", icon: Sparkles },
                { label: "연애 & 속마음", key: "연애", icon: HeartHandshake },
                { label: "커리어 & 이직", key: "커리어", icon: Briefcase },
                { label: "재물 & 투자", key: "금전/투자", icon: Coins },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCategory(c.key as any)}
                    className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      category === c.key
                        ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-950"
                        : "bg-slate-900/70 text-slate-400 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* B. 스프레드 방식 선택 */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-400" /> 2. 스프레드 배열법 선택
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(SPREADS) as unknown as (1 | 3 | 2 | 4)[]).map((k) => {
                const sp = SPREADS[k];
                const Icon = sp.icon;
                const isSelected = selectedSpreadKey === sp.id;
                return (
                  <div
                    key={sp.id}
                    onClick={() => setSelectedSpreadKey(sp.id as any)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-gradient-to-b from-purple-900/40 to-slate-900 border-purple-500 shadow-md shadow-purple-950/60"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl bg-slate-800 ${isSelected ? "text-purple-300" : "text-slate-400"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {sp.count}장
                      </span>
                    </div>
                    <div className="font-bold text-sm text-white mb-1">{sp.name}</div>
                    <div className="text-xs text-slate-400 leading-relaxed">{sp.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* C. 질문 입력 및 사주 연동 옵션 */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-400" /> 3. 구체적인 고민 / 질문 입력 (필수)
              </label>
              <textarea
                required
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="예: 이번 상반기에 스타트업 창업 제안이 왔는데 옮겨도 좋은 타이밍일까요? 팀원과의 갈등은 어떻게 풀 수 있을까요?"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> [선택] 사주 하이브리드 연동 (생년월일 입력 시 당일 오행 기운 결합)
              </label>
              <input
                type="text"
                value={birthInfo}
                onChange={(e) => setBirthInfo(e.target.value)}
                placeholder="예: 1992년 8월 14일생 (사주 오행 에너지와 타로 크로스 분석)"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* 덱 섞기 버튼 */}
          <button
            type="button"
            onClick={startShuffle}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-slate-950 font-black text-base shadow-xl shadow-purple-500/20 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            타로 덱 셔플 &amp; 카드 뽑기 시작
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2단계: 셔플 애니메이션 */}
      {step === "SHUFFLE" && (
        <div className="bg-[#0e1628]/90 border border-slate-700/60 rounded-3xl p-16 text-center shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center min-h-[460px] space-y-6">
          <div className="relative w-36 h-48 flex items-center justify-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, (i - 2) * 35, 0],
                  rotate: [0, (i - 2) * 12, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.9,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
                className="absolute w-28 h-40 rounded-xl bg-gradient-to-b from-purple-900 to-indigo-950 border-2 border-purple-500/50 shadow-2xl overflow-hidden flex items-center justify-center"
              >
                <img src="/tarot/card-back.png" alt="Card" className="w-full h-full object-cover opacity-80" />
              </motion.div>
            ))}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">덱을 정성스럽게 섞고 있습니다...</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              마음을 비우고 &ldquo;{question}&rdquo;에 집중해주세요.
            </p>
          </div>
        </div>
      )}

      {/* 3단계: 인터랙티브 카드 뽑기 (PICK) */}
      {step === "PICK" && (
        <div className="bg-[#0e1628]/90 border border-slate-700/60 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs text-purple-400 font-bold block mb-1">
                스프레드: {currentSpread.name}
              </span>
              <h2 className="text-lg font-bold text-white">
                원하는 카드를 <strong className="text-purple-300 font-black">{currentSpread.count - drawnCards.length}장</strong> 더 선택해주세요.
              </h2>
            </div>
            <div className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              진행: {drawnCards.length} / {currentSpread.count}
            </div>
          </div>

          {/* 선택된 카드 슬롯 */}
          <div className="flex flex-wrap justify-center gap-4 py-4 min-h-[190px] bg-slate-950/60 rounded-2xl p-4 border border-slate-800">
            {Array.from({ length: currentSpread.count }).map((_, idx) => {
              const card = drawnCards[idx];
              const label = currentSpread.positions[idx];
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="w-24 sm:w-28 h-36 sm:h-40 rounded-xl border-2 border-dashed border-purple-500/40 bg-purple-950/20 flex items-center justify-center relative overflow-hidden shadow-lg">
                    {card ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-purple-400/80"
                      >
                        <img src="/tarot/card-back.png" alt="Drawn" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-purple-900/30 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-purple-300" />
                        </div>
                      </motion.div>
                    ) : (
                      <span className="text-xs text-purple-400/60 font-bold">{idx + 1}번째</span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 max-w-[100px] text-center truncate">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 카드 덱 펼침 UI (스크롤 가능) */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> 펼쳐진 덱에서 마음에 이끌리는 카드를 터치하세요:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto py-4 px-2 no-scrollbar bg-slate-900/40 rounded-2xl border border-slate-800/80">
              {deckCards.slice(0, 30).map((card, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -12, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePickCard(card, idx)}
                  className="shrink-0 w-16 sm:w-20 h-28 sm:h-32 rounded-xl bg-gradient-to-b from-purple-900 to-indigo-950 border border-purple-500/40 cursor-pointer shadow-lg overflow-hidden relative group"
                >
                  <img src="/tarot/card-back.png" alt="Back" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/20 transition" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4단계: GPT-4o 로딩 */}
      {step === "LOADING" && (
        <div className="bg-[#0e1628]/90 border border-slate-700/60 rounded-3xl p-16 text-center shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center min-h-[460px] space-y-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-400 animate-spin" />
            <Sparkles className="w-8 h-8 text-purple-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">타로 아키타입 &amp; 심층 리딩 생성 중...</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              뽑힌 카드들의 상징 체계와 질문자의 심리적 허들을 결합하여<br />
              구체적인 실행 전략과 솔루션을 도출하고 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* 5단계: 모던 타로 리포트 및 아키타입 카드 결과 */}
      {step === "RESULT" && aiReport && (
        <div ref={fullReportRef} className="space-y-8 animate-fade-in p-2">
          {/* 상단 글로벌 액션 바 */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0e1628] border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                타로 딥 리딩 완료
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* PDF 전체 저장 */}
              <button
                onClick={handleDownloadPDF}
                disabled={isPdfGenerating}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs transition shadow-md shadow-purple-950"
              >
                <Download className="w-3.5 h-3.5" />
                {isPdfGenerating ? "PDF 생성 중..." : "📄 타로 리포트 PDF 저장"}
              </button>

              {/* 부적 카드 PNG 다운로드 */}
              <button
                onClick={handleDownloadTalisman}
                disabled={isCardCapturing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                {isCardCapturing ? "카드 생성 중..." : "📸 부적 카드 (PNG)"}
              </button>

              {/* 결과 공유 */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 font-bold text-xs transition"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                {copySuccess ? "요약 복사 완료!" : "💬 리딩 요약 공유"}
              </button>
            </div>
          </div>

          {/* A. 소셜 공유용 '타로 아키타입 부적 카드' (캡처 대상) */}
          <div
            ref={talismanCardRef}
            className="relative rounded-3xl bg-gradient-to-br from-[#191133] via-[#0f1124] to-[#0a0d1a] border border-purple-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden"
          >
            {/* 오로라 앰비언스 */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
                  🔮 TAROT ARCHETYPE CARD
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentSpread.name}
                </span>
              </div>

              {/* 메인 헤드라인 & 해시태그 */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                  &ldquo;{aiReport.archetype_card?.headline}&rdquo;
                </h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {aiReport.archetype_card?.hash_tags?.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
                  {aiReport.archetype_card?.key_message}
                </p>
              </div>

              {/* 뽑힌 카드 3D 뷰 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {drawnCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex items-center gap-3 shadow-lg"
                  >
                    <div className="w-16 h-24 rounded-lg overflow-hidden border border-purple-500/40 shrink-0 bg-slate-950">
                      <img
                        src={card.image}
                        alt={card.name_kr}
                        className="w-full h-full object-cover"
                        style={{ transform: card.is_reversed ? "rotate(180deg)" : "none" }}
                      />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <span className="text-[10px] text-purple-400 font-bold block truncate">
                        [{card.position_label}]
                      </span>
                      <div className="text-xs font-bold text-white truncate">{card.name_kr}</div>
                      <div className="text-[10px] text-slate-400">
                        {card.is_reversed ? "역방향 (Reversed)" : "정방향 (Upright)"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* B. 카드별 심층 해석 & 유기적 스토리라인 */}
          <div className="bg-[#0e1628] border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm pb-2 border-b border-slate-800">
              <BookOpen className="w-4 h-4" /> 카드 간의 서사 및 맥락 스토리라인
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-purple-950/20 p-5 rounded-2xl border border-purple-500/20">
              {aiReport.storyline}
            </p>

            {/* 카드별 상세 분석 */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-300">포지션별 정밀 리딩:</span>
              <div className="space-y-3">
                {aiReport.card_analyses?.map((ca: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-purple-300">{ca.position} : {ca.card_name} ({ca.orientation})</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{ca.interpretation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* C. 심리학적 허들 vs 슈퍼파워 분석 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0e1628] border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-2">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> 주의해야 할 심리적 허들 (Hurdle)
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {aiReport.psychological_insight?.hurdle}
              </p>
            </div>

            <div className="bg-[#0e1628] border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> 발휘해야 할 잠재력 (Superpower)
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {aiReport.psychological_insight?.superpower}
              </p>
            </div>
          </div>

          {/* D. 구체적 실행 액션 플랜 & 사주 하이브리드 인사이트 */}
          <div className="bg-[#0e1628] border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm pb-2 border-b border-slate-800">
              <Compass className="w-4 h-4" /> 실전 실행 전략 (Actionable Advice)
            </div>
            <div className="space-y-2.5">
              {aiReport.action_plans?.map((act: string, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{act}</p>
                </div>
              ))}
            </div>

            {aiReport.saju_hybrid_vibe && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/30 space-y-1 mt-4">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> 오늘 나의 기운 x 타로 하이브리드 바이브
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {aiReport.saju_hybrid_vibe}
                </p>
              </div>
            )}
          </div>

          {/* 다시 리딩하기 버튼 */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setStep("SETUP");
                setDrawnCards([]);
                setAiReport(null);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
              다른 질문으로 새 타로 리딩하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
