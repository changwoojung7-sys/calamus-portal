"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

interface ResultViewProps {
    result: string;
    onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-3xl mx-auto space-y-8 bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700/50 shadow-2xl"
        >
            <div className="card prose prose-invert max-w-none text-slate-100
                prose-headings:text-amber-300 prose-headings:font-bold
                prose-p:text-slate-100 prose-p:leading-loose
                prose-strong:text-amber-400
                prose-li:text-slate-100 prose-li:leading-loose
                prose-blockquote:border-l-amber-500 prose-blockquote:bg-slate-800/50 prose-blockquote:text-slate-200">
                <ReactMarkdown>{result}</ReactMarkdown>
            </div>

            <div className="text-center pt-8 border-t border-slate-800">
                <button
                    onClick={onReset}
                    className="px-8 py-3 border border-amber-500 text-amber-500 rounded-full hover:bg-amber-500 hover:text-slate-900 transition-colors font-medium"
                >
                    다른 이름 풀이하기
                </button>
            </div>
        </motion.div>
    );
};
