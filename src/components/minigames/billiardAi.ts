import type { BilliardBallState, MiniGameDifficulty } from '../../store/useMiniGameStore'
import { simulateBilliardShot } from './billiardPhysics'

/**
 * 🤖 당구 AI "세라" 샷 계획 (2026-11-02)
 * 가장 낮은 번호 공(목적구)을 어느 포켓에 넣을지 고르고, 수구가 목적구를 맞힐 자리(고스트볼)를 겨눈다.
 * - 수구→고스트볼, 목적구→포켓 길에 다른 공이 없고 깎는 각도가 너무 크지 않은 포켓만 후보
 * - 힘은 공이 굴러가며 줄어드는 양(1px당 속도 0.012 감소, 충돌 시 0.95)을 거꾸로 계산
 * - 게임 물리는 공을 잘게 끊어 움직여서 실제로 튀는 방향이 이론과 조금 다르다. 그래서 고른 포켓마다
 *   게임과 똑같은 물리로 미리 쳐 보고(각도 ±0.06 범위), 들어가는 각도 구간의 가운데를 겨눈다
 * - 난이도는 조준 오차·힘 오차·포켓 선택 실수로만 정한다
 * 넣을 길이 없으면 목적구를 정면으로 맞히는 안전한 샷을 친다.
 * 수구→목적구 길이 다른 공에 막혀 있으면 쿠션으로 돌려친다 (보통: 1쿠션까지, 어려움: 2쿠션까지, 쉬움: 안 함).
 * 돌려쳐서 넣을 수 있으면 넣고, 못 넣으면 목적구를 먼저 맞혀 파울만 피한다.
 */

export interface TableGeometry {
  ballRadius: number
  pockets: { x: number; y: number }[]
  bounds: { left: number; right: number; top: number; bottom: number }
  pocketRadius: number
  maxSpeed: number
}

export interface AiShot {
  angle: number
  power: number
  kind: 'pot' | 'safety'
  pocketIdx: number | null
  /** 쿠션으로 돌려친 샷이면 맞히는 쿠션 수 (1·2) */
  cushions?: number
}

const SPEED_LOSS_PER_PX = 0.012
const COLLISION_TRANSFER = 0.95
// 포켓에 들어갈 때 남아 있어야 할 속도
const ARRIVE_SPEED = 0.8
const MAX_CUT_COS = 0.28 // 깎는 각도 약 74°까지

// kickCushions: 앞이 막혔을 때 돌려칠 수 있는 쿠션 수
const SKILL: Record<MiniGameDifficulty, { aimSd: number; powerSd: number; pickTopN: number; kickCushions: number }> = {
  easy: { aimSd: 0.024, powerSd: 0.16, pickTopN: 3, kickCushions: 0 },
  normal: { aimSd: 0.012, powerSd: 0.07, pickTopN: 1, kickCushions: 1 },
  hard: { aimSd: 0.005, powerSd: 0.035, pickTopN: 1, kickCushions: 2 }
}

const gaussian = (rng: () => number) => {
  const u = Math.max(1e-9, rng())
  const v = rng()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/** 점 (px, py)에서 선분 (ax, ay)-(bx, by)까지 거리 */
const distToSegment = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
  const dx = bx - ax
  const dy = by - ay
  const len2 = dx * dx + dy * dy
  const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0
  return Math.hypot(px - (ax + dx * t), py - (ay + dy * t))
}

const pathClear = (balls: BilliardBallState[], skipIds: number[], ax: number, ay: number, bx: number, by: number, radius: number) =>
  balls.every((b) => b.isPocketed || skipIds.includes(b.id) || distToSegment(b.x, b.y, ax, ay, bx, by) >= radius * 2 - 0.5)

interface Candidate {
  pocketIdx: number
  ghostX: number
  ghostY: number
  cos: number
  distCueGhost: number
  distTargetPocket: number
  score: number
}

