const CACHE = 'pilot-demo-v3'
const BASE = new URL(self.registration.scope).pathname
const APP_SHELL = [BASE, `${BASE}manifest.webmanifest`, `${BASE}icon.svg`]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((cached) => cached || (event.request.mode === 'navigate' ? caches.match(BASE) : undefined))
    )
  )
})
