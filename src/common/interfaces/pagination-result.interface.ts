export interface PaginationResult<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  prevPage: number | null;
  nextPage: number | null;
}
