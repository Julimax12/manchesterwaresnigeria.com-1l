"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";

export function CartContent() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Your cart is empty. <Link href="/products" className="underline">Browse products</Link>.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
      <div className="space-y-4">
        {items.map((i) => (
          <div key={`${i.product.id}-${i.selectedColor ?? ""}-${i.selectedSize ?? ""}`} className="flex gap-4 rounded-xl border p-3">
            <Image src={i.product.images[0]} alt={i.product.name} width={120} height={120} className="h-24 w-24 rounded-lg object-cover" />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium">{i.product.name}</div>
                  <div className="text-xs text-muted-foreground">{i.selectedColor ?? ""} {i.selectedSize ?? ""}</div>
                </div>
                <div className="text-sm font-semibold">${i.product.price}</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => updateQuantity(i.product.id, i.quantity - 1, i.selectedColor, i.selectedSize)} className="h-8 w-8 rounded-full border text-sm">-</button>
                <div className="text-sm w-8 text-center">{i.quantity}</div>
                <button onClick={() => updateQuantity(i.product.id, i.quantity + 1, i.selectedColor, i.selectedSize)} className="h-8 w-8 rounded-full border text-sm">+</button>
                <button onClick={() => removeItem(i.product.id, i.selectedColor, i.selectedSize)} className="ml-2 text-xs text-red-600 underline">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border p-4 h-max">
        <div className="text-lg font-semibold">Order summary</div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal().toFixed(2)}</span>
        </div>
        <Link href="/checkout" className="mt-4 block rounded-full border px-4 py-2 text-center text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10">Checkout</Link>
      </div>
    </div>
  );
}