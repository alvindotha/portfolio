export const PAGE_SIZE = 12;
export const GUESTBOOK_PAGE_SIZE = 20;

export interface Paginated<T> {
  items: T[];
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export function paginate<T>(items: T[], page: number, limit: number, total: number): Paginated<T> {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return { items, page, totalPages, hasMore: page < totalPages };
}

export function clampPage(page: number): number {
  return Math.max(1, Math.floor(page) || 1);
}
