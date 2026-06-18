# Backend — Express.js + PostgreSQL

> **AI-Generated Notice**: >80% of this codebase is AI-generated.

## Tech Stack

- **Express.js** (TypeScript)
- **pg** (native PostgreSQL client, raw SQL)
- **bcryptjs** (password hashing)
- **jsonwebtoken** (JWT auth)
- **zod** (request validation)
- **helmet + cors** (security)

## Project Structure

```
src/
├── index.ts              # Express entry: middleware, routes, startup
├── db.ts                 # pg Pool + migration runner
├── config.ts             # environment variables
├── routes/
│   ├── auth.ts           # POST /api/auth/login
│   ├── posts.ts          # Public blog post routes
│   ├── admin.ts          # Admin post CRUD
│   ├── projects.ts       # Public project routes
│   └── adminProjects.ts  # Admin project CRUD
├── middleware/
│   └── auth.ts           # JWT verification middleware
└── types/
    └── index.ts          # Shared type definitions
migrations/
├── 001_init.sql          # Core tables (admins, posts, likes, views)
├── 002_projects.sql      # Projects table
└── 003_views_unique.sql  # Unique constraint on views per IP
seeds/
└── seed.ts               # Admin user seeder
```

## API Endpoints

### Public
| Method | Path | Description |
|---|---|---|
| GET | /api/posts | List published posts with counts |
| GET | /api/posts/:slug | Single post detail (includes `has_liked` for current IP) |
| POST | /api/posts/:slug/view | Record a view (unique per IP) |
| POST | /api/posts/:slug/like | Toggle like (unique per IP) |
| GET | /api/projects | List published projects |
| GET | /api/projects/:slug | Single project detail |

### Auth
| Method | Path | Description |
|---|---|---|
| POST | /api/auth/login | Returns JWT |

### Admin (JWT required, disabled in production)
| Method | Path | Description |
|---|---|---|
| GET/POST/PUT/DELETE | /api/admin/posts | Post CRUD |
| GET/POST/PUT/DELETE | /api/admin/projects | Project CRUD |

## Database

Tables: `admins`, `posts`, `likes`, `views`, `projects`
- `likes` has `UNIQUE(post_id, ip_address)` — one like per IP
- `views` has `UNIQUE(post_id, ip_address)` — one view per IP, `ON CONFLICT DO NOTHING`
- Migrations auto-run on startup via `db.ts` (version-check pattern).
- Seeding: creates initial admin from env vars if none exists.

## Running

```bash
npm run dev      # tsx watch :4000
npm run build    # tsc
npm run start    # node dist/index.js
npm run seed     # manually seed admin
```
