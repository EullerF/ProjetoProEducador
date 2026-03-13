import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, LogOut, Tag as TagIcon, Plus, Trash2 } from 'lucide-react';
import api from '../../api/axios';

interface Tag {
  id: string;
  name: string;
  color: string;
}

export default function ProfileView() {
  const { user, logout } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#888888');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const response = await api.get('/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Erro ao buscar tags', error);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      await api.post('/tags', { name: newTagName, color: newTagColor });
      setNewTagName('');
      setNewTagColor('#888888');
      loadTags();
    } catch (error) {
      console.error('Erro ao criar tag', error);
    }
  };

  return (
    <div className="card-glass p-0 overflow-hidden" style={{ minHeight: '600px' }}>
      {/* Profile Header */}
      <div className="bg-primary-50 p-5 border-bottom border-primary-100 d-flex flex-column flex-md-row align-items-center gap-4">
        <div className="rounded-circle bg-white shadow-sm overflow-hidden d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-100 h-100 object-fit-cover" />
          ) : (
             <UserIcon size={48} className="text-secondary" />
          )}
        </div>
        <div className="text-center text-md-start flex-grow-1">
          <h3 className="fw-bold text-dark mb-1">{user?.name}</h3>
          <p className="text-secondary mb-3">{user?.email}</p>
        </div>
        <div>
           <button onClick={logout} className="btn text-danger d-flex align-items-center gap-2 fw-medium border border-danger-subtle bg-white hover-bg-danger-subtle rounded-pill px-4">
              <LogOut size={18} />
              Sair da Conta
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 p-md-5">
        <div className="row">
          <div className="col-12 col-xl-6">
            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <TagIcon className="text-primary" />
              Minhas Tags Customizadas
            </h5>
            
            <form onSubmit={handleCreateTag} className="d-flex gap-2 mb-4 bg-light p-3 rounded-lg border">
               <input 
                 type="color" 
                 value={newTagColor}
                 onChange={(e) => setNewTagColor(e.target.value)}
                 className="form-control form-control-color p-1"
                 title="Escolha a cor da tag"
               />
               <input 
                 type="text" 
                 placeholder="Nova tag (ex: Prioridade Máxima)"
                 value={newTagName}
                 onChange={(e) => setNewTagName(e.target.value)}
                 className="form-control bg-white"
               />
               <button type="submit" className="btn btn-primary d-flex align-items-center gap-2" disabled={!newTagName.trim()}>
                 <Plus size={18} />
                 Criar
               </button>
            </form>

            <div className="d-flex flex-wrap gap-2">
              {tags.map(tag => (
                <div key={tag.id} className="badge d-flex align-items-center gap-2 py-2 px-3 fw-medium text-dark border" style={{ backgroundColor: `${tag.color}20`, borderColor: tag.color }}>
                   <div className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: tag.color }}></div>
                   {tag.name}
                </div>
              ))}
              {tags.length === 0 && (
                <p className="text-secondary small">Nenhuma tag criada ainda. Comece a criar tags acima para organizar suas tarefas!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
