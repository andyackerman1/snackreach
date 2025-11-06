const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// Supabase removed - all data now in Clerk
// const { supabase, testConnection } = require('./supabase');
const { clerkClient, getClerkUser, createClerkUser, updateClerkUserMetadata, getClerkUserData, clerkConfigured } = require('./clerk');
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

// Email configuration
let emailTransporter = null;
let emailConfigured = false;
try {
    const emailService = process.env.EMAIL_SERVICE || 'gmail'; // 'gmail', 'sendgrid', 'smtp'
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    // Default to noreply email for all automated emails
    const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_NOREPLY || 'noreply@snackreach.com';
    
    if (emailUser && emailPassword) {
        if (emailService === 'sendgrid') {
            // SendGrid uses API key, not password
            emailTransporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: 'apikey',
                    pass: emailPassword // This would be the SendGrid API key
                }
            });
        } else if (emailService === 'gmail') {
            emailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: emailUser,
                    pass: emailPassword
                }
            });
        } else {
            // Generic SMTP
            emailTransporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: emailUser,
                    pass: emailPassword
                }
            });
        }
        
        emailConfigured = true;
        console.log('✅ Email service configured successfully');
    } else {
        console.warn('⚠️  Email not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env to send welcome emails');
    }
} catch (error) {
    console.warn('⚠️  Email initialization error:', error.message);
    console.warn('   Make sure the "nodemailer" package is installed: npm install nodemailer');
    emailConfigured = false;
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


app.get('/reset-password.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'reset-password.html'));
});

// Initialize database connection
// Note: All user data is stored in Clerk, not Supabase or JSON files
async function initDatabase() {
    try {
        if (clerkConfigured) {
            // Get user count from Clerk
            try {
                const users = await clerkClient.users.getUserList({ limit: 1 });
                console.log('✅ Clerk database ready - all user data stored in Clerk');
            } catch (error) {
                console.warn('⚠️  Could not connect to Clerk:', error.message);
            }
        } else {
            console.warn('⚠️  Clerk not configured - user management will not work');
            console.warn('   Make sure CLERK_SECRET_KEY is set in .env');
        }
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        console.warn('   Server will continue but user operations may fail');
    }
}

