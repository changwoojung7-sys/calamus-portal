# 변경 내역 (CHANGELOG)

## [2026-08-17] Calamus Care 메디컬 & 케어 포털 전면 리뉴얼 및 Git 자동 연동

### 1. 포털 브랜딩 및 아키텍처 개편 (Calamus Care)
- **타깃 전환**: 잡학/엔터테인먼트 포털 ➔ **한방의료 & 요양·호스피스 전문 헬스케어 포털 (`Calamus Care`)**
- **공공데이터 모델링**: 건강보험심사평가원(HIRA) 병원정보서비스 및 병원평가정보 규격(`healthcare_facilities`, `facility_details`)에 맞춘 TypeScript 타입(`Facility`, `FacilityDetail`) 및 Mock 데이터 세트(`mockFacilities.ts`) 구축
- **심평원 API 연동 모듈**: `src/lib/hira.ts` 및 REST 검색 엔드포인트 `src/app/api/facilities/route.ts` 구현 (실시간 API 키 연계 및 Mock 폴백 지원)

### 2. 메인 페이지 및 인터랙티브 UI 구현
- **시설 인터랙티브 탐색기 (`FacilityMapSearch.tsx`)**:
  - 종별 필터(한방병원: `28`, 한의원: `93`, 요양병원: `21`, 호스피스: `hospice`)
  - 지역(시도) 및 심평원 적정성 평가 1등급 필터링
  - 카카오맵 SDK 연동 및 비활성화 시 프리미엄 카드/스펙 폴백 뷰 제공
- **히어로 섹션 및 퀵 네비게이션 (`QuickCategoryCards.tsx`)**:
  - 한방병원, 1등급 요양병원, 호스피스 완화의료, 케어 매거진 바로가기
- **케어 매거진 & 가이드 (`CareMagazineSection.tsx`)**:
  - 요양병원 vs 요양원 비교, 체질별 한방 케어, 호스피스 이용 가이드 아티클
- **힐링 라운지 마음 쉼터 배너 (`HealingLoungeBanner.tsx`)**:
  - 기존 사주(`/saju`), 타로(`/tarot-room`), 꿈해몽(`/dream`), 선택도우미(`/balance`), 성명학(`/name`), 미니게임(`/brake`)을 하단 서브 메뉴로 깔끔하게 통합 배치
- **GNB 및 푸터 리뉴얼**: `Calamus Care` 정체성에 맞는 다크/에메랄드 톤 디자인 및 법적 고지 갱신

### 3. Git 자동화 스킬 구축
- `.agents/skills/git-auto-sync/SKILL.md` 생성하여 원격 저장소(`https://github.com/changwoojung7-sys/calamus-portal.git`)로의 자동 커밋 및 푸시 워크플로우 지원
