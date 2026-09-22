import 'server-only';
import { prisma } from '@/lib/prisma';
import { getClientIp } from '@/lib/ip';
import {
  clampPage,
  paginate,
  PAGE_SIZE,
  GUESTBOOK_PAGE_SIZE,
  type Paginated,
} from '@/lib/pagination';

export interface PostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
}

export interface PostDetail extends PostSummary {
  content: string;
  hasLiked: boolean;
}

export interface ProjectSummary {
  id: number;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  projectUrl: string;
  githubUrl: string;
  imageUrl: string;
  likeCount: number;
  viewCount: number;
}

export interface ProjectDetail extends ProjectSummary {
  content: string;
  hasLiked: boolean;
}

export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

export async function getPosts(page = 1): Promise<Paginated<PostSummary>> {
  const current = clampPage(page);
  const [total, rows] = await Promise.all([
    prisma.post.count({ where: { published: true } }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      skip: (current - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        createdAt: true,
        _count: { select: { likes: true, views: true } },
      },
    }),
  ]);

  const items = rows.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    createdAt: p.createdAt.toISOString(),
    likeCount: p._count.likes,
    viewCount: p._count.views,
  }));

  return paginate(items, current, PAGE_SIZE, total);
}

export async function getPost(slug: string): Promise<PostDetail | null> {
  const post = await prisma.post.findFirst({
    where: { slug, published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      createdAt: true,
      _count: { select: { likes: true, views: true } },
    },
  });
  if (!post) return null;

  const liked = await prisma.like.findUnique({
    where: { postId_ipAddress: { postId: post.id, ipAddress: getClientIp() } },
    select: { id: true },
  });

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    createdAt: post.createdAt.toISOString(),
    likeCount: post._count.likes,
    viewCount: post._count.views,
    hasLiked: liked !== null,
  };
}

export async function getProjects(page = 1): Promise<Paginated<ProjectSummary>> {
  const current = clampPage(page);
  const [total, rows] = await Promise.all([
    prisma.project.count({ where: { published: true } }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      skip: (current - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        techStack: true,
        projectUrl: true,
        githubUrl: true,
        imageUrl: true,
        _count: { select: { likes: true, views: true } },
      },
    }),
  ]);

  const items = rows.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    techStack: p.techStack,
    projectUrl: p.projectUrl,
    githubUrl: p.githubUrl,
    imageUrl: p.imageUrl,
    likeCount: p._count.likes,
    viewCount: p._count.views,
  }));

  return paginate(items, current, PAGE_SIZE, total);
}

export async function getProject(slug: string): Promise<ProjectDetail | null> {
  const project = await prisma.project.findFirst({
    where: { slug, published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      content: true,
      imageUrl: true,
      techStack: true,
      projectUrl: true,
      githubUrl: true,
      _count: { select: { likes: true, views: true } },
    },
  });
  if (!project) return null;

  const liked = await prisma.like.findUnique({
    where: { projectId_ipAddress: { projectId: project.id, ipAddress: getClientIp() } },
    select: { id: true },
  });

  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    content: project.content,
    imageUrl: project.imageUrl,
    techStack: project.techStack,
    projectUrl: project.projectUrl,
    githubUrl: project.githubUrl,
    likeCount: project._count.likes,
    viewCount: project._count.views,
    hasLiked: liked !== null,
  };
}

export async function getGuestbookEntries(page = 1): Promise<Paginated<GuestbookEntry>> {
  const current = clampPage(page);
  const [total, rows] = await Promise.all([
    prisma.guestbookEntry.count(),
    prisma.guestbookEntry.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (current - 1) * GUESTBOOK_PAGE_SIZE,
      take: GUESTBOOK_PAGE_SIZE,
      select: { id: true, name: true, message: true, createdAt: true },
    }),
  ]);

  const items = rows.map((e) => ({
    id: e.id,
    name: e.name,
    message: e.message,
    createdAt: e.createdAt.toISOString(),
  }));

  return paginate(items, current, GUESTBOOK_PAGE_SIZE, total);
}

export interface ExperienceEntry {
  id: number;
  company: string;
  role: string;
  description: string;
  location: string;
  url: string;
  startDate: string;
  endDate: string | null;
}

