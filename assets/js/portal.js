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
    // API 실패 시 기본 메시지 혹은 캐시된 이전 메시지 노출? 
    // 여기서는 실패 메시지 노출
    dailyTextEl.textContent =
      "오늘의 문장을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
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
