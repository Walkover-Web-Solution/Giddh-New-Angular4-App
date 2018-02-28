import { Injectable, Optional, Inject } from '@angular/core';
import { HttpWrapperService } from '../services/httpWrapper.service';
import { IServiceConfigArgs, ServiceConfig } from '../services/service.config';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CreateHttpService {
  constructor(public _http: HttpWrapperService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    //
  }

  public Generate(data: any): Observable<BaseResponse<any, any>> {
    return this._http.post(this.config.apiUrl + 'invoices', data).map((res) => {
        let response: BaseResponse<any, any> = res;
        return res;
      });
  }
}
