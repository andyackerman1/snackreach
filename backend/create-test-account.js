// Create a test account directly via Supabase
const { supabase } = require('./supabase');
const bcrypt = require('bcryptjs');

async function createTestAccount() {
    console.log('📝 Creating test account...\n');

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash('test123', 10);
        
        // Create user
        const userId = Date.now().toString();
        const newUser = {
            id: userId,
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword,
            company_name: 'Test Company',
            user_type: 'startup',
            created_at: new Date().toISOString()
        };

        console.log('💾 Saving to Supabase...');
        const { data, error } = await supabase
            .from('users')
            .insert([newUser])
            .select()
            .single();

        if (error) {
            console.error('❌ Error creating account:', error.message);
            console.error('   Code:', error.code);
            console.error('   Details:', error.details);
            return;
        }

        console.log('✅ Account created successfully!');
        console.log('\n📋 Account Details:');
        console.log(`   Email: ${data.email}`);
        console.log(`   Name: ${data.name}`);
        console.log(`   Company: ${data.company_name}`);
        console.log(`   Type: ${data.user_type}`);
        console.log(`   ID: ${data.id}`);
        console.log('\n🌐 Now go to Supabase Dashboard:');
        console.log('   https://supabase.com/dashboard/project/pplhyetnwyywucdxwkbu');
        console.log('   → Click "Table Editor" (left sidebar)');
        console.log('   → Click "users" table');
        console.log('   → You should see this account!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createTestAccount();



