/**
 * WorkNexus Network & Media Diagnostic Engine
 * 클라이언트 및 고객사 네트워크 환경 단계별 자동 진단 도구
 * 
 * 1단계: 브라우저 및 하드웨어 가속(WebGL/WebRTC) 지원 검사
 * 2단계: 마이크, 카메라, 화면공유 디바이스 및 브라우저 권한 검사
 * 3단계: LiveKit / WebRTC ICE 후보 수집 (UDP, TCP, STUN 연결성)
 * 4단계: 네트워크 왕복 지연시간(RTT) 및 미디어 통신 점검
 * 5단계: 민감정보 마스킹 종합 진단 리포트 생성 및 내보내기
 */

export interface DiagnosticStepResult {
  id: string;
  name: string;
  status: "pending" | "running" | "success" | "warning" | "error";
  message: string;
  detail?: string;
  latencyMs?: number;
}

export interface FullDiagnosticReport {
  timestamp: string;
  userAgent: string;
  overallStatus: "PASS" | "WARNING" | "FAIL";
  summary: string;
  steps: DiagnosticStepResult[];
  webrtcDetails: {
    iceCandidateTypes: string[];
    localCandidates: string[];
    turnRequired: boolean;
    hasUdp: boolean;
    hasTcp: boolean;
  };
  clientEnvironment: {
    platform: string;
    screenResolution: string;
    webGlSupported: boolean;
    documentPipSupported: boolean;
    browserMemoryMb?: number;
  };
}

export class NetworkDiagnosticsService {
  /**
   * 브라우저 기본 지원 환경 검사
   */
  static checkBrowserCapabilities(): DiagnosticStepResult {
    try {
      const hasWebRTC = !!(
        typeof window !== "undefined" &&
        window.RTCPeerConnection &&
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia
      );

      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      const hasWebGL = !!gl;

      const hasDocumentPip = typeof window !== "undefined" && "documentPictureInPicture" in window;

      if (!hasWebRTC) {
        return {
          id: "browser_capability",
          name: "브라우저 WebRTC 지원",
          status: "error",
          message: "현재 브라우저는 WebRTC 미디어 표준을 지원하지 않습니다.",
          detail: "Chrome, Edge 등 최신 브라우저를 사용해 주세요."
        };
      }

      return {
        id: "browser_capability",
        name: "브라우저 및 그래픽 가속",
        status: hasWebGL ? "success" : "warning",
        message: hasWebGL
          ? "WebRTC 및 WebGL2 그래픽 가속 정상 지원"
          : "WebRTC 지원됨 (WebGL 하드웨어 가속 비활성화됨 - 2D 업무 모드 권장)",
        detail: `WebGL: ${hasWebGL ? "지원" : "미지원"}, 문서 PiP: ${hasDocumentPip ? "지원" : "미지원"}`
      };
    } catch (e: any) {
      return {
        id: "browser_capability",
        name: "브라우저 지원 검사",
        status: "error",
        message: "브라우저 기능 검사 중 오류 발생",
        detail: e?.message
      };
    }
  }

  /**
   * 미디어 디바이스(마이크, 카메라) 권한 및 지원 검사
   */
  static async checkMediaDevices(): Promise<DiagnosticStepResult> {
    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return {
          id: "media_devices",
          name: "미디어 디바이스 권한",
          status: "error",
          message: "미디어 디바이스 API를 사용할 수 없습니다 (HTTPS 보안 연결 필수)."
        };
      }

