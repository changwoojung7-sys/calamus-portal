import hanjaDataRaw from '@/data/hanja-data.json';
import hanjaLib from 'hanja';

// --- Types & Constants & Helpers ---

export interface HanjaInfo {
    hanja: string;
    hangul: string;
    meaning: string;
    strokes: number;
    isSurname: boolean;
}

// Common Surname Hanja list for priority at index 0
export const COMMON_SURNAMES = new Set([
    '金', '李', '朴', '崔', '鄭', '姜', '趙', '尹', '張', '林',
    '韓', '吳', '徐', '申', '權', '黄', '安', '宋', '柳', '洪'
]);

// Data Maps
export const HANJA_MAP = new Map<string, HanjaInfo>();
export const HANGUL_MAP = new Map<string, HanjaInfo[]>();
export const MEANING_INDEX: { meaning: string, hanja: string }[] = [];

// Helper: Calculate strokes
const getStrokes = (char: string): number => {
    try {
        // @ts-ignore
        const strokes = hanjaLib.getStrokes(char);
        return typeof strokes === 'string' ? strokes.length : 0;
    } catch {
        return 0;
    }
};

// Initialize Data (Run once on module load)
// Use a flag to prevent double initialization if possible, though module caching usually handles it.
let initialized = false;

if (!initialized) {
    (hanjaDataRaw as any[]).forEach((item: any) => {
        const hangul = item.ineum || "";
        let meaning = item.in || "";

        // Clean up meaning string
        if (meaning.startsWith(hangul + " : ")) {
            meaning = meaning.substring(hangul.length + 3);
        } else if (meaning.startsWith(hangul + ":")) {
            meaning = meaning.substring(hangul.length + 1).trim();
        }
        meaning = meaning.replace(/\(.*\)/g, '').trim();

        if (!meaning && item.dic) {
            meaning = item.dic;
        }

        const isSurname = meaning.includes("성(") || meaning.includes("성씨");

        // Convert hex code to char
        const hanjaChar = String.fromCharCode(parseInt(item.cd, 16));

        const info: HanjaInfo = {
            hanja: hanjaChar,
            hangul: hangul,
            meaning: meaning,
            strokes: 0,
            isSurname: isSurname
        };

        info.strokes = getStrokes(info.hanja);

        HANJA_MAP.set(info.hanja, info);

        if (!HANGUL_MAP.has(hangul)) {
            HANGUL_MAP.set(hangul, []);
        }
        HANGUL_MAP.get(hangul)?.push(info);

        MEANING_INDEX.push({ meaning: meaning, hanja: info.hanja });
    });
    initialized = true;
}
