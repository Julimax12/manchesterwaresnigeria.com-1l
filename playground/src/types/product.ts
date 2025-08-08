export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  colors: string[];
  sizes: string[];
  tags?: string[];
  rating?: number;
  reviewsCount?: number;
};