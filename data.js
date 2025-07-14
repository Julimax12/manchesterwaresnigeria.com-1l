// Product Data
const products = [
  {
    id: 1,
    name: "Manchester United Home Jersey 2024/25",
    category: "jerseys",
    price: 45000,
    originalPrice: 55000,
    rating: 4.8,
    reviewCount: 124,
    description:
      "The official Manchester United home jersey for the 2024/25 season. Made with Nike Dri-FIT technology for superior moisture management. Features the classic red design with modern styling.",
    images: [
      "https://i.pinimg.com/736x/dd/2f/0b/dd2f0becc75596c3e2e3827006f305c7.jpg",
      "https://i.pinimg.com/736x/80/07/2e/80072e9464208d24e7b5fb4f8aa664f1.jpg",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Red", hex: "#dc2626" },
      { name: "White", hex: "#ffffff" },
    ],
    stock: 25,
    isNew: true,
    isBestSeller: true,
    features: [
      "Nike Dri-FIT technology",
      "100% authentic Manchester United merchandise",
      "Official club crest and sponsor logos",
      "Comfortable fit for all-day wear",
      "Machine washable",
    ],
  },
  {
    id: 2,
    name: "Manchester United Away Jersey 2024/25",
    category: "jerseys",
    price: 45000,
    originalPrice: 55000,
    rating: 4.7,
    reviewCount: 98,
    description:
      "The official Manchester United away jersey for the 2024/25 season. Features a sleek design with premium materials and authentic club branding.",
    images: [
      "https://i.pinimg.com/736x/80/07/2e/80072e9464208d24e7b5fb4f8aa664f1.jpg",
      "https://i.pinimg.com/736x/dd/2f/0b/dd2f0becc75596c3e2e3827006f305c7.jpg",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Navy", hex: "#1e3a8a" },
    ],
    stock: 18,
    isNew: true,
    isBestSeller: false,
    features: [
      "Nike Dri-FIT technology",
      "100% authentic Manchester United merchandise",
      "Official club crest and sponsor logos",
      "Lightweight and breathable fabric",
      "Modern athletic fit",
    ],
  },
  {
    id: 3,
    name: "Manchester United Training Kit",
    category: "training",
    price: 32000,
    originalPrice: 38000,
    rating: 4.6,
    reviewCount: 76,
    description:
      "Professional training kit used by Manchester United players. Perfect for training sessions and casual wear.",
    images: [
      "https://i.pinimg.com/736x/80/07/2e/80072e9464208d24e7b5fb4f8aa664f1.jpg",
      "https://i.pinimg.com/736x/5e/e3/af/5ee3af1f249b02372e9104a951e13a12.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Red", hex: "#dc2626" },
    ],
    stock: 30,
    isNew: false,
    isBestSeller: true,
    features: [
      "Moisture-wicking fabric",
      "Flexible and comfortable",
      "Official training gear",
      "Durable construction",
      "Perfect for workouts",
    ],
  },
  {
    id: 4,
    name: "Manchester United Official Scarf",
    category: "accessories",
    price: 8500,
    originalPrice: 12000,
    rating: 4.9,
    reviewCount: 203,
    description:
      "Show your support with this official Manchester United scarf. Perfect for match days and cold weather.",
    images: [
      "https://i.pinimg.com/736x/5e/e3/af/5ee3af1f249b02372e9104a951e13a12.jpg",
      "https://i.pinimg.com/736x/dd/2f/0b/dd2f0becc75596c3e2e3827006f305c7.jpg",
    ],
    sizes: ["One Size"],
    colors: [{ name: "Red/White", hex: "#dc2626" }],
    stock: 50,
    isNew: false,
    isBestSeller: true,
    features: [
      "100% acrylic material",
      "Official Manchester United branding",
      "Soft and warm",
      "Perfect for match days",
      "Machine washable",
    ],
  },
  {
    id: 5,
    name: "Manchester United Football",
    category: "accessories",
    price: 15000,
    originalPrice: 18000,
    rating: 4.5,
    reviewCount: 89,
    description: "Official Manchester United football. Perfect for training, playing, or as a collectible item.",
    images: [
      "https://i.pinimg.com/736x/6f/ce/3a/6fce3a2760bbb23aeb8f9cc1ddf2cf6c.jpg",
      "https://i.pinimg.com/736x/5e/e3/af/5ee3af1f249b02372e9104a951e13a12.jpg",
    ],
    sizes: ["Size 5"],
    colors: [{ name: "Red/White", hex: "#dc2626" }],
    stock: 40,
    isNew: false,
    isBestSeller: false,
    features: [
      "Official Manchester United football",
      "FIFA approved size and weight",
      "Durable synthetic leather",
      "Perfect for training",
      "Collectible item",
    ],
  },
  {
    id: 6,
    name: "Manchester United Kids Jersey",
    category: "kids",
    price: 35000,
    originalPrice: 42000,
    rating: 4.8,
    reviewCount: 156,
    description:
      "Let your little Red Devil show their support with this official kids jersey. Same quality as adult jerseys in kid-friendly sizes.",
    images: [
      "https://i.pinimg.com/736x/16/70/88/167088e0e0458b684ac9b32e1b81328d.jpg",
      "https://i.pinimg.com/736x/dd/2f/0b/dd2f0becc75596c3e2e3827006f305c7.jpg",
    ],
    sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    colors: [
      { name: "Red", hex: "#dc2626" },
      { name: "White", hex: "#ffffff" },
    ],
    stock: 35,
    isNew: true,
    isBestSeller: true,
    features: [
      "Kid-friendly sizing",
      "Same quality as adult jerseys",
      "Comfortable and durable",
      "Official club branding",
      "Perfect for young fans",
    ],
  },
  {
    id: 7,
    name: "Manchester United Cap",
    category: "accessories",
    price: 12000,
    originalPrice: 15000,
    rating: 4.4,
    reviewCount: 67,
    description: "Official Manchester United cap. Perfect for sunny days and showing your support wherever you go.",
    images: [
      "https://i.pinimg.com/736x/5e/e3/af/5ee3af1f249b02372e9104a951e13a12.jpg",
      "https://i.pinimg.com/736x/6f/ce/3a/6fce3a2760bbb23aeb8f9cc1ddf2cf6c.jpg",
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Red", hex: "#dc2626" },
      { name: "Black", hex: "#000000" },
    ],
    stock: 45,
    isNew: false,
    isBestSeller: false,
    features: [
      "Adjustable strap",
      "100% cotton",
      "Official Manchester United logo",
      "UV protection",
      "Comfortable fit",
    ],
  },
  {
    id: 8,
    name: "Manchester United Training Shorts",
    category: "training",
    price: 18000,
    originalPrice: 22000,
    rating: 4.3,
    reviewCount: 54,
    description:
      "Professional training shorts worn by Manchester United players. Lightweight and comfortable for all activities.",
    images: [
      "https://i.pinimg.com/736x/80/07/2e/80072e9464208d24e7b5fb4f8aa664f1.jpg",
      "https://i.pinimg.com/736x/5e/e3/af/5ee3af1f249b02372e9104a951e13a12.jpg",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Red", hex: "#dc2626" },
    ],
    stock: 28,
    isNew: false,
    isBestSeller: false,
    features: [
      "Lightweight fabric",
      "Moisture-wicking technology",
      "Elastic waistband",
      "Side pockets",
      "Official training gear",
    ],
  },
]

// Initialize filtered products
const filteredProducts = [...products]

// Bulk pricing tiers
const bulkPricingTiers = [
  { min: 1, max: 4, discount: 0 },
  { min: 5, max: 9, discount: 0.05 },
  { min: 10, max: 19, discount: 0.1 },
  { min: 20, max: 49, discount: 0.15 },
  { min: 50, max: Number.POSITIVE_INFINITY, discount: 0.2 },
]

// Utility functions
function calculateBulkDiscount(quantity) {
  const tier = bulkPricingTiers.find((tier) => quantity >= tier.min && quantity <= tier.max)
  return tier ? tier.discount : 0
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount)
}

function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9)
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    products,
    filteredProducts,
    bulkPricingTiers,
    calculateBulkDiscount,
    formatCurrency,
    generateId,
    debounce,
  }
}
