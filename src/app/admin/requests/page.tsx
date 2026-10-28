"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  Search,
  RefreshCw,
  Download,
  Phone,
  Mail,
  FileText,
  ArrowLeft,
  MessageSquareHeart,
  Building2
} from "lucide-react";
import { ManualRequestItem } from "@/app/api/request-manual/route";

const SEED_CHEER_ADMIN_ITEMS: ManualRequestItem[] = [
  {
    id: "seed_cheer_1",
    company: "[💌응원방명록]",
    name: "이번회차합격가자",
    phone: "⚡",
    email: "cheer@calamus.ai.kr",
    manualTitle: "⚡ 전기기능사 실기(CEPT) 응원",
    memo: "3단계 핀번호 매칭이랑 전위 그루핑 기능 진짜 미쳤습니다!! 책으로 볼 때는 도통 이해 안 가던 공통선이 한눈에 보여요. 혼자 보기 아까운 자료 무료로 공개해주셔서 진심으로 감사합니다!",
    status: "approved",
    createdAt: "2026. 10. 25. 오후 2:20:00"
  },
  {
    id: "seed_cheer_2",
    company: "[💌응원방명록]",
    name: "늦깎이수험생",
    phone: "🙏",
    email: "cheer@calamus.ai.kr",
    manualTitle: "🙏 개발자님 감사합니다",
    memo: "직장 다니면서 독학으로 실기 준비 중인데 학원 갈 시간이 없어서 막막했거든요. 배관 새들 위치랑 보조회로 통로 규칙까지 단계별로 멈춰가며 볼 수 있어서 큰 힘이 됩니다. 꼭 합격해서 다시 글 남기러 오겠습니다!",
    status: "approved",
    createdAt: "2026. 10. 26. 오전 9:15:00"
  },
  {
    id: "seed_cheer_3",
    company: "[💌응원방명록]",
    name: "전기과교사",
    phone: "🎉",
    email: "cheer@calamus.ai.kr",
    manualTitle: "🎓 수업·교육 현장 활용",
    memo: "학생들에게 칠판으로만 시퀀스 동작과 전류 흐름을 설명하기 어려웠는데, F키 전체화면이랑 Space 단계별 멈춤 기능 덕분에 수업 집중도가 확 올라갔습니다. 훌륭한 교육 도구 만들어주셔서 감사합니다!",
    status: "approved",
    createdAt: "2026. 10. 26. 오후 6:40:00"
  },
  {
    id: "seed_cheer_4",
    company: "[💌응원방명록]",
    name: "예비전기인07",
    phone: "🔥",
    email: "cheer@calamus.ai.kr",
    manualTitle: "🔥 이번 회차 합격 다짐",
    memo: "공개문제 18개 전부 들어있어서 매일 출퇴근길에 스마트폰이랑 집 PC로 한 과제씩 눈으로 결선 연습하고 있습니다. 벨 테스터로 통전 확인하는 디테일에 감탄했어요! 다들 합격하시길 응원합니다 ⚡",
    status: "approved",
    createdAt: "2026. 10. 27. 오전 11:05:00"
  },
  {
    id: "seed_cheer_5",
    company: "[💌응원방명록]",
    name: "칼라무스응원단",
    phone: "💌",
    email: "cheer@calamus.ai.kr",
    manualTitle: "💜 Calamus 서비스 응원",
    memo: "전기기능사 실기 교육관 보고 놀라서 포털까지 구경 왔는데 WorkNexus 가상오피스랑 온안부 병원검색도 철학이 정말 따뜻하네요. 앞으로도 사람들에게 실질적인 도움이 되는 멋진 기술 응원합니다!",
    status: "approved",
    createdAt: "2026. 10. 27. 오후 9:30:00"
  }
];

