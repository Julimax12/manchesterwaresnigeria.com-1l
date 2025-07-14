"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wifi, RefreshCw } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wifi className="h-8 w-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">You're Offline</h1>

          <p className="text-gray-600 mb-6">
            It looks like you've lost your internet connection. Don't worry, you can still browse some cached content.
          </p>

          <div className="space-y-4">
            <Button onClick={() => window.location.reload()} className="w-full bg-red-600 hover:bg-red-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent">
                Go to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
