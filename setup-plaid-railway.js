#!/usr/bin/env node

/**
 * Railway Plaid Setup Script
 * Automatically sets Plaid environment variables on Railway
 * 
 * Usage: node setup-plaid-railway.js
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function runRailwayCommand(command) {
  try {
    const output = execSync(`npx @railway/cli ${command}`, { 
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚂 Railway Plaid Setup');
  console.log('======================\n');

  // Check Railway login
  console.log('Checking Railway login status...');
  const whoami = runRailwayCommand('whoami');
  if (!whoami.success) {
    console.log('⚠️  Not logged into Railway. Please log in...');
    console.log('Running: npx @railway/cli login');
    console.log('Please follow the prompts in your browser.\n');
    
    try {
      execSync('npx @railway/cli login', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Login failed. Please try manually: npx @railway/cli login');
      process.exit(1);
    }
  } else {
    console.log(`✅ Logged in as: ${whoami.output.trim()}\n`);
  }

  // Get Plaid credentials
  console.log('To set up Plaid, you need your API credentials from Plaid Dashboard.');
  console.log('Get them here: https://dashboard.plaid.com/developers/keys\n');
  
  const hasCredentials = await question('Do you already have your Plaid credentials? (y/n): ');
  
  if (hasCredentials.toLowerCase() !== 'y') {
    console.log('\n📋 To get your Plaid credentials:');
    console.log('1. Go to https://dashboard.plaid.com/');
    console.log('2. Sign in or create an account');
    console.log('3. Navigate to: Team Settings → Keys → API Keys');
    console.log('4. Copy your Client ID and Secret Key (Sandbox for testing)\n');
    console.log('Once you have them, run this script again.\n');
    process.exit(0);
  }

  console.log('\nEnter your Plaid credentials:\n');
  
  const clientId = await question('PLAID_CLIENT_ID: ');
  if (!clientId.trim()) {
    console.error('❌ Client ID is required');
    process.exit(1);
  }

  const secret = await question('PLAID_SECRET: ');
  if (!secret.trim()) {
    console.error('❌ Secret is required');
    process.exit(1);
  }

  const env = await question('PLAID_ENV (sandbox/development/production) [sandbox]: ') || 'sandbox';

  console.log('\n🚀 Setting environment variables on Railway...\n');

  // Set variables
  const vars = [
    { name: 'PLAID_CLIENT_ID', value: clientId.trim() },
    { name: 'PLAID_SECRET', value: secret.trim() },
    { name: 'PLAID_ENV', value: env.trim() }
  ];

  for (const { name, value } of vars) {
    console.log(`Setting ${name}...`);
    const result = runRailwayCommand(`variables set ${name}="${value}"`);
    
    if (result.success) {
      console.log(`✅ ${name} set successfully`);
    } else {
      console.error(`❌ Failed to set ${name}`);
      console.error(`   Error: ${result.error}`);
      process.exit(1);
    }
  }

  console.log('\n✅ All Plaid environment variables set successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Railway will automatically redeploy your service');
  console.log('2. Check your deployment logs for: "✅ Plaid initialized successfully"');
  console.log('3. Test the integration by connecting a bank account\n');

  rl.close();
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

