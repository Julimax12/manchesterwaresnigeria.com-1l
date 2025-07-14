import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json()

    // In a real app, you would:
    // 1. Validate the input
    // 2. Find user by email
    // 3. Verify password hash
    // 4. Generate JWT token
    // 5. Set secure cookies
    // 6. Return user data

    console.log("Login attempt:", { email, rememberMe })

    // Simulate validation
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // Simulate user lookup and password verification
    // In demo mode, accept any email/password combination
    const user = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: email,
      phone: "+234 901 234 5678",
      isVerified: true,
      memberSince: "2023-01-15",
      loyaltyPoints: 250,
      avatar: null,
    }

    // Generate demo token
    const token = `demo-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // In a real app, you would set secure HTTP-only cookies
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: user,
      token: token,
    })

    // Set cookie (in real app, this would be HTTP-only and secure)
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
