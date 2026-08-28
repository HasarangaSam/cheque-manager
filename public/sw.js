// ChequeManager PWA Service Worker
// Lightweight service worker for standalone PWA installability

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Pass-through fetch handler for GET requests only
// Non-GET requests (POST, Server Actions, API mutations) bypass the service worker completely
// to prevent Set-Cookie header stripping or redirect caching in PWA webviews.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }
  event.respondWith(fetch(event.request));
});
