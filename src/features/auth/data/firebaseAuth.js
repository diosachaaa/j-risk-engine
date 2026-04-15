import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  reload,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../../../shared/lib/firebase'

function getRequiredCurrentUser() {
  const user = auth.currentUser

  if (!user) {
    throw new Error('Firebase user tidak ditemukan')
  }

  return user
}

export async function registerWithEmail({ email, password, displayName }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const user = credential.user

  if (displayName?.trim()) {
    await updateProfile(user, {
      displayName: displayName.trim(),
    })
    await reload(user)
  }

  return auth.currentUser ?? user
}

export async function loginWithEmail({ email, password }) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function logoutFirebase() {
  await signOut(auth)
}

export function getCurrentFirebaseUser() {
  return auth.currentUser
}

export async function reloadFirebaseUser() {
  const user = getRequiredCurrentUser()
  await reload(user)
  return auth.currentUser
}

export async function getFirebaseIdToken(forceRefresh = false) {
  const user = getRequiredCurrentUser()
  return user.getIdToken(forceRefresh)
}

export async function sendVerificationEmail() {
  const user = getRequiredCurrentUser()
  await sendEmailVerification(user)
}

export async function sendResetPasswordEmail(email) {
  await sendPasswordResetEmail(auth, email)
}

export async function updateFirebaseDisplayName(displayName) {
  const user = getRequiredCurrentUser()

  await updateProfile(user, {
    displayName: displayName?.trim() || '',
  })

  await reload(user)
  return auth.currentUser
}

export async function isFirebaseEmailVerified() {
  const user = await reloadFirebaseUser()
  return Boolean(user?.emailVerified)
}

export function subscribeToFirebaseAuth(callback) {
  return onAuthStateChanged(auth, callback)
}