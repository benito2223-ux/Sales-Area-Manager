// SW minimal — cleans old caches, passes all requests through to network
const CACHE = 'spk-sam-v4';

self.addEventListener('install', e => { self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// No fetch handler = browser handles all requests directly (no SW interference)
