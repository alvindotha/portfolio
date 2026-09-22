import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const posts = [
  {
    title: 'Getting Started with Next.js 14 App Router',
    slug: 'getting-started-nextjs-14',
    content:
      '<h2>Why App Router?</h2><p>Next.js 14 introduces a revolutionary approach to building web applications with the App Router. This new paradigm shifts from pages-based routing to a more intuitive directory-based structure.</p><p>The App Router leverages React Server Components by default, giving you better performance and smaller client bundles. You can mix and match server and client components seamlessly.</p><h2>Key Features</h2><ul><li><p>Server Components by default</p></li><li><p>Nested layouts and templates</p></li><li><p>Streaming and Suspense integration</p></li><li><p>Built-in SEO support with metadata API</p></li></ul><p>Start building today and experience the future of React development.</p>',
    excerpt:
      'A comprehensive guide to Next.js 14 App Router, covering server components, nested layouts, and the new metadata API.',
    published: true,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    title: 'Talking to Postgres with Prisma',
    slug: 'talking-to-postgres-with-prisma',
    content:
      '<p>Prisma turns your database schema into a typed client, so queries are checked at compile time instead of blowing up at runtime.</p><h2>Schema First</h2><p>Everything starts in <code>schema.prisma</code>. Models map to tables, and <code>prisma migrate dev</code> turns schema edits into versioned SQL migrations you can review and commit.</p><pre><code class="language-bash">npx prisma migrate dev --name add_guestbook\nnpx prisma studio</code></pre><h2>Querying from Server Components</h2><p>Because React Server Components run on the server, they can call Prisma directly. No API layer, no fetch waterfall, no serialization boilerplate — just await the query and render the result.</p>',
    excerpt:
      'Using Prisma as the single data layer for a Next.js app: schema-first modelling, versioned migrations, and querying straight from server components.',
    published: true,
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    title: 'Containerizing Your Full-Stack App with Docker',
    slug: 'containerizing-fullstack-docker',
    content:
      '<p>Docker simplifies deployment and ensures consistency across environments. In this post, we will containerize a full-stack application with a frontend and a database.</p>' +
      '<h2>The Architecture</h2>' +
      '<p>Our setup uses Docker Compose to orchestrate multiple services. Each service runs in its own container with defined dependencies, and Nginx is the only one exposed to the outside world.</p>' +
      '<figure>' +
      '<img src="/images/blog/request-path.svg" alt="A request flows from the browser to Nginx on port 443, to Next.js on port 3000, which queries PostgreSQL on port 5432 through Prisma." width="880" height="250" loading="lazy">' +
      '<figcaption>A single request, end to end. There is no API service in the middle — pages query the database on the server.</figcaption>' +
      '</figure>' +
      '<ol><li><p>Nginx as reverse proxy and TLS terminator</p></li><li><p>Next.js, serving the UI and owning data access</p></li><li><p>PostgreSQL, the only stateful container</p></li></ol>' +
      '<h2>Building the image</h2>' +
      '<p>A naive Dockerfile ships your compiler, your dev dependencies, and your source code to production. A multi-stage build avoids that: each stage starts fresh, and the final image copies in only what the server actually needs to run.</p>' +
      '<figure>' +
      '<img src="/images/blog/multi-stage-build.svg" alt="Three build stages: deps runs npm ci, builder runs prisma generate and next build, and the shipped runner stage contains the standalone server, sharp, and the Prisma CLI." width="880" height="300" loading="lazy">' +
      '<figcaption>Only the third stage is shipped. The first two exist so their output can be copied out of them.</figcaption>' +
      '</figure>' +
      '<p>One catch worth knowing: Next.js standalone output traces the modules your server imports, but it will not pick up native binaries it cannot see — <code>sharp</code> for image optimization, and the Prisma query engine. Those have to be copied into the runner stage explicitly, or you get a working build that silently serves unoptimized images.</p>' +
      '<h2>Docker Compose</h2>' +
      '<p>Define all services in a single docker-compose.yml file. Use environment variables for configuration and named volumes for data persistence, so a rebuild never costs you your database.</p>',

    excerpt:
      'Learn how to Dockerize a full-stack application with Nginx, Next.js, and PostgreSQL using Docker Compose.',
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const projects = [
  {
    title: 'Portfolio Website',
    slug: 'portfolio-website',
    description:
      'Personal portfolio built with Next.js 14, Prisma, and PostgreSQL. Features a blog with view/like tracking, project showcase, guestbook, and a dark-themed Mantine UI.',
    content:
      '<p>A full-stack portfolio website built from scratch. Next.js 14 with App Router handles both the UI and the data layer — server components query PostgreSQL through Prisma directly, and mutations run as server actions. There is no separate API service.</p><p>Key features include view and like tracking by IP, a moderated guestbook behind Cloudflare Turnstile, and full Docker containerization behind Nginx.</p>',
    imageUrl: '',
    projectUrl: '',
    githubUrl: 'https://github.com/thalvindo/portfolio',
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Docker', 'TypeScript'],
    sortOrder: 1,
    published: true,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
  },
  {
    title: 'Task Management API',
    slug: 'task-management-api',
    description:
      'A RESTful task management API with authentication, project boards, and real-time updates via WebSocket.',
    content:
      '<p>A comprehensive task management API that supports multiple users, project boards, task assignments, and real-time collaboration via WebSocket connections.</p><p>Built with Node.js, Express, and Socket.io with PostgreSQL for persistence.</p>',
    imageUrl: '',
    projectUrl: 'https://task-demo.example.com',
    githubUrl: 'https://github.com/thalvindo/task-api',
    techStack: ['Node.js', 'Express', 'Socket.io', 'PostgreSQL', 'Redis'],
    sortOrder: 2,
    published: true,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    title: 'Weather Dashboard',
    slug: 'weather-dashboard',
    description:
      'Real-time weather dashboard with interactive maps and 7-day forecasts using OpenWeatherMap API.',
    content:
      '<p>A weather dashboard that displays real-time weather data, interactive maps, and 7-day forecasts. Users can search for cities and save favorites.</p><p>The frontend is built with React and Leaflet for maps, while a caching layer keeps API usage within rate limits.</p>',
    imageUrl: '',
    projectUrl: 'https://weather-demo.example.com',
    githubUrl: 'https://github.com/thalvindo/weather-dash',
    techStack: ['React', 'Leaflet', 'Node.js', 'Redis', 'OpenWeatherMap'],
    sortOrder: 3,
    published: true,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
];

// Seeded once; edit the value in Prisma Studio rather than here.
// Blank values are intentional: the link stays hidden until the row is filled
// in Prisma Studio, so nothing ships a dead placeholder link.
const settings = [
  { key: 'contact_email', value: 'thalvindo@gmail.com' },
  { key: 'contact_phone', value: '' },
  { key: 'linkedin_url', value: '' },
  { key: 'github_url', value: 'https://github.com/alvindotha' },
  { key: 'gitlab_url', value: 'https://gitlab.com/thalvindo' },
  { key: 'youtube_url', value: '' },
  { key: 'app_version', value: '0.1.0' },
];

// Sample signatures so the homepage teaser has something to show. Inserted only
// into an empty table, so a re-seed never duplicates them or touches real ones.
const guestbookEntries = [
  {
    name: 'Rendi',
    message: 'Found this through your blog post on Prisma. The timeline on the homepage is a nice touch.',
    ipAddress: '203.0.113.10',
    createdAt: daysAgo(5),
  },
  {
    name: 'Ayu',
    message: 'Clean dark mode, and it actually respects the light theme too. Bookmarked.',
    ipAddress: '203.0.113.24',
    createdAt: daysAgo(2),
  },
  {
    name: 'Anonymous',
    message: 'ngab, cakep webnya. lanjutkan!',
    ipAddress: '203.0.113.77',
    createdAt: daysAgo(1),
  },
];

async function main() {
  for (const post of posts) {
    await prisma.post.upsert({ where: { slug: post.slug }, create: post, update: post });
  }
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      create: project,
      update: project,
    });
  }
  for (const setting of settings) {
    // create-only: never clobber a value edited in Studio.
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      create: setting,
      update: {},
    });
  }

  // Real signatures are visitor data — only ever fill an empty table.
  const existingEntries = await prisma.guestbookEntry.count();
  if (existingEntries === 0) {
    await prisma.guestbookEntry.createMany({ data: guestbookEntries });
  }

  console.log(
    `[seed] ${posts.length} posts, ${projects.length} projects, ` +
      `${settings.length} settings, ` +
      `${existingEntries === 0 ? guestbookEntries.length : 0} guestbook entries`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
