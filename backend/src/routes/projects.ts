import { Router, Request, Response } from 'express';
import { query } from '../db';

const router = Router();

// List published projects
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT id, title, slug, description, image_url, project_url, github_url, tech_stack, sort_order, created_at, updated_at
      FROM projects
      WHERE published = true
      ORDER BY sort_order ASC, created_at DESC
    `);
    res.json({ data: result.rows, error: null });
  } catch (err) {
    console.error('List projects error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// Get single project by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await query(`
      SELECT *
      FROM projects
      WHERE slug = $1 AND published = true
    `, [slug]);

    if (result.rows.length === 0) {
      res.status(404).json({ data: null, error: 'Project not found' });
      return;
    }

    res.json({ data: result.rows[0], error: null });
  } catch (err) {
    console.error('Get project error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

export default router;
