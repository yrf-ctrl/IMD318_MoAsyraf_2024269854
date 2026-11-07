
/* Gallery filters and lightbox */
(function () {
  "use strict";

  var grid = document.getElementById("galleryGrid");
  var lightbox = document.getElementById("galleryLightbox");
  if (!grid || !lightbox) return;

  var buttons = Array.from(document.querySelectorAll(".gallery-filter"));
  var items = Array.from(document.querySelectorAll(".photo-trigger"));
  var count = document.getElementById("visibleCount");
  var img = document.getElementById("lightboxImage");
  var title = document.getElementById("lightboxTitle");
  var category = document.getElementById("lightboxCategory");
  var date = document.getElementById("lightboxDate");
  var indexText = document.getElementById("lightboxIndex");
  var closeBtn = lightbox.querySelector(".lightbox-close");
  var prevBtn = lightbox.querySelector(".lightbox-prev");
  var nextBtn = lightbox.querySelector(".lightbox-next");

  var current = [];
  var position = 0;
  var lastFocus = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  // Keep placeholders visible when image files are missing.
  document.querySelectorAll(".gallery-media img, .feature-photo img").forEach(function (photo) {
    var holder = photo.closest(".gallery-media, .feature-photo");

    function check() {
      if (holder) {
        holder.classList.toggle(
          "has-image",
          photo.complete && photo.naturalWidth > 0
        );
      }
    }

    photo.addEventListener("load", check);
    photo.addEventListener("error", check);

    if (photo.complete) check();
  });

  function visibleItems() {
    return items.filter(function (item) {
      return item.closest("#galleryGrid") !== grid || !item.hidden;
    });
  }

  // Category filters
  function filter(value) {
    var shown = 0;

    items.forEach(function (item) {
      if (item.closest("#galleryGrid") !== grid) return;

      var show = value === "all" || item.dataset.category === value;
      item.hidden = !show;

      if (show) shown++;
    });

    buttons.forEach(function (button) {
      var active = button.dataset.filter === value;

      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    count.textContent = pad(shown);
    current = visibleItems();
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      filter(button.dataset.filter || "all");
    });
  });

  // Lightbox display
  function render(index) {
    if (!current.length) return;

    position = (index + current.length) % current.length;

    var item = current[position];
    var thumb = item.querySelector("img");

    img.src = item.dataset.full || "";
    img.alt = thumb ? thumb.alt : "Gallery photograph";

    title.textContent = item.dataset.title || "Photograph";
    category.textContent = (
      item.dataset.categoryName || "COLLECTION"
    ).toUpperCase();

    date.textContent = item.dataset.date || "";

    indexText.textContent =
      pad(position + 1) + " / " + pad(current.length);
  }

  function open(item) {
    current = visibleItems();
    position = current.indexOf(item);

    if (position < 0) position = 0;

    lastFocus = document.activeElement;

    render(position);

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
    img.removeAttribute("src");

    if (lastFocus) lastFocus.focus();
  }

  // Open photographs
  items.forEach(function (item) {
    item.addEventListener("click", function () {
      open(item);
    });
  });

  // Lightbox controls
  closeBtn.addEventListener("click", close);

  prevBtn.addEventListener("click", function () {
    render(position - 1);
  });

  nextBtn.addEventListener("click", function () {
    render(position + 1);
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) close();
  });

  // Keyboard controls
  document.addEventListener("keydown", function (event) {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") render(position - 1);
    if (event.key === "ArrowRight") render(position + 1);
  });

  // Initial state
  filter("all");
  
  // Soft reveal as sections enter the screen
  var revealTargets = document.querySelectorAll(
    ".feature-photo, .feature-note, .collection-heading, " +
    ".gallery-toolbar, .gallery-item, .gallery-endnote"
  );

  revealTargets.forEach(function (element) {
    element.classList.add("gallery-reveal");
  });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    });

    revealTargets.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealTargets.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

  // Gentle cursor-following ambient light
  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("pointermove", function (event) {
      document.documentElement.style.setProperty(
        "--mouse-x", event.clientX + "px"
      );
      document.documentElement.style.setProperty(
        "--mouse-y", event.clientY + "px"
      );
    });
  }

})();
/* =========================================
   GALLERY VIEWER: ZOOM
   Works on top of the existing photo viewer.
   - Click the photo to zoom in, click again to zoom out
   - Scroll wheel (or pinch on a phone) to zoom in small steps
   - Drag to move around while zoomed
   - Keys: + and - to zoom, 0 to reset, Esc to zoom out first
   Zoom resets when you change photo or close the viewer.
========================================= */

