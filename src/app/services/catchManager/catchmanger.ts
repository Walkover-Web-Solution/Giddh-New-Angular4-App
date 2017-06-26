import { Injectable } from '@angular/core';
import { BaseResponse } from './../../models/api-models/BaseResponse';
import { ToasterService } from './../toaster.service';
import { AuthenticationService } from './../authentication.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ErrorHandler {
  constructor(private _toaster: ToasterService) { }

  public handle<T>(e: any) {
  let response: BaseResponse<T> = new BaseResponse<T>();
    if (e.status === 0) {
      response = {
        body: null,
        code: 'Internal Error',
        message: 'something went wrong',
        status: 'error'
      };
    } else {
      response = e.json();
    }
    this._toaster.errorToast(response.status, response.message);
    return Observable.throw(e);
    // return new Observable<BaseResponse<T>>((o) => { o.next(response); });
  }
}
export function HandleCatch<T>(r: any): Observable<BaseResponse<T>> {
  let data: BaseResponse<T> = new BaseResponse<T>();
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
