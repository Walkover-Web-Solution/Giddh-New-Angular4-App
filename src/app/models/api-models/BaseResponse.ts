export class BaseResponse<T> {
  public status: string;
  public code?: string;
  public message?: string;
  public body?: T;
}
