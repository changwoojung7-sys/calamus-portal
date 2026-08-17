import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    if (!payload.name || !payload.birthdate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const now = new Date();
    const this_year = now.getFullYear();
    const next_year = this_year + 1;

    const system_prompt = `
당신은 현대 명리학과 현대 직무/심리학을 결합한 데이터 기반 라이프 & 커리어 컨설턴트 'Calamus AI Insight Lab'입니다.
전통 명리학의 난해한 한자나 운명론적/미신적인 어조를 완전히 배제하고, 사용자가 실생활과 직장/커리어/자산에 즉각 적용할 수 있는 전략적 인사이트를 제공합니다.

[원칙]
1. 톤앤매너: 전문적이면서도 트렌디하고 세련된 문체 (~해요, ~합니다 체).
2. 현대적 개념 치환:
   - 일간(日干) ➔ 코어 페르소나 (Core Persona)
   - 오행 ➔ 5대 라이프 에너지 (성장/추진, 열정/표현, 안정/중재, 원칙/결단, 지혜/유연성)
   - 십신/격국 ➔ 직무 역량, 생산성, 현금흐름/비즈니스 감각, 조직 리더십, 학습력
3. 지향점: 단순한 길흉화복이 아닌 타고난 기운의 '강점(Superpower)'과 '주의점(Blindspot)'을 짚어주고 구체적인 '행동 가이드(Action Plan)'를 제시합니다.
4. 반드시 유효한 JSON 형식으로만 응답해야 합니다. 마크다운 백틱(\`\`\`json) 없이 순수 JSON 문자열을 출력하세요.

[출력 JSON 스키마]
{
  "persona_summary": {
    "headline": "트렌드를 리드하는 폭풍 실행력의 크리에이티브 디렉터",
    "hash_tags": ["#기획천재", "#폭풍추진력", "#새로운시도", "#디테일장인"],
    "core_nature": "당신은 곧게 뻗어나가는 큰 나무(갑목)와 활발한 표현력(화 기운)이 만나 아이디어를 실현하는 강력한 에너지를 지녔습니다..."
  },
  "career_and_business": {
    "superpower": "트렌드를 빠르게 포착하고 새로운 비즈니스를 기획/런칭하는 감각",
    "blindspot": "마무리 단계에서 디테일을 놓치거나 쉽게 지루함을 느낄 수 있음",
    "fit_roles": ["신사업 기획자", "스타트업 파운더", "크리에이터/개발자", "전략 컨설턴트"],
    "action_guide": "혼자 모든 것을 끝내려 하지 말고, 꼼꼼한 서포터와 협업 체계를 구축하세요."
  },
  "wealth_flow": {
    "money_style": "고정급보다는 본인의 역량과 성과에 따라 확장되는 파이프라인형 자산 구축이 유리합니다.",
    "investment_tip": "단기 변동성 투기보다는 본업의 전문성과 연결된 성장형 자산 또는 시스템에 집중하세요."
  },
  "relationship_and_love": {
    "communication_style": "솔직하고 직관적인 소통을 선호하며, 서로의 성장을 자극하는 동반자 관계에서 시너지가 폭발합니다.",
    "advice": "상대방의 감정적 속도와 다름을 인정하고, 경청의 시간을 의도적으로 확보하세요."
  },
  "mental_and_energy": {
    "energy_battery": "몰입할 때 에너지가 급상승하지만 번아웃 위험이 있으므로 주기적인 디지털 디톡스가 필요합니다.",
    "recharge_tip": "자연 속 산책이나 완전한 휴식을 통한 에너지 리셋"
  },
  "today_action": {
    "daily_vibe": "기획과 실행의 모멘텀이 상승하는 시기",
    "do": "새로운 프로젝트 구상 및 핵심 로드맵 정리",
    "dont": "루틴한 단순 반복 업무에 너무 많은 에너지 소모하기"
  }
}
`.trim();

    const user_prompt = `
[사용자 분석 데이터]
- 이름: ${payload.name}
- 한자 이름: ${payload.name_hanja || '미입력'}
- 성별: ${payload.gender}
- 기준 연도: ${this_year}년 ~ ${next_year}년
- 일간(Core Persona): ${payload.dayMasterKorean || '갑목'}
- 오행 에너지 비율: ${JSON.stringify(payload.elementsPercent || { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 })}
- 최다 우세 에너지: ${payload.dominantElementName || '목(木)'}
- 생년월일시: ${payload.birthdate} ${payload.birthtime || '(시간 모름)'}
${payload.followup ? `\n[사용자 특별 고민/질문]\n${payload.followup}` : ''}

위 데이터를 바탕으로 지정된 JSON 스키마에 맞추어 현대 직장인·MZ 관점의 퍼스널 리포트를 작성해 주세요.
`.trim();

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const gatewayName = process.env.CLOUDFLARE_GATEWAY_NAME || 'calamus-ai-gateway';
    const openAiKey = process.env.OPENAI_API_KEY;

    const body = JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: system_prompt },
        { role: 'user', content: user_prompt },
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
      // API Key가 없을 경우 데모 목업 데이터 반환
      return NextResponse.json({
        success: true,
        report: {
          persona_summary: {
            headline: '트렌드를 선도하는 전략적 혁신가 & 솔루션 아키텍트',
            hash_tags: ['#전략기획', '#스피드실행', '#퍼스널브랜딩', '#디테일추진력'],
            core_nature: `${payload.name}님은 타고난 ${payload.dayMasterKorean || '목(木)'}의 추진력과 균형 잡힌 에너지로 남들이 보지 못하는 인사이트를 발굴하고 현실화하는 탁월한 능력을 지녔습니다.`,
          },
          career_and_business: {
            superpower: '복잡한 구조를 단숨에 파악하고 명확한 비즈니스 프레임워크로 전환하는 능력',
            blindspot: '너무 많은 기회를 동시에 추진하여 에너지가 분산될 수 있음',
            fit_roles: ['신사업 총괄 PM', '스타트업 빌더', '데이터 기반 크리에이터', '전략 컨설턴트'],
            action_guide: '우선순위 Top 3를 명확히 하고, 실행 과정에서 단계별 마일스톤을 동료와 공유하세요.',
          },
          wealth_flow: {
            money_style: '단순 노동소득보다 시스템과 지적재산권, 파이프라인에서 오는 자산 증식이 유리합니다.',
            investment_tip: '자신의 도메인 지식과 직결된 분야에 장기적으로 집중 투자하는 것이 최적의 전략입니다.',
          },
          relationship_and_love: {
            communication_style: '상호 존중과 명확한 피드백을 중시하며, 지적으로 자극을 주고받는 관계를 선호합니다.',
            advice: '결론 중심 대화도 좋지만, 가끔은 과정에 대한 공감과 지지를 먼저 표현해보세요.',
          },
          mental_and_energy: {
            energy_battery: '성취감이 높을 때 활력이 솟지만 완벽주의로 인한 피로를 경계해야 합니다.',
            recharge_tip: '자연 친화적 공간에서의 오프라인 산책 및 명상',
          },
          today_action: {
            daily_vibe: '새로운 기획과 네트워킹의 모멘텀이 극대화되는 시기',
            do: '미뤄왔던 중요한 의사결정 마무리 및 핵심 아이디어 문서화',
            dont: '지나친 디테일에 얽매여 런칭 시점 지연시키기',
          },
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
    console.error('Saju API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
