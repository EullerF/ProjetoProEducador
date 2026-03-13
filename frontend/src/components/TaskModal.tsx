import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

export default function TaskModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('media');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        title,
        description,
        priority,
        dueDate,
        categoryId: categoryId || undefined
      });
      onSuccess();
      onClose();
      // Reset
      setTitle('');
      setDescription('');
      setPriority('media');
      setDueDate('');
      setCategoryId('');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar tarefa');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="modal-content card-glass border-0 shadow-lg"
          >
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold text-dark">Nova Tarefa</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            
            <div className="modal-body pt-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-medium small text-secondary">Título</label>
                  <input 
                    type="text" required
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    className="form-control" 
                    placeholder="O que você precisa fazer?"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-medium small text-secondary">Descrição</label>
                  <textarea 
                    rows={3}
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    className="form-control" 
                    placeholder="Detalhes adicionais..."
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-medium small text-secondary">Data Limite</label>
                    <input 
                      type="date" 
                      value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                      className="form-control" 
                    />
                  </div>
                  
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-medium small text-secondary">Prioridade</label>
                    <select 
                      value={priority} onChange={(e) => setPriority(e.target.value)}
                      className="form-select"
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="urgente">Urgente 🔥</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium small text-secondary">Categoria</label>
                  <select 
                    value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Sem Categoria</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="d-flex justify-content-end gap-2 pt-2">
                  <button 
                    type="button" onClick={onClose}
                    className="btn btn-light fw-medium"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-primary-custom"
                  >
                    Salvar Tarefa
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
