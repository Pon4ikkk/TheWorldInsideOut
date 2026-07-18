// ============= Світ Навиворіт • interactions =============

// --- Mobile nav
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-burger]")) {
    document.querySelector(".nav-links")?.classList.toggle("open");
  } else if (!e.target.closest(".nav-links")) {
    document.querySelector(".nav-links")?.classList.remove("open");
  }
});

// --- Active link
(function markActive() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
})();

// --- Header scroll state
(function headerScroll() {
  const h = document.querySelector(".site-header");
  if (!h) return;
  const onScroll = () => h.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// --- Reveal on scroll
(function reveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  els.forEach((el) => io.observe(el));
})();

// --- Countries grid
(function renderCountriesGrid() {
  const grid = document.getElementById("countries-grid");
  if (!grid || !window.COUNTRIES) return;
  grid.innerHTML = window.COUNTRIES.map((c, i) => `
    <a class="card reveal ${["d1","d2","d3","d4"][i%4]}" href="country.html?slug=${c.slug}">
      <span class="card-index">№ ${String(i+1).padStart(2,"0")}</span>
      <div class="card-img"><img src="${c.image}" alt="${c.name}" loading="lazy"></div>
      <div class="card-body">
        <h3 class="card-title"><span class="flag">${c.flag}</span> ${c.name}</h3>
        <p>${c.short}</p>
        <span class="card-link">Дивитись експедицію</span>
      </div>
    </a>
  `).join("");
  // Re-observe newly created reveals
  document.querySelectorAll("#countries-grid .reveal").forEach((el) => {
    const io = new IntersectionObserver(([e], o) => {
      if (e.isIntersecting) { e.target.classList.add("in"); o.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
  });
})();

// --- Country page
(function renderCountryPage() {
  const root = document.getElementById("country-root");
  if (!root || !window.COUNTRIES) return;
  const slug = new URLSearchParams(location.search).get("slug");
  const c = window.COUNTRIES.find((x) => x.slug === slug);
  if (!c) {
    root.innerHTML = `<section class="section"><div class="container" style="text-align:center;padding:80px 0;">
      <div class="eyebrow" style="justify-content:center;">404</div>
      <h1 style="font-size:clamp(2rem,5vw,3.5rem);margin:20px 0;">Країну не знайдено</h1>
      <p style="color:var(--muted);margin-bottom:30px;">Схоже, такої експедиції ще немає у нашому архіві.</p>
      <a class="btn btn-primary" href="countries.html">До списку країн</a>
    </div></section>`;
    return;
  }
  document.title = `${c.name} — Світ Навиворіт`;
  root.innerHTML = `
    <section class="country-hero">
      <div class="country-hero-bg" style="background-image:url('${c.image}')"></div>
      <div class="container">
        <a class="back-link" href="countries.html">Усі країни</a>
        <div class="eyebrow" style="margin-bottom:20px;">Експедиція ${c.flag}</div>
        <h1>${c.name}</h1>
        <p class="lede">${c.short}</p>
      </div>
    </section>
    <div class="container country-detail-wrap">
      <article class="country-body">
        ${c.description.map((p) => `<p>${p}</p>`).join("")}
        ${c.highlights ? `<h3 class="country-h3">Що побачила команда</h3><ul class="country-highlights">${c.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>` : ""}
        ${c.fact ? `<div class="country-fact"><strong>Цікавий факт</strong>${c.fact}</div>` : ""}
      </article>
      <aside class="country-info">
        <h3 class="country-h3">Короткі відомості</h3>
        <dl class="info-list">
          <dt>Столиця</dt><dd>${c.capital || "—"}</dd>
          <dt>Мова</dt><dd>${c.language || "—"}</dd>
          <dt>Валюта</dt><dd>${c.currency || "—"}</dd>
          <dt>Населення</dt><dd>${c.population || "—"}</dd>
          <dt>Найкращий час</dt><dd>${c.bestTime || "—"}</dd>
          <dt>Випусків</dt><dd>${c.episodes || "—"}</dd>
        </dl>
      </aside>
    </div>
  `;
})();
