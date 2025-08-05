#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying FundBase to Vercel for Farcaster integration...\n');

// Check if vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Vercel CLI is not installed. Please install it first:');
  console.error('npm install -g vercel');
  process.exit(1);
}

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.error('❌ .env file not found. Please create one with the required environment variables.');
  process.exit(1);
}

// Read .env file to extract variables
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#][^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    envVars[key.trim()] = value.trim();
  }
});

// Required environment variables for Farcaster
const requiredVars = [
  'NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME',
  'NEXT_PUBLIC_URL',
  'NEXT_PUBLIC_ONCHAINKIT_API_KEY',
  'FARCASTER_HEADER',
  'FARCASTER_PAYLOAD',
  'FARCASTER_SIGNATURE'
];

console.log('📋 Checking required environment variables...');
let missingVars = [];

requiredVars.forEach(varName => {
  if (!envVars[varName] || envVars[varName] === '') {
    missingVars.push(varName);
  } else {
    console.log(`✅ ${varName}`);
  }
});

if (missingVars.length > 0) {
  console.error('\n❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nPlease update your .env file with these variables.');
  process.exit(1);
}

console.log('\n✅ All required environment variables are set!');

// Deploy to Vercel
console.log('\n🚀 Deploying to Vercel...');
try {
  // Set environment variables for deployment
  const envArgs = Object.entries(envVars)
    .filter(([key, value]) => value && value !== '')
    .map(([key, value]) => `-e ${key}="${value}"`)
    .join(' ');

  const deployCommand = `vercel --prod ${envArgs}`;
  console.log(`Running: ${deployCommand}`);
  
  execSync(deployCommand, { stdio: 'inherit' });
  
  console.log('\n✅ Deployment successful!');
  console.log('\n📋 Next steps:');
  console.log('1. Your app should be available at: https://basedfund.vercel.app');
  console.log('2. Test the Farcaster manifest: https://basedfund.vercel.app/.well-known/farcaster.json');
  console.log('3. The redirect should now point to the Farcaster hosted manifest');
  console.log('4. Your Mini App should be ready for Farcaster integration!');
  
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
} 