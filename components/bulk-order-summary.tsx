"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, TrendingDown, Calculator, Gift } from "lucide-react"
import type { BulkPricingTier } from "@/lib/products-data"

interface BulkOrderItem {
  id: number
  name: string
  basePrice: number
  quantity: number
  bulkPricing?: BulkPricingTier[]
  image: string
}

interface BulkOrderSummaryProps {
  items: BulkOrderItem[]
  className?: string
}

export function BulkOrderSummary({ items, className = "" }: BulkOrderSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateItemPricing = (item: BulkOrderItem) => {
    const tier = item.bulkPricing?.find(
      (t) => item.quantity >= t.minQuantity && (!t.maxQuantity || item.quantity <= t.maxQuantity),
    )

    const unitPrice = tier ? tier.price || item.basePrice * (1 - tier.discount / 100) : item.basePrice

    const totalPrice = unitPrice * item.quantity
    const savings = (item.basePrice - unitPrice) * item.quantity
    const discount = tier?.discount || 0

    return { unitPrice, totalPrice, savings, discount, tier }
  }

  const orderSummary = items.map((item) => ({
    ...item,
    ...calculateItemPricing(item),
  }))

  const subtotal = orderSummary.reduce((sum, item) => sum + item.basePrice * item.quantity, 0)
  const totalAfterDiscounts = orderSummary.reduce((sum, item) => sum + item.totalPrice, 0)
  const totalSavings = subtotal - totalAfterDiscounts
  const totalItems = orderSummary.reduce((sum, item) => sum + item.quantity, 0)

  const hasAnyBulkDiscount = orderSummary.some((item) => item.discount > 0)

  return (
    <Card className={`${className} ${hasAnyBulkDiscount ? "border-green-200 bg-green-50" : ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-red-600" />
          Order Summary
          {hasAnyBulkDiscount && (
            <Badge className="bg-green-600 text-white">
              <TrendingDown className="h-3 w-3 mr-1" />
              Bulk Discounts Applied
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Items Breakdown */}
        <div className="space-y-3">
          {orderSummary.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{item.quantity} items</span>
                    {item.discount > 0 && (
                      <Badge className="bg-green-100 text-green-800 text-xs">{item.discount}% off</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(item.totalPrice)}</p>
                  {item.savings > 0 && <p className="text-xs text-green-600">Save {formatPrice(item.savings)}</p>}
                </div>
              </div>

              {item.discount > 0 && (
                <div className="bg-green-100 p-2 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800">
                      Unit price: {formatPrice(item.unitPrice)}
                      <span className="line-through ml-1 text-gray-500">{formatPrice(item.basePrice)}</span>
                    </span>
                    <span className="text-green-700 font-medium">{item.tier?.label}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({totalItems} items)</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {totalSavings > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4" />
                Bulk discount savings
              </span>
              <span>-{formatPrice(totalSavings)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span className="text-green-600">FREE</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <div className="text-right">
            <span className="text-red-600">{formatPrice(totalAfterDiscounts)}</span>
            {totalSavings > 0 && (
              <div className="text-sm text-green-600 font-normal">You saved {formatPrice(totalSavings)}!</div>
            )}
          </div>
        </div>

        {/* Bulk Benefits */}
        {hasAnyBulkDiscount && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Bulk Order Benefits</span>
            </div>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>✓ Volume discounts applied automatically</li>
              <li>✓ Free shipping included</li>
              <li>✓ Priority processing for bulk orders</li>
              <li>✓ Dedicated customer support</li>
            </ul>
          </div>
        )}

        {/* Potential Additional Savings */}
        {!hasAnyBulkDiscount && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-900">Unlock Bulk Savings</span>
            </div>
            <p className="text-xs text-yellow-800">Add more items to qualify for volume discounts up to 25% off!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
