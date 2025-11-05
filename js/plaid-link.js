/**
 * Plaid Link Integration for SnackReach
 * Secure bank account verification using Plaid Link
 * 
 * Security Features:
 * - HTTPS-only communication
 * - No raw bank credentials stored
 * - Token-based authentication
 * - Plaid handles all bank connections securely
 */

// API Configuration
const API_BASE_URL = (() => {
    const hostname = window.location.hostname;
    if (hostname.includes('railway.app')) {
        return '/api';
    } else if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return 'https://snackreach-production.up.railway.app/api';
    } else {
        return 'http://localhost:3000/api';
    }
})();

let plaidLinkHandler = null;

/**
 * Initialize Plaid Link
 * @param {string} linkToken - Plaid Link token from backend
 * @param {Function} onSuccess - Callback when bank is linked successfully
 * @param {Function} onExit - Callback when user exits Plaid Link
 */
async function initializePlaidLink(linkToken, onSuccess, onExit) {
    // Ensure HTTPS in production
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        console.error('Plaid Link requires HTTPS in production');
        alert('This feature requires a secure connection (HTTPS).');
        return;
    }

    // Load Plaid Link script if not already loaded
    if (!window.Plaid) {
        const script = document.createElement('script');
        script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
        script.onload = () => {
            createPlaidLink(linkToken, onSuccess, onExit);
        };
        script.onerror = () => {
            console.error('Failed to load Plaid Link script');
            alert('Failed to load bank verification service. Please try again.');
        };
        document.head.appendChild(script);
    } else {
        createPlaidLink(linkToken, onSuccess, onExit);
    }
}

/**
 * Create Plaid Link instance
 */
function createPlaidLink(linkToken, onSuccess, onExit) {
    if (!window.Plaid) {
        console.error('Plaid library not loaded');
        return;
    }

    plaidLinkHandler = window.Plaid.create({
        token: linkToken,
        onSuccess: async (publicToken, metadata) => {
            console.log('Plaid Link success:', metadata);
            
            // Get the selected account
            const account = metadata.accounts[0];
            
            try {
                // Exchange public token for access token and create Stripe payment method
                const token = localStorage.getItem('snackreach_token');
                const response = await fetch(`${API_BASE_URL}/plaid/exchange-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        public_token: publicToken,
                        account_id: account.id,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Bank account linked successfully:', data);
                    if (onSuccess) {
                        onSuccess(data);
                    }
                } else {
                    throw new Error(data.error || 'Failed to link bank account');
                }
            } catch (error) {
                console.error('Error linking bank account:', error);
                alert('Failed to link bank account: ' + error.message);
            }
        },
        onExit: (err, metadata) => {
            console.log('Plaid Link exited:', metadata);
            if (err) {
                console.error('Plaid Link error:', err);
            }
            if (onExit) {
                onExit(err, metadata);
            }
        },
        onEvent: (eventName, metadata) => {
            console.log('Plaid Link event:', eventName, metadata);
        },
    });
}

/**
 * Open Plaid Link
 */
function openPlaidLink() {
    if (!plaidLinkHandler) {
        console.error('Plaid Link not initialized');
        alert('Bank verification service not ready. Please refresh the page.');
        return;
    }
    plaidLinkHandler.open();
}

/**
 * Get Plaid Link token from backend and initialize
 * @param {Function} onSuccess - Callback when bank is linked
 * @param {Function} onExit - Callback when user exits
 */
async function setupPlaidBankLink(onSuccess, onExit) {
    try {
        const token = localStorage.getItem('snackreach_token');
        if (!token) {
            alert('Please log in to add a bank account.');
            return;
        }

        // Get link token from backend
        const response = await fetch(`${API_BASE_URL}/plaid/create-link-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok && data.link_token) {
            // Initialize Plaid Link with token
            await initializePlaidLink(data.link_token, onSuccess, onExit);
            // Auto-open Plaid Link
            setTimeout(() => {
                openPlaidLink();
            }, 100);
        } else {
            throw new Error(data.error || 'Failed to get bank verification token');
        }
    } catch (error) {
        console.error('Error setting up Plaid Link:', error);
        alert('Failed to initialize bank verification: ' + error.message);
    }
}

// Export functions
window.PlaidLink = {
    setup: setupPlaidBankLink,
    open: openPlaidLink,
    initialize: initializePlaidLink,
};

