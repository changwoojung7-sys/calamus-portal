import type { Metadata } from 'next';
import LoungeGameClient from '@/components/minigames/LoungeGameClient';

export const metadata: Metadata = {
  title: 'Calamus Portal - 휴게실 레트로 탁구',
  description:
    'WorkNexus 가상 오피스 휴게실의 레트로 탁구를 그대로 옮겨 왔습니다. 난이도를 골라 AI 팀장님과 랠리를 펼쳐 보세요. 설치 없이 무료.',
};

export default function PingpongPage() {
  return <LoungeGameClient game="pingpong" />;
}
