import { type NextRequest, NextResponse } from "next/server"

// This would be your actual Paystack secret key in production
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "sk_test_your_secret_key"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, amount, firstName, lastName, phone, metadata } = body

    // Initialize payment with Paystack
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Convert to kobo
        currency: "NGN",
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: `${firstName} ${lastName}`,
            },
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: phone,
            },
          ],
          ...metadata,
        },
        channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
      }),
    })

    const data = await response.json()

    if (data.status) {
      return NextResponse.json({
        success: true,
        data: {
          authorization_url: data.data.authorization_url,
          access_code: data.data.access_code,
          reference: data.data.reference,
        },
      })
    } else {
      return NextResponse.json({ success: false, message: data.message }, { status: 400 })
    }
  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
