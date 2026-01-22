import type { Metadata } from 'next';
import RouletteClient from '@/components/roulette/RouletteClient';

export const metadata: Metadata = {
    title: 'Calamus Portal - 운명의 룰렛',
    description: '팀원들과 함께하는 스릴 넘치는 랜덤 벌칙 게임',
};

export default function RoulettePage() {
    return (
        <div className="min-h-screen bg-[#020617]">
            <RouletteClient />
        </div>
    );
}
