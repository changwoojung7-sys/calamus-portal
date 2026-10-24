"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  Search,
  RefreshCw,
  Download,
  CheckCircle2,
  Clock,
  Check,
  Building,
  User,
  Phone,
  Mail,
  FileText,
  ArrowLeft,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { ManualRequestItem } from "@/app/api/request-manual/route";

export default function AdminRequestsPage() {
  const [pin, setPin] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<ManualRequestItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<ManualRequestItem | null>(null);

  // 로컬스토리지에서 기존 PIN 확인
  useEffect(() => {
    const savedPin = localStorage.getItem("calamus_admin_pin");
    if (savedPin) {
      setPin(savedPin);
      fetchRequests(savedPin);
    }
  }, []);

  const fetchRequests = async (inputPin: string) => {
    setIsLoading(true);
    setAuthError("");
    try {
      const res = await fetch(`/api/request-manual?pin=${encodeURIComponent(inputPin)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.items || []);
        setIsAuthenticated(true);
        localStorage.setItem("calamus_admin_pin", inputPin);
      } else {
        setAuthError(data.message || "인증 번호가 올바르지 않습니다.");
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error(err);
      setAuthError("서버 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    fetchRequests(pin.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem("calamus_admin_pin");
    setIsAuthenticated(false);
    setPin("");
    setItems([]);
  };

  const handleUpdateStatus = async (id: string, newStatus: "pending" | "approved" | "completed") => {
    try {
      const res = await fetch("/api/request-manual", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, pin })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, status: newStatus } : it))
        );
      }
    } catch (err) {
      console.error("상태 변경 오류:", err);
    }
  };

  // CSV 엑셀 다운로드
  const handleExportCsv = () => {
    if (items.length === 0) return;
    const header = ["접수번호", "접수일시", "기업명", "신청자", "연락처", "회신이메일", "신청백서", "문의내용", "상태"];
    const rows = items.map((it) => [
      it.id,
      `"${it.createdAt}"`,
      `"${it.company.replace(/"/g, '""')}"`,
      `"${it.name.replace(/"/g, '""')}"`,
      `"${it.phone}"`,
      `"${it.email}"`,
      `"${it.manualTitle.replace(/"/g, '""')}"`,
      `"${(it.memo || "").replace(/"/g, '""')}"`,
      it.status === "approved" ? "승인완료" : it.status === "completed" ? "상담완료" : "대기중"
    ]);

    const csvContent = "\uFEFF" + [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `WorkNexus_신청목록_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 필터링된 목록
  const filteredItems = items.filter((it) => {
    const matchesSearch =
      it.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.manualTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || it.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const countPending = items.filter((it) => it.status === "pending").length;
  const countApproved = items.filter((it) => it.status === "approved").length;
  const countCompleted = items.filter((it) => it.status === "completed").length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-center mb-1">관리자 게시판 인증</h2>
          <p className="text-xs text-slate-400 text-center mb-6">
            WorkNexus 기술 백서 및 도입 문의 신청 현황을 관리합니다.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                관리자 인증 핀코드
              </label>
              <input
                type="password"
                placeholder="인증 번호 입력 (기본값: yujin2026)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 outline-none transition-all text-sm"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-purple-950/60 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>게시판 입장</span>
              )}
            </button>

            <div className="text-center pt-2">
              <Link href="/#worknexus" className="text-xs text-slate-400 hover:text-white transition-colors">
                ← 메인 포털로 돌아가기
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 상단 네비게이션 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link
              href="/#worknexus"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
              title="메인으로 가기"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[11px] font-bold">
                  Enterprise Lead Admin
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  실시간 연동 중
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                WorkNexus 기술 백서 및 도입 문의 신청 현황
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => fetchRequests(pin)}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>새로고침</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-purple-950/80 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV 다운로드</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-red-950/50 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-300 text-xs font-semibold transition-all"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 3대 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">총 접수 건수</span>
            <div className="text-2xl font-black text-white">{items.length}건</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20">
            <span className="text-xs font-semibold text-amber-400 block mb-1">대기 중 (확인 필요)</span>
            <div className="text-2xl font-black text-amber-400">{countPending}건</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/20">
            <span className="text-xs font-semibold text-purple-400 block mb-1">승인 완료 (문서 발송)</span>
            <div className="text-2xl font-black text-purple-400">{countApproved}건</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/20">
            <span className="text-xs font-semibold text-emerald-400 block mb-1">상담/계약 완료</span>
            <div className="text-2xl font-black text-emerald-400">{countCompleted}건</div>
          </div>
        </div>

        {/* 검색 및 상태 필터 바 */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="기업명, 담당자, 이메일, 백서 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 text-xs outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400">상태:</span>
            {["all", "pending", "approved", "completed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? "bg-purple-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {st === "all" ? "전체" : st === "pending" ? "대기중" : st === "approved" ? "승인완료" : "상담완료"}
              </button>
            ))}
          </div>
        </div>

        {/* 메인 신청 목록 테이블 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                  <th className="py-3 px-4">일시</th>
                  <th className="py-3 px-4">기업 / 기관명</th>
                  <th className="py-3 px-4">신청자 / 직책</th>
                  <th className="py-3 px-4">연락처</th>
                  <th className="py-3 px-4">회신 이메일</th>
                  <th className="py-3 px-4">신청 백서</th>
                  <th className="py-3 px-4 text-center">처리 상태</th>
                  <th className="py-3 px-4 text-center">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      신청 접수된 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {item.createdAt}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        {item.company}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">{item.name}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.phone ? (
                          <a
                            href={`tel:${item.phone}`}
                            className="text-purple-300 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{item.phone}</span>
                          </a>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <a
                          href={`mailto:${item.email}?subject=[WorkNexus] 기술 백서 열람 권한 전달`}
                          className="text-cyan-300 hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          <span>{item.email}</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-purple-200">
                        {item.manualTitle}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleUpdateStatus(
                              item.id,
                              e.target.value as "pending" | "approved" | "completed"
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border outline-none cursor-pointer ${
                            item.status === "approved"
                              ? "bg-purple-950/80 border-purple-500/50 text-purple-300"
                              : item.status === "completed"
                              ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300"
                              : "bg-amber-950/80 border-amber-500/50 text-amber-300"
                          }`}
                        >
                          <option value="pending">대기 중</option>
                          <option value="approved">승인 완료</option>
                          <option value="completed">상담 완료</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold"
                        >
                          보기
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 상세 보기 모달 */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-purple-500/40 p-6 sm:p-8 shadow-2xl text-left">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800"
            >
              ✕
            </button>

            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <span>신청 내역 상세 정보</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">신청 백서</span>
                <span className="font-bold text-white text-sm">{selectedItem.manualTitle}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">기업 / 기관명</span>
                  <span className="font-bold text-white">{selectedItem.company}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">신청자 성함 / 직책</span>
                  <span className="font-bold text-white">{selectedItem.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">연락처</span>
                  <span className="font-bold text-purple-300">{selectedItem.phone || "미입력"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">회신 이메일</span>
                  <span className="font-bold text-cyan-300">{selectedItem.email}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">신청 일시</span>
                <span className="text-slate-300">{selectedItem.createdAt}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">문의 및 추가 요청 사항</span>
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed mt-1">
                  {selectedItem.memo || "(추가 문의 내용 없음)"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <a
                href={`mailto:${selectedItem.email}?subject=[Calamus WorkNexus] ${selectedItem.manualTitle} 열람 권한 안내`}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>이메일로 승인 회신하기</span>
              </a>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
