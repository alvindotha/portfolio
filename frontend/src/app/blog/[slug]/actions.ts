'use server';

import { prisma } from '@/lib/prisma';
import { getClientIp } from '@/lib/ip';

async function publishedPostId(slug: string): Promise<number | null> {
  const post = await prisma.post.findFirst({
    where: { slug, published: true },
    select: { id: true },
  });
  return post?.id ?? null;
}

/** Records one view per IP; returns the current total. */
export async function recordView(slug: string): Promise<number | null> {
  const postId = await publishedPostId(slug);
  if (postId === null) return null;

  const ipAddress = getClientIp();
  await prisma.view.upsert({
    where: { postId_ipAddress: { postId, ipAddress } },
    create: { postId, ipAddress },
    update: {},
  });

  return prisma.view.count({ where: { postId } });
}

export async function toggleLike(
  slug: string
): Promise<{ liked: boolean; likeCount: number } | null> {
  const postId = await publishedPostId(slug);
  if (postId === null) return null;

  const ipAddress = getClientIp();
  const existing = await prisma.like.findUnique({
    where: { postId_ipAddress: { postId, ipAddress } },
    select: { id: true },
  });

  let liked: boolean;
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    liked = false;
  } else {
    await prisma.like.create({ data: { postId, ipAddress } });
    liked = true;
  }

  const likeCount = await prisma.like.count({ where: { postId } });
  return { liked, likeCount };
}
