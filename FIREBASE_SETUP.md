# 🔥 Firebase Setup Checklist for ClearHeadSpace

Follow these steps exactly to set up your Firebase project:

## 📋 **Pre-Setup Checklist**
- ✅ Firebase project created
- ✅ Code downloaded to local machine

## 🔧 **Step-by-Step Setup**

### **Step 1: Get Firebase Configuration**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the **gear icon** (Project Settings)
4. Scroll down to **"Your apps"**
5. Click the **`</>`** (Web) icon
6. Register app with nickname: **ClearHeadSpace**
7. **✅ Check "Also set up Firebase Hosting"**
8. Click **"Register app"**
9. **COPY** the config object (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};
```

### **Step 2: Configure Your Project**

**Option A: Use the Setup Script (Recommended)**
```bash
cd /Users/sam/Documents/claude-folder/clearheadspace
chmod +x setup.sh
./setup.sh
```

**Option B: Manual Setup**
1. Create `.env` file:
```bash
cp .env.example .env
```

2. Edit `.env` with your Firebase config:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. Update `.firebaserc`:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### **Step 3: Firebase Console Configuration**

#### **🔐 Authentication**
1. **Authentication** → **Get started**
2. Go to **Sign-in method**
3. Enable **Email/Password** → Save
4. Enable **Google** → Add your email → Save
5. Go to **Settings** → Add authorized domains:
   - `localhost`
   - Your production domain

#### **📚 Firestore Database**
1. **Firestore Database** → **Create database**
2. **Start in production mode** → Next
3. Choose location closest to users → Done

#### **📁 Storage**
1. **Storage** → **Get started** 
2. **Start in production mode** → Next
3. Use same location as Firestore → Done

#### **⚡ Functions**
1. **Functions** → **Get started**
2. Follow upgrade prompts if needed

#### **🌐 Hosting**
1. **Hosting** → **Get started**
2. Will be configured via CLI

### **Step 4: Install & Initialize**

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Navigate to project
cd /Users/sam/Documents/claude-folder/clearheadspace

# Install dependencies
npm install
cd functions && npm install && cd ..

# Initialize Firebase
firebase init
```

**When prompted during `firebase init`:**
- **Which Firebase features?** Select:
  - ✅ Firestore
  - ✅ Functions  
  - ✅ Hosting
  - ✅ Storage

- **Project setup:** Use existing project → Select your project

- **Firestore:**
  - Rules file: `firestore.rules` ✅
  - Indexes file: `firestore.indexes.json` ✅

- **Functions:**
  - Language: **TypeScript** ✅
  - Use ESLint: **Yes** ✅
  - Install dependencies: **Yes** ✅

- **Hosting:**
  - Public directory: **build** ✅
  - Single-page app: **Yes** ✅
  - GitHub auto-deploy: **No** (we have custom CI/CD)

- **Storage:**
  - Rules file: `storage.rules` ✅

### **Step 5: Deploy Security Rules**

```bash
firebase deploy --only firestore:rules,storage
```

### **Step 6: Test Local Development**

```bash
# Start React development server
npm start

# In another terminal, start Firebase emulators (optional)
firebase emulators:start
```

Visit `http://localhost:3000` - your app should now work!

### **Step 7: Deploy to Production**

```bash
# Build the app
npm run build

# Deploy everything
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
```

## 🎯 **Verification Checklist**

After setup, verify these work:
- [ ] User can register with email
- [ ] User can sign in with Google
- [ ] Dashboard loads with user info
- [ ] Can browse therapists
- [ ] Can create a booking
- [ ] Profile page works
- [ ] No console errors

## 🚨 **Common Issues & Solutions**

### **"Permission denied" errors**
- Check Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Verify user is authenticated

### **"Firebase config is undefined"**
- Check `.env` file exists and has correct values
- Restart development server: `npm start`

### **Authentication not working**
- Verify authorized domains in Firebase Console
- Check API keys are correct

### **Functions deployment fails**
- Run `cd functions && npm run build` first
- Check Node.js version is 18+

## 📞 **Need Help?**

If you encounter issues:
1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review the console errors in browser dev tools
3. Check Firebase Console for any service status issues
4. Ensure all environment variables are set correctly

---

**🎉 Once everything is working, you'll have a fully functional therapy platform ready for users!**
