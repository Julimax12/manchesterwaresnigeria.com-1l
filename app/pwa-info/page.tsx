"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PWAFeatures } from "@/components/pwa-features"
import {
  Smartphone,
  Wifi,
  Bell,
  Download,
  Zap,
  Shield,
  FolderSyncIcon as Sync,
  Package,
  Star,
  CheckCircle,
} from "lucide-react"

export default function PWAInfoPage() {
  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant loading with smart caching technology",
      color: "yellow",
    },
    {
      icon: Wifi,
      title: "Works Offline",
      description: "Browse products and manage cart without internet",
      color: "blue",
    },
    {
      icon: Bell,
      title: "Push Notifications",
      description: "Get notified about new products and special offers",
      color: "purple",
    },
    {
      icon: Smartphone,
      title: "App-like Experience",
      description: "Full-screen experience without browser clutter",
      color: "green",
    },
    {
      icon: Sync,
      title: "Background Sync",
      description: "Automatically sync when connection is restored",
      color: "blue",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "HTTPS encryption and secure data handling",
      color: "green",
    },
  ]

  const features = [
    "Install directly from browser - no app store needed",
    "Automatic updates in the background",
    "Offline product browsing and cart management",
    "Push notifications for deals and updates",
    "Fast loading with intelligent caching",
    "Native app-like navigation and gestures",
    "Background sync when connection returns",
    "Secure HTTPS encryption",
    "Cross-platform compatibility",
    "Small storage footprint",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Progressive Web App</h1>
            <p className="text-xl text-red-100 mb-8">
              Experience the MUFC Store like never before with our advanced PWA technology
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-white/20 text-white border-white/30">
                <Download className="h-4 w-4 mr-2" />
                Installable
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <Wifi className="h-4 w-4 mr-2" />
                Offline Ready
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <Star className="h-4 w-4 mr-2" />
                App-like
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Benefits Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our PWA?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      benefit.color === "yellow"
                        ? "bg-yellow-100"
                        : benefit.color === "blue"
                          ? "bg-blue-100"
                          : benefit.color === "purple"
                            ? "bg-purple-100"
                            : "bg-green-100"
                    }`}
                  >
                    <benefit.icon
                      className={`h-8 w-8 ${
                        benefit.color === "yellow"
                          ? "text-yellow-600"
                          : benefit.color === "blue"
                            ? "text-blue-600"
                            : benefit.color === "purple"
                              ? "text-purple-600"
                              : "text-green-600"
                      }`}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features List */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-red-600" />
                PWA Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Technical Excellence</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Performance</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">95+</div>
                <p className="text-gray-600">Lighthouse Score</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Performance</span>
                    <span className="font-medium">98</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Accessibility</span>
                    <span className="font-medium">96</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Best Practices</span>
                    <span className="font-medium">100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>SEO</span>
                    <span className="font-medium">100</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Caching Strategy</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">5</div>
                <p className="text-gray-600">Cache Layers</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div>Static Assets Cache</div>
                  <div>Dynamic Content Cache</div>
                  <div>Image Cache</div>
                  <div>API Response Cache</div>
                  <div>Background Sync Queue</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Offline Support</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
                <p className="text-gray-600">Core Features</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div>Product Browsing</div>
                  <div>Cart Management</div>
                  <div>Wishlist Updates</div>
                  <div>Search Functionality</div>
                  <div>Background Sync</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* PWA Features Component */}
        <PWAFeatures />
      </div>
    </div>
  )
}
