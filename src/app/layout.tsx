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
        "url": "https://worknexus.calamus.ai.kr",
        "softwareVersion": "1.0.9",
        "operatingSystem": "Windows 10/11, Windows Server, Linux (Docker) / Client: Web Browser (Chrome, Edge, Safari)",
        "applicationCategory": "BusinessApplication",
        "description": "고객사 사내 서버에 독립 구축하는 온프레미스 3D·2D 하이브리드 가상오피스 및 화상회의 플랫폼. 전 사원 계정 등록 무제한·동시접속 인원(50·100·200·300명) 기준 라이선스, P2P를 제거한 사내 내장 SFU 미디어 엔진(4K 도면 화면공유·무저장), 2.5m~4m 거리 기반 공간 음성, 8종 실시간 근태(집중 근무 시 마이크·주변음 차단, 미사용 자동 로그아웃 시 회의 중 예외 보장), 회의 전후 30분 시한부 외부 협력업체 참석 링크, 건물 내 100명 대강당 기본 제공 및 210석 가상 강당 최대 200명 타운홀·웨비나(별도 옵션), 내장 사내 HTTPS 게이트웨이·자체 인증기관(CA) 및 원클릭 폐쇄망 전환 완비.",
        "featureList": [
          "전 사원 계정 등록 무제한 · 동시접속 인원 기준 합리적 라이선스 (휴가·외근·퇴근자 좌석 차감 없음)",
          "사원 PC 무설치 웹 브라우저 10초 출근 및 저사양·태블릿용 초경량 2D 업무 모드",
          "2.5m 선명·4m 밖 자동 감쇠 근거리 공간 음성(Spatial Voice) 및 8종 근무 상태 연동",
          "P2P 완전 제거 · 사내 서버 내장 SFU 방별 격리 화상회의, 4K 도면 화면공유(플로팅 뷰어) 및 실시간 화이트보드",
          "사내 계정 없는 외부 협력업체용 회의 전후 30분 시한부 게스트 참석 링크 ('외부' 배지 및 단일 회의실 격리)",
          "건물 내 100명 규모 대강당(기본 제공) 및 210석 가상 강당 최대 200명 타운홀·웨비나(별도 옵션, 손들기 발언권 승인)",
          "별도 리버스 프록시 없는 내장 사내 HTTPS 게이트웨이·자체 인증기관(ECDSA P-256) 및 원클릭 폐쇄망(Air-Gap) 전환"
        ],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "KRW",
          "description": "인당 과금(Per-Seat) SaaS 추가 구독료 없음 · 등록 사원 무제한 및 동시접속 인원 기준 온프레미스 라이선스"
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
            "name": "Calamus WorkNexus 가상오피스의 핵심 차별점과 라이선스 과금 방식은 무엇인가요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "인당 매월 과금되는 클라우드 SaaS와 달리 전 사원 계정 등록 수 제한이 없으며, 실제 접속한 '동시접속 인원(50·100·200·300명 등)' 기준으로 운영되어 휴가·외근·퇴근자의 좌석 비용이 발생하지 않습니다. 모든 음성·영상·4K 도면 화면공유는 P2P 없이 고객사 서버 내장 SFU 엔진으로만 중계(무저장)되며, 내장 사내 HTTPS 자체 인증기관과 원클릭 폐쇄망 전환, 시한부 외부 협력업체 링크, 초경량 2D 업무 모드, 100명 대강당(기본) 및 200명 타운홀 웨비나(옵션)를 지원합니다."
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
