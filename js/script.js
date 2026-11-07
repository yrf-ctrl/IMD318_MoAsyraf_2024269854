/* ===== Asyraf Razali: scripts ===== */
/* Each feature runs on its own, so one problem never stops the others. */

function safe(fn) {
  try { fn(); } catch (e) { if (window.console) { console.error(e); } }
}

// ---------- 1. Season themes ----------
safe(function () {
  var root = document.documentElement;
  var btns = document.querySelectorAll(".season");
  if (!btns.length) { return; }
  var valid = ["winter", "spring", "summer", "autumn"];

  function apply(s) {
    if (valid.indexOf(s) === -1) { s = "winter"; }
    root.setAttribute("data-theme", s);
    btns.forEach(function (b) {
      var on = b.getAttribute("data-season") === s;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      var s = b.getAttribute("data-season");
      apply(s);
      try { localStorage.setItem("theme", s); } catch (e) {}
    });
  });
  apply(root.getAttribute("data-theme"));
});

// ---------- 2. Header turns solid when scrolling (home page) ----------
safe(function () {
  var header = document.querySelector(".site-header");
  if (!header || !document.body.classList.contains("home")) { return; }
  function check() { header.classList.toggle("scrolled", window.scrollY > 60); }
  window.addEventListener("scroll", check);
  check();
});

// ---------- 3. Fade-in on scroll ----------
safe(function () {
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("show"); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("show"); }
    });
  }, { threshold: 0.1 });
  items.forEach(function (el) { observer.observe(el); });
});

// ---------- 4. Hero carousel ----------
safe(function () {
  var hero = document.querySelector(".hero");
  if (!hero) { return; }

  var slides = hero.querySelectorAll(".slide");
  var dots = hero.querySelectorAll(".dot");
  var counter = document.getElementById("cur");
  var pauseBtn = document.getElementById("pauseBtn");
  var INTERVAL = 7000;                       // time per slide in milliseconds
  var current = 0, timer = null, userPaused = false, hoverPaused = false;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  hero.style.setProperty("--dur", INTERVAL + "ms");

  function show(n) {
    current = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) {
      var on = i === current;
      s.classList.toggle("active", on);
      s.setAttribute("aria-hidden", on ? "false" : "true");
    });
    dots.forEach(function (d, i) {
      d.classList.remove("on");
      d.removeAttribute("aria-current");
      if (i === current) {
        void d.offsetWidth;                  // restart the fill animation
        d.classList.add("on");
        d.setAttribute("aria-current", "true");
      }
    });
    if (counter) { counter.textContent = ("0" + (current + 1)).slice(-2); }
  }

  function stopAuto() { clearInterval(timer); timer = null; }
  function startAuto() {
    stopAuto();
    if (reduceMotion || userPaused || hoverPaused) { return; }
    timer = setInterval(function () { show(current + 1); }, INTERVAL);
  }
  function refresh() {
    hero.classList.toggle("paused", hoverPaused && !userPaused && !reduceMotion);
    hero.classList.toggle("stopped", userPaused || reduceMotion);
    hero.setAttribute("aria-live", timer ? "off" : "polite");
  }
  function go(n) { show(n); startAuto(); refresh(); }

  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  if (prevBtn) { prevBtn.addEventListener("click", function () { go(current - 1); }); }
  if (nextBtn) { nextBtn.addEventListener("click", function () { go(current + 1); }); }
  dots.forEach(function (d, i) { d.addEventListener("click", function () { go(i); }); });

  if (pauseBtn) {
    pauseBtn.addEventListener("click", function () {
      userPaused = !userPaused;
      pauseBtn.textContent = userPaused ? "Play" : "Pause";
      pauseBtn.setAttribute("aria-label", userPaused ? "Play slideshow" : "Pause slideshow");
      startAuto(); refresh();
    });
  }

  hero.addEventListener("mouseenter", function () { hoverPaused = true; startAuto(); refresh(); });
  hero.addEventListener("mouseleave", function () { hoverPaused = false; startAuto(); refresh(); });
  hero.addEventListener("focusin", function () { hoverPaused = true; startAuto(); refresh(); });
  hero.addEventListener("focusout", function () { hoverPaused = false; startAuto(); refresh(); });

  hero.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { go(current - 1); }
    if (e.key === "ArrowRight") { go(current + 1); }
  });

  var startX = 0;
  hero.addEventListener("touchstart", function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", function (e) {
    var diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) { go(diff < 0 ? current + 1 : current - 1); }
  }, { passive: true });

  show(0);
  refresh();
  setTimeout(startAuto, 2400);                              // begin after the curtain lifts
  setTimeout(function () { document.body.classList.remove("first-load"); }, 3200);
});

