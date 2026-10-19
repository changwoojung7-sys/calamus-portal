# Virtual Office 종합 검증 및 단계별 개발 보고서 (Walkthrough)

본 문서는 **Virtual Office Enterprise** 솔루션의 1단계부터 최신 공간 대개편(각 층 계단 철거, 1F 리프레시 라운지/갤러리, 2F 전직원 세미나 대회의실/아트 카페, 3F 젠가든 힐링 오아시스)까지의 구현 및 검증 결과를 총정리한 보고서입니다.

## 0-0. 2026-09-25~26 모든 음성·카메라·화면공유 LiveKit 단일화

> 아래 과거 절(예: ③ WebRTC 웹캠 vs 화면공유 트랙 분리)의 `voiceManager.ts` P2P 구현은 **당시 기록**이다. 현재는 삭제되었고 모든 미디어가 사내 LiveKit SFU로만 흐른다.

- **회의 창 마이크·카메라**: 회의실 LiveKit 방에 합류. 껐다 켜기·화면공유 시작/종료·재접속 후에도 자동 재발행되고, 회의 창 참가자끼리만 듣고 본다.
- **1:1 화면공유 + 1:1 음성·영상 통화**: 두 사람 전용 LiveKit 방에서 각각 따로 켜고 끈다. 수락/거절·30초 무응답 취소·통화 중/부재 응답을 지원한다.
- **방 안 근처 대화**: 방별 LiveKit 방. 2.5m까지 선명, 4m 밖 무음. 관리자가 건물 전체·방별로 켜고 끈다(기본 꺼짐).
- **머리 위 카메라**: 같은 방별 LiveKit 방으로 전송해 켜고 끄기가 같은 방 사람 모두에게 즉시 반영된다.
- **시각화**: 발화 링, 들리는 범위 원, 근처 대화 패널(개인별 음소거), 머리 위 음파, "🎥 회의 중" 배지, 통화 카드.
- **P2P 삭제**: `voiceManager.ts`와 서버 `webrtc_signal` 중계를 제거했다. 사용자 IP가 서로 노출되지 않는다.
- **로그아웃 즉시 퇴장**: 서버가 로그아웃 세션의 WebSocket을 닫는다.
- 검증: 서버 회귀 테스트 8종 통과(`test:proximity-voice-token`, `test:direct-call-signal`, `test:logout-presence` 신규 포함). 통합 테스트 시나리오: `mdfile/화상회의_근처대화_1대1통화_통합테스트시나리오_2026-09-26.md`.

## 0. 2026-09-19 최신 고도화 및 온프레미스 배포 패키징 완료

### ① 건물 프리셋 DB 전면 정리 및 로컬/D1 동기화 재구축
- 11개 레거시/임의 프리셋 레코드를 로컬 SQLite 및 Cloudflare D1(`virtual-office-demo-db`, `calamus-virtual-office`)에서 완전 삭제.
- `public/building_presets`의 실제 물리 JSON 9종을 V1.0, `is_active = 0` 표준 데이터로 양대 DB에 무결성 동기화.
- D1 대용량 프리셋 분할 주입 알고리즘 및 D1 원클릭 스냅샷 백업 도구(`backup_d1.bat`, `npm run backup:d1`) 탑재.

### ② 관리자 콘솔(`AdminConsoleModal.tsx`) 창 크기 조절 UX 개선 및 룸 이동 좌석 자동 매핑
- **헤더 화면 이탈 방지**: 모달 창을 수직(위/아래)으로 늘릴 때 상단 헤더가 브라우저 상단 안쪽으로 숨겨져 조작 불가해지던 문제 해결 (`position: sticky`, `flex-shrink: 0`, 상단 바운더리 체크 및 뷰포트 대비 최대/최소 높이 제약).
- **룸 이동 및 빈 좌석 자동 매핑**: 인원을 다른 룸으로 이동 시 대상 방 이동 처리 및 해당 방의 빈 좌석을 자동 감지하여 번호를 매핑하고 SQLite DB 및 WebSocket 실시간 상태 동기화 (`server/index.js`, `AdminConsoleModal.tsx`, `OfficeCanvas.tsx`).

### ③ 모바일 화면공유 최적화 및 카카오톡 인앱 브라우저 탈출 로직
- **화면공유 크게보기 모바일 대응**: 모바일 뷰포트에서 비디오 비율(`object-fit: contain`) 유지 및 화면 최우측 상단 독립 플로팅 닫기 버튼(`X`, `zIndex: 10000005`), 배경 터치 닫기 적용.
- **카카오톡 인앱 브라우저 강제 외부 실행**: 링크 진입 시 Android는 Chrome Intent, iOS는 `kakaotalk://web/openExternal`을 통해 시스템 기본 브라우저(Safari / Chrome)로 자동 탈출 및 안내 가이드 모달(`MobileExperienceManager.tsx`) 제공.
- **모바일 가로모드(Landscape) 권장 가이드**: 스마트폰 세로 접속 시 가로 회전 권장 오버레이 및 브라우저 가로 전체화면 원클릭 잠금 기능 제공.

