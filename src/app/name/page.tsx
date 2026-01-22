import NameClient from "@/components/name/NameClient";
import { Home as HomeIcon } from "lucide-react";

export const metadata = {
    title: "성명학 AI 상담소 - Calamus Portal",
    description: "AI 명리학자가 분석하는 이름과 사주의 조화",
};

export default function NamePage() {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 font-sans">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-900/10 rounded-full blur-[100px]" />
            </div>

            {/* Home Link */}
            <div className="absolute top-6 left-6 z-50">
                <a href="/" className="text-slate-500 hover:text-white flex items-center gap-2 transition-colors">
                    <HomeIcon className="w-5 h-5" />
                    <span className="hidden md:inline">Calamus Portal</span>
                </a>
            </div>

            <NameClient />

            <footer className="w-full text-center mt-20 text-slate-600 text-xs">
                © 2026 Name Analysis AI. Powered by Calamus.
            </footer>
        </div>
    );
}
