import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpWrapperService } from './httpWrapper.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Observable } from 'rxjs/Observable';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { UserDetails } from '../models/api-models/loginModels';
import { ErrorHandler } from './catchManager/catchmanger';
import { TB_PL_BS_API } from './apiurls/tl-pl.api';
import {
  AccountDetails,
  BalanceSheetRequest,
  ProfitLossRequest,
  TrialBalanceExportExcelRequest,
  TrialBalanceRequest
} from '../models/api-models/tb-pl-bs';
import { saveAs } from 'file-saver';

@Injectable()
export class TlPlService {
  private companyUniqueName: string;
  private user: UserDetails;

  constructor(private errorHandler: ErrorHandler, public _http: HttpWrapperService, public _router: Router, private store: Store<AppState>) {
  }

  /**
   * Get Trial Balance
   */
  public GetTrailBalance(request: TrialBalanceRequest): Observable<BaseResponse<AccountDetails, TrialBalanceRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(TB_PL_BS_API.GET_TRIAL_BALANCE
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), { from: request.from, to: request.to, refresh: request.refresh })
      .map((res) => {
        let data: BaseResponse<AccountDetails, TrialBalanceRequest> = res.json();
        data.request = request;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<AccountDetails, TrialBalanceRequest>(e, request));
  }

  /**
   * get Profit/Loss
   */
  public GetProfitLoss(request: ProfitLossRequest): Observable<BaseResponse<AccountDetails, ProfitLossRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    let filteredRequest = (Object.keys(request)
      .filter(p => request[p] != null)
      .reduce((r, i) => ({ ...r, [i]: request[i] }), {}));

    return this._http.get(TB_PL_BS_API.GET_PROFIT_LOSS
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), filteredRequest)
      .map((res) => {
        let data: BaseResponse<AccountDetails, ProfitLossRequest> = res.json();
        data.request = request;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<AccountDetails, ProfitLossRequest>(e, request));
  }

  /**
   * get BalanceSheet
   */
  public GetBalanceSheet(request: BalanceSheetRequest): Observable<BaseResponse<AccountDetails, BalanceSheetRequest>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    let filteredRequest = (Object.keys(request)
      .filter(p => request[p] != null)
      .reduce((r, i) => ({ ...r, [i]: request[i] }), {}));

    return this._http.get(TB_PL_BS_API.GET_BALANCE_SHEET
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), filteredRequest)
      .map((res) => {
        let data: BaseResponse<AccountDetails, BalanceSheetRequest> = res.json();
        data.request = request;
        return data;
      })
      .catch((e) => this.errorHandler.HandleCatch<any, any>(e));
  }

  public DownloadTrialBalanceExcel(request: TrialBalanceExportExcelRequest): Observable<BaseResponse<any, any>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });

    return this._http.get(TB_PL_BS_API.DOWNLOAD_TRIAL_BALANCE_EXCEL
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), request)
      .map((res) => {
        let data = this.b64toBlob(res.json().body, "application/xml", 512);
        saveAs(data, "trialbalance.xlsx");
        return res.json();
      })
      .catch((e) => this.errorHandler.HandleCatch<any, any>(e));
  }

  public DownloadBalanceSheetExcel(request: ProfitLossRequest): Observable<BaseResponse<any, any>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    let filteredRequest = (Object.keys(request)
      .filter(p => request[p] != null)
      .reduce((r, i) => ({ ...r, [i]: request[i] }), {}));

    return this._http.get(TB_PL_BS_API.DOWNLOAD_BALANCE_SHEET_EXCEL
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), filteredRequest)
      .map((res) => {
        let data = this.b64toBlob(res.json().body, "application/xml", 512);
        saveAs(data, "balancesheet.xlsx");
        return res.json();
      })
      .catch((e) => this.errorHandler.HandleCatch<any, any>(e));
  }

  public DownloadProfitLossExcel(request: ProfitLossRequest): Observable<BaseResponse<any, any>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    let filteredRequest = (Object.keys(request)
      .filter(p => request[p] != null)
      .reduce((r, i) => ({ ...r, [i]: request[i] }), {}));

    return this._http.get(TB_PL_BS_API.DOWNLOAD_PROFIT_LOSS_EXCEL
      .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), filteredRequest)
      .map((res) => {
        let data = this.b64toBlob(res.json().body, "application/xml", 512);
        saveAs(data, "profitloss.xlsx");
        return res.json();
      })
      .catch((e) => this.errorHandler.HandleCatch<any, any>(e));
  }

  private b64toBlob = (b64Data, contentType, sliceSize) => {
    let blob;
    let byteArray;
    let byteArrays;
    let byteCharacters;
    let byteNumbers;
    let i;
    let offset;
    let slice;
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    byteCharacters = atob(b64Data);
    byteArrays = [];
    offset = 0;
    while (offset < byteCharacters.length) {
      slice = byteCharacters.slice(offset, offset + sliceSize);
      byteNumbers = new Array(slice.length);
      i = 0;
      while (i < slice.length) {
        byteNumbers[i] = slice.charCodeAt(i);
        i++;
      }
      byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
      offset += sliceSize;
    }
    blob = new Blob(byteArrays, {
      type: contentType
    });
    return blob;
  };
}
