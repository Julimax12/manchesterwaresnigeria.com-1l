"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Building2, Smartphone, Wallet, Shield, Truck, MapPin, Phone, Mail, Lock } from "lucide-react"
import { PaystackButton } from "@/components/paystack-button"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  size?: string
  image: string
}

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
}

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
]

const sampleCartItems: CartItem[] = [
  {
    id: 1,
    name: "Manchester United Home Jersey 2024/25",
    price: 45000,
    quantity: 1,
    size: "L",
    image: "https://i.pinimg.com/736x/0d/7f/f0/0d7ff025da877ceb6e6684a3c0cf3887.jpg",
  },
  {
    id: 2,
    name: "Official Training Kit",
    price: 32000,
    quantity: 1,
    size: "M",
    image: "https://i.pinimg.com/736x/15/43/89/154389e05ad498a7b5d78615e188e23d.jpg",
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>(sampleCartItems)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  })

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal > 50000 ? 0 : 2500 // Free shipping over ₦50,000
  const total = subtotal + shippingFee

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const required = ["firstName", "lastName", "email", "phone", "address", "city", "state"]
    return required.every((field) => shippingInfo[field as keyof ShippingInfo].trim() !== "")
  }

  const handlePaymentSuccess = (reference: string) => {
    // Store order details
    const orderData = {
      reference,
      items: cartItems,
      shipping: shippingInfo,
      total,
      paymentMethod,
      status: "completed",
      date: new Date().toISOString(),
    }

    localStorage.setItem("lastOrder", JSON.stringify(orderData))
    localStorage.removeItem("mufc-cart")

    router.push(`/order-success?ref=${reference}`)
  }

  const paymentMethods = [
    {
      id: "card",
      name: "Debit/Credit Card",
      description: "Pay with your Visa, Mastercard, or Verve card",
      icon: CreditCard,
      popular: true,
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      description: "Direct bank transfer with instant confirmation",
      icon: Building2,
      popular: true,
    },
    {
      id: "ussd",
      name: "USSD",
      description: "Pay using your mobile phone USSD code",
      icon: Smartphone,
      popular: false,
    },
    {
      id: "mobile_money",
      name: "Mobile Money",
      description: "Pay with Opay, PalmPay, or other mobile wallets",
      icon: Wallet,
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-red-600" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={shippingInfo.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={shippingInfo.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phone"
                        type="tel"
                        className="pl-10"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+234 xxx xxx xxxx"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                    <Textarea
                      id="address"
                      className="pl-10"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Enter your full address"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={shippingInfo.state} onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  Payment Method
                </CardTitle>
                <p className="text-sm text-gray-600">Choose your preferred payment method</p>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="relative">
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="bg-red-100 p-2 rounded-lg">
                            <method.icon className="h-5 w-5 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={method.id} className="font-medium cursor-pointer">
                                {method.name}
                              </Label>
                              {method.popular && (
                                <Badge variant="secondary" className="text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                {/* Payment Method Details */}
                {paymentMethod === "bank_transfer" && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Bank Transfer Instructions</h4>
                    <p className="text-sm text-blue-800">
                      After clicking "Complete Order", you'll receive bank details to complete your transfer. Your order
                      will be confirmed once payment is received.
                    </p>
                  </div>
                )}

                {paymentMethod === "ussd" && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">USSD Payment</h4>
                    <p className="text-sm text-green-800">
                      Dial the USSD code provided after order confirmation to complete payment from any mobile phone.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Secure Payment</p>
                    <p className="text-sm text-green-700">
                      Your payment information is encrypted and secure. We use Paystack's industry-standard security.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 min-w-[1.25rem] h-5">
                          {item.quantity}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                        {item.size && <p className="text-xs text-gray-600">Size: {item.size}</p>}
                        <p className="text-sm font-medium text-red-600">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shippingFee === 0 ? "text-green-600" : ""}>
                      {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                    </span>
                  </div>
                  {shippingFee === 0 && <p className="text-xs text-green-600">Free shipping on orders over ₦50,000</p>}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-red-600">{formatPrice(total)}</span>
                </div>

                {/* Checkout Button */}
                <div className="pt-4">
                  {validateForm() ? (
                    <PaystackButton
                      amount={total}
                      email={shippingInfo.email}
                      firstName={shippingInfo.firstName}
                      lastName={shippingInfo.lastName}
                      phone={shippingInfo.phone}
                      onSuccess={handlePaymentSuccess}
                      onClose={() => setIsProcessing(false)}
                      disabled={isProcessing}
                      className="w-full"
                    />
                  ) : (
                    <Button disabled className="w-full">
                      Complete Shipping Information
                    </Button>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>SSL Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4" />
                    <span>Free Returns within 14 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
