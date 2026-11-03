"use client"

import React, { useEffect, useRef, useState } from 'react'
import { miniGameAudio } from '../../services/miniGameAudio'
import { paintSprite, useRetroSky, type SpritePalette } from './retroCelebrationKit'

/**
 * 탁구 우승 레트로 세리머니 (2026-11-02)
 * - 도트 폭죽 + 색종이 꽃가루
 * - 스포츠 우승 팡파르 → 관중 박수·환호 → 휘파람 → "Champion!" 음성
 * - 오리지널 도트 응원단 4명(남 2·여 2)이 아래 양 끝에서 번갈아 점프하며 별·하트를 날린다
 * AI가 이긴 경우(short)는 짧은 박수와 꽃가루만.
 */

const FIREWORK_MS = 6000
const CONFETTI_MS = 7000
const SHORT_CONFETTI_MS = 2500
const SCALE = 4
const COLS = 16
const ROWS = 24
const CHAR_W = COLS * SCALE
const CHAR_H = ROWS * SCALE
const EDGE = 14
const GAP = 72
const TURN_MS = 800

const BASE_PALETTE: SpritePalette = {
  K: '#1e1b4b', // 외곽선
  S: '#fde2c8', // 피부
  s: '#f5b99a', // 피부 그림자
  E: '#1e293b', // 눈
  W: '#ffffff', // 흰색 (눈 하이라이트·옷깃)
  P: '#fb7185', // 볼 터치
  M: '#be123c' // 입
}

// 👨 탁구 선수: 짧은 머리 + 흰 머리띠 + 빨간 유니폼
const PLAYER_BOY = [
  '................',
  '................',
  '....KKKKKKKK....',
  '...KHHHHHHHHK...',
  '..KHHHHHHHHHHK..',
  '..KAAAAAAAAAAK..',
  '..KHSSSSSSSSHK..',
  '..KSSSSSSSSSSK..',
  '..KSEESSSSEESK..',
  '..KSEWSSSSEWSK..',
  '..KSSSSSSSSSSK..',
  '..KSSSMMMMSSSK..',
  '...KSSSSSSSSK...',
  '....KKsSSsKK....',
  '...KCCCWWCCCK...',
  '..KCCCCCCCCCCK..',
  '.KCCCCCCCCCCCCK.',
  '.KSKCCCCCCCCKSK.',
  '.KSKCCCCCCCCKSK.',
  '..K.KCCCCCCK.K..',
  '....KLLLLLLK....',
  '....KLLKKLLK....',
  '....KSSKKSSK....',
  '....KKK..KKK....'
]
// 👩 응원단: 높게 묶은 포니테일 + 노란 상의 + 분홍 응원 술
const CHEER_GIRL = [
  '.......KKK......',
  '......KHHHK.....',
  '....KKKHHKKK....',
  '...KHHHHHHHHK...',
  '..KHHHHHHHHHHK..',
  '..KHHhHHHHhHHK..',
  '..KHSSSSSSSSHK..',
  '..KSSSSSSSSSSK..',
  '..KSKKSSSSKKSK..',
  '..KSEESSSSEESK..',
  '..KSPSSSSSSPSK..',
  '..KSSSSMMSSSSK..',
  '...KSSSSSSSSK...',
  '....KKsSSsKK....',
  '...KCCCSSCCCK...',
  '..KCCCCCCCCCCK..',
  '.KACCCCCCCCCCAK.',
  'KAAKCCCCCCCCKAAK',
  'KAAKCCCCCCCCKAAK',
  '.KK.KLLLLLLK.KK.',
  '...KLLLLLLLLK...',
  '....KSSKKSSK....',
  '....KSSKKSSK....',
  '....KKK..KKK....'
]
// 👨 회사원 동료: 가르마 + 안경 + 셔츠·넥타이
const OFFICE_GUY = [
  '................',
  '................',
  '....KKKKKKKK....',
  '...KHHHHHHHHK...',
  '..KHHHHHHHhhHK..',
  '..KHHHHHSSSSSK..',
  '..KHSSSSSSSSSK..',
  '..KSSSSSSSSSSK..',
  '..KGGGGSSGGGGK..',
  '..KGEWGGGGEWGK..',
  '..KSGGSSSSGGSK..',
  '..KSSSSMMSSSSK..',
  '...KSSSSSSSSK...',
  '....KKsSSsKK....',
  '...KCCCAACCCK...',
  '..KCCCCAACCCCK..',
  '.KCCCCCAACCCCCK.',
  '.KSKCCCAACCCKSK.',
  '.KSKCCCCCCCCKSK.',
  '..K.KCCCCCCK.K..',
  '....KLLLLLLK....',
  '....KLLKKLLK....',
  '....KLLKKLLK....',
  '....KKK..KKK....'
]
// 👩 동료: 단발머리 + 분홍 카디건 + 흰 블라우스
const BOB_GIRL = [
  '................',
  '................',
  '....KKKKKKKK....',
  '...KHHHHHHHHK...',
  '..KHHHHHHHHHHK..',
  '.KHHHHHHHHHHHHK.',
  '.KHHSSSSSSSSHHK.',
  '.KHSSSSSSSSSSHK.',
  '.KHSKKSSSSKKSHK.',
  '.KHSEESSSSEESHK.',
  '.KHSPSSSSSSPSHK.',
  '.KHHSSSMMSSSHHK.',
  '..KHKSSSSSSKHK..',
  '...KKKsSSsKKK...',
  '...KCCCWWCCCK...',
  '..KCCCCWWCCCCK..',
  '.KCCCCCWWCCCCCK.',
  '.KSKCCCWWCCCKSK.',
  '.KSKCCCCCCCCKSK.',
  '..K.KLLLLLLK.K..',
  '...KLLLLLLLLK...',
  '....KSSKKSSK....',
  '....KSSKKSSK....',
  '....KKK..KKK....'
]

