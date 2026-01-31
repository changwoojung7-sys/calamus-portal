"use client";

import { useState } from "react";
import { Search, Sparkles, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dreamsData from "@/data/dreams.json";
import GoogleAd from "@/components/ads/GoogleAd";

export default function DreamClient() {
    const [mode, setMode] = useState<"SEARCH" | "AI">("SEARCH");
    const [query, setQuery] = useState("");
    const [aiInput, setAiInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null); // Can be local object or AI string
    const [error, setError] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const lower = query.toLowerCase();
        const found = dreamsData.find(
            (d) => d.keyword.toLowerCase().includes(lower)
        );

        if (found) {
            setResult({ type: "LOCAL", data: found });
            setError("");
        } else {
            setResult(null);
            setError("아직 등록되지 않은 꿈입니다. 'AI 심층 해몽'을 이용해보세요.");
        }
    };

    const handleAiAnalyze = async () => {
        if (!aiInput.trim()) return;
        setIsLoading(true);
        setResult(null);
        setError("");

        try {
            // Parallel execution: API Call + Min Wait (3s)
            const [res] = await Promise.all([
                fetch("/api/dream", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ dream: aiInput }),
                }),
                new Promise(resolve => setTimeout(resolve, 3000))
            ]);

            const data = await res.json();
            if (data.result) {
                setResult({ type: "AI", data: data.result });
            } else {
                setError(data.error || "분석에 실패했습니다.");
            }
        } catch (err) {
            setError("서버 연결에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10 z-10">
            {/* Hero Section */}
            <div className="text-center space-y-4 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                    당신의 꿈이 전하는 메시지
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    수천 년간 이어져 온 꿈의 해석, 그 신비로운 의미를 찾아보세요.
                    <br />
                    단어 검색으로 빠르게 찾거나, AI에게 자세히 물어볼 수 있습니다.
                </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex p-1 bg-slate-800/50 backdrop-blur-md rounded-full border border-slate-700">
                <button
                    onClick={() => { setMode("SEARCH"); setResult(null); setError(""); }}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${mode === "SEARCH" ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40" : "text-slate-400 hover:text-white"}`}
                >
                    <BookOpen className="w-4 h-4" /> 꿈 사전 검색
                </button>
                <button
                    onClick={() => { setMode("AI"); setResult(null); setError(""); }}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${mode === "AI" ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40" : "text-slate-400 hover:text-white"}`}
                >
                    <Sparkles className="w-4 h-4" /> AI 심층 해몽
                </button>
            </div>

            {/* Search Mode UI */}
            {mode === "SEARCH" && (
                <form onSubmit={handleSearch} className="w-full max-w-xl relative group animate-fade-in">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="꿈 키워드를 입력하세요 (예: 뱀, 비행, 물)"
                        className="w-full bg-slate-900/60 border border-slate-700 rounded-full py-4 pl-12 pr-6 text-white text-lg placeholder:text-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none shadow-xl"
                    />
                </form>
            )}

            {/* AI Mode UI */}
            {!isLoading && mode === "AI" && (
                <div className="w-full max-w-2xl space-y-4 animate-fade-in">
                    <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 shadow-xl relative group focus-within:border-purple-500 transition-colors">
                        <textarea
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            placeholder="어떤 꿈을 꾸셨나요? 상황, 감정, 사물 등을 자세히 적어주세요.&#13;&#10;(예: 깊은 숲속을 걷는데 커다란 황금색 사슴을 만났어요...)"
                            className="w-full h-40 bg-transparent text-white resize-none outline-none placeholder:text-slate-600 leading-relaxed custom-scrollbar"
                        />
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={handleAiAnalyze}
                                disabled={isLoading || !aiInput.trim()}
                                className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                해몽하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading View with Ad */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-10 animate-fade-in text-center">
                    <div className="relative w-20 h-20 mb-6">
                        <div className="absolute inset-0 border-4 border-purple-900/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <Sparkles className="absolute inset-0 m-auto text-purple-400 w-8 h-8 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">꿈속의 메시지를 해석하고 있습니다...</h3>
                    <p className="text-slate-400 text-sm mb-8">무의식의 조각들을 연결하여 의미를 찾고 있습니다.</p>

                    {/* Loading Ad */}
                    <div className="w-full max-w-[320px] h-[250px] bg-slate-900 flex items-center justify-center rounded-xl overflow-hidden border border-purple-900/50 shadow-lg">
                        <GoogleAd slot="3529245457" format="rectangle" responsive={false} style={{ display: 'block', width: '300px', height: '250px' }} />
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="text-red-400 bg-red-900/20 px-6 py-3 rounded-xl border border-red-900/50 animate-fade-in">
                    {error}
                </div>
            )}

            {/* Result Display */}
            {result && (
                <div className="w-full max-w-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl animate-fade-in-up md:p-10">

                    {/* Local Dictionary Result */}
                    {result.type === "LOCAL" && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs border border-purple-500/30">
                                    사전 검색 결과
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
                                {result.data.keyword}
                            </h2>
                            <div className="p-4 bg-purple-900/20 border-l-4 border-purple-500 rounded-r-lg">
                                <p className="text-xl font-semibold text-purple-100 leading-relaxed">{result.data.description}</p>
                            </div>
                        </div>
                    )}

                    {/* AI Result */}
                    {result.type === "AI" && (
                        <div className="prose prose-invert prose-lg max-w-none text-slate-100
              leading-loose
              prose-headings:text-purple-300 prose-headings:font-bold
              prose-p:text-slate-100 prose-p:leading-loose
              prose-strong:text-purple-400
              prose-li:text-slate-100
              prose-blockquote:border-purple-500 prose-blockquote:bg-slate-800/50 prose-blockquote:text-slate-200">
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                                <span className="text-slate-400 text-sm">AI Dream Analysis</span>
                            </div>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {result.data}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
