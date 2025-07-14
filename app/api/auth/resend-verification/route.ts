import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // In a real app, you would:
    // 1. Validate email
    // 2. Check if user exists
    // 3. Generate new verification code
    // 4. Send verification email
    // 5. Update database with new code and expiry

    console.log("Resending verification code to:", email)

    // Simulate validation
    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    // Simulate email sending
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    console.log("Generated verification code:", verificationCode)

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully",
      // In production, never return the actual code
      ...(process.env.NODE_ENV === "development" && { code: verificationCode }),
    })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
