"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Dna,
  Moon,
  Gamepad2,
  Scale,
  User,
  ArrowRight,
  SunMedium,
  Heart,
  RotateCcw,
  GitFork,
  Flame,
  X,
  Play,
  Trophy,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const HealingLoungeBanner: React.FC = () => {
  const [isGameModalOpen, setIsGameModalOpen] = useState<boolean>(false);

  // 미니게임 3종 데이터
  const miniGames = [
    {
      id: 'roulette',
      title: '행운의 룰렛',
      subtitle: '오늘의 메뉴 · 순서 정하기 · 행운의 돌림판',
      desc: '가벼운 결정이 필요할 때! 회전판을 돌려 행운을 확인하세요.',
      href: '/roulette',
      badge: '간편 돌림판',
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
      icon: RotateCcw,
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'sadari',
      title: '사다리 타기',
      subtitle: '내기 · 팀 나누기 · 당첨자 추첨 사다리',
      desc: '참여 인원과 항목을 입력하고 두근두근 사다리를 타보세요.',
      href: '/sadari',
      badge: '인기 내기 게임',
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50 border-amber-200 hover:border-amber-400',
      icon: GitFork,
      iconBg: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'brake',
      title: '블록 브레이크',
      subtitle: '스트레스 해소 레트로 벽돌깨기 아케이드',
      desc: '패들을 조작해 모든 블록을 깨부수고 최고 점수에 도전하세요!',
      href: '/brake',
      badge: '아케이드 액션',
      color: 'from-rose-500 to-pink-600',
      textColor: 'text-rose-700',
      bgColor: 'bg-rose-50 border-rose-200 hover:border-rose-400',
      icon: Gamepad2,
      iconBg: 'bg-rose-100 text-rose-700',
    },
  ];

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
      isModal: false,
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
      isModal: false,
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
      isModal: false,
    },
    {
      id: 'balance',
      title: '선택 도우미',
      desc: '결정이 힘들 때 AI 밸런스 가이드',
      href: '/balance',
      icon: Scale,
      color: 'text-cyan-600',
      iconBg: 'bg-cyan-50 border-cyan-200',
      bg: 'hover:border-cyan-400',
      isModal: false,
    },
    {
      id: 'name',
      title: '성명학 분석',
      desc: '한자 수리와 음양오행 이름 풀이',
      href: '/name',
      icon: User,
      color: 'text-teal-600',
      iconBg: 'bg-teal-50 border-teal-200',
      bg: 'hover:border-teal-400',
      isModal: false,
    },
    {
      id: 'minigames',
      title: '미니게임 라운지',
      desc: '룰렛 · 사다리 · 브레이크 게임 3종 선택',
      href: '#',
      icon: Gamepad2,
      color: 'text-rose-600',
      iconBg: 'bg-rose-50 border-rose-200',
      bg: 'hover:border-rose-400 ring-1 ring-rose-300',
      isModal: true,
    },
  ];

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
                간병과 일상 속 지친 마음을 잠시 내려놓으세요. 현대적인 오행 분석 사주와 AI 타로챗, 미니게임으로 가벼운 위로와 즐거움을 선물합니다.
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
            {entertainmentServices.map((item, idx) => {
              const Icon = item.icon;

              if (item.isModal) {
                return (
                  <div
                    key={idx}
                    onClick={() => setIsGameModalOpen(true)}
                    className={`p-4 rounded-2xl bg-white border border-rose-200/90 transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${item.bg} group flex flex-col justify-between shadow-xs relative overflow-hidden`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3.5">
                        <div className={`p-2.5 rounded-xl border ${item.iconBg} ${item.color}`}>
                          <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                              {item.title}
                            </h4>
                            <span className="text-[10px] font-extrabold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                              3종 선택
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all mt-1" />
                    </div>

                    {/* 3대 미니게임 퀵 바로가기 칩 버튼 */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <Link
                        href="/roulette"
                        className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-2.5 h-2.5" /> 룰렛
                      </Link>
                      <Link
                        href="/sadari"
                        className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[11px] font-bold transition-colors flex items-center gap-1"
                      >
                        <GitFork className="w-2.5 h-2.5" /> 사다리
                      </Link>
                      <Link
                        href="/brake"
                        className="px-2 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold transition-colors flex items-center gap-1"
                      >
                        <Gamepad2 className="w-2.5 h-2.5" /> 브레이크
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`p-4 rounded-2xl bg-white border border-slate-200/90 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${item.bg} group flex items-start justify-between shadow-xs`}
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
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all mt-1" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 미니게임 선택 팝업 모달 */}
      {isGameModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsGameModalOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    미니게임 라운지
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    플레이하고 싶은 미니게임을 선택해주세요
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsGameModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3대 미니게임 선택 카드 목록 */}
            <div className="grid grid-cols-1 gap-3.5 my-6">
              {miniGames.map((game) => {
                const GameIcon = game.icon;
                return (
                  <Link
                    key={game.id}
                    href={game.href}
                    onClick={() => setIsGameModalOpen(false)}
                    className={`p-4 sm:p-5 rounded-2xl border ${game.bgColor} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-between group`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${game.iconBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform`}>
                        <GameIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-white border border-slate-200/80 ${game.textColor}`}>
                            {game.badge}
                          </span>
                          <h4 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors">
                            {game.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 font-medium line-clamp-1">
                          {game.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      <span className="hidden sm:inline text-xs font-bold text-slate-500 group-hover:text-slate-900">
                        게임 시작
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-slate-900 group-hover:text-white border border-slate-200 flex items-center justify-center text-slate-700 transition-colors shadow-2xs">
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* 모달 푸터 안내 */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>별도의 설치 없이 웹에서 즉시 무료로 실행됩니다.</span>
              <button
                onClick={() => setIsGameModalOpen(false)}
                className="font-semibold text-slate-600 hover:text-slate-900"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
