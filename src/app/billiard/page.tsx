import type { Metadata } from 'next';
import LoungeGameClient from '@/components/minigames/LoungeGameClient';

export const metadata: Metadata = {
  title: 'Calamus Portal - 휴게실 나인볼 당구',
  description:
    'WorkNexus 가상 오피스 휴게실의 나인볼 당구를 그대로 옮겨 왔습니다. AI 세라와 대전하거나 친구와 한 화면에서 번갈아 쳐 보세요. 설치 없이 무료.',
};

export default function BilliardPage() {
  return <LoungeGameClient game="billiard" />;
}
