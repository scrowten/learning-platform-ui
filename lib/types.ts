export interface Domain {
  id: string;
  name: string;
  path: string;
  color: string;
  icon: string;
  tags: string[];
  module_count?: number;
}

export interface Module {
  id: string;
  domain_id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "research" | null;
  tags: string[];
  estimated_hours: number | null;
  git_path: string | null;
  category: string | null;
  last_reviewed: string | null;
  sota_topics: string[];
  prerequisites?: string[];
}

export interface Notebook {
  name: string;
  filename: string;
  git_path: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  } | null;
}
