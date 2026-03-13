import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';

import tasksRoutes from './routes/tasks';
import categoriesRoutes from './routes/categories';
import tagsRoutes from './routes/tags';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tags', tagsRoutes);

app.get('/', (req, res) => {
  res.send('Task Dashboard API');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