const potCandidates = (balls: BilliardBallState[], cueX: number, cueY: number, targetId: number, geo: TableGeometry): Candidate[] => {
  const target = balls.find((b) => b.id === targetId && !b.isPocketed)
  if (!target) return []
  const r = geo.ballRadius
  const result: Candidate[] = []
  geo.pockets.forEach((pocket, pocketIdx) => {
    const tpX = pocket.x - target.x
    const tpY = pocket.y - target.y
    const distTargetPocket = Math.hypot(tpX, tpY)
    if (distTargetPocket < 1) return
    const ux = tpX / distTargetPocket
    const uy = tpY / distTargetPocket
    // 가운데(사이드) 포켓은 입구가 좁아 거의 수직으로 들어가야 한다
    const isSidePocket = Math.abs(pocket.x - (geo.bounds.left + geo.bounds.right) / 2) < 5
    if (isSidePocket && Math.abs(uy) < 0.55) return
    const ghostX = target.x - ux * r * 2
    const ghostY = target.y - uy * r * 2
    if (ghostX < geo.bounds.left - 1 || ghostX > geo.bounds.right + 1 || ghostY < geo.bounds.top - 1 || ghostY > geo.bounds.bottom + 1) return
    const cgX = ghostX - cueX
    const cgY = ghostY - cueY
    const distCueGhost = Math.hypot(cgX, cgY)
    if (distCueGhost < 1) return
    const cos = (cgX * ux + cgY * uy) / distCueGhost
    if (cos < MAX_CUT_COS) return
    if (!pathClear(balls, [0, targetId], cueX, cueY, ghostX, ghostY, r)) return
    if (!pathClear(balls, [0, targetId], target.x, target.y, pocket.x, pocket.y, r)) return
    const score = (1 - cos) * 3 + (distCueGhost + distTargetPocket) / 900 + (isSidePocket ? 0.25 : 0)
    result.push({ pocketIdx, ghostX, ghostY, cos, distCueGhost, distTargetPocket, score })
  })
  return result.sort((a, b) => a.score - b.score)
}

const speedToPower = (speed: number, geo: TableGeometry) => (speed / geo.maxSpeed) * 100

/** 샷 계획: 각도(라디안)와 힘(%, 12~100) */
export function planAiShot(
  balls: BilliardBallState[],
  targetId: number,
  difficulty: MiniGameDifficulty,
  geo: TableGeometry,
  rng: () => number = Math.random
): AiShot {
  const skill = SKILL[difficulty]
  const cue = balls.find((b) => b.id === 0)
  const target = balls.find((b) => b.id === targetId && !b.isPocketed)
  if (!cue || !target) return { angle: 0, power: 30, kind: 'safety', pocketIdx: null }

  const candidates = potCandidates(balls, cue.x, cue.y, targetId, geo).slice(0, MAX_POCKETS_TRIED)
  if (candidates.length) {
    const refined: { candidate: Candidate; angle: number; power: number; width: number }[] = []
    for (const c of candidates) {
      const arriveTarget = ARRIVE_SPEED + SPEED_LOSS_PER_PX * c.distTargetPocket
      const cueAtContact = arriveTarget / (COLLISION_TRANSFER * Math.max(0.3, c.cos))
      const basePower = speedToPower((cueAtContact + SPEED_LOSS_PER_PX * c.distCueGhost) * 1.25 + 0.5, geo)
      const baseAngle = Math.atan2(c.ghostY - cue.y, c.ghostX - cue.x)
      const window = findPottingWindow(balls, targetId, baseAngle, basePower)
      if (window.width > 0) refined.push({ candidate: c, ...window })
      // 이지는 여러 포켓을 견주어 가끔 덜 좋은 곳을 고르므로 끝까지, 나머지는 충분히 쉬운 포켓을 찾으면 멈춘다
      if (skill.pickTopN === 1 && window.width >= GOOD_WINDOW) break
    }
    refined.sort((a, b) => b.width - a.width)
    if (refined.length) {
      // 이지는 가끔 최선이 아닌 포켓을 고른다
      const pick = refined[Math.min(refined.length - 1, Math.floor(rng() * skill.pickTopN))]
      const angle = pick.angle + gaussian(rng) * skill.aimSd
      const power = pick.power * (1 + gaussian(rng) * skill.powerSd)
      return { angle, power: Math.max(14, Math.min(100, power)), kind: 'pot', pocketIdx: pick.candidate.pocketIdx }
    }
  }

  // 🎱 앞이 막혔으면 쿠션으로 돌려친다
  const directBlocked = !pathClear(balls, [0, targetId], cue.x, cue.y, target.x, target.y, geo.ballRadius)
  if (directBlocked && skill.kickCushions > 0) {
    const kick = planKickShot(balls, cue, target, skill.kickCushions, geo)
    if (kick) {
      const angle = kick.angle + gaussian(rng) * skill.aimSd
      const power = kick.power * (1 + gaussian(rng) * skill.powerSd * 0.5)
      return { angle, power: Math.max(14, Math.min(100, power)), kind: kick.pocketIdx === null ? 'safety' : 'pot', pocketIdx: kick.pocketIdx, cushions: kick.cushions }
    }
  }

  // 넣을 길이 없으면 목적구를 정면으로 맞혀 파울만 피한다 (목적구가 200px쯤 굴러가는 힘)
  // 미리 쳐 봐서 목적구를 먼저 맞히고 수구가 빠지지 않는 힘을 고른다
  const dist = Math.hypot(target.x - cue.x, target.y - cue.y)
  const speed = (ARRIVE_SPEED + SPEED_LOSS_PER_PX * 200) / COLLISION_TRANSFER + SPEED_LOSS_PER_PX * dist
  const directAngle = Math.atan2(target.y - cue.y, target.x - cue.x)
  const basePower = Math.max(16, Math.min(70, speedToPower(speed, geo)))
  let safePower = basePower
  for (const factor of [1, 0.75, 1.3, 0.55]) {
    const result = simulateBilliardShot(balls, directAngle, basePower * factor, SIM_MAX_STEPS)
    if (result.firstHit === targetId && !result.pocketed.includes(0)) {
      safePower = basePower * factor
      // 운 좋게 들어가면 그 힘을 쓴다
      if (result.pocketed.includes(targetId)) break
      if (factor === 1) break
    }
  }
  const angle = directAngle + gaussian(rng) * skill.aimSd * 0.5
  return { angle, power: Math.max(14, Math.min(100, safePower)), kind: 'safety', pocketIdx: null }
}

