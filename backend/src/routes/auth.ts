import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db';
import { generateToken } from '../utils/jwt';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        categories: {
          create: [
            { name: 'Trabalho', color: '#3b82f6', isDefault: true },
            { name: 'Casa', color: '#10b981', isDefault: true },
            { name: 'Estudos', color: '#8b5cf6', isDefault: true }
          ]
        }
      }
    });

    const token = generateToken(user.id);
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = generateToken(user.id);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

export default router;
