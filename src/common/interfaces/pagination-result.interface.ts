export interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginationResult<T> {
  data: T[];
  meta: PaginationMeta;
}
