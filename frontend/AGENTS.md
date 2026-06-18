# Frontend — Next.js + Mantine UI + Tailwind

> **AI-Generated Notice**: >80% of this codebase is AI-generated.

## Tech Stack

- **Next.js 14** (App Router)
- **Mantine UI v7** (component library)
- **Tailwind CSS** (utility classes)
- **Framer Motion** (animations)
- **TipTap** via `@mantine/tiptap` (rich text editor)
- **@tabler/icons-react** (icon set)

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Portfolio homepage (hero with profile photo, about, skills, projects, contact) |
| `/blog` | `app/blog/page.tsx` | Blog listing |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Blog post detail with view counter + like button |
| `/projects` | `app/projects/page.tsx` | Project listing |
| `/projects/[slug]` | `app/projects/[slug]/page.tsx` | Project detail |
| `/admin/login` | `app/admin/login/page.tsx` | Admin login (redirects in production) |
| `/admin/posts` | `app/admin/posts/page.tsx` | Posts dashboard (table with tabs) |
| `/admin/posts/new` | `app/admin/posts/new/page.tsx` | Create post with TipTap editor |
| `/admin/posts/[id]/edit` | `app/admin/posts/[id]/edit/page.tsx` | Edit post |
| `/admin/projects` | `app/admin/projects/page.tsx` | Projects dashboard |
| `/admin/projects/new` | `app/admin/projects/new/page.tsx` | Create project |
| `/admin/projects/[id]/edit` | `app/admin/projects/[id]/edit/page.tsx` | Edit project |

## Key Components

- `Navbar` — top navigation with blog/projects links, theme toggle, admin icon (dev-only)
- `Footer` — site footer with version display
- `ProfileImage` — circular profile photo with hover scale + click lightbox (Framer Motion)
- `PostCard` — blog card for listing with view/like counts
- `ProjectCard` — project card with tech badges, live demo/github links
- `RichTextEditor` — TipTap editor wrapper for admin

## API Client

`lib/api.ts` exports typed fetch helpers that call `/api/*`. JWT token stored in localStorage.

## Auth

- `useAuth()` — token state, login/logout
- `useRequireAuth()` — redirects to login if unauthenticated, redirects home in production
- Admin routes gated by `NEXT_PUBLIC_APP_ENV !== 'production'`

## Running

```bash
npm run dev      # dev server :3000
npm run build    # production build
npm run start    # serve built app
```

## Styling

- Mantine `createTheme` in `theme.ts` (dark slate theme)
- Tailwind for layout/spacing where convenient
- Framer Motion for scroll reveal, stagger, and hover animations
