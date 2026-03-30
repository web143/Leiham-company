// CACHE_NAME is auto-updated by scripts/update-sw-version.js on every `npm run build`.
// Vercel runs prebuild before each deploy, so this value changes automatically.
const CACHE_NAME = 'leiham-mnd3yaav';

// Assets pre-cacheados en la instalación del SW
const PRE_CACHE = [
  '/',
  '/manifest.json',
  '/catalogo_assets/olla_presion.png',
  '/catalogo_assets/jarra.png',
  '/catalogo_assets/cuchillo_chef.png',
  '/catalogo_assets/licuadora.png',
  '/catalogo_assets/multipan.png',
  '/catalogo_assets/Expertea.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ─── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRE_CACHE))
  );
  // Activa el nuevo SW sin esperar a que se cierren las pestañas existentes
  self.skipWaiting();
});

// ─── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    // Borra todos los cachés de versiones anteriores del SW
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  // Toma control inmediato de todas las tabs abiertas
  self.clients.claim();
});

// ─── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Solo interceptar requests del mismo origen
  if (url.origin !== location.origin) return;

  // 1. Páginas HTML — Stale-While-Revalidate:
  //    Sirve del caché al instante (offline ✓) y actualiza en background.
  //    La próxima carga ya tiene el contenido nuevo del deploy.
  if (event.request.mode === 'navigate') {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // 2. JS/CSS de Next.js con hash — Cache-first:
  //    Los archivos tienen hash en el nombre (e.g. abc123.js), son inmutables.
  //    Si el build cambia el hash, el browser pide el archivo nuevo automáticamente.
  if (url.pathname.startsWith('/_next/static')) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // 3. Imágenes y assets estáticos — Stale-While-Revalidate
  if (
    url.pathname.startsWith('/catalogo_assets/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|woff2?)$/)
  ) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // 4. Todo lo demás — siempre de la red
  event.respondWith(fetch(event.request));
});

// ─── Estrategias de caché ──────────────────────────────────────────────────────

/** Sirve caché al instante; refresca en background para la próxima visita */
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

  // Devuelve caché si existe; si no, espera la red; fallback a '/' sin conexión
  return cached || networkPromise || cache.match('/');
}

/** Sirve del caché si existe; si no, pide a la red y cachea el resultado */
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
