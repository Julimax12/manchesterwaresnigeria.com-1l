// Global Variables
let deferredPrompt
let isOnline = navigator.onLine
let currentSection = "home"
let filteredProducts = []
let selectedProduct = null
let currentUser = null // Declare currentUser variable
let cart = [] // Declare cart variable
let wishlist = [] // Declare wishlist variable

// Helper Functions
function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function generateStars(rating) {
  let stars = ""
  for (let i = 0; i < Math.floor(rating); i++) {
    stars += '<i class="fas fa-star"></i>'
  }
  if (rating % 1 !== 0) {
    stars += '<i class="fas fa-star-half-alt"></i>'
  }
  return stars
}

function formatPrice(price) {
  return `Rp${price.toLocaleString("id-ID")}`
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.classList.add("notification", type)
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    document.body.removeChild(notification)
  }, 3000)
}

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  checkOnlineStatus()
  setupPWA()
  loadFeaturedProducts()
  loadAllProducts()
  updateCartCount()
  updateWishlistCount()
})

function initializeApp() {
  // Load user session
  const savedUser = getFromLocalStorage("manchester-wares-user")
  if (savedUser) {
    currentUser = savedUser
    updateUserInterface()
  }

  // Load cart and wishlist
  cart = getFromLocalStorage("manchester-wares-cart") || []
  wishlist = getFromLocalStorage("manchester-wares-wishlist") || []

  // Initialize product filters
  filteredProducts = Array.isArray(products) ? [...products] : []

  // Set active section
  showSection("home")
}

function setupEventListeners() {
  // Navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const section = link.getAttribute("href").substring(1)
      showSection(section)
    })
  })

  // User actions
  document.getElementById("account-btn").addEventListener("click", () => {
    openModal("account-modal")
  })

  document.getElementById("cart-btn").addEventListener("click", () => {
    loadCartItems()
    openModal("cart-modal")
  })

  document.getElementById("wishlist-btn").addEventListener("click", () => {
    showWishlist()
  })

  // Auth forms
  document.getElementById("login-form-element").addEventListener("submit", handleLogin)
  document.getElementById("register-form-element").addEventListener("submit", handleRegister)

  // Contact form
  document.getElementById("contact-form").addEventListener("submit", handleContactForm)

  // Filters
  document.getElementById("category-filter").addEventListener("change", handleCategoryFilter)
  document.getElementById("sort-filter").addEventListener("change", handleSortFilter)

  // PWA Install
  document.getElementById("install-btn").addEventListener("click", installPWA)
  document.getElementById("dismiss-install").addEventListener("click", () => {
    document.getElementById("install-banner").classList.add("hidden")
  })

  // Password strength
  document.getElementById("register-password").addEventListener("input", checkPasswordStrength)

  // Mobile menu
  document.getElementById("menu-toggle").addEventListener("click", toggleMobileMenu)
}

function checkOnlineStatus() {
  function updateOnlineStatus() {
    isOnline = navigator.onLine
    const offlineBanner = document.getElementById("offline-banner")

    if (isOnline) {
      offlineBanner.classList.add("hidden")
    } else {
      offlineBanner.classList.remove("hidden")
    }
  }

  window.addEventListener("online", updateOnlineStatus)
  window.addEventListener("offline", updateOnlineStatus)
  updateOnlineStatus()
}

function setupPWA() {
  // Register service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  }

  // Handle install prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault()
    deferredPrompt = e
    document.getElementById("install-banner").classList.remove("hidden")
  })

  // Request notification permission
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission()
  }
}

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((result) => {
      if (result.outcome === "accepted") {
        document.getElementById("install-banner").classList.add("hidden")
      }
      deferredPrompt = null
    })
  }
}

// Navigation Functions
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active")
  })

  // Show target section
  document.getElementById(sectionId).classList.add("active")

  // Update navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${sectionId}`) {
      link.classList.add("active")
    }
  })

  currentSection = sectionId

  // Load section-specific content
  if (sectionId === "catalog") {
    loadAllProducts()
  }
}

function toggleMobileMenu() {
  const nav = document.querySelector(".nav")
  nav.classList.toggle("mobile-active")
}

// Product Functions
function loadFeaturedProducts() {
  const featuredProducts = products.slice(0, 4)
  const container = document.getElementById("featured-products")
  container.innerHTML = featuredProducts.map((product) => createProductCard(product)).join("")
}

function loadAllProducts() {
  const container = document.getElementById("products-grid")
  container.innerHTML = filteredProducts.map((product) => createProductCard(product)).join("")
}

