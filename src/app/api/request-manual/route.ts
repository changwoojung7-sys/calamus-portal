import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";

export interface ManualRequestItem {
  id: string;
  company: string;
  name: string;
  phone: string;
  email: string;
  manualTitle: string;
  memo?: string;
  status: "pending" | "approved" | "completed" | "rejected";
  createdAt: string;
}

// [POST] 신규 기술 백서 신청 접수
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company, name, phone, email, manualTitle, memo } = body;

    if (!company || !name || !email) {
      return NextResponse.json(
        { success: false, message: "회사명, 신청자 성함, 회신 이메일은 필수입니다." },
        { status: 400 }
      );
    }

    const nowKorea = new Date().toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const newItem: ManualRequestItem = {
      id: "req_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      company: company.trim(),
      name: name.trim(),
      phone: (phone || "").trim(),
      email: email.trim(),
      manualTitle: manualTitle || "종합 기술 백서",
      memo: (memo || "").trim(),
      status: "pending",
      createdAt: nowKorea
    };

    // Supabase DB 저장 시도 (Edge Runtime 호환 Fetch 기반)
    try {
      await supabase.from("worknexus_manual_requests").insert([
        {
          id: newItem.id,
          company: newItem.company,
          applicant_name: newItem.name,
          phone: newItem.phone,
          email: newItem.email,
          manual_title: newItem.manualTitle,
          memo: newItem.memo,
          status: newItem.status,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (dbErr) {
      console.warn("Supabase 저장 처리 (미생성 시 스킵):", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "신청 내역이 정상적으로 접수되었습니다.",
      item: newItem
    });
  } catch (error) {
    console.error("Request manual POST error:", error);
    return NextResponse.json(
      { success: false, message: "신청 접수 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// [GET] 게시판 목록 조회 (관리자 전용)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pin = searchParams.get("pin");

    const validPin = process.env.ADMIN_PIN || "yujin2026";
    if (pin !== validPin) {
      return NextResponse.json(
        { success: false, message: "관리자 인증 번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    let items: ManualRequestItem[] = [];

    // Supabase에서 목록 조회 시도
    try {
      const { data, error } = await supabase
        .from("worknexus_manual_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && !error && data.length > 0) {
        items = data.map((d: any) => ({
          id: d.id,
          company: d.company,
          name: d.applicant_name,
          phone: d.phone,
          email: d.email,
          manualTitle: d.manual_title,
          memo: d.memo,
          status: d.status || "pending",
          createdAt: d.created_at
            ? new Date(d.created_at).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
            : ""
        }));
      }
    } catch (dbErr) {
      console.warn("Supabase 조회 처리:", dbErr);
    }

    return NextResponse.json({
      success: true,
      totalCount: items.length,
      items
    });
  } catch (error) {
    console.error("Request manual GET error:", error);
    return NextResponse.json(
      { success: false, message: "목록 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// [PATCH] 게시판 상태 변경
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, pin } = body;

    const validPin = process.env.ADMIN_PIN || "yujin2026";
    if (pin !== validPin) {
      return NextResponse.json(
        { success: false, message: "관리자 권한이 없습니다." },
        { status: 401 }
      );
    }

    try {
      await supabase
        .from("worknexus_manual_requests")
        .update({ status })
        .eq("id", id);
    } catch (dbErr) {
      console.warn("Supabase 상태 변경:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "상태가 변경되었습니다."
    });
  } catch (error) {
    console.error("Request manual PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "상태 변경 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
