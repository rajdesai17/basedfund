# Troubleshooting Guide

## Coinbase API Errors

If you're seeing errors like:
- `POST https://cca-lite.coinbase.com/metrics net::ERR_ABORTED 401 (Unauthorized)`
- `POST https://chain-proxy.wallet.coinbase.com/ 400 (Bad Request)`
- `POST https://api.developer.coinbase.com/rpc/v1/base/ 401 (Unauthorized)`

These are **not critical errors** and your app should still function. However, here's how to resolve them:

### Quick Fix

1. **Get a proper API key**:
   ```bash
   npm run setup
   ```

2. **Update your .env file** with a valid Coinbase Developer Platform API key:
   ```env
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_actual_api_key_here
   ```

3. **Restart your development server**:
   ```bash
   npm run dev
   ```

### Detailed Steps

#### 1. Get Coinbase Developer Platform API Key

1. Go to [Coinbase Developer Platform](https://developer.coinbase.com/)
2. Sign in or create an account
3. Create a new project or use an existing one
4. Navigate to your project settings
5. Copy your API key

#### 2. Configure Your Project

1. Ensure your project is configured for Base network
2. Add your domain to the allowed origins
3. Set up proper permissions for the API key

#### 3. Update Environment Variables

Replace the placeholder in your `.env` file:
```env
# Before
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_actual_coinbase_api_key_here

# After
NEXT_PUBLIC_ONCHAINKIT_API_KEY=2KFWyKyr1tA0qFvKQp5xLx2m14z0IyOJ
```

### Error Types Explained

#### 401 Unauthorized Errors
- **Cause**: Invalid or missing API key
- **Solution**: Get a valid API key from Coinbase Developer Platform

#### 400 Bad Request Errors
- **Cause**: Malformed requests to chain proxy
- **Solution**: Ensure proper network configuration and API key setup

#### Analytics/Metrics Errors
- **Cause**: API key doesn't have analytics permissions
- **Impact**: Non-critical, app functionality unaffected
- **Solution**: Upgrade API key permissions or ignore these errors

### Testing Your Configuration

Run the setup script to verify your configuration:
```bash
npm run setup
```

### Still Having Issues?

1. **Check the console** for more detailed error messages
2. **Verify your API key** is correctly formatted
3. **Ensure your project** is configured for Base network
4. **Check network connectivity** to Coinbase services
5. **Try switching to testnet** temporarily:
   ```typescript
   const selectedChain = baseSepolia; // in providers.tsx
   ```

### Useful Links

- [Coinbase Developer Platform](https://developer.coinbase.com/)
- [OnchainKit Documentation](https://docs.onchainkit.com/)
- [Base Network](https://base.org/)
- [Coinbase Wallet Documentation](https://docs.cloud.coinbase.com/wallet-sdk/docs/)

### Note

These errors are primarily related to Coinbase's internal analytics and telemetry services. Your app's core functionality (wallet connection, transactions, etc.) should work even with these errors present. 