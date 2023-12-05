self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('app-shell').then((cache) => {
      return cache.add('/index.html');
    })
  );
});

self.addEventListener('fetch', event => {
  // Check if the request is for navigation to a new page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If there is no internet connection, and the request fails, return the cached `index.html`
          return caches.match('/index.html');
        })
    );
  }
});
