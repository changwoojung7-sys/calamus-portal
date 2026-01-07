// 서비스 상태 체크 (기존 코드)
document.querySelectorAll(".service-card[data-url]").forEach(async (card) => {
  const url = card.dataset.url;
  const badge = card.querySelector(".status");
  if (!badge) return;

  try {
    await fetch(url, { mode: "no-cors" });
    badge.textContent = "운영중";
    badge.className = "status live";
    card.href = url;
  } catch {
    badge.textContent = "준비중";
    badge.className = "status off";
    card.removeAttribute("href");
  }
});

// 오늘의 한 문장 (Local Only)
const dailyTextEl = document.querySelector(".daily-text");

// 30개의 명언 리스트
const quotes = [
  "삶의 파도가 거세더라도, 당신 안에는 어떤 폭풍도 잠재울 수 있는 고요한 심지가 있습니다.<br>그 내면의 빛을 믿고 흔들림 없이 나아가세요.",
  "오늘의 선택이 모여 내일의 당신을 만듭니다.<br>가장 나답다고 느껴지는 길을 선택하세요.",
  "서두를 필요 없습니다. 방향만 잃지 않는다면<br>당신은 이미 목적지를 향해 가고 있는 중입니다.",
  "복잡한 생각이 마음을 어지럽힐 땐 단순함으로 돌아가세요.<br>가장 중요한 한 가지에만 집중해보는 하루는 어떨까요?",
  "당신의 직관은 생각보다 현명합니다.<br>오늘은 논리보다 마음의 소리에 귀 기울여보세요.",
  "실수해도 괜찮습니다. 그것은 당신이 노력하고 있다는 증거니까요.<br>자신을 조금 더 너그럽게 바라봐 주세요.",
  "모든 꽃이 동시에 피지 않듯, 당신의 시간도 반드시 찾아옵니다.<br>조급해하지 말고 당신만의 계절을 기다리세요.",
  "행복은 거창한 것이 아닙니다. 따뜻한 햇살, 맛있는 커피 한 잔...<br>지금 이 순간의 작은 기쁨을 놓치지 마세요.",
  "당신은 충분히 잘하고 있습니다. <br>남들의 속도에 맞추지 말고 당신만의 리듬을 유지하세요.",
  "오늘 하루, 완벽하지 않아도 좋습니다.<br>그저 당신이 온전히 존재하는 것만으로도 충분히 가치 있는 날입니다.",
  "변화는 두렵지만, 그 너머에는 새로운 가능성이 기다리고 있습니다.<br>용기 내어 작은 한 걸음을 내디뎌 보세요.",
  "지친 마음에는 휴식이 약입니다.<br>잠시 멈춰 서서 깊은 숨을 내쉬고 마음을 돌보는 시간을 가지세요.",
  "감사는 삶을 풍요롭게 만드는 마법입니다.<br>오늘 당연하게 여겼던 것들에 대해 감사의 마음을 가져보세요.",
  "당신의 미소는 누군가에게 큰 힘이 됩니다.<br>오늘 만나는 사람들에게 따뜻한 미소를 선물해 보세요.",
  "어둠이 깊을수록 별은 더 밝게 빛납니다.<br>지금의 힘든 시간도 당신을 더욱 빛나게 할 밑거름이 될 것입니다.",
  "비교는 기쁨을 앗아가는 도둑입니다.<br>어제의 나보다 조금 더 성장한 오늘의 나에게 집중하세요.",
  "말 한마디가 천 냥 빚을 갚습니다.<br>나 자신에게, 그리고 타인에게 따뜻한 말을 건네는 하루가 되세요.",
  "시작이 반입니다. 망설이고 있는 일이 있다면<br>작은 것부터 가볍게 시작해 보세요.",
  "꾸준함이 답입니다. 포기하지 않고 묵묵히 나아가는 발걸음이<br>결국 당신을 원하는 곳으로 데려다줄 것입니다.",
  "당신은 사랑받기 위해 태어난 사람입니다.<br>오늘 하루, 그 누구보다 당신 스스로를 많이 아껴주고 사랑해 주세요.",
  "걱정은 내일의 슬픔을 덜어주지 않고, 오늘의 힘만 앗아갑니다.<br>일어나지 않은 일에 대한 걱정은 내려놓고 현재에 충실하세요.",
  "긍정적인 생각은 긍정적인 결과를 불러옵니다.<br>할 수 있다는 믿음으로 오늘 하루를 활기차게 시작해 보세요.",
  "실패는 성공으로 가는 과정일 뿐입니다.<br>넘어지는 것을 두려워하지 말고 툭 털고 다시 일어나세요.",
  "진정한 아름다움은 내면에서 우러나옵니다.<br>겉모습보다는 마음을 가꾸는 데 시간을 투자해 보세요.",
  "친절은 결코 헛되지 않습니다.<br>당신의 작은 배려가 세상을 조금 더 따뜻하게 만들 수 있습니다.",
  "꿈을 꾸는 데 늦은 때란 없습니다.<br>가슴 설레는 일이 있다면 지금 바로 도전해 보세요.",
  "인생은 속도가 아니라 방향입니다.<br>잠시 멈춰 서서 내가 가고 있는 길이 맞는지 점검해 보세요.",
  "당신은 혼자가 아닙니다. 주변을 둘러보면<br>당신을 응원하고 지지하는 사람들이 반드시 있습니다.",
  "오늘 하루도 수고 많으셨습니다.<br>편안한 밤 보내시고 내일은 더 행복한 하루가 되기를 바랍니다.",
  "희망은 잠들지 않는 꿈입니다.<br>어떤 상황에서도 희망의 끈을 놓지 마세요."
];

function showRandomQuote() {
  if (!dailyTextEl) return;

  // 랜덤 선택 (단, 직전과 같은 문장이면 다시 뽑기)
  let nextIndex = Math.floor(Math.random() * quotes.length);
  const lastIndex = parseInt(sessionStorage.getItem("lastQuoteIndex") || "-1");

  if (quotes.length > 1) {
    // 최대 5번 시도하여 중복 피하기
    let attempts = 0;
    while (nextIndex === lastIndex && attempts < 5) {
      nextIndex = Math.floor(Math.random() * quotes.length);
      attempts++;
    }
  }

  sessionStorage.setItem("lastQuoteIndex", nextIndex);

  // 페이드 효과 (선택 사항)
  dailyTextEl.style.opacity = 0;
  setTimeout(() => {
    dailyTextEl.innerHTML = quotes[nextIndex];
    dailyTextEl.style.opacity = 1;
  }, 200);
}

// 초기 로드 및 이벤트 바인딩
document.addEventListener("DOMContentLoaded", () => {
  // CSS에 transition 추가 (부드러운 전환을 위해)
  if (dailyTextEl) {
    dailyTextEl.style.transition = "opacity 0.3s ease";
  }

  showRandomQuote();

  const refreshBtn = document.getElementById("refreshBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      showRandomQuote();
    });
  }
});
