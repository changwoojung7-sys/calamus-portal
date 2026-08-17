"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface TarotCardData {
    image: string;
    name_kr: string;
    name_en: string;
    is_reversed: boolean;
    position_label?: string;
    upright: any;
    reversed: any;
}

interface TarotCardProps {
    card: TarotCardData;
    index: number;
    isRevealed: boolean;
    onClick: () => void;
    customClass?: string;
}

export const TarotCard: React.FC<TarotCardProps> = ({ card, index, isRevealed, onClick, customClass }) => {
    return (
        <div
            className={`relative w-[140px] md:w-[160px] aspect-[2/3] cursor-pointer perspective-1000 ${customClass || ''}`}
            onClick={onClick}
        >
            <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-700"
                animate={{ rotateY: isRevealed ? 180 : 0 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Back Face (Card Back) */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden shadow-xl border border-white/10 z-20"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                    <img src="/tarot/card-back.png" alt="Back" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 hover:bg-white/5 transition-colors flex items-center justify-center">
                        <span className="text-xs text-white/50 font-medium px-2 py-1 bg-black/40 rounded-full backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">클릭해서 공개</span>
                    </div>
                </div>

                {/* Front Face (Card Image) */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden shadow-xl border border-white/10 bg-slate-900 z-10"
                    style={{
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                    }}
                >
                    <img
                        src={card.image}
                        alt={card.name_kr}
                        className="w-full h-full object-cover"
                        style={{ transform: card.is_reversed ? 'rotate(180deg)' : 'none' }}
                    />

                    {/* Badge */}
                    <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md border border-white/20">
                        {index + 1}
                    </div>

                    {/* Label */}
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg p-2">
                        <div className="text-xs font-bold text-white truncate">{card.name_kr}</div>
                        <div className="text-[10px] text-slate-300 truncate">
                            {card.is_reversed ? '(역방향)' : '(정방향)'}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
