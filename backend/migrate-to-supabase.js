// Migration script: Move data from JSON file to Supabase
// Run this once: node migrate-to-supabase.js

const fs = require('fs');
const path = require('path');
const { supabase } = require('./supabase');

const DB_PATH = path.join(__dirname, 'data', 'database.json');

async function migrateToSupabase() {
    try {
        console.log('🚀 Starting migration from JSON to Supabase...\n');

        // Read existing JSON database
        if (!fs.existsSync(DB_PATH)) {
            console.log('❌ Database file not found:', DB_PATH);
            console.log('   No data to migrate.');
            return;
        }

        const jsonData = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        console.log('✅ Loaded JSON database');

        // Migrate users
        if (jsonData.users && jsonData.users.length > 0) {
            console.log(`\n📦 Migrating ${jsonData.users.length} users...`);
            
            // Transform user data to match Supabase schema
            const usersToInsert = jsonData.users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password, // Already hashed
                company_name: user.companyName,
                phone: user.phone || null,
                user_type: user.userType,
                card_info: user.cardInfo || {},
                subscription: user.subscription || {
                    status: 'active',
                    plan: 'premium',
                    price: 2.00,
                    billingCycle: 'monthly'
                },
                payment_methods: user.paymentMethods || [],
                created_at: user.createdAt || new Date().toISOString(),
                last_login: user.lastLogin || null
            }));

            const { data, error } = await supabase
                .from('users')
                .upsert(usersToInsert, { onConflict: 'id' });

            if (error) {
                console.error('❌ Error migrating users:', error.message);
            } else {
                console.log(`✅ Successfully migrated ${jsonData.users.length} users`);
            }
        } else {
            console.log('ℹ️  No users to migrate');
        }

        // Migrate snack companies
        if (jsonData.snackCompanies && jsonData.snackCompanies.length > 0) {
            console.log(`\n📦 Migrating ${jsonData.snackCompanies.length} snack companies...`);
            const { data, error } = await supabase
                .from('snack_companies')
                .upsert(jsonData.snackCompanies, { onConflict: 'id' });
            
            if (error) {
                console.error('❌ Error migrating snack companies:', error.message);
            } else {
                console.log(`✅ Successfully migrated ${jsonData.snackCompanies.length} snack companies`);
            }
        }

        // Migrate offices
        if (jsonData.offices && jsonData.offices.length > 0) {
            console.log(`\n📦 Migrating ${jsonData.offices.length} offices...`);
            const { data, error } = await supabase
                .from('offices')
                .upsert(jsonData.offices, { onConflict: 'id' });
            
            if (error) {
                console.error('❌ Error migrating offices:', error.message);
            } else {
                console.log(`✅ Successfully migrated ${jsonData.offices.length} offices`);
            }
        }

        // Migrate products
        if (jsonData.products && jsonData.products.length > 0) {
            console.log(`\n📦 Migrating ${jsonData.products.length} products...`);
            const { data, error } = await supabase
                .from('products')
                .upsert(jsonData.products, { onConflict: 'id' });
            
            if (error) {
                console.error('❌ Error migrating products:', error.message);
            } else {
                console.log(`✅ Successfully migrated ${jsonData.products.length} products`);
            }
        }

        // Migrate orders
        if (jsonData.orders && jsonData.orders.length > 0) {
            console.log(`\n📦 Migrating ${jsonData.orders.length} orders...`);
            const { data, error } = await supabase
                .from('orders')
                .upsert(jsonData.orders, { onConflict: 'id' });
            
            if (error) {
                console.error('❌ Error migrating orders:', error.message);
            } else {
                console.log(`✅ Successfully migrated ${jsonData.orders.length} orders`);
            }
        }

        // Migrate messages
        if (jsonData.messages && jsonData.messages.length > 0) {
            console.log(`\n📦 Migrating ${jsonData.messages.length} messages...`);
            
            // Transform message data to match Supabase schema
            const messagesToInsert = jsonData.messages.map(msg => ({
                id: msg.id,
                from_user_id: msg.fromUserId,
                to_user_id: msg.toUserId,
                from_user_name: msg.fromUserName,
                from_user_email: msg.fromUserEmail,
                from_user_type: msg.fromUserType,
                to_user_name: msg.toUserName,
                to_user_email: msg.toUserEmail,
                to_user_type: msg.toUserType,
                subject: msg.subject,
                message: msg.message,
                read: msg.read || false,
                timestamp: msg.timestamp || new Date().toISOString()
            }));

            const { data, error } = await supabase
                .from('messages')
                .upsert(messagesToInsert, { onConflict: 'id' });
            
            if (error) {
                console.error('❌ Error migrating messages:', error.message);
            } else {
                console.log(`✅ Successfully migrated ${jsonData.messages.length} messages`);
            }
        }

        console.log('\n✅ Migration completed!');
        console.log('\n📊 Verify your data in Supabase Dashboard:');
        console.log('   https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu/editor');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateToSupabase();



