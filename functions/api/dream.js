export async function onRequest(context) {
    // Only allow POST
    if (context.request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const { dream } = await context.request.json();

        if (!dream) {
            return new Response("Dream description is required", { status: 400 });
        }

        const apiKey = context.env.OPENAI_API_KEY;
        if (!apiKey) {
            return new Response("Server Configuration Error: API Key missing", { status: 500 });
        }

        // OpenAI API Call
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Cost-effective model
                messages: [
                    {
                        role: "system",
                        content: `
당신은 '칼라머스(Calamus)'의 신비로운 AI 꿈 해몽가입니다. 
융 심리학(Jungian Psychology)과 고전 해몽학을 기반으로 분석합니다.
말투는 신비롭고 공감적이며, 반말이나 너무 가벼운 말투는 지양하고 정중하되 신비로운 '해요'체를 사용하세요.

다음 형식으로 답변하세요:
1. 🔑 **핵심 상징**: 꿈에 나온 주요 상징 3가지와 그 의미
2. 🧠 **심리적 메시지**: 이 꿈이 보여주는 당신의 내면 심리 상태
3. 🔮 **미래의 암시**: 앞으로 일어날 수 있는 일이나 조언 (긍정적 방향 제시)
4. ✨ **행운의 요소**: 이 꿈과 관련된 행운의 색깔이나 아이템
            `.trim()
                    },
                    {
                        role: "user",
                        content: `꿈 내용: ${dream}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const interpretation = data.choices[0].message.content;

        return new Response(JSON.stringify({ result: interpretation }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
