# ClearHeadSpace 🌟

> Your Safe Space for Mental Wellness

ClearHeadSpace is a comprehensive mental health platform that connects users with licensed therapists and supportive buddies in a secure, judgment-free environment. Built with modern web technologies and designed with user experience and privacy as top priorities.

## ✨ Features

### 🔐 **Secure Authentication**
- Email/password registration and login
- Google OAuth integration
- Multi-factor authentication support
- Secure session management

### 👥 **Professional Network**
- Licensed therapists and peer support specialists
- Detailed profiles with specialties and ratings
- Smart matching based on user preferences
- Flexible availability scheduling

### 📅 **Intelligent Booking System**
- Real-time availability checking
- Multiple session formats (video, audio, text)
- Automated reminders and confirmations
- Easy rescheduling and cancellation

### 💬 **Multiple Communication Channels**
- HD video calls with screen sharing
- Crystal-clear audio sessions
- Secure text-based chat
- File sharing capabilities

### 📱 **Mobile-First Design**
- Responsive design that works on all devices
- Progressive Web App (PWA) features
- Touch-friendly interface
- Offline support for essential features

### 🎨 **Beautiful UI/UX**
- Calming color palette and animations
- Floating shapes and micro-interactions
- Dark/light mode support
- Accessibility-first design

### 🔒 **Privacy & Security**
- HIPAA-compliant infrastructure
- End-to-end encryption for sensitive data
- Secure file storage
- Regular security audits

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **React Hook Form** - Form management

### Backend & Services
- **Firebase Authentication** - User management
- **Cloud Firestore** - NoSQL database
- **Cloud Functions** - Serverless backend
- **Firebase Hosting** - Static site hosting
- **Cloud Storage** - File storage

### Development & Deployment
- **GitHub Actions** - CI/CD pipeline
- **ESLint & Prettier** - Code quality
- **Jest & Testing Library** - Unit testing
- **Lighthouse CI** - Performance monitoring

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase CLI
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/clearheadspace.git
cd clearheadspace
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install function dependencies
cd functions && npm install && cd ..
```

### 3. Firebase Setup
```bash
# Login to Firebase
firebase login

# Create a new Firebase project
firebase projects:create clearheadspace

# Initialize Firebase in your project
firebase init
```

### 4. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Firebase configuration values
# Get these from Firebase Console > Project Settings > General
```

### 5. Start Development Server
```bash
# Start React development server
npm start

# In another terminal, start Firebase emulators
firebase emulators:start
```

Visit `http://localhost:3000` to see the app running locally!

## 🔧 Firebase Configuration

### Setting up Firebase Project

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics (recommended)

2. **Enable Authentication**
   - Navigate to Authentication > Sign-in method
   - Enable Email/Password and Google providers
   - Configure authorized domains

3. **Setup Firestore Database**
   - Go to Firestore Database
   - Create database in production mode
   - Deploy security rules: `firebase deploy --only firestore:rules`

4. **Configure Hosting**
   ```bash
   firebase init hosting
   # Choose 'build' as public directory
   # Configure as single-page app: Yes
   # Set up automatic builds: Yes (optional)
   ```

5. **Setup Cloud Functions**
   ```bash
   firebase init functions
   # Choose TypeScript
   # Install dependencies: Yes
   ```

## 🚀 Deployment

### Automated Deployment (Recommended)

The app uses GitHub Actions for automated deployment:

1. **Setup Repository Secrets**
   - `PROD_FIREBASE_SERVICE_ACCOUNT`: Service account JSON
   - `FIREBASE_TOKEN`: Firebase CI token
   - `PROD_FIREBASE_API_KEY`: Production API key
   - `SLACK_WEBHOOK`: Slack notifications (optional)

2. **Deploy via Git**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

### Manual Deployment

```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

## 📁 Project Structure

```
clearheadspace/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   └── ...
│   ├── contexts/         # React contexts
│   ├── hooks/           # Custom hooks
│   ├── services/        # Firebase services
│   ├── utils/           # Utility functions
│   └── App.js           # Main app component
├── functions/            # Cloud Functions
│   ├── src/
│   │   └── index.ts     # Functions entry point
│   └── package.json
├── .github/
│   └── workflows/       # GitHub Actions
├── firebase.json        # Firebase configuration
├── firestore.rules     # Database security rules
└── package.json
```

## 🎯 Key Components

### Authentication Flow
- `SignIn.js` - User login with email/Google
- `SignUp.js` - Multi-step registration process
- `AuthContext.js` - Authentication state management

### Core Features
- `Dashboard.js` - User dashboard with upcoming sessions
- `TherapistSelection.js` - Browse and filter therapists
- `BookingFlow.js` - Multi-step booking process
- `VideoCall.js` - In-session video calling interface

### User Management
- `Profile.js` - User profile and settings
- `BookingHistory.js` - Session history and management

## 🔒 Security Features

### Authentication & Authorization
- Firebase Authentication with secure tokens
- Multi-factor authentication support
- Role-based access control (RBAC)
- Session timeout and refresh

### Data Protection
- Firestore security rules
- Input validation and sanitization
- HTTPS enforcement
- XSS and CSRF protection

### Privacy Compliance
- HIPAA-compliant infrastructure
- Data encryption at rest and in transit
- User data anonymization options
- GDPR compliance features

## 📊 Analytics & Monitoring

### Performance Monitoring
- Lighthouse CI for performance audits
- Core Web Vitals tracking
- Error tracking with Firebase Crashlytics
- Custom performance metrics

### User Analytics
- Google Analytics 4 integration
- Custom event tracking
- User journey analysis
- Conversion funnel monitoring

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Test Structure
- Unit tests for utilities and hooks
- Integration tests for components
- E2E tests for critical user journeys
- Performance testing with Lighthouse

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all CI checks pass

## 📝 Environment Variables

Key environment variables needed:

```bash
# Firebase Config
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=

# Optional integrations
REACT_APP_STRIPE_PUBLISHABLE_KEY=
REACT_APP_SENTRY_DSN=
REACT_APP_GOOGLE_ANALYTICS_ID=
```

## 🚨 Crisis Resources

ClearHeadSpace includes built-in crisis resources:

- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **National Domestic Violence Hotline**: 1-800-799-7233
- **SAMHSA National Helpline**: 1-800-662-4357

## 📞 Support

### Getting Help
- 📧 Email: support@clearheadspace.com
- 💬 Discord: [Join our community](https://discord.gg/clearheadspace)
- 📖 Documentation: [docs.clearheadspace.com](https://docs.clearheadspace.com)

### Reporting Issues
- 🐛 Bug reports: [GitHub Issues](https://github.com/yourusername/clearheadspace/issues)
- 🔒 Security issues: security@clearheadspace.com

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mental Health Professionals** who provided guidance on best practices
- **Open Source Community** for the amazing tools and libraries
- **Beta Testers** who helped shape the user experience
- **Firebase Team** for the robust backend infrastructure

---

<div align="center">

**Built with ❤️ for mental health and wellness**

[Website](https://clearheadspace.com) • 
[Documentation](https://docs.clearheadspace.com) • 
[Support](mailto:support@clearheadspace.com)

</div>
