"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Package,
  Heart,
  Star,
  ShoppingCart,
  MapPin,
  Phone,
  Mail,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  Truck,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  Shield,
  AlertCircle,
} from "lucide-react"

interface UserData {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  isVerified: boolean
  memberSince: string
  loyaltyPoints: number
  avatar?: string
  totalOrders?: number
  totalSpent?: number
  favoriteCategory?: string
}

interface Order {
  id: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  items: number
}

interface LoyaltyTier {
  name: string
  minPoints: number
  maxPoints?: number
  benefits: string[]
  color: string
}

export default function AccountDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false)

  const recentOrders: Order[] = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      status: "delivered",
      total: 45000,
      items: 2,
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-10",
      status: "shipped",
      total: 32000,
      items: 1,
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-05",
      status: "processing",
      total: 78000,
      items: 3,
    },
  ]

  const loyaltyTiers: LoyaltyTier[] = [
    {
      name: "Red Devil",
      minPoints: 0,
      maxPoints: 499,
      benefits: ["Free shipping on orders over ₦50,000", "Birthday discount"],
      color: "gray",
    },
    {
      name: "United Fan",
      minPoints: 500,
      maxPoints: 1499,
      benefits: ["Free shipping on all orders", "Early access to sales", "5% discount"],
      color: "blue",
    },
    {
      name: "True Red",
      minPoints: 1500,
      maxPoints: 2999,
      benefits: ["Free shipping", "Early access", "10% discount", "Exclusive products"],
      color: "red",
    },
    {
      name: "Legend",
      minPoints: 3000,
      benefits: ["All benefits", "15% discount", "VIP support", "Special events"],
      color: "gold",
    },
  ]

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("mufc-user")
    const authToken = localStorage.getItem("mufc-auth-token")

    if (!userData || !authToken) {
      router.push("/auth/login?returnUrl=/account/dashboard")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser({
      ...parsedUser,
      totalOrders: recentOrders.length,
      totalSpent: recentOrders.reduce((sum, order) => sum + order.total, 0),
      favoriteCategory: "Jerseys",
    })

    // Check if coming from email verification
    if (searchParams.get("verified") === "true") {
      setShowVerificationSuccess(true)
      setTimeout(() => setShowVerificationSuccess(false), 5000)
    }

    setIsLoading(false)
  }, [router, searchParams])

  const handleLogout = () => {
    localStorage.removeItem("mufc-user")
    localStorage.removeItem("mufc-auth-token")
    router.push("/")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getCurrentTier = () => {
    if (!user) return loyaltyTiers[0]
    return (
      loyaltyTiers.find(
        (tier) => user.loyaltyPoints >= tier.minPoints && (!tier.maxPoints || user.loyaltyPoints <= tier.maxPoints),
      ) || loyaltyTiers[loyaltyTiers.length - 1]
    )
  }

  const getNextTier = () => {
    if (!user) return null
    return loyaltyTiers.find((tier) => tier.minPoints > user.loyaltyPoints)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "processing":
        return <Package className="h-4 w-4 text-blue-600" />
      case "shipped":
        return <Truck className="h-4 w-4 text-purple-600" />
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const currentTier = getCurrentTier()
  const nextTier = getNextTier()
  const progressToNextTier = nextTier
    ? ((user.loyaltyPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message */}
      {showVerificationSuccess && (
        <div className="bg-green-600 text-white text-center py-3 px-4 flex items-center justify-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <span>Email verified successfully! Welcome to MUFC Store!</span>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
            <p className="text-gray-600">Manage your account and track your orders</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/account/settings">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Account Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <Package className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{user.totalOrders}</p>
                      <p className="text-gray-600">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{formatPrice(user.totalSpent || 0)}</p>
                      <p className="text-gray-600">Total Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Star className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{user.loyaltyPoints}</p>
                      <p className="text-gray-600">Loyalty Points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-red-600" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.date)} • {order.items} items
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(order.total)}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/account/orders">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Orders
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/catalog">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                      <ShoppingCart className="h-6 w-6" />
                      <span className="text-sm">Shop Now</span>
                    </Button>
                  </Link>
                  <Link href="/account/wishlist">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                      <Heart className="h-6 w-6" />
                      <span className="text-sm">Wishlist</span>
                    </Button>
                  </Link>
                  <Link href="/account/addresses">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                      <MapPin className="h-6 w-6" />
                      <span className="text-sm">Addresses</span>
                    </Button>
                  </Link>
                  <Link href="/account/payment-methods">
                    <Button variant="outline" className="w-full h-20 flex-col gap-2 bg-transparent">
                      <CreditCard className="h-6 w-6" />
                      <span className="text-sm">Payment</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    {user.avatar ? (
                      <Image
                        src={user.avatar || "/placeholder.svg"}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="h-10 w-10 text-red-600" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {user.isVerified ? (
                      <>
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 text-sm">Verified</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-600 text-sm">Unverified</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-2">Member since {formatDate(user.memberSince)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Loyalty Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-red-600" />
                  Loyalty Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <Badge
                      className={`${
                        currentTier.color === "gold"
                          ? "bg-yellow-500"
                          : currentTier.color === "red"
                            ? "bg-red-600"
                            : currentTier.color === "blue"
                              ? "bg-blue-600"
                              : "bg-gray-600"
                      } text-white text-lg px-4 py-2`}
                    >
                      {currentTier.name}
                    </Badge>
                    <p className="text-2xl font-bold mt-2">{user.loyaltyPoints} Points</p>
                  </div>

                  {nextTier && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress to {nextTier.name}</span>
                        <span>{nextTier.minPoints - user.loyaltyPoints} points to go</span>
                      </div>
                      <Progress value={progressToNextTier} className="h-2" />
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">Your Benefits:</h4>
                    <ul className="space-y-1">
                      {currentTier.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Email Verification</span>
                    </div>
                    {user.isVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Link href="/auth/verify-email">
                        <Button size="sm" variant="outline">
                          Verify
                        </Button>
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Phone Number</span>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Password</span>
                    </div>
                    <Link href="/account/change-password">
                      <Button size="sm" variant="outline">
                        Change
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-red-600" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">New Product Alert</p>
                    <p className="text-xs text-blue-700">Manchester United Third Kit 2024/25 is now available!</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Order Delivered</p>
                    <p className="text-xs text-green-700">Your order #ORD-2024-001 has been delivered successfully.</p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>

                <Link href="/account/notifications">
                  <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                    View All Notifications
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
