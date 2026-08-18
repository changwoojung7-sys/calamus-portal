제공해주신 4개 프로젝트의 도메인 성격과 서비스 목적, 기술 스택을 바탕으로 포트폴리오에 바로 활용하실 수 있도록 체계적으로 정리했습니다.

---

## 📁 유진AI 프로젝트 포트폴리오 구성안

```
[유진AI 포트폴리오 구조]
 ├── 1. Calamus AI (calamus.ai.kr) ── [AI 비즈니스 공식 허브 & 브랜드]
 ├── 2. My Re Design (myredesign.ai.kr) ── [AI 라이프스타일 / 개인화 습관 형성]
 ├── 3. 온안부 (onanbu.calamus.ai.kr) ── [케어 테크 / 시니어·가족 안부 플랫폼]
 └── 4. Lua Visibility Dashboard (lua-visibility.pages.dev) ── [SaaS / 비즈니스 인텔리전스 대시보드]

```

---

### 1. Calamus AI (공식 브랜드 & 허브)

> **도메인**: `[https://calamus.ai.kr](https://calamus.ai.kr)`
> **포지셔닝**: AI 기반 맞춤형 솔루션 및 브랜드 메인 포털

* **프로젝트 개요**: 유진AI의 주요 AI 서비스 라인업과 솔루션을 소개하고 연계하는 공식 브랜드 허브 플랫폼
* **핵심 기능**:
* 서비스 통합 쇼케이스 및 서브 서비스(온안부, 라이프 솔루션 등) 라우팅
* 최신 AI 모델 기반의 상담/컨설팅 연계 진입점
* 모바일 및 데스크톱 반응형 UI/UX


* **주요 기술 스택**:
* Frontend: React / Next.js / Tailwind CSS
* Backend & Cloud: Supabase, Cloudflare
* AI: LLM API Integration



---

### 2. My Re Design (AI 라이프스타일 솔루션)

> **도메인**: `[https://myredesign.ai.kr](https://myredesign.ai.kr)`
> **포지셔닝**: AI 기반 라이프 리디자인 및 개인화 습관·목표 관리 PWA

* **프로젝트 개요**: 사용자의 일상 루틴과 목표를 분석하여 개인 맞춤형 피드백을 제공하는 AI 코칭 및 대시보드 웹 앱
* **핵심 기능**:
* 마이페이지 중심의 개인화 루틴/습관 트래킹 대시보드
* AI 코칭 피드백 및 목표 달성률 시각화
* 설치형 모바일 웹 앱(PWA) 지원으로 높은 접근성 제공


* **주요 기술 스택**:
* Frontend: React, PWA (Progressive Web App), Chart.js / Lucide Icons
* Backend & DB: Supabase (Auth, PostgreSQL), OpenAI API
* Hosting: Cloudflare Pages



---

### 3. 온안부 (OnAnBu - AI 케어 & 커뮤니케이션)

> **도메인**: `[https://onanbu.calamus.ai.kr](https://onanbu.calamus.ai.kr)`
> **포지셔닝**: AI 기반 시니어 케어 / 가족 안부 확인 & 웰빙 서비스

* **프로젝트 개요**: 부모님이나 돌봄이 필요한 가족의 안부를 주기적으로 챙기고 상태를 모니터링할 수 있도록 돕는 케어테크 솔루션
* **핵심 기능**:
* 정기적인 안부 체크인 및 알림 발송 시스템
* 감정/상태 기록 분석 및 보호자 대시보드 연동
* 직관적이고 접근성 높은 실버 친화적 UI 디자인


* **주요 기술 스택**:
* Frontend: React, 반응형 웹
* Backend: Cloudflare Workers / Supabase
* Notification & AI: 메시징 API, 텍스트 분석 알고리즘



---

### 4. Lua Visibility Dashboard (엔터프라이즈/SaaS 대시보드)

> **도메인**: `[https://lua-visibility.pages.dev/dashboard](https://lua-visibility.pages.dev/dashboard)`
> **포지셔닝**: 가시성 확보 및 데이터 모니터링을 위한 고성능 분석 대시보드

* **프로젝트 개요**: 복잡한 비즈니스 지표와 시스템 현황을 실시간으로 추적·시각화하는 BI(Business Intelligence) 대시보드
* **핵심 기능**:
* 실시간 KPI 지표 및 시계열 트렌드 인터랙티브 차트
* 데이터 필터링, 정렬, 상세 드릴다운(Drill-down) 뷰
* 엣지 기반 초고속 렌더링 및 SPA 라우팅


* **주요 기술 스택**:
* Frontend: React / TypeScript, Data Visualization Charts, Tailwind CSS
* Infra & Deploy: Cloudflare Pages (Edge 배포)



---

## 📊 포트폴리오 비교 요약표

| 프로젝트명 | 타깃 및 분류 | 핵심 기술 포인트 | 서비스 가치 |
| --- | --- | --- | --- |
| **Calamus AI** | B2C/B2B 브랜드 허브 | 통합 아키텍처, 브랜드 아이덴티티 | 신뢰도 높은 AI 서비스 엔트리포인트 |
| **My Re Design** | B2C 라이프스타일/습관 | PWA, 대시보드 UX, LLM 코칭 | 일상 습관 형성 및 지속성 강화 |
| **온안부** | B2C/Social 케어테크 | 사용자 친화적 UI, 알림/트래킹 | 가족 간 안부 확인 및 돌봄 사각지대 해소 |
| **Lua Visibility** | B2B SaaS/데이터 시각화 | Cloudflare Edge, 인터랙티브 차트 | 비즈니스 데이터의 즉각적인 가시화 |