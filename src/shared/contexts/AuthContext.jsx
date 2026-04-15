import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  registerFlow,
  loginFlow,
  completeProfileFlow,
  resendVerificationFlow,
  forgotPasswordFlow,
  exchangeFirebaseTokenForSession,
  logoutFlow,
} from '../../features/auth/data/authService'
import {
  getSession,
  getAccessToken,
  getPendingRole,
  clearAuthStorage,
} from '../../features/auth/data/authStorage'
import {
  getCurrentFirebaseUser,
  subscribeToFirebaseAuth,
} from '../../features/auth/data/firebaseAuth'
import { getReadableAuthError } from '../../features/auth/data/authErrors'

const AuthContext = createContext(null)

function mapFirebaseUser(user) {
  if (!user) {
    return null
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    emailVerified: Boolean(user.emailVerified),
    photoURL: user.photoURL ?? null,
  }
}

function buildStateFromSession(session, firebaseUser) {
  const accessToken = session?.accessToken ?? getAccessToken() ?? null
  const role = session?.role ?? null

  return {
    firebaseUser: mapFirebaseUser(firebaseUser),
    session: session ?? null,
    accessToken,
    role,
    isAuthenticated: Boolean(accessToken && session),
    isEmailVerified: Boolean(firebaseUser?.emailVerified),
    needsProfileCompletion: Boolean(
      firebaseUser?.emailVerified && firebaseUser && !session
    ),
    pendingRole: getPendingRole(),
  }
}

const initialFirebaseUser = getCurrentFirebaseUser()
const initialSession = getSession()

const initialState = {
  ...buildStateFromSession(initialSession, initialFirebaseUser),
  loadingAuth: true,
  initialized: false,
  authError: '',
}

