"use client";

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { InputForm, UserData } from './InputForm';
import { ResultView } from './ResultView';

export default function NameClient() {
    const [step, setStep] = useState<'input' | 'result'>('input');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');

    const handleSubmit = async (data: UserData) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/name', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();

            if (json.result) {
                setResult(json.result);
                setStep('result');
            } else {
                alert("분석 오류: " + (json.error || "알 수 없는 오류"));
            }
        } catch (error) {
            console.error(error);
            alert("서버 연결 실패");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setResult('');
        setStep('input');
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto z-10">
            <header className="flex flex-col items-center mb-12 text-center animate-fade-in-up">
                <div className="p-3 bg-amber-500/10 rounded-2xl mb-4 border border-amber-500/20">
                    <Sparkles className="text-amber-400 w-10 h-10" />
                </div>
                <h1 className="text-4xl font-serif text-white tracking-wide mb-2">성명학 AI 상담소</h1>
                <p className="text-slate-400">당신의 이름에 숨겨진 운명을 읽어드립니다</p>
            </header>

            <main className="w-full">
                {step === 'input' ? (
                    <div className="w-full animate-fade-in">
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-medium text-amber-500 mb-2">운명 정보 입력</h2>
                            <p className="text-slate-500 text-sm">정확한 분석을 위해 상세한 정보를 입력해주세요.</p>
                        </div>
                        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
                    </div>
                ) : (
                    <ResultView result={result} onReset={handleReset} />
                )}
            </main>
        </div>
    );
}
