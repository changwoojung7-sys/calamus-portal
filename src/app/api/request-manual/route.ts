import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company, name, phone, email, manualTitle } = body;

    if (!company || !name || !phone || !email || !manualTitle) {
      return NextResponse.json(
        { success: false, message: "필수 정보가 누락되었습니다." },
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

    // 1. 관리자 이메일(yujinit2005@gmail.com)로 즉시 전송
    const emailPayload = {
      _subject: `[Calamus WorkNexus] 기술 백서 열람 신청: ${company} - ${name}님`,
      _template: "table",
      신청문서: manualTitle,
      기업_기관명: company,
      신청자_성함_직책: name,
      연락처: phone,
      회사_업무용이메일: email,
      신청일시_KST: nowKorea,
      시스템: "Calamus Portal (WorkNexus Enterprise Gate)"
    };

    let emailSent = false;
    try {
      const emailRes = await fetch("https://formsubmit.co/ajax/yujinit2005@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "https://calamus.ai.kr",
          Referer: "https://calamus.ai.kr"
        },
        body: JSON.stringify(emailPayload)
      });
      const emailResult = await emailRes.json();
      if (emailResult.success === "true" || emailResult.success === true) {
        emailSent = true;
      }
    } catch (err) {
      console.error("이메일 발송 처리 중 오류:", err);
    }

    // 2. Supabase DB에 백업 저장 시도 (선택적)
    try {
      await supabase.from("worknexus_manual_requests").insert([
        {
          company,
          applicant_name: name,
          phone,
          email,
          manual_title: manualTitle,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (dbErr) {
      // 테이블 미존재 등으로 인한 오류 시에도 흐름 유지
      console.warn("Supabase 백업 저장 스킵 또는 미구성:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "정상적으로 열람 권한 신청이 접수되었습니다.",
      emailSent
    });
  } catch (error) {
    console.error("Request manual handler error:", error);
    return NextResponse.json(
      { success: false, message: "서버 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
