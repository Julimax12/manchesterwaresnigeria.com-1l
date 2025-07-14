"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, TrendingDown, Users, Calculator } from "lucide-react"
import type { BulkPricingTier } from "@/lib/products-data"

interface BulkPricingDisplayProps {
  bulkPricing: BulkPricingTier[]
  currentQuantity: number
  basePrice: number
  onQuantityChange?: (quantity: number) => void
}

export function BulkPricingDisplay({
  bulkPricing,
  currentQuantity,
  basePrice,
  onQuantityChange,
}: BulkPricingDisplayProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getCurrentTier = () => {
    return bulkPricing.find(
      (tier) => currentQuantity >= tier.minQuantity && (!tier.maxQuantity || currentQuantity <= tier.maxQuantity),
    )
  }

  const getNextTier = () => {
    return bulkPricing.find((tier) => tier.minQuantity > currentQuantity)
  }

  const calculatePrice = (quantity: number, tier?: BulkPricingTier) => {
    if (!tier) return basePrice
    if (tier.price) return tier.price
    return basePrice * (1 - tier.discount / 100)
  }

  const currentTier = getCurrentTier()
  const nextTier = getNextTier()
  const currentUnitPrice = calculatePrice(currentQuantity, currentTier)
  const totalSavings = currentTier ? (basePrice - currentUnitPrice) * currentQuantity : 0

  const progressToNextTier = nextTier ? Math.min((currentQuantity / nextTier.minQuantity) * 100, 100) : 100

  return (
    <div className="space-y-4">
      {/* Current Pricing Status */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">
                {currentTier ? `Bulk Pricing Active` : `Regular Pricing`}
              </span>
            </div>
            {currentTier && <Badge className="bg-green-600 text-white">{currentTier.discount}% OFF</Badge>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-700">Price per item</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-blue-900">{formatPrice(currentUnitPrice)}</span>
                {currentTier && <span className="text-sm text-gray-500 line-through">{formatPrice(basePrice)}</span>}
              </div>
            </div>
            <div>
              <p className="text-sm text-blue-700">Total savings</p>
              <span className="text-lg font-bold text-green-600">
                {totalSavings > 0 ? formatPrice(totalSavings) : "₦0"}
              </span>
            </div>
          </div>

          {/* Progress to next tier */}
          {nextTier && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-blue-700">Progress to {nextTier.discount}% discount</span>
                <span className="text-blue-900 font-medium">
                  {currentQuantity}/{nextTier.minQuantity}
                </span>
              </div>
              <Progress value={progressToNextTier} className="h-2" />
              <p className="text-xs text-blue-600 mt-1">
                Add {nextTier.minQuantity - currentQuantity} more items to unlock {nextTier.discount}% discount
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Pricing Tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-red-600" />
            Volume Discounts Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bulkPricing.map((tier, index) => {
              const isActive = currentTier?.minQuantity === tier.minQuantity
              const tierPrice = calculatePrice(1, tier)
              const savings = basePrice - tierPrice

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                    isActive ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => onQuantityChange?.(tier.minQuantity)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${isActive ? "bg-green-500" : "bg-gray-300"}`} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {tier.minQuantity}
                          {tier.maxQuantity ? `-${tier.maxQuantity}` : "+"} items
                        </p>
                        <p className="text-sm text-gray-600">{tier.label}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-red-600">{formatPrice(tierPrice)}</p>
                      <p className="text-sm text-green-600">Save {formatPrice(savings)} each</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bulk Order Benefits */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-red-600" />
              Bulk Order Benefits
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-green-600" />
                Volume discounts up to 25% off
              </li>
              <li className="flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-600" />
                Free shipping on all bulk orders
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                Perfect for teams, clubs, and organizations
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
