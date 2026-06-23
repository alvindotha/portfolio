import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { migrate } from './db';
import postRoutes from './routes/posts';
import projectRoutes from './routes/projects';
import guestbookRoutes from './routes/guestbook';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://thalvindo.my.id',
    'https://www.thalvindo.my.id',
    config.frontendUrl,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));

app.use('/api/posts', postRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/guestbook', guestbookRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ data: { status: 'ok' }, error: null });
});

async function start() {
  try {
    await migrate();
    app.listen(config.port, () => {
      console.log(`[server] Backend running on :${config.port}`);
    });
  } catch (err) {
    console.error('[server] Startup error:', err);
    process.exit(1);
  }
}

start();
