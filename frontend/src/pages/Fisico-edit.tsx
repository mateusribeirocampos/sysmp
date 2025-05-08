import { fisicosService, userService } from '@/services/api';
import { User } from '@/types';
import { useEffect, useState } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { Link, useNavigate, useParams } from 'react-router-dom';

export function FisicoEdit() {
  const { id_fisico } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [userName, setUserName] = useState('');
  const [receivedAt, setReceivedAt] = useState('');
  const [idDocument, setIdDocument] = useState('');
  const [deliveryDeadLine, setDeliveryDeadLine] = useState('');
  const [internalDeliveryUserId, setInternalDeliveryUserId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAllUser();
    if (id_fisico) {
      loadFisicoData(parseInt(id_fisico));
    }
  }, [id_fisico]);

  const loadAllUser = async () => {
    try {
      setLoading(true);
      const users = await userService.getAll();
      const activeUsers = users.filter(
        (user) => user.status === 'active' || user.status === 'inactive'
      );

      setUsers(activeUsers);
    } catch (error) {
      //console.log('Erro ao carregar usuários: ', error);
      setError('Erro ao carregar lista de usuários');
    } finally {
      setLoading(false);
    }
  };

  const loadFisicoData = async (fisicoId: number) => {
    try {
      setLoading(true);
      const response = await fisicosService.getById(fisicoId);

      const fisicoData = Array.isArray(response) ? response[0] : response;

      if (fisicoData) {
        //console.log('documento judicial físico carregado: ', fisicoData);

        const receivedDate = fisicoData.receivedAt ? new Date(fisicoData.receivedAt).toISOString().split('T')[0] : '';
        const deadlineDate = fisicoData.deliveryDeadLine ? new Date(fisicoData.deliveryDeadLine).toISOString().split('T')[0] : '';

        setReceivedAt(receivedDate);
        setIdDocument(fisicoData.idDocument || '');
        setDeliveryDeadLine(deadlineDate);
        setMessage(fisicoData.message || '');

        if (fisicoData.internalDeliveryUserId) {
          setInternalDeliveryUserId(fisicoData.internalDeliveryUserId.toString());
          await loadUserName(fisicoData.internalDeliveryUserId);
        }
      }
    } catch (err) {
      //console.log('Erro ao carregar documento judicial físico: ', err);
      setError('Erro ao carregar dados do documento judicial físico')
    } finally {
      setLoading(false);
    }
  }

    const loadUserName = async (userId: number) => {
      try {
        if (userId) {
          const response = await userService.getById(userId);
          const userData = Array.isArray(response) ? response[0] : response;
          
          if (userData) {
            //console.log('Usuário responsável carregado:', userData.name);
            setUserName(userData.name || '');
          }
        }
      } catch (err) {
        //console.error('Erro ao carregar usuário:', err);
      }
    };

  const handleSubmit = async () => {
    try {
      setError('');
      setSuccess('');


      if (!receivedAt || !idDocument || !deliveryDeadLine || !internalDeliveryUserId) {
        setError('Por favor, preencha todos os campos');
        return;
      }

      // Verificar se o usuário selecionou um usuário válido (não 0)
      if (internalDeliveryUserId === '0') {
        setError('Por favor, selecione um usuário para distribuição interna');
        return;
      }

      const fisicoData = {
        receivedAt,
        idDocument,
        deliveryDeadLine,
        internalDeliveryUserId: parseInt(internalDeliveryUserId),
        message,
      };

      //console.log('Enviando documento judicial fisico: ', fisicoData);

      if (id_fisico) {
        const response = await fisicosService.update(parseInt(id_fisico), fisicoData);
        //console.log('docuemnto judicial físico editado com sucesso: ', response);

        if (response) {
          setSuccess('Documento judicial físico editado com sucesso!');
        }

        setTimeout(() => {
          navigate('/fisicos');
        }, 2000);
      }
    } catch (error: any) {
      //console.log('Erro ao criar documento: ', error);

      // Tratamento de erro detalhado
      if (error.response) {
        //console.error('Status do erro:', error.response.status);
        //console.error('Dados do erro:', error.response.data);
        setError(
          `Erro ${error.response.status}: ${
            typeof error.response.data === 'string'
              ? error.response.data
              : error.response.data.message || error.response.data.error || 'Erro no servidor'
          }`
        );
      } else {
        setError('Erro ao criar documento judicial físico. Tente novamente.');
      }
    }
  };

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
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link to="/fisicos">
        <div className="inline-flex bg-blue-500 hover:bg-blue-700 p-1 rounded-md mb-8 sm:mt-0 sm:ml-2 sm:flex-none">
          <FaArrowLeftLong className="text-2xl text-white" />
        </div>
      </Link>

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Edite o documento judicial físico
          </h1>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
          {userName && <p className="mt-2 text-sm text-gray-600">Responsável atual: <span className="font-semibold">{userName}</span></p>}
        </div>
      </div>

      <div className="w-full md:w-1/2 mt-8">
        <label htmlFor="receivedAt" className="block text-lg font-medium text-gray-700 mb-1">
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
          placeholder="9999999-99.9999.9.99.9999"
          id="idDocument"
          value={idDocument}
          onChange={(e) => setIdDocument(e.target.value)}
        />
      </div>

      <div className="w-full md:w-1/2 mt-8">
        <label htmlFor="deliveryDeadLine" className="block text-lg font-medium text-gray-700 mb-1">
          Prazo de entrega:
        </label>
        <input
          type="date"
          className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
          name="deliveryDeadLine"
          id="deliveryDeadLine"
          value={deliveryDeadLine}
          onChange={(e) => setDeliveryDeadLine(e.target.value)}
        />
      </div>

      <div className="w-full md:w-1/2 mt-8">
        <label htmlFor="internalDelivery" className="block text-lg font-m text-gray-700 mb-1">
          Distribuição interna:
        </label>
        <div>
          <select
            name="internalDelivery"
            id="internalDelivery"
            value={internalDeliveryUserId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setInternalDeliveryUserId(e.target.value)
            }
            className="mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
          >
            <option value="0">Selecione o usuário</option>
            {users.map((user) => (
              <option key={user.id_user} value={user.id_user}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full md:w-1/2 mt-8">
        <label htmlFor="message" className="block text-lg font-m text-gray-700 mb-1">
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
          <Link to={'/fisicos'}>
            <button className="btn btn-primary me-2">Cancelar</button>
          </Link>

          <button onClick={handleSubmit} className="btn btn-primary" type="submit">
            Salvar dados
          </button>
        </div>
      </div>
    </div>
  );
}
