export interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
}

export interface Extras {
  receivedAt: Date; 
  idDocument: number;
  countDaysDelivery: number; 
  DeliveryDeadline: Date; 
  internalDelivery: string; 
  message: string; 
}
export interface Fisicos {
  receivedAt: Date; 
  idDocument: number; 
  countDaysDelivery: number; 
  DeliveryDeadline: Date; 
  internalDelivery: string; 
  message: string; 
}

export interface AuthResponse {
  user: User
  token: string
  message: string
}

export interface LoginCredentials {
  email: string
  password: string
}
