"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Send,
  Mail,
  Copy,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  MessageSquareHeart,
  ThumbsUp,
  Zap,
  Lock
} from "lucide-react";

export interface CheerItem {
  id: string;
  nickname: string;
  tag: string;
  emoji: string;
  message: string;
  createdAt: string;
}

const FALLBACK_CHEERS: CheerItem[] = [
  {
    id: "seed_cheer_1",
    nickname: "이번회차합격가자",
    tag: "⚡ 전기기능사 실기(CEPT) 응원",
    emoji: "⚡",
    message:
      "3단계 핀번호 매칭이랑 전위 그루핑 기능 진짜 미쳤습니다!! 책으로 볼 때는 도통 이해 안 가던 공통선이 한눈에 보여요. 혼자 보기 아까운 자료 무료로 공개해주셔서 진심으로 감사합니다!",
    createdAt: "2026-10-25T14:20:00.000Z"
  },
  {
    id: "seed_cheer_2",
    nickname: "늦깎이수험생",
    tag: "🙏 개발자님 감사합니다",
    emoji: "🙏",
    message:
      "직장 다니면서 독학으로 실기 준비 중인데 학원 갈 시간이 없어서 막막했거든요. 배관 새들 위치랑 보조회로 통로 규칙까지 단계별로 멈춰가며 볼 수 있어서 큰 힘이 됩니다. 꼭 합격해서 다시 글 남기러 오겠습니다!",
    createdAt: "2026-10-26T09:15:00.000Z"
  },
  {
    id: "seed_cheer_3",
    nickname: "전기과교사",
    tag: "🎓 수업·교육 현장 활용",
    emoji: "🎉",
    message:
      "학생들에게 칠판으로만 시퀀스 동작과 전류 흐름을 설명하기 어려웠는데, F키 전체화면이랑 Space 단계별 멈춤 기능 덕분에 수업 집중도가 확 올라갔습니다. 훌륭한 교육 도구 만들어주셔서 감사합니다!",
    createdAt: "2026-10-26T18:40:00.000Z"
  },
  {
    id: "seed_cheer_4",
    nickname: "예비전기인07",
    tag: "🔥 이번 회차 합격 다짐",
    emoji: "🔥",
    message:
      "공개문제 18개 전부 들어있어서 매일 출퇴근길에 스마트폰이랑 집 PC로 한 과제씩 눈으로 결선 연습하고 있습니다. 벨 테스터로 통전 확인하는 디테일에 감탄했어요! 다들 합격하시길 응원합니다 ⚡",
    createdAt: "2026-10-27T11:05:00.000Z"
  },
  {
    id: "seed_cheer_5",
    nickname: "칼라무스응원단",
    tag: "💜 Calamus 서비스 응원",
    emoji: "💌",
    message:
      "전기기능사 실기 교육관 보고 놀라서 포털까지 구경 왔는데 WorkNexus 가상오피스랑 온안부 병원검색도 철학이 정말 따뜻하네요. 앞으로도 사람들에게 실질적인 도움이 되는 멋진 기술 응원합니다!",
    createdAt: "2026-10-27T21:30:00.000Z"
  }
];

const TAG_OPTIONS = [
  "⚡ 전기기능사 실기(CEPT) 응원",
  "🙏 개발자님 감사합니다",
  "🔥 이번 회차 합격 다짐",
  "🎓 수업·교육 현장 활용",
  "💜 Calamus 서비스 응원"
];

const EMOJI_OPTIONS = ["⚡", "💌", "🔥", "🙏", "🎉", "💪"];

const QUICK_TEMPLATES = [
  "혼자 공부하기 막막했는데 18과제 시뮬레이터 덕분에 핀번호와 결선 흐름이 한눈에 이해됐습니다! 무료 공개 진심으로 감사합니다 ⚡",
  "보조회로 결선 통로랑 배관·입선 단계별 멈춤 기능이 정말 큰 도움이 됩니다. 이번 실기 시험 꼭 한 번에 합격하겠습니다! 🔥",
  "수험생을 위해 이렇게 정성스러운 프로그램을 무료로 나누어 주셔서 감사합니다. 제작자분께 늘 좋은 일만 가득하시길 응원합니다! 💌"
];

const LOCAL_STORAGE_KEY = "calamus_user_cheers_v1";
const LIKES_STORAGE_KEY = "calamus_cheer_likes_v1";

