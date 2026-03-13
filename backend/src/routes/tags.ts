import { Router } from 'express';
import prisma from '../db';
import { authenticateToken, AuthRequest } from '../middlewares/authMiddleware';

const router = Router();
router.use(authenticateToken);

// Listar todas as tags do usuário autenticado
router.get('/', async (req: AuthRequest, res) => {
  try {
    const tags = await prisma.tag.findMany({
      where: { userId: req.user!.id },
      orderBy: { name: 'asc' }
    });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tags' });
  }
});

// Criar nova tag
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Nome da tag é obrigatório' });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        color: color || '#888888',
        userId: req.user!.id
      }
    });

    res.status(201).json(tag);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Tag já existe' });
    }
    res.status(500).json({ error: 'Erro ao criar tag' });
  }
});

export default router;
