"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

interface UserData {
  id: number
  firstName: string
  lastName: string
  email: string
  isVerified: boolean
  loyaltyPoints: number
}

export function UserMenu() {
  const [user, setUser] = useState<UserData | null>(null)
  
  useEffect(() => {
    const userData = localStorage.getItem("mufc-user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm" className="text-white">
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
    <div className="flex items-center gap-2">
      <Link href="/account/dashboard">
        <Button variant="ghost" size="sm" className="text-white">
          <User className="h-5 w-5 mr-1" />
          Account
        </Button>
      </Link>
    </div>
  )
}
