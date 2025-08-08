"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react"
import { ProductReviews } from "@/components/product-reviews"
import { RelatedProducts } from "@/components/related-products"
import { SizeGuide } from "@/components/size-guide"
import { products } from "@/lib/products-data"
import { BulkPricingDisplay } from "@/components/bulk-pricing-display"
import { QuantitySelector } from "@/components/quantity-selector"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = Number.parseInt(params.id as string)

  const [product, setProduct] = useState(products.find((p) => p.id === productId))
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [cart, setCart] = useState<number[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])

  useEffect(() => {
    // Load cart and wishlist from localStorage
    const savedCart = localStorage.getItem("mufc-cart")
    const savedWishlist = localStorage.getItem("mufc-wishlist")

    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) {
      const wishlistData = JSON.parse(savedWishlist)
      setWishlist(wishlistData)
      setIsWishlisted(wishlistData.includes(productId))
    }

    // Set default selections
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].name)
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0])
      }
    }
  }, [productId, product])

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <Link href="/catalog">
              <Button className="bg-red-600 hover:bg-red-700">Browse Catalog</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      import("sonner").then(({ toast }) => toast.error("Please select a size"))
      return
    }

    const newCart = [...cart, productId]
    setCart(newCart)
    localStorage.setItem("mufc-cart", JSON.stringify(newCart))

    import("sonner").then(({ toast }) => toast.success(`${product.name} added to cart`))
  }

  const handleToggleWishlist = () => {
    const newWishlist = isWishlisted ? wishlist.filter((id) => id !== productId) : [...wishlist, productId]

    setWishlist(newWishlist)
    setIsWishlisted(!isWishlisted)
    localStorage.setItem("mufc-wishlist", JSON.stringify(newWishlist))

    import("sonner").then(({ toast }) =>
      isWishlisted ? toast("Removed from wishlist") : toast.success("Added to wishlist")
    )
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(product.stock || 10, quantity + change))
    setQuantity(newQuantity)
  }

  const handleImageNavigation = (direction: "prev" | "next") => {
    const totalImages = product.images.length
    if (direction === "prev") {
      setSelectedImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1))
    } else {
      setSelectedImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1))
    }
  }

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      import("sonner").then(({ toast }) => toast.success("Product link copied to clipboard!"))
    }
  }

  const currentPrice = selectedColor
    ? product.colors?.find((c) => c.name === selectedColor)?.price || product.price
    : product.price

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : 0

  const getCurrentBulkTier = () => {
    if (!product.bulkPricing) return null
    return product.bulkPricing.find(
      (tier) => quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity),
    )
  }

  const calculateBulkPrice = () => {
    const tier = getCurrentBulkTier()
    if (!tier) return currentPrice
    if (tier.price) return tier.price
    return currentPrice * (1 - tier.discount / 100)
  }

  const bulkUnitPrice = calculateBulkPrice()
  const totalSavings = (currentPrice - bulkUnitPrice) * quantity
  const finalTotal = bulkUnitPrice * quantity

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-red-600">
              Catalog
            </Link>
            <span>/</span>
            <Link href={`/catalog?category=${product.category}`} className="hover:text-red-600 capitalize">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <Image
                src={product.images[selectedImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => handleImageNavigation("prev")}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => handleImageNavigation("next")}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 space-y-2">
                {product.isNew && <Badge className="bg-green-600 text-white">New</Badge>}
                {product.isBestSeller && <Badge className="bg-red-600 text-white">Best Seller</Badge>}
                {discountPercentage > 0 && (
                  <Badge className="bg-orange-600 text-white">{discountPercentage}% OFF</Badge>
                )}
              </div>

              {/* Stock Status */}
              <div className="absolute top-4 right-4">
                <Badge variant={product.stock && product.stock > 0 ? "default" : "destructive"}>
                  {product.stock && product.stock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? "border-red-600" : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-red-600 border-red-600">
                  {product.brand || "Manchester United"}
                </Badge>
                {product.isAuthentic && (
                  <Badge className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Authentic
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={shareProduct} aria-label="Share product">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-red-600">{formatPrice(currentPrice)}</span>
                {product.originalPrice && product.originalPrice > currentPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                    <Badge className="bg-green-100 text-green-800">
                      Save {formatPrice(product.originalPrice - currentPrice)}
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Product Options */}
            <div className="space-y-4">
              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <Label className="text-base font-medium mb-3 block">Color: {selectedColor}</Label>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        className={`w-12 h-12 rounded-full border-4 transition-all ${
                          selectedColor === color.name
                            ? "border-red-600 scale-110"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setSelectedColor(color.name)}
                        title={color.name}
                        aria-label={`Select ${color.name} color`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-medium">Size: {selectedSize}</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSizeGuide(true)}
                      className="text-red-600 hover:text-red-700"
                      aria-label="View size guide"
                    >
                      Size Guide
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        className={`h-12 ${
                          selectedSize === size
                            ? "bg-red-600 hover:bg-red-700"
                            : "hover:border-red-600 hover:text-red-600"
                        }`}
                        onClick={() => setSelectedSize(size)}
                        aria-label={`Select size ${size}`}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
                stock={product.stock || 10}
                maxOrderQuantity={product.maxOrderQuantity}
                bulkPricing={product.bulkPricing}
                minBulkQuantity={product.minBulkQuantity}
              />

              {product.bulkPricing && (
                <div className="mt-6">
                  <BulkPricingDisplay
                    bulkPricing={product.bulkPricing}
                    currentQuantity={quantity}
                    basePrice={currentPrice}
                    onQuantityChange={setQuantity}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock <= 0}
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - {formatPrice(finalTotal)}
                {totalSavings > 0 && (
                  <span className="ml-2 text-xs bg-green-500 px-2 py-1 rounded">Save {formatPrice(totalSavings)}</span>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleToggleWishlist}
                className={isWishlisted ? "text-red-600 border-red-600" : ""}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-600">On orders over ₦50,000</p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-sm font-medium">Authentic</p>
                <p className="text-xs text-gray-600">100% genuine products</p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  <RotateCcw className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-gray-600">14-day return policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <div className="prose max-w-none">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">{product.description}</p>

                    {product.features && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                        <ul className="space-y-2">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Zap className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  {product.specifications ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No specifications available for this product.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <ProductReviews productId={productId} />
            </TabsContent>

            <TabsContent value="shipping" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Truck className="h-5 w-5 text-red-600" />
                        Shipping Information
                      </h3>
                      <div className="space-y-3 text-gray-700">
                        <p>• Free shipping on orders over ₦50,000</p>
                        <p>• Standard delivery: 3-5 business days</p>
                        <p>• Express delivery: 1-2 business days (additional charges apply)</p>
                        <p>• Delivery available to all 36 states in Nigeria</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <RotateCcw className="h-5 w-5 text-red-600" />
                        Returns & Exchanges
                      </h3>
                      <div className="space-y-3 text-gray-700">
                        <p>• 14-day return policy from date of delivery</p>
                        <p>• Items must be in original condition with tags attached</p>
                        <p>• Free returns for defective or incorrect items</p>
                        <p>• Custom jerseys with names/numbers are non-returnable</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts currentProductId={productId} category={product.category} />
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && <SizeGuide onClose={() => setShowSizeGuide(false)} />}
    </div>
  )
}
