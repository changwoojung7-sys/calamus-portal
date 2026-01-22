"use client";

import BalanceGameClient from "@/components/balance/game/BalanceGameClient";

export default function BalanceGamePage() {
    return (
        <main className="min-h-screen bg-[#0b0f17] text-white font-sans selection:bg-cyan-500/30 pb-20">
            {/* Background Gradients */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_#1c2333,_#0b0f17)] -z-10" />

            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                <BalanceGameClient />
            </div>
        </main>
    );
}
