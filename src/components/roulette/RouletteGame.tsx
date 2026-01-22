

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Trophy, RefreshCcw } from "lucide-react";

interface RouletteGameProps {
    mission1: string;
    mission2: string;
    players: string[];
    onReset: () => void;
}

const COLORS = [
    "#F87171", "#FB923C", "#FACC15", "#4ADE80", "#2DD4BF",
    "#60A5FA", "#818CF8", "#A78BFA", "#F472B6", "#FB7185"
];

export const RouletteGame = ({ mission1, mission2, players, onReset }: RouletteGameProps) => {
    const isDouble = !!mission2;
    const [currentRound, setCurrentRound] = useState(1);
    const [winner1, setWinner1] = useState<string | null>(null);
    const [winner2, setWinner2] = useState<string | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);

    const controls = useAnimation();
    const wheelRef = useRef<HTMLDivElement>(null);
    const currentRotation = useRef(0);
    const lastTickRotation = useRef(0);
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Initialize AudioContext on user interaction/mount (ensure it exists)
        if (typeof window !== "undefined") {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                audioCtxRef.current = new AudioContext();
            }
        }
        return () => {
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        };
    }, []);

    const playTickSound = () => {
        if (!audioCtxRef.current) return;
        if (audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume();
        }

        const oscillator = audioCtxRef.current.createOscillator();
        const gainNode = audioCtxRef.current.createGain();

        oscillator.type = "sine";
        // Brief high pitch tick
        oscillator.frequency.setValueAtTime(800, audioCtxRef.current.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtxRef.current.currentTime + 0.05);

        gainNode.gain.setValueAtTime(0.05, audioCtxRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.05);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);

        oscillator.start();
        oscillator.stop(audioCtxRef.current.currentTime + 0.05);
    };

    const spin = async (targetRound: number) => {
        if (isSpinning) return;
        setIsSpinning(true);

        // Resume Audio Context if needed
        if (audioCtxRef.current?.state === "suspended") {
            await audioCtxRef.current.resume();
        }

        // Configuration: Faster and Longer
        const spinDuration = 8; // Increased duration
        const baseSpins = 20; // Increased spins for speed
        const randomExtraSpins = Math.floor(Math.random() * 10); // Ensure integer for accurate alignment
        const totalSpins = baseSpins + randomExtraSpins;

        const segmentAngle = 360 / players.length;

        // Pick a Winner Randomly
        const winningIndex = Math.floor(Math.random() * players.length);
        const winner = players[winningIndex];

        // Target Calculation
        // To land on 'winningIndex' at the TOP (0 deg), we need specific rotation.
        // If current rotation puts segment 0 at X.
        // We want final position: Pointer (Top) over Winning Segment.
        // Pointer is at 0. Winning Segment is at [winningIndex * gap, (w+1)*gap].
        // To bring Winning Segment to 0:
        // We need to rotate BACKWARDS by (winningIndex * gap + gap/2)?
        // Or simply: TargetAngle = Current + 360*Spins + Delta.

        // Let's use the robust "Effective Angle" method.
        // We just rotate a huge amount.
        // Then we adjust the "landing" to make sure it hits the specific winner.
        // Final Rotation % 360 needs to align with the winner.
        // Center of Winner Segment = winningIndex * segmentAngle + segmentAngle / 2.
        // This center is where we want the POINTER (0deg/360deg) to be RELATIVE to the wheel.
        // So, if Wheel rotates R degrees. The segment at Top is determined by (360 - R%360).
        // We want (360 - R%360) = Center of Winner Segment.
        // => R%360 = 360 - Center.
        // => R_target_remainder = 360 - (winningIndex * segmentAngle + segmentAngle / 2).

        const desiredRemainder = 360 - (winningIndex * segmentAngle + segmentAngle / 2);

        // Current remainder
        const currentRem = currentRotation.current % 360;

        // Distance to travel to next aligned position
        let distance = desiredRemainder - currentRem;
        if (distance < 0) distance += 360;

        // Add full spins
        const finalRotation = currentRotation.current + distance + (360 * totalSpins);

        await controls.start({
            rotate: finalRotation,
            transition: {
                duration: spinDuration,
                ease: [0.15, 0, 0.2, 1] // nice ease-out
            }
        });

        currentRotation.current = finalRotation;

        // Update State
        if (targetRound === 1) {
            setWinner1(winner);
        } else {
            setWinner2(winner);
        }

        setIsSpinning(false);
    };

    // Auto start round 2
    useEffect(() => {
        if (isDouble && winner1 && !winner2 && currentRound === 1) {
            const timer = setTimeout(() => {
                setCurrentRound(2);
                spin(2); // Explicitly pass 2
            }, 2000); // 2 second pause before next spin
            return () => clearTimeout(timer);
        }
    }, [winner1, isDouble]);

    const segmentAngle = 360 / players.length;

    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-2xl mx-auto">

            {/* Title / Status */}
            <div className="text-center mb-8 animate-fade-in-down">
                <h2 className="text-3xl font-bold text-white mb-2">
                    {currentRound === 1 ? `Mission 1: ${mission1}` : `Mission 2: ${mission2}`}
                </h2>
                <p className="text-pink-300 font-medium">
                    {isSpinning ? "운명 결정 중... 🥁" : (
                        winner2 ? "모든 결과가 나왔습니다!" :
                            winner1 && currentRound === 1 ? "첫 번째 당첨자 확인!" :
                                winner1 && currentRound === 2 ? "두 번째 추첨 시작..." :
                                    "START 버튼을 눌러주세요!"
                    )}
                </p>
            </div>

            {/* Wheel Container */}
            <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] mb-12">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-10 filter drop-shadow-md">
                    <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-pink-500"></div>
                </div>

                {/* 3D Wheel Wrapper */}
                <div className="w-full h-full rounded-full border-[12px] border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden bg-slate-900 transform preserve-3d">
                    <motion.div
                        ref={wheelRef}
                        className="w-full h-full relative"
                        animate={controls}
                        onUpdate={(latest) => {
                            if (typeof latest.rotate === 'number') {
                                const rot = latest.rotate;
                                // Play sound every 'segmentAngle' degrees? Or faster?
                                // Let's play every 45 degrees for a satisfying tick, or segmentAngle if small.
                                const tickInterval = Math.min(segmentAngle, 30);
                                if (Math.abs(rot - lastTickRotation.current) >= tickInterval) {
                                    playTickSound();
                                    lastTickRotation.current = rot;
                                }
                            }
                        }}
                        style={{
                            background: `conic-gradient(
                                ${players.map((_, i) => `${COLORS[i % COLORS.length]} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`).join(', ')}
                            )`,
                            borderRadius: '50%'
                        }}
                    >
                        {/* Names */}
                        {players.map((p, i) => (
                            <div
                                key={i}
                                className="absolute top-0 left-1/2 w-full h-1/2 origin-bottom flex justify-center pt-8"
                                style={{
                                    transform: `translateX(-50%) rotate(${i * segmentAngle + segmentAngle / 2}deg)`,
                                }}
                            >
                                <span className={
                                    `text-slate-900 font-bold drop-shadow-sm -rotate-90 md:rotate-0 truncate max-w-[80px] text-center
                                    ${players.length > 8 ? 'text-sm' : 'text-lg'}
                                    `
                                } style={{ writingMode: 'vertical-rl' }}>
                                    {p}
                                </span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Inner Circle / Hub */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-800 rounded-full border-4 border-slate-700 shadow-inner z-10 flex items-center justify-center">
                        <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-4">
                {!isSpinning && ((!winner1) || (isDouble && winner1 && !winner2 && currentRound === 2)) && (
                    <button
                        onClick={() => spin(currentRound)}
                        className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white px-12 py-4 rounded-full font-bold text-xl shadow-lg shadow-pink-900/50 animate-bounce transition-all transform hover:scale-105 active:scale-95"
                    >
                        {currentRound === 1 ? "SPIN!" : "2nd SPIN!"}
                    </button>
                )}

                {/* Results Display */}
                <div className="flex gap-4">
                    {winner1 && (
                        <div className="bg-slate-800/80 backdrop-blur border border-pink-500/50 px-6 py-4 rounded-xl flex flex-col items-center animate-pop-in shadow-lg">
                            <span className="text-xs text-pink-200 mb-1">Mission 1: {mission1}</span>
                            <span className="text-2xl font-bold text-white flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-yellow-400" /> {winner1}
                            </span>
                        </div>
                    )}

                    {winner2 && (
                        <div className="bg-slate-800/80 backdrop-blur border border-purple-500/50 px-6 py-4 rounded-xl flex flex-col items-center animate-pop-in shadow-lg">
                            <span className="text-xs text-purple-200 mb-1">Mission 2: {mission2}</span>
                            <span className="text-2xl font-bold text-white flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-yellow-400" /> {winner2}
                            </span>
                        </div>
                    )}
                </div>

                {((!isDouble && winner1) || (isDouble && winner2)) && !isSpinning && (
                    <div className="mt-8 animate-fade-in-up">
                        <button onClick={onReset} className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700">
                            <RefreshCcw className="w-4 h-4" /> 새로운 게임 시작
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
