// 서비스 상태 체크 (기존 코드)
document.querySelectorAll(".service-card[data-url]").forEach(async (card) => {
  const url = card.dataset.url;
  const badge = card.querySelector(".status");
  if (!badge) return; // 배치 없는 로직 에러 방지

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

// 오늘의 한 문장 (Daily Word) 로직
const dailyTextEl = document.querySelector(".daily-text"); // 클래스 선택자로 변경
// portal의 경우 버튼들이 없을 수도 있으므로 optional chaining 사용
// 현재 index.html 디자인에는 버튼이 없지만, 추후 추가될 수 있거나 로직 보존을 위해 남겨둠.
// 단, 현재 UI에는 버튼이 없으므로 selector가 null일 수 있음을 유의.

function todayKey() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

async function loadDaily(force = false) {
  if (!dailyTextEl) return;

  const cached = JSON.parse(localStorage.getItem("daily") || "null");

  if (!force && cached && cached.date === todayKey()) {
    dailyTextEl.innerHTML = cached.text.replace(/\n/g, "<br>"); // 줄바꿈 반영
    return;
  }

  dailyTextEl.textContent = "오늘의 문장을 불러오는 중…";

  try {
    const res = await fetch("/api/dailyai", { method: "GET" });

    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }

    const data = await res.json();
    if (!data.result) throw new Error("Invalid API response");

    localStorage.setItem(
      "daily",
      JSON.stringify({ date: todayKey(), text: data.result })
    );

    dailyTextEl.innerHTML = data.result.replace(/\n/g, "<br>");
  } catch (err) {
    console.error(err);

    // ⚠️ API 호출 실패 시 (429, 500 등) 예비 문구 보여주기
    const backupQuotes = [
      "삶의 파도가 거세더라도, 당신 안에는 어떤 폭풍도 잠재울 수 있는 고요한 심지가 있습니다.<br>그 내면의 빛을 믿고 흔들림 없이 나아가세요.",
      "오늘의 선택이 모여 내일의 당신을 만듭니다.<br>가장 나답다고 느껴지는 길을 선택하세요.",
      "서두를 필요 없습니다. 방향만 잃지 않는다면<br>당신은 이미 목적지를 향해 가고 있는 중입니다.",
      "복잡한 생각이 마음을 어지럽힐 땐 단순함으로 돌아가세요.<br>가장 중요한 한 가지에만 집중해보는 하루는 어떨까요?",
      "당신의 직관은 생각보다 현명합니다.<br>오늘은 논리보다 마음의 소리에 귀 기울여보세요."
    ];

    // 랜덤으로 하나 선택
    const fallback = backupQuotes[Math.floor(Math.random() * backupQuotes.length)];

    dailyTextEl.innerHTML = fallback;

    // (선택사항) 에러라고 굳이 알리지 않거나, 작게 표시
    // dailyTextEl.textContent += "\n(현재 AI 접속량이 많아 예비 문장이 표시되었습니다)";
  }
}

// 초기 로드 및 이벤트 바인딩
document.addEventListener("DOMContentLoaded", () => {
  loadDaily(false);

  const refreshBtn = document.getElementById("refreshBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      // 강제 새로고침이므로 force=true
      loadDaily(true);
    });
  }
});
