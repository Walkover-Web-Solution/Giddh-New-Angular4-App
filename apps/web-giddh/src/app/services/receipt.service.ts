import { catchError, map } from 'rxjs/operators';
import { Inject, Injectable, OnInit, Optional } from '@angular/core';
import { GeneralService } from './general.service';
import { DownloadVoucherRequest, InvoiceReceiptFilter, ReceiptVoucherDetailsRequest, ReciptDeleteRequest, ReciptRequest, ReciptResponse, Voucher } from '../models/api-models/recipt';
import { Observable } from 'rxjs';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { HttpWrapperService } from './httpWrapper.service';
import { HttpClient } from '@angular/common/http';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { RECEIPT_API } from './apiurls/recipt.api';
import { ErrorHandler } from './catchManager/catchmanger';
import { UserDetails } from '../models/api-models/loginModels';
import { LoaderService } from '../loader/loader.service';
import { ReportsDetailedRequestFilter, SalesRegisteDetailedResponse } from '../models/api-models/Reports';
import { COMPANY_API } from './apiurls/comapny.api';

@Injectable()
export class ReceiptService implements OnInit {
    private companyUniqueName: string;
    private user: UserDetails;

    constructor(private _generalService: GeneralService, private _http: HttpWrapperService,
        private _httpClient: HttpClient, private errorHandler: ErrorHandler,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs, private _loaderService: LoaderService) {
        this.companyUniqueName = this._generalService.companyUniqueName;
    }

    public ngOnInit() {
        //
    }

