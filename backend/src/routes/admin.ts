import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../db';
import { authMiddleware } from '../middleware/auth';
import { config } from '../config';

const router = Router();

if (config.nodeEnv === 'production') {
  router.use((_req: Request, res: Response) => {
    res.status(403).json({ data: null, error: 'Admin panel is disabled in production' });
  });
}

router.use(authMiddleware);

const postSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.string().default(''),
  excerpt: z.string().max(500).default(''),
  published: z.boolean().default(false),
});

// List all posts (including drafts)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT
        p.id, p.title, p.slug, p.excerpt, p.published, p.created_at, p.updated_at,
        COALESCE(l.like_count, 0)::text AS like_count,
        COALESCE(v.view_count, 0)::text AS view_count
      FROM posts p
      LEFT JOIN (SELECT post_id, COUNT(*) AS like_count FROM likes GROUP BY post_id) l ON l.post_id = p.id
      LEFT JOIN (SELECT post_id, COUNT(*) AS view_count FROM views GROUP BY post_id) v ON v.post_id = p.id
      ORDER BY p.created_at DESC
    `);
    res.json({ data: result.rows, error: null });
  } catch (err) {
    console.error('Admin list posts error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// Create post
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = postSchema.parse(req.body);
    const result = await query(
      `INSERT INTO posts (title, slug, content, excerpt, published)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.title, data.slug, data.content, data.excerpt, data.published]
    );
    res.status(201).json({ data: result.rows[0], error: null });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ data: null, error: err.errors });
      return;
    }
    if (err.code === '23505') {
      res.status(409).json({ data: null, error: 'Slug already exists' });
      return;
    }
    console.error('Create post error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// Update post
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = postSchema.partial().parse(req.body);

    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      res.status(400).json({ data: null, error: 'No fields to update' });
      return;
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE posts SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      res.status(404).json({ data: null, error: 'Post not found' });
      return;
    }

    res.json({ data: result.rows[0], error: null });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ data: null, error: err.errors });
      return;
    }
    if (err.code === '23505') {
      res.status(409).json({ data: null, error: 'Slug already exists' });
      return;
    }
    console.error('Update post error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// Delete post
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ data: null, error: 'Post not found' });
      return;
    }
    res.json({ data: { deleted: true }, error: null });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

export default router;
