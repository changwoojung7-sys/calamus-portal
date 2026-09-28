"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Dna,
  Moon,
  ArrowRight,
  SunMedium,
  Heart,
  LoaderCircle
} from 'lucide-react';

export const HealingLoungeBanner: React.FC = () => {
  const router = useRouter();
  const [pendingService, setPendingService] = useState<string | null>(null);

  const entertainmentServices = [
    {
      id: 'saju',
      title: '정통 사주 & 오행',
      desc: '생년월일로 풀어보는 나의 체질과 운명',
      href: '/saju',
      icon: Dna,
      color: 'text-amber-600',
      iconBg: 'bg-amber-50 border-amber-200',
      bg: 'hover:border-amber-400',
    },
    {
      id: 'tarot',
      title: 'AI 타로 마음 상담',
      desc: '3D 인터랙티브 AI 카드 리딩',
      href: '/tarot-room',
      icon: Sparkles,
      color: 'text-purple-600',
      iconBg: 'bg-purple-50 border-purple-200',
      bg: 'hover:border-purple-400',
    },
    {
      id: 'dream',
      title: 'AI 꿈해몽',
      desc: '어젯밤 꿈의 의미와 길흉화복 분석',
      href: '/dream',
      icon: Moon,
      color: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border-indigo-200',
      bg: 'hover:border-indigo-400',
    },
  ];

  useEffect(() => {
    router.prefetch('/saju');
    router.prefetch('/tarot-room');
    router.prefetch('/dream');
  }, [router]);

  const handleServiceClick = (href: string, title: string) => {
    if (pendingService) return;

    setPendingService(title);

    window.setTimeout(() => {
      router.push(href);
    }, 120);

    window.setTimeout(() => {
      setPendingService(null);
    }, 8000);
  };

  return (
    <section id="lounge" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 mb-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-slate-50 p-8 sm:p-12 border border-indigo-200 shadow-md text-left">
        {/* 장식용 배경 글로우 */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs tracking-wider uppercase mb-3">
            <SunMedium className="h-4 w-4 text-indigo-600" /> Calamus Mind & Healing Lounge
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                마음의 휴식을 위한 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">힐링 라운지</span>
              </h2>
              <p className="mt-3 text-sm text-slate-600 max-w-2xl leading-relaxed">
                간병과 일상 속 지친 마음을 잠시 내려놓으세요. 현대적인 오행 분석 사주와 AI 타로챗, 꿈해몽으로 가벼운 위로와 쉼을 선물합니다.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-white text-indigo-700 px-3.5 py-1.5 rounded-full border border-indigo-200 flex items-center gap-1.5 font-bold shadow-xs">
                <Heart className="w-3.5 h-3.5 text-pink-500" /> 무료 AI 힐링 콘텐츠
              </span>
            </div>
          </div>

          {/* 힐링 라운지 메뉴 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entertainmentServices.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleServiceClick(item.href, item.title)}
                  disabled={pendingService !== null}
                  aria-label={`${item.title} 페이지로 이동`}
                  className={`w-full p-4 rounded-2xl bg-white border border-slate-200/90 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${item.bg} group flex items-start justify-between shadow-xs text-left disabled:cursor-wait disabled:opacity-70`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl border ${item.iconBg} ${item.color}`}>
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                  {pendingService === item.title ? (
                    <LoaderCircle className="w-4 h-4 animate-spin text-indigo-600 mt-1" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {pendingService && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-indigo-200 bg-white px-5 py-4 text-sm font-bold text-slate-800 shadow-2xl">
            <LoaderCircle className="h-5 w-5 animate-spin text-indigo-600" />
            <span>{pendingService} 페이지로 이동 중입니다...</span>
          </div>
        </div>
      )}
    </section>
  );
};