function createProductCard(product) {
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const isWishlisted = wishlist.includes(product.id)

  return `
        <div class="product-card" onclick="showProductDetails(${product.id})">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
                <div class="product-badges">
                    ${product.isNew ? '<span class="badge badge-new">New</span>' : ""}
                    ${product.isBestSeller ? '<span class="badge badge-bestseller">Best Seller</span>' : ""}
                    ${discountPercentage > 0 ? `<span class="badge badge-sale">${discountPercentage}% OFF</span>` : ""}
                </div>
                <button class="wishlist-btn ${isWishlisted ? "active" : ""}" onclick="event.stopPropagation(); toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="price-current">${formatPrice(product.price)}</span>
                    ${product.originalPrice ? `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ""}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `
}

function showProductDetails(productId) {
  selectedProduct = products.find((p) => p.id === productId)
  if (!selectedProduct) return

  const modalTitle = document.getElementById("product-modal-title")
  const productDetails = document.getElementById("product-details")

  modalTitle.textContent = selectedProduct.name

  const isWishlisted = wishlist.includes(selectedProduct.id)
  const discountPercentage = selectedProduct.originalPrice
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
    : 0

  productDetails.innerHTML = `
        <div class="product-gallery">
            <img id="main-product-image" src="${selectedProduct.images[0]}" alt="${selectedProduct.name}" class="product-main-image">
            ${
              selectedProduct.images.length > 1
                ? `
                <div class="product-thumbnails">
                    ${selectedProduct.images
                      .map(
                        (img, index) => `
                        <img src="${img}" alt="${selectedProduct.name}" class="thumbnail ${index === 0 ? "active" : ""}" 
                             onclick="changeMainImage('${img}', this)">
                    `,
                      )
                      .join("")}
                </div>
            `
                : ""
            }
        </div>
        <div class="product-detail-info">
            <div class="product-badges">
                ${selectedProduct.isNew ? '<span class="badge badge-new">New</span>' : ""}
                ${selectedProduct.isBestSeller ? '<span class="badge badge-bestseller">Best Seller</span>' : ""}
                ${discountPercentage > 0 ? `<span class="badge badge-sale">${discountPercentage}% OFF</span>` : ""}
            </div>
            <h1>${selectedProduct.name}</h1>
            <div class="product-rating">
                ${generateStars(selectedProduct.rating)}
                <span class="rating-count">(${selectedProduct.reviewCount} reviews)</span>
            </div>
            <div class="product-detail-price">
                ${formatPrice(selectedProduct.price)}
                ${selectedProduct.originalPrice ? `<span class="price-original">${formatPrice(selectedProduct.originalPrice)}</span>` : ""}
            </div>
            <p>${selectedProduct.description}</p>
            
            <div class="product-options">
                ${
                  selectedProduct.sizes
                    ? `
                    <div class="option-group">
                        <label>Size:</label>
                        <div class="size-options">
                            ${selectedProduct.sizes
                              .map(
                                (size) => `
                                <div class="size-option" onclick="selectSize('${size}', this)">${size}</div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                `
                    : ""
                }
                
                ${
                  selectedProduct.colors
                    ? `
                    <div class="option-group">
                        <label>Color:</label>
                        <div class="color-options">
                            ${selectedProduct.colors
                              .map(
                                (color) => `
                                <div class="color-option" style="background-color: ${color.hex}" 
                                     onclick="selectColor('${color.name}', this)" title="${color.name}"></div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                `
                    : ""
                }
                
                <div class="quantity-selector">
                    <label>Quantity:</label>
                    <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                    <input type="number" id="product-quantity" value="1" min="1" max="${selectedProduct.stock}" class="quantity-input">
                    <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                    <span class="stock-info">${selectedProduct.stock} available</span>
                </div>
            </div>
            
            <div class="product-actions">
                <button class="btn btn-primary btn-full" onclick="addToCartFromModal()">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="btn btn-outline" onclick="toggleWishlist(${selectedProduct.id})">
                    <i class="fas fa-heart ${isWishlisted ? "active" : ""}"></i> 
                    ${isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
            </div>
            
            ${
              selectedProduct.features
                ? `
                <div class="product-features">
                    <h3>Features:</h3>
                    <ul>
                        ${selectedProduct.features.map((feature) => `<li>${feature}</li>`).join("")}
                    </ul>
                </div>
            `
                : ""
            }
        </div>
    `

  openModal("product-modal")
}

function changeMainImage(src, thumbnail) {
  document.getElementById("main-product-image").src = src
  document.querySelectorAll(".thumbnail").forEach((thumb) => thumb.classList.remove("active"))
  thumbnail.classList.add("active")
}

function selectSize(size, element) {
  document.querySelectorAll(".size-option").forEach((opt) => opt.classList.remove("active"))
  element.classList.add("active")
}

function selectColor(color, element) {
  document.querySelectorAll(".color-option").forEach((opt) => opt.classList.remove("active"))
  element.classList.add("active")
}

function changeQuantity(change) {
  const quantityInput = document.getElementById("product-quantity")
  const currentValue = Number.parseInt(quantityInput.value)
  const newValue = Math.max(1, Math.min(selectedProduct.stock, currentValue + change))
  quantityInput.value = newValue
}

function addToCartFromModal() {
  const quantity = Number.parseInt(document.getElementById("product-quantity").value)
  const selectedSize = document.querySelector(".size-option.active")?.textContent
  const selectedColor = document.querySelector(".color-option.active")?.title

  // Validate required selections
  if (selectedProduct.sizes && !selectedSize) {
    showNotification("Please select a size", "error")
    return
  }

  // Add to cart with options
  for (let i = 0; i < quantity; i++) {
    cart.push({
      id: selectedProduct.id,
      size: selectedSize,
      color: selectedColor,
      timestamp: Date.now(),
    })
  }

  saveToLocalStorage("manchester-wares-cart", cart)
  updateCartCount()
  showNotification(`${selectedProduct.name} added to cart!`)

  // Send notification if permission granted
  if (Notification.permission === "granted") {
    new Notification("Added to Cart!", {
      body: `${selectedProduct.name} has been added to your cart`,
      icon: "icon-192x192.png",
    })
  }

  closeModal("product-modal")
}

// Filter and Sort Functions
function filterProducts(category) {
  if (category) {
    filteredProducts = products.filter((product) => product.category === category)
    document.getElementById("category-filter").value = category
  } else {
    filteredProducts = [...products]
  }

  loadAllProducts()
  showSection("catalog")
}

function handleCategoryFilter(e) {
  const category = e.target.value
  if (category) {
    filteredProducts = products.filter((product) => product.category === category)
  } else {
    filteredProducts = [...products]
  }
  loadAllProducts()
}

function handleSortFilter(e) {
  const sortBy = e.target.value

  switch (sortBy) {
    case "name":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price)
      break
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating)
      break
  }

  loadAllProducts()
}

// Cart Functions
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  cart.push({ id: productId, timestamp: Date.now() })
  saveToLocalStorage("manchester-wares-cart", cart)
  updateCartCount()
  showNotification(`${product.name} added to cart!`)

  // Send notification if permission granted
  if (Notification.permission === "granted") {
    new Notification("Added to Cart!", {
      body: `${product.name} has been added to your cart`,
      icon: "icon-192x192.png",
    })
  }
}

function loadCartItems() {
  const cartItemsContainer = document.getElementById("cart-items")
  const cartEmpty = document.getElementById("cart-empty")
  const cartSummary = document.getElementById("cart-summary")

  if (cart.length === 0) {
    cartItemsContainer.classList.add("hidden")
    cartSummary.classList.add("hidden")
    cartEmpty.classList.remove("hidden")
    return
  }

  cartEmpty.classList.add("hidden")
  cartItemsContainer.classList.remove("hidden")
  cartSummary.classList.remove("hidden")

  // Group cart items by product
  const groupedItems = {}
  cart.forEach((item) => {
    const key = typeof item === "object" ? `${item.id}-${item.size || ""}-${item.color || ""}` : item
    if (!groupedItems[key]) {
      groupedItems[key] = { ...item, quantity: 0 }
    }
    groupedItems[key].quantity++
  })

  let subtotal = 0
  const cartHTML = Object.values(groupedItems)
    .map((item) => {
      const productId = typeof item === "object" ? item.id : item
      const product = products.find((p) => p.id === productId)
      if (!product) return ""

      const itemTotal = product.price * item.quantity
      subtotal += itemTotal

      return `
            <div class="cart-item">
                <img src="${product.images[0]}" alt="${product.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${product.name}</div>
                    ${item.size ? `<div class="cart-item-size">Size: ${item.size}</div>` : ""}
                    ${item.color ? `<div class="cart-item-color">Color: ${item.color}</div>` : ""}
                    <div class="cart-item-price">${formatPrice(product.price)}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateCartQuantity('${typeof item === "object" ? `${item.id}-${item.size || ""}-${item.color || ""}` : item}', -1)">-</button>
                    <input type="number" value="${item.quantity}" class="quantity-input" readonly>
                    <button class="quantity-btn" onclick="updateCartQuantity('${typeof item === "object" ? `${item.id}-${item.size || ""}-${item.color || ""}` : item}', 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart('${typeof item === "object" ? `${item.id}-${item.size || ""}-${item.color || ""}` : item}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `
    })
    .join("")

  cartItemsContainer.innerHTML = cartHTML

  // Update summary
  const shipping = subtotal > 50000 ? 0 : 2500
  const total = subtotal + shipping

  document.getElementById("cart-subtotal").textContent = formatPrice(subtotal)
  document.getElementById("cart-shipping").textContent = shipping === 0 ? "FREE" : formatPrice(shipping)
  document.getElementById("cart-total").textContent = formatPrice(total)
}

