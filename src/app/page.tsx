"use client";

import Link from "next/link";
import { Sparkles, Moon, Scale, User, ArrowRight, Dna, Gamepad2, Car, RefreshCw, Trophy, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import GoogleAd from "@/components/ads/GoogleAd";
import Footer from "@/components/common/Footer";

// --- QUOTES DATA ---
const QUOTES = [
  "삶의 파도가 거세더라도, 당신 안에는 어떤 폭풍도 잠재울 수 있는 고요한 심지가 있습니다.<br>그 내면의 빛을 믿고 흔들림 없이 나아가세요.",
  "오늘의 선택이 모여 내일의 당신을 만듭니다.<br>가장 나답다고 느껴지는 길을 선택하세요.",
  "서두를 필요 없습니다. 방향만 잃지 않는다면<br>당신은 이미 목적지를 향해 가고 있는 중입니다.",
  "복잡한 생각이 마음을 어지럽힐 땐 단순함으로 돌아가세요.<br>가장 중요한 한 가지에만 집중해보는 하루는 어떨까요?",
  "당신의 직관은 생각보다 현명합니다.<br>오늘은 논리보다 마음의 소리에 귀 기울여보세요.",
  "실수해도 괜찮습니다. 그것은 당신이 노력하고 있다는 증거니까요.<br>자신을 조금 더 너그럽게 바라봐 주세요.",
  "모든 꽃이 동시에 피지 않듯, 당신의 시간도 반드시 찾아옵니다.<br>조급해하지 말고 당신만의 계절을 기다리세요.",
  "행복은 거창한 것이 아닙니다. 따뜻한 햇살, 맛있는 커피 한 잔...<br>지금 이 순간의 작은 기쁨을 놓치지 마세요.",
  "당신은 충분히 잘하고 있습니다. <br>남들의 속도에 맞추지 말고 당신만의 리듬을 유지하세요.",
  "오늘 하루, 완벽하지 않아도 좋습니다.<br>그저 당신이 온전히 존재하는 것만으로도 충분히 가치 있는 날입니다.",
  "변화는 두렵지만, 그 너머에는 새로운 가능성이 기다리고 있습니다.<br>용기 내어 작은 한 걸음을 내디뎌 보세요.",
  "지친 마음에는 휴식이 약입니다.<br>잠시 멈춰 서서 깊은 숨을 내쉬고 마음을 돌보는 시간을 가지세요.",
  "감사는 삶을 풍요롭게 만드는 마법입니다.<br>오늘 당연하게 여겼던 것들에 대해 감사의 마음을 가져보세요.",
  "당신의 미소는 누군가에게 큰 힘이 됩니다.<br>오늘 만나는 사람들에게 따뜻한 미소를 선물해 보세요.",
  "어둠이 깊을수록 별은 더 밝게 빛납니다.<br>지금의 힘든 시간도 당신을 더욱 빛나게 할 밑거름이 될 것입니다.",
  "비교는 기쁨을 앗아가는 도둑입니다.<br>어제의 나보다 조금 더 성장한 오늘의 나에게 집중하세요.",
  "말 한마디가 천 냥 빚을 갚습니다.<br>나 자신에게, 그리고 타인에게 따뜻한 말을 건네는 하루가 되세요.",
  "시작이 반입니다. 망설이고 있는 일이 있다면<br>작은 것부터 가볍게 시작해 보세요.",
  "꾸준함이 답입니다. 포기하지 않고 묵묵히 나아가는 발걸음이<br>결국 당신을 원하는 곳으로 데려다줄 것입니다.",
  "당신은 사랑받기 위해 태어난 사람입니다.<br>오늘 하루, 그 누구보다 당신 스스로를 많이 아껴주고 사랑해 주세요.",
  "걱정은 내일의 슬픔을 덜어주지 않고, 오늘의 힘만 앗아갑니다.<br>일어나지 않은 일에 대한 걱정은 내려놓고 현재에 충실하세요.",
  "긍정적인 생각은 긍정적인 결과를 불러옵니다.<br>할 수 있다는 믿음으로 오늘 하루를 활기차게 시작해 보세요.",
  "실패는 성공으로 가는 과정일 뿐입니다.<br>넘어지는 것을 두려워하지 말고 툭 털고 다시 일어나세요.",
  "진정한 아름다움은 내면에서 우러나옵니다.<br>겉모습보다는 마음을 가꾸는 데 시간을 투자해 보세요.",
  "친절은 결코 헛되지 않습니다.<br>당신의 작은 배려가 세상을 조금 더 따뜻하게 만들 수 있습니다.",
  "꿈을 꾸는 데 늦은 때란 없습니다.<br>가슴 설레는 일이 있다면 지금 바로 도전해 보세요.",
  "인생은 속도가 아니라 방향입니다.<br>잠시 멈춰 서서 내가 가고 있는 길이 맞는지 점검해 보세요.",
  "당신은 혼자가 아닙니다. 주변을 둘러보면<br>당신을 응원하고 지지하는 사람들이 반드시 있습니다.",
  "오늘 하루도 수고 많으셨습니다.<br>편안한 밤 보내시고 내일은 더 행복한 하루가 되기를 바랍니다.",
  "희망은 잠들지 않는 꿈입니다.<br>어떤 상황에서도 희망의 끈을 놓지 마세요."
];

export default function Home() {
  const [quote, setQuote] = useState("");
  const [isRotating, setIsRotating] = useState(false);

  // AdSense Slot ID provided by user
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
    <div className="min-h-screen bg-[#0b0f17] text-white overflow-x-hidden font-sans selection:bg-cyan-500/30">

      {/* Background Gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_#1c2333,_#0b0f17)] -z-10" />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">

        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800/50 pb-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#6ee7b7] drop-shadow-lg">
              창우의 AI 실험실
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              일상의 선택을 돕는 AI 도구 모음
            </p>
          </div>
          <div className="text-xs text-slate-500 bg-slate-800/50 px-4 py-2 rounded-full border border-white/5">
            Powered by Vibe Coding
          </div>
        </header>

        {/* 1. TOP BANNER AD SECTION */}
        <section className="w-full flex justify-center bg-[#171e2b] p-4 rounded-xl border border-slate-800/50 shadow-sm min-h-[100px] overflow-hidden">
          <div className="w-full max-w-[728px] text-center">
            <p className="text-[10px] text-slate-600 mb-1 tracking-widest uppercase">Sponsored</p>
            {/* Top Banner Ad - Responsive/Horizontal */}
            <GoogleAd slot={AD_SLOT_ID} format="auto" responsive={true} />
          </div>
        </section>

        {/* 2. MAIN GRID: 2 Columns (Content | Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* --- LEFT COLUMN: Main Content (~75%) --- */}
          <div className="lg:col-span-3 flex flex-col gap-8 h-full">

            {/* A. Hero: Today's Quote */}
            <section className="bg-gradient-to-br from-[#171e2b] to-[#0f1520] rounded-3xl p-8 md:p-10 relative overflow-hidden group border border-slate-800 shadow-xl">
              {/* Decorative Gradient Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-70"></div>

              <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/20 text-cyan-400 text-xs font-bold border border-cyan-500/20 mb-2">
                    <Sparkles className="w-3 h-3" /> 오늘의 한 문장
                  </div>

                  <div className="min-h-[80px] flex items-center md:items-start justify-center md:justify-start">
                    <p
                      className="text-lg md:text-xl leading-relaxed text-slate-100 font-medium word-keep-all"
                      dangerouslySetInnerHTML={{ __html: quote }}
                    />
                  </div>

                  <p className="text-sm text-slate-500">
                    오늘 하루를 위한 작은 방향 제시
                  </p>
                </div>

                <button
                  onClick={refreshQuote}
                  className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-all hover:scale-105 active:scale-95 group-hover:border-cyan-500/30 shadow-lg"
                  title="다른 문장 보기"
                >
                  <RefreshCw className={`w-5 h-5 ${isRotating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </section>

            {/* B. Services Grid */}
            <section>
              <h2 className="text-xl font-bold text-slate-200 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-cyan-500 rounded-full"></span>
                전체 서비스
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <ServiceCard
                  href="/tarot-room"
                  icon={<Sparkles className="w-5 h-5 text-purple-400" />}
                  title="타로 점보기"
                  desc="AI가 들려주는 당신의 운명"
                  bg="hover:border-purple-500/50"
                  iconBg="bg-purple-900/20"
                />
                <ServiceCard
                  href="/saju"
                  icon={<Dna className="w-5 h-5 text-amber-400" />}
                  title="정통 사주"
                  desc="생년월일로 보는 인생 흐름"
                  bg="hover:border-amber-500/50"
                  iconBg="bg-amber-900/20"
                />
                <ServiceCard
                  href="/name"
                  icon={<User className="w-5 h-5 text-teal-400" />}
                  title="성명학 분석"
                  desc="이름 속에 숨겨진 운명"
                  bg="hover:border-teal-500/50"
                  iconBg="bg-teal-900/20"
                />
                <ServiceCard
                  href="/dream"
                  icon={<Moon className="w-5 h-5 text-indigo-400" />}
                  title="AI 꿈해몽"
                  desc="무의식이 보내는 신호 해석"
                  bg="hover:border-indigo-500/50"
                  iconBg="bg-indigo-900/20"
                />
                <ServiceCard
                  href="/balance"
                  icon={<Scale className="w-5 h-5 text-purple-400" />}
                  title="선택 도우미"
                  desc="결정이 힘들 땐 AI에게"
                  bg="hover:border-purple-500/50"
                  iconBg="bg-purple-900/20"
                />

                {/* [NEW] Balance Game */}
                <ServiceCard
                  href="/balance/game"
                  icon={<Scale className="w-5 h-5 text-indigo-400" />}
                  title="극한의 밸런스 게임"
                  desc="나의 성향은 몇 %? 실시간 랭킹"
                  bg="hover:border-indigo-500/50"
                  iconBg="bg-indigo-900/20"
                  badge="HOT"
                />
                <ServiceCard
                  href="/sadari"
                  icon={<Gamepad2 className="w-5 h-5 text-emerald-400" />}
                  title="사다리 게임"
                  desc="간편한 내기 게임 한판"
                  bg="hover:border-emerald-500/50"
                  iconBg="bg-emerald-900/20"
                />
                <ServiceCard
                  href="/brake"
                  icon={<Car className="w-5 h-5 text-red-500" />}
                  title="브레이크 게임"
                  desc="스릴 넘치는 담력 테스트"
                  bg="hover:border-red-500/50"
                  iconBg="bg-red-900/20"
                />
                <ServiceCard
                  href="/roulette"
                  icon={<Sparkles className="w-5 h-5 text-pink-400" />}
                  title="운명의 룰렛"
                  desc="오늘의 벌칙은 누구?"
                  bg="hover:border-pink-500/50"
                  iconBg="bg-pink-900/20"
                />
                <ServiceCard
                  href="https://myredesign.ai.kr"
                  icon={<Trophy className="w-5 h-5 text-rose-400" />}
                  title="My Re Design"
                  desc="좋은 습관 만들기 프로젝트"
                  bg="hover:border-rose-500/50"
                  iconBg="bg-rose-900/20"
                  isExternal
                  badge="Family Site"
                />
              </div>
            </section>
          </div>

          {/* --- RIGHT COLUMN: Sidebar (~25%) --- */}
          <aside className="lg:col-span-1 flex flex-col gap-6 sticky top-8">

            {/* 1. Sidebar Ad */}
            <div className="bg-[#171e2b] rounded-2xl p-4 border border-slate-800 shadow-lg flex flex-col items-center justify-center min-h-[300px]">
              <p className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">Advertisement</p>
              {/* Sidebar Ad - Vertical/Rectangle */}
              <div className="w-full overflow-hidden flex justify-center">
                <GoogleAd slot={AD_SLOT_ID} format="auto" responsive={true} style={{ display: 'block', minHeight: '250px', width: '100%' }} />
              </div>
            </div>

            {/* 2. Service Guide Widget (Compact List) */}
            <div className="bg-[#171e2b] rounded-2xl p-6 border border-slate-800 shadow-md">
              <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Service Guide
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start p-2 hover:bg-slate-800 rounded-lg transition-colors">
                  <span className="text-2xl mt-0.5">🃏</span>
                  <div>
                    <strong className="block text-slate-200 text-sm">운세 & 타로</strong>
                    <p className="text-xs text-slate-500">오늘의 운세를 확인하세요.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start p-2 hover:bg-slate-800 rounded-lg transition-colors">
                  <span className="text-2xl mt-0.5">💤</span>
                  <div>
                    <strong className="block text-slate-200 text-sm">꿈 해몽</strong>
                    <p className="text-xs text-slate-500">어젯밤 꿈이 궁금하다면?</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start p-2 hover:bg-slate-800 rounded-lg transition-colors">
                  <span className="text-2xl mt-0.5">🎮</span>
                  <div>
                    <strong className="block text-slate-200 text-sm">미니 게임</strong>
                    <p className="text-xs text-slate-500">심심할 때 즐기는 한 판.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* 3. Footer (Mini) - REMOVED (Moved to global footer) */}
            <div className="text-center text-[10px] text-slate-600 space-y-1">
              {/* Mobile sidebar footer optional, can keep or remove. Keeping empty for now or minimal */}
            </div>

          </aside>

        </div>

        <Footer />
      </main>
    </div>
  );
}

function ServiceCard({ href, icon, title, desc, bg, iconBg, isExternal = false, badge }: any) {
  const Component = isExternal ? 'a' : Link;
  return (
    <Component
      href={href}
      target={isExternal ? "_blank" : undefined}
      className={`group relative flex flex-col p-5 rounded-2xl bg-[#171e2b] border border-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-[#1c2433] ${bg}`}
    >
      {badge && (
        <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
          {badge}
        </span>
      )}

      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconBg} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-slate-200 mb-1 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400">{desc}</p>
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs text-slate-600 group-hover:text-cyan-400 transition-colors bg-black/20 w-fit px-2 py-1 rounded-md opacity-0 group-hover:opacity-100">
        <span>바로가기</span>
        <ArrowRight className="w-3 h-3" />
      </div>
    </Component>
  );
}
