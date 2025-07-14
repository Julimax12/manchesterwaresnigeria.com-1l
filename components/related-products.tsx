"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { products, type Product } from "@/lib/products-data"

interface RelatedProductsProps {
  currentProductId: number
  category: string
  limit?: number
}

export function RelatedProducts({ currentProductId, category, limit = 4 }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])

  useEffect(() => {
    // Get related products from the same category, excluding current product
    const related = products
      .filter((product) => product.id !== currentProductId && product.category === category)
      .slice(0, limit)

    // If not enough products in same category, add from other categories
    if (related.length < limit) {
      const additional = products
        .filter(
          (product) =>
            product.id !== currentProductId &&
            product.category !== category &&
            !related.some((r) => r.id === product.id),
        )
        .slice(0, limit - related.length)

      related.push(...additional)
    }

    setRelatedProducts(related)

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("mufc-wishlist")
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
  }, [currentProductId, category, limit])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = (productId: number) => {
    const savedCart = localStorage.getItem("mufc-cart")
    const cart = savedCart ? JSON.parse(savedCart) : []
    const newCart = [...cart, productId]
    localStorage.setItem("mufc-cart", JSON.stringify(newCart))

    // Show notification
    if ("Notification" in window && Notification.permission === "granted") {
      const product = relatedProducts.find((p) => p.id === productId)
      new Notification("Added to Cart!", {
        body: `${product?.name} has been added to your cart`,
        icon: "/icon-192x192.png",
      })
    }
  }

  const handleToggleWishlist = (productId: number) => {
    const isWishlisted = wishlist.includes(productId)
    const newWishlist = isWishlisted ? wishlist.filter((id) => id !== productId) : [...wishlist, productId]

    setWishlist(newWishlist)
    localStorage.setItem("mufc-wishlist", JSON.stringify(newWishlist))
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
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

              {/* Badges */}
              <div className="absolute top-2 left-2 space-y-1">
                {product.isNew && <Badge className="bg-green-600 text-white text-xs">New</Badge>}
                {product.isBestSeller && <Badge className="bg-red-600 text-white text-xs">Best Seller</Badge>}
                {product.originalPrice && product.originalPrice > product.price && (
                  <Badge className="bg-orange-600 text-white text-xs">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>

              {/* Wishlist Button */}
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => handleToggleWishlist(product.id)}
              >
                <Heart
                  className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                />
              </Button>
            </div>

            <CardContent className="p-4">
              <Link href={`/product/${product.id}`}>
                <h3 className="font-semibold mb-2 line-clamp-2 hover:text-red-600 transition-colors">{product.name}</h3>
              </Link>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">({product.reviewCount})</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-red-600">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={!product.stock || product.stock <= 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
                <Link href={`/product/${product.id}`}>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </Link>
              </div>

              {/* Stock Status */}
              <div className="mt-2 text-center">
                <Badge variant={product.stock && product.stock > 0 ? "secondary" : "destructive"} className="text-xs">
                  {product.stock && product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-8">
        <Link href={`/catalog?category=${category}`}>
          <Button variant="outline" size="lg">
            View All {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        </Link>
      </div>
    </div>
  )
}
