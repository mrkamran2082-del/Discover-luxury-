/**
 * Luxe Essence - Premium Online Store
 * Main JavaScript File
 */

// Initialize AOS Animation Library
AOS.init({
    duration: 800,
    easing: 'ease',
    once: true
});

// DOM Elements
const mainNav = document.getElementById('mainNav');
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const continueShoppingBtn = document.querySelector('.continue-shopping');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');
const checkoutBtn = document.querySelector('.checkout-btn');
const addToCartBtns = document.querySelectorAll('.add-to-cart');

// Cart Array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    window.addEventListener('scroll', navbarScroll);
    
    // Cart functionality
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    continueShoppingBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    // Add to cart buttons
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
    
    // Initialize cart
    updateCart();
    
    // Product image gallery (for product detail page)
    initProductGallery();
    
    // Initialize quantity buttons (for product detail page)
    initQuantityButtons();
    
    // Initialize filter functionality (for product listing pages)
    initFilters();
});

/**
 * Navbar scroll effect
 */
function navbarScroll() {
    if (window.scrollY > 50) {
        mainNav.classList.add('navbar-scrolled');
    } else {
        mainNav.classList.remove('navbar-scrolled');
    }
}

/**
 * Open cart sidebar
 */
function openCart(e) {
    e.preventDefault();
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close cart sidebar
 */
function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Add product to cart
 */
function addToCart(e) {
    const productId = e.target.dataset.id;
    
    // Get product info (in a real app, this would come from an API or dataset)
    const product = getProductInfo(productId);
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Update quantity
        existingItem.quantity += 1;
    } else {
        // Add new item
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Update cart
    updateCart();
    
    // Show cart
    openCart(e);
    
    // Show success message
    showToast('Product added to cart!');
}

/**
 * Update cart UI and localStorage
 */
function updateCart() {
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items UI
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        totalAmount.textContent = '$0.00';
        return;
    }
    
    // Generate cart items HTML
    let cartHTML = '';
    let cartTotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;
        
        cartHTML += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Update cart items container
    cartItemsContainer.innerHTML = cartHTML;
    
    // Update total amount
    totalAmount.textContent = `$${cartTotal.toFixed(2)}`;
    
    // Add event listeners to quantity buttons
    const decreaseBtns = document.querySelectorAll('.decrease');
    const increaseBtns = document.querySelectorAll('.increase');
    const removeItemBtns = document.querySelectorAll('.remove-item');
    
    decreaseBtns.forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });
    
    increaseBtns.forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });
    
    removeItemBtns.forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
}

/**
 * Decrease item quantity
 */
function decreaseQuantity(e) {
    const productId = e.target.dataset.id;
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        removeItem(e);
        return;
    }
    
    updateCart();
}

/**
 * Increase item quantity
 */
function increaseQuantity(e) {
    const productId = e.target.dataset.id;
    const item = cart.find(item => item.id === productId);
    
    item.quantity += 1;
    updateCart();
}

/**
 * Remove item from cart
 */
function removeItem(e) {
    const productId = e.target.dataset.id || e.target.parentElement.dataset.id;
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

/**
 * Get product info (mock data - in a real app, this would come from an API)
 */
function getProductInfo(id) {
    const products = {
        '1': {
            name: 'Midnight Elegance',
            price: 120.00,
            image: 'images/perfume1.jpg'
        },
        '2': {
            name: 'Royal Amber',
            price: 95.00,
            image: 'images/perfume2.jpg'
        },
        '3': {
            name: 'Silk Evening Dress',
            price: 250.00,
            image: 'images/clothes1.jpg'
        },
        '4': {
            name: 'Tailored Blazer',
            price: 180.00,
            image: 'images/clothes2.jpg'
        }
    };
    
    return products[id] || { name: 'Product', price: 0, image: 'images/placeholder.jpg' };
}

/**
 * Show toast notification
 */
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

/**
 * Initialize product gallery (for product detail page)
 */
function initProductGallery() {
    const mainImg = document.querySelector('.product-main-img');
    const thumbs = document.querySelectorAll('.product-thumb');
    
    if (!mainImg || thumbs.length === 0) return;
    
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Update main image
            mainImg.src = thumb.src;
            
            // Update active thumb
            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
}

/**
 * Initialize quantity buttons (for product detail page)
 */
function initQuantityButtons() {
    const decreaseBtn = document.querySelector('.quantity-decrease');
    const increaseBtn = document.querySelector('.quantity-increase');
    const quantityInput = document.querySelector('.quantity-input-detail');
    
    if (!decreaseBtn || !increaseBtn || !quantityInput) return;
    
    decreaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            value--;
            quantityInput.value = value;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        value++;
        quantityInput.value = value;
    });
}

/**
 * Initialize filter functionality (for product listing pages)
 */
function initFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-check input');
    const priceMinInput = document.querySelector('.price-min');
    const priceMaxInput = document.querySelector('.price-max');
    const filterBtn = document.querySelector('.apply-filter');
    
    if (!filterCheckboxes.length || !filterBtn) return;
    
    filterBtn.addEventListener('click', () => {
        // Get selected categories
        const selectedCategories = [];
        filterCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedCategories.push(checkbox.value);
            }
        });
        
        // Get price range
        const minPrice = priceMinInput ? parseFloat(priceMinInput.value) || 0 : 0;
        const maxPrice = priceMaxInput ? parseFloat(priceMaxInput.value) || 1000 : 1000;
        
        // Filter products (in a real app, this would use AJAX or update the UI)
        filterProducts(selectedCategories, minPrice, maxPrice);
    });
}

/**
 * Filter products (mock function - in a real app, this would update the UI)
 */
function filterProducts(categories, minPrice, maxPrice) {
    console.log('Filtering products:', { categories, minPrice, maxPrice });
    // In a real app, this would filter the products based on the selected criteria
    // and update the UI accordingly
}

// Checkout button functionality
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your cart is empty!');
            return;
        }
        
        // In a real app, this would redirect to the checkout page
        alert('Proceeding to checkout...');
    });
}