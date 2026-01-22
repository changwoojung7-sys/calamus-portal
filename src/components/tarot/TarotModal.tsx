"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { TarotCardData } from './TarotCard';

interface TarotModalProps {
    card: TarotCardData | null;
    index: number | null;
    onClose: () => void;
}

export const TarotModal: React.FC<TarotModalProps> = ({ card, index, onClose }) => {
    if (!card) return null;

    const meaning = card.is_reversed ? card.reversed : card.upright;
    const posLabel = card.position_label || `${(index ?? 0) + 1}번째 카드`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-3xl max-h-[80vh] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button - Fixed to top right of modal */}
                <div className="absolute top-4 right-4 z-20">
                    <button onClick={onClose} className="p-2 bg-slate-950/50 backdrop-blur rounded-full text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors shadow-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Left: Image (Scrollable on mobile if needed, or fixed) */}
                <div className="w-full md:w-1/3 bg-slate-950 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
                    <div className="relative w-[140px] md:w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-slate-800">
                        <img
                            src={card.image}
                            alt={card.name_kr}
                            className="w-full h-full object-cover"
                            style={{ transform: card.is_reversed ? 'rotate(180deg)' : 'none' }}
                        />
                    </div>
                    <div className="mt-4 text-center">
                        <span className="text-xs font-semibold text-purple-400 bg-purple-900/20 px-3 py-1 rounded-full border border-purple-500/30">
                            {posLabel}
                        </span>
                        <h3 className="text-xl font-bold text-white mt-2">{card.name_kr}</h3>
                        <p className={`text-sm font-medium mt-1 ${card.is_reversed ? 'text-red-400' : 'text-green-400'}`}>
                            {card.is_reversed ? '역방향 (Reversed)' : '정방향 (Upright)'}
                        </p>
                    </div>
                </div>

                {/* Right: Content (Scrollable) */}
                <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-900/50">
                    <div className="flex flex-wrap gap-2 mb-6 pr-8">
                        {meaning.keywords && meaning.keywords.map((k: string) => (
                            <span key={k} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-medium border border-slate-700">
                                #{k}
                            </span>
                        ))}
                    </div>

                    <div className="space-y-6 pb-4">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                            <h4 className="text-purple-300 font-bold mb-2 text-sm flex items-center gap-2">
                                ■ 핵심 의미
                            </h4>
                            <p className="text-slate-200 leading-relaxed font-medium">
                                {meaning.meaning_short_kr || meaning.meaning}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-slate-400 font-bold mb-2 text-sm">■ 상세 해설</h4>
                            <p className="text-slate-300 leading-loose text-sm md:text-base">
                                {meaning.meaning_long_kr || "상세 해설 준비 중입니다."}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
