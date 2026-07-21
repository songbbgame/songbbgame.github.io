const 缓存名 = 'dor-office-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (事件) => {
  事件.waitUntil(Promise.all([
    caches.keys().then((名称们) => Promise.all(名称们.filter((名称) => 名称.startsWith('dor-office-') && 名称 !== 缓存名).map((名称) => caches.delete(名称)))),
    self.clients.claim()
  ]));
});

function 应缓存(请求) {
  if (请求.method !== 'GET') return false;
  const 地址 = new URL(请求.url);
  let 路径 = 地址.pathname;
  try { 路径 = decodeURIComponent(路径); } catch {}
  return 路径.includes('/办公室_LOD_600万_100万/') ||
    路径.includes('/203songbbgame办公室-07-分支1碰撞.obj') ||
    地址.origin === self.location.origin && 地址.pathname.startsWith('/assets/');
}

self.addEventListener('fetch', (事件) => {
  if (!应缓存(事件.request)) return;
  事件.respondWith((async () => {
    const 缓存 = await caches.open(缓存名);
    const 已有 = await 缓存.match(事件.request);
    if (已有) return 已有;
    const 响应 = await fetch(事件.request);
    if (响应.ok || 响应.type === 'opaque') {
      try { await 缓存.put(事件.request, 响应.clone()); } catch {}
    }
    return 响应;
  })());
});
