'use server';

import { getProjects } from '@/lib/queries';

export async function loadMoreProjects(page: number) {
  return getProjects(page);
}
