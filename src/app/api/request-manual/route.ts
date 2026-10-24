import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";

export interface ManualRequestItem {
  id: string;
  company: string;
  name: string;
  phone: string;
  email: string;
  manualTitle: string;
  memo?: string;
  status: "pending" | "approved" | "completed";
  createdAt: string;
}

const DATA_FILE_PATH = path.join(process.cwd(), "data", "manual_requests.json");

// 로컬 파일에서 목록 읽기
async function getRequestsFromFile(): Promise<ManualRequestItem[]> {
  try {
    const content = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

// 로컬 파일에 목록 쓰기
async function saveRequestsToFile(items: ManualRequestItem[]): Promise<void> {
  const dir = path.dirname(DATA_FILE_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
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

    // 1. 파일 데이터베이스(게시판) 저장
    try {
      const existing = await getRequestsFromFile();
      existing.unshift(newItem); // 최신순
      await saveRequestsToFile(existing);
    } catch (fsErr) {
      console.error("파일 저장 오류:", fsErr);
    }

    // 2. Supabase DB 백업 저장 시도
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
      console.warn("Supabase 백업 저장 스킵:", dbErr);
    }

    // 3. 만약 SMTP 환경변수가 등록되어 있다면 관리자 메일로도 보조 발송
    const naverUser = process.env.NAVER_USER;
    const naverPass = process.env.NAVER_PASS;
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;

    if ((naverUser && naverPass) || (gmailUser && gmailPass)) {
      try {
        const transporter = naverUser
          ? nodemailer.createTransport({
              host: "smtp.naver.com",
              port: 465,
              secure: true,
              auth: { user: naverUser, pass: naverPass }
            })
          : nodemailer.createTransport({
              service: "gmail",
              auth: { user: gmailUser, pass: gmailPass }
            });

        await transporter.sendMail({
          from: `"WorkNexus 접수" <${naverUser || gmailUser}>`,
          to: "yujinit2005@gmail.com",
          subject: `[WorkNexus 기술백서 신청] ${newItem.company} - ${newItem.name}`,
          html: `
            <h3>[WorkNexus] 기술 백서 열람 권한 신청이 접수되었습니다.</h3>
            <ul>
              <li><b>신청 백서:</b> ${newItem.manualTitle}</li>
              <li><b>회사명:</b> ${newItem.company}</li>
              <li><b>담당자:</b> ${newItem.name}</li>
              <li><b>연락처:</b> ${newItem.phone}</li>
              <li><b>회신 이메일:</b> ${newItem.email}</li>
              <li><b>문의 내용:</b> ${newItem.memo || "없음"}</li>
              <li><b>일시:</b> ${newItem.createdAt}</li>
            </ul>
          `
        });
      } catch (mailErr) {
        console.warn("보조 SMTP 발송 스킵:", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "신청 내역이 정상적으로 게시판에 저장되었습니다.",
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

    // 관리자 핀코드 검증 (기본값: yujin2026)
    const validPin = process.env.ADMIN_PIN || "yujin2026";
    if (pin !== validPin) {
      return NextResponse.json(
        { success: false, message: "관리자 인증 번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const items = await getRequestsFromFile();
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

// [PATCH] 게시판 상태 변경 (대기/승인/완료)
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

    const items = await getRequestsFromFile();
    const targetIdx = items.findIndex((it) => it.id === id);
    if (targetIdx === -1) {
      return NextResponse.json(
        { success: false, message: "해당 항목을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    items[targetIdx].status = status;
    await saveRequestsToFile(items);

    return NextResponse.json({
      success: true,
      message: "상태가 변경되었습니다.",
      item: items[targetIdx]
    });
  } catch (error) {
    console.error("Request manual PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "상태 변경 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
