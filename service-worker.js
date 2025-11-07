self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('your-app-cache').then(cache => {
      return cache.addAll([
        // List of your assets to cache (e.g., HTML, CSS, JS, images)
      ]);
    })
  );
});


  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });
  