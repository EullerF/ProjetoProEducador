import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { CheckCircle, LogOut, LayoutDashboard, Plus, AlertCircle, Clock, User as UserIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';
import ProfileView from './DashboardViews/ProfileView';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, concluida: 0, pendente: 0, atrasadas: 0, paraHoje: 0 });
  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'panel' | 'tasks' | 'profile'>('panel');

  const chartData = [
    { name: 'Seg', concluídas: 4, pendentes: 2 },
    { name: 'Ter', concluídas: 3, pendentes: 5 },
    { name: 'Qua', concluídas: 7, pendentes: 1 },
    { name: 'Qui', concluídas: 2, pendentes: 6 },
    { name: 'Sex', concluídas: 5, pendentes: 3 },
    { name: 'Sáb', concluídas: 8, pendentes: 0 },
    { name: 'Dom', concluídas: 9, pendentes: 1 },
  ];

  const loadData = useCallback(() => {
    api.get('/tasks/dashboard').then(res => setStats(res.data)).catch(console.error);
    api.get('/tasks').then(res => setTasks(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 text-primary-600 font-bold text-xl">
            <LayoutDashboard className="h-6 w-6" />
            <span>TaskDash</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a 
            onClick={() => setActiveView('panel')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${activeView === 'panel' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Painel Geral
          </a>
          <a 
            onClick={() => setActiveView('tasks')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${activeView === 'tasks' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <CheckCircle className="h-5 w-5" />
            Minhas Tarefas
          </a>
          <a 
            onClick={() => setActiveView('profile')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${activeView === 'profile' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <UserIcon className="h-5 w-5" />
            Meu Perfil
          </a>
        </nav>

        <div className="p-4 border-top">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '40px', height: '40px' }}>
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="fw-medium small text-dark mb-0">{user?.name}</p>
              <p className="text-secondary" style={{ fontSize: '0.75rem' }}>{user?.email || 'admin'}</p>
            </div>
          </div>
          <div className="mt-auto">
            <button onClick={logout} className="btn w-100 text-danger d-flex align-items-center gap-3 py-2 px-3 fw-medium rounded text-start" style={{ background: '#f8d7da' }}>
              <LogOut className="fs-5" />
              Sair da Conta
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-4 p-lg-5 overflow-auto">
        <div className="container-fluid max-w-7xl mx-auto">
          <header className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="fs-2 fw-bold text-dark mb-1"
              >
                Olá, {user?.name.split(' ')[0]} 👋
              </motion.h1>
              <p className="text-secondary mb-0">Aqui está o resumo da sua vida hoje.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary-custom d-flex align-items-center gap-2">
              <Plus className="fs-5" />
              Nova Tarefa
            </button>
          </header>

          {/* Dynamic Views */}
          {activeView === 'panel' && (
            <>
              {/* Stats Grid */}
              <div className="row g-4 mb-5">
                {[
                  { label: 'Total de Tarefas', value: stats.total, icon: LayoutDashboard, textClass: 'text-primary', bgClass: 'bg-primary-soft' },
                  { label: 'Para Hoje', value: stats.paraHoje, icon: Clock, textClass: 'text-warning', bgClass: 'bg-warning-soft' },
                  { label: 'Concluídas', value: stats.concluida, icon: CheckCircle, textClass: 'text-success', bgClass: 'bg-success-soft' },
                  { label: 'Atrasadas', value: stats.atrasadas, icon: AlertCircle, textClass: 'text-danger', bgClass: 'bg-danger-soft' },
                ].map((stat, i) => (
                  <div className="col-12 col-sm-6 col-lg-3" key={stat.label}>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="card-glass p-4 d-flex align-items-center gap-3"
                    >
                      <div className={`stat-icon-wrapper ${stat.bgClass}`}>
                        <stat.icon className={`${stat.textClass} fs-4`} />
                      </div>
                      <div>
                        <p className="text-secondary small fw-medium mb-1">{stat.label}</p>
                        <p className="fs-4 fw-bold text-dark mb-0">{stat.value}</p>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Charts & Lists Area */}
              <div className="row g-4">
                <div className="col-12 col-lg-8">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="card-glass p-4 h-100"
                  >
                    <h5 className="fw-bold text-dark mb-4">Desempenho da Semana</h5>
                    <div style={{ height: '300px', width: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorConcluidas" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#198754" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#198754" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorPendentes" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="concluídas" stroke="#198754" strokeWidth={3} fillOpacity={1} fill="url(#colorConcluidas)" />
                      <Area type="monotone" dataKey="pendentes" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorPendentes)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            <div className="col-12 col-lg-4">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="card-glass p-4 d-flex flex-column h-100"
                style={{ minHeight: '400px' }}
              >
                <h5 className="fw-bold text-dark mb-4">Minhas Tarefas</h5>
                
                <div className="flex-grow-1 overflow-auto pe-2">
                  <TaskList tasks={tasks} onTaskUpdate={loadData} />
                </div>
              </motion.div>
                </div>
              </div>
            </>
          )}

          {activeView === 'tasks' && (
            <div className="card-glass p-4" style={{ minHeight: '600px' }}>
               <h5 className="fw-bold text-dark mb-4">Gerenciar Tarefas</h5>
               <TaskList tasks={tasks} onTaskUpdate={loadData} />
            </div>
          )}

          {activeView === 'profile' && (
            <ProfileView />
          )}
        </div>
      </main>
      
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={loadData} 
      />
    </div>
  );
}