// ---------- 5. Typewriter line ----------
safe(function () {
  var box = document.getElementById("typed");
  if (!box) { return; }
  var phrases = ["Strategic research & analysis.", "Leadership & governance.", "Financial markets & valuation.", "Operations & project management."];
  var p = 0, c = 0, deleting = false;

  function loop() {
    var word = phrases[p];
    box.textContent = word.substring(0, c);
    if (!deleting && c < word.length) { c++; setTimeout(loop, 70); }
    else if (!deleting) { deleting = true; setTimeout(loop, 1600); }
    else if (c > 0) { c--; setTimeout(loop, 35); }
    else { deleting = false; p = (p + 1) % phrases.length; setTimeout(loop, 400); }
  }
  loop();
});

// ---------- 6. Photo stack ----------
safe(function () {
  var stack = document.getElementById("stack");
  if (!stack) { return; }
  var cards = stack.querySelectorAll(".polaroid");
  var total = cards.length, front = 0, timer = null;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function render() {
    cards.forEach(function (card, i) { card.setAttribute("data-pos", (i - front + total) % total); });
  }
  function next() { front = (front + 1) % total; render(); }
  function prev() { front = (front - 1 + total) % total; render(); }
  function stop() { clearInterval(timer); }
  function start() { stop(); if (!reduce) { timer = setInterval(next, 4000); } }

  stack.addEventListener("click", function (e) {
    if (e.target.closest(".ctrl-btn")) { return; }
    next(); start();
  });
  var nb = document.getElementById("stackNext");
  var pb = document.getElementById("stackPrev");
  if (nb) { nb.addEventListener("click", function () { next(); start(); }); }
  if (pb) { pb.addEventListener("click", function () { prev(); start(); }); }
  stack.addEventListener("mouseenter", stop);
  stack.addEventListener("mouseleave", start);

  render();
  start();
});

// ---------- 7. Open the linked role's details (Experience page) ----------
safe(function () {
  function openTarget() {
    if (!location.hash) { return; }
    var el = document.querySelector(location.hash);
    var d = el ? el.querySelector("details") : null;
    if (d) { d.open = true; }
  }
  window.addEventListener("hashchange", openTarget);
  openTarget();
});



 // ---------- 9. About page: life outside work tabs ----------
safe(function () {
  var box = document.getElementById("life");
  if (!box) { return; }

  var tabs = box.querySelectorAll(".tab");
  var panels = box.querySelectorAll(".panel");

  if (!tabs.length || !panels.length) { return; }

  function activateTab(tab) {
    var target = tab.getAttribute("data-tab");

    tabs.forEach(function (item) {
      var active = item === tab;
      item.classList.toggle("on", active);
      item.setAttribute("aria-selected", active ? "true" : "false");
    });

    panels.forEach(function (panel) {
      panel.classList.toggle("on", panel.id === target);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      activateTab(tab);
    });
  });

  box.classList.add("tabs-ready");

  var initialTab = box.querySelector(".tab.on") || tabs[0];
  activateTab(initialTab);
});




 // ---------- 10. Favourite songs - Spotify player ----------
safe(function () {
  var songs = document.querySelectorAll(".song");
  if (!songs.length) { return; }

  var activeSong = null;

  songs.forEach(function (song) {
    var button = song.querySelector(".play");
    var embed = song.querySelector(".song-embed");

    if (!button || !embed) { return; }

    button.addEventListener("click", function () {
      var trackId = song.getAttribute("data-spotify");

      if (!trackId) {
        button.textContent = "Unavailable";
        return;
      }

      // Close selected song
      if (activeSong === song) {
        embed.innerHTML = "";
        button.textContent = "Play";
        activeSong = null;
        return;
      }

      // Close previous song
      if (activeSong) {
        activeSong.querySelector(".song-embed").innerHTML = "";
        activeSong.querySelector(".play").textContent = "Play";
      }

      activeSong = song;
      button.textContent = "Close";

      // Create Spotify embed
      var iframe = document.createElement("iframe");

      iframe.src = "https://open.spotify.com/embed/track/" + trackId + "?utm_source=generator";
      iframe.width = "100%";
      iframe.height = "152";
      iframe.frameBorder = "0";
      iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      iframe.loading = "lazy";
      iframe.title = "Spotify music player";

      embed.appendChild(iframe);
    });
  });
});
