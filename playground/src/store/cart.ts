"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

export type CartItem = {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
};

export type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, selectedColor?: string, selectedSize?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    selectedColor?: string,
    selectedSize?: string
  ) => void;
  clear: () => void;
  totalItems: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const { items } = get();
        const idx = items.findIndex(
          (i) =>
            i.product.id === newItem.product.id &&
            i.selectedColor === newItem.selectedColor &&
            i.selectedSize === newItem.selectedSize
        );
        if (idx !== -1) {
          const updated = [...items];
          updated[idx] = {
            ...updated[idx],
            quantity: updated[idx].quantity + newItem.quantity,
          };
          set({ items: updated });
        } else {
          set({ items: [...items, newItem] });
        }
      },
      removeItem: (productId, selectedColor, selectedSize) => {
        const filtered = get().items.filter(
          (i) =>
            !(
              i.product.id === productId &&
              i.selectedColor === selectedColor &&
              i.selectedSize === selectedSize
            )
        );
        set({ items: filtered });
      },
      updateQuantity: (productId, quantity, selectedColor, selectedSize) => {
        const updated = get().items.map((i) => {
          if (
            i.product.id === productId &&
            i.selectedColor === selectedColor &&
            i.selectedSize === selectedSize
          ) {
            return { ...i, quantity: Math.max(1, quantity) };
          }
          return i;
        });
        set({ items: updated });
      },
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: () => get().items.reduce((acc, i) => acc + i.quantity * i.product.price, 0),
    }),
    { name: "playground-cart" }
  )
);