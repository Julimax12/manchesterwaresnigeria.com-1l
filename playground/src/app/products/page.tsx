import { products as allProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { Container } from "@/components/Container";

export const dynamic = "force-static";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ search?: string; category?: string }> }) {
  const sp = await searchParams;
  const query = (sp.search ?? "").toLowerCase();
  const category = sp.category ?? "";
  const products = allProducts.filter((p) => {
    const matchesQuery = !query ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.tags ?? []).some((t) => t.toLowerCase().includes(query));
    const matchesCategory = !category || p.category === category;
    return matchesQuery && matchesCategory;
  });

  const categories = Array.from(new Set(allProducts.map((p) => p.category)));

  return (
    <Container className="py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Products</h1>
          <p className="text-sm text-muted-foreground">Browse our latest footwear and apparel</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/products" className={`px-3 py-1.5 rounded-full border text-sm ${category === "" ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}>All</a>
          {categories.map((c) => (
            <a key={c} href={`/products?category=${encodeURIComponent(c)}`} className={`px-3 py-1.5 rounded-full border text-sm ${category === c ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}>{c}</a>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-sm text-muted-foreground">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </Container>
  );
}