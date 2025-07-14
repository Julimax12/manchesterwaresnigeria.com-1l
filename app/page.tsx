"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from "lucide-react"
import { products } from "@/lib/products-data"

const featuredProducts = products.slice(0, 4)

const categories = [
  {
    name: "Jerseys",
    image: "https://i.pinimg.com/736x/dd/2f/0b/dd2f0becc75596c3e2e3827006f305c7.jpg",
    href: "/catalog?category=jerseys",
  },
  {
    name: "Training Gear",
    image: "https://i.pinimg.com/736x/80/07/2e/80072e9464208d24e7b5fb4f8aa664f1.jpg",
    href: "/catalog?category=training",
  },
  {
    name: "Accessories",
    image: "https://i.pinimg.com/736x/5e/e3/af/5ee3af1f249b02372e9104a951e13a12.jpg",
    href: "/catalog?category=accessories",
  },
  {
    name: "Footwear",
    image: "https://i.pinimg.com/736x/6f/ce/3a/6fce3a2760bbb23aeb8f9cc1ddf2cf6c.jpg",
    href: "/catalog?category=footwear",
  },
  {
    name: "Kids Collection",
    image: "https://i.pinimg.com/736x/16/70/88/167088e0e0458b684ac9b32e1b81328d.jpg",
    href: "/catalog?category=kids",
  },
]

export default function HomePage() {
  const [cart, setCart] = useState<number[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // PWA install prompt
    let deferredPrompt: any
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      deferredPrompt = e
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Load cart and wishlist from localStorage
    const savedCart = localStorage.getItem("mufc-cart")
    const savedWishlist = localStorage.getItem("mufc-wishlist")

    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const addToCart = (productId: number) => {
    const newCart = [...cart, productId]
    setCart(newCart)
    localStorage.setItem("mufc-cart", JSON.stringify(newCart))

    // Show notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Added to Cart!", {
        body: "Item successfully added to your cart",
        icon: "/icon-192x192.png",
      })
    }
  }

  const toggleWishlist = (productId: number) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId]

    setWishlist(newWishlist)
    localStorage.setItem("mufc-wishlist", JSON.stringify(newWishlist))
  }

  const installPWA = async () => {
    const deferredPrompt = (window as any).deferredPrompt
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setShowInstallPrompt(false)
      }
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-yellow-500 text-white text-center py-2 px-4">
          You're offline. Some features may be limited.
        </div>
      )}

      {/* Install PWA Banner */}
      {showInstallPrompt && (
        <div className="bg-red-600 text-white text-center py-3 px-4 flex items-center justify-between">
          <span>Install MUFC Store app for better experience!</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={installPWA}>
              Install
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowInstallPrompt(false)}>
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="absolute inset-0 bg-black/30" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://i.pinimg.com/736x/dc/ac/67/dcac670b489dbbebc1cf46bbc60d95c0.jpg)",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">Official Manchester United Store Nigeria</h1>
            <p className="text-xl mb-8 animate-fade-in-delay">
              Get authentic Manchester United merchandise delivered across Nigeria. Support the Red Devils with official
              gear and exclusive collections.
            </p>
            <Link href="/catalog">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 animate-fade-in-delay-2">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="relative overflow-hidden">
                  <Link href={`/product/${product.id}`}>
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-red-600">{formatPrice(product.price)}</span>
                    <Button size="sm" onClick={() => addToCart(product.id)} className="bg-red-600 hover:bg-red-700">
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="relative overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold group-hover:text-red-600 transition-colors">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery across all 36 states in Nigeria</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Authentic Guarantee</h3>
              <p className="text-gray-600">100% genuine Manchester United merchandise</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">14-Day Returns</h3>
              <p className="text-gray-600">Easy returns within 14 days of purchase</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Join the Red Devils Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get exclusive offers and latest updates from Manchester United
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-red-600"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
