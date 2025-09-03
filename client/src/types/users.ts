export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  created_at: string;
  updated_at: string;
}

export interface UserFilters {
  nome?: string;
  limit?: number;
  offset?: number;
}
