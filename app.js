// Application Data - Will be loaded from JSON
let appData = {
  brands: [],
  categories: []
};

// Embedded data as fallback (copy from data.json)
const embeddedData = {
  "brands": [
    {
      "id": "castrol",
      "name": "Castrol",
      "products": [
        {
          "id": "castrol_gtx_15w40",
          "name": "Castrol GTX 15W-40",
          "category": "Nhớt ô tô",
          "price": 245000,
          "image": "/api/placeholder/150/150",
          "brand": "Castrol"
        },
        {
          "id": "castrol_magnatec_5w30",
          "name": "Castrol Magnatec 5W-30",
          "category": "Nhớt ô tô",
          "price": 380000,
          "image": "/api/placeholder/150/150",
          "brand": "Castrol"
        },
        {
          "id": "castrol_power1_10w40",
          "name": "Castrol Power1 10W-40",
          "category": "Nhớt xe máy",
          "price": 85000,
          "image": "/api/placeholder/150/150",
          "brand": "Castrol"
        }
      ]
    },
    {
      "id": "caltex",
      "name": "Caltex",
      "products": [
        {
          "id": "caltex_delo_15w40",
          "name": "Caltex Delo 15W-40",
          "category": "Nhớt ô tô",
          "price": 220000,
          "image": "/api/placeholder/150/150",
          "brand": "Caltex"
        },
        {
          "id": "caltex_havoline_5w30",
          "name": "Caltex Havoline 5W-30",
          "category": "Nhớt ô tô",
          "price": 350000,
          "image": "/api/placeholder/150/150",
          "brand": "Caltex"
        }
      ]
    },
    {
      "id": "abro",
      "name": "ABRO",
      "products": [
        {
          "id": "abro_gasket_maker",
          "name": "ABRO Gasket Maker",
          "category": "Keo gioăng",
          "price": 45000,
          "image": "/api/placeholder/150/150",
          "brand": "ABRO"
        },
        {
          "id": "abro_steel_weld",
          "name": "ABRO Steel Weld",
          "category": "Keo 2 thành phần",
          "price": 65000,
          "image": "/api/placeholder/150/150",
          "brand": "ABRO"
        }
      ]
    },
    {
      "id": "threebond",
      "name": "Threebond",
      "products": [
        {
          "id": "threebond_1184",
          "name": "Threebond 1184",
          "category": "Keo gioăng",
          "price": 85000,
          "image": "/api/placeholder/150/150",
          "brand": "Threebond"
        },
        {
          "id": "threebond_1401",
          "name": "Threebond 1401",
          "category": "Keo 2 thành phần",
          "price": 120000,
          "image": "/api/placeholder/150/150",
          "brand": "Threebond"
        }
      ]
    }
  ],
  "categories": [
    {
      "id": "nhot_oto",
      "name": "Nhớt ô tô",
      "products": []
    },
    {
      "id": "nhot_xe_may", 
      "name": "Nhớt xe máy",
      "products": []
    },
    {
      "id": "keo_gioang",
      "name": "Keo gioăng",
      "products": []
    },
    {
      "id": "keo_2_thanh_phan",
      "name": "Keo 2 thành phần",
      "products": []
    }
  ]
};

// Load data from JSON file
async function loadAppData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    appData = data;
    
    // Process categories to include product IDs
    processCategories();
    
    console.log('Dữ liệu đã được tải thành công từ data.json');
    return true;
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
    console.log('Sử dụng embedded data...');
    // Use embedded data as fallback
    appData = JSON.parse(JSON.stringify(embeddedData)); // Deep clone
    processCategories();
    return false;
  }
}

// Process categories to populate with product IDs
function processCategories() {
  // Clear existing products in categories
  appData.categories.forEach(category => {
    category.products = [];
  });
  
  // Populate categories with product IDs
  appData.brands.forEach(brand => {
    brand.products.forEach(product => {
      // Find category by name (case-insensitive)
      const category = appData.categories.find(c => 
        c.name.toLowerCase() === product.category.toLowerCase()
      );
      if (category && !category.products.includes(product.id)) {
        category.products.push(product.id);
      }
    });
  });
  
  // Debug log to check category population
  console.log('Categories after processing:', appData.categories);
  console.log('Brands loaded:', appData.brands.map(b => b.name));
}

// Application State
let appState = {
  pricingMode: 'auto', // 'auto' or 'manual'
  currentView: 'brand', // 'brand' or 'category'
  selectedBrand: 'castrol',
  selectedCategory: 'nhot_oto',
  cart: [],
  orders: [],
  currentScreen: 'pricing'
};

