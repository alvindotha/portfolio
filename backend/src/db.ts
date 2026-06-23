import { Pool } from 'pg';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { config } from './config';

const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

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

export default pool;
