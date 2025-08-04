# FundBase 🚀

**FundBase** is a decentralized startup funding platform built on Base L2. Post wild startup ideas and get instant ETH backing from the community. Built with MiniKit and OnchainKit.

## 🎯 Features

- **Post Ideas** - Share your startup ideas onchain
- **Back Projects** - Support ideas with ETH using sponsored transactions
- **View Backers** - See who's backing each idea
- **Withdraw Funds** - Creators can withdraw raised funds
- **Trending Feed** - Ideas ranked by total ETH raised
- **Frame Notifications** - Get notified when ideas are posted/backed
- **Farcaster Integration** - Share and discover ideas on Farcaster

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Blockchain**: Base L2 (Ethereum L2)
- **Smart Contracts**: Solidity + Hardhat
- **Wallet Integration**: OnchainKit + Coinbase Wallet
- **Frame SDK**: Farcaster Frame SDK
- **Notifications**: Redis + Frame notifications
- **Deployment**: Vercel

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd basedfund
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
# FundBase Configuration
NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# OnchainKit Configuration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=FundBase

# App Configuration
NEXT_PUBLIC_URL=http://localhost:3001
NEXT_PUBLIC_APP_HERO_IMAGE=https://your-domain.com/hero.png
NEXT_PUBLIC_ICON_URL=https://your-domain.com/icon.png
NEXT_PUBLIC_SPLASH_IMAGE=https://your-domain.com/splash.png
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=#000000

# Redis Configuration (for notifications)
REDIS_URL=your_redis_url
REDIS_TOKEN=your_redis_token

# Farcaster Configuration
FARCASTER_HEADER=your_farcaster_header
FARCASTER_PAYLOAD=your_farcaster_payload
FARCASTER_SIGNATURE=your_farcaster_signature

# Deployment
PRIVATE_KEY=your_private_key
BASESCAN_API_KEY=your_basescan_api_key
NEYNAR_API_KEY=your_neynar_api_key
```

### 3. Deploy Smart Contract

#### Mainnet (Base) - Default
```bash
npm run deploy:contract
```

#### Testnet (Base Sepolia)
```bash
npm run deploy:contract:testnet
```

### 4. Update Contract Address

After deployment, update `NEXT_PUBLIC_FUNDBASE_CONTRACT_ADDRESS` in your `.env.local` with the deployed contract address.

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3001` to see FundBase in action!

## 📱 How to Use

### For Users

1. **Connect Wallet** - Use Coinbase Wallet or any Web3 wallet
2. **Post Ideas** - Share your startup idea with title and description
3. **Back Projects** - Support ideas you like with ETH
4. **View Trending** - See the most backed ideas
5. **Withdraw Funds** - Creators can withdraw raised funds

### For Developers

1. **Deploy Contract** - Deploy to Base testnet/mainnet
2. **Configure Environment** - Set up all required environment variables
3. **Deploy Frontend** - Deploy to Vercel or your preferred platform
4. **Configure Farcaster** - Set up frame metadata and webhooks

## 🔧 Smart Contract

The FundBase smart contract (`contracts/FundBase.sol`) provides:

- **postIdea()** - Post new startup ideas
- **backIdea()** - Back ideas with ETH
- **withdrawFunds()** - Withdraw raised funds (creator only)
- **getIdea()** - Get idea details
- **getBackers()** - Get backers for an idea
- **getAllIdeas()** - Get all ideas
- **hasUserBacked()** - Check if user has backed an idea

## 🎨 UI Components

- **PostIdea** - Form to post new ideas with transaction integration
- **BackIdea** - Interface to back ideas with ETH
- **WithdrawFunds** - Allow creators to withdraw funds
- **BackersModal** - Modal showing all backers for an idea
- **Trending Feed** - Ideas ranked by total ETH raised

## 🔗 Farcaster Integration

FundBase includes full Farcaster frame integration:

- **Frame Route** - `/frame` handles frame interactions
- **OG Images** - Dynamic OG images for sharing
- **Notifications** - Frame notifications for engagement
- **Account Association** - Proper Farcaster account setup

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Smart Contract (Base)

1. Get Base RPC URL from [Base docs](https://docs.base.org/)
2. Get BaseScan API key from [BaseScan](https://basescan.org/)
3. Run deployment script with your private key

### Farcaster Frame

1. Configure frame metadata in `.well-known/farcaster.json`
2. Set up webhook endpoints for frame interactions
3. Test frame functionality on Farcaster

## 🔐 Security

- **Reentrancy Protection** - Smart contract uses reentrancy guards
- **Input Validation** - All inputs are validated
- **Access Control** - Only creators can withdraw funds
- **Rate Limiting** - Notifications are rate limited
- **Frame Verification** - Farcaster frame messages are verified

## 📊 Analytics

Track your FundBase usage:

- **Ideas Posted** - Total ideas created
- **Total Backed** - Total ETH raised across all ideas
- **Active Backers** - Unique users backing ideas
- **Trending Ideas** - Most popular ideas by ETH raised

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check the code comments and this README
- **Issues**: Open an issue on GitHub
- **Discord**: Join our community Discord
- **Twitter**: Follow us for updates

## 🙏 Acknowledgments

- **Base Team** - For the amazing L2 infrastructure
- **OnchainKit** - For the incredible developer tools
- **Farcaster** - For the decentralized social protocol
- **Coinbase** - For the wallet integration

---

**FundBase** - Where wild ideas meet instant ETH backing! 🚀💡