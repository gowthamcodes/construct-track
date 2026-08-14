import {
  FirebaseAuthTypes,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@react-native-firebase/auth';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const AuthService = {
  async login(
    email: string,
    password: string,
  ): Promise<FirebaseAuthTypes.UserCredential> {
    const auth = getAuth();

    return signInWithEmailAndPassword(auth, email.trim(), password);
  },

  async register({
    name,
    email,
    password,
  }: RegisterPayload): Promise<FirebaseAuthTypes.UserCredential> {
    const auth = getAuth();

    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );

    await updateProfile(credential.user, {
      displayName: name.trim(),
    });

    return credential;
  },

  async forgotPassword(email: string): Promise<void> {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email.trim());
  },

  async logout(): Promise<void> {
    const auth = getAuth();
    await signOut(auth);
  },

  getCurrentUser(): FirebaseAuthTypes.User | null {
    return getAuth().currentUser;
  },

  onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void) {
    return onAuthStateChanged(getAuth(), callback);
  },
};
