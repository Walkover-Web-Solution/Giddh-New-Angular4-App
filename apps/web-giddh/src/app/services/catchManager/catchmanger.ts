import { Injectable } from '@angular/core';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ToasterService } from '../toaster.service';
import { Observable } from 'rxjs';
// import { LoginActions } from '../actions/login.action';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ErrorHandler {

  constructor(private _toaster: ToasterService, private store: Store<AppState>) {
  }

  public HandleCatch<TResponce, TRequest>(r: HttpErrorResponse, request?: any, queryString?: any): Observable<BaseResponse<TResponce, TRequest>> {
    let data: BaseResponse<TResponce, TRequest> = new BaseResponse<TResponce, TRequest>();
    // logout if invalid session detacted
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
      if (r.status === 500 ||
        r.status === 501 ||
        r.status === 502 ||
        r.status === 503 ||
        r.status === 504 ||
        r.status === 505 ||
        r.status === 506 ||
        r.status === 507 ||
        r.status === 508 ||
        r.status === 509 ||
        r.status === 510 ||
        r.status === 511
      ) {
        data.status = 'error';
        data.message = 'Something went wrong';
        data.body = null;
        data.code = 'Internal Error';
      } else {
        data = r.error as any;
        if (data) {
          if (data.code === 'SESSION_EXPIRED_OR_INVALID') {
            this.store.dispatch({type: 'LoginOut'});
          } else if (data.code === 'INVALID_JSON') {
            let dataToSend = {
              requestBody: '', // r.error.request ? r.error.request : request
              queryString: data.queryString,
              method: '',
              url: r.url,
              email: null,
              userUniqueName: null,
              environment: null,
              key: r.error.message ? r.error.message.substring(r.error.message.indexOf(':') + 2, r.error.message.length) : null,
            };
            this.store.dispatch({type: 'REPORT_INVALID_JSON', payload: dataToSend});
          } else if (data.code === '') {
            // handle unshared company response
            // this.store.dispatch({type: 'CompanyRefresh'});
          }
          data.request = request;
          data.queryString = queryString;
        }

      }

    }
    return new Observable<BaseResponse<TResponce, TRequest>>((o) => {
      o.next(data);
    });
  }

}

export function HandleCatch<TResponce, TRequest>(r: any, request?: any, queryString?: any): Observable<BaseResponse<TResponce, TRequest>> {
  let data: BaseResponse<TResponce, TRequest> = new BaseResponse<TResponce, TRequest>();
  // logout if invalid session detacted
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
      if (data.code === 'SESSION_EXPIRED_OR_INVALID') {
        // this.store.dispatch('LoginOut');
        this.store.dispatch({type: 'LoginOut'});
      }
    }
    data.request = request;
    data.queryString = queryString;
  }
  return new Observable<BaseResponse<TResponce, TRequest>>((o) => {
    o.next(data);
  });
}