/** Work history, newest first. Empty until rows are added in Prisma Studio. */
export async function getExperiences(): Promise<ExperienceEntry[]> {
  const rows = await prisma.experience.findMany({
    where: { published: true },
    orderBy: { startDate: 'desc' },
    select: {
      id: true,
      company: true,
      role: true,
      description: true,
      location: true,
      url: true,
      startDate: true,
      endDate: true,
    },
  });

  return rows.map((e) => ({
    ...e,
    startDate: e.startDate.toISOString(),
    endDate: e.endDate ? e.endDate.toISOString() : null,
  }));
}

/** The most recent guestbook messages, for the homepage teaser. */
export async function getRecentGuestbookEntries(limit = 3): Promise<GuestbookEntry[]> {
  const rows = await prisma.guestbookEntry.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: { id: true, name: true, message: true, createdAt: true },
  });

  return rows.map((e) => ({
    id: e.id,
    name: e.name,
    message: e.message,
    createdAt: e.createdAt.toISOString(),
  }));
}

/** Site-wide values editable in Prisma Studio. */
export const SETTINGS = {
  contactEmail: 'contact_email',
  contactPhone: 'contact_phone',
  linkedinUrl: 'linkedin_url',
  githubUrl: 'github_url',
  gitlabUrl: 'gitlab_url',
  youtubeUrl: 'youtube_url',
  appVersion: 'app_version',
} as const;

export const DEFAULT_CONTACT_EMAIL = 'thalvindo@gmail.com';

/** Used only when the row is missing and no build-time version was injected. */
export const DEFAULT_APP_VERSION = '0.1.0';

/**
 * Settings are read from the root layout, so every page depends on them — and
 * `/_not-found` is prerendered at build time, when no database exists at all.
 * A failed lookup therefore falls back rather than throwing: the build works
 * without a database, and a runtime blip degrades the footer instead of
 * returning 500 for the whole site.
 */
async function getSetting(key: string, fallback: string): Promise<string> {
  try {
    const row = await prisma.siteSetting.findUnique({
      where: { key },
      select: { value: true },
    });
    const value = row?.value.trim();
    return value ? value : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Every way to reach me, shown on the homepage and in the footer. A blank value
 * hides that link, so adding a channel means filling the row in Prisma Studio —
 * no code change. Email is the one that always renders; it falls back to
 * DEFAULT_CONTACT_EMAIL so the contact card is never empty.
 */
export interface ContactLinks {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  gitlab: string;
  youtube: string;
}

/** All contact rows in one round trip, rather than one query per channel. */
export async function getContactLinks(): Promise<ContactLinks> {
  const keys = [
    SETTINGS.contactEmail,
    SETTINGS.contactPhone,
    SETTINGS.linkedinUrl,
    SETTINGS.githubUrl,
    SETTINGS.gitlabUrl,
    SETTINGS.youtubeUrl,
  ];

  // Same reasoning as getSetting: never let a missing database break the layout.
  let rows: { key: string; value: string }[] = [];
  try {
    rows = await prisma.siteSetting.findMany({
      where: { key: { in: keys } },
      select: { key: true, value: true },
    });
  } catch {
    rows = [];
  }

  const values = new Map(rows.map((r) => [r.key, r.value.trim()]));
  const get = (key: string) => values.get(key) ?? '';

  return {
    email: get(SETTINGS.contactEmail) || DEFAULT_CONTACT_EMAIL,
    phone: get(SETTINGS.contactPhone),
    linkedin: get(SETTINGS.linkedinUrl),
    github: get(SETTINGS.githubUrl),
    gitlab: get(SETTINGS.gitlabUrl),
    youtube: get(SETTINGS.youtubeUrl),
  };
}

/**
 * The version shown in the footer. The `app_version` row wins, so a release can
 * be stamped from Prisma Studio without a rebuild; `NEXT_PUBLIC_APP_VERSION`
 * stays as the fallback so a fresh database still shows something sensible.
 */
export function getAppVersion(): Promise<string> {
  const buildTime = process.env.NEXT_PUBLIC_APP_VERSION?.trim();
  return getSetting(SETTINGS.appVersion, buildTime || DEFAULT_APP_VERSION);
}
