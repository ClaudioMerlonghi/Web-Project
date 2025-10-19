/* ===================================
   Claudio Shop - Main JavaScript
   =================================== */

// Global App State
const AppState = {
    cart: [],
    wishlist: [],
    user: null,
    isLoggedIn: false
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load saved state from localStorage
    loadAppState();

    // Initialize mobile navigation
    initMobileNav();

    // Initialize scroll effects
    initScrollEffects();

    // Initialize user authentication state
    updateAuthUI();

    // Update cart count
    updateCartCount();

    // Log initialization
    console.log('%c🐾 Claudio Shop Initialized!', 'color: #6C63FF; font-size: 16px; font-weight: bold;');
}

// ===== State Management =====

function loadAppState() {
    try {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('claudioShop_cart');
        if (savedCart) {
            AppState.cart = JSON.parse(savedCart);
        }

        // Load wishlist from localStorage
        const savedWishlist = localStorage.getItem('claudioShop_wishlist');
        if (savedWishlist) {
            AppState.wishlist = JSON.parse(savedWishlist);
        }

        // Load user from localStorage
        const savedUser = localStorage.getItem('claudioShop_user');
        if (savedUser) {
            AppState.user = JSON.parse(savedUser);
            AppState.isLoggedIn = true;
        }
    } catch (error) {
        console.error('Error loading app state:', error);
    }
}

function saveAppState() {
    try {
        localStorage.setItem('claudioShop_cart', JSON.stringify(AppState.cart));
        localStorage.setItem('claudioShop_wishlist', JSON.stringify(AppState.wishlist));
        if (AppState.user) {
            localStorage.setItem('claudioShop_user', JSON.stringify(AppState.user));
        }
    } catch (error) {
        console.error('Error saving app state:', error);
    }
}

// ===== Mobile Navigation =====

function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        // Toggle menu on button click
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');

            // Toggle icon
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
}

// ===== Scroll Effects =====

function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow to navbar on scroll
        if (currentScroll > 0) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && !this.hasAttribute('data-link')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ===== Authentication UI =====

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const profileIcon = document.getElementById('profileIcon');

    if (AppState.isLoggedIn && AppState.user) {
        // User is logged in
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
        if (profileIcon) {
            profileIcon.style.display = 'flex';
            profileIcon.title = AppState.user.name || 'Profile';
        }
    } else {
        // User is not logged in
        if (loginBtn) {
            loginBtn.style.display = 'flex';
        }
        if (profileIcon) {
            profileIcon.style.display = 'none';
        }
    }
}

// ===== Cart Functions =====

function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const count = AppState.cart.length;
        cartCountElement.textContent = count;

        // Add animation when count changes
        cartCountElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 200);
    }
}

function addToCartGlobal(productId, productName, price) {
    // Check if product already in cart
    const existingItem = AppState.cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        AppState.cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }

    // Save to localStorage
    saveAppState();

    // Update UI
    updateCartCount();

    // Show notification
    showToast('Item added to cart!', 'success');
}

function removeFromCart(productId) {
    AppState.cart = AppState.cart.filter(item => item.id !== productId);
    saveAppState();
    updateCartCount();
    showToast('Item removed from cart', 'info');
}

function clearCart() {
    AppState.cart = [];
    saveAppState();
    updateCartCount();
    showToast('Cart cleared', 'info');
}

// ===== Wishlist Functions =====

function toggleWishlistGlobal(productId, productName) {
    const existingIndex = AppState.wishlist.findIndex(item => item.id === productId);

    if (existingIndex >= 0) {
        // Remove from wishlist
        AppState.wishlist.splice(existingIndex, 1);
        showToast('Removed from wishlist', 'info');
        return false;
    } else {
        // Add to wishlist
        AppState.wishlist.push({
            id: productId,
            name: productName
        });
        showToast('Added to wishlist!', 'success');
        return true;
    }
}

// ===== User Authentication =====

function loginUser(userData) {
    AppState.user = userData;
    AppState.isLoggedIn = true;
    saveAppState();
    updateAuthUI();
    showToast('Welcome back!', 'success');
}

function logoutUser() {
    AppState.user = null;
    AppState.isLoggedIn = false;
    localStorage.removeItem('claudioShop_user');
    updateAuthUI();
    showToast('Logged out successfully', 'info');

    // Redirect to home
    if (window.router) {
        window.router.navigate('#home');
    }
}

// ===== Toast Notifications =====

function showToast(message, type = 'info') {
    // Remove any existing toasts
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';

    // Set color based on type
    let bgColor;
    let icon;

    switch(type) {
        case 'success':
            bgColor = '#48BB78';
            icon = 'fa-check-circle';
            break;
        case 'error':
            bgColor = '#F56565';
            icon = 'fa-exclamation-circle';
            break;
        case 'warning':
            bgColor = '#ED8936';
            icon = 'fa-exclamation-triangle';
            break;
        default:
            bgColor = '#4299E1';
            icon = 'fa-info-circle';
    }

    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${bgColor};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;

    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== Form Validation =====

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    // At least 8 characters
    return password.length >= 8;
}

function validatePhone(phone) {
    // Basic phone validation
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// ===== Utility Functions =====

function formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
}

function formatDate(date) {
    const d = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Image Lazy Loading =====

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===== Search Functionality =====

function searchProducts(query) {
    // This will be implemented with backend
    console.log('Searching for:', query);

    // Simulate search delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([]);
        }, 500);
    });
}

// ===== Error Handling =====

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===== Add CSS animations for toast =====

const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .toast-notification {
        transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
        .toast-notification {
            right: 10px !important;
            left: 10px !important;
            max-width: calc(100% - 20px) !important;
        }
    }
`;
document.head.appendChild(toastStyles);

// ===== Export functions for global use =====

window.AppFunctions = {
    addToCart: addToCartGlobal,
    removeFromCart,
    clearCart,
    toggleWishlist: toggleWishlistGlobal,
    loginUser,
    logoutUser,
    showToast,
    validateEmail,
    validatePassword,
    validatePhone,
    formatPrice,
    formatDate,
    searchProducts
};

console.log('%c✨ Main.js loaded successfully!', 'color: #6C63FF; font-weight: bold;');
