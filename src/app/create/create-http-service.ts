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
    return this._http.post(this.config.apiUrl + '/v2/company/newsncindore15000172022770ygv88/accounts/cash/invoices/preview', data).map((res) => {
        let response: BaseResponse<any, any> = res;
        data.request = data;
        return data;
      });
  }
}
