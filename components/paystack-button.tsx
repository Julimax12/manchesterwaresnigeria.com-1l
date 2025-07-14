"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard, Loader2 } from "lucide-react"

interface PaystackButtonProps {
  amount: number
  email: string
  firstName: string
  lastName: string
  phone: string
  onSuccess: (reference: string) => void
  onClose: () => void
  disabled?: boolean
  className?: string
}

export function PaystackButton({
  amount,
  email,
  firstName,
  lastName,
  phone,
  onSuccess,
  onClose,
  disabled = false,
  className = "",
}: PaystackButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      // In a real implementation, you would:
      // 1. Create a transaction on your backend
      // 2. Get the authorization URL from Paystack
      // 3. Redirect user to Paystack checkout

      // For demo purposes, we'll simulate the payment process
      const reference = `MUFC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Simulate Paystack popup
      const confirmed = window.confirm(
        `Paystack Payment Simulation\n\n` +
          `Amount: ₦${amount.toLocaleString()}\n` +
          `Email: ${email}\n` +
          `Name: ${firstName} ${lastName}\n\n` +
          `Click OK to simulate successful payment, Cancel to simulate failure.`,
      )

      if (confirmed) {
        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000))
        onSuccess(reference)
      } else {
        onClose()
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment failed. Please try again.")
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  // Real Paystack integration would look like this:
  /*
  const handlePayment = () => {
    const handler = PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: amount * 100, // Paystack expects amount in kobo
      currency: 'NGN',
      ref: `MUFC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      firstname: firstName,
      lastname: lastName,
      phone: phone,
      callback: function(response) {
        onSuccess(response.reference)
      },
      onClose: function() {
        onClose()
      }
    })
    handler.openIframe()
  }
  */

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className={`bg-red-600 hover:bg-red-700 ${className}`}
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          Complete Order - ₦{amount.toLocaleString()}
        </>
      )}
    </Button>
  )
}
