"use client"

import React, { useEffect, useRef, useState, useMemo } from 'react'
import {
  useMiniGameStore,
  BILLIARD_AI_NAME,
  type SeriesFormat,
  type MiniGameDifficulty,
  BilliardBallState,
  BilliardSnapshot,
  BILLIARD_TABLE_WIDTH as TABLE_WIDTH,
  BILLIARD_TABLE_HEIGHT as TABLE_HEIGHT,
  BILLIARD_BALL_RADIUS as BALL_RADIUS,
  BILLIARD_RAIL as RAIL,
  BILLIARD_HEAD_SPOT,
  BILLIARD_FOOT_SPOT
} from '../../store/useMiniGameStore'
import { useOfficeStore } from '../../store/useOfficeStore'
import { miniGameAudio } from '../../services/miniGameAudio'
import { miniGameNetwork } from '../../services/miniGameNetwork'
import { OnlineInvitePicker } from './MiniGameOnline'
import { MiniGameRecordBoard } from './MiniGameRecordBoard'
import { BilliardVictoryCelebration, SPRITE_OPEN, SPRITE_WINK, SPRITE_PALETTE } from './BilliardVictoryCelebration'
import { paintSprite } from './retroCelebrationKit'
import { planAiShot, planCuePlacement, type TableGeometry } from './billiardAi'
import { POCKETS, POCKET_RADIUS, CUSH_L, CUSH_R, CUSH_T, CUSH_B, MAX_CUE_SPEED, stepBilliardPhysics } from './billiardPhysics'
import { miniGameRecords, isMatchRecordingAvailable } from '../../services/miniGameRecords'
import { Trophy, RotateCcw, AlertTriangle, ArrowRight, LogOut, CheckCircle2, Users, Plus, Trash2, X, Globe, Hand, ClipboardList } from 'lucide-react'

// 공 색상 및 스타일 정의 (나인볼 표준 규격)
const BALL_STYLES: Record<number, { color: string; isStripe: boolean; label: string }> = {
  0: { color: '#ffffff', isStripe: false, label: '수구' },
  1: { color: '#fbbf24', isStripe: false, label: '1번 (황색)' },
  2: { color: '#2563eb', isStripe: false, label: '2번 (청색)' },
  3: { color: '#dc2626', isStripe: false, label: '3번 (적색)' },
  4: { color: '#7c3aed', isStripe: false, label: '4번 (자색)' },
  5: { color: '#ea580c', isStripe: false, label: '5번 (주황)' },
  6: { color: '#16a34a', isStripe: false, label: '6번 (녹색)' },
  7: { color: '#78350f', isStripe: false, label: '7번 (갈색)' },
  8: { color: '#0f172a', isStripe: false, label: '8번 (흑색)' },
  9: { color: '#f59e0b', isStripe: true, label: '9번 (황금 스트라이프)' } // 승리 결정구!
}

// 물리는 모니터 주사율과 무관하게 1초에 60번 고정 간격으로 계산한다(144Hz 모니터에서 빨라지지 않게)
const STEP_MS = 1000 / 60
const MAX_STEPS_PER_FRAME = 6
// 온라인 대전: 공이 굴러가는 동안 상대에게 위치를 보내는 간격(2스텝 = 초당 30회), 조준선 전송 간격
const NET_FRAME_EVERY_STEPS = 2
const AIM_SEND_INTERVAL_MS = 50

type SoundQueue = { cue: number; hit: number; cushion: number; pocket: boolean }
type ShotSfx = 'nice' | 'win' | 'foul' | 'rack' | null

const emptySoundQueue = (): SoundQueue => ({ cue: 0, hit: 0, cushion: 0, pocket: false })
const cloneBalls = (balls: BilliardBallState[]) => balls.map((b) => ({ ...b }))
const round1 = (v: number) => Math.round(v * 10) / 10

function lowestBallOf(balls: BilliardBallState[]): number {
  const unpocketed = balls.filter((b) => !b.isPocketed && b.id > 0)
  if (unpocketed.length === 0) return 9
  return Math.min(...unpocketed.map((b) => b.id))
}

function isInsideCushion(x: number, y: number) {
  return x >= CUSH_L && x <= CUSH_R && y >= CUSH_T && y <= CUSH_B
}

function overlapsOtherBall(balls: BilliardBallState[], id: number, x: number, y: number) {
  return balls.some((b) => b.id !== id && !b.isPocketed && Math.hypot(b.x - x, b.y - y) < BALL_RADIUS * 2 + 0.5)
}

// 공을 다시 놓을 자리 찾기: 원하는 지점이 막혀 있으면 가로(긴 쪽) 방향으로 조금씩 밀면서 빈 자리를 찾는다
function findFreeSpot(balls: BilliardBallState[], id: number, x: number, y: number) {
  const step = BALL_RADIUS * 2 + 1
  for (let k = 0; k < 40; k++) {
    const offsets = k === 0 ? [[0, 0]] : [[k * step, 0], [-k * step, 0], [0, k * step], [0, -k * step]]
    for (const [ox, oy] of offsets) {
      const cx = x + ox
      const cy = y + oy
      if (isInsideCushion(cx, cy) && !overlapsOtherBall(balls, id, cx, cy)) return { x: cx, y: cy }
    }
  }
  return { x, y }
}

// 🤖 세라(AI) 샷 계획에 넘길 테이블 정보
const AI_GEOMETRY: TableGeometry = {
  ballRadius: BALL_RADIUS,
  pockets: POCKETS,
  bounds: { left: CUSH_L, right: CUSH_R, top: CUSH_T, bottom: CUSH_B },
  pocketRadius: POCKET_RADIUS,
  maxSpeed: MAX_CUE_SPEED
}
const DIFFICULTY_LABEL: Record<MiniGameDifficulty, string> = { easy: '이지', normal: '보통', hard: '하드' }
// 세라 대사
const SERA_LINES = {
  turn: ['제 차례예요~ ♥', '잘 보세요~ ♥', '이번엔 넣어 볼게요!'],
  pot: ['나이스~ ♥ 한 번 더!', '들어갔다~ ♥', '후훗, 어때요? ♥'],
  miss: ['아잉, 아깝다~', '어머, 빗나갔네…', '다음엔 넣을 거예요!'],
  foul: ['어머, 파울이네요… 프리볼 드릴게요 ♥', '앗, 실수~ 봐주세요 ♥'],
  rack: ['이번 랙은 제가 가져갈게요~ ♥'],
  kick1: ['막혔네~ 원 쿠션으로 갈게요 ♥', '쿠션 한 번 맞혀 볼게요~'],
  kick2: ['투 쿠션! 잘 보세요~ ♥', '두 번 돌려서 맞혀 볼게요~'],
  win: ['세라 승리~ ♥ 다음엔 잘해 봐요!'],
  lose: ['축하해요~ ♥ 멋졌어요!']
}
const pickLine = (kind: keyof typeof SERA_LINES) => {
  const lines = SERA_LINES[kind]
  return lines[Math.floor(Math.random() * lines.length)]
}

// 세라 얼굴 (말풍선 옆 작은 도트)
const SeraPortrait: React.FC<{ wink: boolean }> = ({ wink }) => {
  const ref = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    if (ref.current) paintSprite(ref.current, (wink ? SPRITE_WINK : SPRITE_OPEN).slice(0, 18), SPRITE_PALETTE, 2)
  }, [wink])
  return <canvas ref={ref} width={40} height={36} style={{ width: 40, height: 36, imageRendering: 'pixelated', flexShrink: 0 }} />
}

// 이미 기록을 올린 판 (창을 닫았다 다시 열어 승리 화면이 다시 떠도 두 번 올리지 않는다)
const recordedBilliardGames = new Set<string>()

