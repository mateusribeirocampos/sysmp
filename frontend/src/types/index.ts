export interface User {
  id_user: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'ativo' | 'inativo'
}

export interface Extras {
  id_extra: number
  receivedAt: Date; 
  idDocument: string;
  countDaysDeLivery: number; 
  deliveryDeadLine: Date; 
  internalDeliveryUserId: number; 
  message: string; 
}

export interface Fisicos {
  id_fisico: number
  receivedAt: Date; 
  idDocument: string;
  countDaysDeLivery: number; 
  deliveryDeadLine: Date; 
  internalDeliveryUserId: number;
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