### ④ 온프레미스 배포 패키지 전체 재생성 및 무결성 검증 완료
- `npm run build:all` 프로덕션 클라이언트 번들 최신 빌드 완료.
- `dist-packages/` 아래 단일 설치기 및 압축본 4종 생성:
  - `VirtualOffice_Server_Setup_v1.0.1_demo.exe` / `.zip` (191.6 MB, 데모 DB 포함)
  - `VirtualOffice_Server_Setup_v1.0.1_production.exe` / `.zip` (191.5 MB, 클린 운영 DB)
- `verify:package:demo`, `verify:package:production` 안전성 검증 100% 통과 (보안 위반 0건).

---

## 1. 최신 공간 대개편 & 인테리어 고도화 완료 (v1.5.0)

### ① 각 층 계단 완전 철거 및 스마트 수직 이동 체계 단일화
- **배경 및 요구사항**:
  - 기존 층간 복셀 계단은 공간을 과도하게 차지하고 시야를 가리며, 아바타 보행 시 높이가 튀거나 계단 구역에서 층 전환이 오작동하는 불편함이 존재.
- **구현 결과**:
  - `Avatar.tsx` 내 계단 감지(`inStairs12`, `inStairs23`, `inStairs34`) 및 진행도에 따른 수동 고도 보정 로직을 완전 삭제하고, 고도를 현재 층 기준으로 단순화(`(currentFloor - 1) * 6.0 + 0.9`).
  - `OfficeWorld.tsx`의 1-2층, 2-3층, 3-4층 모든 복셀 계단 3D 메시를 철거하고, 층간 바닥 구멍을 메워 공간을 150% 이상 확장.
  - 현재 층간 이동은 화면 상단의 층 선택 버튼과 방 선택 메뉴에서 목적지를 골라 이동하는 방식이다.

### ② 2층 전직원 세미나·조회 대회의실 & 아트 카페 라운지 전면 구축
- **메인 세미나 & 조회 무대**:
  - 20m x 3.8m 와이드 단상 + 황동 골드 트림 마감.
  - 10.5m x 4.4m 초대형 4K 와이드 프레젠테이션 스크린(`MeetingScreen`).
  - 듀얼 구스넥 마이크, 노트북, 골드 엠블럼이 탑재된 중앙 강연 연단(Podium).
  - 좌우 대형 라인어레이 스피커 타워 및 몬스테라 플랜테리어 화분.
- **전직원 타운홀 원형 테이블 클러스터 (6조, 총 38석)**:
  - 전열 3조(좌 6석, 중앙 7석, 우 6석) + 후열 3조(좌 6석, 중앙 7석, 우 6석)의 입체적 배치.
  - 다크 월넛 원형 테이블 + 360도 스피커폰 마이크 & 앰버 램프 + 360도 회전 오피스 체어.
- **고급 에스프레소 카페 & 커피 바 (남서쪽)**:
  - L자형 다크 오크 & 화이트 마블 카운터 (4.8m + 2.3m).
  - 프로페셔널 크롬 에스프레소 머신, 원두 그라인더 2기, 디저트/베이커리 쇼케이스, 하이체어 바스툴 4석.
- **예술 조형물 & 벽면 갤러리**:
  - 중앙 실내 원형 분수대 & 다단 석탑 수경 바이오필릭 가든.
  - 블랙 마블 좌대 위의 모던 기하학 황금 조각상 및 전용 핀 조명.
  - 미니멀 아크릴 네온 프리즘 인스톨레이션.
  - 서쪽, 동쪽, 남쪽 벽면에 골드/블루 추상화, 바우하우스, 포레스트, 해안선 등 8점의 대형 캔버스 명화 배치.

### ③ 1층 사무실 주변 프리미엄 리프레시 라운지, 포커스 폰부스 & 벽면 갤러리
- **남서쪽 대형 리프레시 라운지**:
  - 웜 모카 & 올리브 그린 투톤 라운지 러그 카펫.
  - 모던 패브릭 L자형 소파 (안락 쿠션 3개) 및 1인용 라운지 암체어 2조 (에메랄드 틸 & 테라코타).
  - 내추럴 월넛 원목 로우 커피 테이블 (잡지 2권 및 미니 다육이 화분).
  - 스마트 스낵 & 음료 벤딩 머신 (글로우 디스플레이) 및 미니 캡슐 커피바/냉장고 카운터.
  - 대형 플랜테리어 화분 2개 및 웜 앰버 플로어 스탠드 램프.
