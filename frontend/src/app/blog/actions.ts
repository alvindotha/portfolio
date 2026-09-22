'use server';

import { getPosts } from '@/lib/queries';

export async function loadMorePosts(page: number) {
  return getPosts(page);
}
