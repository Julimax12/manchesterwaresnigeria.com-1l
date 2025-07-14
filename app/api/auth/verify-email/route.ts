import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    // In a real app, you would:
    // 1. Validate the verification code
    // 2. Check if code is expired
    // 3. Update user verification status
    // 4. Clear verification code from database

    console.log("Email verification attempt:", { email, code })

    // Simulate validation
    if (!email || !code) {
      return NextResponse.json({ success: false, message: "Email and verification code are required" }, { status: 400 })
    }

    // Simulate code validation (accept any 6-digit code)
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ success: false, message: "Invalid verification code format" }, { status: 400 })
    }

    // In demo mode, accept any valid format code
    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      verified: true,
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
