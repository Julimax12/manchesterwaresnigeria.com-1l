"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Heart, Star } from "lucide-react"
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

  useEffect(() => {
    const savedCart = localStorage.getItem("mufc-cart")
    const savedWishlist = localStorage.getItem("mufc-wishlist")

    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
  }, [])

  const addToCart = (productId: number) => {
    const newCart = [...cart, productId]
    setCart(newCart)
    localStorage.setItem("mufc-cart", JSON.stringify(newCart))
  }

  const toggleWishlist = (productId: number) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId]

    setWishlist(newWishlist)
    localStorage.setItem("mufc-wishlist", JSON.stringify(newWishlist))
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
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="absolute inset-0 bg-black/30" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://i.pinimg.com/736x/dc/ac/67/dcac670b489dbbebc1cf46bbc60d95c0.jpg)",
          }}
          role="img"
          aria-label="Manchester United hero background"
        />
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">Official Manchester United Store Nigeria</h1>
            <p className="text-xl mb-8 animate-fade-in-delay">
              Get authentic Manchester United merchandise delivered across Nigeria. Support the Red Devils with official
              gear and exclusive collections.
            </p>
            <Link href="/catalog" aria-label="Shop now in catalog">
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
              <Card key={product.id} className="transition-all duration-300">
                <div className="relative overflow-hidden">
                  <Link href={`/product/${product.id}`} aria-label={`View ${product.name}`}>
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2" aria-label={`Rated ${product.rating} out of 5`}>
                    <div className="flex" aria-hidden>
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
                    <Button size="sm" onClick={() => addToCart(product.id)} className="bg-red-600 hover:bg-red-700" aria-label={`Add ${product.name} to cart`}>
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
              <Link key={category.name} href={category.href} aria-label={`Browse ${category.name}`}>
                <Card className="cursor-pointer">
                  <div className="relative overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
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
          <Link href="/contact" aria-label="Go to contact page">
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
