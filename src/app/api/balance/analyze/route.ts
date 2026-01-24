import { NextRequest, NextResponse } from 'next/server';



export async function POST(req: NextRequest) {
    try {
        const { category, formData } = await req.json();

        // Configuration for Cloudflare AI Gateway
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const gatewayName = process.env.CLOUDFLARE_GATEWAY_NAME || "calamus-ai-gateway";

        // Using local rewrite to proxy request if needed, or direct if valid
        const baseUrl = '/api/gateway';

        // NOTE: In the new unified portal, we should ensure .env params are set
        // NOTE: In the new unified portal, we should ensure .env params are set
        // Saju implementation relies on the logic flow to catch missing keys, so we will align with that.

        // Construct the prompt based on category
        let prompt = "";

        if (category === "IT_GADGET") {
            prompt = `
        사용자는 [${formData.budget}] 범위 내에서 [${formData.usage}]를 위해 [${formData.productType}]을 찾고 있어.
        특히 [${formData.requirements}]을 가장 중요하게 생각해.
        선호 브랜드는 [${formData.brand || "특별히 없음"}] 이야.

        최신 모델 중 가장 적합한 3가지를 선정해서 아래 형식으로 작성해줘 (Markdown):

        ## 1. 추천 모델 상세 분석
        각 모델에 대해 다음 양식을 지켜줘:
        
        ### 1. [모델명] 
        👉 [네이버 쇼핑 검색 바로가기](https://search.shopping.naver.com/search/all?query=${formData.productType}+모델명)
        *   **가격대**: (예상 가격)
        *   **주요 특징**: (핵심 장점)
        *   **⛔ 치명적 단점**: (실제 사용자 리뷰 기반의 부정적 피드백 솔직하게)
        
        (3개 모델 반복)

        ## 2. 한눈에 보는 비교표
        | 모델명 | 가격 | 핵심 강점 | 아쉬운 점 |
        |---|---|---|---|
        | (모델1) | ... | ... | ... |
        
        ## 3. 최종 추천 코멘트
        사용자의 상황에 가장 적합한 1순위 모델과 그 이유를 조금 상세히 설명해줘.    
        
        **주의**: 링크 URL은 'https://search.shopping.naver.com/search/all?query=검색어' 형식을 반드시 그대로 사용하여 생성해줘.
      `;
        } else if (category === "CAREER") {
            prompt = `
        사용자가 두 가지 직업 선택지 사이에서 고민 중이야. 현재 상태는 [${formData.status}].
        
        [A안]: ${formData.optionA}
        [B안]: ${formData.optionB}
        
        사용자의 우선순위인 [${formData.priority}]를 기준으로 
        각 선택을 했을 때 예상되는 1년 뒤의 만족도 시뮬레이션을 보여주고, 
        후회를 최소화할 수 있는 제3의 관점을 조금 상세히 설명해줘. Markdown으로 작성해줘.
      `;
        } else if (category === "TRAVEL") {
            prompt = `
        [${formData.period}]에 [${formData.companions}]과 함께 떠날 여행지를 추천해줘.
        사용자는 [${formData.preference}]과 [${formData.weather}] 날씨를 원해.
        
        해당 시기의 실제 예상 날씨와 현재 환율 상황을 고려해서 가성비와 만족도가 가장 높은 지역 2곳을 선정하고 아래 형식으로 작성해줘:
        
        ## 1. [추천 여행지 이름]
        👉 [네이버 여행 정보 검색](https://search.naver.com/search.naver?query=여행지이름+여행)
        *   **추천 이유**: (날씨, 분위기 등)
        *   **예상 비용**: (항공권, 숙박 시세)
        *   **🔥 Must Do**: (오직 여기서만 가능한 시그니처 경험 3가지)
        
        ## 2. [두 번째 추천 여행지 이름]
        (위와 동일 양식)
        
        ## 3. 종합 비교 및 팁을 조금 상세히 설명해줘.   
        
        Markdown으로 작성해줘.
      `;
        } else if (category === "LIFE") {
            prompt = `
        너는 따뜻하면서도 이성적인 인생 상담가야. 사용자가 다음과 같은 고민을 남겼어: 
        "${formData.dilemma}"
        
        사용자는 현재 [${formData.emotion}] 감정을 느끼고 있으며, 
        특히 [${formData.worry}]를 가장 우려하고 있어.

        다음 3단계 구조로 답변을 작성해줘 (Markdown):
        
        ### 1. 상황 공감
        사용자의 마음을 충분히 위로하고 사용자의 감정(${formData.emotion})을 읽어주며 공감해줘.
        
        ### 2. 다각도 분석
        선택지(화해 vs 유지, 실행 vs 보류 등)에 따른 장단점과 예상되는 시나리오를 균형 있게 분석해줘.
        사용자가 걱정하는 [${formData.worry}] 부분이 실제로 일어날 가능성과 대처법도 포함해줘.
        
        ### 3. 우선순위 가이드
        사용자가 놓치고 있는 핵심 본질이 무엇인지 짚어주고, 
        지금 당장 실천할 수 있는 '작은 첫걸음(Small Step)'을 구체적으로 제안해줘.
        
        답변은 부드러운 경어체를 사용하고, 마지막엔 사용자의 힘이 되는 격언을 하나 인용하며 마무리해줘.
            `;
        } else {
            return NextResponse.json({ error: 'Invalid Category' }, { status: 400 });
        }

        // Helper to perform the fetch
        const performRequest = async (url: string) => {
            return fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: "You are a helpful assistant. Please output in Markdown." },
                        { role: "user", content: prompt }
                    ]
                })
            });
        };

        let response;
        if (accountId && gatewayName && process.env.OPENAI_API_KEY) {
            const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayName}/openai/chat/completions`;
            console.log("Attempting Gateway Request:", gatewayUrl); // Debug log
            response = await performRequest(gatewayUrl);
        } else if (process.env.OPENAI_API_KEY) {
            // Only use direct if Gateway is NOT configured at all
            console.log("Gateway not configured, using direct OpenAI");
            response = await performRequest("https://api.openai.com/v1/chat/completions");
        } else {
            return NextResponse.json({ error: "No API Provider Configured" }, { status: 500 });
        }

        if (response) {
            const data = await response.json();
            if (!response.ok) {
                console.error("OpenAI Error", data);
                return NextResponse.json({ error: "OpenAI Error", details: data }, { status: 500 });
            }
            return NextResponse.json({ result: data.choices[0].message.content, provider: 'OpenAI GPT-4o' });
        }

        return NextResponse.json({ error: "No API Provider Configured" }, { status: 500 });

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
