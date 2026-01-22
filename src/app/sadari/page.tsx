import SadariClient from "@/components/sadari/SadariClient";
import { Home as HomeIcon } from "lucide-react";

export const metadata = {
    title: "사다리 게임 - Calamus Portal",
    description: "내기/벌칙 정하기 랜덤 사다리 게임",
};

export default function SadariPage() {
    return (
        <main className="relative min-h-screen bg-[#050816] text-slate-100 overflow-x-hidden font-sans pb-20">

            {/* Background Ambience */}
            <div className="fixed inset-[-40vh_-30vw] bg-[radial-gradient(closest-side,rgba(5,150,105,0.08),transparent_60%),radial-gradient(closest-side,rgba(6,182,212,0.05),transparent_60%)] blur-[60px] opacity-70 pointer-events-none -z-10" />

            {/* Nav */}
            <div className="absolute top-6 left-6 z-50">
                <a href="/" className="text-slate-500 hover:text-white flex items-center gap-2 transition-colors">
                    <HomeIcon className="w-5 h-5" />
                    <span className="hidden md:inline">Calamus Portal</span>
                </a>
            </div>

            <div className="pt-24 px-4">
                <SadariClient />
            </div>

        </main>
    );
}
