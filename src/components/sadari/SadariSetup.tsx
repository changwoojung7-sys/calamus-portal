"use client";

import { useState } from "react";
import { Users, AlertCircle, RefreshCcw } from "lucide-react";

interface SadariSetupProps {
    onStart: (numPlayers: number, names: string[], rewards: string[]) => void;
}

export default function SadariSetup({ onStart }: SadariSetupProps) {
    const [numPlayers, setNumPlayers] = useState(4);
    const [names, setNames] = useState<string[]>(Array(4).fill(""));
    const [rewardsStr, setRewardsStr] = useState("");
    const [error, setError] = useState("");

    const handleNumChange = (n: number) => {
        if (n < 2) n = 2;
        if (n > 10) n = 10;
        setNumPlayers(n);
        setNames(prev => {
            const needed = n;
            const next = [...prev];
            if (next.length < needed) {
                // Grow
                for (let i = next.length; i < needed; i++) next.push("");
            } else {
                // Shrink (or just slice)
                next.splice(needed);
            }
            return next;
        });
    };

    const handleNameChange = (idx: number, val: string) => {
        const next = [...names];
        next[idx] = val;
        setNames(next);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate Rewards
        const rewards = rewardsStr.split(",").map(s => s.trim()).filter(s => s.length > 0);
        if (rewards.length === 0) {
            setError("벌칙/상품을 최소 1개 입력해주세요.");
            return;
        }
        if (rewards.length > numPlayers) {
            setError(`벌칙 개수(${rewards.length})가 참여자 수(${numPlayers})보다 많습니다.`);
            return;
        }

        // Default names
        const finalNames = names.map((n, i) => n.trim() || `플레이어${i + 1}`);

        // Fill remaining rewards with "꽝"
        // However, the original logic filled remainder with "꽝" dynamically, here we pass the explicitly entered rewards 
        // and let the game logic handle distribution. The game logic expects array of length N? 
        // Original code: "나머지 플레이어는 자동으로 '꽝' 처리됩니다." -> It means we need to pad the rewards array to size N?
        // Actually, in the original code, it assigns rewards to specific end columns randomly (via shuffle).
        // Let's pass standard rewards list, Game component will handle padding.

        onStart(numPlayers, finalNames, rewards);
    };

    return (
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md animate-fade-in text-slate-200">

            <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                <Users className="text-emerald-400 w-5 h-5" />
                <h2 className="font-bold text-lg">게임 설정</h2>
            </div>

            {error && (
                <div className="bg-red-900/40 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Num Players */}
                <div>
                    <label className="block text-sm text-slate-400 mb-1">인원 수 (2~10명)</label>
                    <input
                        type="number"
                        min="2" max="10"
                        value={numPlayers}
                        onChange={e => handleNumChange(parseInt(e.target.value))}
                        className="bg-slate-800 border-slate-600 rounded-lg px-3 py-2 text-white w-24 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>

                {/* Names Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {names.map((nm, i) => (
                        <div key={i}>
                            <label className="block text-xs text-slate-500 mb-1">참여자 {i + 1}</label>
                            <input
                                type="text"
                                value={nm}
                                onChange={e => handleNameChange(i, e.target.value)}
                                placeholder={`플레이어${i + 1}`}
                                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-white focus:border-emerald-500 outline-none"
                            />
                        </div>
                    ))}
                </div>

                {/* Rewards */}
                <div>
                    <label className="block text-sm text-slate-400 mb-1">벌칙 / 상품 (쉼표로 구분)</label>
                    <textarea
                        rows={3}
                        placeholder="예) 커피 쏘기, 간식 사오기, 노래 부르기"
                        value={rewardsStr}
                        onChange={e => setRewardsStr(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        * 입력한 개수만큼 당첨자가 나오며, 나머지는 자동으로 '꽝'이 됩니다.
                    </p>
                </div>

                <div className="pt-4 flex gap-3">
                    <button
                        type="submit"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-900/30 transition-all"
                    >
                        사다리 타기 시작!
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setNumPlayers(4);
                            setNames(Array(4).fill(""));
                            setRewardsStr("");
                            setError("");
                        }}
                        className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-colors"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </button>
                </div>

            </form>
        </div>
    );
}
