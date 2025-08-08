"use client";

import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/product";

export function AddToCart({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <button
      onClick={() => addItem({ product, quantity: 1 })}
      className="w-full sm:w-auto rounded-full border px-5 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
    >
      Add to cart
    </button>
  );
}