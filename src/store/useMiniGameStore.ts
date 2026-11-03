import { create } from 'zustand'

export interface BilliardBallState {
  id: number // 0: 수구(흰색), 1~9: 목적구
  x: number  // 당구대 좌표 (0 ~ BILLIARD_TABLE_WIDTH)
  y: number  // 당구대 좌표 (0 ~ BILLIARD_TABLE_HEIGHT)
  vx: number
  vy: number
  isPocketed: boolean
}

// 🎱 당구대 규격 (화면 캔버스·물리·랙 배치가 모두 같은 값을 쓴다)
export const BILLIARD_TABLE_WIDTH = 840
export const BILLIARD_TABLE_HEIGHT = 440
export const BILLIARD_BALL_RADIUS = 12
export const BILLIARD_RAIL = 38 // 테두리(쿠션)까지의 두께
export const BILLIARD_HEAD_SPOT = { x: BILLIARD_TABLE_WIDTH * 0.25, y: BILLIARD_TABLE_HEIGHT * 0.5 }
export const BILLIARD_FOOT_SPOT = { x: BILLIARD_TABLE_WIDTH * 0.70, y: BILLIARD_TABLE_HEIGHT * 0.5 }

// 9볼 다이아몬드 표준 랙 초기화 헬퍼
export function createInitial9BallRack(): BilliardBallState[] {
  const R = BILLIARD_BALL_RADIUS

  // 수구 (Cue Ball) 초기 위치: 헤드스팟
  const balls: BilliardBallState[] = [
    { id: 0, x: BILLIARD_HEAD_SPOT.x, y: BILLIARD_HEAD_SPOT.y, vx: 0, vy: 0, isPocketed: false }
  ]

  // 나인볼 다이아몬드 랙 정점: 풋스팟
  const apexX = BILLIARD_FOOT_SPOT.x
  const apexY = BILLIARD_FOOT_SPOT.y
  const dx = R * Math.sqrt(3) + 0.6 // 열 간격
  const dy = R * 2 + 0.6            // 공 간격 (공끼리 살짝 떨어뜨려 시작부터 겹치지 않게)

  // 나인볼 랙 배치 규칙: 1번은 맨 앞(Apex), 9번은 정중앙
  // 1열: 1번
  // 2열: 2번, 3번
  // 3열: 4번, 9번(중앙!), 5번
  // 4열: 6번, 7번
  // 5열: 8번
  const rackLayout: { id: number; col: number; rowOffset: number }[] = [
    { id: 1, col: 0, rowOffset: 0 },
    { id: 2, col: 1, rowOffset: -0.5 },
    { id: 3, col: 1, rowOffset: 0.5 },
    { id: 4, col: 2, rowOffset: -1.0 },
    { id: 9, col: 2, rowOffset: 0.0 }, // 9번은 정중앙
    { id: 5, col: 2, rowOffset: 1.0 },
    { id: 6, col: 3, rowOffset: -0.5 },
    { id: 7, col: 3, rowOffset: 0.5 },
    { id: 8, col: 4, rowOffset: 0.0 }
  ]

  rackLayout.forEach(({ id, col, rowOffset }) => {
    balls.push({
      id,
      x: apexX + col * dx,
      y: apexY + rowOffset * dy,
      vx: 0,
      vy: 0,
      isPocketed: false
    })
  })

  return balls
}

// 온라인 대전(같은 건물 동료와 1:1) 상태
export type MiniGameKind = 'billiard' | 'pingpong'

export interface OnlineMatch {
  game: MiniGameKind
  sessionId: string
  peerId: string
  peerName: string
  /** host = 초대한 사람(탁구는 물리 계산 담당), guest = 초대받은 사람 */
  role: 'host' | 'guest'
  /** outgoing = 상대 수락 대기, active = 대전 중 */
  phase: 'outgoing' | 'active'
}

export interface MiniGameInvite {
  game: MiniGameKind
  sessionId: string
  peerId: string
  peerName: string
}

