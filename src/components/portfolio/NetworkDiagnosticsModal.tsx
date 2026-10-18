"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Copy,
  Download,
  ShieldCheck,
  Wifi,
  Video,
  Monitor,
  Cpu,
  Check,
  X
} from "lucide-react";
import {
  NetworkDiagnosticsService,
  FullDiagnosticReport,
  DiagnosticStepResult
} from "@/services/networkDiagnostics";

interface NetworkDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NetworkDiagnosticsModal({
  isOpen,
  onClose
}: NetworkDiagnosticsModalProps) {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [report, setReport] = useState<FullDiagnosticReport | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const startDiagnostics = async () => {
    setIsRunning(true);
    setReport(null);
    try {
      const fullReport = await NetworkDiagnosticsService.runFullDiagnostics();
      setReport(fullReport);
    } catch (err) {
      console.error("진단 중 오류 발생:", err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isOpen && !report && !isRunning) {
      startDiagnostics();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyReport = () => {
    if (!report) return;
    const text = NetworkDiagnosticsService.generateMaskedReportText(report);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    if (!report) return;
    const text = NetworkDiagnosticsService.generateMaskedReportText(report);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `WorkNexus_Network_Diagnostics_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStepIcon = (id: string) => {
    switch (id) {
      case "browser_capability":
        return Cpu;
      case "media_devices":
        return Video;
      case "screen_share":
        return Monitor;
      case "webrtc_ice":
        return Wifi;
      default:
        return Activity;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] flex flex-col overflow-hidden">
        {/* 모달 헤더 */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">사내망 & 미디어 환경 원클릭 자동 진단</h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                  v1.0.8 Auto-Diag
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                기업 방화벽(UDP/TCP), WebRTC 시그널링 및 화상회의 디바이스 적합성을 실시간 검증합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 바디: 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 pr-1 custom-scrollbar">
          {/* 종합 상태 배너 */}
          {isRunning ? (
            <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center gap-4">
              <RefreshCw className="w-6 h-6 text-purple-400 animate-spin shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">사내 네트워크 및 미디어 파이프라인 진단 중...</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  STUN/ICE 후보 수집 및 UDP 방화벽 포트 응답을 실측하고 있습니다. (약 3~5초 소요)
                </p>
              </div>
            </div>
          ) : report ? (
            <div
              className={`p-5 rounded-2xl border flex items-start gap-4 ${
                report.overallStatus === "PASS"
                  ? "bg-emerald-950/40 border-emerald-500/40"
                  : report.overallStatus === "WARNING"
                  ? "bg-amber-950/40 border-amber-500/40"
                  : "bg-rose-950/40 border-rose-500/40"
              }`}
            >
              {report.overallStatus === "PASS" ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5" />
              ) : report.overallStatus === "WARNING" ? (
                <AlertTriangle className="w-7 h-7 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-7 h-7 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">
                    {report.overallStatus === "PASS"
                      ? "엔터프라이즈 환경 적합성: 최적 (PASS)"
                      : report.overallStatus === "WARNING"
                      ? "엔터프라이즈 환경 적합성: 권장 조치 필요 (WARNING)"
                      : "엔터프라이즈 환경 적합성: 차단 감지 (FAIL)"}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{report.summary}</p>
              </div>
            </div>
          ) : null}

          {/* 4단계 세부 진단 결과 리스트 */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              단계별 진단 세부 항목
            </h5>

            {report?.steps.map((step: DiagnosticStepResult) => {
              const IconComp = getStepIcon(step.id);
              return (
                <div
                  key={step.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-700/60 text-purple-400 shrink-0 mt-0.5">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{step.name}</span>
                        {step.latencyMs !== undefined && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                            {step.latencyMs}ms
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{step.message}</p>
                      {step.detail && (
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {step.detail}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 mt-0.5">
                    {step.status === "success" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> 정상
                      </span>
                    )}
                    {step.status === "warning" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> 점검 권장
                      </span>
                    )}
                    {step.status === "error" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-full">
                        <X className="w-3 h-3" /> 차단됨
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 기업 IT 보안팀용 안내 가이드 */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 text-xs space-y-1.5">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> 사내 IT·보안팀 안내
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              사내망에서 UDP 미디어 스트림이 차단되는 경우, 공급사 포털에서 발급되는{" "}
              <strong className="text-white">Track 2 (100% 폐쇄망 사설 CA 모드)</strong> 또는 사내 전용
              LiveKit SFU TURN 포트(50000~50300/UDP)를 허용하시면 원활하게 통신됩니다.
            </p>
          </div>
        </div>

        {/* 모달 푸터: 재진단 및 리포트 내보내기 */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={startDiagnostics}
            disabled={isRunning}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
            <span>재진단 실행</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyReport}
              disabled={!report || isRunning}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "복사 완료!" : "결과 리포트 복사"}</span>
            </button>
            <button
              onClick={handleDownloadReport}
              disabled={!report || isRunning}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-md shadow-purple-950"
            >
              <Download className="w-3.5 h-3.5" />
              <span>진단서 JSON 다운로드</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
