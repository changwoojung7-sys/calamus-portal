"use client";

import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import GoogleAd from "./GoogleAd";

type AdModalProps = {
    isOpen: boolean;
    onClose: () => void;
    slot: string; // Ad Unit ID
};

export default function AdModal({ isOpen, onClose, slot }: AdModalProps) {
    const [timeLeft, setTimeLeft] = useState(5);
    const [canClose, setCanClose] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeLeft(5);
            setCanClose(false);
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanClose(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col items-center">

                {/* Header */}
                <div className="mb-4 text-center">
                    <h3 className="text-xl font-bold text-slate-200 mb-1">AI 분석 준비 중...</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">광고 후 분석이 시작됩니다</p>
                </div>

                {/* Ad Container */}
                <div className="w-full bg-slate-800/50 rounded-xl overflow-hidden min-h-[250px] flex items-center justify-center mb-6 border border-slate-700/50">
                    <GoogleAd
                        slot={slot}
                        style={{ display: 'block', width: '100%', height: '250px' }}
                        format="rectangle"
                    />
                </div>

                {/* Action Button */}
                <button
                    onClick={onClose}
                    disabled={!canClose}
                    className={`nav-button-base flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold transition-all ${canClose
                            ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/50"
                            : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        }`}
                >
                    {canClose ? (
                        <>
                            분석 시작하기
                        </>
                    ) : (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {timeLeft}초 후 시작 가능
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