export default function AdminRequestsPage() {
  const [pin, setPin] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<ManualRequestItem[]>([]);
  const [categoryTab, setCategoryTab] = useState<"all" | "lead" | "cheer">("all");
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

  const mergeWithLocalCheers = (serverItems: ManualRequestItem[]) => {
    let localCheerItems: ManualRequestItem[] = [];
    try {
      const raw = localStorage.getItem("calamus_user_cheers_v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          localCheerItems = parsed.map((c: any) => ({
            id: c.id,
            company: "[💌응원방명록]",
            name: c.nickname || "익명 수험생",
            phone: c.emoji || "⚡",
            email: "cheer@calamus.ai.kr",
            manualTitle: c.tag || "⚡ 전기기능사 실기(CEPT) 응원",
            memo: c.message || "",
            status: "approved",
            createdAt: c.createdAt
              ? new Date(c.createdAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
              : "최근"
          }));
        }
      }
    } catch {
      // ignore
    }

    const seen = new Set<string>();
    const merged: ManualRequestItem[] = [];
    for (const item of [...localCheerItems, ...serverItems, ...SEED_CHEER_ADMIN_ITEMS]) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
    }
    return merged;
  };

  const fetchRequests = async (inputPin: string) => {
    setIsLoading(true);
    setAuthError("");
    try {
      const res = await fetch(`/api/request-manual?pin=${encodeURIComponent(inputPin)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(mergeWithLocalCheers(data.items || []));
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

  const handleUpdateStatus = async (
    id: string,
    newStatus: "pending" | "approved" | "completed" | "rejected"
  ) => {
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
    const header = ["접수번호", "접수일시", "구분/기업명", "신청자/닉네임", "연락처/아이콘", "회신이메일", "신청백서/응원태그", "문의/응원내용", "상태"];
    const rows = items.map((it) => [
      it.id,
      `"${it.createdAt}"`,
      `"${it.company.replace(/"/g, '""')}"`,
      `"${it.name.replace(/"/g, '""')}"`,
      `"${it.phone}"`,
      `"${it.email}"`,
      `"${it.manualTitle.replace(/"/g, '""')}"`,
      `"${(it.memo || "").replace(/"/g, '""')}"`,
      it.status === "approved"
        ? "승인/공개"
        : it.status === "completed"
        ? "상담완료"
        : it.status === "rejected"
        ? "숨김/반려"
        : "대기중"
    ]);

    const csvContent = "\uFEFF" + [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Calamus_통합접수및응원목록_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 필터링된 목록
  const filteredItems = items.filter((it) => {
    const isCheer = it.company === "[💌응원방명록]";
    if (categoryTab === "lead" && isCheer) return false;
    if (categoryTab === "cheer" && !isCheer) return false;

    const matchesSearch =
      it.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.manualTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (it.memo || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || it.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const leadItems = items.filter((it) => it.company !== "[💌응원방명록]");
  const cheerItems = items.filter((it) => it.company === "[💌응원방명록]");
  const countPending = leadItems.filter((it) => it.status === "pending").length;
  const countCompleted = items.filter((it) => it.status === "approved" || it.status === "completed").length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-center mb-1">Calamus 통합 관리자 인증</h2>
          <p className="text-xs text-slate-400 text-center mb-6">
            WorkNexus 기업 도입 문의 및 CEPT 응원 방명록을 통합 관리합니다.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                관리자 인증 핀코드
              </label>
              <input
                type="password"
                placeholder="관리자 인증 핀코드를 입력하세요"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoComplete="current-password"
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
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-purple-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>관리자 대시보드 입장</span>
              )}
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
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
              href="/"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all"
              title="메인으로 가기"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[11px] font-bold">
                  Calamus Integrated Admin
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Supabase 연동 중
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                기업 도입 문의 &amp; 수험생 응원 방명록 통합 관리 보드
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => fetchRequests(pin)}
              disabled={isLoading}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>새로고침</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-purple-950/80 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV 다운로드</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-red-950/50 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-300 text-xs font-semibold transition-all cursor-pointer"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 4대 통계 카드 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">총 등록 건수</span>
            <div className="text-2xl font-black text-white">{items.length}건</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/20">
            <span className="text-xs font-semibold text-purple-400 block mb-1">🏢 기업 백서·도입 문의</span>
            <div className="text-2xl font-black text-purple-400">
              {leadItems.length}건 <span className="text-xs font-normal text-amber-300">(대기 {countPending})</span>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20">
            <span className="text-xs font-semibold text-amber-400 block mb-1">💌 응원 방명록 메시지</span>
            <div className="text-2xl font-black text-amber-400">{cheerItems.length}건</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/20">
            <span className="text-xs font-semibold text-emerald-400 block mb-1">공개·승인·상담 완료</span>
            <div className="text-2xl font-black text-emerald-400">{countCompleted}건</div>
          </div>
        </div>

        {/* 카테고리 탭 & 검색 필터 바 */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryTab("all")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  categoryTab === "all"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700"
                }`}
              >
                전체 보기 ({items.length})
              </button>
              <button
                onClick={() => setCategoryTab("lead")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  categoryTab === "lead"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-950 text-purple-300 border border-slate-800 hover:border-purple-500/40"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>기업 백서·도입 문의 ({leadItems.length})</span>
              </button>
              <button
                onClick={() => setCategoryTab("cheer")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  categoryTab === "cheer"
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "bg-slate-950 text-amber-300 border border-slate-800 hover:border-amber-500/40"
                }`}
              >
                <MessageSquareHeart className="w-3.5 h-3.5" />
                <span>💌 응원 방명록 ({cheerItems.length})</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">상태:</span>
              {[
                { key: "all", label: "전체" },
                { key: "pending", label: "대기중" },
                { key: "approved", label: "공개·승인" },
                { key: "completed", label: "상담완료" },
                { key: "rejected", label: "숨김·반려" }
              ].map((st) => (
                <button
                  key={st.key}
                  onClick={() => setStatusFilter(st.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    statusFilter === st.key
                      ? "bg-purple-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="기업명, 닉네임, 응원 메시지 본문, 이메일, 백서 제목 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-white placeholder-slate-500 text-xs outline-none"
            />
          </div>
        </div>

        {/* 메인 신청 및 응원 목록 테이블 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
                  <th className="py-3 px-4">일시</th>
                  <th className="py-3 px-4">구분 / 기업명</th>
                  <th className="py-3 px-4">신청자 / 닉네임</th>
                  <th className="py-3 px-4">백서 / 응원 태그</th>
                  <th className="py-3 px-4">내용 미리보기</th>
                  <th className="py-3 px-4 text-center">처리 상태</th>
                  <th className="py-3 px-4 text-center">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      조회된 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const isCheer = item.company === "[💌응원방명록]";
                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                          {item.createdAt}
                        </td>
                        <td className="py-3.5 px-4 font-bold whitespace-nowrap">
                          {isCheer ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px]">
                              <span>{item.phone || "💌"}</span>
                              <span>응원 방명록</span>
                            </span>
                          ) : (
                            <span className="text-white">{item.company}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-sky-300">
                          {item.name}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-purple-200 whitespace-nowrap">
                          {item.manualTitle}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                          {item.memo || "-"}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleUpdateStatus(
                                item.id,
                                e.target.value as "pending" | "approved" | "completed" | "rejected"
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border outline-none cursor-pointer ${
                              item.status === "approved"
                                ? "bg-purple-950/80 border-purple-500/50 text-purple-300"
                                : item.status === "completed"
                                ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300"
                                : item.status === "rejected"
                                ? "bg-rose-950/80 border-rose-500/50 text-rose-300"
                                : "bg-amber-950/80 border-amber-500/50 text-amber-300"
                            }`}
                          >
                            <option value="pending">대기 중</option>
                            <option value="approved">공개 / 승인</option>
                            <option value="completed">상담 완료</option>
                            <option value="rejected">숨김 / 반려</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold cursor-pointer"
                          >
                            보기
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <span>
                {selectedItem.company === "[💌응원방명록]"
                  ? "💌 응원 방명록 메시지 상세"
                  : "🏢 기업 신청 내역 상세 정보"}
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">구분 / 카테고리</span>
                <span className="font-bold text-white text-sm">{selectedItem.manualTitle}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">기업명 / 보드 구분</span>
                  <span className="font-bold text-white">{selectedItem.company}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">신청자 / 작성자 닉네임</span>
                  <span className="font-bold text-white">{selectedItem.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">연락처 / 응원 아이콘</span>
                  <span className="font-bold text-purple-300">{selectedItem.phone || "미입력"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">회신 이메일</span>
                  <span className="font-bold text-cyan-300">{selectedItem.email}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">등록 일시</span>
                <span className="text-slate-300">{selectedItem.createdAt}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">메시지 / 상세 문의 내용</span>
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed mt-1">
                  {selectedItem.memo || "(내용 없음)"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              {selectedItem.company !== "[💌응원방명록]" && (
                <a
                  href={`mailto:${selectedItem.email}?subject=[Calamus WorkNexus] ${selectedItem.manualTitle} 열람 권한 안내`}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>이메일로 승인 회신하기</span>
                </a>
              )}
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
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