// Utility Functions
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price) + '₫';
}

function generateOrderId() {
  return 'ORD' + Date.now().toString().slice(-6);
}

function saveToStorage() {
  try {
    // Note: We're not actually using localStorage as per requirements
    // This is just for simulation
    console.log('Saving to storage:', { cart: appState.cart, orders: appState.orders });
  } catch (error) {
    console.error('Storage error:', error);
  }
}

function getAllProducts() {
  return appData.brands.flatMap(brand => brand.products);
}

function getProductById(id) {
  return getAllProducts().find(product => product.id === id);
}

function getProductsByBrand(brandId) {
  const brand = appData.brands.find(b => b.id === brandId);
  return brand ? brand.products : [];
}

function getProductsByCategory(categoryId) {
  const category = appData.categories.find(c => c.id === categoryId);
  if (!category) return [];
  
  return category.products.map(productId => getProductById(productId)).filter(Boolean);
}

// Screen Management
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.add('hidden');
  });
  
  document.getElementById(screenId).classList.remove('hidden');
  appState.currentScreen = screenId;
  
  // Show/hide navigation based on screen
  const headerNav = document.getElementById('headerNav');
  const bottomNav = document.getElementById('bottomNav');
  const brandNav = document.getElementById('brandNav');
  const categoryNav = document.getElementById('categoryNav');
  
  // Bottom nav is always visible
  bottomNav.classList.remove('hidden');
  
  if (screenId === 'productScreen') {
    headerNav.classList.remove('hidden');
    document.body.classList.add('has-header-nav'); // Add class for extra padding
    // Show appropriate navigation based on current view
    if (appState.currentView === 'brand') {
      brandNav.classList.remove('hidden');
      categoryNav.classList.add('hidden');
      // Ensure a brand is selected
      if (!appState.selectedBrand) {
        appState.selectedBrand = appData.brands[0].id;
      }
    } else {
      brandNav.classList.add('hidden');
      categoryNav.classList.remove('hidden');
      // Ensure a category is selected  
      if (!appState.selectedCategory) {
        appState.selectedCategory = appData.categories[0].id;
      }
    }
    
    // Render products and navigation when showing product screen
    renderProducts();
    renderBrandNavigation();
    renderCategoryNavigation();
  } else if (screenId === 'pricingScreen') {
    headerNav.classList.add('hidden');
    document.body.classList.remove('has-header-nav'); // Remove class to reduce padding
    brandNav.classList.add('hidden');
    categoryNav.classList.add('hidden');
  } else {
    headerNav.classList.add('hidden');
    document.body.classList.remove('has-header-nav'); // Remove class to reduce padding
    brandNav.classList.add('hidden');
    categoryNav.classList.add('hidden');
    
    // Render cart items when showing cart or checkout screen
    if (screenId === 'cartScreen') {
      renderCartItems();
    } else if (screenId === 'checkoutScreen') {
      renderCheckoutItems();
      updateCheckoutTotal();
    }
  }
  
  // Update navigation item states
  updateNavItemStates(screenId);
}

// Update navigation item active states
function updateNavItemStates(screenId) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  
  if (screenId === 'productScreen') {
    document.getElementById('navProducts').classList.add('active');
  } else if (screenId === 'cartScreen') {
    document.getElementById('navCart').classList.add('active');
  } else if (screenId === 'orderHistoryScreen') {
    document.getElementById('navHistory').classList.add('active');
  }
}

// Cart Management
function addToCart(productId, quantity = 1, customPrice = null) {
  const product = getProductById(productId);
  if (!product) return;
  
  const existingItem = appState.cart.find(item => item.productId === productId);
  const price = customPrice || product.price;
  
  if (existingItem) {
    existingItem.quantity += quantity;
    if (customPrice !== null) {
      existingItem.price = customPrice;
    }
  } else {
    appState.cart.push({
      productId,
      quantity,
      price,
      originalPrice: product.price
    });
  }
  
  updateCartDisplay();
  saveToStorage();
}

function removeFromCart(productId) {
  appState.cart = appState.cart.filter(item => item.productId !== productId);
  updateCartDisplay();
  if (appState.currentScreen === 'cartScreen') {
    renderCartItems();
  }
  saveToStorage();
}

function updateCartQuantity(productId, quantity) {
  const item = appState.cart.find(item => item.productId === productId);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      updateCartDisplay();
      if (appState.currentScreen === 'cartScreen') {
        renderCartItems();
      }
      saveToStorage();
    }
  }
}