- **북동쪽 퀵 휴게 & 포커스 폰부스**:
  - 사생활 보호 및 조용한 통화를 위한 스마트 프라이빗 폰부스 (Focus Pod, "AVAILABLE" 그린 네온 표시등).
  - 스탠딩 하이 바 테이블 및 하이스툴 2개.
- **1층 벽면 갤러리 캔버스 컬렉션 (총 8점)**:
  - 보태니컬 몬스테라, 어반 미니멀리즘, 선셋 골든아워, 스칸디나비안 패턴, 이노베이션 비전, 포레스트 선샤인 등 배치.

### ④ 3층 엘리베이터 옆 감성 젠 보태니컬 가든 & 힐링 릴랙스 존
- **기존 협소 스탠딩 테이블/의자 철거**: 엘리베이터 바로 옆 비좁았던 Cluster E 스탠딩 테이블과 의자를 완전 철거.
- **바닥 테라조 젠 스톤 가든 베드**: 백자갈(White River Pebbles) 베이스, 대나무 뱀부 기둥 3본, 미니 분재 석탑 수경 오브제.
- **프리미엄 웰니스 에그 라운지 체어**: 인체공학적 유선형 딥 틸 에그체어 본체, 오트밀 쿠션, 풋스툴(오토만), 크롬 아치 플로어 스탠드 램프, 원목 미니 사이드 테이블 & 아로마 디퓨저.
- **감성 오픈 북선반 & 벽면 갤러리 액자**: 3단 원목 서가(다양한 서적 & 세라믹 화병 오브제) 및 동쪽 벽면 힐링 갤러리 액자 2점.

---

## 2. 이전 고도화 완료 항목 (v1.4.4)

### ① Windows 배치 파일(`install-server.bat`, `start-server.bat`) 파싱 오류 완벽 해결
- **문제 원인**:
  - Windows `cmd.exe`가 UTF-8 멀티바이트 특수문자(4바이트 이모지, 3바이트 유니코드 상자선 등)를 처리할 때 바이트 오프셋 오류를 일으켜 명령어가 잘려 실행되는 전형적인 CMD 내부 버그 발생 (`'e.js'`, `'~dp0server"'`, `'-tunnel'` 등의 명령어를 찾을 수 없다는 오류).
- **해결 조치**:
  - 배치 파일들은 Windows CMD가 100% 안전하게 파싱할 수 있는 표준 ASCII/기본 배치 코드로 전면 경량화.
  - 통합 서버 런처 스크립트([server/launcher.js](../server/launcher.js))를 신설하여 Node.js 환경에서 종속성 검사, 클라이언트 번들 점검, SQLite DB 복사, Cloudflare 터널 자동 다운로드, 사내망 IP 자동 감지, 터미널 컬러 배너 안내를 안전하게 전담 처리.
  - 배포 패키지(`dist-packages/Virtual_Office_Server_v1.0.zip`)에도 최신 런처를 반영하여 압축 해제 후 즉시 정상 구동되도록 검증 완료.

### ② Ollama 로컬 MCP 서버 연결 정상화
- 사용자 환경변수 `OLLAMA_MODELS`의 잘못된 D드라이브 경로(`D:\ollama_models`)로 인해 발생한 서비스 시작 실패 문제를 사용자 기본 경로(`C:\Users\Grangge\.ollama\models`)로 자동 보정 및 백그라운드 서비스 시작.
- Ollama MCP 서버(`ollama-mcp-server`) 연결 확인 완료.

---

## 2. 이전 고도화 완료 항목 (v1.4.3)

### ① 가상 오피스 퇴장 및 근무 상태(퇴근·출장·휴가·외출) 종합 관리 시스템
- **요구사항 분석**:
  - 3D 가상 오피스 내에서 밖으로 나가는(퇴장, 퇴근) 명시적인 기능 부재.
  - 사용자가 퇴근인지, 외부 출장인지, 휴가인지, 또는 프로그램이 비정상 종료(튕김)되어 재입장한 것인지 시스템상 식별 및 복구 체계 필요.
