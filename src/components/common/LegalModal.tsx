"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: React.ReactNode;
}

export default function LegalModal({ isOpen, onClose, title, content }: LegalModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 text-slate-700 text-sm leading-relaxed space-y-4 custom-scrollbar">
                    {content}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-sm"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