export function AuthProvider({ children }) {
  const [state, setState] = useState(initialState)

  const setPartialState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  const syncFromFirebaseAndSession = useCallback(
    ({ firebaseUser, session, authError = '' }) => {
      setState((prev) => ({
        ...prev,
        ...buildStateFromSession(session, firebaseUser),
        authError,
        loadingAuth: false,
        initialized: true,
      }))
    },
    []
  )

  const handleUnauthenticatedState = useCallback((firebaseUser = null) => {
    setState((prev) => ({
      ...prev,
      ...buildStateFromSession(null, firebaseUser),
      session: null,
      accessToken: null,
      role: null,
      isAuthenticated: false,
      loadingAuth: false,
      initialized: true,
    }))
  }, [])

  const refreshSession = useCallback(
    async (forceRefresh = false) => {
      const firebaseUser = getCurrentFirebaseUser()

      if (!firebaseUser) {
        handleUnauthenticatedState(null)
        return null
      }

      setPartialState({
        loadingAuth: true,
        authError: '',
        firebaseUser: mapFirebaseUser(firebaseUser),
        isEmailVerified: Boolean(firebaseUser.emailVerified),
      })

      try {
        const mapped = await exchangeFirebaseTokenForSession(forceRefresh)

        syncFromFirebaseAndSession({
          firebaseUser: getCurrentFirebaseUser(),
          session: mapped?.session ?? null,
          authError: '',
        })

        return mapped
      } catch (error) {
        const readableError = getReadableAuthError(error)

        syncFromFirebaseAndSession({
          firebaseUser: getCurrentFirebaseUser(),
          session: null,
          authError: readableError,
        })

        return null
      }
    },
    [handleUnauthenticatedState, setPartialState, syncFromFirebaseAndSession]
  )

  const register = useCallback(
    async ({ email, password, displayName, role }) => {
      setPartialState({
        loadingAuth: true,
        authError: '',
      })

      try {
        const result = await registerFlow({
          email,
          password,
          displayName,
          role,
        })

        const firebaseUser = getCurrentFirebaseUser()

        setState((prev) => ({
          ...prev,
          ...buildStateFromSession(null, firebaseUser),
          loadingAuth: false,
          initialized: true,
          authError: '',
        }))

        return result
      } catch (error) {
        const readableError = getReadableAuthError(error)

        setPartialState({
          loadingAuth: false,
          initialized: true,
          authError: readableError,
        })

        throw error
      }
    },
    [setPartialState]
  )

  const login = useCallback(
    async ({ email, password }) => {
      setPartialState({
        loadingAuth: true,
        authError: '',
      })

      try {
        const mapped = await loginFlow({ email, password })

        syncFromFirebaseAndSession({
          firebaseUser: getCurrentFirebaseUser(),
          session: mapped?.session ?? null,
          authError: '',
        })

        return mapped
      } catch (error) {
        const readableError = getReadableAuthError(error)

        syncFromFirebaseAndSession({
          firebaseUser: getCurrentFirebaseUser(),
          session: null,
          authError: readableError,
        })

        throw error
      }
    },
    [setPartialState, syncFromFirebaseAndSession]
  )

  const completeProfile = useCallback(
    async (role) => {
      setPartialState({
        loadingAuth: true,
        authError: '',
      })

      try {
        const mapped = await completeProfileFlow(role)

        syncFromFirebaseAndSession({
          firebaseUser: getCurrentFirebaseUser(),
          session: mapped?.session ?? null,
          authError: '',
        })

        return mapped
      } catch (error) {
        const readableError = getReadableAuthError(error)

        setPartialState({
          loadingAuth: false,
          initialized: true,
          authError: readableError,
        })

        throw error
      }
    },
    [setPartialState, syncFromFirebaseAndSession]
  )

  const resendVerification = useCallback(async () => {
    setPartialState({
      loadingAuth: true,
      authError: '',
    })

    try {
      const result = await resendVerificationFlow()

      setPartialState({
        loadingAuth: false,
        initialized: true,
        authError: '',
      })

      return result
    } catch (error) {
      const readableError = getReadableAuthError(error)

      setPartialState({
        loadingAuth: false,
        initialized: true,
        authError: readableError,
      })

      throw error
    }
  }, [setPartialState])

  const forgotPassword = useCallback(
    async (email) => {
      setPartialState({
        loadingAuth: true,
        authError: '',
      })

      try {
        const result = await forgotPasswordFlow(email)

        setPartialState({
          loadingAuth: false,
          initialized: true,
          authError: '',
        })

        return result
      } catch (error) {
        const readableError = getReadableAuthError(error)

        setPartialState({
          loadingAuth: false,
          initialized: true,
          authError: readableError,
        })

        throw error
      }
    },
    [setPartialState]
  )

  const logout = useCallback(async () => {
    setPartialState({
      loadingAuth: true,
      authError: '',
    })

    try {
      await logoutFlow()
    } finally {
      clearAuthStorage()
      handleUnauthenticatedState(null)
    }
  }, [handleUnauthenticatedState, setPartialState])

  useEffect(() => {
    let isMounted = true

    const unsubscribe = subscribeToFirebaseAuth(async (firebaseUser) => {
      if (!isMounted) {
        return
      }

      if (!firebaseUser) {
        handleUnauthenticatedState(null)
        return
      }

      setState((prev) => ({
        ...prev,
        firebaseUser: mapFirebaseUser(firebaseUser),
        isEmailVerified: Boolean(firebaseUser.emailVerified),
        pendingRole: getPendingRole(),
        loadingAuth: true,
      }))

      try {
        const mapped = await exchangeFirebaseTokenForSession(false)

        if (!isMounted) {
          return
        }

        syncFromFirebaseAndSession({
          firebaseUser: getCurrentFirebaseUser(),
          session: mapped?.session ?? null,
          authError: '',
        })
      } catch (error) {
        if (!isMounted) {
          return
        }

        const readableError = getReadableAuthError(error)

        syncFromFirebaseAndSession({
          firebaseUser: getCurrentFirebaseUser(),
          session: null,
          authError: readableError,
        })
      }
    })

    return () => {
      isMounted = false
      unsubscribe?.()
    }
  }, [handleUnauthenticatedState, syncFromFirebaseAndSession])

  const value = useMemo(
    () => ({
      ...state,
      register,
      login,
      completeProfile,
      resendVerification,
      forgotPassword,
      refreshSession,
      logout,
    }),
    [
      state,
      register,
      login,
      completeProfile,
      resendVerification,
      forgotPassword,
      refreshSession,
      logout,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider')
  }

  return context
}