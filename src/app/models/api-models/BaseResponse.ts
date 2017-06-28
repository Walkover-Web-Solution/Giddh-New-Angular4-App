export class BaseResponse<TResponce, TRequest> {
  public status: string;
  public code?: string;
  public message?: string;
  public body?: TResponce;
  public response?: TResponce;
  public request?: TRequest;
  public queryString?: any;
}
