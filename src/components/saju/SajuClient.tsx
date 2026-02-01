"use client";

import { useState, useEffect } from "react";
import { Solar, Lunar } from "lunar-javascript";
import { Sparkles, Calendar, User, Clock, MessageCircle, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import GoogleAd from "@/components/ads/GoogleAd";
import HanjaModal from "@/components/shared/HanjaModal";

export default function SajuClient() {
    const [step, setStep] = useState<"INPUT" | "LOADING" | "RESULT">("INPUT");

    // Form State
    const [name, setName] = useState("");
    const [nameHanja, setNameHanja] = useState("");
    const [gender, setGender] = useState("남자");
    const [dateType, setDateType] = useState("양력");
    const [birthDate, setBirthDate] = useState("");
    const [birthTime, setBirthTime] = useState("");
    const [followup, setFollowup] = useState("");

    // Result State
    const [result, setResult] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !birthDate) {
            alert("이름과 생년월일은 필수입니다.");
            return;
        }

        setStep("LOADING");

        // Convert Lunar to Solar if needed
        let finalDate = birthDate;
        if (dateType === "음력" && birthDate.length === 10) {
            try {
                const [y, m, d] = birthDate.split("-").map(Number);
                const lunar = Lunar.fromYmd(y, m, d);
                const solar = lunar.getSolar();
                finalDate = `${solar.getYear()}-${String(solar.getMonth()).padStart(2, "0")}-${String(solar.getDay()).padStart(2, "0")}`;
                console.log(`Converted Lunar ${birthDate} -> Solar ${finalDate}`);
            } catch (err) {
                console.error("Date conversion failed", err);
            }
        }

        try {
            // Parallel execution: API Call + Min Wait (3s) for Ad
            const [res] = await Promise.all([
                fetch("/api/saju", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name,
                        name_hanja: nameHanja,
                        gender,
                        date_type: dateType,
                        birthdate: finalDate,
                        birthtime: birthTime,
                        followup
                    })
                }),
                new Promise(resolve => setTimeout(resolve, 3000))
            ]);

            const data = await res.json();
            if (data.result) {
                setResult(data.result);
                setStep("RESULT");
            } else {
                alert("분석에 실패했습니다: " + (data.error || "Unknown"));
                setStep("INPUT");
            }

        } catch (e) {
            console.error(e);
            alert("서버 오류가 발생했습니다.");
            setStep("INPUT");
        }
    };

    // Hanja Modal State
    const [isHanjaModalOpen, setIsHanjaModalOpen] = useState(false);

    const openHanjaModal = () => {
        if (!name) {
            alert("이름을 먼저 입력해주세요.");
            return;
        }
        setIsHanjaModalOpen(true);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">

            {/* Header */}
            <header className="text-center mb-10 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/30 border border-amber-700/50 text-amber-400 text-xs mb-4">
                    <Sparkles className="w-3 h-3" />
                    <span>정통 명리학 AI 분석</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4 drop-shadow-md font-serif">
                    신비로운 사주 해석
                </h1>
                <p className="text-amber-200/60">
                    생년월일과 이름에 담긴&nbsp;<br className="md:hidden" />운명의 흐름을 읽어드립니다.
                </p>
            </header>

            {/* Input Form */}
            {step === "INPUT" && (
                <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-amber-900/30 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-md animate-fade-in space-y-8">

                    {/* Section 1: Name & Gender */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-amber-200 flex items-center gap-2 border-b border-amber-900/30 pb-2">
                            <User className="w-5 h-5 text-amber-500" /> 기본 정보
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-400 text-sm mb-2">이름 (필수)</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="홍길동"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-amber-100 focus:border-amber-500 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm mb-2">이름 한자 (선택)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={nameHanja}
                                        onChange={e => setNameHanja(e.target.value)}
                                        placeholder="홍길동 (클릭하여 변환)"
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-amber-100 focus:border-amber-500 outline-none transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={openHanjaModal}
                                        className="shrink-0 bg-amber-800/50 hover:bg-amber-700/50 text-amber-200 px-4 rounded-xl border border-amber-700/50 transition-colors text-sm font-bold"
                                    >
                                        한자<br />찾기
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm mb-2">성별</label>
                            <div className="flex gap-4">
                                {["남자", "여자"].map(g => (
                                    <label key={g} className={`flex-1 cursor-pointer border rounded-xl p-3 text-center transition-all ${gender === g ? "bg-amber-900/40 border-amber-500 text-amber-100" : "bg-slate-800/30 border-slate-700 text-slate-400"}`}>
                                        <input type="radio" name="gender" value={g} checked={gender === g} onChange={() => setGender(g)} className="hidden" />
                                        {g}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Birth Date */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-amber-200 flex items-center gap-2 border-b border-amber-900/30 pb-2">
                            <Calendar className="w-5 h-5 text-amber-500" /> 생년월일시
                        </h2>

                        <div>
                            <label className="block text-slate-400 text-sm mb-2">양력/음력</label>
                            <div className="flex gap-4 mb-4">
                                {["양력", "음력"].map(t => (
                                    <label key={t} className={`flex-1 cursor-pointer border rounded-xl p-3 text-center transition-all ${dateType === t ? "bg-amber-900/40 border-amber-500 text-amber-100" : "bg-slate-800/30 border-slate-700 text-slate-400"}`}>
                                        <input type="radio" name="dtype" value={t} checked={dateType === t} onChange={() => setDateType(t)} className="hidden" />
                                        {t}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-400 text-sm mb-2">생년월일 (YYYY-MM-DD)</label>
                                <input
                                    type="text"
                                    required
                                    value={birthDate}
                                    onChange={e => {
                                        let v = e.target.value.replace(/[^0-9]/g, "");
                                        if (v.length > 4) v = v.slice(0, 4) + "-" + v.slice(4);
                                        if (v.length > 7) v = v.slice(0, 7) + "-" + v.slice(7);
                                        if (v.length > 10) v = v.slice(0, 10);
                                        setBirthDate(v);
                                    }}
                                    placeholder="1990-01-01"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-amber-100 focus:border-amber-500 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">태어난 시간 (선택)</label>
                                <select
                                    value={birthTime}
                                    onChange={e => setBirthTime(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-amber-100 focus:border-amber-500 outline-none transition-colors appearance-none"
                                >
                                    <option value="">모름 / 시간 미상</option>
                                    {[...Array(24)].map((_, i) => (
                                        <option key={i} value={`${String(i).padStart(2, '0')}:00`}>{i}시</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Followup */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-amber-200 flex items-center gap-2 border-b border-amber-900/30 pb-2">
                            <MessageCircle className="w-5 h-5 text-amber-500" /> 추가 고민 (선택)
                        </h2>
                        <textarea
                            value={followup}
                            onChange={e => setFollowup(e.target.value)}
                            placeholder="예: 내년 이직운과 재물 흐름이 특히 궁금합니다."
                            rows={3}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-amber-100 focus:border-amber-500 outline-none transition-colors resize-none"
                        />
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> 구체적인 질문을 남기면 더 상세한 답변을 받을 수 있습니다.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-900/40 transition-all flex items-center justify-center gap-2 text-lg"
                    >
                        <Sparkles className="w-5 h-5" /> 사주 분석 시작하기
                    </button>

                </form>
            )}

            {/* Loading */}
            {step === "LOADING" && (
                <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center">
                    <div className="relative w-24 h-24 mb-8">
                        <div className="absolute inset-0 border-4 border-amber-900/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        <Sparkles className="absolute inset-0 m-auto text-amber-400 w-8 h-8 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-amber-100 mb-2">운명의 흐름을 읽고 있습니다...</h3>
                    <p className="text-amber-200/60 mb-8">AI가 사주, 기문, 성명학을 종합 분석 중입니다.<br />잠시만 기다려주세요.</p>

                    {/* Loading Ad */}
                    <div className="w-full max-w-[320px] h-[250px] bg-slate-900 flex items-center justify-center rounded-xl overflow-hidden border border-amber-900/50 shadow-lg">
                        <GoogleAd slot="3529245457" format="rectangle" responsive={false} style={{ display: 'block', width: '300px', height: '250px' }} />
                    </div>
                </div>
            )}

            {/* Result */}
            {step === "RESULT" && (
                <div className="bg-slate-900/80 border border-amber-900/30 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md animate-fade-in-up">
                    <div className="flex justify-between items-center mb-8 border-b border-amber-900/50 pb-6">
                        <h2 className="text-2xl font-bold text-amber-100 flex items-center gap-2">
                            <Sparkles className="text-amber-500" /> 분석 결과
                        </h2>
                        <button
                            onClick={() => setStep("INPUT")}
                            className="text-slate-400 hover:text-white text-sm"
                        >
                            다시 하기
                        </button>
                    </div>

                    <div className="prose prose-invert max-w-none 
                        prose-headings:text-amber-200 prose-headings:font-serif
                        prose-p:text-slate-300 prose-p:leading-loose
                        prose-strong:text-amber-400
                        prose-li:text-slate-300
                        ">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                    </div>

                    <div className="mt-12 pt-8 border-t border-amber-900/30 text-center">
                        <p className="text-slate-500 text-sm mb-6">
                            이 결과는 AI 분석에 기반하므로, 중요한 결정의 절대적인 기준이 되어서는 안 됩니다.
                        </p>
                        <button
                            onClick={() => setStep("INPUT")}
                            className="bg-slate-800 hover:bg-slate-700 text-amber-100 px-8 py-3 rounded-full transition-colors border border-amber-900/50"
                        >
                            다른 사주 보기
                        </button>
                    </div>
                </div>
            )}

            {/* Hanja Modal */}
            {isHanjaModalOpen && (
                <HanjaModal
                    name={name}
                    initialHanja={nameHanja}
                    onClose={() => setIsHanjaModalOpen(false)}
                    onComplete={(selectedHanja) => {
                        setNameHanja(selectedHanja);
                        setIsHanjaModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}
