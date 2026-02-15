const CACHE_NAME = 'mailmycertificate-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/tool',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    '/next.svg',
    '/globe.svg',
    '/window.svg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
