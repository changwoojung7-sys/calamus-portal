import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Dna,
  Moon,
  Gamepad2,
  Scale,
  Flame,
  Car,
  User,
  ArrowRight,
  SunMedium,
  Heart,
} from 'lucide-react';

export const HealingLoungeBanner: React.FC = () => {
  const entertainmentServices = [
    {
      title: '정통 사주 & 오행',
      desc: '생년월일로 풀어보는 나의 체질과 운명',
      href: '/saju',
      icon: Dna,
      color: 'text-amber-400',
      bg: 'hover:border-amber-500/50',
    },
    {
      title: 'AI 타로 마음 상담',
      desc: '3D 인터랙티브 AI 카드 리딩',
      href: '/tarot-room',
      icon: Sparkles,
      color: 'text-purple-400',
      bg: 'hover:border-purple-500/50',
    },
    {
      title: 'AI 꿈해몽',
      desc: '어젯밤 꿈의 의미와 길흉화복 분석',
      href: '/dream',
      icon: Moon,
      color: 'text-indigo-400',
      bg: 'hover:border-indigo-500/50',
    },
    {
      title: '선택 도우미',
      desc: '결정이 힘들 때 AI 밸런스 가이드',
      href: '/balance',
      icon: Scale,
      color: 'text-cyan-400',
      bg: 'hover:border-cyan-500/50',
    },
    {
      title: '성명학 분석',
      desc: '한자 수리와 음양오행 이름 풀이',
      href: '/name',
      icon: User,
      color: 'text-teal-400',
      bg: 'hover:border-teal-500/50',
    },
    {
      title: '미니게임 라운지',
      desc: '브레이크·룰렛·사다리 미니게임',
      href: '/brake',
      icon: Gamepad2,
      color: 'text-red-400',
      bg: 'hover:border-red-500/50',
    },
  ];

  return (
    <section id="lounge" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 mb-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#0d1326] to-[#121c38] p-8 sm:p-12 border border-indigo-900/40 shadow-2xl text-left">
        {/* 장식용 배경 글로우 */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs tracking-wider uppercase mb-3">
            <SunMedium className="h-4 w-4" /> Calamus Mind & Healing Lounge
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                마음의 휴식을 위한 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">힐링 라운지</span>
              </h2>
              <p className="mt-3 text-sm text-slate-300 max-w-2xl leading-relaxed">
                간병과 일상 속 지친 마음을 잠시 내려놓으세요. 현대적인 오행 분석 사주와 AI 타로챗, 미니게임으로 가벼운 위로와 즐거움을 선물합니다.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full border border-indigo-500/30 flex items-center gap-1.5 font-semibold">
                <Heart className="w-3.5 h-3.5 text-pink-400" /> 무료 AI 힐링 콘텐츠
              </span>
            </div>
          </div>

          {/* 힐링 라운지 메뉴 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entertainmentServices.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:bg-slate-800/80 ${item.bg} group flex items-start justify-between`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${item.color}`}>
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all mt-1" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
