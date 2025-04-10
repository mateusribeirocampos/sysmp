import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '@/services/api';
import type { User } from '@/types';
import { Modal } from '@/components/Modal';

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      //console.log('Iniciando carregamento de usuários...');

      const users = await userService.getAll();
      //console.log('Usuários carregados:', users);
      setUsers(users);

      const count = await userService.getCount();
      //console.log('Total de usuários:', count);
      localStorage.setItem('usersCount', count.toString());
    } catch (err) {
      //console.error('Erro ao carregar usuários:', err);
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  function deleteUser(id_user: number) {
    setUserToDelete(id_user);
    setIsDeleteModalOpen(true);
  }

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        await userService.delete(userToDelete);
        loadUsers();
      } catch (err) {
        //console.error('Erro ao excluir usuário: ', err);
        setError('Erro ao excluir usuário');
      } finally {
        setIsDeleteModalOpen(false);
        setUserToDelete(null)
      }
    }
  }

  function handleEdit(userId: number) {
    navigate(`/users/edit/${userId}`);
  }

  async function handleStatusEdit(userId: number, status: string) {
    try {
      const newStatus = status === 'active' ? 'inactive' : 'active';
      //console.log("New status: " + newStatus);
      await userService.updateStatus(userId, newStatus);
      
      // Atualiza o estado local dos usuários
      setUsers(users.map(user => {
        if (user.id_user === userId) {
          return { ...user, status: newStatus };
        }
        return user;
      }));
    } catch (error: any) {
      //console.error('Erro ao atualizar status:', error);
      if (error.response) {
        // Erro da API
        setError(`Erro ao atualizar status: ${error.response.data.error || 'Erro desconhecido'}`);
      } else if (error.request) {
        // Erro de rede
        setError('Erro de conexão com o servidor. Verifique sua internet.');
      } else {
        // Outros erros
        setError('Erro ao processar a requisição');
      }
      // Limpa a mensagem de erro após 5 segundos
      setTimeout(() => setError(''), 5000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Usuários</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos os usuários cadastrados no sistema.
          </p>
        </div>

        <Link to={'/users/add'}>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Adicionar usuário
            </button>
          </div>
        </Link>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Função
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={`user-${user.id_user}`}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.role}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleStatusEdit(user.id_user, user.status)}
                          className={`px-3 py-1 rounded-md ${
                            user.status === 'active'
                              ? 'bg-white text-gray-400 hover:bg-red-100 hover:text-red-600 boder border-gray-200'
                              : 'bg-white text-gray-400 hover:bg-green-100 hover:text-green-600 border border-gray-200'
                          }`}
                        >
                          {user.status === 'active' ? 'Desativar' : 'Ativar'}
                        </button>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-3">

                          <button
                            onClick={() => handleEdit(user.id_user)}
                            className='rounded-full p-1.5 bg-white text-gray-400 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                            title="Editar documento"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => {
                              deleteUser(user.id_user)
                            }}
                            className="rounded-full p-1.5 bg-white text-gray-400 hover:bg-red-50 hover:text-red-600 border border-gray-200"
                            title="Excluir documento"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isDeleteModalOpen && (
        <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title='Confirmar exclusão'
        message='Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.'
        onConfirm={confirmDeleteUser}
        onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}