function updateCartQuantity(itemKey, change) {
  // This is a simplified version - in a real app you'd handle the complex grouping logic
  if (change > 0) {
    const [productId] = itemKey.split("-")
    cart.push({ id: Number.parseInt(productId), timestamp: Date.now() })
  } else {
    const index = cart.findIndex((item) => {
      const id = typeof item === "object" ? item.id : item
      return id.toString() === itemKey.split("-")[0]
    })
    if (index > -1) {
      cart.splice(index, 1)
    }
  }

  saveToLocalStorage("manchester-wares-cart", cart)
  updateCartCount()
  loadCartItems()
}

function removeFromCart(itemKey) {
  const [productId] = itemKey.split("-")
  cart = cart.filter((item) => {
    const id = typeof item === "object" ? item.id : item
    return id.toString() !== productId
  })

  saveToLocalStorage("manchester-wares-cart", cart)
  updateCartCount()
  loadCartItems()
  showNotification("Item removed from cart")
}

function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length
}

function proceedToCheckout() {
  if (!currentUser) {
    closeModal("cart-modal")
    openModal("account-modal")
    showNotification("Please sign in to continue", "error")
    return
  }

  // Simulate checkout process
  showNotification("Redirecting to checkout...")
  setTimeout(() => {
    cart = []
    saveToLocalStorage("manchester-wares-cart", cart)
    updateCartCount()
    closeModal("cart-modal")
    showNotification("Order placed successfully! (Demo)")
  }, 2000)
}

