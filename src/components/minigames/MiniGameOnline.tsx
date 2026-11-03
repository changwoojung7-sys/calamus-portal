"use client"

import React from 'react'
import { Globe, X, ExternalLink } from 'lucide-react'
import type { MiniGameKind } from '../../store/useMiniGameStore'

/**
 * 🎮 포털 방문자용 온라인 대전 안내 팝업
 * WorkNexus에서는 이 자리에 "같은 건물 동료 초대" 목록이 뜬다.
 * 포털에는 사내 서버가 없으므로, 온라인 1:1 대전은 WorkNexus 가상 오피스 기능이라는 안내와 소개 링크를 보여 준다.
 */

const WORKNEXUS_INTRO_URL = '/#worknexus-updates'
const DEMO_URL = 'https://try.worknexus.calamus.ai.kr/'

export const OnlineInvitePicker: React.FC<{ game: MiniGameKind; onClose: () => void }> = ({ game, onClose }) => {
  const label = game === 'billiard' ? '🎱 당구' : '🏓 탁구'

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10050,
        background: 'rgba(2, 6, 23, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'rgba(15, 23, 42, 0.96)',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          borderRadius: 16,
          padding: 22,
          color: '#e2e8f0',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, color: '#c084fc' }}>
            <Globe size={18} /> {label} 온라인 대전
          </div>
          <button onClick={onClose} title="닫기" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
          온라인 1:1 대전은 <b style={{ color: '#fde68a' }}>WorkNexus 가상 오피스</b>의 휴게실 기능입니다.
          같은 건물 동료를 초대해 각자 자기 PC에서 실시간으로 대전하고, 경기 기록과 사내 랭킹도 남습니다.
        </p>
        <p style={{ fontSize: 12.5, lineHeight: 1.6, color: '#94a3b8', margin: '10px 0 0' }}>
          여기서는 AI 대전이나 한 화면에서 번갈아 치는 같은 PC 대전으로 즐겨 보세요.
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <a
            href={WORKNEXUS_INTRO_URL}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '10px 12px',
              borderRadius: 10,
              background: 'rgba(168, 85, 247, 0.85)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 800,
              textDecoration: 'none'
            }}
          >
            WorkNexus 소개 보기
          </a>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid rgba(148, 163, 184, 0.4)',
              color: '#e2e8f0',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            3D 데모 입장 <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  )
}
