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
  menu?.addEventListener("click", (e) => { if(e.target === menu) closeMenu(); });
  document.querySelectorAll(".mnav").forEach(a => a.addEventListener("click", closeMenu));

  // ===== What We Buy Slider (AUTO + LOOP, MOVES BY 2) =====
  const track = document.getElementById("wwbTrack");
  const prevBtn = document.getElementById("wwbPrev");
  const nextBtn = document.getElementById("wwbNext");
  const dotsWrap = document.getElementById("wwbDots");

  if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

  const cards = Array.from(track.querySelectorAll(".wwb-card"));
  const AUTO_DELAY = 4500; // every few seconds
  let index = 0;
  let autoTimer;

  function cardsPerView() {
    const w = window.innerWidth;
    if (w <= 520) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  // Move 2 at a time on desktop/tablet, 1 at a time on mobile
  function stepSize() {
    return (cardsPerView() === 1) ? 1 : 2;
  }

  // Last valid starting index so we never leave blank space
  function maxIndex() {
    return Math.max(0, cards.length - cardsPerView());
  }

  // Your CSS uses 16px gap; compute real step size in pixels so 3 cards stay perfectly aligned
  function cardStepPx() {
    if (!cards.length) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return cards[0].offsetWidth + gap;
  }

  function buildDots() {
    dotsWrap.innerHTML = "";
    const step = stepSize();
    const pages = Math.max(1, Math.ceil(cards.length / step));

    for (let i = 0; i < pages; i++) {
      const dot = document.createElement("button");
      dot.className = "wwb-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => {
        index = Math.min(i * step, maxIndex());
        update();
        resetAuto();
      });
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = Array.from(dotsWrap.querySelectorAll(".wwb-dot"));
    const step = stepSize();
    const current = Math.floor(index / step);
    dots.forEach((d, i) => d.setAttribute("aria-current", i === current ? "true" : "false"));
  }

  function updateButtons() {
    // Since we're looping, buttons are always enabled
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    prevBtn.style.opacity = "1";
    nextBtn.style.opacity = "1";
  }

  function update() {
    const step = stepSize();
    const px = cardStepPx();

    // Clamp index to valid range
    index = Math.min(Math.max(index, 0), maxIndex());

    track.style.transform = `translateX(-${index * px}px)`;
    updateDots();
    updateButtons();
  }

  function moveNext() {
    const step = stepSize();
    index += step;

    // Loop back to start once we've reached the end
    if (index > maxIndex()) index = 0;

    update();
  }

  function movePrev() {
    const step = stepSize();
    index -= step;

    // Loop to the end if we go before start
    if (index < 0) index = maxIndex();

    update();
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(moveNext, AUTO_DELAY);
  }

  function resetAuto() {
    startAuto();
  }

  prevBtn.addEventListener("click", () => {
    movePrev();
    resetAuto();
  });

  nextBtn.addEventListener("click", () => {
    moveNext();
    resetAuto();
  });

  window.addEventListener("resize", () => {
    // On resize, rebuild dots because step size / per view can change
    index = 0;
    buildDots();
    update();
    startAuto();
  });

  // Init
  buildDots();
  update();
  startAuto();
});
