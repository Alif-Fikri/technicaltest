import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { login as loginRequest, type AuthSession, type LoginCredentials } from '../../api/authApi'
import { AuthContext } from './authContext'
import { clearSession, loadSession, saveSession } from './authStorage'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(loadSession)

  const login = useCallback(async (credentials: LoginCredentials) => {
    const next = await loginRequest(credentials)
    saveSession(next)
    setSession(next)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({ session, isAuthenticated: !!session, login, logout }),
    [session, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
