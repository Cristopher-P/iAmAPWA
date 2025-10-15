const CACHE_NAME = 'iamapwa-v4';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';

const staticAssets = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/manifest.json',
  '/offline.html'
];

// Instalación - Cache App Shell
self.addEventListener('install', (event) => {
  console.log('Service Worker instalando');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Cacheando App Shell');
        return cache.addAll(staticAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación
self.addEventListener('activate', (event) => {
  console.log('Service Worker activando');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('Eliminando cache viejo:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategias de Fetch
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache First para App Shell
  if (url.origin === location.origin && staticAssets.some(asset => url.pathname.endsWith(asset))) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request)
            .then(fetchResponse => {
              return caches.open(STATIC_CACHE)
                .then(cache => {
                  cache.put(event.request, fetchResponse.clone());
                  return fetchResponse;
                });
            });
        })
    );
    return;
  }
  
  // Stale-While-Revalidate para imágenes
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              return caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(event.request, networkResponse.clone());
                  return networkResponse;
                });
            })
            .catch(() => cachedResponse);
          return cachedResponse || fetchPromise;
        })
    );
    return;
  }
  
  // Network First para datos API
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          return caches.open(DYNAMIC_CACHE)
            .then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Fallback para rutas no cacheadas
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Para rutas SPA, devolver index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        return new Response('No hay conexión', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain' })
        });
      })
  );
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-activities') {
    console.log('Background Sync ejecutándose para actividades');
    event.waitUntil(syncPendingActivities());
  }
});

async function syncPendingActivities() {
  try {
    // En una app real, aquí obtendrías las actividades de IndexedDB
    // y las enviarías al servidor
    console.log('Sincronizando actividades en background...');
    
    // Notificar a todos los clients
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETED',
        message: 'Actividades sincronizadas en segundo plano'
      });
    });
  } catch (error) {
    console.error('Error en background sync:', error);
  }
}

// Push Notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  let data;
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'iAmAPWA',
      body: event.data.text() || 'Nueva notificación'
    };
  }
  
  const options = {
    body: data.body || 'Tienes actividades pendientes de sincronizar',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'view',
        title: 'Ver App'
      },
      {
        action: 'close',
        title: 'Cerrar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'iAmAPWA', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});