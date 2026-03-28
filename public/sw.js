const CACHE_NAME = 'leiham-v2';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/catalogo_assets/olla_presion.png',
  '/catalogo_assets/jarra.png',
  '/catalogo_assets/cuchillo_chef.png',
  '/catalogo_assets/licuadora.png',
  '/catalogo_assets/multipan.png',
  '/catalogo_assets/Expertea.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Archivos JS/CSS de Next.js — siempre de la red primero
  if (url.pathname.startsWith('/_next/static')) {
    event.respondWith(
      fetch(event.request).then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Todo lo demás — caché primero
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => {
        return caches.match('/');
      });
    })
  );
});
