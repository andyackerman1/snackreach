// Sample data for startup products with discounted pricing
const sampleProducts = [
    {
        id: 1,
        name: "Organic Energy Bars",
        company: "GreenSnacks Co.",
        description: "Nutritious energy bars made with organic ingredients, perfect for office snacking.",
        originalPrice: 29.99,
        discountPrice: 19.99,
        discount: "33% OFF",
        unit: "per box of 12",
        category: "snacks",
        dietary: ["organic", "vegan"],
        rating: 4.8,
        reviews: 156,
        startup: true,
        limitedQuantity: "Only 50 boxes available",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop"
    },
    {
        id: 2,
        name: "Kombucha Variety Pack",
        company: "Ferment & Co.",
        description: "Refreshing probiotic drinks in three delicious flavors.",
        originalPrice: 24.99,
        discountPrice: 15.99,
        discount: "36% OFF",
        unit: "per 6-pack",
        category: "beverages",
        dietary: ["organic", "vegan"],
        rating: 4.6,
        reviews: 89,
        startup: true,
        limitedQuantity: "Limited time offer",
        image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop"
    },
    {
        id: 3,
        name: "Protein Cookies",
        company: "FitBites",
        description: "High-protein cookies that taste like dessert but fuel like a meal.",
        originalPrice: 39.99,
        discountPrice: 24.99,
        discount: "38% OFF",
        unit: "per box of 8",
        category: "healthy",
        dietary: ["gluten-free", "high-protein"],
        rating: 4.7,
        reviews: 203,
        startup: true,
        limitedQuantity: "Brand awareness campaign",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop"
    },
    {
        id: 4,
        name: "Artisan Coffee Beans",
        company: "Roast Masters",
        description: "Single-origin coffee beans roasted to perfection for your office.",
        originalPrice: 35.99,
        discountPrice: 22.99,
        discount: "36% OFF",
        unit: "per 2lb bag",
        category: "beverages",
        dietary: ["organic"],
        rating: 4.9,
        reviews: 312,
        startup: true,
        limitedQuantity: "Office sampling program",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55c?w=400&h=300&fit=crop"
    },
    {
        id: 5,
        name: "Veggie Chips",
        company: "Crunchy Greens",
        description: "Dehydrated vegetable chips with no artificial preservatives.",
        originalPrice: 24.99,
        discountPrice: 16.99,
        discount: "32% OFF",
        unit: "per bag",
        category: "snacks",
        dietary: ["vegan", "gluten-free"],
        rating: 4.5,
        reviews: 127,
        startup: true,
        limitedQuantity: "Startup launch special",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    },
    {
        id: 6,
        name: "Dark Chocolate Bark",
        company: "Sweet Artisan",
        description: "Handcrafted dark chocolate with nuts and dried fruits.",
        originalPrice: 28.99,
        discountPrice: 18.99,
        discount: "34% OFF",
        unit: "per 8oz package",
        category: "desserts",
        dietary: ["organic"],
        rating: 4.8,
        reviews: 94,
        startup: true,
        limitedQuantity: "Brand building offer",
        image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=300&fit=crop"
    }
];

// DOM Elements
let productsGrid;
let categoryFilter;
let dietaryFilter;
let searchInput;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    loadProducts();
    setupEventListeners();
    setupNavigation();
});

function initializeElements() {
    productsGrid = document.getElementById('products-grid');
    categoryFilter = document.getElementById('category-filter');
    dietaryFilter = document.getElementById('dietary-filter');
    searchInput = document.getElementById('search-input');
}

function setupEventListeners() {
    // Filter events
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    if (dietaryFilter) {
        dietaryFilter.addEventListener('change', filterProducts);
    }
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    // Form submissions
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Modal close events
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

function setupNavigation() {
    // Mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function loadProducts(products = sampleProducts) {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-content">
            <div class="product-company">${product.company} • Startup</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-pricing">
                <div class="price-container">
                    <span class="discount-price">$${product.discountPrice}</span>
                    <span class="original-price">$${product.originalPrice}</span>
                    <span class="discount-badge">${product.discount}</span>
                </div>
                <div class="product-rating">
                    <span>${stars}</span>
                    <span>${product.rating}</span>
                    <span>(${product.reviews})</span>
                </div>
            </div>
            <div class="product-tags">
                ${product.dietary.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="limited-offer">
                <i class="fas fa-clock"></i>
                <span>${product.limitedQuantity}</span>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary btn-small" onclick="viewProduct(${product.id})">
                    <i class="fas fa-eye"></i>
                    View Details
                </button>
                <button class="btn btn-outline btn-small" onclick="contactStartup(${product.id})">
                    <i class="fas fa-envelope"></i>
                    Contact Startup
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function filterProducts() {
    const category = categoryFilter ? categoryFilter.value : '';
    const dietary = dietaryFilter ? dietaryFilter.value : '';
    const search = searchInput ? searchInput.value.toLowerCase() : '';
    
    const filteredProducts = sampleProducts.filter(product => {
        const matchesCategory = !category || product.category === category;
        const matchesDietary = !dietary || product.dietary.includes(dietary);
        const matchesSearch = !search || 
            product.name.toLowerCase().includes(search) ||
            product.company.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search);
        
        return matchesCategory && matchesDietary && matchesSearch;
    });
    
    loadProducts(filteredProducts);
}

function viewProduct(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (product) {
        alert(`Product Details:\n\n${product.name}\nCompany: ${product.company}\nOriginal Price: $${product.originalPrice}\nDiscounted Price: $${product.discountPrice} (${product.discount})\n\n${product.description}\n\n${product.limitedQuantity}`);
    }
}

function contactStartup(productId) {
    const product = sampleProducts.find(p => p.id === productId);
    if (product) {
        alert(`Contact ${product.company} about ${product.name}\n\nThis startup is offering special discounted pricing to build brand awareness in office environments. Connect with them to discuss:\n\n• Custom bulk pricing\n• Sampling programs\n• Brand partnership opportunities\n• Limited-time offers\n\nContact them directly to negotiate your office deal!`);
    }
}

// Modal functions
function showLoginModal() {
    closeAllModals();
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function showSignupModal() {
    closeAllModals();
    const modal = document.getElementById('signup-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Form handlers
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (email && password) {
        // Simulate login
        alert('Login successful! Welcome to SnackConnect.');
        closeModal('login-modal');
        // In a real app, you would redirect to dashboard
    }
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const company = document.getElementById('signup-company').value;
    const userType = document.querySelector('input[name="user-type"]:checked').value;
    const password = document.getElementById('signup-password').value;
    
    if (name && email && company && password) {
        // Simulate signup
        alert(`Account created successfully! Welcome ${name} from ${company}.`);
        closeModal('signup-modal');
        // In a real app, you would redirect to dashboard
    }
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add some interactive features
function addScrollEffects() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Initialize scroll effects
document.addEventListener('DOMContentLoaded', addScrollEffects);

// Add loading animation for products
function showLoading() {
    if (productsGrid) {
        productsGrid.innerHTML = '<div class="loading">Loading products...</div>';
    }
}

// Add some sample interactions
function addSampleInteractions() {
    // Add click handlers for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

document.addEventListener('DOMContentLoaded', addSampleInteractions);
