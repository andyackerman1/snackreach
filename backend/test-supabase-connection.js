// Test Supabase Connection
// Run this: node test-supabase-connection.js

const { supabase, testConnection } = require('./supabase');

async function testConnectionAndTable() {
    console.log('🔌 Testing Supabase connection...\n');

    try {
        // Test connection
        const connected = await testConnection();
        
        if (!connected) {
            console.error('❌ Connection failed!');
            process.exit(1);
        }

        // Test if users table exists and is accessible
        console.log('📊 Checking users table...');
        const { data: users, error } = await supabase
            .from('users')
            .select('id, email, name')
            .limit(5);

        if (error) {
            if (error.code === 'PGRST116') {
                console.error('❌ Users table does not exist!');
                console.error('   Please create the users table in Supabase first.');
                console.error('   See: HOW-TO-CREATE-TABLE.md');
                process.exit(1);
            } else {
                console.error('❌ Error accessing users table:', error.message);
                process.exit(1);
            }
        } else {
            console.log('✅ Users table exists and is accessible!');
            console.log(`📊 Current users in database: ${users ? users.length : 0}`);
            
            if (users && users.length > 0) {
                console.log('\n📋 Sample users:');
                users.forEach(user => {
                    console.log(`   - ${user.email} (${user.name})`);
                });
            } else {
                console.log('\n💡 No users yet. Create one with:');
                console.log('   curl -X POST http://localhost:3000/api/register \\');
                console.log('     -H "Content-Type: application/json" \\');
                console.log('     -d \'{"name":"Test","email":"test@example.com","password":"test123","companyName":"Test Co","userType":"startup"}\'');
            }
        }

        console.log('\n✅ Supabase connection is working perfectly!');
        console.log('✅ Your project is connected to Supabase!');
        console.log('\n🚀 Next steps:');
        console.log('   1. Start your server: node server.js');
        console.log('   2. Create accounts via /api/register endpoint');
        console.log('   3. View accounts in Supabase Dashboard');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('   Stack:', error.stack);
        process.exit(1);
    }
}

// Run the test
testConnectionAndTable();



