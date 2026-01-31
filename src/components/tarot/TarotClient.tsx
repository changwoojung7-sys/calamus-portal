"use client";

import { useState, useEffect } from "react";
import { Sparkles, RefreshCcw, Layers, Search, Play, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { TarotCardData } from "./TarotCard";
import { TarotLayout } from "./TarotLayout";
import { TarotModal } from "./TarotModal";
import GoogleAd from "@/components/ads/GoogleAd";
import rawCards from "@/data/tarot_cards.json";

// Fix image paths safely
const allCards = ((rawCards || []) as any[]).map(c => {
    const fileName = c.image && typeof c.image === 'string' ? c.image.split('/').pop() : 'card-back.png';
    return {
        ...c,
        image: `/tarot/cards/${fileName}`
    };
}) as TarotCardData[];

const SPREADS = {
    3: { name: "과거·현재·미래 (3장)", positions: ["과거", "현재", "미래"] },
    5: { name: "5장 리딩 (심층)", positions: ["상황", "장애/도전", "조언", "결과", "숨은 영향"] },
    10: {
        name: "켈틱 크로스 (10장)", positions: [
            "현재", "장애/도움", "근본 원인", "과거", "의식/목표",
            "가까운 미래", "나(태도)", "환경/타인", "희망/두려움", "결말"
        ]
    }
};

export default function TarotClient() {
    const [step, setStep] = useState<"MENU" | "SHUFFLE" | "PLAY">("MENU");
    const [spread, setSpread] = useState<3 | 5 | 10>(3);
    const [drawnCards, setDrawnCards] = useState<TarotCardData[]>([]);
    const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
    const [question, setQuestion] = useState("");
    const [questionType, setQuestionType] = useState("종합");
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

    // AI State
    const [aiResult, setAiResult] = useState<string>("");
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Deck Shuffle Animation State
    const [isShuffling, setIsShuffling] = useState(false);



    // Replaced unused startShuffle with standard draw logic involving shuffle
    const drawCards = () => {
        setStep("SHUFFLE");
        setIsShuffling(true);
        setDrawnCards([]); // Clear previous cards
        setAiResult("");
        // setQuestion(""); // Removed to keep user question

        // Simulate shuffle time (1.5s)
        setTimeout(() => {
            // Randomly select cards
            const shuffled = [...allCards].sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, spread).map((card, i) => ({
                ...card,
                is_reversed: Math.random() < 0.3, // 30% chance of reversal
                position_label: SPREADS[spread].positions[i] || `${i + 1}번째`
            }));

            setDrawnCards(selected);
            setRevealedIndices([]);
            setIsShuffling(false);
            setStep("PLAY");
        }, 1500);
    };

    const handleCardClick = (index: number) => {
        if (!revealedIndices.includes(index)) {
            setRevealedIndices([...revealedIndices, index]);
        }
        setSelectedCardIndex(index);
    };

    const revealAll = async () => {
        // Sequentially reveal
        for (let i = 0; i < spread; i++) {
            if (!revealedIndices.includes(i)) {
                await new Promise(r => setTimeout(r, 200));
                setRevealedIndices(prev => [...prev, i]);
            }
        }
        // If all revealed (or will be), trigger AI if needed
    };

    const runAiAnalysis = async () => {
        if (!drawnCards.length) return;
        setIsAiLoading(true);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // Scroll to loading area

        try {
            // Parallel execution: API Call + Minimum Timer (3s)
            const [data] = await Promise.all([
                fetch("/api/tarot", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        question,
                        spreadDispatch: spread,
                        spread,
                        cards: drawnCards,
                        questionType,
                        mode: "openai"
                    })
                }).then(res => res.json()),
                new Promise(resolve => setTimeout(resolve, 3000)) // Min 3s wait for Ad
            ]);

            if (data.result) {
                setAiResult(data.result);
            } else {
                setAiResult("AI 분석에 실패했습니다.");
            }
        } catch (e) {
            setAiResult("오류가 발생했습니다.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const resetGame = () => {
        setStep("MENU");
        setDrawnCards([]);
        setRevealedIndices([]);
        setAiResult("");
        setQuestion("");
    };

    return (
        <div className="w-full max-w-[1800px] mx-auto flex flex-col md:flex-row gap-6 p-6 min-h-[90vh] font-sans text-slate-200">

            {/* Sidebar (Left) */}
            <aside className="w-full md:w-[320px] shrink-0 flex flex-col gap-6 animate-fade-in-right">
                {/* Logo/Header */}
                <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-md shadow-xl">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-700/50 pb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-xl font-bold font-serif text-slate-100">TARO 500</h1>
                    </div>

                    {/* Question Input */}
                    <div className="mb-6">
                        <label className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                            <span>질문</span>
                            <span className="text-slate-600 font-normal">구체적일수록 좋아요</span>
                        </label>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder={
                                questionType === "연애" ? "그 사람의 속마음이 궁금해요." :
                                    questionType === "직업" ? "이직을 하는게 좋을까요?" :
                                        "이번 달의 전반적인 운세는?"
                            }
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:border-purple-500 outline-none transition-all resize-none h-24"
                        />
                    </div>

                    {/* Question Type */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">질문 유형</label>
                        <div className="grid grid-cols-4 gap-1">
                            {["종합", "연애", "직업", "금전"].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setQuestionType(type)}
                                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${questionType === type
                                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Spread Selection */}
                    <div className="mb-6">
                        <div className="flex justify-between items-end mb-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">스프레드 선택</label>
                            <span className="text-[10px] text-slate-500">3장/5장/켈틱 크로스(10장)</span>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            {[3, 5, 10].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setSpread(num as any)}
                                    className={`relative p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${spread === num
                                        ? "bg-purple-900/40 border-purple-500/70 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                        : "bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/60 hover:border-slate-600"
                                        }`}
                                >
                                    <div>
                                        <div className={`text-sm font-bold mb-0.5 ${spread === num ? "text-purple-300" : "text-slate-200 group-hover:text-slate-100"}`}>
                                            {num === 3 && "과거·현재·미래 (3장)"}
                                            {num === 5 && "5장 리딩 (문제 해결)"}
                                            {num === 10 && "켈틱 크로스 (10장)"}
                                        </div>
                                        <div className="text-[10px] text-slate-500 group-hover:text-slate-400">
                                            {num === 3 && "간단한 흐름과 조언이 필요할 때"}
                                            {num === 5 && "구체적인 문제와 해결책을 원할 때"}
                                            {num === 10 && "가장 심도 깊고 상세한 전체 운세"}
                                        </div>
                                    </div>
                                    {spread === num && (
                                        <div className="w-2 h-2 rounded-full bg-purple-400/80 shadow-[0_0_10px_rgba(192,132,252,0.8)]"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Options */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-4 h-4 rounded border border-purple-500/50 bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/40">
                                <div className="w-2 h-2 bg-purple-400 rounded-sm"></div>
                            </div>
                            <span className="text-xs text-slate-400 group-hover:text-slate-200">카드 상세해설 포함</span>
                        </label>
                    </div>

                    {/* AI Mode (Fixed) */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">종합해설 엔진</label>
                        </div>
                        <div className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 flex items-center justify-between">
                            <span className="text-xs text-slate-300 flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-emerald-400" /> OpenAI GPT-4o
                            </span>
                            <span className="text-[10px] text-emerald-500 font-bold px-2 py-0.5 bg-emerald-900/30 rounded-full">Active</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-[2fr_1fr_1fr] gap-2">
                        <button
                            onClick={drawCards}
                            disabled={isShuffling}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                        >
                            {isShuffling ? <Loader2 className="w-4 h-4 animate-spin" /> : "카드 뽑기"}
                        </button>
                        <button onClick={revealAll} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-xs font-medium transition-colors">
                            전체 공개
                        </button>
                        <button onClick={resetGame} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-xs font-medium transition-colors">
                            초기화
                        </button>
                    </div>

                    <div className="mt-4 text-[10px] text-center text-slate-600">
                        OpenAI 리딩: 1 / 3 (내일 00:00 초기화)
                    </div>
                </div>
            </aside>


            {/* Main Content (Right) */}
            <main className="flex-1 min-w-0 flex flex-col gap-6 animate-fade-in">
                {/* Title Area */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 uppercase">{questionType}</span>
                        <h2 className="text-xl font-bold text-slate-200">
                            {spread === 3 && "과거·현재·미래 (3장)"}
                            {spread === 5 && "5장 리딩 (심층)"}
                            {spread === 10 && "켈틱 크로스 (10장)"}
                        </h2>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-100 mb-4 flex items-center gap-3">
                        종합해설
                        {revealedIndices.length === spread && !aiResult && !isAiLoading && (
                            <button onClick={runAiAnalysis} className="text-sm bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-full animate-bounce shadow-lg shadow-purple-900/50 transition-all">
                                AI 분석 시작하기
                            </button>
                        )}
                    </h3>
                </div>

                {/* Content Container */}
                <div className="flex-1 bg-slate-900/40 border border-slate-700/30 rounded-3xl p-6 md:p-10 backdrop-blur-sm relative min-h-[600px] flex flex-col">

                    {/* Placeholder when empty */}
                    {drawnCards.length === 0 && !isShuffling && (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
                            <Layers className="w-16 h-16 opacity-20" />
                            <p className="text-lg">준비 완료! 스프레드를 선택하고 '카드 뽑기'를 눌러주세요.</p>
                        </div>
                    )}

                    {/* Shuffling Overlay/State */}
                    {isShuffling && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-3xl">
                            <div className="relative w-32 h-48 animate-pulse">
                                <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur-xl"></div>
                                <img src="/tarot/card-back.png" className="w-full h-full object-cover rounded-xl border border-white/20 shadow-2xl animate-spin py-10" style={{ animationDuration: "2s" }} />
                            </div>
                            <p className="mt-8 text-xl text-purple-200 font-bold animate-pulse">운명의 카드를 섞는 중...</p>
                        </div>
                    )}

                    {/* Game Board */}
                    {drawnCards.length > 0 && !isShuffling && (
                        <div className="flex flex-col gap-8 h-full">

                            {/* Cards Area */}
                            <div className="w-full flex-1 flex flex-col items-center justify-center p-4 min-h-[400px]">
                                <TarotLayout
                                    cards={drawnCards}
                                    spreadType={spread}
                                    revealedIndices={revealedIndices}
                                    onCardClick={handleCardClick}
                                />
                            </div>

                            {/* AI Result Area (Bottom of Main) */}
                            {(aiResult || isAiLoading) && (
                                <div className="mt-auto border-t border-slate-700/50 pt-6 animate-fade-in-up">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-bold text-slate-300 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-purple-400" />
                                            AI 분석 결과 ({questionType})
                                        </h4>
                                    </div>

                                    {isAiLoading && (
                                        <div className="flex flex-col items-center justify-center gap-6 py-10 animate-fade-in">
                                            <div className="relative w-20 h-20">
                                                <div className="absolute inset-0 border-4 border-purple-900/30 rounded-full"></div>
                                                <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                                <Sparkles className="absolute inset-0 m-auto text-purple-400 w-8 h-8 animate-pulse" />
                                            </div>

                                            <div className="text-center">
                                                <h3 className="text-xl font-bold text-white mb-2">운명적 카드의 메시지를 해석 중입니다...</h3>
                                                <p className="text-purple-300/60 text-sm">잠시만 기다려주세요.</p>
                                            </div>

                                            {/* Loading Ad */}
                                            <div className="w-full max-w-[320px] h-[100px] bg-slate-800 flex items-center justify-center rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                                                <GoogleAd slot="3529245457" format="horizontal" responsive={false} style={{ display: 'block', width: '320px', height: '100px' }} />
                                            </div>
                                        </div>
                                    )}

                                    {aiResult && (
                                        <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-headings:text-slate-200 bg-slate-950/30 p-6 rounded-2xl border border-white/5 shadow-inner">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiResult}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </main>

            {/* Modal */}
            <TarotModal
                card={selectedCardIndex !== null ? drawnCards[selectedCardIndex] : null}
                index={selectedCardIndex}
                onClose={() => setSelectedCardIndex(null)}
            />



        </div>
    );
}