// 당구 한 판의 선수별 기록 (경기 기록 저장용). 배열 순서 = 플레이어 순서
export interface BilliardMatchStats {
  startedAt: number | null
  shots: number[]
  pocketed: number[]
  fouls: number[]
}

export const emptyBilliardStats = (playerCount: number): BilliardMatchStats => ({
  startedAt: null,
  shots: Array(playerCount).fill(0),
  pocketed: Array(playerCount).fill(0),
  fouls: Array(playerCount).fill(0)
})

// 🤖 당구 AI 상대 (혼자 칠 때 기본 상대). seats = AI가 치는 플레이어 순번(기본 2번 자리)
export const BILLIARD_AI_NAME = '세라 (AI)'
export type MiniGameDifficulty = 'easy' | 'normal' | 'hard'
export interface BilliardAiSettings {
  enabled: boolean
  difficulty: MiniGameDifficulty
  seats: number[]
}

// 🏆 판수: 1판(기본) 또는 3판 2선승. wins = 플레이어 순서별 이긴 랙 수, rackWinners = 랙마다 이긴 사람
export type SeriesFormat = 1 | 3
export interface BilliardSeries {
  format: SeriesFormat
  wins: number[]
  rackNo: number
  rackWinners: string[]
}
export const seriesWinsNeeded = (format: SeriesFormat) => (format === 3 ? 2 : 1)
const emptyBilliardSeries = (format: SeriesFormat, playerCount: number): BilliardSeries => ({
  format,
  wins: Array(playerCount).fill(0),
  rackNo: 1,
  rackWinners: []
})

// 당구 한 판의 전체 상태(온라인 대전 시 상대에게 그대로 보낸다)
export interface BilliardSnapshot {
  balls: BilliardBallState[]
  players: string[]
  currentTurnIdx: number
  turnCount: number
  foulMessage: string | null
  lastShotMessage: string | null
  winner: string | null
  ballInHand: boolean
  stats?: BilliardMatchStats
  series?: BilliardSeries
}

interface MiniGameState {
  // 🏓 탁구 미니게임 상태
  showPingpongModal: boolean
  pingpongPlayers: [string, string] // [나(화면 아래), 상대(화면 위)]
  aiDifficulty: 'easy' | 'normal' | 'hard'
  isPaused: boolean

  openPingpong: () => void
  closePingpong: () => void
  setPingpongPlayers: (players: [string, string]) => void
  setAiDifficulty: (diff: 'easy' | 'normal' | 'hard') => void
  setIsPaused: (isPaused: boolean) => void
  togglePausePingpong: () => void

  // 🎱 나인볼 당구 미니게임 상태 (지속성 세션)
  showBilliardModal: boolean
  billiardPlayers: string[]
  currentTurnIdx: number
  billiardBalls: BilliardBallState[]
  foulMessage: string | null
  lastShotMessage: string | null
  winner: string | null
  turnCount: number
  /** 파울 직후: 다음 플레이어가 수구를 원하는 곳에 놓고 친다(프리볼) */
  ballInHand: boolean
  /** 새 랙·상대 상태 수신처럼 공 배치를 통째로 바꿀 때마다 1씩 올린다(화면 물리 상태 재동기화 신호) */
  billiardSyncVersion: number
  /** 이번 판 선수별 샷·넣은 공·파울 수 (경기 기록용, 3판 2선승이면 시리즈 전체 합계) */
  billiardStats: BilliardMatchStats
  billiardAi: BilliardAiSettings
  billiardSeries: BilliardSeries