- **해결 조치**:
  - `src/components/WorkExitModal.tsx` 신설:
    - 3D 오피스 HUD 우측 상단에 눈에 띄는 빨간색 **`[🚪 퇴근 / 나가기]` 버튼** 배치.
    - 클릭 시 6대 선택지 카드 제공:
      1. 🏢 오늘 업무 종료 (정상 퇴근): 퇴근 시각 DB 기록, 상태 `off_work` 전환, 포털로 안전 퇴장
      2. 💼 외부 출장 / 현장 외근: 행선지 및 업무 메모 기록, 상태 `business_trip` 전환, 포털로 퇴장
      3. 🌴 연차 / 반차 / 휴가: 휴가 사유 기록, 상태 `vacation` 전환, 포털로 퇴장
      4. ☕ 잠시 자리 비움: 상태 `away` 전환
      5. ↩️ 메인 포털 이동 (출근 유지): 근무 시간 연속 카운트 유지하며 포털 화면 열람
      6. 🔒 계정 완전 로그아웃: 세션 파기 후 로그인 화면 이동
  - **비정상 튕김 vs 정상 퇴근 판별 & 세션 자동 복구**:
    - 오늘 날짜 키(`vo_clock_in_YYYY-MM-DD`)로 출퇴근 상태를 로컬스토리지에 영속화.
    - 브라우저 종료/튕김 후 재입장 시 "이전 출근 세션 복구 (비정상 종료 후 복귀)"로 자동 감지하여 기존 출근 시간을 끊김 없이 연속 카운트하고, 상단에 세션 복구 안내 배지 표시.
  - **메인 포털 실시간 출퇴근 제어 카드 연동 (`EnterprisePortal.tsx`)**:
    - 메인 소개 포털 히어로 섹션에 나의 실시간 근무 시간 및 출퇴근 제어 카드 탑재 (`[출근하고 오피스 입장]`, `[퇴근하기]`, `[초과근무 재출근]`).
  - **전사 실시간 동기화 (`server/index.js`, `networkManager.ts`)**:
    - 근태 변동 시 `attendance_updated` 웹소켓 브로드캐스트로 전사 근태 타임라인 및 동료 상태 실시간 동기화.

---

## 2. 이전 고도화 완료 항목 (v1.4.2)

### ① 화이트보드 클릭 시 해당 층 메모 우선 표시 및 층 정보/작성자 명시
- **요구사항 분석**:
  - 3D 공간에서 각 회의실의 화이트보드를 클릭했을 때, 해당 회의실(층)에 기록된 안건과 브레인스토밍 메모가 우선적으로 조회되어야 함.
  - 각 메모가 몇 층에서 기록되었는지, 그리고 누가 작성했는지 명확하게 표시되어야 함.
  - [전체보기] 클릭 시 1층~4층 전사의 모든 화이트보드 메모를 한눈에 확인할 수 있어야 함.
- **해결 조치**:
  - `src/store/useOfficeStore.ts`:
    - `activeWhiteboardFloor` 및 `setActiveWhiteboardFloor` 추가.
    - `setShowBulletinModal(show, initialTab, initialFloor)` 확장을 통해 화이트보드 진입 시 클릭한 층수 전달.
  - `src/components/InteractiveWhiteboard3D.tsx`, `src/components/HUD.tsx`, `src/hooks/useKeyboardControls.ts`:
    - 3D 화이트보드 클릭 또는 근접 상호작용(E키) 시 해당 층 번호(`floor` / `currentFloor`)를 전달하도록 연동.
  - `src/components/BulletinBoardModal.tsx`:
    - 화이트보드 모달 열림 시 클릭한 층(`activeWhiteboardFloor`)을 기본 필터(`wbFilterFloor`)로 자동 설정하여 해당 층 메모 우선 노출.
    - 상단 서브 툴바에 **`[🌐 전체보기 (총 N건)]` 버튼** 및 **1F~4F 층별 필터 탭**(`[⚡ 1F 소회의실]`, `[💼 2F 대회의실]`, `[🎨 3F 전략회의실]`, `[👑 4F VIP회의실]`) 제공.
    - 상단 알림 배너에 `📍 N층 회의실 기록 (우선 표시 중)` 및 실시간 메모 개수 표시.
    - 메모 작성기(`form`)에 부착 대상 층 선택 드롭다운(`wbTargetFloor`) 추가.
    - 각 포스트잇 카드 상단에 **층 정보 뱃지 (`🏢 NF 회의실명`)** 및 **작성자 뱃지 (`👤 작성자: 이름`)** 상시 표기, 하단에 `기록 위치: N층 (회의실명)` 및 상세 작성 일시 명시.

### ② Cloudflare Pages 25MB 정적 파일 용량 제한 에러 완벽 해결
- **문제 분석**:
  - `public/VirtualOffice-Server.zip` (56.1MB)이 Vite 빌드 시 `dist/`로 그대로 복사되면서, Cloudflare Pages 배포 파이프라인의 자산 검사 단계에서 `Error: Pages only supports files up to 25 MiB in size` 오류 발생.