      let stream: MediaStream | null = null;
      let hasMic = false;
      let hasCam = false;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
        hasMic = stream.getAudioTracks().length > 0;
        hasCam = stream.getVideoTracks().length > 0;
      } catch (err: any) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          hasMic = stream.getAudioTracks().length > 0;
        } catch (audioErr) {
          // 둘 다 거부되거나 없음
        }
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter((d) => d.kind === "audioinput");
      const videoInputs = devices.filter((d) => d.kind === "videoinput");

      if (hasMic && hasCam) {
        return {
          id: "media_devices",
          name: "마이크 / 카메라 디바이스",
          status: "success",
          message: `마이크(${audioInputs.length}개) 및 웹캠(${videoInputs.length}개) 정상 연결됨`,
          detail: "음성 대화, 화상회의 및 화면 공유 준비 완료"
        };
      } else if (hasMic) {
        return {
          id: "media_devices",
          name: "마이크 / 카메라 디바이스",
          status: "warning",
          message: "마이크는 정상이나 카메라가 감지되지 않았거나 권한이 차단되었습니다.",
          detail: "음성 대화 및 화면 공유는 정상 가능하나 웹캠 화상은 비활성화됩니다."
        };
      } else {
        return {
          id: "media_devices",
          name: "마이크 / 카메라 디바이스",
          status: "warning",
          message: "마이크 및 카메라 권한이 승인되지 않았거나 장치가 없습니다.",
          detail: "브라우저 주소창 좌측의 자물쇠 아이콘을 눌러 마이크 권한을 허용해 주세요."
        };
      }
    } catch (e: any) {
      return {
        id: "media_devices",
        name: "미디어 디바이스",
        status: "warning",
        message: "미디어 장치 접근 권한 확인 필요",
        detail: e?.message || "장치 접근이 거부되었습니다."
      };
    }
  }

  /**
   * 화면 공유(Display Media) API 지원 검사
   */
  static checkScreenShareCapability(): DiagnosticStepResult {
    const hasScreenShare = !!(
      typeof navigator !== "undefined" &&
      navigator.mediaDevices &&
      (navigator.mediaDevices as any).getDisplayMedia
    );

    if (hasScreenShare) {
      return {
        id: "screen_share",
        name: "화면 공유 (시스템 오디오)",
        status: "success",
        message: "고화질 모니터·창·탭 화면 공유 및 사운드 동시 전송 지원",
        detail: "1080p 화면 및 브라우저 시스템 오디오 공유 가능"
      };
    } else {
      return {
        id: "screen_share",
        name: "화면 공유",
        status: "warning",
        message: "화면 공유 API 미지원 (모바일 브라우저 환경)",
        detail: "모바일 환경에서는 화면 수신 및 화상회의 참석 전용으로 동작합니다."
      };
    }
  }

  /**
   * WebRTC ICE 통신망 & 포트 (STUN/UDP/TCP) 연결성 실측
   */
  static async testWebRtcIceConnectivity(
    stunServerUrl: string = "stun:stun.l.google.com:19302"
  ): Promise<{
    step: DiagnosticStepResult;
    webrtcDetails: {
      iceCandidateTypes: string[];
      localCandidates: string[];
      turnRequired: boolean;
      hasUdp: boolean;
      hasTcp: boolean;
    };
  }> {
    const startTime = performance.now();
    const candidateTypes = new Set<string>();
    const candidatesList: string[] = [];
    let hasUdp = false;
    let hasTcp = false;

    return new Promise((resolve) => {
      let pc: RTCPeerConnection | null = null;
      let timeoutId: any = null;

      const finish = (status: "success" | "warning" | "error", msg: string, detail?: string) => {
        if (timeoutId) clearTimeout(timeoutId);
        if (pc) {
          try {
            pc.close();
          } catch (_) {}
          pc = null;
        }

        const elapsedMs = Math.round(performance.now() - startTime);
        const typesArr = Array.from(candidateTypes);

        resolve({
          step: {
            id: "webrtc_ice",
            name: "WebRTC / UDP 방화벽 포트",
            status,
            message: msg,
            detail: detail || `후보 타입: [${typesArr.join(", ")}], 지연시간: ${elapsedMs}ms`,
            latencyMs: elapsedMs
          },
          webrtcDetails: {
            iceCandidateTypes: typesArr,
            localCandidates: candidatesList,
            turnRequired: !hasUdp,
            hasUdp,
            hasTcp
          }
        });
      };

      try {
        const config: RTCConfiguration = {
          iceServers: [{ urls: stunServerUrl }]
        };

        pc = new RTCPeerConnection(config);
        pc.createDataChannel("worknexus_diag_probe");

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const cand = event.candidate;
            const type = cand.type || "unknown";
            const protocol = cand.protocol ? cand.protocol.toLowerCase() : "";

            candidateTypes.add(type);
            candidatesList.push(`${type} (${protocol})`);

            if (protocol === "udp") hasUdp = true;
            if (protocol === "tcp") hasTcp = true;

            if (type === "srflx" && hasUdp) {
              finish(
                "success",
                "사내망 방화벽 UDP / STUN 미디어 포트 정상 개방됨",
                `UDP 미디어 스트림 및 P2P/SFU 릴레이 가능 (지연: ${Math.round(performance.now() - startTime)}ms)`
              );
            }
          } else {
            if (hasUdp) {
              finish(
                "success",
                "사내망 WebRTC UDP 통신 정상 확인",
                `수집된 후보: ${Array.from(candidateTypes).join(", ")}`
              );
            } else {
              finish(
                "warning",
                "사내 방화벽에서 UDP 통신이 차단됨 (TCP/TURN 폴백 필요)",
                "기업 방화벽에서 외부 UDP 포트가 차단된 상태입니다. WorkNexus 폐쇄망 모드(Track 2) 또는 사내 TURN 서버 연동이 권장됩니다."
              );
            }
          }
        };

        pc.createOffer()
          .then((offer) => pc?.setLocalDescription(offer))
          .catch((err) => {
            finish("error", "WebRTC SDP 오퍼 생성 실패", err.message);
          });

        timeoutId = setTimeout(() => {
          if (hasUdp) {
            finish("success", "WebRTC UDP 통신 확인 (타임아웃 완료)", `수집된 후보: ${Array.from(candidateTypes).join(", ")}`);
          } else if (candidateTypes.size > 0) {
            finish(
              "warning",
              "UDP 후보 수집 지연 (기업 방화벽 UDP 차단 감지)",
              "사내망 보안 정책으로 인해 UDP 미디어 트래픽이 지연되거나 차단될 수 있습니다."
            );
          } else {
            finish(
              "error",
              "WebRTC 시그널링 통신 차단 (사내 프록시/방화벽 확인 필요)",
              "STUN/시그널링 패킷 응답이 없습니다."
            );
          }
        }, 5000);
      } catch (e: any) {
        finish("error", "WebRTC 소켓 초기화 실패", e?.message);
      }
    });
  }

  /**
   * 전체 종합 진단 실행
   */
  static async runFullDiagnostics(onProgress?: (step: DiagnosticStepResult) => void): Promise<FullDiagnosticReport> {
    const steps: DiagnosticStepResult[] = [];

    // 1단계: 브라우저 환경
    const step1 = this.checkBrowserCapabilities();
    steps.push(step1);
    onProgress?.(step1);

    // 2단계: 미디어 장치
    const step2 = await this.checkMediaDevices();
    steps.push(step2);
    onProgress?.(step2);

    // 3단계: 화면 공유 API
    const step3 = this.checkScreenShareCapability();
    steps.push(step3);
    onProgress?.(step3);

    // 4단계: WebRTC ICE / UDP 포트 통신망 실측
    const { step: step4, webrtcDetails } = await this.testWebRtcIceConnectivity();
    steps.push(step4);
    onProgress?.(step4);

    const hasError = steps.some((s) => s.status === "error");
    const hasWarning = steps.some((s) => s.status === "warning");
    const overallStatus: "PASS" | "WARNING" | "FAIL" = hasError
      ? "FAIL"
      : hasWarning
      ? "WARNING"
      : "PASS";

    let summary = "";
    if (overallStatus === "PASS") {
      summary = "모든 네트워크 포트와 미디어 디바이스가 완벽하게 준비되었습니다. WorkNexus 화상회의 및 사내망 협업을 최상의 품질로 이용하실 수 있습니다.";
    } else if (overallStatus === "WARNING") {
      summary = "일부 미디어 장치 또는 사내망 UDP 방화벽 설정에 주의가 필요합니다. 2D 업무 모드나 사내 폐쇄망 모드(Track 2) 설정을 권장합니다.";
    } else {
      summary = "핵심 WebRTC 또는 미디어 기능이 차단되었습니다. 브라우저 권한 및 기업 보안팀 방화벽 설정을 확인해 주세요.";
    }

    const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    const gl = canvas ? canvas.getContext("webgl2") || canvas.getContext("webgl") : null;

    return {
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Node/Server",
      overallStatus,
      summary,
      steps,
      webrtcDetails,
      clientEnvironment: {
        platform: typeof navigator !== "undefined" ? navigator.platform || "Unknown" : "Unknown",
        screenResolution: typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "Unknown",
        webGlSupported: !!gl,
        documentPipSupported: typeof window !== "undefined" && "documentPictureInPicture" in window,
        browserMemoryMb: typeof performance !== "undefined" && (performance as any).memory
          ? Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024))
          : undefined
      }
    };
  }

  /**
   * 민감정보(사내 IP, 토큰, 토큰 매핑 등) 마스킹 처리하여 안전한 JSON 텍스트 리포트 생성
   */
  static generateMaskedReportText(report: FullDiagnosticReport): string {
    const masked = JSON.parse(JSON.stringify(report));
    const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
    masked.userAgent = masked.userAgent.replace(ipRegex, "xxx.xxx.xxx.xxx");

    return JSON.stringify(
      {
        solution: "Calamus WorkNexus Enterprise Diagnostic Report",
        version: "v1.0.8-diag",
        generatedAt: masked.timestamp,
        overallStatus: masked.overallStatus,
        summary: masked.summary,
        clientEnvironment: masked.clientEnvironment,
        stepResults: masked.steps.map((s: DiagnosticStepResult) => ({
          name: s.name,
          status: s.status,
          message: s.message,
          detail: s.detail,
          latencyMs: s.latencyMs
        })),
        webrtcCapabilities: {
          hasUdp: masked.webrtcDetails.hasUdp,
          hasTcp: masked.webrtcDetails.hasTcp,
          turnRequired: masked.webrtcDetails.turnRequired,
          candidateTypes: masked.webrtcDetails.iceCandidateTypes
        }
      },
      null,
      2
    );
  }
}