interface CheerGuestbookSectionProps {
  defaultTag?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export default function CheerGuestbookSection({
  defaultTag = "⚡ 전기기능사 실기(CEPT) 응원",
  title = "💌 응원의 메시지 & 수험생 합격 기원 방명록",
  subtitle = "혼자만 쓰기 아까워 무료로 공개한 전기기능사 실기 교육관(CEPT)과 Calamus 프로젝트가 도움이 되셨다면 따뜻한 응원 한마디를 남겨주세요. 제작자에게 가장 큰 힘이 됩니다!",
  compact = false
}: CheerGuestbookSectionProps) {
  const [cheers, setCheers] = useState<CheerItem[]>(FALLBACK_CHEERS);
  const [nickname, setNickname] = useState("");
  const [selectedTag, setSelectedTag] = useState(defaultTag);
  const [selectedEmoji, setSelectedEmoji] = useState("⚡");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({
    seed_cheer_1: 28,
    seed_cheer_2: 19,
    seed_cheer_3: 24,
    seed_cheer_4: 15,
    seed_cheer_5: 12
  });

  useEffect(() => {
    // Load local likes
    try {
      const savedLikes = localStorage.getItem(LIKES_STORAGE_KEY);
      if (savedLikes) {
        setLikesMap((prev) => ({ ...prev, ...JSON.parse(savedLikes) }));
      }
    } catch {
      // ignore
    }

    // Fetch server cheers and merge with localStorage cheers
    const loadCheers = async () => {
      let localCheers: CheerItem[] = [];
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
          localCheers = JSON.parse(raw);
        }
      } catch {
        // ignore
      }

      try {
        const res = await fetch("/api/cheer");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.cheers)) {
            const seen = new Set<string>();
            const merged: CheerItem[] = [];
            for (const item of [...localCheers, ...data.cheers]) {
              if (!seen.has(item.id)) {
                seen.add(item.id);
                merged.push(item);
              }
            }
            setCheers(merged);
            return;
          }
        }
      } catch {
        // fallback if offline
      }

      if (localCheers.length > 0) {
        const seen = new Set<string>();
        const merged: CheerItem[] = [];
        for (const item of [...localCheers, ...FALLBACK_CHEERS]) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            merged.push(item);
          }
        }
        setCheers(merged);
      }
    };

    loadCheers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    const cleanNickname = nickname.trim() || "익명 수험생";
    let createdItem: CheerItem = {
      id: "cheer_local_" + Date.now(),
      nickname: cleanNickname,
      tag: selectedTag,
      emoji: selectedEmoji,
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch("/api/cheer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: cleanNickname,
          tag: selectedTag,
          emoji: selectedEmoji,
          message: message.trim()
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cheer) {
          createdItem = data.cheer;
        }
      }
    } catch {
      // Fallback to local item
    }

    // Save to localStorage for immediate persistence
    try {
      const existingRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const existing: CheerItem[] = existingRaw ? JSON.parse(existingRaw) : [];
      const updatedLocal = [createdItem, ...existing].slice(0, 30);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedLocal));
    } catch {
      // ignore
    }

    setCheers((prev) => [createdItem, ...prev.filter((c) => c.id !== createdItem.id)]);
    setLikesMap((prev) => ({ ...prev, [createdItem.id]: 1 }));
    setMessage("");
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  const handleLike = (id: string) => {
    setLikesMap((prev) => {
      const nextCount = (prev[id] || 1) + 1;
      const updated = { ...prev, [id]: nextCount };
      try {
        localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const getEmailSubject = () =>
    encodeURIComponent(
      `[Calamus 응원 메시지] ${selectedTag} - ${nickname.trim() || "익명 수험생"} 드림`
    );

  const getEmailBody = () =>
    encodeURIComponent(
      `안녕하세요, Calamus 제작자님!\n\n` +
        `[보내는 분]: ${nickname.trim() || "익명 수험생"}\n` +
        `[응원 분야]: ${selectedTag}\n\n` +
        `[응원 한마디]:\n${
          message.trim() ||
          "혼자만 쓰기 아까운 전기기능사 실기 교육관(CEPT)과 유익한 솔루션을 무료로 공개해 주셔서 진심으로 감사합니다! 큰 힘이 되었습니다. ⚡"
        }\n\n` +
        `---\nCalamus 공식 포털 (https://calamus.ai.kr) 응원 방명록에서 발송됨`
    );

  const handleOpenGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=yujinit2005@gmail.com&su=${getEmailSubject()}&body=${getEmailBody()}`;
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenMailto = () => {
    window.location.href = `mailto:yujinit2005@gmail.com?subject=${getEmailSubject()}&body=${getEmailBody()}`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("yujinit2005@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "방금 전";
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
        d.getDate()
      ).padStart(2, "0")}`;
    } catch {
      return "최근";
    }
  };

  return (
    <section
      id="cheer"
      className="scroll-mt-24 relative py-12 sm:py-16 px-4 sm:px-6"
      aria-label="응원의 메시지 방명록 및 제작자 이메일 전송"
    >
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-amber-950/20 border border-amber-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
          {/* 배경 장식 */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* 섹션 헤더 */}
          <div className="relative z-10 text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-extrabold mb-4">
              <MessageSquareHeart className="w-4 h-4 text-amber-400" />
              <span>CHEER & GUESTBOOK · 공개 한줄 응원 방명록 + 이메일 전송</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {title}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* 상단: 작성 폼 (좌) + 이메일 직접 발송 & 안내 (우) */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
            {/* 1. 공개 한줄 응원 방명록 작성 폼 (7칸) */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-7 bg-slate-950/85 border border-slate-800 rounded-2xl p-5 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>1분 만에 응원 한마디 남기기 (로그인 불필요)</span>
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    실시간 공개 보드 반영
                  </span>
                </div>

                {/* 닉네임 & 이모지 선택 */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                      닉네임 (미입력 시 익명 수험생)
                    </label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="예: 이번회차합격, 예비전기기능사"
                      maxLength={24}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                      응원 아이콘 선택
                    </label>
                    <div className="flex items-center gap-1.5">
                      {EMOJI_OPTIONS.map((emo) => (
                        <button
                          key={emo}
                          type="button"
                          onClick={() => setSelectedEmoji(emo)}
                          className={`flex-1 py-2 rounded-xl text-base border transition-all ${
                            selectedEmoji === emo
                              ? "bg-amber-500/20 border-amber-400 scale-105 shadow-sm"
                              : "bg-slate-900 border-slate-800 hover:border-slate-700 opacity-75"
                          }`}
                        >
                          {emo}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 응원 태그 선택 */}
                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                    응원 카테고리 선택
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TAG_OPTIONS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          selectedTag === tag
                            ? "bg-amber-400 text-slate-950 border-amber-400 shadow-sm"
                            : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 빠른 문구 자동완성 칩 */}
                <div className="mb-3">
                  <span className="block text-[11px] font-bold text-slate-400 mb-1.5">
                    💡 클릭하면 응원 문구가 자동으로 채워집니다:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setMessage(QUICK_TEMPLATES[0])}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-300 transition-colors"
                    >
                      + &quot;18과제 시뮬레이터 무료 공개 정말 감사합니다 ⚡&quot;
                    </button>
                    <button
                      type="button"
                      onClick={() => setMessage(QUICK_TEMPLATES[1])}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-300 transition-colors"
                    >
                      + &quot;열심히 연습해서 이번 실기 꼭 합격하겠습니다 🔥&quot;
                    </button>
                    <button
                      type="button"
                      onClick={() => setMessage(QUICK_TEMPLATES[2])}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-300 transition-colors"
                    >
                      + &quot;제작자님께 큰 힘과 응원을 보냅니다 💌&quot;
                    </button>
                  </div>
                </div>

                {/* 응원 메시지 입력창 */}
                <div className="mb-4">
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="도움이 되셨던 점이나 수험생 서로를 향한 합격 응원 메시지를 자유롭게 남겨주세요! (최대 500자)"
                    maxLength={500}
                    required
                    className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
                  />
                </div>
              </div>

              {/* 등록 버튼 & 성공 알림 */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/30 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? "응원 메시지 등록 중..."
                      : "💌 공개 응원 방명록에 한마디 등록하기"}
                  </span>
                </button>

                {submitSuccess && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        따뜻한 응원의 메시지가 아래 방명록에 등록되었습니다! 진심으로 감사합니다 ⚡
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenGmail}
                      className="text-[11px] font-extrabold text-amber-300 underline hover:text-amber-200 shrink-0"
                    >
                      제작자 메일로도 함께 보내기 ↗
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* 2. 제작자에게 이메일로 직접 응원 보내기 카드 (5칸) */}
            <div className="lg:col-span-5 bg-slate-950/85 border border-slate-800 rounded-2xl p-5 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[11px] font-bold mb-3">
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  <span>Direct Email to Creator</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white mb-2">
                  ✉️ 제작자에게 직접 응원 메일 보내기
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  공개 방명록 외에도 제작자(<strong className="text-amber-300">yujinit2005@gmail.com</strong>)에게 직접 감사 인사, 합격 후기, 또는 프로그램 개선 의견을 메일로 보내실 수 있습니다. 왼쪽 입력창에 작성한 내용이 메일 본문에 자동으로 채워집니다!
                </p>

                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">수신자 이메일</span>
                    <span className="text-amber-300 font-mono font-bold">yujinit2005@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">연계 프로젝트</span>
                    <a
                      href="https://cept.calamus.ai.kr/intro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <span>cept.calamus.ai.kr</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleOpenGmail}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Gmail 웹으로 응원 메일 바로 보내기 ↗</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleOpenMailto}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>기본 메일 앱 실행</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">주소 복사 완료!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>이메일 주소 복사</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 하단: 실시간 공개 한줄 응원 보드 (카드 그리드) */}
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  수험생 & 방문자 응원 한마디 ({cheers.length}건)
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">
                  모든 수험생 여러분의 전기기능사 실기 최종 합격을 진심으로 응원합니다! ⚡
                </span>
                <Link
                  href="/admin/requests"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-bold text-slate-400 hover:text-amber-300 transition-colors shrink-0"
                >
                  <Lock className="w-3 h-3" />
                  <span>방명록 관리</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(compact ? cheers.slice(0, 6) : cheers.slice(0, 12)).map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800/90 hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-950/70 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                        <span>{item.emoji || "⚡"}</span>
                        <span className="truncate max-w-[180px]">{item.tag}</span>
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line mb-4">
                      &ldquo;{item.message}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-sky-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      {item.nickname}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleLike(item.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-[11px] font-bold text-slate-300 hover:text-amber-300 transition-all cursor-pointer"
                    >
                      <ThumbsUp className="w-3 h-3 text-amber-400" />
                      <span>공감·합격기원 {likesMap[item.id] || 1}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

