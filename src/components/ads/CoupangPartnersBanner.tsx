"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Star,
  Flame,
  ShoppingBag
} from "lucide-react";
import {
  COUPANG_PRODUCTS,
  COUPANG_PARTNERS_DISCLOSURE,
  CoupangProduct
} from "@/data/coupangProducts";

interface CoupangPartnersBannerProps {
  initialCategory?: "all" | "health" | "vitality" | "safety" | "smart";
  className?: string;
}

export default function CoupangPartnersBanner({
  initialCategory = "all",
  className = ""
}: CoupangPartnersBannerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 카테고리 필터링된 상품 목록
  const filteredProducts =
    selectedCategory === "all"
      ? COUPANG_PRODUCTS
      : COUPANG_PRODUCTS.filter((p) => p.category === selectedCategory);

  // 좌우 스크롤 핸들러
  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // 마우스 휠 가로 스크롤 지원
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      // Shift 키 없이 세로 휠을 굴려도 자연스럽게 가로 스크롤되도록 보조
      if (e.deltaY !== 0) {
        scrollContainerRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  const categories = [
    { id: "all", label: "전체 핫딜" },
    { id: "health", label: "🌿 부모님 건강" },
    { id: "vitality", label: "💪 일상활력" },
    { id: "safety", label: "🛡️ 안심/낙상" },
    { id: "smart", label: "💜 스마트케어" }
  ];

  return (
    <section
      className={`w-full bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-sm relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* 상단 뱃지 & 카테고리 탭 & 좌우 화살표 */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-100 text-xs">
        {/* 좌측 타이틀 */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">
            <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            온안부 x 쿠팡 효도선물 핫딜
          </span>
          <span className="hidden md:inline-block text-[11px] text-slate-400 font-medium">
            (가로 스크롤로 전체 상품 탐색)
          </span>
        </div>

        {/* 우측 카테고리 탭 & 스크롤 버튼 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 좌우 스크롤 네비게이션 버튼 */}
          <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-slate-200">
            <button
              onClick={() => handleScroll("left")}
              className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
              aria-label="왼쪽으로 스크롤"
              title="이전 상품 보기"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
              aria-label="오른쪽으로 스크롤"
              title="다음 상품 보기"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 가로 스크롤 상품 리스트 영역 */}
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="pt-3 pb-1 flex gap-3 overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300 select-none cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "thin" }}
      >
        {filteredProducts.map((prod) => (
          <a
            key={prod.id}
            href={prod.coupangUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex-shrink-0 w-[240px] sm:w-[260px] bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-rose-300 rounded-xl p-2.5 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              {/* 이미지 및 뱃지 */}
              <div className="relative w-full h-32 rounded-lg overflow-hidden bg-white border border-slate-200/70 mb-2">
                <Image
                  src={prod.imageUrl}
                  alt={prod.title}
                  fill
                  sizes="260px"
                  className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                  {prod.badge}
                </span>
                <span className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-xs text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-200/60 flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  {prod.rating}
                </span>
              </div>

              {/* 카테고리 및 제목 */}
              <div className="text-[10px] font-bold text-slate-500 mb-0.5">
                {prod.categoryLabel}
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2 leading-snug h-[32px]">
                {prod.title}
              </h4>
            </div>

            {/* 가격 & 구매 바로가기 */}
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-black text-rose-600">
                    {prod.discount}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {prod.price}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 line-through">
                  {prod.originalPrice}
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 group-hover:bg-rose-700 text-white text-[11px] font-bold shadow-2xs transition-colors shrink-0">
                <span>구매</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* 하단 공정위 필수 표기 문구 */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span>{COUPANG_PARTNERS_DISCLOSURE}</span>
        <span className="font-mono text-slate-400 hidden sm:inline-block">
          Partners ID: AF6388517 · {filteredProducts.length}개 상품 진열 중
        </span>
      </div>
    </section>
  );
}
