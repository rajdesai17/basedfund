#!/usr/bin/env node

/**
 * Setup script for Coinbase Developer Platform configuration
 * This script helps you configure your OnchainKit API key
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 FundBase Coinbase Configuration Setup');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Please create one first.');
  process.exit(1);
}

// Read current .env file
let envContent = fs.readFileSync(envPath, 'utf8');

// Check current API key
const apiKeyMatch = envContent.match(/NEXT_PUBLIC_ONCHAINKIT_API_KEY=(.+)/);
const currentApiKey = apiKeyMatch ? apiKeyMatch[1] : '';

// Check other important variables
const projectNameMatch = envContent.match(/NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=(.+)/);
const contractAddressMatch = envContent.match(/NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS=(.+)/);
const urlMatch = envContent.match(/NEXT_PUBLIC_URL=(.+)/);

const projectName = projectNameMatch ? projectNameMatch[1] : 'Not set';
const contractAddress = contractAddressMatch ? contractAddressMatch[1] : 'Not set';
const baseUrl = urlMatch ? urlMatch[1] : 'Not set';

if (currentApiKey && currentApiKey !== 'your_actual_coinbase_api_key_here' && currentApiKey.length > 10) {
  console.log('✅ API key is configured');
  console.log(`Current key: ${currentApiKey.substring(0, 8)}...`);
  
  // Check if it looks like a valid UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(currentApiKey)) {
    console.log('✅ API key format looks valid (UUID format)');
  } else {
    console.log('⚠️  API key format may be invalid (should be UUID format)');
  }
} else {
  console.log('❌ API key needs to be configured');
  console.log('\n📋 To get your API key:');
  console.log('1. Go to https://developer.coinbase.com/');
  console.log('2. Create a new project or use an existing one');
  console.log('3. Get your API key from the project settings');
  console.log('4. Update your .env file with the key');
}

console.log('\n🔧 Current Configuration:');
console.log(`Project Name: ${projectName}`);
console.log(`Contract Address: ${contractAddress}`);
console.log(`Base URL: ${baseUrl}`);

// Check for common issues
console.log('\n🔍 Configuration Analysis:');
if (projectName === 'Not set') {
  console.log('❌ NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME is missing');
} else {
  console.log('✅ Project name is configured');
}

if (contractAddress === 'Not set' || contractAddress === '0x0000000000000000000000000000000000000000') {
  console.log('❌ Contract address is not configured');
} else {
  console.log('✅ Contract address is configured');
}

if (baseUrl === 'Not set') {
  console.log('❌ Base URL is not configured');
} else {
  console.log('✅ Base URL is configured');
}

console.log('\n💡 About the errors you\'re seeing:');
console.log('The 401/400 errors are related to Coinbase\'s internal services:');
console.log('- Analytics/metrics endpoints (401) - Non-critical');
console.log('- Chain proxy endpoints (400) - May affect wallet functionality');
console.log('- Developer API endpoints (401) - May affect some features');

console.log('\n📝 Recommended Actions:');
console.log('1. Verify your API key has proper permissions');
console.log('2. Ensure your Coinbase project is configured for Base network');
console.log('3. Check that your domain is whitelisted in the project settings');
console.log('4. Try switching to testnet temporarily if issues persist');

console.log('\n🔗 Useful Links:');
console.log('- Coinbase Developer Platform: https://developer.coinbase.com/');
console.log('- OnchainKit Documentation: https://docs.onchainkit.com/');
console.log('- Base Network: https://base.org/');
console.log('- Troubleshooting Guide: TROUBLESHOOTING.md'); 