export const BilliardMiniGameModal: React.FC = () => {
  const {
    showBilliardModal,
    closeBilliard,
    billiardPlayers,
    setBilliardPlayers,
    currentTurnIdx,
    billiardBalls,
    foulMessage,
    lastShotMessage,
    setLastShotMessage,
    winner,
    turnCount,
    ballInHand,
    billiardSyncVersion,
    resetBilliardGame,
    nextBilliardTurn,
    onlineMatch,
    billiardAi,
    billiardSeries,
    setBilliardAi,
    setBilliardSeriesFormat
  } = useMiniGameStore()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameRef = useRef<number | null>(null)

  // 조준 및 샷 인터랙션 상태 (UI 표시용 — 물리 루프는 viewRef 값을 읽는다)
  const [shotPower, setShotPower] = useState(0) // 0 ~ 100
  const [isPulling, setIsPulling] = useState(false)
  const [isMoving, setIsMoving] = useState(false)

  // 사내 오피스 사용자 & 동료 직원 정보
  const myUserName = useOfficeStore((state) => state.userName)
  const officeEmployees = useOfficeStore((state) => state.employees)

  // 플레이어 등록 / 온라인 대전 상대 선택 팝업 상태
  const [showPlayerModal, setShowPlayerModal] = useState(false)
  const [showInvitePicker, setShowInvitePicker] = useState(false)
  const [showRecords, setShowRecords] = useState(false)
  const [editingPlayers, setEditingPlayers] = useState<string[]>([...billiardPlayers])

  // 🌐 온라인 대전: 호스트(초대한 사람)가 1번 플레이어, 게스트가 2번 플레이어
  const isOnline = onlineMatch?.game === 'billiard' && onlineMatch.phase === 'active'
  const myIdx = onlineMatch?.role === 'guest' ? 1 : 0
  // 🤖 혼자 칠 때 기본 상대는 세라(AI). AI 자리 차례에는 사람이 칠 수 없다
  const isAiGame = !isOnline && billiardAi.enabled
  const isAiTurn = isAiGame && billiardAi.seats.includes(currentTurnIdx)
  const isMyTurn = isOnline ? currentTurnIdx === myIdx : !isAiTurn
  const isSeriesHost = !isOnline || onlineMatch?.role === 'host'
  // 세라 대사 (AI 대전 중 말풍선)
  const [seraLine, setSeraLine] = useState<string | null>(null)
  const isPlacingCue = ballInHand && isMyTurn && !winner

  // 조준 상태 (렌더 루프에서 읽는다)
  const viewRef = useRef({
    aimAngle: 0,
    shotPower: 0,
    isPulling: false,
    placeValid: true,
    // 온라인 대전 중 상대 차례일 때 상대 조준선
    remoteAim: null as { angle: number; power: number; pulling: boolean } | null,
    lastAimSentAt: 0
  })

  // 샷 물리 레프 (고정 간격 물리 계산)
  const physicsRef = useRef({
    balls: cloneBalls(billiardBalls),
    firstHitBallId: null as number | null,
    pocketedThisShot: [] as number[],
    isShotInProgress: false,
    targetBallAtShot: 1,
    dragStartClient: { x: 0, y: 0 },
    accumulator: 0,
    lastTime: 0,
    stepCount: 0,
    sounds: emptySoundQueue(),
    // 상대가 친 공이 굴러가는 중(상대 화면에서 받은 위치로 그리는 중)
    remoteMoving: false
  })

  // 렌더 루프·네트워크 처리기에서 최신 값을 읽기 위한 레프
  const liveRef = useRef({ isOnline, isMyTurn, isPlacingCue, winner })
  liveRef.current = { isOnline, isMyTurn, isPlacingCue, winner }

  // 📋 경기 기록 저장: 같은 PC 대전은 이 화면이, 온라인 대전은 방장만 올린다
  const [recordNotice, setRecordNotice] = useState<string | null>(null)
  useEffect(() => {
    if (!winner) {
      setRecordNotice(null)
      return
    }
    const store = useMiniGameStore.getState()
    const stats = store.billiardStats
    const gameKey = `${stats.startedAt}-${winner}`
    if (!stats.startedAt || recordedBilliardGames.has(gameKey)) return
    const match = store.onlineMatch
    const online = match?.game === 'billiard' && match.phase === 'active'
    if (online && match.role !== 'host') return
    recordedBilliardGames.add(gameKey)
    const winnerIdx = store.currentTurnIdx
    const series = store.billiardSeries
    const vsAi = !online && store.billiardAi.enabled && store.billiardPlayers.length === 2
    // 3판 2선승은 시리즈 최종 결과만 남긴다: 점수 = 이긴 랙 수, 랙별 승자는 상세에
    const bestOfThree = series.format === 3
    void miniGameRecords
      .submit({
        game: 'billiard',
        mode: online ? 'online' : vsAi ? 'ai' : 'local',
        difficulty: vsAi ? store.billiardAi.difficulty : undefined,
        sessionId: online ? match.sessionId : undefined,
        startedAt: stats.startedAt,
        endedAt: Date.now(),
        players: store.billiardPlayers.map((name, idx) => ({
          name,
          score: bestOfThree ? series.wins[idx] || 0 : stats.pocketed[idx] || 0,
          isWinner: idx === winnerIdx,
          isAi: vsAi && store.billiardAi.seats.includes(idx),
          stats: { shots: stats.shots[idx] || 0, pocketed: stats.pocketed[idx] || 0, fouls: stats.fouls[idx] || 0 }
        })),
        details: {
          seriesFormat: series.format,
          ...(bestOfThree ? { rackWinners: series.rackWinners.join(', ') } : {}),
          totalShots: stats.shots.reduce((sum, v) => sum + v, 0),
          totalFouls: stats.fouls.reduce((sum, v) => sum + v, 0),
          nineBallBy: winner
        }
      })
      .then((result) => {
        if (result === 'saved') setRecordNotice('📋 경기 기록이 저장되었습니다.')
        else if (result === 'queued') setRecordNotice('📋 서버에 연결되면 경기 기록이 자동으로 저장됩니다.')
        else if (result === 'unavailable') setRecordNotice('📋 체험판에서는 경기 기록이 저장되지 않습니다.')
      })
  }, [winner])

  // 모달이 열릴 때 / 새 랙·상대 상태 수신 시 store의 공 배치를 물리 상태로 다시 맞춘다
  // 창이 열리면 득점 음성 녹음("Nice!"·"Yes!")을 미리 불러 둔다
  useEffect(() => {
    if (showBilliardModal) miniGameAudio.preloadBilliardVoices()
  }, [showBilliardModal])

  useEffect(() => {
    if (!showBilliardModal) return
    const p = physicsRef.current
    p.balls = cloneBalls(useMiniGameStore.getState().billiardBalls)
    p.isShotInProgress = false
    p.firstHitBallId = null
    p.pocketedThisShot = []
    p.remoteMoving = false
    viewRef.current.isPulling = false
    viewRef.current.remoteAim = null
    setIsPulling(false)
    setIsMoving(false)
  }, [showBilliardModal, billiardSyncVersion])

  // 모달이 열릴 때 내 캐릭터 이름 자동 세팅 (온라인 대전 중에는 이름이 고정)
  useEffect(() => {
    if (!showBilliardModal || isOnline) return
    if (billiardAi.enabled) {
      const me = myUserName || '나'
      if (billiardPlayers.length !== 2 || billiardPlayers[0] !== me || billiardPlayers[1] !== BILLIARD_AI_NAME) {
        setBilliardPlayers([me, BILLIARD_AI_NAME])
        useMiniGameStore.getState().resetBilliardGame()
      }
      return
    }
    if (myUserName && (billiardPlayers[0] === 'Player 1' || billiardPlayers[0] === '나')) {
      const nextPlayers = [...billiardPlayers]
      nextPlayers[0] = myUserName
      // 동료 직원 이름이 있으면 Player 2에 매칭
      if (nextPlayers[1] === 'Player 2' && officeEmployees.length > 0) {
        const colleague = officeEmployees.find((e) => e.name !== myUserName)
        if (colleague) nextPlayers[1] = colleague.name
      }
      setBilliardPlayers(nextPlayers)
      setEditingPlayers(nextPlayers)
    } else {
      setEditingPlayers([...billiardPlayers])
    }
  }, [showBilliardModal, myUserName, billiardAi.enabled, isOnline])

  // 현재 테이블 위에 남아있는 공 중 가장 낮은 번호의 공(1순위 타겟 목적구) 계산
  const lowestBallId = useMemo(() => lowestBallOf(billiardBalls), [billiardBalls])

  const currentPlayer = billiardPlayers[currentTurnIdx] || `Player ${currentTurnIdx + 1}`

  // 🌐 상대에게 보내기 헬퍼
  const sendSnapshot = (sfx: ShotSfx = null) => {
    if (!liveRef.current.isOnline) return
    miniGameNetwork.send('billiard', 'snapshot', { ...useMiniGameStore.getState().getBilliardSnapshot(), sfx })
  }

  const sendAim = (force = false) => {
    if (!liveRef.current.isOnline || !liveRef.current.isMyTurn) return
    const v = viewRef.current
    const now = performance.now()
    if (!force && now - v.lastAimSentAt < AIM_SEND_INTERVAL_MS) return
    v.lastAimSentAt = now
    const cue = physicsRef.current.balls.find((b) => b.id === 0)
    miniGameNetwork.send('billiard', 'aim', {
      a: Math.round(v.aimAngle * 1000) / 1000,
      p: Math.round(v.shotPower),
      pull: v.isPulling,
      // 프리볼로 수구를 옮기는 중이면 수구 위치도 함께 보낸다
      cue: useMiniGameStore.getState().ballInHand && cue ? [round1(cue.x), round1(cue.y)] : null
    })
  }

  // 🌐 온라인 대전 데이터 수신
  useEffect(() => {
    return miniGameNetwork.onData('billiard', (kind, data) => {
      const store = useMiniGameStore.getState()
      const p = physicsRef.current
      const match = store.onlineMatch

      if (kind === 'match_start') {
        setShowInvitePicker(false)
        setShowPlayerModal(false)
        store.setBilliardAi({ enabled: false })
        if (match?.role === 'host') {
          // 초대한 사람이 새 랙을 깔고 첫 상태를 보낸다
          const me = useOfficeStore.getState().userName || '나'
          store.setBilliardPlayers([me, match.peerName])
          store.resetBilliardGame()
          store.setLastShotMessage(`🌐 ${match.peerName} 님과 온라인 대전 시작! ${me} 님이 먼저 브레이크합니다.`)
          miniGameNetwork.send('billiard', 'snapshot', { ...useMiniGameStore.getState().getBilliardSnapshot(), sfx: null })
        } else {
          store.setLastShotMessage('🌐 온라인 대전에 참가했습니다. 테이블 정보를 받는 중...')
        }
        return
      }

      if (kind === 'match_end') {
        viewRef.current.remoteAim = null
        p.remoteMoving = false
        setIsMoving(p.isShotInProgress)
        store.setLastShotMessage(`🌐 온라인 대전이 종료되었습니다.${data?.reason ? ` (${data.reason})` : ''} 계속 혼자 칠 수 있습니다.`)
        return
      }

      if (kind === 'aim' && data) {
        viewRef.current.remoteAim = { angle: Number(data.a) || 0, power: Number(data.p) || 0, pulling: Boolean(data.pull) }
        if (Array.isArray(data.cue) && !p.isShotInProgress) {
          const cue = p.balls.find((b) => b.id === 0)
          if (cue) {
            cue.x = Number(data.cue[0]) || cue.x
            cue.y = Number(data.cue[1]) || cue.y
          }
        }
        return
      }

      if (kind === 'frame' && data && Array.isArray(data.b)) {
        if (p.isShotInProgress) return
        for (const entry of data.b) {
          const ball = p.balls.find((b) => b.id === entry[0])
          if (!ball) continue
          ball.x = entry[1]
          ball.y = entry[2]
          ball.isPocketed = entry[3] === 1
        }
        viewRef.current.remoteAim = null
        if (!p.remoteMoving) {
          p.remoteMoving = true
          setIsMoving(true)
        }
        const s = data.s as SoundQueue | undefined
        if (s) {
          if (s.cue > 0) miniGameAudio.billiardCueHit(s.cue)
          if (s.hit > 0) miniGameAudio.billiardBallHit(s.hit)
          if (s.cushion > 0) miniGameAudio.billiardCushion(s.cushion)
          if (s.pocket) miniGameAudio.billiardPocket()
        }
        return
      }

      if (kind === 'snapshot' && data && Array.isArray(data.balls)) {
        const snapshot = data as BilliardSnapshot & { sfx?: ShotSfx }
        store.applyBilliardSnapshot({
          balls: snapshot.balls,
          players: snapshot.players,
          currentTurnIdx: snapshot.currentTurnIdx,
          turnCount: snapshot.turnCount,
          foulMessage: snapshot.foulMessage,
          lastShotMessage: snapshot.lastShotMessage,
          winner: snapshot.winner,
          ballInHand: snapshot.ballInHand,
          stats: snapshot.stats,
          series: snapshot.series
        })
        // 승리 소리(팡파르·휘파람·Nice!)는 승리 축하 연출이 낸다
        if (snapshot.sfx === 'nice') miniGameAudio.sexyNiceVoice()
        else if (snapshot.sfx === 'rack') miniGameAudio.applause(1.5)
        else if (snapshot.sfx === 'foul') miniGameAudio.foul()
      }
    })
  }, [])

  // 캔버스 좌표 변환
  const toTableCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return {
      x: (clientX - rect.left) * (TABLE_WIDTH / rect.width),
      y: (clientY - rect.top) * (TABLE_HEIGHT / rect.height)
    }
  }

  // 마우스 위치에 따른 큐대 각도 조준 (클래식 탑뷰 직관적 360° 조준) / 프리볼 수구 위치 이동
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isMoving || !isMyTurn || winner) return
    const pos = toTableCoords(e.clientX, e.clientY)
    if (!pos) return
    const p = physicsRef.current
    const v = viewRef.current
    const cueBall = p.balls.find((b) => b.id === 0)
    if (!cueBall || cueBall.isPocketed) return

    if (isPlacingCue) {
      // ✋ 프리볼: 수구가 마우스를 따라다니고, 다른 공과 겹치지 않는 곳에만 놓을 수 있다
      cueBall.x = Math.min(CUSH_R, Math.max(CUSH_L, pos.x))
      cueBall.y = Math.min(CUSH_B, Math.max(CUSH_T, pos.y))
      v.placeValid = !overlapsOtherBall(p.balls, 0, cueBall.x, cueBall.y)
        && POCKETS.every((pocket) => Math.hypot(cueBall.x - pocket.x, cueBall.y - pocket.y) >= POCKET_RADIUS + 2)
      sendAim()
      return
    }

    if (!v.isPulling) {
      v.aimAngle = Math.atan2(pos.y - cueBall.y, pos.x - cueBall.x)
      sendAim()
    }
  }

  // 마우스 클릭 (프리볼 배치 또는 파워 당기기 시작)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isMoving || winner || !isMyTurn) return
    const p = physicsRef.current
    const v = viewRef.current

    if (isPlacingCue) {
      if (!v.placeValid) return
      const store = useMiniGameStore.getState()
      store.updateBilliardBalls(cloneBalls(p.balls))
      store.setBallInHand(false)
      store.setFoulMessage(null)
      store.setLastShotMessage(`✋ ${currentPlayer} 님이 수구 위치를 정했습니다. 조준 후 당겨서 치세요.`)
      sendSnapshot()
      return
    }

    p.dragStartClient = { x: e.clientX, y: e.clientY }
    v.isPulling = true
    v.shotPower = 10
    setIsPulling(true)
    setShotPower(10)
    sendAim(true)
  }

  // 샷 발사 실행 함수 (캔버스·창 mouseup 이 둘 다 불러도 한 번만 실행)
  const executeShot = () => {
    const v = viewRef.current
    if (!v.isPulling) return
    v.isPulling = false
    setIsPulling(false)

    if (physicsRef.current.isShotInProgress || liveRef.current.winner || !liveRef.current.isMyTurn) return
    launchCue(v.aimAngle, v.shotPower)
  }

  // 수구 발사 (사람 샷·세라 샷 공통)
  const launchCue = (angle: number, power: number) => {
    const v = viewRef.current
    const p = physicsRef.current
    if (p.isShotInProgress) return
    const cueBall = p.balls.find((b) => b.id === 0)
    if (!cueBall || cueBall.isPocketed) return

    // 최소 파워 확보
    const finalPower = Math.max(12, power)
    const speed = (finalPower / 100) * MAX_CUE_SPEED

    // 수구에 속도 부여
    v.aimAngle = angle
    cueBall.vx = Math.cos(angle) * speed
    cueBall.vy = Math.sin(angle) * speed

    miniGameAudio.billiardCueHit(finalPower / 100)

    p.firstHitBallId = null
    p.pocketedThisShot = []
    p.targetBallAtShot = lowestBallOf(p.balls)
    p.sounds = { ...emptySoundQueue(), cue: finalPower / 100 }
    p.accumulator = 0
    p.stepCount = 0
    p.isShotInProgress = true
    setIsMoving(true)
    v.shotPower = 0
    setShotPower(0)
  }

  // 🌟 마우스가 당구대(캔버스) 밖으로 나가도 힘 조절이 유지되고 놓으면 정상 발사되도록 Window 레벨 마우스 추적
  useEffect(() => {
    if (!isPulling) return

    const onWindowMouseMove = (e: MouseEvent) => {
      const start = physicsRef.current.dragStartClient
      const pullDist = Math.hypot(e.clientX - start.x, e.clientY - start.y)
      // 당긴 거리에 따라 파워 5 ~ 100 조절 (화면 밖으로 나가도 안정적으로 힘 조절 유지)
      const power = Math.min(100, Math.max(5, pullDist * 0.75))
      viewRef.current.shotPower = power
      setShotPower(power)
      sendAim()
    }

    const onWindowMouseUp = () => {
      executeShot()
    }

    window.addEventListener('mousemove', onWindowMouseMove)
    window.addEventListener('mouseup', onWindowMouseUp)
    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove)
      window.removeEventListener('mouseup', onWindowMouseUp)
    }
  }, [isPulling])

  // 물리 1스텝 (1/60초). 아직 움직이는 공이 있으면 true
  // 물리 1스텝 (공용 계산 + 이 화면의 소리·최초 타격 공·온라인 전송용 소리 모음)
  const stepPhysics = () => {
    const p = physicsRef.current
    return stepBilliardPhysics(p.balls, {
      onPocket: (b) => {
        p.pocketedThisShot.push(b.id)
        miniGameAudio.billiardPocket()
        p.sounds.pocket = true
      },
      onCushion: (intensity) => {
        miniGameAudio.billiardCushion(intensity)
        p.sounds.cushion = Math.max(p.sounds.cushion, intensity)
      },
      onContact: (b1, b2) => {
        // 수구 최초 타격 공 기록
        if (p.firstHitBallId !== null) return
        if (b1.id === 0) p.firstHitBallId = b2.id
        else if (b2.id === 0) p.firstHitBallId = b1.id
      },
      onBallHit: (intensity) => {
        miniGameAudio.billiardBallHit(intensity)
        p.sounds.hit = Math.max(p.sounds.hit, intensity)
      }
    })
  }

  // 나인볼 룰 엄격 판정 (샷이 끝난 직후 1번). 상대에게 보낼 효과음 종류를 돌려준다
  const evaluateShotResult = (): ShotSfx => {
    const p = physicsRef.current
    const balls = p.balls
    const firstHit = p.firstHitBallId
    const pocketed = p.pocketedThisShot
    const target = p.targetBallAtShot
    const store = useMiniGameStore.getState()
    const shooter = store.billiardPlayers[store.currentTurnIdx] || `Player ${store.currentTurnIdx + 1}`
    const nextPlayer = store.billiardPlayers[(store.currentTurnIdx + 1) % store.billiardPlayers.length]
    const cueBall = balls.find((b) => b.id === 0)
    let foul = false
    let foulReasonStr = ''

    // 1. 파울 판정: 수구 스크래치(포켓 침몰)
    if (!cueBall || cueBall.isPocketed) {
      foul = true
      foulReasonStr = '파울: 수구(흰 공)가 포켓에 빠졌습니다 (스크래치)!'
      // 수구는 헤드스팟 근처 빈 자리에 꺼내 두고, 다음 플레이어가 프리볼로 옮긴다
      if (cueBall) {
        cueBall.isPocketed = false
        cueBall.vx = 0
        cueBall.vy = 0
        const spot = findFreeSpot(balls, 0, BILLIARD_HEAD_SPOT.x, BILLIARD_HEAD_SPOT.y)
        cueBall.x = spot.x
        cueBall.y = spot.y
      }
    }
    // 2. 파울 판정: 아무 공도 맞추지 못함
    else if (firstHit === null) {
      foul = true
      foulReasonStr = '파울: 수구가 어떤 공도 맞추지 못했습니다!'
    }
    // 3. 파울 판정: 가장 낮은 번호의 공을 먼저 맞추지 않음
    else if (firstHit !== target) {
      foul = true
      foulReasonStr = `파울: 가장 낮은 번호인 ${target}번 공이 아닌 ${firstHit}번 공을 먼저 맞췄습니다!`
    }

    // 경기 기록: 샷 수·적법하게 넣은 공 수(파울 샷은 0)·파울 수 (승리 판정보다 먼저 더해야 마지막 샷도 들어간다)
    store.recordBilliardShot(store.currentTurnIdx, foul ? 0 : pocketed.filter((id) => id !== 0).length, foul)

    // 세라(AI)가 친 샷인지 (대사용)
    const aiShot = !liveRef.current.isOnline && store.billiardAi.enabled && store.billiardAi.seats.includes(store.currentTurnIdx)
    const aiInGame = !liveRef.current.isOnline && store.billiardAi.enabled

    // 4. 9번 공 포켓 여부 판정
    if (pocketed.includes(9)) {
      if (!foul) {
        // 합법적인 샷으로 9번 공 포켓 → 이 랙 승리. 3판 2선승이면 2랙을 먼저 이겨야 최종 승리
        const shooterIdx = store.currentTurnIdx
        if (store.finishBilliardRack(shooterIdx) === 'next') {
          const series = useMiniGameStore.getState().billiardSeries
          const nextIdx = (shooterIdx + 1) % store.billiardPlayers.length
          const setScore = series.wins.join(' : ')
          store.startNextBilliardRack(nextIdx, `🎉 ${shooter} 님 ${series.rackNo}랙 승리! 세트 ${setScore} ➔ ${series.rackNo + 1}랙은 ${store.billiardPlayers[nextIdx]} 님이 브레이크합니다.`)
          miniGameAudio.applause(1.5)
          if (aiInGame) setSeraLine(aiShot ? pickLine('rack') : pickLine('miss'))
          return 'rack'
        }
        if (aiInGame) setSeraLine(aiShot ? pickLine('win') : pickLine('lose'))
        store.setWinner(shooter)
        store.setFoulMessage(null)
        store.setLastShotMessage(`🎉 ${shooter} 님이 9번 공을 넣어 최종 승리하셨습니다!`)
        store.setBallInHand(false)
        store.updateBilliardBalls(cloneBalls(balls))
        return 'win'
      }
      // 파울 중 9번 공 포켓 -> 9번 공은 풋스팟(비어 있지 않으면 가까운 빈 자리)에 리스팟
      const nineBall = balls.find((b) => b.id === 9)
      if (nineBall) {
        nineBall.isPocketed = false
        nineBall.vx = 0
        nineBall.vy = 0
        const spot = findFreeSpot(balls, 9, BILLIARD_FOOT_SPOT.x, BILLIARD_FOOT_SPOT.y)
        nineBall.x = spot.x
        nineBall.y = spot.y
      }
      foulReasonStr += ' (9번 공은 테이블로 다시 복귀됩니다)'
    }

    // 포켓된 일반 공(1~8번)은 포켓에 유지
    const otherPocketed = pocketed.filter((id) => id !== 0 && id !== 9)
    let sfx: ShotSfx = null

    if (aiShot) setSeraLine(foul ? pickLine('foul') : otherPocketed.length > 0 ? pickLine('pot') : pickLine('miss'))

    if (foul) {
      miniGameAudio.foul()
      sfx = 'foul'
      // 파울 시 다음 플레이어에게 턴 전환 + 프리볼(수구를 원하는 곳에 놓고 친다)
      store.nextBilliardTurn() // 파울 메시지를 지우므로 아래에서 다시 표시
      store.setBallInHand(true)
      store.setLastShotMessage(`${foulReasonStr} ➔ 다음 차례: ${nextPlayer} (✋ 프리볼)`)
      store.setFoulMessage(`${foulReasonStr} ➔ ${nextPlayer} 님 프리볼: 수구를 원하는 곳에 놓으세요.`)
    } else if (otherPocketed.length > 0) {
      // 🌟 파울 없이 적법하게 1개 이상의 목적구 포켓 성공 -> "나이스" 녹음 (세라가 넣으면 "Yes!" 녹음)
      if (aiShot) miniGameAudio.seraYay()
      else miniGameAudio.sexyNiceVoice()
      sfx = 'nice'
      const pocketedNames = otherPocketed.map((id) => `${id}번`).join(', ')
      store.setFoulMessage(null)
      store.setBallInHand(false)
      store.setLastShotMessage(`🎯 나이스! ${pocketedNames} 공 포켓 성공! ${shooter} 님의 턴이 유지됩니다.`)
    } else {
      // 파울은 없으나 공이 들어가지 않음 -> 다음 플레이어로 턴 전환
      store.setFoulMessage(null)
      store.setBallInHand(false)
      store.nextBilliardTurn()
      store.setLastShotMessage(`공이 들어가지 않았습니다. ➔ 다음 차례: ${nextPlayer}`)
    }

    store.updateBilliardBalls(cloneBalls(balls))
    return sfx
  }

  const sendMotionFrame = () => {
    const p = physicsRef.current
    miniGameNetwork.send('billiard', 'frame', {
      b: p.balls.map((b) => [b.id, round1(b.x), round1(b.y), b.isPocketed ? 1 : 0]),
      s: p.sounds
    })
    p.sounds = emptySoundQueue()
  }

  // 물리 시뮬레이션 및 렌더 루프
  useEffect(() => {
    if (!showBilliardModal) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    physicsRef.current.lastTime = 0

    const loop = (now: number) => {
      const p = physicsRef.current
      const v = viewRef.current
      const live = liveRef.current
      const balls = p.balls

      // 1. 공 물리 계산 (고정 간격 — 내가 친 샷만 계산하고, 상대 샷은 받은 위치를 그린다)
      const elapsed = p.lastTime ? Math.min(now - p.lastTime, 100) : STEP_MS
      p.lastTime = now

      if (p.isShotInProgress) {
        p.accumulator += elapsed
        let steps = 0
        while (p.accumulator >= STEP_MS && steps < MAX_STEPS_PER_FRAME) {
          p.accumulator -= STEP_MS
          steps++
          const moving = stepPhysics()
          p.stepCount++
          if (live.isOnline && p.stepCount % NET_FRAME_EVERY_STEPS === 0) sendMotionFrame()

          // 모든 공이 멈췄을 때 샷 결과 판정
          if (!moving) {
            p.isShotInProgress = false
            p.accumulator = 0
            if (live.isOnline) sendMotionFrame()
            setIsMoving(false)
            const sfx = evaluateShotResult()
            sendSnapshot(sfx)
            break
          }
        }
        if (steps >= MAX_STEPS_PER_FRAME) p.accumulator = 0
      }

      // 2. 렌더링 (Canvas 2D - 클래식 와이드 탑뷰)
      ctx.clearRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT)

      const cueBall = balls.find((b) => b.id === 0)
      const targetId = lowestBallOf(balls)

      // 2-1. 당구대 외곽 다크 마호가니 원목 프레임
      ctx.fillStyle = '#2b1810'
      ctx.fillRect(0, 0, TABLE_WIDTH, TABLE_HEIGHT)

      // 목재 입체 베벨 그림자
      ctx.fillStyle = '#1c0f0a'
      ctx.fillRect(10, 10, TABLE_WIDTH - 20, TABLE_HEIGHT - 20)

      // 2-2. 황동/골드 코너 및 사이드 포켓 캐스팅 플레이트
      ctx.fillStyle = '#d97706'
      ctx.fillRect(20, 20, 36, 36)
      ctx.fillRect(TABLE_WIDTH - 56, 20, 36, 36)
      ctx.fillRect(20, TABLE_HEIGHT - 56, 36, 36)
      ctx.fillRect(TABLE_WIDTH - 56, TABLE_HEIGHT - 56, 36, 36)
      ctx.fillRect(TABLE_WIDTH / 2 - 18, 14, 36, 26)
      ctx.fillRect(TABLE_WIDTH / 2 - 18, TABLE_HEIGHT - 40, 36, 26)

      // 2-3. 에메랄드 그린 라사지 (Felt 천)
      ctx.fillStyle = '#15803d'
      ctx.fillRect(RAIL, RAIL, TABLE_WIDTH - RAIL * 2, TABLE_HEIGHT - RAIL * 2)

      // 레일 고무 쿠션 하이라이트
      ctx.strokeStyle = '#166534'
      ctx.lineWidth = 4
      ctx.strokeRect(RAIL, RAIL, TABLE_WIDTH - RAIL * 2, TABLE_HEIGHT - RAIL * 2)

      // 2-4. 6개 포켓 홀 그리기
      for (const pocket of POCKETS) {
        ctx.fillStyle = '#09090b'
        ctx.beginPath()
        ctx.arc(pocket.x, pocket.y, POCKET_RADIUS - 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#27272a'
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // 2-5. 풋스팟(점) 및 헤드스팟 가이드 마커
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
      ctx.beginPath()
      ctx.arc(BILLIARD_FOOT_SPOT.x, BILLIARD_FOOT_SPOT.y, 3.5, 0, Math.PI * 2)
      ctx.arc(BILLIARD_HEAD_SPOT.x, BILLIARD_HEAD_SPOT.y, 3.5, 0, Math.PI * 2)
      ctx.fill()

      // 2-6. 당구공 렌더링
      for (const b of balls) {
        if (b.isPocketed) continue

        // 공 바닥 그림자
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
        ctx.beginPath()
        ctx.arc(b.x + 3, b.y + 4, BALL_RADIUS, 0, Math.PI * 2)
        ctx.fill()

        const info = BALL_STYLES[b.id] || { color: '#ffffff', isStripe: false, label: '' }

        // 공 본체 (그라데이션 입체 구체)
        const grad = ctx.createRadialGradient(
          b.x - BALL_RADIUS * 0.35,
          b.y - BALL_RADIUS * 0.35,
          BALL_RADIUS * 0.1,
          b.x,
          b.y,
          BALL_RADIUS
        )
        grad.addColorStop(0, '#ffffff')
        grad.addColorStop(0.35, info.color)
        grad.addColorStop(1, '#0f172a')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(b.x, b.y, BALL_RADIUS, 0, Math.PI * 2)
        ctx.fill()

        // 9번 공 스트라이프 띠 표현
        if (info.isStripe) {
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(b.x, b.y, BALL_RADIUS * 0.75, 0, Math.PI * 2)
          ctx.fill()
        }

        // 목적구 번호 표시 (중앙 흰색 원 + 숫자)
        if (b.id > 0) {
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(b.x, b.y, BALL_RADIUS * 0.45, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = '#0f172a'
          ctx.font = 'bold 9px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(String(b.id), b.x, b.y + 0.5)
        }

        // 🌟 현재 1순위 최저 번호 공(타겟구) 주위에 반짝이는 황금 링 표시
        if (b.id === targetId) {
          ctx.strokeStyle = '#facc15'
          ctx.lineWidth = 2
          ctx.setLineDash([4, 4])
          ctx.beginPath()
          ctx.arc(b.x, b.y, BALL_RADIUS + 4, 0, Math.PI * 2)
          ctx.stroke()
          ctx.setLineDash([])
        }
      }

      const ballsResting = !p.isShotInProgress && !p.remoteMoving
      const placing = useMiniGameStore.getState().ballInHand

      // 2-7. ✋ 프리볼: 수구 주변에 놓을 수 있는지(초록) / 겹쳐서 못 놓는지(빨강) 표시
      if (cueBall && !cueBall.isPocketed && ballsResting && placing && !live.winner) {
        const valid = live.isPlacingCue ? v.placeValid : true
        ctx.strokeStyle = valid ? '#4ade80' : '#f87171'
        ctx.lineWidth = 2
        ctx.setLineDash([3, 3])
        ctx.beginPath()
        ctx.arc(cueBall.x, cueBall.y, BALL_RADIUS + 6, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = valid ? '#bbf7d0' : '#fecaca'
        ctx.font = 'bold 11px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'alphabetic'
        ctx.fillText(live.isPlacingCue ? '✋ 클릭해서 수구 놓기' : '✋ 상대가 수구 위치를 정하는 중', cueBall.x, cueBall.y - BALL_RADIUS - 12)
      }

      // 2-8. 큐대 조준선 & 🌟 1쿠션 반사선 (공들이 멈춰있을 때만). 온라인 상대 차례에는 상대 조준선을 그린다
      const showingRemote = live.isOnline && !live.isMyTurn
      const aim = showingRemote ? v.remoteAim : { angle: v.aimAngle, power: v.shotPower, pulling: v.isPulling }
      if (cueBall && !cueBall.isPocketed && ballsResting && !placing && !live.winner && aim) {
        const cosA = Math.cos(aim.angle)
        const sinA = Math.sin(aim.angle)

        // 4개 쿠션 벽과 레이 교차점 거리 t 계산
        let tMin = Infinity
        let hitWall: 'left' | 'right' | 'top' | 'bottom' | null = null

        if (cosA < -0.0001) {
          const t = (CUSH_L - cueBall.x) / cosA
          if (t > 0 && t < tMin) {
            tMin = t
            hitWall = 'left'
          }
        } else if (cosA > 0.0001) {
          const t = (CUSH_R - cueBall.x) / cosA
          if (t > 0 && t < tMin) {
            tMin = t
            hitWall = 'right'
          }
        }

        if (sinA < -0.0001) {
          const t = (CUSH_T - cueBall.y) / sinA
          if (t > 0 && t < tMin) {
            tMin = t
            hitWall = 'top'
          }
        } else if (sinA > 0.0001) {
          const t = (CUSH_B - cueBall.y) / sinA
          if (t > 0 && t < tMin) {
            tMin = t
            hitWall = 'bottom'
          }
        }

        if (!Number.isFinite(tMin)) tMin = 0
        const hitX = cueBall.x + cosA * tMin
        const hitY = cueBall.y + sinA * tMin

        // 1차 조준 점선 가이드라인 (수구 -> 첫 번째 쿠션 벽)
        ctx.strokeStyle = showingRemote ? 'rgba(192, 132, 252, 0.6)' : 'rgba(255, 255, 255, 0.6)'
        ctx.lineWidth = 1.5
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(cueBall.x, cueBall.y)
        ctx.lineTo(hitX, hitY)
        ctx.stroke()

        // 쿠션 충돌 지점 원형 마커
        ctx.fillStyle = '#38bdf8'
        ctx.beginPath()
        ctx.arc(hitX, hitY, 3.5, 0, Math.PI * 2)
        ctx.fill()

        // 🌟 1쿠션 반사선 (첫 번째 벽에 부딪혀서 나오는 반사선 각도 표기: 입사각 = 반사각)
        let refCos = cosA
        let refSin = sinA
        if (hitWall === 'left' || hitWall === 'right') {
          refCos = -cosA
        } else if (hitWall === 'top' || hitWall === 'bottom') {
          refSin = -sinA
        }

        ctx.strokeStyle = '#facc15' // 황금빛 반사 점선
        ctx.lineWidth = 2
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(hitX, hitY)
        ctx.lineTo(hitX + refCos * 220, hitY + refSin * 220)
        ctx.stroke()
        ctx.setLineDash([])

        // 큐대 그래픽 (당긴 거리에 따라 뒤로 후퇴)
        const pullOffset = aim.pulling ? (aim.power / 100) * 45 + 16 : 16
        const cueStartX = cueBall.x - cosA * pullOffset
        const cueStartY = cueBall.y - sinA * pullOffset
        const cueLength = 220
        const cueEndX = cueStartX - cosA * cueLength
        const cueEndY = cueStartY - sinA * cueLength

        // 큐대 본체 (우드 브라운 & 팁)
        ctx.save()
        ctx.strokeStyle = '#a16207'
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.moveTo(cueStartX, cueStartY)
        ctx.lineTo(cueEndX, cueEndY)
        ctx.stroke()

        // 큐대 팁 (블루 초크)
        ctx.strokeStyle = '#38bdf8'
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.moveTo(cueStartX, cueStartY)
        ctx.lineTo(cueStartX - cosA * 6, cueStartY - sinA * 6)
        ctx.stroke()
        ctx.restore()

        // 상대가 힘을 모으는 중이면 파워 표시
        if (showingRemote && aim.pulling) {
          ctx.fillStyle = '#e9d5ff'
          ctx.font = 'bold 11px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'alphabetic'
          ctx.fillText(`상대 샷 파워 ${Math.round(aim.power)}%`, cueBall.x, cueBall.y + BALL_RADIUS + 18)
        }
      }

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [showBilliardModal])

  // 🤖 세라(AI) 차례: 생각 → (프리볼이면 수구 놓기) → 조준선을 천천히 돌림 → 큐를 당겼다가 발사
  useEffect(() => {
    if (!showBilliardModal || !isAiTurn || isMoving || winner) return
    const timers: number[] = []
    let frame = 0
    let cancelled = false
    const wait = (ms: number) => new Promise<void>((resolve) => { timers.push(window.setTimeout(resolve, ms)) })
    const animate = (ms: number, onStep: (t: number) => void) => new Promise<void>((resolve) => {
      const start = performance.now()
      const tick = (now: number) => {
        if (cancelled) return
        const t = Math.min(1, (now - start) / ms)
        onStep(t)
        if (t < 1) frame = requestAnimationFrame(tick)
        else resolve()
      }
      frame = requestAnimationFrame(tick)
    })

    const run = async () => {
      const store = useMiniGameStore.getState()
      const difficulty = store.billiardAi.difficulty
      setSeraLine((line) => line ?? pickLine('turn'))
      await wait(900)
      if (cancelled) return
      const p = physicsRef.current
      const v = viewRef.current
      const target = lowestBallOf(p.balls)

      // ✋ 프리볼이면 넣기 좋은 자리에 수구를 놓는다
      if (useMiniGameStore.getState().ballInHand) {
        const cue = p.balls.find((b) => b.id === 0)
        const canPlace = (x: number, y: number) => !overlapsOtherBall(p.balls, 0, x, y)
          && POCKETS.every((pocket) => Math.hypot(x - pocket.x, y - pocket.y) >= POCKET_RADIUS + 2)
        const spot = planCuePlacement(p.balls, target, AI_GEOMETRY, canPlace) || findFreeSpot(p.balls, 0, BILLIARD_HEAD_SPOT.x, BILLIARD_HEAD_SPOT.y)
        if (cue) {
          cue.isPocketed = false
          cue.x = spot.x
          cue.y = spot.y
        }
        const st = useMiniGameStore.getState()
        st.updateBilliardBalls(cloneBalls(p.balls))
        st.setBallInHand(false)
        st.setFoulMessage(null)
        st.setLastShotMessage(`✋ ${BILLIARD_AI_NAME} 님이 수구 위치를 정했습니다.`)
        await wait(600)
        if (cancelled) return
      }

      const shot = planAiShot(p.balls, target, difficulty, AI_GEOMETRY)
      // 앞이 막혀 쿠션으로 돌려칠 때 한마디
      if (shot.cushions) setSeraLine(pickLine(shot.cushions >= 2 ? 'kick2' : 'kick1'))
      // 조준선을 지금 각도에서 목표 각도로 천천히 돌린다
      const from = v.aimAngle
      const delta = Math.atan2(Math.sin(shot.angle - from), Math.cos(shot.angle - from))
      await animate(650 + Math.abs(delta) * 250, (t) => {
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        v.aimAngle = from + delta * ease
      })
      if (cancelled) return
      await wait(250)
      // 큐를 당긴다 (힘 게이지가 차오르는 모습)
      v.isPulling = true
      setIsPulling(true)
      await animate(450 + shot.power * 4, (t) => {
        v.shotPower = 10 + (shot.power - 10) * t
        setShotPower(v.shotPower)
      })
      if (cancelled) return
      await wait(120)
      v.isPulling = false
      setIsPulling(false)
      if (cancelled || physicsRef.current.isShotInProgress) return
      launchCue(shot.angle, shot.power)
    }
    void run()
    return () => {
      cancelled = true
      timers.forEach((t) => window.clearTimeout(t))
      cancelAnimationFrame(frame)
      viewRef.current.isPulling = false
    }
  }, [showBilliardModal, isAiTurn, isMoving, winner, ballInHand, billiardSyncVersion, turnCount])

  // 세라 대사는 잠깐 보여 주고 사라진다
  useEffect(() => {
    if (!seraLine) return
    const timer = window.setTimeout(() => setSeraLine(null), 2600)
    return () => window.clearTimeout(timer)
  }, [seraLine])

  // 판수 바꾸기 (게임 중이면 새 게임으로 다시 시작). 온라인은 방장만
  const handleSeriesFormat = (format: SeriesFormat) => {
    if (format === billiardSeries.format || isMoving || !isSeriesHost) return
    const inProgress = useMiniGameStore.getState().billiardStats.startedAt !== null && !winner
    if (inProgress && !window.confirm('판수를 바꾸면 지금 게임을 끝내고 새 게임으로 시작합니다. 바꿀까요?')) return
    setBilliardSeriesFormat(format)
    setLastShotMessage(format === 3 ? '🏆 3판 2선승! 두 랙을 먼저 이기면 최종 승리합니다.' : '🎱 1판 승부! 9번 공을 먼저 넣으면 승리합니다.')
    sendSnapshot()
  }

  // 세라(AI)와 대전 / 같은 PC 대전 전환
  const handleToggleAi = () => {
    if (isMoving || isOnline) return
    if (billiardAi.enabled) {
      setBilliardAi({ enabled: false })
      setEditingPlayers([...billiardPlayers])
      setShowPlayerModal(true)
      return
    }
    setBilliardAi({ enabled: true })
    setLastShotMessage(`🤖 ${BILLIARD_AI_NAME}와 대전합니다! ${myUserName || '나'} 님이 먼저 브레이크하세요.`)
  }

  // 새 랙 (온라인 대전이면 상대 화면도 함께 초기화)
  const handleReset = () => {
    if (isMoving) return
    resetBilliardGame()
    sendSnapshot()
  }

  // 턴 넘기기 (온라인 대전에서는 내 차례일 때만)
  const handlePassTurn = () => {
    if (isMoving || winner || !isMyTurn) return
    nextBilliardTurn()
    useMiniGameStore.getState().setBallInHand(false)
    const st = useMiniGameStore.getState()
    setLastShotMessage(`➡️ ${currentPlayer} 님이 턴을 넘겼습니다. 다음 차례: ${st.billiardPlayers[st.currentTurnIdx]}`)
    sendSnapshot()
  }

  // 나가기: 온라인 대전 중이면 상대에게 알리고 대전을 끝낸다
  const handleClose = () => {
    if (onlineMatch?.game === 'billiard') miniGameNetwork.leave()
    setShowInvitePicker(false)
    closeBilliard()
  }

  if (!showBilliardModal) return null

  const turnHint = isOnline
    ? (isMyTurn ? '내 차례' : `${onlineMatch?.peerName} 님 차례`)
    : null

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
        // 🌟 당구 조준 또는 힘조절 중 마우스가 밖으로 나가서 클릭되어도 게임이 꺼지지 않도록 방어 (나가기 버튼으로만 종료)
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
          border: '1px solid rgba(234, 179, 8, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 50px rgba(234, 179, 8, 0.15)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* 상단 헤더 */}
        <div
          style={{
            padding: '14px 20px',
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
            <span style={{ fontSize: 24 }}>🎱</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
                WorkNexus 휴게실 클래식 나인볼 (9-Ball Pool)
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: 'rgba(234, 179, 8, 0.2)',
                    color: '#facc15',
                    border: '1px solid rgba(234, 179, 8, 0.5)'
                  }}
                >
                  제 {turnCount}턴
                </span>
                {isOnline && (
                  <span
                    style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 12,
                      background: 'rgba(168, 85, 247, 0.2)',
                      color: '#c084fc',
                      border: '1px solid rgba(168, 85, 247, 0.45)'
                    }}
                  >
                    🌐 온라인 대전 vs {onlineMatch?.peerName}
                  </span>
                )}
                {billiardSeries.format === 3 && (
                  <span
                    style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 12,
                      background: 'rgba(56, 189, 248, 0.16)',
                      color: '#7dd3fc',
                      border: '1px solid rgba(56, 189, 248, 0.45)'
                    }}
                  >
                    🏆 3판 2선승 · {billiardSeries.rackNo}랙 · 세트 {billiardPlayers.map((_, i) => billiardSeries.wins[i] || 0).join(' : ')}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11.5, color: '#94a3b8' }}>
                항상 최저 번호 공을 먼저 맞추세요! 9번 공을 넣으면 승리합니다. 파울 후에는 상대가 프리볼로 칩니다.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* 📋 이 건물의 모든 경기 기록·랭킹 (체험 사이트에는 기록이 없어 숨긴다) */}
            {isMatchRecordingAvailable() && <button
              onClick={() => setShowRecords(true)}
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

            {/* 🌐 온라인 대전 */}
            <button
              onClick={() => (isOnline ? miniGameNetwork.leave() : setShowInvitePicker(true))}
              style={{
                background: isOnline ? 'rgba(239, 68, 68, 0.15)' : 'rgba(168, 85, 247, 0.18)',
                border: `1px solid ${isOnline ? 'rgba(239, 68, 68, 0.35)' : 'rgba(168, 85, 247, 0.4)'}`,
                color: isOnline ? '#f87171' : '#c084fc',
                borderRadius: 8,
                padding: '6px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                fontWeight: 700
              }}
              title="같은 건물 동료를 초대해 각자 자기 PC에서 실시간으로 대전합니다."
            >
              <Globe size={14} /> {isOnline ? '온라인 대전 종료' : '온라인 대전'}
            </button>

            {/* 🤖 세라(AI)와 대전으로 돌아가기 */}
            {!isOnline && !billiardAi.enabled && (
              <button
                onClick={handleToggleAi}
                disabled={isMoving}
                style={{
                  background: 'rgba(236, 72, 153, 0.15)',
                  border: '1px solid rgba(236, 72, 153, 0.4)',
                  color: '#f9a8d4',
                  borderRadius: 8,
                  padding: '6px 12px',
                  cursor: isMoving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 700
                }}
                title="혼자 칠 때 AI 상대 세라와 1:1로 대전합니다."
              >
                🤖 세라와 대전
              </button>
            )}

            {/* 👥 플레이어 등록 버튼 (온라인 대전 중에는 두 사람으로 고정) */}
            <button
              onClick={() => {
                setEditingPlayers([...billiardPlayers])
                setShowPlayerModal(true)
              }}
              disabled={isOnline}
              style={{
                background: 'rgba(56, 189, 248, 0.18)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                borderRadius: 8,
                padding: '6px 12px',
                cursor: isOnline ? 'not-allowed' : 'pointer',
                opacity: isOnline ? 0.45 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                fontWeight: 700
              }}
              title="당구 시합에 참가할 플레이어 (내 캐릭터 및 동료)를 등록합니다. 한 PC에서 번갈아 칠 때 사용합니다."
            >
              <Users size={14} /> 플레이어 등록 ({billiardPlayers.length}명)
            </button>

            <button
              onClick={handleReset}
              disabled={isMoving}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#cbd5e1',
                borderRadius: 8,
                padding: '6px 12px',
                cursor: isMoving ? 'not-allowed' : 'pointer',
                opacity: isMoving ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12
              }}
            >
              <RotateCcw size={14} /> 새 게임 랙
            </button>
            <button
              onClick={handleClose}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                borderRadius: 8,
                padding: '6px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                fontWeight: 600
              }}
            >
              <LogOut size={14} /> 나가기
            </button>
          </div>
        </div>

        {/* 현재 턴 & 타겟 목적구 배너 */}
        <div
          style={{
            padding: '10px 20px',
            background: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
          }}
        >
          {/* 현재 턴 플레이어 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: isMoving ? '#fbbf24' : '#22c55e',
                boxShadow: isMoving ? '0 0 10px #fbbf24' : '0 0 10px #22c55e'
              }}
            />
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
              🎯 현재 차례: <span style={{ color: '#38bdf8' }}>{currentPlayer}</span>
              {turnHint && <span style={{ color: isMyTurn ? '#4ade80' : '#c084fc', marginLeft: 8, fontSize: 11 }}>({turnHint})</span>}
              {ballInHand && !winner && <span style={{ color: '#4ade80', marginLeft: 8, fontSize: 11 }}><Hand size={11} style={{ verticalAlign: -1 }} /> 프리볼</span>}
              {isMoving && <span style={{ color: '#fbbf24', marginLeft: 8, fontSize: 11 }}>(공 이동 중...)</span>}
            </div>
            {isAiGame && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <SeraPortrait wink={Boolean(seraLine)} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#fdf2f8',
                    background: '#020617',
                    border: '2px solid #f9a8d4',
                    boxShadow: '2px 2px 0 #ec4899',
                    padding: '3px 8px',
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {seraLine || (isAiTurn ? (isMoving ? '…두근두근' : '음~ 어디로 칠까?') : `${BILLIARD_AI_NAME} · ${DIFFICULTY_LABEL[billiardAi.difficulty]}`)}
                </span>
              </div>
            )}
          </div>

          {/* 판수 (1판 / 3판 2선승) · 세라 난이도 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5 }}>
            {([1, 3] as SeriesFormat[]).map((format) => (
              <button
                key={format}
                onClick={() => handleSeriesFormat(format)}
                disabled={!isSeriesHost || isMoving}
                title={isSeriesHost ? '판수를 고릅니다 (게임 중에 바꾸면 새 게임)' : '온라인 대전의 판수는 초대한 사람이 정합니다.'}
                style={{
                  padding: '3px 9px',
                  borderRadius: 999,
                  border: `1px solid ${billiardSeries.format === format ? 'rgba(250, 204, 21, 0.7)' : 'rgba(148, 163, 184, 0.3)'}`,
                  background: billiardSeries.format === format ? 'rgba(250, 204, 21, 0.18)' : 'transparent',
                  color: billiardSeries.format === format ? '#fde047' : '#94a3b8',
                  fontWeight: 800,
                  fontSize: 11.5,
                  cursor: !isSeriesHost || isMoving ? 'not-allowed' : 'pointer'
                }}
              >
                {format === 1 ? '1판' : '3판 2선승'}
              </button>
            ))}
            {isAiGame && (
              <select
                value={billiardAi.difficulty}
                onChange={(e) => setBilliardAi({ difficulty: e.target.value as MiniGameDifficulty })}
                title="세라(AI) 난이도"
                style={{ background: '#0f172a', color: '#f9a8d4', border: '1px solid rgba(236, 72, 153, 0.4)', borderRadius: 8, padding: '3px 6px', fontSize: 11.5, fontWeight: 700 }}
              >
                {(['easy', 'normal', 'hard'] as MiniGameDifficulty[]).map((d) => (
                  <option key={d} value={d}>세라 {DIFFICULTY_LABEL[d]}</option>
                ))}
              </select>
            )}
          </div>

          {/* 1순위 목적구 표시 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}>
            <span>목적구 1순위:</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: BALL_STYLES[lowestBallId]?.color || '#fbbf24',
                color: '#0f172a',
                fontWeight: 900,
                fontSize: 11
              }}
            >
              {lowestBallId}
            </span>
            <span>번 공을 먼저 맞추세요! (노란 점선: 1쿠션 반사선)</span>
          </div>
        </div>

        {/* 메인 당구대 캔버스 (가로·세로 비율 고정 — 창이 좁아도 공이 찌그러지지 않는다) */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: `${TABLE_WIDTH} / ${TABLE_HEIGHT}`, background: '#090d16', flexShrink: 0 }}>
          <canvas
            ref={canvasRef}
            width={TABLE_WIDTH}
            height={TABLE_HEIGHT}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={executeShot}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              cursor: isMoving || !isMyTurn ? 'not-allowed' : isPlacingCue ? 'grab' : 'crosshair'
            }}
          />

          {/* 파워 미터 게이지 오버레이 */}
          {isPulling && (
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(2, 6, 23, 0.85)',
                padding: '8px 18px',
                borderRadius: 24,
                border: '1px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: '#cbd5e1' }}>샷 파워 (당구대 밖으로 나가도 조절 유지)</span>
              <div
                style={{
                  width: 140,
                  height: 10,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 5,
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${shotPower}%`,
                    height: '100%',
                    background:
                      shotPower > 75
                        ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                        : shotPower > 40
                        ? 'linear-gradient(90deg, #38bdf8, #f59e0b)'
                        : '#38bdf8',
                    transition: 'width 0.05s linear'
                  }}
                />
              </div>
              <span style={{ fontSize: 12, fontWeight: 900, color: '#38bdf8', minWidth: 35 }}>
                {Math.round(shotPower)}%
              </span>
            </div>
          )}

          {/* 승리 팝업 오버레이 */}
          {winner && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(2, 6, 23, 0.85)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 14,
                overflow: 'hidden'
              }}
            >
              {/* 🎆 레트로 승리 축하 연출 (폭죽·팡파르·휘파람·하트 날리는 캐릭터) */}
              <BilliardVictoryCelebration key={winner} winnerName={winner} />
              <Trophy size={54} color="#facc15" style={{ position: 'relative', zIndex: 1 }} />
              <div style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', position: 'relative', zIndex: 1 }}>
                🎉 {winner} 님의 최종 승리!
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8', position: 'relative', zIndex: 1 }}>
                {billiardSeries.format === 3
                  ? `세트 ${billiardPlayers.map((_, i) => billiardSeries.wins[i] || 0).join(' : ')} — 3판 2선승 최종 승리! (랙 승자: ${billiardSeries.rackWinners.join(' → ')})`
                  : '9번 황금 공을 적법하게 포켓하여 게임에서 승리하셨습니다.'}
              </div>
              {recordNotice && <div style={{ fontSize: 12, color: '#7dd3fc', position: 'relative', zIndex: 1 }}>{recordNotice}</div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 8, position: 'relative', zIndex: 1 }}>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '10px 22px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                    color: '#0f172a',
                    fontWeight: 800,
                    fontSize: 14,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  새 게임 시작
                </button>
                <button
                  onClick={handleClose}
                  style={{
                    padding: '10px 22px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#f8fafc',
                    fontWeight: 700,
                    fontSize: 14,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer'
                  }}
                >
                  나가기
                </button>
              </div>
            </div>
          )}

          {/* 🌐 온라인 대전 상대 선택 */}
          {/* 📋 경기 기록 게시판 */}
          {showRecords && <MiniGameRecordBoard initialGame="billiard" onClose={() => setShowRecords(false)} />}

          {showInvitePicker && !isOnline && (
            <OnlineInvitePicker game="billiard" onClose={() => setShowInvitePicker(false)} />
          )}

          {/* 👥 플레이어 등록 팝업 오버레이 */}
          {showPlayerModal && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(2, 6, 23, 0.92)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 30,
                padding: 20
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: 420,
                  background: 'rgba(15, 23, 42, 0.98)',
                  borderRadius: 16,
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  padding: 22,
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Users size={18} color="#38bdf8" /> 당구 참가 플레이어 등록
                  </div>
                  <button
                    onClick={() => setShowPlayerModal(false)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 240, overflowY: 'auto' }}>
                  {editingPlayers.map((name, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: idx === 0 ? '#38bdf8' : idx === 1 ? '#f59e0b' : '#a855f7',
                          color: '#0f172a',
                          fontWeight: 900,
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          const updated = [...editingPlayers]
                          updated[idx] = e.target.value
                          setEditingPlayers(updated)
                        }}
                        placeholder={idx === 0 ? '내 캐릭터 이름 (1P)' : `플레이어 ${idx + 1}`}
                        style={{
                          flex: 1,
                          padding: '7px 12px',
                          borderRadius: 8,
                          background: 'rgba(30, 41, 59, 0.9)',
                          border: '1px solid rgba(148, 163, 184, 0.3)',
                          color: '#f8fafc',
                          fontSize: 13,
                          outline: 'none'
                        }}
                      />

                      {/* 사내 동료 목록 빠른 선택 */}
                      {officeEmployees.length > 0 && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              const updated = [...editingPlayers]
                              updated[idx] = e.target.value
                              setEditingPlayers(updated)
                            }
                          }}
                          style={{
                            padding: '7px 8px',
                            borderRadius: 8,
                            background: 'rgba(30, 41, 59, 0.9)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            color: '#94a3b8',
                            fontSize: 11.5,
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>동료 선택</option>
                          {officeEmployees.map((emp) => (
                            <option key={emp.id} value={emp.name}>
                              {emp.name} ({emp.role || emp.department || '동료'})
                            </option>
                          ))}
                        </select>
                      )}

                      {editingPlayers.length > 2 && (
                        <button
                          onClick={() => {
                            setEditingPlayers(editingPlayers.filter((_, i) => i !== idx))
                          }}
                          style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: 4 }}
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {editingPlayers.length < 4 && (
                  <button
                    onClick={() => {
                      setEditingPlayers([...editingPlayers, `Player ${editingPlayers.length + 1}`])
                    }}
                    style={{
                      marginTop: 12,
                      width: '100%',
                      padding: '7px',
                      borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px dashed rgba(148, 163, 184, 0.4)',
                      color: '#94a3b8',
                      fontSize: 12,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4
                    }}
                  >
                    <Plus size={14} /> 플레이어 추가 (최대 4인)
                  </button>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button
                    onClick={() => {
                      const validPlayers = editingPlayers.map((p, i) => p.trim() || `Player ${i + 1}`)
                      // 직접 등록하면 같은 PC 대전 (세라 AI는 끈다)
                      setBilliardAi({ enabled: false })
                      setBilliardPlayers(validPlayers)
                      useMiniGameStore.getState().resetBilliardGame()
                      // 인원이 줄어 현재 차례 번호가 범위를 벗어나면 1번부터 다시
                      if (currentTurnIdx >= validPlayers.length) useMiniGameStore.getState().setCurrentTurnIdx(0)
                      setShowPlayerModal(false)
                      setLastShotMessage(`👥 플레이어가 등록되었습니다: ${validPlayers.join(' vs ')}`)
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
                      fontSize: 13,
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

        {/* 하단 샷 결과 피드백 및 조작 버튼바 */}
        <div
          style={{
            padding: '12px 20px',
            background: 'rgba(2, 6, 23, 0.85)',
            borderTop: '1px solid rgba(148, 163, 184, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          }}
        >
          {/* 상태 메시지 배너 */}
          <div style={{ flex: 1, minWidth: 240 }}>
            {foulMessage ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f87171', fontSize: 12, fontWeight: 700 }}>
                <AlertTriangle size={15} />
                <span>{foulMessage}</span>
              </div>
            ) : lastShotMessage ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8', fontSize: 12, fontWeight: 600 }}>
                <CheckCircle2 size={15} />
                <span>{lastShotMessage}</span>
              </div>
            ) : (
              <div style={{ color: '#94a3b8', fontSize: 12 }}>
                💡 흰 공 주변에서 마우스를 당겨 파워를 조절하세요. 화면 밖으로 나가도 파워가 조절됩니다.
              </div>
            )}
          </div>

          {/* 턴 넘기기 및 나가기 버튼 */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={handlePassTurn}
              disabled={isMoving || Boolean(winner) || !isMyTurn}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(148, 163, 184, 0.25)',
                color: '#cbd5e1',
                borderRadius: 8,
                padding: '7px 14px',
                cursor: isMoving || !isMyTurn ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                fontWeight: 600,
                opacity: isMoving || !isMyTurn ? 0.5 : 1
              }}
            >
              <ArrowRight size={14} /> 다음 플레이어에게 턴 넘기기
            </button>

            <button
              onClick={handleClose}
              style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                border: 'none',
                color: '#ffffff',
                borderRadius: 8,
                padding: '7px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
              }}
            >
              <LogOut size={14} /> 당구대 나가기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
