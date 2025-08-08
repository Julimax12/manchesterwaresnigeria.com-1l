"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">For inquiries, please email support@mufc-nigeria.com or call +234 9122977491.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}