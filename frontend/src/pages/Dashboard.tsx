import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from '../components/Modal';
import { DocumentosNoPrazo } from '../components/DocumentosNoPrazo';
import { extrasService, fisicosService } from '@/services/api';
import { Extras, Fisicos } from '@/types';

export function Dashboard() {
  const { user } = useAuth();
  const [extrasList, setExtrasList] = useState<Extras[]>([]);
  const [fisicosList, setFisicosList] = useState<Fisicos[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counts, setCounts] = useState({
    users: 0,
    extras: 0,
    fisicos: 0,
    pendentes: 0,
  });

  useEffect(() => {
    // Carregar os documentos extras e físicos de forma assíncrona
    const fetchDocuments = async () => {
      try {
        // Buscar os extras
        const extrasResponse = await extrasService.getAll();
        console.log('Dados de extrajudiciais retornados pela API:', extrasResponse);
        
        // Processar as datas com o mesmo ajuste usado em Extras.tsx
        const processedExtras = extrasResponse.map((doc: Extras) => {
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
        
        // Buscar os físicos
        const fisicosResponse = await fisicosService.getAll();
        console.log('Dados de físicos retornados pela API:', fisicosResponse);
        
        // Processar as datas com o mesmo ajuste usado em Fisicos.tsx
        const processedFisicos = fisicosResponse.map((doc: Fisicos) => {
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
        
        setFisicosList(processedFisicos);
        
        // Atualizar contadores locais
        const extrasCount = localStorage.getItem('extrasCount');
        const fisicosCount = localStorage.getItem('fisicosCount');
        const usersCount = localStorage.getItem('usersCount');

        setCounts((prev) => ({
          ...prev,
          extras: extrasCount ? parseInt(extrasCount) : 0,
          fisicos: fisicosCount ? parseInt(fisicosCount) : 0,
          users: usersCount ? parseInt(usersCount) : 0,
          pendentes: extrasCount && fisicosCount ? parseInt(extrasCount) + parseInt(fisicosCount) : 0,
        }));
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
      }
    };

    fetchDocuments();

    // Opcional: adicionar um listener para atualizações em tempo real
    const handleStorageChange = () => {
      const updatedExtrasCount = localStorage.getItem('extrasCount');
      const updatedFisicosCount = localStorage.getItem('fisicosCount');
      const updatedUsersCount = localStorage.getItem('usersCount');

      setCounts((prev) => ({
        ...prev,
        extras: updatedExtrasCount ? parseInt(updatedExtrasCount) : prev.extras,
        fisicos: updatedFisicosCount ? parseInt(updatedFisicosCount) : prev.fisicos,
        users: updatedUsersCount ? parseInt(updatedUsersCount) : prev.users,
        pendentes:
          updatedExtrasCount && updatedFisicosCount
            ? parseInt(updatedExtrasCount) + parseInt(updatedFisicosCount)
            : prev.extras + prev.fisicos,
      }));
    };

    // Ouvir mudanças no localStorage (se estiver em outra aba/janela)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Painel</h1>
          <p className="mt-2 text-sm text-gray-700">
            Bem-vindo, {user?.name}! Sistema de gerenciamento de documentos.
          </p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/users">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total de Usuários
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{counts.users}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/extras">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total de Extrajudiciais
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">{counts.extras}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/fisicos">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total de físicos</dt>
                    <dd className="text-lg font-medium text-gray-900">{counts.fisicos}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Documentos Pendentes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">{counts.pendentes}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Documentos Pendentes">
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-blue-700 mb-4">Judiciais físicios</h4>
              <DocumentosNoPrazo documents={fisicosList} tipo="físicos" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-blue-700 mb-4">Extrajudiciais</h4>
              <DocumentosNoPrazo documents={extrasList} tipo="extrajudiciais" />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
