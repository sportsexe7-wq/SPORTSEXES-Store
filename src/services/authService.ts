import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
  },

  async register(email: string, password: string, name: string): Promise<User> {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    await setDoc(doc(db, 'customers', cred.user.uid), {
      name,
      email,
      orderCount: 0,
      totalSpent: 0,
      blocked: false,
      createdAt: serverTimestamp(),
    })
    return cred.user
  },

  async logout(): Promise<void> {
    await signOut(auth)
  },

  async getProfile(uid: string) {
    const snap = await getDoc(doc(db, 'customers', uid))
    return snap.exists() ? snap.data() : null
  },
}
