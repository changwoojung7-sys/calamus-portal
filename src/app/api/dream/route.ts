import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { dream } = await req.json();

        if (!dream) {
            return NextResponse.json({ error: "Dream text is required" }, { status: 400 });
        }

        const systemPrompt = `당신은 '칼라머스(Calamus)'의 신비로운 AI 꿈 해몽가입니다. 융 심리학과 고전 해몽학을 기반으로 분석합니다. 말투는 신비롭고 공감적이며 정중한 '해요'체를 사용하세요.

다음 형식으로 답변하세요:
1. 🔑 **핵심 상징**: 꿈에 나온 주요 상징 3가지와 그 의미
2. 🧠 **심리적 메시지**: 이 꿈이 보여주는 당신의 내면 심리 상태
3. 🔮 **미래의 암시**: 앞으로 일어날 수 있는 일이나 조언 (긍정적 방향 제시)
4. ✨ **행운의 요소**: 이 꿈과 관련된 행운의 색깔이나 아이템`;

        // Check if Cloudflare Gateway is configured (from .env)
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const gatewayName = process.env.CLOUDFLARE_GATEWAY_NAME || "calamus-ai-gateway";

        const openAiKey = process.env.OPENAI_API_KEY;

        if (accountId && gatewayName && openAiKey) {
            // Use Cloudflare Gateway
            const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayName}/openai/chat/completions`;

            const response = await fetch(gatewayUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${openAiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini", // Use mini as per legacy code (server.py had gpt-4o-mini)
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `꿈 내용: ${dream}` }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(JSON.stringify(data));
            return NextResponse.json({ result: data.choices[0].message.content });
        }
        else if (openAiKey) {
            // Direct OpenAI Fallback
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${openAiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `꿈 내용: ${dream}` }
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(JSON.stringify(data));
            return NextResponse.json({ result: data.choices[0].message.content });
        }

        return NextResponse.json({ error: "Server Configuration Error: No AI Provider" }, { status: 500 });

    } catch (error: any) {
        console.error('Dream API Error:', error);
        return NextResponse.json({
            error: 'Failed to interpret dream',
            details: error.message || String(error),
            env_check: {
                hasOpenAi: !!process.env.OPENAI_API_KEY,
                hasAccountId: !!process.env.CLOUDFLARE_ACCOUNT_ID
            }
        }, { status: 500 });
    }
}
