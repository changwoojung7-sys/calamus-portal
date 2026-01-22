"use client";

import Link from "next/link";
import { Sparkles, Moon, Scale, User, ArrowRight, Dna, Gamepad2, Car, RefreshCw, Trophy } from "lucide-react";
import { useState, useEffect } from "react";

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

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col gap-12">

        {/* HEADER SECTION */}
        <header className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#6ee7b7] drop-shadow-lg">
            창우의 AI 실험실
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
            일상과 선택을 돕는 작은 AI 서비스 모음<br />
            AI를 이용한 바이브코딩으로 여러가지 언어로 개발하고 있어요.
          </p>
        </header>

        {/* TOP SECTION: Quote & Guide */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

          {/* LEFT: Today's Quote */}
          <div className="bg-[#171e2b] rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-2xl border border-slate-800/50 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

            <h2 className="text-xl font-bold text-slate-200 mb-2">오늘의 한 문장</h2>
            <p className="text-sm text-[#6ee7b7] mb-8">오늘 하루를 위한 짧은 방향 제시</p>

            <div className="bg-slate-800/50 rounded-2xl p-6 md:p-8 w-full max-w-lg mb-8 border border-white/5 backdrop-blur-sm min-h-[140px] flex items-center justify-center">
              <p
                className="text-lg md:text-xl leading-relaxed text-slate-100 word-keep-all animate-fade-in"
                dangerouslySetInnerHTML={{ __html: quote }}
              />
            </div>

            <button
              onClick={refreshQuote}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-full font-bold text-white shadow-lg shadow-blue-900/40 transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
              다른 문장
            </button>
          </div>

          {/* RIGHT: Service Guide Widget */}
          <div className="bg-[#171e2b] rounded-3xl p-8 shadow-2xl border border-slate-800/50 flex flex-col">
            <h3 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> 서비스 소개
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <div className="bg-slate-800/50 rounded-2xl p-5 border border-white/5 flex flex-col gap-3 hover:bg-slate-800 transition-colors">
                <div className="text-3xl">🃏</div>
                <div>
                  <strong className="block text-slate-200 mb-1">운세 & 타로</strong>
                  <p className="text-xs text-slate-400 leading-relaxed">AI가 분석하는 심도 있는 사주와 타로 리딩</p>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-5 border border-white/5 flex flex-col gap-3 hover:bg-slate-800 transition-colors">
                <div className="text-3xl">⚖️</div>
                <div>
                  <strong className="block text-slate-200 mb-1">선택 & 이름</strong>
                  <p className="text-xs text-slate-400 leading-relaxed">결정이 힘들 땐 선택 도우미와 이름 풀이</p>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-5 border border-white/5 flex flex-col gap-3 hover:bg-slate-800 transition-colors">
                <div className="text-3xl">💤</div>
                <div>
                  <strong className="block text-slate-200 mb-1">꿈 & 심리</strong>
                  <p className="text-xs text-slate-400 leading-relaxed">무의식이 보내는 메시지, 꿈 해몽</p>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-5 border border-white/5 flex flex-col gap-3 hover:bg-slate-800 transition-colors">
                <div className="text-3xl">🎮</div>
                <div>
                  <strong className="block text-slate-200 mb-1">게임 도구</strong>
                  <p className="text-xs text-slate-400 leading-relaxed">내기할 땐 사다리 게임과 운명의 룰렛</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES GRID (Compact) */}
        <section>
          <h3 className="text-2xl font-bold text-slate-200 mb-6 px-2 border-l-4 border-cyan-500 pl-4">All Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

            {/* Card Template: Compact */}
            <ServiceCard
              href="/tarot-room"
              icon={<Sparkles className="w-6 h-6 text-purple-400" />}
              title="타로 점보기"
              desc="직관적 타로 상담"

              bg="hover:border-purple-500/50"
              iconBg="bg-purple-900/20"
            />
            <ServiceCard
              href="/saju"
              icon={<Dna className="w-6 h-6 text-amber-400" />}
              title="정통 사주"
              desc="인생 흐름과 운세"
              bg="hover:border-amber-500/50"
              iconBg="bg-amber-900/20"
            />
            <ServiceCard
              href="/name"
              icon={<User className="w-6 h-6 text-teal-400" />}
              title="성명학 분석"
              desc="이름과 운명의 조화"
              bg="hover:border-teal-500/50"
              iconBg="bg-teal-900/20"
            />
            <ServiceCard
              href="/balance"
              icon={<Scale className="w-6 h-6 text-cyan-400" />}
              title="선택 도우미"
              desc="결정 장애 솔루션"
              bg="hover:border-cyan-500/50"
              iconBg="bg-cyan-900/20"
            />
            <ServiceCard
              href="https://myredesign.ai.kr"
              icon={<Trophy className="w-6 h-6 text-rose-400" />}
              title="My Re Design"
              desc="나를 위한 미션 기록"
              bg="hover:border-rose-500/50"
              iconBg="bg-rose-900/20"
              isExternal
            />
            <ServiceCard
              href="/dream"
              icon={<Moon className="w-6 h-6 text-indigo-400" />}
              title="AI 꿈해몽"
              desc="꿈의 상징과 해석"
              bg="hover:border-indigo-500/50"
              iconBg="bg-indigo-900/20"
            />
            <ServiceCard
              href="/sadari"
              icon={<Gamepad2 className="w-6 h-6 text-emerald-400" />}
              title="사다리 게임"
              desc="간편 내기 게임"
              bg="hover:border-emerald-500/50"
              iconBg="bg-emerald-900/20"
            />
            <ServiceCard
              href="/brake"
              icon={<Car className="w-6 h-6 text-red-500" />}
              title="브레이크 게임"
              desc="담력 테스트"
              bg="hover:border-red-500/50"
              iconBg="bg-red-900/20"
            />
            <ServiceCard
              href="/roulette"
              icon={<Sparkles className="w-6 h-6 text-pink-400" />}
              title="운명의 룰렛"
              desc="미션 벌칙 정하기"
              bg="hover:border-pink-500/50"
              iconBg="bg-pink-900/20"
            />

          </div>
        </section>

        <footer className="text-center py-8 text-slate-600 text-xs border-t border-slate-900/50 mt-8">
          © 2026 Calamus Portal. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

function ServiceCard({ href, icon, title, desc, bg, iconBg, isExternal = false }: any) {
  const Component = isExternal ? 'a' : Link;
  return (
    <Component
      href={href}
      target={isExternal ? "_blank" : undefined}
      className={`group block p-5 rounded-2xl bg-[#171e2b] border border-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${bg}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${iconBg} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-bold text-slate-200 mb-1 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-xs text-slate-500 group-hover:text-slate-400">{desc}</p>
    </Component>
  );
}
