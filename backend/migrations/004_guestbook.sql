DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM _migrations WHERE name = '004_guestbook') THEN
    CREATE TABLE IF NOT EXISTS guestbook_entries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL DEFAULT 'Anonymous',
      message TEXT NOT NULL,
      ip_address VARCHAR(45) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook_entries(created_at DESC);

    INSERT INTO _migrations (name) VALUES ('004_guestbook');
  END IF;
END $$;
