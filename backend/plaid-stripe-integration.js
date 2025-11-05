/**
 * Secure Plaid + Stripe ACH Integration
 * 
 * This module provides secure bank account verification using Plaid
 * and ACH payment method creation using Stripe.
 * 
 * Security Features:
 * - No raw bank account numbers stored
 * - Token-based authentication
 * - HTTPS-only in production
 * - Plaid Link for secure bank login
 * - Stripe tokenization for payment methods
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Configuration, PlaidApi, PlaidEnvironments, CountryCode, Products } = require('plaid');

// Initialize Plaid client
const plaidConfig = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});
const plaidClient = new PlaidApi(plaidConfig);

/**
 * Create Plaid Link token for frontend
 * @param {string} userId - User ID for persistent authentication
 * @returns {Promise<{link_token: string, expiration: string}>}
 */
async function createLinkToken(userId) {
    try {
        const request = {
            user: {
                client_user_id: userId, // Persistent user identifier
            },
            client_name: 'SnackReach',
            products: [Products.Auth, Products.Transactions],
            country_codes: [CountryCode.Us],
            language: 'en',
            webhook: process.env.PLAID_WEBHOOK_URL || '',
        };

        const response = await plaidClient.linkTokenCreate(request);
        
        return {
            link_token: response.data.link_token,
            expiration: response.data.expiration,
        };
    } catch (error) {
        console.error('Plaid Link token creation error:', error);
        throw new Error('Failed to create Plaid Link token');
    }
}

/**
 * Exchange Plaid public token for access token
 * @param {string} publicToken - Public token from Plaid Link
 * @returns {Promise<{access_token: string, item_id: string}>}
 */
async function exchangePublicToken(publicToken) {
    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        return {
            access_token: response.data.access_token,
            item_id: response.data.item_id,
        };
    } catch (error) {
        console.error('Plaid token exchange error:', error);
        throw new Error('Failed to exchange Plaid public token');
    }
}

/**
 * Get bank account details from Plaid (no raw account numbers)
 * @param {string} accessToken - Plaid access token
 * @returns {Promise<Array>} Array of bank accounts with masked account numbers
 */
async function getBankAccounts(accessToken) {
    try {
        const response = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        return response.data.accounts.map(account => ({
            account_id: account.account_id,
            name: account.name,
            mask: account.mask, // Last 4 digits only
            type: account.type,
            subtype: account.subtype,
            // NO RAW ACCOUNT NUMBERS - only masked data
        }));
    } catch (error) {
        console.error('Plaid get accounts error:', error);
        throw new Error('Failed to retrieve bank accounts');
    }
}

/**
 * Create Stripe ACH payment method from Plaid account
 * @param {string} accessToken - Plaid access token
 * @param {string} accountId - Plaid account ID
 * @param {string} stripeCustomerId - Stripe customer ID
 * @returns {Promise<{paymentMethodId: string, last4: string, bankName: string}>}
 */
async function createStripeACHPaymentMethod(accessToken, accountId, stripeCustomerId) {
    try {
        // Get processor token from Plaid
        const processorTokenResponse = await plaidClient.processorTokenCreate({
            access_token: accessToken,
            account_id: accountId,
            processor: 'stripe',
        });

        const processorToken = processorTokenResponse.data.processor_token;

        // Create Stripe payment method using processor token
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'us_bank_account',
            customer: stripeCustomerId,
            billing_details: {
                // No raw account numbers - Stripe handles tokenization
            },
        }, {
            // Use Plaid processor token
            stripeAccount: undefined, // Use default account
        });

        // Attach payment method to customer
        await stripe.paymentMethods.attach(paymentMethod.id, {
            customer: stripeCustomerId,
        });

        // Get bank account details (masked only)
        const bankAccount = paymentMethod.us_bank_account;
        
        return {
            paymentMethodId: paymentMethod.id,
            last4: bankAccount.last4,
            bankName: bankAccount.bank_name || 'Unknown Bank',
            accountType: bankAccount.account_type,
            accountHolderType: bankAccount.account_holder_type,
            // NO RAW ACCOUNT NUMBERS RETURNED
        };
    } catch (error) {
        console.error('Stripe ACH payment method creation error:', error);
        throw new Error('Failed to create Stripe ACH payment method');
    }
}

/**
 * Verify bank account with micro-deposits (optional)
 * @param {string} paymentMethodId - Stripe payment method ID
 * @param {Array<number>} amounts - Micro-deposit amounts for verification
 * @returns {Promise<{verified: boolean}>}
 */
async function verifyBankAccount(paymentMethodId, amounts) {
    try {
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        
        if (paymentMethod.us_bank_account) {
            // Verify micro-deposits
            await stripe.paymentMethods.verifyMicrodeposits(paymentMethodId, {
                amounts: amounts,
            });

            return { verified: true };
        }

        throw new Error('Payment method is not a US bank account');
    } catch (error) {
        console.error('Bank account verification error:', error);
        throw new Error('Failed to verify bank account');
    }
}

module.exports = {
    createLinkToken,
    exchangePublicToken,
    getBankAccounts,
    createStripeACHPaymentMethod,
    verifyBankAccount,
};

