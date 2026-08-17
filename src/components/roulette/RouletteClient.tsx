"use client";

import { useState } from "react";
import { Gamepad2 } from "lucide-react";
import { RouletteSetup } from "./RouletteSetup";
import { RouletteGame } from "./RouletteGame";

export default function RouletteClient() {
    const [step, setStep] = useState<"SETUP" | "GAME">("SETUP");
    const [gameData, setGameData] = useState<{ mission1: string; mission2: string; players: string[] } | null>(null);

    const handleStart = (data: { mission1: string; mission2: string; players: string[] }) => {
        setGameData(data);
        setStep("GAME");
    };

    const handleReset = () => {
        setStep("SETUP");
        setGameData(null);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 min-h-[80vh] flex flex-col items-center">

            {/* Header */}
            {step === "SETUP" && (
                <header className="text-center mb-10 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-900/30 border border-pink-700/50 text-pink-400 text-xs mb-4">
                        <Gamepad2 className="w-3 h-3" />
                        <span>랜덤 벌칙 게임</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4 drop-shadow-md">
                        🎡 운명의 룰렛
                    </h1>
                    <p className="text-slate-400">
                        오늘의 주인공은 누구?<br />최대 10명까지 참여 가능합니다.
                    </p>
                </header>
            )}

            {step === "SETUP" && <RouletteSetup onStart={handleStart} />}

            {step === "GAME" && gameData && (
                <RouletteGame
                    mission1={gameData.mission1}
                    mission2={gameData.mission2}
                    players={gameData.players}
                    onReset={handleReset}
                />
            )}

        </div>
    );
}
