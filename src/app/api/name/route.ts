import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const userData = await req.json();

        // Construct the complicated prompt from Name Web
        const prompt = `
Role: 20년 경력의 명리학 전문가이자 성명학 상담가.
Context:
- 이름: ${userData.name} (한자: ${userData.hanja})
- 성별: ${userData.gender === 'male' ? '남' : '여'}
- 생년월일시: ${userData.birthDate} ${userData.birthTime} (${userData.birthType})
- 고민/성향: ${userData.concern}

Task: 위 정보를 바탕으로 사주와 이름을 분석하여 심층 상담 결과를 작성하세요.

Response Framework (Markdown format):
### 1. 사주 오행 분석 (The Essence)
- 일간과 계절의 특징을 본인의 기운으로 설명.
- 쉬운 비유 사용.

### 2. 이름의 자원오행과 사주 보완 (Harmony)
- 한자의 오행이 사주의 부족한 점을 어떻게 채우는지 설명.

### 3. 수리길흉 (The Flow)
- 원/형/이/정 4격 풀이.
- 흉수도 긍정적으로 재해석.

### 4. 사용자 맞춤형 삶의 가이드 (Personalized Advice)
- 고민("${userData.concern}")과 연결하여 구체적 조언.
- "스토리텔링" 강화: 성향과 이름의 힘을 연결.

Tone: 다정하고 통찰력 있으며, 신비로운 분위기.
        `.trim();

        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const gatewayName = process.env.CLOUDFLARE_GATEWAY_NAME || "calamus-ai-gateway";
        const openAiKey = process.env.OPENAI_API_KEY;

        const systemMessage = "당신은 통찰력 있는 명리학자이자 성명학 전문가입니다.";

        if (accountId && gatewayName && openAiKey) {
            // Cloudflare Gateway
            const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayName}/openai/chat/completions`;
            const response = await fetch(gatewayUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${openAiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: systemMessage },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(JSON.stringify(data));
            return NextResponse.json({ result: data.choices[0].message.content });

        } else if (openAiKey) {
            // Direct OpenAI
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${openAiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: systemMessage },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(JSON.stringify(data));
            return NextResponse.json({ result: data.choices[0].message.content });
        }

        return NextResponse.json({ error: "No AI Provider Configured" }, { status: 500 });

    } catch (error) {
        console.error("Name API Error:", error);
        return NextResponse.json({ error: "Failed to analyze name" }, { status: 500 });
    }
}
