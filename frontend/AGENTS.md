# Frontend — Next.js + Prisma (the whole application)

> **AI-Generated Notice**: >80% of this codebase is AI-generated.

This directory is the entire app. There is no backend service — the App Router
owns both the UI and the data layer.

## Tech Stack

- **Next.js 14** (App Router, server components + server actions)
- **Prisma** (PostgreSQL client, schema, migrations)
- **Mantine UI v7** (component library)
- **Tailwind CSS** (utility classes)
- **Framer Motion** (animations)
- **@tabler/icons-react** (icon set)
- **@marsidev/react-turnstile** (guestbook anti-spam widget)
- **sharp** (required by `next/image` in standalone builds — see Dockerfile)

## Structure

```
prisma/
├── schema.prisma          # single source of truth for the database
├── migrations/            # the ONLY migrations directory in the repo
└── seed.ts                # sample posts + projects (idempotent upserts)
src/
├── app/
│   ├── page.tsx           # server: fetches 3 projects
│   ├── HomeContent.tsx    # client: the whole homepage UI
│   ├── blog/
│   │   ├── page.tsx       # server: first page of posts
│   │   ├── PostList.tsx   # client: grid + "Load More"
│   │   ├── actions.ts     # loadMorePosts
│   │   └── [slug]/
│   │       ├── page.tsx           # server: post detail
│   │       ├── PostReactions.tsx  # client: view counter + like button
│   │       └── actions.ts         # recordView, toggleLike
│   ├── projects/          # same server/client split as blog
│   └── guestbook/
│       ├── page.tsx             # server: first page of entries
│       ├── GuestbookForm.tsx    # client: form + Turnstile
│       ├── GuestbookEntries.tsx # client: list + "Load More"
│       └── actions.ts           # signGuestbook, loadMoreGuestbookEntries
├── components/            # Navbar, Footer, PostCard, ProjectCard, ProfileImage, FadeIn
└── lib/
    ├── prisma.ts          # PrismaClient singleton (survives dev hot reload)
    ├── queries.ts         # all reads, server-only
    ├── ip.ts              # client IP from X-Forwarded-For
    ├── moderation.ts      # guestbook profanity/link/spam filter
    ├── turnstile.ts       # Turnstile verification (skipped with no secret)
    ├── pagination.ts      # page-size constants + Paginated<T>
    └── animations.ts      # shared Framer Motion variants
```

## Data Access Rules

- **Reads** go in `src/lib/queries.ts`, marked `import 'server-only'`. They
  return plain serializable objects (dates as ISO strings), never Prisma models.
- **Writes** are `'use server'` actions in an `actions.ts` beside the page.
- Client components never touch Prisma; they call server actions.
- `getClientIp()` reads `headers()`, so anything using it is request-scoped —
  those routes must be `dynamic = 'force-dynamic'`.

## Pages

| Route | Rendering | Description |
|---|---|---|
| `/` | server + client shell | Hero, about, skills, 3 projects, contact |
| `/blog` | server | Post listing, paginated via server action |
| `/blog/[slug]` | server | Post detail; view counter + like button are a client island |
| `/projects` | server | Project listing, paginated via server action |
| `/projects/[slug]` | server | Project detail |
| `/guestbook` | server | Entry list + moderated signing form |

## Running

```bash
docker compose up -d db    # from the repo root — Postgres on :5432
npm install
npm run db:deploy          # apply migrations
npm run db:seed            # sample content
npm run dev                # :3000
```

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | `prisma generate` + `next build` |
| `npm run start` | Serve the built app |
| `npm run db:migrate` | Create + apply a migration after editing the schema |
| `npm run db:deploy` | Apply existing migrations |
| `npm run db:seed` | Upsert sample posts and projects |
| `npm run db:reset` | Drop, re-migrate, re-seed |
| `npm run db:studio` | Prisma Studio — how content is authored |

## Schema Notes

- Models are camelCase in TypeScript, `@map`ped to snake_case columns.
- `likes` and `views` both carry `@@unique([postId, ipAddress])` — one per IP.
  `recordView` upserts, so repeat visits do not inflate the count.
- `projects.techStack` is a Postgres `TEXT[]`.
- Post and project `content` is HTML, rendered under `.tiptap-content`.

## Site Settings

`site_settings` is a key/value table for values that should be editable without
a deploy. Read them through `getContactEmail()` (or `getSetting`) in
`src/lib/queries.ts`, never inline the literal in a component. Each getter takes
a fallback, so a missing or blank row degrades to a sane default rather than
rendering an empty link.

| Key | Used by |
|---|---|
| `contact_email` | Homepage contact section, footer "Email" link |

Change a value in Prisma Studio (`npm run db:studio` → `SiteSetting`); pages are
`force-dynamic`, so the next request picks it up. The seed inserts keys but
never overwrites an existing value.

## Images

The profile photo is `public/images/profile.jpg`, rendered through `next/image`
in `ProfileImage.tsx` (a 120px avatar and a 280px click-to-expand lightbox).
Optimization requires `sharp`, which standalone output tracing does not pick up
— the Dockerfile copies `node_modules/sharp` and `node_modules/@img` into the
runner explicitly. Without them Next serves the original file and logs
`'sharp' is required to be installed in standalone mode`.

## Styling

- Mantine `createTheme` in `theme.ts` (dark slate theme)
- Tailwind for layout/spacing where convenient
- Framer Motion for scroll reveal, stagger, and hover animations
- `FadeIn` is the client wrapper that lets server components animate headings
