import './App.css';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Signin from './components/signin';
import { useEffect } from 'react';
import Header from './shared/header';
import Dashboard from './components/dashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/signin' && localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate, location]);

  return (
    <div>
      <Header />
      <Toaster position='top-right' />
        <Routes>
          <Route path='/signin' element={
            localStorage.getItem('user')? <Navigate to="/" replace /> : <Signin />
          } />
          <Route path='/' element={
            !localStorage.getItem('user')? <Navigate to="/signin" replace /> : <Dashboard />
          } />
        </Routes>
    </div>
  );
}

export default App;
