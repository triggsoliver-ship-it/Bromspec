/* ==========================================================================
   BROMSPEC — brand strip
   Simplified, monochrome wordmarks (clean type + minimal emblem) representing
   the marques we service. Rendered into any element with [data-brand-strip]
   and duplicated for a seamless marquee loop.
   ========================================================================== */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";

  // Each entry: a small emblem path/shape + a wordmark.
  // Kept deliberately simple and original — not facsimiles of trademark art.
  const brands = [
    { name: "BMW",        emblem: "roundel" },
    { name: "MINI",       emblem: "wing" },
    { name: "AUDI",       emblem: "rings" },
    { name: "VW",         emblem: "vw" },
    { name: "MERCEDES",   emblem: "star" },
    { name: "PORSCHE",    emblem: "crest" },
    { name: "AUDARI?",    emblem: null, skip: true },
    { name: "LAND ROVER", emblem: "oval" },
    { name: "JAGUAR",     emblem: "cat" },
    { name: "FORD",       emblem: "oval" },
    { name: "TOYOTA",     emblem: "ellipses" },
    { name: "VAUXHALL",   emblem: "griffin" },
    { name: "NISSAN",     emblem: "bar" },
  ].filter(b => !b.skip);

  function emblemSVG(type) {
    const wrap = `<svg viewBox="0 0 40 40" width="34" height="34" fill="none" xmlns="${NS}" aria-hidden="true">`;
    const s = "stroke='currentColor' stroke-width='2'";
    const sf = "stroke='currentColor' stroke-width='1.6'";
    const map = {
      roundel: `<circle cx="20" cy="20" r="16" ${s}/><path d="M20 4v32M4 20h32" ${sf}/><path d="M20 20 A16 16 0 0 1 36 20 L20 20Z" fill="currentColor" opacity=".22"/><path d="M20 20 A16 16 0 0 1 4 20 L20 20Z" fill="currentColor" opacity=".22"/>`,
      wing:    `<circle cx="20" cy="20" r="15" ${s}/><path d="M6 20q7-7 14 0 7 7 14 0" ${sf} fill="none"/>`,
      rings:   `<circle cx="11" cy="20" r="7" ${sf}/><circle cx="20" cy="20" r="7" ${sf}/><circle cx="29" cy="20" r="7" ${sf}/>`,
      vw:      `<circle cx="20" cy="20" r="16" ${s}/><path d="M12 12l4 10 4-8 4 8 4-10" ${sf} fill="none" stroke-linejoin="round"/>`,
      star:    `<circle cx="20" cy="20" r="16" ${s}/><path d="M20 6v14M20 20l12 7M20 20l-12 7" ${sf}/>`,
      crest:   `<path d="M20 5l11 4v9c0 9-6 14-11 17-5-3-11-8-11-17V9z" ${s} fill="none"/><path d="M20 14v12" ${sf}/>`,
      oval:    `<ellipse cx="20" cy="20" rx="17" ry="11" ${s}/>`,
      cat:     `<path d="M5 24c6-2 9-9 14-9 4 0 6 3 11 2-3 4-7 6-12 6-4 0-9 1-13 1z" fill="currentColor" opacity=".8"/>`,
      ellipses:`<ellipse cx="20" cy="20" rx="16" ry="11" ${s}/><ellipse cx="20" cy="20" rx="9" ry="4" ${sf}/><ellipse cx="20" cy="20" rx="4" ry="9" ${sf}/>`,
      griffin: `<path d="M20 5l13 5v8c0 8-6 13-13 17-7-4-13-9-13-17v-8z" ${s} fill="none"/><path d="M14 16l6 4 6-4" ${sf} fill="none"/>`,
      bar:     `<circle cx="20" cy="20" r="16" ${s}/><rect x="6" y="17" width="28" height="6" fill="currentColor" opacity=".25"/><path d="M6 17h28v6H6z" ${sf} fill="none"/>`,
    };
    return wrap + (map[type] || map.oval) + `</svg>`;
  }

  function itemHTML(b) {
    return `<span class="brand-logo" role="img" aria-label="${b.name}">
      ${emblemSVG(b.emblem)}
      <span class="brand-logo__txt">${b.name}</span>
    </span>`;
  }

  document.querySelectorAll("[data-brand-strip]").forEach(strip => {
    const track = document.createElement("div");
    track.className = "marquee__track";
    const html = brands.map(itemHTML).join("");
    track.innerHTML = html + html; // duplicate for seamless loop
    strip.classList.add("marquee");
    strip.appendChild(track);
  });
})();
