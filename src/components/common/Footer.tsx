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
            <p>이 약관은 유진에이아이(이하 "회사")가 제공하는 칼라머스 포털 및 관련 제반 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>

            <h4 className="font-bold text-white text-base">제 2 조 (서비스의 제공)</h4>
            <p>회사는 다음과 같은 서비스를 제공합니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>AI 기반 운세, 타로, 꿈해몽 분석 정보 제공</li>
                <li>간단한 게임 및 유틸리티 도구 제공</li>
                <li>기타 회사가 정하는 서비스</li>
            </ul>
            <p className="mt-2 text-amber-400/90 text-xs">※ 본 서비스가 제공하는 운세 및 분석 결과는 AI에 기반한 것으로, 과학적 근거가 없으며 재미와 참고용으로만 이용하시기 바랍니다. 결과에 대한 맹신으로 발생한 문제에 대해 회사는 책임지지 않습니다.</p>

            <h4 className="font-bold text-white text-base">제 3 조 (면책 조항)</h4>
            <p>회사는 천재지변 또는 이에 준하는 불가항력으로 인해 서비스를 제공할 수 없는 경우 서비스 제공에 대한 책임이 면제됩니다. 또한 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.</p>
        </div>
    );

    const PrivacyContent = (
        <div className="space-y-4">
            <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-200">
                <strong>핵심 요약:</strong> 칼라머스 포털은 회원가입 기능이 없으며, 서버에 사용자의 개인정보(이름, 연락처 등)를 일절 저장하지 않습니다.
            </div>

            <h4 className="font-bold text-white text-base">1. 수집하는 개인정보 항목</h4>
            <p>본 서비스는 별도의 회원가입 절차가 없으므로, 이용자의 성명, 전화번호, 이메일 등의 개인정보를 수집하거나 저장하지 않습니다.</p>

            <h4 className="font-bold text-white text-base">2. 쿠키(Cookie) 및 광고 식별자</h4>
            <p>서비스 이용 과정에서 다음과 같은 정보가 자동 생성되어 수집될 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>Google AdSense 광고 게재를 위한 쿠키 및 사용 데이터</li>
                <li>서비스 이용 기록, 방문 기록 (Google Analytics 등)</li>
            </ul>
            <p>이러한 정보는 개인을 식별할 수 없는 형태로 통계적 분석 및 맞춤형 광고 제공 목적으로만 활용됩니다.</p>

            <h4 className="font-bold text-white text-base">3. 개인정보 관리 책임자</h4>
            <p>서비스 관련 문의나 불편 사항은 아래로 연락 주시기 바랍니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>담당자: 정창우</li>
                <li>이메일: yujinit2005@gmail.com (문의 전용)</li>
            </ul>
        </div>
    );

    return (
        <>
            <footer className="w-full bg-[#0f172a] border-t border-slate-800 text-slate-500 py-10 mt-12">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

                    {/* Company Info */}
                    <div className="space-y-2 text-xs leading-relaxed">
                        <h5 className="font-bold text-slate-300 text-sm mb-2">유진에이아이 (YujinAI)</h5>
                        <p>대표자: 정창우 | 사업자등록번호: 519-77-00622</p>
                        <p>주소: 경기도 용인시 기흥구 동백8로 87</p>
                        <p>이메일: yujinit2005@gmail.com</p>
                        <p className="mt-2 text-slate-600">Copyright © 2026 Calamus Portal. All rights reserved.</p>
                    </div>

                    {/* Legal Links */}
                    <div className="flex gap-6 text-xs font-medium">
                        <button
                            onClick={() => openModal("terms")}
                            className="hover:text-slate-300 transition-colors"
                        >
                            이용약관
                        </button>
                        <button
                            onClick={() => openModal("privacy")}
                            className="hover:text-slate-300 transition-colors"
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
