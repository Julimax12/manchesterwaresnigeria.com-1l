"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Package, Truck, MapPin } from "lucide-react"

interface TrackingStep {
  id: string
  title: string
  description: string
  completed: boolean
  current: boolean
  timestamp?: string
}

export function OrderTracking({ orderReference }: { orderReference: string }) {
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([
    {
      id: "confirmed",
      title: "Order Confirmed",
      description: "Your order has been received and confirmed",
      completed: true,
      current: false,
      timestamp: "2024-01-15 10:30 AM",
    },
    {
      id: "processing",
      title: "Processing",
      description: "Your order is being prepared for shipment",
      completed: true,
      current: false,
      timestamp: "2024-01-15 02:15 PM",
    },
    {
      id: "shipped",
      title: "Shipped",
      description: "Your order has been shipped and is on its way",
      completed: false,
      current: true,
    },
    {
      id: "delivered",
      title: "Delivered",
      description: "Your order has been delivered successfully",
      completed: false,
      current: false,
    },
  ])

  const getStepIcon = (step: TrackingStep) => {
    if (step.completed) {
      return <CheckCircle className="h-6 w-6 text-green-600" />
    } else if (step.current) {
      return <Circle className="h-6 w-6 text-blue-600 fill-current" />
    } else {
      return <Circle className="h-6 w-6 text-gray-300" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-red-600" />
          Order Tracking
        </CardTitle>
        <p className="text-sm text-gray-600">Order #{orderReference}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {trackingSteps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                {getStepIcon(step)}
                {index < trackingSteps.length - 1 && (
                  <div className={`w-px h-12 mt-2 ${step.completed ? "bg-green-600" : "bg-gray-300"}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`font-medium ${step.completed ? "text-green-900" : step.current ? "text-blue-900" : "text-gray-500"}`}
                  >
                    {step.title}
                  </h3>
                  {step.current && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                <p
                  className={`text-sm ${step.completed ? "text-green-700" : step.current ? "text-blue-700" : "text-gray-500"}`}
                >
                  {step.description}
                </p>
                {step.timestamp && <p className="text-xs text-gray-500 mt-1">{step.timestamp}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Estimated Delivery</span>
          </div>
          <p className="text-sm text-blue-800">Wednesday, January 17, 2024 between 9:00 AM - 6:00 PM</p>
          <div className="flex items-center gap-2 mt-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">Lagos, Nigeria</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
