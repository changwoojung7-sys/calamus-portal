import React from 'react';
import { BookOpen, HelpCircle, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';

export const CareMagazineSection: React.FC = () => {
  const articles = [
    {
      category: '요양 가이드',
      title: '요양병원 vs 요양원, 무엇이 다를까요? 완벽 비교 가이드',
      summary: '의료진 상주 여부, 건강보험 vs 장기요양보험 혜택, 월 예상 본인부담금 차이를 한눈에 정리했습니다.',
      tags: ['요양병원', '요양원', '장기요양등급', '비용비교'],
      readTime: '4분',
      icon: HelpCircle,
      gradient: 'from-blue-600/20 to-indigo-900/40',
      border: 'border-blue-500/30',
    },
    {
      category: '한방 케어',
      title: '체질별 맞춤 한방 건강관리와 약선(藥膳) 요법',
      summary: '사상체질(태양·태음·소양·소음)에 따른 계절별 보약 및 식이요법으로 면역력을 높이는 실전 팁을 소개합니다.',
      tags: ['한방의학', '사상체질', '약선요법', '면역관리'],
      readTime: '3분',
      icon: ShieldCheck,
      gradient: 'from-amber-600/20 to-orange-900/40',
      border: 'border-amber-500/30',
    },
    {
      category: '호스피스 & 완화의료',
      title: '보호자를 위한 호스피스 완화의료 이용 가이드 및 상담 신청',
      summary: '존엄한 삶의 마무리를 돕는 호스피스 완화의료의 입원형/가정형 지원 제도와 국가 지원 비용 안내입니다.',
      tags: ['호스피스', '완화돌봄', '가정형호스피스', '존엄케어'],
      readTime: '5분',
      icon: HeartHandshake,
      gradient: 'from-purple-600/20 to-pink-900/40',
      border: 'border-purple-500/30',
    },
  ];

  return (
    <section id="magazine" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 text-left">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <BookOpen className="h-4 w-4" /> Calamus Care Magazine & Insights
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            환자와 보호자를 위한 전문 케어 가이드
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 md:mt-0 max-w-md">
          복잡한 의료 제도와 요양 비용, 한방 건강관리 팁을 알기 쉽게 정리해 드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {articles.map((art, idx) => {
          const Icon = art.icon;
          return (
            <div
              key={idx}
              className={`rounded-2xl bg-gradient-to-b ${art.gradient} p-6 border ${art.border} backdrop-blur-md flex flex-col justify-between hover:border-emerald-500/60 transition duration-300 hover:-translate-y-1 shadow-lg shadow-black/40 group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 px-2.5 py-1 rounded-md border border-emerald-500/30">
                    {art.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Icon className="w-3.5 h-3.5" /> 읽는 시간 {art.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug mb-3">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {art.summary}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {art.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] bg-slate-900/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-300 group-hover:text-emerald-400 transition-colors font-medium">
                  <span>아티클 자세히 보기</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
