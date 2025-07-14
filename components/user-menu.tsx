"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Package, Heart, MapPin, CreditCard, Bell, LogOut, Shield, Gift } from "lucide-react"

interface UserData {
  id: number
  firstName: string
  lastName: string
  email: string
  isVerified: boolean
  loyaltyPoints: number
}

export function UserMenu() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("mufc-user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("mufc-user")
    localStorage.removeItem("mufc-auth-token")
    router.push("/")
    setIsOpen(false)
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm" className="text-white hover:text-red-400">
            Sign In
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button size="sm" className="bg-red-600 hover:bg-red-700">
            Register
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white hover:text-red-400 relative">
          <User className="h-5 w-5" />
          {!user.isVerified && <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></div>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              {user.isVerified ? (
                <Badge className="bg-green-100 text-green-800 text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">Unverified</Badge>
              )}
              <Badge className="bg-purple-100 text-purple-800 text-xs">
                <Gift className="h-3 w-3 mr-1" />
                {user.loyaltyPoints} pts
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/account/dashboard" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/account/orders" className="cursor-pointer">
            <Package className="mr-2 h-4 w-4" />
            <span>My Orders</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/account/wishlist" className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            <span>Wishlist</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/account/addresses" className="cursor-pointer">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Addresses</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/account/payment-methods" className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Payment Methods</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/account/notifications" className="cursor-pointer">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/account/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
