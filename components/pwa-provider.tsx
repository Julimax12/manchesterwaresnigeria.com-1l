"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Download, Wifi, WifiOff, RefreshCw, Bell } from "lucide-react"

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

interface PWAProviderProps {
  children: React.ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    checkInstalled()

    // Online/offline status
    const handleOnline = () => {
      setIsOnline(true)
      // Trigger background sync when coming back online
      if (swRegistration && "sync" in swRegistration) {
        swRegistration.sync.register("cart-sync").catch(console.error)
        swRegistration.sync.register("wishlist-sync").catch(console.error)
      }
    }

    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // App installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("appinstalled", handleAppInstalled)

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration)
          setSwRegistration(registration)

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  setShowUpdatePrompt(true)
                }
              })
            }
          })

          // Register for periodic sync if supported
          if ("periodicSync" in registration) {
            ;(registration as any).periodicSync
              .register("price-updates", {
                minInterval: 24 * 60 * 60 * 1000, // 24 hours
              })
              .catch((error: any) => {
                console.log("Periodic sync registration failed:", error)
              })
          }
        })
        .catch((error) => {
          console.log("SW registration failed:", error)
        })

      // Listen for service worker messages
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "CACHE_UPDATED") {
          // Handle cache updates
          console.log("Cache updated:", event.data.payload)
        }
      })
    }

    // Check notification permission
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission)
    }

    // Initialize online status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [swRegistration])

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setShowInstallPrompt(false)
        setDeferredPrompt(null)
      }
    }
  }

  const updateApp = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" })
      window.location.reload()
    }
  }

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)

      if (permission === "granted" && swRegistration) {
        // Subscribe to push notifications
        try {
          const subscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""),
          })

          // Send subscription to server
          await fetch("/api/push/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subscription),
          })

          // Show welcome notification
          new Notification("MUFC Store Notifications Enabled", {
            body: "You'll now receive updates about new products and special offers!",
            icon: "/icon-192x192.png",
            badge: "/badge-72x72.png",
          })
        } catch (error) {
          console.error("Push subscription failed:", error)
        }
      }
    }
  }

  const addToHomeScreen = () => {
    // For iOS Safari
    if ((navigator as any).standalone === false) {
      alert('To install this app on your iOS device, tap the share button and then "Add to Home Screen".')
    }
  }

  return (
    <>
      {children}

      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white text-center py-2 px-4 flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span>You're offline. Some features may be limited.</span>
          <Badge variant="secondary" className="bg-yellow-600 text-white">
            PWA Mode
          </Badge>
        </div>
      )}

      {/* Online Banner (brief) */}
      {isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white text-center py-1 px-4 flex items-center justify-center gap-2 transition-all duration-300">
          <Wifi className="h-4 w-4" />
          <span className="text-sm">Back online</span>
        </div>
      )}

      {/* Install PWA Prompt */}
      {showInstallPrompt && !isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Download className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-red-900 mb-1">Install MUFC Store App</h3>
                  <p className="text-sm text-red-700 mb-3">
                    Get faster access, offline browsing, and push notifications!
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={installPWA} className="bg-red-600 hover:bg-red-700">
                      Install
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowInstallPrompt(false)}>
                      Later
                    </Button>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setShowInstallPrompt(false)} className="text-red-600">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* App Update Prompt */}
      {showUpdatePrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900 mb-1">App Update Available</h3>
                  <p className="text-sm text-blue-700 mb-3">A new version is ready with improvements and bug fixes.</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={updateApp} className="bg-blue-600 hover:bg-blue-700">
                      Update Now
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowUpdatePrompt(false)}>
                      Later
                    </Button>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setShowUpdatePrompt(false)} className="text-blue-600">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notification Permission Prompt */}
      {isInstalled && notificationPermission === "default" && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Bell className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-purple-900 mb-1">Enable Notifications</h3>
                  <p className="text-sm text-purple-700 mb-3">
                    Get notified about new products, sales, and order updates.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={requestNotificationPermission}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Enable
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setNotificationPermission("denied")}>
                      Not Now
                    </Button>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setNotificationPermission("denied")}
                  className="text-purple-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* iOS Install Hint */}
      {!isInstalled && /iPad|iPhone|iPod/.test(navigator.userAgent) && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-medium text-gray-900 mb-2">Install MUFC Store</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Tap the share button <span className="font-mono">⬆️</span> and select "Add to Home Screen"
                </p>
                <Button size="sm" variant="outline" onClick={() => setShowInstallPrompt(false)}>
                  Got it
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