/** 만세 자세: 양팔을 머리 위로 (hand = 손 색 글자, 응원단은 응원 술) */
const armsUp = (rows: string[], hand: string) =>
  rows.map((row, y) => {
    const c = row.split('')
    if (y === 6) { c[0] = 'K'; c[1] = 'K'; c[14] = 'K'; c[15] = 'K' }
    if (y >= 7 && y <= 9) { c[0] = hand; c[1] = hand; c[14] = hand; c[15] = hand }
    if (y >= 10 && y <= 16) { c[0] = 'K'; c[1] = 'S'; c[14] = 'S'; c[15] = 'K' }
    if (y === 16) { if (c[2] === 'A') c[2] = 'C'; if (c[13] === 'A') c[13] = 'C' }
    if (y >= 17 && y <= 18) { c[0] = '.'; c[1] = '.'; c[2] = 'K'; c[13] = 'K'; c[14] = '.'; c[15] = '.' }
    return c.join('')
  })

interface Cheerer {
  rows: string[]
  hand: string
  palette: SpritePalette
  icon: 'heart' | 'star'
}

const CHEERERS: Cheerer[] = [
  { rows: PLAYER_BOY, hand: 'S', icon: 'star', palette: { ...BASE_PALETTE, H: '#3f2a1d', h: '#2a1a10', A: '#ffffff', C: '#dc2626', L: '#1e3a8a' } },
  { rows: CHEER_GIRL, hand: 'A', icon: 'heart', palette: { ...BASE_PALETTE, H: '#ea580c', h: '#9a3412', A: '#ec4899', C: '#facc15', L: '#2563eb' } },
  { rows: OFFICE_GUY, hand: 'S', icon: 'star', palette: { ...BASE_PALETTE, H: '#111827', h: '#374151', G: '#334155', A: '#2563eb', C: '#e0f2fe', L: '#334155' } },
  { rows: BOB_GIRL, hand: 'S', icon: 'heart', palette: { ...BASE_PALETTE, H: '#78350f', h: '#451a03', C: '#f9a8d4', L: '#475569' } }
]

