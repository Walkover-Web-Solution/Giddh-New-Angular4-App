import { BaseResponse } from '../../models/api-models/BaseResponse';
import { Observable } from 'rxjs/Observable';

export function HandelCache<T>(r: any): Observable<BaseResponse<T>> {
  let data: BaseResponse<T> = new BaseResponse<T>();
  debugger;
  if (r.status === 0) {
    data = {
      body: null,
      code: 'Internal Error',
      message: 'something went wrong',
      status: 'error'
    };
  } else {
    data = r.json();
  }
  return new Observable<BaseResponse<T>>((o) => { o.next(data); });
}
