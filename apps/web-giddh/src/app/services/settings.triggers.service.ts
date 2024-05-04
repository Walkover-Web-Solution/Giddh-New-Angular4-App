import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpWrapperService } from './http-wrapper.service';
import { Inject, Injectable, Optional } from '@angular/core';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { TRIGGER_API } from './apiurls/settings.trigger.api';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';

@Injectable()
export class SettingsTriggersService {
    private companyUniqueName: string;

    constructor(private errorHandler: GiddhErrorHandler, private http: HttpWrapperService,
        private generalService: GeneralService, @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
    }

    // GetTriggers
    public GetTriggers(): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + TRIGGER_API.GET?.replace(':companyUniqueName', this.companyUniqueName)).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Create Trigger
     */
    public CreateTrigger(model): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + TRIGGER_API.POST?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * Update Trigger
     */
    public UpdateTrigger(model: any, triggerUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + TRIGGER_API.PUT?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':triggerUniqueName', encodeURIComponent(triggerUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, model)));
    }

    /**
     * Delete Trigger
     */
    public DeleteTrigger(triggerUniqueName: string): Observable<BaseResponse<any, any>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + TRIGGER_API.DELETE?.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))?.replace(':triggerUniqueName', encodeURIComponent(triggerUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, any> = res;
            data.request = triggerUniqueName;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, any>(e, triggerUniqueName)));
    }
}
