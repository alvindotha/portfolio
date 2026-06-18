import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { migrate, seed } from './db';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import adminRoutes from './routes/admin';
import projectRoutes from './routes/projects';
import adminProjectRoutes from './routes/adminProjects';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/admin/posts', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin/projects', adminProjectRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ data: { status: 'ok' }, error: null });
});

async function start() {
  try {
    await migrate();
    await seed();
    app.listen(config.port, () => {
      console.log(`[server] Backend running on :${config.port}`);
    });
  } catch (err) {
    console.error('[server] Startup error:', err);
    process.exit(1);
  }
}

start();
