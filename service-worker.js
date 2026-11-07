const CACHE_NAME = "anonymous-v1";

const APP_FILES = [
    "/",
    "/landing.html",
    "/index.html",
    "/manifest.json",
    "/Icons/icon-192.png",
    "/Icons/icon-512.png"    
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(APP_FILES);
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) return;

    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request).catch(async () => {
                const path = url.pathname;

                if (path === "/" || path === "/landing.html") {
                    return await caches.match("/landing.html");
                }

                if (path === "/index.html") {
                    return await caches.match("/index.html");
                }

                return await caches.match("/landing.html");
            })
        );
    }
});