// 화면 위치: 왼쪽 두 명(선수·응원단), 오른쪽 두 명(동료들)
const placeOf = (index: number): { side: 'left' | 'right'; offset: number } =>
  index < 2 ? { side: 'left', offset: EDGE + index * GAP } : { side: 'right', offset: EDGE + (3 - index) * GAP }

const CheererSprite: React.FC<{ cheerer: Cheerer; cheering: boolean }> = ({ cheerer, cheering }) => {
  const ref = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    if (ref.current) paintSprite(ref.current, cheering ? armsUp(cheerer.rows, cheerer.hand) : cheerer.rows, cheerer.palette, SCALE)
  }, [cheering, cheerer])
  return <canvas ref={ref} width={CHAR_W} height={CHAR_H} style={{ display: 'block', width: CHAR_W, height: CHAR_H, imageRendering: 'pixelated' }} />
}

export const PingpongVictoryCelebration: React.FC<{ winnerName: string; short?: boolean }> = ({ winnerName, short = false }) => {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [entered, setEntered] = useState(false)
  const [turn, setTurn] = useState(-1)
  const sky = useRetroSky(rootRef, canvasRef, short ? { fireworkMs: 0, confettiMs: SHORT_CONFETTI_MS } : { fireworkMs: FIREWORK_MS, confettiMs: CONFETTI_MS })

  const messages = ['Champion!', 'Nice game!', `${winnerName}님 최고!`, 'Bravo! ♥']

  // 소리
  useEffect(() => {
    if (short) miniGameAudio.applause(2.5)
    else miniGameAudio.pingpongVictory()
  }, [])

  // 응원단 등장 → 한 명씩 돌아가며 만세 점프 + 별·하트
  useEffect(() => {
    if (short) return
    const enter = window.setTimeout(() => setEntered(true), 400)
    let index = -1
    const cycle = window.setInterval(() => {
      index = (index + 1) % CHEERERS.length
      setTurn(index)
      const root = rootRef.current
      if (!root) return
      const place = placeOf(index)
      const centerX = place.side === 'left' ? place.offset + CHAR_W / 2 : root.clientWidth - place.offset - CHAR_W / 2
      sky.current.floatIcons(centerX + 10, root.clientHeight - CHAR_H, CHEERERS[index].icon, 3)
    }, TURN_MS)
    return () => {
      window.clearTimeout(enter)
      window.clearInterval(cycle)
    }
  }, [])

  // 승리 화면(z-index가 있는 상자) 안에서 폭죽 캔버스는 글자·버튼 뒤(-1), 캐릭터는 앞(2)에 그린다
  return (
    <div ref={rootRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', imageRendering: 'pixelated', zIndex: -1 }}
      />
      {!short &&
        CHEERERS.map((cheerer, index) => {
          const place = placeOf(index)
          const cheering = turn === index
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                bottom: 0,
                [place.side]: place.offset,
                zIndex: 2,
                transform: entered ? `translateY(${cheering ? -12 : 0}px)` : `translateY(${CHAR_H + 20}px)`,
                transition: entered ? 'transform 0.18s steps(3)' : `transform 0.5s steps(5) ${index * 0.12}s`
              }}
            >
              {cheering && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: CHAR_H + 6,
                    [place.side]: 0,
                    whiteSpace: 'nowrap',
                    background: '#020617',
                    color: cheerer.icon === 'heart' ? '#f9a8d4' : '#fde047',
                    border: '3px solid #ffffff',
                    boxShadow: `3px 3px 0 ${cheerer.icon === 'heart' ? '#ec4899' : '#eab308'}`,
                    padding: '4px 8px',
                    fontFamily: 'monospace',
                    fontWeight: 900,
                    fontSize: 12
                  }}
                >
                  {messages[index]}
                </div>
              )}
              <CheererSprite cheerer={cheerer} cheering={cheering} />
            </div>
          )
        })}
    </div>
  )
}
