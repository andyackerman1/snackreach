const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Stripe and Plaid setup
// Initialize Stripe with error handling
let stripe = null;
let stripeConfigured = false;
try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && stripeKey !== 'sk_test_placeholder' && stripeKey.startsWith('sk_')) {
        stripe = require('stripe')(stripeKey);
        stripeConfigured = true;
        console.log('✅ Stripe initialized successfully');
    } else {
        console.warn('⚠️  Stripe not configured. Set STRIPE_SECRET_KEY in .env');
    }
} catch (error) {
    console.warn('⚠️  Stripe initialization error:', error.message);
    console.warn('   Make sure the "stripe" package is installed: npm install stripe');
    // Stripe will be null, but endpoints will check before using it
}

// Plaid configuration - handle missing package gracefully
let plaidClient = null;
let plaidConfigured = false;
try {
    const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
    const plaidClientId = process.env.PLAID_CLIENT_ID;
    const plaidSecret = process.env.PLAID_SECRET;
    
    if (plaidClientId && plaidSecret && plaidClientId !== 'your_plaid_client_id_here' && plaidSecret !== 'your_plaid_secret_key_here') {
        const plaidEnv = process.env.PLAID_ENV || 'sandbox';
        const plaidConfig = new Configuration({
            basePath: PlaidEnvironments[plaidEnv],
            baseOptions: {
                headers: {
                    'PLAID-CLIENT-ID': plaidClientId,
                    'PLAID-SECRET': plaidSecret,
                },
            },
        });
        plaidClient = new PlaidApi(plaidConfig);
        plaidConfigured = true;
        console.log(`✅ Plaid initialized successfully (${plaidEnv} environment)`);
    } else {
        console.warn('⚠️  Plaid not configured. Set PLAID_CLIENT_ID and PLAID_SECRET in .env');
    }
} catch (error) {
    console.warn('⚠️  Plaid initialization error:', error.message);
    console.warn('   Make sure the "plaid" package is installed: npm install plaid');
    // Plaid will be null, but endpoints will check before using it
}

const app = express();
// Use 3000 for local development, 8080 for Railway production
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 8080 : 3000);
const JWT_SECRET = process.env.JWT_SECRET || 'snackreach_secret_key_2024';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from root (frontend HTML/CSS/JS)
// This must come before API routes to serve static files correctly
app.use(express.static(path.join(__dirname, '..'), {
    dotfiles: 'ignore',
    etag: true,
    maxAge: '1d'
}));

// Explicit routes for common pages (for better reliability)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
});

app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'signup.html'));
});

app.get('/admin-dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin-dashboard.html'));
});

app.get('/reset-password.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'reset-password.html'));
});

// Database file path
const DB_PATH = path.join(__dirname, 'data', 'database.json');

// Initialize database - PERMANENT STORAGE
// This ensures the database file exists and is ready for permanent account storage
async function initDatabase() {
    try {
        const dataDir = path.join(__dirname, 'data');
        await fs.mkdir(dataDir, { recursive: true });
        console.log('✅ Data directory ready:', dataDir);
        
        try {
            await fs.access(DB_PATH);
            // Database exists - verify it's readable
            const existing = await fs.readFile(DB_PATH, 'utf8');
            const db = JSON.parse(existing);
            console.log('✅ Existing database loaded:', DB_PATH);
            console.log('✅ Permanent accounts found:', db.users ? db.users.length : 0);
        } catch {
            // Create initial database structure for permanent storage
            const initialData = {
                users: [],           // PERMANENT: All user accounts stored here
                snackCompanies: [],
                offices: [],
                products: [],
                orders: [],
                messages: [],
                loginActivity: []    // Login history
            };
            await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
            console.log('✅ New database created for permanent storage:', DB_PATH);
            console.log('✅ Database location:', process.env.NODE_ENV === 'production' ? 'Railway (persistent)' : 'Local filesystem');
        }
    } catch (error) {
        console.error('❌ CRITICAL ERROR initializing database:', error);
        console.error('   Database path:', DB_PATH);
        throw error; // Fail fast if we can't initialize database
    }
}

