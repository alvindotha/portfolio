import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query } from '../db';
import { config } from '../config';

const router = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    const result = await query('SELECT * FROM admins WHERE username = $1', [username]);
    const admin = result.rows[0];

    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      res.status(401).json({ data: null, error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { adminId: admin.id, username: admin.username },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({ data: { token }, error: null });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ data: null, error: err.errors });
      return;
    }
    console.error('Login error:', err);
    res.status(500).json({ data: null, error: 'Internal server error' });
  }
});

export default router;
