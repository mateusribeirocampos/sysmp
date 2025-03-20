import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '../services/api'
import type { User, LoginCredentials, RegisterData } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<User>
  register: (data: RegisterData) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

// Mock de usuário para testes
const mockUser: User = {
  id: 1,
  name: 'Usuário Teste',
  email: 'teste@exemplo.com',
  role: 'admin',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      // Mock de login - aceita qualquer email/senha
      const mockResponse = {
        user: mockUser,
        token: 'mock-token'
      }
      localStorage.setItem('token', mockResponse.token)
      localStorage.setItem('user', JSON.stringify(mockResponse.user))
      setUser(mockResponse.user)
      return mockResponse.user
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterData): Promise<User> => {
    try {
      // Mock de registro - cria um usuário com os dados fornecidos
      const mockResponse = {
        user: {
          ...mockUser,
          name: data.name,
          email: data.email,
        },
        token: 'mock-token'
      }
      localStorage.setItem('token', mockResponse.token)
      localStorage.setItem('user', JSON.stringify(mockResponse.user))
      setUser(mockResponse.user)
      return mockResponse.user
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
} 