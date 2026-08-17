"use client";

import { useState } from "react";
import LegalModal from "./LegalModal";

export default function Footer() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"terms" | "privacy" | null>(null);

    const openModal = (type: "terms" | "privacy") => {
        setModalType(type);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalType(null);
    };

    const TermsContent = (
        <div className="space-y-4">
            <h4 className="font-bold text-white text-base">제 1 조 (목적)</h4>
            <p>이 약관은 칼라무스 케어(Calamus Care / 유진에이아이, 이하 "회사")가 제공하는 메디컬 & 케어 인포메이션 포털 및 관련 제반 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>

            <h4 className="font-bold text-white text-base">제 2 조 (서비스의 내용 및 면책)</h4>
            <p>회사는 다음과 같은 서비스를 제공합니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>건강보험심사평가원(HIRA) 공공데이터 기반 전국 한방병원, 한의원, 요양병원, 호스피스 정보 제공</li>
                <li>환자 및 보호자를 위한 케어 가이드 아티클 제공</li>
                <li>마음 쉼터를 위한 사주·타로·힐링 콘텐츠 제공</li>
            </ul>
            <p className="mt-2 text-emerald-400/90 text-xs">※ 본 포털의 의료기관 정보는 공공데이터를 기반으로 하며, 실제 진료 일정 및 병상 현황은 해당 기관으로 직접 문의하시기 바랍니다. 포털의 정보는 참고용이며 전문적인 의학적 진단을 대신할 수 없습니다.</p>

            <h4 className="font-bold text-white text-base">제 3 조 (책임 제한)</h4>
            <p>회사는 천재지변 또는 불가항력으로 인한 서비스 중단 및 이용자의 귀책사유로 인한 장애에 대하여 책임을 지지 않습니다.</p>
        </div>
    );

    const PrivacyContent = (
        <div className="space-y-4">
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg text-emerald-200">
                <strong>핵심 요약:</strong> Calamus Care 포털은 별도의 회원가입 없이 누구나 자유롭게 이용 가능하며, 사용자의 개인 식별 정보를 서버에 저장하지 않습니다.
            </div>

            <h4 className="font-bold text-white text-base">1. 수집하는 개인정보 항목</h4>
            <p>본 서비스는 회원가입 없이 열람 가능한 서비스로 성명, 연락처 등 일체의 개인정보를 수집하거나 보관하지 않습니다.</p>

            <h4 className="font-bold text-white text-base">2. 쿠키(Cookie) 및 광고 식별자</h4>
            <p>서비스 품질 향상 및 Google AdSense 광고 최적화를 위해 통계적 쿠키 데이터가 수집될 수 있습니다.</p>

            <h4 className="font-bold text-white text-base">3. 관리자 및 고객 문의</h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>담당자: 정창우</li>
                <li>이메일: yujinit2005@gmail.com (문의 전용)</li>
            </ul>
        </div>
    );

    return (
        <>
            <footer className="w-full bg-[#050811] border-t border-slate-800 text-slate-400 py-12 mt-12 text-left">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    {/* Company Info */}
                    <div className="space-y-2 text-xs leading-relaxed">
                        <div className="flex items-center gap-2">
                            <span className="font-black text-emerald-400 text-base">Calamus Care</span>
                            <span className="text-slate-500">|</span>
                            <span className="font-bold text-slate-300">유진에이아이 (YujinAI)</span>
                        </div>
                        <p className="text-slate-400">대표자: 정창우 | 사업자등록번호: 519-77-00622</p>
                        <p className="text-slate-400">주소: 경기도 용인시 기흥구 동백8로 87 | 이메일: yujinit2005@gmail.com</p>
                        <p className="text-[11px] text-slate-500">
                            공공데이터 제공: 건강보험심사평가원(HIRA) / 보건복지부
                        </p>
                        <p className="mt-2 text-slate-500">Copyright © 2026 Calamus Care (YujinAI). All rights reserved.</p>
                    </div>

                    {/* Legal Links */}
                    <div className="flex gap-6 text-xs font-semibold text-slate-400">
                        <button
                            onClick={() => openModal("terms")}
                            className="hover:text-emerald-400 transition-colors"
                        >
                            이용약관
                        </button>
                        <button
                            onClick={() => openModal("privacy")}
                            className="hover:text-emerald-400 transition-colors"
                        >
                            개인정보처리방침
                        </button>
                    </div>
                </div>
            </footer>

            <LegalModal
                isOpen={modalOpen}
                onClose={closeModal}
                title={modalType === "terms" ? "이용약관" : "개인정보처리방침"}
                content={modalType === "terms" ? TermsContent : PrivacyContent}
            />
        </>
    );
}
