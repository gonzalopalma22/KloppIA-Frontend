import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Materias from './pages/Materias';
import Apuntes from './pages/Apuntes';
import AdminPanel from './pages/AdminPanel.jsx';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.rol !== 'ROLE_ADMIN') return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/materias" element={<PrivateRoute><Materias /></PrivateRoute>} />
      <Route path="/materias/:id/apuntes" element={<PrivateRoute><Apuntes /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;