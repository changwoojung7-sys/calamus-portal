"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useMiniGameStore, seriesWinsNeeded, type SeriesFormat } from '../../store/useMiniGameStore'
import { useOfficeStore } from '../../store/useOfficeStore'
import { miniGameAudio } from '../../services/miniGameAudio'
import { miniGameNetwork } from '../../services/miniGameNetwork'
import { OnlineInvitePicker } from './MiniGameOnline'
import { MiniGameRecordBoard } from './MiniGameRecordBoard'
import { PingpongVictoryCelebration } from './PingpongVictoryCelebration'
import { miniGameRecords, isMatchRecordingAvailable } from '../../services/miniGameRecords'
import { X, Trophy, Play, ArrowLeft, ArrowUp, ArrowRight, Pause, Users, Bot, Globe, Loader2, ClipboardList } from 'lucide-react'

// 공격 코스 옵션 타입
type AttackCourse = 'left' | 'center' | 'right'
// 물리 좌표의 두 진영: player = 화면 아래(나 / 온라인 방장), cpu = 화면 위(AI / 온라인 상대)
type Side = 'player' | 'cpu'
type Difficulty = 'easy' | 'normal' | 'hard'
// 온라인 상대 화면에서 다시 낼 효과음
type FxEvent = 'hit' | 'smash' | 'bounce' | 'net' | 'cheer'

// 물리는 모니터 주사율과 무관하게 1초에 60번 고정 간격으로 계산한다(144Hz 모니터에서 빨라지지 않게)
const STEP_MS = 1000 / 60
const MAX_STEPS_PER_FRAME = 6
const TARGET_SCORE = 21
// 클릭(또는 스페이스) 후 이 시간 안에 공을 맞히면 스매시
const SMASH_WINDOW_MS = 450
// 득점 후 서브까지 잠깐 쉬는 시간 (스텝 수, 약 0.75초)
const SERVE_DELAY_STEPS = 45
// 온라인 대전: 방장 → 상대 상태 전송(2스텝 = 초당 30회), 상대 → 방장 입력 전송(2스텝마다, 바뀐 경우만)
const SNAPSHOT_EVERY_STEPS = 2
const INPUT_EVERY_STEPS = 2

const round4 = (v: number) => Math.round(v * 10000) / 10000
const round2 = (v: number) => Math.round(v * 100) / 100

const COURSE_TARGET_X: Record<AttackCourse, number> = { left: -0.65, center: 0.0, right: 0.65 }

// 🤖 AI 실력: maxStep = 한 스텝에 움직일 수 있는 최대 거리, aimError = 멀리 뛰어야 할 때의 최대 조준 오차
// (오차는 이동 거리에 비례 — 정면 공은 거의 0). 스매시는 읽기 어려워 오차가 더 크다.
const AI_SKILL: Record<Difficulty, { maxStep: number; aimError: number }> = {
  // 계산 결과 받는 비율 — 정면 공: 모두 100% / 구석 공: 이지 58%·보통 85%·하드 91% / 구석 스매시: 0%·52%·75%
  easy: { maxStep: 0.016, aimError: 0.7 },
  normal: { maxStep: 0.035, aimError: 0.5 },
  hard: { maxStep: 0.06, aimError: 0.44 }
}
const AI_SMASH_ERROR_MULTIPLIER = 1.5
const AI_HIT_MARGIN_X = 0.32

// 🏓 서브: 내 코트에 한 번 → 네트를 넘어 상대 코트에 한 번 튄다. 사람은 클릭/스페이스로 넣고, 안 누르면 3초 뒤 자동
const SERVE_AUTO_STEPS = 180
// 마구 서브: 서브 5개마다 1~2번 랜덤하게 나온다
type MagicServe = 'curve' | 'lightning' | 'drop' | 'wobble' | 'backspin'
const MAGIC_SERVES: MagicServe[] = ['curve', 'lightning', 'drop', 'wobble', 'backspin']
const SERVES_PER_TURN = 5
// 보통 템포 기준 값 (z0 = 출발 높이, vz0 = 처음 위아래 속도, vy = 앞으로 가는 속도, bounce1 = 내 코트에서 튀는 힘, bounce2 = 상대 코트에서 튀는 힘)
// 계산 확인: 모두 내 코트 y≈0.65~0.75에 튀고, 네트를 높이 13 이상(걸림 기준 11)으로 넘어 상대 코트 y≈0.16~0.32에 떨어진다
const SERVE_SPECS: Record<MagicServe | 'normal', { z0: number; vz0: number; vy: number; bounce1: number; bounce2?: number }> = {
  normal: { z0: 14, vz0: 0.19, vy: 0.014, bounce1: 2.7 },
  curve: { z0: 14, vz0: 0.19, vy: 0.014, bounce1: 2.7 },
  wobble: { z0: 14, vz0: 0.19, vy: 0.014, bounce1: 2.7 },
  backspin: { z0: 14, vz0: 0.19, vy: 0.014, bounce1: 2.7 },
  lightning: { z0: 12, vz0: -0.58, vy: 0.022, bounce1: 2.0 },
  drop: { z0: 10, vz0: 1.65, vy: 0.012, bounce1: 2.04, bounce2: 1.6 }
}
const MAGIC_INFO: Record<MagicServe, { label: string; color: string }> = {
  curve: { label: '🌀 커브 서브!', color: '#22d3ee' },
  lightning: { label: '⚡ 번개 서브!', color: '#fb923c' },
  drop: { label: '🪶 드롭 서브!', color: '#a3e635' },
  wobble: { label: '〰️ 흔들 서브!', color: '#c084fc' },
  backspin: { label: '↩️ 백스핀 서브!', color: '#60a5fa' }
}
// 커브 = 옆으로 계속 휘는 힘, 흔들 = 좌우 흔들림(폭 0.15, 약 25스텝 주기), 백스핀 = 상대 코트에 튄 뒤 앞으로 가는 속도 비율
const CURVE_ACCEL = 0.00028
const WOBBLE_AMP = 0.15
const WOBBLE_OMEGA = 0.25
const BACKSPIN_SLOW = 0.45

// 서브 5개 중 마구가 나올 순서 1~2개를 미리 정한다
// 경기 기록용 진영별 통계
const emptySideStats = () => ({ smashes: 0, aces: 0, magicServes: 0 })
const emptyMatchStats = () => ({ startedAt: Date.now(), maxRally: 0, player: emptySideStats(), cpu: emptySideStats() })

const newServePlan = () => {
  const count = Math.random() < 0.5 ? 1 : 2
  const order = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5)
  return { idx: 0, slots: order.slice(0, count) }
}

