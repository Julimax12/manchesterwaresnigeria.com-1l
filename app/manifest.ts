import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MUFC Nigeria Store - Official Manchester United Merchandise",
    short_name: "MUFC Store",
    description:
      "Your trusted source for authentic Manchester United merchandise in Nigeria. Shop jerseys, training gear, accessories and more with PWA features.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#dc2626",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en-NG",
    dir: "ltr",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
    categories: ["shopping", "sports", "lifestyle"],
    screenshots: [
      {
        src: "/screenshots/desktop-home.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Home page on desktop",
      },
      {
        src: "/screenshots/mobile-catalog.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Product catalog on mobile",
      },
    ],
    icons: [
      {
        src: "/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Shop Jerseys",
        short_name: "Jerseys",
        description: "Browse Manchester United jerseys",
        url: "/catalog?category=jerseys",
        icons: [{ src: "/shortcut-jerseys.png", sizes: "192x192" }],
      },
      {
        name: "Training Gear",
        short_name: "Training",
        description: "Browse training equipment",
        url: "/catalog?category=training",
        icons: [{ src: "/shortcut-training.png", sizes: "192x192" }],
      },
      {
        name: "Bulk Orders",
        short_name: "Bulk",
        description: "Place bulk orders for teams",
        url: "/bulk-order",
        icons: [{ src: "/shortcut-bulk.png", sizes: "192x192" }],
      },
      {
        name: "My Cart",
        short_name: "Cart",
        description: "View shopping cart",
        url: "/cart",
        icons: [{ src: "/shortcut-cart.png", sizes: "192x192" }],
      },
    ],
    related_applications: [
      {
        platform: "play",
        url: "https://play.google.com/store/apps/details?id=com.mufc.nigeria.store",
        id: "com.mufc.nigeria.store",
      },
    ],
    prefer_related_applications: false,
    edge_side_panel: {
      preferred_width: 400,
    },
    launch_handler: {
      client_mode: "navigate-existing",
    },
  }
}
