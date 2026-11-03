import { create } from 'zustand'

/**
 * 🎮 포털 방문자용 미니게임 대체 스토어
 * WorkNexus(Virtual_Office)의 당구·탁구 게임은 사내 오피스 사용자 정보(useOfficeStore)를 읽는다.
 * 포털에는 로그인·동료 목록이 없으므로 게임이 쓰는 두 값(userName, employees)만 같은 모양으로 제공한다.
 * 게임 파일(src/components/minigames)은 원본을 그대로 복사해 쓰므로 이 파일 이름·경로를 바꾸지 않는다.
 */

interface PortalEmployee {
  id: string
  name: string
  role?: string
  department?: string
}

interface PortalOfficeState {
  userName: string
  employees: PortalEmployee[]
}

export const useOfficeStore = create<PortalOfficeState>(() => ({
  userName: '나',
  employees: []
}))
