// Wooden Dreams - Premium Furniture Store JavaScript

// Global Variables
let cart = JSON.parse(localStorage.getItem('woodenDreamsCart')) || [];
let products = [];
let filteredProducts = [];

// Sample Product Data
const sampleProducts = [
    {
        id: 1,
        name: "Asgaard Sofa",
        description: "Luxury 3-seater sofa with premium fabric",
        price: 250000,
        originalPrice: 300000,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
        category: "living",
        material: "solid-wood",
        collection: "indian",
        seating: "3",
        rating: 4.5,
        reviews: 124,
        badge: "sale"
    },
    {
        id: 2,
        name: "Luxe Dining Table",
        description: "Handcrafted wooden dining table for 6",
        price: 180000,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
        category: "dining",
        material: "sheesham",
        collection: "american",
        seating: "6",
        rating: 4.8,
        reviews: 89,
        badge: "new"
    },
    {
        id: 3,
        name: "Royal Bedroom Set",
        description: "Complete bedroom furniture set",
        price: 350000,
        originalPrice: 400000,
        image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&h=300&fit=crop",
        category: "bedroom",
        material: "solid-wood",
        collection: "emperor",
        seating: "set",
        rating: 4.7,
        reviews: 156,
        badge: "sale"
    },
    {
        id: 4,
        name: "Executive Office Chair",
        description: "Ergonomic leather office chair",
        price: 85000,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=300&fit=crop",
        category: "office",
        material: "leatherette",
        collection: "italian",
        seating: "1",
        rating: 4.3,
        reviews: 67,
        badge: null
    },
    {
        id: 5,
        name: "Modern Coffee Table",
        description: "Minimalist coffee table with storage",
        price: 45000,
        originalPrice: 55000,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
        category: "living",
        material: "foam",
        collection: "tamilnadu",
        seating: "table",
        rating: 4.2,
        reviews: 43,
        badge: "sale"
    },
    {
        id: 6,
        name: "Classic Bookshelf",
        description: "5-tier wooden bookshelf",
        price: 32000,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
        category: "storage",
        material: "solid-wood",
        collection: "indian",
        seating: "storage",
        rating: 4.6,
        reviews: 91,
        badge: "new"
    },
    {
        id: 7,
        name: "Comfort Recliner",
        description: "Single seat reclining chair",
        price: 125000,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
        category: "living",
        material: "half-leather",
        collection: "american",
        seating: "1",
        rating: 4.4,
        reviews: 78,
        badge: null
    },
    {
        id: 8,
        name: "Grifo Night Lamp",
        description: "Elegant bedside lamp",
        price: 12000,
        originalPrice: 15000,
        image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&h=300&fit=crop",
        category: "bedroom",
        material: "solid-wood",
        collection: "malaysian",
        seating: "accessory",
        rating: 4.1,
        reviews: 32,
        badge: "sale"
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    products = sampleProducts;
    filteredProducts = [...products];
    
    initializeApp();
});

function initializeApp() {
    updateCartCount();
    
    // Load products on shop and home pages
    if (document.getElementById('productGrid')) {
        loadProducts();
    }
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize modals
    initializeModals();
    
    // Load cart items
    loadCartItems();
    
    // Initialize filters
    initializeFilters();
    
    // Initialize checkout if on checkout page
    if (document.querySelector('.checkout-section')) {
        initializeCheckout();
    }
}

function initializeEventListeners() {
    // Navigation event listeners
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            navbarCollapse.classList.toggle('show');
        });
    }
    
    // Search functionality
    const searchInputs = document.querySelectorAll('input[placeholder*="Search"]');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    });
    
    // Newsletter subscription
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            subscribeNewsletter(email);
        });
    });
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitContactForm();
        });
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
    
    // View toggle
    const viewToggleButtons = document.querySelectorAll('[data-view]');
    viewToggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleView(this.dataset.view);
        });
    });
    
    // Price range slider
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            updatePriceDisplay(this.value);
        });
        
        priceRange.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Filter checkboxes and radio buttons
    const filterInputs = document.querySelectorAll('input[name^="material"], input[name^="collection"], input[name^="seating"], input[name^="sortBy"]');
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            applyFilters();
        });
    });
}

function initializeModals() {
    // Auth modal
    const authModal = new bootstrap.Modal(document.getElementById('authModal'));
    
    // Search modal
    const searchModal = new bootstrap.Modal(document.getElementById('searchModal'));
    
    // Store modal instances globally
    window.authModal = authModal;
    window.searchModal = searchModal;
}

