import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'

export function Dashboard() {
  const { user } = useAuth()
  const [counts, setCounts] = useState({
    users: 0,
    extras: 0,
    fisicos: 0,
    pendentes: 0
  })

  useEffect(() => {
    const extrasCount = localStorage.getItem('extrasCount')
    const fisicosCount = localStorage.getItem('fisicosCount')
    const usersCount = localStorage.getItem('usersCount')
    //const pendentesDoc = localStorage.getItem('extrasCount' + 'fisicosCount')

    setCounts(prev => ({
      ...prev,
      extras: extrasCount ? parseInt(extrasCount) : 0,
      fisicos: fisicosCount ? parseInt(fisicosCount) : 0,
      users: usersCount ? parseInt(usersCount) : 0,
      pendentes: (extrasCount && fisicosCount) ? parseInt(extrasCount) + parseInt(fisicosCount) : 0,
    }))

    // Opcional: adicionar um listener para atualizações em tempo real
    const handleStorageChange = () => {
      const updatedExtrasCount = localStorage.getItem('extrasCount')
      const updatedFisicosCount = localStorage.getItem('fisicosCount')
      const updatedUsersCount = localStorage.getItem('usersCount')
      //const updatedPendentesDoc = localStorage.getItem('extrasCount' + 'fisicosCount')
      setCounts(prev => ({
        ...prev,
        extras: updatedExtrasCount ? parseInt(updatedExtrasCount) : prev.extras,
        fisicos: updatedFisicosCount ? parseInt(updatedFisicosCount) : prev.fisicos,
        users: updatedUsersCount ? parseInt(updatedUsersCount) : prev.users,
        pendentes: (updatedExtrasCount && updatedFisicosCount) 
          ? parseInt(updatedExtrasCount) + parseInt(updatedFisicosCount) 
          : prev.extras + prev.fisicos,
      }))
    }
    
    // Ouvir mudanças no localStorage (se estiver em outra aba/janela)
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

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
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Usuários</dt>
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
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Extrajudiciais</dt>
                  <dd className="text-lg font-medium text-gray-900">{counts.extras}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        </Link>

        <Link to='/fisicos'>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Documentos Pendentes</dt>
                  <dd className="text-lg font-medium text-gray-900">{counts.pendentes}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 