import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from '../services/authService'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  userName: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<{ tempToken: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = AuthService.getToken()
        if (token) {
          setUser({
            id: '1',
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
            userName: 'johndoe',
          })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const userData = await AuthService.login(email, password)
      setUser(
        userData.user || {
          id: userData.id || '1',
          email: userData.email || email,
          firstName: userData.firstName || 'User',
          lastName: userData.lastName || 'Name',
          userName: userData.userName || 'username',
        }
      )
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    setIsLoading(true)
    try {
      const response = await AuthService.register(userData)
      return response
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
