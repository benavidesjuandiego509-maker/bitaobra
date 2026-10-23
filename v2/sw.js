// Service worker: guarda la aplicación para que abra sin conexión en el frente de obra.
// Solo borra cachés de esta versión (prefijo bitaobra-v2-), para convivir con la versión 1 en el mismo dominio.
const CACHE = "bitaobra-v2-5";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./icon-192.png", "./icon-512.png", "./vendor/jspdf.umd.min.js"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("bitaobra-v2-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok && new URL(e.request.url).origin === location.origin) c.put(e.request, res.clone());
    return res;
  }).catch(() => c.match("./index.html")))));
});
