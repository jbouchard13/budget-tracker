// establish files that need to be saved to the cache
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/images/icons/icon-192x192.png',
  '/assets/images/icons/icon-512x512.png',
  '/assets/js/app.js',
  '/manifest.webmanifest',
];

// establish the cache and data cache names
const CACHE_NAME = 'static-cache';
const DATA_CACHE_NAME = 'data-cache';

// add an event listener to install the files to the cache
self.addEventListener('install', (event) => {
  // wait for the caches to finish opening and installing
  event.waitUntil(
    // opens static cache and adds all files to be stored
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Files pre-cached');
      // store all the files from the array
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // make the service worker stp waiting
  self.skipWaiting();
});

// event to remove old cache data if changes have been made
self.addEventListener('activate', (event) => {
  // wait until the caches are returned
  event.waitUntil(
    // create keys for the cache entries
    caches.keys().then((keyList) => {
      // map over the list of keys
      return Promise.all(
        keyList.map((key) => {
          // compare the cached keys to the new ones
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('Removing old cache data', key);
            // if the cache names don't match, they will be removed
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// when a fetch request is run
self.addEventListener('fetch', (event) => {
  // checks if the request is to an api route
  if (event.request.url.includes('/api/')) {
    console.log('[Service Worker] Fetch (data)', event.request.url);
    // opens the data cache to store the data from the api
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }

            return response;
          })
          .catch((err) => {
            // Network request failed, try to get it from the cache.
            // console.log();
            return cache.match(event.request);
          });
      })
    );

    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        return response || fetch(event.request);
      });
    })
  );
});