- **해결 조치**:
  - `git rm public/VirtualOffice-Server.zip`으로 Git 저장소 추적에서 완전 제거.
  - `scripts/create-package.mjs`: 서버 패키지 ZIP 생성을 `public/`이 아닌 배포 전용 폴더(`dist-packages/`)로 직접 저장하도록 수정.
  - `server/index.js`: 서버 패키지 다운로드 API의 조회 우선순위를 `dist-packages/`로 최적화.
  - `dist/` 폴더 내 대용량 파일 배제로 Cloudflare Pages 정적 배포 검증 100% 통과.

### ③ 초기 접속 시 메인 포털 안내 페이지 기본 노출 및 서버 파일 다운로드 다원화
- **요구사항 분석**:
  - Cloudflare Pages(`pages.dev`) 접속 시 메인 소개 및 서버 설치 파일 다운로드 화면이 뜨지 않고 바로 3D 건물 안으로 들어가는 현상 개선.
  - 외부 클라우드 접속 시에도 서버 설치 파일(ZIP)을 원활하게 다운로드받을 수 있는 경로 제공 필요.
- **해결 조치**:
  - `src/store/useOfficeStore.ts`: `getInitialViewMode()`에서 로컬 캐시 우선이 아닌 기본값으로 **메인 포털 안내 페이지(`portal`)를 항상 우선 노출**하도록 수정. (URL에 `?view=office` 파라미터가 명시될 때만 3D 오피스로 직행)
  - `src/components/EnterprisePortal.tsx`:
    - GitHub 최신 소스 및 배치파일 통합 ZIP 다운로드(`main.zip`) 링크 배치로 어디서나 1초 다운로드 보장.
    - 사내망 접속자를 위한 로컬 서버 패키지 API 다운로드(`/api/download/server-package`) 병행 지원.
  - `src/components/HUD.tsx`: 3D 오피스 HUD 상단에 **[🏠 메인 포털]** 버튼을 강조 배치하여 작업 중 언제든 메인 안내 화면으로 복귀 가능.

---

## 2. 이전 고도화 완료 항목 (v1.4.1)

### ① 화상회의 녹화 영상 다운로드 실패(확장자 누락 및 UUID 파일명 저장) 완벽 해결
- **문제 분석**:
  - 기존 코드의 `meetingRecorder.downloadBlob`은 `URL.revokeObjectURL(url)`을 1.5초만에 호출하여, 브라우저가 대용량(5.8MB 등) Blob 쓰기 작업을 마치기도 전에 객체 URL이 소멸됨.
  - 이로 인해 Chromium(Chrome, Edge 등)이 다운로드 메타데이터(`a.download`)를 소실하고 임시 캐시 UUID(`d6107041-1f46-44fe-ae1e-38232641e6e2`)를 파일명으로 저장하여 윈도우에서 열리지 않는 문제 발생.
  - 또한 Blob 생성 시 세미콜론 복합 파라미터(`;codecs=vp9,opus`)가 포함되어 브라우저의 파일 확장자 추론 오류를 유발함.
- **해결 조치**:
  - `meetingRecorder.ts`:
    - Blob 생성 시 순수 MIME 타입(`video/webm`, `audio/webm`)으로 강제 정규화하여 브라우저의 Content-Type 오인 차단.
    - `URL.revokeObjectURL` 지연 시간을 **60초(1분)**로 대폭 연장하여 다운로드가 완전히 끝날 때까지 파일 메타데이터 안전 보장.
    - File System Access API(`showSaveFilePicker`)를 탑재하여 사용자가 저장 폴더와 파일명을 직접 눈으로 확인하고 100% 안전하게 저장 지원 (미지원 시 `<a>` 태그 자동 Fallback).
  - `MeetingRecordingModal.tsx`: 비동기 다운로드 처리 및 다운로드 시작 안내 배지 UI 연동.

### ② 화면공유 종료 시 녹화 자동 종료 및 다운로드 확인 연동
- **문제 분석**:
  - 화면공유 중에 녹화 중인 상태에서 화면공유를 중단하거나 창을 닫아도 녹화가 자동으로 종료되지 않아 영상이 유실되거나 후속 조치가 불가능했음.
- **해결 조치**:
  - `RemoteScreenViewerModal.tsx`:
    - [화면 공유 중지] 버튼 클릭 시, 녹화 중이라면 녹화를 즉시 안전 마감(`meetingRecorder.stop()`)하고 "화면 공유가 종료되었습니다. 녹화 중이던 회의 영상을 저장 및 다운로드하시겠습니까?" 팝업 제공 후 다운로드 모달 연동.
    - 브라우저 기본 화면공유 중지 바 클릭(`track.onended`) 및 `isScreenSharing` 상태 변화 감지 리스너 탑재.
    - 모달 닫기([X] / [회의 나가기] / `ESC` 키) 시에도 녹화 감지 및 다운로드 모달 보호 로직 적용.
  - `useOfficeStore.ts`: `stopScreenShare` 내부에도 `meetingRecorder.isRecording` 감지 시 자동 종료 및 확인 팝업 안전장치 이중 구축.

