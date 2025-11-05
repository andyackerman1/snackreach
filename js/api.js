// API Configuration
// Automatically detects environment: uses localhost for development, production URL for deployed site
const API_BASE_URL = (() => {
    // Check if we're in production (hosted on netlify, vercel, etc.)
    const hostname = window.location.hostname;
    const isProduction = hostname !== 'localhost' && hostname !== '127.0.0.1';
    
    // Railway backend URL (same domain for frontend and backend)
    // If we're on Railway domain, use same domain for API
    if (hostname.includes('railway.app')) {
        return '/api';
    }
    
    // Otherwise use Railway backend URL
    const PRODUCTION_API_URL = 'https://snackreach-production.up.railway.app/api';
    
    return isProduction ? PRODUCTION_API_URL : 'http://localhost:3000/api';
})();

// Get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem('snackreach_token');
}

// Set auth token
function setAuthToken(token) {
    localStorage.setItem('snackreach_token', token);
}

// Clear auth token
function clearAuthToken() {
    localStorage.removeItem('snackreach_token');
    localStorage.removeItem('snackreach_user_type');
    localStorage.removeItem('snackreach_user_name');
    localStorage.removeItem('snackreach_company_name');
}

// API request helper
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication API
export const authAPI = {
    register: async (userData) => {
        const response = await apiRequest('/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        if (response.token) {
            setAuthToken(response.token);
            localStorage.setItem('snackreach_user_type', response.user.userType);
            localStorage.setItem('snackreach_user_name', response.user.name);
            localStorage.setItem('snackreach_company_name', response.user.companyName);
        }
        return response;
    },

    login: async (email, password) => {
        const response = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (response.token) {
            setAuthToken(response.token);
            localStorage.setItem('snackreach_user_type', response.user.userType);
            localStorage.setItem('snackreach_user_name', response.user.name);
            localStorage.setItem('snackreach_company_name', response.user.companyName);
        }
        return response;
    },

    logout: () => {
        clearAuthToken();
    }
};

// Profile API
export const profileAPI = {
    getProfile: async () => {
        return await apiRequest('/profile');
    },

    updateProfile: async (profileData) => {
        return await apiRequest('/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }
};

// Discovery API
export const discoveryAPI = {
    getSnackCompanies: async () => {
        return await apiRequest('/snack-companies');
    },

    getOffices: async () => {
        return await apiRequest('/offices');
    },

    getProducts: async () => {
        return await apiRequest('/products');
    }
};

// Products API
export const productsAPI = {
    createProduct: async (productData) => {
        return await apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    }
};

// Messages API
export const messagesAPI = {
    getMessages: async () => {
        return await apiRequest('/messages');
    },

    sendMessage: async (receiverId, content) => {
        return await apiRequest('/messages', {
            method: 'POST',
            body: JSON.stringify({ receiverId, content })
        });
    }
};

// Orders API
export const ordersAPI = {
    getOrders: async () => {
        return await apiRequest('/orders');
    }
};

// Subscription API
export const subscriptionAPI = {
    cancelSubscription: async (reason) => {
        return await apiRequest('/subscription/cancel', {
            method: 'POST',
            body: JSON.stringify({ reason })
        });
    }
};

