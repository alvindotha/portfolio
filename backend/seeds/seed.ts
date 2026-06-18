import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '..', '.env') });

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://portfolio:portfolio@localhost:5432/portfolio';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const client = await pool.connect();

  try {
    const existing = await client.query('SELECT 1 FROM admins LIMIT 1');
    if (existing.rows.length > 0) {
      console.log('Admin user already exists, skipping seed.');
      return;
    }

    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await client.query(
      'INSERT INTO admins (username, password_hash) VALUES ($1, $2)',
      [ADMIN_USERNAME, hash]
    );
    console.log(`Admin user created: ${ADMIN_USERNAME}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
