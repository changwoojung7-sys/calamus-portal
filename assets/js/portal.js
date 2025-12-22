document.querySelectorAll(".service-card[data-url]").forEach(async (card) => {
  const url = card.dataset.url;
  const badge = card.querySelector(".status");

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
