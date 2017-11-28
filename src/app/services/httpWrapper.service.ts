import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LoaderService } from '../loader/loader.service';
import { GeneralService } from './general.service';

@Injectable()
export class HttpWrapperService {

  constructor(private _http: Http, private _loaderService: LoaderService, private _generalService: GeneralService) {
  }

  public get = (url: string, params?: any, options?: RequestOptionsArgs): Observable<Response> => {
    options = this.prepareOptions(options);
    options.params = params;
    return this._http.get(url, options).do((res) => {
      //
    }).finally(() => {
      this.hideLoader();
    });
  }

  public post = (url: string, body: any, options?: RequestOptionsArgs): Observable<Response> => {
    options = this.prepareOptions(options);
    return this._http.post(url, body, options).do((res) => {
      //
    }).finally(() => {
      this.hideLoader();
    });
  }

  public put = (url: string, body: any, options?: RequestOptionsArgs): Observable<Response> => {
    options = this.prepareOptions(options);
    return this._http.put(url, body, options).do((res) => {
      //
    }).finally(() => {
      this.hideLoader();
    });
  }

  public delete = (url: string, params?: any, options?: RequestOptionsArgs): Observable<Response> => {
    options = this.prepareOptions(options);
    options.search = this.objectToParams(params);
    return this._http.delete(url, options).do((res) => {
      //
    }).finally(() => {
      this.hideLoader();
    });
  }

  public patch = (url: string, body: any, options?: RequestOptionsArgs): Observable<Response> => {
    options = this.prepareOptions(options);
    return this._http.patch(url, body, options).do((res) => {
      //
    }).finally(() => {
      this.hideLoader();
    });
  }

  public prepareOptions(options: RequestOptionsArgs): RequestOptionsArgs {
    this.showLoader();
    let sessionId = this._generalService.sessionId;
    options = options || {};

    if (!options.headers) {
      options.headers = new Headers();
    }

    if (sessionId) {
      options.headers.append('Session-Id', sessionId);
    }
    // options.withCredentials = true;
    options.headers.append('cache-control', 'no-cache');
    options.headers.append('Content-Type', 'application/json');
    options.headers.append('Accept', 'application/json');

    return options;
  }

  public isPrimitive(value) {
    return value == null || (typeof value !== 'function' && typeof value !== 'object');
  }

  public objectToParams(object = {}) {
    return Object.keys(object).map((value) => {
      let objectValue = this.isPrimitive(object[value]) ? object[value] : JSON.stringify(object[value]);
      return `${value}=${objectValue}`;
    }).join('&');
  }

  private showLoader(): void {
    this._loaderService.show();
  }

  private hideLoader(): void {
    this._loaderService.hide();
  }
}
