import api, {userService} from '@/services/api';
import { User } from '@/types';
import { useState, useEffect } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

export function SuspensoAdd() {
  const [users, setUsers] = useState<User[]>([]);
  const [receivedAt, setReceivedAt] = useState('');
  const [idDocument, setIdDocument] = useState('');
  const [deliveryDeadLine, setDeliveryDeadLine] = useState('');
  const [internalDeliveryUserId, setInternalDeliveryUserId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


const handleSubmit = async () => {
  try {
    if (!receivedAt || !idDocument || !deliveryDeadLine || !internalDeliveryUserId) {
      setError('Por favor, preencha todos os campos');
      return;
    }
  
    if (internalDeliveryUserId === '0') {
      setError('Por favor, selecione um usuário para distribuição interna');
      return;
    }

    const suspensoData = {
      receivedAt,
      idDocument,
      deliveryDeadLine,
      internalDeliveryUserId,
      message
    };
    const response = await api.post('suspenso/add', suspensoData);
    if (response) {
    alert('Documento feito suspenso cadastrado com sucesso!');
    window.location.href = '/suspensos';
    }
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      setError('Já existe um documento cadastrado com esse número. Por favor, verifique o número digitado!');
    } else if (error.response) {
      setError(`Erro ${error.response.status}: ${
        typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || error.response.data.error || 'Erro no servidor'
      }`);
    } else {
      setError('Erro ao criar documento feito suspenso. Tente novamente.');
    }
  }
};

useEffect(() => {
  loadUsers();
}, []);

const loadUsers = async () => {
  try {
    setLoading(true);
    const users = await userService.getAll();
    const activeUsers = users.filter(user => user.status === 'active' || user.status === 'inactive');
    setUsers(activeUsers);
  } catch (err) {

    setError("Erro ao carregar lista de usuários");
  } finally {
    setLoading(false);
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
};

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link to="/suspensos">
        <div className="inline-flex bg-blue-500 hover:bg-blue-700 p-1 rounded-md mb-8 sm:mt-0 sm:ml-2 sm:flex-none">
          <FaArrowLeftLong className="text-2xl text-white" />
        </div>
      </Link>

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Adicione um documento feito suspenso
          </h1>
        </div>
      </div>

      <div className="w-full md:w-1/2 mt-8">
        <label htmlFor="idDocument" className="block text-lg font-medium text-gray-700 mb-1">
          Data da comunicação:
        </label>
        <input
          type="date"
          className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
          name="receivedAt"
          id="receivedAt"
          value={receivedAt}
          onChange={(e) => setReceivedAt(e.target.value)}
        />
      </div>
      <div className="w-full md:w-1/2 mt-8">
        <label htmlFor="idDocument" className="block text-lg font-m text-gray-700 mb-1">
          Número do documento:
        </label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
          name="idDocument"
          placeholder="99.99.9999.9999999/9999-99"
          id="idDocument"
          value={idDocument}
          onChange={(e) => setIdDocument(e.target.value)}
        />
      </div>

      <div className="w-full md:w-1/2 mt-8">
        <label htmlFor="idDocument" className="block text-lg font-medium text-gray-700 mb-1">
          Prazo de entrega:
        </label>
        <input
          type="date"
          className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
          name="DeliveryDeadline"
          id="DeliveryDeadline"
          value={deliveryDeadLine}
          onChange={(e) => setDeliveryDeadLine(e.target.value)}
        />
      </div>

      <div className="w-full md:w-1/2 mt-8">
        <label htmlFor="internalDeliveryUserId" className="block text-lg font-m text-gray-700 mb-1">
          Distribuição interna:
        </label>
        <div>
          <select
            name="internalDeliveryUserId"
            id="internalDeliveryUserId"
            value={internalDeliveryUserId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setInternalDeliveryUserId(e.target.value)
            }
            className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
          >
            <option value="0">Selecione o usuário</option>
            {users.map((user) => (
              <option key={user.id_user} value={user.id_user.toString()}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full md:w-1/2 mt-8">
        <label htmlFor="idDocument" className="block text-lg font-m text-gray-700 mb-1">
          Mensagem:
        </label>
        <div>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
            name="message"
            id="message"
            rows={3}
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <div className="d-flex justify-content-end">
          <Link to={'/suspensos'}>
            <button className="btn btn-primary me-2">Cancelar</button>
          </Link>

          <button onClick={handleSubmit} className="btn btn-primary" type="submit">
            Salvar dados
          </button>
        </div>
      </div>
    </div>
  );
};
