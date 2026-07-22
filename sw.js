// SPK SAM — Service Worker offline-first
// Précache l'app + les librairies CDN pour un démarrage sans réseau (atelier).
const CACHE = 'spk-sam-v9-3';

// Ressources de l'app (même origine)
const APP_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo_spk.png'
];

// Librairies externes (CDN) — mises en cache au premier chargement en ligne
const CDN_ASSETS = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js',
  'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js',
  'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Open+Sans+Condensed:wght@700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // App assets : indispensables, on échoue si absent
    await cache.addAll(APP_ASSETS);
    // CDN : best-effort, on ne bloque pas l'install si un CDN est lent/down
    await Promise.allSettled(CDN_ASSETS.map(u =>
      fetch(u, { mode: 'no-cors' }).then(r => cache.put(u, r)).catch(() => {})
    ));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Stratégies :
// - Navigation (HTML)   : network-first, fallback cache (toujours la dernière version en ligne)
// - Tuiles carte OSM    : network-only (jamais en cache, trop volumineux et changeant)
// - Reste (JS/CSS/img)  : cache-first, fallback réseau + mise en cache à la volée
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Tuiles carto / OSM : on laisse passer, pas de cache
  if (/basemaps\.cartocdn\.com|tile\.openstreetmap|\.png.*\{|\/\d+\/\d+\/\d+/.test(url.href) &&
      (url.hostname.includes('cartocdn') || url.hostname.includes('openstreetmap'))) {
    return; // réseau direct
  }

  // Supabase API : toujours réseau (données live), jamais de cache
  if (url.hostname.includes('supabase.co')) return;

  // Navigation : network-first
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(r => {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(() => {});
          return r;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Reste : cache-first
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(r => {
        if (r && (r.ok || r.type === 'opaque')) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return r;
      }).catch(() => cached);
    })
  );
});

// Permet à la page de forcer l'activation d'un nouveau SW
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