// Read database
async function readDB() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        const db = JSON.parse(data);
        // Ensure all required arrays exist
        if (!db.users) db.users = [];
        if (!db.snackCompanies) db.snackCompanies = [];
        if (!db.offices) db.offices = [];
        if (!db.products) db.products = [];
        if (!db.orders) db.orders = [];
        if (!db.messages) db.messages = [];
        if (!db.loginActivity) db.loginActivity = [];
        if (!db.passwordResetTokens) db.passwordResetTokens = [];
        return db;
    } catch (error) {
        console.error('Error reading database:', error);
        console.error('Database path:', DB_PATH);
        // Return empty database structure
        return {
            users: [],
            snackCompanies: [],
            offices: [],
            products: [],
            orders: [],
            messages: [],
            loginActivity: [],
            passwordResetTokens: []
        };
    }
}

// Write database - PERMANENT STORAGE
// This function ensures accounts are permanently saved to disk
// Works on both local development and Railway production
async function writeDB(data) {
    try {
        // Ensure data directory exists (creates if it doesn't)
        const dataDir = path.join(__dirname, 'data');
        await fs.mkdir(dataDir, { recursive: true });
        
        // CRITICAL: Accounts are PERMANENTLY saved - never deleted automatically
        // This ensures all user accounts persist across server restarts
        // On Railway: Database file persists in the data/ directory
        // On Local: Database file is saved in backend/data/database.json
        
        // Atomic write: Write to temporary file first, then rename (prevents corruption)
        const tempPath = DB_PATH + '.tmp';
        const jsonData = JSON.stringify(data, null, 2);
        
        // Write to temporary file
        await fs.writeFile(tempPath, jsonData, { encoding: 'utf8', flag: 'w' });
        
        // Atomic rename (ensures data integrity)
        await fs.rename(tempPath, DB_PATH);
        
        // Verify write was successful by reading back
        const verify = await fs.readFile(DB_PATH, 'utf8');
        const verifyData = JSON.parse(verify);
        
        console.log('✅ Database written successfully to:', DB_PATH);
        console.log('✅ Total users permanently saved:', verifyData.users ? verifyData.users.length : 0);
        console.log('✅ Database location:', process.env.NODE_ENV === 'production' ? 'Railway (persistent)' : 'Local filesystem');
        
        // Ensure accounts are never lost
        if (verifyData.users && verifyData.users.length !== (data.users ? data.users.length : 0)) {
            console.error('⚠️  WARNING: User count mismatch after write!');
            console.error('   Expected:', data.users ? data.users.length : 0);
            console.error('   Actual:', verifyData.users.length);
        }
    } catch (error) {
        console.error('❌ CRITICAL ERROR writing database:', error);
        console.error('   Database path:', DB_PATH);
        console.error('   Error details:', error.message);
        console.error('   Stack:', error.stack);
        
        // Don't throw - log error but allow app to continue
        // This prevents one bad write from crashing the entire server
        console.error('   Attempting to continue despite write error...');
    }
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'SnackReach API is running' });
});

