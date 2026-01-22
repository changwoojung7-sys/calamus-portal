"use client";

import { useState, useEffect, useRef } from "react";
import { Car, AlertTriangle, RefreshCw, Trophy, Flag } from "lucide-react";

interface BrakeGameProps {
    players: string[];
    onRestart: () => void;
    onToSetup: () => void;
}

interface GameResult {
    name: string;
    distance: number;
    status: "SAFE" | "CRASHED";
}

export const BrakeGame = ({ players, onRestart, onToSetup }: BrakeGameProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    // UI State for rendering
    const [gameState, setGameState] = useState<"READY" | "RUNNING" | "BRAKING" | "STOPPED">("READY");
    const [currentDistance, setCurrentDistance] = useState(0);
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const [results, setResults] = useState<GameResult[]>([]);
    const [showRankings, setShowRankings] = useState(false);

    // Logic Refs (Source of Truth for Loop)
    const gameStateRef = useRef<"READY" | "RUNNING" | "BRAKING" | "STOPPED">("READY");
    const animationFrameRef = useRef<number>(0);
    const speedRef = useRef(0);
    const distanceRef = useRef(0);

    // Audio Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const oscillatorsRef = useRef<{ main: OscillatorNode, sub: OscillatorNode } | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    const currentPlayer = players[currentIndex];
    const isGameFinished = results.length === players.length;

    // Helper to set state both in Ref and React State
    const updateGameState = (newState: "READY" | "RUNNING" | "BRAKING" | "STOPPED") => {
        gameStateRef.current = newState;
        setGameState(newState);
    };

    // --- AUDIO ENGINE ---
    const initAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    };

    const startEngineSound = () => {
        if (!audioContextRef.current) initAudio();
        const ctx = audioContextRef.current!;
        if (ctx.state === 'suspended') ctx.resume();

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.15, ctx.currentTime);
        masterGain.connect(ctx.destination);

        // Osc 1: Main Growl (Sawtooth)
        const osc1 = ctx.createOscillator();
        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(80, ctx.currentTime);

        // Filter for Osc 1
        const filter1 = ctx.createBiquadFilter();
        filter1.type = "lowpass";
        filter1.frequency.setValueAtTime(400, ctx.currentTime);
        filter1.Q.value = 1;
        osc1.connect(filter1).connect(masterGain);

        // Osc 2: Sub Bass (Triangle)
        const osc2 = ctx.createOscillator();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(40, ctx.currentTime);
        const subGain = ctx.createGain();
        subGain.gain.value = 0.8;
        osc2.connect(subGain).connect(masterGain);

        osc1.start();
        osc2.start();

        oscillatorsRef.current = { main: osc1, sub: osc2 };
        gainNodeRef.current = masterGain;
    };

    const updateEngineSound = (speed: number) => {
        if (oscillatorsRef.current && audioContextRef.current) {
            const ctx = audioContextRef.current;
            // Map speed (0 ~ 4) to Pitch
            // Idle: 80Hz. Max: ~400Hz
            const pitch = 80 + (speed * 80);

            oscillatorsRef.current.main.frequency.setTargetAtTime(pitch, ctx.currentTime, 0.1);
            oscillatorsRef.current.sub.frequency.setTargetAtTime(pitch / 2, ctx.currentTime, 0.1);

            if (gainNodeRef.current) {
                gainNodeRef.current.gain.setTargetAtTime(0.1 + (speed * 0.05), ctx.currentTime, 0.1);
            }
        }
    };

    const stopEngineSound = () => {
        if (oscillatorsRef.current && gainNodeRef.current) {
            const ctx = audioContextRef.current!;
            gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            oscillatorsRef.current.main.stop(ctx.currentTime + 0.5);
            oscillatorsRef.current.sub.stop(ctx.currentTime + 0.5);
            oscillatorsRef.current = null;
        }
    };

    // --- GAME LOGIC ---

    const startGame = () => {
        initAudio();
        startEngineSound();

        updateGameState("RUNNING");
        distanceRef.current = 0;
        speedRef.current = 0.8; // Start speed
        setCurrentDistance(0);

        // Start Loop
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    const triggerBrake = () => {
        // Check local ref for immediate response logic
        if (gameStateRef.current !== "RUNNING") return;
        updateGameState("BRAKING");
    };

    const gameLoop = () => {
        const currentMode = gameStateRef.current; // Read from Ref!

        // STATE: RUNNING (Racing Acceleration)
        if (currentMode === "RUNNING") {
            if (speedRef.current < 6.0) {
                speedRef.current *= 1.025;
            }
        }
        // STATE: BRAKING (Linear Deceleration)
        else if (currentMode === "BRAKING") {
            // Decel rate
            speedRef.current -= 0.15;

            if (speedRef.current <= 0) {
                speedRef.current = 0;
                finishTurn();
                return; // Stop loop
            }
        }
        else if (currentMode === "STOPPED" || currentMode === "READY") {
            // Safety valve: stop loop if we shouldn't be running
            return;
        }

        // Update Sound
        updateEngineSound(speedRef.current);

        // Move
        distanceRef.current += speedRef.current;
        setCurrentDistance(distanceRef.current);
        setCurrentSpeed(speedRef.current);

        // Crash Check
        if (distanceRef.current > 140) {
            finishTurn(true);
            return;
        }

        animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    const finishTurn = (forceCrash: boolean = false) => {
        cancelAnimationFrame(animationFrameRef.current);
        stopEngineSound();

        // Finalize state
        gameStateRef.current = "STOPPED";
        setGameState("STOPPED");

        const finalDist = distanceRef.current;
        const isCrashed = forceCrash || finalDist > 100.1;

        setResults(prev => [...prev, {
            name: currentPlayer,
            distance: finalDist,
            status: isCrashed ? "CRASHED" : "SAFE"
        }]);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            stopEngineSound();
        };
    }, []);

    const nextPlayer = () => {
        setCurrentIndex(prev => prev + 1);
        updateGameState("READY");
        setCurrentDistance(0);
        distanceRef.current = 0;
        speedRef.current = 0;
        setCurrentSpeed(0);
    };

    // Sort for Rank: Safe (desc distance), then Crashed
    const sortedResults = [...results].sort((a, b) => {
        if (a.status === "SAFE" && b.status === "CRASHED") return -1;
        if (a.status === "CRASHED" && b.status === "SAFE") return 1;
        if (a.status === "SAFE" && b.status === "SAFE") return b.distance - a.distance;
        return a.distance - b.distance;
    });

    const carLeftPos = 5 + (currentDistance / 100) * 80;

    const vibrateStyle = currentSpeed > 0.5 ? {
        animation: `vibrate ${Math.max(0.1, 1 / currentSpeed)}s linear infinite`
    } : {};

    return (
        <div className="min-h-screen flex flex-col items-center p-6 bg-[#020617] text-white relative overflow-hidden">

            <style jsx>{`
                @keyframes vibrate {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(1px, 1px) rotate(0.5deg); }
                    50% { transform: translate(0, 0) rotate(0deg); }
                    75% { transform: translate(-1px, 1px) rotate(-0.5deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
             `}</style>

            {/* Mobile Portrait Warning Overlay */}
            <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 text-center md:hidden portrait:flex hidden">
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl animate-pulse">
                    <div className="text-4xl mb-4">📱🔄</div>
                    <h3 className="text-xl font-bold text-white mb-2">가로 모드 권장</h3>
                    <p className="text-slate-400">
                        원활한 게임 진행을 위해<br />
                        화면을 가로로 돌려주세요!
                    </p>
                </div>
            </div>

            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/10 via-[#020617] to-[#020617] pointer-events-none"></div>

            {/* Main Game Area */}
            {!isGameFinished ? (
                <div className="w-full max-w-4xl relative z-10 flex flex-col items-center mt-10">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-block bg-slate-800 px-6 py-2 rounded-2xl border border-slate-700 mb-4 shadow-lg">
                            <span className="text-slate-400 mr-2 uppercase tracking-widest text-xs font-bold">Current Player</span>
                            <span className="text-2xl font-black text-amber-500">P{currentIndex + 1}. {currentPlayer}</span>
                        </div>
                        <h2 className="text-6xl font-black italic tracking-tighter drop-shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                            <span className="text-white">BRAKE</span> <span className="text-red-600">PLEASE</span>
                        </h2>
                    </div>

                    {/* TRACK */}
                    <div className="w-full relative h-48 mb-12 select-none perspective-1000">
                        {/* Track Surface */}
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border-y-4 border-slate-700 overflow-hidden shadow-2xl transform rotate-x-12">

                            {/* Asphalt Texture */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asphalt-dark.png')]"></div>

                            {/* Dashed Line */}
                            <div className="absolute top-1/2 left-0 right-0 h-0 border-t-4 border-dashed border-slate-500/30"></div>

                            {/* Yellow Target Line (100m) */}
                            <div className="absolute top-0 bottom-0 w-2 bg-yellow-400 shadow-[0_0_30px_rgba(250,204,21,1)] z-10" style={{ left: '85%' }}></div>
                            <div className="absolute -top-10 left-[85%] -translate-x-1/2 bg-yellow-400/10 border border-yellow-400/50 text-yellow-400 px-2 py-1 rounded font-bold text-xs uppercase tracking-widest backdrop-blur-sm">Target 100m</div>

                            {/* Red Zone (>100m) */}
                            <div className="absolute top-0 bottom-0 right-0 left-[85%] bg-[repeating-linear-gradient(45deg,rgba(220,38,38,0.1),rgba(220,38,38,0.1)_10px,rgba(220,38,38,0.2)_10px,rgba(220,38,38,0.2)_20px)] border-l border-red-500">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-red-500/30 font-black text-5xl rotate-0 select-none tracking-[1em]">DANGER</div>
                                </div>
                            </div>
                        </div>

                        {/* CAR */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 transition-none will-change-transform z-20"
                            style={{
                                left: `${Math.min(carLeftPos, 96)}%`
                            }}
                        >
                            <div className="relative -translate-x-full pr-2">
                                {/* Car Body */}
                                <div style={vibrateStyle} className="transition-transform">
                                    <Car className={`w-20 h-20 transition-colors duration-200 ${currentDistance > 100
                                        ? 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,1)]'
                                        : gameState === "BRAKING" ? 'text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]'
                                            : 'text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]'
                                        }`} />

                                    {/* Speed Lines Effect */}
                                    {gameState === "RUNNING" && (
                                        <div className="absolute top-1/2 right-full w-20 h-full -translate-y-1/2 overflow-hidden opacity-50">
                                            <div className="w-10 h-0.5 bg-cyan-400 absolute top-2 right-0 animate-slide-left"></div>
                                            <div className="w-16 h-0.5 bg-cyan-400 absolute top-10 right-0 animate-slide-left delay-75"></div>
                                            <div className="w-8 h-0.5 bg-cyan-400 absolute top-16 right-0 animate-slide-left delay-150"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Front Bumper Marker */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white/80 rounded-full shadow-[0_0_10px_white]"></div>

                                {/* Distance Label */}
                                <div className="absolute top-full right-0 mt-3 font-mono font-black text-lg bg-black/80 px-3 py-1 rounded-lg border border-slate-700 whitespace-nowrap shadow-xl">
                                    <span className={currentDistance > 100 ? "text-red-500" : "text-white"}>{currentDistance.toFixed(1)}</span>
                                    <span className="text-slate-500 text-xs ml-1">m</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONTROLS */}
                    <div className="w-full max-w-md flex items-center justify-center mb-12 min-h-[140px]">
                        {gameState === "READY" && (
                            <button
                                onClick={startGame}
                                className="w-full py-6 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 rounded-3xl font-black text-4xl shadow-[0_10px_20px_rgba(30,58,138,0.5)] border-b-8 border-blue-900 active:border-b-0 active:translate-y-2 transition-all uppercase tracking-widest flex items-center justify-center gap-4 group"
                            >
                                <Flag className="w-10 h-10 group-hover:rotate-12 transition-transform" /> START
                            </button>
                        )}
                        {gameState === "RUNNING" && (
                            <button
                                onClick={triggerBrake}
                                onMouseDown={triggerBrake}
                                onTouchStart={triggerBrake}
                                className="w-full py-8 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-3xl font-black text-5xl shadow-[0_10px_30px_rgba(225,29,72,0.6)] border-b-8 border-red-900 active:border-b-0 active:translate-y-2 transition-all uppercase tracking-widest flex items-center justify-center gap-6 animate-pulse"
                            >
                                <AlertTriangle className="w-12 h-12" /> BRAKE!
                            </button>
                        )}
                        {gameState === "BRAKING" && (
                            <div className="text-center">
                                <div className="text-3xl font-black text-orange-500 tracking-widest animate-bounce">
                                    BRAKING...
                                </div>
                                <div className="text-slate-500 text-sm mt-2">Maximum braking power applied!</div>
                            </div>
                        )}
                        {gameState === "STOPPED" && (
                            <div className="w-full flex bg-slate-800 rounded-3xl p-2 border border-slate-700 shadow-2xl">
                                <div className="flex-1 flex flex-col items-center justify-center py-2">
                                    <div className="text-xs font-bold text-slate-500 tracking-wider">RESULT</div>
                                    <div className={`text-4xl font-black ${currentDistance > 100 ? 'text-red-500' : 'text-emerald-400'}`}>
                                        {currentDistance > 100 ? 'CRASH' : currentDistance.toFixed(2)}
                                        <span className="text-base ml-1 opacity-50">m</span>
                                    </div>
                                </div>
                                <button
                                    onClick={nextPlayer}
                                    className="px-8 bg-slate-700 hover:bg-slate-600 hover:text-white text-slate-300 rounded-2xl font-bold transition-all text-xl"
                                >
                                    {currentIndex === players.length - 1 ? "Finish!" : "Next Player →"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* LIVE RECORDS */}
                    <div className="w-full max-w-2xl">
                        <div className="flex items-center gap-2 mb-3 px-2">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Live Standings</span>
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                            {results.length === 0 ? (
                                <div className="text-center text-slate-700 py-6 border-2 border-dashed border-slate-800 rounded-xl font-bold">Waiting for first brave soul...</div>
                            ) : (
                                [...results].reverse().map((res, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-slate-800/80 backdrop-blur rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs bg-slate-900 text-slate-500 px-2 py-1 rounded font-mono">Run #{results.length - i}</span>
                                            <span className="font-bold text-slate-200 text-lg">{res.name}</span>
                                        </div>
                                        <span className={`font-mono font-black text-xl ${res.status === "CRASHED" ? "text-red-500" : "text-emerald-400"}`}>
                                            {res.status === "CRASHED" ? `CRASH` : `${res.distance.toFixed(2)}m`}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            ) : !showRankings ? (
                // INTERMEDIATE STEP: Reveal Button
                <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
                    <h2 className="text-4xl font-black text-white mb-8">모든 플레이 종료!</h2>
                    <button
                        onClick={() => setShowRankings(true)}
                        className="px-10 py-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-full font-black text-3xl shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:scale-105 transition-all text-white flex items-center gap-3"
                    >
                        <Trophy className="w-8 h-8" />
                        결과 순위 확인하기
                    </button>
                    <p className="mt-6 text-slate-500">두구두구두구... 과연 1등은?</p>
                </div>
            ) : (
                // FINAL RESULTS SCREEN
                <div className="w-full max-w-lg bg-slate-900/90 backdrop-blur-xl rounded-[2rem] p-10 border border-slate-700 shadow-2xl mt-12 relative overflow-hidden animate-fade-in">
                    {/* Confetti Effect bg */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.1),transparent_70%)]"></div>

                    <h2 className="text-4xl font-black text-center mb-2 flex items-center justify-center gap-3 relative z-10">
                        <Trophy className="w-10 h-10 text-yellow-500 drop-shadow-lg" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600">Leaderboard</span>
                    </h2>
                    <p className="text-center text-slate-500 mb-8 relative z-10">Who has the nerves of steel?</p>

                    <div className="space-y-3 mb-10 relative z-10">
                        {sortedResults.map((res, i) => (
                            <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-transform hover:scale-[1.02] ${i === 0 && res.status === "SAFE"
                                ? "bg-gradient-to-r from-yellow-900/20 to-amber-900/10 border-yellow-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                : "bg-slate-800/50 border-slate-700"
                                }`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${i === 0 ? "bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.6)]"
                                        : i === 1 ? "bg-slate-400 text-black"
                                            : i === 2 ? "bg-orange-700 text-white"
                                                : "bg-slate-800 text-slate-500"
                                        }`}>
                                        {i + 1}
                                    </div>
                                    <span className={`font-bold text-lg ${res.status === "CRASHED" ? "text-slate-500 line-through" : "text-white"}`}>
                                        {res.name}
                                    </span>
                                </div>
                                <div className={`font-mono font-black text-lg ${res.status === "CRASHED" ? "text-red-600" : "text-emerald-400"}`}>
                                    {res.status === "CRASHED" ? "CRASH" : `${res.distance.toFixed(2)}m`}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 relative z-10">
                        <button
                            onClick={onRestart}
                            className="w-full py-5 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 rounded-2xl font-bold text-slate-300 transition-all flex items-center justify-center gap-3 border border-slate-700 hover:border-slate-500 group shadow-lg"
                        >
                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" /> Play Again (Same Players)
                        </button>
                        <button
                            onClick={onToSetup}
                            className="w-full py-4 bg-transparent hover:bg-slate-800/50 rounded-2xl font-bold text-slate-500 hover:text-slate-300 transition-all flex items-center justify-center gap-2 border border-transparent hover:border-slate-700"
                        >
                            <Flag className="w-4 h-4" /> New Game (Change Players)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