// Send welcome email to new users
async function sendWelcomeEmail(user) {
    console.log('📧 Attempting to send welcome email to:', user.email);
    console.log('📧 Email configured:', emailConfigured);
    console.log('📧 Email transporter exists:', !!emailTransporter);
    console.log('📧 EMAIL_USER set:', !!process.env.EMAIL_USER);
    console.log('📧 EMAIL_PASSWORD set:', !!process.env.EMAIL_PASSWORD);
    console.log('📧 EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'gmail');
    
    if (!emailConfigured || !emailTransporter) {
        console.warn('⚠️  Email not configured, skipping welcome email for:', user.email);
        console.warn('   To enable emails, set EMAIL_USER and EMAIL_PASSWORD in .env');
        console.warn('   See EMAIL-SETUP.md for instructions');
        return;
    }

    try {
        // Use noreply email for automated messages
        const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_NOREPLY || 'noreply@snackreach.com';
        const baseUrl = process.env.BASE_URL || process.env.RAILWAY_PUBLIC_DOMAIN || 'https://snackreach-production.up.railway.app';
        
        console.log('📧 Sending email from:', emailFrom);
        console.log('📧 Base URL:', baseUrl);
        
        const mailOptions = {
            from: emailFrom,
            to: user.email,
            subject: 'Welcome to SnackReach! 🎉',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                            border-radius: 8px 8px 0 0;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                        }
                        .content {
                            background: #ffffff;
                            padding: 30px;
                            border: 1px solid #e5e7eb;
                            border-top: none;
                            border-radius: 0 0 8px 8px;
                        }
                        .button {
                            display: inline-block;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 14px 28px;
                            text-decoration: none;
                            border-radius: 6px;
                            font-weight: 600;
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            color: #6b7280;
                            font-size: 14px;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #e5e7eb;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Welcome to SnackReach!</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${user.name || user.companyName},</p>
                        
                        <p>Thank you for joining SnackReach! We're excited to have you on board.</p>
                        
                        <p>Your account has been successfully created:</p>
                        <ul>
                            <li><strong>Name:</strong> ${user.name}</li>
                            <li><strong>Company:</strong> ${user.companyName}</li>
                            <li><strong>Email:</strong> ${user.email}</li>
                            <li><strong>Account Type:</strong> ${user.userType === 'startup' ? 'Food Startup' : user.userType === 'office' ? 'Office Manager' : user.userType}</li>
                        </ul>
                        
                        <p>You can now:</p>
                        <ul>
                            <li>Browse our marketplace of delicious snacks</li>
                            <li>Connect with food startups and office spaces</li>
                            <li>Manage your orders and subscriptions</li>
                            <li>Access your dashboard to get started</li>
                        </ul>
                        
                        <div style="text-align: center;">
                            <a href="${baseUrl}/login.html" class="button">Access Your Dashboard</a>
                        </div>
                        
                        <p>If you have any questions, feel free to reach out to our support team.</p>
                        
                        <p>Welcome aboard!</p>
                        <p><strong>The SnackReach Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>This is an automated message. Please do not reply to this email.</p>
                        <p>&copy; ${new Date().getFullYear()} SnackReach. All rights reserved.</p>
                    </div>
                </body>
                </html>
            `,
            text: `
                Welcome to SnackReach!
                
                Hi ${user.name || user.companyName},
                
                Thank you for joining SnackReach! We're excited to have you on board.
                
                Your account has been successfully created:
                - Name: ${user.name}
                - Company: ${user.companyName}
                - Email: ${user.email}
                - Account Type: ${user.userType === 'startup' ? 'Food Startup' : user.userType === 'office' ? 'Office Manager' : user.userType}
                
                You can now browse our marketplace, connect with food startups and office spaces, and manage your orders and subscriptions.
                
                Access your dashboard: ${baseUrl}/login.html
                
                If you have any questions, feel free to reach out to our support team.
                
                Welcome aboard!
                The SnackReach Team
            `
        };

        const info = await emailTransporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent successfully to:', user.email);
        console.log('✅ Email message ID:', info.messageId);
        console.log('✅ Email response:', info.response);
    } catch (error) {
        console.error('❌ Error sending welcome email to:', user.email);
        console.error('❌ Error details:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode
        });
        console.error('❌ Full error:', error);
        
        // More specific error messages
        if (error.code === 'EAUTH') {
            console.error('❌ Authentication failed - check EMAIL_USER and EMAIL_PASSWORD');
        } else if (error.code === 'ECONNECTION') {
            console.error('❌ Connection failed - check SMTP settings');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('❌ Connection timeout - check network/firewall');
        }
        
        throw error;
    }
}

// Send password reset email to users
async function sendPasswordResetEmail(user, resetLink) {
    console.log('📧 Attempting to send password reset email to:', user.email);
    console.log('📧 Email configured:', emailConfigured);
    console.log('📧 Email transporter exists:', !!emailTransporter);
    
    if (!emailConfigured || !emailTransporter) {
        console.warn('⚠️  Email not configured, skipping password reset email for:', user.email);
        console.warn('   To enable emails, set EMAIL_USER and EMAIL_PASSWORD in .env');
        console.warn('   See EMAIL-SETUP.md for instructions');
        return;
    }

    try {
        // Use noreply email for automated messages
        const emailFrom = process.env.EMAIL_FROM || process.env.EMAIL_NOREPLY || 'noreply@snackreach.com';
        const baseUrl = process.env.BASE_URL || process.env.RAILWAY_PUBLIC_DOMAIN || 'https://snackreach-production.up.railway.app';
        
        console.log('📧 Sending password reset email from:', emailFrom);
        console.log('📧 Reset link:', resetLink);
        
        const mailOptions = {
            from: emailFrom,
            to: user.email,
            subject: 'Reset Your SnackReach Password',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                            border-radius: 8px 8px 0 0;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                        }
                        .content {
                            background: #ffffff;
                            padding: 30px;
                            border: 1px solid #e5e7eb;
                            border-top: none;
                            border-radius: 0 0 8px 8px;
                        }
                        .button {
                            display: inline-block;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 14px 28px;
                            text-decoration: none;
                            border-radius: 6px;
                            font-weight: 600;
                            margin: 20px 0;
                        }
                        .reset-link {
                            background: #f3f4f6;
                            padding: 15px;
                            border-radius: 6px;
                            word-break: break-all;
                            font-family: monospace;
                            font-size: 12px;
                            margin: 20px 0;
                            color: #1f2937;
                        }
                        .warning {
                            background: #fef3c7;
                            border-left: 4px solid #f59e0b;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 4px;
                        }
                        .footer {
                            text-align: center;
                            color: #6b7280;
                            font-size: 14px;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #e5e7eb;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Reset Your Password</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${user.name || user.companyName || 'there'},</p>
                        
                        <p>We received a request to reset your password for your SnackReach account.</p>
                        
                        <div style="text-align: center;">
                            <a href="${resetLink}" class="button">Reset Password</a>
                        </div>
                        
                        <p>Or copy and paste this link into your browser:</p>
                        <div class="reset-link">${resetLink}</div>
                        
                        <div class="warning">
                            <strong>⚠️ Important:</strong>
                            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                                <li>This link will expire in 1 hour</li>
                                <li>If you didn't request this, you can safely ignore this email</li>
                                <li>Your password will remain unchanged until you click the link above</li>
                            </ul>
                        </div>
                        
                        <p>If you have any questions or concerns, please contact our support team.</p>
                        
                        <p>Best regards,<br><strong>The SnackReach Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>This is an automated message. Please do not reply to this email.</p>
                        <p>&copy; ${new Date().getFullYear()} SnackReach. All rights reserved.</p>
                    </div>
                </body>
                </html>
            `,
            text: `
                Reset Your Password - SnackReach
                
                Hi ${user.name || user.companyName || 'there'},
                
                We received a request to reset your password for your SnackReach account.
                
                Click this link to reset your password:
                ${resetLink}
                
                This link will expire in 1 hour.
                
                If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged until you click the link above.
                
                If you have any questions or concerns, please contact our support team.
                
                Best regards,
                The SnackReach Team
            `
        };

        const info = await emailTransporter.sendMail(mailOptions);
        console.log('✅ Password reset email sent successfully to:', user.email);
        console.log('✅ Email message ID:', info.messageId);
        console.log('✅ Email response:', info.response);
    } catch (error) {
        console.error('❌ Error sending password reset email to:', user.email);
        console.error('❌ Error details:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode
        });
        console.error('❌ Full error:', error);
        
        // More specific error messages
        if (error.code === 'EAUTH') {
            console.error('❌ Authentication failed - check EMAIL_USER and EMAIL_PASSWORD');
        } else if (error.code === 'ECONNECTION') {
            console.error('❌ Connection failed - check SMTP settings');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('❌ Connection timeout - check network/firewall');
        }
        
        throw error;
    }
}

