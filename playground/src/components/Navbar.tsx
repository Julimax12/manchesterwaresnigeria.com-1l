"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";

export function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems());
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    setQuery(searchParams.get("search") ?? "");
  }, [searchParams]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query) params.set("search", query);
    else params.delete("search");
    router.push(`/products?${params.toString()}`);
  }

  const linkBase = "px-3 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10";
  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Playground
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className={`${linkBase} ${isActive("/") ? "bg-black/5 dark:bg-white/10" : ""}`}>Home</Link>
          <Link href="/products" className={`${linkBase} ${isActive("/products") ? "bg-black/5 dark:bg-white/10" : ""}`}>Products</Link>
          <Link href="/cart" className={`${linkBase} ${isActive("/cart") ? "bg-black/5 dark:bg-white/10" : ""}`}>Cart</Link>
        </nav>
        <div className="flex items-center gap-2">
          <form onSubmit={onSubmit} className="hidden sm:flex items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shoes, tees..."
              className="w-48 sm:w-64 rounded-l-full border px-3 py-1.5 text-sm outline-none bg-transparent"
            />
            <button className="rounded-r-full border border-l-0 px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10">
              Search
            </button>
          </form>
          <ThemeToggle />
          <Link href="/cart" className="relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10">
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black text-white text-xs dark:bg-white dark:text-black">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}