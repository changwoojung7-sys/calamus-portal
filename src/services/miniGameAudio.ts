// 브라우저 내장 Web Audio API 기반 무손실 제로-번들 사운드 합성기
// 외부 MP3/WAV 에셋 다운로드 없이 브라우저 오실레이터로 탁구·당구 타구음을 실시간 생성합니다.

// 녹음한 탁구공 소리에서 쓰는 구간 (초): 앞 4ms 건너뛰고, 30ms부터 줄여 80ms에서 끝
const PINGPONG_SAMPLE_OFFSET = 0.004
const PINGPONG_SAMPLE_FADE_AT = 0.03
const PINGPONG_SAMPLE_LENGTH = 0.08
// 라켓 타구음에 겹치는 녹음 길이 (맞는 순간만)
const RACKET_SAMPLE_LENGTH = 0.015

class MiniGameSoundFX {
  private ctx: AudioContext | null = null

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  // ------------------------------------------------------------------
  // 🏓 탁구공 소리 (2026-11-02 재설계 → 나무 테이블 "톡"으로 다시 조정)
  // 고음 사인파를 길게 울리면 접시(도자기)에 튀는 소리가 된다. 나무판 위 탁구공은 나무가 울림을 바로 먹어서
  // 음정이 거의 없는 아주 짧은(10ms 안팎) "톡" — 1~2.5kHz 중심의 짧은 잡음 + 속이 빈 공의 짧은 "폭"이다.
  // 그래서 짧은 충격 잡음을 넓은 대역(낮은 Q)으로 걸러 나무 몸통·공 껍질 소리를 만들고, 6kHz 위 쨍한 성분은 깎는다.
  // 칠 때마다 음높이를 ±5% 달리해 같은 소리가 기계적으로 반복되지 않게 한다.
  // ------------------------------------------------------------------
  private impulseBuffer: AudioBuffer | null = null

  // 실제 탁구공 녹음 (public/sounds/pingpong-ball.wav — 나무 테이블에 튀는 첫 소리 150ms를 잘라 씀).
  // 처음 쓰기 전에 불러 두고, 아직 못 불렀거나 실패하면 아래 합성음으로 대신한다.
  private pingpongSample: AudioBuffer | null = null
  private pingpongSampleLoading = false
  // 탁구 소리 공용 출력: 녹음과 "딱"을 겹쳐도 찢어지지 않게 큰 소리만 부드럽게 눌러 1을 넘지 않게 한다
  // (작은 소리는 그대로. 압축기는 짧은 타격음을 너무 크게 줄여서 쓰지 않는다)
  private pingpongOut: { ctx: BaseAudioContext; node: AudioNode } | null = null

  private getPingpongOut(ctx: BaseAudioContext): AudioNode {
    if (this.pingpongOut?.ctx === ctx) return this.pingpongOut.node
    const shaper = ctx.createWaveShaper()
    const size = 2048
    const curve = new Float32Array(size)
    for (let i = 0; i < size; i++) {
      const x = (i / (size - 1)) * 4 - 2 // 입력 -2 ~ 2
      curve[i] = Math.abs(x) <= 0.6 ? x : Math.sign(x) * (0.6 + 0.35 * Math.tanh((Math.abs(x) - 0.6) / 0.35))
    }
    shaper.curve = curve
    shaper.oversample = '4x'
    shaper.connect(ctx.destination)
    // 곡선의 입력 칸은 -1~1이라, 절반으로 줄여 넣어 실제 소리 -2~2가 곡선 -2~2 자리에 맞게 한다
    const input = ctx.createGain()
    input.gain.value = 0.5
    input.connect(shaper)
    this.pingpongOut = { ctx, node: input }
    return input
  }

  // 당구 득점 음성 녹음 (사용자가 Suno로 만든 "당구여신" 노래에서 잘라 씀): 플레이어 "Nice!" · 세라 "Yes!"
  // 창이 열릴 때 불러 두고, 아직 못 불렀거나 실패하면 음성 합성(speakRetro)으로 대신한다.
  private billiardVoices: Partial<Record<'nice' | 'yes', AudioBuffer>> = {}
  private billiardVoicesLoading = false