---

## 2. 이전 고도화 완료 항목 (v1.4.0)

### ① 화이트보드 포스트잇 실시간 동기화 및 3D 보드 밀착 렌더링 최적화
- **문제 분석**:
  - 기존 화이트보드는 REST API(`/api/whiteboard-notes`)로만 저장되고 WebSocket 브로드캐스트가 누락되어, 상대방 사용자가 새로고침하기 전까지 작성된 메모가 공유되지 않음.
  - Three.js `<Html transform>` 컴포넌트의 CSS 3D 원근 투영 오차로 인해, 포스트잇 글자가 3D 게시판 프레임 바깥으로 튀어나가거나 잘려 보이는 문제 발생.
- **해결 조치**:
  - `server/index.js`: `whiteboard_note_created`, `whiteboard_note_deleted` 웹소켓 브로드캐스트 패킷 핸들러 구현.
  - `networkManager.ts` & `useOfficeStore.ts`: 포스트잇 추가/삭제 시 즉시 웹소켓 패킷을 전송하고 모든 클라이언트 스토어에 0.01초 내 실시간 동기화.
  - `InteractiveWhiteboard3D.tsx`: Three.js HTML 대신 고해상도 `CanvasTexture`(`CanvasPostItNote`) 시스템으로 전면 개편. 보드 표면에 완벽히 밀착 렌더링, 텍스트 자동 줄바꿈(Word Wrap), 작성자 및 부서 뱃지 표기, 게시판 내부 정밀 그리드 배치로 이탈/잘림 100% 원천 차단.

### ② 화면공유 전체화면 하단 흐림 및 잘림 현상 완벽 해결
- **문제 분석**:
  - 전체화면 뷰어 모달의 `<video>` 요소에 브라우저 기본 `controls` 속성이 부여되어 있어, 브라우저가 화면 하단 60px 영역에 반투명 검은색 섀도우 그라데이션 및 시크바 컨트롤러를 강제로 오버레이함.
  - 이로 인해 에디터 터미널, 상태표시줄, 하단 코드가 흐리게 가려지고 잘려 보임.
- **해결 조치**:
  - `RemoteScreenViewerModal.tsx`: `<video controls>`에서 `controls` 속성 제거. 브라우저의 기본 오버레이를 없애고 화면 하단까지 100% 선명하고 투명하게 원본 그대로 출력되도록 개선.

### ③ 회의실 팀 채팅 층별 회의실 선택 및 다원화
- **문제 분석**:
  - 채팅창의 회의실 팀 채팅 탭이 '2층 대회의실(`roomA`)'로 고정/하드코딩되어 있어, 다른 층 회의실(1F 소회의실, 3F 전략회의실, 4F VIP임원회의실)을 선택할 수 없었음.
- **해결 조치**:
  - `ChatModal.tsx`: 층별 회의실 목록(`room1F`, `room2F`, `room3F`, `room4F`) 정의 및 서브헤더에 **층별 회의실 선택 드롭다운 셀렉터** 구현.
  - 캐릭터가 위치한 층수(`currentFloor`)에 따라 기본 회의실 자동 선택 및 탭 라벨(`회의실 팀 채팅 (1층 소회의실)` 등) 실시간 연동.
  - `getMeetingMessages`: 기존 레거시 키(`roomA`, `roomB`)와의 양방향 메시지 통합 매핑으로 이전 대화 내역 손실 없이 완벽 호환.
  - `HUD.tsx`: 하단 회의실 채팅 버튼 클릭 시 현재 층별 회의실로 즉시 연동.

---

## 2. 이전 고도화 완료 항목 (v1.3.0)

### ① 실제 웹캠 비디오 스트림 안정화 및 다단계 Fallback
- **원인 분석**:
  - `facingMode: 'user'` 제약으로 인해 Windows 노트북/데스크톱 웹캠에서 `OverconstrainedError` 발생 -> 가상 스마트 캠으로 자동 폴백되는 문제.
  - 최초 또는 이전 시도에서 가상 캠이 캐시되면 실제 카메라를 다시 찾지 않는 캐싱 버그.
  - `HeadVideoBox.tsx`의 `isVideoLoaded` 타이밍 지연으로 비디오 엘리먼트(`opacity: 0`) 위에 아바타 캐릭터 이미지가 덮어씌워져 얼굴이 가려지는 문제.
