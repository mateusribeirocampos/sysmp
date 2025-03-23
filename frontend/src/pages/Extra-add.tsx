import { useMemo, useState } from 'react';
import { IoReturnUpBackOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { user as usersData } from '../Data/users'

export function ExtraAdd() {
  const [receivedAt, setReceivedAt] = useState('');
  const [idDocument, setIdDocument] = useState('');
  const [DeliveryDeadline, setDeliveryDeadline] = useState('');
  const [internalDelivery, setInternalDelivery] = useState('');

  const activeUsers = useMemo(() => usersData.filter(user => user.status === 'active'), [])


  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link to="/extras">
        <div className="sm:mt-0 sm:ml-2 sm:flex-none">
          <IoReturnUpBackOutline className="inline-flex text-2xl mb-8 rounded-md text-white bg-blue-500 hover:bg-blue-700" />
        </div>
      </Link>

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Adicione um documento extrajudical
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
          placeholder='9999999-99.9999.9.99.9999'
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
          value={DeliveryDeadline}
          onChange={(e) => setDeliveryDeadline(e.target.value)}
        />
      </div>

      <div className="w-full md:w-1/2 mt-8">
        <label htmlFor="idDocument" className="block text-lg font-m text-gray-700 mb-1">
          Distribuição interna:
        </label>
        <div>
          <select 
          name="internalDelivery" 
          id="internalDelivery"
          value={internalDelivery}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInternalDelivery(e.target.value)}
          className='mt-1 block w-full rounded-md border-gray-300 p-1 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md'
          >
            <option value="0">Selecione o usuário</option>
            {activeUsers.map((user) => (
              <option key={user.id} value={user.id}>
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
          />
        </div>
      </div>

      <div className='mt-4 border-t pt-4'>
        <div className='d-flex justify-content-end'>
          <Link to={'/extras'}>
            <button className='btn btn-primary me-2'>
              Cancelar
            </button>
          </Link>

          <button
          onClick={() => console.log('Adicionado extrajudicial')}
          className='btn btn-primary'
          type='submit'
          >Salvar dados
          </button>
        </div>
      </div>

    </div>
  );
}
