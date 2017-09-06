import { Injectable } from '@angular/core';
import { BaseResponse } from './../../models/api-models/BaseResponse';
import { ToasterService } from './../toaster.service';
import { AuthenticationService } from './../authentication.service';
import { Observable } from 'rxjs/Observable';
// import { LoginActions } from '../actions/login.action';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';

@Injectable()
export class ErrorHandler {
  constructor(private _toaster: ToasterService, private store: Store<AppState>) { }

  public handle<TResponce, TRequest>(e: any) {
    let response: BaseResponse<TResponce, TRequest> = new BaseResponse<TResponce, TRequest>();
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
export function HandleCatch<TResponce, TRequest>(r: any, request?: any, queryString?: any): Observable<BaseResponse<TResponce, TRequest>> {
  let data: BaseResponse<TResponce, TRequest> = new BaseResponse<TResponce, TRequest>();
  // logout if invalid session detacted
  if (r.code === 'SESSION_EXPIRED_OR_INVALID') {
    this.store.dispatch('LoginOut');
  }

  if (r.status === 0) {
    data = {
      body: null,
      code: 'Internal Error',
      message: 'something went wrong',
      status: 'error'
    };
    data.request = request;
    data.queryString = queryString;
  } else {
    if (r.text() === '') {
      //
      data.status = 'error';
      data.message = 'Something went wrong';
      data.body = null;
      data.code = 'Internal Error';
    } else {
      data = r.json();
    }
    data.request = request;
    data.queryString = queryString;
  }
  return new Observable<BaseResponse<TResponce, TRequest>>((o) => { o.next(data); });
}
