import { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { extrasService } from '@/services/api';
import { userService } from '@/services/api';
import type { User, Extras } from '@/types';
import { Modal } from '@/components/Modal';
import { useSocketEvent } from '../services/websocket';

// Definição do tipo para os eventos de WebSocket
interface WebSocketEvent {
  type: 'extra' | 'fisico' | 'user';
  action: 'create' | 'update' | 'delete';
  id?: string | number;
}

export function Extras() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [extrasList, setExtrasList] = useState<Extras[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [updatingDocuments, setUpdatingDocuments] = useState<string[]>([]);
  const [deliveredDocuments, setDeliveredDocuments] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [extraToDelete, setExtraToDelete] = useState<number | null>(null);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Extras | '';
    direction: 'asc' | 'desc';
  }>({ key: '', direction: 'asc' });

  useEffect(() => {
    loadDocuments();
    loadAllUsers(); // Carregar todos os usuários disponíveis
    // Carregar documentos entregues do localStorage se existirem
    const savedDelivered = localStorage.getItem('deliveredExtras');
    if (savedDelivered) {
      setDeliveredDocuments(JSON.parse(savedDelivered));
    }
  }, []);

  // Adicionar esta parte para escutar eventos de WebSocket
  useSocketEvent<WebSocketEvent>('data-changed', (data) => {
    // Quando recebe notificação de mudança nos dados, recarrega os dados
    if (data.type === 'extra') {
      console.log('Dados de extras alterados:', data);
      loadDocuments();
    }
  });

  // Atualiza o total de páginas quando a lista ou termos por página muda
  useEffect(() => {
    setTotalPages(Math.ceil(filteredDocuments.length / itemsPerPage));
  }, [extrasList, itemsPerPage, searchTerm]);

  function toEdit(id_extra: number) {
    // Implementar lógica para editar o documento
    //console.log('Editando documento:', id_extra);
    navigate(`/extra/edit/${id_extra}`);
  }

  function deleteExtra(id_extra: number) {
    // Open modal and store the id to delete
    setExtraToDelete(id_extra);
    setIsDeleteModalOpen(true);
  }

  const confirmDeleteExtra = async () => {
    if (extraToDelete) {
      try {
        await extrasService.delete(extraToDelete);
        // Reload documents after successful deletion
        loadDocuments();
      } catch (err) {
        //console.error('Erro ao excluir documento:', err);
        setError('Erro ao excluir documento');
      } finally {
        // Close modal and reset state
        setIsDeleteModalOpen(false);
        setExtraToDelete(null);
      }
    }
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      //console.log('iniciando carregamento de documentos extras...');

      const extrasDocs = await extrasService.getAll();
      //console.log('Extrajudicias carregados:', extrasDocs);

      // Converter strings de data para objetos Date com ajustes de timezone
      const processedExtras = extrasDocs.map((doc: Extras) => {
        // Criar novas datas a partir das strings
        const receivedDate = new Date(doc.receivedAt);
        const deliveryDate = new Date(doc.deliveryDeadLine);

        // Ajustar para o timezone local para evitar a defasagem de um dia
        const adjustedReceivedDate = new Date(
          receivedDate.getTime() + receivedDate.getTimezoneOffset() * 60000
        );
        const adjustedDeliveryDate = new Date(
          deliveryDate.getTime() + deliveryDate.getTimezoneOffset() * 60000
        );

        return {
          ...doc,
          receivedAt: adjustedReceivedDate,
          deliveryDeadLine: adjustedDeliveryDate,
        };
      });

      setExtrasList(processedExtras);

      if (processedExtras.length === 0) {
        localStorage.removeItem('deliveredExtras');
      }

      const countExtras = await extrasService.getCount();
      //console.log('Total de extrajudiciais: ', countExtras);
      localStorage.setItem('extrasCount', countExtras.toString());
    } catch (err) {
      setError('Erro ao carregar documentos extrajudiciais');
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      setLoading(true);
      // Buscar todos os usuários ativos
      const allUsers = await userService.getAll();
      const activeUsers = allUsers.filter((user) => user.status === 'active');
      setUsers(activeUsers);
    } catch (err) {
      //console.log('Erro ao carregar usuários:', err);
      setError('Erro ao carregar lista de usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageChange = (idDocument: string, newMessage: string) => {
    setExtrasList(
      extrasList.map((doc) =>
        doc.idDocument === idDocument ? { ...doc, message: newMessage } : doc
      )
    );
  };

  // Atualizar a função handleInternalDeliveryChange para persistir a mudança
  const handleInternalDeliveryChange = async (idDocument: string, userId: number) => {
    try {
      // Indicar que está atualizando este documento
      setUpdatingDocuments((prev) => [...prev, idDocument]);

      // Atualizar localmente
      setExtrasList(
        extrasList.map((doc) =>
          doc.idDocument === idDocument ? { ...doc, internalDeliveryUserId: userId } : doc
        )
      );

      // Enviar atualização para o backend
      await extrasService.updateInternalDelivery(idDocument, userId);
    } catch (error) {
      //console.error('Erro ao atualizar responsável:', error);
      // Reverter a mudança em caso de erro
      loadDocuments();
    } finally {
      // Remover o indicador de atualização
      setUpdatingDocuments((prev) => prev.filter((id) => id !== idDocument));
    }
  };

  const calculateDaysRemaining = (deliveryDeadline: Date): number => {
    // Obter a data atual sem componente de hora (apenas o dia)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Obter apenas o componente de dia da data de prazo
    const deadline = new Date(deliveryDeadline);
    deadline.setHours(0, 0, 0, 0);

    // Calcular a diferença em milissegundos
    const timeDiff = deadline.getTime() - today.getTime();

    // Converter para dias (86400000 = 24 * 60 * 60 * 1000)
    return Math.ceil(timeDiff / 86400000);
  };

  // função de ordenação
  const requestSort = (key: keyof Extras) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtrar por documentos
  const filteredDocuments = extrasList
    .filter((doc) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        doc.idDocument.toLowerCase().includes(searchLower) ||
        (doc.message && doc.message.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Verifica se os valores são undefinied ou null
      if (aValue === undefined || aValue === null) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (bValue === undefined || bValue === null) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // pegar os itens da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

  // Navegação das páginas
  const paginate = (pageNumber: number) => {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;
    setCurrentPage(pageNumber);

    // Rolar a tabela para o topo
    const tableElement = document.getElementById('extras-table');
    if (tableElement) tableElement.scrollIntoView({ behavior: 'smooth' });
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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Extrajudicais</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos os extrajudiciais cadastrados no sistema.
          </p>
        </div>

        <Link to="/extra/add">
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Adicionar documento
            </button>
          </div>
        </Link>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative rounded-md shadow-sm w-full sm:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-700">Mostrar</span>
          <select
            className="mx-2 rounded-md border-gray-300 py-1 text-sm focurs:border-blue-500 focus:ring-blue-500"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">Itens por página</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table id="extras-table" className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-2 pl-2 pr-2 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer"
                      onClick={() => requestSort('receivedAt' as keyof Extras)}
                    >
                      <div className="flex items-center group">
                        Data da Comunicação
                        <span className="ml-2 invisible group-hover:visible">
                          {sortConfig.key === 'receivedAt'
                            ? sortConfig.direction === 'asc'
                              ? '↑'
                              : '↓'
                            : '↕'}
                        </span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => requestSort('idDocument' as keyof Extras)}
                    >
                      <div className="flex items-center group">
                        Número ID
                        <span className="ml-2 invisible group-hover:visible">
                          {sortConfig.key === 'idDocument'
                            ? sortConfig.direction === 'asc'
                              ? '↑'
                              : '↓'
                            : '↕'}
                        </span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Dias até o prazo
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => requestSort('deliveryDeadLine' as keyof Extras)}
                    >
                      <div className="flex items-center group">
                        Prazo de entrega
                        <span className="ml-2 invisible group-hover:visible">
                          {sortConfig.key === 'deliveryDeadLine'
                            ? sortConfig.direction === 'asc'
                              ? '↑'
                              : '↓'
                            : '↕'}
                        </span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Distribuição interna
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      Mensagem
                    </th>
                    <th scope="col" className="relative py-2 pl-2 pr-2 sm:pr-6">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-4 text-center text-sm text-gray-500">
                        {searchTerm
                          ? 'Nenhum documento encontrado para esta busca.'
                          : 'Nenhum documento disponível.'}
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((doc) => {
                      const daysRemaining = calculateDaysRemaining(doc.deliveryDeadLine);

                      const isExpired = daysRemaining < 0;
                      const isZeroTerm = daysRemaining == 0;
                      const isAlmostDead = daysRemaining > 0 && daysRemaining <= 3;
                      const isDelivered = deliveredDocuments.includes(doc.idDocument);
                      return (
                        <tr
                          key={doc.idDocument}
                          className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {doc.receivedAt.toLocaleDateString('pt-BR')}
                          </td>
                          <td
                            className={`whitespace-nowrap px-2 py-2 text-sm text-gray-500 ${
                              isDelivered ? 'bg-green-100 text-green-800' : 'text-gray-500'
                            }`}
                          >
                            {doc.idDocument}
                          </td>
                          <td
                            className={`text-center whitespace-nowrap px-3 py-4 text-sm ${
                              isDelivered
                                ? 'bg-green-100 text-green-800'
                                : isExpired
                                  ? 'bg-red-200 text-red-800'
                                  : isAlmostDead
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : isZeroTerm
                                      ? 'bg-red-100 text-red-600'
                                      : 'text-gray-500'
                            }`}
                          >
                            {daysRemaining}
                          </td>
                          <td
                            className={`text-center whitespace-nowrap px-3 py-4 text-sm ${
                              isDelivered
                                ? 'bg-green-100 text-green-800'
                                : isExpired
                                  ? 'bg-red-200 text-red-800'
                                  : isAlmostDead
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : isZeroTerm
                                      ? 'bg-red-100 text-red-600'
                                      : 'text-gray-500'
                            }`}
                          >
                            {doc.deliveryDeadLine.toLocaleDateString('pt-BR')}
                            {isZeroTerm && (
                              <span className="ml-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 inline"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3,0 C2.44772,0 2,0.447715 2,1 C2,1.55228 2.44772,2 3,2 L3,3.17157 C3,3.96722 3.31607,4.73028 3.87868,5.29289 L6.58579,8 L3.87868,10.7071 C3.31607,11.2697 3,12.0328 3,12.8284 L3,14 C2.44772,14 2,14.4477 2,15 C2,15.5523 2.44772,16 3,16 L13,16 C13.5523,16 14,15.5523 14,15 C14,14.4477 13.5523,14 13,14 L13,12.8284 C13,12.0328 12.6839,11.2697 12.1213,10.7071 L9.41421,8 L12.1213,5.29289 C12.6839,4.73028 13,3.96722 13,3.17157 L13,2 C13.5523,2 14,1.55228 14,1 C14,0.447715 13.5523,0 13,0 L3,0 Z M11,2 L5,2 L5,3.17157 C5,3.43679 5,3.69114 5.29289,3.87868 L5.41421,4 L10.5858,4 L10.7071,3.87868 C10.8946,3.69114 11,3.43679 11,3.17157 L11,2 Z M8,9.41421 L5.29289,12.1213 C5.10536,12.3089 5,12.5632 5,12.8284 L5,14 L11,14 L11,12.8284 C11,12.5632 10.8946,12.3089 10.7071,12.1213 L8,9.41421 Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            )}
                            {isExpired && (
                              <span className="ml-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 inline"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="relative">
                              {updatingDocuments.includes(doc.idDocument) && (
                                <div className="absolute right-2 top-2">
                                  <div className="animate-spin h-4 w-4 border-b-2 border-blue-500 rounded-full"></div>
                                </div>
                              )}

                              <select
                                name={`user-${doc.idDocument}`}
                                id={`user-${doc.idDocument}`}
                                value={doc.internalDeliveryUserId || ''}
                                onChange={(e) =>
                                  handleInternalDeliveryChange(
                                    doc.idDocument,
                                    Number(e.target.value)
                                  )
                                }
                                disabled={updatingDocuments.includes(doc.idDocument)}
                                className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500"
                              >
                                <option value="">Selecione o usuário</option>
                                {users.map((user) => (
                                  <option key={user.id_user} value={user.id_user}>
                                    {user.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            <textarea
                              value={doc.message || ''}
                              onChange={(e) => handleMessageChange(doc.idDocument, e.target.value)}
                              className="w-full p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              rows={2}
                              style={{ resize: 'vertical', minHeight: '60px' }}
                            />
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => {
                                  if (!isDelivered) {
                                    setDeliveredDocuments((prev) => {
                                      const updated = [...prev, doc.idDocument];
                                      localStorage.setItem(
                                        'deliveredExtras',
                                        JSON.stringify(updated)
                                      );
                                      return updated;
                                    });
                                  }
                                }}
                                className={`rounded-full p-1.5 ${
                                  isDelivered
                                    ? 'bg-green-100 text-green-600 cursor-default'
                                    : 'bg-white text-gray-400 hover:bg-green-50 hover:text-green-600 border border-gray-200'
                                }`}
                                title={isDelivered ? 'Documento entregue' : 'Marcar como entregue'}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  toEdit(doc.id_extra);
                                }}
                                className={`rounded-full p-1.5 ${
                                  isDelivered
                                    ? 'bg-blue-100 text-blue-400 cursor-default'
                                    : 'bg-white text-gray-400 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                                }`}
                                disabled={isDelivered}
                                title={isDelivered ? 'Documento entregue' : 'Editar documento'}
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
                                onClick={() => deleteExtra(doc.id_extra)}
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
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Paginação */}
      {filteredDocuments.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Página <span className="font-medium">{indexOfFirstItem + 1}</span> a{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredDocuments.length)}
                </span>{' '}
                de <span className="font-medium">{filteredDocuments.length}</span> resultados
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Primeira</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Mostrar números de página com elipses inteligentes */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Sempre mostrar a primeira e última página
                    if (page === 1 || page === totalPages) return true;

                    // Sempre mostrar páginas próximas à atual
                    if (Math.abs(page - currentPage) <= 1) return true;

                    // Não mostrar outras páginas (serão elipses)
                    return false;
                  })
                  .map((page, index, array) => {
                    // Adicionar elipses quando necessário
                    const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;

                    return (
                      <Fragment key={page}>
                        {showEllipsisBefore && (
                          <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => paginate(page)}
                          className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </Fragment>
                    );
                  })}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Próximo</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 011.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Última</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 000 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirmar exclusão"
          message="Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita."
          onConfirm={confirmDeleteExtra}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}
