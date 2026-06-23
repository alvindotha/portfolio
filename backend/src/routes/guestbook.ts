import { Router, Request, Response } from 'express';
import { query } from '../db';
import { config } from '../config';
import { getClientIp } from '../utils/ip';

const router = Router();

const blockedPatterns = [
  /\b(fuck|shit|asshole|bitch|bastard|dick|cock|cunt|whore|damn|slut|crap|piss|bollocks|wanker|twat|tosser|prick|douche|jackass|dumbass|moron)\b/i,
  /\b(nigger|faggot|retard|tranny|kike|spic|chink|gook)\b/i,
  /https?:\/\/[^\s]+/i,
];

const spamPatterns = [
  /(.)\1{10,}/,
  /[A-Z]{10,}/,
  /[\u{1F300}-\u{1F9FF}]{5,}/u,
  /\b(\w+)\s+\1\s+\1\b/i,
];

function normalize(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/!/g, 'i');
}

function moderateContent(original: string): string | null {
  const normalized = normalize(original);

  if (blockedPatterns.some(p => p.test(normalized))) {
    return 'Message contains inappropriate content';
  }

  if (spamPatterns.some(p => p.test(original))) {
    return 'Message looks like spam';
  }

  return null;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    const countResult = await query(
      'SELECT COUNT(*)::int AS total FROM guestbook_entries'
    );
    const total = countResult.rows[0].total;

    const result = await query(
      'SELECT id, name, message, created_at FROM guestbook_entries ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json({
      data: {
        items: result.rows,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
      error: null,
    });
  } catch (err) {
    console.error('List guestbook error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ data: null, error: 'Message is required' });
      return;
    }

    if (message.trim().length < 3) {
      res.status(400).json({ data: null, error: 'Message is too short' });
      return;
    }

    if (message.length > 2000) {
      res.status(400).json({ data: null, error: 'Message must be under 2000 characters' });
      return;
    }

    const turnstileToken = req.body.turnstileToken;
    if (!turnstileToken || typeof turnstileToken !== 'string') {
      res.status(400).json({ data: null, error: 'Verification failed' });
      return;
    }

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: config.turnstileSecretKey,
        response: turnstileToken,
        remoteip: getClientIp(req),
      }),
    });
    const verifyData = await verifyRes.json() as { success: boolean };
    if (!verifyData.success) {
      res.status(400).json({ data: null, error: 'Verification failed' });
      return;
    }

    const moderationError = moderateContent(message);
    if (moderationError) {
      res.status(400).json({ data: null, error: moderationError });
      return;
    }

    if (name) {
      const nameError = moderateContent(name);
      if (nameError) {
        res.status(400).json({ data: null, error: 'Name contains inappropriate content' });
        return;
      }
    }

    const displayName = name && typeof name === 'string' && name.trim().length > 0
      ? name.trim().slice(0, 100)
      : 'Anonymous';

    const ip = getClientIp(req);

    const result = await query(
      'INSERT INTO guestbook_entries (name, message, ip_address) VALUES ($1, $2, $3) RETURNING id, name, message, created_at',
      [displayName, message.trim(), ip]
    );

    res.status(201).json({ data: result.rows[0], error: null });
  } catch (err) {
    console.error('Create guestbook error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

export default router;
