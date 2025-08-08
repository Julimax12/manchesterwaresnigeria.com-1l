"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { products } from "@/lib/products-data"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((p) => (
            <Link key={p.id} href={`/product/${p.id}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <Image src={p.images[0] || "/placeholder.svg"} alt={p.name} width={400} height={300} className="w-full h-48 object-cover" />
                <CardContent className="p-4">
                  <div className="font-medium line-clamp-2">{p.name}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}