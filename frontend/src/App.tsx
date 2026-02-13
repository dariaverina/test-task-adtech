import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import LinkStats from './pages/LinkStats';

function AppRoutes() {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Загрузка...</div>;
    
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/stats/:slug" element={user ? <LinkStats /> : <Navigate to="/login" />} />
        </Routes>
    );
}

function App() {

  return (
    <AuthProvider>
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    </AuthProvider>
  )
}

export default App
