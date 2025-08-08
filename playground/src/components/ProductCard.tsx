"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  function onAdd() {
    addItem({ product, quantity: 1 });
  }

  return (
    <div className="group rounded-2xl border p-3 hover:shadow-md transition-shadow bg-background">
      <Link href={`/product/${product.slug}`} className="block overflow-hidden rounded-xl bg-black/5">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={600}
          height={600}
          className="aspect-square object-cover transition-transform group-hover:scale-[1.03]"
        />
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium leading-tight">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-xs text-muted-foreground">{product.category}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold">${product.price}</div>
        </div>
      </div>
      <button
        onClick={onAdd}
        className="mt-3 w-full rounded-full border px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
      >
        Add to cart
      </button>
    </div>
  );
}