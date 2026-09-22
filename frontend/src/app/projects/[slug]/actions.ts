'use server';

import { prisma } from '@/lib/prisma';
import { getClientIp } from '@/lib/ip';

async function publishedProjectId(slug: string): Promise<number | null> {
  const project = await prisma.project.findFirst({
    where: { slug, published: true },
    select: { id: true },
  });
  return project?.id ?? null;
}

/** Records one view per IP; returns the current total. */
export async function recordView(slug: string): Promise<number | null> {
  const projectId = await publishedProjectId(slug);
  if (projectId === null) return null;

  const ipAddress = getClientIp();
  await prisma.view.upsert({
    where: { projectId_ipAddress: { projectId, ipAddress } },
    create: { projectId, ipAddress },
    update: {},
  });

  return prisma.view.count({ where: { projectId } });
}

export async function toggleLike(
  slug: string
): Promise<{ liked: boolean; likeCount: number } | null> {
  const projectId = await publishedProjectId(slug);
  if (projectId === null) return null;

  const ipAddress = getClientIp();
  const existing = await prisma.like.findUnique({
    where: { projectId_ipAddress: { projectId, ipAddress } },
    select: { id: true },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({ data: { projectId, ipAddress } });
  }

  const likeCount = await prisma.like.count({ where: { projectId } });
  return { liked: !existing, likeCount };
}
