import SajuClient from "@/components/saju/SajuClient";
import { Home as HomeIcon } from "lucide-react";

export const metadata = {
    title: "사주 AI - Calamus Portal",
    description: "AI 명리학 분석 서비스",
};

export default function SajuPage() {
    return (
        <main className="relative min-h-screen bg-[#070a15] text-slate-100 overflow-x-hidden font-sans pb-20">

            {/* Background Ambience */}
            <div className="fixed inset-[-40vh_-30vw] bg-[radial-gradient(closest-side,rgba(245,158,11,0.08),transparent_60%),radial-gradient(closest-side,rgba(124,58,237,0.05),transparent_60%)] blur-[50px] opacity-60 pointer-events-none -z-10" />

            {/* Nav */}
            <div className="absolute top-6 left-6 z-50">
                <a href="/" className="text-slate-500 hover:text-white flex items-center gap-2 transition-colors">
                    <HomeIcon className="w-5 h-5" />
                    <span className="hidden md:inline">Calamus Portal</span>
                </a>
            </div>

            <div className="pt-24 px-4">
                <SajuClient />
            </div>

        </main>
    );
}