// Database functions - No longer needed since we use Clerk only
// These are kept as stubs for backward compatibility with endpoints that might still reference them
async function readDB() {
    // Return empty structure - all user data is in Clerk now
    return {
        users: [],
        messages: [],
        passwordResetTokens: []
    };
}

async function writeDB(data) {
    // No-op - all user data is stored in Clerk
    // This function is kept for compatibility but doesn't do anything
    console.log('⚠️  writeDB called but data is stored in Clerk, not JSON file');
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'SnackReach API is running' });
});

// Database diagnostic endpoint - shows Clerk users
app.get('/api/database-status', async (req, res) => {
    try {
        if (!clerkConfigured) {
            return res.json({
                databaseType: 'Clerk (NOT CONFIGURED)',
                totalAccounts: 0,
                accounts: [],
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString(),
                message: '⚠️ Clerk is not configured. Set CLERK_SECRET_KEY in Railway environment variables.',
                fix: 'Go to Railway Dashboard → Your Service → Variables → Add CLERK_SECRET_KEY',
                clerkConfigured: false
            });
        }

        // Get users from Clerk
        try {
            const users = await clerkClient.users.getUserList({ limit: 100 });
            
            const stats = {
                databaseType: 'Clerk',
                databaseUrl: 'https://dashboard.clerk.com',
                totalAccounts: users.data ? users.data.length : 0,
                accounts: users.data ? users.data.map(u => ({
                    id: u.id,
                    email: u.emailAddresses[0]?.emailAddress || '',
                    userType: u.publicMetadata?.userType || 'office',
                    companyName: u.publicMetadata?.companyName || '',
                    createdAt: u.createdAt
                })) : [],
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString(),
                connected: true,
                clerkConfigured: true,
                message: '✅ All user data lives in Clerk metadata'
            };
            
            res.json(stats);
        } catch (clerkError) {
            res.json({
                databaseType: 'Clerk (Connection Error)',
                totalAccounts: 0,
                accounts: [],
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString(),
                error: clerkError.message,
                message: '❌ Could not connect to Clerk. Check CLERK_SECRET_KEY in Railway.',
                clerkConfigured: false
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Database diagnostic failed',
            message: error.message,
            stack: error.stack
        });
    }
});

// User registration with Clerk
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, companyName, phone, userType, cardInfo } = req.body;

        console.log('Registration request received:', { name, email, companyName, userType });

        if (!name || !email || !password || !companyName) {
            console.error('Registration failed: Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Clerk is required - all data lives in Clerk
        if (!clerkConfigured) {
            return res.status(503).json({ error: 'Clerk is required but not configured. Please set CLERK_SECRET_KEY in environment variables.' });
        }

        try {
            console.log('📝 Creating user in Clerk:', email);
            
            // Create user in Clerk with ALL data stored in metadata
            const clerkUser = await createClerkUser({
                email: email.toLowerCase().trim(),
                password: password,
                name: name,
                userType: userType || 'office',
                companyName: companyName,
                phone: phone || null,
                cardInfo: cardInfo || {},
                subscription: {
                    status: 'active',
                    plan: 'premium',
                    price: 2.00,
                    billingCycle: 'monthly'
                },
                paymentMethods: []
            });

            console.log('✅ User created in Clerk:', clerkUser.id);
            console.log('✅ All user data stored in Clerk metadata (no Supabase needed)');

            // Send welcome email (async)
            sendWelcomeEmail({
                name: name,
                email: email,
                companyName: companyName,
                userType: userType || 'office'
            }).catch(err => {
                console.error('❌ Failed to send welcome email:', err.message);
            });

            // Return user data
            res.json({
                message: 'User registered successfully. Please sign in.',
                user: {
                    id: clerkUser.id,
                    email: clerkUser.emailAddresses[0]?.emailAddress || email,
                    name: clerkUser.firstName + ' ' + (clerkUser.lastName || ''),
                    companyName: companyName,
                    userType: userType || 'office'
                },
                clerkUserId: clerkUser.id
            });
        } catch (error) {
            console.error('❌ Clerk registration error:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.status,
                statusCode: error.statusCode,
                errors: error.errors || error.clerkErrors || 'No error details'
            });
            
            // Handle specific Clerk errors
            if (error.status === 422 || error.statusCode === 422) {
                // Unprocessable Entity - usually means invalid data format
                const errorMsg = error.errors?.[0]?.message || error.message || 'Invalid user data format';
                return res.status(422).json({ 
                    error: 'Failed to create account: ' + errorMsg,
                    details: 'Please check that all required fields are provided correctly.'
                });
            }
            
            // If Clerk fails, check if it's a duplicate email
            if (error.errors && error.errors.some(e => e.message && e.message.includes('already exists'))) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            
            return res.status(500).json({ error: 'Failed to create account: ' + (error.message || 'Unknown error') });
        }
    } catch (error) {
        console.error('Registration error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

// User login
// Note: With Clerk, users typically authenticate through Clerk's frontend components
// This endpoint is kept for backward compatibility and API-only authentication
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt received for email:', email);

        if (!email || !password) {
            console.error('Login failed: Missing email or password');
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Clerk is required - authentication handled by Clerk frontend
        if (!clerkConfigured) {
            return res.status(503).json({ error: 'Clerk is required but not configured.' });
        }

        // With Clerk, users authenticate through Clerk's frontend components
        // This endpoint is for backward compatibility only
        // Users should use Clerk's SignIn component on the frontend
        return res.status(400).json({ 
            error: 'Please use Clerk authentication for login. Use Clerk\'s SignIn component on the frontend to authenticate.',
            useClerkAuth: true,
            message: 'Authentication is handled by Clerk. Use Clerk\'s frontend components or session tokens.'
        });
    } catch (error) {
        console.error('Login error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

// Authentication middleware - supports both Clerk and JWT tokens
async function authenticateToken(req, res, next) {
    // Try Clerk authentication first if configured
    if (clerkConfigured) {
        try {
            // Check for Clerk session token
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                
                // Verify Clerk session token
                try {
                    // Clerk uses JWT tokens - verify the token
                    const { verifyToken } = require('@clerk/clerk-sdk-node');
                    const session = await verifyToken(token);
                    
                    if (session && session.sub) {
                        // Get user from Clerk (all data lives in Clerk)
                        const clerkUser = await clerkClient.users.getUser(session.sub);
                        req.userId = session.sub;
                        req.clerkUserId = session.sub;
                        req.userType = clerkUser.publicMetadata?.userType || 'office';
                        req.email = clerkUser.emailAddresses[0]?.emailAddress || '';
                        
                        // All user data is in Clerk - no Supabase needed
                        return next();
                    }
                } catch (clerkError) {
                    // Clerk token invalid, try JWT fallback
                    console.log('Clerk token verification failed, trying JWT fallback:', clerkError.message);
                }
            }
        } catch (error) {
            console.error('Clerk authentication error:', error);
            // Fall through to JWT fallback
        }
    }
    
    // Fallback to JWT authentication (for backward compatibility)
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

// Get user profile - all data from Clerk
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        // Clerk is required - all data lives in Clerk
        if (!req.clerkUserId || !clerkConfigured) {
            return res.status(401).json({ error: 'Clerk authentication required' });
        }

        try {
            // Get all user data from Clerk (including metadata)
            const userData = await getClerkUserData(req.clerkUserId);
            
            res.json({
                user: userData
            });
        } catch (error) {
            console.error('Error fetching Clerk user:', error);
            return res.status(500).json({ error: 'Failed to fetch user profile' });
        }
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile - all data stored in Clerk
app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        if (!req.clerkUserId || !clerkConfigured) {
            return res.status(401).json({ error: 'Clerk authentication required' });
        }

        const { name, companyName, phone } = req.body;
        
        // Get current user data
        const currentUser = await clerkClient.users.getUser(req.clerkUserId);
        const currentPublicMetadata = currentUser.publicMetadata || {};
        const currentPrivateMetadata = currentUser.privateMetadata || {};
        
        // Prepare update data
        const updateData = {};
        
        // Update name if provided
        if (name) {
            const nameParts = name.split(' ');
            updateData.firstName = nameParts[0] || name;
            updateData.lastName = nameParts.slice(1).join(' ') || '';
        }
        
        // Update metadata
        const publicMetadata = { ...currentPublicMetadata };
        const privateMetadata = { ...currentPrivateMetadata };
        
        if (companyName) publicMetadata.companyName = companyName;
        if (phone !== undefined) privateMetadata.phone = phone;
        
        updateData.publicMetadata = publicMetadata;
        updateData.privateMetadata = privateMetadata;
        
        // Update user in Clerk
        const updatedUser = await clerkClient.users.updateUser(req.clerkUserId, updateData);
        
        // Get full updated user data
        const userData = await getClerkUserData(req.clerkUserId);
        
        res.json({
            message: 'Profile updated successfully',
            user: userData
        });
    } catch (error) {
        console.error('Update profile error:', error);
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

        // Send password reset email
        await sendPasswordResetEmail(user, resetLink).catch(err => {
            console.error('❌ Failed to send password reset email:', err.message);
            // Don't fail the request if email fails, but log it
            console.error('   Password reset token is still valid, but email was not sent.');
        });

        // Always return success message (don't reveal if email exists for security)
        return res.json({ 
            message: 'If an account exists with that email, a password reset link has been sent.'
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

// Email configuration check endpoint (for debugging)
app.get('/api/email-status', (req, res) => {
    res.json({
        emailConfigured: emailConfigured,
        hasTransporter: !!emailTransporter,
        emailService: process.env.EMAIL_SERVICE || 'gmail',
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPassword: !!process.env.EMAIL_PASSWORD,
        emailFrom: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'not set',
        baseUrl: process.env.BASE_URL || 'not set'
    });
});

// ==================== CLERK WEBHOOK HANDLER ====================
// This endpoint receives webhooks from Clerk when users are created/updated/deleted
// Set this URL in your Clerk dashboard: https://your-domain.com/api/clerk-webhook
// Note: All data lives in Clerk, so webhooks are mainly for logging/notifications
app.post('/api/clerk-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        if (!clerkConfigured) {
            return res.status(503).json({ error: 'Clerk not configured' });
        }

        const svixId = req.headers['svix-id'];
        const svixTimestamp = req.headers['svix-timestamp'];
        const svixSignature = req.headers['svix-signature'];

        if (!svixId || !svixTimestamp || !svixSignature) {
            return res.status(400).json({ error: 'Missing svix headers' });
        }

        // Parse webhook payload
        const payload = JSON.parse(req.body.toString());
        const eventType = payload.type;
        const data = payload.data;

        console.log('📥 Clerk webhook received:', eventType, data.id);

        // All data lives in Clerk - webhooks are for logging/notifications only
        if (eventType === 'user.created') {
            console.log('✅ New user created in Clerk:', data.id, data.email_addresses[0]?.email_address);
        } else if (eventType === 'user.updated') {
            console.log('✅ User updated in Clerk:', data.id);
        } else if (eventType === 'user.deleted') {
            console.log('✅ User deleted from Clerk:', data.id);
        }

        res.json({ received: true, message: 'Webhook processed - all data lives in Clerk' });
    } catch (error) {
        console.error('❌ Clerk webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Delete user account (user can delete their own account)
app.delete('/api/account', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const db = await readDB();
        
        // Find user
        const userIndex = db.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const user = db.users[userIndex];
        console.log('Deleting account:', user.email);
        
        // Remove user from database
        db.users.splice(userIndex, 1);
        
        // Also remove user's messages if any
        if (db.messages) {
            db.messages = db.messages.filter(msg => 
                msg.fromUserId !== userId && msg.toUserId !== userId
            );
        }
        
        // Save updated database
        await writeDB(db);
        
        console.log('✅ Account deleted successfully:', user.email);
        console.log('✅ Remaining users in database:', db.users.length);
        
        res.json({ 
            success: true,
            message: 'Account deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== MESSAGING ENDPOINTS ====================

// Get list of offices (for startups to message)
app.get('/api/offices', authenticateToken, async (req, res) => {
    try {
        if (req.userType !== 'startup') {
            return res.status(403).json({ error: 'Only startups can view offices' });
        }

        const db = await readDB();
        // Get all office users
        const offices = db.users
            .filter(u => u.userType === 'office')
            .map(u => ({
                id: u.id,
                name: u.name,
                companyName: u.companyName,
                email: u.email,
                phone: u.phone || '',
                createdAt: u.createdAt
            }));

        console.log('Returning', offices.length, 'offices for startup:', req.userId);
        res.json(offices);
    } catch (error) {
        console.error('Get offices error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get list of startups (for offices to view)
app.get('/api/startups', authenticateToken, async (req, res) => {
    try {
        if (req.userType !== 'office') {
            return res.status(403).json({ error: 'Only offices can view startups' });
        }

        const db = await readDB();
        // Get all startup users
        const startups = db.users
            .filter(u => u.userType === 'startup')
            .map(u => ({
                id: u.id,
                name: u.name,
                companyName: u.companyName,
                email: u.email,
                phone: u.phone || '',
                createdAt: u.createdAt
            }));

        console.log('Returning', startups.length, 'startups for office:', req.userId);
        res.json(startups);
    } catch (error) {
        console.error('Get startups error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Send a message
app.post('/api/messages', authenticateToken, async (req, res) => {
    try {
        const { toUserId, subject, message } = req.body;

        if (!toUserId || !subject || !message) {
            return res.status(400).json({ error: 'toUserId, subject, and message are required' });
        }

        const db = await readDB();
        
        // Verify recipient exists
        const recipient = db.users.find(u => u.id === toUserId);
        if (!recipient) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        // Verify sender and recipient are different types (startup can message office, office can message startup)
        const sender = db.users.find(u => u.id === req.userId);
        if (!sender) {
            return res.status(404).json({ error: 'Sender not found' });
        }

        // Check if startup is messaging office or office is messaging startup
        const isValidMessage = 
            (sender.userType === 'startup' && recipient.userType === 'office') ||
            (sender.userType === 'office' && recipient.userType === 'startup');

        if (!isValidMessage) {
            return res.status(403).json({ error: 'You can only message different user types (startup ↔ office)' });
        }

        // Create message
        const newMessage = {
            id: Date.now().toString(),
            fromUserId: req.userId,
            fromUserName: sender.name || sender.companyName,
            fromUserEmail: sender.email,
            fromUserType: sender.userType,
            toUserId: toUserId,
            toUserName: recipient.name || recipient.companyName,
            toUserEmail: recipient.email,
            toUserType: recipient.userType,
            subject: subject,
            message: message,
            timestamp: new Date().toISOString(),
            read: false
        };

        if (!db.messages) db.messages = [];
        db.messages.push(newMessage);

        await writeDB(db);
        console.log('Message sent from', sender.userType, req.userId, 'to', recipient.userType, toUserId);

        res.json({ 
            message: 'Message sent successfully',
            messageId: newMessage.id 
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get messages for current user (both sent and received)
app.get('/api/messages', authenticateToken, async (req, res) => {
    try {
        const db = await readDB();
        
        // Get all messages where user is sender or recipient
        const userMessages = (db.messages || []).filter(m => 
            m.fromUserId === req.userId || m.toUserId === req.userId
        );

        // Sort by timestamp (newest first)
        userMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        console.log('Returning', userMessages.length, 'messages for user:', req.userId);
        res.json(userMessages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mark message as read
app.put('/api/messages/:messageId/read', authenticateToken, async (req, res) => {
    try {
        const { messageId } = req.params;
        const db = await readDB();

        const message = db.messages.find(m => m.id === messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Only recipient can mark as read
        if (message.toUserId !== req.userId) {
            return res.status(403).json({ error: 'You can only mark your received messages as read' });
        }

        message.read = true;
        await writeDB(db);

        res.json({ message: 'Message marked as read' });
    } catch (error) {
        console.error('Mark message read error:', error);
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
        
        console.log('✅ Database initialized successfully');
        console.log('📊 All user data stored in Clerk');
        
        console.log('🔧 Starting server...');
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 SnackReach API server running on port ${PORT}`);
            console.log(`📡 API endpoints available at /api`);
            console.log(`🌐 Frontend files served from: ${path.join(__dirname, '..')}`);
            console.log(`🌐 Main site: http://localhost:${PORT}/`);
            console.log(`💾 User data: Stored in Clerk (https://dashboard.clerk.com)`);
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
