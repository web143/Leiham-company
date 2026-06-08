// CACHE_NAME is auto-updated by scripts/update-sw-version.js on every `npm run build`.
// Vercel runs prebuild before each deploy, so this value changes automatically.
// BUMPED manually to force SW replacement and clear stale caches that blocked page 4+.
const CACHE_NAME = 'leiham-v2-catalog-full';

// Assets pre-cacheados en la instalación del SW.
// FIX: Todas las 36 páginas del catálogo están ahora en el pre-cache.
// Antes solo estaban las imágenes del Hero, dejando páginas 4-36 sin pre-cachear.
// En modo Standalone/PWA, el SW servía `null` o un fallback incorrecto para esas páginas.
const PRE_CACHE = [
  '/',
  '/manifest.json',
  // Hero floating product images
  '/catalogo_assets/olla_presion.png',
  '/catalogo_assets/jarra.png',
  '/catalogo_assets/cuchillo_chef.png',
  '/catalogo_assets/licuadora.png',
  '/catalogo_assets/multipan.png',
  '/catalogo_assets/Expertea.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // ── Todas las páginas del catálogo (36 páginas) ──────────────────────────────
  // Pre-cacheadas en install para garantizar disponibilidad inmediata en Standalone.
  // Sin esto, las páginas 4-36 solo se cacheaban al visitarlas por primera vez,
  // causando que el SW devolviera null o el fallback '/' en sesiones posteriores.
  '/catalogo_pages/webp/page-01.webp',
  '/catalogo_pages/webp/page-02.webp',
  '/catalogo_pages/webp/page-03.webp',
  '/catalogo_pages/webp/page-04.webp',
  '/catalogo_pages/webp/page-05.webp',
  '/catalogo_pages/webp/page-06.webp',
  '/catalogo_pages/webp/page-07.webp',
  '/catalogo_pages/webp/page-08.webp',
  '/catalogo_pages/webp/page-09.webp',
  '/catalogo_pages/webp/page-10.webp',
  '/catalogo_pages/webp/page-11.webp',
  '/catalogo_pages/webp/page-12.webp',
  '/catalogo_pages/webp/page-13.webp',
  '/catalogo_pages/webp/page-14.webp',
  '/catalogo_pages/webp/page-15.webp',
  '/catalogo_pages/webp/page-16.webp',
  '/catalogo_pages/webp/page-17.webp',
  '/catalogo_pages/webp/page-18.webp',
  '/catalogo_pages/webp/page-19.webp',
  '/catalogo_pages/webp/page-20.webp',
  '/catalogo_pages/webp/page-21.webp',
  '/catalogo_pages/webp/page-22.webp',
  '/catalogo_pages/webp/page-23.webp',
  '/catalogo_pages/webp/page-24.webp',
  '/catalogo_pages/webp/page-25.webp',
  '/catalogo_pages/webp/page-26.webp',
  '/catalogo_pages/webp/page-27.webp',
  '/catalogo_pages/webp/page-28.webp',
  '/catalogo_pages/webp/page-29.webp',
  '/catalogo_pages/webp/page-30.webp',
  '/catalogo_pages/webp/page-31.webp',
  '/catalogo_pages/webp/page-32.webp',
  '/catalogo_pages/webp/page-33.webp',
  '/catalogo_pages/webp/page-34.webp',
  '/catalogo_pages/webp/page-35.webp',
  '/catalogo_pages/webp/page-36.webp',
];

// ─── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    // Use individual fetch+put instead of addAll so a single failed image
    // doesn't abort the entire pre-cache installation.
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(
        PRE_CACHE.map(url =>
          fetch(url, { cache: 'no-store' })
            .then(res => { if (res.ok) cache.put(url, res); })
            .catch(() => { /* silently skip unavailable assets */ })
        )
      )
    )
  );
  // Activate the new SW immediately without waiting for tabs to close.
  self.skipWaiting();
});

// ─── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    // Delete ALL caches from previous SW versions so stale data is fully cleared.
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  // Take immediate control of all open tabs.
  self.clients.claim();
});

// ─── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only intercept same-origin requests.
  if (url.origin !== location.origin) return;

  // 1. Next.js data fetching routes — NetworkFirst.
  //    FIX: These were previously falling through to cacheFirst or the default
  //    network-only handler. In Standalone mode, a stale /_next/data response
  //    caused the JS bundle to reference old product data, silently breaking
  //    pages 4+ because catalogProductsData was serialized from the stale bundle.
  //    NetworkFirst guarantees fresh JS logic on every session open.
  if (url.pathname.startsWith('/_next/data/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // 2. Next.js static JS/CSS with content hash — CacheFirst.
  //    Files are immutable (hash in filename). Safe to serve from cache forever.
  //    When a new build deploys, Next.js generates new hashes → browser fetches fresh files.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // 3. HTML navigation — StaleWhileRevalidate.
  //    Serves cached shell immediately (offline ✓) and updates in background.
  if (event.request.mode === 'navigate') {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // 4. Catalog pages and static image assets — StaleWhileRevalidate.
  //    All 36 catalog pages are pre-cached at install, so this always hits cache
  //    on first access. The background revalidation keeps them fresh after deploys.
  if (
    url.pathname.startsWith('/catalogo_pages/') ||
    url.pathname.startsWith('/catalogo_assets/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|woff2?)$/)
  ) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // 5. Everything else — always from the network (API calls, etc.)
  event.respondWith(fetch(event.request));
});

// ─── Estrategias de caché ──────────────────────────────────────────────────────

/** NetworkFirst: tries network first; falls back to cache on failure. 
 *  Used for data routes where freshness is critical. */
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || cache.match('/');
  }
}

/** StaleWhileRevalidate: serves cache instantly; refreshes in background for next visit. */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then(response => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  // Return cache if available; otherwise wait for network; fallback to '/' offline.
  return cached || networkPromise || cache.match('/');
}

/** CacheFirst: serves from cache if available; fetches and caches on miss. */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.status === 200) {
    cache.put(request, response.clone());
  }
  return response;
}
