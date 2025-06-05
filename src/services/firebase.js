// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signUpWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);
export const logOut = () => signOut(auth);

// Firestore helper functions
export const createDocument = (collectionName, data) => {
  return addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const getDocuments = (collectionName, conditions = []) => {
  let q = collection(db, collectionName);
  
  conditions.forEach(condition => {
    q = query(q, where(condition.field, condition.operator, condition.value));
  });
  
  return getDocs(q);
};

export const getDocument = (collectionName, docId) => {
  return getDoc(doc(db, collectionName, docId));
};

export const updateDocument = (collectionName, docId, data) => {
  return updateDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteDocument = (collectionName, docId) => {
  return deleteDoc(doc(db, collectionName, docId));
};

// Cloud Functions
export const sendBookingConfirmation = httpsCallable(functions, 'sendBookingConfirmation');
export const sendBookingReminder = httpsCallable(functions, 'sendBookingReminder');
export const createStripePaymentIntent = httpsCallable(functions, 'createStripePaymentIntent');

// Storage functions
export const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

// Default therapists data (will be seeded into Firestore)
export const defaultTherapists = [
  {
    id: 'therapist-1',
    name: 'Dr. Sarah Johnson',
    title: 'Licensed Clinical Psychologist',
    specialties: ['Anxiety', 'Depression', 'Relationships'],
    bio: 'Dr. Johnson has over 10 years of experience helping individuals navigate life\'s challenges with compassion and evidence-based approaches.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
    hourlyRate: 120,
    availability: {
      monday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      tuesday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      wednesday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      thursday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      friday: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      saturday: ['10:00', '11:00', '12:00'],
      sunday: []
    },
    isActive: true,
    type: 'therapist'
  },
  {
    id: 'therapist-2',
    name: 'Michael Chen',
    title: 'Licensed Marriage & Family Therapist',
    specialties: ['Couples Therapy', 'Family Dynamics', 'Communication'],
    bio: 'Michael specializes in helping couples and families build stronger, more connected relationships through understanding and effective communication.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    rating: 4.8,
    hourlyRate: 110,
    availability: {
      monday: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
      tuesday: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
      wednesday: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
      thursday: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
      friday: ['10:00', '11:00', '14:00', '15:00', '16:00'],
      saturday: ['09:00', '10:00', '11:00', '12:00'],
      sunday: ['14:00', '15:00', '16:00']
    },
    isActive: true,
    type: 'therapist'
  },
  {
    id: 'buddy-1',
    name: 'Emma Rodriguez',
    title: 'Peer Support Specialist',
    specialties: ['Life Transitions', 'Stress Management', 'Mindfulness'],
    bio: 'Emma is a warm and empathetic listener who provides peer support and guidance for those seeking a friendly ear and practical advice.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1ab?w=400&h=400&fit=crop&crop=face',
    rating: 4.7,
    hourlyRate: 60,
    availability: {
      monday: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      tuesday: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      wednesday: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      thursday: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      friday: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      saturday: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
      sunday: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
    },
    isActive: true,
    type: 'buddy'
  },
  {
    id: 'buddy-2',
    name: 'Alex Thompson',
    title: 'Life Coach & Wellness Buddy',
    specialties: ['Goal Setting', 'Motivation', 'Self-Care'],
    bio: 'Alex helps individuals discover their inner strength and develop practical strategies for personal growth and well-being.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    rating: 4.6,
    hourlyRate: 50,
    availability: {
      monday: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
      tuesday: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
      wednesday: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
      thursday: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
      friday: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      saturday: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
      sunday: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
    },
    isActive: true,
    type: 'buddy'
  }
];

export default app;
