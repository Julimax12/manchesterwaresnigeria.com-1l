"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Smartphone,
  Download,
  Wifi,
  Bell,
  Zap,
  Shield,
  FolderSyncIcon as Sync,
  HardDrive,
  Settings,
  RefreshCw,
  Database,
} from "lucide-react"

export function PWAFeatures() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [backgroundSync, setBackgroundSync] = useState(false)
  const [cacheSize, setCacheSize] = useState(0)
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Check installation status
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    checkInstalled()

    // Check online status
    setIsOnline(navigator.onLine)
    window.addEventListener("online", () => setIsOnline(true))
    window.addEventListener("offline", () => setIsOnline(false))

    // Check notification permission
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted")
    }

    // Get service worker registration
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        setSwRegistration(registration)
      })
    }

    // Calculate cache size
    calculateCacheSize()

    return () => {
      window.removeEventListener("online", () => setIsOnline(true))
      window.removeEventListener("offline", () => setIsOnline(false))
    }
  }, [])

  const calculateCacheSize = async () => {
    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys()
        let totalSize = 0

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName)
          const requests = await cache.keys()

          for (const request of requests) {
            const response = await cache.match(request)
            if (response) {
              const blob = await response.blob()
              totalSize += blob.size
            }
          }
        }

        setCacheSize(Math.round((totalSize / 1024 / 1024) * 100) / 100) // MB
      } catch (error) {
        console.error("Error calculating cache size:", error)
      }
    }
  }

  const clearCache = async () => {
    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes("static")) {
              return caches.delete(cacheName)
            }
          }),
        )
        setCacheSize(0)
        alert("Cache cleared successfully!")
      } catch (error) {
        console.error("Error clearing cache:", error)
        alert("Failed to clear cache")
      }
    }
  }

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === "granted")
    } else {
      // Can't programmatically disable notifications, show instructions
      alert("To disable notifications, go to your browser settings or site permissions.")
    }
  }

  const toggleBackgroundSync = () => {
    setBackgroundSync(!backgroundSync)
    // In a real app, you'd register/unregister background sync here
  }

  const forceUpdate = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" })
      window.location.reload()
    } else {
      window.location.reload()
    }
  }

  const features = [
    {
      icon: Smartphone,
      title: "App-like Experience",
      description: "Full-screen experience without browser UI",
      status: isInstalled ? "Active" : "Available",
      color: isInstalled ? "green" : "blue",
    },
    {
      icon: Wifi,
      title: "Offline Browsing",
      description: "Browse products even without internet",
      status: "Active",
      color: "green",
    },
    {
      icon: Bell,
      title: "Push Notifications",
      description: "Get notified about new products and offers",
      status: notificationsEnabled ? "Enabled" : "Disabled",
      color: notificationsEnabled ? "green" : "gray",
    },
    {
      icon: Sync,
      title: "Background Sync",
      description: "Sync cart and wishlist when back online",
      status: backgroundSync ? "Enabled" : "Disabled",
      color: backgroundSync ? "green" : "gray",
    },
    {
      icon: Zap,
      title: "Fast Loading",
      description: "Instant loading with smart caching",
      status: "Active",
      color: "green",
    },
    {
      icon: Shield,
      title: "Secure",
      description: "HTTPS and secure data handling",
      status: "Active",
      color: "green",
    },
  ]

  return (
    <div className="space-y-6">
      {/* PWA Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-red-600" />
            PWA Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  isInstalled ? "bg-green-100" : "bg-blue-100"
                }`}
              >
                <Smartphone className={`h-6 w-6 ${isInstalled ? "text-green-600" : "text-blue-600"}`} />
              </div>
              <p className="font-medium">{isInstalled ? "Installed" : "Web Version"}</p>
              <p className="text-sm text-gray-600">
                {isInstalled ? "Running as app" : "Install for better experience"}
              </p>
            </div>

            <div className="text-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  isOnline ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <Wifi className={`h-6 w-6 ${isOnline ? "text-green-600" : "text-red-600"}`} />
              </div>
              <p className="font-medium">{isOnline ? "Online" : "Offline"}</p>
              <p className="text-sm text-gray-600">{isOnline ? "All features available" : "Limited functionality"}</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <HardDrive className="h-6 w-6 text-blue-600" />
              </div>
              <p className="font-medium">{cacheSize} MB</p>
              <p className="text-sm text-gray-600">Cached data</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature List */}
      <Card>
        <CardHeader>
          <CardTitle>PWA Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      feature.color === "green"
                        ? "bg-green-100"
                        : feature.color === "blue"
                          ? "bg-blue-100"
                          : "bg-gray-100"
                    }`}
                  >
                    <feature.icon
                      className={`h-5 w-5 ${
                        feature.color === "green"
                          ? "text-green-600"
                          : feature.color === "blue"
                            ? "text-blue-600"
                            : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
                <Badge variant={feature.status === "Active" || feature.status === "Enabled" ? "default" : "secondary"}>
                  {feature.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>PWA Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="font-medium">
                Push Notifications
              </Label>
              <p className="text-sm text-gray-600">Receive updates about products and orders</p>
            </div>
            <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={toggleNotifications} />
          </div>

          {/* Background Sync Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="background-sync" className="font-medium">
                Background Sync
              </Label>
              <p className="text-sm text-gray-600">Sync data when connection is restored</p>
            </div>
            <Switch id="background-sync" checked={backgroundSync} onCheckedChange={toggleBackgroundSync} />
          </div>

          {/* Cache Management */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Cache Storage</Label>
              <p className="text-sm text-gray-600">{cacheSize} MB of cached data for offline browsing</p>
            </div>
            <Button variant="outline" size="sm" onClick={clearCache}>
              <Database className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
          </div>

          {/* Force Update */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">App Updates</Label>
              <p className="text-sm text-gray-600">Check for and install app updates</p>
            </div>
            <Button variant="outline" size="sm" onClick={forceUpdate}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Update App
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Installation Instructions */}
      {!isInstalled && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Download className="h-5 w-5" />
              Install MUFC Store App
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-blue-800">
                Install the MUFC Store app for the best shopping experience with offline browsing, push notifications,
                and faster loading.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Chrome/Edge (Desktop)</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Click the install button in the address bar</li>
                    <li>2. Or use the "Install App" prompt</li>
                    <li>3. Click "Install" to add to your desktop</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Safari (iOS)</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Tap the share button (⬆️)</li>
                    <li>2. Select "Add to Home Screen"</li>
                    <li>3. Tap "Add" to install</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