// 미리 쳐 보는 양: 포켓 3곳 × 각도 25개 × 힘 2가지까지 (화면이 멈추지 않도록 쉬운 구간을 찾으면 바로 멈춘다)
const MAX_POCKETS_TRIED = 3
const WINDOW_RANGE = 0.06
const WINDOW_STEP = 0.005
const GOOD_WINDOW = 0.02
const SIM_MAX_STEPS = 900

/**
 * 게임 물리로 미리 쳐 보며 "목적구를 먼저 맞히고, 목적구가 들어가고, 수구는 안 빠지는" 각도 구간을 찾는다.
 * 힘은 계산값 → 더 세게 → 더 약하게 순서로 해 보고, 가장 넓은 구간의 가운데 각도를 돌려준다(넓을수록 쉬운 샷)
 */
function findPottingWindow(balls: BilliardBallState[], targetId: number, baseAngle: number, basePower: number) {
  let best = { angle: baseAngle, power: basePower, width: 0 }
  for (const factor of [1, 1.3]) {
    const power = Math.min(100, basePower * factor)
    let runStart = -1
    const steps = Math.round((WINDOW_RANGE * 2) / WINDOW_STEP)
    for (let i = 0; i <= steps + 1; i++) {
      let ok = false
      if (i <= steps) {
        const offset = -WINDOW_RANGE + i * WINDOW_STEP
        const result = simulateBilliardShot(balls, baseAngle + offset, power, SIM_MAX_STEPS)
        ok = result.firstHit === targetId && result.pocketed.includes(targetId) && !result.pocketed.includes(0)
      }
      if (ok && runStart < 0) runStart = i
      if (!ok && runStart >= 0) {
        const width = (i - runStart) * WINDOW_STEP
        if (width > best.width) {
          const center = -WINDOW_RANGE + ((runStart + i - 1) / 2) * WINDOW_STEP
          best = { angle: baseAngle + center, power, width }
        }
        runStart = -1
      }
    }
    // 계산한 힘으로 충분히 넓은 구간이 나오면 더 해 보지 않는다
    if (best.width >= GOOD_WINDOW) break
  }
  return best
}

