import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
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

    // 1. 발송할 메일 HTML 템플릿 생성
    const mailHtml = `
      <div style="font-family: 'Pretendard', sans-serif, -apple-system; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 24px 32px; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 800;">[WorkNexus] 기술 백서 열람 권한 신청</h2>
          <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">신규 기업 B2B 잠재 고객의 기술 문서 열람 요청이 접수되었습니다.</p>
        </div>

        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tbody>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; color: #64748b; font-weight: 600; width: 140px;">신청 백서</td>
                <td style="padding: 12px 8px; color: #0f172a; font-weight: 700;">${manualTitle}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; color: #64748b; font-weight: 600;">기업 / 기관명</td>
                <td style="padding: 12px 8px; color: #0f172a; font-weight: 700;">${company}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; color: #64748b; font-weight: 600;">신청자 성함 / 직책</td>
                <td style="padding: 12px 8px; color: #0f172a;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; color: #64748b; font-weight: 600;">연락처</td>
                <td style="padding: 12px 8px; color: #0f172a;"><a href="tel:${phone}" style="color: #4f46e5; text-decoration: none;">${phone}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px 8px; color: #64748b; font-weight: 600;">회사 업무용 이메일</td>
                <td style="padding: 12px 8px; color: #0f172a;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 8px; color: #64748b; font-weight: 600;">신청 일시 (KST)</td>
                <td style="padding: 12px 8px; color: #64748b; font-size: 13px;">${nowKorea}</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 28px; padding: 16px; background: #f8fafc; border-radius: 12px; font-size: 12px; color: #64748b; line-height: 1.5;">
            💡 <strong>영업 팁:</strong> 신청자 이메일(<span style="color: #4f46e5;">${email}</span>)로 승인 링크를 발송하시거나 연락처(<span style="color: #4f46e5;">${phone}</span>)로 유선 연락하여 도입 상담 일정을 조율하세요.
          </div>
        </div>

        <div style="background: #f8fafc; padding: 16px 32px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
          Calamus Portal · YujinAI Enterprise Inbound System
        </div>
      </div>
    `;

    // 2. 이메일 전송 (Nodemailer 직접 SMTP 발송)
    let emailSent = false;
    let emailError = "";

    const naverUser = process.env.NAVER_USER;
    const naverPass = process.env.NAVER_PASS;
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;

    if (naverUser && naverPass) {
      // [방법 A] 네이버 메일 SMTP 전송
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.naver.com",
          port: 465,
          secure: true,
          auth: {
            user: naverUser,
            pass: naverPass
          }
        });

        await transporter.sendMail({
          from: `"WorkNexus 알림" <${naverUser}>`,
          to: "yujinit2005@gmail.com",
          replyTo: email,
          subject: `[WorkNexus 기술백서 신청] ${company} - ${name} (${phone})`,
          html: mailHtml
        });
        emailSent = true;
      } catch (err: any) {
        console.error("Naver SMTP 전송 실패:", err);
        emailError = err.message || "Naver SMTP Error";
      }
    } else if (gmailUser && gmailPass) {
      // [방법 B] 구글 Gmail SMTP 전송
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: gmailUser,
            pass: gmailPass
          }
        });

        await transporter.sendMail({
          from: `"WorkNexus 알림" <${gmailUser}>`,
          to: "yujinit2005@gmail.com",
          replyTo: email,
          subject: `[WorkNexus 기술백서 신청] ${company} - ${name} (${phone})`,
          html: mailHtml
        });
        emailSent = true;
      } catch (err: any) {
        console.error("Gmail SMTP 전송 실패:", err);
        emailError = err.message || "Gmail SMTP Error";
      }
    } else {
      console.warn("SMTP 환경변수(NAVER_USER/PASS 또는 GMAIL_USER/PASS) 미설정 상태");
    }

    // 3. Supabase DB 백업 저장 시도
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
      console.warn("Supabase 저장 스킵:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "정상적으로 열람 권한 신청이 접수되었습니다.",
      emailSent,
      emailError: emailSent ? undefined : emailError || "SMTP 설정 대기 중"
    });
  } catch (error) {
    console.error("Request manual handler error:", error);
    return NextResponse.json(
      { success: false, message: "서버 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
