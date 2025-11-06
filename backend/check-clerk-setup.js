// Simple script to check if Clerk is set up correctly
require('dotenv').config();

console.log('\n🔍 Checking Clerk Setup...\n');

// Check if CLERK_SECRET_KEY exists
const clerkKey = process.env.CLERK_SECRET_KEY;

if (!clerkKey) {
    console.log('❌ CLERK_SECRET_KEY not found in .env file');
    console.log('\n📝 To fix this:');
    console.log('   1. Create a .env file in the backend/ directory');
    console.log('   2. Add this line: CLERK_SECRET_KEY=sk_test_your_key_here');
    console.log('   3. Replace "sk_test_your_key_here" with your actual Clerk secret key');
    console.log('\n💡 Get your key from: https://dashboard.clerk.com → API Keys\n');
    process.exit(1);
}

if (clerkKey === 'sk_test_placeholder' || clerkKey.length < 10) {
    console.log('⚠️  CLERK_SECRET_KEY looks like a placeholder');
    console.log('   Make sure you replaced it with your actual key from Clerk dashboard\n');
    process.exit(1);
}

console.log('✅ CLERK_SECRET_KEY found in .env');
console.log(`   Key starts with: ${clerkKey.substring(0, 10)}...`);

// Try to initialize Clerk
try {
    const { Clerk } = require('@clerk/clerk-sdk-node');
    const client = new Clerk({ secretKey: clerkKey });
    
    // Simple test - just check if we can create a client
    console.log('✅ Clerk client initialized successfully');
    console.log('\n🎉 Setup looks good! Your server should work with Clerk.\n');
} catch (error) {
    console.log('❌ Error initializing Clerk:');
    console.log(`   ${error.message}`);
    console.log('\n💡 Make sure @clerk/clerk-sdk-node is installed:');
    console.log('   npm install @clerk/clerk-sdk-node\n');
    process.exit(1);
}


