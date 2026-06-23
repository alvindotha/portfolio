const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { data: null, error: body.error || `HTTP ${res.status}` };
    }

    const body = await res.json();
    return { data: body.data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Network error' };
  }
}

export const api = {
  // Guestbook
  getGuestbook: (page: number = 1, limit: number = 20) =>
    request<PaginatedResponse<any[]>>(`/api/guestbook?page=${page}&limit=${limit}`),
  postGuestbook: (name: string, message: string, turnstileToken: string) =>
    request<any>('/api/guestbook', {
      method: 'POST',
      body: JSON.stringify({ name, message, turnstileToken }),
    }),

  // Public
  getPosts: (page: number = 1, limit: number = 12) =>
    request<PaginatedResponse<any[]>>(`/api/posts?page=${page}&limit=${limit}`),
  getPost: (slug: string) => request<any>(`/api/posts/${slug}`),
  viewPost: (slug: string) => request<any>(`/api/posts/${slug}/view`, { method: 'POST' }),
  likePost: (slug: string) => request<any>(`/api/posts/${slug}/like`, { method: 'POST' }),

  // Projects
  getProjects: (page: number = 1, limit: number = 12) =>
    request<PaginatedResponse<any[]>>(`/api/projects?page=${page}&limit=${limit}`),
  getProject: (slug: string) => request<any>(`/api/projects/${slug}`),
};
