const CACHE_NAME = "mufc-store-v2.1"
const STATIC_CACHE = "mufc-static-v2.1"
const DYNAMIC_CACHE = "mufc-dynamic-v2.1"
const IMAGE_CACHE = "mufc-images-v2.1"

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/catalog",
  "/about",
  "/contact",
  "/bulk-order",
  "/offline",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/_next/static/css/app/layout.css",
  "/_next/static/chunks/webpack.js",
  "/_next/static/chunks/main.js",
]

// API endpoints to cache
const API_CACHE_PATTERNS = [/\/api\/products/, /\/api\/categories/, /\/api\/reviews/]

// Image patterns to cache
const IMAGE_PATTERNS = [/\.(?:png|jpg|jpeg|svg|gif|webp)$/, /pinimg\.com/, /blob\.v0\.dev/]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("SW: Installing service worker")

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("SW: Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      }),
      // Skip waiting to activate immediately
      self.skipWaiting(),
    ]),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("SW: Activating service worker")

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (
                cacheName !== CACHE_NAME &&
                cacheName !== STATIC_CACHE &&
                cacheName !== DYNAMIC_CACHE &&
                cacheName !== IMAGE_CACHE
              ) {
                console.log("SW: Deleting old cache:", cacheName)
                return caches.delete(cacheName)
              }
            }),
          )
        }),
      // Take control of all clients
      self.clients.claim(),
    ]),
  )
})

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith("http")) {
    return
  }

  event.respondWith(handleFetch(request))
})

async function handleFetch(request) {
  const url = new URL(request.url)

  try {
    // Strategy 1: Static assets - Cache First
    if (STATIC_ASSETS.some((asset) => url.pathname === asset)) {
      return await cacheFirst(request, STATIC_CACHE)
    }

    // Strategy 2: Images - Cache First with fallback
    if (IMAGE_PATTERNS.some((pattern) => pattern.test(url.href))) {
      return await cacheFirstWithFallback(request, IMAGE_CACHE, "/placeholder.svg")
    }

    // Strategy 3: API calls - Network First with cache fallback
    if (API_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
      return await networkFirstWithCache(request, DYNAMIC_CACHE)
    }

    // Strategy 4: Navigation requests - Network First with offline fallback
    if (request.mode === "navigate") {
      return await networkFirstWithOffline(request)
    }

    // Strategy 5: Other resources - Stale While Revalidate
    return await staleWhileRevalidate(request, DYNAMIC_CACHE)
  } catch (error) {
    console.error("SW: Fetch error:", error)

    // Return offline page for navigation requests
    if (request.mode === "navigate") {
      return caches.match("/offline")
    }

    // Return cached version or throw error
    return caches.match(request) || Promise.reject(error)
  }
}

// Cache First strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  if (cached) {
    return cached
  }

  const response = await fetch(request)
  if (response.status === 200) {
    cache.put(request, response.clone())
  }

  return response
}

// Cache First with fallback
async function cacheFirstWithFallback(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)
    if (response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return caches.match(fallbackUrl)
  }
}

// Network First with cache fallback
async function networkFirstWithCache(request, cacheName) {
  const cache = await caches.open(cacheName)

  try {
    const response = await fetch(request)
    if (response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await cache.match(request)
    if (cached) {
      return cached
    }
    throw error
  }
}

// Network First with offline fallback
async function networkFirstWithOffline(request) {
  try {
    const response = await fetch(request)

    // Cache successful navigation responses
    if (response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    // Try to return cached version
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }

    // Return offline page
    return caches.match("/offline")
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  // Fetch in background to update cache
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.status === 200) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => {
      // Ignore fetch errors in background
    })

  // Return cached version immediately if available
  if (cached) {
    return cached
  }

  // Wait for network if no cache
  return fetchPromise
}

// Background Sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("SW: Background sync triggered:", event.tag)

  if (event.tag === "cart-sync") {
    event.waitUntil(syncCart())
  } else if (event.tag === "wishlist-sync") {
    event.waitUntil(syncWishlist())
  } else if (event.tag === "order-sync") {
    event.waitUntil(syncOrders())
  }
})

async function syncCart() {
  try {
    const pendingActions = await getStoredData("pending-cart-actions")
    if (pendingActions && pendingActions.length > 0) {
      // Process pending cart actions
      for (const action of pendingActions) {
        await processPendingAction(action)
      }
      // Clear pending actions
      await clearStoredData("pending-cart-actions")

      // Notify user
      self.registration.showNotification("Cart Synced", {
        body: "Your cart has been synchronized",
        icon: "/icon-192x192.png",
        badge: "/badge-72x72.png",
        tag: "cart-sync",
      })
    }
  } catch (error) {
    console.error("SW: Cart sync failed:", error)
  }
}

