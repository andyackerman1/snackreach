const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Stripe and Plaid setup
// Initialize Stripe with error handling
let stripe = null;
try {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
} catch (error) {
    console.warn('⚠️  Stripe initialization warning:', error.message);
    // Stripe will be null, but endpoints will check before using it
}
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

// Plaid configuration - handle missing env vars gracefully
let plaidClient = null;
try {
    const plaidConfig = new Configuration({
        basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
        baseOptions: {
            headers: {
                'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
                'PLAID-SECRET': process.env.PLAID_SECRET || '',
            },
        },
    });
    plaidClient = new PlaidApi(plaidConfig);
} catch (error) {
    console.warn('⚠️  Plaid configuration warning:', error.message);
    // Plaid will be null, but endpoints will check before using it
}

const app = express();
const PORT = process.env.PORT || 8080; // Railway uses PORT env var
const JWT_SECRET = process.env.JWT_SECRET || 'snackreach_secret_key_2024';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from root (frontend HTML/CSS/JS)
app.use(express.static(path.join(__dirname, '..')));

// Serve API routes
app.use('/api', (req, res, next) => {
    next();
});

// Database file path
const DB_PATH = path.join(__dirname, 'data', 'database.json');

// Initialize database
async function initDatabase() {
    try {
        const dataDir = path.join(__dirname, 'data');
        await fs.mkdir(dataDir, { recursive: true });
        
        try {
            await fs.access(DB_PATH);
        } catch {
            // Create initial database structure
            const initialData = {
                users: [],
                snackCompanies: [],
                offices: [],
                products: [],
                orders: [],
                messages: []
            };
            await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Read database
async function readDB() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return {
            users: [],
            snackCompanies: [],
            offices: [],
            products: [],
            orders: [],
            messages: []
        };
    }
}

// Write database
async function writeDB(data) {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing database:', error);
        throw error;
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

        if (!name || !email || !password || !companyName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = await readDB();
        
        // Check if user already exists
        const existingUser = db.users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

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
        await writeDB(db);

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email, userType: newUser.userType },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

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
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const db = await readDB();
        const user = db.users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, userType: user.userType },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

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
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Owner registration
app.post('/api/register-owner', async (req, res) => {
    try {
        const { name, email, password, companyName, phone, bankingInfo } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = await readDB();
        
        const existingUser = db.users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newOwner = {
            id: 'owner-' + Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            companyName: companyName || 'SnackReach Admin',
            phone: phone || '',
            userType: 'owner',
            bankingInfo: bankingInfo || {},
            stripeAccountId: null,
            createdAt: new Date().toISOString()
        };

        db.users.push(newOwner);
        await writeDB(db);

        const token = jwt.sign(
            { userId: newOwner.id, email: newOwner.email, userType: 'owner' },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            message: 'Owner registered successfully',
            token,
            user: {
                id: newOwner.id,
                name: newOwner.name,
                email: newOwner.email,
                companyName: newOwner.companyName,
                userType: 'owner'
            }
        });
    } catch (error) {
        console.error('Owner registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Owner login
app.post('/api/login-owner', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Special admin credentials
        if (email === 'Andy' && password === 'BoJackson421') {
            const db = await readDB();
            let adminUser = db.users.find(u => u.email === 'Andy' && u.userType === 'owner');
            if (!adminUser) {
                const hashedPassword = await bcrypt.hash('BoJackson421', 10);
                adminUser = {
                    id: 'admin-andy',
                    name: 'Andy',
                    email: 'Andy',
                    password: hashedPassword,
                    companyName: 'SnackReach Admin',
                    userType: 'owner',
                    isAdmin: true,
                    createdAt: new Date().toISOString()
                };
                db.users.push(adminUser);
                await writeDB(db);
            }
            const token = jwt.sign({ userId: adminUser.id, email: adminUser.email, userType: 'owner' }, JWT_SECRET, { expiresIn: '30d' });
            return res.json({ message: 'Login successful', token, user: { id: adminUser.id, name: adminUser.name, email: adminUser.email, companyName: adminUser.companyName, userType: 'owner' } });
        }

        const db = await readDB();
        const user = db.users.find(u => u.email === email && u.userType === 'owner');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, userType: 'owner' },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                companyName: user.companyName,
                userType: 'owner'
            }
        });
    } catch (error) {
        console.error('Owner login error:', error);
        res.status(500).json({ error: 'Internal server error' });
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
            phone: user.phone || '',
            companyName: user.companyName,
            userType: user.userType,
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
        const { name, email, phone, companyName } = req.body;
        const db = await readDB();
        const userIndex = db.users.findIndex(u => u.id === req.userId);
        
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (name) db.users[userIndex].name = name;
        if (email) db.users[userIndex].email = email;
        if (phone !== undefined) db.users[userIndex].phone = phone;
        if (companyName) db.users[userIndex].companyName = companyName;

        await writeDB(db);

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: db.users[userIndex].id,
                name: db.users[userIndex].name,
                email: db.users[userIndex].email,
                phone: db.users[userIndex].phone,
                companyName: db.users[userIndex].companyName
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all accounts (owner only)
app.get('/api/admin/all-accounts', authenticateToken, async (req, res) => {
    try {
        const db = await readDB();
        const user = db.users.find(u => u.id === req.userId);
        
        if (!user || user.userType !== 'owner') {
            return res.status(403).json({ error: 'Owner access required' });
        }

        const accounts = db.users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            companyName: u.companyName,
            userType: u.userType,
            password: u.password || 'N/A', // Include password for owner view
            createdAt: u.createdAt,
            subscription: u.subscription
        }));

        res.json(accounts);
    } catch (error) {
        console.error('Get all accounts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== REAL PAYMENT ENDPOINTS ====================

// Get Stripe publishable key
app.get('/api/stripe-key', (req, res) => {
    res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder' });
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
        if (!plaidClient) {
            return res.status(503).json({ error: 'Plaid not configured. Please set PLAID_CLIENT_ID and PLAID_SECRET environment variables.' });
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

        const response = await plaidClient.linkTokenCreate(request);
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

// Setup owner Stripe Connect account
app.post('/api/owner/setup-stripe', authenticateToken, async (req, res) => {
    try {
        if (!stripe) {
            return res.status(503).json({ error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' });
        }
        
        const db = await readDB();
        const user = db.users.find(u => u.id === req.userId);
        
        if (!user || user.userType !== 'owner') {
            return res.status(403).json({ error: 'Owner access required' });
        }

        // Create Stripe Connect account
        const account = await stripe.accounts.create({
            type: 'express',
            country: 'US',
            email: user.email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });

        // Create account link for onboarding
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${req.headers.origin || 'http://localhost:3000'}/owner-dashboard.html`,
            return_url: `${req.headers.origin || 'http://localhost:3000'}/owner-dashboard.html`,
            type: 'account_onboarding',
        });

        // Save Stripe account ID
        user.stripeAccountId = account.id;
        await writeDB(db);

        res.json({ 
            accountId: account.id,
            onboardingUrl: accountLink.url,
            message: 'Stripe account created. Complete onboarding to receive payments.'
        });
    } catch (error) {
        console.error('Stripe setup error:', error);
        res.status(400).json({ error: error.message || 'Failed to setup Stripe' });
    }
});

// Get owner's Stripe account status
app.get('/api/owner/stripe-status', authenticateToken, async (req, res) => {
    try {
        if (!stripe) {
            return res.status(503).json({ error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' });
        }
        
        const db = await readDB();
        const user = db.users.find(u => u.id === req.userId);
        
        if (!user || user.userType !== 'owner') {
            return res.status(403).json({ error: 'Owner access required' });
        }

        if (!user.stripeAccountId) {
            return res.json({ connected: false, message: 'Stripe not connected' });
        }

        const account = await stripe.accounts.retrieve(user.stripeAccountId);
        
        res.json({
            connected: true,
            accountId: account.id,
            chargesEnabled: account.charges_enabled,
            payoutsEnabled: account.payouts_enabled,
            detailsSubmitted: account.details_submitted,
            email: account.email
        });
    } catch (error) {
        console.error('Stripe status error:', error);
        res.status(400).json({ error: error.message || 'Failed to get status' });
    }
});

// Serve index.html for all non-API routes (frontend routing)
// This MUST be last, after all API routes
app.get('*', (req, res) => {
    // Don't serve HTML for API routes (shouldn't reach here, but safety check)
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // Serve index.html for all other routes (enables frontend routing)
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start server
async function startServer() {
    try {
        await initDatabase();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 SnackReach API server running on port ${PORT}`);
            console.log(`📡 API endpoints available at /api`);
            console.log(`🌐 Frontend files served from: ${path.join(__dirname, '..')}`);
            if (process.env.NODE_ENV !== 'production') {
                console.log(`   Local: http://localhost:${PORT}/api`);
            }
            if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
                console.log(`⚠️  WARNING: Stripe not configured. Set STRIPE_SECRET_KEY in .env`);
            }
            if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
                console.log(`⚠️  WARNING: Plaid not configured. Set PLAID_CLIENT_ID and PLAID_SECRET in .env`);
            }
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer().catch(error => {
    console.error('❌ Fatal error starting server:', error);
    process.exit(1);
});
