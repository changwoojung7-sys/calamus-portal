"use client"

/**
 * 🎮 포털 방문자용 경기 기록판 대체 컴포넌트
 * 포털에는 기록 서버가 없어 기록판을 열지 않는다 (isMatchRecordingAvailable() === false 라 버튼도 숨겨진다).
 */
export const MiniGameRecordBoard: React.FC<{ initialGame?: 'billiard' | 'pingpong'; onClose: () => void }> = () => null