export const PingpongMiniGameModal: React.FC = () => {
  const {
    showPingpongModal,
    closePingpong,
    pingpongPlayers,
    setPingpongPlayers,
    aiDifficulty,
    setAiDifficulty,
    isPaused,
    setIsPaused,
    togglePausePingpong,
    onlineMatch
  } = useMiniGameStore()

  // 사내 오피스 사용자 & 동료 직원 정보
  const myUserName = useOfficeStore((state) => state.userName)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // 플레이어 등록 / 온라인 대전 상대 선택 팝업 상태
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const [showInvitePicker, setShowInvitePicker] = useState(false)
  const [showRecords, setShowRecords] = useState(false)
  const [player1Name, setPlayer1Name] = useState(pingpongPlayers[0] || 'Player 1')
  const [player2Name, setPlayer2Name] = useState(pingpongPlayers[1] || '팀장님 (AI)')

  // 게임 진행 상태 (21점 선취제) — 점수·서브는 물리 좌표 진영 기준(player = 아래, cpu = 위)
  const [isPlaying, setIsPlaying] = useState(false)
  const [scorePlayer, setScorePlayer] = useState(0)
  const [scoreCPU, setScoreCPU] = useState(0)
  const [server, setServer] = useState<Side>('player')
  const [winner, setWinner] = useState<string | null>(null)
  const [rallyCount, setRallyCount] = useState(0)
  const [maxRally, setMaxRally] = useState(0)
  const [lastPointMessage, setLastPointMessage] = useState<string>(
    '🏓 21점 선취제! 마우스를 좌/우로 당기며 클릭하면 원하는 방향으로 스매시가 나갑니다. (마우스 원핸드 플레이 지원)'
  )
  const [isSmashReady, setIsSmashReady] = useState(false)
  // 🏆 판수: 1판(기본) / 3판 2선승. seriesView = 화면 표시용 세트 현황(물리 진영 기준 [아래, 위])
  const [seriesFormat, setSeriesFormat] = useState<SeriesFormat>(1)
  const [seriesView, setSeriesView] = useState({ wins: [0, 0] as [number, number], gameNo: 1, gameScores: [] as string[] })
  // 경기 기록 저장 결과 안내 (우승 화면에 표시)
  const [recordNotice, setRecordNotice] = useState<string | null>(null)

  // 🎯 공격 코스 선택 상태 ('left' | 'center' | 'right') — 항상 "내 화면" 기준
  const [aimCourse, setAimCourse] = useState<AttackCourse>('center')

  const animFrameRef = useRef<number | null>(null)

  // 렌더 루프가 서브 표시를 읽도록 최신 서브 진영을 레프로 둔다
  const serverRef = useRef<Side>(server)
  serverRef.current = server

  // 🌐 온라인 대전 여부와 내 역할 (방장 = 물리 계산 + 화면 아래 진영, 상대 = 화면을 뒤집어 봄)
  const isOnline = onlineMatch?.game === 'pingpong' && onlineMatch.phase === 'active'
  const isGuest = isOnline && onlineMatch?.role === 'guest'
  const myName = isOnline ? (myUserName || '나') : (player1Name || '플레이어 1')
  const oppName = isOnline ? (onlineMatch?.peerName || '상대') : (player2Name || '팀장님 (AI)')
  // 물리 좌표 진영별 이름
  const bottomName = isGuest ? oppName : myName
  const topName = isGuest ? myName : oppName
  const difficulty: Difficulty = isOnline ? 'normal' : aiDifficulty

  // 렌더 루프·입력 처리기에서 최신 값을 읽기 위한 레프
  const liveRef = useRef({ isOnline, isGuest, difficulty, bottomName, topName })
  liveRef.current = { isOnline, isGuest, difficulty, bottomName, topName }

  // 2.5D 레트로 탁구 물리 시뮬레이션 상태
  // X: -1.0 (좌측 끝) ~ +1.0 (우측 끝)
  // Y: 0.0 (위쪽 진영 베이스라인) ~ 0.5 (네트) ~ 1.0 (아래쪽 진영 베이스라인)
  // Z: 0.0 (테이블 표면 바운드) ~ 22.0 (공중 높이)
  const stateRef = useRef({
    ball: {
      x: 0.0,
      y: 0.85,
      z: 18.0,
      vx: 0.0,
      vy: -0.018, // depth 이동 속도
      vz: 2.8,    // 수직 포물선 속도
      // 템포: 난이도별 공 빠르기 비율(보통 = 1). 위로 뜨는 힘·중력·바운드를 함께 맞춰 궤적 모양은 그대로 두고 빠르기만 바꾼다
      tempo: 1,
      radius: 7,
      lastHitter: null as Side | null,
      bounceCount: 0,
      bounceZone: null as Side | null,
      isSmash: false,
      // 서브 중(상대 코트에 튀기 전)인지, 내 코트에 이미 튀었는지
      serving: false,
      serveBounced: false,
      // 마구 서브 종류와 휘는 힘 (다음 타격 때 사라진다)
      magic: null as MagicServe | null,
      ax: 0,
      wobbleAmp: 0,
      wobbleOmega: 0,
      wobblePhase: 0
    },
    // 아래쪽 진영 라켓 (AI 대전·방장: 내 라켓, 온라인 상대 화면: 방장 라켓)
    paddlePlayer: { x: 0.0, targetX: 0.0, swing: 0 },
    // 위쪽 진영 라켓 (AI 라켓 또는 온라인 상대 라켓)
    paddleCPU: { x: 0.0, targetX: 0.0, swing: 0 },
    // 온라인 상대(게스트) 화면에서 내 라켓 — 내 화면 좌표 기준이라 바로 반응한다
    localPaddle: { x: 0.0, targetX: 0.0, swing: 0 },
    // 키보드 상태
    keys: { left: false, right: false },
    // 마우스 상태 및 스윙 속도 추적 (원핸드 마우스 플레이 지원)
    mouse: { lastScreenX: 400, vx: 0 },
    // 스매시 요청 시각 (클릭 / 스페이스)
    smashAt: 0,
    smashSeq: 0,
    // 조준 코스 (내 화면 기준)
    selectedCourse: 'center' as AttackCourse,
    // 스매시 이펙트 (물리 좌표 기준 — 그릴 때 각자 화면으로 변환)
    smashEffect: null as { x: number; y: number; z: number; text: string; timer: number; color?: string } | null,
    // 방장이 받은 상대 입력 (물리 좌표 기준)
    remote: { targetX: 0, course: 'center' as AttackCourse, smashAt: 0, lastSeq: 0 },
    lastSentInput: { x: 999, c: '', seq: -1 },
    // AI 조준 오차 (공이 AI 코트로 넘어올 때 한 번만 정한다)
    aiAimOffset: null as number | null,
    // 이번 경기 기록 (시작 시각·최장 랠리·진영별 스매시/서브 득점/마구 서브) — 3판 2선승이면 시리즈 전체
    matchStats: emptyMatchStats(),
    // 시리즈 진행: 진영별 이긴 게임 수, 지금 게임 번호, 게임별 점수("아래:위"), 이 게임 첫 서브 진영
    series: { format: 1 as SeriesFormat, wins: { player: 0, cpu: 0 }, gameNo: 1, gameScores: [] as string[], firstServer: 'player' as Side },
    serveTimer: 0,
    // 서브 대기(공을 들고 있는 중): 사람은 클릭을 기다리고, AI는 잠깐 뒤 넣는다
    serveWaiting: false,
    serveWaitSteps: 0,
    serveReadyAt: 0,
    aiServeWait: 30,
    // 진영별 마구 서브 계획 (서브 5개마다 새로 정한다)
    servePlans: { player: newServePlan(), cpu: newServePlan() } as Record<Side, { idx: number; slots: number[] }>,
    lastMagic: null as MagicServe | null,
    // 상대 화면: 방장이 보낸 서브 대기 상태 (0 = 없음, 1 = 쉬는 중, 2 = 서브 기다리는 중)와 자동 서브까지 남은 초
    remoteServeStage: 0,
    remoteServeSec: 0,
    // 마구 공 꼬리 (화면 좌표)
    trail: [] as { x: number; y: number }[],
    accumulator: 0,
    lastTime: 0,
    stepCount: 0,
    fxQueue: [] as FxEvent[],
    pendingMsg: null as string | null,
    // 방장 쪽 게임 진행 상태 (상대 화면은 스냅샷으로 받는다)
    game: { scorePlayer: 0, scoreCPU: 0, server: 'player' as Side, winner: null as string | null, rally: 0, maxRally: 0, playing: false },
    // 상대 화면에서 받은 서브 대기 여부
    remoteServeHold: false
  })

  // 2.5D 투영 함수: 테이블 좌표 (X: -1~1, Y: 0~1, Z: >=0) -> 캔버스 2D 화면 좌표
  const project = (tableX: number, tableY: number, tableZ: number) => {
    // Y = 0.0 (상대방 끝선): screenY = 155, 테이블 폭 = 260px (x: 270 ~ 530)
    // Y = 0.5 (네트): screenY = 280, 테이블 폭 = 390px (x: 205 ~ 595)
    // Y = 1.0 (내 끝선): screenY = 415, 테이블 폭 = 520px (x: 140 ~ 660)
    const screenY = 155 + tableY * 260
    const tableWidthAtY = 260 + tableY * 260
    const screenX = 400 + tableX * (tableWidthAtY / 2)
    // 공의 Z 높이는 화면 위쪽(-Y)으로 부유 효과
    const screenVisualY = screenY - tableZ * 1.6
    const scale = 0.65 + tableY * 0.45
    return { screenX, screenY, screenVisualY, scale, widthAtY: tableWidthAtY }
  }

  const returnSpeedOf = (diff: Difficulty) => (diff === 'easy' ? 0.013 : diff === 'normal' ? 0.017 : 0.021)
  // 보통 난이도 대비 빠르기 비율. 앞으로 가는 속도만 바꾸면 이지는 네트 앞에 떨어지고(느려서),
  // 하드는 받는 사람 바로 앞에서 낮게 튀어(빨라서) 스매시가 안 나온다 — 그래서 위아래 움직임도 같은 비율로 맞춘다
  const tempoOf = (diff: Difficulty) => returnSpeedOf(diff) / returnSpeedOf('normal')

  // 효과음 재생 (온라인 대전 중이면 상대 화면에서도 나도록 모아 둔다)
  const playFx = (fx: FxEvent) => {
    if (fx === 'hit') miniGameAudio.pingpongRacketHit(1.0)
    else if (fx === 'smash') miniGameAudio.pingpongSmash()
    else if (fx === 'bounce') miniGameAudio.pingpongTableBounce()
    else if (fx === 'net') miniGameAudio.pingpongNetHit()
    else if (fx === 'cheer') miniGameAudio.cheer()
    if (liveRef.current.isOnline && !liveRef.current.isGuest) stateRef.current.fxQueue.push(fx)
  }

  const showMessage = (msg: string) => {
    setLastPointMessage(msg)
    stateRef.current.pendingMsg = msg
  }

  // 🌐 방장 → 상대: 현재 경기 상태 전송
  const sendSnapshot = () => {
    const live = liveRef.current
    if (!live.isOnline || live.isGuest) return
    const s = stateRef.current
    const b = s.ball
    const g = s.game
    miniGameNetwork.send('pingpong', 'state', {
      b: [round4(b.x), round4(b.y), round2(b.z), round4(b.vx), round4(b.vy), round2(b.vz), b.isSmash ? 1 : 0, b.bounceCount],
      p1: [round4(s.paddlePlayer.x), round2(s.paddlePlayer.swing)],
      p2: [round4(s.paddleCPU.x), round2(s.paddleCPU.swing)],
      g: [g.scorePlayer, g.scoreCPU, g.server === 'player' ? 0 : 1, g.rally, g.maxRally],
      pl: g.playing,
      pa: useMiniGameStore.getState().isPaused,
      w: g.winner,
      st: s.serveTimer > 0 ? 1 : s.serveWaiting ? 2 : 0,
      sr: [s.series.format, s.series.wins.player, s.series.wins.cpu, s.series.gameNo],
      gs: s.series.gameScores,
      sw: Math.ceil((SERVE_AUTO_STEPS - s.serveWaitSteps) / 60),
      mg: b.magic,
      sp: [round4(b.ax * 10000) / 10000, round4(b.wobbleAmp), round4(b.wobbleOmega), round4(b.wobblePhase)],
      fx: s.fxQueue,
      m: s.pendingMsg,
      se: s.smashEffect && s.smashEffect.timer > 0 ? s.smashEffect : null
    })
    s.fxQueue = []
    s.pendingMsg = null
  }

  // 마구 효과(휘는 힘) 제거 — 누가 공을 치면 사라진다
  const clearMagic = () => {
    const b = stateRef.current.ball
    b.magic = null
    b.ax = 0
    b.wobbleAmp = 0
    b.wobbleOmega = 0
    b.wobblePhase = 0
    b.serving = false
  }

  // 마구 공이 옆으로 휘는 힘 (커브 = 한쪽으로 계속, 흔들 = 좌우로 왔다 갔다)
  const applySpin = () => {
    const b = stateRef.current.ball
    if (b.ax) b.vx += b.ax
    if (b.wobbleAmp) {
      b.vx -= b.wobbleAmp * b.wobbleOmega * b.wobbleOmega * Math.sin(b.wobblePhase)
      b.wobblePhase += b.wobbleOmega
    }
  }

  // 서브 진영 라켓 옆에 공을 들고 있는 위치
  const holdServeBall = (now: number) => {
    const s = stateRef.current
    const b = s.ball
    const serverPaddle = b.lastHitter === 'player' ? s.paddlePlayer : s.paddleCPU
    const side = b.lastHitter === 'player' ? -1 : 1
    b.x = Math.max(-0.85, Math.min(0.85, serverPaddle.x + side * 0.15))
    b.y = b.lastHitter === 'player' ? 0.97 : 0.03
    b.z = 14 + Math.sin(now / 160) * 3 // 손 위에서 공을 통통 튕기는 모션
  }

  // 초기화 및 서브 세팅 (서브 진영 라켓 옆에서 공을 들고 기다린다)
  const resetBall = (servingSide: Side) => {
    const s = stateRef.current
    clearMagic()
    s.ball.vx = 0
    s.ball.vy = 0
    s.ball.vz = 0
    s.ball.tempo = tempoOf(liveRef.current.difficulty)
    s.ball.lastHitter = servingSide
    s.ball.bounceCount = 0
    s.ball.bounceZone = null
    s.ball.isSmash = false
    s.ball.serveBounced = false
    holdServeBall(performance.now())
    s.aiAimOffset = null
    s.serveTimer = SERVE_DELAY_STEPS
    s.serveWaiting = true
    s.serveWaitSteps = 0
    s.aiServeWait = 20 + Math.floor(Math.random() * 30)
    s.trail = []
    s.game.rally = 0
    setRallyCount(0)
  }

  // 🏓 서브 넣기: 내 코트에 한 번 튀고 → 네트 넘어 상대 코트에 튄다. 5개 중 1~2개는 마구
  const launchServe = (side: Side, serverName: string) => {
    const s = stateRef.current
    const b = s.ball
    const tempo = tempoOf(liveRef.current.difficulty)

    let plan = s.servePlans[side]
    if (plan.idx >= SERVES_PER_TURN) plan = s.servePlans[side] = newServePlan()
    let magic: MagicServe | null = null
    if (plan.slots.includes(plan.idx)) {
      const choices = MAGIC_SERVES.filter((m) => m !== s.lastMagic)
      magic = choices[Math.floor(Math.random() * choices.length)]
      s.lastMagic = magic
    }
    plan.idx += 1

    const spec = SERVE_SPECS[magic ?? 'normal']
    const dir = side === 'player' ? -1 : 1
    b.tempo = tempo
    b.y = side === 'player' ? 0.97 : 0.03
    b.z = spec.z0
    b.vy = dir * spec.vy * tempo
    b.vz = spec.vz0 * tempo
    b.serving = true
    b.serveBounced = false
    b.magic = magic
    b.isSmash = false

    // 상대 코트에 떨어질 때까지 걸리는 스텝 수를 미리 계산해 좌우 목표 지점에 맞춘다
    let steps = 0
    {
      let z = spec.z0 * 1, vz = spec.vz0 * tempo, bounced = false
      const g = 0.16 * tempo * tempo
      while (steps < 400) {
        steps++
        z = Math.min(22, Math.max(0, z + vz))
        vz -= g
        if (z <= 0) {
          if (bounced) break
          bounced = true
          vz = spec.bounce1 * tempo
        }
      }
    }
    const targetX = (Math.random() * 2 - 1) * 0.6
    b.vx = (targetX - b.x) / steps
    if (magic === 'curve') {
      // 처음엔 반대쪽으로 날아가다가 목표 지점 쪽으로 휘어 들어온다
      b.ax = (Math.random() < 0.5 ? -1 : 1) * CURVE_ACCEL * tempo * tempo
      b.vx -= 0.5 * b.ax * steps
    } else if (magic === 'wobble') {
      b.wobbleAmp = WOBBLE_AMP
      b.wobbleOmega = WOBBLE_OMEGA * tempo
      b.wobblePhase = 0
      b.vx += WOBBLE_AMP * b.wobbleOmega
    }

    s.serveWaiting = false
    s.smashAt = 0
    s.remote.smashAt = 0
    s.aiAimOffset = null
    const paddle = side === 'player' ? s.paddlePlayer : s.paddleCPU
    paddle.swing = side === 'player' ? 14 : -14
    playFx('hit')
    if (magic) {
      s.matchStats[side].magicServes += 1
      const info = MAGIC_INFO[magic]
      s.smashEffect = { x: b.x, y: b.y, z: b.z + 8, text: `${info.label} (${serverName})`, timer: 50, color: info.color }
    }
  }

  // 서브 순서: 5점마다 교대, 20:20 듀스부터는 1점마다 교대 (첫 서브는 1게임 아래쪽 진영, 게임마다 번갈아)
  const serverForScore = (a: number, b: number): Side => {
    const total = a + b
    const first = stateRef.current.series.firstServer
    const other: Side = first === 'player' ? 'cpu' : 'player'
    if (a >= TARGET_SCORE - 1 && b >= TARGET_SCORE - 1) return total % 2 === 0 ? first : other
    return Math.floor(total / 5) % 2 === 0 ? first : other
  }

  const syncSeriesView = () => {
    const sr = stateRef.current.series
    setSeriesView({ wins: [sr.wins.player, sr.wins.cpu], gameNo: sr.gameNo, gameScores: [...sr.gameScores] })
  }

  // 판수 고르기 (경기 전, 온라인은 방장만 — 상대 화면에도 바로 보인다)
  const chooseSeriesFormat = (format: SeriesFormat) => {
    if (liveRef.current.isGuest || stateRef.current.game.playing) return
    setSeriesFormat(format)
    stateRef.current.series.format = format
    sendSnapshot()
  }

  // 창이 열리면 녹음한 탁구공 소리를 미리 불러 둔다 (첫 타구부터 실제 소리)
  useEffect(() => {
    if (showPingpongModal) miniGameAudio.preloadPingpongSample()
  }, [showPingpongModal])

  // 모달이 열릴 때 내 닉네임 자동 세팅 (AI 대전용 이름)
  useEffect(() => {
    if (showPingpongModal && myUserName) {
      const p1 = pingpongPlayers[0]
      if (!p1 || p1 === '나' || p1 === '나(플레이어)' || p1 === 'Player 1') {
        setPingpongPlayers([myUserName, pingpongPlayers[1] || '팀장님 (AI)'])
        setPlayer1Name(myUserName)
      } else {
        setPlayer1Name(p1)
      }
      setPlayer2Name(pingpongPlayers[1] || '팀장님 (AI)')
    }
  }, [showPingpongModal, myUserName])

  // 게임 시작 (21점 선취제) — 온라인 대전에서는 방장만 시작한다
  const startGame = () => {
    if (liveRef.current.isGuest) return
    const s = stateRef.current
    s.game = { scorePlayer: 0, scoreCPU: 0, server: 'player', winner: null, rally: 0, maxRally: s.game.maxRally, playing: true }
    setScorePlayer(0)
    setScoreCPU(0)
    setServer('player')
    setWinner(null)
    s.servePlans = { player: newServePlan(), cpu: newServePlan() }
    s.lastMagic = null
    s.matchStats = emptyMatchStats()
    s.series = { format: seriesFormat, wins: { player: 0, cpu: 0 }, gameNo: 1, gameScores: [], firstServer: 'player' }
    syncSeriesView()
    setRecordNotice(null)
    resetBall('player')
    showMessage(seriesFormat === 3
      ? `3판 2선승 시작! 한 게임은 ${TARGET_SCORE}점, 두 게임을 먼저 이기면 우승합니다. (서브는 5점마다 교대, 클릭/스페이스로 서브)`
      : `게임을 시작합니다! ${TARGET_SCORE}점을 먼저 내면 승리합니다. (서브는 5점마다 교대, 클릭/스페이스로 서브)`)
    setIsPlaying(true)
    setIsPaused(false)
    sendSnapshot()
  }

  // 경기 기록 저장 (AI 대전·온라인 방장만. 상대 화면은 방장이 올린 기록을 함께 쓴다)
  const saveMatchRecord = () => {
    const s = stateRef.current
    const live = liveRef.current
    const g = s.game
    const store = useMiniGameStore.getState()
    const match = store.onlineMatch
    const online = live.isOnline && match?.game === 'pingpong'
    const sideStats = (side: Side) => ({ ...s.matchStats[side], maxRally: s.matchStats.maxRally })
    const sr = s.series
    const bestOfThree = sr.format === 3
    const totalPoints = sr.gameScores.reduce((sum, score) => sum + score.split(':').reduce((a, b) => a + Number(b), 0), 0)
    void miniGameRecords
      .submit({
        game: 'pingpong',
        mode: online ? 'online' : 'ai',
        difficulty: online ? undefined : live.difficulty,
        sessionId: online ? match?.sessionId : undefined,
        startedAt: s.matchStats.startedAt,
        endedAt: Date.now(),
        // 3판 2선승은 최종 결과만: 점수 = 이긴 게임 수, 게임별 점수는 상세에
        players: bestOfThree
          ? [
              { name: live.bottomName, score: sr.wins.player, isWinner: sr.wins.player > sr.wins.cpu, stats: sideStats('player') },
              { name: live.topName, score: sr.wins.cpu, isWinner: sr.wins.cpu > sr.wins.player, isAi: !online, stats: sideStats('cpu') }
            ]
          : [
              { name: live.bottomName, score: g.scorePlayer, isWinner: g.scorePlayer > g.scoreCPU, stats: sideStats('player') },
              { name: live.topName, score: g.scoreCPU, isWinner: g.scoreCPU > g.scorePlayer, isAi: !online, stats: sideStats('cpu') }
            ],
        details: {
          seriesFormat: sr.format,
          ...(bestOfThree ? { gameScores: sr.gameScores.join(', ') } : {}),
          maxRally: s.matchStats.maxRally,
          totalPoints,
          targetScore: TARGET_SCORE
        }
      })
      .then((result) => {
        if (result === 'saved') setRecordNotice('📋 경기 기록이 저장되었습니다.')
        else if (result === 'queued') setRecordNotice('📋 서버에 연결되면 경기 기록이 자동으로 저장됩니다.')
        else if (result === 'unavailable') setRecordNotice('📋 체험판에서는 경기 기록이 저장되지 않습니다.')
        else setRecordNotice(null)
      })
  }

  // 득점 처리 (방장/AI 대전에서만 호출)
  const awardPointTo = (scorer: Side, reason: string) => {
    const s = stateRef.current
    const g = s.game
    if (scorer === g.server && g.rally === 0) s.matchStats[scorer].aces += 1
    if (scorer === 'player') g.scorePlayer += 1
    else g.scoreCPU += 1
    setScorePlayer(g.scorePlayer)
    setScoreCPU(g.scoreCPU)

    // 21점 선취 승리 판정 (2점차 듀스 규칙)
    const lead = g.scorePlayer - g.scoreCPU
    let gameWinner: Side | null = null
    if (g.scorePlayer >= TARGET_SCORE && lead >= 2) gameWinner = 'player'
    else if (g.scoreCPU >= TARGET_SCORE && -lead >= 2) gameWinner = 'cpu'

    if (gameWinner) {
      const live = liveRef.current
      const sr = s.series
      sr.wins[gameWinner] += 1
      sr.gameScores.push(`${g.scorePlayer}:${g.scoreCPU}`)
      const gameWinnerName = gameWinner === 'player' ? live.bottomName : live.topName
      if (sr.wins[gameWinner] < seriesWinsNeeded(sr.format)) {
        // 3판 2선승: 다음 게임 (첫 서브는 번갈아, 3초 쉬고 시작)
        playFx('cheer')
        sr.gameNo += 1
        sr.firstServer = sr.gameNo % 2 === 0 ? 'cpu' : 'player'
        g.scorePlayer = 0
        g.scoreCPU = 0
        setScorePlayer(0)
        setScoreCPU(0)
        g.server = sr.firstServer
        setServer(g.server)
        resetBall(g.server)
        s.serveTimer = SERVE_DELAY_STEPS * 4
        syncSeriesView()
        const firstServerName = sr.firstServer === 'player' ? live.bottomName : live.topName
        showMessage(`${reason} 🏓 ${sr.gameNo - 1}게임 ${gameWinnerName} 님 승리! 세트 ${live.bottomName} ${sr.wins.player} : ${sr.wins.cpu} ${live.topName} — 곧 ${sr.gameNo}게임 시작 (첫 서브: ${firstServerName})`)
        sendSnapshot()
        return
      }
      g.winner = gameWinnerName
      syncSeriesView()
    }

    if (g.winner) {
      g.playing = false
      setWinner(g.winner)
      setIsPlaying(false)
      playFx('cheer')
      showMessage(s.series.format === 3
        ? `${reason} 🏆 ${g.winner} 님 3판 2선승 우승! (세트 ${s.series.wins.player} : ${s.series.wins.cpu} · ${s.series.gameScores.join(', ')})`
        : `${reason} 🏆 ${g.winner} 님 승리! (${g.scorePlayer} : ${g.scoreCPU})`)
      sendSnapshot()
      saveMatchRecord()
      return
    }

    g.server = serverForScore(g.scorePlayer, g.scoreCPU)
    setServer(g.server)
    resetBall(g.server)
    showMessage(reason)
  }

  // 사람이 친 공 처리 (아래 진영 = 나/방장, 위 진영 = 온라인 상대). course는 친 사람 화면 기준
  const humanHit = (side: Side, course: AttackCourse, wantsSmash: boolean, hitterName: string) => {
    const s = stateRef.current
    const b = s.ball
    const diff = liveRef.current.difficulty
    const dir = side === 'player' ? -1 : 1 // 아래 진영은 위로(-y), 위 진영은 아래로(+y)
    const mirror = side === 'player' ? 1 : -1 // 위 진영 사람의 화면은 좌우가 반대
    const returnSpeed = returnSpeedOf(diff)
    const jitter = course === 'center' ? 0.12 : 0.1
    const targetX = (COURSE_TARGET_X[course] + (Math.random() - 0.5) * jitter) * mirror
    const tempo = tempoOf(diff)
    const smashMinHeight = diff === 'easy' ? 9 : 12
    const paddle = side === 'player' ? s.paddlePlayer : s.paddleCPU
    b.tempo = tempo

    if (wantsSmash && b.z >= smashMinHeight) {
      s.matchStats[side].smashes += 1
      b.isSmash = true
      b.vy = dir * returnSpeed * 1.85
      b.vz = 0.8 * tempo
      b.vx = (targetX - b.x) * 0.045 * tempo
      playFx('smash')
      const courseLabel = course === 'left' ? '좌측' : course === 'right' ? '우측' : '중앙'
      s.smashEffect = { x: b.x, y: b.y, z: b.z, text: `💥 ${hitterName} ${courseLabel} 스매시!!`, timer: 32 }
      paddle.swing = side === 'player' ? 22 : -22
    } else {
      b.isSmash = false
      b.vy = dir * returnSpeed
      b.vz = 2.4 * tempo
      b.vx = (targetX - b.x) * 0.026 * tempo
      playFx('hit')
      paddle.swing = side === 'player' ? 12 : -12
    }

    clearMagic()
    b.lastHitter = side
    b.bounceCount = 0
    b.bounceZone = null
    b.y = side === 'player' ? 0.88 : 0.12
    if (side === 'player') s.aiAimOffset = null
    s.game.rally += 1
    s.game.maxRally = Math.max(s.game.maxRally, s.game.rally)
    s.matchStats.maxRally = Math.max(s.matchStats.maxRally, s.game.rally)
    setRallyCount(s.game.rally)
    setMaxRally(s.game.maxRally)
  }

  // 물리 1스텝 (방장 / AI 대전)
  const stepSim = () => {
    const s = stateRef.current
    const live = liveRef.current
    const b = s.ball
    const pPlayer = s.paddlePlayer
    const pCPU = s.paddleCPU
    const diff = live.difficulty
    const now = performance.now()

    // 1. 라켓 이동 계산
    if (s.keys.left) pPlayer.targetX = Math.max(-1.0, pPlayer.targetX - 0.05)
    if (s.keys.right) pPlayer.targetX = Math.min(1.0, pPlayer.targetX + 0.05)
    pPlayer.x += (pPlayer.targetX - pPlayer.x) * 0.35
    pPlayer.swing *= 0.82

    if (live.isOnline) {
      // 🌐 온라인 상대 라켓: 받은 입력을 따라간다
      pCPU.targetX = Math.max(-0.95, Math.min(0.95, s.remote.targetX))
      pCPU.x += (pCPU.targetX - pCPU.x) * 0.35
    } else {
      // 🤖 AI 라켓: 공이 자기 코트로 넘어오면 도착 위치를 예측해 쫓아간다.
      // 난이도는 "이동 속도 상한"과 "멀리 뛸수록 커지는 조준 오차"로만 정한다 — 정면 공은 받고, 구석·스매시로 점수가 난다
      const ai = AI_SKILL[diff]
      let targetX = 0.0
      if (b.vy < 0 && b.y < 0.5) {
        const stepsToReach = Math.max(0, (b.y - 0.08) / -b.vy)
        const predictedX = b.x + b.vx * stepsToReach
        if (s.aiAimOffset === null) {
          const reach = Math.min(1, Math.abs(predictedX - pCPU.x) / 0.6)
          const error = ai.aimError * (b.isSmash ? AI_SMASH_ERROR_MULTIPLIER : 1)
          s.aiAimOffset = (Math.random() * 2 - 1) * error * reach
        }
        targetX = predictedX + s.aiAimOffset
      }
      pCPU.targetX = Math.max(-0.95, Math.min(0.95, targetX))
      const delta = pCPU.targetX - pCPU.x
      pCPU.x += Math.max(-ai.maxStep, Math.min(ai.maxStep, delta))
    }
    pCPU.swing *= 0.82
    if (s.smashEffect && s.smashEffect.timer > 0) s.smashEffect.timer--

    // 서브 대기: 공은 서브하는 사람 라켓 옆에 머문다. 쉬는 시간이 끝나면 사람은 클릭/스페이스(3초 뒤 자동), AI는 잠깐 뒤 서브
    if (s.serveWaiting) {
      holdServeBall(now)
      if (s.serveTimer > 0) {
        s.serveTimer--
        if (s.serveTimer === 0) s.serveReadyAt = now
        return
      }
      s.serveWaitSteps++
      const side = b.lastHitter === 'cpu' ? 'cpu' : 'player'
      const humanServer = side === 'player' || live.isOnline
      const requested = side === 'player' ? s.smashAt > s.serveReadyAt : s.remote.smashAt > s.serveReadyAt
      const go = humanServer ? requested || s.serveWaitSteps >= SERVE_AUTO_STEPS : s.serveWaitSteps >= s.aiServeWait
      if (!go) return
      launchServe(side, side === 'player' ? live.bottomName : live.topName)
    }

    // 2. 공 물리 계산 (2.5D 깊이 Y, 좌우 X, 높이 Z)
    const prevY = b.y
    applySpin()
    b.x += b.vx
    b.y += b.vy
    b.z += b.vz
    b.vz -= 0.16 * b.tempo * b.tempo // 안정된 중력 가속도 (템포에 맞춰 궤적 모양 유지)
    b.z = Math.min(22, Math.max(0, b.z))

    // 3. 네트(Y = 0.5) 통과 판정 — 이번 스텝에 네트를 지나갔는지로 본다(빠른 스매시도 빠짐없이 판정)
    if ((prevY - 0.5) * (b.y - 0.5) <= 0 && prevY !== b.y && b.z < 11) {
      playFx('net')
      if (b.lastHitter === 'player') awardPointTo('cpu', `❌ 네트 걸림! ${live.bottomName} 님의 공이 네트를 넘지 못했습니다.`)
      else awardPointTo('player', `🎯 네트 걸림! ${live.topName} 님의 공이 네트를 넘지 못했습니다.`)
      return
    }

    // 4. 테이블 바운드 판정 (Z <= 0)
    if (b.z <= 0) {
      const onTable = b.x >= -1.05 && b.x <= 1.05 && b.y >= 0.0 && b.y <= 1.0

      if (onTable) {
        b.z = 0
        const baseBounce = b.isSmash ? 0.9 : 1.6
        b.vz = Math.min(2.7 * b.tempo, Math.abs(b.vz) * 0.62 + baseBounce * b.tempo)
        playFx('bounce')

        const hitZone: Side = b.y < 0.5 ? 'cpu' : 'player'

        // 서브 룰: 서브는 내 코트에 꼭 한 번 튀고 상대 코트로 넘어가야 한다
        if (b.serving && b.lastHitter) {
          const spec = SERVE_SPECS[b.magic ?? 'normal']
          const serverName = b.lastHitter === 'player' ? live.bottomName : live.topName
          const receiverSide: Side = b.lastHitter === 'player' ? 'cpu' : 'player'
          if (hitZone === b.lastHitter) {
            if (b.serveBounced) {
              awardPointTo(receiverSide, `❌ 서브 실패! ${serverName} 님의 서브가 네트를 넘지 못했습니다.`)
              return
            }
            b.serveBounced = true
            b.vz = spec.bounce1 * b.tempo
            return
          }
          if (!b.serveBounced) {
            awardPointTo(receiverSide, `❌ 서브 실패! ${serverName} 님의 서브가 자기 코트에 먼저 튀지 않았습니다.`)
            return
          }
          // 상대 코트에 정상 착지 — 이제부터 일반 랠리 규칙
          b.serving = false
          b.bounceCount = 1
          b.bounceZone = hitZone
          if (spec.bounce2) b.vz = spec.bounce2 * b.tempo
          if (b.magic === 'backspin') b.vy *= BACKSPIN_SLOW
          return
        }

        // 룰 1: 자책 바운드 체크
        if (b.lastHitter === 'player' && hitZone === 'player') {
          awardPointTo('cpu', `❌ 자책 바운드! ${live.bottomName} 님이 친 공이 본인 코트에 떨어졌습니다.`)
          return
        } else if (b.lastHitter === 'cpu' && hitZone === 'cpu') {
          awardPointTo('player', `🎯 자책 바운드! ${live.topName} 님이 친 공이 본인 코트에 떨어졌습니다.`)
          return
        }

        // 룰 2: 상대 코트 1차 바운드 vs 2차 바운드(투바운드)
        if (b.lastHitter && hitZone !== b.lastHitter) {
          if (b.bounceCount === 0) {
            b.bounceCount = 1
            b.bounceZone = hitZone
          } else {
            const receiverName = hitZone === 'cpu' ? live.topName : live.bottomName
            awardPointTo(b.lastHitter, `🎯 투바운드 득점! ${receiverName} 님이 공을 리턴하지 못했습니다.`)
            return
          }
        }
      } else if (b.lastHitter) {
        // 테이블 밖으로 추락 (아웃)
        const hitter = b.lastHitter
        const receiver: Side = hitter === 'player' ? 'cpu' : 'player'
        const hitterName = hitter === 'player' ? live.bottomName : live.topName
        const receiverName = hitter === 'player' ? live.topName : live.bottomName
        if (b.bounceCount >= 1 && b.bounceZone === receiver) {
          awardPointTo(hitter, `🎯 득점! ${receiverName} 님이 공을 받아치지 못했습니다.`)
        } else {
          awardPointTo(receiver, `❌ 아웃! ${hitterName} 님의 공이 탁구대 밖으로 벗어났습니다.`)
        }
        return
      }
    }

    // 5. 아래 진영(나 / 방장) 라켓 타격 판정
    const hitMarginX = diff === 'easy' ? 0.48 : diff === 'normal' ? 0.36 : 0.28
    const hitMinY = diff === 'easy' ? 0.78 : 0.84
    if (b.vy > 0 && b.y >= hitMinY && b.y <= 1.08 && Math.abs(b.x - pPlayer.x) < hitMarginX) {
      // 마우스를 빠르게 당기면서 치면 그 방향으로
      let course = s.selectedCourse
      if (s.mouse.vx < -3.0) course = 'left'
      else if (s.mouse.vx > 3.0) course = 'right'
      if (course !== s.selectedCourse) {
        s.selectedCourse = course
        setAimCourse(course)
      }
      humanHit('player', course, now - s.smashAt < SMASH_WINDOW_MS, live.bottomName)
      s.smashAt = 0
    }

    // 6. 위 진영 라켓 타격 판정
    if (live.isOnline) {
      // 🌐 온라인 상대: 아래 진영과 똑같은 판정 범위를 위아래로 뒤집어 적용 (공정한 1:1)
      if (b.vy < 0 && b.y <= 1 - hitMinY && b.y >= -0.08 && Math.abs(b.x - pCPU.x) < hitMarginX) {
        humanHit('cpu', s.remote.course, now - s.remote.smashAt < SMASH_WINDOW_MS, live.topName)
        s.remote.smashAt = 0
      }
    } else if (b.vy < 0 && b.y <= 0.13 && b.y >= -0.05) {
      // 🤖 AI 대전 모드: 라켓이 공에 닿으면 받는다 (못 닿으면 헛스윙 모션만)
      if (Math.abs(b.x - pCPU.x) >= AI_HIT_MARGIN_X) {
        if (pCPU.swing > -4) pCPU.swing = -8
      } else {
        const cpuTargetX = diff === 'easy' ? (Math.random() - 0.5) * 0.55 : (Math.random() - 0.5) * 1.3
        const cpuSpeed = returnSpeedOf(diff)
        const tempo = tempoOf(diff)
        const aiWantsSmash = b.z >= 14 && Math.random() < (diff === 'hard' ? 0.7 : diff === 'normal' ? 0.25 : 0.0)
        b.tempo = tempo

        if (aiWantsSmash) {
          s.matchStats.cpu.smashes += 1
          b.isSmash = true
          b.vy = cpuSpeed * 1.7
          b.vz = 0.9 * tempo
          b.vx = (cpuTargetX - b.x) * 0.042 * tempo
          playFx('smash')
          s.smashEffect = { x: b.x, y: b.y, z: b.z, text: `💥 ${live.topName} 스매시!`, timer: 30 }
          pCPU.swing = -22
        } else {
          b.isSmash = false
          b.vy = cpuSpeed
          b.vz = 2.4 * tempo
          b.vx = (cpuTargetX - b.x) * 0.026 * tempo
          playFx('hit')
          pCPU.swing = -12
        }

        clearMagic()
        b.lastHitter = 'cpu'
        b.bounceCount = 0
        b.bounceZone = null
        b.y = 0.12
      }
    }

    // 화면 밖 아웃 판정
    if (b.y > 1.25) {
      awardPointTo('cpu', `❌ 실점! ${live.bottomName} 님이 공을 리턴하지 못했습니다.`)
    } else if (b.y < -0.2) {
      awardPointTo('player', `🎯 득점! ${live.topName} 님이 공을 놓쳤습니다.`)
    }
  }

  // 온라인 상대(게스트) 화면 1스텝: 내 라켓은 바로 움직이고, 공은 받은 상태를 기준으로 다음 위치를 예측해 부드럽게 그린다
  const stepGuest = () => {
    const s = stateRef.current
    const lp = s.localPaddle
    if (s.keys.left) lp.targetX = Math.max(-1.0, lp.targetX - 0.05)
    if (s.keys.right) lp.targetX = Math.min(1.0, lp.targetX + 0.05)
    lp.targetX = Math.max(-0.95, Math.min(0.95, lp.targetX))
    lp.x += (lp.targetX - lp.x) * 0.35
    lp.swing *= 0.82
    s.paddlePlayer.x += (s.paddlePlayer.targetX - s.paddlePlayer.x) * 0.35
    s.paddlePlayer.swing *= 0.82
    if (s.smashEffect && s.smashEffect.timer > 0) s.smashEffect.timer--

    const b = s.ball
    // 온라인 대전은 항상 보통 난이도(템포 1)라 기본 중력·바운드 값으로 예측한다
    if (!s.remoteServeHold) {
      applySpin()
      b.x += b.vx
      b.y += b.vy
      b.z += b.vz
      b.vz -= 0.16
      if (b.z <= 0) {
        b.z = 0
        if (b.x >= -1.05 && b.x <= 1.05 && b.y >= 0 && b.y <= 1) {
          b.vz = Math.min(2.7, Math.abs(b.vz) * 0.62 + (b.isSmash ? 0.9 : 1.6))
        }
      }
      b.z = Math.min(22, b.z)
    }

    // 내 입력을 방장에게 보낸다 (바뀐 경우만, 스매시는 즉시)
    s.stepCount++
    const sent = s.lastSentInput
    const x = round4(lp.targetX)
    const smashChanged = sent.seq !== s.smashSeq
    if (smashChanged || (s.stepCount % INPUT_EVERY_STEPS === 0 && (sent.x !== x || sent.c !== s.selectedCourse))) {
      miniGameNetwork.send('pingpong', 'input', { x, c: s.selectedCourse, sm: s.smashSeq })
      s.lastSentInput = { x, c: s.selectedCourse, seq: s.smashSeq }
    }
  }

  // 스매시 액션 트리거 (클릭 / 스페이스 / 엔터)
  const triggerSmashAction = () => {
    const s = stateRef.current
    s.smashAt = performance.now()
    s.smashSeq += 1
    if (liveRef.current.isGuest) s.localPaddle.swing = 18
    else s.paddlePlayer.swing = 18
  }

  const setCourse = (course: AttackCourse) => {
    setAimCourse(course)
    stateRef.current.selectedCourse = course
  }

  // 일시정지: 온라인 상대는 방장에게 요청하고, 방장/AI 대전은 바로 전환
  const requestPauseToggle = () => {
    if (liveRef.current.isGuest) miniGameNetwork.send('pingpong', 'pause')
    else togglePausePingpong()
  }

  // 🌐 온라인 대전 데이터 수신
  useEffect(() => {
    return miniGameNetwork.onData('pingpong', (kind, data) => {
      const s = stateRef.current
      const store = useMiniGameStore.getState()
      const match = store.onlineMatch

      if (kind === 'match_start') {
        setShowInvitePicker(false)
        setShowPlayerModal(false)
        s.game = { scorePlayer: 0, scoreCPU: 0, server: 'player', winner: null, rally: 0, maxRally: 0, playing: false }
        setIsPlaying(false)
        setWinner(null)
        setScorePlayer(0)
        setScoreCPU(0)
        setServer('player')
        setRallyCount(0)
        setMaxRally(0)
        store.setIsPaused(false)
        setLastPointMessage(match?.role === 'host'
          ? `🌐 ${match.peerName} 님이 대전을 수락했습니다! [게임 시작]을 누르세요.`
          : `🌐 ${match?.peerName || '상대'} 님이 게임을 시작하면 바로 시작됩니다.`)
        return
      }

      if (kind === 'match_end') {
        s.game.playing = false
        setIsPlaying(false)
        store.setIsPaused(false)
        setLastPointMessage(`🌐 온라인 대전이 종료되었습니다.${data?.reason ? ` (${data.reason})` : ''}`)
        return
      }

      // 방장: 상대 입력 수신 (상대 화면 좌표 → 물리 좌표로 좌우 반전)
      if (kind === 'input' && match?.role === 'host' && data) {
        s.remote.targetX = -Math.max(-1, Math.min(1, Number(data.x) || 0))
        if (data.c === 'left' || data.c === 'center' || data.c === 'right') s.remote.course = data.c
        const seq = Number(data.sm) || 0
        if (seq > s.remote.lastSeq) {
          s.remote.lastSeq = seq
          s.remote.smashAt = performance.now()
          s.paddleCPU.swing = -18
        }
        return
      }

      if (kind === 'pause' && match?.role === 'host') {
        if (s.game.playing) store.togglePausePingpong()
        return
      }

      // 상대(게스트): 방장의 경기 상태 수신
      if (kind === 'state' && match?.role === 'guest' && data && Array.isArray(data.b)) {
        const b = s.ball
        ;[b.x, b.y, b.z, b.vx, b.vy, b.vz] = data.b
        b.isSmash = data.b[6] === 1
        b.bounceCount = data.b[7]
        s.paddlePlayer.targetX = data.p1[0]
        s.paddlePlayer.swing = data.p1[1]
        s.remoteServeHold = Boolean(data.st)
        if (Array.isArray(data.sr)) {
          const [format, winsPlayer, winsCpu, gameNo] = data.sr
          s.series.format = format === 3 ? 3 : 1
          s.series.wins = { player: Number(winsPlayer) || 0, cpu: Number(winsCpu) || 0 }
          s.series.gameNo = Number(gameNo) || 1
          s.series.gameScores = Array.isArray(data.gs) ? data.gs.map(String) : []
          setSeriesFormat(s.series.format)
          setSeriesView((prev) => (prev.gameNo === s.series.gameNo && prev.wins[0] === s.series.wins.player && prev.wins[1] === s.series.wins.cpu && prev.gameScores.length === s.series.gameScores.length
            ? prev
            : { wins: [s.series.wins.player, s.series.wins.cpu], gameNo: s.series.gameNo, gameScores: [...s.series.gameScores] }))
        }
        s.remoteServeStage = Number(data.st) || 0
        s.remoteServeSec = Number(data.sw) || 0
        b.magic = MAGIC_SERVES.includes(data.mg) ? data.mg : null
        if (Array.isArray(data.sp)) [b.ax, b.wobbleAmp, b.wobbleOmega, b.wobblePhase] = data.sp
        const [sp, sc, sv, rally, mr] = data.g
        s.game.scorePlayer = sp
        s.game.scoreCPU = sc
        setScorePlayer(sp)
        setScoreCPU(sc)
        setServer(sv === 0 ? 'player' : 'cpu')
        setRallyCount(rally)
        setMaxRally(mr)
        if (Boolean(data.pa) !== store.isPaused) store.setIsPaused(Boolean(data.pa))
        if (data.se) s.smashEffect = data.se
        if (typeof data.m === 'string') setLastPointMessage(data.m)
        if (Array.isArray(data.fx)) {
          for (const fx of data.fx as FxEvent[]) {
            if (fx === 'hit') miniGameAudio.pingpongRacketHit(0.95)
            else if (fx === 'smash') miniGameAudio.pingpongSmash()
            else if (fx === 'bounce') miniGameAudio.pingpongTableBounce()
            else if (fx === 'net') miniGameAudio.pingpongNetHit()
            else if (fx === 'cheer') miniGameAudio.cheer()
          }
        }
        setWinner(data.w || null)
        if (Boolean(data.pl) !== s.game.playing) {
          s.game.playing = Boolean(data.pl)
          setIsPlaying(s.game.playing)
        }
      }
    })
  }, [])

  // 입력칸에 글자를 칠 때는 게임 키로 쓰지 않는다
  const isTypingTarget = (target: EventTarget | null) => {
    const el = target as HTMLElement | null
    return Boolean(el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable))
  }

  // 키보드 조작 (A/D·방향키 이동, S/↑/↓ 중앙, Space/Enter 스매시, [P]/[ESC] 일시정지)
  useEffect(() => {
    if (!showPingpongModal) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return
      const s = stateRef.current

      // ⏸️ 일시정지 단축키 [P] 또는 [Escape]
      if (e.code === 'KeyP' || e.code === 'Escape') {
        e.preventDefault()
        if (s.game.playing) requestPauseToggle()
        return
      }

      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        s.keys.left = true
        setCourse('left')
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        s.keys.right = true
        setCourse('right')
      }
      if (e.code === 'KeyS' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault()
        setCourse('center')
      }
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter') {
        e.preventDefault()
        if (!e.repeat) triggerSmashAction()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const s = stateRef.current
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') s.keys.left = false
      if (e.code === 'KeyD' || e.code === 'ArrowRight') s.keys.right = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [showPingpongModal])

  // 🌟 윈도우 전역 마우스 추적 (원핸드 마우스 플레이 + 탁구대 바깥으로 나가도 조작 유지 및 클릭 스매시)
  useEffect(() => {
    if (!showPingpongModal) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()

      // 캔버스 기준 상대 X (캔버스 바깥으로 나가도 부드럽게 추종)
      const mx = (e.clientX - rect.left) * (800 / rect.width)
      const s = stateRef.current

      // 마우스 수평 스윙 속도 (당기기 제스처 감지)
      const deltaX = mx - s.mouse.lastScreenX
      s.mouse.vx = deltaX
      s.mouse.lastScreenX = mx

      // 마우스 X를 테이블 X (-1.0 ~ +1.0)로 변환 — 항상 내 화면 기준
      const tableX = Math.max(-1.0, Math.min(1.0, (mx - 400) / 260))
      if (liveRef.current.isGuest) s.localPaddle.targetX = tableX
      else s.paddlePlayer.targetX = tableX

      // 마우스 스윙 제스처 또는 위치에 따라 공격 방향(좌/중/우) 결정
      let course: AttackCourse = 'center'
      if (deltaX < -3.5 || (deltaX < 1.0 && tableX < -0.25)) course = 'left'
      else if (deltaX > 3.5 || (deltaX > -1.0 && tableX > 0.25)) course = 'right'
      if (course !== s.selectedCourse) setCourse(course)
    }

    // 버튼·입력칸 클릭은 스매시로 치지 않는다
    const handleGlobalMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      const el = e.target as HTMLElement | null
      if (el?.closest('button, input, select, textarea, a, label')) return
      triggerSmashAction()
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mousedown', handleGlobalMouseDown)

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mousedown', handleGlobalMouseDown)
    }
  }, [showPingpongModal])

  // 메인 게임 루프 (고정 60스텝/초 물리 + 매 프레임 렌더)
  useEffect(() => {
    if (!showPingpongModal || !isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const s = stateRef.current
    s.lastTime = 0
    s.accumulator = 0

    const gameLoop = (now: number) => {
      const live = liveRef.current
      const paused = useMiniGameStore.getState().isPaused

      // 1. 고정 간격 물리 계산
      const elapsed = s.lastTime ? Math.min(now - s.lastTime, 100) : STEP_MS
      s.lastTime = now
      s.accumulator += elapsed
      let steps = 0
      while (s.accumulator >= STEP_MS && steps < MAX_STEPS_PER_FRAME) {
        s.accumulator -= STEP_MS
        steps++
        if (live.isGuest) {
          if (!paused) stepGuest()
          continue
        }
        if (!paused && s.game.playing) stepSim()
        s.stepCount++
        if (live.isOnline && s.stepCount % SNAPSHOT_EVERY_STEPS === 0) sendSnapshot()
        if (!s.game.playing) break
      }
      if (steps >= MAX_STEPS_PER_FRAME) s.accumulator = 0

      // -------------------------------------------------------------
      // 2. 렌더링 (2.5D 레트로 탁구 1985 스타일) — 온라인 상대 화면은 위아래·좌우를 뒤집어 자기가 항상 아래쪽
      // -------------------------------------------------------------
      const flip = live.isGuest
      const b = s.ball
      const viewX = (x: number) => (flip ? -x : x)
      const viewY = (y: number) => (flip ? 1 - y : y)
      const myPaddle = flip ? s.localPaddle : s.paddlePlayer
      const oppPaddleX = flip ? -s.paddlePlayer.x : s.paddleCPU.x
      const ballVX = viewX(b.x)
      const ballVY = viewY(b.y)
      const ballVVy = flip ? -b.vy : b.vy
      const canSmashNow = ballVVy > 0 && ballVY > 0.60 && ballVY < 0.98 && b.z >= 10 && b.bounceCount === 1
      setIsSmashReady(canSmashNow)

      ctx.clearRect(0, 0, 800, 480)

      // 2-1. 오락실 배경 (블루 경기장 벽면 + 관중 스탠드)
      ctx.fillStyle = '#1e3a8a'
      ctx.fillRect(0, 0, 800, 155)

      // 관중석 도트 관객 실루엣 렌더링 (레트로 분위기 연출)
      for (let row = 0; row < 3; row++) {
        const crowdY = 35 + row * 24
        for (let col = 0; col < 26; col++) {
          const crowdX = 20 + col * 30 + (row % 2) * 12
          ctx.fillStyle = (col + row) % 3 === 0 ? '#fbbf24' : (col + row) % 3 === 1 ? '#f87171' : '#60a5fa'
          ctx.beginPath()
          ctx.arc(crowdX, crowdY, 5, 0, Math.PI * 2)
          ctx.fill()
          // 몸체
          ctx.fillStyle = '#1e293b'
          ctx.fillRect(crowdX - 4, crowdY + 5, 8, 8)
        }
      }

      // 경기장 펜스 및 WORKNEXUS 레트로 타이틀
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 115, 800, 40)
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 2
      ctx.strokeRect(0, 115, 800, 40)

      ctx.fillStyle = '#f8fafc'
      ctx.font = 'bold 15px monospace'
      ctx.textAlign = 'center'
      if (s.series.format === 3) {
        const myWins = flip ? s.series.wins.cpu : s.series.wins.player
        const oppWins = flip ? s.series.wins.player : s.series.wins.cpu
        ctx.fillText(`BEST OF 3 — GAME ${s.series.gameNo} · SET ${myWins} : ${oppWins}`, 400, 140)
      } else {
        ctx.fillText('WORKNEXUS PING PONG 1985 — 21 POINTS MATCH', 400, 140)
      }

      // 경기장 바닥 (그린 카페트)
      ctx.fillStyle = '#064e3b'
      ctx.fillRect(0, 155, 800, 325)

      // 2-2. 탁구대 다리 (원목 다리 4개)
      ctx.fillStyle = '#78350f'
      ctx.fillRect(285, 230, 14, 50)
      ctx.fillRect(501, 230, 14, 50)
      ctx.fillRect(170, 395, 20, 60)
      ctx.fillRect(610, 395, 20, 60)

      // 2-3. 탁구대 3D 사다리꼴 상판 (Perspective Trapezoid)
      // 상판 바닥면 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
      ctx.beginPath()
      ctx.moveTo(260, 160)
      ctx.lineTo(540, 160)
      ctx.lineTo(680, 425)
      ctx.lineTo(120, 425)
      ctx.closePath()
      ctx.fill()

      // 탁구대 두께 옆면
      ctx.fillStyle = '#0f766e'
      ctx.beginPath()
      ctx.moveTo(135, 415)
      ctx.lineTo(665, 415)
      ctx.lineTo(665, 424)
      ctx.lineTo(135, 424)
      ctx.closePath()
      ctx.fill()

      // 탁구대 상판 본체 (레트로 클래식 에메랄드 그린)
      ctx.fillStyle = '#16a34a'
      ctx.beginPath()
      ctx.moveTo(270, 155) // Top-Left
      ctx.lineTo(530, 155) // Top-Right
      ctx.lineTo(660, 415) // Bottom-Right
      ctx.lineTo(140, 415) // Bottom-Left
      ctx.closePath()
      ctx.fill()

      // 탁구대 외곽 흰색 테두리선
      ctx.strokeStyle = '#f8fafc'
      ctx.lineWidth = 3
      ctx.stroke()

      // 탁구대 세로 중앙 분할선 (Center Line)
      ctx.beginPath()
      ctx.moveTo(400, 155)
      ctx.lineTo(400, 415)
      ctx.lineWidth = 2
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
      ctx.stroke()

      // 2-4. 🎯 상대방 코트의 3개 공격 코스 타겟 영역 하이라이트
      const courseXPos: Record<AttackCourse, { x: number; label: string }> = {
        left: { x: 325, label: '◀ 좌측 코스' },
        center: { x: 400, label: '▲ 중앙 코스' },
        right: { x: 475, label: '▶ 우측 코스' }
      }
      const activeTarget = courseXPos[s.selectedCourse]

      // 현재 선택된 공격 코스에 황금빛 타겟 링 & 영역 강조
      ctx.save()
      ctx.fillStyle = 'rgba(250, 204, 21, 0.22)'
      ctx.beginPath()
      ctx.ellipse(activeTarget.x, 215, 34, 18, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = '#facc15'
      ctx.lineWidth = 2
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.ellipse(activeTarget.x, 215, 34, 18, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      // 조준 레이블
      ctx.fillStyle = '#fef08a'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`🎯 ${activeTarget.label}`, activeTarget.x, 192)
      ctx.restore()

      // 2-5. 가로 탁구 네트 (Net, Y = 280)
      // 네트 메쉬 망
      ctx.fillStyle = 'rgba(241, 245, 249, 0.82)'
      ctx.fillRect(195, 258, 410, 22)

      // 네트 격자 무늬
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)'
      ctx.lineWidth = 1
      for (let nx = 195; nx <= 605; nx += 8) {
        ctx.beginPath()
        ctx.moveTo(nx, 258)
        ctx.lineTo(nx, 280)
        ctx.stroke()
      }

      // 네트 상단 백색 밴드 테이프
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(190, 258)
      ctx.lineTo(610, 258)
      ctx.stroke()

      // 네트 좌우 지지 포스트 기둥
      ctx.fillStyle = '#cbd5e1'
      ctx.fillRect(188, 250, 7, 32)
      ctx.fillRect(605, 250, 7, 32)

      // 2-6. 상대방 라켓 (위쪽, Y ~ 0.05)
      const cpuPr = project(oppPaddleX, 0.05, 12)
      ctx.save()
      ctx.translate(cpuPr.screenX, cpuPr.screenVisualY)
      // 상대방 라켓 손잡이
      ctx.fillStyle = '#92400e'
      ctx.fillRect(-4, -18, 8, 14)
      // 상대방 라켓 블레이드 (원형 레드 러버)
      ctx.fillStyle = '#dc2626'
      ctx.beginPath()
      ctx.ellipse(0, 0, 16, 14, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.restore()

      // 2-7. 공 바닥 그림자 & 공 본체
      const ballPr = project(ballVX, ballVY, b.z)
      const shadowScale = Math.max(0.4, 1.2 - b.z / 35) * ballPr.scale
      const shadowAlpha = Math.max(0.12, 0.45 - b.z / 50)

      // 그림자
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`
      ctx.beginPath()
      ctx.ellipse(ballPr.screenX, ballPr.screenY, b.radius * shadowScale * 1.5, b.radius * shadowScale * 0.8, 0, 0, Math.PI * 2)
      ctx.fill()

      // 스매시 불꽃 속도선
      if (b.isSmash) {
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(ballPr.screenX, ballPr.screenVisualY + (ballVVy > 0 ? -18 : 18))
        ctx.lineTo(ballPr.screenX, ballPr.screenVisualY)
        ctx.stroke()
      }

      // 마구 서브 꼬리 (최근 위치를 점점 흐리게)
      const magicColor = b.magic ? MAGIC_INFO[b.magic].color : null
      if (magicColor) {
        s.trail.push({ x: ballPr.screenX, y: ballPr.screenVisualY })
        if (s.trail.length > 12) s.trail.shift()
        ctx.save()
        ctx.fillStyle = magicColor
        s.trail.forEach((p, i) => {
          ctx.globalAlpha = ((i + 1) / s.trail.length) * 0.45
          ctx.beginPath()
          ctx.arc(p.x, p.y, b.radius * ballPr.scale * (0.4 + (i / s.trail.length) * 0.6), 0, Math.PI * 2)
          ctx.fill()
        })
        ctx.restore()
      } else if (s.trail.length) {
        s.trail = []
      }

      // 탁구공 본체
      const ballR = (b.radius + b.z * 0.08) * ballPr.scale
      ctx.save()
      ctx.shadowColor = magicColor ?? (b.isSmash ? 'rgba(250, 204, 21, 0.95)' : 'rgba(255, 255, 255, 0.8)')
      ctx.shadowBlur = b.isSmash || magicColor ? 16 : 8
      ctx.fillStyle = magicColor ?? (b.isSmash ? '#fef08a' : '#ffffff')
      ctx.beginPath()
      ctx.arc(ballPr.screenX, ballPr.screenVisualY, ballR, 0, Math.PI * 2)
      ctx.fill()
      // 하이라이트
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(ballPr.screenX - 1.5, ballPr.screenVisualY - 1.5, ballR * 0.4, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // 찬스볼 ⚡ SMASH 알림
      if (canSmashNow) {
        ctx.save()
        ctx.fillStyle = '#facc15'
        ctx.font = 'bold 12px sans-serif'
        ctx.textAlign = 'center'
        ctx.shadowColor = '#eab308'
        ctx.shadowBlur = 10
        ctx.fillText('⚡ SMASH CHANCE!', ballPr.screenX, ballPr.screenVisualY - 16)
        ctx.restore()
      }

      // 2-8. 내 라켓 & 손 (화면 아래쪽: Y ~ 0.96)
      const playerPr = project(myPaddle.x, 0.96, 12)
      ctx.save()
      ctx.translate(playerPr.screenX, playerPr.screenVisualY + myPaddle.swing)
      // 🌟 마우스 스윙 속도(당기기 제스처)에 따른 라켓 다이내믹 틸트 회전
      const racketTilt = Math.max(-0.35, Math.min(0.35, s.mouse.vx * 0.025))
      ctx.rotate(racketTilt)
      // 라켓 손잡이
      ctx.fillStyle = '#92400e'
      ctx.beginPath()
      ctx.roundRect(-5, 14, 10, 22, 3)
      ctx.fill()
      // 플레이어 라켓 블레이드 (원형 블루 러버)
      ctx.fillStyle = '#0284c7'
      ctx.beginPath()
      ctx.ellipse(0, 0, 24, 20, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2.5
      ctx.stroke()
      ctx.restore()

      // 2-9. 스매시 타격 이펙트 팝업
      if (s.smashEffect && s.smashEffect.timer > 0) {
        const fxPr = project(viewX(s.smashEffect.x), viewY(s.smashEffect.y), s.smashEffect.z)
        ctx.save()
        ctx.font = 'bold 22px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = s.smashEffect.color ?? '#facc15'
        ctx.shadowColor = s.smashEffect.color ?? '#f59e0b'
        ctx.shadowBlur = 16
        ctx.fillText(s.smashEffect.text, Math.max(150, Math.min(650, fxPr.screenX)), fxPr.screenVisualY - 15)
        ctx.restore()
      }

      // 🏓 내 서브 차례 안내 (클릭/스페이스, 안 누르면 자동)
      const serveStage = flip ? s.remoteServeStage : s.serveWaiting ? (s.serveTimer > 0 ? 1 : 2) : 0
      const iAmServer = serverRef.current === (flip ? 'cpu' : 'player')
      if (serveStage === 2 && iAmServer && !paused) {
        const sec = flip ? s.remoteServeSec : Math.ceil((SERVE_AUTO_STEPS - s.serveWaitSteps) / 60)
        ctx.save()
        ctx.font = 'bold 16px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#facc15'
        ctx.shadowColor = '#000000'
        ctx.shadowBlur = 6
        ctx.fillText(`🏓 클릭 또는 스페이스로 서브! (${Math.max(0, sec)}초 후 자동)`, 400, 300)
        ctx.restore()
      }

      // 2-10. 8-Bit 레트로 스코어보드 오버레이 (좌측 = 나, 우측 = 상대)
      const g = s.game
      const myScore = flip ? g.scoreCPU : g.scorePlayer
      const oppScore = flip ? g.scorePlayer : g.scoreCPU
      const mySide: Side = flip ? 'cpu' : 'player'
      const serverSide = serverRef.current
      const myLabel = live.isOnline ? (flip ? '2P' : '1P') : '1P'
      const oppLabel = live.isOnline ? (flip ? '1P' : '2P') : 'CPU'
      const myBoardName = flip ? live.topName : live.bottomName
      const oppBoardName = flip ? live.bottomName : live.topName

      ctx.fillStyle = '#020617'
      ctx.fillRect(24, 18, 140, 80)
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 2
      ctx.strokeRect(24, 18, 140, 80)

      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${myLabel}: ${myBoardName}`, 94, 34)

      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 28px monospace'
      ctx.fillText(String(myScore).padStart(2, '0'), 94, 66)

      ctx.fillStyle = serverSide === mySide ? '#facc15' : 'rgba(255,255,255,0.25)'
      ctx.font = 'bold 10px monospace'
      ctx.fillText(serverSide === mySide ? '● SERVE' : '○ WAIT', 94, 86)

      const oppColor = live.isOnline ? '#a855f7' : '#ef4444'
      ctx.fillStyle = '#020617'
      ctx.fillRect(636, 18, 140, 80)
      ctx.strokeStyle = oppColor
      ctx.lineWidth = 2
      ctx.strokeRect(636, 18, 140, 80)

      ctx.fillStyle = live.isOnline ? '#c084fc' : '#f87171'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${oppLabel}: ${oppBoardName}`, 706, 34)

      ctx.fillStyle = oppColor
      ctx.font = 'bold 28px monospace'
      ctx.fillText(String(oppScore).padStart(2, '0'), 706, 66)

      ctx.fillStyle = serverSide !== mySide ? '#facc15' : 'rgba(255,255,255,0.25)'
      ctx.font = 'bold 10px monospace'
      ctx.fillText(serverSide !== mySide ? '● SERVE' : '○ WAIT', 706, 86)

      // ⏸️ 일시정지 중일 때 반투명 안내 오버레이 렌더링
      if (paused) {
        ctx.fillStyle = 'rgba(2, 6, 23, 0.78)'
        ctx.fillRect(0, 0, 800, 480)

        ctx.fillStyle = '#facc15'
        ctx.font = 'bold 24px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('⏸️ 게임 일시 정지됨 (PAUSED)', 400, 220)

        ctx.fillStyle = '#e2e8f0'
        ctx.font = 'bold 13px sans-serif'
        ctx.fillText('[P] 키 또는 상단 [▶️ 계속하기] 버튼을 누르면 게임이 재개됩니다.', 400, 255)
      }

      animFrameRef.current = requestAnimationFrame(gameLoop)
    }

    animFrameRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [showPingpongModal, isPlaying])

  // 방장/AI 대전에서 일시정지 상태가 바뀌면 상대에게도 바로 알린다
  useEffect(() => {
    if (isOnline && !isGuest) sendSnapshot()
  }, [isPaused])

  // 나가기: 온라인 대전 중이면 상대에게 알리고 대전을 끝낸다
  const handleClose = () => {
    if (onlineMatch?.game === 'pingpong') miniGameNetwork.leave()
    stateRef.current.game.playing = false
    setIsPlaying(false)
    setShowInvitePicker(false)
    closePingpong()
  }

  if (!showPingpongModal) return null

  // UI 표시용 (내 화면 기준) 점수
  const myScoreUI = isGuest ? scoreCPU : scorePlayer
  const oppScoreUI = isGuest ? scorePlayer : scoreCPU
  const waitingForHost = isGuest && !isPlaying

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(2, 6, 23, 0.88)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
      onClick={() => {
        // 🌟 핑퐁 게임 중 바깥 클릭으로 모달이 꺼지지 않도록 방어 (나가기 버튼으로만 종료)
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 900,
          maxHeight: '100%',
          overflowY: 'auto',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.92))',
          borderRadius: 20,
          border: '1px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 45px rgba(56, 189, 248, 0.15)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* 상단 헤더 */}
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
            background: 'rgba(2, 6, 23, 0.5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🏓</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
                레트로 탁구 (Retro Ping Pong)
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: 'rgba(234, 179, 8, 0.2)',
                    color: '#facc15',
                    border: '1px solid rgba(234, 179, 8, 0.4)'
                  }}
                >
                  21점 선취제
                </span>
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: !isOnline ? 'rgba(56, 189, 248, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                    color: !isOnline ? '#38bdf8' : '#c084fc',
                    border: `1px solid ${!isOnline ? 'rgba(56, 189, 248, 0.4)' : 'rgba(168, 85, 247, 0.4)'}`
                  }}
                >
                  {!isOnline ? '🤖 vs AI 대전' : `🌐 온라인 대전 vs ${oppName}`}
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: '#94a3b8' }}>
                나의 시야 2.5D 시점 • {myName} vs {oppName} • [P] 키로 언제든 일시정지 가능
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* 👥 플레이어 이름 설정 (AI 대전 전용 — 온라인 대전은 실제 이름 사용) */}
            {!isOnline && (
              <button
                onClick={() => setShowPlayerModal(true)}
                disabled={isPlaying}
                style={{
                  background: 'rgba(56, 189, 248, 0.18)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#38bdf8',
                  borderRadius: 8,
                  padding: '6px 12px',
                  cursor: isPlaying ? 'not-allowed' : 'pointer',
                  opacity: isPlaying ? 0.45 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 700
                }}
                title="AI 대전에 표시할 이름을 설정합니다."
              >
                <Users size={14} /> 플레이어 등록
              </button>
            )}

            {/* 📋 이 건물의 모든 경기 기록·랭킹 (체험 사이트에는 기록이 없어 숨긴다) */}
            {isMatchRecordingAvailable() && <button
              onClick={() => {
                // AI 대전 중이면 기록을 보는 동안 잠깐 멈춘다
                if (isPlaying && !isOnline && !isPaused) setIsPaused(true)
                setShowRecords(true)
              }}
              style={{
                background: 'rgba(56, 189, 248, 0.14)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#7dd3fc',
                borderRadius: 8,
                padding: '6px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                fontWeight: 700
              }}
              title="이 건물에서 진행한 당구·탁구 모든 경기 기록과 랭킹을 봅니다."
            >
              <ClipboardList size={14} /> 경기 기록
            </button>}

            {/* 🌐 온라인 대전 시작 / 종료 */}
            <button
              onClick={() => (isOnline ? miniGameNetwork.leave() : setShowInvitePicker(true))}
              disabled={!isOnline && isPlaying}
              style={{
                background: isOnline ? 'rgba(239, 68, 68, 0.15)' : 'rgba(168, 85, 247, 0.18)',
                border: `1px solid ${isOnline ? 'rgba(239, 68, 68, 0.35)' : 'rgba(168, 85, 247, 0.4)'}`,
                color: isOnline ? '#f87171' : '#d8b4fe',
                borderRadius: 8,
                padding: '6px 12px',
                cursor: !isOnline && isPlaying ? 'not-allowed' : 'pointer',
                opacity: !isOnline && isPlaying ? 0.45 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                fontWeight: 600
              }}
              title="같은 건물 동료를 초대해 각자 자기 PC에서 실시간으로 대전합니다."
            >
              <Globe size={14} />
              {isOnline ? '온라인 대전 종료' : '온라인 대전'}
            </button>

            {/* ⏸️ 일시정지 / 재개 버튼 (게임 진행 중일 때 노출) */}
            {isPlaying && (
              <button
                onClick={requestPauseToggle}
                style={{
                  background: isPaused ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                  border: isPaused ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(234, 179, 8, 0.4)',
                  color: isPaused ? '#4ade80' : '#facc15',
                  borderRadius: 8,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 700
                }}
                title="게임 일시정지 / 계속하기 [P]"
              >
                {isPaused ? <Play size={14} /> : <Pause size={14} />}
                {isPaused ? '▶️ 계속하기 [P]' : '⏸️ 일시정지 [P]'}
              </button>
            )}

            <button
              onClick={handleClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#cbd5e1',
                borderRadius: 8,
                padding: '6px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12
              }}
            >
              <X size={15} /> 나가기
            </button>
          </div>
        </div>

        {/* 🎯 3대 공격 코스 선택 컨트롤바 (좌측 / 중앙 / 우측) */}
        <div
          style={{
            padding: '8px 20px',
            background: 'rgba(15, 23, 42, 0.75)',
            borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>공격 코스 선택:</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => setCourse('left')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 8,
                  background: aimCourse === 'left' ? 'rgba(250, 204, 21, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  border: aimCourse === 'left' ? '1.5px solid #facc15' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: aimCourse === 'left' ? '#facc15' : '#cbd5e1',
                  fontWeight: 700,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <ArrowLeft size={13} /> 좌측 코너 [A]
              </button>

              <button
                onClick={() => setCourse('center')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 8,
                  background: aimCourse === 'center' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  border: aimCourse === 'center' ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: aimCourse === 'center' ? '#38bdf8' : '#cbd5e1',
                  fontWeight: 700,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <ArrowUp size={13} /> 중앙 코스 [S]
              </button>

              <button
                onClick={() => setCourse('right')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 8,
                  background: aimCourse === 'right' ? 'rgba(250, 204, 21, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  border: aimCourse === 'right' ? '1.5px solid #facc15' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: aimCourse === 'right' ? '#facc15' : '#cbd5e1',
                  fontWeight: 700,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                우측 코너 [D] <ArrowRight size={13} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>🔥 랠리: {rallyCount}회 (최고 {maxRally})</span>
            {isSmashReady && (
              <span style={{ color: '#facc15', fontWeight: 800, animation: 'pulse 1s infinite' }}>
                ⚡ [클릭 / 스페이스] 스매시 가능!
              </span>
            )}
          </div>
        </div>

        {/* 캔버스 플레이 영역 (2.5D 레트로 탁구 시점 — 가로·세로 비율 고정) */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '800 / 480', background: '#020617', flexShrink: 0 }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={480}
            style={{ width: '100%', height: '100%', display: 'block', cursor: 'ew-resize' }}
          />

          {/* 시작 전 또는 승리 시 오버레이 */}
          {!isPlaying && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(2, 6, 23, 0.9)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                padding: 24,
                zIndex: 20
              }}
            >
              {/* 🎆 우승 세리머니 (AI가 이기면 짧은 박수·꽃가루만) */}
              {winner && <PingpongVictoryCelebration key={winner} winnerName={winner} short={!isOnline && winner === oppName} />}
              {winner ? (
                <div style={{ textAlign: 'center' }}>
                  <Trophy size={48} color="#facc15" style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc' }}>
                    🎉 {winner} 최종 우승!
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                    {seriesView.gameScores.length > 1 || seriesFormat === 3
                      ? `최종 세트 ${isGuest ? seriesView.wins[1] : seriesView.wins[0]} : ${isGuest ? seriesView.wins[0] : seriesView.wins[1]} (3판 2선승 · 게임별 ${seriesView.gameScores.map((g) => (isGuest ? g.split(':').reverse().join(':') : g)).join(', ')})`
                      : `최종 스코어 ${myScoreUI} : ${oppScoreUI} (21점 선취 매치 종료)`}
                  </div>
                  {recordNotice && <div style={{ color: '#7dd3fc', fontSize: 12, marginTop: 4 }}>{recordNotice}</div>}
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc' }}>
                    🏓 레트로 탁구 (Retro Ping Pong)
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 12.5, marginTop: 4 }}>
                    21점 선취제 매치 • AI 대전 & 동료와 온라인 1:1 대전 • 마우스 당기기로 원하는 코너에 강타!
                  </div>
                </div>
              )}

              {/* 매치 참가 플레이어 정보 카드 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '10px 20px',
                  borderRadius: 14,
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(56, 189, 248, 0.25)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: '#38bdf8',
                      color: '#0f172a',
                      fontWeight: 900,
                      fontSize: 11,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isGuest ? '2P' : '1P'}
                  </span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>나</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>{myName}</div>
                  </div>
                </div>

                <div style={{ fontWeight: 900, color: '#facc15', fontSize: 14 }}>VS</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: !isOnline ? '#ef4444' : '#a855f7',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: 11,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {!isOnline ? 'AI' : isGuest ? '1P' : '2P'}
                  </span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{!isOnline ? '상대방 (AI 팀장님)' : '온라인 상대'}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>{oppName}</div>
                  </div>
                </div>
              </div>

              {/* 🏆 판수 선택: 1판(기본) / 3판 2선승 — 온라인은 방장이 고른다 */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, color: '#94a3b8' }}>판수</span>
                {([1, 3] as SeriesFormat[]).map((format) => (
                  <button
                    key={format}
                    onClick={() => chooseSeriesFormat(format)}
                    disabled={isGuest}
                    title={isGuest ? '온라인 대전의 판수는 초대한 사람이 정합니다.' : undefined}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 999,
                      border: `1px solid ${seriesFormat === format ? 'rgba(250, 204, 21, 0.75)' : 'rgba(148, 163, 184, 0.3)'}`,
                      background: seriesFormat === format ? 'rgba(250, 204, 21, 0.18)' : 'rgba(15, 23, 42, 0.6)',
                      color: seriesFormat === format ? '#fde047' : '#94a3b8',
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: isGuest ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {format === 1 ? '1판' : '3판 2선승'}
                  </button>
                ))}
              </div>

              {/* 매치 모드 선택 */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                {!isOnline ? (
                  <>
                    <button
                      onClick={() => {
                        if (aiDifficulty === 'easy') setAiDifficulty('normal')
                        else if (aiDifficulty === 'normal') setAiDifficulty('hard')
                        else setAiDifficulty('easy')
                      }}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 10,
                        background: 'rgba(234, 179, 8, 0.15)',
                        color: '#facc15',
                        border: '1px solid rgba(234, 179, 8, 0.35)',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Bot size={15} /> AI 난이도: {aiDifficulty.toUpperCase()}
                    </button>
                    <button
                      onClick={() => setShowInvitePicker(true)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 10,
                        background: 'rgba(168, 85, 247, 0.18)',
                        color: '#d8b4fe',
                        border: '1px solid rgba(168, 85, 247, 0.4)',
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Globe size={15} /> 동료와 온라인 1:1 대전
                    </button>
                  </>
                ) : (
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: 10,
                      background: 'rgba(168, 85, 247, 0.12)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      color: '#d8b4fe',
                      fontSize: 11.5
                    }}
                  >
                    🌐 두 사람 모두 자기 라켓이 화면 아래쪽에 보입니다 • 마우스 이동 + 클릭 스매시
                  </div>
                )}
              </div>

              {waitingForHost ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#d8b4fe', fontSize: 14, fontWeight: 700, marginTop: 4 }}>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  {oppName} 님이 게임을 시작하기를 기다리는 중...
                </div>
              ) : (
                <button
                  onClick={startGame}
                  style={{
                    padding: '12px 42px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(2, 132, 199, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 4
                  }}
                >
                  <Play size={18} fill="#ffffff" /> {winner ? '한판 더 하기!' : '게임 시작!'}
                </button>
              )}
            </div>
          )}

          {/* 🌐 온라인 대전 상대 선택 */}
          {/* 📋 경기 기록 게시판 */}
          {showRecords && <MiniGameRecordBoard initialGame="pingpong" onClose={() => setShowRecords(false)} />}

          {showInvitePicker && !isOnline && (
            <OnlineInvitePicker game="pingpong" onClose={() => setShowInvitePicker(false)} />
          )}

          {/* 👥 플레이어 이름 설정 팝업 (AI 대전) */}
          {showPlayerModal && !isOnline && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(2, 6, 23, 0.92)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 40,
                padding: 20
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: 440,
                  background: 'rgba(15, 23, 42, 0.98)',
                  borderRadius: 16,
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  padding: 24,
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Users size={18} color="#38bdf8" /> AI 대전 플레이어 이름 설정
                  </div>
                  <button
                    onClick={() => setShowPlayerModal(false)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Player 1 (내 캐릭터) */}
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                      플레이어 1 (화면 하단 • 본인)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: '#38bdf8',
                          color: '#0f172a',
                          fontWeight: 900,
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        1P
                      </span>
                      <input
                        type="text"
                        value={player1Name}
                        onChange={(e) => setPlayer1Name(e.target.value)}
                        placeholder="내 캐릭터 이름"
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: 8,
                          background: 'rgba(30, 41, 59, 0.9)',
                          border: '1px solid rgba(148, 163, 184, 0.3)',
                          color: '#f8fafc',
                          fontSize: 13,
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* AI 상대 이름 */}
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                      상대 (AI 팀장님 닉네임)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: '#ef4444',
                          color: '#ffffff',
                          fontWeight: 900,
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        AI
                      </span>
                      <input
                        type="text"
                        value={player2Name}
                        onChange={(e) => setPlayer2Name(e.target.value)}
                        placeholder="팀장님 (AI)"
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: 8,
                          background: 'rgba(30, 41, 59, 0.9)',
                          border: '1px solid rgba(148, 163, 184, 0.3)',
                          color: '#f8fafc',
                          fontSize: 13,
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    동료와 겨루려면 [🌐 온라인 대전]으로 초대하세요. 각자 자기 PC에서 실시간으로 대전합니다.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                  <button
                    onClick={() => {
                      const p1 = player1Name.trim() || myUserName || 'Player 1'
                      const p2 = player2Name.trim() || '팀장님 (AI)'
                      setPlayer1Name(p1)
                      setPlayer2Name(p2)
                      setPingpongPlayers([p1, p2])
                      setShowPlayerModal(false)
                      setLastPointMessage(`👥 매치가 설정되었습니다: ${p1} vs ${p2} (AI 대전)`)
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: 13.5,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    등록 완료
                  </button>
                  <button
                    onClick={() => setShowPlayerModal(false)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 10,
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#cbd5e1',
                      fontWeight: 600,
                      fontSize: 13.5,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 하단 조작 가이드 & 팁 */}
        <div
          style={{
            padding: '10px 20px',
            background: 'rgba(2, 6, 23, 0.8)',
            borderTop: '1px solid rgba(148, 163, 184, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
            fontSize: 11.5,
            color: '#94a3b8'
          }}
        >
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <span>🖱️ <b>마우스 좌우/당기기</b> (또는 A/D·←/→): 라켓 이동 & 공격 방향</span>
            <span>⚡ <b>클릭 / [Space / Enter]</b>: 맞히기 직전에 누르면 스매시!</span>
            <span style={{ color: '#facc15' }}>⏸️ <b>[P]</b>: 일시정지</span>
          </div>
          <div style={{ color: '#38bdf8', fontWeight: 600 }}>
            {lastPointMessage}
          </div>
        </div>
      </div>
    </div>
  )
}
