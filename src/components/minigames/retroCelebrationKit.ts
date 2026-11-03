"use client"

import { useEffect, useRef } from 'react'
import { miniGameAudio } from '../../services/miniGameAudio'

/**
 * 미니게임 승리 축하 연출 공용 도구 (당구·탁구)
 * - 도트 폭죽, 색종이 꽃가루, 둥실 떠오르는 하트·별
 * - 글자 지도(한 글자 = 한 픽셀)로 도트 캐릭터 그리기
 * 캔버스를 화면의 1/PIXEL 해상도로 그리고 늘려서 보여 주면 저절로 도트(픽셀) 느낌이 난다.
 */

export const PIXEL = 3
export const FIREWORK_COLORS = ['#facc15', '#f472b6', '#38bdf8', '#a3e635', '#fb923c', '#c084fc', '#ffffff']
export const HEART_COLORS = ['#f472b6', '#fb7185', '#ec4899', '#f9a8d4']
export const STAR_COLORS = ['#facc15', '#fde047', '#fbbf24']

const ICON_SHAPES = {
  heart: ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'],
  star: ['...X...', '..XXX..', 'XXXXXXX', '.XXXXX.', '..XXX..', '.XX.XX.', '.X...X.']
}

export type SpritePalette = Record<string, string>

/** 글자 지도 스프라이트를 캔버스에 그린다 (팔레트에 없는 글자는 투명) */
export const paintSprite = (canvas: HTMLCanvasElement, rows: string[], palette: SpritePalette, scale: number) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const color = palette[row[x]]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(x * scale, y * scale, scale, scale)
    }
  })
}

interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number }
interface Rocket { x: number; y: number; vy: number; targetY: number; color: string }
interface FloatingIcon { x: number; y: number; vy: number; phase: number; life: number; color: string; size: number; shape: keyof typeof ICON_SHAPES }
interface Confetti { x: number; y: number; vy: number; phase: number; color: string; flip: number }

export interface RetroSky {
  /** 화면 좌표(px) 지점에서 하트·별을 띄운다 */
  floatIcons: (screenX: number, screenY: number, shape: 'heart' | 'star', count: number) => void
}

interface SkyOptions {
  fireworkMs: number
  confettiMs?: number
}

/**
 * 폭죽·꽃가루·하트를 그리는 캔버스 하늘. rootRef(가득 채울 영역)와 canvasRef를 넘기면
 * 크기 맞춤·애니메이션을 알아서 하고, 아이콘을 띄울 수 있는 함수를 돌려준다.
 */
export const useRetroSky = (
  rootRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: SkyOptions
): React.MutableRefObject<RetroSky> => {
  const iconsRef = useRef<FloatingIcon[]>([])
  const skyRef = useRef<RetroSky>({
    floatIcons: (screenX, screenY, shape, count) => {
      const colors = shape === 'heart' ? HEART_COLORS : STAR_COLORS
      for (let i = 0; i < count; i++) {
        iconsRef.current.push({
          x: screenX / PIXEL - 4 - i * 3,
          y: screenY / PIXEL - i * 3,
          vy: -(0.25 + Math.random() * 0.18),
          phase: Math.random() * Math.PI * 2,
          life: 0,
          color: colors[i % colors.length],
          size: i === 0 ? 2 : 1,
          shape
        })
      }
    }
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(root.clientWidth / PIXEL))
      canvas.height = Math.max(1, Math.floor(root.clientHeight / PIXEL))
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(root)

    const particles: Particle[] = []
    const rockets: Rocket[] = []
    const confetti: Confetti[] = []
    const startedAt = performance.now()
    let nextLaunch = 0
    let nextConfetti = 0
    // 처음엔 두 발을 한꺼번에
    let openingVolley = true
    let frame = 0

    const launch = () => {
      const w = canvas.width
      const h = canvas.height
      rockets.push({
        x: w * (0.12 + Math.random() * 0.76),
        y: h,
        vy: -(1.6 + Math.random() * 0.6),
        targetY: h * (0.15 + Math.random() * 0.3),
        color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)]
      })
    }

    const burst = (rocket: Rocket) => {
      const count = 40 + Math.floor(Math.random() * 16)
      const second = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)]
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2
        const speed = 0.7 + Math.random() * 1.1
        const maxLife = 50 + Math.random() * 30
        particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: maxLife,
          maxLife,
          color: i % 3 === 0 ? second : rocket.color,
          size: Math.random() < 0.5 ? 2 : 1
        })
      }
      miniGameAudio.fireworkPop(0.5 + Math.random() * 0.3)
    }

    const tick = (now: number) => {
      const elapsed = now - startedAt
      if (elapsed < options.fireworkMs && now >= nextLaunch) {
        launch()
        if (openingVolley || Math.random() < 0.4) launch()
        openingVolley = false
        nextLaunch = now + 320 + Math.random() * 320
      }
      if (options.confettiMs && elapsed < options.confettiMs && now >= nextConfetti) {
        for (let i = 0; i < 4; i++) {
          confetti.push({
            x: Math.random() * canvas.width,
            y: -4,
            vy: 0.35 + Math.random() * 0.4,
            phase: Math.random() * Math.PI * 2,
            color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
            flip: Math.random() * Math.PI * 2
          })
        }
        nextConfetti = now + 60
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.y += r.vy
        ctx.fillStyle = r.color
        ctx.fillRect(Math.round(r.x), Math.round(r.y), 1, 2)
        if (r.y <= r.targetY) {
          burst(r)
          rockets.splice(i, 1)
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.97
        p.vy = p.vy * 0.97 + 0.03
        p.life--
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        // 끝무렵에는 깜빡이며 사라진다 (레트로 반짝임)
        if (p.life < 18 && p.life % 4 < 2) continue
        ctx.globalAlpha = Math.min(1, p.life / p.maxLife + 0.3)
        ctx.fillStyle = p.color
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
      }
      ctx.globalAlpha = 1

      // 색종이: 좌우로 흔들리며 떨어지고, 뒤집히는 것처럼 폭이 1↔2로 바뀐다
      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i]
        c.y += c.vy
        c.phase += 0.06
        c.flip += 0.15
        c.x += Math.sin(c.phase) * 0.3
        if (c.y > canvas.height + 4) {
          confetti.splice(i, 1)
          continue
        }
        ctx.fillStyle = c.color
        ctx.fillRect(Math.round(c.x), Math.round(c.y), Math.sin(c.flip) > 0 ? 2 : 1, 1)
      }

      const icons = iconsRef.current
      for (let i = icons.length - 1; i >= 0; i--) {
        const icon = icons[i]
        icon.life++
        icon.y += icon.vy
        icon.x += Math.sin(icon.phase + icon.life * 0.08) * 0.25 - 0.08
        if (icon.y < -10 || icon.life > 260) {
          icons.splice(i, 1)
          continue
        }
        ctx.globalAlpha = icon.life > 200 ? Math.max(0, (260 - icon.life) / 60) : 1
        ctx.fillStyle = icon.color
        ICON_SHAPES[icon.shape].forEach((row, y) => {
          for (let x = 0; x < row.length; x++) {
            if (row[x] === 'X') ctx.fillRect(Math.round(icon.x) + x * icon.size, Math.round(icon.y) + y * icon.size, icon.size, icon.size)
          }
        })
      }
      ctx.globalAlpha = 1

      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return skyRef
}