// ------------------------------------------------------------------
// 🎱 쿠션 돌려치기 (킥샷)
// 쿠션에 맞으면 쿠션에 수직인 속도만 0.92배가 된다(billiardPhysics). 그래서 거울에 비친 점을 겨누되,
// 쿠션 너머 거리를 1/0.92배로 늘린 점을 겨누면 굴러가는 길이 정확히 맞는다 (마찰은 방향을 바꾸지 않는다).
// 2쿠션은 마지막 쿠션부터 거꾸로 비춰 겨눈다. 후보 길마다 게임 물리로 미리 쳐 보고 맞는 각도 구간의 가운데를 겨눈다.
// ------------------------------------------------------------------
const CUSHION_RESTITUTION = 0.92
// 쿠션 하나를 거칠 때 속도가 줄어드는 정도 (어림값 — 미리 쳐 볼 때 힘을 더 세게도 해 본다)
const CUSHION_SPEED_KEEP = 0.93
const MAX_KICK_TRIES = 2
// 거울 계산이 거의 정확해서 직접 넣기(±0.06)보다 좁게 미리 쳐 본다 (세라 차례에 화면이 멈추지 않게)
const KICK_WINDOW_RANGE = 0.03
// 맞는 각도 구간이 이보다 좁으면 운에 맡기는 샷이라 고르지 않는다
const KICK_MIN_WINDOW = 0.006
// 돌려치기는 굴러가는 길이 길어 조금 더 오래 계산한다
const KICK_SIM_STEPS = 1200

type Wall = { axis: 'x' | 'y'; at: number }

const wallsOf = (geo: TableGeometry): Wall[] => [
  { axis: 'x', at: geo.bounds.left },
  { axis: 'x', at: geo.bounds.right },
  { axis: 'y', at: geo.bounds.top },
  { axis: 'y', at: geo.bounds.bottom }
]

/** 쿠션 너머로 비춘 점 (쿠션까지 거리를 1/반발계수만큼 늘린다) */
const mirror = (x: number, y: number, wall: Wall) =>
  wall.axis === 'x'
    ? { x: wall.at + (wall.at - x) / CUSHION_RESTITUTION, y }
    : { x, y: wall.at + (wall.at - y) / CUSHION_RESTITUTION }

/** 비춘 점을 다시 쿠션 안쪽으로 되돌린다 (mirror의 반대) */
const unmirror = (x: number, y: number, wall: Wall) =>
  wall.axis === 'x'
    ? { x: wall.at - (x - wall.at) * CUSHION_RESTITUTION, y }
    : { x, y: wall.at - (y - wall.at) * CUSHION_RESTITUTION }

interface KickPath {
  walls: Wall[]
  angle: number
  /** 굴러가는 전체 길이 */
  length: number
  /** 목적구에 닿기 직전 수구가 오는 방향 */
  lastDx: number
  lastDy: number
}

/**
 * 수구 → 쿠션들 → 겨눌 점(ax, ay)까지의 길. 쿠션에 닿는 점이 쿠션 위(포켓 근처 아님)이고
 * 길 중간에 다른 공이 없을 때만 돌려준다
 */
function traceKick(balls: BilliardBallState[], cueX: number, cueY: number, ax: number, ay: number, walls: Wall[], skipIds: number[], geo: TableGeometry): KickPath | null {
  // 마지막 쿠션부터 거꾸로 비춰 처음에 겨눌 점을 구한다
  let image = { x: ax, y: ay }
  for (let i = walls.length - 1; i >= 0; i--) image = mirror(image.x, image.y, walls[i])
  const angle = Math.atan2(image.y - cueY, image.x - cueX)
  const r = geo.ballRadius
  let fromX = cueX
  let fromY = cueY
  let aimX = image.x
  let aimY = image.y
  let length = 0
  for (const wall of walls) {
    // 지금 점에서 비춘 점으로 가는 직선이 이 쿠션에 닿는 곳
    const span = wall.axis === 'x' ? aimX - fromX : aimY - fromY
    if (Math.abs(span) < 1e-6) return null
    const t = (wall.at - (wall.axis === 'x' ? fromX : fromY)) / span
    if (t <= 0.001 || t >= 1) return null
    const hitX = fromX + (aimX - fromX) * t
    const hitY = fromY + (aimY - fromY) * t
    if (hitX < geo.bounds.left - 0.5 || hitX > geo.bounds.right + 0.5 || hitY < geo.bounds.top - 0.5 || hitY > geo.bounds.bottom + 0.5) return null
    // 포켓 입구 근처 쿠션에 맞으면 수구가 빠진다
    if (geo.pockets.some((p) => Math.hypot(hitX - p.x, hitY - p.y) < geo.pocketRadius + r + 6)) return null
    if (!pathClear(balls, skipIds, fromX, fromY, hitX, hitY, r)) return null
    length += Math.hypot(hitX - fromX, hitY - fromY)
    const back = unmirror(aimX, aimY, wall)
    fromX = hitX
    fromY = hitY
    aimX = back.x
    aimY = back.y
  }
  if (!pathClear(balls, skipIds, fromX, fromY, ax, ay, r)) return null
  const lastLen = Math.hypot(ax - fromX, ay - fromY)
  if (lastLen < 1) return null
  length += lastLen
  return { walls, angle, length, lastDx: (ax - fromX) / lastLen, lastDy: (ay - fromY) / lastLen }
}

