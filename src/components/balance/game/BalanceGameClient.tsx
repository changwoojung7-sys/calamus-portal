"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { User, Sparkles, Scale, Trophy, Crown, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import GoogleAd from "@/components/ads/GoogleAd";

// Types
interface Question {
    id: number;
    question_a: string;
    question_b: string;
    desc_a: string;
    desc_b: string;
    count_a: number;
    count_b: number;
    total_votes: number;
}

interface Ranking {
    id: number;
    nickname: string;
    score: number;
    title: string;
    created_at: string;
}

type GameStep = "INTRO" | "PLAYING" | "LOADING" | "RESULT";

const TITLES = [
    { min: 90, title: "상위 1% 냉철한 이성파" },
    { min: 70, title: "현실적인 야망가" },
    { min: 50, title: "균형 잡힌 평화주의자" },
    { min: 30, title: "감성 충만 낭만파" },
    { min: 0, title: "자유로운 영혼의 몽상가" },
];

export default function BalanceGameClient() {
    const router = useRouter();
    const [step, setStep] = useState<GameStep>("INTRO");
    const [nickname, setNickname] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0); // For now, A = +10, B = 0 points logic? Or purely stylistic.

    // Voting State
    const [hasVoted, setHasVoted] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState<"A" | "B" | null>(null);
    const [currentStats, setCurrentStats] = useState<{ a: number; b: number } | null>(null);

    // Result & Ranking
    const [rankingList, setRankingList] = useState<Ranking[]>([]);
    const [myRankTitle, setMyRankTitle] = useState("");

    // 1. Fetch Questions on Mount
    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        // Get 10 random active questions
        const { data, error } = await supabase
            .from("game_balance_questions")
            .select("*")
            .eq("is_active", true)
            .limit(10);
        // Note: Random fetch needs backend support or fetching more and shuffling. 
        // For MVP, just fetching 10. Ideally use a .rpc for random 10.

        if (data) {
            // Shuffle array
            const shuffled = data.sort(() => 0.5 - Math.random());
            setQuestions(shuffled.slice(0, 10)); // Take 10
        }
    };

    // 2. Start Game
    const handleStart = () => {
        if (!nickname.trim()) return alert("닉네임을 입력해주세요!");
        if (questions.length === 0) return alert("게임 데이터를 불러오는 중입니다...");
        setStep("PLAYING");
    };

    // 3. Vote Logic
    const handleVote = async (choice: "A" | "B") => {
        if (hasVoted) return;

        setSelectedChoice(choice);
        setHasVoted(true);

        const q = questions[currentIndex];

        // Update Score (Simple Logic: A choice = Reality/Profit (+10), B choice = Romance/Freedom (+0))
        // This is arbitrary for fun.
        if (choice === "A") setScore((prev) => prev + 10);

        // Call RPC to update DB
        await supabase.rpc("vote_balance_game", {
            question_id: q.id,
            choice: choice,
        });

        // Update Local Stats for visual
        setCurrentStats({
            a: choice === "A" ? q.count_a + 1 : q.count_a,
            b: choice === "B" ? q.count_b + 1 : q.count_b,
        });
    };

    // 4. Next Question
    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setHasVoted(false);
            setSelectedChoice(null);
            setCurrentStats(null);
        } else {
            finishGame();
        }
    };

    // 5. Finish Game
    const finishGame = async () => {
        setStep("LOADING");

        // Determine Title
        const finalTitle = TITLES.find((t) => score >= t.min)?.title || "알 수 없는 모험가";
        setMyRankTitle(finalTitle);

        // Submit Score
        await supabase.rpc("submit_balance_score", {
            p_nickname: nickname,
            p_score: score,
            p_title: finalTitle,
        });

        // Fetch Ranking
        const { data: rankData } = await supabase
            .from("game_balance_rankings")
            .select("*")
            .order("score", { ascending: false })
            .limit(10);

        if (rankData) setRankingList(rankData);

        // Delay for Ad display (simulated)
        setTimeout(() => {
            setStep("RESULT");
        }, 2500);
    };

    // --- RENDERERS ---

    if (step === "INTRO") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-8 p-4 animate-fade-in-up">
                <div className="text-center space-y-4">
                    <div className="inline-block p-4 rounded-full bg-slate-800 border border-slate-700 shadow-xl mb-4">
                        <Scale className="w-12 h-12 text-cyan-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        <span className="text-cyan-400">극한의 이지선다</span><br />
                        밸런스 게임
                    </h1>
                    <p className="text-slate-400">
                        10개의 질문, 당신의 선택은?<br />
                        상위 1%의 성향을 찾아보세요!
                    </p>
                </div>

                <div className="w-full max-w-sm space-y-4">
                    <input
                        type="text"
                        placeholder="닉네임을 입력하세요 (최대 8자)"
                        maxLength={8}
                        className="w-full px-6 py-4 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-center text-lg"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleStart()}
                    />
                    <button
                        onClick={handleStart}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-lg shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-1"
                    >
                        게임 시작하기
                    </button>
                </div>
            </div>
        );
    }

    if (step === "PLAYING") {
        const q = questions[currentIndex];
        if (!q) return <div className="text-white">Loading...</div>;

        const total = (currentStats?.a || q.count_a) + (currentStats?.b || q.count_b) || 1; // avoid /0
        const percentA = Math.round(((currentStats?.a || q.count_a) / total) * 100);
        const percentB = 100 - percentA;

        return (
            <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 animate-fade-in">
                {/* Progress */}
                <div className="flex justify-between text-sm text-slate-400 px-2">
                    <span>Q{currentIndex + 1} / 10</span>
                    <span>{nickname}님의 선택</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-cyan-500 transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / 10) * 100}%` }}
                    />
                </div>

                {/* Question Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Option A */}
                    <button
                        disabled={hasVoted}
                        onClick={() => handleVote("A")}
                        className={`relative p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-center min-h-[240px] group
              ${selectedChoice === "A"
                                ? "bg-cyan-500/10 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.2)] scale-[1.02]"
                                : selectedChoice === "B"
                                    ? "bg-slate-900 border-slate-800 opacity-50 grayscale"
                                    : "bg-slate-900 border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800"}`}
                    >
                        <span className="text-4xl">🅰️</span>
                        <h3 className="text-xl font-bold text-white break-keep leading-relaxed">{q.question_a}</h3>

                        {hasVoted && (
                            <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center animate-fade-in z-10 backdrop-blur-sm">
                                <span className="text-4xl font-bold text-cyan-400">{percentA}%</span>
                                {selectedChoice === "A" && <span className="text-sm text-cyan-200 mt-2 font-medium">나의 선택!</span>}
                            </div>
                        )}
                    </button>

                    {/* Option B */}
                    <button
                        disabled={hasVoted}
                        onClick={() => handleVote("B")}
                        className={`relative p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-center min-h-[240px] group
              ${selectedChoice === "B"
                                ? "bg-red-500/10 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)] scale-[1.02]"
                                : selectedChoice === "A"
                                    ? "bg-slate-900 border-slate-800 opacity-50 grayscale"
                                    : "bg-slate-900 border-slate-700 hover:border-red-500/50 hover:bg-slate-800"}`}
                    >
                        <span className="text-4xl">🅱️</span>
                        <h3 className="text-xl font-bold text-white break-keep leading-relaxed">{q.question_b}</h3>

                        {hasVoted && (
                            <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center animate-fade-in z-10 backdrop-blur-sm">
                                <span className="text-4xl font-bold text-red-500">{percentB}%</span>
                                {selectedChoice === "B" && <span className="text-sm text-red-200 mt-2 font-medium">나의 선택!</span>}
                            </div>
                        )}
                    </button>
                </div>

                {/* AI Comment Area (Shown after vote) */}
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${hasVoted ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-start gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-purple-300 font-bold mb-1">AI의 한마디</p>
                            <p className="text-slate-200 text-sm leading-relaxed">
                                {selectedChoice === "A" ? q.desc_a : q.desc_b}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        className="w-full mt-4 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                        {currentIndex < 9 ? "다음 문제로 이동" : "결과 확인하기"} <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    if (step === "LOADING") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                <h2 className="text-2xl font-bold text-white">결과를 분석하고 있습니다...</h2>
                <p className="text-slate-400">당신의 성향을 랭킹에 등록하는 중입니다.</p>

                {/* --- AD Area for Monetization --- */}
                <div className="mt-8 w-full max-w-[320px] h-[250px] bg-slate-800 flex items-center justify-center rounded-xl overflow-hidden border border-slate-700">
                    {/* Replace with your specific Slot ID if distinct */}
                    <GoogleAd slot="3529245457" format="rectangle" responsive={false} style={{ display: 'block', width: '300px', height: '250px' }} />
                </div>
            </div>
        );
    }

    if (step === "RESULT") {
        return (
            <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 animate-fade-in-up">
                {/* Result Card */}
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-700 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-500" />

                    <h2 className="text-slate-400 mb-2">당신의 성향은?</h2>
                    <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 drop-shadow-sm">
                        {myRankTitle}
                    </h1>

                    <div className="flex justify-center items-end gap-2 mb-8">
                        <span className="text-6xl font-black text-white">{score}</span>
                        <span className="text-xl text-slate-500 mb-2">점</span>
                    </div>

                    <p className="text-slate-300 leading-relaxed mb-8">
                        수많은 선택의 갈림길에서 당신은<br />
                        <span className="text-cyan-400 font-bold">"{nickname}"</span>만의 독창적인 길을 걸어왔습니다.
                    </p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors flex items-center gap-2"
                        >
                            <Scale className="w-4 h-4" /> 다시하기
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
                        >
                            메인으로
                        </button>
                    </div>
                </div>

                {/* Ranking Board */}
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" /> 명예의 전당 (Top 10)
                    </h3>

                    <div className="space-y-3">
                        {rankingList.map((rank, idx) => (
                            <div key={rank.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-4">
                                    <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold
                       ${idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                            idx === 1 ? 'bg-slate-400/20 text-slate-300' :
                                                idx === 2 ? 'bg-orange-500/20 text-orange-400' : 'text-slate-500'}`}>
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <div className="font-bold text-white">{rank.nickname}</div>
                                        <div className="text-xs text-slate-400">{rank.title}</div>
                                    </div>
                                </div>
                                <div className="font-bold text-cyan-400">{rank.score}점</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
