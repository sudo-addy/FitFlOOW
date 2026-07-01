const CACHE_NAME = "fitfloow-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/favicon.svg",
  "/manifest.json",
  "/robots.txt"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell assets");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Clearing old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip API requests from standard cache-first; we want network-first for dynamic backend calls
  if (requestUrl.pathname.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If network fails, try cache fallback or return offline response
          return caches.match(event.request);
        })
    );
    return;
  }

  // Stale-while-revalidate strategy for frontend static routes/assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            event.request.method === "GET"
          ) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Silent catch for offline fetch errors
        });

      return cachedResponse || fetchPromise;
    })
  );
});
