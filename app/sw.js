var staticCacheName = 'demo-static-v1';
var allCaches = [
  staticCacheName
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(['/',
        'index.html',
        'scripts/main.js',
        'scripts/templates.js',
        'scripts/models/journey.js',
        'scripts/models/jroute.js',
        'scripts/views/journey.js',
        'scripts/views/jroute.js',
        'libs/idb.js',
        'libs/moment.min.js',
        'libs/jquery.js',
        'libs/lodash.compat.js',
        'libs/backbone.js',
        'libs/toastr.js',
        'scripts/controllers/main_controller.js',
        'scripts/controllers/transport_controller.js',
        'scripts/controllers/util.js',
        'styles/main.css',
        'styles/boostrap.css',
        'styles/styles.css',
        'styles/toastr.css']);
    })
  );
});


self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('demo-') &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
