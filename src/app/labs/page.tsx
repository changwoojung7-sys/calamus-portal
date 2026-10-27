import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FlaskConical, Zap, ExternalLink } from "lucide-react";
import Footer from "@/components/common/Footer";
import CalamusLabsSection from "@/components/portfolio/CalamusLabsSection";

export const metadata: Metadata = {
  title: "Calamus Labs | 전기기능사 실기 인터랙티브 교육관(CEPT) & 실험 프로젝트",
  description:
    "한국산업인력공단 전기기능사 실기 공개문제 18과제(01~18번) 전 과정을 핀번호·그루핑, 보조회로 결선, 배관·입선, 동작 테스트까지 7단계로 무료 실습하는 전기기능사 실기 인터랙티브 교육관(https://cept.calamus.ai.kr/) 및 My Re Design 솔루션을 소개합니다.",
  keywords: [
    "전기기능사 실기",
    "전기기능사 실기 시뮬레이터",
    "전기기능사 실기 공개문제 18과제",
    "전기기능사 실기 따라하기",
    "전기기능사 핀번호 그루핑",
    "전기기능사 보조회로 결선",
    "전기기능사 배관 작업 순서",
    "시퀀스 회로 시뮬레이터",
    "CEPT",
    "cept.calamus.ai.kr",
    "Calamus Labs",
    "My Re Design"
  ],
  openGraph: {
    title: "Calamus Labs | 전기기능사 실기 인터랙티브 교육관 (CEPT) 무료 공개",
    description:
      "전기기능사 실기 공개문제 18과제 핀번호·그루핑부터 보조회로 결선, 배관·입선, 동작 테스트까지 7단계로 눈으로 보며 복습하는 무료 웹 시뮬레이터 (https://cept.calamus.ai.kr/)",
    url: "https://calamus.ai.kr/labs",
    siteName: "Calamus Portal",
    locale: "ko_KR",
    type: "website"
  }
};

export default function LabsPage() {
  const labsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["WebApplication", "LearningResource"],
        "@id": "https://cept.calamus.ai.kr/#cept-lab",
        "name": "전기기능사 실기 인터랙티브 교육관 (CEPT)",
        "url": "https://cept.calamus.ai.kr/",
        "applicationCategory": "EducationalApplication",
        "learningResourceType": "Interactive Simulation",
        "isAccessibleForFree": true,
        "inLanguage": "ko-KR",
        "description":
          "전기기능사 실기 공개문제 18과제(01~18번) 모두 문제지 도면을 그대로 보며 기구 배치(400×420) ➜ 주회로 결선 ➜ 핀번호·그루핑 ➜ 보조회로 배선(벨 테스터) ➜ 배관·새들(1800×1600) ➜ 입선·결선 ➜ 전원 투입 동작 테스트까지 7단계로 따라하며 복습하는 무료 웹 시뮬레이터.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "KRW"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(labsJsonLd) }}
      />

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
            <a
              href="https://cept.calamus.ai.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold transition-colors"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              전기기능사 실기 교육관
              <ExternalLink className="h-3 w-3" />
            </a>
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
