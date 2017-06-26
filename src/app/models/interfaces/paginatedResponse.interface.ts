export interface IPaginatedResponse {
  count: number;
  page: number;
  results: any[];
  size: number;
  totalItems: number;
  totalPages: number;
}
