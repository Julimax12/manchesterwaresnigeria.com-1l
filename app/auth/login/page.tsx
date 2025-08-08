"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Smartphone, Facebook, Chrome } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would make an API call here
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, rememberMe }),
      })

      if (response.ok) {
        // Simulate successful login
        const userData = {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: formData.email,
          phone: "+234 901 234 5678",
          isVerified: true,
          memberSince: "2023-01-15",
          loyaltyPoints: 250,
          avatar: null,
        }

        localStorage.setItem("mufc-user", JSON.stringify(userData))
        localStorage.setItem("mufc-auth-token", "demo-token-" + Date.now())

        toast.success("Welcome back! You've successfully signed in to MUFC Store")

        // Redirect to intended page or dashboard
        const returnUrl = new URLSearchParams(window.location.search).get("returnUrl")
        router.push(returnUrl || "/account/dashboard")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrors({ general: "Invalid email or password. Please try again." })
      toast.error("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    // In a real app, this would redirect to OAuth provider
    console.log(`Login with ${provider}`)
    toast.info(`${provider} login would be implemented here`)
  }

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password")
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account to continue shopping</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  <span>{errors.general}</span>
                </div>
              )}

              {/* Email Field */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2">
                  <Checkbox checked={rememberMe} onCheckedChange={(v) => setRememberMe(Boolean(v))} aria-label="Remember me" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" onClick={handleForgotPassword} className="text-sm text-red-600 hover:underline" aria-label="Forgot password">
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Divider */}
              <div className="relative py-2">
                <Separator className="my-4" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-2 text-sm text-gray-500">or continue with</span>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" onClick={() => handleSocialLogin("Google")}>
                  <Chrome className="h-4 w-4 mr-2" /> Google
                </Button>
                <Button type="button" variant="outline" onClick={() => handleSocialLogin("Facebook")}>
                  <Facebook className="h-4 w-4 mr-2" /> Facebook
                </Button>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Secured with industry-standard encryption</span>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* PWA Install Note */}
        <div className="text-center mt-6">
          <Badge className="bg-red-100 text-red-700 border border-red-200">
            <Smartphone className="h-3 w-3 mr-2" /> Install our PWA for faster access
          </Badge>
        </div>
      </div>
    </div>
  )
}
