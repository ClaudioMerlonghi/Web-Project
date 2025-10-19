/* ===================================
   Claudio Shop - SPA Router
   =================================== */

class Router {
    constructor() {
        this.routes = {
            'home': 'views/home.html',
            'shop': 'views/shop.html',
            'categories': 'views/categories.html',
            'cart': 'views/cart.html',
            'login': 'views/login.html',
            'register': 'views/register.html',
            'profile': 'views/profile.html',
            'about': 'views/about.html'
        };

        this.currentRoute = null;
        this.app = document.getElementById('app');

        // Initialize router
        this.init();
    }

    init() {
        // Handle initial load
        window.addEventListener('DOMContentLoaded', () => {
            this.handleRoute();
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Handle all link clicks with data-link attribute
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-link]');
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    this.navigate(href);
                }
            }
        });
    }

    navigate(path) {
        // Update URL without page reload
        window.history.pushState({}, '', path);
        this.handleRoute();
    }

    async handleRoute() {
        // Get current hash from URL (e.g., #home, #shop)
        let hash = window.location.hash.slice(1) || 'home';

        // Extract route and query params
        const [route, queryString] = hash.split('?');

        // Get route file path
        const routePath = this.routes[route] || this.routes['home'];

        // Load the view
        await this.loadView(routePath, route);

        // Update active nav link
        this.updateActiveNav(route);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async loadView(viewPath, route) {
        try {
            // Show loading state
            this.showLoading();

            // Fetch the view HTML
            const response = await fetch(viewPath);

            if (!response.ok) {
                throw new Error(`Failed to load view: ${viewPath}`);
            }

            const html = await response.text();

            // Update app content
            this.app.innerHTML = html;

            // Store current route
            this.currentRoute = route;

            // Initialize page-specific functionality
            this.initPageScripts(route);

        } catch (error) {
            console.error('Error loading view:', error);
            this.showError();
        }
    }

    showLoading() {
        this.app.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; min-height: 400px;">
                <div class="spinner"></div>
            </div>
        `;
    }

    showError() {
        this.app.innerHTML = `
            <div style="text-align: center; padding: 4rem 1rem;">
                <i class="fas fa-exclamation-circle" style="font-size: 4rem; color: var(--error); margin-bottom: 1rem;"></i>
                <h2>Oops! Something went wrong</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">We couldn't load this page. Please try again.</p>
                <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
            </div>
        `;
    }

    updateActiveNav(route) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current route link
        const activeLink = document.querySelector(`.nav-link[href="#${route}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    initPageScripts(route) {
        // Initialize page-specific JavaScript functionality
        switch(route) {
            case 'home':
                this.initHomePage();
                break;
            case 'shop':
                this.initShopPage();
                break;
            case 'cart':
                this.initCartPage();
                break;
            case 'login':
                this.initLoginPage();
                break;
            case 'register':
                this.initRegisterPage();
                break;
            case 'profile':
                this.initProfilePage();
                break;
        }

        // Initialize common functionality for all pages
        this.initCommonScripts();
    }

    initCommonScripts() {
        // Add to cart buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart, .btn-primary.btn-small');
        addToCartButtons.forEach(btn => {
            if (btn.textContent.includes('Add to Cart') || btn.querySelector('.fa-shopping-cart')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.addToCart();
                });
            }
        });

        // Quick view buttons
        const quickViewButtons = document.querySelectorAll('[title="Quick View"]');
        quickViewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Quick view feature coming soon!');
            });
        });

        // Wishlist buttons
        const wishlistButtons = document.querySelectorAll('[title="Add to Wishlist"]');
        wishlistButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleWishlist(btn);
            });
        });
    }

    initHomePage() {
        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for subscribing to our newsletter!');
                newsletterForm.reset();
            });
        }
    }

    initShopPage() {
        // Toggle sidebar on mobile
        const toggleSidebar = document.getElementById('toggleSidebar');
        const closeSidebar = document.getElementById('closeSidebar');
        const sidebar = document.getElementById('shopSidebar');

        if (toggleSidebar && sidebar) {
            toggleSidebar.addEventListener('click', () => {
                sidebar.classList.add('active');
            });
        }

        if (closeSidebar && sidebar) {
            closeSidebar.addEventListener('click', () => {
                sidebar.classList.remove('active');
            });
        }

        // Filter functionality
        const applyFilters = document.getElementById('applyFilters');
        const resetFilters = document.getElementById('resetFilters');

        if (applyFilters) {
            applyFilters.addEventListener('click', () => {
                alert('Filters applied! (This will be connected to backend)');
            });
        }

        if (resetFilters) {
            resetFilters.addEventListener('click', () => {
                document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                document.querySelectorAll('input[type="radio"][value="all"]').forEach(rb => rb.checked = true);
            });
        }

        // View toggle
        const viewButtons = document.querySelectorAll('.view-btn');
        const productsGrid = document.getElementById('productsGrid');

        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const view = btn.getAttribute('data-view');
                if (productsGrid) {
                    if (view === 'list') {
                        productsGrid.style.gridTemplateColumns = '1fr';
                    } else {
                        productsGrid.style.gridTemplateColumns = '';
                    }
                }
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchProducts');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                // Search functionality will be implemented with backend
                console.log('Searching for:', searchTerm);
            });
        }
    }

    initCartPage() {
        // Clear cart button
        const clearCartBtn = document.getElementById('clearCart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear your cart?')) {
                    alert('Cart cleared! (This will be connected to backend)');
                }
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('Proceeding to checkout... (This will be connected to backend)');
            });
        }

        // Initialize quantity selectors
        this.initQuantitySelectors();
    }

    initQuantitySelectors() {
        // Quantity increase/decrease will be handled by inline onclick functions
        // This is a placeholder for future backend integration
    }

    initLoginPage() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                alert(`Login functionality will be connected to backend.\nEmail: ${email}`);
                // After successful login, navigate to home
                // this.navigate('#home');
            });
        }
    }

    initRegisterPage() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (password !== confirmPassword) {
                    alert('Passwords do not match!');
                    return;
                }

                const email = document.getElementById('registerEmail').value;
                alert(`Registration functionality will be connected to backend.\nEmail: ${email}`);
                // After successful registration, navigate to login
                // this.navigate('#login');
            });
        }
    }

    initProfilePage() {
        // Profile section navigation
        const profileNavItems = document.querySelectorAll('.profile-nav-item');
        const profileSections = document.querySelectorAll('.profile-section');

        profileNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const section = item.getAttribute('data-section');

                if (!section) return;

                e.preventDefault();

                // Update active nav item
                profileNavItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Show corresponding section
                profileSections.forEach(sec => sec.classList.remove('active'));
                const targetSection = document.getElementById(section);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }

    addToCart() {
        // Update cart count
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const currentCount = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = currentCount + 1;
        }

        // Show success message
        this.showNotification('Item added to cart!', 'success');
    }

    toggleWishlist(btn) {
        const icon = btn.querySelector('i');
        if (icon) {
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.showNotification('Added to wishlist!', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.showNotification('Removed from wishlist', 'info');
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'var(--success)' : 'var(--info)'};
            color: white;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-xl);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Global functions for inline event handlers
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const btn = input.nextElementSibling;
    const icon = btn.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function increaseQuantity(id) {
    const input = document.getElementById(`qty-${id}`);
    if (input) {
        const max = parseInt(input.max) || 99;
        const current = parseInt(input.value) || 1;
        if (current < max) {
            input.value = current + 1;
        }
    }
}

function decreaseQuantity(id) {
    const input = document.getElementById(`qty-${id}`);
    if (input) {
        const min = parseInt(input.min) || 1;
        const current = parseInt(input.value) || 1;
        if (current > min) {
            input.value = current - 1;
        }
    }
}

function removeCartItem(id) {
    if (confirm('Remove this item from cart?')) {
        // This will be connected to backend
        alert(`Item ${id} removed from cart`);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize router when script loads
window.router = new Router();
