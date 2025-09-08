const CACHE_NAME = "perpus-cache-v2"; // update versi cache biar fresh
const urlsToCache = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/laporan.html",
  "/style.css",
  "/index.js",
  "/script.js",
  "/images/logo.gif",
  "/images/2.jpeg",
  "/images/logo-192.png",
  "/images/logo-512.png"
];

// Install: cache semua file
self.addEventListener("install", (event) => {
  console.log("[SW] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching app shell");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate: hapus cache lama
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("[SW] Hapus cache lama:", name);
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: ambil dari cache dulu, fallback ke network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached; // pakai cache dulu
      }
      return fetch(event.request)
        .then((res) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, res.clone());
            return res;
          });
        })
        .catch(() => {
          console.log("[SW] Gagal fetch & tidak ada cache:", event.request.url);
        });
    })
  );
});
