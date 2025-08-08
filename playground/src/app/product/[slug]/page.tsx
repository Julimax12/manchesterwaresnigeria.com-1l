import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { getProductBySlug, products } from "@/lib/products";
import type { Product } from "@/types/product";
import { AddToCart } from "@/components/AddToCart";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return notFound();

  return (
    <Container className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden border bg-black/5">
          <Image src={product.images[0]} alt={product.name} width={1200} height={1200} className="w-full h-auto object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
          <div className="mt-3 text-xl font-semibold">${product.price}</div>

          {product.colors.length > 0 && (
            <div className="mt-6">
              <div className="text-sm font-medium mb-2">Color</div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <span key={c} className="px-3 py-1.5 rounded-full border text-xs">{c}</span>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-6">
              <div className="text-sm font-medium mb-2">Size</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full border text-xs">{s}</span>
                ))}
              </div>
            </div>
          )}

          <p className="mt-6 text-sm leading-6 text-muted-foreground">{product.description}</p>

          <div className="mt-8">
            <AddToCart product={product as Product} />
          </div>
        </div>
      </div>
    </Container>
  );
}