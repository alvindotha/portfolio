const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

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
  // Public
  getPosts: () => request<any[]>('/api/posts'),
  getPost: (slug: string) => request<any>(`/api/posts/${slug}`),
  viewPost: (slug: string) => request<any>(`/api/posts/${slug}/view`, { method: 'POST' }),
  likePost: (slug: string) => request<any>(`/api/posts/${slug}/like`, { method: 'POST' }),

  // Auth
  login: (username: string, password: string) =>
    request<{ token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // Projects
  getProjects: () => request<any[]>('/api/projects'),
  getProject: (slug: string) => request<any>(`/api/projects/${slug}`),

  // Admin Posts
  getAdminPosts: () => request<any[]>('/api/admin/posts'),
  createPost: (data: any) =>
    request<any>('/api/admin/posts', { method: 'POST', body: JSON.stringify(data) }),
  updatePost: (id: number, data: any) =>
    request<any>(`/api/admin/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePost: (id: number) =>
    request<any>(`/api/admin/posts/${id}`, { method: 'DELETE' }),

  // Admin Projects
  getAdminProjects: () => request<any[]>('/api/admin/projects'),
  createProject: (data: any) =>
    request<any>('/api/admin/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: number, data: any) =>
    request<any>(`/api/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: number) =>
    request<any>(`/api/admin/projects/${id}`, { method: 'DELETE' }),
};
