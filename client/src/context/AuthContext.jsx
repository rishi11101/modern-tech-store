import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // FIX: Uses Environment Variable if available, otherwise defaults to localhost
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    withCredentials: true 
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me')
      if (res.data.isLoggedIn) {
        setUser({ name: res.data.name, id: res.data.id })
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error(err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    await api.post('/auth/login', { username, password })
    await checkAuth()
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
  }

  const register = async (userData) => {
    await api.post('/auth/register', userData) // Sending object as before
    await checkAuth()
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, api }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}