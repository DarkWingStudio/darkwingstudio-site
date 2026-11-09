(function () {
  // 1. Display requested path in chip
  const pathChip = document.getElementById("requested-path");
  const currentPath = window.location.pathname || "/unknown";
  if (pathChip) {
    pathChip.textContent = currentPath;
  }

  // 2. Intelligent Did-You-Mean Typo Suggester
  const lowerPath = currentPath.toLowerCase();
  const suggestionBox = document.getElementById("suggestion-box");
  const suggestionName = document.getElementById("suggestion-name");
  const suggestionLink = document.getElementById("suggestion-link");

  const suggestions = [
    { test: /(arcade|game|play|runner|trex|t-rex)/, name: "Arcade Games", url: "/arcade/" },
    { test: /(mob|creeper|warden|zombie|skeleton|enderman|breeze|allay|mine)/, name: "Minecraft Mob Database", url: "/minecraft/mobs/" },
    { test: /(art|wall|pfp|avatar|down)/, name: "Wallpapers & PFPs", url: "/art/assets/" },
    { test: /(proj|code|git|soft|tool)/, name: "Software Projects", url: "/projects/" },
    { test: /(about|rohit|bio|who)/, name: "About Studio", url: "/about/" },
    { test: /(priv|gdpr|cookie)/, name: "Privacy Policy", url: "/privacy/" },
    { test: /(term|legal|license)/, name: "Terms of Use", url: "/terms/" }
  ];

  for (const s of suggestions) {
    if (s.test.test(lowerPath) && currentPath !== s.url && currentPath !== s.url.replace(/\/$/, '')) {
      if (suggestionBox && suggestionName && suggestionLink) {
        suggestionName.textContent = s.name;
        suggestionLink.href = s.url;
        suggestionBox.classList.add("active");
      }
      break;
    }
  }

  // 3. Real-time Destination Filter
  const searchInput = document.getElementById("quick-search-input");
  const navCards = document.querySelectorAll("#destinations-grid .error-nav-card");
  if (searchInput && navCards.length > 0) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();
      navCards.forEach(card => {
        const keywords = (card.getAttribute("data-keywords") || "").toLowerCase();
        const text = card.textContent.toLowerCase();
        if (!query || keywords.includes(query) || text.includes(query)) {
          card.hidden = false;
        } else {
          card.hidden = true;
        }
      });
    });
  }
})();
