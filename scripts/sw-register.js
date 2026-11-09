// Service Worker registration for T-Rex Runner game page
if ('serviceWorker' in navigator && window.location.pathname.startsWith('/arcade/t-rex-runner')) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/arcade/t-rex-runner/sw.js', { scope: '/arcade/t-rex-runner/' })
      .then(function (reg) {
        console.log('[SW] T-Rex Runner service worker registered, scope:', reg.scope);
      })
      .catch(function (err) {
        console.warn('[SW] Registration failed:', err);
      });
  });
}