/** 쿠션 순서: 1쿠션 4가지, 2쿠션은 서로 다른 쿠션 2개 12가지 */
function wallSequences(maxCushions: number, geo: TableGeometry): Wall[][] {
  const walls = wallsOf(geo)
  const seqs: Wall[][] = walls.map((w) => [w])
  if (maxCushions >= 2) for (const a of walls) for (const b of walls) if (a !== b) seqs.push([a, b])
  return seqs
}

/**
 * 앞이 막혔을 때 돌려치기: 넣을 수 있는 길을 먼저 찾고, 없으면 목적구를 먼저 맞히기만 하는 길(파울 피하기)을 찾는다.
 * 쿠션 수가 적고 길이 짧고 덜 깎는 길부터 미리 쳐 본다
 */
function planKickShot(balls: BilliardBallState[], cue: BilliardBallState, target: BilliardBallState, maxCushions: number, geo: TableGeometry) {
  const r = geo.ballRadius
  const seqs = wallSequences(maxCushions, geo)

  // 1) 돌려쳐서 넣기
  const pots: { path: KickPath; pocketIdx: number; cos: number; distTargetPocket: number; score: number }[] = []
  geo.pockets.forEach((pocket, pocketIdx) => {
    const tpX = pocket.x - target.x
    const tpY = pocket.y - target.y
    const distTargetPocket = Math.hypot(tpX, tpY)
    if (distTargetPocket < 1) return
    const ux = tpX / distTargetPocket
    const uy = tpY / distTargetPocket
    const isSidePocket = Math.abs(pocket.x - (geo.bounds.left + geo.bounds.right) / 2) < 5
    if (isSidePocket && Math.abs(uy) < 0.55) return
    if (!pathClear(balls, [0, target.id], target.x, target.y, pocket.x, pocket.y, r)) return
    const ghostX = target.x - ux * r * 2
    const ghostY = target.y - uy * r * 2
    for (const walls of seqs) {
      const path = traceKick(balls, cue.x, cue.y, ghostX, ghostY, walls, [0, target.id], geo)
      if (!path) continue
      const cos = path.lastDx * ux + path.lastDy * uy
      if (cos < MAX_CUT_COS + 0.1) continue
      pots.push({ path, pocketIdx, cos, distTargetPocket, score: walls.length * 0.6 + (1 - cos) * 3 + (path.length + distTargetPocket) / 900 })
    }
  })
  pots.sort((a, b) => a.score - b.score)
  for (const c of pots.slice(0, MAX_KICK_TRIES)) {
    const arriveTarget = ARRIVE_SPEED + SPEED_LOSS_PER_PX * c.distTargetPocket
    const cueAtContact = arriveTarget / (COLLISION_TRANSFER * Math.max(0.3, c.cos))
    const speed = (cueAtContact + SPEED_LOSS_PER_PX * c.path.length) / Math.pow(CUSHION_SPEED_KEEP, c.path.walls.length)
    const basePower = Math.min(100, speedToPower(speed * 1.25 + 0.5, geo))
    const window = findShotWindow(balls, c.path.angle, basePower, (res) => res.firstHit === target.id && res.pocketed.includes(target.id) && !res.pocketed.includes(0))
    if (window.width >= KICK_MIN_WINDOW) return { angle: window.angle, power: window.power, pocketIdx: c.pocketIdx as number | null, cushions: c.path.walls.length }
  }

  // 2) 돌려쳐서 목적구 먼저 맞히기 (가운데를 겨누면 맞을 수 있는 폭이 가장 넓다)
  const hits: { path: KickPath; score: number }[] = []
  for (const walls of seqs) {
    const path = traceKick(balls, cue.x, cue.y, target.x, target.y, walls, [0, target.id], geo)
    if (path) hits.push({ path, score: walls.length * 0.6 + path.length / 900 })
  }
  hits.sort((a, b) => a.score - b.score)
  for (const c of hits.slice(0, MAX_KICK_TRIES)) {
    // 목적구가 150px쯤 굴러갈 만큼
    const speed = ((ARRIVE_SPEED + SPEED_LOSS_PER_PX * 150) / COLLISION_TRANSFER + SPEED_LOSS_PER_PX * c.path.length) / Math.pow(CUSHION_SPEED_KEEP, c.path.walls.length)
    const basePower = Math.max(18, Math.min(85, speedToPower(speed * 1.15, geo)))
    const window = findShotWindow(balls, c.path.angle, basePower, (res) => res.firstHit === target.id && !res.pocketed.includes(0))
    if (window.width >= KICK_MIN_WINDOW) return { angle: window.angle, power: window.power, pocketIdx: null, cushions: c.path.walls.length }
  }
  return null
}

