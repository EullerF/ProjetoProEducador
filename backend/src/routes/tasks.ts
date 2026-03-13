import { Router } from 'express';
import prisma from '../db';
import { authenticateToken, AuthRequest } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

// Listar todas as tarefas do usuário (com filtros)
router.get('/', async (req: AuthRequest, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user!.id },
      include: {
        category: true,
        tags: true
      },
      orderBy: [
        { status: 'asc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

// Resumo do dashboard
router.get('/dashboard', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [total, concluida, atrasadas, paraHoje] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: 'concluida' } }),
      prisma.task.count({ 
        where: { 
          userId, 
          status: 'pendente',
          dueDate: { lt: today }
        } 
      }),
      prisma.task.count({
        where: {
          userId,
          status: 'pendente',
          dueDate: {
            gte: today,
            lt: tomorrow
          }
        }
      })
    ]);

    const pendente = total - concluida;

    res.json({
      total,
      concluida,
      pendente,
      atrasadas,
      paraHoje
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar dashboard' });
  }
});

// Criar tarefa
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title, description, dueDate, priority, categoryId, tagIds } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Título é obrigatório' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'media',
        userId: req.user!.id,
        categoryId: categoryId || null,
        tags: tagIds && tagIds.length > 0 ? {
          connect: tagIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: { category: true, tags: true }
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});

// Atualizar tarefa
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const { title, description, dueDate, priority, status, categoryId, tags } = req.body;
    
    // Check permission
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return res.status(404).json({ error: 'Tarefa não encontrada' });
    if (existingTask.userId !== req.user!.id) return res.status(403).json({ error: 'Sem permissão' });

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        status,
        categoryId,
        tags: {
          set: tags?.map((id: string) => ({ id })) || []
        }
      },
      include: { category: true, tags: true }
    });
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

// Deletar tarefa
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return res.status(404).json({ error: 'Tarefa não encontrada' });
    if (existingTask.userId !== req.user!.id) return res.status(403).json({ error: 'Sem permissão' });

    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});

// Toggle status da tarefa (completa / incompleta)
router.patch('/:id/toggle', async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return res.status(404).json({ error: 'Tarefa não encontrada' });
    if (existingTask.userId !== req.user!.id) return res.status(403).json({ error: 'Sem permissão' });

    const newStatus = existingTask.status === 'concluida' ? 'pendente' : 'concluida';

    const task = await prisma.task.update({
      where: { id },
      data: { status: newStatus },
      include: { category: true, tags: true }
    });
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

export default router;
