document.addEventListener("DOMContentLoaded", function () {
  // Style :3 occurrences in content
  (function styleEmote() {
    const content = document.querySelector(".md-content");
    if (!content) return;
    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!node.textContent.includes(":3")) return;
        const span = document.createElement("span");
        span.innerHTML = node.textContent.replace(/:3/g, '<span class="emote-3">:3</span>');
        node.parentNode.replaceChild(span, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (["CODE","PRE","SCRIPT","STYLE"].includes(node.tagName)) return;
        Array.from(node.childNodes).forEach(walk);
      }
    }
    walk(content);
  })();


  if (!document.querySelector("[data-blame-info]")) return;

  // Smoother SVG: rounded outer ring + clean hour/minute hand.
  // stroke-linecap:round keeps the strokes crisp at small sizes.
  const ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5 V12 l3.2 2"/></svg>';

  const labelFor = (active) => active ? "Hide Dates" : "Show Dates";
  const render   = (active) => `${ICON}<span>${labelFor(active)}</span>`;

  const btn = document.createElement("button");
  btn.id = "blame-toggle";
  btn.type = "button";
  btn.setAttribute("aria-pressed", "false");
  btn.setAttribute("title", "Show when each section was written");
  btn.innerHTML = render(false);
  document.body.appendChild(btn);

  let active = false;

  btn.addEventListener("click", function () {
    active = !active;
    btn.setAttribute("aria-pressed", String(active));
    document.body.classList.toggle("blame-active", active);
    btn.innerHTML = render(active);

    if (active) {
      document.querySelectorAll("[data-blame-info]").forEach((el) => {
        if (el.querySelector(".blame-badge")) return;

        const info = el.getAttribute("data-blame-info");
        if (!info) return;

        const badge = document.createElement("span");
        badge.className = "blame-badge";
        badge.textContent = info;

        // Insert before the permalink anchor if present, otherwise append
        const permalink = el.querySelector("a.headerlink, a[href^='#']");
        if (permalink) {
          el.insertBefore(badge, permalink);
        } else {
          el.appendChild(badge);
        }
      });
    } else {
      document.querySelectorAll(".blame-badge").forEach((b) => b.remove());
    }
  });
});
