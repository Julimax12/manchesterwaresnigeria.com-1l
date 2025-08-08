import { type NextRequest, NextResponse } from "next/server"
import webpush from "web-push"

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.warn("VAPID keys are not fully configured. Push sending will fail.")
} else {
  webpush.setVapidDetails("mailto:support@mufc-nigeria.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}

export async function POST(request: NextRequest) {
  try {
    const { title, body, url, subscriptions } = await request.json()

    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      return NextResponse.json({ success: false, message: "No subscriptions provided" }, { status: 400 })
    }

    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return NextResponse.json({ success: false, message: "Server push keys not configured" }, { status: 500 })
    }

    const notificationPayload = {
      title: title || "MUFC Store",
      body: body || "You have a new notification",
      icon: "/icon-192x192.png",
      badge: "/badge-72x72.png",
      image: "/notification-image.png",
      data: {
        url: url || "/",
        timestamp: Date.now(),
      },
      actions: [
        { action: "explore", title: "View", icon: "/action-explore.png" },
        { action: "close", title: "Close", icon: "/action-close.png" },
      ],
      requireInteraction: false,
      vibrate: [100, 50, 100],
    }

    const results = await Promise.allSettled(
      subscriptions.map((subscription: any) =>
        webpush.sendNotification(subscription, JSON.stringify(notificationPayload)),
      ),
    )

    const successful = results.filter((r) => r.status === "fulfilled").length
    const failed = results.filter((r) => r.status === "rejected").length

    return NextResponse.json({ success: true, sent: successful, failed, total: subscriptions.length })
  } catch (error) {
    console.error("Error sending push notifications:", error)
    return NextResponse.json({ success: false, message: "Failed to send notifications" }, { status: 500 })
  }
}
