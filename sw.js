// MH Lab Inventory — Service Worker
// Caches the app shell for offline use and auto-updates when new version is pushed

const CACHE_NAME = 'mhlab-v1';
const ASSETS = [
  '/mhlab-inventory/',
  '/mhlab-inventory/index.html',
  '/mhlab-inventory/manifest.json'
];

// Install: cache core assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network first, fallback to cache
self.addEventListener('fetch', e => {
  // Skip Firebase and external requests — always fetch live
  if (e.request.url.includes('firebase') ||
      e.request.url.includes('googleapis') ||
      e.request.url.includes('gstatic') ||
      e.request.url.includes('fontawesome') ||
      e.request.url.includes('cloudflare')) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache updated version
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// Listen for update messages from the main page
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
