"use client"

import React, { useEffect, useRef, useState } from 'react'
import { miniGameAudio } from '../../services/miniGameAudio'
import { paintSprite, useRetroSky } from './retroCelebrationKit'

/**
 * 당구 최종 승리 레트로 축하 연출 (2026-11-02)
 * - 도트 폭죽 약 6.5초 + "펑" 소리
 * - 8비트 팡파르 → 휘파람 → "Nice!" 음성
 * - 오리지널 도트 캐릭터(휴게실 당구장 마스코트)가 아래에서 올라와 윙크하며 하트를 날린다
 * 이미지 파일 없이 캔버스에 픽셀을 직접 찍어 그린다. 승리 화면 안에 넣으면 그 영역을 가득 채운다.
 */

const FIREWORK_MS = 6500

// 캐릭터 도트 (한 글자 = 한 픽셀). 청록 웨이브 머리 + 빨간 리본 + 딜러 조끼 — 당구 AI 상대 "세라"로도 쓴다
export const SPRITE_PALETTE: Record<string, string> = {
  K: '#1e1b4b', // 외곽선
  H: '#14b8a6', // 머리
  h: '#0f766e', // 머리 그림자
  S: '#fde2c8', // 피부
  s: '#f5b99a', // 피부 그림자
  E: '#1e293b', // 눈
  W: '#ffffff', // 눈 하이라이트
  P: '#fb7185', // 볼 터치
  M: '#e11d48', // 입술
  R: '#ef4444', // 리본
  r: '#b91c1c', // 리본 그림자
  B: '#f1f5f9', // 블라우스
  T: '#dc2626', // 넥타이
  V: '#312e81', // 조끼
  G: '#facc15' // 단추
}
export const SPRITE_OPEN = [
  '......KKKKKKK..KKK..',
  '....KKHHHHHHHKKRRRK.',
  '...KHHHHHHHHHHKRrRK.',
  '..KHHHHHHHHHHHHKRRK.',
  '..KHHHHHHHHHHHHHKK..',
  '.KHHHhhHHHHHhhHHHK..',
  '.KHHhSSSSSSSSSShHK..',
  '.KHhSSSSSSSSSSSShK..',
  '.KHhSKKSSSSSSKKShK..',
  '.KHhSEESSSSSSEEShK..',
  '.KHhSEWSSSSSSEWShK..',
  '.KHhSPSSSSSSSSPShK..',
  '.KHHhSSSSMMSSSShHK..',
  '.KHHHhSSSSSSSShHHK..',
  '.KHHHHKsSSSSsKHHHHK.',
  'KHHHHK.KsSSsK.KHHHK.',
  'KHHHK.KBBSSBBK.KHHK.',
  'KHHK.KBBBTTBBBK.KHK.',
  '.KK.KVBBBTTBBBVK.K..',
  '...KVVVBBTTBBVVVK...',
  '..KVVVVVBTTBVVVVVK..',
  '..KVVVVVVGGVVVVVVK..',
  '..KVVVVVVVVVVVVVVK..',
  '..KVVVVVVGGVVVVVVK..',
  '..KVVVVVVVVVVVVVVK..'
]
// 윙크 + 손키스: 오른쪽 눈을 감고(가로줄), 입을 동그랗게 오므린다
export const SPRITE_WINK = SPRITE_OPEN.map((row, y) => {
  if (y === 9) return '.KHhSEESSSSSSSSShK..'
  if (y === 10) return '.KHhSEWSSSSSKKKShK..'
  if (y === 12) return '.KHHhSSSSSMSSSShHK..'
  return row
})
const SPRITE_SCALE = 6
const SPRITE_W = 20 * SPRITE_SCALE
const SPRITE_H = SPRITE_OPEN.length * SPRITE_SCALE
// 하트가 나오는 입 위치 (스프라이트 픽셀 좌표)
const MOUTH = { x: 10, y: 12 }

export const BilliardVictoryCelebration: React.FC<{ winnerName: string }> = ({ winnerName }) => {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const spriteRef = useRef<HTMLCanvasElement | null>(null)
  const [characterIn, setCharacterIn] = useState(false)
  const [winking, setWinking] = useState(false)
  const sky = useRetroSky(rootRef, canvasRef, { fireworkMs: FIREWORK_MS })

  // 소리: 팡파르 → 휘파람 → "Nice!"
  useEffect(() => {
    miniGameAudio.billiardVictory()
  }, [])

  // 캐릭터 등장 + 1.6초마다 윙크하며 하트 3개
  useEffect(() => {
    const enter = window.setTimeout(() => setCharacterIn(true), 500)
    let unwink = 0
    const kiss = window.setInterval(() => {
      setWinking(true)
      const root = rootRef.current
      if (root) {
        const mouthX = root.clientWidth - 28 - SPRITE_W + MOUTH.x * SPRITE_SCALE
        const mouthY = root.clientHeight - SPRITE_H + MOUTH.y * SPRITE_SCALE
        sky.current.floatIcons(mouthX, mouthY, 'heart', 3)
      }
      unwink = window.setTimeout(() => setWinking(false), 650)
    }, 1600)
    return () => {
      window.clearTimeout(enter)
      window.clearTimeout(unwink)
      window.clearInterval(kiss)
    }
  }, [])

  useEffect(() => {
    if (spriteRef.current) paintSprite(spriteRef.current, winking ? SPRITE_WINK : SPRITE_OPEN, SPRITE_PALETTE, SPRITE_SCALE)
  }, [winking])

  return (
    <div ref={rootRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', imageRendering: 'pixelated', zIndex: 0 }}
      />
      <div
        style={{
          position: 'absolute',
          right: 28,
          bottom: 0,
          zIndex: 2,
          transform: characterIn ? 'translateY(0)' : `translateY(${SPRITE_H + 20}px)`,
          transition: 'transform 0.6s steps(6)'
        }}
      >
        {/* 말풍선 (레트로 도트 테두리) */}
        <div
          style={{
            position: 'absolute',
            right: SPRITE_W - 6,
            bottom: SPRITE_H - 34,
            whiteSpace: 'nowrap',
            background: '#020617',
            color: '#ffffff',
            border: '3px solid #ffffff',
            boxShadow: '4px 4px 0 #ec4899',
            padding: '6px 10px',
            fontFamily: 'monospace',
            fontWeight: 900,
            fontSize: 13,
            lineHeight: 1.35,
            textAlign: 'center',
            opacity: characterIn ? 1 : 0,
            transition: 'opacity 0.2s 0.6s'
          }}
        >
          Congratulations! <span style={{ color: '#f472b6' }}>♥</span>
          <div style={{ color: '#facc15', fontSize: 12 }}>{winnerName}님</div>
        </div>
        <canvas
          ref={spriteRef}
          width={SPRITE_W}
          height={SPRITE_H}
          style={{
            display: 'block',
            width: SPRITE_W,
            height: SPRITE_H,
            imageRendering: 'pixelated',
            animation: 'billiardMascotBob 0.8s steps(2) infinite'
          }}
        />
      </div>
      <style>{'@keyframes billiardMascotBob { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-3px) } }'}</style>
    </div>
  )
}