function updateCartItemPrice(productId, price) {
  const item = appState.cart.find(item => item.productId === productId);
  if (item) {
    item.price = price;
    updateCartDisplay();
    if (appState.currentScreen === 'cartScreen') {
      renderCartItems();
    } else if (appState.currentScreen === 'checkoutScreen') {
      renderCheckoutItems();
      updateCheckoutTotal();
    }
    saveToStorage();
  }
}

function getCartTotal() {
  return appState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartItemCount() {
  return appState.cart.reduce((count, item) => count + item.quantity, 0);
}

function clearCart() {
  if (appState.cart.length === 0) {
    alert('Giỏ hàng đã trống!');
    return;
  }
  
  if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
    appState.cart = [];
    updateCartDisplay();
    renderCartItems();
    saveToStorage();
  }
}

// Clear cart without confirmation (used for order completion)
function clearCartSilent() {
  appState.cart = [];
  updateCartDisplay();
  renderCartItems();
  saveToStorage();
}

// Display Functions
function updateCartDisplay() {
  const cartCount = document.getElementById('cartCount');
  const navCartBadge = document.getElementById('navCartBadge');
  const count = getCartItemCount();
  
  // Update header cart count
  cartCount.textContent = count;
  cartCount.style.display = count > 0 ? 'flex' : 'none';
  
  // Update nav badge
  if (navCartBadge) {
    navCartBadge.textContent = count;
    navCartBadge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function renderProducts() {
  const productGrid = document.getElementById('productGrid');
  let products = [];
  
  if (appState.currentView === 'brand') {
    products = getProductsByBrand(appState.selectedBrand);
  } else {
    products = getProductsByCategory(appState.selectedCategory);
  }
  
  if (products.length === 0) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📦</div>
        <p>Không có sản phẩm nào trong danh mục này</p>
      </div>
    `;
    return;
  }
  
  productGrid.innerHTML = products.map(product => {
    const cartItem = appState.cart.find(item => item.productId === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    const currentPrice = cartItem ? cartItem.price : product.price;
    
    return `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image">🛢️</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">
          ${appState.pricingMode === 'manual' ? 
            `<input type="number" class="price-input" value="${currentPrice}" min="0" 
                    onchange="updateProductPrice('${product.id}', this.value)">₫` : 
            formatPrice(currentPrice)
          }
        </div>
        <div class="product-controls">
          <button class="quantity-btn" onclick="updateQuantity('${product.id}', ${quantity - 1})" 
                  ${quantity <= 0 ? 'disabled' : ''}>-</button>
          <span class="quantity-display">${quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity('${product.id}', ${quantity + 1})">+</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderCartItems() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  if (appState.cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🛒</div>
        <p>Giỏ hàng trống</p>
      </div>
    `;
    cartTotal.textContent = '0₫';
    return;
  }
  
  cartItems.innerHTML = appState.cart.map(item => {
    const product = getProductById(item.productId);
    if (!product) return '';
    
    return `
      <div class="cart-item">
        <div class="cart-item-header">
          <div class="cart-item-image">🛢️</div>
          <div class="cart-item-details">
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-price">
              <input type="text" class="price-input" value="${formatPrice(item.price).replace('₫', '')}" 
                     onchange="updateCartItemPrice('${item.productId}', parsePriceInput(this))"
                     oninput="formatPriceInput(this)"
                     placeholder="0">₫
            </div>
          </div>
        </div>
        <div class="cart-item-controls">
          <div class="cart-item-quantity">
            <button class="quantity-btn" onclick="updateCartQuantity('${item.productId}', ${item.quantity - 1})" 
                    ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateCartQuantity('${item.productId}', ${item.quantity + 1})">+</button>
          </div>
          <div class="cart-item-actions">
            <button class="delete-btn" onclick="removeFromCart('${item.productId}')" title="Xóa sản phẩm">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  cartTotal.textContent = formatPrice(getCartTotal());
}

function renderCheckoutItems() {
  const checkoutItems = document.getElementById('checkoutItems');
  const checkoutSubtotal = document.getElementById('checkoutSubtotal');
  
  // Set data attribute for dynamic sizing based on number of items
  const itemCount = appState.cart.length;
  checkoutItems.setAttribute('data-item-count', Math.min(itemCount, 10)); // Cap at 10 for CSS rules
  
  checkoutItems.innerHTML = appState.cart.map(item => {
    const product = getProductById(item.productId);
    if (!product) return '';
    
    return `
      <div class="cart-item">
        <div class="cart-item-header">
          <div class="cart-item-image">🛢️</div>
          <div class="cart-item-details">
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-price">
              ${appState.pricingMode === 'manual' ? 
                `<input type="number" class="price-input" value="${item.price}" min="0" 
                        onchange="updateCartItemPrice('${item.productId}', parseInt(this.value))">₫` :
                `<span class="price-display">${formatPrice(item.price)}</span>`
              }
            </div>
          </div>
        </div>
        <div class="cart-item-controls">
          <div class="cart-item-quantity">
            <button class="quantity-btn" onclick="updateCartQuantity('${item.productId}', ${item.quantity - 1})" 
                    ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateCartQuantity('${item.productId}', ${item.quantity + 1})">+</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  checkoutSubtotal.textContent = formatPrice(getCartTotal());
  updateCheckoutTotal();
}

function updateCheckoutTotal() {
  const subtotal = getCartTotal();
  const discountType = document.getElementById('discountType').value;
  const discountValue = parseFloat(document.getElementById('discountValue').value) || 0;
  
  let discount = 0;
  if (discountType === 'amount') {
    discount = discountValue;
  } else if (discountType === 'percent') {
    discount = (subtotal * discountValue) / 100;
  }
  
  const total = Math.max(0, subtotal - discount);
  
  document.getElementById('checkoutSubtotal').textContent = formatPrice(subtotal);
  document.getElementById('checkoutDiscount').textContent = formatPrice(discount);
  document.getElementById('checkoutTotal').textContent = formatPrice(total);
}

function renderOrderHistory() {
  const orderList = document.getElementById('orderList');
  
  if (appState.orders.length === 0) {
    orderList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <p>Chưa có đơn hàng nào</p>
      </div>
    `;
    return;
  }
  
  orderList.innerHTML = appState.orders.map(order => `
    <div class="order-item">
      <div class="order-header">
        <div class="order-id">${order.id}</div>
        <div class="order-date">${new Date(order.date).toLocaleDateString('vi-VN')}</div>
      </div>
      <div class="order-total">${formatPrice(order.total)}</div>
      <div class="order-status">
        <span class="status ${order.kiotVietSync ? 'status--success' : 'status--info'}">
          ${order.kiotVietSync ? 'Đã đồng bộ' : 'Chưa đồng bộ'}
        </span>
        ${!order.kiotVietSync ? 
          `<button class="btn order-sync-btn" onclick="syncWithKiotViet('${order.id}')">Đồng bộ KiotViet</button>` : 
          ''
        }
      </div>
    </div>
  `).join('');
}

function renderBrandNavigation() {
  const brandNavContainer = document.getElementById('brandNavContainer');
  const brands = appData.brands;
  
  brandNavContainer.innerHTML = brands.map(brand => 
    `<button class="brand-nav__item ${brand.id === appState.selectedBrand ? 'active' : ''}" 
             data-brand="${brand.id}" onclick="selectBrand('${brand.id}')">${brand.name}</button>`
  ).join('');
}

function renderCategoryNavigation() {
  const categoryNavContainer = document.querySelector('.category-nav__container');
  
  categoryNavContainer.innerHTML = appData.categories.map(category => {
    return `<button class="category-nav__item ${category.id === appState.selectedCategory ? 'active' : ''}" 
                    data-category="${category.id}" onclick="selectCategory('${category.id}')">${category.name}</button>`;
  }).join('');
}

// Format price input with thousand separators
function formatPriceInput(input) {
  let value = input.value.replace(/\D/g, ''); // Remove non-digits
  if (value) {
    // Add thousand separators
    value = new Intl.NumberFormat('vi-VN').format(value);
    input.value = value;
  }
}

// Parse price input to number
function parsePriceInput(input) {
  return parseInt(input.value.replace(/\D/g, '')) || 0;
}

// Event Handlers
function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId);
  } else {
    const product = getProductById(productId);
    const cartItem = appState.cart.find(item => item.productId === productId);
    
    if (cartItem) {
      updateCartQuantity(productId, newQuantity);
    } else {
      addToCart(productId, newQuantity);
    }
  }
  renderProducts();
}

function updateProductPrice(productId, newPrice) {
  const price = parseFloat(newPrice) || 0;
  const cartItem = appState.cart.find(item => item.productId === productId);
  
  if (cartItem) {
    updateCartItemPrice(productId, price);
  }
}

function selectBrand(brandId) {
  appState.selectedBrand = brandId;
  
  // Update active brand
  document.querySelectorAll('.brand-nav__item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-brand="${brandId}"]`).classList.add('active');
  
  renderProducts();
}

function selectCategory(categoryId) {
  appState.selectedCategory = categoryId;
  
  // Update active category
  document.querySelectorAll('.category-nav__item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-category="${categoryId}"]`).classList.add('active');
  
  renderProducts();
}

function switchView(view) {
  appState.currentView = view;
  
  // Update toggle buttons
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-view="${view}"]`).classList.add('active');
  
  // Show/hide navigation
  const brandNav = document.querySelector('.brand-nav');
  const categoryNav = document.getElementById('categoryNav');
  
  if (view === 'brand') {
    brandNav.classList.remove('hidden');
    categoryNav.classList.add('hidden');
  } else {
    brandNav.classList.add('hidden');
    categoryNav.classList.remove('hidden');
  }
  
  renderProducts();
}

function completeOrder() {
  if (appState.cart.length === 0) {
    alert('Giỏ hàng trống!');
    return;
  }
  
  const subtotal = getCartTotal();
  const discountType = document.getElementById('discountType').value;
  const discountValue = parseFloat(document.getElementById('discountValue').value) || 0;
  const notes = document.getElementById('orderNotes').value;
  
  let discount = 0;
  if (discountType === 'amount') {
    discount = discountValue;
  } else if (discountType === 'percent') {
    discount = (subtotal * discountValue) / 100;
  }
  
  const total = Math.max(0, subtotal - discount);
  
  const order = {
    id: generateOrderId(),
    date: new Date().toISOString(),
    items: [...appState.cart],
    subtotal,
    discount,
    total,
    notes,
    kiotVietSync: false
  };
  
  appState.orders.push(order);
  clearCartSilent(); // Clear cart without confirmation
  saveToStorage();
  
  alert('Đơn hàng đã được tạo thành công!');
  showScreen('orderHistoryScreen');
  renderOrderHistory();
}

function syncWithKiotViet(orderId) {
  const order = appState.orders.find(o => o.id === orderId);
  if (order) {
    // Simulate sync process
    setTimeout(() => {
      order.kiotVietSync = true;
      saveToStorage();
      renderOrderHistory();
      alert('Đã đồng bộ với KiotViet thành công!');
    }, 1000);
  }
}

// Initialize Application
async function initApp() {
  // Load data from JSON first
  const dataLoaded = await loadAppData();
  if (!dataLoaded) {
    console.warn('Sử dụng dữ liệu mặc định do không thể tải từ JSON');
  }
  
  // Set up pricing mode selection
  document.querySelectorAll('.pricing-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      appState.pricingMode = e.currentTarget.dataset.mode;
      // Ensure a brand is selected when entering product screen
      if (!appState.selectedBrand && appData.brands.length > 0) {
        appState.selectedBrand = appData.brands[0].id;
      }
      showScreen('productScreen');
    });
  });
  
  // Set up brand navigation
  document.querySelectorAll('.brand-nav__item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      selectBrand(e.currentTarget.dataset.brand);
    });
  });
  
  // Set up category navigation
  document.querySelectorAll('.category-nav__item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      selectCategory(e.currentTarget.dataset.category);
    });
  });
  
  // Set up view toggle
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      switchView(e.currentTarget.dataset.view);
    });
  });
  
  // Set up navigation
  document.getElementById('cartIcon').addEventListener('click', () => {
    showScreen('cartScreen');
    renderCartItems();
  });
  
  document.getElementById('clearCart').addEventListener('click', clearCart);
  
  document.getElementById('proceedToCheckout').addEventListener('click', () => {
    if (appState.cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }
    showScreen('checkoutScreen');
    renderCheckoutItems();
  });
  
  document.getElementById('backToCart').addEventListener('click', () => {
    showScreen('cartScreen');
  });
  
  document.getElementById('backToProductsFromHistory').addEventListener('click', () => {
    showScreen('productScreen');
  });
  
  document.getElementById('completeOrder').addEventListener('click', completeOrder);
  
  // Set up bottom navigation
  document.getElementById('navProducts').addEventListener('click', () => {
    showScreen('productScreen');
  });
  
  document.getElementById('navCart').addEventListener('click', () => {
    showScreen('cartScreen');
    renderCartItems();
  });
  
  document.getElementById('navHistory').addEventListener('click', () => {
    showScreen('orderHistoryScreen');
    renderOrderHistory();
  });
  
  // Set up checkout calculations
  document.getElementById('discountType').addEventListener('change', updateCheckoutTotal);
  document.getElementById('discountValue').addEventListener('input', updateCheckoutTotal);
  
  // Initialize display
  updateCartDisplay();
  // Ensure brand navigation is rendered with correct initial state
  renderBrandNavigation();
  renderCategoryNavigation();
  showScreen('pricingScreen');
}

// Start the application
document.addEventListener('DOMContentLoaded', initApp);