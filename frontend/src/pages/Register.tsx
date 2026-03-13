import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ArrowRight, UserPlus } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
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
      const response = await api.post('/auth/register', { name, email, password });
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao registrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glass p-5 w-100 position-relative z-1"
        style={{ maxWidth: '420px', margin: '1rem' }}
      >
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary-soft text-primary p-3 rounded-4 mb-3">
            <UserPlus size={32} />
          </div>
          <h2 className="fw-bold text-dark mb-1">Crie sua conta</h2>
          <p className="text-secondary small">Comece a organizar sua vida agora</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="alert alert-danger py-2 px-3 small rounded-3 d-flex align-items-center gap-2 mb-4">
            <Lock size={16} /> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 position-relative">
            <label className="form-label small fw-medium text-secondary">Nome Completo</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-secondary"><User size={18} /></span>
              <input 
                type="text" required
                value={name} onChange={(e) => setName(e.target.value)}
                className="form-control border-start-0 ps-0 shadow-none py-2" 
                placeholder="Seu nome"
              />
            </div>
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label small fw-medium text-secondary">E-mail</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-secondary"><Mail size={18} /></span>
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
            {loading ? 'Criando conta...' : (
              <>Criar conta <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="text-center text-secondary small mb-0">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary fw-medium text-decoration-none">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
