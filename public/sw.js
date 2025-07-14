const CACHE_NAME = "beautybook-v1";
const STATIC_CACHE = "beautybook-static-v1";
const DYNAMIC_CACHE = "beautybook-dynamic-v1";

// Assets to cache immediately
const CACHE_URLS = [
  "/",
  "/client/global.css",
  "/placeholder.svg",
  "/offline.html",
];

// API endpoints to cache
const API_CACHE_PATTERNS = [/\/api\/services/, /\/api\/salons/, /\/api\/demo/];

self.addEventListener("install", (event) => {
  console.log("SW: Install event");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("SW: Caching static assets");
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        return self.skipWaiting();
      }),
  );
});

self.addEventListener("activate", (event) => {
  console.log("SW: Activate event");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("SW: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        return self.clients.claim();
      }),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle static assets
  event.respondWith(handleStaticRequest(request));
});

async function handleApiRequest(request) {
  const url = new URL(request.url);

  // Check if this API should be cached
  const shouldCache = API_CACHE_PATTERNS.some((pattern) =>
    pattern.test(url.pathname),
  );

  if (shouldCache && request.method === "GET") {
    try {
      // Try network first
      const networkResponse = await fetch(request.clone());

      if (networkResponse.ok) {
        // Cache successful response
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
        return networkResponse;
      }
    } catch (error) {
      console.log("SW: Network failed, trying cache");
    }

    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  // For POST requests or non-cached APIs, try network only
  try {
    return await fetch(request);
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Network unavailable",
        offline: true,
        message: "This action will be synced when you come back online",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Fallback to cached page or offline page
    const cachedResponse = await caches.match("/");
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline fallback
    return caches.match("/offline.html");
  }
}

async function handleStaticRequest(request) {
  // Cache first strategy for static assets
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Return a fallback for failed image requests
    if (request.destination === "image") {
      return caches.match("/placeholder.svg");
    }

    throw error;
  }
}

// Handle background sync
self.addEventListener("sync", (event) => {
  console.log("SW: Background sync event", event.tag);

  if (event.tag === "bookings-sync") {
    event.waitUntil(syncBookings());
  }
});

async function syncBookings() {
  // This would typically sync with the offline service
  console.log("SW: Syncing bookings in background");

  try {
    // Notify the main thread to sync
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: "SYNC_BOOKINGS",
      });
    });
  } catch (error) {
    console.error("SW: Sync failed", error);
  }
}

// Handle push notifications for booking updates
self.addEventListener("push", (event) => {
  console.log("SW: Push event");

  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body || "Your booking has been updated",
      icon: "/icon-192x192.png",
      badge: "/badge-72x72.png",
      tag: "booking-update",
      data: data.bookingId,
      actions: [
        {
          action: "view",
          title: "View Booking",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "BeautyBook", options),
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(clients.openWindow(`/bookings/${event.notification.data}`));
  }
});
