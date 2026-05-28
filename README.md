# Stacks Vault Pro

A professional-grade frontend application for the Stacks (STX) Vault platform, providing users with an intuitive interface to deposit STX tokens, manage staking positions, track rewards, and withdraw funds. Built with modern web technologies for optimal performance, security, and user experience.
## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Core Functionality](#-core-functionality)
- [Technical Architecture](#-technical-architecture)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Architecture & Components](#-architecture--components)
- [Smart Contract Integration](#-smart-contract-integration)
- [Custom Hooks](#-custom-hooks)
- [State Management](#-state-management)
- [Security](#-security-architecture)
- [Deployment & Operations](#-deployment--operations)
- [Troubleshooting](#-troubleshooting--support)
- [Contributing](#-contributing-guidelines)
- [Support](#-enterprise-support)
- [License](#-license)

## 🎯 Project Overview

**Stacks Vault Pro** is a sophisticated DeFi frontend designed for the Stacks blockchain ecosystem. It serves as the user interface layer for a decentralized vault that enables:

- **Capital Deposit**: Users deposit STX tokens into a professionally managed vault
- **Yield Generation**: Automated smart contracts generate yield through staking and delegation
- **Reward Distribution**: Real-time tracking and claiming of earned rewards
- **Liquidity Access**: Time-locked, controlled withdrawal of deposited capital
- **Administrative Oversight**: Role-based controls for vault operators and emergency management

The application prioritizes security, performance, and user experience while maintaining strict compliance with blockchain best practices and enterprise standards.

### Target Users

- **End Users**: Individuals seeking to earn yield on STX holdings
- **Vault Operators**: Professionals managing vault operations and configurations
- **Developers**: Engineers integrating vault functionality into other applications
- **Auditors**: Compliance personnel reviewing transaction history and audit trails
## � Core Functionality

- **Wallet Integration**: Seamless integration with Stacks wallet ecosystems for secure authentication and transaction signing
- **Deposit Management**: User-friendly deposit interface with real-time balance validation and transaction confirmation
- **Withdrawal Processing**: Streamlined withdrawal workflow with fee calculations, cooldown period management, and batch operation support
- **Reward Dashboard**: Comprehensive reward tracking with visual analytics and historical performance metrics
- **Administrative Controls**: Role-based admin panel for vault configuration, monitoring, and emergency procedures
- **Transaction History**: Complete audit trail of user deposits, withdrawals, and reward claims
- **Real-time Metrics**: Live vault statistics including Total Value Locked (TVL), Annual Percentage Yield (APY), and user participation
- **Responsive Design**: Optimized user interface supporting desktop, tablet, and mobile devices
- **Cross-browser Compatibility**: Full functionality across modern browsers (Chrome, Firefox, Safari, Edge)

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: React 18+ with TypeScript for type-safe component development
- **Build System**: Vite for optimized development experience and production builds
- **Styling**: Tailwind CSS with component-based architecture for maintainability
- **Routing**: TanStack Router for client-side navigation and state management
- **State Management**: Zustand for minimal but powerful application state handling
- **UI Components**: Shadcn/ui for accessible, customizable component library
- **Data Visualization**: Recharts for interactive dashboard analytics
- **Package Management**: pnpm for reliable, efficient dependency management

### Blockchain Integration
- **Stacks.js SDK**: Direct integration with Stacks blockchain for transaction processing
- **Smart Contract Interface**: Type-safe contract interaction layer for vault operations
- **Wallet Support**: Compatible with major Stacks wallets (Stacks Wallet, Hiro Wallet)

## 📋 Prerequisites

- Node.js 16+ or higher
- pnpm 8+ or higher
- A Stacks-compatible wallet browser extension (e.g., Stacks Wallet, Hiro Wallet)
- Git

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Deadman-Motive/stacks-vault-pro.git
   cd stacks-vault-pro
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm run dev
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
pnpm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
pnpm run preview
```

## � Available Scripts

Complete reference for all npm/pnpm commands:

| Command | Purpose |
|---------|---------|
| `pnpm run dev` | Start development server with Hot Module Replacement (HMR) on port 5173 |
| `pnpm run build` | Create optimized production build with code splitting and minification |
| `pnpm run preview` | Local preview of production build for testing before deployment |
| `pnpm run lint` | Run ESLint for code quality analysis and style checking |
| `pnpm run type-check` | Execute TypeScript compiler to verify type safety across codebase |
| `pnpm run format` | Format code with Prettier for consistent styling |
| `pnpm run analyze` | Generate bundle analysis report for optimization opportunities |
| `pnpm run test` | Run unit and integration test suite |
| `pnpm run test:watch` | Run tests in watch mode for development |

## �📁 Project Structure

```
src/
├── components/          # React components
│   ├── Admin.tsx       # Admin dashboard interface
│   ├── AdminDialogs.tsx # Admin dialog modals
│   ├── AppShell.tsx    # Main app layout wrapper
│   ├── ConnectButton.tsx # Wallet connection button
│   ├── Dashboard.tsx   # Main dashboard view
│   ├── DepositModal.tsx # Deposit transaction modal
│   ├── Landing.tsx     # Landing/home page
│   ├── RewardsChart.tsx # Rewards visualization
│   ├── StatCard.tsx    # Statistic card component
│   ├── WithdrawModal.tsx # Withdrawal transaction modal
│   └── ui/            # Shadcn UI component library
├── contracts/          # Smart contract interactions
│   └── stx-staking.ts # STX staking contract interface
├── hooks/             # Custom React hooks
│   ├── use-mobile.tsx          # Mobile detection hook
│   ├── useStakingData.ts       # Staking data fetching
│   ├── useTransaction.ts       # Transaction handling
│   └── useWalletHydrate.ts    # Wallet state initialization
├── lib/               # Utility libraries
│   ├── utils.ts       # General utility functions
│   └── wallet.ts      # Wallet utilities
├── routes/            # Page routes
│   ├── __root.tsx    # Root layout route
│   ├── admin.tsx     # Admin page route
│   ├── dashboard.tsx # Dashboard route
│   └── index.tsx     # Home page route
├── store/             # State management
│   └── wallet.ts     # Zustand wallet store
├── main.tsx          # Application entry point
├── router.tsx        # Router configuration
├── routeTree.gen.ts  # Auto-generated route tree
└── styles.css        # Global styles
```

## 🔧 Available Scripts

- `pnpm run dev` - Start development server with HMR
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build locally
- `pnpm run lint` - Run ESLint to check code quality
- `pnpm run type-check` - Run TypeScript compiler check
- `pnpm run format` - Format code with Prettier

## � Architecture & Components

### Dashboard Module (`Dashboard.tsx`)
The primary user interface providing:
- Real-time vault metrics (TVL, APY, participation metrics)
- User account overview and balance information
- Transaction history with filtering and sorting
- Quick-access deposit and withdrawal controls
- Performance indicators and earning summaries

### Deposit Module (`DepositModal.tsx`)
Manages capital inflow with features including:
- Input validation against user balance and minimum deposit requirements
- Automated gas fee estimation and display
- Transaction preview with detailed breakdown
- Integration with wallet signing mechanisms
- Error handling and user feedback systems

### Withdrawal Module (`WithdrawModal.tsx`)
Processes capital retrieval with:
- Available balance verification and constraints
- Cooldown period notifications and remaining time tracking
- Early withdrawal fee calculation and display
- Transaction confirmation and status tracking
- Multi-step confirmation workflow for security

### Administrative Module (`Admin.tsx`, `AdminDialogs.tsx`)
Provides operational controls for vault management:
- Configuration management for vault parameters
- User activity monitoring and analytics
- Emergency withdrawal and pause mechanisms
- Transaction auditing and compliance reporting
- System health and status monitoring

### Analytics Module (`RewardsChart.tsx`)
Delivers data visualization through:
- Historical reward distribution charts
- User earnings trends and comparisons
- Time-series analysis with customizable intervals
- Export capabilities for reporting

## 🔗 Smart Contract Integration

The application interfaces with Stacks-based smart contracts through the abstraction layer in `contracts/stx-staking.ts`. Core contract functions include:

- **Deposit Operations**: Secure STX token transfers into vault with receipt generation
- **Withdrawal Management**: Time-locked withdrawals with cooldown enforcement and fee calculation
- **Reward Accrual**: Automated reward distribution tracking and claim processing
- **Vault Metrics**: Real-time queries for TVL, APY, and user participation data
- **State Queries**: Balance verification, cooldown status, and pending transaction checks

All contract interactions maintain strict type safety through TypeScript interfaces and require wallet authorization for state-modifying operations.

## 🪝 Custom Hooks

### `useStakingData()`
Manages staking-related data fetching and caching:
- Real-time user balance and holdings
- Accumulated and claimable rewards calculation
- Vault-wide metrics (TVL, APY, participation count)
- Automatic polling with configurable intervals
- Error boundaries and fallback data handling

### `useTransaction()`
Orchestrates the complete transaction lifecycle:
- Wallet connection and authentication verification
- Transaction construction and parameter validation
- Broadcasting to Stacks network
- Status polling and confirmation tracking
- Error recovery and retry mechanisms

### `useWalletHydrate()`
Initializes application state on startup:
- Wallet connection detection and restoration
- User session recovery from local storage
- Network configuration validation
- Permission and capability verification

### `use-mobile()`
Provides responsive design utilities:
- Viewport size detection with media query support
- Conditional rendering based on device type
- Touch interaction handling optimization

## 🌐 Wallet Integration

The application uses Stacks.js for blockchain interaction:

```typescript
import { authenticate, getUserData } from '@stacks/auth';

// Connect wallet
const userData = await authenticate();

// Perform transactions
import { broadcastTransaction } from '@stacks/transactions';
```

## 📊 State Management

The application uses Zustand for lightweight, scalable state management. The wallet store (`store/wallet.ts`) maintains:

- **Authentication State**: Connected wallet address, login status, and session tokens
- **Account Data**: User balance, transaction history, and reward information
- **Vault State**: Current TVL, APY, user participation metrics
- **UI State**: Modal visibility, loading states, error messages
- **Configuration**: Network settings, contract addresses, gas preferences

Access state globally with type safety:
```typescript
import { useWalletStore } from '@/store/wallet';

const { address, isConnected, balance, rewards } = useWalletStore();
```

State updates trigger automatic re-renders only in consuming components, optimizing performance.
## 📊 Version & Compatibility

### Supported Versions

| Component | Minimum Version | Recommended Version |
|-----------|-----------------|-------------------|
| Node.js | 16.x | 18.x or 20.x |
| pnpm | 8.x | 9.x or latest |
| React | 18.x | 18.3.x+ |
| TypeScript | 4.9 | 5.x+ |
| Stacks.js | 5.x | 6.x+ |

### Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Mobile Safari (iOS) | 14+ | ✅ Full Support |
| Chrome Mobile | 90+ | ✅ Full Support |

### Network Support

- **Mainnet**: Production deployment (primary network)
- **Testnet**: Testing and staging deployments
- **Devnet**: Local development environment
## 🎨 Styling

The project uses Tailwind CSS with custom UI components from Shadcn/ui:
- Modular component styles
- Dark mode support
- Responsive breakpoints
- Custom theme configuration

## 📱 Mobile Support

Fully responsive design with:
- Mobile-optimized layouts
- Touch-friendly interactions
- Optimized performance for slower networks
- Adaptive font sizes and spacing

## � Security Architecture

The application implements multiple security layers:

- **Private Key Management**: No private key storage in browser; all signing delegated to wallet extensions
- **Input Validation**: Comprehensive client-side validation with server-side verification for sensitive operations
- **Transaction Authorization**: Mandatory wallet confirmation for all state-modifying operations
- **XSS Protection**: React's built-in HTML escaping and Content Security Policy headers
- **CSRF Prevention**: Token-based request verification and SameSite cookie attributes
- **Data Encryption**: HTTPS-only communication with certificate pinning for API endpoints
- **Session Management**: Secure token refresh and automatic session expiration
- **Access Control**: Role-based permission system for administrative functions
- **Audit Logging**: Complete transaction and action logging for compliance reporting
- **Smart Contract Audits**: All contract interactions verified against audited contract ABIs

## 🤝 Contributing Guidelines

### Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/stacks-vault-pro.git
   cd stacks-vault-pro
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/DESCRIPTION
   # or for bug fixes:
   git checkout -b fix/DESCRIPTION
   ```

3. **Development**
   - Follow existing code style and conventions
   - Maintain TypeScript strict mode compliance
   - Write self-documenting code with clear comments
   - Test changes locally before pushing

4. **Commit & Push**
   ```bash
   git commit -m "type(scope): description"
   # Types: feat, fix, chore, refactor, test, docs, style
   # Example: "feat(dashboard): add performance metrics widget"
   git push origin feature/DESCRIPTION
   ```

5. **Create Pull Request**
   - Provide clear description of changes
   - Reference related issues (#123)
   - Include screenshots for UI changes
   - Ensure CI/CD checks pass

### Code Quality Standards

- **TypeScript**: Strict mode enforced, no `any` types
- **Linting**: ESLint configuration with Airbnb ruleset
- **Formatting**: Prettier for consistent code style
- **Testing**: Minimum 80% coverage for new features
- **Performance**: Component memoization where appropriate
- **Accessibility**: WCAG 2.1 AA compliance required

### Pre-commit Checklist

- [ ] Code passes TypeScript compiler
- [ ] ESLint reports no errors
- [ ] Code is formatted with Prettier
- [ ] Tests pass locally
- [ ] No console warnings or errors
- [ ] Component props are documented
- [ ] Breaking changes are documented

### Development Commands

```bash
pnpm run dev          # Start dev server with HMR
pnpm run build        # Production build
pnpm run preview      # Preview production build
pnpm run lint         # Run ESLint
pnpm run type-check   # TypeScript validation
pnpm run format       # Format with Prettier
pnpm run test         # Run test suite
```

### Documentation Updates

- Update README.md for user-facing changes
- Add JSDoc comments to exported functions
- Document new environment variables
- Update CHANGELOG.md with notable changes

### Pull Request Review Process

- Code review by at least one maintainer
- Automated CI/CD checks must pass
- Performance implications assessed
- Security review for sensitive changes
- User documentation reviewed

## 📝 Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_API_URL=https://api.mainnet.stacks.co
VITE_NETWORK=mainnet
VITE_APP_NAME=Stacks Vault Pro
```

## 🚀 Deployment & Operations

### Production Build
```bash
pnpm run build
```

Generates optimized bundle with:
- Code splitting and lazy loading
- Asset minification and compression
- Source map generation for error tracking
- Performance profiling data

### Vercel Deployment (Recommended)
The project includes pre-configured `vercel.json` for seamless deployment:

```bash
vercel --prod
```

Automated features:
- CI/CD pipeline integration
- Automatic preview deployments for PRs
- Edge caching and CDN distribution
- Environment variable management

### Alternative Hosting Platforms

**Netlify**
```bash
netlify deploy --prod --dir=dist
```

**AWS S3 + CloudFront**
```bash
aws s3 sync dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

**Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
```

### Environment Configuration

Create `.env.local` with appropriate values for your deployment:

```env
# Network Configuration
VITE_API_URL=https://api.mainnet.stacks.co
VITE_NETWORK=mainnet
VITE_CHAIN_ID=1

# Application Settings
VITE_APP_NAME=Stacks Vault Pro
VITE_APP_VERSION=1.0.0

# Contract Addresses
VITE_VAULT_CONTRACT=SP...
VITE_STX_CONTRACT=SP...

# Analytics
VITE_ANALYTICS_KEY=your-key-here
```

### Performance Optimization

- Lazy loading of route components
- Image optimization with WebP support
- Bundle analysis: `pnpm run analyze`
- Lighthouse CI integration
- Performance monitoring via Sentry

## � Troubleshooting & Support

### Wallet Connection Issues

**Problem**: Wallet extension not recognized
- Verify wallet extension is installed and updated to latest version
- Check browser console for connection errors
- Clear browser cache and restart browser
- Ensure wallet is unlocked and on correct network

**Problem**: Network mismatch errors
- Confirm wallet is set to the same network as application (`mainnet` vs `testnet`)
- Check network configuration in `.env.local`
- Verify contract addresses match deployed network

### Transaction Processing

**Problem**: Transaction rejection
- Verify sufficient STX balance for transaction + gas fees
- Check cooldown period restrictions on withdrawals
- Ensure network connectivity and API availability
- Verify wallet has required permissions/capabilities

**Problem**: Slow transaction confirmation
- Check current network congestion levels
- Increase gas price if supported by network
- Monitor transaction status in block explorer
- Contact support if transaction stalls beyond timeout

### Build & Development Issues

**Problem**: Build failures
```bash
# Clear and reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear build cache
rm -rf dist .vite
pnpm run build
```

**Problem**: Type errors
```bash
# Regenerate type definitions
pnpm run type-check

# Update TypeScript
pnpm add -D typescript@latest
```

**Problem**: Module resolution errors
- Verify all imports use correct relative paths
- Check that path aliases in `tsconfig.json` match usage
- Ensure all dependencies are listed in `package.json`

### Performance Optimization

- Monitor Core Web Vitals via Lighthouse
- Use React DevTools Profiler for component performance
- Enable production profiling: `pnpm run analyze`
- Review bundle size reports in build output

### Getting Help

- Check existing [GitHub Issues](https://github.com/Deadman-Motive/stacks-vault-pro/issues)
- Review [Stacks Documentation](https://docs.stacks.co/)
- Contact development team for enterprise support
- Check system status page for known issues

## 📚 Reference Documentation

- [Stacks Developer Documentation](https://docs.stacks.co/)
- [Stacks.js API Reference](https://docs.stacks.co/build-apps/intro)
- [Clarity Smart Contract Language](https://docs.stacks.co/write-smart-contracts/clarity)
- [React 18 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [TanStack Router](https://tanstack.com/router/latest)

## 📋 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for complete terms and conditions.

## 👥 Maintainers

- **Deadman-Motive** - [@Deadman-Motive](https://github.com/Deadman-Motive)

## 🙏 Acknowledgments

- Stacks Foundation for blockchain infrastructure and documentation
- Shadcn/ui team for the exceptional component library
- The open-source React and TypeScript communities
- All contributors and bug reporters

## 📞 Enterprise Support

For enterprise deployments, custom features, or dedicated support:

- **Email**: support@stacksvaultpro.com
- **GitHub Issues**: [Report bugs or request features](https://github.com/Deadman-Motive/stacks-vault-pro/issues)
- **Documentation**: [Full docs available on GitHub Wiki](https://github.com/Deadman-Motive/stacks-vault-pro/wiki)

## 🔗 Links

- [GitHub Repository](https://github.com/Deadman-Motive/stacks-vault-pro)
- [Issue Tracker](https://github.com/Deadman-Motive/stacks-vault-pro/issues)
- [Discussions](https://github.com/Deadman-Motive/stacks-vault-pro/discussions)
- [Stacks Community](https://stacks.community/)

---

**Stacks Vault Pro** — Professional-grade vault management for the Stacks blockchain ecosystem.

Built with enterprise standards for security, performance, and reliability.
