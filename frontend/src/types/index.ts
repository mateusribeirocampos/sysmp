export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'manager'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: number
  name: string
  type: 'contrato' | 'relatorio' | 'proposta' | 'outro'
  status: 'pendente' | 'aprovado' | 'rejeitado'
  description?: string
  fileUrl: string
  responsible: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
  role: User['role']
} 