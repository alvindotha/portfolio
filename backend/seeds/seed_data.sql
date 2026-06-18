-- Admin user (password: admin123)
INSERT INTO admins (username, password_hash)
VALUES ('admin', '$2a$10$3dsE7vGrqXnuv8bMJguaceWeRlI7NQcH/X0lt66IZKxi7n5oC50fO')
ON CONFLICT (username) DO NOTHING;

-- Sample blog posts (HTML format matching TipTap editor output)
INSERT INTO posts (title, slug, content, excerpt, published, created_at, updated_at)
VALUES
(
  'Getting Started with Next.js 14 App Router',
  'getting-started-nextjs-14',
  '<h2>Why App Router?</h2><p>Next.js 14 introduces a revolutionary approach to building web applications with the App Router. This new paradigm shifts from pages-based routing to a more intuitive directory-based structure.</p><p>The App Router leverages React Server Components by default, giving you better performance and smaller client bundles. You can mix and match server and client components seamlessly.</p><h2>Key Features</h2><ul><li><p>Server Components by default</p></li><li><p>Nested layouts and templates</p></li><li><p>Streaming and Suspense integration</p></li><li><p>Built-in SEO support with metadata API</p></li></ul><p>Start building today and experience the future of React development.</p>',
  'A comprehensive guide to Next.js 14 App Router, covering server components, nested layouts, and the new metadata API.',
  true,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
),
(
  'Building RESTful APIs with Express.js',
  'building-restful-apis-express',
  '<p>Express.js remains one of the most popular frameworks for building web APIs in Node.js. Its minimalist design and extensive middleware ecosystem make it a top choice for developers.</p><p>This guide will walk through setting up a production-ready API with TypeScript.</p><h2>Project Setup</h2><p>Start by initializing a new Node.js project with TypeScript support. Install express, typescript, and the necessary type definitions.</p><pre><code class="language-bash">npm init -y
npm install express
npm install -D typescript @types/express @types/node
tsc --init</code></pre><h2>Middleware Stack</h2><p>A robust API needs proper middleware: Helmet for security headers, CORS for cross-origin requests, and rate limiting for protection.</p><p>Express makes it trivial to compose these into a secure, fast API server.</p>',
  'Step-by-step tutorial on building production-ready REST APIs with Express.js and TypeScript.',
  true,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
),
(
  'Containerizing Your Full-Stack App with Docker',
  'containerizing-fullstack-docker',
  '<p>Docker simplifies deployment and ensures consistency across environments. In this post, we will containerize a full-stack application with a frontend, backend, and database.</p><h2>The Architecture</h2><p>Our setup uses Docker Compose to orchestrate multiple services. Each service runs in its own container with defined dependencies.</p><ol><li><p>Nginx as reverse proxy</p></li><li><p>Next.js frontend</p></li><li><p>Express.js backend</p></li><li><p>PostgreSQL database</p></li></ol><p>Each service is independently scalable and can be developed locally with hot reloading.</p><h2>Docker Compose</h2><p>Define all services in a single docker-compose.yml file. Use environment variables for configuration and named volumes for data persistence.</p>',
  'Learn how to Dockerize a full-stack application with Nginx, Next.js, Express.js, and PostgreSQL using Docker Compose.',
  true,
  NOW(),
  NOW()
);

-- Sample projects (HTML format matching TipTap editor output)
INSERT INTO projects (title, slug, description, content, image_url, project_url, github_url, tech_stack, sort_order, published, created_at, updated_at)
VALUES
(
  'Portfolio Website',
  'portfolio-website',
  'Personal portfolio built with Next.js 14, Express.js, and PostgreSQL. Features a blog with view/like tracking, project showcase, and a dark-themed Mantine UI.',
  '<p>A full-stack portfolio website built from scratch. The frontend uses Next.js 14 with App Router and Mantine UI v7 for a clean, dark-themed interface. The backend is powered by Express.js with TypeScript, connecting to a PostgreSQL database for blog posts and project data.</p><p>Key features include a rich text editor for blog posts, view and like tracking by IP, an admin panel for content management, and full Docker containerization.</p>',
 '',
 '',
 'https://github.com/thalvindo/portfolio',
 ARRAY['Next.js', 'Express.js', 'PostgreSQL', 'Docker', 'TypeScript'],
 1,
 true,
 NOW() - INTERVAL '7 days',
 NOW() - INTERVAL '7 days'
),
(
  'Task Management API',
  'task-management-api',
  'A RESTful task management API with authentication, project boards, and real-time updates via WebSocket.',
  '<p>A comprehensive task management API that supports multiple users, project boards, task assignments, and real-time collaboration via WebSocket connections.</p><p>Built with Node.js, Express, and Socket.io with PostgreSQL for persistence.</p>',
 '',
 'https://task-demo.example.com',
 'https://github.com/thalvindo/task-api',
 ARRAY['Node.js', 'Express', 'Socket.io', 'PostgreSQL', 'Redis'],
 2,
 true,
 NOW() - INTERVAL '5 days',
 NOW() - INTERVAL '5 days'
),
(
  'Weather Dashboard',
  'weather-dashboard',
  'Real-time weather dashboard with interactive maps and 7-day forecasts using OpenWeatherMap API.',
  '<p>A weather dashboard that displays real-time weather data, interactive maps, and 7-day forecasts. Users can search for cities and save favorites.</p><p>The frontend is built with React and Leaflet for maps, while the backend caches API responses to stay within rate limits.</p>',
 '',
 'https://weather-demo.example.com',
 'https://github.com/thalvindo/weather-dash',
 ARRAY['React', 'Leaflet', 'Node.js', 'Redis', 'OpenWeatherMap'],
 3,
 true,
 NOW() - INTERVAL '2 days',
 NOW() - INTERVAL '2 days'
);