(function () {
  var box = document.getElementById("galleryLightbox");
  var img = document.getElementById("lightboxImage");
  if (!box || !img) { return; }

  var fig = img.closest("figure") || img.parentElement;
  var MAX = 4;                         // highest zoom level
  var s = 1, tx = 0, ty = 0;           // current zoom and position
  var pointers = {}, drag = null, startDist = 0, startScale = 1, moved = false;

  /* Is the viewer open? Works whichever way the existing script opens it. */
  function isOpen() {
    if (box.matches(".open, .is-open, .active, .show, .visible, [aria-hidden='false']")) { return true; }
    var cs = getComputedStyle(box);
    return cs.display !== "none" && cs.visibility !== "hidden" && parseFloat(cs.opacity) > 0.05;
  }

  function apply(animate) {
    img.style.transition = animate === false ? "none" : "";
    img.style.transform = (s === 1 && !tx && !ty) ? "" : "translate(" + tx + "px," + ty + "px) scale(" + s + ")";
    var zoomed = s > 1.01;
    img.classList.toggle("is-zoomed", zoomed);
    if (fig) { fig.classList.toggle("is-zoomed", zoomed); }
  }

  /* Keep the photo from being dragged completely out of view */
  function clamp() {
    var w = img.offsetWidth * s, h = img.offsetHeight * s;
    var mx = Math.max(0, (w - box.clientWidth) / 2) + 40;
    var my = Math.max(0, (h - box.clientHeight) / 2) + 40;
    if (w <= box.clientWidth) { mx = 0; }
    if (h <= box.clientHeight) { my = 0; }
    tx = Math.max(-mx, Math.min(mx, tx));
    ty = Math.max(-my, Math.min(my, ty));
  }

  function reset(animate) { s = 1; tx = 0; ty = 0; apply(animate); }

  /* Zoom to a level, keeping the point under the cursor in place */
  function zoomAt(ns, px, py, animate) {
    ns = Math.max(1, Math.min(MAX, ns));
    var r = img.getBoundingClientRect();
    var cx = r.left + r.width / 2 - tx, cy = r.top + r.height / 2 - ty;   // centre without zoom
    var ox = px - cx, oy = py - cy;
    tx = ox - (ox - tx) * (ns / s);
    ty = oy - (oy - ty) * (ns / s);
    s = ns;
    if (s <= 1.001) { s = 1; tx = 0; ty = 0; } else { clamp(); }
    apply(animate);
  }

  /* Zoom level that shows the photo at about its real size */
  function naturalScale() {
    var n = img.naturalWidth / (img.offsetWidth || 1);
    return Math.max(2, Math.min(3.5, n));
  }

  /* Click: zoom in or out */
  img.addEventListener("click", function (e) {
    e.stopPropagation();                         // do not close the viewer
    if (moved) { moved = false; return; }        // it was a drag, not a click
    if (s > 1.01) { zoomAt(1, e.clientX, e.clientY); }
    else { zoomAt(naturalScale(), e.clientX, e.clientY); }
  });

  /* Mouse wheel */
  box.addEventListener("wheel", function (e) {
    if (!isOpen()) { return; }
    e.preventDefault();
    zoomAt(s * Math.exp(-e.deltaY * 0.002), e.clientX, e.clientY, false);
  }, { passive: false });

  /* Drag to move, two fingers to pinch */
  function ids() { return Object.keys(pointers); }
  function dist() {
    var k = ids(), a = pointers[k[0]], b = pointers[k[1]];
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }
  function mid() {
    var k = ids(), a = pointers[k[0]], b = pointers[k[1]];
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }

  img.addEventListener("pointerdown", function (e) {
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    try { img.setPointerCapture(e.pointerId); } catch (err) {}
    if (ids().length === 2) { startDist = dist(); startScale = s; }
    drag = { x: e.clientX, y: e.clientY, tx: tx, ty: ty };
    moved = false;
  });

  img.addEventListener("pointermove", function (e) {
    if (!pointers[e.pointerId]) { return; }
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (ids().length === 2) {
      if (startDist) { var m = mid(); zoomAt(startScale * dist() / startDist, m.x, m.y, false); moved = true; }
    } else if (s > 1.01 && drag) {
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) { moved = true; img.classList.add("is-dragging"); }
      if (moved) { tx = drag.tx + dx; ty = drag.ty + dy; clamp(); apply(false); }
    }
  });

  function release(e) {
    delete pointers[e.pointerId];
    img.classList.remove("is-dragging");
    startDist = 0;
    var k = ids();
    drag = k.length === 1 ? { x: pointers[k[0]].x, y: pointers[k[0]].y, tx: tx, ty: ty } : null;
  }
  img.addEventListener("pointerup", release);
  img.addEventListener("pointercancel", release);

  /* While zoomed, finger movement on the photo should move the photo, not change slides */
  ["touchstart", "touchmove", "touchend"].forEach(function (name) {
    img.addEventListener(name, function (e) {
      if (s > 1.01 || (e.touches && e.touches.length > 1)) { e.stopPropagation(); }
    }, { passive: true });
  });

  /* Keyboard */
  window.addEventListener("keydown", function (e) {
    if (!isOpen()) { return; }
    var cx = box.clientWidth / 2, cy = box.clientHeight / 2;
    if (e.key === "Escape" && s > 1.01) { e.preventDefault(); e.stopImmediatePropagation(); reset(); return; }
    if (e.key === "+" || e.key === "=") { zoomAt(s > 1.01 ? s * 1.4 : naturalScale(), cx, cy); }
    if (e.key === "-" || e.key === "_") { zoomAt(s / 1.4, cx, cy); }
    if (e.key === "0") { reset(); }
  }, true);

  /* Start fresh whenever the photo changes or the viewer opens or closes */
  new MutationObserver(function () { reset(false); }).observe(img, { attributes: true, attributeFilter: ["src"] });
  new MutationObserver(function () { reset(false); }).observe(box, { attributes: true, attributeFilter: ["class", "aria-hidden"] });
})();