export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}
