import { useState, useEffect } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { Link, useNavigate, useParams } from 'react-router-dom';
import generator from 'generate-password-ts';
import { userService } from '../services/api';

export function UsersEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userStatus, setUserStatus] = useState<'active' | 'inactive' >('active');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      if (!id) return;
      
      //console.log('Carregando dados do usuário:', id);
      const response = await userService.getById(parseInt(id));
      //console.log('Dados do usuário carregados:', response);
      
      // Verifica se a resposta é um array e pega o primeiro item
      const userData = Array.isArray(response) ? response[0] : response;
      
      if (userData) {        
        setUserName(userData.name || '');
        setUserEmail(userData.email || '');
        setUserRole(userData.role || '');
        setUserStatus(userData.status === 'active' ? 'active' : 'inactive');
      }
    } catch (err) {
      //console.error('Erro ao carregar usuário:', err);
      setError('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!id) return;

      // Validações básicas
      if (!userName || !userEmail || !userRole) {
        setError('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      // Criar objeto do usuário
      const userData = {
        name: userName,
        email: userEmail,
        role: userRole,
        status: userStatus,
        ...(userPassword && { password: userPassword }) // Inclui password apenas se foi preenchido
      };

      //console.log('Atualizando usuário:', userData);
      await userService.update(parseInt(id), userData);
      //console.log('Usuário atualizado com sucesso');

      // Redirecionar para lista de usuários
      navigate('/users');
    } catch (error: any) {
      //console.error('Erro ao atualizar usuário:', error);
      setError(error.response?.data?.error || 'Erro ao atualizar usuário');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link to="/users">
        <div className="inline-flex bg-blue-500 hover:bg-blue-700 p-1 rounded-md mb-8 sm:mt-0 sm:ml-2 sm:flex-none">
          <FaArrowLeftLong className="text-2xl text-white" />
        </div>
      </Link>

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Editar usuário existente</h1>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>

      <div className="w-full md:w-1/2 mt-8">
        <label htmlFor="userName" className="block text-lg font-medium text-gray-700 mb-1">
          Nome:
        </label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
          name="userName"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <div className="w-full md:w-1/2 mt-8">
        <label htmlFor="userEmail" className="block text-lg font-medium text-gray-700 mb-1">
          Email:
        </label>
        <input
          type="userEmail"
          className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
          name="userEmail"
          id="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
      </div>

      <div className="w-full md:w-1/2 mt-8">
        <label htmlFor="userPassword" className="block text-lg font-medium text-gray-700 mb-1">
          Senha:
        </label>
        <div className="flex items-center">
          <input
            type={showPassword ? 'text' : 'password'} // Alterna entre text e password
            className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
            name="userPassword"
            id="userPassword"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-1 px-3 py-1 btn btn-primary"
            title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => {
              const generatedPassword = generator.generate({
                length: 5,
                numbers: true,
                lowercase: false,
                uppercase: false,
                symbols: false,
                strict: true,
              });
              setUserPassword(generatedPassword);
              setShowPassword(true); // Exibe a senha quando gerada
            }}
            className="ml-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center"
            title="Gerar senha numérica"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Clique no botão para gerar uma senha numérica de 5 dígitos
        </p>
      </div>

      <div className="w-full md:w-1/2 mt-8">
        <label htmlFor="userRole" className="block text-lg font-medium text-gray-700 mb-1">
          Função ou cargo:
        </label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
          name="userRole"
          id="userRole"
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
        />
      </div>

      <div className="w-full md:w-1/2 mt-8">
        <label htmlFor="userStatus" className="block text-lg font-md text-gray-700 mb-1">
          Ativo:
        </label>
        <select
          name="userStatus"
          id="userStatus"
          value={userStatus}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUserStatus(e.target.value as 'active' | 'inactive')}
          className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
        >
          <option value="active">Sim</option>
          <option value="inactive">Não</option>
        </select>
      </div>

      <div className="mt-4 border-t pt-4">
        <div className="d-flex justify-content-end">
          <Link to={'/users'}>
            <button className="btn btn-primary me-2">Cancelar</button>
          </Link>

          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            type="submit"
          >
            Salvar dados
          </button>
        </div>
      </div>
    </div>
  );
}
