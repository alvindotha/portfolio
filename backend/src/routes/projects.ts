import { Router, Request, Response } from 'express';
import { query } from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 12));
    const offset = (page - 1) * limit;

    const countResult = await query(
      "SELECT COUNT(*)::int AS total FROM projects WHERE published = true"
    );
    const total = countResult.rows[0].total;

    const result = await query(`
      SELECT id, title, slug, description, image_url, project_url, github_url, tech_stack, sort_order, created_at, updated_at
      FROM projects
      WHERE published = true
      ORDER BY sort_order ASC, created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    res.json({
      data: {
        items: result.rows,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
      error: null,
    });
  } catch (err) {
    console.error('List projects error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

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
