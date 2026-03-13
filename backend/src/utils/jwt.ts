import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-123';

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY) as { userId: string };
  } catch (error) {
    return null;
  }
};