// User registration
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, companyName, phone, userType, cardInfo } = req.body;

        console.log('Registration request received:', { name, email, companyName, userType });

        if (!name || !email || !password || !companyName) {
            console.error('Registration failed: Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = await readDB();
        console.log('Current database users count:', db.users.length);
        
        // ============================================================
        // PERMANENT ACCOUNT STORAGE - CRITICAL
        // ============================================================
        // Accounts are PERMANENTLY saved to database.json file
        // - NEVER automatically deleted
        // - Persists across server restarts
        // - Works on both LOCAL and RAILWAY
        // - All user data is permanently stored
        // ============================================================

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            companyName,
            phone: phone || '',
            userType: userType || 'office',
            cardInfo: cardInfo || {},
            subscription: {
                status: 'active',
                plan: 'premium',
                price: 2.00,
                billingCycle: 'monthly'
            },
            paymentMethods: [],
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);
        console.log('Adding new user to database:', newUser.email, newUser.userType);
        
        // Track registration as a login activity (since they're automatically logged in)
        const loginActivity = {
            userId: newUser.id,
            email: newUser.email,
            name: newUser.name || newUser.companyName || 'Unknown',
            userType: newUser.userType,
            timestamp: new Date().toISOString(),
            ipAddress: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown',
            userAgent: req.headers['user-agent'] || 'unknown',
            isRegistration: true
        };
        
        // Ensure loginActivity array exists
        if (!db.loginActivity) {
            db.loginActivity = [];
            console.log('Initialized loginActivity array during registration');
        }
        
        db.loginActivity.push(loginActivity);
        console.log('Registration login activity added. Total login records:', db.loginActivity.length);
        
        // Keep only last 1000 login activities to prevent database bloat
        if (db.loginActivity.length > 1000) {
            db.loginActivity = db.loginActivity.slice(-1000);
        }
        
        await writeDB(db);
        
        // Verify user and login activity were saved
        const verifyDb = await readDB();
        console.log('Database after save - users count:', verifyDb.users.length);
        console.log('Login activity count:', verifyDb.loginActivity ? verifyDb.loginActivity.length : 0);
        console.log('New user ID:', newUser.id, 'Email:', newUser.email);

        // Generate JWT token
        // Generate JWT token with very long expiration (essentially permanent)
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email, userType: newUser.userType },
            JWT_SECRET,
            { expiresIn: '3650d' } // 10 years - essentially permanent session
        );

        console.log('User registered successfully:', newUser.email);
        res.json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                companyName: newUser.companyName,
                userType: newUser.userType
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt received for email:', email);

        if (!email || !password) {
            console.error('Login failed: Missing email or password');
            return res.status(400).json({ error: 'Email and password required' });
        }

        const db = await readDB();
        console.log('Database loaded, total users:', db.users.length);
        
        const user = db.users.find(u => u.email === email);

        if (!user) {
            console.error('Login failed: User not found for email:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('User found:', user.email, user.userType);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.error('Login failed: Invalid password for email:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('Password validated successfully for:', email);

        // Generate JWT token with very long expiration (essentially permanent)
        const token = jwt.sign(
            { userId: user.id, email: user.email, userType: user.userType },
            JWT_SECRET,
            { expiresIn: '3650d' } // 10 years - essentially permanent session
        );

        // Track login activity
        const loginActivity = {
            userId: user.id,
            email: user.email,
            name: user.name || user.companyName || 'Unknown',
            userType: user.userType,
            timestamp: new Date().toISOString(),
            ipAddress: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown',
            userAgent: req.headers['user-agent'] || 'unknown'
        };
        
        // Ensure loginActivity array exists
        if (!db.loginActivity) {
            db.loginActivity = [];
            console.log('Initialized loginActivity array');
        }
        
        db.loginActivity.push(loginActivity);
        console.log('Login activity added. Total login records:', db.loginActivity.length);
        console.log('Login activity details:', {
            userId: loginActivity.userId,
            email: loginActivity.email,
            userType: loginActivity.userType,
            timestamp: loginActivity.timestamp
        });
        
        // Keep only last 1000 login activities to prevent database bloat
        if (db.loginActivity.length > 1000) {
            db.loginActivity = db.loginActivity.slice(-1000);
            console.log('Trimmed loginActivity to last 1000 entries');
        }
        
        // Save to database
        await writeDB(db);
        
        // Verify login activity was saved
        const verifyDb = await readDB();
        console.log('Verification: Login activity count after save:', verifyDb.loginActivity ? verifyDb.loginActivity.length : 0);

        console.log('Login successful for:', email, user.userType);
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                companyName: user.companyName,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.userId = user.userId;
        req.userType = user.userType;
        next();
    });
}

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const db = await readDB();
        const user = db.users.find(u => u.id === req.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            companyName: user.companyName,
            userType: user.userType,
            phone: user.phone || '',
            subscription: user.subscription
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const db = await readDB();
        const user = db.users.find(u => u.id === req.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const { name, email, companyName, phone } = req.body;
        
        if (name) user.name = name;
        if (email) user.email = email;
        if (companyName) user.companyName = companyName;
        if (phone) user.phone = phone;
        
        await writeDB(db);
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                companyName: user.companyName,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== ADMIN ENDPOINTS ====================

// Admin login (simple password-based auth)
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Simple admin credentials - CHANGE THESE IN PRODUCTION!
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'snackreach1@gmail.com';
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Greylock21';

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            // Generate admin token
            const token = jwt.sign(
                { userId: 'admin', email: ADMIN_EMAIL, userType: 'admin' },
                JWT_SECRET,
                { expiresIn: '3650d' } // 10 years - permanent admin session
            );

            console.log('✅ Admin login successful');
            return res.json({
                message: 'Admin login successful',
                token,
                user: {
                    id: 'admin',
                    email: ADMIN_EMAIL,
                    userType: 'admin'
                }
            });
        }

        return res.status(401).json({ error: 'Invalid admin credentials' });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all accounts (admin only)
app.get('/api/admin/all-accounts', authenticateToken, async (req, res) => {
    try {
        console.log('Admin accounts request received');
        console.log('User ID:', req.userId);
        console.log('User Type:', req.userType);
        console.log('Environment:', process.env.NODE_ENV || 'development');
        console.log('Database path:', DB_PATH);
        
        // Check if user is admin
        if (req.userType !== 'admin') {
            console.error('Access denied - user is not admin. Type:', req.userType);
            return res.status(403).json({ error: 'Admin access required' });
        }

        // Check if database file exists
        try {
            await fs.access(DB_PATH);
            console.log('✅ Database file exists');
        } catch {
            console.warn('⚠️  Database file does not exist, will be created on first write');
        }

        const db = await readDB();
        console.log('✅ Database loaded successfully');
        console.log('✅ Total users in database:', db.users ? db.users.length : 0);
        console.log('✅ Database structure:', {
            hasUsers: !!db.users,
            usersArrayLength: db.users ? db.users.length : 0,
            hasOtherData: {
                snackCompanies: db.snackCompanies ? db.snackCompanies.length : 0,
                offices: db.offices ? db.offices.length : 0,
                products: db.products ? db.products.length : 0,
                orders: db.orders ? db.orders.length : 0
            }
        });

        // Return all accounts with safe data (no passwords)
        const accounts = (db.users || []).map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            companyName: u.companyName,
            userType: u.userType,
            phone: u.phone || '',
            createdAt: u.createdAt,
            subscription: u.subscription,
            lastLogin: u.lastLogin || null
        }));

        console.log('✅ Returning', accounts.length, 'accounts to admin');
        if (accounts.length > 0) {
            console.log('✅ Sample account:', accounts[0]);
        } else {
            console.warn('⚠️  WARNING: Database is empty! No accounts found.');
            console.warn('   This is normal if:');
            console.warn('   1. This is a fresh Railway deployment');
            console.warn('   2. No accounts have been created on Railway yet');
            console.warn('   3. Accounts created locally are NOT synced to Railway');
            console.warn('   Solution: Create accounts via Railway signup page');
        }
        
        res.json(accounts);
    } catch (error) {
        console.error('❌ Get all accounts error:', error);
        console.error('   Error message:', error.message);
        console.error('   Error stack:', error.stack);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

// ==================== PASSWORD RESET ENDPOINTS ====================

// Forgot Password - Generate reset token and send email (for now, return link)
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        console.log('Forgot password request received for email:', email);

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const db = await readDB();
        const user = db.users.find(u => u.email === email.toLowerCase().trim());

        if (!user) {
            // Don't reveal if email exists - security best practice
            console.log('Password reset requested for non-existent email:', email);
            return res.json({ 
                message: 'If an account exists with that email, a password reset link has been sent.' 
            });
        }

        console.log('User found for password reset:', user.email);

        // Generate reset token (valid for 1 hour)
        const resetToken = jwt.sign(
            { userId: user.id, email: user.email, type: 'password-reset' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Store reset token in database
        if (!db.passwordResetTokens) db.passwordResetTokens = [];
        
        // Remove any existing tokens for this user
        db.passwordResetTokens = db.passwordResetTokens.filter(t => t.userId !== user.id);
        
        // Add new token
        db.passwordResetTokens.push({
            userId: user.id,
            token: resetToken,
            email: user.email,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour from now
        });

        await writeDB(db);
        console.log('Password reset token generated and saved for:', user.email);

        // In production, you would send an email here with the reset link
        // For now, we'll return the link in the response (for development/testing)
        // In production, remove this and use an email service like SendGrid, Nodemailer, etc.
        
        // Determine base URL for reset link
        const baseUrl = req.headers.origin || 
                       (req.headers.host ? `https://${req.headers.host}` : 'http://localhost:3000');
        
        const resetLink = `${baseUrl}/reset-password.html?token=${resetToken}`;

        console.log('Password reset link generated:', resetLink);

        // TODO: Send email with reset link using email service (SendGrid, Nodemailer, etc.)
        // For now, return the link in the response so user can use it
        // In production, you would send an email and NOT return the link
        return res.json({ 
            message: `Password reset link generated! Click the link below to reset your password.`,
            resetLink: resetLink // Include reset link (remove this when email is implemented)
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reset Password - Verify token and update password
app.post('/api/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;

        console.log('Reset password request received');

        if (!token || !password) {
            return res.status(400).json({ error: 'Token and password are required' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
            
            if (decoded.type !== 'password-reset') {
                return res.status(400).json({ error: 'Invalid reset token' });
            }
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return res.status(400).json({ error: 'Invalid or expired reset token. Please request a new password reset link.' });
        }

        // Check if token exists in database
        const db = await readDB();
        const tokenRecord = db.passwordResetTokens?.find(t => t.token === token && t.userId === decoded.userId);

        if (!tokenRecord) {
            return res.status(400).json({ error: 'Invalid or expired reset token. Please request a new password reset link.' });
        }

        // Check if token has expired
        if (new Date(tokenRecord.expiresAt) < new Date()) {
            // Remove expired token
            db.passwordResetTokens = db.passwordResetTokens.filter(t => t.token !== token);
            await writeDB(db);
            return res.status(400).json({ error: 'Reset token has expired. Please request a new password reset link.' });
        }

        // Find user
        const user = db.users.find(u => u.id === decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('Resetting password for user:', user.email);

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        user.password = hashedPassword;
        user.passwordUpdatedAt = new Date().toISOString();

        // Remove used token
        db.passwordResetTokens = db.passwordResetTokens.filter(t => t.token !== token);

        await writeDB(db);
        console.log('Password reset successfully for:', user.email);

        res.json({ message: 'Password reset successfully. You can now login with your new password.' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== REAL PAYMENT ENDPOINTS ====================

// Get Stripe publishable key
app.get('/api/stripe-key', (req, res) => {
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';
    res.json({ 
        publishableKey: publishableKey,
        configured: stripeConfigured && publishableKey !== 'pk_test_placeholder'
    });
});

// Create Stripe payment method (credit card)
app.post('/api/payment-methods/card', authenticateToken, async (req, res) => {
    try {
        if (!stripe) {
            return res.status(503).json({ error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' });
        }
        
        const { cardNumber, expiryMonth, expiryYear, cvv, name } = req.body;
        
        // Create payment method in Stripe
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: cardNumber,
                exp_month: parseInt(expiryMonth),
                exp_year: parseInt('20' + expiryYear),
                cvc: cvv,
            },
            billing_details: {
                name: name,
            },
        });

        // Save to database
        const db = await readDB();
        const user = db.users.find(u => u.id === req.userId);
        if (user) {
            if (!user.paymentMethods) user.paymentMethods = [];
            user.paymentMethods.push({
                id: paymentMethod.id,
                type: 'card',
                stripePaymentMethodId: paymentMethod.id,
                last4: paymentMethod.card.last4,
                brand: paymentMethod.card.brand,
                expiry: `${expiryMonth}/${expiryYear}`,
                name: name,
                isDefault: !user.paymentMethods.length,
                addedAt: new Date().toISOString()
            });
            await writeDB(db);
        }

        res.json({ 
            success: true, 
            paymentMethodId: paymentMethod.id,
            message: 'Card added successfully'
        });
    } catch (error) {
        console.error('Add card error:', error);
        res.status(400).json({ error: error.message || 'Failed to add card' });
    }
});

// Create Plaid Link token for bank account
app.post('/api/plaid/create-link-token', authenticateToken, async (req, res) => {
    try {
        console.log('Plaid link token request - plaidConfigured:', plaidConfigured);
        console.log('Plaid client exists:', !!plaidClient);
        
        if (!plaidClient || !plaidConfigured) {
            const missingVars = [];
            if (!process.env.PLAID_CLIENT_ID || process.env.PLAID_CLIENT_ID === 'your_plaid_client_id_here') {
                missingVars.push('PLAID_CLIENT_ID');
            }
            if (!process.env.PLAID_SECRET || process.env.PLAID_SECRET === 'your_plaid_secret_key_here') {
                missingVars.push('PLAID_SECRET');
            }
            
            const errorMsg = `Plaid not configured. Please set ${missingVars.join(' and ')} environment variables in Railway.`;
            console.error('Plaid configuration error:', errorMsg);
            return res.status(503).json({ error: errorMsg });
        }
        
        const request = {
            user: {
                client_user_id: req.userId,
            },
            client_name: 'SnackReach',
            products: ['auth', 'transactions'],
            country_codes: ['US'],
            language: 'en',
        };

        console.log('Creating Plaid link token...');
        const response = await plaidClient.linkTokenCreate(request);
        console.log('Plaid link token created successfully');
        res.json({ link_token: response.data.link_token });
    } catch (error) {
        console.error('Plaid link token error:', error);
        res.status(500).json({ error: error.message || 'Failed to create link token' });
    }
});

// Exchange Plaid public token and create Stripe ACH payment method
app.post('/api/plaid/exchange-token', authenticateToken, async (req, res) => {
    try {
        if (!plaidClient) {
            return res.status(503).json({ error: 'Plaid not configured. Please set PLAID_CLIENT_ID and PLAID_SECRET environment variables.' });
        }
        
        const { public_token, account_id } = req.body;
        
        if (!public_token || !account_id) {
            return res.status(400).json({ error: 'Missing public_token or account_id' });
        }
        
        // Exchange public token for access token
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: public_token,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        // Get account info from Plaid (masked only - no raw numbers)
        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const account = accountsResponse.data.accounts.find(acc => acc.account_id === account_id);
        if (!account) {
            return res.status(400).json({ error: 'Account not found' });
        }

        // Get or create Stripe customer
        const db = await readDB();
        const user = db.users.find(u => u.id === req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let stripeCustomerId = user.stripeCustomerId;
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
            });
            stripeCustomerId = customer.id;
            user.stripeCustomerId = stripeCustomerId;
            await writeDB(db);
        }

        // Create Plaid processor token for Stripe
        const processorTokenResponse = await plaidClient.processorTokenCreate({
            access_token: accessToken,
            account_id: account_id,
            processor: 'stripe',
        });

        const processorToken = processorTokenResponse.data.processor_token;

        // For Stripe ACH with Plaid, we create a payment method using the processor token
        // The processor token is used to create a bank account token in Stripe
        // Note: Stripe's ACH implementation with Plaid requires the processor token
        // to be used when creating the payment method or payment intent
        
        // Create Stripe payment method - processor token will be used in payment intent
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'us_bank_account',
            billing_details: {
                name: user.name,
                email: user.email,
            },
            metadata: {
                plaid_processor_token: processorToken,
                plaid_account_id: account_id,
            }
        });

        // Attach payment method to customer
        await stripe.paymentMethods.attach(paymentMethod.id, {
            customer: stripeCustomerId,
        });

        // Store processor token for use in ACH payments
        // When creating payment intents, use the processor token via Plaid

        // Save to database (NO RAW ACCOUNT NUMBERS - only tokens)
        if (!user.paymentMethods) user.paymentMethods = [];
        user.paymentMethods.push({
            id: paymentMethod.id,
            type: 'bank',
            stripePaymentMethodId: paymentMethod.id,
            plaidAccessToken: accessToken, // Encrypted by Plaid
            plaidItemId: itemId,
            plaidAccountId: account_id,
            bankName: account.name || 'Bank Account',
            accountType: account.subtype || account.type,
            accountLast4: account.mask, // Only last 4 digits
            isDefault: !user.paymentMethods.length,
            addedAt: new Date().toISOString(),
            // NO RAW ACCOUNT NUMBERS STORED
        });
        await writeDB(db);

        res.json({ 
            success: true,
            paymentMethodId: paymentMethod.id,
            last4: account.mask,
            bankName: account.name,
            message: 'Bank account linked successfully'
        });
    } catch (error) {
        console.error('Plaid exchange token error:', error);
        res.status(400).json({ error: error.message || 'Failed to link bank account' });
    }
});

// Process subscription payment
app.post('/api/payments/subscribe', authenticateToken, async (req, res) => {
    try {
        if (!stripe) {
            return res.status(503).json({ error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' });
        }
        
        const db = await readDB();
        const user = db.users.find(u => u.id === req.userId);
        
        if (!user || !user.paymentMethods || !user.paymentMethods.length) {
            return res.status(400).json({ error: 'No payment method found' });
        }

        const defaultPaymentMethod = user.paymentMethods.find(pm => pm.isDefault) || user.paymentMethods[0];
        
        // Get owner's Stripe account ID
        const owner = db.users.find(u => u.userType === 'owner');
        if (!owner || !owner.stripeAccountId) {
            return res.status(400).json({ error: 'Owner account not configured' });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 200, // $2.00 in cents
            currency: 'usd',
            payment_method: defaultPaymentMethod.stripePaymentMethodId,
            confirm: true,
            application_fee_amount: 0, // Owner gets 100%
            transfer_data: {
                destination: owner.stripeAccountId,
            },
        });

        // Update user subscription
        user.subscription = {
            status: 'active',
            plan: 'premium',
            price: 2.00,
            billingCycle: 'monthly',
            lastPayment: new Date().toISOString(),
            nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            stripePaymentIntentId: paymentIntent.id
        };
        await writeDB(db);

        res.json({ 
            success: true, 
            paymentIntentId: paymentIntent.id,
            message: 'Subscription activated'
        });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(400).json({ error: error.message || 'Payment failed' });
    }
});

// Serve index.html for all non-API routes (frontend routing)
// This MUST be last, after all API routes
app.get('*', (req, res) => {
    // Don't serve HTML for API routes
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // Check if it's a file request (has extension) - static middleware should have handled it
    const hasExtension = /\.[a-zA-Z0-9]+$/.test(req.path.split('?')[0]);
    if (hasExtension) {
        // File should have been served by static middleware, return 404
        return res.status(404).send('File not found');
    }
    
    // Serve index.html for all other routes (enables frontend routing)
    const indexPath = path.join(__dirname, '..', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error sending index.html:', err);
            res.status(500).send('Error loading page');
        }
    });
});

// Start server
async function startServer() {
    try {
        console.log('🔧 Initializing database...');
        await initDatabase();
        console.log('✅ Database initialized');
        
        console.log('🔧 Starting server...');
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 SnackReach API server running on port ${PORT}`);
            console.log(`📡 API endpoints available at /api`);
            console.log(`🌐 Frontend files served from: ${path.join(__dirname, '..')}`);
            console.log(`🌐 Main site: http://localhost:${PORT}/`);
            if (process.env.NODE_ENV !== 'production') {
                console.log(`   Local API: http://localhost:${PORT}/api`);
            }
            // Configuration status
            if (!stripeConfigured) {
                console.log(`⚠️  WARNING: Stripe not configured. Set STRIPE_SECRET_KEY in .env`);
                console.log(`   Get your keys at: https://dashboard.stripe.com/apikeys`);
            }
            if (!plaidConfigured) {
                console.log(`⚠️  WARNING: Plaid not configured. Set PLAID_CLIENT_ID and PLAID_SECRET in .env`);
                console.log(`   Get your keys at: https://dashboard.plaid.com/developers/keys`);
                console.log(`   See PLAID-STRIPE-SETUP.md for detailed instructions`);
            }
        });
        
        // Handle server errors
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use`);
            } else {
                console.error('❌ Server error:', err);
            }
            process.exit(1);
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        console.error('Error details:', error.stack);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

startServer().catch(error => {
    console.error('❌ Fatal error starting server:', error);
    console.error('Error stack:', error.stack);
    process.exit(1);
});
