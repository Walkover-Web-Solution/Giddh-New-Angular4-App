export class BaseResponse<TResponse, TRequest = ''> {
  public status: string;
  public code?: string;
  public message?: string;
  public body?: TResponse;
  public response?: TResponse;
  public request?: TRequest;
}