  preloadBilliardVoices() {
    if (this.billiardVoicesLoading || typeof window === 'undefined') return
    const ctx = this.getContext()
    if (!ctx) return
    this.billiardVoicesLoading = true
    const files = { nice: 'billiard-nice.wav', yes: 'billiard-yes.wav' } as const
    Promise.all(
      (Object.keys(files) as Array<keyof typeof files>).map((key) =>
        this.billiardVoices[key]
          ? Promise.resolve()
          : fetch(`/sounds/${files[key]}`)
              .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.arrayBuffer()
              })
              .then((data) => ctx.decodeAudioData(data))
              .then((buffer) => {
                this.billiardVoices[key] = buffer
              })
      )
    )
      .catch(() => {})
      .finally(() => {
        // 못 부른 것이 있으면 다음에 다시 시도한다
        if (!this.billiardVoices.nice || !this.billiardVoices.yes) this.billiardVoicesLoading = false
      })
  }

  /** 당구 득점 녹음 재생. 녹음이 아직 없으면 false */
  private playBilliardVoice(key: 'nice' | 'yes'): boolean {
    const ctx = this.getContext()
    const buffer = this.billiardVoices[key]
    if (!ctx || !buffer) {
      this.preloadBilliardVoices()
      return false
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const gain = ctx.createGain()
    gain.gain.value = 0.9
    source.connect(gain)
    gain.connect(ctx.destination)
    source.start()
    return true
  }

  preloadPingpongSample() {
    if (this.pingpongSample || this.pingpongSampleLoading || typeof window === 'undefined') return
    const ctx = this.getContext()
    if (!ctx) return
    this.pingpongSampleLoading = true
    fetch(`/sounds/pingpong-ball.wav`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.arrayBuffer()
      })
      .then((data) => ctx.decodeAudioData(data))
      .then((buffer) => {
        this.pingpongSample = buffer
      })
      .catch(() => {
        // 다음에 다시 시도한다
        this.pingpongSampleLoading = false
      })
  }

  /**
   * 녹음한 탁구공 소리 재생. rate가 높을수록 조금 높고 짧게. 녹음이 아직 없으면 false
   * 녹음 앞 4ms는 충격 직전의 조용한 부분이라 건너뛰고(화면에서 튀는 순간과 맞춤), 뒤 울림은 80ms에서 끊어 경쾌하게 한다
   */
  private playPingpongSample(rate: number, volume: number, room = 0, lowpass = 0, maxLength = 0): boolean {
    const ctx = this.getContext()
    if (!ctx || !this.pingpongSample) {
      this.preloadPingpongSample()
      return false
    }
    const now = ctx.currentTime
    // 느리게 재생하면 같은 부분이 길어지므로 끊는 시점도 늘린다
    // maxLength: 맞는 순간만 쓰고 싶을 때 (녹음 뒤쪽의 작은 울림이 두 번 친 것처럼 들리지 않게)
    const length = maxLength ? Math.min(maxLength, PINGPONG_SAMPLE_LENGTH / rate) : PINGPONG_SAMPLE_LENGTH / rate
    const fadeAt = Math.min(PINGPONG_SAMPLE_FADE_AT / rate, length * 0.5)
    const source = ctx.createBufferSource()
    source.buffer = this.pingpongSample
    // 칠 때마다 ±3% 달리해 같은 소리가 기계적으로 반복되지 않게 한다
    source.playbackRate.value = rate * (0.97 + Math.random() * 0.06)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(volume, now)
    gain.gain.setValueAtTime(volume, now + fadeAt)
    gain.gain.linearRampToValueAtTime(0, now + length)
    const bus = this.getPingpongOut(ctx)
    if (lowpass) {
      // 높은 쨍함을 깎아 둥글게 (라켓 타구음에 겹칠 때)
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = lowpass
      source.connect(filter)
      filter.connect(gain)
    } else source.connect(gain)
    gain.connect(bus)
    if (room) {
      const delay = ctx.createDelay(0.2)
      delay.delayTime.value = 0.045
      const feedback = ctx.createGain()
      feedback.gain.value = 0.25
      const roomFilter = ctx.createBiquadFilter()
      roomFilter.type = 'lowpass'
      roomFilter.frequency.value = 3000
      const roomGain = ctx.createGain()
      roomGain.gain.value = room
      gain.connect(delay)
      delay.connect(roomFilter)
      roomFilter.connect(feedback)
      feedback.connect(delay)
      roomFilter.connect(roomGain)
      roomGain.connect(bus)
      window.setTimeout(() => {
        try { gain.disconnect() } catch {}
      }, 800)
    }
    source.start(now, PINGPONG_SAMPLE_OFFSET, length + 0.01)
    return true
  }

  /** 6ms 충격 잡음 (빠르게 사라지는 잡음, 한 번 만들어 재사용) */
  private getImpulse(ctx: BaseAudioContext): AudioBuffer {
    if (this.impulseBuffer && this.impulseBuffer.sampleRate === ctx.sampleRate) return this.impulseBuffer
    const length = Math.max(1, Math.floor(ctx.sampleRate * 0.006))
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3)
    this.impulseBuffer = buffer
    return buffer
  }

  private ballImpact(options: {
    volume: number
    pitch: number
    /** 나무(테이블·라켓 블레이드) 몸통 소리 */
    wood: { freq: number; gain: number; decay: number }
    /** 공 껍질의 짧은 "똑" (넓은 대역, 음정 없이) */
    shell: { gain: number; decay: number }
    /** 속이 빈 공의 짧은 "폭" (살짝 내려가는 음) */
    hollow: number
    room?: number
    /** 이 위 높은 성분을 깎는다 (기본 6kHz) */
    lowpass?: number
  }) {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const pitch = options.pitch * (0.95 + Math.random() * 0.1)

    // 6kHz 위 쨍한 성분을 깎아 도자기·금속 느낌을 없앤다
    const tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = options.lowpass ?? 6000
    const bus = this.getPingpongOut(ctx)
    const out = ctx.createGain()
    out.gain.value = options.volume
    tone.connect(out)
    out.connect(bus)

    // 경기장 잔향 (스매시): 짧은 지연음을 조금 섞는다
    if (options.room) {
      const delay = ctx.createDelay(0.2)
      delay.delayTime.value = 0.045
      const feedback = ctx.createGain()
      feedback.gain.value = 0.25
      const roomFilter = ctx.createBiquadFilter()
      roomFilter.type = 'lowpass'
      roomFilter.frequency.value = 3000
      const roomGain = ctx.createGain()
      roomGain.gain.value = options.room
      out.connect(delay)
      delay.connect(roomFilter)
      roomFilter.connect(feedback)
      feedback.connect(delay)
      roomFilter.connect(roomGain)
      roomGain.connect(bus)
    }

    const source = ctx.createBufferSource()
    source.buffer = this.getImpulse(ctx)

    // 나무 몸통 "톡": 낮은 Q로 넓게, 금방 사라진다
    const wood = ctx.createBiquadFilter()
    wood.type = 'bandpass'
    wood.frequency.value = options.wood.freq * pitch
    wood.Q.value = 1.4
    const woodEnv = ctx.createGain()
    woodEnv.gain.setValueAtTime(options.wood.gain, now)
    woodEnv.gain.exponentialRampToValueAtTime(0.0001, now + options.wood.decay)
    source.connect(wood)
    wood.connect(woodEnv)
    woodEnv.connect(tone)

    // 공 껍질 "똑": 2.6kHz 근처를 넓게
    const shell = ctx.createBiquadFilter()
    shell.type = 'bandpass'
    shell.frequency.value = 2600 * pitch
    shell.Q.value = 2.2
    const shellEnv = ctx.createGain()
    shellEnv.gain.setValueAtTime(options.shell.gain, now)
    shellEnv.gain.exponentialRampToValueAtTime(0.0001, now + options.shell.decay)
    source.connect(shell)
    shell.connect(shellEnv)
    shellEnv.connect(tone)

    // 속이 빈 공 "폭": 1.15kHz에서 살짝 내려가며 10ms 안에 사라진다
    const hollow = ctx.createOscillator()
    hollow.type = 'sine'
    hollow.frequency.setValueAtTime(1150 * pitch, now)
    hollow.frequency.exponentialRampToValueAtTime(850 * pitch, now + 0.01)
    const hollowEnv = ctx.createGain()
    hollowEnv.gain.setValueAtTime(0.0001, now)
    hollowEnv.gain.exponentialRampToValueAtTime(options.hollow, now + 0.0006)
    hollowEnv.gain.exponentialRampToValueAtTime(0.0001, now + 0.011)
    hollow.connect(hollowEnv)
    hollowEnv.connect(tone)

    source.start(now)
    hollow.start(now)
    hollow.stop(now + 0.02)
    // 연결을 정리할 수 있게 잠깐 뒤 출력 끊기
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        try { out.disconnect() } catch {}
      }, 600)
    }
  }

  /**
   * 탁구 라켓 타구음: 고무 러버에 맞는 짧고 둥근 "탁" (빠를수록 더 높고 크게).
   * 사용자가 후보를 들어 보고 고른 조합(⑪): 합성한 러버 "탁"이 중심 + 테이블 녹음을 0.8배로 낮추고 둥글게 깎아 30%만 같은 순간에 겹친다.
   * 녹음은 맞는 순간 15ms만 쓴다 — 녹음 뒤쪽(약 10·27ms)에 작은 울림이 있어 길게 겹치면 "탁-탁" 두 번 친 것처럼 들린다.
   */
  pingpongRacketHit(speedRatio = 1.0) {
    const speed = Math.max(0.7, Math.min(1.4, speedRatio))
    this.ballImpact({
      volume: 0.75 * speed,
      pitch: 1.05 + (speed - 1) * 0.12,
      wood: { freq: 1600, gain: 4, decay: 0.008 },
      shell: { gain: 1, decay: 0.004 },
      hollow: 0.25,
      lowpass: 3000
    })
    this.playPingpongSample(0.8, 0.25 * speed, 0, 4000, RACKET_SAMPLE_LENGTH)
  }

  /**
   * 탁구 스매시: 라켓 "탁"을 더 크고 단단하게.
   * 경기장 잔향(45ms 뒤 메아리)은 넣지 않는다 — 짧은 "탁" 뒤에 또렷한 메아리가 붙어 두 번 친 것처럼 들린다
   */
  pingpongSmash() {
    this.ballImpact({
      volume: 0.85,
      pitch: 1.1,
      wood: { freq: 1800, gain: 5, decay: 0.009 },
      shell: { gain: 1.5, decay: 0.005 },
      hollow: 0.28,
      lowpass: 3500
    })
    this.playPingpongSample(0.8, 0.3, 0, 4000, RACKET_SAMPLE_LENGTH)
  }

  /** 탁구공 테이블 바운드: 녹음한 나무 테이블 소리 (녹음이 없으면 합성한 "톡") */
  pingpongTableBounce() {
    // 녹음한 나무 테이블 바운드 소리 그대로
    if (this.playPingpongSample(1, 0.75)) return
    this.ballImpact({
      volume: 0.5,
      pitch: 0.92,
      wood: { freq: 1050, gain: 5.5, decay: 0.014 },
      shell: { gain: 2.4, decay: 0.007 },
      hollow: 0.2
    })
  }

  /** 탁구 네트 걸림: 천에 맞는 부드러운 "툭" (고음 울림 없이 짧게) */
  pingpongNetHit() {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const source = ctx.createBufferSource()
    source.buffer = this.getImpulse(ctx)
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 420
    filter.Q.value = 1.5
    const env = ctx.createGain()
    env.gain.setValueAtTime(3, now)
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.06)
    source.connect(filter)
    filter.connect(env)
    env.connect(ctx.destination)
    source.start(now)
  }

  /** 당구 큐대 타격음 (묵직하고 탄력 있는 딱!) */
  billiardCueHit(powerRatio = 0.5) {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const p = Math.max(0.1, Math.min(1.0, powerRatio))

    // 1. 딱! 하는 임팩트 톤
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, now)
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.035)

    gain.gain.setValueAtTime(0.4 * p, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.05)

    // 2. 가죽 팁 마찰 노이즈 펄스
    const bufferSize = ctx.sampleRate * 0.025
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25))
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const nGain = ctx.createGain()
    nGain.gain.setValueAtTime(0.25 * p, now)
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025)

    noise.connect(nGain)
    nGain.connect(ctx.destination)
    noise.start(now)
  }

  /** 당구공끼리 충돌음 (맑고 단단한 딱!) */
  billiardBallHit(intensity = 0.5) {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const i = Math.max(0.08, Math.min(1.0, intensity))

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1800, now)
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.03)

    gain.gain.setValueAtTime(0.45 * i, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.04)
  }

  /** 당구 쿠션(고무 레일) 바운스 (둔탁한 툭) */
  billiardCushion(intensity = 0.5) {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const i = Math.max(0.1, Math.min(1.0, intensity))

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(240, now)
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.045)

    gain.gain.setValueAtTime(0.28 * i, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.06)
  }

  /** 당구공 포켓 홀인 (달그락 골인 소리) */
  billiardPocket() {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime

    // 1. 포켓 그물/가죽 떨어지는 둔탁음
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(320, now)
    osc1.frequency.exponentialRampToValueAtTime(110, now + 0.08)
    gain1.gain.setValueAtTime(0.35, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.1)

    // 2. 포켓 볼 굴러가는 드르륵
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(180, now + 0.05)
    osc2.frequency.exponentialRampToValueAtTime(90, now + 0.18)
    gain2.gain.setValueAtTime(0.2, now + 0.05)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.19)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.05)
    osc2.stop(now + 0.2)
  }

  /** 승리 팡파레 */
  cheer() {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + idx * 0.09
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(0.22, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.35)
    })
  }

  // ------------------------------------------------------------------
  // 🎙️ 영어 여성 음성 (2026-11-02 재설계)
  // 엣지·윈도우 11에 있는 신경망 음성(Microsoft Aria·Jenny·Michelle·Emma·Ava "Online (Natural)")을 가장 먼저 고른다.
  // 구형 Microsoft Zira는 기계음이 강해 마지막 대안. 음성 종류마다 하이톤이 자연스럽게 들리는 피치·속도를 따로 쓴다.
  // 같은 말이 1.5초 안에 두 번 나오지 않게 막는다.
  // ------------------------------------------------------------------
  private voiceCache: SpeechSynthesisVoice | null = null
  private youngVoiceCache: SpeechSynthesisVoice | null = null
  private voiceListener = false
  private lastSpeech = { text: '', at: 0 }

  // young: 세라(AI)용 20대 여성 목소리 — 직접 들어 보고 고른 엣지 신경망 음성 Clara(캐나다 영어)를 먼저, 없으면 Ava·Emma·Michelle
  private pickFemaleVoice(young = false): SpeechSynthesisVoice | null {
    const synth = window.speechSynthesis
    if (!this.voiceListener) {
      // 엣지의 온라인(신경망) 음성은 조금 늦게 목록에 올라온다 → 바뀌면 다시 고른다
      this.voiceListener = true
      synth.addEventListener?.('voiceschanged', () => { this.voiceCache = null; this.youngVoiceCache = null })
    }
    if (young && this.youngVoiceCache) return this.youngVoiceCache
    if (!young && this.voiceCache) return this.voiceCache
    const english = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'))
    const preferred = young
      ? ['clara', 'ava', 'emma', 'michelle', 'jenny', 'aria', 'libby', 'sonia', 'natasha', 'samantha', 'google us english', 'google uk english female', 'victoria', 'karen', 'susan', 'hazel', 'zira']
      : ['jenny', 'aria', 'michelle', 'emma', 'ava', 'sonia', 'libby', 'natasha', 'samantha', 'google us english', 'google uk english female', 'victoria', 'karen', 'susan', 'hazel', 'zira']
    const score = (v: SpeechSynthesisVoice) => {
      const name = v.name.toLowerCase()
      // 남성·어린이 목소리는 쓰지 않는다
      if (/\b(guy|davis|tony|jason|christopher|eric|roger|steffan|andrew|brian|ryan|thomas|david|mark|george|james|ana)\b/.test(name)) return -1
      const rank = preferred.findIndex((n) => name.includes(n))
      if (rank < 0 && !name.includes('female')) return -1
      const natural = name.includes('natural') || name.includes('online') ? 1000 : 0
      // 세라는 Clara(en-CA)가 미국 영어 음성에 밀리지 않게 지역 가산점을 주지 않는다
      const us = !young && v.lang.toLowerCase() === 'en-us' ? 50 : 0
      return natural + us + (rank < 0 ? 0 : 100 - rank)
    }
    const ranked = english.map((v) => ({ v, s: score(v) })).filter((x) => x.s >= 0).sort((a, b) => b.s - a.s)
    const picked = ranked[0]?.v || english[0] || null
    if (young) this.youngVoiceCache = picked
    else this.voiceCache = picked
    return picked
  }

  /** 오락실 게임 느낌의 영어 여성 음성 (간드러진 하이톤) */
  speakRetro(text: string, style: 'nice' | 'cute' | 'announce' = 'nice') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const now = Date.now()
    if (this.lastSpeech.text === text && now - this.lastSpeech.at < 1500) return
    this.lastSpeech = { text, at: now }
    try {
      const synth = window.speechSynthesis
      synth.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'en-US'
      utter.volume = 1.0
      const voice = this.pickFemaleVoice(style === 'cute')
      if (voice) utter.voice = voice
      const name = voice?.name.toLowerCase() || ''
      const natural = name.includes('natural') || name.includes('online')
      // 신경망 음성은 원래 자연스러워 조금만 올리고 천천히(늘이는 느낌), 구형 음성은 너무 올리면 기계음이 심해져 덜 올린다
      const tune = natural
        ? { nice: [1.35, 0.82], cute: [1.45, 1.0], announce: [1.2, 0.9] }
        : name.includes('google')
          ? { nice: [1.3, 0.85], cute: [1.4, 1.08], announce: [1.15, 0.92] }
          : { nice: [1.15, 0.82], cute: [1.25, 1.02], announce: [1.05, 0.9] }
      const [pitch, rate] = tune[style]
      utter.pitch = pitch
      utter.rate = rate
      synth.speak(utter)
    } catch (e) {}
  }

  /** 음성 아래 은은하게 깔리는 반짝 소리 */
  sparkle(delaySec = 0.05) {
    const ctx = this.getContext()
    if (!ctx) return
    const t0 = ctx.currentTime + delaySec
    ;[1568, 2093, 2637].forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = t0 + idx * 0.06
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.05, start + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.4)
    })
  }

  /** 공 포켓 성공 시 80~90년대 오락실 당구 게임 느낌의 영어 여성 음성 "Nice~!" */
  sexyNiceVoice() {
    if (!this.playBilliardVoice('nice')) this.speakRetro('Nice!', 'nice')
    this.sparkle()
  }

  /** 세라(AI)가 공을 넣었을 때 "Yes!" — 녹음이 없을 때의 음성 합성은 20대 여성 하이톤: Clara 음성·톤 1.45·속도 1.0 (사용자가 들어 보고 고름) */
  seraYay() {
    if (!this.playBilliardVoice('yes')) this.speakRetro('Yes!', 'cute')
    this.sparkle()
  }

  /** 8비트 승리 팡파르 "빠바바밤~" (사각파 멜로디 + 삼각파 베이스) */
  victoryFanfare() {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    // [주파수, 시작(초), 길이(초)]
    const melody: [number, number, number][] = [
      [523.25, 0, 0.11], [523.25, 0.13, 0.11], [523.25, 0.26, 0.11], [698.46, 0.39, 0.42],
      [622.25, 0.84, 0.14], [698.46, 0.99, 0.14], [783.99, 1.14, 0.14], [1046.5, 1.29, 0.6]
    ]
    const bass: [number, number, number][] = [
      [130.81, 0, 0.36], [174.61, 0.39, 0.42], [155.56, 0.84, 0.3], [196.0, 1.14, 0.14], [261.63, 1.29, 0.6]
    ]
    const play = (notes: [number, number, number][], type: OscillatorType, volume: number) => {
      notes.forEach(([freq, start, length]) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = type
        osc.frequency.setValueAtTime(freq, now + start)
        gain.gain.setValueAtTime(volume, now + start)
        gain.gain.setValueAtTime(volume, now + start + length * 0.8)
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + length)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + start)
        osc.stop(now + start + length + 0.02)
      })
    }
    play(melody, 'square', 0.07)
    play(bass, 'triangle', 0.16)
  }

  /** 휘파람 "휘~익 휘익!" (아래에서 위로 올라갔다 내려오는 두 번의 휘파람, 살짝 떨림) */
  wolfWhistle(delaySec = 0) {
    const ctx = this.getContext()
    if (!ctx) return
    const t0 = ctx.currentTime + delaySec
    const blow = (start: number, from: number, peak: number, end: number, length: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const vibrato = ctx.createOscillator()
      const vibratoGain = ctx.createGain()
      osc.type = 'sine'
      vibrato.frequency.value = 7
      vibratoGain.gain.value = 18
      vibrato.connect(vibratoGain)
      vibratoGain.connect(osc.frequency)
      osc.frequency.setValueAtTime(from, start)
      osc.frequency.exponentialRampToValueAtTime(peak, start + length * 0.45)
      osc.frequency.exponentialRampToValueAtTime(end, start + length)
      gain.gain.setValueAtTime(0.001, start)
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.05)
      gain.gain.setValueAtTime(0.18, start + length * 0.75)
      gain.gain.exponentialRampToValueAtTime(0.001, start + length)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      vibrato.start(start)
      osc.stop(start + length + 0.02)
      vibrato.stop(start + length + 0.02)
    }
    blow(t0, 900, 2300, 2000, 0.32)
    blow(t0 + 0.42, 1100, 2600, 1300, 0.55)
  }

  /** 폭죽 "펑" (짧은 노이즈 폭발 + 낮은 쿵) */
  fireworkPop(intensity = 1) {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const length = 0.35
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * length), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3)
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1800
    const gain = ctx.createGain()
    gain.gain.value = 0.22 * intensity
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    noise.start(now)

    const boom = ctx.createOscillator()
    const boomGain = ctx.createGain()
    boom.type = 'sine'
    boom.frequency.setValueAtTime(140, now)
    boom.frequency.exponentialRampToValueAtTime(40, now + 0.25)
    boomGain.gain.setValueAtTime(0.25 * intensity, now)
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    boom.connect(boomGain)
    boomGain.connect(ctx.destination)
    boom.start(now)
    boom.stop(now + 0.32)
  }

  /** 탁구 우승 팡파르 (스포츠 중계 느낌 "빰 빠라밤 빠밤~") */
  pingpongVictoryFanfare() {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const melody: [number, number, number][] = [
      [392.0, 0, 0.16], [523.25, 0.18, 0.16], [659.25, 0.36, 0.16], [783.99, 0.54, 0.34],
      [659.25, 0.92, 0.14], [783.99, 1.08, 0.7]
    ]
    const harmony: [number, number, number][] = [
      [329.63, 0.54, 0.34], [523.25, 1.08, 0.7], [659.25, 1.08, 0.7]
    ]
    const bass: [number, number, number][] = [
      [98.0, 0, 0.5], [130.81, 0.54, 0.34], [98.0, 0.92, 0.14], [130.81, 1.08, 0.7]
    ]
    const play = (notes: [number, number, number][], type: OscillatorType, volume: number) => {
      notes.forEach(([freq, start, length]) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = type
        osc.frequency.setValueAtTime(freq, now + start)
        gain.gain.setValueAtTime(volume, now + start)
        gain.gain.setValueAtTime(volume, now + start + length * 0.8)
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + length)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + start)
        osc.stop(now + start + length + 0.02)
      })
    }
    play(melody, 'square', 0.07)
    play(harmony, 'square', 0.035)
    play(bass, 'triangle', 0.16)
  }

  /** 관중 박수와 환호 (짧은 노이즈 박수 여러 개 + 웅성이는 환호) */
  applause(durationSec = 3, delaySec = 0) {
    const ctx = this.getContext()
    if (!ctx) return
    const t0 = ctx.currentTime + delaySec
    const clapLength = 0.05
    const clapBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * clapLength), ctx.sampleRate)
    const clapData = clapBuffer.getChannelData(0)
    for (let i = 0; i < clapData.length; i++) clapData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / clapData.length, 4)
    const claps = Math.floor(durationSec * 26)
    for (let i = 0; i < claps; i++) {
      const at = t0 + Math.random() * durationSec
      const fade = 1 - (at - t0) / (durationSec * 1.2)
      const src = ctx.createBufferSource()
      src.buffer = clapBuffer
      src.playbackRate.value = 0.8 + Math.random() * 0.6
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 1200 + Math.random() * 1400
      const gain = ctx.createGain()
      gain.gain.value = 0.16 * Math.max(0.15, fade)
      src.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      src.start(at)
    }

    // 웅성이는 환호: 저역 노이즈가 커졌다 작아진다
    const crowdBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * durationSec), ctx.sampleRate)
    const crowdData = crowdBuffer.getChannelData(0)
    for (let i = 0; i < crowdData.length; i++) crowdData[i] = Math.random() * 2 - 1
    const crowd = ctx.createBufferSource()
    crowd.buffer = crowdBuffer
    const crowdFilter = ctx.createBiquadFilter()
    crowdFilter.type = 'bandpass'
    crowdFilter.frequency.value = 700
    crowdFilter.Q.value = 0.8
    const crowdGain = ctx.createGain()
    crowdGain.gain.setValueAtTime(0.001, t0)
    crowdGain.gain.exponentialRampToValueAtTime(0.09, t0 + 0.4)
    crowdGain.gain.exponentialRampToValueAtTime(0.001, t0 + durationSec)
    crowd.connect(crowdFilter)
    crowdFilter.connect(crowdGain)
    crowdGain.connect(ctx.destination)
    crowd.start(t0)
  }

  /** 탁구 우승 연출: 팡파르 → 박수·환호 → 휘파람 → "Champion!" */
  pingpongVictory() {
    this.pingpongVictoryFanfare()
    this.applause(3.5, 1.4)
    this.wolfWhistle(2.4)
    if (typeof window !== 'undefined') window.setTimeout(() => this.speakRetro('Champion!', 'announce'), 3600)
  }

  /** 당구 최종 승리 연출: 팡파르 → 휘파람 → "Nice!" */
  billiardVictory() {
    this.victoryFanfare()
    this.wolfWhistle(2.0)
    if (typeof window !== 'undefined') window.setTimeout(() => this.sexyNiceVoice(), 3100)
  }

  /** 파울 경고음 */
  foul() {
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(180, now)
    osc.frequency.setValueAtTime(140, now + 0.12)
    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.3)
  }
}

export const miniGameAudio = new MiniGameSoundFX()

