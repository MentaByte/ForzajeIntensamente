const CACHE_NAME = 'forzaje-intensamente-v1';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png',
  './ABURRIMIENTO.jpg',
  './ALEGRIA.jpg',
  './ANSIEDAD.jpg',
  './DESAGRADO.jpg',
  './ENVIDIA.jpg',
  './FORZAJE.jpg',
  './FORZAJEVERTICAL.jpg',
  './FURIA.jpg',
  './MIEDO.jpg',
  './TRISTEZA.jpg',
  './VERGUENZA.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
