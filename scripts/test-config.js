const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

console.log('🔧 Configuration Test');
console.log('===================');

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('NEXT_PUBLIC_ONCHAINKIT_API_KEY:', process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME:', process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || '❌ Missing');
console.log('NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS:', process.env.NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS || '❌ Missing');

console.log('\n💡 Next Steps:');
console.log('1. Restart your development server: npm run dev');
console.log('2. Clear browser cache and reload the page');
console.log('3. Check browser console for any new error messages');
console.log('4. Verify your Coinbase Developer Platform project settings'); 