// Wishlist Functions
function toggleWishlist(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const index = wishlist.indexOf(productId)
  if (index > -1) {
    wishlist.splice(index, 1)
    showNotification(`${product.name} removed from wishlist`)
  } else {
    wishlist.push(productId)
    showNotification(`${product.name} added to wishlist!`)
  }

  saveToLocalStorage("manchester-wares-wishlist", wishlist)
  updateWishlistCount()

  // Update wishlist buttons
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    const productCard = btn.closest(".product-card")
    if (productCard && productCard.onclick.toString().includes(productId)) {
      btn.classList.toggle("active", wishlist.includes(productId))
    }
  })
}

function updateWishlistCount() {
  document.getElementById("wishlist-count").textContent = wishlist.length
  if (document.getElementById("dashboard-wishlist-count")) {
    document.getElementById("dashboard-wishlist-count").textContent = wishlist.length
  }
}

function showWishlist() {
  if (wishlist.length === 0) {
    showNotification("Your wishlist is empty", "error")
    return
  }

  filteredProducts = products.filter((product) => wishlist.includes(product.id))
  loadAllProducts()
  showSection("catalog")
}

// Authentication Functions
function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value
  const rememberMe = document.getElementById("remember-me").checked

  // Demo login - accept any credentials
  if (email && password) {
    currentUser = {
      id: 1,
      email: email,
      name: email.split("@")[0],
      firstName: email.split("@")[0],
      lastName: "User",
      joinDate: new Date().toISOString(),
      loyaltyPoints: 250,
      totalOrders: 5,
      totalSpent: 125000,
    }

    if (rememberMe) {
      saveToLocalStorage("manchester-wares-user", currentUser)
    }

    updateUserInterface()
    closeModal("account-modal")
    showNotification("Welcome back!")
  } else {
    showNotification("Please enter valid credentials", "error")
  }
}

