// Clerk client configuration
const { Clerk } = require('@clerk/clerk-sdk-node');
require('dotenv').config();

// Clerk configuration
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

// Debug: Check if key is loaded
console.log("Clerk Secret Key Loaded?", !!process.env.CLERK_SECRET_KEY);
if (CLERK_SECRET_KEY) {
    console.log("Clerk Key Length:", CLERK_SECRET_KEY.length);
    console.log("Clerk Key Starts With:", CLERK_SECRET_KEY.substring(0, 7));
}

if (!CLERK_SECRET_KEY) {
    console.warn('⚠️  Clerk not configured. Set CLERK_SECRET_KEY in .env');
    console.warn('   Get your key at: https://dashboard.clerk.com');
}

// Initialize Clerk client
let clerkConfigured = false;
let clerkClient = null;

try {
    if (CLERK_SECRET_KEY && CLERK_SECRET_KEY !== 'sk_test_placeholder') {
        clerkClient = new Clerk({ secretKey: CLERK_SECRET_KEY });
        clerkConfigured = true;
        console.log('✅ Clerk initialized successfully');
    } else {
        console.warn('⚠️  Clerk not configured. Set CLERK_SECRET_KEY in .env');
    }
} catch (error) {
    console.warn('⚠️  Clerk initialization error:', error.message);
    clerkConfigured = false;
}

// Clerk authentication middleware
// Note: For Express middleware, we'll handle authentication in server.js
// This function is kept for compatibility but not used directly
const requireAuth = null; // We'll use custom middleware in server.js instead

// Helper function to get user from Clerk session
async function getClerkUser(req) {
    if (!req.auth || !req.auth.userId) {
        return null;
    }
    
    try {
        const user = await clerkClient.users.getUser(req.auth.userId);
        return user;
    } catch (error) {
        console.error('Error fetching Clerk user:', error);
        return null;
    }
}

// Helper function to create user in Clerk
// Stores ALL user data in Clerk metadata (no Supabase needed)
async function createClerkUser(userData) {
    if (!clerkClient) {
        throw new Error('Clerk client not initialized');
    }
    
    try {
        const user = await clerkClient.users.createUser({
            emailAddress: [userData.email],
            password: userData.password,
            firstName: userData.name?.split(' ')[0] || userData.name,
            lastName: userData.name?.split(' ').slice(1).join(' ') || '',
            publicMetadata: {
                userType: userData.userType || 'office',
                companyName: userData.companyName || '',
                // Store subscription info in public metadata
                subscription: userData.subscription || {
                    status: 'active',
                    plan: 'premium',
                    price: 2.00,
                    billingCycle: 'monthly'
                },
            },
            privateMetadata: {
                phone: userData.phone || '',
                cardInfo: userData.cardInfo || {},
                paymentMethods: userData.paymentMethods || [],
            },
        });
        return user;
    } catch (error) {
        console.error('Error creating Clerk user:', error);
        throw error;
    }
}

// Helper function to update user metadata in Clerk
async function updateClerkUserMetadata(userId, metadata) {
    if (!clerkClient) {
        throw new Error('Clerk client not initialized');
    }
    
    try {
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: metadata.public || {},
            privateMetadata: metadata.private || {},
        });
    } catch (error) {
        console.error('Error updating Clerk user metadata:', error);
        throw error;
    }
}

// Helper function to get full user data from Clerk (including all metadata)
async function getClerkUserData(userId) {
    if (!clerkClient) {
        throw new Error('Clerk client not initialized');
    }
    
    try {
        const user = await clerkClient.users.getUser(userId);
        return {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress || 'User',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            companyName: user.publicMetadata?.companyName || '',
            userType: user.publicMetadata?.userType || 'office',
            phone: user.privateMetadata?.phone || '',
            subscription: user.publicMetadata?.subscription || {
                status: 'active',
                plan: 'premium',
                price: 2.00,
                billingCycle: 'monthly'
            },
            cardInfo: user.privateMetadata?.cardInfo || {},
            paymentMethods: user.privateMetadata?.paymentMethods || [],
            createdAt: user.createdAt || new Date().toISOString()
        };
    } catch (error) {
        console.error('Error getting Clerk user data:', error);
        throw error;
    }
}

module.exports = {
    clerkClient,
    getClerkUser,
    createClerkUser,
    updateClerkUserMetadata,
    getClerkUserData,
    clerkConfigured,
};

