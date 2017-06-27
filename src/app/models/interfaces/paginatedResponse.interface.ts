export interface IPagination {
  count: number;
  page: number;
  totalItems: number;
  totalPages: number;
}

export interface IPaginatedResponse extends IPagination {
  size: number;
  results: any[];
}