function handleRegister(e) {
  e.preventDefault()

  const firstName = document.getElementById("register-firstname").value
  const lastName = document.getElementById("register-lastname").value
  const email = document.getElementById("register-email").value
  const phone = document.getElementById("register-phone").value
  const password = document.getElementById("register-password").value
  const confirmPassword = document.getElementById("register-confirm-password").value
  const agreeTerms = document.getElementById("agree-terms").checked
  const newsletter = document.getElementById("newsletter-signup").checked

  // Validation
  if (!agreeTerms) {
    showNotification("Please agree to the terms and conditions", "error")
    return
  }

  if (password !== confirmPassword) {
    showNotification("Passwords do not match", "error")
    return
  }

  if (password.length < 6) {
    showNotification("Password must be at least 6 characters", "error")
    return
  }

  // Demo registration
  currentUser = {
    id: Date.now(),
    email: email,
    name: `${firstName} ${lastName}`,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    joinDate: new Date().toISOString(),
    loyaltyPoints: 100, // Welcome bonus
    totalOrders: 0,
    totalSpent: 0,
    newsletter: newsletter,
  }

  saveToLocalStorage("manchester-wares-user", currentUser)
  updateUserInterface()
  closeModal("account-modal")
  showNotification("Account created successfully! Welcome bonus: 100 points")
}

function updateUserInterface() {
  if (currentUser) {
    document.getElementById("user-name").textContent = currentUser.name
    document.getElementById("user-email").textContent = currentUser.email

    // Show dashboard, hide auth forms
    document.getElementById("login-form").classList.add("hidden")
    document.getElementById("register-form").classList.add("hidden")
    document.getElementById("user-dashboard").classList.remove("hidden")

    // Update dashboard stats
    document.querySelector(".stat-card:nth-child(1) h4").textContent = currentUser.totalOrders
    document.querySelector(".stat-card:nth-child(2) h4").textContent = currentUser.loyaltyPoints
  }
}

function logout() {
  currentUser = null
  localStorage.removeItem("manchester-wares-user")

  // Show login form, hide dashboard
  document.getElementById("user-dashboard").classList.add("hidden")
  document.getElementById("login-form").classList.remove("hidden")

  closeModal("account-modal")
  showNotification("Logged out successfully")
}

function showLoginForm() {
  document.getElementById("register-form").classList.add("hidden")
  document.getElementById("login-form").classList.remove("hidden")
}

function showRegisterForm() {
  document.getElementById("login-form").classList.add("hidden")
  document.getElementById("register-form").classList.remove("hidden")
}

function checkPasswordStrength() {
  const password = document.getElementById("register-password").value
  const strengthBar = document.querySelector(".strength-fill")
  const strengthText = document.querySelector(".strength-text")

  let strength = 0
  let text = "Very Weak"
  let color = "#ef4444"

  if (password.length >= 6) strength += 20
  if (password.match(/[a-z]/)) strength += 20
  if (password.match(/[A-Z]/)) strength += 20
  if (password.match(/[0-9]/)) strength += 20
  if (password.match(/[^a-zA-Z0-9]/)) strength += 20

  if (strength >= 80) {
    text = "Very Strong"
    color = "#10b981"
  } else if (strength >= 60) {
    text = "Strong"
    color = "#f59e0b"
  } else if (strength >= 40) {
    text = "Medium"
    color = "#f59e0b"
  } else if (strength >= 20) {
    text = "Weak"
    color = "#ef4444"
  }

  strengthBar.style.width = `${strength}%`
  strengthBar.style.backgroundColor = color
  strengthText.textContent = text
  strengthText.style.color = color
}

// Contact Form
function handleContactForm(e) {
  e.preventDefault()

  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const subject = document.getElementById("subject").value
  const message = document.getElementById("message").value

  // Simulate form submission
  showNotification("Message sent successfully! We'll get back to you soon.")
  document.getElementById("contact-form").reset()
}

// Modal Functions
function openModal(modalId) {
  document.getElementById(modalId).classList.remove("hidden")
  document.body.style.overflow = "hidden"
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add("hidden")
  document.body.style.overflow = "auto"
}

// Dashboard Functions
function showOrders() {
  showNotification("Orders feature coming soon!")
}

function showProfile() {
  showNotification("Profile editing feature coming soon!")
}

function showAddresses() {
  showNotification("Address management feature coming soon!")
}

// Close modals when clicking outside
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    const modalId = e.target.id
    closeModal(modalId)
  }
})

// Handle escape key for modals
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal:not(.hidden)").forEach((modal) => {
      closeModal(modal.id)
    })
  }
})
