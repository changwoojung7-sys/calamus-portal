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
      color: 'bg-slate-900/90 hover:bg-slate-850',
      borderColor: 'border-cyan-500/30 hover:border-cyan-400',
      iconBg: 'bg-cyan-950 text-cyan-400 border border-cyan-500/30',
      badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
      titleColor: 'text-white group-hover:text-cyan-300',
    },
    {
      title: '한방병원 / 한의원',
      desc: '전국의 전문의 수 & 양한방 협진',
      code: 'oriental',
      icon: Building2,
      badge: '한방 전문의',
      color: 'bg-slate-900/90 hover:bg-slate-850',
      borderColor: 'border-amber-500/30 hover:border-amber-400',
      iconBg: 'bg-amber-950 text-amber-400 border border-amber-500/30',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
      titleColor: 'text-white group-hover:text-amber-300',
    },
    {
      title: '요양병원 / 요양원',
      desc: '전문 요양 재활 & 간호간병 케어',
      code: '28',
      icon: ShieldCheck,
      badge: '실버케어',
      color: 'bg-slate-900/90 hover:bg-slate-850',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400',
      iconBg: 'bg-emerald-950 text-emerald-400 border border-emerald-500/30',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
      titleColor: 'text-white group-hover:text-emerald-300',
    },
    {
      title: '호스피스 완화의료',
      desc: '입원형·가정형 전문 완화돌봄',
      code: 'hospice',
      icon: HeartHandshake,
      badge: '복지부 지정',
      color: 'bg-slate-900/90 hover:bg-slate-850',
      borderColor: 'border-purple-500/30 hover:border-purple-400',
      iconBg: 'bg-purple-950 text-purple-400 border border-purple-500/30',
      badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
      titleColor: 'text-white group-hover:text-purple-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
      {cards.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            onClick={() => onSelectCategory(item.code)}
            className={`cursor-pointer rounded-3xl ${item.color} p-5 border ${item.borderColor} backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-950/50 shadow-md group`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-2xl ${item.iconBg}`}>
                <Icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                {item.badge}
              </span>
            </div>
            <h3 className={`text-lg font-bold ${item.titleColor} transition-colors`}>
              {item.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
          </div>
        );
      })}
    </div>
  );
};