    public UpdateReceipt(accountUniqueName: string, model: ReciptRequest): Observable<BaseResponse<string, ReciptRequest>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.put(this.config.apiUrl + RECEIPT_API.PUT
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':accountUniqueName', encodeURIComponent(accountUniqueName)), model).pipe(
                map((res) => {
                    let data: BaseResponse<string, ReciptRequest> = res;
                    data.request = model;
                    data.queryString = { accountUniqueName };
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<string, ReciptRequest>(e, model)));
    }

    public GetAllReceipt(body: InvoiceReceiptFilter, type: string): Observable<BaseResponse<ReciptResponse, InvoiceReceiptFilter>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        let requestType = type;
        let url = this.createQueryString(this.config.apiUrl + RECEIPT_API.GET_ALL, {
            page: body.page, count: body.count, from: body.from, to: body.to, type: requestType, q: body.q, sort: body.sort, sortBy: body.sortBy
        });

        return this._http.post(url
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), body).pipe(
                map((res) => {
                    let data: BaseResponse<ReciptResponse, InvoiceReceiptFilter> = res;
                    data.queryString = { page: body.page, count: body.count, from: body.from, to: body.to, type: 'pdf' };
                    data.request = body;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<ReciptResponse, InvoiceReceiptFilter>(e, body, { page: body.page, count: body.count, from: body.from, to: body.to, type: 'pdf' })));
    }

    public DeleteReceipt(accountUniqueName: string, queryRequest: ReciptDeleteRequest): Observable<BaseResponse<string, ReciptDeleteRequest>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.deleteWithBody(
            this.config.apiUrl + RECEIPT_API.DELETE
                .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                .replace(':accountUniqueName', encodeURIComponent(accountUniqueName)),
            queryRequest
        ).pipe(
            map((res) => {
                let data: BaseResponse<string, ReciptDeleteRequest> = res;
                data.request = queryRequest;
                data.queryString = { accountUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<string, ReciptDeleteRequest>(e, accountUniqueName))
        )
        // let sessionId = this._generalService.sessionId;
        // let args: any = {headers: {}};
        // if (sessionId) {
        //   args.headers['Session-Id'] = sessionId;
        // }
        // args.headers['Content-Type'] = 'application/json';
        // args.headers['Accept'] = 'application/json';
        // args.headers = new HttpHeaders(args.headers);
        //
        // return this._httpClient.request('delete', this.config.apiUrl + RECEIPT_API.DELETE
        //   .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
        //   .replace(':accountUniqueName', encodeURIComponent(accountUniqueName)),
        //   {
        //     body: queryRequest,
        //     headers: args.headers,
        //   }).pipe(
        //   map((res) => {
        //     let data: any = res;
        //     data.request = queryRequest;
        //     data.queryString = {accountUniqueName};
        //     return data;
        //   }), catchError((e) => this.errorHandler.HandleCatch<string, ReciptDeleteRequest>(e, accountUniqueName)));
    }

    public DownloadVoucher(model: DownloadVoucherRequest, accountUniqueName: string, isPreview: boolean = false): any {
        this.user = this._generalService.user;
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + RECEIPT_API.DOWNLOAD_VOUCHER
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':accountUniqueName', encodeURIComponent(accountUniqueName))
            , model, { responseType: isPreview ? 'text' : 'blob' }).pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.queryString = accountUniqueName;
                    data.request = model;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model, { accountUniqueName }))
            );
    }

    public GetVoucherDetails(accountUniqueName: string, model: ReceiptVoucherDetailsRequest): Observable<BaseResponse<Voucher, ReceiptVoucherDetailsRequest>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + RECEIPT_API.GET_DETAILS
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':accountUniqueName', encodeURIComponent(accountUniqueName)),
            model
        ).pipe(
            map((res) => {
                let data: BaseResponse<Voucher, ReceiptVoucherDetailsRequest> = res;
                data.queryString = accountUniqueName;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<Voucher, ReceiptVoucherDetailsRequest>(e, model, { accountUniqueName })));
    }

    public GetVoucherDetailsV4(accountUniqueName: string, model: ReceiptVoucherDetailsRequest): Observable<BaseResponse<Voucher, ReceiptVoucherDetailsRequest>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        return this._http.post(this.config.apiUrl + RECEIPT_API.GET_DETAILS_V4
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
            .replace(':accountUniqueName', encodeURIComponent(accountUniqueName)),
            model
        ).pipe(
            map((res) => {
                let data: BaseResponse<Voucher, ReceiptVoucherDetailsRequest> = res;
                data.queryString = accountUniqueName;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<Voucher, ReceiptVoucherDetailsRequest>(e, model, { accountUniqueName })));
    }

    /*
  * get detailed registered sales
  * */
    public getDetailedSalesRegister(request: ReportsDetailedRequestFilter) {
        this.companyUniqueName = this._generalService.companyUniqueName;
        let url = this.createQueryString(this.config.apiUrl + COMPANY_API.GET_DETAILED_REGISTERED_SALES, {
            page: request.page, count: request.count, from: request.from, to: request.to, q: request.q, sort: request.sort, sortBy: request.sortBy
        });
        return this._http.get(url
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
                let data: BaseResponse<SalesRegisteDetailedResponse, string> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, SalesRegisteDetailedResponse>(e, ReportsDetailedRequestFilter)));
    }

    /*
  * get detailed registered sales
  * */
    public getDetailedPurchaseRegister(request: ReportsDetailedRequestFilter) {
        this.companyUniqueName = this._generalService.companyUniqueName;
        let url = this.createQueryString(this.config.apiUrl + COMPANY_API.GET_DETAILED_REGISTERED_PURCHASE, {
            page: request.page, count: request.count, from: request.from, to: request.to, q: request.q, sort: request.sort, sortBy: request.sortBy
        });
        return this._http.get(url
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
                let data: BaseResponse<SalesRegisteDetailedResponse, string> = res;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<string, SalesRegisteDetailedResponse>(e, ReportsDetailedRequestFilter)));
    }

    private createQueryString(str, model) {
        let url = str;
        if ((model.from)) {
            url = url + 'from=' + model.from + '&';
        }
        if ((model.to)) {
            url = url + 'to=' + model.to + '&';
        }
        if ((model.page)) {
            url = url + 'page=' + model.page + '&';
        }
        if ((model.count)) {
            url = url + 'count=' + model.count;
        }

        if ((model.type)) {
            url = url + '&type=' + model.type;
        }
        if ((model.sort)) {
            url = url + '&sort=' + model.sort;
        }
        if ((model.sortBy)) {
            url = url + '&sortBy=' + model.sortBy;
        }
        if ((model.q)) {
            url = url + '&q=' + model.q;
        }
        return url;
    }

    public GetAllReceiptBalanceDue(body: InvoiceReceiptFilter, type: string): Observable<BaseResponse<ReciptResponse, InvoiceReceiptFilter>> {
        this.companyUniqueName = this._generalService.companyUniqueName;
        let requestType = type;
        let url = this.createQueryString(this.config.apiUrl + RECEIPT_API.GET_ALL_BAL_SALE_DUE, {
            page: body.page, count: body.count, from: body.from, to: body.to, type: requestType, q: body.q, sort: body.sort, sortBy: body.sortBy
        });

        return this._http.post(url
            .replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), body).pipe(
                map((res) => {
                    let data: BaseResponse<ReciptResponse, InvoiceReceiptFilter> = res;
                    data.queryString = { page: body.page, count: body.count, from: body.from, to: body.to, type: 'pdf' };
                    data.request = body;
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<ReciptResponse, InvoiceReceiptFilter>(e, body, { page: body.page, count: body.count, from: body.from, to: body.to, type: 'pdf' })));
    }
}
