import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import RouletteClient from '@/components/roulette/RouletteClient';

export const metadata: Metadata = {
  title: 'Calamus Portal - 운명의 룰렛',
  description: '팀원들과 함께하는 스릴 넘치는 랜덤 벌칙 게임',
};

export default function RoulettePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 relative">
      {/* 상단 네비게이션 바 */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 h-14 flex items-center justify-between shadow-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 font-semibold text-sm transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
          <span>Calamus 포털 메인으로</span>
        </Link>

        {/* 다른 미니게임 퀵 전환 */}
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/sadari"
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            사다리 게임
          </Link>
          <Link
            href="/brake"
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            브레이크 게임
          </Link>
        </div>
      </header>

      {/* 룰렛 본체 */}
      <main className="pt-6 pb-16 px-4">
        <RouletteClient />
      </main>
    </div>
  );
}
