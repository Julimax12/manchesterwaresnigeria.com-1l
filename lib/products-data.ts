export interface BulkPricingTier {
  minQuantity: number
  maxQuantity?: number
  discount: number // percentage discount
  price?: number // fixed price per unit (optional, overrides discount)
  label: string
}

export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  description: string
  category: string
  brand?: string
  images: string[]
  sizes?: string[]
  colors?: Array<{
    name: string
    hex: string
    price?: number
  }>
  rating: number
  reviewCount: number
  stock: number
  isNew?: boolean
  isBestSeller?: boolean
  isAuthentic?: boolean
  features?: string[]
  specifications?: Record<string, string>
  tags?: string[]
  bulkPricing?: BulkPricingTier[] // Add bulk pricing tiers
  minBulkQuantity?: number // Minimum quantity for bulk pricing
  maxOrderQuantity?: number // Maximum quantity per order
}

export const products: Product[] = [
  {
    id: 1,
    name: "Manchester United Home Jersey 2024/25",
    price: 45000,
    originalPrice: 55000,
    description:
      "The official Manchester United home jersey for the 2024/25 season. Made with Nike's Dri-FIT technology to keep you cool and comfortable. Features the classic red design with modern performance materials and the iconic club crest.",
    category: "jerseys",
    brand: "Nike",
    images: [
      "https://i.pinimg.com/736x/0d/7f/f0/0d7ff025da877ceb6e6684a3c0cf3887.jpg",
      "https://i.pinimg.com/736x/c1/d5/87/c1d58739e75db8054f641143364f9f7a.jpg",
      "https://i.pinimg.com/736x/f8/60/27/f860274f4fed7754fbe9478d43e9199e.jpg",
      "https://i.pinimg.com/736x/64/91/4f/64914ffd20c2401de12d804dcd4eed49.jpg",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Red", hex: "#DC143C" },
      { name: "White", hex: "#FFFFFF", price: 47000 },
    ],
    rating: 4.8,
    reviewCount: 124,
    stock: 15,
    isNew: true,
    isBestSeller: true,
    isAuthentic: true,
    features: [
      "Nike Dri-FIT technology for moisture management",
      "100% authentic Manchester United merchandise",
      "Official club crest and sponsor logos",
      "Lightweight and breathable fabric",
      "Machine washable",
      "Available in all standard sizes",
    ],
    specifications: {
      material: "100% Polyester",
      technology: "Nike Dri-FIT",
      fit: "Stadium Fit",
      care: "Machine wash cold",
      origin: "Made in Thailand",
      season: "2024/25",
    },
    tags: ["jersey", "home", "nike", "dri-fit", "official"],
    bulkPricing: [
      { minQuantity: 5, maxQuantity: 9, discount: 5, label: "5-9 items: 5% off" },
      { minQuantity: 10, maxQuantity: 19, discount: 10, label: "10-19 items: 10% off" },
      { minQuantity: 20, maxQuantity: 49, discount: 15, label: "20-49 items: 15% off" },
      { minQuantity: 50, discount: 20, label: "50+ items: 20% off" },
    ],
    minBulkQuantity: 5,
    maxOrderQuantity: 100,
  },
  {
    id: 2,
    name: "Manchester United Away Jersey 2024/25",
    price: 45000,
    originalPrice: 55000,
    description:
      "The official Manchester United away jersey for the 2024/25 season. Features a sleek design with premium materials and the iconic club crest.",
    category: "jerseys",
    brand: "Nike",
    images: [
      "https://i.pinimg.com/736x/6c/68/d8/6c68d820dc0223cb2a9252ef6d438862.jpg",
      "https://i.pinimg.com/736x/6d/31/4a/6d314aa9b68a972c39a5877de6624d4e.jpg",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Navy", hex: "#000080", price: 47000 },
    ],
    rating: 4.7,
    reviewCount: 89,
    stock: 12,
    isNew: true,
    isAuthentic: true,
    features: [
      "Nike Dri-FIT technology",
      "Official away design",
      "Premium fabric construction",
      "Authentic club branding",
    ],
    specifications: {
      material: "100% Polyester",
      technology: "Nike Dri-FIT",
      fit: "Stadium Fit",
      care: "Machine wash cold",
      origin: "Made in Thailand",
      season: "2024/25",
    },
    tags: ["jersey", "away", "nike", "official"],
    bulkPricing: [
      { minQuantity: 5, maxQuantity: 9, discount: 5, label: "5-9 items: 5% off" },
      { minQuantity: 10, maxQuantity: 19, discount: 10, label: "10-19 items: 10% off" },
      { minQuantity: 20, maxQuantity: 49, discount: 15, label: "20-49 items: 15% off" },
      { minQuantity: 50, discount: 20, label: "50+ items: 20% off" },
    ],
    minBulkQuantity: 5,
    maxOrderQuantity: 100,
  },
  {
    id: 3,
    name: "Official Training Kit",
    price: 32000,
    originalPrice: 38000,
    description:
      "Professional training kit used by Manchester United players. Perfect for training sessions and casual wear.",
    category: "training",
    brand: "Nike",
    images: [
      "https://i.pinimg.com/736x/15/43/89/154389e05ad498a7b5d78615e188e23d.jpg",
      "https://i.pinimg.com/736x/1b/10/c2/1b10c2e695494777087d6105ce59b8d6.jpg",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Red", hex: "#DC143C" },
      { name: "Black", hex: "#000000", price: 34000 },
    ],
    rating: 4.6,
    reviewCount: 67,
    stock: 20,
    isBestSeller: true,
    isAuthentic: true,
    features: [
      "Moisture-wicking fabric",
      "Comfortable fit for training",
      "Official Manchester United branding",
      "Durable construction",
    ],
    specifications: {
      material: "Polyester blend",
      fit: "Athletic Fit",
      care: "Machine wash cold",
      origin: "Made in Vietnam",
    },
    tags: ["training", "kit", "nike", "official"],
    bulkPricing: [
      { minQuantity: 10, maxQuantity: 24, discount: 8, label: "10-24 items: 8% off" },
      { minQuantity: 25, maxQuantity: 49, discount: 12, label: "25-49 items: 12% off" },
      { minQuantity: 50, discount: 18, label: "50+ items: 18% off" },
    ],
    minBulkQuantity: 10,
    maxOrderQuantity: 200,
  },
  {
    id: 4,
    name: "Manchester United Scarf",
    price: 8500,
    originalPrice: 12000,
    description: "Official Manchester United scarf perfect for showing your support at matches or in cold weather.",
    category: "accessories",
    brand: "Manchester United",
    images: [
      "https://i.pinimg.com/736x/10/64/67/10646777faf995a86509dc798fd388e3.jpg",
      "https://i.pinimg.com/736x/83/e7/ea/83e7ea8a7e889ba9e5809830338a72e4.jpg",
    ],
    colors: [
      { name: "Red/White", hex: "#DC143C" },
      { name: "Red/Black", hex: "#DC143C", price: 9000 },
    ],
    rating: 4.9,
    reviewCount: 156,
    stock: 50,
    isAuthentic: true,
    features: [
      "Official Manchester United branding",
      "Soft and warm material",
      "Classic design",
      "Perfect for match days",
    ],
    specifications: {
      material: "Acrylic",
      dimensions: "140cm x 18cm",
      care: "Hand wash recommended",
      origin: "Made in UK",
    },
    tags: ["scarf", "accessories", "official", "supporter"],
    bulkPricing: [
      { minQuantity: 12, maxQuantity: 23, discount: 10, label: "12-23 items: 10% off" },
      { minQuantity: 24, maxQuantity: 47, discount: 15, label: "24-47 items: 15% off" },
      { minQuantity: 48, discount: 25, label: "48+ items: 25% off" },
    ],
    minBulkQuantity: 12,
    maxOrderQuantity: 500,
  },
  {
    id: 5,
    name: "Official Football",
    price: 15000,
    originalPrice: 18000,
    description: "Official Manchester United football perfect for training and recreational play.",
    category: "accessories",
    brand: "Nike",
    images: [
      "https://i.pinimg.com/736x/23/eb/66/23eb663feb9c52b266eca96d22b8c1f1.jpg",
      "https://i.pinimg.com/736x/2f/eb/34/2feb349ebecd19f07bd6463456c9b550.jpg",
    ],
    colors: [{ name: "Red/White", hex: "#DC143C" }],
    rating: 4.7,
    reviewCount: 89,
    stock: 25,
    isAuthentic: true,
    features: [
      "Official Manchester United design",
      "High-quality construction",
      "Perfect for training",
      "Durable materials",
    ],
    specifications: {
      size: "Size 5",
      material: "Synthetic leather",
      bladder: "Butyl bladder",
      origin: "Made in Pakistan",
    },
    tags: ["football", "ball", "nike", "official", "training"],
  },
  {
    id: 6,
    name: "Kids Home Jersey",
    price: 35000,
    originalPrice: 42000,
    description: "Official Manchester United home jersey designed specifically for young fans.",
    category: "kids",
    brand: "Nike",
    images: [
      "https://i.pinimg.com/736x/ec/75/0f/ec750fb668525fff242881721a877b7b.jpg",
      "https://i.pinimg.com/736x/16/70/88/167088e0e0458b684ac9b32e1b81328d.jpg",
    ],
    sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    colors: [{ name: "Red", hex: "#DC143C" }],
    rating: 4.8,
    reviewCount: 92,
    stock: 18,
    isNew: true,
    isAuthentic: true,
    features: [
      "Kid-friendly fit and design",
      "Durable materials for active play",
      "Official Manchester United branding",
      "Easy care instructions",
    ],
    specifications: {
      material: "100% Polyester",
      technology: "Nike Dri-FIT",
      fit: "Kids Stadium Fit",
      care: "Machine wash cold",
      origin: "Made in Thailand",
    },
    tags: ["kids", "jersey", "home", "nike", "official"],
  },
]
