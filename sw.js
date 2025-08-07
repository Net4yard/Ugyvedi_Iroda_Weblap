// Service Worker a teljesítmény javításához
const CACHE_NAME = 'bordas-maria-v1';
const urlsToCache = [
  '/',
  '/css/site.min.css',
  '/script/script.js',
  '/images/avatar_2.webp',
  '/images/office.webp',
  '/images/livingroom.webp',
  '/images/uk-circle-01.webp',
  '/images/hero-bg.webp'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - visszaadjuk a response-t
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Cache frissítése új verzió esetén
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
