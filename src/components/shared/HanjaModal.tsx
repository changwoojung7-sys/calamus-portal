import { useState, useEffect } from 'react';
import { HanjaInfo, HANJA_MAP, HANGUL_MAP, MEANING_INDEX, COMMON_SURNAMES } from '@/lib/hanja-data';

// --- Hanja Modal Component ---

export default function HanjaModal({ name, initialHanja, onClose, onComplete }: { name: string, initialHanja: string, onClose: () => void, onComplete: (h: string) => void }) {
    const [selectedHanjas, setSelectedHanjas] = useState<string[]>(() => {
        if (initialHanja.length === name.length) {
            return initialHanja.split('');
        }
        return new Array(name.length).fill('');
    });

    const [activeIndex, setActiveIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    // Reset search term when changing active char index
    useEffect(() => {
        setSearchTerm("");
    }, [activeIndex]);

    const activeChar = name[activeIndex] || "";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-amber-700/50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-amber-100">한자 변환</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto min-h-0 flex flex-col">
                    <p className="text-slate-400 text-sm mb-4 text-center">
                        변환할 글자를 선택하세요.
                    </p>

                    {/* Syllable Selection */}
                    <div className="flex justify-center gap-2 mb-4">
                        {name.split('').map((char, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`w-12 h-12 rounded-xl text-xl font-bold border transition-all ${activeIndex === idx
                                    ? "bg-amber-600 border-amber-400 text-white shadow-lg scale-110"
                                    : "bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700"
                                    }`}
                            >
                                {selectedHanjas[idx] && selectedHanjas[idx] !== char ? selectedHanjas[idx] : char}
                            </button>
                        ))}
                    </div>

                    {/* Search Input for Meaning */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder={`'${activeChar}'의 뜻 또는 음으로 검색 (예: 나라)`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-100 focus:border-amber-500 outline-none text-sm placeholder:text-slate-600"
                        />
                    </div>

                    {/* Candidate List */}
                    <div className="flex-1 bg-slate-950/50 rounded-xl border border-slate-700/50 p-2 overflow-y-auto custom-scrollbar">
                        <HanjaList
                            targetChar={activeChar}
                            searchTerm={searchTerm}
                            isFirstChar={activeIndex === 0}
                            onSelect={(h) => {
                                const newHanjas = [...selectedHanjas];
                                newHanjas[activeIndex] = h;
                                setSelectedHanjas(newHanjas);
                                // Auto advance
                                if (activeIndex < name.length - 1) {
                                    setActiveIndex(prev => prev + 1);
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-slate-700 bg-slate-800/30">
                    <button
                        onClick={() => onComplete(selectedHanjas.join(''))}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        완료 ({selectedHanjas.join('')})
                    </button>
                </div>
            </div>
        </div>
    );
}

// Sub-component to handle list logic
function HanjaList({ targetChar, searchTerm, isFirstChar, onSelect }: { targetChar: string, searchTerm: string, isFirstChar: boolean, onSelect: (h: string) => void }) {
    const [list, setList] = useState<HanjaInfo[]>([]);

    useEffect(() => {
        let results: HanjaInfo[] = [];

        // 1. Determine base candidates
        if (searchTerm) {
            // Search Mode
            // 1) Match Hangul exact
            const bySound = HANGUL_MAP.get(searchTerm);
            if (bySound) results.push(...bySound);

            // 2) Match Meaning (contains)
            const byMeaning = MEANING_INDEX
                .filter(idx => idx.meaning.includes(searchTerm))
                .map(idx => HANJA_MAP.get(idx.hanja))
                .filter(Boolean) as HanjaInfo[];

            // Merge unique
            const set = new Set(results.map(r => r.hanja));
            byMeaning.forEach(Info => {
                if (!set.has(Info.hanja)) {
                    results.push(Info);
                }
            });

        } else if (targetChar) {
            // Default Mode: list by targetChar (Sound)
            results = HANGUL_MAP.get(targetChar) || [];
            // If not found in map (maybe complex/rare), try to find in raw if needed? 
            // Logic above covers most.
        }

        // 2. Sorting
        results.sort((a, b) => {
            // A. Surname Priority (Only if isFirstChar is true)
            if (isFirstChar) {
                const isASurname = COMMON_SURNAMES.has(a.hanja) || a.isSurname; // Prioritize common ones heavily
                const isBSurname = COMMON_SURNAMES.has(b.hanja) || b.isSurname;

                // Specifically prioritize COMMON_SURNAMES explicit set first
                const aCommon = COMMON_SURNAMES.has(a.hanja);
                const bCommon = COMMON_SURNAMES.has(b.hanja);

                if (aCommon && !bCommon) return -1;
                if (!aCommon && bCommon) return 1;
                // If both common or both not common, fall through
            }

            // B. Stroke Count (Ascending)
            if (a.strokes !== b.strokes) {
                return a.strokes - b.strokes;
            }

            // C. Fallback alphabetical
            return a.hanja.localeCompare(b.hanja);
        });

        // Limit results to avoid rendering lag if too many
        setList(results.slice(0, 100));

    }, [targetChar, searchTerm, isFirstChar]);

    if (!list.length) {
        return <div className="text-center text-slate-500 py-10">검색 결과가 없습니다.</div>;
    }

    return (
        <div className="grid grid-cols-1 gap-2">
            {list.map((item, i) => (
                <button
                    key={`${item.hanja}-${i}`}
                    onClick={() => onSelect(item.hanja)}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800 transition-colors border border-slate-700/50 hover:border-amber-500/50 text-left group"
                >
                    <div className="relative">
                        <span className="text-3xl font-serif text-amber-100 font-bold bg-slate-900 w-12 h-12 flex items-center justify-center rounded border border-slate-700 group-hover:border-amber-500 transition-colors">
                            {item.hanja}
                        </span>
                        <span className="absolute -top-1 -right-1 flex items-center justify-center bg-slate-800 text-[10px] text-slate-400 w-5 h-5 rounded-full border border-slate-600">
                            {item.strokes}
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-amber-200 font-bold text-lg">{item.meaning || item.hangul}</span>
                            {/* Show "Sound" if meaning differs, or just format nicely */}
                        </div>
                        <div className="text-xs text-slate-400 flex gap-2">
                            <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">음: {item.hangul}</span>
                            <span>{item.meaning}</span>
                        </div>
                    </div>

                    {COMMON_SURNAMES.has(item.hanja) && isFirstChar && (
                        <span className="ml-auto text-xs bg-amber-900/50 text-amber-200 px-2 py-1 rounded border border-amber-800/50">
                            대표 성씨
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}
