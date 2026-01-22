"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface UserData {
    name: string;
    hanja: string;
    gender: 'male' | 'female';
    birthDate: string;
    birthTime: string;
    birthType: 'solar' | 'lunar';
    concern: string;
}

interface InputFormProps {
    onSubmit: (data: UserData) => void;
    isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<UserData>({
        name: '',
        hanja: '',
        gender: 'female',
        birthDate: '',
        birthTime: '',
        birthType: 'solar',
        concern: '',
    });

    const yearRef = useRef<HTMLInputElement>(null);
    const monthRef = useRef<HTMLInputElement>(null);
    const dayRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDatePartChange = (part: 'year' | 'month' | 'day', value: string) => {
        if (value && !/^\d*$/.test(value)) return;

        const parts = formData.birthDate ? formData.birthDate.split('-') : [];
        let y = parts[0] || '';
        let m = parts[1] || '';
        let d = parts[2] || '';

        if (part === 'year') {
            y = value.slice(0, 4);
            if (y.length === 4) monthRef.current?.focus();
        } else if (part === 'month') {
            m = value.slice(0, 2);
            if (value.length >= 2) dayRef.current?.focus();
        } else {
            d = value.slice(0, 2);
        }

        setFormData({ ...formData, birthDate: `${y}-${m}-${d}` });
    };

    const getDisplayDate = () => {
        const parts = formData.birthDate ? formData.birthDate.split('-') : [];
        return {
            year: parts[0] || '',
            month: parts[1] || '',
            day: parts[2] || ''
        };
    };

    const { year, month, day } = getDisplayDate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="w-full max-w-2xl mx-auto space-y-6 bg-slate-900/50 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-md"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-slate-400 mb-2">이름 (Full Name)</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="input-field"
                        placeholder="홍길동"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-slate-400 mb-2">한자 (Hanja)</label>
                    <input
                        type="text"
                        name="hanja"
                        required
                        className="input-field"
                        placeholder="洪吉童"
                        value={formData.hanja}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-slate-400 mb-2">성별 (Gender)</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: 'female' })}
                            className={`flex-1 py-2.5 rounded-lg border transition-all ${formData.gender === 'female'
                                ? 'bg-amber-500/20 border-amber-500 text-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                                : 'border-slate-700 text-slate-500 hover:bg-slate-800'
                                }`}
                        >
                            여성
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: 'male' })}
                            className={`flex-1 py-2.5 rounded-lg border transition-all ${formData.gender === 'male'
                                ? 'bg-amber-500/20 border-amber-500 text-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                                : 'border-slate-700 text-slate-500 hover:bg-slate-800'
                                }`}
                        >
                            남성
                        </button>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-slate-400 mb-2">생년월일 (YYYY-MM-DD)</label>
                    <div className="flex gap-2 items-center">
                        <input
                            ref={yearRef}
                            type="text"
                            placeholder="년(YYYY)"
                            value={year}
                            onChange={(e) => handleDatePartChange('year', e.target.value)}
                            className="input-field text-center w-full"
                            maxLength={4}
                            required
                        />
                        <span className="text-slate-600">-</span>
                        <input
                            ref={monthRef}
                            type="text"
                            placeholder="월(MM)"
                            value={month}
                            onChange={(e) => handleDatePartChange('month', e.target.value)}
                            className="input-field text-center w-full"
                            maxLength={2}
                            required
                        />
                        <span className="text-slate-600">-</span>
                        <input
                            ref={dayRef}
                            type="text"
                            placeholder="일(DD)"
                            value={day}
                            onChange={(e) => handleDatePartChange('day', e.target.value)}
                            className="input-field text-center w-full"
                            maxLength={2}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-slate-400 mb-2">태어난 시간</label>
                    <input
                        type="time"
                        name="birthTime"
                        required
                        className="input-field"
                        value={formData.birthTime}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-slate-400 mb-2">음력/양력</label>
                    <div className="flex gap-4 h-[46px] items-center">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.birthType === 'solar' ? 'border-amber-500' : 'border-slate-600 group-hover:border-amber-500/70'
                                }`}>
                                {formData.birthType === 'solar' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                            </div>
                            <input
                                type="radio"
                                name="birthType"
                                value="solar"
                                checked={formData.birthType === 'solar'}
                                onChange={handleChange}
                                className="hidden"
                            />
                            <span className={`text-sm transition-colors ${formData.birthType === 'solar' ? 'text-amber-500' : 'text-slate-400'
                                }`}>양력 (Solar)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.birthType === 'lunar' ? 'border-amber-500' : 'border-slate-600 group-hover:border-amber-500/70'
                                }`}>
                                {formData.birthType === 'lunar' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                            </div>
                            <input
                                type="radio"
                                name="birthType"
                                value="lunar"
                                checked={formData.birthType === 'lunar'}
                                onChange={handleChange}
                                className="hidden"
                            />
                            <span className={`text-sm transition-colors ${formData.birthType === 'lunar' ? 'text-amber-500' : 'text-slate-400'
                                }`}>음력 (Lunar)</span>
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-slate-400 mb-2">고민 및 성향</label>
                <textarea
                    name="concern"
                    required
                    rows={4}
                    className="input-field resize-none h-32"
                    placeholder="예: 웹툰 전공 졸업반인데 진로가 고민입니다. 성격은 내향적이고..."
                    value={formData.concern}
                    onChange={handleChange}
                />
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`btn-primary w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                {isLoading ? '운명 분석 중...' : '무료 사주/성명 풀이 시작'}
            </motion.button>
        </motion.form>
    );
};
