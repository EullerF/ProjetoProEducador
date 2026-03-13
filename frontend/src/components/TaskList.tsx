import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, Tag } from 'lucide-react';
import api from '../api/axios';

export default function TaskList({ tasks, onTaskUpdate }: { tasks: any[], onTaskUpdate: () => void }) {
  
  const toggleTask = async (id: string) => {
    try {
      await api.patch(`/tasks/${id}/toggle`);
      onTaskUpdate();
    } catch(err) {
      console.error(err);
    }
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'urgente') return 'text-red-600 bg-red-100';
    if (priority === 'baixa') return 'text-blue-600 bg-blue-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  return (
    <div className="d-flex flex-column gap-3">
      {tasks.length === 0 ? (
        <p className="text-secondary small text-center py-5">Nenhuma tarefa encontrada.</p>
      ) : (
        tasks.map((task, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={task.id}
            className={`d-flex align-items-start gap-3 p-3 rounded-4 border transition-all ${task.status === 'concluida' ? 'bg-light border-light' : 'bg-white border-light bg-opacity-75 shadow-sm'}`}
          >
            <button onClick={() => toggleTask(task.id)} className="btn p-0 border-0 mt-1 flex-shrink-0 bg-transparent">
              {task.status === 'concluida' ? 
                <CheckCircle className="text-success" size={24} /> : 
                <Circle className="text-secondary opacity-50" size={24} />
              }
            </button>
            <div className={`flex-grow-1 ${task.status === 'concluida' ? 'opacity-50' : ''}`}>
              <h6 className={`fw-bold text-dark mb-1 ${task.status === 'concluida' ? 'text-decoration-line-through' : ''}`}>
                {task.title}
              </h6>
              {task.description && <p className="small text-secondary mb-2">{task.description}</p>}
              
              <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
                {task.dueDate && (
                  <span className="badge bg-light text-secondary d-flex align-items-center rounded-pill py-2 px-3 fw-medium border">
                    <Clock size={12} className="me-1" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                
                <span className={`badge rounded-pill text-capitalize py-2 px-3 ${getPriorityColor(task.priority)}`}>
                  {task.priority === 'urgente' ? 'Urgente 🔥' : task.priority}
                </span>

                {task.category && (
                  <span className="badge rounded-pill d-flex align-items-center py-2 px-3" style={{ backgroundColor: task.category.color + '20', color: task.category.color, border: `1px solid ${task.category.color}40` }}>
                    <Tag size={12} className="me-1" />
                    {task.category.name}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
