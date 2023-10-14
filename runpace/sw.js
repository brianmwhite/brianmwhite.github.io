const cacheName = 'runpace-v2.10';

const precacheResources = [
  './',
  './index.html',
  './styles.css',
  './calc.js',
  './main.js',
  './apple-touch-icon.png',
  './manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!');
  //check if there is a new version of the app and clear the local storage
  sendMessageWithVersion(event);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
          return cacheName.startsWith('runpace-');
        }).map((cacheName) => {
          return caches.delete(cacheName);
        }),
      );
    }).then(function () {
      return self.clients.claim();
    }));
});

self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }),
  );
  sendMessageWithVersion(event);
});

function sendMessageWithVersion(event) {
  event.waitUntil(
    (async () => {
      // Exit early if we don't have access to the client.
      // Eg, if it's cross-origin.
      if (!event.clientId) return;

      // Get the client.
      const client = await clients.get(event.clientId);
      // Exit early if we don't get the client.
      // Eg, if it closed.
      if (!client) return;

      // Send a message to the client.
      client.postMessage({
        msg: cacheName,
        url: event.request.url,
      });
    })()
  );
}