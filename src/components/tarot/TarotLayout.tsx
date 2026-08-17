"use client";

import React from 'react';
import { TarotCard, TarotCardData } from './TarotCard';

interface TarotLayoutProps {
    cards: TarotCardData[];
    spreadType: number;
    revealedIndices: number[];
    onCardClick: (index: number) => void;
}

export const TarotLayout: React.FC<TarotLayoutProps> = ({ cards, spreadType, revealedIndices, onCardClick }) => {

    // Celtic Cross Layout Logic
    if (spreadType === 10) {
        return (
            <div className="w-full max-w-4xl mx-auto p-4 perspective-1000">
                {/* Mobile: Grid/Wrap Layout */}
                <div className="md:hidden grid grid-cols-2 sm:grid-cols-3 gap-4 justify-items-center">
                    {cards.map((card, index) => (
                        <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                            <TarotCard
                                card={card}
                                index={index}
                                isRevealed={revealedIndices.includes(index)}
                                onClick={() => onCardClick(index)}
                                customClass="w-[140px]"
                            />
                        </div>
                    ))}
                </div>

                {/* Desktop: Custom Grid Layout */}
                <div className="hidden md:grid gap-4 justify-center"
                    style={{
                        gridTemplateColumns: 'repeat(4, 160px)',
                        gridTemplateRows: 'repeat(4, auto)'
                    }}>

                    {cards.map((card, index) => {
                        let gridClass = "";
                        const pos = index + 1;

                        // Map positions
                        if (pos === 1) gridClass = "col-start-2 row-start-2 z-10 brightness-90";
                        if (pos === 2) gridClass = "col-start-2 row-start-2 z-20 rotate-90 scale-105 shadow-2xl";
                        if (pos === 3) gridClass = "col-start-2 row-start-3";
                        if (pos === 4) gridClass = "col-start-1 row-start-2";
                        if (pos === 5) gridClass = "col-start-2 row-start-1";
                        if (pos === 6) gridClass = "col-start-3 row-start-2";
                        if (pos === 7) gridClass = "col-start-4 row-start-4";
                        if (pos === 8) gridClass = "col-start-4 row-start-3";
                        if (pos === 9) gridClass = "col-start-4 row-start-2";
                        if (pos === 10) gridClass = "col-start-4 row-start-1";

                        return (
                            <div key={index} className={`relative ${gridClass}`}>
                                <TarotCard
                                    card={card}
                                    index={index}
                                    isRevealed={revealedIndices.includes(index)}
                                    onClick={() => onCardClick(index)}
                                    customClass="w-[140px] md:w-[160px]"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Standard Grid (3 or 5 cards)
    return (
        <div className="flex flex-wrap justify-center gap-6 p-4 perspective-1000">
            {cards.map((card, index) => (
                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <TarotCard
                        card={card}
                        index={index}
                        isRevealed={revealedIndices.includes(index)}
                        onClick={() => onCardClick(index)}
                    />
                </div>
            ))}
        </div>
    );
};
