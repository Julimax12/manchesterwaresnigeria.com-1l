"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PaymentMethods() {
  const methods = [
    {
      name: "Cards",
      description: "Visa, Mastercard, Verve",
      logos: ["/visa.png", "/mastercard.png", "/verve.png"],
      popular: true,
    },
    {
      name: "Bank Transfer",
      description: "All Nigerian banks supported",
      logos: ["/bank-transfer.png"],
      popular: true,
    },
    {
      name: "USSD",
      description: "Pay from any mobile phone",
      logos: ["/ussd.png"],
      popular: false,
    },
    {
      name: "Mobile Money",
      description: "Opay, PalmPay, and more",
      logos: ["/opay.png", "/palmpay.png"],
      popular: false,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {methods.map((method) => (
        <Card key={method.name} className="relative">
          <CardContent className="p-4 text-center">
            {method.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs">
                Popular
              </Badge>
            )}
            <div className="flex justify-center mb-2">
              {method.logos.map((logo, index) => (
                <div key={index} className="w-8 h-8 bg-gray-200 rounded mr-1 last:mr-0" />
              ))}
            </div>
            <h3 className="font-medium text-sm">{method.name}</h3>
            <p className="text-xs text-gray-600 mt-1">{method.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
