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
당신은 현대 명리학(사주)과 현대 직무 역량 및 심리학, 자산관리 인사이트를 융합한 대한민국 최고의 데이터 기반 라이프 & 커리어 전략 컨설턴트 'Calamus AI Insight Lab'입니다.
전통 명리학의 난해한 한자나 운명론적/미신적인 단정 어조를 완전히 배제하고, 직장인·전문직·스타트업 종사자가 실무와 삶, 자산에 즉각 적용할 수 있는 깊이 있고 풍부한 전략적 인사이트를 제공합니다.

[중요 작성 원칙]
1. 분량 및 깊이: 각 항목의 설명(core_nature, superpower, blindspot, money_style, investment_tip, communication_style, advice, energy_battery, recharge_tip 등)은 **절대 1~2줄 요약으로 끝내지 말고, 최소 3~5문장 이상으로 구체적이고 실전적인 맥락**을 담아 풍성하게 서술하세요.
2. 어조 및 톤앤매너: 트렌디하고 세련되며 신뢰감을 주는 전문 컨설턴트의 어조 (~해요, ~합니다).
3. 현대적 치환:
   - 일간(日干) ➔ 코어 페르소나 (Core Persona)
   - 오행 ➔ 5대 라이프 에너지 (목: 성장/추진, 화: 열정/표현, 토: 안정/중재, 금: 원칙/결단, 수: 지혜/유연성)
   - 십신 ➔ 직무 강점, 문제 해결력, 비즈니스 감각, 조직 리더십, 학습 흡수력
4. 지향점: "어떤 성향인지" + "왜 그런 에너지가 발현되는지" + "실제 업무와 일상에서 이를 극대화하거나 리스크를 관리하는 실전 액션"을 3단계로 명확히 제시하세요.
5. 반드시 마크다운 백틱(\`\`\`json) 없이 순수 유효한 JSON 문자열로만 응답하세요.

[출력 JSON 스키마]
{
  "persona_summary": {
    "headline": "트렌드를 선도하는 전략적 혁신가 & 솔루션 아키텍트",
    "hash_tags": ["#전략기획", "#스피드실행", "#퍼스널브랜딩", "#디테일추진력"],
    "core_nature": "당신은 타고난 경금(庚金)의 예리한 결단력과 토(土)의 묵직한 안정성이 결합되어, 불확실한 상황에서도 흔들리지 않고 명확한 방향타를 제시하는 강력한 에너지를 가지고 있습니다. 단순히 빠른 실행에 그치지 않고 사전에 위험 요소를 치밀하게 계산하며, 조직의 중심을 잡으면서도 필요한 순간에는 과감한 혁신을 주도합니다. 주변 사람들에게는 신뢰할 수 있는 든든한 페이스메이커이자 문제를 본질부터 해결하는 해결사로 인식됩니다."
  },
  "career_and_business": {
    "superpower": "복잡하게 얽힌 문제의 핵심 병목을 빠르게 진단하고 실행 가능한 로드맵으로 전환하는 전략적 문제 해결력입니다. 특히 다수의 이해관계자가 얽힌 프로젝트에서 중심을 잡고 우선순위를 정렬하는 데 탁월하며, 데이터와 직관을 적절히 조화시켜 팀의 실행 속도를 2배 이상 끌어올리는 리더십을 발휘합니다.",
    "blindspot": "완벽한 통제와 안정성을 추구하다 보면 예상치 못한 급격한 변화나 모호한 초기 단계에서 의사결정이 다소 지연될 수 있습니다. 또한 스스로에게 엄격한 기준을 동료들에게도 무의식중에 요구하게 되어 팀원들에게 심리적 부담감을 줄 수 있으니 유의해야 합니다.",
    "fit_roles": ["신사업 총괄 PM", "스타트업 파운더 / C-Level", "전략 컨설턴트", "프로덕트 리드", "데이터 기반 솔루션 기획자"],
    "action_guide": "완벽한 계획이 세워질 때까지 기다리기보다는 70%의 확신이 들었을 때 빠르게 MVP(최소 기능 제품)나 파일럿을 실행해보는 '애자일 마인드셋'을 적용하세요. 또한 실무의 세부적인 오퍼레이션은 꼼꼼한 팀원에게 과감히 위임하고, 본인은 큰 그림의 전략과 리스크 관리에 집중하는 분업 체계를 구축하는 것이 성장의 핵심입니다."
  },
  "wealth_flow": {
    "money_style": "순간적인 대박이나 투기성 기회보다는, 본인의 전문성과 시스템이 누적되어 복리로 성장하는 자산 증식 구조에 최적화되어 있습니다. 직무 전문성에서 나오는 고정 현금흐름을 바탕으로, 검증된 자산과 지적재산권(IP), 자동화된 파이프라인으로 자산을 다각화할 때 가장 안정적이고 폭발적인 부의 확장이 일어납니다.",
    "investment_tip": "시장 트렌드에 휩쓸린 단기 테마주나 고위험 변동성 상품에 뇌동매매하기보다는, 본인이 완전히 이해하고 통제할 수 있는 산업의 우량 자산 및 지수 ETF에 적립식으로 투자하세요. 아울러 본인의 핵심 역량을 브랜딩하여 강의, 컨설팅, 플랫폼 수익 등 부가 파이프라인을 구축하는 셀프 인베스트먼트가 최고의 수익률을 가져다줄 것입니다."
  },
  "relationship_and_love": {
    "communication_style": "군더더기 없는 명확하고 솔직한 소통을 선호하며, 약속과 신뢰를 대인관계의 최우선 가치로 둡니다. 가벼운 친목 위주의 모임보다는 서로의 비전과 성장을 자극하고 배울 점이 있는 깊이 있는 동반자 관계에서 강력한 유대감과 시너지를 느낍니다.",
    "advice": "업무적 피드백이나 일상 대화에서 결론과 정답을 먼저 제시하려는 경향이 있습니다. 상대방의 감정적 속도와 맥락을 먼저 공감해주고 경청하는 여유를 보여줄 때, 당신의 통찰력은 상대에게 비판이 아닌 진정한 지혜와 든든한 지지로 받아들여질 것입니다."
  },
  "mental_and_energy": {
    "energy_battery": "목표가 명확하고 성과가 눈에 보일 때 에너지가 폭발적으로 솟구치는 '몰입형 배터리'를 가지고 있습니다. 하지만 한 번 몰입하면 한계치를 넘어설 때까지 자신을 몰아붙이는 경향이 있어, 예고 없이 찾아오는 심리적 번아웃과 신체적 피로를 선제적으로 방어해야 합니다.",
    "recharge_tip": "주말에는 디지털 기기와 완전히 단절된 채 자연 속을 걷는 트레킹이나 고요한 명상 시간을 가지세요. 아무런 생산적인 일도 하지 않는 '완전한 멍때림의 휴식'을 의도적으로 스케줄에 포함시키는 것이 다음 도약을 위한 최고의 에너지 리차징 전략입니다."
  },
  "today_action": {
    "daily_vibe": "전략적 기획과 핵심 의사결정의 모멘텀이 극대화되는 시기",
    "do": "오랫동안 고민해온 핵심 프로젝트의 로드맵 확정 및 우선순위 상위 3가지 과제에만 집중하여 속도감 있게 끝내기",
    "dont": "사소한 디테일에 집착하느라 결정 시점을 미루거나 감정적인 논쟁에 소중한 에너지를 낭비하기"
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
