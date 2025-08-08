"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const categories = [
  { name: "Jerseys", href: "/catalog?category=jerseys", image: "https://i.pinimg.com/736x/0d/7f/f0/0d7ff025da877ceb6e6684a3c0cf3887.jpg" },
  { name: "Training", href: "/catalog?category=training", image: "https://i.pinimg.com/736x/15/43/89/154389e05ad498a7b5d78615e188e23d.jpg" },
  { name: "Accessories", href: "/catalog?category=accessories", image: "https://i.pinimg.com/736x/10/64/67/10646777faf995a86509dc798fd388e3.jpg" },
  { name: "Kids", href: "/catalog?category=kids", image: "https://i.pinimg.com/736x/ec/75/0f/ec750fb668525fff242881721a877b7b.jpg" },
]

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Catalog</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((c) => (
                <Link key={c.name} href={c.href} className="group">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg border">
                    <Image src={c.image} alt={c.name} width={400} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="mt-2 font-medium group-hover:text-red-600">{c.name}</div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}