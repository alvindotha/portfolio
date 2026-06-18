# Portfolio — lazy-tracker.my.id

> **Note**: This project was developed with >80% AI assistance. The primary focus is on functionality and outcomes rather than code elegance or architectural purity.

Personal portfolio website with a blog, powered by Docker.

## Architecture

```
                   lazy-tracker.my.id
                           │
                    Nginx (SSL)
                   ┌───┴───┐
                   │       │
            /api/* │       │ /
                   │       │
               Express   Next.js
                :4000     :3000
                   │
                   │
               PostgreSQL
                :5432
```

4 containers defined in `docker-compose.yml`: **frontend**, **backend**, **db**, **nginx**.

---

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (running locally, or use Docker for just the DB)

### 1. Database

```bash
# Option A: Use Docker for PostgreSQL only
docker run -d --name portfolio-pg \
  -e POSTGRES_DB=portfolio \
  -e POSTGRES_USER=portfolio \
  -e POSTGRES_PASSWORD=portfolio \
  -p 5432:5432 \
  postgres:16-alpine

# Option B: Use your local PostgreSQL install
createdb portfolio
```

Then run the migration against your local DB:
```bash
psql -U portfolio -d portfolio -f backend/migrations/001_init.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # edit DATABASE_URL for your local DB
npm install
npm run dev            # starts on :4000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local   # edit NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                  # starts on :3000
```

Open http://localhost:3000. Blog API runs on :4000.

### 4. Seed Admin

```bash
cd backend
# Set ADMIN_USERNAME and ADMIN_PASSWORD in .env first
npm run seed
```

Then login at http://localhost:3000/admin/login.

---

## Deploy to a New Server

### Prerequisites (first time on a server)

- Docker & Docker Compose installed
- Domain (`lazy-tracker.my.id`) pointing to the server's IP

### Step-by-step

```bash
# 1. Copy project to the server
git clone <your-repo-url> /opt/portfolio
cd /opt/portfolio

# 2. Configure environment
cp .env.example .env
nano .env   # Set passwords, secrets, admin credentials

# 3. Get SSL certificates (one-time)
sudo apt install certbot
sudo certbot certonly --standalone -d lazy-tracker.my.id -d www.lazy-tracker.my.id

# 4. Start everything
docker compose up -d

# 5. Verify
docker compose ps
# All 4 services should be "Up"
```

The site is now live at **https://lazy-tracker.my.id**.

### Moving to Another Server

```bash
# On old server (if you want to keep DB data):
docker compose down
scp -r /opt/portfolio user@new-server:/opt/portfolio

# On new server:
cd /opt/portfolio
docker compose up -d

# If starting fresh (no data to preserve):
cd /opt/portfolio
docker compose up -d
# DB auto-initializes, admin user auto-seeds from .env
```

### SSL Renewal

Let's Encrypt certs expire every 90 days. Auto-renew:

```bash
# Test renewal:
sudo certbot renew --dry-run

# Set up cron (runs twice daily):
echo "0 3 * * * root certbot renew --quiet && docker exec portfolio-nginx nginx -s reload" \
  | sudo tee /etc/cron.d/certbot-renew
```

---

## Services

| Service | Port (internal) | Description |
|---|---|---|
| `nginx` | 80 / 443 | Reverse proxy, SSL termination |
| `frontend` | 3000 | Next.js app |
| `backend` | 4000 | Express API |
| `db` | 5432 | PostgreSQL 16 |

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) + Mantine UI v7 + Tailwind CSS |
| Backend | Express.js + TypeScript + raw SQL (pg) |
| Database | PostgreSQL 16 |
| Rich Text | TipTap (`@mantine/tiptap`) |
| Auth | JWT (bcryptjs + jsonwebtoken) |
| Container | Docker Compose |
| Reverse Proxy | Nginx (Let's Encrypt SSL) |

## Project Structure

```
Portofolio/
├── docker-compose.yml      # Orchestrates all 4 services
├── .env.example            # Environment variable template
├── nginx/
│   └── default.conf        # Reverse proxy config
├── frontend/               # Next.js app
│   ├── Dockerfile
│   └── src/
│       ├── app/            # Pages (home, blog, admin)
│       ├── components/     # Navbar, Footer, PostCard, Editor
│       └── lib/            # API client, auth hooks
└── backend/                # Express API
    ├── Dockerfile
    ├── src/
    │   ├── routes/         # auth, posts, admin
    │   ├── middleware/     # JWT guard
    │   └── db.ts           # DB pool + migration runner
    ├── migrations/         # SQL schema files
    └── seeds/              # Admin seeder
```
