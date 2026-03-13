import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, User, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao efetuar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light position-relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="position-absolute rounded-circle"
        style={{ width: '400px', height: '400px', background: 'rgba(79, 70, 229, 0.2)', filter: 'blur(80px)', top: '-10%', left: '-10%' }}
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }} 
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="position-absolute rounded-circle"
        style={{ width: '500px', height: '500px', background: 'rgba(56, 189, 248, 0.2)', filter: 'blur(80px)', bottom: '-10%', right: '-10%' }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glass p-5 w-100 position-relative z-1"
        style={{ maxWidth: '420px', margin: '1rem' }}
      >
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary-soft text-primary p-3 rounded-4 mb-3">
            <CheckCircle size={32} />
          </div>
          <h2 className="fw-bold text-dark mb-1">Bem-vindo de volta</h2>
          <p className="text-secondary small">Gerencie suas tarefas com elegância</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert alert-danger py-2 px-3 small rounded-3 d-flex align-items-center gap-2 mb-4">
            <Lock size={16} /> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 position-relative">
            <label className="form-label small fw-medium text-secondary">E-mail</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-secondary"><User size={18} /></span>
              <input 
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="form-control border-start-0 ps-0 shadow-none py-2" 
                placeholder="seu@email.com"
              />
            </div>
          </div>
          
          <div className="mb-4 position-relative">
            <label className="form-label small fw-medium text-secondary">Senha</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-secondary"><Lock size={18} /></span>
              <input 
                type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="form-control border-start-0 ps-0 shadow-none py-2" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="btn btn-primary-custom w-100 py-3 mb-4 d-flex align-items-center justify-content-center gap-2"
          >
            {loading ? 'Entrando...' : (
              <>Entrar <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="text-center text-secondary small mb-0">
          Ainda não tem conta?{' '}
          <Link to="/register" className="text-primary fw-medium text-decoration-none">
            Criar agora
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