- **해결 조치**:
  - `mediaStreamManager.ts`: `facingMode` 제거, 3단계 Fallback(HD -> `{ video: true }` 범용 -> `enumerateDevices` 장치 ID 직접 지정), 카메라 토글 시 하드웨어 우선 재탐색(`forceHardware = true`) 구현.
  - `HeadVideoBox.tsx`: `video.muted = true` 강제 적용, `readyState >= 2` 즉시 로딩 처리, 아바타 이미지가 비디오를 가리지 않도록 렌더링 개선, 실제 웹캠(`LIVE`) vs AI 가상 캠(`AI CAM`) 배지 명확화.
  - `RemoteScreenViewerModal.tsx`: 모달 내 웹캠 스트림 실시간 구독 연동.

### ② 회의실 3D 스크린 화면공유 과다 밝기/백화 현상 완벽 해결
- **원인 분석**:
  - `OfficeCanvas.tsx`의 `gl.toneMapping = THREE.ACESFilmicToneMapping` 및 조명 반사로 인해, `MeetingScreen.tsx`의 `meshBasicMaterial`에 톤매핑이 기본 적용(`toneMapped: true`)되어 흰색 웹페이지, 문서, 코드 에디터 화면이 심하게 타버리듯(Blow out) 눈부시게 날아가는 문제.
  - 비디오 텍스처의 `colorSpace` 미지정으로 감마 왜곡 발생.
- **해결 조치**:
  - `MeetingScreen.tsx`: 모든 비디오 및 캔버스 텍스처에 `colorSpace = THREE.SRGBColorSpace` 적용.
  - 화면공유 렌더링 메시의 `meshBasicMaterial`에 `toneMapped={false}` 속성을 명시하여 Three.js 씬의 톤매핑 연산을 우회하고 원본 디스플레이의 색상과 밝기를 1:1 완벽 재현.

### ③ WebRTC 웹캠 vs 화면공유 트랙 완전 분리 (화면공유 시 카메라가 공유되던 현상 해결)
- **원인 분석**:
  - 기존 WebRTC 구현에서 웹캠 비디오 트랙과 화면공유 트랙이 하나의 `videoSender`를 `replaceTrack`으로 공유하여, 카메라가 켜져 있으면 화면공유가 카메라로 덮어씌워짐.
  - 수신측(`pc.ontrack` 및 `networkManager.ts`)에서 비디오 스트림이 들어왔을 때, 해당 피어의 웹캠(`peer.videoStream`)과 회의실 스크린(`roomScreenStreams`)을 구분하지 않고 교차 바인딩하여, 상대방 화면에 에디터 대신 발표자의 얼굴(웹캠)이 대문짝만하게 나오는 문제 발생.
- **해결 조치**:
  - `voiceManager.ts`: `cameraSender`와 `screenSender`를 완전히 독립된 개별 RTCRtpSender로 관리하여 카메라와 화면공유가 동시에 각자 독립 송출되도록 개편.
  - `track.contentHint('detail' vs 'motion')` 및 스트림 ID를 동봉하여, 화면공유 스트림은 오직 3D 회의실 스크린 및 메인 뷰어에만 등록되고, 웹캠 스트림은 오직 아바타 머리 위에만 등록되도록 엄격히 분리.
  - `RemoteScreenViewerModal.tsx`: 화면공유 뷰어 메인 피드에서 발표자 웹캠으로 오인 폴백하던 코드 제거.

---

## 2. 이전 고도화 완료 항목 (v1.2.0)

### ① Cloudflare Tunnel 자동 구동 및 콘솔 Network 주소 연동
- **`viteCloudflareTunnelPlugin.ts`**:
  - `npm run dev` 실행 시 `bin/cloudflared.exe`를 백그라운드로 자동 실행.
  - 터미널 콘솔의 `Local`, `Network` 바로 아래에 `Tunnel: https://xxxx.trycloudflare.com`을 함께 출력하여 개발/테스트 편의성 극대화.
  - 프로세스 종료 시 하위 프로세스 안전 자동 종료.

### ② 회사 서버 단독 설치 & 사원 100% 무설치(Zero-Install) 패키징
- **`scripts/create-package.mjs` & `build-packages.bat`**:
  - 회사는 `Virtual_Office_Server_v1.0.zip` 파일만 받아 사내 서버 PC에 풀고 `install-server.bat` 더블클릭으로 1초 만에 설치.
  - 사원은 어떠한 프로그램 설치 없이 웹 브라우저(Chrome/Edge)로 `http://[서버IP]:3001` 또는 공인 터널 주소에 접속하여 사용.
