import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  resetPassword, 
  logOut,
  createDocument,
  getDocument,
  updateDocument
} from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signup = async (email, password, userData) => {
    try {
      const { user } = await signUpWithEmail(email, password);
      
      // Create user profile in Firestore
      const profileData = {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName || user.displayName,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        emergencyContact: userData.emergencyContact || '',
        preferredTherapyType: userData.preferredTherapyType || [],
        goals: userData.goals || '',
        previousTherapyExperience: userData.previousTherapyExperience || false,
        timezone: userData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        isActive: true,
        role: 'user',
        onboardingCompleted: false
      };

      await createDocument('users', profileData);
      toast.success('Welcome to ClearHeadSpace! 🎉');
      
      return user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Sign in with email and password
  const signin = async (email, password) => {
    try {
      const { user } = await signInWithEmail(email, password);
      toast.success('Welcome back! 😊');
      return user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Sign in with Google
  const signinWithGoogle = async () => {
    try {
      const { user } = await signInWithGoogle();
      
      // Check if user profile exists, if not create one
      try {
        const userDoc = await getDocument('users', user.uid);
        if (!userDoc.exists()) {
          const profileData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ')[1] || '',
            photoURL: user.photoURL,
            phone: user.phoneNumber || '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            isActive: true,
            role: 'user',
            onboardingCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          await createDocument('users', profileData);
          toast.success('Welcome to ClearHeadSpace! 🎉');
        } else {
          toast.success('Welcome back! 😊');
        }
      } catch (firestoreError) {
        console.log('Firestore error, continuing with basic auth:', firestoreError);
        // Even if Firestore fails, we can still authenticate the user
        toast.success('Welcome! Please complete your profile setup.');
      }
      
      return user;
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  // Reset password
  const forgotPassword = async (email) => {
    try {
      await resetPassword(email);
      toast.success('Password reset email sent! Check your inbox 📧');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Sign out
  const signout = async () => {
    try {
      await logOut();
      setUserProfile(null);
      toast.success('See you soon! 👋');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (data) => {
    try {
      if (currentUser) {
        await updateDocument('users', currentUser.uid, data);
        setUserProfile(prev => ({ ...prev, ...data }));
        toast.success('Profile updated successfully! ✨');
      }
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Load user profile data
  const loadUserProfile = async (uid) => {
    try {
      const userDoc = await getDocument('users', uid);
      if (userDoc.exists()) {
        setUserProfile({ id: userDoc.id, ...userDoc.data() });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    signin,
    signinWithGoogle,
    forgotPassword,
    signout,
    updateProfile,
    loadUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
