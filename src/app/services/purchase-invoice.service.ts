import { Observable } from 'rxjs/Observable';
import { HttpWrapperService } from './httpWrapper.service';
import { Injectable, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { UserDetails } from '../models/api-models/loginModels';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ErrorHandler } from './catchManager/catchmanger';
import { SmsKeyClass, EmailKeyClass } from '../models/api-models/SettingsIntegraion';
import { ActiveFinancialYear } from '../models/api-models/Company';
import { PURCHASE_INVOICE_API } from './apiurls/purchase-invoice.api';
import { CommonPaginatedRequest } from '../models/api-models/Invoice';

export interface Account {
  name: string;
  gstIn: string;
  uniqueName: string;
}

export class IInvoicePurchaseItem {
  public account: Account;
  public entryUniqueName: string;
  public entryDate: string;
  public voucherNo: number;
  public entryType: string;
  public gstin: string;
  public particular: string;
  public invoiceNumber: string;
  public utgstAmount: number;
  public igstAmount: number;
  public cgstAmount: number;
  public sgstAmount: number;
  public taxableValue: number;
  public TaxList?: ITaxResponse[];
  public taxes: string[];
  public isAllTaxSelected?: boolean;
  public invoiceGenerated: boolean;
}
export class IInvoicePurchaseResponse {
  public count: number;
  public page: number;
  public items: IInvoicePurchaseItem[];
  public totalItems: number;
  public totalPages: number;

}

/**** TAX MODEL ****/
export interface TaxAccount {
  uniqueName: string;
  name: string;
}

export interface TaxDetail {
  taxValue: number;
  date: string;
}

export class ITaxResponse {
  public uniqueName: string;
  public taxType: string;
  public accounts: TaxAccount[];
  public taxNumber: string;
  public taxDetail: TaxDetail[];
  public taxFileDate: number;
  public duration: string;
  public name: string;
  public isSelected?: boolean;
}

/**** TAX MODEL ****/

/**** GENERATE PURCHASE INVOICE REQUEST ****/

export class GeneratePurchaseInvoiceRequest {
  public entryUniqueName: string[];
  public taxes: ITaxResponse[];
}

/**** GENERATE PURCHASE INVOICE REQUEST ****/

// export interface IInvoicePurchaseResponse {
//   accountName: string;
//   igstAmount: number;
//   cgstAmount: number;
//   sgstAmount: number;
//   taxableValue: number;
//   voucherNo: number;
//   gstin: string;
//   entryDate: string;
//   entryType: string;
//   particulars: string;
//   invoiceNo: string;
//   utgstAmount: number;
// }

@Injectable()
export class PurchaseInvoiceService {

  private user: UserDetails;
  private companyUniqueName: string;
  private roleUniqueName: string;

  constructor(private errorHandler: ErrorHandler, private _http: HttpWrapperService, private store: Store<AppState>) { }

  /*
  * Get Purchase Invoice
  * API: 'company/:companyUniqueName/invoices/purchase'
  * Method: GET
  */
  public GetPurchaseInvoice(model: CommonPaginatedRequest): Observable<BaseResponse<IInvoicePurchaseResponse, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    let req = model;
    return this._http.get(PURCHASE_INVOICE_API.INVOICE_API.replace(':companyUniqueName', this.companyUniqueName), req).map((res) => {
      let data: BaseResponse<IInvoicePurchaseResponse, string> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<IInvoicePurchaseResponse, string>(e));
  }

  /*
  * Get Taxes
  * API: 'company/:companyUniqueName/tax'
  * Method: GET
  */
  public GetTaxesForThisCompany(): Observable<BaseResponse<ITaxResponse[], string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(PURCHASE_INVOICE_API.GET_TAXES.replace(':companyUniqueName', this.companyUniqueName)).map((res) => {
      let data: BaseResponse<ITaxResponse[], string> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<ITaxResponse[], string>(e));
  }

  /*
  * Update Purchase Invoice
  * API: '/company/:companyUniqueName/accounts/:accountUniqueName/invoices/generate-purchase'
  * Method: PUT
  */
  public GeneratePurchaseInvoice(model: IInvoicePurchaseItem): Observable<BaseResponse<IInvoicePurchaseItem, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    let dataToSend = {
      uniqueNames: [model.entryUniqueName],
      taxes: model.taxes
    };
    return this._http.post(PURCHASE_INVOICE_API.GENERATE_PURCHASE_INVOICE.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', model.account.uniqueName), dataToSend).map((res) => {
      let data: BaseResponse<IInvoicePurchaseItem, string> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<IInvoicePurchaseItem, string>(e));
  }

  /*
  * Download GSTR1 Sheet
  * API: 'gstreturn/GSTR_excel_export?monthYear=:month&gstin=:company_gstin'
  * Method: GET
  */
  public DownloadGSTR1Sheet(month: string, gstNumber: string): Observable<BaseResponse<any, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(PURCHASE_INVOICE_API.DOWNLOAD_GSTR1_SHEET.replace(':companyUniqueName', this.companyUniqueName).replace(':month', month).replace(':company_gstin', gstNumber)).map((res) => {
      let data: BaseResponse<any, string> = res.json();
      data.queryString = { month, gstNumber };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e));
  }

  /*
  * Download GSTR1 Error Sheet
  * API: 'gstreturn/GSTR1_error_sheet?monthYear=:month&gstin=:company_gstin'
  * Method: GET
  */
  public DownloadGSTR1ErrorSheet(month: string, gstNumber: string): Observable<BaseResponse<any, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    return this._http.get(PURCHASE_INVOICE_API.DOWNLOAD_GSTR1_ERROR_SHEET.replace(':companyUniqueName', this.companyUniqueName).replace(':month', month).replace(':company_gstin', gstNumber)).map((res) => {
      let data: BaseResponse<any, string> = res.json();
      data.queryString = { month, gstNumber };
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e));
  }

  public UpdatePurchaseInvoice(entryUniqueName: string[], taxUniqueName: string[], accountUniqueName: string): Observable<BaseResponse<any, string>> {
    console.log('ENTRY', entryUniqueName);
    console.log('TAX', taxUniqueName);
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    let req = {
      uniqueNames: entryUniqueName,
      taxes: taxUniqueName
    };
    return this._http.put(PURCHASE_INVOICE_API.INVOICE_API.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName), req).map((res) => {
      let data: BaseResponse<any, string> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e));
  }

  public UpdatePurchaseEntry(model): Observable<BaseResponse<any, string>> {
    this.store.take(1).subscribe(s => {
      if (s.session.user) {
        this.user = s.session.user.user;
      }
      this.companyUniqueName = s.session.companyUniqueName;
    });
    let accountUniqueName = model.accountUniqueName;
    let ledgerUniqname = model.ledgerUniqname;
    let req = {
      invoiceNumberAgainstVoucher: model.voucherNo
    };

    return this._http.patch(PURCHASE_INVOICE_API.UPDATE_PURCHASE_ENTRY.replace(':companyUniqueName', this.companyUniqueName).replace(':accountUniqueName', accountUniqueName).replace(':ledgerUniqueName', ledgerUniqname), req).map((res) => {
      let data: BaseResponse<any, string> = res.json();
      data.queryString = {};
      return data;
    }).catch((e) => this.errorHandler.HandleCatch<any, string>(e));
  }
}
