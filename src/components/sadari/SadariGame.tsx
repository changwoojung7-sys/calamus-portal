"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";

interface SadariGameProps {
    numPlayers: number;
    names: string[];
    rewards: string[]; // Raw input rewards
    onReset: () => void;
}

interface GameResult {
    name: string;
    reward: string;
    startCol: number;
    endCol: number;
}

export default function SadariGame({ numPlayers, names, rewards, onReset }: SadariGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Game State
    const [ladder, setLadder] = useState<boolean[][]>([]); // [row][col] true if horz line exists
    const [results, setResults] = useState<GameResult[]>([]);
    const [finishedIndices, setFinishedIndices] = useState<number[]>([]);
    const [isMuted, setIsMuted] = useState(false);

    // Audio Context Ref
    const audioCtxRef = useRef<AudioContext | null>(null);
    const isPlayingSound = useRef(false);

    // Constants
    const ROWS = 18;
    const MARGIN_X = 60;
    const COL_GAP = 90;
    const ROW_GAP = 30;
    const MARGIN_TOP = 50;

    useEffect(() => {
        initGame();
        return () => {
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        }
    }, []);

    // "Parabarabam" Melody Generator
    const playCheerSound = () => {
        if (isMuted) return;

        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            audioCtxRef.current = new AudioContext();
        }

        if (audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume();
        }

        const ctx = audioCtxRef.current;
        const t = ctx.currentTime;

        // Simple synth function
        const playNote = (freq: number, startTime: number, duration: number, type: OscillatorType = "square") => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0.1, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration - 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        // Melody: Sol-Sol-Sol-Do~ (G4 G4 G4 C5) - "Ppa-ra-ba-ra-bam~" style
        // Let's do a classic fanfare: G4 C5 E5 G5 -> C5 G4 -> ...
        // User requested: "Bbaba-bara-bam-bam"
        // Interpretation: C5 C5 C5 G4 A4 B4 C5

        // Fast rhythm
        const tempo = 0.12;

        // "Ppa-ra-ba-ra" (Fast triplets/16ths) -> "Bam-bam" (Staccato)
        // Sol(G4) - Sol(G4) - La(A4) - La(A4) - Sol(G4) - E(E4) - C(C4) roughly?
        // Let's try a generic exciting arcade run Loop

        // Pattern: Do-Mi-Sol-Do-Sol-Mi (Arpeggio)
        const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25]; // C Major Arpeggio

        let startTime = t;

        // Play a short loop 4 times (approx 2-3 seconds)
        for (let i = 0; i < 24; i++) {
            const freq = notes[i % 6];
            playNote(freq, startTime, 0.1, "triangle");
            startTime += 0.1;
        }

    };

    const initGame = () => {
        // 1. Generate Ladder
        const newLadder = Array.from({ length: ROWS }, () => Array(numPlayers - 1).fill(false));

        for (let r = 0; r < ROWS; r++) {
            const cols = Array.from({ length: numPlayers - 1 }, (_, i) => i);
            // Shuffle cols
            for (let i = cols.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cols[i], cols[j]] = [cols[j], cols[i]];
            }

            const used = new Set();
            for (const c of cols) {
                if (r > 0 && newLadder[r - 1][c]) continue; // prevent double vertical adjacent
                if (used.has(c) || used.has(c - 1) || used.has(c + 1)) continue; // prevent horizontal adjacent

                if (Math.random() < 0.45) { // 45% chance
                    newLadder[r][c] = true;
                    used.add(c);
                }
            }
        }
        setLadder(newLadder);

        // 2. Calculate Results
        // Distribute rewards randomly to bottom slots
        // Create pool: rewards + necessary "꽝"s
        const pool = [...rewards];
        while (pool.length < numPlayers) pool.push("꽝");
        // Shuffle pool for bottom positions
        const bottomRewards = pool.sort(() => Math.random() - 0.5);

        // Trace paths
        const finalResults: GameResult[] = [];
        for (let i = 0; i < numPlayers; i++) {
            let col = i;
            for (let r = 0; r < ROWS; r++) {
                if (col > 0 && newLadder[r][col - 1]) col--;
                else if (col < numPlayers - 1 && newLadder[r][col]) col++;
            }
            finalResults.push({
                name: names[i],
                startCol: i,
                endCol: col,
                reward: bottomRewards[col]
            });
        }
        setResults(finalResults);

        // 3. Draw Initial Canvas
        setTimeout(() => drawStaticLadder(newLadder, bottomRewards), 50);
    };

    const drawStaticLadder = (ladderData: boolean[][], bottomRewards: string[]) => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext('2d');
        if (!ctx) return;

        const width = MARGIN_X * 2 + (numPlayers - 1) * COL_GAP;
        const height = MARGIN_TOP * 2 + ROWS * ROW_GAP;

        cvs.width = width;
        cvs.height = height;

        // BG
        ctx.fillStyle = "#0f172a"; // Slate 900
        ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = 4;
        ctx.strokeStyle = "#475569"; // Slate 600
        ctx.lineCap = "round";

        // Vertical Lines
        for (let i = 0; i < numPlayers; i++) {
            const x = MARGIN_X + i * COL_GAP;
            ctx.beginPath();
            ctx.moveTo(x, MARGIN_TOP);
            ctx.lineTo(x, MARGIN_TOP + ROWS * ROW_GAP);
            ctx.stroke();

            // Names at top
            ctx.fillStyle = "#e2e8f0";
            ctx.font = "12px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText((names[i] || "").substring(0, 5), x, MARGIN_TOP - 15);

            // Rewards at bottom
            const rwd = bottomRewards[i];
            ctx.fillStyle = rwd === "꽝" ? "#94a3b8" : "#34d399"; // Green for win
            if (rwd !== "꽝") ctx.font = "bold 12px sans-serif";
            ctx.fillText((rwd || "").substring(0, 5), x, MARGIN_TOP + ROWS * ROW_GAP + 20);
        }

        // Horizontal Lines
        ctx.strokeStyle = "#94a3b8"; // Slate 400
        for (let r = 0; r < ROWS; r++) {
            const y = MARGIN_TOP + (r + 1) * ROW_GAP - (ROW_GAP / 2); // Center of row gap? No, standard ladder usually on steps
            // Let's adhere to logic: ladder[r][c] connects col c and c+1
            // Usually visual representation aligns with array index r
            const lineY = MARGIN_TOP + r * ROW_GAP + (ROW_GAP / 2);

            for (let c = 0; c < numPlayers - 1; c++) {
                if (ladderData[r][c]) {
                    const x1 = MARGIN_X + c * COL_GAP;
                    const x2 = MARGIN_X + (c + 1) * COL_GAP;
                    ctx.beginPath();
                    ctx.moveTo(x1, lineY);
                    ctx.lineTo(x2, lineY);
                    ctx.stroke();
                }
            }
        }
    };

    const startPlayer = (idx: number) => {
        // Don't re-run
        if (finishedIndices.includes(idx)) return;

        const cvs = canvasRef.current;
        const wrap = wrapperRef.current;
        if (!cvs || !wrap) return;

        // Play Sound
        playCheerSound();

        // Create Icon DOM
        const icon = document.createElement("div");
        icon.className = "absolute w-10 h-10 rounded-full border-2 border-emerald-500 shadow-lg shadow-emerald-500/50 z-10 bg-cover bg-center bg-no-repeat bg-slate-900";

        // Calculate char index (1-10)
        const charNum = (idx % 10) + 1;
        icon.style.backgroundImage = `url('/static/img/chars/char${charNum}.png')`;

        wrap.appendChild(icon);

        // Path calc
        const pathPoints: { x: number, y: number }[] = [];
        let col = idx;
        let x = MARGIN_X + col * COL_GAP;
        let y = MARGIN_TOP - 20; // Start slightly above
        pathPoints.push({ x, y });

        for (let r = 0; r < ROWS; r++) {
            const lineY = MARGIN_TOP + r * ROW_GAP + (ROW_GAP / 2);

            // Vertical move to next horizontal line level
            y = lineY;
            pathPoints.push({ x, y });

            // Check horizontal
            if (col > 0 && ladder[r][col - 1]) {
                col--;
                x = MARGIN_X + col * COL_GAP;
                pathPoints.push({ x, y });
            } else if (col < numPlayers - 1 && ladder[r][col]) {
                col++;
                x = MARGIN_X + col * COL_GAP;
                pathPoints.push({ x, y });
            }
        }
        // Final vertical
        y = MARGIN_TOP + ROWS * ROW_GAP + 20; // Finish well below
        pathPoints.push({ x, y });


        // Animation Loop
        let currentSeg = 0;
        let progress = 0;
        const speed = 0.15; // Speed factor

        const animate = () => {
            if (currentSeg >= pathPoints.length - 1) {
                // Finish
                setFinishedIndices(prev => [...prev, idx]);
                // Highlight result text? 
                // Cleanup icon? maybe keep it at bottom
                return;
            }

            progress += speed;
            if (progress >= 1) {
                progress = 0;
                currentSeg++;
            }

            if (currentSeg < pathPoints.length - 1) {
                const p1 = pathPoints[currentSeg];
                const p2 = pathPoints[currentSeg + 1];
                const curX = p1.x + (p2.x - p1.x) * progress;
                const curY = p1.y + (p2.y - p1.y) * progress;

                icon.style.left = `${curX}px`;
                icon.style.top = `${curY}px`;
                icon.style.transform = `translate(-50%, -50%)`; // Center anchor

                requestAnimationFrame(animate);
            } else {
                // ensure final pos
                const pFinal = pathPoints[pathPoints.length - 1];
                icon.style.left = `${pFinal.x}px`;
                icon.style.top = `${pFinal.y}px`;
                setFinishedIndices(prev => [...prev.filter(x => x !== idx), idx]);
            }
        };
        animate();
    };

    return (
        <div className="flex flex-col items-center">
            {/* Controls */}
            <div className="flex justify-between items-center w-full max-w-2xl px-4 mb-2">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full hover:bg-slate-800 text-slate-400"
                    title={isMuted ? "소리 켜기" : "소리 끄기"}
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-4 w-full max-w-3xl px-4">
                {names.map((nm, i) => (
                    <button
                        key={i}
                        onClick={() => startPlayer(i)}
                        disabled={finishedIndices.includes(i)}
                        className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold border transition-all ${finishedIndices.includes(i)
                            ? "bg-slate-800 text-slate-500 border-slate-700"
                            : "bg-emerald-900/40 text-emerald-300 border-emerald-500/50 hover:bg-emerald-800/50"
                            }`}
                    >
                        {nm} {finishedIndices.includes(i) ? "(완료)" : "출발"}
                    </button>
                ))}
            </div>

            {/* Canvas Area */}
            <div className="rounded-xl bg-slate-800/50 p-4 overflow-x-auto max-w-full border border-slate-700 shadow-inner mb-8">
                <div className="relative" ref={wrapperRef}>
                    <canvas ref={canvasRef} className="block" />
                </div>
            </div>

            {/* Results Table */}
            {finishedIndices.length > 0 && (
                <div className="w-full max-w-md bg-slate-900/80 rounded-xl p-4 border border-slate-700 animate-fade-in-up">
                    <h3 className="text-sm font-bold text-slate-300 mb-3 flex justify-between items-center">
                        <span>🏆 결과 목록</span>
                        <button onClick={onReset} className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" /> 리셋
                        </button>
                    </h3>
                    <div className="space-y-2">
                        {finishedIndices.map(idx => {
                            const r = results.find(x => x.startCol === idx);
                            if (!r) return null;
                            return (
                                <div key={idx} className="flex justify-between items-center p-2 rounded bg-slate-800/50 border border-slate-700/50">
                                    <span className="text-sm text-slate-200">{r.name}</span>
                                    <span className={`text-sm font-bold ${r.reward === '꽝' ? 'text-slate-500' : 'text-emerald-400'}`}>
                                        {r.reward}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
