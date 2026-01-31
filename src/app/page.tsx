"use client";

import Link from "next/link";
import { Sparkles, Moon, Scale, User, ArrowRight, Dna, Gamepad2, Car, RefreshCw, Trophy, MessageCircle, Flame, TrendingUp, Star, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import GoogleAd from "@/components/ads/GoogleAd";
import Footer from "@/components/common/Footer";

// --- QUOTES DATA ---
const QUOTES = [
  "삶의 파도가 거세더라도, 당신 안에는 어떤 폭풍도 잠재울 수 있는 고요한 심지가 있습니다.<br>그 내면의 빛을 믿고 흔들림 없이 나아가세요.",
  "오늘의 선택이 모여 내일의 당신을 만듭니다.<br>가장 나답다고 느껴지는 길을 선택하세요.",
  // ... (Keep other quotes if needed, truncated for brevity in this view but logic remains)
  "희망은 잠들지 않는 꿈입니다.<br>어떤 상황에서도 희망의 끈을 놓지 마세요."
];

// --- MOCK DATA FOR "LIVE" FEEL ---
const LIVE_RANKINGS = [
  { name: "김*수", game: "밸런스 게임", score: "98% 일치", time: "방금 전" },
  { name: "이*영", game: "브레이크 게임", score: "0.01초", time: "1분 전" },
  { name: "박*호", game: "운명의 룰렛", score: "당첨!", time: "2분 전" },
  { name: "최*진", game: "사다리 게임", score: "성공", time: "5분 전" },
  { name: "정*우", game: "AI 꿈해몽", score: "대길", time: "7분 전" },
];

const HOT_KEYWORDS = [
  { tag: "#연애운", href: "/tarot-room" },
  { tag: "#오늘의운세", href: "/saju" },
  { tag: "#밸런스게임", href: "/balance/game" },
  { tag: "#공포테스트", href: "/brake" },
  { tag: "#로또번호", href: "/roulette" }
];

const SERVICES = [
  { category: "game", href: "/brake", title: "브레이크 게임", desc: "당신의 반응속도는 0.몇 초? 담력 테스트!", icon: <Car className="w-6 h-6 text-red-500" />, color: "red", hot: true },
  { category: "game", href: "/roulette", title: "운명의 룰렛", desc: "오늘 점심 내기? 벌칙? 공정한 추첨기", icon: <Sparkles className="w-6 h-6 text-pink-500" />, color: "pink" },
  { isAd: true, fullWidth: true, category: "all" }, // Ad placeholder logic handled in render
  { category: "game", href: "/sadari", title: "사다리 게임", desc: "간편한 사다리 타기! 누가 당첨될까?", icon: <Gamepad2 className="w-6 h-6 text-emerald-500" />, color: "emerald", hot: true },
  { category: "fortune", href: "/tarot-room", title: "신비의 타로", desc: "AI가 해석해주는 당신의 현재와 미래", icon: <Sparkles className="w-6 h-6 text-purple-500" />, color: "purple", hot: true },
  { category: "fortune", href: "/saju", title: "정통 사주", desc: "생년월일로 풀어보는 나의 운명", icon: <Dna className="w-6 h-6 text-amber-500" />, color: "amber" },
  { category: "fortune", href: "/dream", title: "AI 꿈해몽", desc: "어젯밤 꿈이 예지몽일까? 무료 해몽", icon: <Moon className="w-6 h-6 text-indigo-500" />, color: "indigo" },
  { category: "fortune", href: "/name", title: "성명학 분석", desc: "내 이름 점수는 몇 점? 개명 전 필수 확인", icon: <User className="w-6 h-6 text-teal-500" />, color: "teal" },
  { category: "game", href: "/balance", title: "선택 도우미", desc: "결정이 힘들 땐 AI에게 물어보세요", icon: <Scale className="w-6 h-6 text-purple-500" />, color: "purple" },
];

export default function Home() {
  const [quote, setQuote] = useState("");
  const [isRotating, setIsRotating] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // AdSense Slot ID
  const AD_SLOT_ID = "3529245457";

  const refreshQuote = () => {
    setIsRotating(true);
    let nextIndex = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[nextIndex]);
    setTimeout(() => setIsRotating(false), 500);
  };

  useEffect(() => {
    refreshQuote();
  }, []);

  return (
    <div className="min-h-screen bg-[#05090f] text-slate-200 font-sans selection:bg-cyan-500/30">

      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1a2333,_#05090f)] -z-10" />
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent z-50"></div>

      <main className="max-w-[1400px] mx-auto px-4 py-6">

        {/* 1. PORTAL HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-slate-800/50 pb-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              C
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                Calamus <span className="text-cyan-400 group-hover:text-white transition-colors">Portal</span>
              </h1>
              <p className="text-xs text-slate-500">
                Premium AI Entertainment & Utilities
              </p>
            </div>
          </Link>

          {/* Search/Keywords Mock */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
            <span className="text-cyan-500 font-bold"><Flame className="w-3 h-3 inline" /> HOT:</span>
            {HOT_KEYWORDS.map((k, i) => (
              <Link key={i} href={k.href} className="hover:text-white hover:underline cursor-pointer transition-colors">{k.tag}</Link>
            ))}
          </div>

          <button onClick={() => alert("Ctrl+D를 눌러 즐겨찾기에 추가해주세요!")} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-lg border border-slate-700 transition-colors">
            즐겨찾기 추가
          </button>
        </header>

        {/* 2. TOP BANNER AD (Responsive) */}
        <div className="w-full bg-[#0f1520] border border-slate-800/50 rounded-xl p-4 mb-8 flex justify-center items-center shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-500 opacity-50"></div>
          <div className="text-center w-full">
            <span className="text-[10px] text-slate-600 uppercase tracking-widest block mb-2">Sponsored Content</span>
            <div className="min-h-[90px] w-full flex justify-center">
              <GoogleAd slot={AD_SLOT_ID} format="auto" responsive={true} />
            </div>
          </div>
        </div>

        {/* 3. MAIN PORTAL LAYOUT (3 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* --- LEFT SIDEBAR (Navigation) --- */}
          <aside className="hidden lg:col-span-2 lg:flex flex-col gap-6 sticky top-6 h-fit">
            <div className="bg-[#0f1520] rounded-xl border border-slate-800/50 overflow-hidden">
              <div className="p-4 bg-slate-900/50 border-b border-slate-800/50">
                <h3 className="font-bold text-slate-300 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-cyan-400" /> 메뉴
                </h3>
              </div>
              <nav className="p-2 space-y-1">
                <SidebarLink icon={<Flame className="w-4 h-4 text-red-400" />} label="인기 게임" href="/balance/game" active />
                <SidebarLink icon={<Sparkles className="w-4 h-4 text-purple-400" />} label="운세 / 타로" href="/tarot-room" />
                <SidebarLink icon={<Dna className="w-4 h-4 text-amber-400" />} label="사주 분석" href="/saju" />
                <SidebarLink icon={<Moon className="w-4 h-4 text-indigo-400" />} label="꿈 해몽" href="/dream" />
                <SidebarLink icon={<Scale className="w-4 h-4 text-purple-400" />} label="선택 도우미" href="/balance" />
              </nav>
            </div>

            <div className="bg-[#0f1520] rounded-xl border border-slate-800/50 p-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-500 font-bold">TODAY'S QUOTE</span>
                <p className="text-sm text-slate-300 italic word-keep-all leading-relaxed">
                  "{quote.split('<br>')[0]}"
                </p>
                <button onClick={refreshQuote} className="text-xs text-cyan-500 hover:text-cyan-400 flex items-center gap-1 mt-2">
                  <RefreshCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} /> 새로고침
                </button>
              </div>
            </div>
          </aside>

          {/* --- CENTER FEED (Main Content) --- */}
          <section className="lg:col-span-7 flex flex-col gap-8">

            {/* HERO: Featured Game */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 group shadow-2xl shadow-cyan-900/20">
              <div className="absolute inset-0 bg-gradient-to-t from-[#05090f] via-transparent to-transparent z-10"></div>
              {/* Mock Image Gradient Placeholder if user has no image yet */}
              <div className="h-[300px] w-full bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>

              <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block animate-pulse">HOT 🔥</span>
                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">극한의 밸런스 게임</h2>
                <p className="text-slate-300 mb-4 max-w-lg text-sm md:text-base">
                  당신의 선택은 대중과 얼마나 일치할까요? 지금 바로 확인해보세요!
                  실시간 랭킹 시스템 도입 완료.
                </p>
                <Link href="/balance/game" className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-lg shadow-cyan-600/30">
                  <Gamepad2 className="w-5 h-5" />
                  지금 플레이하기
                </Link>
              </div>
            </div>

            {/* Content Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  인기 서비스
                </h3>
                <div className="flex gap-2">
                  <CategoryButton label="전체" value="all" activeTab={activeTab} onClick={setActiveTab} />
                  <CategoryButton label="게임" value="game" activeTab={activeTab} onClick={setActiveTab} />
                  <CategoryButton label="운세" value="fortune" activeTab={activeTab} onClick={setActiveTab} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SERVICES.filter(s => activeTab === 'all' || s.category === activeTab).map((service, idx) => (
                  <div key={idx} className={service.fullWidth ? "md:col-span-2" : ""}>
                    {service.isAd ? (
                      <div className="my-2 rounded-xl overflow-hidden border border-slate-800 bg-[#0f1520] p-4 flex items-center justify-center">
                        <div className="w-full text-center">
                          <span className="text-[10px] text-slate-600 block mb-1">ADVERTISEMENT</span>
                          <GoogleAd slot={AD_SLOT_ID} format="horizontal" responsive={true} />
                        </div>
                      </div>
                    ) : (
                      <GameCard
                        href={service.href || "#"}
                        title={service.title || ""}
                        desc={service.desc || ""}
                        icon={service.icon}
                        color={service.color || "gray"}
                        hot={service.hot}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

          </section>

          {/* --- RIGHT SIDEBAR (Sticky Ads & Ranking) --- */}
          <aside className="lg:col-span-3 flex flex-col gap-6 sticky top-6 h-fit">

            {/* LIVE RANKING WIDGET */}
            <div className="bg-[#0f1520] rounded-xl border border-slate-800/50 overflow-hidden shadow-lg">
              <div className="p-4 bg-slate-900/50 border-b border-slate-800/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-300 flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-400" /> 실시간 참여 현황
                </h3>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <ul className="divide-y divide-slate-800/50">
                {LIVE_RANKINGS.map((item, idx) => (
                  <li key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-slate-800/30 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-300">{item.game}</span>
                      <span className="text-slate-500">{item.name}님</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-medium text-cyan-400">{item.score}</span>
                      <span className="text-slate-600 text-[10px]">{item.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* VERTICAL AD STICKY */}
            <div className="bg-[#0f1520] rounded-xl border border-slate-800/50 p-4 min-h-[400px] flex flex-col items-center shadow-lg">
              <span className="text-[10px] text-slate-600 mb-2 uppercase tracking-widest">Sponsored</span>
              <div className="w-full flex-1 flex items-center justify-center bg-slate-900/20 rounded-lg">
                {/* Ensures ad takes up space */}
                <GoogleAd slot={AD_SLOT_ID} format="vertical" responsive={true} style={{ display: 'block', width: '100%', minHeight: '300px' }} />
              </div>
            </div>

          </aside>

        </div>

        {/* 4. FOOTER */}
        <div className="mt-12">
          <Footer />
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function CategoryButton({ label, value, activeTab, onClick }: any) {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`text-xs px-3 py-1 rounded-full border transition-all ${isActive ? 'bg-slate-800 text-slate-200 border-slate-700 font-bold shadow' : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'}`}
    >
      {label}
    </button>
  )
}

function SidebarLink({ icon, label, href, active = false }: { icon: any, label: string, href: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
      {active && <ArrowRight className="w-3 h-3 ml-auto" />}
    </Link>
  )
}

function GameCard({ href, title, desc, icon, color, hot = false }: { href: string, title: string, desc: string, icon: any, color: string, hot?: boolean }) {
  const colorClasses: any = {
    red: "group-hover:border-red-500/50 group-hover:shadow-red-900/20",
    pink: "group-hover:border-pink-500/50 group-hover:shadow-pink-900/20",
    emerald: "group-hover:border-emerald-500/50 group-hover:shadow-emerald-900/20",
    purple: "group-hover:border-purple-500/50 group-hover:shadow-purple-900/20",
    amber: "group-hover:border-amber-500/50 group-hover:shadow-amber-900/20",
    indigo: "group-hover:border-indigo-500/50 group-hover:shadow-indigo-900/20",
    teal: "group-hover:border-teal-500/50 group-hover:shadow-teal-900/20",
  };

  return (
    <Link href={href} className={`group relative bg-[#0f1520] border border-slate-800 p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${colorClasses[color] || ""}`}>
      {hot && <span className="absolute top-3 right-3 text-[10px] font-bold text-red-400 bg-red-900/20 px-2 py-0.5 rounded border border-red-500/20 animate-pulse">HOT</span>}

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-200 group-hover:text-white mb-1 transition-colors">{title}</h4>
          <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
        </div>
      </div>
    </Link>
  )
}

