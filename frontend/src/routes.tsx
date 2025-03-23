import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Users } from './pages/Users'
import { Extras } from './pages/Extras'
import { Fisicos } from './pages/Fisicos'
import { ExtraAdd } from './pages/Extra-add'
import { FisicosAdd } from './pages/Fisicos-add'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/extras" element={<Extras />} />
            <Route path="/fisicos" element={<Fisicos />} />
            <Route path='/extra-add' element={<ExtraAdd/>} />
            <Route path='/fisico-add' element={<FisicosAdd />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App 