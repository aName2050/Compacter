const OFFLINE_VERSION = 2;
const CACHE_NAME = 'offline';
const OFFLINE_URL = '/public/offline/offline.html';

self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            // Setting {cache: 'reload'} in the new request ensures that the
            // response isn't fulfilled from the HTTP cache; i.e., it will be
            // from the network.
            cache
                .add(new Request(OFFLINE_URL, { cache: 'reload' }))
                .then(() => {
                    console.log('cached: ', OFFLINE_URL);
                });
        })()
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            // Enable navigation preload if it's supported.
            if ('navigationPreload' in self.registration) {
                await self.registration.navigationPreload.enable();
            }
        })()
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    const preloadResponse = await event.preloadResponse;
                    if (preloadResponse) {
                        return preloadResponse;
                    }

                    // Always try the network first.
                    const networkResponse = await fetch(event.request);
                    return networkResponse;
                } catch (error) {
                    console.log(
                        'Fetch failed; returning offline page instead.',
                        error
                    );

                    const cache = await caches.open(CACHE_NAME);
                    const cachedResponse = await cache.match(OFFLINE_URL);
                    return cachedResponse;
                }
            })()
        );
    }
});
