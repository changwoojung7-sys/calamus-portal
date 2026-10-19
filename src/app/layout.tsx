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
  title: "Calamus Portal | 사내 완결형 3D 가상오피스 WorkNexus & 지능형 병원검색 온안부(OnAnBu)",
  description: "30년 소통의 헤리티지를 잇는 Calamus 공식 포털. 단일 사내 서버 100% 온프레미스 3D 보안 워룸 WorkNexus, HIRA 7.9만 공공데이터 기반 무환각 병원검색 온안부, 의료정보 및 엔터프라이즈 AI 솔루션.",
  keywords: [
    "Calamus",
    "칼라무스",
    "Calamus Portal",
    "WorkNexus",
    "워크넥서스",
    "가상오피스",
    "온프레미스 가상오피스",
    "3D 가상오피스",
    "사내망 협업툴",
    "온안부",
    "OnAnBu",
    "병원검색",
    "심평원 공공데이터",
    "상급종합병원",
    "대학병원 전원",
    "혈액투석 재활",
    "요양병원",
    "호스피스",
    "의료정보 AI",
    "AEO",
    "GEO"
  ],
  authors: [{ name: "Calamus / YujinAI" }],
  creator: "Calamus",
  publisher: "Calamus Portal",
  metadataBase: new URL("https://calamus.ai.kr"),
  openGraph: {
    title: "Calamus Portal | 사내 완결형 3D 가상오피스 WorkNexus & 지능형 병원검색 온안부",
    description: "외부 유출 없는 온프레미스 3D 가상오피스 WorkNexus와 전국 7.9만 병의원 심평원 공공데이터 기반 지능형 헬스케어 포털 온안부(OnAnBu).",
    url: "https://calamus.ai.kr",
    siteName: "Calamus Portal",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calamus Portal | 공간과 의료정보를 잇는 연결의 플랫폼",
    description: "우리 회사 서버 한 대의 3D 가상오피스 WorkNexus & HIRA 7.9만 공공데이터 병원검색 온안부",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // AEO / GEO / Trust 최적화를 위한 Schema.org JSON-LD 구조화 데이터
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://calamus.ai.kr/#organization",
        "name": "Calamus (칼라무스)",
        "alternateName": "유진AI (YujinAI)",
        "url": "https://calamus.ai.kr",
        "logo": "https://calamus.ai.kr/favicon.png",
        "description": "1990년대 PC통신 유니텔 시절 첫 이메일 'Calamus'에서 출발하여 30년간 사람 중심의 소통 도구와 데이터 주권 소프트웨어를 개발해 온 엔터프라이즈 솔루션 브랜드.",
        "foundingDate": "1995",
        "knowsAbout": [
          "On-Premise 3D Virtual Office",
          "Data Sovereignty",
          "LiveKit SFU Media Architecture",
          "Healthcare Big Data Analytics",
          "HIRA Public Medical Data",
          "Answer Engine Optimization (AEO)",
          "Generative Engine Optimization (GEO)"
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://calamus.ai.kr/#worknexus",
        "name": "Calamus WorkNexus (워크넥서스)",
        "operatingSystem": "Windows 10/11, Windows Server, Linux (Docker)",
        "applicationCategory": "BusinessApplication",
        "description": "우리 회사 사내 서버 한 대로 운영하는 독립형 온프레미스 3D 가상오피스. 인당 월구독료 0원, 내장 LiveKit SFU 미디어 단일화(P2P 제거), 4m 공간 음향 및 100석 타운홀 세미나 완비.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "KRW",
          "description": "추가 SaaS 인당 구독료 없음 (사내 단일 서버 영구 운영 라이선스)"
        }
      },
      {
        "@type": "MedicalWebPage",
        "@id": "https://calamus.ai.kr/#onanbu",
        "name": "온안부 (OnAnBu) 지능형 병원검색 포털",
        "url": "https://onanbu.calamus.ai.kr",
        "description": "건강보험심사평가원(HIRA) 전국 7.9만 병의원 공공데이터 및 12종 상세스펙(인가 병상수, CT/MRI 특수장비, 간호등급)을 100% 팩트 그라운딩한 무환각 의료정보 및 상급병원 배후 전원 매칭 포털.",
        "about": {
          "@type": "MedicalOrganization",
          "name": "National Healthcare Big Data Grounding"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://calamus.ai.kr/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Calamus(칼라무스)의 브랜드 역사와 철학은 무엇인가요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Calamus는 라틴어로 갈대를 뜻하며 1990년대 PC통신 유니텔 시절 창업자의 첫 이메일 계정에서 시작되었습니다. 사람 중심의 연결(Human-Centric), 완벽한 사내 데이터 주권(Data Sovereignty), 투명하고 정직한 정보(Open Transparency)의 3대 철학을 30년간 계승하고 있습니다."
            }
          },
          {
            "@type": "Question",
            "name": "Calamus WorkNexus 가상오피스의 핵심 차별점은 무엇인가요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "외부 클라우드 SaaS와 달리 인당 월 구독료가 없으며, 모든 미디어와 데이터가 고객사 서버 내장 LiveKit SFU를 통해 암호화 중계되어 외부 유출이 원천 차단됩니다. 100% 에어갭 폐쇄망에서도 구동되며 4m 거리 기반 공간 음향과 100석 타운홀 세미나를 지원합니다."
            }
          },
          {
            "@type": "Question",
            "name": "온안부(OnAnBu) 병원검색 포털은 왜 신뢰할 수 있나요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "상업적 광고나 왜곡된 리뷰를 배제하고 건강보험심사평가원(HIRA)의 전국 7.9만 병의원 공공데이터 및 12종 상세스펙(인가 병상, CT/MRI, 간호등급)과 100% 실시간 팩트 매칭된 검증된 병원 정보만 제공하기 때문입니다."
            }
          },
          {
            "@type": "Question",
            "name": "Calamus의 미래 기술 개발 방향(Roadmap)은 무엇인가요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "의료계 의료정보 서비스를 지속 확대하여 대학병원 전원 코디네이터 업무도구, 병원별 24/7 AI 입원상담 챗봇, 노인장기요양 2.8만 개소 통합을 추진하며, 가상오피스 영역에서는 사내 회의 AI 실시간 다이제스트 요약(Meeting Scribe), 기밀 유출 없는 사내 지식검색(Private sLLM / RAG), 글로벌 실시간 음성 통번역 등 엔터프라이즈 AI를 지속적으로 확대합니다."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="ko">
      <head>
        {/* AEO / GEO / Search Engine Schema.org JSON-LD Script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050912] text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-200`}
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
