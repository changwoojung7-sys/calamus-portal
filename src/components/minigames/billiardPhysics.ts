import {
  BILLIARD_TABLE_WIDTH as TABLE_WIDTH,
  BILLIARD_TABLE_HEIGHT as TABLE_HEIGHT,
  BILLIARD_BALL_RADIUS as BALL_RADIUS,
  BILLIARD_RAIL as RAIL,
  type BilliardBallState
} from '../../store/useMiniGameStore'

/**
 * 🎱 당구 물리 1스텝 (2026-11-02 게임 화면에서 분리)
 * 게임 화면과 세라(AI)가 똑같은 계산을 쓴다 — 세라는 치기 전에 이 계산으로 미리 쳐 보고 들어가는 각도를 찾는다.
 * 소리·온라인 전송 같은 화면 쪽 일은 hooks로 알려 준다.
 */

export const POCKET_RADIUS = 26

// 6개 포켓 위치 (코너 4개, 사이드 2개)
export const POCKETS = [
  { x: 38, y: 38 },                       // Top-Left
  { x: TABLE_WIDTH / 2, y: 28 },          // Top-Center
  { x: TABLE_WIDTH - 38, y: 38 },         // Top-Right
  { x: 38, y: TABLE_HEIGHT - 38 },        // Bottom-Left
  { x: TABLE_WIDTH / 2, y: TABLE_HEIGHT - 28 }, // Bottom-Center
  { x: TABLE_WIDTH - 38, y: TABLE_HEIGHT - 38 }  // Bottom-Right
]

// 쿠션 안쪽 경계 (공 중심이 갈 수 있는 범위)
export const CUSH_L = RAIL + BALL_RADIUS
export const CUSH_R = TABLE_WIDTH - RAIL - BALL_RADIUS
export const CUSH_T = RAIL + BALL_RADIUS
export const CUSH_B = TABLE_HEIGHT - RAIL - BALL_RADIUS

export const SUB_STEPS = 3
export const FRICTION = 0.988 // 구름 마찰 계수 (1스텝 기준)
export const MAX_CUE_SPEED = 19.5

export interface PhysicsHooks {
  onPocket?: (ball: BilliardBallState) => void
  onCushion?: (intensity: number) => void
  /** 두 공이 맞닿음 (수구 최초 타격 공 기록용 — 튕기기 전에 알린다) */
  onContact?: (b1: BilliardBallState, b2: BilliardBallState) => void
  /** 두 공이 튕김 (소리용) */
  onBallHit?: (intensity: number) => void
}

/** 1스텝(1/60초) 진행. 아직 움직이는 공이 있으면 true */
export function stepBilliardPhysics(balls: BilliardBallState[], hooks: PhysicsHooks = {}): boolean {
  let anyMoving = false
  const frictionPerSub = Math.pow(FRICTION, 1 / SUB_STEPS)

  // 서브 스텝핑 (터널링 방지: 스텝당 3단계 미세 적분)
  for (let step = 0; step < SUB_STEPS; step++) {
    for (let i = 0; i < balls.length; i++) {
      const b = balls[i]
      if (b.isPocketed) continue

      // 속도 적용
      b.x += b.vx / SUB_STEPS
      b.y += b.vy / SUB_STEPS

      // 마찰 감속
      b.vx *= frictionPerSub
      b.vy *= frictionPerSub

      // 미세 속도 정지
      if (Math.hypot(b.vx, b.vy) < 0.05) {
        b.vx = 0
        b.vy = 0
      } else {
        anyMoving = true
      }

      // 1-1. 포켓 홀인 검사 (6개 포켓과의 거리)
      for (const pocket of POCKETS) {
        const dist = Math.hypot(b.x - pocket.x, b.y - pocket.y)
        if (dist < POCKET_RADIUS - 2) {
          b.isPocketed = true
          b.vx = 0
          b.vy = 0
          hooks.onPocket?.(b)
          break
        }
      }

      if (b.isPocketed) continue

      // 1-2. 쿠션(외곽 벽면) 충돌 반사 (탄성 충돌)
      if (b.x < CUSH_L) {
        b.x = CUSH_L
        b.vx = -b.vx * 0.92
        hooks.onCushion?.(Math.abs(b.vx) / 10)
      } else if (b.x > CUSH_R) {
        b.x = CUSH_R
        b.vx = -b.vx * 0.92
        hooks.onCushion?.(Math.abs(b.vx) / 10)
      }

      if (b.y < CUSH_T) {
        b.y = CUSH_T
        b.vy = -b.vy * 0.92
        hooks.onCushion?.(Math.abs(b.vy) / 10)
      } else if (b.y > CUSH_B) {
        b.y = CUSH_B
        b.vy = -b.vy * 0.92
        hooks.onCushion?.(Math.abs(b.vy) / 10)
      }
    }

    // 1-3. 공-공 상호 탄성 충돌
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const b1 = balls[i]
        const b2 = balls[j]
        if (b1.isPocketed || b2.isPocketed) continue

        const dx = b2.x - b1.x
        const dy = b2.y - b1.y
        const dist = Math.hypot(dx, dy)

        if (dist < BALL_RADIUS * 2 && dist > 0.001) {
          hooks.onContact?.(b1, b2)

          // 충돌 법선 벡터
          const nx = dx / dist
          const ny = dy / dist

          // 겹침 해소 (Separation)
          const overlap = BALL_RADIUS * 2 - dist
          b1.x -= nx * overlap * 0.5
          b1.y -= ny * overlap * 0.5
          b2.x += nx * overlap * 0.5
          b2.y += ny * overlap * 0.5

          // 법선 방향 상대 속도 (질량 동일). 서로 다가올 때만 튕긴다 — 멀어지는 공에 힘을 주면 서로 달라붙는다
          const kx = b1.vx - b2.vx
          const ky = b1.vy - b2.vy
          const pNorm = nx * kx + ny * ky
          if (pNorm <= 0) continue

          b1.vx -= pNorm * nx * 0.95
          b1.vy -= pNorm * ny * 0.95
          b2.vx += pNorm * nx * 0.95
          b2.vy += pNorm * ny * 0.95

          hooks.onBallHit?.(Math.min(1.0, Math.hypot(kx, ky) / 10))
        }
      }
    }
  }

  return anyMoving
}

/** 샷 하나를 끝까지 미리 계산한다 (세라가 들어가는 각도를 찾을 때). 공 배열은 복사해서 쓴다 */
export function simulateBilliardShot(balls: BilliardBallState[], angle: number, power: number, maxSteps = 1500) {
  const copy = balls.map((b) => ({ ...b }))
  const cue = copy.find((b) => b.id === 0)
  const pocketed: number[] = []
  let firstHit: number | null = null
  if (!cue || cue.isPocketed) return { pocketed, firstHit }
  const speed = (Math.max(12, power) / 100) * MAX_CUE_SPEED
  cue.vx = Math.cos(angle) * speed
  cue.vy = Math.sin(angle) * speed
  const hooks: PhysicsHooks = {
    onPocket: (b) => { pocketed.push(b.id) },
    onContact: (b1, b2) => {
      if (firstHit !== null) return
      if (b1.id === 0) firstHit = b2.id
      else if (b2.id === 0) firstHit = b1.id
    }
  }
  for (let i = 0; i < maxSteps; i++) {
    if (!stepBilliardPhysics(copy, hooks)) break
  }
  return { pocketed, firstHit }
}
