import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FlaskConical } from "lucide-react";
import Footer from "@/components/common/Footer";
import CalamusLabsSection from "@/components/portfolio/CalamusLabsSection";

export const metadata: Metadata = {
  title: "Calamus Labs | 실험 프로젝트",
  description:
    "Calamus가 연구하고 검증하는 실험 프로젝트와 My Re Design 솔루션을 소개합니다.",
};

export default function LabsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/20">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#172554,_#020617_70%)] -z-10" />

      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Calamus 포털
          </Link>

          <div className="flex items-center gap-2 text-sm font-bold text-indigo-300">
            <FlaskConical className="h-4 w-4" />
            Calamus Labs
          </div>

          <nav className="hidden items-center gap-5 text-xs font-semibold text-slate-400 sm:flex">
            <Link href="/#worknexus" className="transition-colors hover:text-purple-300">
              WorkNexus
            </Link>
            <Link href="/#onanbu" className="transition-colors hover:text-teal-300">
              온안부
            </Link>
            <Link href="/#lounge" className="transition-colors hover:text-indigo-300">
              힐링 라운지
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <CalamusLabsSection />
      </main>

      <Footer />
    </div>
  );
}
