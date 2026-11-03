/**
 * 🎮 포털 방문자용 경기 기록 대체 모듈
 * WorkNexus에서는 경기 결과를 사내 서버에 저장해 건물 랭킹을 만든다.
 * 포털에는 기록 서버가 없으므로 저장하지 않고, 게임 화면의 "경기 기록" 버튼도 숨긴다.
 */

export type MiniGameName = 'billiard' | 'pingpong'
export type MatchMode = 'online' | 'ai' | 'local'
export type SubmitResult = 'saved' | 'queued' | 'rejected' | 'unavailable'

export const isMatchRecordingAvailable = () => false

class PortalMiniGameRecords {
  // 'rejected'는 게임 화면에 안내 문구를 띄우지 않는다
  async submit(_input: unknown): Promise<SubmitResult> {
    return 'rejected'
  }
}

export const miniGameRecords = new PortalMiniGameRecords()
