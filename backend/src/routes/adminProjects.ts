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

const projectSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().default(''),
  content: z.string().default(''),
  image_url: z.string().max(500).default(''),
  project_url: z.string().max(500).default(''),
  github_url: z.string().max(500).default(''),
  tech_stack: z.array(z.string()).default([]),
  sort_order: z.number().int().default(0),
  published: z.boolean().default(false),
});

// List all projects
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT id, title, slug, description, image_url, project_url, github_url, tech_stack, sort_order, published, created_at, updated_at
      FROM projects
      ORDER BY sort_order ASC, created_at DESC
    `);
    res.json({ data: result.rows, error: null });
  } catch (err) {
    console.error('Admin list projects error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// Create project
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = projectSchema.parse(req.body);
    const result = await query(
      `INSERT INTO projects (title, slug, description, content, image_url, project_url, github_url, tech_stack, sort_order, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [data.title, data.slug, data.description, data.content, data.image_url, data.project_url, data.github_url, data.tech_stack, data.sort_order, data.published]
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
    console.error('Create project error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// Update project
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = projectSchema.partial().parse(req.body);

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
      `UPDATE projects SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      res.status(404).json({ data: null, error: 'Project not found' });
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
    console.error('Update project error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// Delete project
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ data: null, error: 'Project not found' });
      return;
    }
    res.json({ data: { deleted: true }, error: null });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

export default router;
