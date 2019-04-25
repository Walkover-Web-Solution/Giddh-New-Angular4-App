export class BaseResponse<TResponce, TRequest> {
  public status: string;
  public code?: string;
  public message?: string;
  public body?: TResponce;
  // public body?: any;
  public response?: TResponce;
  // public response?: any;
  public request?: TRequest;
  // public request?: any;
  public queryString?: any;
}

export interface PagedResponse {
  count: number;
  page: number;
  totalPages: number;
  totalItems: number;
}
