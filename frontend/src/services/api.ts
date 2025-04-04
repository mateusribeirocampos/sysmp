import axios from 'axios';
import type { User, Extras, Fisicos, AuthResponse, LoginCredentials } from '@/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL.replace(/\/$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Serviços de Autenticação
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Limpa o header de autorização do axios
    delete api.defaults.headers.common['Authorization'];
  },
};

// Serviços de Usuários
export const userService = {
  // Contagem de usuários
  getCount: async (): Promise<number> => {
    const response = await api.get<User[]>('/users');
    return response.data.length;
  },

  // Busca todos os usuários
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    console.log('Chamando API para buscar usuário:', id);
    const response = await api.get<User>(`/users/edit/${id}`);
    console.log('Resposta da API:', response.data);
    return response.data;
  },

  update: async (id: number, userData: any) => {
    const response = await api.put(`/users/edit/${id}`, userData);
    return response.data;
  },

  updateStatus: async (id: number, status: string) => {
    console.log('chamando api para atualizar status do usuário:', id, status);
    const response = await api.put(`/users/${id}/status`, { status });
    return response.data;
  },

  // Cria um novo usuário
  create: async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await api.post<User>('/users/add', userData);
    return response.data;
  },

  // Deleta um usuário pelo ID
  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Serviços de Extras
export const extrasService = {
  // Contagem de extras
  getCount: async (): Promise<number> => {
    const response = await api.get<Extras[]>('/extras');
    return response.data.length;
  },

  // Busca todos os extras
  getAll: async (): Promise<Extras[]> => {
    const response = await api.get<Extras[]>('/extras');
    return response.data;
  },

  // Busca um extra pelo ID
  getById: async (id: number): Promise<Extras> => {
    const response = await api.get<Extras>(`/extras/${id}`);
    return response.data;
  },

  // Cria um novo extra
  // Modifique esta função para aceitar dados JSON
  create: async (documentData: any): Promise<Extras> => {
    const response = await api.post<Extras>('/extra/add', documentData);
    return response.data;
  },

  // Atualiza um extra existente
  update: async (id: number, documentData: FormData): Promise<Extras> => {
    const response = await api.put<Extras>(`/extras/${id}`, documentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateInternalDelivery: async (idDocument: string, userId: number): Promise<any> => {
    const response = await api.put(`/extras/assign`, {
      idDocument: idDocument,
      internalDeliveryUserId: userId,
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/extras/${id}`);
  },
};

// Serviços de Fisicos
export const fisicosService = {
  // Contagem de físicos
  getCount: async (): Promise<number> => {
    const response = await api.get<Fisicos[]>('/fisicos');
    return response.data.length;
  },

  // Busca todos os físicos
  getAll: async (): Promise<Fisicos[]> => {
    const response = await api.get<Fisicos[]>('/fisicos');
    return response.data;
  },

  // Busca um físico pelo ID
  getById: async (id: number): Promise<Fisicos> => {
    const response = await api.get<Fisicos>(`/fisicos/${id}`);
    return response.data;
  },

  // Cria um novo físico
  create: async (documentData: FormData): Promise<Fisicos> => {
    const response = await api.post<Fisicos>('/fisicos/add', documentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Atualiza um físico existente
  update: async (id: number, documentData: FormData): Promise<Fisicos> => {
    const response = await api.put<Fisicos>(`/fisicos/${id}`, documentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/fisicos/${id}`);
  },
};

// Serviços de Documentos
export const documentService = {
  // Contagem de documentos
  getCount: async (): Promise<number> => {
    const response = await api.get<Document[]>('/documents');
    return response.data.length;
  },
};

export default api;