// Product Functions
function loadProducts(limit = null) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    const productsToShow = limit ? filteredProducts.slice(0, limit) : filteredProducts;
    
    productGrid.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4>No products found</h4>
                <p>Try adjusting your filters or search criteria.</p>
            </div>
        `;
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
    
    // Update results count
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        const start = 1;
        const end = Math.min(productsToShow.length, filteredProducts.length);
        const total = filteredProducts.length;
        resultsCount.textContent = `Showing ${start}-${end} of ${total} results`;
    }
}

function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-lg-3 col-md-6 mb-4';
    
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    col.innerHTML = `
        <div class="product-card">
            ${product.badge ? `<div class="product-badge ${product.badge}">${product.badge === 'sale' ? `-${discount}%` : product.badge}</div>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" class="img-fluid">
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="btn btn-outline-primary btn-sm" onclick="quickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-primary btn-sm" onclick="shareProduct(${product.id})">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="btn btn-outline-primary btn-sm" onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h5 class="product-title">${product.name}</h5>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="price-current">Rs. ${product.price.toLocaleString()}</span>
                    ${product.originalPrice ? `<span class="price-original">Rs. ${product.originalPrice.toLocaleString()}</span>` : ''}
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-text">(${product.reviews})</span>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Cart Functions
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
    loadCartItems();
    showNotification(`${product.name} added to cart!`, 'success');
    
    // Show cart briefly
    setTimeout(() => {
        toggleCart();
        setTimeout(() => {
            toggleCart();
        }, 2000);
    }, 500);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    loadCartItems();
    showNotification('Item removed from cart', 'info');
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartCount();
            loadCartItems();
        }
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function loadCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <p>Your cart is empty</p>
                <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        if (cartTotal) cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h6 class="cart-item-title">${item.name}</h6>
                <div class="cart-item-price">Rs. ${item.price.toLocaleString()}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    if (cartTotal) {
        cartTotal.textContent = total.toLocaleString() + '.00';
    }
}

function saveCart() {
    localStorage.setItem('woodenDreamsCart', JSON.stringify(cart));
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    loadCartItems();
}

// Toggle Functions
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('show');
        cartOverlay.classList.toggle('show');
        document.body.style.overflow = cartSidebar.classList.contains('show') ? 'hidden' : 'auto';
    }
}

function toggleFilter() {
    const filterSidebar = document.getElementById('filterSidebar');
    const filterOverlay = document.getElementById('filterOverlay');
    
    if (filterSidebar && filterOverlay) {
        filterSidebar.classList.toggle('show');
        filterOverlay.classList.toggle('show');
        document.body.style.overflow = filterSidebar.classList.contains('show') ? 'hidden' : 'auto';
    }
}

function toggleSearch() {
    if (window.searchModal) {
        window.searchModal.show();
    }
}

function openAuthModal() {
    const modal = document.createElement('div');
    modal.className = 'auth-modal show';
    modal.id = 'authModal';
    modal.innerHTML = `
        <div class="auth-overlay">
            <div class="auth-content">
                <button type="button" class="btn-close-auth" onclick="closeAuthModal()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="auth-header">
                    <img src="attached_assets/Group 206_1752297266987.png" alt="Wooden Dreams Logo" class="auth-logo">
                    <h2 class="auth-brand">Wooden Dreams</h2>
                    <h3 class="auth-welcome">Welcome's You !</h3>
                </div>
                <div class="auth-tabs">
                    <button class="auth-tab active" onclick="switchAuthTab('login')">Log In</button>
                    <button class="auth-tab" onclick="switchAuthTab('signup')">Sign Up</button>
                </div>
                <form class="auth-form" id="authForm">
                    <div class="form-group">
                        <input type="email" id="authEmail" placeholder="Enter your Email Address" required>
                    </div>
                    <div class="form-group">
                        <input type="password" id="authPassword" placeholder="Enter Password" required>
                    </div>
                    <div class="form-group" id="confirmPasswordGroup" style="display: none;">
                        <input type="password" id="authConfirmPassword" placeholder="Confirm Password">
                    </div>
                    <div class="remember-me">
                        <input type="checkbox" id="rememberMe">
                        <label for="rememberMe">Remember Me</label>
                    </div>
                    <button type="submit" class="btn-auth-submit" id="authSubmitBtn">Sign In</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add event listener for form submission
    document.getElementById('authForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleAuthSubmit();
    });
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

