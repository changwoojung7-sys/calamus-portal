"use client"

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useMiniGameStore } from '../../store/useMiniGameStore'

// 게임 창은 캔버스·Web Audio를 쓰므로 브라우저에서만 불러온다
const BilliardMiniGameModal = dynamic(() => import('./BilliardMiniGameModal').then((m) => m.BilliardMiniGameModal), { ssr: false })
const PingpongMiniGameModal = dynamic(() => import('./PingpongMiniGameModal').then((m) => m.PingpongMiniGameModal), { ssr: false })

const BACK_HREF = '/#lounge'

/**
 * 🎮 힐링 라운지 미니게임 페이지
 * WorkNexus 휴게실의 당구·탁구 게임 창을 페이지에 들어오자마자 열고, 창을 닫으면 힐링 라운지로 돌아간다.
 */
export default function LoungeGameClient({ game }: { game: 'billiard' | 'pingpong' }) {
  const router = useRouter()
  const isOpen = useMiniGameStore((s) => (game === 'billiard' ? s.showBilliardModal : s.showPingpongModal))
  const wasOpen = useRef(false)

  useEffect(() => {
    const store = useMiniGameStore.getState()
    if (game === 'billiard') store.openBilliard()
    else store.openPingpong()
    return () => {
      const st = useMiniGameStore.getState()
      if (game === 'billiard') st.closeBilliard()
      else st.closePingpong()
    }
  }, [game])

  useEffect(() => {
    if (isOpen) wasOpen.current = true
    else if (wasOpen.current) router.push(BACK_HREF)
  }, [isOpen, router])

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-400 text-sm">
      {game === 'billiard' ? <BilliardMiniGameModal /> : <PingpongMiniGameModal />}
      <span>게임을 불러오는 중입니다...</span>
    </div>
  )
}
