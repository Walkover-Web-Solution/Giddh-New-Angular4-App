import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { JobWorkActionRequest, JobWorkListRequest, JobWorkOrderRequest } from '../models/api-models/JobWork';
import { JOB_WORK_API } from './apiurls/job-work.api';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { HttpWrapperService } from './http-wrapper.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable({
    providedIn: 'root'
})
export class JobWorkService {
    constructor(
        private readonly errorHandler: GiddhErrorHandler,
        private readonly http: HttpWrapperService,
        private readonly generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private readonly config: IServiceConfigArgs
    ) {
    }

    /**
     * Appends branchUniqueName when current branch differs from company.
     *
     * @private
     * @param {string} url
     * @returns {string}
     * @memberof JobWorkService
     */
    private withBranch(url: string): string {
        const companyUniqueName = this.generalService.companyUniqueName;
        const branchUniqueName = this.generalService.currentBranchUniqueName;
        if (branchUniqueName && branchUniqueName !== companyUniqueName) {
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}branchUniqueName=${encodeURIComponent(branchUniqueName)}`;
        }
        return url;
    }

    /**
     * Resolves company-scoped job-work URL.
     *
     * @private
     * @param {string} template
     * @param {Record<string, string>} [params]
     * @returns {string}
     * @memberof JobWorkService
     */
    private buildUrl(template: string, params: Record<string, string> = {}): string {
        let url = this.config.apiUrl + template.replace(
            ':companyUniqueName',
            encodeURIComponent(this.generalService.companyUniqueName)
        );
        Object.keys(params).forEach(key => {
            url = url.replace(`:${key}`, encodeURIComponent(params[key] ?? ''));
        });
        return this.withBranch(url);
    }

    /**
     * Creates a job work order.
     *
     * @param {JobWorkOrderRequest} model
     * @returns {Observable<BaseResponse<any, JobWorkOrderRequest>>}
     * @memberof JobWorkService
     */
    public create(model: JobWorkOrderRequest): Observable<BaseResponse<any, JobWorkOrderRequest>> {
        return this.http.post(this.buildUrl(JOB_WORK_API.CREATE), model).pipe(
            map((res) => {
                const data: BaseResponse<any, JobWorkOrderRequest> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, JobWorkOrderRequest>(e, model))
        );
    }

    /**
     * Updates a job work order.
     *
     * @param {string} orderUniqueName
     * @param {JobWorkOrderRequest} model
     * @returns {Observable<BaseResponse<any, JobWorkOrderRequest>>}
     * @memberof JobWorkService
     */
    public update(orderUniqueName: string, model: JobWorkOrderRequest): Observable<BaseResponse<any, JobWorkOrderRequest>> {
        return this.http.put(this.buildUrl(JOB_WORK_API.UPDATE, { orderUniqueName }), model).pipe(
            map((res) => {
                const data: BaseResponse<any, JobWorkOrderRequest> = res;
                data.request = model;
                data.queryString = { orderUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, JobWorkOrderRequest>(e, model))
        );
    }

    /**
     * Gets a job work order by unique name.
     *
     * @param {string} orderUniqueName
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof JobWorkService
     */
    public get(orderUniqueName: string): Observable<BaseResponse<any, string>> {
        return this.http.get(this.buildUrl(JOB_WORK_API.GET, { orderUniqueName })).pipe(
            map((res) => {
                const data: BaseResponse<any, string> = res;
                data.queryString = { orderUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, orderUniqueName))
        );
    }

    /**
     * Lists job work orders for report.
     *
     * @param {JobWorkListRequest} model
     * @returns {Observable<BaseResponse<any, JobWorkListRequest>>}
     * @memberof JobWorkService
     */
    public list(model: JobWorkListRequest): Observable<BaseResponse<any, JobWorkListRequest>> {
        return this.http.post(this.buildUrl(JOB_WORK_API.LIST), model).pipe(
            map((res) => {
                const data: BaseResponse<any, JobWorkListRequest> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, JobWorkListRequest>(e, model))
        );
    }

    /**
     * Gets linked delivery challan for a job work order.
     *
     * @param {string} orderUniqueName
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof JobWorkService
     */
    public getChallan(orderUniqueName: string): Observable<BaseResponse<any, string>> {
        return this.http.get(this.buildUrl(JOB_WORK_API.CHALLAN, { orderUniqueName })).pipe(
            map((res) => {
                const data: BaseResponse<any, string> = res;
                data.queryString = { orderUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, orderUniqueName))
        );
    }

    /**
     * Gets returns for a job work order.
     *
     * @param {string} orderUniqueName
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof JobWorkService
     */
    public getReturns(orderUniqueName: string): Observable<BaseResponse<any, string>> {
        return this.http.get(this.buildUrl(JOB_WORK_API.RETURNS, { orderUniqueName })).pipe(
            map((res) => {
                const data: BaseResponse<any, string> = res;
                data.queryString = { orderUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, orderUniqueName))
        );
    }

    /**
     * Gets version history for a job work order.
     *
     * @param {string} orderUniqueName
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof JobWorkService
     */
    public getVersions(orderUniqueName: string): Observable<BaseResponse<any, string>> {
        return this.http.get(this.buildUrl(JOB_WORK_API.VERSIONS, { orderUniqueName })).pipe(
            map((res) => {
                const data: BaseResponse<any, string> = res;
                data.queryString = { orderUniqueName };
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, string>(e, orderUniqueName))
        );
    }

    /**
     * Runs a job work action (return, scrap, adjust, print, cancel, delete).
     *
     * @param {JobWorkActionRequest} model
     * @returns {Observable<BaseResponse<any, JobWorkActionRequest>>}
     * @memberof JobWorkService
     */
    public action(model: JobWorkActionRequest): Observable<BaseResponse<any, JobWorkActionRequest>> {
        return this.http.post(this.buildUrl(JOB_WORK_API.ACTION), model).pipe(
            map((res) => {
                const data: BaseResponse<any, JobWorkActionRequest> = res;
                data.request = model;
                return data;
            }),
            catchError((e) => this.errorHandler.HandleCatch<any, JobWorkActionRequest>(e, model))
        );
    }
}
