import React from 'react';
import { Building2, ShieldCheck, HeartHandshake, BookOpen, Stethoscope, Building } from 'lucide-react';

interface QuickCategoryCardsProps {
  onSelectCategory: (code: string) => void;
}

export const QuickCategoryCards: React.FC<QuickCategoryCardsProps> = ({ onSelectCategory }) => {
  const cards = [
    {
      title: '상급·종합병원',
      desc: '전국 대학병원 및 대형 종합의료기관',
      code: 'general',
      icon: Building,
      badge: '3차·종합',
      color: 'from-cyan-500/20 to-blue-950/40',
      borderColor: 'border-cyan-500/30 hover:border-cyan-400',
      iconColor: 'text-cyan-400',
    },
    {
      title: '한방병원 / 한의원',
      desc: '전국의 전문의 수 & 양한방 협진',
      code: 'oriental',
      icon: Building2,
      badge: '한방 전문의',
      color: 'from-amber-500/20 to-amber-950/40',
      borderColor: 'border-amber-500/30 hover:border-amber-400',
      iconColor: 'text-amber-400',
    },
    {
      title: '요양병원 / 요양원',
      desc: '전문 요양 재활 & 간호간병 케어',
      code: '28',
      icon: ShieldCheck,
      badge: '실버케어',
      color: 'from-indigo-500/20 to-indigo-950/40',
      borderColor: 'border-indigo-500/30 hover:border-indigo-400',
      iconColor: 'text-indigo-400',
    },
    {
      title: '호스피스 완화의료',
      desc: '입원형·가정형 전문 완화돌봄',
      code: 'hospice',
      icon: HeartHandshake,
      badge: '복지부 지정',
      color: 'from-purple-500/20 to-purple-950/40',
      borderColor: 'border-purple-500/30 hover:border-purple-400',
      iconColor: 'text-purple-400',
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
              onSelectCategory(item.code);
              document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`cursor-pointer rounded-3xl bg-gradient-to-b ${item.color} p-5 border ${item.borderColor} backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-black/40 group`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-2xl bg-slate-900/60 border border-white/10 ${item.iconColor}`}>
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
