import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "p-1",
    slug: "air-runner-pro",
    name: "Air Runner Pro",
    brand: "Playground",
    category: "Shoes",
    description:
      "Lightweight running shoe with responsive cushioning and breathable mesh upper.",
    price: 149,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop",
    ],
    colors: ["Black", "White", "Volt"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    tags: ["running", "men"],
    rating: 4.7,
    reviewsCount: 842,
  },
  {
    id: "p-2",
    slug: "street-court-xt",
    name: "Street Court XT",
    brand: "Playground",
    category: "Shoes",
    description: "All-day comfort with classic court style and durable leather upper.",
    price: 119,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1600&auto=format&fit=crop",
    ],
    colors: ["White", "Navy"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    tags: ["lifestyle", "unisex"],
    rating: 4.5,
    reviewsCount: 421,
  },
  {
    id: "p-3",
    slug: "flex-train-2",
    name: "Flex Train 2",
    brand: "Playground",
    category: "Shoes",
    description: "Stability and grip for versatile gym training and HIIT workouts.",
    price: 99,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1600&auto=format&fit=crop",
    ],
    colors: ["Grey", "Red"],
    sizes: ["7", "8", "9", "10", "11"],
    tags: ["training", "men"],
    rating: 4.3,
    reviewsCount: 198,
  },
  {
    id: "p-4",
    slug: "dri-fit-elite-tee",
    name: "Dri-Fit Elite Tee",
    brand: "Playground",
    category: "Apparel",
    description: "Moisture-wicking performance tee designed to keep you cool and dry.",
    price: 39,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop",
    ],
    colors: ["Black", "Blue", "Olive"],
    sizes: ["S", "M", "L", "XL"],
    tags: ["training", "men"],
    rating: 4.6,
    reviewsCount: 310,
  },
  {
    id: "p-5",
    slug: "studio-leggings-7-8",
    name: "Studio Leggings 7/8",
    brand: "Playground",
    category: "Apparel",
    description: "High-rise leggings with four-way stretch and buttery soft feel.",
    price: 69,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1600&auto=format&fit=crop",
    ],
    colors: ["Black", "Wine", "Teal"],
    sizes: ["XS", "S", "M", "L"],
    tags: ["yoga", "women"],
    rating: 4.8,
    reviewsCount: 1266,
  },
  {
    id: "p-6",
    slug: "pro-windrunner-jacket",
    name: "Pro Windrunner Jacket",
    brand: "Playground",
    category: "Outerwear",
    description: "Lightweight, packable, and water-repellent shell for windy days.",
    price: 129,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1520974735194-8764fe75e93f?q=80&w=1600&auto=format&fit=crop",
    ],
    colors: ["Black", "Orange"],
    sizes: ["S", "M", "L", "XL"],
    tags: ["running", "unisex"],
    rating: 4.4,
    reviewsCount: 229,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function searchProducts(query: string, category?: string) {
  const q = query.trim().toLowerCase();
  return products.filter((p) => {
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q));
    const matchesCategory = !category || p.category === category;
    return matchesQuery && matchesCategory;
  });
}