import TarotClient from "@/components/tarot/TarotClient";
import { Home as HomeIcon } from "lucide-react";

export const metadata = {
    title: "Mystic Tarot - Calamus Portal",
    description: "AI 타로 리딩",
};

export default function TarotPage() {
    return (
        <main className="relative min-h-screen bg-[#070a15] text-slate-100 overflow-x-hidden font-sans pb-20">

            {/* Background Ambience (from style.css) */}
            <div className="fixed inset-[-40vh_-30vw] bg-[radial-gradient(closest-side,rgba(120,88,255,0.15),transparent_60%),radial-gradient(closest-side,rgba(34,197,94,0.1),transparent_60%),radial-gradient(closest-side,rgba(56,189,248,0.08),transparent_60%)] blur-[40px] opacity-70 animate-pulse -z-10 pointer-events-none" />

            {/* Nav */}
            <div className="absolute top-6 left-6 z-50">
                <a href="/" className="text-slate-500 hover:text-white flex items-center gap-2 transition-colors">
                    <HomeIcon className="w-5 h-5" />
                    <span className="hidden md:inline">Calamus Portal</span>
                </a>
            </div>

            <div className="pt-24 px-4">
                <TarotClient />
            </div>

            <footer className="w-full text-center mt-20 text-slate-700 text-xs">
                © 2026 Calamus Tarot. All rights reserved.
            </footer>
        </main>
    );
}
