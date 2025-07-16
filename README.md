# PAKT Frontend SDK Sample Application

> A comprehensive example of building real-world Web3 applications using the PAKT SDK

This project demonstrates how to integrate the [`pakt-sdk`](https://www.npmjs.com/package/pakt-sdk) into a React application to build modern Web3 authentication and user management systems. It showcases real-world implementation patterns, proper TypeScript integration, and production-ready code structure.

## 🚀 What's Included

This sample application implements a complete authentication system with:

### 🔐 Authentication Features
- **Email/Password Authentication** - Traditional login and registration
- **Google OAuth Integration** - Social login with proper state management
- **Email Verification** - User account verification with OTP
- **Password Reset** - Secure password reset with email verification
- **JWT Token Management** - Automatic token storage and validation

### 🏗️ Architecture Highlights
- **TypeScript Integration** - Full type safety with PAKT SDK types
- **React Router** - Protected routes and navigation
- **Context API** - Global authentication state management
- **Error Handling** - Comprehensive error boundaries and user feedback
- **Responsive Design** - Mobile-friendly authentication forms

### 📱 User Experience
- **Multi-step Flows** - Guided user registration and password reset
- **Loading States** - Proper UI feedback during async operations
- **Form Validation** - Client-side validation with error messages
- **OAuth Callbacks** - Seamless Google authentication flow

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

### Basic Authentication
```typescript
import { AuthService } from './services/authService';

// Login
const userData = await AuthService.login('user@example.com', 'password');

// Register
const response = await AuthService.register({
  email: 'user@example.com',
  password: 'password',
  fullName: 'John Doe'
});
```

### Google OAuth
```typescript
// Generate OAuth URL
const { googleAuthUrl } = await AuthService.googleOAuthGenerateState();

// Validate OAuth callback
const userData = await AuthService.googleOAuthValidateState(state, code);
```

### Password Reset
```typescript
// Request password reset
const { tempToken } = await AuthService.resetPassword('user@example.com');

// Validate OTP
await AuthService.validatePasswordToken(otp, tempToken);

// Change password
await AuthService.changePassword(otp, tempToken, newPassword);
```

## 🏛️ Project Structure

```
src/
├── components/          # React components
│   ├── Login.tsx       # Login form
│   ├── Register.tsx    # Registration form
│   ├── ForgotPassword.tsx # Password reset flow
│   ├── EmailVerification.tsx # Email verification
│   ├── OAuthCallback.tsx # OAuth callback handler
│   └── Dashboard.tsx   # Protected dashboard
├── contexts/           # React context providers
│   └── AuthContext.tsx # Authentication state
├── services/           # API integration
│   └── authService.ts  # PAKT SDK service wrapper
├── styles/             # CSS styles
│   └── auth.css       # Authentication styling
└── App.tsx            # Main application component
```

## 🌟 Features Implemented

- ✅ **Email/Password Authentication** with proper validation
- ✅ **Google OAuth Integration** with state management
- ✅ **Email Verification** with OTP flow
- ✅ **Password Reset** with secure token validation
- ✅ **Protected Routes** with authentication guards
- ✅ **TypeScript Integration** with full type safety
- ✅ **Error Handling** with user-friendly messages
- ✅ **Loading States** for better UX
- ✅ **Responsive Design** for mobile compatibility

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
- **Type-safe integration** with the PAKT SDK
- **Modern React practices** with hooks and context
- **Real-world authentication flows** including OAuth and email verification
- **Comprehensive feature coverage** of the PAKT SDK capabilities

The code serves as both a learning resource and a starting point for building your own Web3 applications with the PAKT SDK.

## 📝 License

This project is provided as a sample and educational resource. Please refer to the PAKT SDK license for usage terms.

---

**Ready to build your own Web3 application?** Start with this sample and customize it for your specific needs! 🚀