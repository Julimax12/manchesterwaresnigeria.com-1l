"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, CheckCircle, Clock, RefreshCw, AlertCircle, Shield, Gift } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState("")
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    // Get user email from localStorage or redirect to register
    const userData = localStorage.getItem("mufc-user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserEmail(user.email)
    } else {
      router.push("/auth/register")
      return
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!verificationCode.trim()) {
      setError("Please enter the verification code")
      return
    }

    if (verificationCode.length !== 6) {
      setError("Verification code must be 6 digits")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would verify the code with your backend
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          code: verificationCode,
        }),
      })

      if (response.ok) {
        // Update user verification status
        const userData = JSON.parse(localStorage.getItem("mufc-user") || "{}")
        userData.isVerified = true
        userData.verifiedAt = new Date().toISOString()
        localStorage.setItem("mufc-user", JSON.stringify(userData))

        // Show success notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Email Verified!", {
            body: "Your email has been verified successfully. Welcome to MUFC Store!",
            icon: "/icon-192x192.png",
          })
        }

        router.push("/account/dashboard?verified=true")
      } else {
        throw new Error("Invalid verification code")
      }
    } catch (error) {
      console.error("Verification error:", error)
      setError("Invalid verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would request a new verification code
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      })

      if (response.ok) {
        // Reset timer
        setTimeLeft(60)
        setCanResend(false)

        // Show success message
        alert("Verification code sent! Please check your email.")
      } else {
        throw new Error("Failed to resend code")
      }
    } catch (error) {
      console.error("Resend error:", error)
      setError("Failed to resend verification code. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.png-RpUgUJav1RAaZmaqYnKWnaNwBItTVZ.webp"
              alt="Manchester United Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <h1 className="text-2xl font-bold text-gray-900">MUFC Nigeria Store</h1>
          </Link>
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600">
            We've sent a verification code to <span className="font-medium text-gray-900">{userEmail}</span>
          </p>
        </div>

        {/* Verification Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Enter Verification Code</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Verification Code Input */}
              <div>
                <Label htmlFor="verificationCode">6-Digit Verification Code</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  maxLength={6}
                  className="text-center text-2xl font-mono tracking-widest"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    setVerificationCode(value)
                    setError("")
                  }}
                  placeholder="000000"
                  autoComplete="one-time-code"
                />
                <p className="text-sm text-gray-600 mt-2">Enter the 6-digit code sent to your email</p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>

              {/* Resend Code */}
              <div className="text-center space-y-2">
                <p className="text-gray-600">Didn't receive the code?</p>
                {canResend ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="w-full bg-transparent"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Resend Code"
                    )}
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Resend in {formatTime(timeLeft)}</span>
                  </div>
                )}
              </div>

              {/* Change Email */}
              <div className="text-center">
                <p className="text-gray-600">
                  Wrong email address?{" "}
                  <Link href="/auth/register" className="text-red-600 hover:underline font-medium">
                    Update your email
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Benefits After Verification */}
        <Card className="mt-6 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              After Verification You'll Get
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-green-800">
                <Shield className="h-4 w-4" />
                <span>Full account security and protection</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-green-800">
                <Gift className="h-4 w-4" />
                <span>100 welcome loyalty points</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-green-800">
                <Mail className="h-4 w-4" />
                <span>Order confirmations and updates</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Need help?{" "}
            <Link href="/contact" className="text-red-600 hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
