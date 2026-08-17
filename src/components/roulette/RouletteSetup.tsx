"use strict";

import { useState } from "react";
import { Users, Target, Play, Plus, X } from "lucide-react";

interface RouletteSetupProps {
    onStart: (setupData: { mission1: string; mission2: string; players: string[] }) => void;
}

export const RouletteSetup = ({ onStart }: RouletteSetupProps) => {
    const [mission1, setMission1] = useState("");
    const [mission2, setMission2] = useState(""); // Optional
    const [newPlayer, setNewPlayer] = useState("");
    const [players, setPlayers] = useState<string[]>([]);

    // Default suggestion for players?
    // User can add max 10

    const addPlayer = () => {
        if (!newPlayer.trim()) return;
        if (players.length >= 10) {
            alert("최대 10명까지만 참여 가능합니다.");
            return;
        }
        if (players.includes(newPlayer.trim())) {
            alert("이미 존재하는 이름입니다.");
            return;
        }
        setPlayers([...players, newPlayer.trim()]);
        setNewPlayer("");
    };

    const removePlayer = (idx: number) => {
        setPlayers(players.filter((_, i) => i !== idx));
    };

    const handleStart = () => {
        if (!mission1) {
            alert("미션 1을 입력해주세요.");
            return;
        }
        if (players.length < 2) {
            alert("최 소 2명 이상의 플레이어가 필요합니다.");
            return;
        }
        onStart({ mission1, mission2, players });
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-slate-900/80 rounded-3xl p-8 border border-slate-700/50 shadow-2xl backdrop-blur-md animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-8">
                운명의 룰렛 설정
            </h2>

            {/* Missions */}
            <div className="space-y-4 mb-8">
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-pink-500" /> 미션 1 (필수)
                    </label>
                    <input
                        type="text"
                        value={mission1}
                        onChange={e => setMission1(e.target.value)}
                        placeholder="예: 커피 쏘기"
                        className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:border-pink-500 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-500" /> 미션 2 (선택 - 더블 스핀)
                    </label>
                    <input
                        type="text"
                        value={mission2}
                        onChange={e => setMission2(e.target.value)}
                        placeholder="예: 간식 사오기 (입력 시 2번 돌립니다)"
                        className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:border-purple-500 outline-none transition-all"
                    />
                    {mission2 && <p className="text-[10px] text-purple-400 mt-1">* 2번 연속으로 룰렛을 돌립니다.</p>}
                </div>
            </div>

            {/* Players */}
            <div className="mb-8">
                <label className="block text-xs font-bold text-slate-400 mb-2 flex items-center gap-2 justify-between">
                    <span className="flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> 참가자 ({players.length}/10)</span>
                </label>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newPlayer}
                        onChange={e => setNewPlayer(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addPlayer()}
                        placeholder="이름 입력 (예: 철수)"
                        className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <button onClick={addPlayer} className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl font-bold transition-colors">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[50px] bg-slate-950/30 rounded-xl p-3 border border-slate-800">
                    {players.length === 0 && <span className="text-slate-600 text-sm">참가자를 추가해주세요.</span>}
                    {players.map((p, i) => (
                        <span key={i} className="flex items-center gap-1 bg-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-full border border-slate-700 animate-fade-in">
                            {p}
                            <button onClick={() => removePlayer(i)} className="text-slate-500 hover:text-red-400"><X className="w-3 h-3" /></button>
                        </span>
                    ))}
                </div>
            </div>

            <button
                onClick={handleStart}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2"
            >
                <Play className="w-5 h-5 fill-current" /> 룰렛 만들기
            </button>

        </div>
    );
};