async function syncWishlist() {
  try {
    const pendingWishlist = await getStoredData("pending-wishlist-actions")
    if (pendingWishlist && pendingWishlist.length > 0) {
      // Process pending wishlist actions
      for (const action of pendingWishlist) {
        await processPendingAction(action)
      }
      await clearStoredData("pending-wishlist-actions")

      self.registration.showNotification("Wishlist Synced", {
        body: "Your wishlist has been synchronized",
        icon: "/icon-192x192.png",
        badge: "/badge-72x72.png",
        tag: "wishlist-sync",
      })
    }
  } catch (error) {
    console.error("SW: Wishlist sync failed:", error)
  }
}

async function syncOrders() {
  try {
    const pendingOrders = await getStoredData("pending-orders")
    if (pendingOrders && pendingOrders.length > 0) {
      for (const order of pendingOrders) {
        await submitOrder(order)
      }
      await clearStoredData("pending-orders")

      self.registration.showNotification("Orders Submitted", {
        body: "Your offline orders have been submitted",
        icon: "/icon-192x192.png",
        badge: "/badge-72x72.png",
        tag: "order-sync",
      })
    }
  } catch (error) {
    console.error("SW: Order sync failed:", error)
  }
}

// Push notification handling
self.addEventListener("push", (event) => {
  console.log("SW: Push notification received")

  let notificationData = {
    title: "MUFC Store",
    body: "You have a new notification",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    image: "/notification-image.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View",
        icon: "/action-explore.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/action-close.png",
      },
    ],
    requireInteraction: false,
    silent: false,
  }

  if (event.data) {
    try {
      const pushData = event.data.json()
      notificationData = { ...notificationData, ...pushData }
    } catch (error) {
      notificationData.body = event.data.text()
    }
  }

  event.waitUntil(self.registration.showNotification(notificationData.title, notificationData))
})

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("SW: Notification clicked:", event.notification.tag)

  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow(event.notification.data?.url || "/"))
  } else if (event.action === "close") {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url === self.registration.scope && "focus" in client) {
            return client.focus()
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow("/")
        }
      }),
    )
  }
})

// Notification close handling
self.addEventListener("notificationclose", (event) => {
  console.log("SW: Notification closed:", event.notification.tag)

  // Track notification dismissal
  event.waitUntil(
    fetch("/api/analytics/notification-dismissed", {
      method: "POST",
      body: JSON.stringify({
        tag: event.notification.tag,
        timestamp: Date.now(),
      }),
    }).catch(() => {
      // Ignore analytics errors
    }),
  )
})

// Periodic Background Sync (if supported)
self.addEventListener("periodicsync", (event) => {
  console.log("SW: Periodic sync triggered:", event.tag)

  if (event.tag === "price-updates") {
    event.waitUntil(updatePrices())
  } else if (event.tag === "inventory-check") {
    event.waitUntil(checkInventory())
  }
})

// Helper functions
async function getStoredData(key) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    const response = await cache.match(`/sw-data/${key}`)
    if (response) {
      return await response.json()
    }
  } catch (error) {
    console.error("SW: Error getting stored data:", error)
  }
  return null
}

async function storeData(key, data) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    const response = new Response(JSON.stringify(data))
    await cache.put(`/sw-data/${key}`, response)
  } catch (error) {
    console.error("SW: Error storing data:", error)
  }
}

async function clearStoredData(key) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    await cache.delete(`/sw-data/${key}`)
  } catch (error) {
    console.error("SW: Error clearing stored data:", error)
  }
}

async function processPendingAction(action) {
  // Process pending cart/wishlist actions when back online
  try {
    const response = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action),
    })
    return response.ok
  } catch (error) {
    console.error("SW: Error processing pending action:", error)
    return false
  }
}

async function submitOrder(order) {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
    return response.ok
  } catch (error) {
    console.error("SW: Error submitting order:", error)
    return false
  }
}

async function updatePrices() {
  try {
    const response = await fetch("/api/prices/latest")
    if (response.ok) {
      const prices = await response.json()
      await storeData("latest-prices", prices)
    }
  } catch (error) {
    console.error("SW: Error updating prices:", error)
  }
}

async function checkInventory() {
  try {
    const response = await fetch("/api/inventory/status")
    if (response.ok) {
      const inventory = await response.json()
      await storeData("inventory-status", inventory)

      // Check for low stock items
      const lowStockItems = inventory.filter((item) => item.stock < 5)
      if (lowStockItems.length > 0) {
        self.registration.showNotification("Low Stock Alert", {
          body: `${lowStockItems.length} items are running low`,
          icon: "/icon-192x192.png",
          badge: "/badge-72x72.png",
          tag: "low-stock",
        })
      }
    }
  } catch (error) {
    console.error("SW: Error checking inventory:", error)
  }
}

// Cache size management
async function manageCacheSize(cacheName, maxItems = 100) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()

  if (keys.length > maxItems) {
    // Remove oldest items
    const itemsToDelete = keys.slice(0, keys.length - maxItems)
    await Promise.all(itemsToDelete.map((key) => cache.delete(key)))
  }
}

// Periodic cache cleanup
setInterval(() => {
  manageCacheSize(IMAGE_CACHE, 50)
  manageCacheSize(DYNAMIC_CACHE, 100)
}, 60000) // Every minute
