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
