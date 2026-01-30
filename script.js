// Footer year
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  const openBtn = document.getElementById("openMenu");
  const closeBtn = document.getElementById("closeMenu");
  const menu = document.getElementById("mobileMenu");

  function openMenu(){
    if (!menu) return;
    menu.style.display = "block";
    menu.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function closeMenu(){
    if (!menu) return;
    menu.style.display = "none";
    menu.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }

  openBtn?.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", closeMenu);
  menu?.addEventListener("click", (e) => { if (e.target === menu) closeMenu(); });
  document.querySelectorAll(".mnav").forEach(a => a.addEventListener("click", closeMenu));

  // What We Buy Slider
  const track = document.getElementById("wwbTrack");
  const prevBtn = document.getElementById("wwbPrev");
  const nextBtn = document.getElementById("wwbNext");
  const dotsWrap = document.getElementById("wwbDots");

  if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

  const cards = Array.from(track.querySelectorAll(".wwb-card"));
  let page = 0;

  function cardsPerView() {
    const w = window.innerWidth;
    if (w <= 520) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function pageCount() {
    return Math.max(1, Math.ceil(cards.length / cardsPerView()));
  }

  function buildDots() {
    dotsWrap.innerHTML = "";
    const count = pageCount();

    for (let i = 0; i < count; i++) {
      const b = document.createElement("button");
      b.className = "wwb-dot";
      b.type = "button";
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.addEventListener("click", () => {
        page = i;
        update();
      });
      dotsWrap.appendChild(b);
    }
  }

  function updateDots() {
    const dots = Array.from(dotsWrap.querySelectorAll(".wwb-dot"));
    dots.forEach((d, i) => d.setAttribute("aria-current", i === page ? "true" : "false"));
  }

  function updateButtons() {
    const count = pageCount();
    prevBtn.disabled = page <= 0;
    nextBtn.disabled = page >= count - 1;
    prevBtn.style.opacity = prevBtn.disabled ? "0.55" : "1";
    nextBtn.style.opacity = nextBtn.disabled ? "0.55" : "1";
  }

  function update() {
    const count = pageCount();
    page = Math.min(Math.max(page, 0), count - 1);
    const shiftPct = page * 100;
    track.style.transform = `translateX(-${shiftPct}%)`;
    updateDots();
    updateButtons();
  }

  function normalize() {
    const count = pageCount();
    track.style.width = `${count * 100}%`;
    buildDots();
    update();
  }

  prevBtn.addEventListener("click", () => { page--; update(); });
  nextBtn.addEventListener("click", () => { page++; update(); });
  window.addEventListener("resize", normalize);

  normalize();
});