/** findPottingWindow와 같은 방식 — 성공 조건(ok)만 바꿔 쓴다 */
function findShotWindow(balls: BilliardBallState[], baseAngle: number, basePower: number, ok: (res: ReturnType<typeof simulateBilliardShot>) => boolean, range = KICK_WINDOW_RANGE) {
  let best = { angle: baseAngle, power: basePower, width: 0 }
  for (const factor of [1, 1.3]) {
    const power = Math.min(100, basePower * factor)
    let runStart = -1
    const steps = Math.round((range * 2) / WINDOW_STEP)
    for (let i = 0; i <= steps + 1; i++) {
      const pass = i <= steps && ok(simulateBilliardShot(balls, baseAngle - range + i * WINDOW_STEP, power, KICK_SIM_STEPS))
      if (pass && runStart < 0) runStart = i
      if (!pass && runStart >= 0) {
        const width = (i - runStart) * WINDOW_STEP
        if (width > best.width) best = { angle: baseAngle - range + ((runStart + i - 1) / 2) * WINDOW_STEP, power, width }
        runStart = -1
      }
    }
    if (best.width >= GOOD_WINDOW) break
  }
  return best
}

/**
 * 프리볼: 목적구를 포켓으로 똑바로 넣기 좋은 자리(목적구 뒤 일직선)에 수구를 놓는다.
 * 놓을 자리가 없으면 null (부르는 쪽이 빈자리를 찾는다)
 */
export function planCuePlacement(
  balls: BilliardBallState[],
  targetId: number,
  geo: TableGeometry,
  canPlace: (x: number, y: number) => boolean
): { x: number; y: number } | null {
  const target = balls.find((b) => b.id === targetId && !b.isPocketed)
  if (!target) return null
  const r = geo.ballRadius
  const options: { x: number; y: number; score: number }[] = []
  geo.pockets.forEach((pocket) => {
    const dx = pocket.x - target.x
    const dy = pocket.y - target.y
    const d = Math.hypot(dx, dy)
    if (d < 1) return
    const ux = dx / d
    const uy = dy / d
    const isSidePocket = Math.abs(pocket.x - (geo.bounds.left + geo.bounds.right) / 2) < 5
    if (isSidePocket && Math.abs(uy) < 0.55) return
    if (!pathClear(balls, [0, target.id], target.x, target.y, pocket.x, pocket.y, r)) return
    for (const back of [110, 160, 80, 220, 60]) {
      const x = target.x - ux * (r * 2 + back)
      const y = target.y - uy * (r * 2 + back)
      if (x < geo.bounds.left || x > geo.bounds.right || y < geo.bounds.top || y > geo.bounds.bottom) continue
      if (!canPlace(x, y)) continue
      if (!pathClear(balls, [0, target.id], x, y, target.x - ux * r * 2, target.y - uy * r * 2, r)) continue
      options.push({ x, y, score: d / 900 + Math.abs(back - 110) / 400 })
      break
    }
  })
  options.sort((a, b) => a.score - b.score)
  return options[0] ? { x: options[0].x, y: options[0].y } : null
}
