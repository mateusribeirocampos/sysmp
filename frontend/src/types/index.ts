export interface User {
  id_user: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'ativo' | 'inativo'
}

export interface Extras {
  id: number
  receivedAt: Date; 
  idDocument: number;
  countDaysDelivery: number; 
  DeliveryDeadline: Date; 
  internalDelivery: string; 
  message: string; 
}

export interface Fisicos {
  id: number
  receivedAt: Date; 
  idDocument: number; 
  countDaysDelivery: number; 
  DeliveryDeadline: Date; 
  internalDelivery: string; 
  message: string; 
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}
