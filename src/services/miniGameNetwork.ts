import type { MiniGameKind } from '../store/useMiniGameStore'

/**
 * 🎮 포털 방문자용 온라인 대전 대체 모듈
 * WorkNexus에서는 같은 건물 동료와 사내 서버(WebSocket)로 1:1 대전을 한다.
 * 포털에는 사내 서버가 없으므로 보내기·받기를 모두 비워 두고, 게임은 AI 대전·같은 PC 대전으로만 동작한다.
 */

type DataHandler = (kind: string, data: any) => void

class PortalMiniGameNetwork {
  send(_game: MiniGameKind, _kind: string, _data?: unknown) {}

  onData(_game: MiniGameKind, _handler: DataHandler) {
    return () => {}
  }

  leave() {}

  gameLabel(game: MiniGameKind) {
    return game === 'billiard' ? '당구' : '탁구'
  }
}

export const miniGameNetwork = new PortalMiniGameNetwork()
