export interface PaginationParams {
  page:       number;
  limit:      number;
  sortBy?:    string;
  sortOrder?: 'asc' | 'desc';
  search?:    string;
}

export interface PaginationMeta {
  page:       number;
  limit:      number;
  total:      number;
  totalPages: number;
  hasPrev:    boolean;
  hasNext:    boolean;
}

export function calcPaginationMeta(
  page: number, limit: number, total: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page, limit, total, totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  };
}