import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SadariClient from "@/components/sadari/SadariClient";

export const metadata: Metadata = {
  title: "사다리 게임 - Calamus Portal",
  description: "내기/벌칙 정하기 랜덤 사다리 게임",
};

export default function SadariPage() {
  return (
    <main className="relative min-h-screen bg-[#050816] text-slate-100 overflow-x-hidden font-sans pb-20">
      {/* Background Ambience */}
      <div className="fixed inset-[-40vh_-30vw] bg-[radial-gradient(closest-side,rgba(5,150,105,0.08),transparent_60%),radial-gradient(closest-side,rgba(6,182,212,0.05),transparent_60%)] blur-[60px] opacity-70 pointer-events-none -z-10" />

      {/* 상단 네비게이션 바 */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 h-14 flex items-center justify-between shadow-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-300 hover:text-amber-400 font-semibold text-sm transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
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
            href="/brake"
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            브레이크 게임
          </Link>
        </div>
      </header>

      <div className="pt-8 px-4">
        <SadariClient />
      </div>
    </main>
  );
}
