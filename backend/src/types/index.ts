export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostWithCounts extends Post {
  like_count: string;
  view_count: string;
}

export interface Admin {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface JwtPayload {
  adminId: number;
  username: string;
}
