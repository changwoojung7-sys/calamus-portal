import React from 'react';
import { Building2, ShieldCheck, HeartHandshake, BookOpen } from 'lucide-react';

interface QuickCategoryCardsProps {
  onSelectCategory: (code: string) => void;
}

export const QuickCategoryCards: React.FC<QuickCategoryCardsProps> = ({ onSelectCategory }) => {
  const cards = [
    {
      title: '한방병원 / 한의원',
      desc: '전국의 전문의 수 & 입원실 현황',
      code: '28',
      icon: Building2,
      badge: '양한방 협진',
      color: 'from-amber-500/20 to-amber-900/40',
      borderColor: 'border-amber-500/30 hover:border-amber-400',
      iconColor: 'text-amber-400',
    },
    {
      title: '1등급 요양병원',
      desc: '심평원 적정성 평가 최우수 기관',
      code: '21',
      icon: ShieldCheck,
      badge: '평가 1등급',
      color: 'from-blue-500/20 to-blue-900/40',
      borderColor: 'border-blue-500/30 hover:border-blue-400',
      iconColor: 'text-blue-400',
    },
    {
      title: '호스피스 완화의료',
      desc: '입원형·가정형 전문 완화돌봄',
      code: 'hospice',
      icon: HeartHandshake,
      badge: '복지부 지정',
      color: 'from-purple-500/20 to-purple-900/40',
      borderColor: 'border-purple-500/30 hover:border-purple-400',
      iconColor: 'text-purple-400',
    },
    {
      title: '케어 매거진 & 가이드',
      desc: '요양병원 vs 요양원 비용 비교',
      code: 'guide',
      icon: BookOpen,
      badge: '보호자 필독',
      color: 'from-emerald-500/20 to-emerald-900/40',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
      {cards.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            onClick={() => {
              if (item.code === 'guide') {
                document.getElementById('magazine')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                onSelectCategory(item.code);
                document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`cursor-pointer rounded-2xl bg-gradient-to-b ${item.color} p-5 border ${item.borderColor} backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-black/40 group`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl bg-slate-900/60 border border-white/10 ${item.iconColor}`}>
                <Icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/10">
                {item.badge}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              {item.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
          </div>
        );
      })}
    </div>
  );
};
