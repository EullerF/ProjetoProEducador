import { Router } from 'express';
import prisma from '../db';
import { authenticateToken, AuthRequest } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

// Listar categorias
router.get('/', async (req: AuthRequest, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// Criar categoria
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, color } = req.body;
    const category = await prisma.category.create({
      data: {
        name,
        color: color || '#888888',
        userId: req.user!.id,
        isDefault: false
      }
    });
    res.status(201).json(category);
  } catch (error) {
    if ((error as any).code === 'P2002') {
      res.status(400).json({ error: 'Categoria já existe' });
    } else {
      res.status(500).json({ error: 'Erro ao criar categoria' });
    }
  }
});

// Deletar categoria
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const id = req.params.id as string;
    const category = await prisma.category.findUnique({ where: { id } });
    
    if (!category) return res.status(404).json({ error: 'Categoria não encontrada' });
    if (category.userId !== req.user!.id) return res.status(403).json({ error: 'Sem permissão' });
    if (category.isDefault) return res.status(400).json({ error: 'Não é possível deletar categoria padrão' });

    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar categoria' });
  }
});

export default router;
