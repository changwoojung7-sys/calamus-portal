"use client";

import { useState } from "react";
import { BrakeSetup } from "./BrakeSetup";
import { BrakeGame } from "./BrakeGame";

export default function BrakeClient() {
    const [step, setStep] = useState<"SETUP" | "GAME">("SETUP");
    const [players, setPlayers] = useState<string[]>([]);
    const [gameKey, setGameKey] = useState(0);

    const startGame = (names: string[]) => {
        setPlayers(names);
        setStep("GAME");
        setGameKey(0); // Reset key on new game
    };

    const handleRestart = () => {
        // Just increment key to re-mount BrakeGame with SAME players
        setGameKey(prev => prev + 1);
    };

    const handleToSetup = () => {
        setStep("SETUP");
        setPlayers([]);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-rose-500/30">
            {step === "SETUP" && <BrakeSetup onStart={startGame} />}
            {step === "GAME" && (
                <BrakeGame
                    key={gameKey}
                    players={players}
                    onRestart={handleRestart}
                    onToSetup={handleToSetup}
                />
            )}
        </div>
    );
}
