import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './http-wrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import * as dayjs from 'dayjs';
import { GeneralService } from './general.service';
import { OCR_VOUCHER_API } from './apiurls/ocr-voucher.api';

@Injectable()
export class OcrVoucherService {
    public dayjs = dayjs;
    public ocrVoucherDetails$: BehaviorSubject<any> = new BehaviorSubject(null);
    public ocrList$: BehaviorSubject<any> = new BehaviorSubject(null);
    public getOcrData$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public uploadDataSuccess$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public saveAndNext$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public saveAndNextSuccess$: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(private errorHandler: GiddhErrorHandler,
        public http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {

    }

    /**
     * Retrieves all subscriptions with pagination and provided model from the SubscriptionsService.
     *
     * @param pagination - Pagination details.
     * @param model - Data model for filtering.
     * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
     * @memberof SubscriptionsService
     */
    public getAllOcrDocuments(pagination: any, model: any): Observable<BaseResponse<any, any>> {
        const branchUniqueName = this.generalService.currentBranchUniqueName ?? '';
        return this.http.post(this.config.apiUrl + OCR_VOUCHER_API.GET_ALL_DOCUMENTS
            ?.replace(':page', encodeURIComponent(pagination?.page ?? ''))
            ?.replace(':count', encodeURIComponent(pagination?.count ?? ''))
            ?.replace(':from', encodeURIComponent(pagination?.from ?? ''))
            ?.replace(':to', encodeURIComponent(pagination?.to ?? ''))
            ?.replace(':sort', encodeURIComponent(pagination?.sort ?? ''))
            ?.replace(':sortBy', encodeURIComponent(pagination?.sortBy ?? ''))
            ?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName))
            ?.replace(':branchUniqueName', encodeURIComponent(branchUniqueName))
            , model)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    public uploadOcrDocument(fileName: string): Observable<BaseResponse<any, any>> {
        const branchUniqueName = this.generalService.currentBranchUniqueName ?? '';
        return this.http.get(this.config.apiUrl + OCR_VOUCHER_API.UPLOAD_DOCUMENTS
            ?.replace(':fileName', encodeURIComponent(fileName))
            ?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName))
            ?.replace(':branchUniqueName', encodeURIComponent(branchUniqueName))
        )
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    public importOcrDocument(payload: any): Observable<BaseResponse<any, any>> {
        const branchUniqueName = this.generalService.currentBranchUniqueName ?? '';
        return this.http.post(this.config.apiUrl + OCR_VOUCHER_API.IMPORT
            ?.replace(':branchUniqueName', encodeURIComponent(branchUniqueName))
            ?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName))
        , payload)
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    public getCompletedCount(): Observable<BaseResponse<any, any>> {
        const branchUniqueName = this.generalService.currentBranchUniqueName ?? '';
        return this.http.get(this.config.apiUrl + OCR_VOUCHER_API.COMPLETED_COUNT
            ?.replace(':branchUniqueName', encodeURIComponent(branchUniqueName))
            ?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName))
        )
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }

    public getExtractDocuments(req: any): Observable<BaseResponse<any, any>> {
        console.log(req);
        const branchUniqueName = this.generalService.currentBranchUniqueName ?? '';
        return this.http.get(this.config.apiUrl + OCR_VOUCHER_API.EXTRACT_DOCUMENTS
            ?.replace(':branchUniqueName', encodeURIComponent(branchUniqueName))
            ?.replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName))
            ?.replace(':currentToken', encodeURIComponent(req.type === 'skip' ? req.token : ''))
            ?.replace(':nextToken', encodeURIComponent(req.type === 'save' ? req.token : ''))
        )
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '', {}))
            );
    }
}
