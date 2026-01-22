"use client";

import { useState } from "react";
import { Car, Users, Play, Plus, X } from "lucide-react";
import { motion } from "framer-motion";

interface BrakeSetupProps {
    onStart: (names: string[]) => void;
}

export const BrakeSetup = ({ onStart }: BrakeSetupProps) => {
    const [names, setNames] = useState<string[]>(["", ""]);

    const updateName = (index: number, val: string) => {
        const newNames = [...names];
        newNames[index] = val;
        setNames(newNames);
    };

    const addPlayer = () => {
        if (names.length < 10) {
            setNames([...names, ""]);
        }
    };

    const removePlayer = (index: number) => {
        if (names.length > 2) {
            setNames(names.filter((_, i) => i !== index));
        }
    };

    const handleStart = () => {
        const validNames = names.map(n => n.trim()).filter(n => n !== "");
        if (validNames.length < 2) {
            alert("최소 2명의 플레이어가 필요합니다.");
            return;
        }
        onStart(validNames);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/20 via-[#020617] to-[#020617] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                        <Car className="w-8 h-8 text-rose-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">브레이크 게임</h1>
                    <p className="text-slate-400 text-sm">
                        절벽 끝에서 멈춰라!<br />
                        가장 늦게 브레이크를 밟는 담력왕은 누구?
                    </p>
                </div>

                <div className="space-y-3 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Users className="w-3 h-3" /> 플레이어 목록 ({names.length}/10)
                        </label>
                    </div>

                    {names.map((name, i) => (
                        <div key={i} className="flex gap-2 animate-fade-in-right" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className="w-full relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                                    P{i + 1}
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => updateName(i, e.target.value)}
                                    placeholder={`플레이어 ${i + 1}`}
                                    className="w-full bg-slate-800/50 border border-slate-700 focus:border-rose-500 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && i === names.length - 1 && names.length < 10) {
                                            addPlayer();
                                        }
                                    }}
                                />
                            </div>
                            {names.length > 2 && (
                                <button
                                    onClick={() => removePlayer(i)}
                                    className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-500 hover:text-rose-400 hover:bg-slate-800 hover:border-rose-500/30 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}

                    {names.length < 10 && (
                        <button
                            onClick={addPlayer}
                            className="w-full py-3 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 hover:text-slate-300 hover:border-slate-700 hover:bg-slate-800/30 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                        >
                            <Plus className="w-4 h-4" /> 플레이어 추가
                        </button>
                    )}
                </div>

                <button
                    onClick={handleStart}
                    className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-rose-900/30 transition-all flex items-center justify-center gap-2 group"
                >
                    <Play className="w-5 h-5 fill-current" />
                    게임 시작
                </button>
            </motion.div>
        </div>
    );
};
