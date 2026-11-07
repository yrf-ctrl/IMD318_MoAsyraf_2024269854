/* =========================================
   EXPERIENCE PAGE SCRIPTS
   1. Smooth scrolling for the jump links
   2. Reading panel: "Explore" opens a large, organised panel
   3. Fallback: one inline details box open at a time
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. Smooth scrolling for jump links ---------- */
  document.querySelectorAll('.page-title .jump a[href^="#"], .closing .jump a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var target = document.querySelector(link.getAttribute("href"));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ---------- 2. Reading panel ---------- */
  try { buildPanel(); } catch (err) { if (window.console) { console.error(err); } }

  /* ---------- 3. Fallback: keep only one details box open (if the panel is not used) ---------- */
  var details = document.querySelectorAll(".experience-details");
  details.forEach(function (current) {
    current.addEventListener("toggle", function () {
      if (!current.open) { return; }
      details.forEach(function (other) { if (other !== current) { other.open = false; } });
    });
  });

  function buildPanel() {
    /* Cards that have an "Explore" section get a panel */
    var cards = Array.prototype.slice.call(document.querySelectorAll(".experience-card")).filter(function (card) {
      return card.querySelector(".experience-details .experience-more");
    });
    if (!cards.length) { return; }

    /* Split a card's hidden content into sections: every <h4> starts a new tab */
    function parseSections(more) {
      var sections = [], current = null;
      Array.prototype.forEach.call(more.children, function (el) {
        if (el.tagName === "H4") {
          current = { title: el.textContent.trim(), nodes: [] };
          sections.push(current);
        } else {
          if (!current) { current = { title: "Overview", nodes: [] }; sections.push(current); }
          current.nodes.push(el.cloneNode(true));
        }
      });
      return sections;
    }

    var items = cards.map(function (card) {
      var img = card.querySelector(".experience-image img");
      var photos = [];
      if (img && img.getAttribute("src")) { photos.push(img.getAttribute("src")); }
      (card.getAttribute("data-photos") || "").split(",").forEach(function (p) {
        p = p.trim();
        if (p && photos.indexOf(p) === -1) { photos.push(p); }
      });
      var get = function (sel) { var el = card.querySelector(sel); return el ? el : null; };
      return {
        id: card.id,
        card: card,
        date: get(".experience-date") ? get(".experience-date").textContent.trim() : "",
        title: get("h3") ? get("h3").textContent.trim() : "",
        place: get(".experience-place") ? get(".experience-place").innerHTML : "",
        tags: get(".experience-tags") ? get(".experience-tags").innerHTML : "",
        alt: img ? img.getAttribute("alt") || "" : "",
        photos: photos,
        sections: parseSections(card.querySelector(".experience-more"))
      };
    });

    /* Build the panel once */
    var overlay = document.createElement("div");
    overlay.className = "xp-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<div class="xp-dialog" role="dialog" aria-modal="true" aria-labelledby="xpTitle" tabindex="-1">' +
        '<button class="xp-close" type="button" aria-label="Close">&times;</button>' +
        '<div class="xp-media"><div class="xp-main"></div><div class="xp-thumbs"></div></div>' +
        '<div class="xp-content">' +
          '<div class="xp-head">' +
            '<p class="xp-date mono"></p><h2 id="xpTitle"></h2><p class="xp-place"></p>' +
            '<div class="experience-tags xp-tags"></div>' +
          '</div>' +
          '<div class="xp-tabs" role="tablist" aria-label="Sections"></div>' +
          '<div class="xp-body"></div>' +
          '<div class="xp-foot">' +
            '<button class="xp-nav" type="button" data-dir="-1"></button>' +
            '<span class="xp-count mono"></span>' +
            '<button class="xp-nav" type="button" data-dir="1"></button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var q = function (sel) { return overlay.querySelector(sel); };
    var dialog = q(".xp-dialog"), closeBtn = q(".xp-close");
    var mainBox = q(".xp-main"), thumbsBox = q(".xp-thumbs");
    var elDate = q(".xp-date"), elTitle = q("#xpTitle"), elPlace = q(".xp-place"), elTags = q(".xp-tags");
    var tabsBox = q(".xp-tabs"), bodyBox = q(".xp-body");
    var navBtns = overlay.querySelectorAll(".xp-nav"), elCount = q(".xp-count");

    var idx = 0, tab = 0, photo = 0, isOpen = false, lastTrigger = null;

    function pad(n) { return (n < 10 ? "0" : "") + n; }

    /* Photos: a large photo plus clickable thumbnails. Missing files show a placeholder. */
    function setPhoto(k) {
      var it = items[idx], list = it.photos.length ? it.photos : [""];
      photo = (k + list.length) % list.length;
      mainBox.innerHTML = "";
      mainBox.classList.remove("no-image");
      if (list[photo]) {
        var im = new Image();
        im.alt = photo === 0 ? it.alt : it.title + ", photo " + (photo + 1);
        im.onerror = function () { mainBox.classList.add("no-image"); };
        im.src = list[photo];
        mainBox.appendChild(im);
      } else {
        mainBox.classList.add("no-image");
      }
      var count = document.createElement("span");
      count.className = "xp-photocount mono";
      count.textContent = pad(photo + 1) + " / " + pad(list.length);
      mainBox.appendChild(count);
      Array.prototype.forEach.call(thumbsBox.children, function (b, n) { b.classList.toggle("on", n === photo); });
    }

    function renderPhotos() {
      var it = items[idx], list = it.photos;
      thumbsBox.innerHTML = "";
      thumbsBox.hidden = list.length < 2;
      if (list.length > 1) {
        list.forEach(function (src, n) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "xp-thumb";
          b.setAttribute("aria-label", "Show photo " + (n + 1));
          var im = new Image();
          im.alt = "";
          im.onerror = function () { b.classList.add("no-image"); };
          im.src = src;
          b.appendChild(im);
          b.addEventListener("click", function () { setPhoto(n); });
          thumbsBox.appendChild(b);
        });
      }
      setPhoto(0);
    }

    /* Tabs: one section is shown at a time */
    function showTab(k, focusTab) {
      var it = items[idx];
      tab = k;
      Array.prototype.forEach.call(tabsBox.children, function (b, n) {
        var on = n === k;
        b.classList.toggle("on", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.tabIndex = on ? 0 : -1;
        if (on && focusTab) { b.focus(); }
      });
      bodyBox.innerHTML = "";
      var panel = document.createElement("div");
      panel.className = "xp-panel";
      panel.setAttribute("role", "tabpanel");
      it.sections[k].nodes.forEach(function (node) { panel.appendChild(node.cloneNode(true)); });
      bodyBox.appendChild(panel);
      bodyBox.scrollTop = 0;
    }

    function renderTabs() {
      var it = items[idx];
      tabsBox.innerHTML = "";
      tabsBox.hidden = it.sections.length < 2;
      it.sections.forEach(function (s, k) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "xp-tab";
        b.setAttribute("role", "tab");
        b.textContent = s.title;
        b.addEventListener("click", function () { showTab(k); });
        b.addEventListener("keydown", function (e) {
          var n = it.sections.length, to = null;
          if (e.key === "ArrowRight") { to = (k + 1) % n; }
          if (e.key === "ArrowLeft") { to = (k - 1 + n) % n; }
          if (e.key === "Home") { to = 0; }
          if (e.key === "End") { to = n - 1; }
          if (to !== null) { e.preventDefault(); showTab(to, true); }
        });
        tabsBox.appendChild(b);
      });
      showTab(0);
    }

    function renderItem(i) {
      idx = i;
      var it = items[i], n = items.length;
      elDate.textContent = it.date;
      elTitle.textContent = it.title;
      elPlace.innerHTML = it.place;
      elTags.innerHTML = it.tags;
      renderPhotos();
      renderTabs();
      elCount.textContent = pad(i + 1) + " / " + pad(n);
      navBtns.forEach(function (b) {
        var d = parseInt(b.getAttribute("data-dir"), 10);
        var other = items[(i + d + n) % n];
        b.hidden = n < 2;
        b.textContent = d < 0 ? "\u2190  " + other.title : other.title + "  \u2192";
        b.setAttribute("aria-label", (d < 0 ? "Previous role: " : "Next role: ") + other.title);
      });
      dialog.scrollTop = 0;
    }

    function setHash(id) { try { history.replaceState(null, "", "#" + id); } catch (e) {} }
    function clearHash() { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }

    function openPanel(i, trigger) {
      lastTrigger = trigger || document.activeElement;
      renderItem(i);
      if (!isOpen) {
        var gap = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = gap > 0 ? gap + "px" : "";
        document.body.classList.add("xp-lock");
        overlay.classList.add("open");
        overlay.setAttribute("aria-hidden", "false");
        isOpen = true;
        setTimeout(function () { closeBtn.focus(); }, 60);
      }
      setHash(items[i].id);
    }

    function closePanel() {
      if (!isOpen) { return; }
      isOpen = false;
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("xp-lock");
      document.body.style.paddingRight = "";
      clearHash();
      if (lastTrigger && lastTrigger.focus) { lastTrigger.focus(); }
    }

    /* Controls */
    closeBtn.addEventListener("click", closePanel);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) { closePanel(); } });
    mainBox.addEventListener("click", function () { setPhoto(photo + 1); });
    navBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        var d = parseInt(b.getAttribute("data-dir"), 10);
        renderItem((idx + d + items.length) % items.length);
        setHash(items[idx].id);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (!isOpen) { return; }
      if (e.key === "Escape") { e.preventDefault(); closePanel(); return; }
      if (e.key === "Tab") {                       /* keep keyboard focus inside the panel */
        var f = dialog.querySelectorAll("button:not([hidden]):not([disabled])");
        var list = Array.prototype.filter.call(f, function (el) { return el.offsetParent !== null; });
        if (!list.length) { return; }
        var first = list[0], last = list[list.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* Replace the inline "Explore" toggle with a button that opens the panel */
    items.forEach(function (it, i) {
      var det = it.card.querySelector(".experience-details");
      var label = det.querySelector("summary").childNodes[0].textContent.trim();
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "experience-open";
      btn.setAttribute("aria-haspopup", "dialog");
      btn.innerHTML = label + ' <span class="details-icon" aria-hidden="true">\u2197</span>';
      btn.addEventListener("click", function (e) { e.stopPropagation(); openPanel(i, btn); });
      det.parentNode.replaceChild(btn, det);

      it.card.classList.add("is-clickable");
      it.card.addEventListener("click", function (e) {
        if (e.target.closest("a")) { return; }
        openPanel(i, btn);
      });
    });

    /* Links such as experience.html#mpp open that role straight away */
    function fromHash() {
      var id = location.hash.replace("#", "");
      if (!id) { return; }
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) { openPanel(i); return; }
      }
    }
    window.addEventListener("hashchange", function () {
      if (!location.hash && isOpen) { isOpen = true; closePanel(); }
      else { fromHash(); }
    });
    if (location.hash) { setTimeout(fromHash, 450); }
  }

});