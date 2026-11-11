function initSite() {
  // Auto-update footer copyright year dynamically across all pages
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('#year, .current-year, [data-year]').forEach(el => {
    el.textContent = currentYear;
  });

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
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (revealItems.length && !prefersReducedMotion) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      revealItems.forEach((item, index) => {
        item.style.setProperty("--reveal-delay", `${Math.min(index * 40, 240)}ms`);
        item.classList.add("reveal-on-load");
        observer.observe(item);
      });
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite);
} else {
  initSite();
}
