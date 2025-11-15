import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Validate CUNY email domain
// Accepts any email ending with .cuny.edu (e.g., myhunter.cuny.edu, login.cuny.edu, etc.)
export const validateCUNYEmail = (email: string): boolean => {
  const emailLower = email.toLowerCase().trim();
  
  // Check if email has @ symbol
  if (!emailLower.includes('@')) {
    return false;
  }
  
  // Get the domain part after @
  const domain = emailLower.split('@')[1];
  
  // Check if domain ends with .cuny.edu or is exactly cuny.edu
  return domain === 'cuny.edu' || domain.endsWith('.cuny.edu');
};

// Sign up a new user
export const signUpUser = async (email: string, password: string) => {
  // Validate CUNY email
  if (!validateCUNYEmail(email)) {
    throw new Error('Please use a valid CUNY email address');
  }

  // Create user account with Firebase Authentication
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // TEMPORARILY DISABLED: Email verification for testing purposes
  // await sendEmailVerification(user);

  // Create user document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    emailVerified: true, // Set to true for testing (no verification needed)
    createdAt: new Date().toISOString(),
    courses: [],
  });

  return user;
};

// Sign in an existing user
export const signInUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Resend verification email
export const resendVerificationEmail = async (user: User) => {
  if (!user) {
    throw new Error('No user is currently signed in');
  }
  
  await sendEmailVerification(user);
};

// Check if user's email is verified (refresh from server)
export const checkEmailVerification = async (): Promise<boolean> => {
  const user = auth.currentUser;
  
  if (!user) {
    return false;
  }

  // Reload user data from Firebase to get latest emailVerified status
  await user.reload();
  
  // Update Firestore if email is now verified
  if (user.emailVerified) {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { emailVerified: true }, { merge: true });
  }

  return user.emailVerified;
};

// Get user data from Firestore
export const getUserData = async (uid: string) => {
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);
  
  if (userDoc.exists()) {
    return userDoc.data();
  }
  
  return null;
};

