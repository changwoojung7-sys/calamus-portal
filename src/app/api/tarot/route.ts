import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { question, cards, spread, questionType } = await req.json();

        // Construct Card String
        const cardsStr = cards.map((c: any, i: number) => {
            return `${i + 1}. ${c.position_label}: ${c.name_kr} (${c.is_reversed ? '역방향' : '정방향'})`;
        }).join('\n');

        const role = questionType === "연애" ? "연애 전문 타로 상담가" :
            questionType === "직업" ? "커리어 전문 컨설턴트" :
                questionType === "금전" ? "재무/투자 운세 분석가" :
                    "직관적이고 공감 능력이 뛰어난 타로 상담가";

        const systemPrompt = `당신은 ${role}입니다.
카드의 상징과 흐름을 중심으로 해석하되, 질문자의 상황(${questionType})에 맞춰 구체적으로 조언하세요.`;

        const userPrompt = `[타로 리딩 요청]

질문: ${question || "종합 운세"}
뽑은 카드:
${cardsStr}

배열법: ${spread}장 배열

1) 현재 상황
2) 카드 상징 해석 (각 카드의 의미와 연결성)
3) 조언 및 방향성
4) 종합 결론

친절하고 신비로운 말투로 답변해주세요. Markdown 형식을 사용하세요.`;

        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const gatewayName = process.env.CLOUDFLARE_GATEWAY_NAME || "calamus-ai-gateway";
        const openAiKey = process.env.OPENAI_API_KEY;

        const body = JSON.stringify({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7
        });

        if (accountId && gatewayName && openAiKey) {
            const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayName}/openai/chat/completions`;
            const response = await fetch(gatewayUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${openAiKey}`
                },
                body
            });
            const data = await response.json();
            if (!response.ok) throw new Error(JSON.stringify(data));
            return NextResponse.json({ result: data.choices[0].message.content });
        } else if (openAiKey) {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${openAiKey}`
                },
                body
            });
            const data = await response.json();
            if (!response.ok) throw new Error(JSON.stringify(data));
            return NextResponse.json({ result: data.choices[0].message.content });
        }

        return NextResponse.json({ error: "No AI Provider Configured" }, { status: 500 });

    } catch (error) {
        console.error("Tarot API Error:", error);
        return NextResponse.json({ error: "Failed to read tarot" }, { status: 500 });
    }
}
