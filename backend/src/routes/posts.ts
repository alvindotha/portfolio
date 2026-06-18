import { Router, Request, Response } from 'express';
import { query } from '../db';

const router = Router();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

// List published posts
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT
        p.id, p.title, p.slug, p.excerpt, p.created_at, p.updated_at,
        COALESCE(l.like_count, 0)::text AS like_count,
        COALESCE(v.view_count, 0)::text AS view_count
      FROM posts p
      LEFT JOIN (SELECT post_id, COUNT(*) AS like_count FROM likes GROUP BY post_id) l ON l.post_id = p.id
      LEFT JOIN (SELECT post_id, COUNT(*) AS view_count FROM views GROUP BY post_id) v ON v.post_id = p.id
      WHERE p.published = true
      ORDER BY p.created_at DESC
    `);
    res.json({ data: result.rows, error: null });
  } catch (err) {
    console.error('List posts error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// Get single post by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const ip = getClientIp(req);
    const result = await query(`
      SELECT
        p.id, p.title, p.slug, p.content, p.excerpt, p.published, p.created_at, p.updated_at,
        COALESCE(l.like_count, 0)::text AS like_count,
        COALESCE(v.view_count, 0)::text AS view_count
      FROM posts p
      LEFT JOIN (SELECT post_id, COUNT(*) AS like_count FROM likes GROUP BY post_id) l ON l.post_id = p.id
      LEFT JOIN (SELECT post_id, COUNT(*) AS view_count FROM views GROUP BY post_id) v ON v.post_id = p.id
      WHERE p.slug = $1 AND p.published = true
    `, [slug]);

    if (result.rows.length === 0) {
      res.status(404).json({ data: null, error: 'Post not found' });
      return;
    }

    const post = result.rows[0];
    const liked = await query(
      'SELECT 1 FROM likes WHERE post_id = $1 AND ip_address = $2',
      [post.id, ip]
    );
    post.has_liked = liked.rows.length > 0;

    res.json({ data: post, error: null });
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// Record a view
router.post('/:slug/view', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const ip = getClientIp(req);

    const post = await query('SELECT id FROM posts WHERE slug = $1 AND published = true', [slug]);
    if (post.rows.length === 0) {
      res.status(404).json({ data: null, error: 'Post not found' });
      return;
    }

    const postId = post.rows[0].id;
    await query(
      'INSERT INTO views (post_id, ip_address) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [postId, ip]
    );

    const count = await query('SELECT COUNT(*)::text AS count FROM views WHERE post_id = $1', [postId]);
    res.json({ data: { view_count: count.rows[0].count }, error: null });
  } catch (err) {
    console.error('Record view error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

// Toggle like
router.post('/:slug/like', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const ip = getClientIp(req);

    const post = await query('SELECT id FROM posts WHERE slug = $1 AND published = true', [slug]);
    if (post.rows.length === 0) {
      res.status(404).json({ data: null, error: 'Post not found' });
      return;
    }

    const postId = post.rows[0].id;
    const existing = await query(
      'SELECT id FROM likes WHERE post_id = $1 AND ip_address = $2',
      [postId, ip]
    );

    let liked: boolean;
    if (existing.rows.length > 0) {
      await query('DELETE FROM likes WHERE id = $1', [existing.rows[0].id]);
      liked = false;
    } else {
      await query('INSERT INTO likes (post_id, ip_address) VALUES ($1, $2)', [postId, ip]);
      liked = true;
    }

    const count = await query('SELECT COUNT(*)::text AS count FROM likes WHERE post_id = $1', [postId]);
    res.json({ data: { liked, like_count: count.rows[0].count }, error: null });
  } catch (err) {
    console.error('Toggle like error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

export default router;
