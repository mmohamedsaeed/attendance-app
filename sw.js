const CACHE = 'attendance-shell-v1';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r=e.request;
  if(r.method !== 'GET') return;
  const u=new URL(r.url);
  if(u.origin !== self.location.origin) return;
  e.respondWith(caches.match(r).then(cached => cached || fetch(r).then(res => { const copy=res.clone(); caches.open(CACHE).then(c=>c.put(r,copy)); return res; }).catch(()=>caches.match('./index.html'))));
});
