/* ===== Asyraf Razali: home page scripts =====
   1. Live Kuala Lumpur clock
   2. Experience filter (All / Work / University) */

function attempt(fn) { try { fn(); } catch (e) { if (window.console) { console.error(e); } } }

/* ---------- 1. Kuala Lumpur clock ---------- */
attempt(function () {
  var box = document.getElementById("klTime");
  if (!box) { return; }
  function tick() {
    box.textContent = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kuala_Lumpur", hour12: false });
  }
  tick();
  setInterval(tick, 1000);
});

/* ---------- 2. Experience filter ---------- */
attempt(function () {
  var list = document.getElementById("ledger");
  if (!list) { return; }
  var rows = list.querySelectorAll("li");
  var btns = document.querySelectorAll(".flt");
  var note = document.getElementById("ledgerCount");

  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-filter"), shown = 0;
      btns.forEach(function (x) {
        var on = x === b;
        x.classList.toggle("on", on);
        x.setAttribute("aria-pressed", on ? "true" : "false");
      });
      rows.forEach(function (li) {
        var ok = f === "all" || li.getAttribute("data-type") === f;
        li.hidden = !ok;
        if (ok) { shown++; }
      });
      if (note) { note.textContent = shown + " of " + rows.length; }
    });
  });
});

/* ---------- 3. Viewfinder (candid photo slideshow with shutter effect) ---------- */
attempt(function () {
  var box = document.getElementById("finder");
  if (!box) { return; }
  var frame = box.querySelector(".finder-frame");
  var slides = box.querySelectorAll(".finder-slide");
  var capEl = document.getElementById("finderCap");
  var noEl = document.getElementById("frameNo");
  var recEl = document.getElementById("recTime");
  var flash = box.querySelector(".flash");
  var focus = box.querySelector(".focus");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var i = 0, timer = null;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function go(n, effects) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle("on", k === i); });
    if (capEl) { capEl.innerHTML = slides[i].getAttribute("data-cap"); }
    if (noEl) { noEl.textContent = "Frame " + pad(i + 1) + " / " + pad(slides.length); }
    if (effects && !reduce) {
      [flash, focus].forEach(function (el, k) {
        if (!el) { return; }
        var cls = k === 0 ? "go" : "lock";
        el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
      });
    }
  }
  function start() { clearInterval(timer); if (!reduce) { timer = setInterval(function () { go(i + 1, true); }, 4500); } }

  frame.addEventListener("click", function () { go(i + 1, true); start(); });
  frame.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { go(i + 1, true); start(); }
    if (e.key === "ArrowLeft") { go(i - 1, true); start(); }
  });
  document.getElementById("finderNext").addEventListener("click", function () { go(i + 1, true); start(); });
  document.getElementById("finderPrev").addEventListener("click", function () { go(i - 1, true); start(); });
  box.addEventListener("mouseenter", function () { clearInterval(timer); });
  box.addEventListener("mouseleave", start);

  /* REC timer counts the seconds since the page opened */
  var t0 = Date.now();
  setInterval(function () {
    var s = Math.floor((Date.now() - t0) / 1000);
    if (recEl) { recEl.textContent = pad(Math.floor(s / 60) % 100) + ":" + pad(s % 60); }
  }, 1000);

  go(0, false);
  start();
});

