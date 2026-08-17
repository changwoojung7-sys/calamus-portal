import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { question, cards, spread, questionType, birthInfo } = await req.json();

    const cardsStr = (cards || [])
      .map((c: any, i: number) => {
        return `${i + 1}. [${c.position_label || `${i + 1}번째`}]: ${c.name_kr} (${c.name_en}) - ${c.is_reversed ? '역방향' : '정방향'}`;
      })
      .join('\n');

    const systemPrompt = `
당신은 직관적 영감과 심리학적 코칭을 결합한 대한민국 최고의 현대적 타로 마스터 'Calamus Tarot AI'입니다.
공포심이나 비합리적인 미신/운명론적 예언을 완전히 배제하고, 질문자가 상황을 주도적으로 해결할 수 있는 심리적 통찰과 실천 가능한 구체적 전략을 제시합니다.

[원칙]
1. 친절하면서도 신비롭고 세련된 현대적 어조 (~해요, ~합니다).
2. 카드 간의 유기적인 서사(스토리라인)를 엮어서 설명합니다.
3. 반드시 유효한 JSON 형식으로만 응답하세요. 마크다운 백틱(\`\`\`json) 없이 순수 JSON 문자열만 출력하세요.

[출력 JSON 스키마]
{
  "archetype_card": {
    "headline": "내면의 어둠을 뚫고 새로운 질서를 창조하는 새벽의 개척자",
    "hash_tags": ["#새로운돌파구", "#내면의확신", "#실행의모멘텀"],
    "key_message": "지금 마주한 혼란은 실패가 아니라 새로운 도약을 위한 재정렬 과정입니다..."
  },
  "storyline": "과거의 미숙함(The Fool)을 거쳐 현재 묵묵히 기량을 갈고닦는 단계(8 of Pentacles)에 와 있으며, 미래에는 밝은 희망과 회복(The Star)이 당신을 기다리고 있습니다.",
  "card_analyses": [
    {
      "position": "과거/배경",
      "card_name": "The Fool",
      "orientation": "정방향",
      "interpretation": "두려움 없이 새로운 시작을 열었던 순수한 열정이 현재 당신의 기본 동력이 되고 있습니다."
    }
  ],
  "psychological_insight": {
    "hurdle": "완벽하게 통제하려는 강박으로 인한 에너지 소모",
    "superpower": "어떤 상황에서도 새로운 해결책을 찾아내는 유연한 발상"
  },
  "action_plans": [
    "불필요한 타인의 의견을 차단하고, 이번 주 우선순위 1가지만 전력 투구하기",
    "결과에 대한 불안이 엄습할 때 10분간 상황을 객관적으로 기록하고 마인드셋 재정렬하기"
  ],
  "saju_hybrid_vibe": "오늘 당신의 기운은 불(火)의 추진력과 완드(Wands) 카드가 만나 생각한 바를 행동으로 옮기기에 최적의 날입니다."
}
`.trim();

    const userPrompt = `
[타로 리딩 요청]
- 질문 카테고리: ${questionType || '종합 운세'}
- 질문 내용: ${question || '현재 나의 운과 나아가야 할 방향'}
- 배열법: ${spread}장 스프레드
${birthInfo ? `- 사용자 사주/생년월일 정보: ${birthInfo}` : ''}

[뽑힌 카드 목록]
${cardsStr}

위 카드의 상징과 질문의 맥락을 결합하여 지정된 JSON 스키마 형식으로 깊이 있는 리딩 리포트를 작성해주세요.
`.trim();

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const gatewayName = process.env.CLOUDFLARE_GATEWAY_NAME || 'calamus-ai-gateway';
    const openAiKey = process.env.OPENAI_API_KEY;

    const body = JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    let rawContent = '';

    if (accountId && gatewayName && openAiKey) {
      const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayName}/openai/chat/completions`;
      const response = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      rawContent = data.choices[0].message.content;
    } else if (openAiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      rawContent = data.choices[0].message.content;
    } else {
      // 데모 목업
      return NextResponse.json({
        success: true,
        report: {
          archetype_card: {
            headline: '어둠을 뚫고 지혜의 등불을 밝히는 통찰의 가이드',
            hash_tags: ['#내면의평화', '#행운의돌파구', '#직관적성공'],
            key_message: '스스로의 직관과 잠재력을 믿으세요. 카드들은 당신이 올바른 방향으로 나아가고 있음을 증명하고 있습니다.',
          },
          storyline: '혼란과 준비 단계를 지나, 명확한 목표와 내면의 확신이 일치하는 최고의 타이밍에 도달하고 있습니다.',
          card_analyses: (cards || []).map((c: any) => ({
            position: c.position_label || '흐름',
            card_name: c.name_kr,
            orientation: c.is_reversed ? '역방향' : '정방향',
            interpretation: `${c.name_kr}의 상징은 당신의 현재 상황에 중요한 전환점과 숨은 기회를 암시합니다.`,
          })),
          psychological_insight: {
            hurdle: '타인의 시선이나 지나친 조급함으로 인한 심리적 압박감',
            superpower: '스스로의 중심을 지키며 본질에 집중할 때 발휘되는 흔들리지 않는 멘탈',
          },
          action_plans: [
            '이번 주에는 가장 핵심적인 결정 하나에만 집중하고 주변의 잡음 차단하기',
            '매일 아침 5분간 오늘의 목표를 시각화하고 긍정적인 자기 확언 하기',
          ],
          saju_hybrid_vibe: '오늘 당신의 오행 기운과 타로 카드가 조화를 이루어, 시작하는 모든 일에 강력한 지지와 행운이 따르는 흐름입니다.',
        },
      });
    }

    try {
      const parsed = JSON.parse(rawContent);
      return NextResponse.json({ success: true, report: parsed });
    } catch {
      return NextResponse.json({ success: true, raw: rawContent });
    }
  } catch (error: any) {
    console.error('Tarot API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