  openBilliard: () => void
  closeBilliard: () => void
  setBilliardPlayers: (players: string[]) => void
  setCurrentTurnIdx: (idx: number) => void
  setFoulMessage: (msg: string | null) => void
  setLastShotMessage: (msg: string | null) => void
  setWinner: (winner: string | null) => void
  setBallInHand: (ballInHand: boolean) => void
  updateBilliardBalls: (balls: BilliardBallState[]) => void
  resetBilliardGame: () => void
  nextBilliardTurn: () => void
  getBilliardSnapshot: () => BilliardSnapshot
  applyBilliardSnapshot: (snapshot: BilliardSnapshot) => void
  /** 샷 1번의 결과를 이번 판 기록에 더한다 */
  recordBilliardShot: (playerIdx: number, pocketedCount: number, foul: boolean) => void
  setBilliardAi: (patch: Partial<BilliardAiSettings>) => void
  /** 판수를 바꾸면 새 게임으로 시작한다 */
  setBilliardSeriesFormat: (format: SeriesFormat) => void
  /** 랙 하나를 이긴 사람 기록 → 시리즈가 끝났으면 'series', 아니면 'next' */
  finishBilliardRack: (winnerIdx: number) => 'series' | 'next'
  /** 3판 2선승의 다음 랙: 새로 깔고 nextIdx 플레이어가 브레이크 */
  startNextBilliardRack: (nextIdx: number, message: string) => void

  // 🌐 온라인 1:1 대전
  onlineMatch: OnlineMatch | null
  incomingInvite: MiniGameInvite | null
  matchNotice: string | null
}

