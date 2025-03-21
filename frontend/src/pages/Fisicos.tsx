import { useState, useEffect } from 'react'
import { fisicos } from '../Data/fisicos'

export function Fisicos() {
  const [fisicosList, setFisicosList] = useState(fisicos)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      // Por enquanto, usando os dados mockados
      setFisicosList(fisicos)

      localStorage.setItem('fisicosCount', fisicos.length.toString())
    } catch (err) {
      setError('Erro ao carregar processos físicos')
    } finally {
      setLoading(false)
    }
  }

  const handleMessageChange = (idDocument: number, newMessage: string) => {
    setFisicosList(fisicosList.map(doc => 
      doc.idDocument === idDocument ? { ...doc, message: newMessage } : doc
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Processos físicos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos os processos físicos cadastrados no sistema.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Adicionar documento
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Data da Comunicação
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Número ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Classe do Documento
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Dias até o prazo
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Prazo de entrega
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Distribuição interna
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Mensagem
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {fisicosList.map((doc) => {
                    const isExpired = new Date() > doc.DeliveryDeadline;
                    const isAlmostDead = doc.countDaysDelivery <= 5 && doc.countDaysDelivery > 0;
                    const isDelivered = doc.countDaysDelivery <= 0;
                    
                    return (
                      <tr key={doc.idDocument}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {doc.receivedAt.toLocaleDateString('pt-BR')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {doc.idDocument}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {doc.classeDocument}
                        </td>
                        <td className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500 ${
                          isExpired 
                            ? 'bg-red-100 text-red-800' 
                            : isDelivered 
                            ? 'bg-green-100 text-green-800'
                            : isAlmostDead
                            ? 'bg-yellow-100 text-yellow-800'
                            : ''
                        }`}>
                          {doc.countDaysDelivery}
                        </td>
                        <td className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500 ${
                          isExpired 
                            ? 'bg-red-100 text-red-800' 
                            : isDelivered 
                            ? 'bg-green-100 text-green-800'
                            : isAlmostDead
                            ? 'bg-yellow-100 text-yellow-800'
                            : ''
                        }`}>
                          {doc.DeliveryDeadline.toLocaleDateString('pt-BR')}
                          {isExpired && (
                            <span className="ml-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {doc.internalDelivery}
                        </td>
                        <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                          <textarea
                            value={doc.message}
                            onChange={(e) => handleMessageChange(doc.idDocument, e.target.value)}
                            className="w-full p-2 border rounded resize"
                            rows={2}
                            style={{ resize: 'both' }}
                          />
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-3">
                            {!isDelivered && (
                              <button
                                onClick={() => {/* TODO: Implementar entrega */}}
                                className="text-white bg-green-600 hover:bg-green-100 border border-transparent hover:text-green-600"
                                title="Marcar como entregue"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => {/* TODO: Implementar edição */}}
                              className="text-white bg-blue-700 hover:bg-slate-100 border border-transparent hover:text-blue-700"
                              title="Editar documento"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {/* TODO: Implementar exclusão */}}
                              className="text-white bg-red-600 hover:bg-red-100 border border-transparent hover:text-red-600"
                              title="Excluir documento"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
