DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM _migrations WHERE name = '002_projects') THEN
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      image_url VARCHAR(500) DEFAULT '',
      project_url VARCHAR(500) DEFAULT '',
      github_url VARCHAR(500) DEFAULT '',
      tech_stack TEXT[] DEFAULT '{}',
      sort_order INTEGER DEFAULT 0,
      published BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
    CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
    CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order);

    INSERT INTO _migrations (name) VALUES ('002_projects');
  END IF;
END $$;
