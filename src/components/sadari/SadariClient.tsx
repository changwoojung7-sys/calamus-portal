"use client";

import { useState } from "react";
import SadariSetup from "./SadariSetup";
import SadariGame from "./SadariGame";

export default function SadariClient() {
    const [gameState, setGameState] = useState<"SETUP" | "GAME">("SETUP");
    const [config, setConfig] = useState<{ num: number, names: string[], rewards: string[] } | null>(null);

    const handleStart = (num: number, names: string[], rewards: string[]) => {
        setConfig({ num, names, rewards });
        setGameState("GAME");
    };

    const handleReset = () => {
        setGameState("SETUP");
        setConfig(null);
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4">
            <header className="text-center mb-8 animate-fade-in-up">
                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm font-sans tracking-tight">
                    ARCADE LADDER
                </h1>
                <p className="text-slate-400 text-sm mt-2">
                    공정한 랜덤 내기 게임
                </p>
            </header>

            {gameState === "SETUP" && <SadariSetup onStart={handleStart} />}

            {gameState === "GAME" && config && (
                <SadariGame
                    numPlayers={config.num}
                    names={config.names}
                    rewards={config.rewards}
                    onReset={handleReset}
                />
            )}
        </div>
    );
}
