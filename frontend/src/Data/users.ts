export interface user {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

export const user: user[] = [
  {
    id: '1',
    name: 'Laura Maria de Mello Azevedo',
    email: 'laura.azevedo@example.com',
    password: 'password',
    role: 'admin',
    status: 'active'
  },
  {
    id: '2',
    name: 'Jennifer de Lima',
    email: 'jane.smith@example.com',
    password: 'password',
    role: 'user',
    status: 'active'
  },
  {
    id: '3',
    name: 'Milena de Lima',
    email: 'milena.lima@example.com',
    password: 'password',
    role: 'user',
    status: 'inactive'
  },
  {
    id: '4',
    name: 'Geisa de Lima',
    email: 'geisa.lima@example.com',
    password: 'password',
    role: 'user',
    status: 'active'
  }
];
