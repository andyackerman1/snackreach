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
        // Build the user object with proper formatting
        const userPayload = {
            emailAddress: [userData.email],
            password: userData.password,
            firstName: userData.name?.split(' ')[0] || userData.name || '',
            lastName: userData.name?.split(' ').slice(1).join(' ') || '',
        };

        // Add metadata only if we have data
        const publicMetadata = {};
        if (userData.userType) {
            publicMetadata.userType = userData.userType;
        }
        if (userData.companyName) {
            publicMetadata.companyName = userData.companyName;
        }
        if (userData.subscription) {
            publicMetadata.subscription = userData.subscription;
        } else {
            // Default subscription
            publicMetadata.subscription = {
                status: 'active',
                plan: 'premium',
                price: 2.00,
                billingCycle: 'monthly'
            };
        }

        const privateMetadata = {};
        if (userData.phone) {
            privateMetadata.phone = userData.phone;
        }
        if (userData.cardInfo && Object.keys(userData.cardInfo).length > 0) {
            privateMetadata.cardInfo = userData.cardInfo;
        }
        if (userData.paymentMethods && userData.paymentMethods.length > 0) {
            privateMetadata.paymentMethods = userData.paymentMethods;
        }

        // Only add metadata if we have data
        if (Object.keys(publicMetadata).length > 0) {
            userPayload.publicMetadata = publicMetadata;
        }
        if (Object.keys(privateMetadata).length > 0) {
            userPayload.privateMetadata = privateMetadata;
        }

        console.log('Creating Clerk user with payload:', {
            emailAddress: userPayload.emailAddress,
            firstName: userPayload.firstName,
            lastName: userPayload.lastName,
            hasPublicMetadata: !!userPayload.publicMetadata,
            hasPrivateMetadata: !!userPayload.privateMetadata
        });

        const user = await clerkClient.users.createUser(userPayload);
        return user;
    } catch (error) {
        console.error('Error creating Clerk user:', error);
        console.error('Error details:', {
            message: error.message,
            status: error.status,
            errors: error.errors || error.clerkErrors
        });
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
            description: user.publicMetadata?.description || '',
            logo: user.publicMetadata?.logo || null,
            snackPreference: user.publicMetadata?.snackPreference || '',
            messages: user.publicMetadata?.messages || [],
            products: user.publicMetadata?.products || [],
            subscription: user.publicMetadata?.subscription || {
                status: 'active',
                plan: 'premium',
                price: 2.00,
                billingCycle: 'monthly'
            },
            cardInfo: user.privateMetadata?.cardInfo || {},
            paymentMethods: user.privateMetadata?.paymentMethods || [],
            publicMetadata: user.publicMetadata || {},
            privateMetadata: user.privateMetadata || {},
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

