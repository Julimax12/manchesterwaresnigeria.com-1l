import { type NextRequest, NextResponse } from "next/server"
import webpush from "web-push"

// Configure web-push with your VAPID keys (optional in dev/build)
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const privateKey = process.env.VAPID_PRIVATE_KEY

if (publicKey && privateKey) {
  webpush.setVapidDetails("mailto:support@mufc-nigeria.com", publicKey, privateKey)
}

export async function POST(request: NextRequest) {
  try {
    if (!publicKey || !privateKey) {
      return NextResponse.json({ success: false, message: "Push not configured" }, { status: 503 })
    }

    const { title, body, url, subscriptions } = await request.json()

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
      subscriptions.map((subscription: any) => webpush.sendNotification(subscription, JSON.stringify(notificationPayload))),
    )

    const successful = results.filter((result) => result.status === "fulfilled").length
    const failed = results.filter((result) => result.status === "rejected").length

    return NextResponse.json({ success: true, sent: successful, failed, total: subscriptions.length })
  } catch (error) {
    console.error("Error sending push notifications:", error)
    return NextResponse.json({ success: false, message: "Failed to send notifications" }, { status: 500 })
  }
}
