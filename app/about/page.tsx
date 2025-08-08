"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>About MUFC Nigeria Store</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              We are dedicated to bringing authentic Manchester United merchandise to fans across Nigeria. Our mission is
              to provide quality products, fast delivery, and excellent customer service.
            </p>
            <p className="text-gray-700 mb-4">
              This is a demo About page to complete navigation and avoid 404 errors from the header links.
            </p>
            <Link href="/">Go back home</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}