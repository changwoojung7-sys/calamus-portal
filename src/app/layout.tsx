import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calamus Care | 상급종합·종합병원 · 한방의료 · 1등급 요양병원 · 호스피스 전문 포털",
  description: "건강보험심사평가원(HIRA) 공공데이터 기반 전국 상급종합병원, 종합병원, 일반병원, 한방병원, 1등급 요양병원, 호스피스 완화의료기관 실시간 검색 및 케어 가이드",
  keywords: [
    "상급종합병원",
    "대학병원",
    "종합병원",
    "한방병원",
    "한의원",
    "요양병원",
    "1등급 요양병원",
    "호스피스",
    "완화의료",
    "심평원",
    "칼라무스",
    "Calamus Care",
  ],
  openGraph: {
    title: "Calamus Care | 메디컬 & 케어 인포메이션 포털",
    description: "전국 7만여 개 의료기관의 심평원 2026.06월 공공데이터 기준! 전문의 인력, 병상수, 적정성 평가등급을 한눈에 비교하세요.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050912] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200`}
      >
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2810872681064029"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
