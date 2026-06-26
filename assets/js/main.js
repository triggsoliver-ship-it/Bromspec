/* ==========================================================================
   BROMSPEC MOTORWORKS — interactions
   ========================================================================== */
(function () {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------------------------------------------------- Year stamp */
  $$("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));

  /* ---------------------------------------------------- Sticky nav */
  const nav = $(".nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------- Mobile menu */
  const burger = $(".nav__burger");
  if (burger && nav) {
    const close = () => nav.classList.remove("open");
    burger.addEventListener("click", () => nav.classList.toggle("open"));
    $$(".nav__menu a").forEach(a => a.addEventListener("click", close));
    window.addEventListener("keydown", e => e.key === "Escape" && close());
  }

  /* ---------------------------------------------------- Hero intro */
  const hero = $(".hero");
  if (hero) requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add("ready")));

  /* ---------------------------------------------------- Scroll reveal */
  const reveals = $$("[data-reveal]");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("in"));
  }

  /* ---------------------------------------------------- Count up */
  const counters = $$("[data-count]");
  if (counters.length) {
    const run = el => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const dur = 1600, start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const cio = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(el => cio.observe(el));
  }

  /* ---------------------------------------------------- Card pointer glow */
  $$(".svc-card").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    });
  });

  /* ---------------------------------------------------- Subtle hero parallax */
  const heroMedia = $(".hero__media");
  if (heroMedia && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < window.innerHeight) heroMedia.style.transform = `translateY(${y * 0.18}px) scale(1.05)`;
    }, { passive: true });
  }

  /* ====================================================================
     DROP-IN MEDIA AUTO-LOADER
     --------------------------------------------------------------------
     Looks for files named 01, 02, 03 … in the folder you point a gallery
     at, and shows them automatically. No code editing needed — just drop
     numbered images/videos into the folder.  See README.md for details.
  ==================================================================== */
  const IMAGE_EXTS = ["jpg", "jpeg", "png", "webp", "avif"];
  const VIDEO_EXTS = ["mp4", "webm", "mov"];
  const MAX_PROBE  = 40;   // highest number it will look for

  function tryImage(srcs) {
    return new Promise(resolve => {
      let i = 0;
      const next = () => {
        if (i >= srcs.length) return resolve(null);
        const img = new Image();
        img.onload  = () => resolve({ type: "image", src: srcs[i] });
        img.onerror = () => { i++; next(); };
        img.src = srcs[i];
      };
      next();
    });
  }
  function tryVideo(srcs) {
    return new Promise(resolve => {
      let i = 0;
      const next = () => {
        if (i >= srcs.length) return resolve(null);
        const v = document.createElement("video");
        v.onloadedmetadata = () => resolve({ type: "video", src: srcs[i] });
        v.onerror = () => { i++; next(); };
        v.src = srcs[i];
      };
      next();
    });
  }
  const pad = n => String(n).padStart(2, "0");

  async function loadGallery(el) {
    const folder = el.dataset.gallery.replace(/\/?$/, "/");
    const found = [];
    for (let n = 1; n <= MAX_PROBE; n++) {
      const base = [pad(n), String(n)];
      const imgSrcs = [];
      base.forEach(b => IMAGE_EXTS.forEach(ext => imgSrcs.push(`${folder}${b}.${ext}`)));
      const vidSrcs = [];
      base.forEach(b => VIDEO_EXTS.forEach(ext => vidSrcs.push(`${folder}${b}.${ext}`)));

      const [img, vid] = await Promise.all([tryImage(imgSrcs), tryVideo(vidSrcs)]);
      const hit = img || vid;
      if (!hit) break;          // stop at first gap
      found.push(hit);
    }

    if (!found.length) return;  // keep the placeholder message
    el.innerHTML = "";
    el.classList.add("gallery");
    found.forEach(item => {
      const wrap = document.createElement("div");
      wrap.className = "gallery__item";
      wrap.setAttribute("data-reveal", "");
      if (item.type === "image") {
        const im = new Image();
        im.src = item.src; im.loading = "lazy"; im.alt = "Bromspec workshop";
        wrap.appendChild(im);
      } else {
        const v = document.createElement("video");
        v.src = item.src; v.muted = true; v.loop = true; v.playsInline = true;
        v.autoplay = true; v.setAttribute("playsinline", "");
        wrap.appendChild(v);
      }
      el.appendChild(wrap);
      requestAnimationFrame(() => wrap.classList.add("in"));
    });
  }

  $$("[data-gallery]").forEach(loadGallery);

  /* ---------------------------------------------------- Hero video presence */
  // If a hero video fails to load, fall back to the animated gradient.
  $$(".hero__media video").forEach(v => {
    v.addEventListener("error", () => {
      const media = v.closest(".hero__media");
      if (media) { media.classList.add("hero__media--fallback"); v.remove(); }
    });
    // also fall back if it never loads any data shortly after parse
    setTimeout(() => {
      if (v.readyState === 0) {
        const media = v.closest(".hero__media");
        if (media) { media.classList.add("hero__media--fallback"); v.remove(); }
      }
    }, 2500);
  });

  /* ---------------------------------------------------- Enquiry form */
  const form = $("#contact-form");
  if (form) {
    const note   = $("#form-status");
    const btn    = form.querySelector('button[type="submit"]');
    const noteDefault = note ? note.innerHTML : "";

    /* Validate a UK phone number (mobile or landline).
       Accepts spaces, +44, leading 0. Examples that pass:
       07123 456789 · +44 7123 456789 · 01264 315305 · +441264315305 */
    function isValidUKPhone(raw) {
      const v = raw.replace(/[\s().-]/g, "");
      // +44... or 0... → normalise to a 0-leading national number
      let nat = v;
      if (/^\+44/.test(nat))      nat = "0" + nat.slice(3);
      else if (/^0044/.test(nat)) nat = "0" + nat.slice(4);
      if (!/^0\d{9,10}$/.test(nat)) return false;        // 10–11 digits incl. leading 0
      // 07 mobiles → 11 digits; landlines (01/02/03) → 10–11 digits
      if (/^07/.test(nat)) return nat.length === 11;
      if (/^0[1235689]/.test(nat)) return nat.length === 10 || nat.length === 11;
      return false;
    }

    const setError = (field, msg) => {
      const wrap = field.closest(".field");
      field.setAttribute("aria-invalid", "true");
      if (wrap) {
        let e = wrap.querySelector(".field__err");
        if (!e) { e = document.createElement("span"); e.className = "field__err"; wrap.appendChild(e); }
        e.textContent = msg;
      }
    };
    const clearError = field => {
      field.removeAttribute("aria-invalid");
      const wrap = field.closest(".field");
      const e = wrap && wrap.querySelector(".field__err");
      if (e) e.remove();
    };

    // Clear an error as soon as the visitor edits the field
    ["name", "email", "phone"].forEach(id => {
      const el = $("#" + id, form);
      if (el) el.addEventListener("input", () => clearError(el));
    });

    function validate() {
      let ok = true;
      const name  = $("#name", form);
      const email = $("#email", form);
      const phone = $("#phone", form);

      if (!name.value.trim())  { setError(name, "Please enter your name."); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setError(email, "Please enter a valid email address."); ok = false; }
      if (!phone.value.trim())              { setError(phone, "Please enter your phone number."); ok = false; }
      else if (!isValidUKPhone(phone.value)) { setError(phone, "Please enter a valid UK phone number."); ok = false; }

      if (!ok) {
        const first = form.querySelector('[aria-invalid="true"]');
        if (first) first.focus();
      }
      return ok;
    }

    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (!validate()) return;

      const key = form.querySelector('[name="access_key"]');
      const configured = key && key.value && !/^REPLACE_WITH/.test(key.value);

      const showNote = (msg, color) => {
        if (!note) return;
        note.innerHTML = msg;
        note.style.color = color;
      };

      // Graceful fallback if the Web3Forms key hasn't been added yet
      if (!configured) {
        showNote("Thanks — your details look good. ⚠️ This form isn’t connected to email yet: add your Web3Forms access key in contact.html to start receiving enquiries at hello@bromspec.co.uk.", "var(--accent-2)");
        return;
      }

      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }
      showNote("Sending your enquiry…", "var(--text-soft)");

      try {
        const res = await fetch(form.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form)
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          showNote("Thanks — your enquiry has been sent. Our team will be in touch shortly.", "var(--accent-2)");
          form.reset();
        } else {
          showNote("Sorry, something went wrong sending your enquiry. Please call us on <a href=\"tel:+441264315305\" style=\"color:var(--accent-2)\">01264 315305</a> or email <a href=\"mailto:hello@bromspec.co.uk\" style=\"color:var(--accent-2)\">hello@bromspec.co.uk</a>.", "#ff8a8a");
        }
      } catch (err) {
        showNote("Network error — please call us on <a href=\"tel:+441264315305\" style=\"color:var(--accent-2)\">01264 315305</a> or email <a href=\"mailto:hello@bromspec.co.uk\" style=\"color:var(--accent-2)\">hello@bromspec.co.uk</a>.", "#ff8a8a");
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Send Request"; }
      }
    });
  }

  /* ---------------------------------------------------- Add-to-home-screen prompt */
  (function () {
    const standalone = matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    if (standalone) return; // already installed

    const ua = navigator.userAgent || "";
    const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(ua);
    if (!isIOS && !isAndroid) return; // mobile only

    try {
      const snooze = +(localStorage.getItem("a2hs-dismiss") || 0);
      if (snooze && Date.now() - snooze < 14 * 864e5) return; // re-offer after 14 days
    } catch (e) {}

    const style = document.createElement("style");
    style.textContent =
      ".a2hs{position:fixed;left:12px;right:12px;bottom:12px;z-index:200;display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:14px;background:rgba(18,21,25,.97);border:1px solid var(--line-strong);box-shadow:0 18px 50px -12px rgba(0,0,0,.7);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);transform:translateY(180%);transition:transform .5s cubic-bezier(.22,1,.36,1)}" +
      ".a2hs.in{transform:none}" +
      ".a2hs__icon{width:42px;height:42px;border-radius:9px;background:#fff;flex:none;object-fit:contain}" +
      ".a2hs__text{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}" +
      ".a2hs__text strong{font-size:.95rem;color:var(--text);line-height:1.2}" +
      ".a2hs__sub{font-size:.8rem;color:var(--text-mute)}" +
      ".a2hs__sub svg{width:15px;height:15px;vertical-align:-3px}" +
      ".a2hs__btn{flex:none;padding:10px 16px;border-radius:100px;border:0;background:linear-gradient(180deg,var(--accent-2),var(--accent));color:#fff;font-weight:600;font-size:.9rem;cursor:pointer}" +
      ".a2hs__x{flex:none;width:30px;height:30px;border-radius:50%;border:1px solid var(--line-strong);background:transparent;color:var(--text-soft);font-size:1.15rem;line-height:1;cursor:pointer}" +
      "@media(min-width:560px){.a2hs{left:auto;right:16px;bottom:16px;max-width:390px}}";
    document.head.appendChild(style);

    const shareIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 16V4M8 8l4-4 4 4"/><path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"/></svg>';
    const sub = isIOS
      ? "Tap " + shareIcon + " then “Add to Home Screen”."
      : "Quick access to booking &amp; MOTs, one tap away.";

    const bar = document.createElement("div");
    bar.className = "a2hs";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Add Bromspec to your home screen");
    bar.innerHTML =
      '<img class="a2hs__icon" src="/images/logo.png" alt="" />' +
      '<div class="a2hs__text"><strong>Add Bromspec to your phone</strong>' +
      '<span class="a2hs__sub">' + sub + "</span></div>" +
      (isIOS ? "" : '<button class="a2hs__btn" type="button">Install</button>') +
      '<button class="a2hs__x" type="button" aria-label="Dismiss">&times;</button>';

    let deferred = null;
    function show() {
      if (document.body.contains(bar)) return;
      document.body.appendChild(bar);
      requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.add("in")));
    }
    function hide() { bar.classList.remove("in"); setTimeout(() => bar.remove(), 500); }
    function dismiss() { try { localStorage.setItem("a2hs-dismiss", Date.now()); } catch (e) {} hide(); }

    bar.querySelector(".a2hs__x").addEventListener("click", dismiss);
    const installBtn = bar.querySelector(".a2hs__btn");
    if (installBtn) {
      installBtn.addEventListener("click", async () => {
        if (!deferred) { dismiss(); return; }
        deferred.prompt();
        try { await deferred.userChoice; } catch (e) {}
        deferred = null;
        dismiss();
      });
    }

    if (isAndroid) {
      window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; show(); });
      window.addEventListener("appinstalled", () => { try { localStorage.setItem("a2hs-dismiss", Date.now()); } catch (e) {} hide(); });
    } else if (isIOS) {
      setTimeout(show, 2600);
    }
  })();
})();
