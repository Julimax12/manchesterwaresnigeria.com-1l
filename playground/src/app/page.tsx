import Link from "next/link";
import { Container } from "@/components/Container";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const featured = products.slice(0, 4);
  return (
    <div>
      <section className="border-b bg-gradient-to-b from-transparent to-black/[.03] dark:to-white/[.03]">
        <Container className="py-14">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Playground</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">Performance meets style.</h1>
            <p className="mt-3 text-sm text-muted-foreground">Discover footwear and apparel engineered for movement. Shop the latest drops and timeless essentials.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/products" className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10">Shop now</Link>
              <Link href="/products?category=Shoes" className="rounded-full border px-4 py-2 text-sm">Footwear</Link>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-semibold tracking-tight">Featured</h2>
          <Link href="/products" className="text-sm underline">Browse all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </div>
  );
}
