// Check accounts in Supabase
const { supabase } = require('./supabase');

async function checkAccounts() {
    console.log('🔍 Checking accounts in Supabase...\n');

    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Error:', error.message);
            console.error('   Code:', error.code);
            console.error('   Details:', error.details);
            return;
        }

        console.log(`📊 Total accounts in Supabase: ${users ? users.length : 0}\n`);

        if (users && users.length > 0) {
            console.log('✅ Accounts found:\n');
            users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.email}`);
                console.log(`   Name: ${user.name}`);
                console.log(`   Company: ${user.company_name}`);
                console.log(`   Type: ${user.user_type}`);
                console.log(`   Created: ${user.created_at}`);
                console.log(`   ID: ${user.id}`);
                console.log('');
            });
        } else {
            console.log('📭 No accounts found in Supabase.');
            console.log('\n💡 To create an account:');
            console.log('   1. Make sure server is running: node server.js');
            console.log('   2. In another terminal, run:');
            console.log('   curl -X POST http://localhost:3000/api/register \\');
            console.log('     -H "Content-Type: application/json" \\');
            console.log('     -d \'{"name":"Test","email":"test@example.com","password":"test123","companyName":"Test Co","userType":"startup"}\'');
        }
    } catch (error) {
        console.error('❌ Error checking accounts:', error.message);
    }
}

checkAccounts();



