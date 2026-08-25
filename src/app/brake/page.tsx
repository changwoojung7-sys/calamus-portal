import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BrakeClient from "@/components/MainPortal/brake/BrakeClient";

export const metadata: Metadata = {
  title: 'Calamus Portal - 블록 브레이크 게임',
  description: '스트레스 해소 레트로 벽돌깨기 아케이드 게임',
};

export default function BrakePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 relative">
      {/* 상단 네비게이션 바 */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 h-14 flex items-center justify-between shadow-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-300 hover:text-rose-400 font-semibold text-sm transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-rose-400 group-hover:-translate-x-1 transition-transform" />
          <span>Calamus 포털 메인으로</span>
        </Link>

        {/* 다른 미니게임 퀵 전환 */}
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/roulette"
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            룰렛 게임
          </Link>
          <Link
            href="/sadari"
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            사다리 게임
          </Link>
        </div>
      </header>

      {/* 브레이크 게임 본체 */}
      <main>
        <BrakeClient />
      </main>
    </div>
  );
}