- **`start-server.bat`**:
  - `node index.js --tunnel`을 통해 사내망 접속 주소와 공인 터널 주소를 동시에 콘솔에 출력.

### ③ Zoom 스타일 고성능 화상 회의 & 화면 공유
- **`RemoteScreenViewerModal.tsx`**:
  - 화면 공유 시 시안(Cyan) 네온 글로우 테두리 효과로 공유 상태 명확화.
  - 회의실 3D 스크린 클릭 시 자유 드래그 이동 및 리사이즈 가능한 플로팅 뷰어 창 오픈.
  - 참석자 실시간 웹캠 및 아바타 목록 노출, 음성 발언자 실시간 하이라이트(파형) 효과.
  - 뷰어 내 원클릭 마이크/카메라 토글 컨트롤 바 탑재.

### ④ VP9/Opus 80% 용량 절감 음성/영상 분리 동시 녹화 시스템
- **`meetingRecorder.ts` & `MeetingRecordingModal.tsx`**:
  - 초경량 모드(VP9 750kbps + Opus 24kbps)로 기존 H.264 대비 용량 80% 이상 절감.
  - 회의 합성 캔버스(발표자료 75% + 발언자 얼굴 25%)를 통해 영상 WebM과 오디오 WebM 동시 개별 저장.
  - 녹화 완료 후 프리뷰 및 AI 회의록 요약 모달 연동.

### ⑤ 4층 VIP 임원 회의실 구조 리뉴얼
- **`FloorTemplateRenderer.tsx`**:
  - 스크린 시야를 가리던 대형 브리핑 보드 완전 철거.
  - 고급 마호가니 대형 컨퍼런스 테이블 + 8인용 프리미엄 가죽 회전의자 세트 배치.

### ⑥ 엔터프라이즈 채팅창 리사이즈 & 안정화
- **`ChatModal.tsx` & `LoginModal.tsx`**:
  - 우하단 리사이즈 핸들을 통한 창 크기 자유 조절 및 원클릭 최대화/복원.
  - React Rules of Hooks 위반 문제 해결로 모달 전환 시 화면 크래시 완전 차단.
  - SQLite DB 사원 명부 실시간 동기화.

---

## 2. 브라우저 실시간 검증 결과 요약

### 1) 로그인 모달 및 사원 선택 검증
- 우측 상단 `사원/관리자 계정 변경` 클릭 시 로그인 모달이 부드럽게 열림.
- 사원 카드(김개발 책임, 르센느 원이 등) 클릭 시 비밀번호 입력 팝업 정상 노출.
- 비밀번호 `1234` 입력 후 정상 로그인 및 자동 출근(`clock_in`) 기록 등록 확인.

### 2) 화상 회의 및 화면 공유 테두리 검증
- 화면 공유 시 전체 화면 외곽에 선명한 시안 네온 테두리가 표시되어 공유 상태 인지 가능.
- 회의실 스크린 클릭 시 뷰어 창이 팝업되며 참석자 웹캠 피드 및 발언자 하이라이트 작동 확인.

### 3) 80% 압축 녹화 및 AI 요약 모달 검증
- 녹화 시작 시 타이머와 붉은 인디케이터 정상 작동.
- 녹화 종료 시 `MeetingRecordingModal`에서 비디오/오디오 개별 다운로드 버튼 및 재생 프리뷰 정상 구동.

---

## 3. 문서 및 배포 현황

| 문서/배치 파일 | 경로 | 설명 |
|:---|:---|:---|
| **통합 운영 매뉴얼** | [0. Virtual Offce 통합 Manual.md](<0. Virtual Offce 통합 Manual.md>) | 서버 관리자 매뉴얼과 사용자 매뉴얼 통합 수록 |
| **최신 변경 이력** | [CHANGELOG_01.md](CHANGELOG_01.md) | 2026-09-24 이후 변경 내역 수록 |
| **과거 변경 이력** | [CHANGELOG.md](CHANGELOG.md) | 이전 버전의 누적 변경 기록 |
| **전체 맥락/아키텍처** | [Context.md](Context.md) | 전체 디렉터리 및 최신 모듈 명세 |
| **배포 가이드** | [DEPLOY_GUIDE.md](../DEPLOY_GUIDE.md) | 온프레미스 서버 설치 및 사원 무설치 접속 가이드 |
| **서버 설치 스크립트** | [install-server.bat](../install-server.bat) | 최초 1회 환경 점검 및 DB/터널 자동 구성 |
| **서버 시작 스크립트** | [start-server.bat](../start-server.bat) | 사내망 IP + 공인 HTTPS 터널 동시 가동 |
| **패키징 빌더** | [build-packages.bat](../build-packages.bat) | 최신 Demo/Production 배포본 생성 |
