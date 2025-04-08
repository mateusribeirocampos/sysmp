import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Extras } from './pages/Extras';
import { Fisicos } from './pages/Fisicos';
import { ExtraAdd } from './pages/Extra-add';
import { ExtraEdit } from './pages/Extra-edit';
import { FisicoAdd } from './pages/Fisico-add';
import { FisicoEdit } from './pages/Fisico-edit';
import { UsersAdd } from './pages/Users-add';
import { UsersEdit } from './pages/Users-edit';
import { AdminRoute } from './components/AdminRoute';


const NotFound = () => {
  return (
    <div className="p-96 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      <h1 className="text-center p-4">404 - Página não encontrada</h1>
      <p>A página que você procura não existe.</p>
    </div>
  );
};


function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route 
            path="/users"
            element={<AdminRoute>
              <Users />
            </AdminRoute>
            } />
            <Route 
            path="/users/add"
            element={<AdminRoute>
              <UsersAdd />
            </AdminRoute>
            } />
            <Route 
            path="/users/edit/:id"
            element={<AdminRoute>
              <UsersEdit />
            </AdminRoute>
            } />
            <Route 
            path="/users/delete/:id"
            element={<AdminRoute>
              <UsersEdit />
            </AdminRoute>
            } />
            <Route path="/extras" element={<Extras />} />
            <Route path="/extra/add" element={<ExtraAdd />} />
            <Route path="/extra/edit/:id_extra" element={<ExtraEdit />} />
            <Route path="/fisicos" element={<Fisicos />} />
            <Route path="/fisico/add" element={<FisicoAdd />} />
            <Route path="/fisico/edit/:id_fisico" element={<FisicoEdit />} />

          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
