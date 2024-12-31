export type User = {
  id: string;
  name: string;
  email: string;
  department: string | null;
  contact: string | null;
  role: 'admin' | 'developer' | 'user';
  created_at: string;
  updated_at: string;
  last_login: string | null;
};

export type Application = {
  id: string;
  name: string;
  description: string | null;
  status: 'development' | 'released' | 'discontinued';
  next_release_date: string | null;
  progress: number;
  developer_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Content = {
  id: string;
  type: 'issue' | 'knowledge';
  title: string;
  body: string;
  status: 'open' | 'in_progress' | 'resolved' | null;
  priority: 'low' | 'medium' | 'high' | null;
  category: string | null;
  tags: string[] | null;
  author_id: string | null;
  application_id: string | null;
  created_at: string;
  updated_at: string;
};