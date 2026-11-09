function initSite() {
  // Auto-update footer copyright year dynamically across all pages
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('#year, .current-year, [data-year]').forEach(el => {
    el.textContent = currentYear;
  });

  const emailLinks = document.querySelectorAll(".js-email-link");
  if (emailLinks.length > 0) {
    const addrBytes = [100, 97, 114, 107, 119, 105, 110, 103, 100, 111, 109, 97, 105, 110, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109];
    const address = addrBytes.map(b => String.fromCharCode(b)).join("");

    emailLinks.forEach(emailLink => {
      emailLink.href = `mailto:${address}`;
      emailLink.removeAttribute("target");
      emailLink.removeAttribute("rel");
      emailLink.setAttribute("aria-label", "Email DarkWing Studio");
    });
  }

  // Handle the gallery filter buttons
  const filterBtns = document.querySelectorAll(".asset-filter");
  const cards = document.querySelectorAll(".asset-card");

  if (filterBtns.length > 0 && cards.length > 0) {
    const params = new URLSearchParams(window.location.search);
    const initialFilter = params.get('filter');
    const validFilters = [...filterBtns].map(btn => btn.getAttribute('data-filter'));
    const activateFilter = category => {
      const activeCategory = validFilters.includes(category) ? category : 'all';
      filterBtns.forEach(btn => {
        const isActive = btn.getAttribute('data-filter') === activeCategory;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });
      cards.forEach(card => {
        const visible = activeCategory === 'all' || card.getAttribute('data-category') === activeCategory;
        card.hidden = !visible;
      });
    };

    activateFilter(initialFilter || 'all');
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-filter");
        activateFilter(category);
        const url = new URL(window.location.href);
        if (category === 'all') url.searchParams.delete('filter');
        else url.searchParams.set('filter', category);
        window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
      });
    });
  }

  document.querySelectorAll('img[data-fallback]').forEach(image => {
    image.addEventListener('error', () => {
      const fallback = image.dataset.fallback;
      if (!fallback || image.src.endsWith(fallback)) return;
      image.src = fallback;
      image.removeAttribute('data-fallback');
    }, { once: true });
  });

  const revealItems = document.querySelectorAll(".intro-panel > *, .links-panel > *");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach((item, index) => {
      item.classList.add("reveal-on-load");
    });

    requestAnimationFrame(() => {
      document.querySelectorAll(".reveal-on-load").forEach(item => {
        item.classList.add("is-visible");
      });
    });
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite);
} else {
  initSite();
}
