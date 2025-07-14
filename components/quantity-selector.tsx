"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Package } from "lucide-react"
import type { BulkPricingTier } from "@/lib/products-data"

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  stock: number
  maxOrderQuantity?: number
  bulkPricing?: BulkPricingTier[]
  minBulkQuantity?: number
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  stock,
  maxOrderQuantity,
  bulkPricing,
  minBulkQuantity,
}: QuantitySelectorProps) {
  const [inputValue, setInputValue] = useState(quantity.toString())

  const maxQuantity = Math.min(stock, maxOrderQuantity || stock)

  const handleQuantityChange = (newQuantity: number) => {
    const validQuantity = Math.max(1, Math.min(maxQuantity, newQuantity))
    onQuantityChange(validQuantity)
    setInputValue(validQuantity.toString())
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    const numValue = Number.parseInt(value) || 1
    if (numValue >= 1 && numValue <= maxQuantity) {
      onQuantityChange(numValue)
    }
  }

  const handleInputBlur = () => {
    const numValue = Number.parseInt(inputValue) || 1
    const validQuantity = Math.max(1, Math.min(maxQuantity, numValue))
    setInputValue(validQuantity.toString())
    if (validQuantity !== quantity) {
      onQuantityChange(validQuantity)
    }
  }

  const getCurrentTier = () => {
    if (!bulkPricing) return null
    return bulkPricing.find(
      (tier) => quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity),
    )
  }

  const getQuickSelectQuantities = () => {
    const quantities = [1]

    if (bulkPricing) {
      bulkPricing.forEach((tier) => {
        if (tier.minQuantity <= maxQuantity) {
          quantities.push(tier.minQuantity)
        }
      })
    }

    // Add some common quantities
    const commonQuantities = [5, 10, 25, 50]
    commonQuantities.forEach((qty) => {
      if (qty <= maxQuantity && !quantities.includes(qty)) {
        quantities.push(qty)
      }
    })

    return quantities.sort((a, b) => a - b).slice(0, 6)
  }

  const currentTier = getCurrentTier()
  const quickSelectQuantities = getQuickSelectQuantities()

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium mb-3 block">Quantity</Label>

        {/* Main Quantity Controls */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onBlur={handleInputBlur}
              className="w-20 text-center border-0 focus-visible:ring-0"
              min={1}
              max={maxQuantity}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{stock} available</span>
            {maxOrderQuantity && maxOrderQuantity < stock && <span>• Max {maxOrderQuantity} per order</span>}
          </div>
        </div>

        {/* Current Tier Badge */}
        {currentTier && (
          <div className="mb-4">
            <Badge className="bg-green-100 text-green-800">
              <Package className="h-3 w-3 mr-1" />
              {currentTier.label} - {currentTier.discount}% discount active
            </Badge>
          </div>
        )}

        {/* Quick Select Quantities */}
        <div>
          <Label className="text-sm text-gray-600 mb-2 block">Quick select:</Label>
          <div className="flex flex-wrap gap-2">
            {quickSelectQuantities.map((qty) => {
              const tier = bulkPricing?.find((t) => qty >= t.minQuantity && (!t.maxQuantity || qty <= t.maxQuantity))

              return (
                <Button
                  key={qty}
                  variant={quantity === qty ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuantityChange(qty)}
                  className={`relative ${
                    quantity === qty ? "bg-red-600 hover:bg-red-700" : "hover:border-red-600 hover:text-red-600"
                  }`}
                  disabled={qty > maxQuantity}
                >
                  {qty}
                  {tier && (
                    <Badge className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-1 min-w-[1.5rem] h-4">
                      -{tier.discount}%
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Bulk Pricing Hint */}
        {bulkPricing && minBulkQuantity && quantity < minBulkQuantity && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Bulk pricing available!</strong> Order {minBulkQuantity}+ items to unlock volume discounts up
              to {Math.max(...bulkPricing.map((t) => t.discount))}% off.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