function switchAuthTab(type) {
    const tabs = document.querySelectorAll('.auth-tab');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
    const submitBtn = document.getElementById('authSubmitBtn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    
    if (type === 'login') {
        tabs[0].classList.add('active');
        confirmPasswordGroup.style.display = 'none';
        submitBtn.textContent = 'Sign In';
    } else {
        tabs[1].classList.add('active');
        confirmPasswordGroup.style.display = 'block';
        submitBtn.textContent = 'Sign Up';
    }
}

function handleAuthSubmit() {
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const isSignUp = document.getElementById('authSubmitBtn').textContent === 'Sign Up';
    
    if (isSignUp) {
        const confirmPassword = document.getElementById('authConfirmPassword').value;
        if (password !== confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }
        showNotification('Account created successfully!', 'success');
    } else {
        showNotification('Welcome back!', 'success');
    }
    
    closeAuthModal();
}

// Filter Functions
function initializeFilters() {
    updatePriceDisplay(26000);
}

function applyFilters() {
    filteredProducts = [...products];
    
    // Material filter
    const selectedMaterials = Array.from(document.querySelectorAll('input[name="material"]:checked')).map(input => input.value);
    if (selectedMaterials.length > 0) {
        filteredProducts = filteredProducts.filter(product => selectedMaterials.includes(product.material));
    }
    
    // Collection filter
    const selectedCollections = Array.from(document.querySelectorAll('input[name="collection"]:checked')).map(input => input.value);
    if (selectedCollections.length > 0) {
        filteredProducts = filteredProducts.filter(product => selectedCollections.includes(product.collection));
    }
    
    // Seating filter
    const selectedSeating = Array.from(document.querySelectorAll('input[name="seating"]:checked')).map(input => input.value);
    if (selectedSeating.length > 0) {
        filteredProducts = filteredProducts.filter(product => selectedSeating.includes(product.seating));
    }
    
    // Price filter
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        const maxPrice = parseInt(priceRange.value);
        filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    }
    
    // Apply sorting
    const sortBy = document.querySelector('input[name="sortBy"]:checked')?.value || 'default';
    sortProducts(sortBy);
    
    // Reload products
    loadProducts();
}

function sortProducts(sortBy) {
    switch (sortBy) {
        case 'best-seller':
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-az':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'recommended':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Default order (as loaded)
            break;
    }
    
    loadProducts();
}

function updatePriceDisplay(value) {
    const priceDisplay = document.querySelector('.price-display');
    if (priceDisplay) {
        priceDisplay.textContent = `$26,000-$${parseInt(value).toLocaleString()}`;
    }
}

function toggleView(view) {
    const viewButtons = document.querySelectorAll('[data-view]');
    const productGrid = document.getElementById('productGrid');
    
    viewButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
    
    if (view === 'list') {
        productGrid.className = 'row g-2';
        // Modify product cards for list view
        const productCards = productGrid.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.classList.add('list-view');
        });
    } else {
        productGrid.className = 'row g-4';
        const productCards = productGrid.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.classList.remove('list-view');
        });
    }
}

// Search Function
function performSearch(query) {
    if (!query.trim()) return;
    
    filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    loadProducts();
    
    if (window.searchModal) {
        window.searchModal.hide();
    }
    
    showNotification(`Found ${filteredProducts.length} products for "${query}"`, 'info');
}

// Product Actions
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Create quick view modal (simplified)
    showNotification(`Quick view for ${product.name}`, 'info');
}

function shareProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (navigator.share) {
        navigator.share({
            title: product.name,
            text: product.description,
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showNotification('Product link copied to clipboard!', 'success');
    }
}

function toggleWishlist(productId) {
    // Simplified wishlist toggle
    showNotification('Added to wishlist!', 'success');
}

// Checkout Functions
function initializeCheckout() {
    loadCheckoutItems();
    
    const checkoutForm = document.querySelector('.billing-details form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processOrder();
        });
    }
}

