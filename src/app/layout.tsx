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
    "전기기능사 실기",
    "전기기능사 실기 인터랙티브 교육관",
    "전기기능사 실기 시뮬레이터",
    "전기기능사 실기 공개문제 18과제",
    "전기기능사 핀번호 그루핑",
    "CEPT",
    "cept.calamus.ai.kr",
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
          "Proprietary SFU Media Architecture",
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
        "description": "우리 회사 사내 서버 한 대로 운영하는 독립형 온프레미스 3D 가상오피스. 인당 월구독료 0원, 내장 독자 SFU 미디어 엔진(P2P 제거), 4m 공간 음향 및 100석 타운홀 세미나 완비.",
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
        "@type": ["WebApplication", "LearningResource"],
        "@id": "https://cept.calamus.ai.kr/#cept",
        "name": "전기기능사 실기 인터랙티브 교육관 (CEPT)",
        "url": "https://cept.calamus.ai.kr/",
        "applicationCategory": "EducationalApplication",
        "learningResourceType": "Interactive Simulation",
        "isAccessibleForFree": true,
        "inLanguage": "ko-KR",
        "description": "한국산업인력공단 국가기술자격 전기기능사 실기 공개문제 18과제(01번~18번) 전 과정을 기구 배치(400×420), 주회로 결선, 시퀀스 도면 핀번호·그루핑, 보조회로 배선(벨 테스터), 벽면 배관·새들(1800×1600), 입선·결선, 전원 투입 동작 테스트까지 7단계로 눈으로 보며 따라하는 100% 무료 웹 인터랙티브 시뮬레이터.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "KRW",
          "description": "전체 수험생 무료 공개 (무설치 웹 브라우저 즉시 실행)"
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
              "text": "외부 클라우드 SaaS와 달리 인당 월 구독료가 없으며, 모든 미디어와 데이터가 고객사 서버 내장 독자 SFU 미디어 엔진을 통해 암호화 중계되어 외부 유출이 원천 차단됩니다. 100% 에어갭 폐쇄망에서도 구동되며 4m 거리 기반 공간 음향과 100석 타운홀 세미나를 지원합니다."
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
          },
          {
            "@type": "Question",
            "name": "전기기능사 실기 인터랙티브 교육관(CEPT)은 어떤 서비스이며 무료인가요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Calamus Labs가 수험생들의 합격을 돕기 위해 100% 무료로 공개한 전기기능사 실기 따라하기 웹 시뮬레이터(https://cept.calamus.ai.kr/)입니다. 한국산업인력공단 공개문제 18과제(01~18번) 전체에 대해 1단계 기구 배치(400×420), 2단계 주회로 결선, 3단계 시퀀스 핀번호·그루핑, 4단계 보조회로 배선 및 벨 테스터, 5단계 배관·새들(1800×1600), 6단계 입선·결선, 7단계 전원 투입 및 시퀀스 동작 테스트를 설치 없이 브라우저에서 바로 복습할 수 있습니다."
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