export const useMiniGameStore = create<MiniGameState>((set, get) => ({
  // 탁구 초기값
  showPingpongModal: false,
  pingpongPlayers: ['나', '팀장님 (AI)'],
  aiDifficulty: 'normal',
  isPaused: false,

  openPingpong: () => {
    set({ showPingpongModal: true, isPaused: false })
  },
  closePingpong: () => set({ showPingpongModal: false, isPaused: false }),
  setPingpongPlayers: (players) => set({ pingpongPlayers: players }),
  setAiDifficulty: (aiDifficulty) => set({ aiDifficulty }),
  setIsPaused: (isPaused) => set({ isPaused }),
  togglePausePingpong: () => set((state) => ({ isPaused: !state.isPaused })),

  // 당구 초기값 (나인볼 다이아몬드 랙)
  showBilliardModal: false,
  billiardPlayers: ['Player 1', BILLIARD_AI_NAME],
  currentTurnIdx: 0,
  billiardBalls: createInitial9BallRack(),
  foulMessage: null,
  lastShotMessage: '게임을 시작합니다! 수구(흰 공)로 가장 낮은 번호의 공(1번)을 먼저 맞추세요.',
  winner: null,
  turnCount: 1,
  ballInHand: false,
  billiardSyncVersion: 0,
  billiardStats: emptyBilliardStats(2),
  billiardAi: { enabled: true, difficulty: 'normal', seats: [1] },
  billiardSeries: emptyBilliardSeries(1, 2),

  openBilliard: () => {
    set({ showBilliardModal: true })
  },
  closeBilliard: () => set({ showBilliardModal: false }),
  setBilliardPlayers: (billiardPlayers) => set((state) => ({
    billiardPlayers,
    billiardStats: emptyBilliardStats(billiardPlayers.length),
    billiardSeries: emptyBilliardSeries(state.billiardSeries.format, billiardPlayers.length)
  })),
  setCurrentTurnIdx: (currentTurnIdx) => set({ currentTurnIdx }),
  setFoulMessage: (foulMessage) => set({ foulMessage }),
  setLastShotMessage: (lastShotMessage) => set({ lastShotMessage }),
  setWinner: (winner) => set({ winner }),
  setBallInHand: (ballInHand) => set({ ballInHand }),
  updateBilliardBalls: (billiardBalls) => set({ billiardBalls }),

  resetBilliardGame: () => set((state) => ({
    billiardBalls: createInitial9BallRack(),
    currentTurnIdx: 0,
    foulMessage: null,
    lastShotMessage: '새 게임이 시작되었습니다! 9볼 랙 정렬 완료.',
    winner: null,
    turnCount: 1,
    ballInHand: false,
    billiardSyncVersion: state.billiardSyncVersion + 1,
    billiardStats: emptyBilliardStats(state.billiardPlayers.length),
    billiardSeries: emptyBilliardSeries(state.billiardSeries.format, state.billiardPlayers.length)
  })),

  nextBilliardTurn: () => {
    const { billiardPlayers, currentTurnIdx, turnCount } = get()
    const nextIdx = (currentTurnIdx + 1) % billiardPlayers.length
    set({
      currentTurnIdx: nextIdx,
      turnCount: turnCount + 1,
      foulMessage: null
    })
  },

  getBilliardSnapshot: () => {
    const s = get()
    return {
      balls: s.billiardBalls.map((b) => ({ ...b })),
      players: [...s.billiardPlayers],
      currentTurnIdx: s.currentTurnIdx,
      turnCount: s.turnCount,
      foulMessage: s.foulMessage,
      lastShotMessage: s.lastShotMessage,
      winner: s.winner,
      ballInHand: s.ballInHand,
      stats: { ...s.billiardStats, shots: [...s.billiardStats.shots], pocketed: [...s.billiardStats.pocketed], fouls: [...s.billiardStats.fouls] },
      series: { ...s.billiardSeries, wins: [...s.billiardSeries.wins], rackWinners: [...s.billiardSeries.rackWinners] }
    }
  },

  applyBilliardSnapshot: (snapshot) => set((state) => ({
    billiardBalls: snapshot.balls.map((b) => ({ ...b })),
    billiardPlayers: [...snapshot.players],
    currentTurnIdx: snapshot.currentTurnIdx,
    turnCount: snapshot.turnCount,
    foulMessage: snapshot.foulMessage,
    lastShotMessage: snapshot.lastShotMessage,
    winner: snapshot.winner,
    ballInHand: snapshot.ballInHand,
    billiardSyncVersion: state.billiardSyncVersion + 1,
    billiardStats: snapshot.stats ?? state.billiardStats,
    billiardSeries: snapshot.series ?? state.billiardSeries
  })),

  setBilliardAi: (patch) => set((state) => ({ billiardAi: { ...state.billiardAi, ...patch } })),

  setBilliardSeriesFormat: (format) => {
    set((state) => ({ billiardSeries: emptyBilliardSeries(format, state.billiardPlayers.length) }))
    get().resetBilliardGame()
  },

  finishBilliardRack: (winnerIdx) => {
    const { billiardSeries, billiardPlayers } = get()
    const wins = billiardPlayers.map((_, i) => (billiardSeries.wins[i] || 0) + (i === winnerIdx ? 1 : 0))
    set({
      billiardSeries: {
        ...billiardSeries,
        wins,
        rackWinners: [...billiardSeries.rackWinners, billiardPlayers[winnerIdx] || `Player ${winnerIdx + 1}`]
      }
    })
    return wins[winnerIdx] >= seriesWinsNeeded(billiardSeries.format) ? 'series' : 'next'
  },

  startNextBilliardRack: (nextIdx, message) => set((state) => ({
    billiardBalls: createInitial9BallRack(),
    currentTurnIdx: nextIdx,
    foulMessage: null,
    lastShotMessage: message,
    winner: null,
    turnCount: state.turnCount + 1,
    ballInHand: false,
    billiardSyncVersion: state.billiardSyncVersion + 1,
    billiardSeries: { ...state.billiardSeries, rackNo: state.billiardSeries.rackNo + 1 }
  })),

  recordBilliardShot: (playerIdx, pocketedCount, foul) => set((state) => {
    const count = state.billiardPlayers.length
    const base = state.billiardStats.shots.length === count ? state.billiardStats : emptyBilliardStats(count)
    const bump = (list: number[], by: number) => list.map((v, i) => (i === playerIdx ? v + by : v))
    return {
      billiardStats: {
        startedAt: base.startedAt ?? Date.now(),
        shots: bump(base.shots, 1),
        pocketed: bump(base.pocketed, pocketedCount),
        fouls: bump(base.fouls, foul ? 1 : 0)
      }
    }
  }),

  onlineMatch: null,
  incomingInvite: null,
  matchNotice: null
}))
