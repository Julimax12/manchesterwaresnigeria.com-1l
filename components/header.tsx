"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart, Heart, Search, Smartphone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UserMenu } from "@/components/user-menu"

export function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if PWA is installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    checkInstalled()

    // Update cart and wishlist counts
    const updateCounts = () => {
      const cart = JSON.parse(localStorage.getItem("mufc-cart") || "[]")
      const wishlist = JSON.parse(localStorage.getItem("mufc-wishlist") || "[]")
      setCartCount(cart.length)
      setWishlistCount(wishlist.length)
    }

    updateCounts()
    window.addEventListener("storage", updateCounts)

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("storage", updateCounts)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Catalog", href: "/catalog" },
    { name: "Products", href: "/products" },
    { name: "Bulk Orders", href: "/bulk-order" },
    { name: "PWA Info", href: "/pwa-info" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-900/95 backdrop-blur-sm shadow-lg" : "bg-gray-900"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" aria-label="MUFC Nigeria Store home">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.png-RpUgUJav1RAaZmaqYnKWnaNwBItTVZ.webp"
              alt="Manchester United Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-lg">MUFC Nigeria Store</h1>
              {isInstalled && <Badge className="bg-green-600 text-white text-xs">PWA</Badge>}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Primary">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-red-400 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden lg:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" aria-hidden />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-64 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  aria-label="Search products"
                />
              </div>
            </div>

            {/* PWA Install Indicator */}
            {!isInstalled && (
              <Link href="/pwa-info">
                <Button variant="ghost" size="sm" className="text-white hover:text-red-400" aria-label="PWA info">
                  <Smartphone className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Wishlist */}
            <Button variant="ghost" size="sm" className="text-white hover:text-red-400 relative" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 min-w-[1.25rem] h-5">
                  {wishlistCount}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="sm" className="text-white hover:text-red-400 relative" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 min-w-[1.25rem] h-5">
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* User Account */}
            <UserMenu />

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-white" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-900 text-white" aria-label="Mobile menu">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-white hover:text-red-400 transition-colors font-medium py-2"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-gray-700">
                    <Input
                      placeholder="Search products..."
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      aria-label="Search products"
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
