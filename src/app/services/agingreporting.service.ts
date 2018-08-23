import { Inject, Injectable, OnInit, Optional } from '@angular/core';
import { HttpWrapperService } from './httpWrapper.service';
import { DueAmountReportRequest, DueAmountReportResponse, DueRangeRequest } from '../models/api-models/Contact';
import { Observable } from 'rxjs';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { DUEAMOUNTREPORT_API_V2, DUEDAYSRANGE_API_V2 } from './apiurls/aging-reporting';
import { GeneralService } from './general.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { observable } from '../../../node_modules/rxjs/symbol/observable';

@Injectable()
export class AgingreportingService implements OnInit {
  private companyUniqueName: string;

  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService,
              private _generalService: GeneralService,
              @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    this.companyUniqueName = this._generalService.companyUniqueName;
  }

  public ngOnInit() {
    //
  }

  public CreateDueDaysRange(model: DueRangeRequest): Observable<BaseResponse<string, DueRangeRequest>> {
    this.companyUniqueName = this._generalService.companyUniqueName;
    return this._http.post(this.config.apiUrl + DUEDAYSRANGE_API_V2.CREATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model)
      .map((res) => {
        let data: BaseResponse<string, DueRangeRequest> = res;
        data.request = model;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<string, DueRangeRequest>(e, model, {}));
  }

  // public CreateDueAmountReport(model: DueAmountReportRequest): Observable<BaseResponse<DueAmountReportResponse, DueAmountReportRequest>> {
  //   this.companyUniqueName = this._generalService.companyUniqueName;
  //   return this._http.post(this.config.apiUrl + DUEAMOUNTREPORT_API_V2.CREATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model)
  //     .map((res) => {
  //       let data: BaseResponse<DueAmountReportResponse, DueAmountReportRequest> = res;
  //       data.request = model;
  //       return data;
  //     })
  //     .catch((e) => this.errorHandler.HandleCatch<string, DueRangeRequest>(e, model, {}));
  // }
  //
  // public GetDueAmountReport(q: string, page: number = 1, count: number = 20, sort: boolean, sortBy: string): Observable<BaseResponse<DueAmountReportResponse, string>> {
  //   this.companyUniqueName = this._generalService.companyUniqueName;
  //   if (this.companyUniqueName) {
  //     return this._http.get(this.config.apiUrl + DUEAMOUNTREPORT_API_V2.GET.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)
  //       .replace(':q', encodeURIComponent(q || ''))
  //       .replace(':page', encodeURIComponent(page.toString()))
  //       .replace(':count', encodeURIComponent(count.toString()))
  //       .replace(':sort', encodeURIComponent(sortBy.toString()))
  //     ));
  //   } else {
  //     return observable.empty();
  //   }
  // }

}
