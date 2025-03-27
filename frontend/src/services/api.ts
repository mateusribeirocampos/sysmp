import axios from 'axios'
import type { User, Extras, Fisicos, AuthResponse, LoginCredentials} from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Serviços de Autenticação
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

// Serviços de Usuários
export const userService = {

  getCount: async (): Promise<number> => {
    const response = await api.get<User[]>('/users')
    return response.data.length
  },

  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users')
    return response.data
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },

  create: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    const response = await api.post<User>('/users', userData)
    return response.data
  },

  update: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, userData)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`)
  },
}

// Serviços de Extras
export const extrasService = {

  getCount: async (): Promise<number> => {
    const response = await api.get<Extras[]>('/extras')
    return response.data.length
  },

  getAll: async (): Promise<Extras[]> => {
    const response = await api.get<Extras[]>('/extras')
    return response.data
  },

  getById: async (id: number): Promise<Extras> => {
    const response = await api.get<Extras>(`/extras/${id}`)
    return response.data
  },

  create: async (documentData: FormData): Promise<Extras> => {
    const response = await api.post<Extras>('/extras', documentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  update: async (id: number, documentData: FormData): Promise<Extras> => {
    const response = await api.put<Extras>(`/extras/${id}`, documentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/extras/${id}`)
  },
}

// Serviços de Fisicos
export const fisicosService = {

  getCount: async (): Promise<number> => {
    const response = await api.get<Fisicos[]>('/fisicos')
    return response.data.length
  },

  getAll: async (): Promise<Fisicos[]> => {
    const response = await api.get<Fisicos[]>('/fisicos')
    return response.data
  },

  getById: async (id: number): Promise<Fisicos> => {
    const response = await api.get<Fisicos>(`/fisicos/${id}`)
    return response.data
  },

  create: async (documentData: FormData): Promise<Fisicos> => {
    const response = await api.post<Fisicos>('/fisicos', documentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  update: async (id: number, documentData: FormData): Promise<Fisicos> => {
    const response = await api.put<Fisicos>(`/fisicos/${id}`, documentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/fisicos/${id}`)
  },
}

export default api 