import { Pool } from 'pg';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import { config } from './config';

const pool = new Pool({ connectionString: config.databaseUrl });

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function migrate(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const migrationDir = join(__dirname, '..', 'migrations');
    const files = readdirSync(migrationDir).filter(f => f.endsWith('.sql')).sort();

    for (const file of files) {
      const name = file.replace('.sql', '');
      const exists = await client.query('SELECT 1 FROM _migrations WHERE name = $1', [name]);
      if (exists.rows.length === 0) {
        const sql = readFileSync(join(migrationDir, file), 'utf-8');
        await client.query(sql);
        console.log(`[migrate] Applied: ${file}`);
      }
    }
  } finally {
    client.release();
  }
}

export async function seed(): Promise<void> {
  const existing = await query('SELECT 1 FROM admins LIMIT 1');
  if (existing.rows.length > 0) return;

  const hash = await bcrypt.hash(config.adminPassword, 10);
  await query(
    'INSERT INTO admins (username, password_hash) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [config.adminUsername, hash]
  );
  console.log(`[seed] Admin user created: ${config.adminUsername}`);
}

export default pool;
