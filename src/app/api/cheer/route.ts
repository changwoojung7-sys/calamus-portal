import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export interface CheerRecord {
  id: string;
  nickname: string;
  tag: string;
  emoji: string;
  message: string;
  createdAt: string;
}

const INITIAL_CHEERS: CheerRecord[] = [
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

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({
        success: true,
        cheers: INITIAL_CHEERS
      });
    }

    const { data, error } = await supabase
      .from("worknexus_manual_requests")
      .select("*")
      .eq("company", "[💌응원방명록]")
      .neq("status", "rejected")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) {
      return NextResponse.json({
        success: true,
        cheers: INITIAL_CHEERS
      });
    }

    const dbCheers: CheerRecord[] = data.map((row: any) => ({
      id: row.id,
      nickname: row.applicant_name || "익명 응원러",
      tag: row.manual_title || "⚡ 전기기능사 실기(CEPT) 응원",
      emoji: row.phone || "⚡",
      message: row.memo || "",
      createdAt: row.created_at || new Date().toISOString()
    }));

    return NextResponse.json({
      success: true,
      cheers: [...dbCheers, ...INITIAL_CHEERS]
    });
  } catch (error) {
    console.error("Failed to fetch cheers:", error);
    return NextResponse.json({
      success: true,
      cheers: INITIAL_CHEERS
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const nickname = (body.nickname || "익명 수험생").trim().slice(0, 24);
    const tag = (body.tag || "⚡ 전기기능사 실기(CEPT) 응원").trim().slice(0, 40);
    const emoji = (body.emoji || "⚡").trim().slice(0, 8);
    const message = (body.message || "").trim().slice(0, 500);

    if (!message) {
      return NextResponse.json(
        { error: "응원 메시지를 입력해 주세요." },
        { status: 400 }
      );
    }

    const newCheer: CheerRecord = {
      id: "cheer_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      nickname: nickname || "익명 수험생",
      tag,
      emoji,
      message,
      createdAt: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from("worknexus_manual_requests").insert({
        id: newCheer.id,
        company: "[💌응원방명록]",
        applicant_name: newCheer.nickname,
        phone: newCheer.emoji,
        email: "cheer@calamus.ai.kr",
        manual_title: newCheer.tag,
        memo: newCheer.message,
        status: "approved",
        created_at: newCheer.createdAt
      });

      if (error) {
        console.error("Supabase cheer insert warning:", error);
      }
    }

    return NextResponse.json({
      success: true,
      cheer: newCheer
    });
  } catch (error) {
    console.error("Failed to post cheer:", error);
    return NextResponse.json(
      { error: "응원 메시지 등록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

