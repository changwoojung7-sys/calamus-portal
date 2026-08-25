"use client";

import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  X,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileText,
  AlertTriangle,
  Heart,
  Activity,
  Check,
  Info
} from 'lucide-react';

interface ArticleData {
  id: string;
  category: string;
  badgeColor: string;
  readTime: string;
  icon: any;
  title: string;
  summary: string;
  tags: string[];
  gradient: string;
  border: string;
  titleColor: string;
  publishedDate: string;
  author: string;
  sections: {
    heading: string;
    subheading?: string;
    content: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
    highlights?: string[];
    tips?: string;
  }[];
}

export const CareMagazineSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);

  const articles: ArticleData[] = [
    {
      id: 'nursing-comparison',
      category: '요양 가이드',
      badgeColor: 'text-blue-300 bg-blue-950/80 border-blue-500/40',
      readTime: '4분',
      icon: HelpCircle,
      title: '요양병원 vs 요양원, 무엇이 다를까요? 완벽 비교 가이드',
      summary: '의료진 상주 여부, 건강보험 vs 장기요양보험 혜택, 월 예상 본인부담금 차이를 한눈에 정리했습니다.',
      tags: ['요양병원', '요양원', '장기요양등급', '비용비교'],
      gradient: 'bg-slate-900/90 hover:bg-slate-850',
      border: 'border-blue-500/30 hover:border-blue-400',
      titleColor: 'text-white group-hover:text-cyan-300',
      publishedDate: '2026.06월 최신 개정',
      author: 'Calamus 메디컬 케어 에디터 (보건복지부·국민건강보험공단 기준)',
      sections: [
        {
          heading: '1. 요양병원 vs 요양원 핵심 차이점 한눈에 비교',
          subheading: '의료 처치가 우선인가, 일상 돌봄이 우선인가에 따라 결정됩니다.',
          content: [
            '부모님의 연세가 많아지시거나 뇌졸중, 치매, 관절 질환 등으로 일상생활이 어려워질 때 가장 먼저 마주하는 고민이 바로 요양병원과 요양원의 차이입니다.',
            '요양병원은 ‘의료법’을 따르는 의료기관으로 의사와 간호사가 24시간 상주하며 치료와 재활을 전담합니다. 반면 요양원은 ‘노인복지법’에 따른 생활시설로 요양보호사의 24시간 생활 돌봄이 중심입니다.'
          ],
          table: {
            headers: ['비교 항목', '요양병원 (의료기관)', '요양원 (노인요양시설)'],
            rows: [
              ['운영 목적', '질환 치료 및 전문 재활치료', '일상생활 돌봄 및 신체활동 지원'],
              ['적용 보험', '국민건강보험 적용', '노인장기요양보험 적용'],
              ['입원/입소 자격', '연령 무관 (의사의 입원 소견 필요)', '장기요양 1~2등급 판정자 (3~5등급 시설급여 인정자)'],
              ['의료진 상주', '의사 및 간호사 24시간 상주', '의사 비상주 (월 2회 촉탁의 방문 진료)'],
              ['간병비 부담', '간병비 전액 본인부담 (비급여)', '장기요양보험 급여 포함 (본인부담금 15~20%)'],
              ['월 예상 총비용', '약 100만~250만원 (간병 형태별 상이)', '약 70만~120만원 (식대 등 비급여 포함)']
            ]
          }
        },
        {
          heading: '2. 우리 부모님에게 맞는 곳은? 선택 자가진단 체크리스트',
          content: [
            '아래 체크리스트를 통해 부모님의 현재 건강 상태에 가장 적합한 시설 형태를 판단해보세요.'
          ],
          highlights: [
            '요양병원 권장: 수술 후 집중 재활, 욕창 치료, 콧줄(L-tube)·소변줄·인공신장기 투석 등 지속적인 의료적 처치와 처방이 필요한 경우',
            '요양원 권장: 거동이 불편하지만 급성기 질환이 없으며, 식사·목욕·배변 등 일상생활 보조가 주로 필요한 장기요양등급 인정 어르신',
            '선택 기준: 환자 스스로 의사표현이 가능하고 의학적 처치가 정기적으로 필요하다면 요양병원이 안전하며, 정서적 안정과 일상 케어가 목적이라면 요양원이 경제적입니다.'
          ]
        },
        {
          heading: '3. 건강보험 혜택과 본인부담상한제 활용 팁',
          content: [
            '요양병원은 건강보험의 ‘본인부담상한제’가 적용됩니다. 1년 동안 지출한 급여 항목 본인부담금이 개인별 소득 분위 상한액을 초과할 경우 초과 금액을 국민건강보험공단에서 전액 환급해 드립니다.',
            '단, 요양병원의 간병비 및 상급병실료, 식대 가산 등은 비급여 항목으로 본인부담상한제 대상에서 제외되므로 입원 전 반드시 병원 원무과와 세부 견적을 상담해야 합니다.'
          ],
          tips: '💡 팁: 요양원 입소를 준비 중이시라면 국민건강보험공단(1577-1000) 또는 노인장기요양보험 홈페이지(longtermcare.or.kr)에서 장기요양인정신청을 먼저 진행하세요. 신청부터 등급 판정까지 약 3~4주가 소요됩니다.'
        }
      ]
    },
    {
      id: 'sasang-diet',
      category: '한방 케어',
      badgeColor: 'text-amber-300 bg-amber-950/80 border-amber-500/40',
      readTime: '3분',
      icon: ShieldCheck,
      title: '체질별 맞춤 한방 건강관리와 약선(藥膳) 요법',
      summary: '사상체질(태양·태음·소양·소음)에 따른 계절별 보약 및 식이요법으로 면역력을 높이는 실전 팁을 소개합니다.',
      tags: ['한방의학', '사상체질', '약선요법', '면역관리'],
      gradient: 'bg-slate-900/90 hover:bg-slate-850',
      border: 'border-amber-500/30 hover:border-amber-400',
      titleColor: 'text-white group-hover:text-amber-300',
      publishedDate: '2026.06월 최신 개정',
      author: 'Calamus 한방 웰니스 자문단 (대한한의학회 사상의학 기준)',
      sections: [
        {
          heading: '1. 약식동원(藥食同源) : 내 몸의 체질을 알면 음식이 곧 보약',
          subheading: '이제마 선생의 사상의학은 장부의 대소(大小) 균형을 바로잡는 맞춤형 의학입니다.',
          content: [
            '“사람마다 타고난 장부의 기운이 다르므로, 남에게 좋은 음식이 나에게는 독이 될 수 있습니다.”',
            '사상의학에서는 사람의 체질을 폐(肺)와 간(肝), 비(脾)와 신(腎)의 기능적 강약에 따라 태양인, 태음인, 소양인, 소음인 4가지로 구분하며, 부족한 장부의 기운을 보완하는 약선(藥膳) 식단을 처방합니다.'
          ]
        },
        {
          heading: '2. 사상체질별 특징 및 맞춤 약선 식이요법 매트릭스',
          content: [
            '체질별 장부 특성에 맞추어 이로운 음식과 주의해야 할 음식을 엄선하여 안내합니다.'
          ],
          table: {
            headers: ['체질', '장부 특성 및 신체 특징', '이로운 약선 식재료', '주의해야 할 음식'],
            rows: [
              ['태양인 (太陽人)', '폐대간소 (상체 발달, 기운이 위로 솟구침)', '메밀, 붕어, 문어, 전복, 모과, 포도, 솔잎, 감', '기름진 육류, 자극적인 매운 음식, 고칼로리식'],
              ['태음인 (太陰人)', '간대폐소 (체격 듬직, 비만 및 호흡기 주의)', '소고기, 콩, 두부, 율무, 더덕, 도라지, 무, 밤', '닭고기, 삼계탕, 자극적인 향신료, 과식'],
              ['소양인 (少陽人)', '비대신소 (상체 열 많고 하체 허약, 급한 성격)', '돼지고기, 오리고기, 해삼, 굴, 녹두, 오이, 수박', '닭고기, 인삼, 꿀, 고추, 생강 등 열성 음식'],
              ['소음인 (少陰人)', '신대비소 (소화기 허약, 수족냉증, 꼼꼼함)', '닭고기, 찹쌀, 사과, 시금치, 생강, 계피, 인삼, 대추', '차가운 빙과류, 밀가루, 돼지고기, 날음식']
            ]
          }
        },
        {
          heading: '3. 일상에서 마시는 체질별 맞춤 한방 건강 한차(茶)',
          content: [
            '바쁜 일상 속에서 간편하게 면역력과 생체 리듬을 회복할 수 있는 체질별 약선차를 추천합니다.'
          ],
          highlights: [
            '태양인: 모과차, 오가피차 (기운을 차분히 가라앉히고 근육 피로 완화)',
            '태음인: 율무차, 맥문동차, 오미자차 (기관지 점막을 촉촉하게 하고 체내 노폐물 배출)',
            '소양인: 구기자차, 결명자차, 보리차 (가슴의 화열(火熱)을 내리고 눈과 신장 보호)',
            '소음인: 생강홍차, 인삼대추차, 계피차 (위장을 따뜻하게 데우고 소화력 증진)'
          ],
          tips: '💡 팁: 체질 진단은 단순 설문 외에도 한의사의 맥진 및 설진(혀 관찰), 체간 측정 등 종합 진료를 통해 정확히 확인하는 것이 좋습니다.'
        }
      ]
    },
    {
      id: 'hospice-guide',
      category: '호스피스 & 완화의료',
      badgeColor: 'text-purple-300 bg-purple-950/80 border-purple-500/40',
      readTime: '5분',
      icon: HeartHandshake,
      title: '보호자를 위한 호스피스 완화의료 이용 가이드 및 상담 신청',
      summary: '존엄한 삶의 마무리를 돕는 호스피스 완화의료의 입원형/가정형 지원 제도와 국가 지원 비용 안내입니다.',
      tags: ['호스피스', '완화돌봄', '가정형호스피스', '존엄케어'],
      gradient: 'bg-slate-900/90 hover:bg-slate-850',
      border: 'border-purple-500/30 hover:border-purple-400',
      titleColor: 'text-white group-hover:text-purple-300',
      publishedDate: '2026.06월 최신 개정',
      author: 'Calamus 완화돌봄 지원팀 (보건복지부·국립암센터 표준 지침)',
      sections: [
        {
          heading: '1. 호스피스·완화의료란 무엇인가요?',
          subheading: '치료를 포기하는 것이 아니라, 통증을 완화하고 인간다운 존엄을 지키는 전인적 돌봄입니다.',
          content: [
            '호스피스·완화의료는 완치를 목적으로 하는 치료가 더 이상 효과를 보기 어려운 말기 질환 환자와 그 가족을 위해, 통증과 신체적·심리적 고통을 전문적으로 조절해 주는 의료 서비스입니다.',
            '의사, 간호사, 사회복지사, 성직자, 자원봉사자로 구성된 다학제 완화의료팀이 환자가 생의 마지막 순간까지 평안하고 의미 있는 시간을 보낼 수 있도록 동행합니다.'
          ]
        },
        {
          heading: '2. 대상 질환 및 3대 서비스 제공 유형',
          content: [
            '호스피스·완화의료는 연명의료결정법에 따라 지정된 말기 환자에게 제공됩니다.'
          ],
          highlights: [
            '적용 대상 질환: 말기 암, 후천성면역결핍증(AIDS), 만성 폐쇄성 호흡기 질환, 만성 간경화, 만성 호흡부전',
            '① 입원형 호스피스: 호스피스 전문기관의 독립 병동에 입원하여 24시간 집중 통증 관리와 정서적 돌봄을 받는 형태',
            '② 가정형 호스피스: 환자가 익숙하고 편안한 자택에 머물며, 호스피스 전문 간호사와 의사가 정기적으로 방문하여 돌보는 형태',
            '③ 자문형 호스피스: 일반 병동이나 외래 진료를 이용하면서 전담 완화의료팀의 통증 조절 및 상담 자문을 병행하는 형태'
          ]
        },
        {
          heading: '3. 건강보험 적용 혜택 및 간병비 부담 대폭 경감',
          content: [
            '호스피스 완화의료는 건강보험 및 중증질환 산정특례가 적용되어 경제적 부담이 매우 적습니다.',
            '말기 암 환자의 경우 진료비 총액의 5%만 본인이 부담하며, 호스피스 전문 간호간병 통합서비스를 이용할 경우 일일 간병비가 약 2~4만 원 수준으로 일반 간병비(일 15만 원 이상) 대비 80% 이상 절감됩니다.'
          ],
          table: {
            headers: ['구분', '일반 병원 입원 시', '건강보험 호스피스 병동 이용 시'],
            rows: [
              ['진료비 본인부담', '급여 5% (비급여 항목 다수 발생)', '급여 5% (비급여 항목 최소화 및 정액 포괄수가)'],
              ['간병비', '전액 개인 부담 (일 15~18만 원)', '건강보험 간병서비스 적용 (일 약 2~4만 원)'],
              ['돌봄 서비스', '치료 중심 간호', '통증조절, 영적돌봄, 원예·미술치료, 가족사별관리']
            ]
          }
        },
        {
          heading: '4. 호스피스 신청 절차 및 필요 서류',
          content: [
            '1단계: 담당 주치의와 상의하여 호스피스 이용 의사 확인 및 진료의뢰서/의사소견서 발급',
            '2단계: 희망하는 호스피스 전문기관(전국 180여 개소) 선택 및 상담 예약',
            '3단계: 최근 검사 결과지, 의무기록사본, 영상 CD 지참 후 방문 진료 및 완화의료 이용 동의서 작성'
          ],
          tips: '💡 문의처: 중앙호스피스센터(hospice.go.kr, 국립암센터) 또는 보건복지상담센터(국번없이 129)를 통해 전국 공인 호스피스 전문기관 및 실시간 병상 현황을 안내받으실 수 있습니다.'
        }
      ]
    }
  ];

  return (
    <section id="magazine" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 text-left">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs tracking-wider uppercase mb-1">
            <BookOpen className="h-4 w-4 text-emerald-400" /> Calamus Care Magazine & Insights
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            환자와 보호자를 위한 전문 케어 가이드
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 md:mt-0 max-w-md">
          복잡한 의료 제도와 요양 비용, 한방 건강관리 팁을 알기 쉽게 정리해 드립니다.
        </p>
      </div>

      {/* 3대 아티클 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {articles.map((art) => {
          const Icon = art.icon;
          return (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className={`rounded-2xl ${art.gradient} p-6 border ${art.border} backdrop-blur-sm flex flex-col justify-between transition duration-300 hover:-translate-y-1 shadow-lg shadow-cyan-950/30 group cursor-pointer`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${art.badgeColor}`}>
                    {art.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Icon className="w-3.5 h-3.5 text-slate-400" /> 읽는 시간 {art.readTime}
                  </span>
                </div>

                <h3 className={`text-lg font-bold ${art.titleColor} transition-colors leading-snug mb-3`}>
                  {art.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {art.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {art.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedArticle(art);
                  }}
                  className="text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1 hover:text-cyan-300"
                >
                  읽기 <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 전문 케어 가이드 상세 읽기 모달 */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] bg-[#0d1527] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-left text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 상단 헤더 */}
            <div className="p-6 sm:p-7 border-b border-slate-800 bg-[#0f1a30] flex items-start justify-between gap-4 sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md border ${selectedArticle.badgeColor}`}>
                    {selectedArticle.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 읽는 시간 {selectedArticle.readTime}
                  </span>
                  <span className="text-xs text-slate-500">• {selectedArticle.publishedDate}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {selectedArticle.title}
                </h2>
                <p className="text-xs text-emerald-400 mt-1 font-medium">
                  {selectedArticle.author}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 모달 본문 콘텐츠 (스크롤 가능) */}
            <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-8 text-sm leading-relaxed text-slate-300">
              {selectedArticle.sections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-3.5">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    {sec.heading}
                  </h3>

                  {sec.subheading && (
                    <p className="text-xs sm:text-sm font-semibold text-cyan-300">
                      {sec.subheading}
                    </p>
                  )}

                  {sec.content.map((p, pIdx) => (
                    <p key={pIdx} className="text-slate-300">
                      {p}
                    </p>
                  ))}

                  {/* 비교 표 렌더링 */}
                  {sec.table && (
                    <div className="my-4 overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/90 shadow-sm">
                      <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                        <thead>
                          <tr className="bg-slate-800 text-slate-200 border-b border-slate-700">
                            {sec.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className="py-2.5 px-3 font-bold">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {sec.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-850 transition-colors">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className={`py-2.5 px-3 ${cIdx === 0 ? 'font-bold text-white' : ''}`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 핵심 하이라이트 체크포인트 */}
                  {sec.highlights && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                      {sec.highlights.map((hl, hlIdx) => (
                        <div key={hlIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 실전 팁 알림 박스 */}
                  {sec.tips && (
                    <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-2xl p-4 text-xs sm:text-sm text-emerald-200 flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{sec.tips}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 모달 하단 푸터 */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0f1a30] flex flex-wrap items-center justify-between gap-3 sticky bottom-0">
              <span className="text-xs text-slate-500">
                본 정보는 보건복지부, 국민건강보험공단, 대한한의학회의 공식 가이드라인을 바탕으로 제작되었습니다.
              </span>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
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
