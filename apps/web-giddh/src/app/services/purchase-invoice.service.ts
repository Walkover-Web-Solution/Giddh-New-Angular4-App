import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './http-wrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GST_RETURN_API, PURCHASE_INVOICE_API } from './apiurls/purchase-invoice.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

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
    public sendToGstr2: boolean;
    public availItc: boolean;
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

@Injectable()
export class PurchaseInvoiceService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    /*
    * SEND GSTR3B Email
    * API: 'gstreturn/gstr3b-excel-export/email?monthYear=:month&gstin=:company_gstin&detailedSheet=:isNeedDetailSheet&email=:userEmail'
    * Method: GET
    */
    public SendGSTR3BEmail(reqObj: { month: string, gstNumber: string, isNeedDetailSheet: string, email?: string }): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + PURCHASE_INVOICE_API.SEND_GSTR3B_EMAIL?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':isNeedDetailSheet', reqObj.isNeedDetailSheet)?.replace(':month', reqObj.month)?.replace(':company_gstin', reqObj.gstNumber)?.replace(':userEmail', reqObj.email)).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.queryString = { reqObj };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    public FileGstReturn(reqObj): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url;
        if (reqObj.via && reqObj.via === 'JIO_GST') {
            url = GST_RETURN_API.FILE_JIO_GST_RETURN?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':from', reqObj.period.from)?.replace(':to', reqObj.period.to)?.replace(':company_gstin', reqObj.gstNumber);
        }
        else if (reqObj.via === 'TAXPRO') {
            url = GST_RETURN_API.FILE_TAX_PRO_RETURN?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':from', reqObj.period.from)?.replace(':to', reqObj.period.to)?.replace(':company_gstin', reqObj.gstNumber);
        } else if (reqObj.via === 'VAYANA') {
            url = GST_RETURN_API.FILE_VAYANA_RETURN?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':from', reqObj.period.from)?.replace(':to', reqObj.period.to)?.replace(':company_gstin', reqObj.gstNumber);
        }
        return this.http.get(this.config.apiUrl + url).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.queryString = { reqObj };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

    public FileGstr3B(reqObj: any): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + GST_RETURN_API.FILE_GSTR3B?.replace(':companyUniqueName', this.companyUniqueName)?.replace(':company_gstin', reqObj.gstNumber)?.replace(':from', reqObj.period.from)?.replace(':to', reqObj.period.to)?.replace(':gsp', reqObj.via), {}).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.queryString = {};
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e)));
    }

}
