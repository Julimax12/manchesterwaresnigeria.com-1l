"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Package, Users, TrendingDown, ShoppingCart, Plus, Minus, X, Calculator, Phone, Mail } from "lucide-react"
import { products } from "@/lib/products-data"
import { BulkOrderSummary } from "@/components/bulk-order-summary"

interface BulkOrderItem {
  id: number
  name: string
  basePrice: number
  quantity: number
  bulkPricing?: any[]
  image: string
  selectedSize?: string
  selectedColor?: string
}

export default function BulkOrderPage() {
  const [selectedItems, setSelectedItems] = useState<BulkOrderItem[]>([])
  const [customerInfo, setCustomerInfo] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    phone: "",
    requirements: "",
  })

  const bulkEligibleProducts = products.filter((p) => p.bulkPricing && p.bulkPricing.length > 0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const addItemToBulkOrder = (product: any, quantity = 1) => {
    const existingItem = selectedItems.find((item) => item.id === product.id)

    if (existingItem) {
      updateItemQuantity(product.id, existingItem.quantity + quantity)
    } else {
      const newItem: BulkOrderItem = {
        id: product.id,
        name: product.name,
        basePrice: product.price,
        quantity: Math.max(quantity, product.minBulkQuantity || 1),
        bulkPricing: product.bulkPricing,
        image: product.images[0],
      }
      setSelectedItems([...selectedItems, newItem])
    }
  }

  const updateItemQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }

    setSelectedItems((items) => items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (itemId: number) => {
    setSelectedItems((items) => items.filter((item) => item.id !== itemId))
  }

  const handleSubmitBulkOrder = () => {
    if (selectedItems.length === 0) {
      alert("Please add items to your bulk order")
      return
    }

    if (!customerInfo.organizationName || !customerInfo.contactName || !customerInfo.email) {
      alert("Please fill in all required customer information")
      return
    }

    // In a real app, you would submit this to your backend
    console.log("Bulk order submitted:", { selectedItems, customerInfo })
    alert("Bulk order request submitted! We'll contact you within 24 hours with a custom quote.")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Orders</h1>
              <p className="text-gray-600">Special pricing for teams, clubs, and organizations</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Phone className="h-4 w-4" />
                <span>+234 9122977491</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>bulk@mufc-nigeria.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                  Bulk Order Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingDown className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-medium mb-1">Volume Discounts</h3>
                    <p className="text-sm text-gray-600">Up to 25% off on bulk orders</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium mb-1">Free Shipping</h3>
                    <p className="text-sm text-gray-600">No shipping costs on bulk orders</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-medium mb-1">Custom Service</h3>
                    <p className="text-sm text-gray-600">Dedicated support team</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Products */}
            <Card>
              <CardHeader>
                <CardTitle>Available for Bulk Orders</CardTitle>
                <p className="text-sm text-gray-600">Select products and quantities for your bulk order</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bulkEligibleProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium mb-1 line-clamp-2">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">From {formatPrice(product.price)}</p>

                          {/* Bulk Pricing Preview */}
                          <div className="space-y-1 mb-3">
                            {product.bulkPricing?.slice(0, 2).map((tier, index) => (
                              <div key={index} className="text-xs text-green-600">
                                {tier.minQuantity}+ items: {tier.discount}% off
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => addItemToBulkOrder(product, product.minBulkQuantity || 5)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                            <Link href={`/product/${product.id}`}>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-red-600" />
                    Selected Items ({selectedItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />

                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600">{formatPrice(item.basePrice)} each</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <p className="text-sm text-gray-600">Tell us about your organization for a custom quote</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="orgName">Organization Name *</Label>
                    <Input
                      id="orgName"
                      value={customerInfo.organizationName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, organizationName: e.target.value })}
                      placeholder="e.g., Manchester United Supporters Club Lagos"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactName">Contact Person *</Label>
                    <Input
                      id="contactName"
                      value={customerInfo.contactName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, contactName: e.target.value })}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="requirements">Special Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={customerInfo.requirements}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, requirements: e.target.value })}
                    placeholder="Any special requirements, customizations, or delivery instructions..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {selectedItems.length > 0 ? (
                <>
                  <BulkOrderSummary items={selectedItems} />

                  <Button size="lg" className="w-full bg-red-600 hover:bg-red-700" onClick={handleSubmitBulkOrder}>
                    <Calculator className="h-5 w-5 mr-2" />
                    Request Custom Quote
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    <p>We'll contact you within 24 hours with a detailed quote and payment options.</p>
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">No items selected</h3>
                    <p className="text-sm text-gray-600">Add products to see bulk pricing and get a custom quote.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
