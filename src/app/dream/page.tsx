import DreamClient from "@/components/dream/DreamClient";
import { Home as HomeIcon } from "lucide-react";

export const metadata = {
    title: "Dream Interpretation - 꿈해몽",
    description: "AI와 함께하는 신비로운 꿈의 해석",
};

export default function DreamPage() {
    return (
        <main className="flex-1 flex flex-col items-center min-h-screen p-8 relative overflow-hidden font-sans bg-[#0f0c29]">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-[#0f0c29] to-transparent" />
            </div>

            {/* Home Link */}
            <div className="absolute top-6 left-6 z-50">
                <a href="/" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                    <HomeIcon className="w-5 h-5" />
                    <span className="hidden md:inline">Calamus Portal</span>
                </a>
            </div>

            <div className="w-full mt-12 pb-24">
                <DreamClient />
            </div>

            <footer className="absolute bottom-6 text-slate-600 text-xs">
                © 2026 Dream Interpretation. Powered by Calamus AI.
            </footer>
        </main>
    );
}
