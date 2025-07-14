"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireVerification?: boolean
  redirectTo?: string
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireVerification = false,
  redirectTo = "/auth/login",
}: AuthGuardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("mufc-user")
      const authToken = localStorage.getItem("mufc-auth-token")

      if (requireAuth && (!userData || !authToken)) {
        const currentPath = window.location.pathname
        router.push(`${redirectTo}?returnUrl=${encodeURIComponent(currentPath)}`)
        return
      }

      if (requireVerification && userData) {
        const user = JSON.parse(userData)
        if (!user.isVerified) {
          router.push("/auth/verify-email")
          return
        }
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, requireAuth, requireVerification, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
