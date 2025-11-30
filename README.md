# PAKT Frontend SDK Sample Application

> A comprehensive example of building real-world Web3 applications using the PAKT SDK

This project demonstrates how to integrate the [`pakt-sdk`](https://www.npmjs.com/package/pakt-sdk) into a React application to build modern Web3 authentication, user management, collection management, wallet operations, and payment systems. It showcases real-world implementation patterns, proper TypeScript integration, and production-ready code structure.

## 🚀 What's Included

This sample application implements a complete Web3 platform with multiple integrated features:

### 🔐 Authentication Features
- **Email/Password Authentication** - Traditional login and registration with 2FA support
- **Google OAuth Integration** - Social login with proper state management
- **Email Verification** - User account verification with OTP
- **Password Reset** - Secure password reset with email verification
- **JWT Token Management** - Automatic token storage and validation
- **Two-Factor Authentication** - Enhanced security with 2FA login flow

### 📦 Collection Management
- **Collection Schemas** - Define and manage collection structures
- **Collections** - Create, read, update, and delete collections
- **Collection Stores** - Dynamic data storage based on schemas
- **Collection Types** - Query and manage different collection types
- **Batch Operations** - Create and update multiple collections at once

### 💰 Wallet & Payment Features
- **Multi-Currency Wallets** - Manage cryptocurrency wallets
- **Transaction History** - View and track all transactions
- **Transaction Statistics** - Analyze transaction data with various formats
- **Exchange Rates** - Real-time currency exchange information
- **Direct Deposits** - Create and validate crypto payments
- **Payment Methods** - Support for multiple blockchain coins
- **RPC Integration** - Active RPC server management

### 🏗️ Architecture Highlights
- **TypeScript Integration** - Full type safety with PAKT SDK types
- **React Router** - Protected routes and navigation
- **Context API** - Global authentication state management
- **Service Layer Pattern** - Clean separation of business logic
- **Error Handling** - Comprehensive error boundaries and user feedback
- **Responsive Design** - Mobile-friendly UI components

### 📱 User Experience
- **Multi-step Flows** - Guided user registration and password reset
- **Loading States** - Proper UI feedback during async operations
- **Form Validation** - Client-side validation with error messages
- **OAuth Callbacks** - Seamless Google authentication flow
- **Real-time Updates** - Dynamic data fetching and display
- **Interactive Dashboards** - Comprehensive user and wallet information

## 🛠️ Built With

- **React 18** with TypeScript
- **[PAKT SDK](https://www.npmjs.com/package/pakt-sdk)** - Web3 authentication and user management
- **React Router** - Client-side routing
- **Modern CSS** - Clean, responsive styling

## 🎯 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A PAKT SDK API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pakt-frontend-sdk-sample
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your PAKT SDK API key in `.env`:
```
REACT_APP_PAKT_SDK_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with:

```env
REACT_APP_PAKT_SDK_API_KEY=your_pakt_sdk_api_key
```

### PAKT SDK Setup

The application automatically initializes the PAKT SDK with your configuration. See `src/services/authService.ts` for implementation details.

## 📖 Usage Examples

### Authentication

#### Basic Login & Registration
```typescript
import { AuthService } from './services/authService';

// Login with email and password
const userData = await AuthService.login('user@example.com', 'password');

// Login with 2FA
const userData = await AuthService.loginTwoFA(code, tempToken);

// Register new user
const response = await AuthService.register({
  email: 'user@example.com',
  password: 'password',
  fullName: 'John Doe'
});

// Verify account
await AuthService.verifyAccount(tempToken, token);

// Get current user
const user = await AuthService.getUser();
```

#### Google OAuth
```typescript
// Generate OAuth URL
const { googleAuthUrl, state } = await AuthService.googleOAuthGenerateState();

// Validate OAuth callback
const userData = await AuthService.googleOAuthValidateState(state, code);
```

#### Password Reset
```typescript
// Request password reset
const { tempToken, expiresIn } = await AuthService.resetPassword('user@example.com');

// Validate OTP
await AuthService.validatePasswordToken(otp, tempToken);

// Change password
await AuthService.changePassword(otp, tempToken, newPassword);
```

### Collection Management

#### Working with Collection Schemas
```typescript
import { CollectionSchemaService } from './services/collectionSchemaService';

// Get all schemas
const schemas = await CollectionSchemaService.getAll();

// Create a new schema
const schema = await CollectionSchemaService.create({
  name: 'products',
  fields: [{ name: 'title', type: 'string' }]
});

// Update schema
await CollectionSchemaService.update(schemaId, updateData);

// Delete schema
await CollectionSchemaService.delete(schemaId);
```

#### Managing Collections
```typescript
import { CollectionService } from './services/collectionService';

// Get all collections
const collections = await CollectionService.getAll();

// Create collection
const collection = await CollectionService.create({
  name: 'My Collection',
  type: 'nft'
});

// Create multiple collections
const collections = await CollectionService.createMany({
  collections: [...]
});

// Get collection types
const types = await CollectionService.getTypes();
```

#### Collection Store Operations
```typescript
import { CollectionStoreService } from './services/collectionStoreService';

// Get all items in a collection
const items = await CollectionStoreService.getAll('schema-reference');

// Create new item
const item = await CollectionStoreService.create('schema-reference', {
  data: { title: 'Product 1', price: 99.99 }
});

// Update item
await CollectionStoreService.update('schema-reference', itemId, updateData);

// Get count of items
const count = await CollectionStoreService.getCount('schema-reference');
```

### Wallet & Payments

#### Wallet Operations
```typescript
import { WalletService } from './services/walletService';

// Get all wallets
const wallets = await WalletService.getWallets();

// Get wallet by ID
const wallet = await WalletService.getSingleWalletById(walletId);

// Get wallet by coin type
const btcWallet = await WalletService.getSingleWalletByCoin('BTC');

// Get exchange rates
const exchange = await WalletService.getExchange();

// Get transactions
const transactions = await WalletService.getTransactions();

// Get transaction statistics
const stats = await WalletService.getTransactionStats('daily');

// Get aggregate stats
const aggStats = await WalletService.getAggregateTransactionStats();
```

#### Direct Deposit & Payments
```typescript
import { DirectDepositService } from './services/directDepositService';

// Create direct deposit
const deposit = await DirectDepositService.createDirectDeposit({
  collectionType: 'payments',
  amount: 100.00,
  coin: 'USDT',
  name: 'Payment for service',
  description: 'Monthly subscription',
  owner: userId
});

// Validate deposit
const validation = await DirectDepositService.validateDirectDeposit({
  collection: depositId,
  method: 'crypto',
  status: 'confirmed'
});

// Get payment methods
const methods = await DirectDepositService.fetchPaymentMethods();

// Get active RPC server
const rpc = await DirectDepositService.fetchActiveRPC();
```

## 🏛️ Project Structure

```
src/
├── components/              # React components
│   ├── Login.tsx           # Login form with 2FA support
│   ├── Register.tsx        # Registration form
│   ├── ForgotPassword.tsx  # Password reset flow
│   ├── ResetPassword.tsx   # Password change form
│   ├── EmailVerification.tsx # Email verification
│   ├── OAuthCallback.tsx   # OAuth callback handler
│   ├── Dashboard.tsx       # Protected dashboard
│   ├── UserDetails.tsx     # User profile display
│   ├── WalletList.tsx      # Wallet management
│   ├── DirectDeposit.tsx   # Payment deposit interface
│   ├── CollectionSchemaManager.tsx # Schema management
│   └── CollectionStoreManager.tsx  # Collection data management
├── contexts/               # React context providers
│   └── AuthContext.tsx     # Authentication state
├── services/               # API integration layer
│   ├── authService.ts      # Authentication & OAuth
│   ├── walletService.ts    # Wallet & transaction operations
│   ├── directDepositService.ts # Payment processing
│   ├── collectionService.ts # Collection management
│   ├── collectionSchemaService.ts # Schema operations
│   └── collectionStoreService.ts # Collection data CRUD
├── styles/                 # CSS styles
│   └── auth.css           # Authentication styling
└── App.tsx                # Main application component
```

## 🌟 Features Implemented

### Authentication & User Management
- ✅ **Email/Password Authentication** with proper validation
- ✅ **Two-Factor Authentication (2FA)** for enhanced security
- ✅ **Google OAuth Integration** with state management
- ✅ **Email Verification** with OTP flow
- ✅ **Password Reset** with secure token validation
- ✅ **User Profile Management** with account details display

### Collection System
- ✅ **Collection Schema Management** - Define custom data structures
- ✅ **Collection CRUD Operations** - Full create, read, update, delete
- ✅ **Collection Store** - Dynamic data storage based on schemas
- ✅ **Collection Types** - Support for different collection categories
- ✅ **Batch Operations** - Create and update multiple collections
- ✅ **Schema Filtering** - Advanced query and filter capabilities

### Wallet & Financial Features
- ✅ **Multi-Currency Wallet Support** - Manage multiple cryptocurrencies
- ✅ **Transaction Management** - View and track all wallet transactions
- ✅ **Transaction Statistics** - Analyze data with daily/weekly/monthly formats
- ✅ **Exchange Rate Integration** - Real-time currency conversion
- ✅ **Wallet Filtering** - Query by ID or coin type
- ✅ **Aggregate Statistics** - Comprehensive financial analytics

### Payment Processing
- ✅ **Direct Deposit Creation** - Initialize crypto payments
- ✅ **Payment Validation** - Verify and confirm deposits
- ✅ **Multiple Payment Methods** - Support various blockchain coins
- ✅ **RPC Server Integration** - Active blockchain node management
- ✅ **Payment Status Tracking** - Monitor deposit states

### Technical Implementation
- ✅ **TypeScript Integration** with full type safety
- ✅ **Protected Routes** with authentication guards
- ✅ **Error Handling** with user-friendly messages
- ✅ **Loading States** for better UX
- ✅ **Responsive Design** for mobile compatibility
- ✅ **Service Layer Architecture** - Clean code separation
- ✅ **Token Management** - Automatic JWT handling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel, Netlify, or similar
The built files in the `build` folder are ready for deployment to any static hosting service.

## 📚 Learn More

- [PAKT SDK Documentation](https://www.npmjs.com/package/pakt-sdk)
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🤖 Development Notes

This comprehensive sample application was developed by Claude (Anthropic's AI assistant) with guidance from human supervision. The implementation demonstrates:

- **Production-ready code patterns** with proper error handling
- **Type-safe integration** with the PAKT SDK across all modules
- **Modern React practices** with hooks and context
- **Real-world authentication flows** including OAuth and email verification
- **Complete collection management system** with schemas and dynamic storage
- **Full-featured wallet integration** with transactions and analytics
- **Payment processing capabilities** with direct deposits and validation
- **Comprehensive feature coverage** of the PAKT SDK capabilities

The code serves as both a learning resource and a starting point for building your own Web3 applications with the PAKT SDK, showcasing integration patterns for:
- User authentication and account management
- Data collection and schema-based storage
- Cryptocurrency wallet operations
- Payment processing and validation
- Real-time financial analytics

## 📝 License

This project is provided as a sample and educational resource. Please refer to the PAKT SDK license for usage terms.

---

**Ready to build your own Web3 application?** Start with this sample and customize it for your specific needs! 🚀