function loadCheckoutItems() {
    const orderSummary = document.querySelector('.order-summary');
    if (!orderSummary || cart.length === 0) {
        return;
    }
    
    let subtotal = 0;
    const orderItems = cart.map(item => {
        subtotal += item.price * item.quantity;
        return `
            <div class="order-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>Rs. ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `;
    }).join('');
    
    const orderSummaryHTML = `
        <div class="mb-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="text-primary">Product</h4>
                <h4 class="text-primary">Subtotal</h4>
            </div>
            ${orderItems}
            <div class="order-item">
                <span>Subtotal</span>
                <span>Rs. ${subtotal.toLocaleString()}</span>
            </div>
            <div class="order-item">
                <span><strong>Total</strong></span>
                <span class="text-primary"><strong>Rs. ${subtotal.toLocaleString()}.00</strong></span>
            </div>
        </div>
        
        <div class="payment-methods">
            <div class="payment-method">
                <input type="radio" id="cash_delivery" name="payment" value="cash_delivery" checked>
                <label for="cash_delivery"><strong>Cash On Delivery</strong></label>
            </div>
            <p class="payment-description">Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
            
            <div class="payment-method">
                <input type="radio" id="bank_transfer" name="payment" value="bank_transfer">
                <label for="bank_transfer">Direct Bank Transfer</label>
            </div>
            
            <div class="payment-method">
                <input type="radio" id="cash_delivery2" name="payment" value="cash_delivery2">
                <label for="cash_delivery2">Cash On Delivery</label>
            </div>
        </div>
        
        <p class="mb-3">Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <a href="#" class="text-primary">privacy policy</a>.</p>
        
        <button type="submit" class="btn btn-primary w-100 py-3">Place order</button>
    `;
    
    orderSummary.innerHTML = orderSummaryHTML;
}

function processOrder() {
    // Validate form
    const form = document.querySelector('.billing-details form');
    const formData = new FormData(form);
    
    // Simple validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = form.querySelector(`[name="${field}"], #${field}`);
        if (input && !input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else if (input) {
            input.classList.remove('is-invalid');
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Processing...';
    submitBtn.disabled = true;
    
    // Simulate order processing
    setTimeout(() => {
        // Clear cart
        clearCart();
        
        // Show success modal
        showOrderSuccess();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showOrderSuccess() {
    const modal = document.createElement('div');
    modal.className = 'order-success-modal show';
    modal.id = 'orderSuccessModal';
    modal.innerHTML = `
        <div class="success-overlay">
            <div class="success-content">
                <button type="button" class="btn-close-success" onclick="closeOrderSuccess()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="success-header">
                    <img src="attached_assets/Group 206_1752297266987.png" alt="Wooden Dreams Logo" class="success-logo">
                    <h2>Wooden Dreams</h2>
                </div>
                <div class="success-animation">
                    <div class="success-circle">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="success-particles">
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                        <div class="particle"></div>
                    </div>
                </div>
                <h1 class="success-title">"We've Got Your Order!"</h1>
                <h3 class="success-subtitle">Wooden Dreams</h3>
                <div class="success-furniture">
                    <img src="attached_assets/Cloud sofa three seater + ottoman_2 2.png" alt="Furniture" class="furniture-image">
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeOrderSuccess() {
    const modal = document.querySelector('.order-success-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
        
        // Redirect to home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function subscribeNewsletter(email) {
    if (!email || !email.includes('@')) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate API call
    showNotification('Thank you for subscribing to our newsletter!', 'success');
    
    // Clear form
    const emailInput = document.querySelector('.newsletter-form input[type="email"]');
    if (emailInput) {
        emailInput.value = '';
    }
}

function submitContactForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    // Simple validation
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = form.querySelector(`#${field}`);
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Close overlays when clicking outside
document.addEventListener('click', function(e) {
    // Close cart when clicking overlay
    if (e.target.id === 'cartOverlay') {
        toggleCart();
    }
    
    // Close filter when clicking overlay
    if (e.target.id === 'filterOverlay') {
        toggleFilter();
    }
    
    // Close mobile menu when clicking outside
    if (!e.target.closest('.navbar') && document.querySelector('.navbar-collapse.show')) {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        navbarCollapse.classList.remove('show');
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        const cartSidebar = document.getElementById('cartSidebar');
        const filterSidebar = document.getElementById('filterSidebar');
        
        if (cartSidebar?.classList.contains('show')) {
            toggleCart();
        }
        
        if (filterSidebar?.classList.contains('show')) {
            toggleFilter();
        }
        
        const orderSuccessModal = document.querySelector('.order-success-modal.show');
        if (orderSuccessModal) {
            closeOrderSuccess();
        }
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize
    const navbarCollapse = document.querySelector('.navbar-collapse.show');
    if (navbarCollapse && window.innerWidth > 991) {
        navbarCollapse.classList.remove('show');
    }
});

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Performance monitoring
window.addEventListener('load', function() {
    // Log performance metrics
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showNotification('Something went wrong. Please refresh the page.', 'error');
});

// Service worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleCart = toggleCart;
window.toggleFilter = toggleFilter;
window.toggleSearch = toggleSearch;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthTab = switchAuthTab;
window.handleAuthSubmit = handleAuthSubmit;
window.quickView = quickView;
window.shareProduct = shareProduct;
window.toggleWishlist = toggleWishlist;
window.closeOrderSuccess = closeOrderSuccess;
